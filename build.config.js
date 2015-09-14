
var packageJSON = require('./package.json');
var APP_NAME = 'startingstrength'

var config = {

  buildFilesAndDirectoriesToClean: ['build', 'coverage', 'reports'],

  client: {
    baseDirectory: 'src/client',
    sourceFiles:     ['*.js', 
                      '**/*.js',
                      '*.html',
                      '**/*.html',
                      '!*index.html', 
                      '!*.spec.js', 
                      '!**/*.spec.js', 
                      '!gulpfile.js',
                      '!Gruntfile.js'],
    testFiles:       ['*.spec.js', '**/*.spec.js'],
    globals: ['_', 'Rx'],
    buildDirectory:  'build',
    buildImagesDirectory: 'build/images',
    coverageDirectory: 'coverage',
    imageDirectory: 'src/client/images',
    imageFiles: ['src/client/images/*.png', 'src/client/images/*.jpg'],
    sourceIndexFile: 'src/client/index.html',
    buildIndexFile: 'build/index.html',
    combinedBowerAndNPMLibraries: 'build/combinedBowerAndNPMLibraries.js',
    npmClasses: ['node_modules/lodash/index.js', 
    			'node_modules/page/page.js',
    			'bower_components/promise-polyfill/Promise.js',
    			'bower_components/webcomponentsjs/webcomponents.js',
    			'bower_components/web-animations-js/web-animations.min.js'],
    injectorFiles: {
                    'build/index.html': ['src/client/*.js',
                                          'src/client/**/*.js',
                                          'src/client/**/*.css',
                                          'src/client/*.css',
                                          'src/client/*.html',
                                          'src/client/**/*.html',
                                          '!src/client/index.html',
                                          '!src/client/*.spec.js', 
                                          '!src/client/**/*.spec.js', 
                                          '!gulpfile.js']
                    }

  },

  prefixPath: function(listOfFiles, prefix)
  {
    return listOfFiles.map(function(item)
    {
      if(item.charAt(0) != '!')
      {
        return config.client.baseDirectory + '/' + item;
      }
      else
      {
        return item;
      }
    });
  },

  normalizeSourceFiles: function()
  {
    var base = config.client;
    base.sourceFiles = config.prefixPath(base.sourceFiles, base.baseDirectory);
    base.testFiles = config.prefixPath(base.testFiles, base.baseDirectory);
  },

  karma: {
    configFile: 'karma.config.js',
    moduleName: APP_NAME,
    files: ['src/client/*.js',
            'src/client/**/*.js',
            'src/client/*.spec.js', 
            'src/client/**/*.spec.js',
            'src/client/*.html',
            'src/client/**/*.html',
            'src/client/index.html']
  },

  staticServer: {
    file: './src/static/app.js',
    nodemonWatchFiles: ['src/api/**/*.js', 'src/static/**/*.js'],
    port: 8626
  }

  
};

config.normalizeSourceFiles();

module.exports = config;