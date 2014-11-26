'use strict';

module.exports = function(grunt) {

  var path = require('path');

  var taskDomain = function(domain, taskConfig) {
    var builtPath = 'built/' + taskConfig.distPath;

    // less
    grunt.config.data['less'][domain] = {};
    grunt.config.data['less'][domain]['files'] = [];

    if (taskConfig.less && taskConfig.less.length > 0) {
      var lessFileConfig = {
        expand: true,
        cwd: taskConfig.baseUrl,
        src: [],
        dest: builtPath,
        ext: '.css'
      };

      taskConfig.less.forEach(function(item) {
        lessFileConfig.src.push(item + '.less');
      });

      grunt.config.data['less'][domain]['files'].push(lessFileConfig);
    }

    // js require
    var require_tasks = [];
    if (taskConfig.script && taskConfig.script.require && taskConfig.script.require.length > 0) {
      var require_configs = taskConfig.script.require, c = 0;

      require_configs.forEach(function(item) {
        c++;

        var c_config = item.config ? taskConfig.baseUrl + '/' + item.config : '',
          f = 0;

        item.files.forEach(function(file) {
          f++;

          var rc = {
            options: {
              baseUrl: taskConfig.baseUrl,
              optimize: 'none',
              name: file,
              out: builtPath + '/' + file + '.js'
            }
          };

          if (c_config) {
            rc['options']['mainConfigFile'] = c_config;
          }

          var task_name = domain + '_c' + c + '_f' + f;

          require_tasks.push('requirejs:' + task_name);
          grunt.config.data['requirejs'][task_name] = rc;
        });

      });
    }

    // js normal
    grunt.config.data['copy'][domain + '_built'] = {};
    grunt.config.data['copy'][domain + '_built']['files'] = [];
    if (taskConfig.script && taskConfig.script.normal && taskConfig.script.normal.length > 0) {
      var normalScriptConfig = {
        expand: true,
        cwd: taskConfig.baseUrl,
        src: [],
        dest: builtPath
      };

      taskConfig.script.normal.forEach(function(item) {
        normalScriptConfig.src.push(item + '.js');
      });

      grunt.config.data['copy'][domain + '_built']['files'].push(normalScriptConfig);
    }

    // cachebuster
    grunt.config.data['cachebuster'][domain] = {
      options: {
        format: 'json',
        basedir: builtPath,
        length: 8
      },
      src: [
        builtPath + '/**/*.js',
        builtPath + '/**/*.css'
      ],
      dest: taskConfig.baseUrl + '/' + taskConfig.staticConfigPath
    };

    // cope pager
    grunt.config.data['copy'][domain] = {
      files: [{
        expand: true,
        cwd: builtPath,
        src: ['**/*.js', '**/*.css'],
        dest: taskConfig.distPath
      }]
    };

    var tasks = [];

    tasks.push('clean:built');
    tasks = tasks.concat(require_tasks);
    tasks.push('copy:' + domain + '_built');
    tasks.push('less:' + domain);
    tasks.push('cachebuster:' + domain);
    tasks.push('copy:' + domain);
    tasks.push('clean:built');

    grunt.task.run(tasks);
  };

  

  grunt.registerMultiTask('pager', 'pager level compress.', function() {
    var options = this.options({
      config: 'config/bo.json'
    });

    var bo = grunt.file.readJSON(options.config);

    for (var k in bo) {
      taskDomain(k, bo[k]);
    }

  });

};