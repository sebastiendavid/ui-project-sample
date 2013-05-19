module.exports = function(grunt) {

    var requirejsOpt = function () {
        return {
            baseUrl: 'app',
            paths: {
                'angular': 'bower_components/angular/angular.min',
                'main': 'scripts/client/main',
                'project-text': 'bower_components/requirejs-text/text',
                'require-lib': 'bower_components/requirejs/require'
            },
            shim: {
                main: {deps: ['require-lib', 'angular']},
                angular: {deps: ['require-lib']}
            },
            include: ['require-lib', 'angular'],
            name: 'main',
            out: 'dist/<%= pkg.name %>-<%= pkg.version %>.min.js',
            wrap: {
                start: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'
            },
            'stubModules': ['project-text'],
            'inlineText': true,
            'skipModuleInsertion': false,
            'optimizeCss': 'none',
            'optimize': 'uglify2',
            'uglify2': {},
            'findNestedDependencies': true,
            'optimizeAllPluginResources': true,
            'preserveLicenseComments': false
        };
    };

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        requirejs: {
            uglify: {
                options: requirejsOpt()
            },
            beautify: {
                options: (function () {
                    var opt = requirejsOpt();
                    opt.uglify2 = {
                        output: {
                            beautify: true
                        },
                        compress: {
                            sequences: false,
                            global_defs: {
                                DEBUG: false
                            }
                        },
                        warnings: true,
                        mangle: false
                    };
                    opt.out = 'dist/<%= pkg.name %>-<%= pkg.version %>.js';
                    return opt;
                })()
            }
        },

        less: {
            uglify: {
                options: {
                    paths: ['app'],
                    yuicompress: true
                },
                files: {
                    'dist/<%= pkg.name %>-<%= pkg.version %>.min.css': 'app/styles/main.less'
                }
            },
            beautify: {
                options: {
                    paths: ['app'],
                    compress: false,
                    yuicompress: false
                },
                files: {
                    'dist/<%= pkg.name %>-<%= pkg.version %>.css': 'app/styles/main.less'
                }
            }
        },

        karma: {
            unit: {
                configFile: 'test/karma.conf.js',
                singleRun: true,
                browsers: ['PhantomJS']
            }
        },

        jade: {
            index: {
                options: {
                    pretty: false,
                    data: {
                        name: '<%= pkg.name %>',
                        version: '<%= pkg.version %>',
                        beautify: false
                    }
                },
                files: {
                    'dist/index.html': 'app/views/index.jade'
                }
            }
        },

        compress: {
            project: {
                options: {
                    archive: 'project.zip',
                    mode: 'zip'
                },
                files: [
                    { src: ['./app/scripts/**'], dest: '.' },
                    { src: ['./app/styles/**'], dest: '.' },
                    { src: ['./app/views/**'], dest: '.' },
                    { src: ['./test/**'], dest: '.' },
                    { src: ['./package.json'], dest: '.' },
                    { src: ['./bower.json'], dest: '.' },
                    { src: ['./Gruntfile.js'], dest: '.' },
                    { src: ['./start.js'], dest: '.' },
                    { src: ['./.bowerrc'], dest: '.' },
                    { src: ['./.gitignore'], dest: '.' }
                ]
            }
        },

        bower: {}
    });

    grunt.registerTask('prepare-less', 'Convert CSS files to LESS files', function () {
        var paths = grunt.file.expand('app/bower_components/**/*.css'), i = 0, length = paths.length;
        grunt.log.ok(length + ' css files found');
        for (; i < length; i++) {
            try {
                var path = paths[i],
                destpath = path.substring(0, path.length - 3) + 'less';
                grunt.file.copy(path, destpath);
                grunt.log.ok(path + ' > ' + destpath);
            } catch (err) {
                cgrunt.log.error('cannot copy CSS file to LESS file: ' + path);
            }
        }
    });

    grunt.loadNpmTasks('grunt-requirejs');
    grunt.loadNpmTasks('grunt-contrib-less');
    grunt.loadNpmTasks('grunt-karma');
    grunt.loadNpmTasks('grunt-contrib-jade');
    grunt.loadNpmTasks('grunt-contrib-compress');

    grunt.registerTask('build', ['requirejs:uglify', 'requirejs:beautify', 'prepare-less', 'less:uglify', 'less:beautify', 'jade:index']);
    grunt.registerTask('test', ['karma:unit']);
    grunt.registerTask('test-build', ['test', 'build']);
    grunt.registerTask('zip', ['compress:project']);

    grunt.registerTask('default', ['test-build']);

};