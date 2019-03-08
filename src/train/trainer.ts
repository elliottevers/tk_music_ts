import {note as n} from "../note/note";
import TreeModel = require("tree-model");
import {parse_matrix, pwindow} from "../scripts/parse_tree";
import {algorithm, train} from "./algorithm";
import {history} from "../history/history";
import {target} from "../target/target";

export namespace trainer {

    import Targetable = train.algorithm.Targetable;
    import HistoryUserInput = history.HistoryUserInput;
    import TargetType = target.TargetType;
    import TargetIterator = target.TargetIterator;

    export class Trainer {

        private window;
        private algorithm;
        private clip_user_input;
        private clip_target;
        private song;
        private segments;
        private messenger;

        private struct;
        private history_user_input;

        private counter_user_input;
        private limit_user_input;
        private limit_input_reached;

        private segment_current;
        private target_current;
        private subtarget_current;

        // private segment_iterator;
        private target_iterator;
        private subtarget_iterator;

        // window is either tree or list
        // mode is either harmonic or melodic
        // algorithm is either detect, predict, parse, or derive
        // history
        constructor(window, user_input_handler, algorithm, clip_user_input, clip_target, song, segments, messenger) {
            this.window = window;
            this.algorithm = algorithm;
            this.clip_user_input = clip_user_input;
            this.clip_target = clip_target;
            this.song = song;
            this.segments = segments;
            this.messenger = messenger;

            this.struct = new StructFactory.get_struct(user_input_handler.mode);
            this.history_user_input = new HistoryUserInput(user_input_handler.mode);

            if (this.algorithm.b_targetable()) {
                this.create_targets()
            }
        }

        // now we can assume we have a list instead of a matrix
        private create_targets() {

            this.clip_target.load_notes_within_markers();

            // let segment_targetable: SegmentTargetable;

            let list_segments_targetable: TargetIterator[] = [];

            for (let segment of this.segments) {
                // need SegmentTargetable -> TargetIterator
                list_segments_targetable.push(
                    this.algorithm.determine_targets(
                        this.clip_target.get_notes(
                            segment.beat_start,
                            0,
                            segment.beat_end,
                            128
                        )
                    )
                )
            }

            this.target_iterator
            // this.segment_iterator
            this.subtarget_iterator
        }

        public clear_window() {
            this.window.clear()
        }

        public render_window() {
            this.window.render()
        }

        public reset_user_input() {
            if ([algorithms.DETECT, algorithms.PREDICT].includes(this.algorithm.name)) {
                this.clip_user_input.set_notes(
                    this.struct.get_notes(
                        // TODO: pass requisite information
                    )
                );
            } else {
                return
            }
        }

        private set_loop() {
            let interval = this.segment_current.get_endpoints_loop();

            this.clip_user_input.set_endpoints_loop(
                interval[0],
                interval[1]
            )
        }

        public resume() {
            // set segment current
            // set target current
            // set subtarget current
            this.algorithm.post_init()
        }

        public pause() {
            this.algorithm.pre_terminate()
        }

        // calls next() under the hood, emits intervals to the UserInputHandler, renders the region of interest to cue user
        public init() {
            this.advance_segment();
            this.algorithm.post_init()
        }

        advance_segment() {
            this.segment_current = this.segment_iterator.next();
            this.target_current = this.target_iterator.next();
            this.subtarget_current = this.subtarget_current.next();

            if (done) {
                this.algorithm.pre_terminate()
            }
        }

        advance_target() {
            this.target_current = this.target_iterator.next()
        }

        advance_subtarget() {
            let val = this.subtarget_iterator.next();
            if (val.done) {
                this.advance_target()
            } else {
                this.subtarget_current = val.value
            }
        }

        accept_input(input_user) {

            this.counter_user_input++;

            if (this.counter_user_input >= this.limit_user_input) {
                this.limit_input_reached = true
            }

            if (this.limit_input_reached) {
                // completely ignore
                return
            }

            let targetable = true; // this.algorithm instanceof Targetable;

            if (!targetable) {
                this.advance_segment();
            }

            if (input_user === this.subtarget_current) {
                this.history_user_input.add_subtarget(input_user);
                this.advance_subtarget();
                this.set_loop();
                // TODO: make sure for detection/prediction we're making "input_user" exactly the same as the "target note", if we're restoring sessions from user input
                // this.window.add(input_user);
                this.struct.add(input_user);
                this.window.render(
                    this.struct
                )
            }
        }
    }
}