"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// import {cli} from "./cli/cli";
var messenger_1 = require("./message/messenger");
var Messenger = messenger_1.message.Messenger;
var env = 'node';
if (env === 'max') {
    post('recompile successful');
    autowatch = 1;
}
// let script: cli.Script;
//
var messenger;
//
// let args: cli.Arg[] = [];
// let options: cli.Option[] = [];
// let flags: cli.Flag[] = [];
//
// let path_interpreter;
// let path_script;
// let run = () => {
//     script = new cli.Script(
//         path_interpreter,
//         path_script,
//         flags,
//         options,
//         args,
//         messenger,
//         true
//     );
//     script.run()
// };
//
// let set_arg = (name_arg, val_arg) => {
//     if (_.contains(args.map((arg) => {return arg.name}), name_arg)) {
//         let arg_existing = args.filter(arg => arg.name === name_arg)[0];
//         arg_existing.set(val_arg);
//     } else {
//         let arg = new cli.Arg(name_arg);
//         arg.set(val_arg);
//         args.push(arg);
//     }
// };
//
// let set_flag = (name_flag, val_flag) => {
//     if (_.contains(flags.map((flag) => {return flag.name}), name_flag)) {
//         let flag_existing = flags.filter(flag => flag.name === name_flag)[0];
//         flag_existing.set(val_flag);
//     } else {
//         let flag = new cli.Flag(name_flag);
//         flag.set(val_flag);
//         flags.push(flag);
//     }
// };
//
// let set_option = (name_opt, val_opt) => {
//     if (_.contains(options.map((opt) => {return opt.name}), name_opt)) {
//         let opt_existing = options.filter(opt => opt.name === name_opt)[0];
//         opt_existing.set(val_opt);
//     } else {
//         let opt = new cli.Option(name_opt);
//         opt.set(val_opt);
//         options.push(opt);
//     }
// };
//
// let set_interpreter = (path) => {
//     path_interpreter = path;
// };
//
// let set_script = (path) => {
//     path_script = path;
// };
var init = function (index) {
    // let init = (id, index) => {
    messenger = new Messenger(env, 0);
    // let name = [id, index, '#0'];
    // let name = [id, index];
    var name = ['position', index];
    var receiver = patcher.newdefault(100, 100, "receive", name.join('.'));
    var outlet = patcher.getnamed("outlet");
    patcher.connect(receiver, 0, outlet, 0);
    // receiver.connect()
    // messenger.message(['script', 'newobject', 'newobj', '@text', name_object])
};
var init_sender = function (name_first, i_first, name_last, i_last) {
    messenger = new Messenger(env, 0);
    // let name = [id, index, '#0'];
    // let name = [id, index];
    // let name = ['position', index];
    var indices = Array.apply(null, { length: i_last - i_first + 1 }).map(Function.call, Number);
    var pixels_init_left = 100;
    var pixels_init_top = 300;
    var router = patcher.newdefault(pixels_init_left, pixels_init_top, "route", [1, 2, 3]);
    var pixels_offset_top = 40;
    var pixels_offset_left = 150;
    var sender;
    for (var _i = 0, indices_1 = indices; _i < indices_1.length; _i++) {
        var index = indices_1[_i];
        var name_1 = ['position', index + 1];
        sender = patcher.newdefault(pixels_init_left + (pixels_offset_left * (index + 1)), pixels_init_top + pixels_offset_top, "send", name_1.join('.'));
        patcher.connect(router, index, sender, 0);
    }
    var inlet = patcher.getnamed('inlet');
    patcher.connect(inlet, 0, router, 0);
};
var test = function () {
    init(1);
    init_sender('first', 1, 'last', 4);
};
// test();
if (typeof Global !== "undefined") {
    Global.init_abstraction = {};
    Global.init_abstraction.init = init;
    Global.init_abstraction.init_sender = init_sender;
}
//# sourceMappingURL=init_abstraction.js.map