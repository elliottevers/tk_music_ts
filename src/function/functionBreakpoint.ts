const _ = require('underscore');

const max_api = require('max-api');

export namespace functionBreakpoint {

    export class FunctionBreakpoint<T> {

        public breakpoints: Array<[T, number]>;

        constructor() {

        }

        addBreakpoint(x: T, y: number): void {
            this.breakpoints.concat([x, y]);
            max_api.outlet('functionBreakpoint', 'list', String(x), String(y));
        }

        public static dump(): void {
            max_api.outlet('functionBreakpoint', 'listdump');
        }
    }
}