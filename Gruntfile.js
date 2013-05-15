module.exports = function(grunt) {

    var requirejsOpt = function () {
        return {
            baseUrl: 'client',
            paths: {
                'angular': 'js/lib/angular',
                'main': 'js/main',
                'project-text': 'js/lib/require-text',
                'require-lib': 'js/lib/require'
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
                    paths: ['server/less'],
                    yuicompress: true
                },
                files: {
                    'dist/<%= pkg.name %>-<%= pkg.version %>.min.css': 'server/less/main.less'
                }
            },
            beautify: {
                options: {
                    paths: ['server/less'],
                    compress: false,
                    yuicompress: false
                },
                files: {
                    'dist/<%= pkg.name %>-<%= pkg.version %>.css': 'server/less/main.less'
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
                    'dist/index.html': 'server/haml/index.haml'
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
                    { src: ['./client/**'], dest: '.' },
                    { src: ['./server/**'], dest: '.' },
                    { src: ['./test/**'], dest: '.' },
                    { src: ['./Gruntfile.js'], dest: '.' },
                    { src: ['./package.json'], dest: '.' },
                    { src: ['./start.js'], dest: '.' }
                ]
            }
        }
    });

    grunt.loadNpmTasks('grunt-requirejs');
    grunt.loadNpmTasks('grunt-contrib-less');
    grunt.loadNpmTasks('grunt-karma');
    grunt.loadNpmTasks('grunt-contrib-jade');
    grunt.loadNpmTasks('grunt-contrib-compress');

    grunt.registerTask('build', ['requirejs:uglify', 'requirejs:beautify', 'less:uglify', 'less:beautify', 'jade:index']);
    grunt.registerTask('test', ['karma:unit']);
    grunt.registerTask('test-build', ['test', 'build']);
    grunt.registerTask('zip', ['compress:project']);
    grunt.registerTask('default', ['test-build']);

};