var Tie = require('./tie'),
    _ = {
        uniq: require('lodash/array/uniq'),
        map: require('lodash/collection/map'),
    };

module.exports = Knots;

function Knots() {

    var knots = this;

    knots.keys = {};

    knots.tie = function (key) {

        if (knots.keys.hasOwnProperty(key)) {
            return knots.keys[key];
        }

        var tie = new Tie();
        knots.keys[key] = tie;
        return tie;
    };

    var domReady = function (load) {
        window.onload = function () {
            load();
        };
    };

    knots.domReady = function (af) {
        domReady = af;
    };

    knots.run = function (keys, options) {

        var selectedModules = [];
        var domReadyModules = [];

        options = (options === undefined) ? {} : options;
        keys = _.uniq(keys);


        for (var r = 0; r < keys.length; r++) {

            if (knots.keys.hasOwnProperty(keys[r])) {
                selectedModules = selectedModules.concat(knots.keys[keys[r]].modules);
            }
        }


        console.log('Knots: of', keys,  ' Using: ', selectedModules);
        for (var s = 0; s < selectedModules.length; s++) {
            var moduleOutput = selectedModules[s].call({}, knots.events);
            if (moduleOutput && moduleOutput.call && moduleOutput.apply) {
                domReadyModules.push(moduleOutput);
            }
        }

        domReady(function () {
            for (var s = 0; s < domReadyModules.length; s++) {
                domReadyModules[s].call({});
            }
            if (options.hasOwnProperty('callback')) {
                options.callback();
            }

        });

    };

    return knots;
}

