import {live} from "../live/live";
import Env = live.Env;
import {message} from "../message/messenger";
import Messenger = message.Messenger;

declare let autowatch: any;
declare function post(message?: any): void;
declare let Global: any;

let env: Env = Env.MAX;

if (env === Env.MAX) {
    post('recompile successful');
    autowatch = 1;
}

let messenger = new Messenger(Env.MAX, 0);

let scaleTypeCurrent, indexScaleCurrent, indexPitchCurrent;

let seconds = [
    [43, 45, 47, 48, 50, 52, 53, 55, 57, 59, 60, 62, 64, 65, 67, 69, 71, 72, 74, 76, 77],
    [43, 45, 47, 48, 50, 52, 54, 55, 57, 59, 60, 62, 64, 66, 67, 69, 71, 72, 74, 76],
    [43, 45, 47, 49, 50, 52, 54, 55, 57, 59, 61, 62, 64, 66, 67, 69, 71, 73, 74, 76],
    [44, 45, 47, 49, 50, 52, 54, 56, 57, 59, 61, 62, 64, 66, 68, 69, 71, 73, 74, 76],
    [44, 45, 47, 49, 51, 52, 54, 56, 57, 59, 61, 63, 64, 66, 68, 69, 71, 73, 75, 76],
    [44, 46, 47, 49, 51, 52, 54, 56, 58, 59, 61, 63, 64, 66, 68, 70, 71, 73, 75, 76],
    [44, 46, 47, 49, 51, 53, 54, 56, 58, 59, 61, 63, 65, 66, 68, 70, 71, 73, 75, 77],
    [44, 46, 48, 49, 51, 53, 54, 56, 58, 60, 61, 63, 65, 66, 68, 70, 72, 73, 75, 77],
    [43, 44, 46, 48, 49, 51, 53, 55, 56, 58, 60, 61, 63, 65, 67, 68, 70, 72, 73, 75, 77],
    [43, 44, 46, 48, 50, 51, 53, 55, 56, 58, 60, 62, 63, 65, 67, 68, 70, 72, 74, 75, 77],
    [43, 45, 46, 48, 50, 51, 53, 55, 57, 58, 60, 62, 63, 65, 67, 69, 70, 72, 74, 75, 77],
    [43, 45, 46, 48, 50, 52, 53, 55, 57, 58, 60, 62, 64, 65, 67, 69, 70, 72, 74, 76, 77],
];

let thirds = [
    [43, 47, 45, 48, 47, 50, 48, 52, 50, 53, 52, 55, 53, 57, 55, 59, 57, 60, 59, 62, 60, 64, 62, 65, 64, 67, 65, 69, 67, 71, 69, 72, 71, 74, 72, 76, 74, 77],
    [43, 47, 45, 48, 47, 50, 48, 52, 50, 54, 52, 55, 54, 57, 55, 59, 57, 60, 59, 62, 60, 64, 62, 66, 64, 67, 66, 69, 67, 71, 69, 72, 71, 74, 72, 76],
    [43, 47, 45, 49, 47, 50, 49, 52, 50, 54, 52, 55, 54, 57, 55, 59, 57, 61, 59, 62, 61, 64, 62, 66, 64, 67, 66, 69, 67, 71, 69, 73, 71, 74, 73, 76],
    [44, 47, 45, 49, 47, 50, 49, 52, 50, 54, 52, 56, 54, 57, 56, 59, 57, 61, 59, 62, 61, 64, 62, 66, 64, 68, 66, 69, 68, 71, 69, 73, 71, 74, 73, 76],
    [44, 47, 45, 49, 47, 51, 49, 52, 51, 54, 52, 56, 54, 57, 56, 59, 57, 61, 59, 63, 61, 64, 63, 66, 64, 68, 66, 69, 68, 71, 69, 73, 71, 75, 73, 76],
    [44, 47, 46, 49, 47, 51, 49, 52, 51, 54, 52, 56, 54, 58, 56, 59, 58, 61, 59, 63, 61, 64, 63, 66, 64, 68, 66, 70, 68, 71, 70, 73, 71, 75, 73, 76],
    [44, 47, 46, 49, 47, 51, 49, 53, 51, 54, 53, 56, 54, 58, 56, 59, 58, 61, 59, 63, 61, 65, 63, 66, 65, 68, 66, 70, 68, 71, 70, 73, 71, 75, 73, 77],
    [44, 48, 46, 49, 48, 51, 49, 53, 51, 54, 53, 56, 54, 58, 56, 60, 58, 61, 60, 63, 61, 65, 63, 66, 65, 68, 66, 70, 68, 72, 70, 73, 72, 75, 73, 77],
    [43, 46, 44, 48, 46, 49, 48, 51, 49, 53, 51, 55, 53, 56, 55, 58, 56, 60, 58, 61, 60, 63, 61, 65, 63, 67, 65, 68, 67, 70, 68, 72, 70, 73, 72, 75, 73, 77],
    [43, 46, 44, 48, 46, 50, 48, 51, 50, 53, 51, 55, 53, 56, 55, 58, 56, 60, 58, 62, 60, 63, 62, 65, 63, 67, 65, 68, 67, 70, 68, 72, 70, 74, 72, 75, 74, 77],
    [43, 46, 45, 48, 46, 50, 48, 51, 50, 53, 51, 55, 53, 57, 55, 58, 57, 60, 58, 62, 60, 63, 62, 65, 63, 67, 65, 69, 67, 70, 69, 72, 70, 74, 72, 75, 74, 77],
    [43, 46, 45, 48, 46, 50, 48, 52, 50, 53, 52, 55, 53, 57, 55, 58, 57, 60, 58, 62, 60, 64, 62, 65, 64, 67, 65, 69, 67, 70, 69, 72, 70, 74, 72, 76, 74, 77],
];

let fourths = [
    [43, 48, 45, 50, 47, 52, 48, 53, 50, 55, 52, 57, 53, 59, 55, 60, 57, 62, 59, 64, 60, 65, 62, 67, 64, 69, 65, 71, 67, 72, 69, 74, 71, 76, 72, 77],
    [43, 48, 45, 50, 47, 52, 48, 54, 50, 55, 52, 57, 54, 59, 55, 60, 57, 62, 59, 64, 60, 66, 62, 67, 64, 69, 66, 71, 67, 72, 69, 74, 71, 76],
    [43, 49, 45, 50, 47, 52, 49, 54, 50, 55, 52, 57, 54, 59, 55, 61, 57, 62, 59, 64, 61, 66, 62, 67, 64, 69, 66, 71, 67, 73, 69, 74, 71, 76],
    [44, 49, 45, 50, 47, 52, 49, 54, 50, 56, 52, 57, 54, 59, 56, 61, 57, 62, 59, 64, 61, 66, 62, 68, 64, 69, 66, 71, 68, 73, 69, 74, 71, 76],
    [44, 49, 45, 51, 47, 52, 49, 54, 51, 56, 52, 57, 54, 59, 56, 61, 57, 63, 59, 64, 61, 66, 63, 68, 64, 69, 66, 71, 68, 73, 69, 75, 71, 76],
    [44, 49, 46, 51, 47, 52, 49, 54, 51, 56, 52, 58, 54, 59, 56, 61, 58, 63, 59, 64, 61, 66, 63, 68, 64, 70, 66, 71, 68, 73, 70, 75, 71, 76],
    [44, 49, 46, 51, 47, 53, 49, 54, 51, 56, 53, 58, 54, 59, 56, 61, 58, 63, 59, 65, 61, 66, 63, 68, 65, 70, 66, 71, 68, 73, 70, 75, 71, 77],
    [44, 49, 46, 51, 48, 53, 49, 54, 51, 56, 53, 58, 54, 60, 56, 61, 58, 63, 60, 65, 61, 66, 63, 68, 65, 70, 66, 72, 68, 73, 70, 75, 72, 77],
    [43, 48, 44, 49, 46, 51, 48, 53, 49, 55, 51, 56, 53, 58, 55, 60, 56, 61, 58, 63, 60, 65, 61, 67, 63, 68, 65, 70, 67, 72, 68, 73, 70, 75, 72, 77],
    [43, 48, 44, 50, 46, 51, 48, 53, 50, 55, 51, 56, 53, 58, 55, 60, 56, 62, 58, 63, 60, 65, 62, 67, 63, 68, 65, 70, 67, 72, 68, 74, 70, 75, 72, 77],
    [43, 48, 45, 50, 46, 51, 48, 53, 50, 55, 51, 57, 53, 58, 55, 60, 57, 62, 58, 63, 60, 65, 62, 67, 63, 69, 65, 70, 67, 72, 69, 74, 70, 75, 72, 77],
    [43, 48, 45, 50, 46, 52, 48, 53, 50, 55, 52, 57, 53, 58, 55, 60, 57, 62, 58, 64, 60, 65, 62, 67, 64, 69, 65, 70, 67, 72, 69, 74, 70, 76, 72, 77],
];

let mod_safe = (divisor, dividend) => {
    return ((divisor % dividend) + dividend) % dividend;
};

let nextPitch = () => {
    messenger.message([
        scaleTypeCurrent[mod_safe(indexScaleCurrent, 12)][mod_safe(indexPitchCurrent, scaleTypeCurrent[mod_safe(indexScaleCurrent, 12)].length)]
    ]);
    indexPitchCurrent += 1;
};

let right = () => {
    indexScaleCurrent = mod_safe((indexScaleCurrent + 1), 12)
};

let left = () => {
    indexScaleCurrent = mod_safe((indexScaleCurrent - 1), 12)
};

let setScale = (choice) => {
    if (choice == 2) {
        scaleTypeCurrent = seconds;
        indexScaleCurrent = 0;
        indexPitchCurrent = 0;
    } else if (choice == 3) {
        scaleTypeCurrent = thirds;
        indexScaleCurrent = 0;
        indexPitchCurrent = 0;
    } else if (choice == 4) {
        scaleTypeCurrent = fourths;
        indexScaleCurrent = 0;
        indexPitchCurrent = 0;
    } else {
        throw 'not a valid scale choice'
    }
};

if (typeof Global !== "undefined") {
    Global.scale_cycler = {};
    Global.scale_cycler.right = right;
    Global.scale_cycler.left = left;
    Global.scale_cycler.setScale = setScale;
    Global.scale_cycler.nextPitch = nextPitch;
}
