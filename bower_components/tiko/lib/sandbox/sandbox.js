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