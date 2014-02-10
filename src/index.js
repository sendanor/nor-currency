
/* Save currency conversions between JSON and JavaScript calculations */

var debug = require('nor-debug');
var currency = module.exports = {};

/** Parse integers */
function do_parse_int(x) {
	debug.assert(x).is('string').is('integer');
	return parseInt(x, 10);
}

/** Parse `x` into number presentation that can be calculated
 * @param x {string} The amount in string format
 * @returns {number} The amount in full cents
 */
currency.parse = function(x) {

	function from_string(x) {

		debug.assert(x).is('string').pattern(/^[0-9]+\.[0-9]{2}$/);
		
		var parts = x.split('.');
		if(parts.length === 0) { throw new TypeError("Too few input"); }
		if(parts.length >= 3) { throw new TypeError("Too much input"); }
	
		var euros = parts.shift();
		var cents = parts.shift();
	
		euros = do_parse_int( euros );
		cents = do_parse_int( cents );
	
		debug.assert(euros).is('number');
		debug.assert(cents).is('number');
	
		var result = euros * 100 + cents;
		debug.assert(result).is('number').is('integer');
		return result;
	}

	function from_number(x) {
		debug.assert(x).is('number').is('integer');
		return x;
	}

	return (typeof x === 'string') ? from_string(x) : from_number(x);
};

/** Stringify `x` into string presentation
 * @param x {number} The amount in full cents
 * @returns {string} The amount in string format
 */
currency.stringify = function(x) {

	function do_padding(s) {
		debug.assert(s).is('string');
		if( (s.length === 1) || (s.length === 2) ) { 
			return (s.length === 2) ? s : '0' + s;
		} else {
			throw new TypeError("Provided string (" +s +") is invalid for zero-padding.");
		}
	}

	debug.assert(x).is('number').is('integer');
	var euros = Math.floor( x/100 );
	var cents = Math.round( x - euros*100 );
	debug.assert(euros).is('number').is('integer');
	debug.assert(cents).is('number').is('integer');
	var value = ''+euros.toFixed(0)+'.' + do_padding( cents.toFixed(0) ); 
	debug.assert(value).is('string').pattern(/^[0-9]+\.[0-9]{2}$/);
	return value;
};

/** Calculate sum of amounts */
currency.sum = function() {
	var args = Array.prototype.slice.call(arguments);
	var sum = args.reduce(function(a, b) {
		return currency.parse(a) + currency.parse(b);
	}, 0);
	debug.assert(sum).is('integer');
	return sum;
};

/* EOF */
