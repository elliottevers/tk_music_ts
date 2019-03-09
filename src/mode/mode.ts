export namespace mode {

    let HARMONY = 'harmony';

    let MELODY = 'melody';

    export class Harmonic {
        transform(notes_target) {
            function compare(note_former,note_latter) {
                if (note_former.model.note.beat_start < note_latter.model.note.beat_start)
                    return -1;
                if (note_former.model.note.beat_start > note_latter.model.note.beat_start)
                    return 1;
                return 0;
            }

            notes_target.sort(compare);

            let length_beats = notes_target[notes_target.length - 1].model.note.get_beat_end() - notes_target[0].model.note.beat_start

            let duration_monophonic = length_beats/notes_target.length;

            clip_user_input.set_notes(

            )
        }
        // once a target is issued, take all notes and spread them out equidistantly with no overlap

    }

    export class Melodic {
        // do nothing special
    }
}