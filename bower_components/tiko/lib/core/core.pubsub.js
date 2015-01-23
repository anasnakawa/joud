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