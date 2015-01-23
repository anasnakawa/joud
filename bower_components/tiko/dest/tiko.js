/*!
 * base.main
 */

(function( tiko, $, ko, underscore ) { 'use strict';

  // encapsulating base libraries
  // for easier access
  tiko.$ = $;
  tiko.ko = ko;
  tiko._ = underscore;

})( this.tiko = this.tiko || {}, jQuery, ko, _ );
/*!
 * core.config
 */

(function( core ) { 'use strict';

  core.config = {};

})( this.tiko.core = this.tiko.core || {} );
/*!
 * core.events
 */

(function( core ) { 'use strict';

  core.events = {};

})( this.tiko.core );
/*!
 * core.util
 */

(function( core, _, $ ) { 'use strict';

  var id = 0

  // type checking
  // -------------
  , isString = _.isString
  , isNumber   = _.isNumber
  , isBoolean  = _.isBoolean
  , isFunction = _.isFunction
  , isArray    = _.isArray
  , isObject   = _.isObject
  , isRegex    = _.isRegExp
  , isElement  = _.isElement
  , isUndef    = 'undefined'
  , isNumeric  = function( n ) {
    return !isNaN( parseFloat( n ) ) && isFinite( n );
  }
  , isHash     = function( o ) {
    // fail fast for falsy/non-object/HTMLElement/window objects
    // also check constructor properties - objects don't have their own constructor,
    // and their constructor does not have its own `isPrototypeOf` function
    if ( !o || typeof o !== 'object' || isElement( o ) || ( typeof window !== 'undefined' && o === window ) ||
       ( o.constructor && ! hasOwn.call( o, 'constructor' ) && ! hasOwn.call( o.constructor.prototype, 'isPrototypeOf' ) ) ) {
      return false;
    }

    // from jQuery source: speed up the test by cycling to the last property,
    // since own properties are iterated over first and therefore the last one will
    // indicate the presence of any prototype properties
    for ( var key in o ){}
    return ( key === undefined || hasOwn.call( o, key ) );
  }

  // other utils
  // -----------
  , defer = function( callback ) {
    setTimeout( callback, 0 );
  }

  , deferException = function( message ) {
    defer(function() {
      throw new Error( message );
    }, 0 );
  }

  // parse a given template and repalce any variables wrapped with brackets '{' & '}' with the
  // corresponding object found in the passed context param
  // 
  // @param {String} template    sting template to be parsed
  // @param {Object} context     object containing variables to inject into the template
  //
  // e.g: parse( 'hello my name is {name}, I am a {title}', { 
  //      name: 'John Doe'
  //      title: function() {
  //          return 'software developer'
  //      }
  // });
  // >> 'hello my name is John Doe, I am a software developer'
  , parse = function(template, context) {
    template = isArray( template ) ? template.join( '' ) : template;
    return template.replace( /{([A-Za-z0-9_$\-]*)}/g, function( token, match ) {
      if( !match in context ) {
        deferException( 'cannot find a variable with the name {match} in template {template}'
          .replace( /{match}/, match )
          .replace( /{template}/, template ) 
        );
      }
      return ( typeof context[match] === 'function' ) ? context[match]() : context[match];
    });
  }

  , getNextID = function( prefix ) {
    if( prefix == null ) {
      return ++id;
    }
    return prefix + ( ++id );
  }

  // basically all underscore methods
  // will be available inside core.util
  core.util = _;

  // those methods will be injected into
  // core.util, in case they already exist
  // they will get overrided ( for example: extend )
  $.extend( core.util, {
    extend: $.extend
    , is: {
        string  : isString
      , number  : isNumber
      , bool    : isBoolean
      , fn      : isFunction
      , array   : isArray
      , object  : isObject
      , regex   : isRegex
      , element : isElement
      , undef   : isUndef
      , hash    : isHash
      , numeric : isNumeric
    }

    , exception: deferException
    , defer: defer
    , id: {
      next: getNextID
    }
  });

  // all is.js methods, will be available
  // as is.not.method, for negating purposes
  core.util.is.not = {};
  // negating all methods
  for( var fn in core.util.is ) {
    // skipping non-functions
    if( core.util.is.hasOwnProperty( fn ) && isFunction( core.util.is[ fn ] ) ) {
      // create closure to keep reference
      (function( fn ) {
        core.util.is.not[ fn ] = function() {
          return !core.util.is[ fn ].apply( this, arguments );
        }        
      })(fn)
    }
  }

})( this.tiko.core, _, jQuery );
/*!
 * core.log
 */

(function( core ) { 'use strict';

  // console shim for old browsers
  // source: https://github.com/h5bp/html5-boilerplate/blob/master/js/plugins.js
  var method
  , noop = function () {}
  , methods = [
    'assert', 'clear', 'count', 'debug', 'dir', 'dirxml', 'error',
    'exception', 'group', 'groupCollapsed', 'groupEnd', 'info', 'log',
    'markTimeline', 'profile', 'profileEnd', 'table', 'time', 'timeEnd',
    'timeStamp', 'trace', 'warn'
  ]
  , length = methods.length
  , console = (window.console = window.console || {})

  while (length--) {
    method = methods[length];

    // Only stub undefined methods.
    if (!console[method]) {
      console[method] = noop;
    }
  }

  function log() {
    console.log.apply( console, arguments );
  }

  function info() {
    console.info.apply( console, arguments );
  }

  function warn() {
    console.warn.apply( console, arguments );
  }

  function error() {
    console.error.apply( console, arguments );
  }

  core.log = log;
  core.info = info;
  core.warn = warn;
  core.error = error;

})( this.tiko.core );
/*!
 * core.pubsub
 */

(function( core ) { 'use strict';

  // PubSub Class
  // 
  // usage:
  // var pubsub = new PubSub();
  // pubsub.subscribe( 'someEvent', function( args ) {
  //  console.log( 'someEvent happened ' );
  // });
  //
  // pubsub.publish( 'someEvent' /*, args */ );
  function PubSub() {
      this.queue = {};
  }

  PubSub.prototype.publish = function(eventName, data) {
      var idx = 0
      , queue = this.queue
      , context
      , intervalId;

      if (queue[eventName]) {
          intervalId = setInterval(function () {
              if (queue[eventName][idx]) {
                  try {
                      context = queue[eventName][idx].context || this;
                      queue[eventName][idx].callback.call(context, data);
                  } catch (e) {
                      // log the message for developers
                      core.log.pubsub('An error occurred in one of the callbacks for the event "' + eventName + '"');
                      core.log.pubsub('The error was: "' + e + '"');
                  }

                  idx += 1;
              } else {
                  clearInterval(intervalId);
              }
          }, 1);
      }
  };

  PubSub.prototype.subscribe = function(eventName, callback, context) {
      var queue = this.queue;

      if (!queue[eventName]) {
          queue[eventName] = [];
      }
      queue[eventName].push({
          callback: callback,
          context: context
      });
  };

  PubSub.prototype.unsubscribe = function(eventName, callback, context) {
      var queue = this.queue;

      if (queue[eventName]) {
          queue[eventName].pop({
              callback: callback,
              context: context
          });
      }
  };

  PubSub.prototype.hasSubscribers = function(eventName) {
      return queue.hasOwnProperty( eventName );
  };

  // exports
  // -------
  core.PubSub = PubSub;
  core.pubsub = new PubSub();

})( this.tiko.core );
/*!
 * core.storage
 */

(function( core ) { 'use strict';


})( this.tiko.core );
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
/*!
 * core.pageBase
 */

(function( core ) { 'use strict';


})( this.tiko.core );
/*!
 * tiko sandbox
 */

(function( tiko ) { 'use strict';

  // util
  tiko.util = tiko.core.util;

  // module system
  tiko.registerModule = tiko.core.registerModule;
  tiko.module = tiko.core.registerModule; // alias

  tiko.modules = tiko.core.modules;
  tiko.startModule = tiko.core.startModule;
  tiko.start = tiko.core.startModule;

  // config
  tiko.config = tiko.core.config;

  // communication
  tiko.PubSub = tiko.core.PubSub;
  tiko.pubsub = tiko.core.pubsub;

  // logging
  tiko.log = tiko.core.log;
  tiko.error = tiko.core.error;
  tiko.info = tiko.core.info;
  tiko.warn = tiko.core.warn;

})( this.tiko );