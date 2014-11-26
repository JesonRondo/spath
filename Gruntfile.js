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

    clean: {
      'built': ['built']
    },

    copy: {
      'lib_built': {
        files: [{
          expand: true,
          src: ['lib/**/*.js'],
          dest: 'built/static/'
        }]
      },
      'lib': {
        files: [{
          expand: true,
          cwd: 'built/static/',
          src: ['lib/**/*.js', 'lib/**/*.css'],
          dest: 'static/'
        }]
      },
      'component_built': {
        files: [{
          expand: true,
          src: ['component/**/*.js'],
          dest: 'built/static/'
        }]
      },
      'component': {
        files: [{
          expand: true,
          cwd: 'built/static/',
          src: ['component/**/*.js', 'component/**/*.css'],
          dest: 'static/'
        }]
      },
    },

    less: {
      'lib_built': {
        files: [{
          expand: true,
          src: ['lib/**/*.less'],
          dest: 'built/static/',
          ext: '.css'
        }]
      },
      'component_built': {
        files: [{
          expand: true,
          src: ['component/**/*.less'],
          dest: 'built/static/',
          ext: '.css'
        }]
      },
    },

    requirejs: {},

    cachebuster: {
      'lib': {
        options: {
          format: 'json',
          basedir: 'built/static/lib/',
          length: 8
        },
        src: [
          'built/static/lib/**/*.js',
          'built/static/lib/**/*.css'
        ],
        dest: 'config/static/lib.json'
      },
      'component': {
        options: {
          format: 'json',
          basedir: 'built/static/component/',
          length: 8
        },
        src: [
          'built/static/component/**/*.js',
          'built/static/component/**/*.css'
        ],
        dest: 'config/static/component.json'
      }
    },

    pager: {
      'custom': {
        options: {
          config: 'config/bo.json'
        }
      }
    },

  });

  grunt.loadNpmTasks('grunt-livereload');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-less');
  grunt.loadNpmTasks('grunt-contrib-requirejs');
  grunt.loadTasks('./compress/cachebuster');
  grunt.loadTasks('./compress/compress-pager');

  grunt.registerTask('live', ['watch']);
  grunt.registerTask('deploy_lib', [
    'clean:built',
    'copy:lib_built', 'less:lib_built', 'cachebuster:lib',
    'copy:lib', 'clean:built'
  ]);
  grunt.registerTask('deploy_component', [
    'clean:built',
    'copy:component_built', 'less:component_built', 'cachebuster:component',
    'copy:component', 'clean:built'
  ]);
  grunt.registerTask('deploy_pager', ['pager:custom']);
  grunt.registerTask('deploy', [
    'deploy_lib',
    'deploy_component',
    'deploy_pager'
  ]);

};