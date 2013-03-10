define([
    'jquery',
    'jquery.getobject'
], function($) {
    var exports = {};

    exports.comparator = function(path) {
        return function(a, b) {
            a = $.getObject(path, a);
            b = $.getObject(path, b);
            return (a > b) ? 1 : (a < b) ? -1 : 0;
        };
    };

    return exports;
});