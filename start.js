GLOBAL.basedir = __dirname;

require(GLOBAL.basedir + '/app/scripts/server/deps').emitter.on('done', function () {
    var fs = require('fs'),
        pkg = JSON.parse(fs.readFileSync(GLOBAL.basedir + '/package.json', 'utf8'));

    GLOBAL.dev = false;
    GLOBAL.http = { port: 5000 };
    GLOBAL.project = { name: pkg.name, version: pkg.version };
    GLOBAL.logger = GLOBAL.basedir + '/app/scripts/server/logger';

    var logger = require(GLOBAL.logger);

    process.argv.forEach(function (val, index, array) {
        if (val === 'dev') {
            logger.log('Dev mode');
            GLOBAL.dev = true;
            return;
        }
    });

    require(GLOBAL.basedir + '/app/scripts/server/server');

    logger.log('NodeJS app started in ' + (GLOBAL.dev ? 'Dev' : 'Production') + ' mode');
});
