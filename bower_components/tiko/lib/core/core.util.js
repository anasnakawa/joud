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