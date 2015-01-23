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