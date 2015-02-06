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
			js: {
				expand: true,
				cwd: 'assets/js/',
				src: '**',
				dest: 'build/assets/js',
				filter: 'isFile'
			},
		},
		jshint: {
			options: {
				// reporter: require('jshint-stylish'),
				browser: true,
			},
			all: [
				'Gruntfile.js'
			]
		},
		sass: {
			dist: {
				options: {
					style: 'expanded'
				},
				files: {
					'assets/css/screen.css': 'assets/scss/screen.scss'
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
					// 'mobify.html'
				],
			},
			js: {
				files: ['Gruntfile.js'],
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
	grunt.loadNpmTasks('grunt-contrib-watch');

	grunt.registerTask('default', ['connect', 'watch']);
	grunt.registerTask('build', ['setup', 'sass', 'copy']);
};