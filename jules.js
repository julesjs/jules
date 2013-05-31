/*
 * jules.js
 * JULES - (another) JavaScript Schema Validator
 * Ezekiel 25:17
 *
 * @author Nikola Stamatovic Stamat 
 * @copyright IVARTECH < http://ivartech.com >
 * @since May 2013
 */

<<<<<<< HEAD
=======
ivar.formAgregator = {};

$(document).ready(function() {
	console.log(jules.validate('12345', schema, true));
});


>>>>>>> 06762ce0cebe0bf66f1309440295f2f770acea31
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
		allOf: [{$ref:'https://dl.dropboxusercontent.com/u/2808807/test.json#'}],
<<<<<<< HEAD
		not: [{$ref:'https://dl.dropboxusercontent.com/u/2808807/test.json#'}],
		'if': {
			condition: {type:'string'},
			then: {regex: 'f'}
		}
=======
		not: [{$ref:'https://dl.dropboxusercontent.com/u/2808807/test.json#'}]
>>>>>>> 06762ce0cebe0bf66f1309440295f2f770acea31
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
<<<<<<< HEAD
jules.aggregateErrors = true;
jules.errors = [];
jules.errorMessages = {};
jules.errorMessages['type'] = '{{schema_id}} Invalid type. Type of data should be {{key_val}}';
=======

jules.errors = [];
jules.errorMessages = {};
jules.errorMessages['type'] = 'Invalid type. Type of data should be {{schema}}';
>>>>>>> 06762ce0cebe0bf66f1309440295f2f770acea31
jules.refs = {};

jules.onEach = undefined;
jules.onEachFail = undefined;
jules.onEachPass = undefined;
jules.onFinish = undefined;

jules.validate = function(value, schema, aggregateErrors) {	
<<<<<<< HEAD
	aggregateErrors = ivar.isSet(aggregateErrors)?aggregateErrors:jules.aggregateErrors;
=======
	aggregateErrors = ivar.isSet(aggregateErrors)?aggregateErrors:false;
>>>>>>> 06762ce0cebe0bf66f1309440295f2f770acea31
	
	if(!schema.id)
		schema.id = 'schema_'+ivar.crc32(JSON.stringify(schema));
	
	if(!ivar.isSet(jules.refs[schema.id]))
		jules.refs[schema.id] = schema;
	
	var result = true;
	
<<<<<<< HEAD
=======
	console.log(schema);
	
>>>>>>> 06762ce0cebe0bf66f1309440295f2f770acea31
	for(var i in schema) {
		if(ivar.isSet(schema[i]) && jules.validator[i]) {
			var valid = jules.validator[i](value, i, schema);
			console.log(schema.id+' - '+i+': '+valid);
			if(!valid) {
<<<<<<< HEAD
				jules.invalid(i, value, schema);
				if(jules.onEachFail) jules.onEachFail(i, value, schema);
				if(!aggregateErrors) {
					if(jules.onFinish) jules.onFinish(false, value, schema);
					return false;
				}
=======
				jules.invalid(i, value, schema[i]);
				if(jules.onEachFail) jules.onEachFail(i, value, schema);
				if(!aggregateErrors)
					return false;
>>>>>>> 06762ce0cebe0bf66f1309440295f2f770acea31
			} else {
				if(jules.onEachPass) jules.onEachPass(i, value, schema);
			}
		}
		if(jules.onEach) jules.onEach(i, value, schema, valid);
	}
	
	if(aggregateErrors && jules.errors.length > 0)
<<<<<<< HEAD
		result = false; // this is why!!! you imbecile
		
	if(jules.onFinish) jules.onFinish(result, value, schema);
=======
		result = false;
		
	if(jules.onFinish) jules.onFinish(result, value, schema);
	
>>>>>>> 06762ce0cebe0bf66f1309440295f2f770acea31
	return result;
};

jules.invalid = function(i, value, schema) {
	var key_val = schema[i];
	var val = value.toString();
	if(ivar.isObject(value))
		value = JSON.stringify(value);
<<<<<<< HEAD
	var sch = key_val.toString();
	if(ivar.isObject(key_val))
		sch = JSON.stringify(key_val);
	var message = jules.errorMessages[i]?jules.errorMessages[i].template({i: i, value: val, schema_id: schema.id, key_val: sch}):'['+schema.id+ ' > error] '+i+': '+sch+' -> ' + val;
=======
	var sch = schema.toString();
	if(ivar.isObject(schema))
		sch = JSON.stringify(schema);
	var message = jules.errorMessages[field]?jules.errorMessages[field].template({field: field, value: val, schema: sch}):'[error] '+field+': '+sch+' -> ' + val;
>>>>>>> 06762ce0cebe0bf66f1309440295f2f770acea31
	jules.errors.push(message);
}

jules.validator = {};

// ====== [Validators]: Object ====== //

jules.validator.$ref = function(value, i, schema) {
	//TODO:
	var ref = schema[i];
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
	return jules.validate(value, schema);
};

jules.validator.dependencies = function(value, i, schema) {
	var dep = schema[i];
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
				if(!jules.validate(value, dep[i]))
						return false;
		}
	}
	return true;
};

jules.validator.requiredProperties = function(value, i, schema) {
	var arr = schema[i];
	for(var i = 0; i < arr.length; i++) {
		if(!value.hasOwnProperty(arr[i]))
			return false;
	}
	return true;
};

jules.validator.maxProperties = function(value, i, schema) {
	var count = 0;
	var num = schema[i];
	
	for(var i in value) {
		count++;
		if(count > num)
			return false;
	}
	return true;
};

jules._property = function(value, prop, bool) {
	if(value.hasOwnProperty(prop)) {
		if(!jules.validate(value[prop], prop[prop]))
			return false;
	} else {
		if(!bool)
			return false;
	}
	
	return true;
};

jules._patternProperty = function(value, prop, bool) {
	var found = ivar.getProperty(value, ivar.toRegExp(prop));
	for(var j = 0; j < found.length(); j++) {
		if (!jules.validate(value[j], prop[prop]))
			return false;
	}
	if (!bool && found.length === 0) return false;
		
	return true;
};

jules.validator.patternProperties = function(value, i, schema) {
	var prop = schema[i];
	for(var i in prop) {
		if (!jules._patternProperty(value, i))
			return false;
	}
	return true;
};

jules.validator.properties = function(value, i, schema, bool) {
	var prop = schema[i];
	for(var i in prop) {
		if (ivar.regex.regex.test(i)) {
			if (!jules._patternProperty(value, i, bool))
				return false;
		} else {
			if (!jules._property(value, i, bool))
				return false;
		}
	}
	return true;
};

jules.validator.additionalProperties = function(value, i, schema) {
	var prop = schema[i];
	if (ivar.isObject(prop)) {
		return jules.validator.properties(value, i, schema, true);
	} else {
		if (prop === false) {
			return jules.validator._noAdditionalProperties(value, i, schema);
		}
	}
	
	return true;
};

jules.validator._noAdditionalProperties = function(value, i, schema) {
	var prop = schema[i];
	var arr = [];
	for(var i in value) {
		arr.push(i);
	}
	
	if(schema.hasOwnProperty('properties')) {
		for(var i in schema.properties) {
			if (ivar.regex.regex.test(i)) {
				//TODO:
			} else {
				if (!jules._property(value, i, bool))
					return false;
			}
		}
	}
	
	if(schema.hasOwnProperty('patternProperties')) {
	
	}
};

jules.validator.minProperties = function(value, i, schema) {
	var count = 0;
	for(var i in value)
		count++;
	if(count < schema[i])
		return false;
	return true;
};

// ====== [Validators]: Array ====== //

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

jules.validator.items = function(value, i, schema) {
	schema = schema[i];
	if(ivar.isObject(schema)) {
		for(var i = 0; i < value.length; i++) {
			var valid = jules.validate(value[i], schema);
			if(!valid) return false;
		}
		return true;
	} else {
		for(var i = 0; i < schema.length; i++) {
			var valid = jules.validate(value[i], schema[i]);
			if(!valid) return false;
		}
		return true;
	}
};

jules.validator.additionalItems = function(value, i, schema) {
	if(schema[i]) return true;
	return value.length <= schema.items.length;
};

// ====== [Validators]: String ====== //

jules.validator.regex = function(value, i, schema) {
	if(!isString(value))
		value = value.toString();
	if(!(regex instanceof RegExp))
		regex = jules.utils.buildRegExp(schema[i]);	
	return regex.test(value);
};

jules.validator.pattern = jules.validator.regex;

jules.formats = {}; //date-time YYYY-MM-DDThh:mm:ssZ, date YYYY-MM-DD, time hh:mm:ss, utc-milisec, regex, color, style, phone E.123, uri, url, email, ipv4, ipv6, host-name
jules.formats.email = function(val) {
	return ivar.regex.email.test(val);
};

jules.formats.regex = function(val) {
	return ivar.regex.regex.test(val);
};

jules.formats.time = function(val) {
	return ivar.regex.time.test(val);
<<<<<<< HEAD
};

jules.formats.uri = function(val) {
	return ivar.regex.uri.test(val);
};

jules.validator.format = function(value, i, schema) {
	return jules.formats[schema[i]](value);
};

=======
};

jules.formats.uri = function(val) {
	return ivar.regex.uri.test(val);
};

jules.validator.format = function(value, i, schema) {
	return jules.formats[schema[i]](value);
};

>>>>>>> 06762ce0cebe0bf66f1309440295f2f770acea31
// ====== [Validators]: Number ====== //

jules.validator.min = function(value, i, schema, exclusive) {
	var min = schema[i];
	if(value.hasOwnProperty('length'))
		value = value.length;
	min = jules.utils.buildRangeObj(min, exclusive);
	return min.exclusive?min.value<value:min.value<=value; 
};

jules.validator.minimum = jules.validator.min;
jules.validator.minItems = jules.validator.min;
jules.validator.minLength = jules.validator.min;

jules.validator.max = function(value, i, schema, exclusive) {
	var max = schema[i];
	if(value.hasOwnProperty('length'))
		value = value.length;
	max = jules.utils.buildRangeObj(max, exclusive);
	return max.exclusive?max.value>value:max.value>=value; 
};

jules.validator.maximum = jules.validator.max;
jules.validator.maxItems = jules.validator.max;
jules.validator.maxLength = jules.validator.max;

jules.validator.exclusiveMinimum = function(value, i, schema) {
	return jules.validator.min(value, 'minimum', schema, schema[i]);
<<<<<<< HEAD
};

jules.validator.exclusiveMaximum = function(value, i, schema) {
	return jules.validator.min(value, 'maximum', schema, schema[i]);
};

=======
};

jules.validator.exclusiveMaximum = function(value, i, schema) {
	return jules.validator.min(value, 'maximum', schema, schema[i]);
};

>>>>>>> 06762ce0cebe0bf66f1309440295f2f770acea31
jules.validator.dividableBy = function(value, i, schema) {
	return value%schema[i] === 0;
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

// ====== [Validators]: Any Type ====== //

//+contition
jules.validator['if'] = function(value, i, schema) {
	var not = ivar.isSet(schema[i]['not'])? schema[i]['not']: true;
	var cond_res = jules.validate(value, schema[i]['condition']);
<<<<<<< HEAD
	console.log(cond_res);
=======
>>>>>>> 06762ce0cebe0bf66f1309440295f2f770acea31
	var bool = not? cond_res: !cond_res;
	if(bool) {
		return jules.validate(value, schema[i]['then']);
	} else {
		if(ivar.isSet(schema[i]['else']))
			return jules.validate(value, schema[i]['else']);
	}
	return false;
};

//@see jules.validator.requiredProperties
jules.validator.required = function(value, i, schema) {
	var bool = schema[i];
	if(ivar.isArray(bool))
		return jules.validator.requiredProperties(value, i, schema);
	if(!bool) return true;
	return value !== undefined;
};

jules.validator._enum = function(value, i, schema, not) {
	if(ivar.isArray(schema[i]))
		schema[i] = schema[i].map();
		
	value = ivar.toMapKey(value);
	var res = schema[i].hasOwnProperty(value);
	return not? !res: res;
}; 

jules.validator.only = jules.validator._enum;

jules.validator.enum = jules.validator._enum;
 
jules.validator.forbidden = function(value, i, schema) {
	jules.validator._enum(value, i, schema, true);
};

jules.validator.type = function(value, i, schema) {
	var type = schema[i];
	if(type === 'any' || type === '*' || type === '')
		return true;
		
	if(ivar.isArray(type)) {
		for(var i = 0; i < type.length; i++) {
			if(ivar.is(value, type[i]))
				return true;
		}
		return false;
	} else {
		return ivar.is(value, type);
	}
};

jules.validator._allOf = function(value, schema_arr) {
	for(var i = 0; i < schema_arr.length; i++) {
		if(!jules.validate(value, schema_arr[i]))
			return false;
	}
	return true;
};

jules.validator.allOf = function(value, i, schema) {
	var key_val = schema[i];
	if(!ivar.isArray(value)) {
		return jules.validator._allOf(value, key_val);
	} else {
		for(var i = 0; i < value.length; i++) {
			if(!jules.validator._allOf(value[i], key_val))
				return false;
		}
		return true;
	}
};

jules.validator._anyOf = function(value, schema_arr) {
	for(var i = 0; i < schema_arr.length; i++) {
		if(jules.validate(value, schema_arr[i]))
			return true;
	}
	return false;
};

jules.validator.anyOf = function(value, i, schema) {
	var key_val = schema[i];
	if(!ivar.isArray(value)) {
		return jules.validator._anyOf(value, key_val);
	} else {
		for(var i = 0; i < value.length; i++) {
			if(!jules.validator._anyOf(value[i], key_val))
				return false;
		}
		return true;
	}
};

jules.validator._oneOf = function(value, schema_arr) {
	var passed = 0;
	for(var i = 0; i < schema_arr.length; i++) {
		if(jules.validate(value, schema_arr[i], false))
			passed += 1;
	}
	if(passed === 1)
		return true;
	return false;
}

jules.validator.oneOf = function(value, i, schema) {
	var key_val = schema[i];
	if(!ivar.isArray(value)) {
		return jules.validator._oneOf(value, key_val);
	} else {
		for(var i = 0; i < value.length; i++) {
			if(!jules.validator._oneOf(value[i], key_val))
				return false;
		}
		return true;
	}
};

jules.validator._not = function(value, schema_arr) {
	for(var i = 0; i < schema_arr.length; i++) {
		if(jules.validate(value, schema_arr[i], false))
			return false;
	}
	return true;
}

jules.validator.not = function(value, i, schema) {
	var key_val = schema[i];
	if(ivar.isObject(key_val))
		key_val = [key_val];
	if(!ivar.isArray(value)) {
		return jules.validator._not(value, key_val);
	} else {
		for(var i = 0; i < value.length; i++) {
			if(!jules.validator._not(value[i], key_val))
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

//TEST
ivar.echo(jules.validate('123f45', schema, true));


