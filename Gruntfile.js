

module.exports = function(grunt)
{
    var Vulcanize 			= require('vulcanize');
	var fs 					= require('fs');
	var Promise          	= require('Bluebird');
	var _ 					= require('lodash');
	var CONFIG 				= require('./build.config.js');
    require('load-grunt-tasks')(grunt);
    var bowerClasses = [];
    bowerClasses = require('wiredep')().js;

    var tasks = {

        // Checks your JavaScript doesn't have common errors defined by the rules in .jshintrc
        jshint: {
            options: {
                force: true,
                jshintrc: '.jshintrc'
            },

            src: CONFIG.client.sourceFiles
        },


        // Cleans up the build folders to have a nice, fresh, new build
        clean: {
            dev: {
                src: CONFIG.buildFilesAndDirectoriesToClean
            }
        },

        // Copies files from development to the build directory
        copy: {

            images: {
            	files: [{
            		src: CONFIG.client.imageFiles,
            		dest: CONFIG.client.buildImagesDirectory,
            		cwd: '.',
            		expand: true,
            		flatten: true
            	}]
            },

            html: {
                files: [{
                        expand: false,
                        cwd: '.',
                        src: CONFIG.client.sourceIndexFile,
                        dest: CONFIG.client.buildIndexFile
                    }]
            }
        },


        injector: {
            
             
             prod: {
             	options: {
	                addRootSlash: false,
	                ignorePath: ['src/client/', 'build/']
	            },
                 dest: 'build/index.html',
                 src: [CONFIG.client.combinedBowerAndNPMLibraries]
             },

             dev: {
             	options: {
	                addRootSlash: false,
	                ignorePath: ['src/client/', 'build/']
	            },
             	dest: 'src/client/index.html',
                 src: CONFIG.client.npmClasses,
                 bower_dependencies: {
			      files: {
			        'src/client/index.html': ['bower.json'],
			      }
			    }
             }
        },

         // Concatenates JavaScript files to reduce HTTP requests
         concat: {
             prod: {
                 cwd: '.',
                 expand: true,
                 files: {
                     'build/combinedBowerAndNPMLibraries.js': bowerClasses.concat(CONFIG.client.npmClasses)
            }
          }
        },

        // Minifies your JavaScript files to save on file size
        uglify: {
            prod: {
                files: {
                    'build/combinedBowerAndNPMLibraries.js': CONFIG.client.combinedBowerAndNPMLibraries
                }
            }
        },

    };

    grunt.initConfig(tasks);

    grunt.registerTask('hello', function()
    {
        console.log('print');
    });
    // ************************************************************
    // ** development tasks **/
    grunt.registerTask('dev', ['injector:dev']);
    grunt.registerTask('stage', ['clean', 'copy', 'jxlVulcan', 'concat', 'injector:prod']);
    grunt.registerTask('prod', ['clean', 'copy', 'jxlVulcan', 'concat', 'uglify', 'injector:prod']);

    // -- helper tasks --/
    grunt.registerTask('jxlVulcan', 'Production Polymer', function()
	{
		var done = this.async();
		// TODO: dynamically read wiredep for excludes
		var vulcan = new Vulcanize({
			abspath: './',
			excludes: bowerClasses.concat(CONFIG.client.npmClasses),
			stripExcludes: [
			],
			inlineScripts: true,
			inlineCss: true,
			implicitStrip: false,
			stripComments: false,
		  	inputUrl: ''
		  });

		var devTag = '<link rel="import" href="app-view.html">';
		var prodTag = '<span></span>';
		var starttag = '<!-- polymer:begininject -->';
		var endtag = '<!-- polymer:endinject -->';
		vulcan.process('src/client/index.html', function(err, inlinedHtml)
		{
			console.log("Vulcanize process complete, injecting...");

			try
			{
				function escapeForRegExp (str) {
					return str.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
				}
				function getInjectorTagsRegExp (starttag, endtag) {
					return new RegExp('([\t ]*)(' + escapeForRegExp(starttag) + ')(\\n|\\r|.)*?(' + escapeForRegExp(endtag) + ')', 'gi');
				}
				var re = getInjectorTagsRegExp(starttag, endtag);
				inlinedHtml = inlinedHtml.replace(re, function (match, indent, starttag, content, endtag) {
					return indent + starttag + prodTag + endtag;
				});
				// fix for image, lol #insanity
				inlinedHtml = inlinedHtml.split('src="/src/client/images/starting-strength.jpg"').join('src="images/starting-strength.jpg"');
				fs.writeFile("./build/index.html", inlinedHtml, function(err)
				{
				    if(err)
				    {
				    	console.error("jxlVulcan done with error:", err);
				        done(err);
				        return;
				    }
				    console.log("jxlVulcan done");
				    done();
				});
			}
			catch(error)
			{
				console.error("jxlVulcan injection error:", error);
				done(error);
			}
		});
	});

};
