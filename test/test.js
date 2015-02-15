var expect = require('chai').expect;

var Knots = require('../index.js');

var modules = {
  async: function(fn) {
    return function() {
      fn();
    };
  },
  Counter: function() {
    var _this = this;
    _this.count = 0;
    _this.increase = function() {
      _this.count++;
    };
    return _this;
  }
};

describe('Knots', function() {

  it('should tie to module', function(done) {
    var knots = new Knots();
    knots.tie('global', function() {
      return [modules.async(done)];
    });
    knots.domReady(function(load) {
      load();
    });
    knots.run(['global', 'template:about', 'component:hovercard']);
  });

  it('should append module containers when same key is used', function() {
    var knots = new Knots();
    var counter = new modules.Counter();
    knots.tie('global', function() {
      return [counter.increase, counter.increase];
    });
    knots.tie('global', function() {
      return [counter.increase];
    });
    knots.domReady(function(load) {
      load();
    });
    knots.run(['global', 'template:about', 'component:hovercard']);
    expect(counter.count).to.equal(3);
  });

  it('should call the module\'s domReady function', function(done) {
    var knots = new Knots();
    knots.tie('component:hovercard', function() {
      return [function() {
        return modules.async(done);
      }];
    });
    knots.domReady(function(load) {
      load();
    });
    knots.run(['global', 'template:about', 'component:hovercard']);
  });

  it('should call back once everything is done', function(done) {
    var knots = new Knots();
    knots.domReady(function(load) {
      load();
    });
    knots.run([], {
      callback: function() {
        done();
      }
    });
  });

  it('should default to window.onload', function() {
    global.window = {
      onload: function() {
      }
    };
    var called = false;

    var knots = new Knots();
    knots.tie('template:about', function() {
      return [function() {
        return function() {
          called = true;
        };
      }];
    });

    knots.run(['global', 'template:about', 'component:hovercard']);
    global.window.onload.call();
    expect(called).to.equal(true);
  });

});
