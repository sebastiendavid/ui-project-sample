'use strict';

var express = require('express'),
    app = express(),
    less = require('less'),
    lessParser = new(less.Parser)({
        paths: [GLOBAL.basedir + '/app'],
        filename: 'style.less'
    }),
    fs = require('fs'),
    logger = require(GLOBAL.logger);

app.configure(function () {
    app.use(express.logger({ format: ':method :url' }));
    app.use(express.errorHandler({ dumpExceptions:true, showStack:true }));
    app.use(express.bodyParser());

    app.set('view engine', 'jade');
    app.engine('jade', require('jade').__express);
    app.locals.pretty = true;

    if (GLOBAL.dev) {
        app.use(express.static(GLOBAL.basedir + '/app'));
        app.use(express.static(GLOBAL.basedir + '/app/scripts/client'));
        app.use(express.static(GLOBAL.basedir + '/app/views'));
        app.use(express.static(GLOBAL.basedir + '/app/bower_components'));

        app.get('/css/main.css', function (req, res) {
            lessParser.parse(fs.readFileSync(GLOBAL.basedir + '/app/styles/main.less', 'utf8'), function(err, tree) {
                res.set('Content-Type', 'text/css');
                if (err) {
                    logger.log('error', 'cannot parse LESS file', err);
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
            console.log(req.query.beautify === 'true');
            res.render(GLOBAL.basedir + '/app/views/index.jade', {
                name: GLOBAL.project.name,
                version: GLOBAL.project.version,
                beautify: req.query.beautify === 'true'
            });
        });
    }

    app.get('/', function (req, res) {
        res.redirect('/index.html');
    });

    app.get('/views/:resource', function (req, res) {
        res.redirect('/' + req.params.resource);
    });

});

require('http').createServer(app).listen(GLOBAL.http.port);

logger.log('info', 'Express server is ready: http://localhost:' + GLOBAL.http.port + '/index.html');
