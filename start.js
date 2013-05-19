'use strict';

GLOBAL.basedir = __dirname;
GLOBAL.dev = false;
var skipdeps = false;

process.argv.forEach(function (val, index, array) {
    if (val === 'dev') {
        GLOBAL.dev = true;
    } else if (val == 'skipdeps') {
        skipdeps = true;
    }
});

var startApp = function () {
    var fs = require('fs'),
        pkg = JSON.parse(fs.readFileSync(GLOBAL.basedir + '/package.json', 'utf8'));

    GLOBAL.http = { port: 5000 };
    GLOBAL.project = { name: pkg.name, version: pkg.version };
    GLOBAL.logger = GLOBAL.basedir + '/app/scripts/server/logger';

    var logger = require(GLOBAL.logger);

    require(GLOBAL.basedir + '/app/scripts/server/server');

    logger.log('NodeJS app started in ' + (GLOBAL.dev ? 'Dev' : 'Production') + ' mode');
};

if (skipdeps === true) {
    startApp();
} else {
    require(GLOBAL.basedir + '/app/scripts/server/deps').check(function () {
        startApp();
    });
}
