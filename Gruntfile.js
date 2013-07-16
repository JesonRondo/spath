module.exports = function(grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        uglify: {
            options: {
                banner: '/*! <%= pkg.name %> - v<%= pkg.version %> - ' +
                    'LongZhou <pancnlz@gmail.com> ' +
                    '<%= grunt.template.today("yyyy-mm-dd") %> */\r'
            },
            my_target: {
                files: {
                    'online/js/index.js': ['dev/js/index.js']
                }
            }
        },
        cssmin: {
            minify: {
                expand: true,
                cwd: 'dev/css/',
                src: ['*.css', '!*.min.css'],
                dest: 'online/css/',
                ext: '.css'
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-cssmin');

    grunt.registerTask('default', ['uglify', 'cssmin']);
};
