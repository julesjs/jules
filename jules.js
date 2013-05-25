/*
 * jules.js
 * JULES - (another) JavaScript Schema Validator
 * Ezekiel 25:17
 *
 * @author Nikola Stamatovic Stamat 
 * @copyright IVARTECH < http://ivartech.com >
 * @since May 2013
 */

ivar.formAgregator = {};

$(document).ready(function() {
	console.log(jules.validate('5', schema));
});

//int,float,number,array,string,bool,object
var schema = {
		'strict':true,
		'type': ['array'],
		//'disallow': 'int' //disallowed types, can be array
		'required': false,
		'default': null,
		
		'min': {
			value: 0,
			exclusive: false
		},
		'max': {
			value: 30,
			exclusive: false
		},
		
		//'items':[{type: 'int', min:1},{type: 'int', min:1},{type: 'string'}],
		
		//'additionalItems': false,
		
		//'unique': true, //if array items must be unique 	//uniqueProperties: []  //not Unique ITEMS!!! unique items dont have sense
		not: [{type:'string'}, {regex:'15'}, {regex:'1e'}]
		//'regex': 'f', //sting,int,float
		//'format': 'email', //can be array
		
		//'forbidden': ['stamatron@gmail.com'] // true for object id no properties allowed

		//---- other ---//
		//'only': ['lol6zors', 6, 4], //true for object if you want selected properties in properties property of schema to be only ones allowed
		//'dividableBy': 3 //number
		//items: [{schema}] Schemas for an item!
		//properties: {propertyName:schema...} //object
}

var jules = {};

jules.aggregateErrors = true;
jules.errors = [];
jules.errorMessages = {};
jules.errorMessages['type'] = 'Invalid type. Type of data should be {{schema}}';
jules.schema = null;

jules.validate = function validate(value, schema, aggregateErrors) {
	if(aggregateErrors === undefined)
		aggregateErrors = jules.aggregateErrors;
	if(schema.hasOwnProperty('only') && ivar.isArray(schema['only']))
		schema['only'] = schema['only'].map();
	if(schema.hasOwnProperty('forbidden') && ivar.isArray(schema['forbidden']))
		schema['forbidden'] = schema['forbidden'].map();
		
	jules.schema = schema;
	
	jules.errors = [];
	//console.log(ivar.whatis(schema['enum']));
	return jules._validate(value, schema, aggregateErrors);
};

jules._validate = function(value, schema, aggregateErrors) {
	for(var i in schema) {
		if(ivar.isSet(schema[i]) && jules.validator[i]) {
			var fieldValid = jules.validator[i](value, schema[i]);
			if(aggregateErrors)
			console.log(i+': '+fieldValid);
			if(!fieldValid) {
				jules.invalid(i, value, schema[i]);
				if(!aggregateErrors)
					return false;
			}
		}
	}
	
	if(aggregateErrors && jules.errors.length > 0)
		return false;
	return true;
};

jules.invalid = function(field, value, schema, callback) {
	var val = value.toString();
	if(ivar.isCustomObject(value))
		value = JSON.stringify(value);
	var sch = schema.toString();
	if(ivar.isCustomObject(schema))
		sch = JSON.stringify(schema);
	var message = jules.errorMessages[field]?jules.errorMessages[field].template({field: field, value: val, schema: sch}):'[error] '+field+': '+sch+' -> ' + val;
	jules.errors.push(message);
	if(callback && ivar.isFunction(callback))
		callback(field, value, schema, message);
}

jules.validator = {};

jules.validator.items = function(value, schema) {
	if(ivar.isObject(schema)) {
		for(var i = 0; i < value.length; i++) {
			var valid = jules._validate(value[i], schema, false);
			if(!valid) return false;
		}
		return true;
	} else {
		for(var i = 0; i < schema.length; i++) {
			var valid = jules._validate(value[i], schema[i], false);
			if(!valid) return false;
		}
		return true;
	}
};

jules.validator.additionalItems = function(value, bool) {
	if(bool) return true;
	return value.length <= jules.schema.items.length;
};

jules.validator.required = function(value, bool) {
	if(!bool) return true;
	return ivar.isSet(value);
}

jules.validator.only = function(value, enumobj) {
	if(ivar.isNumber(value))
		value = value.toString();
	if(ivar.isObject(value))
		value = 'obj_'+ivar.crc32(JSON.stringify(value));
	return enumobj.hasOwnProperty(value);
};

jules.validator.enum = jules.validator.only;
 
jules.validator.forbidden = function(value, enumobj) {
	if(ivar.isNumber(value))
		value = value.toString();
	return !enumobj.hasOwnProperty(value);
};

jules.validator.unique = function(value) {
	var aggr = {};
	for(var i = 0; i < value.length; i++) {
		var val = value[i];
		if(!aggr.hasOwnProperty(val)) {
			if(ivar.isObject(val)) val = 'obj_'+ivar.crc32(JSON.stringify(val));
			else if(ivar.isDate(val)) val = 'date_'+val.getTime();
			else if(ivar.isArray(val)) val = JSON.stringify(val);
			aggr[''+val] = 1;
		} else {
			return false;
		}
	}
	return true;
};

jules.validator.uniqueItems = jules.validator.unique;

jules.validator.forbidden = function(value, enumobj) {
	if(ivar.isNumber(value))
		value = value.toString();
	return !enumobj.hasOwnProperty(value);
};

jules.validator.min = function(value, min, exclusive) {
	if(value.hasOwnProperty('length'))
		value = value.length;
	min = jules.utils.buildRangeObj(min, exclusive);
	return min.exclusive?min.value<value:min.value<=value; 
};

jules.validator.minimum = jules.validator.min;
jules.validator.minItems = jules.validator.min;

jules.validator.max = function(value, max, exclusive) {
	if(value.hasOwnProperty('length'))
		value = value.length;
	max = jules.utils.buildRangeObj(max, exclusive);
	return max.exclusive?max.value>value:max.value>=value; 
};

jules.validator.maximum = jules.validator.max;
jules.validator.maxItems = jules.validator.max;

jules.validator.exclusiveMinimum = function(value, bool) {
	return jules.validator.min(value, jules.schema.minimum, bool);
};

jules.validator.exclusiveMaximum = function(value, bool) {
	return jules.validator.min(value, jules.schema.maximum, bool);
};

jules.validator.regex = function(value, regex) {
	if(!isString(value))
		value = value.toString();
	if(!(regex instanceof RegExp))
		regex = jules.utils.buildRegExp(regex);	
	return regex.test(value);
};

jules.validator.dividableBy = function(value, num) {
	return value%num === 0;
};

jules.validator.multipleOf = jules.validator.dividableBy;

jules.validator.positive = function(value) {
	return value > 0;
};

jules.validator.positiveInteger = jules.validator.positive;


jules.validator.negative = function(value) {
	return value < 0;
};

jules.validator.negativeInteger = jules.validator.negative;

jules.formats = {}; //date-time YYYY-MM-DDThh:mm:ssZ, date YYYY-MM-DD, time hh:mm:ss, utc-milisec, regex, color, style, phone E.123, uri, url, email, ipv4, ipv6, host-name
jules.formats.email = function(val) {
	return ivar.regex.email.test(val);
};

jules.formats.regex = function(val) {
	return ivar.regex.regex.test(val);
};

jules.formats.time = function(val) {
	return ivar.regex.time.test(val);
};

jules.validator.format = function(value, format) {
	return jules.formats[format](value);
};

jules.validator.type = function(value, type) {
	if(isArray(type)) {
		for(var i = 0; i < type.length; i++) {
			if(ivar.is(value, type[i]))
				return true;
		}
		return false;
	} else {
		return ivar.is(value, type);
	}
};

jules.validator._allOf = function(value, keywordValue) {
	for(var i = 0; i < keywordValue.length; i++) {
		if(!jules._validate(value, keywordValue[i], false))
			return false;
	}
	return true;
};

jules.validator.allOf = function(value, keywordValue) {
	if(!ivar.isArray(value)) {
		return jules.validator._allOf(value, keywordValue);
	} else {
		for(var i = 0; i < value.length; i++) {
			if(!jules.validator._allOf(value[i], keywordValue))
				return false;
		}
		return true;
	}
};

jules.validator._anyOf = function(value, keywordValue) {
	for(var i = 0; i < keywordValue.length; i++) {
		if(jules._validate(value, keywordValue[i], false))
			return true;
	}
	return false;
};

jules.validator.anyOf = function(value, keywordValue) {
	if(!ivar.isArray(value)) {
		return jules.validator._anyOf(value, keywordValue);
	} else {
		for(var i = 0; i < value.length; i++) {
			if(!jules.validator._anyOf(value[i], keywordValue))
				return false;
		}
		return true;
	}
};

jules.validator._oneOf = function(value, keywordValue) {
	var passed = 0;
	for(var i = 0; i < keywordValue.length; i++) {
		if(jules._validate(value, keywordValue[i], false))
			passed += 1;
	}
	if(passed === 1)
		return true;
	return false;
}

jules.validator.oneOf = function(value, keywordValue) {
	if(!ivar.isArray(value)) {
		return jules.validator._oneOf(value, keywordValue);
	} else {
		for(var i = 0; i < value.length; i++) {
			if(!jules.validator._oneOf(value[i], keywordValue))
				return false;
		}
		return true;
	}
};

jules.validator._not = function(value, keywordValue) {
	for(var i = 0; i < keywordValue.length; i++) {
		if(jules._validate(value, keywordValue[i], false))
			return false;
	}
	return true;
}

jules.validator.not = function(value, keywordValue) {
	if(ivar.isObject(keywordValue))
		keywordValue = [keywordValue];
	if(!ivar.isArray(value)) {
		return jules.validator._not(value, keywordValue);
	} else {
		for(var i = 0; i < value.length; i++) {
			if(!jules.validator._not(value[i], keywordValue))
				return false;
		}
		return true;
	}
};

jules.utils = {};

jules.utils.buildRangeObj = function(val, exclusive) {
	if(ivar.isString(val))
		val = parseFloat(val);
	if(!ivar.isSet(exclusive))
		exclusive = false;
	return ivar.isNumber(val)?{value:val, exclusive: exclusive}:val;
};

jules.utils.buildRegExp = function(val) {
	if(!isString(val))
		val = val.toString();
	var re = val.toRegExp();
	if(re)
		return re;
	else
		jules.error('Malformed regexp!');
};

jules.error = function(msg) {
	ivar.error(msg);
};
