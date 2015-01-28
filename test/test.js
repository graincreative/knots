var expect = require('chai').expect;

var Knots = require('../index.js');
var Tie = require('../tie.js');

var modules = {
	impossible: function(){
		throw Error;
	},
	async: function(fn){
		return function(){
			fn();
		}
	},
	Counter: function(){
		var self = this;
		self.count = 0;
		self.increase = function(){
			self.count++;
		};
		return self;
	},
	empty: function(){}

};

describe('Tie', function(){
	describe('#to', function(){
		it('should return Tie', function(){
			expect(new Tie('global').to(module.empty)).to.be.instanceof(Tie);
		});

		it('should add a single module', function(){
			var tie = new Tie('*').to(module.empty);
			expect(tie.modules).to.deep.equal([module.empty]);
		});

		it('should add a multiple modules', function(){
			var tie = new Tie('*').to([module.empty, module.empty, module.empty]);
			expect(tie.modules).to.deep.equal([module.empty, module.empty, module.empty]);
		});

	});

});

describe('Knots', function(){

	describe('intergrations', function(){
		it('should tie to module', function(done){
			var knots = new Knots();
			knots.tie('global').to(modules.async(done));
			knots.domReady(function(load){load();});
			knots.run(['global', 'template:about', 'component:hovercard']);
		});

		it('should return current tie if key exists', function(){
			var knots = new Knots();
			var globalTie = knots.tie('global').to(modules.empty);
			expect(knots.tie('global')).to.equal(globalTie);
		});


		it('should call the module\'s domReady function', function(done){
			var knots = new Knots();
			knots.tie('component:hovercard').to(function(){return modules.async(done)});
			knots.domReady(function(load){load();});
			knots.run(['global', 'template:about', 'component:hovercard']);
		});

		it('should call back once everything is done', function(done){
			var knots = new Knots();
			knots.domReady(function(load){load();});
			knots.run([], {callback: function(){
				done();
			}});
		});
		
		it('should default to window.onload', function(){
			var counter = new modules.Counter();
			global.window = {
				onload: function(){}
			};
			var called = false;

			var knots = new Knots();
			knots.tie('template:about').to(function(){return function(){called = true;}});
			knots.tie('component:hovercard').to(counter.increase);
			knots.run(['global', 'template:about', 'component:hovercard']);
			global.window.onload.call();
			expect(called).to.be.true();
		})
		
	});

});