module.exports = Tie;

function Tie(){

	var tie = this;
	tie.modules = [];

	tie.to = function(modules){
		if(!Array.isArray(modules)){
			modules = [modules];
		}

		tie.modules = tie.modules.concat(modules);
		return tie;
	};

	return tie;
}