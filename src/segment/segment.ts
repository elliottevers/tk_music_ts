import {clip} from "../clip/clip";

// TODO: use namespaces better
export namespace segment {

    import Clip = clip.Clip;

    export class Segment {

        beat_start: number;
        beat_end: number;
        clip: Clip;

        constructor(beat_start: number, beat_end: number, clip: Clip) {
            this.beat_start = beat_start;
            this.beat_end = beat_end;
            this.clip = clip;
        }

        public set_endpoints_loop() {
            this.clip.set_loop_bracket_lower(this.beat_start);
            this.clip.set_clip_endpoint_upper(this.beat_end);
        }

        public get_beat_lower() {
            return this.clip.get_start_marker()
        }

        public get_beat_upper() {
            return this.clip.get_end_marker()
        }
    }

    export class SegmentIterator {
        private segments: Segment[];
        public direction_forward: boolean;
        private i: number;

        constructor(segments: Segment[], direction_forward: boolean) {
            this.segments = segments;
            this.direction_forward = direction_forward;
            this.i = -1;
        }

        // TODO: type declarations
        public next() {
            let value_increment = (this.direction_forward) ? 1 : -1;

            this.i += value_increment;

            if (this.i < 0) {
                throw 'note iterator < 0'
            }

            if (this.i < this.segments.length) {
                return {
                    value: this.segments[this.i],
                    done: false
                }
            } else {
                return {
                    value: null,
                    done: true
                }
            }
        }

        public current() {
            if (this.i > -1) {
                return this.segments[this.i];
            } else {
                return null;
            }
        }
    }
}