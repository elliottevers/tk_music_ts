import {message as m, message} from "../message/messenger";
import Messenger = message.Messenger;
import {live, live as li} from "../live/live";
import {log} from "../log/logger";
import Logger = log.Logger;
import {utils} from "../utils/utils";
import {segment} from "../segment/segment";
import Segment = segment.Segment;
import {song as module_song} from "../song/song";
import SongDao = module_song.SongDao;
import Song = module_song.Song;
import LiveApiJs = live.LiveApiJs;
import {track as module_track} from "../track/track";
import TrackDao = module_track.TrackDao;
import Track = module_track.Track;
import {scene as module_scen} from "../scene/scene";
import Scene = module_scen.Scene;
import {clip_slot as module_clipslot} from "../clip_slot/clip_slot";
import ClipSlot = module_clipslot.ClipSlot;
import {clip} from "../clip/clip";
import ClipDao = clip.ClipDao;
import Clip = clip.Clip;
import ClipSlotDao = module_clipslot.ClipSlotDao;
const _ = require('underscore');

declare let autowatch: any;
declare let inlets: any;
declare let outlets: any;
declare function outlet(n: number, o: any): void;
declare function post(message?: any): void;
declare let Dict: any;

export {}

declare let Global: any;

let env: string = 'max';

if (env === 'max') {
    post('recompile successful');
    autowatch = 1;
}

let messenger = new Messenger(env, 0);

// get the first clip and use its start and end markers to determine the length of the entire song
let get_length_beats = () => {
    let this_device = new LiveApiJs('this_device');

    let track = new Track(
        new TrackDao(
            new LiveApiJs(
                utils.get_path_track_from_path_device(this_device.get_path())
            ),
            messenger
        )
    );

    track.load_clip_slots();

    let clip_slot = track.get_clip_slot_at_index(0);

    clip_slot.load_clip();

    let clip = clip_slot.get_clip();

    return clip.get_end_marker() - clip.get_start_marker()
};

let expand_segments = () => {
    let this_device = new li.LiveApiJs('this_device');

    let track = new Track(
        new TrackDao(
            new LiveApiJs(
                utils.get_path_track_from_path_device(this_device.get_path())
            ),
            messenger
        )
    );

    expand_track(track.get_path())
};

let contract_segments = () => {
    let this_device = new li.LiveApiJs('this_device');

    let track = new Track(
        new TrackDao(
            new LiveApiJs(
                utils.get_path_track_from_path_device(this_device.get_path())
            ),
            messenger
        )
    );

    contract_track(track.get_path())
};

let expand_selected_track = () => {
    expand_track('live_set view selected_track')
};

let contract_selected_track = () => {
    contract_track('live_set view selected_track')
};

// Assumption: all clips on "segment track have same length"

// NB: works without highlighting any tracks
// aggregate all the notes in the track's clips
// delete all the track's clips
// set the notes inside of the single clip
let contract_track = (path_track) => {

    // length of first clip
    let length_beats = get_length_beats();

    let track = new Track(
        new TrackDao(
            new li.LiveApiJs(
                path_track
            ),
            messenger
        )
    );

    // clip_slots and clips
    track.load_clips();

    let notes = track.get_notes();

    track.delete_clips();

    track.create_clip_at_index(0, length_beats);

    let clip_slot = track.get_clip_slot_at_index(0);

    clip_slot.load_clip();

    let clip = clip_slot.get_clip();

    clip.set_notes(notes);

    clip.set_endpoint_markers(0, length_beats);

    clip.set_endpoints_loop(0, length_beats);
};

// TODO: we can't export this, because it could be called from a different track than the one the segments are on...
// NB: assumes the device that calls this is on the track of segments
let get_notes_segments = () => {
    let this_device = new li.LiveApiJs('this_device');

    let track_segments = new Track(
        new TrackDao(
            new LiveApiJs(
                utils.get_path_track_from_path_device(this_device.get_path())
            ),
            messenger
        )
    );

    track_segments.load_clips();

    return track_segments.get_notes();
};

let test = () => {

};

let expand_selected_audio_track = () => {
    expand_track_audio('live_set view selected_track')
};

let contract_selected_audio_track = () => {
    contract_track_audio('live_set view selected_track')
};

// NB: we assume all training data starts on the first beat
let contract_track_audio = (path_track) => {

    let length_beats = get_length_beats();

    let track = new Track(
        new TrackDao(
            new li.LiveApiJs(path_track),
            messenger
        )
    );

    track.load_clips();

    let clip_slots = track.get_clip_slots();

    for (let i_clip_slot_audio in clip_slots) {

        let clip_slot_audio = clip_slots[Number(i_clip_slot_audio)];

        if (Number(i_clip_slot_audio) === 0) {
            clip_slot_audio.clip.set_endpoint_markers(0, length_beats);

            continue
        }

        if (clip_slot_audio.b_has_clip()) {
            clip_slot_audio.delete_clip()
        }
    }
};

let expand_track_audio = (path_track) => {

    let track = new Track(
        new TrackDao(
            new LiveApiJs(
                path_track
            ),
            messenger
        )
    );

    track.load_clip_slots();

    let clip_slot_audio = track.get_clip_slot_at_index(0);

    // TODO: we won't need to do this since we will be creating new ones anyway
    // track.load();

    let notes_segments = get_notes_segments();

    let song = new Song(
        new SongDao(
            new li.LiveApiJs(
                'live_set'
            ),
            new Messenger(env, 0),
            false
        )
    );

    song.load_scenes();

    let clip_first = Track.get_clip_at_index(
        track.get_index(),
        0,
        messenger
    );

    let segment_first = new Segment(notes_segments[0]);

    clip_first.set_endpoints_loop(
        segment_first.beat_start,
        segment_first.beat_end
    );

    clip_first.set_endpoint_markers(
        segment_first.beat_start,
        segment_first.beat_end
    );

    for (let i_clipslot of _.range(1, notes_segments.length)) {
        let note_segment = notes_segments[Number(i_clipslot)];

        let scene = song.get_scene_at_index(Number(i_clipslot));

        let scene_exists = scene !== null;

        if (!scene_exists) {
            song.create_scene_at_index(Number(i_clipslot))
        }

        let clip_slot = Track.get_clip_slot_at_index(
            track.get_index(),
            Number(i_clipslot),
            messenger
        );

        clip_slot.load_clip();

        if (clip_slot.b_has_clip()) {
            clip_slot.delete_clip()
        }

        clip_slot_audio.duplicate_clip_to(clip_slot);

        // TODO: do we need to add this back?
        // clip_slot.create_clip(length_beats);
        //
        clip_slot.load_clip();

        let clip = Track.get_clip_at_index(
            track.get_index(),
            Number(i_clipslot),
            messenger
        );

        let segment = new Segment(note_segment);

        clip.set_endpoints_loop(
            segment.beat_start,
            segment.beat_end
        );

        clip.set_endpoint_markers(
            segment.beat_start,
            segment.beat_end
        );
    }
};

let expand_track = (path_track) => {

    let track = new Track(
        new TrackDao(
            new LiveApiJs(
                path_track
            ),
            messenger
        )
    );

    track.load_clips();

    let clip_slot = track.get_clip_slot_at_index(0);

    clip_slot.load_clip();

    let clip = clip_slot.get_clip();

    let notes_clip = clip.get_notes(
        clip.get_loop_bracket_lower(),
        0,
        clip.get_loop_bracket_upper(),
        128
    );

    let notes_segments = get_notes_segments();

    let logger = new Logger(env);

    logger.log(JSON.stringify(notes_segments));

    let segments: Segment[] = [];

    for (let note of notes_segments) {
        segments.push(
            new Segment(
                note
            )
        )
    }

    let song_read = new Song(
        new SongDao(
            new li.LiveApiJs(
                'live_set'
            ),
            new Messenger(env, 0),
            false
        )
    );

    let length_beats = get_length_beats();

    song_read.load_scenes();

    for (let i_segment in segments) {

        let segment = segments[Number(i_segment)];

        let scene = song_read.get_scene_at_index(Number(i_segment));

        // logger.log(JSON.stringify(i_segment));
        //
        // logger.log(JSON.stringify(scene));

        let scene_exists = scene !== null;

        if (!scene_exists) {
            song_read.create_scene_at_index(Number(i_segment))
        }

        let clip_slot = Track.get_clip_slot_at_index(
            track.get_index(),
            Number(i_segment),
            messenger
        );

        clip_slot.load_clip();

        if (Number(i_segment) === 0) {
            clip_slot.delete_clip()
        }

        clip_slot.create_clip(length_beats);

        clip_slot.load_clip();

        let clip = clip_slot.get_clip();

        clip.set_endpoints_loop(
            segment.get_endpoints_loop()[0],
            segment.get_endpoints_loop()[1]
        );

        clip.set_endpoint_markers(
            segment.get_endpoints_loop()[0],
            segment.get_endpoints_loop()[1]
        );

        let notes_within_segment = notes_clip.filter(
            node => node.model.note.beat_start >= segment.get_endpoints_loop()[0] && node.model.note.get_beat_end() <= segment.get_endpoints_loop()[1]
        );

        clip.set_notes(notes_within_segment)
    }

};

if (typeof Global !== "undefined") {
    Global.segmenter = {};
    Global.segmenter.expand_selected_track = expand_selected_track;
    Global.segmenter.contract_selected_track = contract_selected_track;
    Global.segmenter.contract_segments = contract_segments;
    Global.segmenter.expand_segments = expand_segments;
    Global.segmenter.expand_selected_audio_track = expand_selected_audio_track;
    Global.segmenter.contract_selected_audio_track = contract_selected_audio_track;
    Global.segmenter.test = test;
}
