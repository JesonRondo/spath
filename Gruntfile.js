__ = {};
__.s = {
  LIB: '../../../lib',
  COMPONENT: '../../../component'
};

module.exports = function(grunt) {

  grunt.initConfig({
    watch: {
      'all': {
        files: ['./app/**/*.tpl', './app/**/*.js', './app/**/*.less'],
        options: {
          livereload: true
        }
      }
    },

    copy: {
      'lib': {
        files: [{
          expand: true,
          src: ['lib/**/*.js'],
          dest: 'static/'
        }]
      },
      'component': {
        files: [{
          expand: true,
          src: ['component/**/*.js'],
          dest: 'static/'
        }]
      },
    },

    less: {
      'lib': {
        files: [{
          expand: true,
          src: ['lib/**/*.less'],
          dest: 'static/',
          ext: '.css'
        }]
      },
      'component': {
        files: [{
          expand: true,
          src: ['component/**/*.less'],
          dest: 'static/',
          ext: '.css'
        }]
      },
      'www.demo.com': {
        files: [{
          expand: true,
          cwd: 'app/www.demo.com/template',
          src: ['**/*.less'],
          dest: 'static/d/',
          ext: '.css'
        }]
      }
    },

    requirejs: {
      'www.demo.com': {
        options: {
          baseUrl: 'app/www.demo.com/template',
          mainConfigFile: 'app/www.demo.com/template/home/script/require.config.js',
          optimize: 'none',
          name: 'home/home',
          out: 'static/d/home/home.js'
        }
      }
    },

    cachebuster: {
      'lib': {
        options: {
          format: 'json',
          basedir: 'static/lib/'
        },
        src: [
          'static/lib/jquery/jquery-1.11.1.js',
          'static/lib/jquery/jquery-2.1.1.js'
        ],
        dest: 'config/static/lib.json'
      }
    },

  });

  grunt.loadNpmTasks('grunt-livereload');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-less');
  grunt.loadNpmTasks('grunt-contrib-requirejs');
  grunt.loadNpmTasks('grunt-cachebuster');

  grunt.registerTask('live', ['watch']);
  grunt.registerTask('deploy_lib', ['copy:lib', 'less:lib', 'cachebuster:lib']);
  grunt.registerTask('deploy_component', ['copy:component', 'less:component']);
  grunt.registerTask('deploy_www.demo.com', ['requirejs:www.demo.com', 'less:www.demo.com']);
  grunt.registerTask('deploy', [
    'deploy_lib',
    'deploy_component',
    'deploy_www.demo.com'
  ]);

};