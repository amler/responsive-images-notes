module.exports = function(grunt) {
	
	// init
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		copy: {
			html: {
				options: {
					flatten: true
				},
				files: {
					'build/index.html': 'index.html'
				}
			},
			images: {
				expand: true,
				cwd: 'assets/img',
				src: '**',
				dest: 'build/assets/img',
				filter: 'isFile'
			},
			libraries: {
				expand: true,
				cwd: 'assets/js/libraries',
				src: '**',
				dest: 'build/assets/js',
				filter: 'isFile'
			},
		},
		jshint: {
			options: {
				// reporter: require('jshint-stylish'),
				browser: true,
				globals: {
					jQuery: true
				}
			},
			all: [
				'Gruntfile.js',
				'assets/js/*.js'
			]
		},
		sass: {
			dist: {
				options: {
					style: 'compressed'
				},
				files: {
					'assets/css/screen.css': 'assets/scss/screen.scss'
				}
			}
		},
		uglify: {
			dist: {
				files: {
					'build/assets/js/main.js': [
						'assets/js/modules/*.js',
						'assets/js/main.js'
					]
				}
			}
		},
		watch: {
			options: {
				livereload: true
			},
			css: {
				files: [
					'assets/scss/*.scss',
					'assets/scss/**/*.scss'
				],
				tasks: ['sass']
			},
			html: {
				files: [
					'index.html'
				],
				tasks: ['copy:html']
			},
			js: {
				files: [
					'assets/js/main.js',
					'Gruntfile.js'
				],
				tasks: ['jshint']
			}
		},
		connect: {
			server: {
				options: {
					hostname: 'localhost',
					port: 9000,
					livereload: true
				}
			}
		}
	});

	grunt.task.registerTask('setup', 'Refreshes build directory for a new build process.', function() {
		grunt.file.delete('build');
		grunt.file.mkdir('build');
	});

	grunt.loadNpmTasks('grunt-contrib-connect');
	grunt.loadNpmTasks('grunt-contrib-copy');
	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-contrib-sass');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-watch');

	grunt.registerTask('javascript', ['jshint', 'uglify']);
	grunt.registerTask('default', ['connect', 'watch', 'jshint', 'sass']);
	grunt.registerTask('build', ['setup', 'javascript', 'sass', 'copy']);
};