
tiko.module( 'page', {
  options: {
    none: 1
  }
  , create: function() {
    this.name = ko.observable( 'joud' );
  }

  , init: function() {}
});

tiko.start( 'page', document.body, { none: 20 });