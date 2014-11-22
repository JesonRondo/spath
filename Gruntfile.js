module.exports = function(grunt) {

  grunt.initConfig({
    watch: {
      all: {
        files: ['./app/**/*.tpl', './app/**/*.js', './app/**/*.less'],
        options: {
          livereload: true
        }
      }
    }
  });

  grunt.loadNpmTasks('grunt-livereload');
  grunt.loadNpmTasks('grunt-contrib-watch');

  grunt.registerTask('live', ['watch']);

};