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
	console.log(jules.validate('12345', schema));
});

//int,float,number,array,string,bool,object
var schema = {
		'strict':true,
		'type': ['array'],
		//'disallow': 'int' //disallowed types, can be array
		'required': false,
		'default': null,
		'definitions': {
			'test': {
				min: 5
			},
			'test1': {
				type: 'array'
			},
		},
		'min': {
			value: 0,
			exclusive: false
		},
		'max': {
			value: 30,
			exclusive: false
		},
		
		"enum": ["123","1234","12345"],
		
		//'items':[{type: 'int', min:1},{type: 'int', min:1},{type: 'string'}],
		
		//'additionalItems': false,
		
		//'unique': true, //if array items must be unique 	//uniqueProperties: []  //not Unique ITEMS!!! unique items dont have sense
		allOf: [{$ref:'https://dl.dropboxusercontent.com/u/2808807/test.json#'}]
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
jules.refs = {};

jules.validate = function validate(value, schema, aggregateErrors) {
	if(aggregateErrors === undefined)
		aggregateErrors = jules.aggregateErrors;
		
	if(schema.id)
		jules.refs[schema.id] = schema;
	jules.schema = schema;
	
	jules.errors = [];
	return jules._validate(value, schema, aggregateErrors);
};

jules._validate = function(value, schema, aggregateErrors) {

	if(schema.hasOwnProperty('only') && ivar.isArray(schema['only']))
		schema['only'] = schema['only'].map();
	if(schema.hasOwnProperty('enum') && ivar.isArray(schema['enum']))
		schema['enum'] = schema['enum'].map();
	if(schema.hasOwnProperty('forbidden') && ivar.isArray(schema['forbidden']))
		schema['forbidden'] = schema['forbidden'].map();
		
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

jules.validator.$ref = function(value, ref) {
	//TODO:
	var schema = jules.schema;
	var parts = ref.split('#');
	if(ivar.isSet(parts[0]) && parts[0].length > 0) {
		if(!jules.refs.hasOwnProperty(parts[0])) {
			jules.getSchema(parts[0], function(schema) {
				jules.refs[parts[0]] = schema;
			});
		}
		schema = jules.refs[parts[0]];
	}
	
	if(ivar.isSet(parts[1]) && parts[1].length > 0) {
		if(parts[1].startsWith('/')) parts[1] = parts[1].removeFirst();
		var props = parts[1].split('/');
		for(var i = 0; i < props.length; i++) {
			props[i] = decodeURIComponent(props[i]);
			if(schema.hasOwnProperty(props[i])) {
				schema = schema[props[i]];
			} else {
				jules.error('Invalid reference!');
				return false;
			}
		}
	}
	return jules._validate(value, schema, false);
};

jules.validator.dependencies = function(value, dep) {
	for(var i in dep) {
		//TODO: if (ivar.regex.regex.test(i)) {
		if(ivar.isArray(dep[i])) {
			if(value.hasOwnProperty(i))
				for(var j = 0; j < dep[i].length; j++) {
					if(!value.hasOwnProperty(dep[i][j]))
						return false;
				}
		} else {
			if(value.hasOwnProperty(i))
				if(!jules._validate(value, dep[i], false))
						return false;
		}
	}
	return true;
};

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
	if(ivar.isArray(bool))
		return jules.validator.requiredProperties(value, bool);
	if(!bool) return true;
	return value !== undefined;
};

jules.validator.requiredProperties = function(value, arr) {
	for(var i = 0; i < arr.length; i++) {
		if(!value.hasOwnProperty(arr[i]))
			return false;
	}
	return true;
};

jules.validator.maxProperties = function(value, num) {
	var count = 0;
	for(var i in value) {
		count++;
		if(count > num)
			return false;
	}
	return true;
};

jules._property = function(value, prop) {
	if(value.hasOwnProperty(prop)) {
		if(!jules._validate(value[prop], prop[prop], false))
			return false;
	} else {
		if(jules.schema.additionalProperties)
			return false;
	}
	
	return true;
};

jules._patternProperty = function(value, prop) {
	var found = ivar.getProperty(value, ivar.toRegExp(prop));
	for(var j = 0; j < found.length(); j++) {
		if (!jules._validate(value[j], prop[prop], false))
			return false;
	}
	if (jules.schema.additionalProperties && found.length === 0)
		return false;
		
	return true;
};

jules.validator.patternProperties = function(value, prop) {
	for(var i in prop) {
		if(!jules._patternProperty(value, i))
			return false;
	}
	return true;
};

jules.validator.properties = function(value, prop) {
	for(var i in prop) {
		if (ivar.regex.regex.test(i)) {
			if (!jules._patternProperty(value, i))
				return false;
		} else {
			if (!jules._property(value, i))
				return false;
		}
	}
	return true;
};

jules.validator.minProperties = function(value, num) {
	var count = 0;
	for(var i in value)
		count++;
	if(count < num)
		return false;
	return true;
};

jules.validator.only = function(value, enumobj) {
	value = ivar.toMapKey(value);
	return enumobj.hasOwnProperty(value);
};

jules.validator.enum = jules.validator.only;
 
jules.validator.forbidden = function(value, enumobj) {
	value = ivar.toMapKey(value);
	return !enumobj.hasOwnProperty(value);
};

jules.validator.unique = function(value) {
	var aggr = {};
	for(var i = 0; i < value.length; i++) {
		var val = ivar.toMapKey(value[i]);
		if(!aggr.hasOwnProperty(val)) {
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
jules.validator.pattern = jules.validator.regex;

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
	if(type === 'any' || type === '*' || type === '')
		return true;
		
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
	var heading = 'jules [error]: ';
	ivar.error(heading + msg);
};

jules.getSchema = function(schema, callback) {
    var request = new XMLHttpRequest(); 
    request.onload = function(e) {
    	var resp = request.responseText;
		if (request.status == 200) {
			try {
				resp = JSON.parse(request.responseText);
			} catch(e) {
				jules.error('Invalid Schema JSON syntax - ' + e);
				resp = undefined;
			}
		} else {
			jules.error('Reference not accessible');
			resp = undefined;
		}
		
		callback(resp);
	}
    request.open('GET', schema, false);
    request.send();
};
