/**
 * compile, concat and minify assets
 */

var _ = require( 'underscore' );
var loadGruntTasks = require( 'load-grunt-tasks' );
var pkg = require( './package.json' );

module.exports = function( grunt ) {

    grunt.initConfig({

        ejs: {
            all: {
                src: [ './ejs/**/*.ejs', '!./ejs/base/**/*.ejs', '!./ejs/partials/**/*.ejs' ]
                , dest: './'
                , expand: true
                , flatten: true 
                , ext: '.html'
                , options: {
                    jsFiles: []
                    , jsFilesBefore: []
                    , cssFiles: []
                }
            }
        }

    })

    require( 'load-grunt-tasks' )( grunt );
}