/*!
 * core.moduleFactory
 */

(function( core ) { 'use strict';

  var ko = core.ko;
  var modules = {}
  var util = core.util;

  function registerModule( moduleName, parent, impl ) {
    if( moduleName in modules ) {
      core.warn( 'attempt to register an already registered module: {moduleName}' );
    }

    // swap arguments
    if( arguments.length == 2 ) {
      impl = parent;
      parent = null;
    }

    if( !( 'create' in impl ) ) {
      return core.error( '{moduleName} does not have implementation for create method' );
    }

    // module instance constructor
    modules[ moduleName ] = function( element, options ) {
      // inheritance setup
      core.moduleBase.prototype.constructor.apply( this, arguments );
      util.each( impl, function( object, key ) {
        if( !!key.match(/^create$|^init$/) ) return;
        this[ key ] = object;
      }, this );      

      this.moduleName = moduleName;
      this.element = element;
      util.extend( this.options, options );
    }

    modules[ moduleName ].prototype.create = function() {
      core.moduleBase.prototype.create.apply( this, arguments );
      impl.create.apply( this, arguments );
    }
  }

  core.modules = modules;
  core.registerModule = registerModule;

})( this.tiko.core );