var winston = require('winston'),
    moment = require('moment');

module.exports = {};

module.exports.log = function () {
    var level, msg, err, output;

    if (arguments.length === 1) {
        level = 'info';
        msg = arguments[0];
    } else if (arguments.length === 2) {
        level = arguments[0];
        msg = arguments[1];
    } else if (arguments.length === 3) {
        level = arguments[0];
        msg = arguments[1];
        err = arguments[2];
    } else {
        return;
    }

    if (level !== 'info' && level !== 'warn' && level !== 'error') {
        level = 'info';
    }

    output = moment().format('MMMM Do YYYY, h:mm:ss a') + ' # ' + msg;

    if (err) {
        output += '\n' + err;
    }

    winston.log(level, output);
};
