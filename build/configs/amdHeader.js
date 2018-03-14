module.exports = {

  amdHeader:
  `(function(factory) {
    if (typeof define === \'function\' && define.amd) {
      // AMD. Register as an anonymous module
      define([\'jquery\'], factory);
    } else if (typeof exports === \'object\') {
      // Node/CommonJS
      module.exports = factory(require(\'jquery\'));
    } else {
      // Browser globals
      factory(jQuery);
    }
  }(function($) {`,

};
