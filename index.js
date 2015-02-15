var _ = {
  uniq: require('lodash/array/uniq'),
  map: require('lodash/collection/map'),
  flatten: require('lodash/array/flatten')
};

module.exports = Knots;

function Knots() {

  var _this = this;

  this.ties = {};

  this.tie = function(key, moduleContainer) {
    var tie;

    if (_this.ties.hasOwnProperty(key)) {
      _this.ties[key].push(moduleContainer);
      return _this;
    }

    _this.ties[key] = [moduleContainer];
    return _this;
  };

  var domReady = function(load) {
    window.onload = function() {
      load();
    };
  };

  this.domReady = function(af) {
    domReady = af;
  };

  this.run = function(keys, options) {

    var selectedModules = [];
    var domReadyModules = [];

    options = (options === undefined) ? {} : options;
    keys = _.uniq(keys);

    for (var r = 0; r < keys.length; r++) {
      if (_this.ties.hasOwnProperty(keys[r])) {
        selectedModules = selectedModules.concat(_.flatten(_.map(_this.ties[keys[r]], function(e) {return e.call();})));
      }
    }

    console.log('Knots: of', keys, ' Using: ', selectedModules);
    for (var s = 0; s < selectedModules.length; s++) {
      var moduleOutput = selectedModules[s].call({}, _this.events);
      if (moduleOutput && moduleOutput.call && moduleOutput.apply) {
        domReadyModules.push(moduleOutput);
      }
    }

    domReady(function() {
      for (var s = 0; s < domReadyModules.length; s++) {
        domReadyModules[s].call({});
      }
      if (options.hasOwnProperty('callback')) {
        options.callback();
      }
    });
  };

  return this;
}
