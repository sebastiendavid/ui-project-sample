'use strict';

var fs = require('fs'),
    pkg = JSON.parse(fs.readFileSync(GLOBAL.basedir + '/package.json', 'utf8')),
    bwr = JSON.parse(fs.readFileSync(GLOBAL.basedir + '/bower.json', 'utf8')),
    spawn = require('child_process').spawn,
    EventEmitter = require('events').EventEmitter;

module.exports = {};

console.log('checking dependencies');

var i,
hasOwn = Object.prototype.hasOwnProperty,
emitter = new EventEmitter(),

check = function (deps, path) {
    if (deps) {
        for (i in deps) {
            if (!hasOwn.call(deps, i)) {
                if (!fs.existsSync(path + '/' + i)) {
                    console.log('dependency is missing');
                    return false;
                }
            }
        }
    }
    return true;
},

exec = function (bin, args, callback) {
    var child = spawn(bin, args);
    child.stdout.setEncoding('utf8');

    child.stdout.on('data', function (data) {
        console.log(data);
    });

    child.stderr.on('data', function (data) {
        //console.log(data);
    });

    child.on('close', function (code) {
        child.stdin.end();
        child.kill();
        if (callback) {
            callback();
        }
    });

    child.on('error', function () {
        console.log(bin + ' install failed');
        child.kill();
        if (callback) {
            callback();
        }
    });
},

prepareLess = function () {
    if (GLOBAL.dev === true) {
        console.log('prepare less');
        exec('grunt', ['prepare-less'], function () {
            emitter.emit('done');
        });
    } else {
        emitter.emit('done');
    }
},

checkNpm = function () {
    console.log('check npm dependencies');
    var path = GLOBAL.basedir + '/node_modules';
    if (!fs.existsSync(path) || check(pkg.dependencies, path) === false || check(pkg.devDependencies, path) === false) {
        console.log('install npm dependencies');
        exec('npm', ['install'], function () {
            checkBower();
        });
    } else {
        checkBower();
    }
},

checkBower = function () {
    console.log('check bower dependencies');
    var path = GLOBAL.basedir + '/app/bower_components';
    if (!fs.existsSync(path) || check(bwr.dependencies, path) === false || check(bwr.devDependencies, path) === false) {
        console.log('install bower dependencies');
        exec('bower', ['install'], function () {
            prepareLess();
        });
    } else {
        prepareLess();
    }
};

module.exports.check = function (callback) {
    emitter.on('done', function () {
        if (typeof callback === 'function') {
            callback();
        }
    });
    checkNpm(); 
};
