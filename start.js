var fs = require('fs'),
    pkg = JSON.parse(fs.readFileSync(__dirname + '/package.json', 'utf8'));

GLOBAL.basedir = __dirname;
GLOBAL.dev = false;
GLOBAL.http = { port: 5000 };
GLOBAL.project = { name: pkg.name, version: pkg.version };
GLOBAL.logger = GLOBAL.basedir + '/server/js/logger';

var logger = require(GLOBAL.logger);

process.argv.forEach(function (val, index, array) {
    if (val === 'dev') {
        logger.log('Dev mode');
        GLOBAL.dev = true;
        return;
    }
});

require(GLOBAL.basedir + '/server/js/server');

logger.log('NodeJS app started in ' + (GLOBAL.dev ? 'Dev' : 'Production') + ' mode');
