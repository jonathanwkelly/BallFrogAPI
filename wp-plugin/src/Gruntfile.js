module.exports = function(grunt)
{
    'use strict';

    require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);

    grunt.initConfig(
    {
        pkg: grunt.file.readJSON('package.json'),
        concat:
        {
            options:
            {
                sourceMaps: false
            },
            dist:
            {
                src: [
                    '<%= pkg.paths.src.scripts %>moment-2.8.4.js',
                    '<%= pkg.paths.src.scripts %>markup-1.5.21.js',
                    '<%= pkg.paths.src.scripts %>custom.js',
                    '<%= pkg.paths.src.scripts %>lib.ballfrog.js'
                ],
                dest: '<%= pkg.paths.src.scripts %><%= pkg.name %>.concat.js'
            }
        },
        uglify:
        {
            options:
            {
                banner: '/*! <%= pkg.name %> <%= pkg.version %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'
            },
            dist:
            {
                files:
                {
                    '<%= pkg.paths.dest.scripts %><%= pkg.name %>.js': ['<%= pkg.paths.src.scripts %><%= pkg.name %>.concat.js']
                }
            }
        },
        sass:
        {
            dist:
            {
                options:
                {
                    banner: '/*! <%= pkg.name %> <%= pkg.version %> <%= grunt.template.today("yyyy-mm-dd") %> */',
                    sourcemap: 'none',
                    style: 'compressed'
                },
                files:
                {
                    '<%= pkg.paths.dest.css %><%= pkg.name %>.css': '<%= pkg.paths.src.scss %><%= pkg.name %>.scss'
                }
            }
        },
        watch:
        {
            js: {
                files: ['js/lib.ballfrog.js', 'js/custom.js'],
                tasks: ['concat', 'uglify']
            },
            sass: {
                files: ['scss/*.scss'],
                tasks: ['sass']
            }
        }
    });
};
