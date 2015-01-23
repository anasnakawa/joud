/*!
 * core.moduleBase
 */

(function( core ) { 'use strict';

  var util = core.util;

  function startModule( moduleName, element, options ) {

    options = options || {};

    if( util.is.string( element ) ) {
      element = $( element ).get( 0 );
    }    

    if( core.modules[ moduleName ] == null ) {
      core.error( 'could not find a registered module with the name: ' + moduleName );
      return;
    }

    var instance
    , moduleId = util.id.next( moduleName + '_' );

    options.$module = {
      id: moduleId
    };

    try {
      instance = new core.modules[ moduleName ]( element, options );
      $.data( element, 'module', instance );
      ko.$root = ko.$root || {};
      ko.$root[ moduleId ] = instance;
      $( element ).attr( 'data-bind', 'with: $root.{moduleId}'.replace( /{moduleId}/, moduleId ) );
      instance.create();
      ko.applyBindings( ko.$root, element.get ? element.get( 0 ) : element );
      util.is.fn( instance.render ) && instance.render();
    } catch( e ) {
      core.error( e );
    }

    return instance;
  }

  core.startModule = startModule;

})( this.tiko.core );