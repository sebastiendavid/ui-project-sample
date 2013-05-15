var express = require('express'),
    app = express(),
    less = require('less'),
    lessParser = new(less.Parser)({
        paths: [GLOBAL.basedir + '/server/less'],
        filename: 'style.less'
    }),
    fs = require('fs'),
    logger = require(GLOBAL.logger);

app.configure(function () {
    app.use(express.logger({ format: ':method :url' }));
    app.use(express.errorHandler({ dumpExceptions:true, showStack:true }));
    app.use(express.bodyParser());

    app.set('view engine', 'haml');
    app.engine('haml', require('jade').__express);
    app.locals.pretty = true;

    if(GLOBAL.dev) {
        app.use(express.static(GLOBAL.basedir + '/client'));
        app.use(express.static(GLOBAL.basedir + '/client/html'));

        app.get('/css/main.css', function (req, res) {
            lessParser.parse(fs.readFileSync(GLOBAL.basedir + '/server/less/main.less', 'utf8'), function(err, tree) {
                res.set('Content-Type', 'text/css');
                if(err) {
                    console.error(err);
                    res.status(500).send();
                } else {
                    res.send(tree.toCSS({
                        compress: false,
                        yuicompress: false
                    }));
                }
            });
        });
    } else {
        app.use(express.static(GLOBAL.basedir + '/dist'));

        app.get('/index', function (req, res) {
            res.set('Content-Type', 'text/html');
            res.render(GLOBAL.basedir + '/server/haml/index.haml', {
                name: GLOBAL.project.name,
                version: GLOBAL.project.version,
                beautify: req.query.beautify === 'true'
            });
        });
    }

    app.get('/', function (req, res) {
        res.redirect('/index.html');
    });

});

require('http').createServer(app).listen(GLOBAL.http.port);

logger.log('info', 'Express server is ready: http://localhost:' + GLOBAL.http.port + '/index.html');
