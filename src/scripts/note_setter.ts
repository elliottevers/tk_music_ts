import {message} from "../message/messenger";
import Messenger = message.Messenger;
import {live, live as li} from "../live/live";
import {clip} from "../clip/clip";
import Clip = clip.Clip;
import ClipDao = clip.ClipDao;
import {note as n} from "../note/note";
import TreeModel = require("tree-model");
import LiveApiFactory = live.LiveApiFactory;
import TypeIdentifier = live.TypeIdentifier;
import Env = live.Env;

declare let autowatch: any;
declare let inlets: any;
declare let outlets: any;
declare function outlet(n: number, o: any): void;
declare function post(message?: any): void;
declare let Dict: any;

export {}

declare let Global: any;

let env: Env = Env.MAX;

if (env === Env.MAX) {
    post('recompile successful');
    autowatch = 1;
}

let notes: TreeModel.Node<n.Note>[] = [];

let clear_notes = () => {
    notes = []
};

let set_notes = () => {
    let clipslot_highlighted = LiveApiFactory.create(
        Env.MAX,
        'live_set view highlighted_clip_slot',
        TypeIdentifier.PATH
    );


    let clip_highlighted = LiveApiFactory.create(
        Env.MAX,
        'live_set view highlighted_clip_slot clip',
        TypeIdentifier.PATH
    );

    let clip: Clip;

    let clip_exists = Number(clip_highlighted.get_id()) !== 0;

    if (!clip_exists) {
        // TODO: get the beat of end of last note
        clipslot_highlighted.call('create_clip', Number(notes[notes.length - 1].beat_start + notes[notes.length - 1].beats_duration - notes[0].beat_start));

        clip_highlighted = LiveApiFactory.create(
            Env.MAX,
            'live_set view highlighted_clip_slot clip',
            TypeIdentifier.PATH
        )
    }

    clip = new Clip(
        new ClipDao(
            clip_highlighted,
            new Messenger(Env.MAX, 0)
        )
    );

    clip.remove_notes(
        clip.get_start_marker(),
        0,
        clip.get_end_marker(),
        128
    );

    clip.set_notes(notes);
};

let append_note = (pitch, beat_start, beats_duration, velocity, b_muted) => {

    let tree: TreeModel = new TreeModel();

    let note_parsed = tree.parse(
        {
            id: -1, // TODO: hashing scheme for clip id and beat start
            note: new n.Note(
                pitch,
                beat_start,
                beats_duration,
                velocity,
                b_muted
            ),
            children: [

            ]
        }
    );

    notes = notes.concat([note_parsed]);
};

let test = () => {

};

if (typeof Global !== "undefined") {
    Global.note_setter = {};
    Global.note_setter.clear_notes = clear_notes;
    Global.note_setter.append_note = append_note;
    Global.note_setter.set_notes = set_notes;
}
