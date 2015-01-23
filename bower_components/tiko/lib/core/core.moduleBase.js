/*!
 * core.moduleBase
 */

(function( core ) { 'use strict';

  /**
   * locals
   */

  var $ = core.$;
  var util = core.util;


  /**
   * expose `ModuleBase`
   */

  core.moduleBase = ModuleBase;


  /**
   * `ModuleBase` constructor
   *
   * @param {dom} element
   * @param {object} options
   */

  function ModuleBase( element, options ) {
    this.options = options;
    this.element = element;

    core.log( 'ModuleBase constructor' );
  }


  /**
   * `create` observables and model method 
   */

  ModuleBase.prototype.create = function() {
    util.is.fn( this.model ) && this.model.call( this );
  };
  

  /**
   * `render` executed right after apply bindings happens
   */

  ModuleBase.prototype.render = function() {};


  /**
   * `show` module
   */

  ModuleBase.prototype.show = function() {};


  /**
   *  `hide` module
   */

  ModuleBase.prototype.hide = function() {};


  /**
   * `destroy` for clearing the module
   */

  ModuleBase.prototype.destroy = function() {};

})( this.tiko.core );