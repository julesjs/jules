/*
 * jules.js
 * JULES - (another) JavaScript Schema Validator
 * Ezekiel 25:17
 *
 * @author Nikola Stamatovic Stamat 
 * @copyright IVARTECH < http://ivartech.com >
 * @since May 2013
 */
 
 
//TODO: hyper schema

var schema = {
		'id': 'http://example.com/test-schema#',
		"$schema": "https://dl.dropboxusercontent.com/u/2808807/schema#",
		'strict':true,
		'type': ['object','array'],
		//'disallow': ['integer', 'string'], //disallowed types, can be array
		'requiredProperties': ['lol'],
		//'default': null,
		'definitions': {
			'test': {
				min: 0
			},
			'test1': {
				type: 'array'
			},
		},
		//'min': {
		//	value: 0,
		//	exclusive: false
		//},
		//'max': {
		//	value: 30,
		//	exclusive: false
		//},
		min: [{type: 'object', value: 2, exclusive: true}, {type: 'array', value: 3, exclusive: false}],
		max: [{type: 'object', value: 4, exclusive: true}],
		
		minProperties: 1,
		maxProperties: 4,
		
		properties: {
			'/lo/': {$ref:'https://dl.dropboxusercontent.com/u/2808807/test.json#/definitions/test'},
			'omg': {},
			'rofl': {}
		},
		
		"enum": ["123","1234",["123f45"], [1,2,3],{lol:6, rofl:2, omg:4}, {lol:1, rofl:2}],
		
		additionalProperties: false,
		
		//'items':[{type: 'int', min:1},{type: 'int', min:1},{type: 'string'}],
		
		//'additionalItems': false,
		
		//'unique': true, //if array items must be unique 	//uniqueProperties: []  //not Unique ITEMS!!! unique items dont have sense
		//allOf: [{id: 'allof',$ref:'https://dl.dropboxusercontent.com/u/2808807/test.json#'}],
		//not: [{id: 'not',$ref:'https://dl.dropboxusercontent.com/u/2808807/test.json#/definitions/test1'}],
		'if': [{
			condition: {type:'object'},
			then: {dependencies: {'lol':['omg','rofl']}},
			'else': {}
		}, {
			not: true,
			condition: {type:'array'},
			then: {max:[{type: 'object', value: 4, exclusive: true}]},
			'else': {}
		}]
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
jules.aggregate_errors = false;
//jules.validate_schema = true;
jules.errors = [];
jules.error_messages = {};
jules.error_messages['type'] = '{{schema_id}} Invalid type. Type of data should be {{key_val}}';
jules.refs = {};
jules.current = null;

jules.onEachField = undefined;
jules.onEachSchema = undefined;
jules.onFinish = undefined;

jules.validate = function(value, schema, nickcallback) {
	jules.errors = [];
	jules.initRootSchema(schema);
	var res = jules._validate(value, schema);
	if(jules.onFinish) jules.onFinish(res, value, schema);
	if(nickcallback) nickcallback(); //This is how you remind me... Or is it Someday? Go suck somewhere else...
	return res;
};

jules.initRootSchema = function(schema) {
	if(!schema.id)
		schema.id = 'schema:'+ivar.crc32(JSON.stringify(schema));
	
	if(!ivar.isSet(jules.refs[schema.id]))
		jules.refs[schema.id] = schema;
	
	jules.current = jules.refs[schema.id];
		
	return jules.refs[schema.id];
};

jules._validate = function(value, schema, aggregate_errors) {

	aggregate_errors = ivar.isSet(aggregate_errors)?aggregate_errors:jules.aggregate_errors;
	
	var result = true;
	
	var errors = [];
	
	for(var i in schema) {
		if(jules.current.id !== schema.id && jules.refs.hasOwnProperty(schema.id)) {
			jules.current = jules.refs[schema.id];
		}
		var type = ivar.whatis(value);
		if(type === 'integer' || type === 'float')
			type = 'number';
		var valid = true;
		if(jules.validator[i]) {
			valid = jules.validator[i](value, i, schema);
		} else if (jules.validator[type] && jules.validator[type][i]) {
			valid = jules.validator[type][i](value, i, schema);
		} else {
			if(jules.onEachField) jules.onEachField(value, i, schema, valid);
			continue;
		}
		//ivar.echo(schema.id+' - '+i+': '+valid);
		if(jules.onEachField) jules.onEachField(i, value, schema, valid);
		if(!valid) {
			errors.push(jules.invalid(i, value, schema));
			if(!aggregate_errors) {
				result = false;
				break;
			}
		}
	}
	
	if(aggregate_errors && errors.length > 0) {
		jules.errors = jules.errors.concat(errors);
		result = false;
	}
	if(jules.onEachSchema) jules.onEachSchema(result, value, schema);
	return result;
};

jules.invalid = function(i, value, schema) {
	var key_val = schema[i];
	var val = value.toString();
	if(ivar.isObject(value))
		value = JSON.stringify(value);
	var sch = key_val.toString();
	if(ivar.isObject(key_val))
		sch = JSON.stringify(key_val);
	var message = jules.error_messages[i]?jules.error_messages[i].template({i: i, value: val, schema_id: schema.id, key_val: sch}):'['+schema.id+ ' > error] '+i+': '+sch+' -> ' + val;
	return message;
}

ivar.namespace('jules.validator');
ivar.namespace('jules.validator.object');

// ====== [Validators]: Object ====== //

//XXX: has _validate
jules.validator.object.dependencies = function(value, i, schema) {
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
				if(!jules._validate(value, dep[i]))
						return false;
		}
	}
	return true;
};

jules.validator.object.requiredProperties = function(value, i, schema) {
	var arr = schema[i];
	for(var i = 0; i < arr.length; i++) {
		if(!value.hasOwnProperty(arr[i]))
			return false;
	}
	return true;
};

//XXX: has _validate
jules._property = function(value, prop, schema, bool) {
	if(value.hasOwnProperty(prop)) {
		if(!jules._validate(value[prop], schema[prop]))
			return false;
	} else {
		if(!bool)
			return false;
	}
	
	return true;
};

//XXX: has _validate
jules._patternProperty = function(value, prop, schema, bool) {
	var found = ivar.getProperties(value, prop);
	for(var j = 0; j < found.length; j++) {
		if (!jules._validate(value[found[j]], schema[prop]))
			return false;
	}
	if (!bool && found.length === 0) return false;
		
	return true;
};

jules.validator.object.patternProperties = function(value, i, schema) {
	var prop = schema[i];
	for(var i in prop) {
		if (!jules._patternProperty(value, i, prop))
			return false;
	}
	return true;
};

jules.validator.object.properties = function(value, i, schema, bool) {
	var prop = schema[i];
	if(!ivar.isSet(bool))
		bool = true;
	for(var i in prop) {
		if (ivar.regex.regex.test(i)) {
			if (!jules._patternProperty(value, i, prop, bool))
				return false;
		} else {
			if (!jules._property(value, i, prop, bool))
				return false;
		}
	}
	return true;
};

jules.validator.object.additionalProperties = function(value, i, schema) {
	var prop = schema[i];
	if (ivar.isObject(prop)) {
		return jules.validator.object.properties(value, i, schema);
	} else {
		if (prop === false) {
			return jules.validator._noAdditionalProperties(value, i, schema);
		}
	}
	return true;
};

jules.validator._noAdditionalProperties = function(value, i, schema) {
	var prop = schema[i];
	var arr = ivar.getProperties(value);
	
	var removePatternProperty = function(prop) {
		var re = prop.toRegExp();
		for(var i = 0; i < arr.length; i++) {
			if(re.test(arr[i]))
				arr.remove(i);
		}
	};
	
	if(schema.hasOwnProperty('properties')) {
		for(var i in schema.properties) {
			if (ivar.regex.regex.test(i)) {
				removePatternProperty(i);
			} else {
				for(var j = 0; j < arr.length; j++) {
					var id = arr.find(i);
					if(id > -1)
						arr.remove(id);
				}
			}
		}
	}
	
	if(schema.hasOwnProperty('patternProperties')) {
		for(var i in schema.patternProperties) {
			removePatternProperty(i);
		}
	}
	
	return !arr.length > 0;
};

jules.validator._propertyRange = function(obj, del) {
	var count = 0;
	for(var i in obj) {
		count++;
		if(count > del)
			break;
	}
	return count;
};

jules.validator.object.minProperties = function(value, i, schema) {
	var count = jules.validator._propertyRange(value, schema[i]);
	return count >= schema[i];
};

jules.validator.object.maxProperties = function(value, i, schema) {
	var count = jules.validator._propertyRange(value, schema[i]);
	return count <= schema[i];
};

// ====== [Validators]: Array ====== //
ivar.namespace('jules.validator.array');

jules.validator.array.unique = function(value) {
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

jules.validator.array.uniqueItems = jules.validator.array.unique;

//XXX: this one has _validate
jules.validator.array.items = function(value, i, schema) {
	schema = schema[i];
	if(ivar.isObject(schema)) {
		for(var i = 0; i < value.length; i++) {
			var valid = jules._validate(value[i], schema);
			if(!valid) return false;
		}
		return true;
	} else {
		for(var i = 0; i < schema.length; i++) {
			var valid = jules._validate(value[i], schema[i]);
			if(!valid) return false;
		}
		return true;
	}
};

jules.validator.array.additionalItems = function(value, i, schema) {
	if(schema[i]) return true;
	return value.length <= schema.items.length;
};

jules.validator.array.minItems = jules.validator.min;
jules.validator.array.maxItems = jules.validator.max;

// ====== [Validators]: String ====== //
ivar.namespace('jules.validator.string');
jules.validator.string.regex = function(value, i, schema) {
	var regex = schema[i];
	if(!ivar.isString(value))
		value = value.toString();
	if(!(regex instanceof RegExp))
		regex = jules.utils.buildRegExp(schema[i]);	
	return regex.test(value);
};

jules.validator.string.pattern = jules.validator.string.regex;

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

jules.formats.uri = function(val) {
	return ivar.regex.uri.test(val);
};

jules.validator.string.format = function(value, i, schema) {
	return jules.formats[schema[i]](value);
};

jules.validator.string.minLength = jules.validator.min;
jules.validator.string.maxLength = jules.validator.max;

// ====== [Validators]: Number ====== //
ivar.namespace('jules.validator.number');

jules.validator.number.regex = jules.validator.string.regex;

jules.validator.number.minimum = jules.validator.min;
jules.validator.number.maximum = jules.validator.max;

jules.validator.number.exclusiveMinimum = function(value, i, schema) {
	return jules.validator.min(value, 'minimum', schema, schema[i]);
};

jules.validator.number.exclusiveMaximum = function(value, i, schema) {
	return jules.validator.min(value, 'maximum', schema, schema[i]);
};

jules.validator.number.dividableBy = function(value, i, schema) {
	return value%schema[i] === 0;
};
jules.validator.number.multipleOf = jules.validator.number.dividableBy;

jules.validator.number.positive = function(value) {
	return value > 0;
};

jules.validator.number.positiveInteger = function(value) {
	if(ivar.is(value, 'integer'))
		return jules.validator.number.positive(value);
	return false;
};

jules.validator.number.negative = function(value) {
	return value < 0;
};

jules.validator.number.negativeInteger = function(value) {
	if(ivar.is(value, 'integer'))
		return jules.validator.number.negative(value);
	return false;
};

// ====== [Validators]: Any Type ====== //

jules.validator._min = function(value, min) {
	if(!min.exclusive)
		min.exclusive = false;
	return min.exclusive?min.value<value:min.value<=value;
};

jules.validator._max = function(value, max) {
	if(!max.exclusive)
		max.exclusive = false;
	return max.exclusive?max.value>value:max.value>=value;
};

jules.validator._range = function(value, i, schema, exclusive) {
	var mm = schema[i];
	var fn = '_'+i;
	var type = ivar.whatis(value);
	if(type === 'float')
		type = 'number';
	
	if(type === 'object') {
		value = ivar.countProperties(value); 
	} else if (value.hasOwnProperty('length')) {
		value = value.length;
	}
	
	if(ivar.isNumber(mm))
		mm = jules.utils.buildRangeObj(mm, exclusive);
	
	if (ivar.isObject(mm)) {
		if(mm.hasOwnProperty('type') && type !== mm.type)
			return true;
		mm = [mm];
	}
	
	var other_types = null;
	
	if(type !== 'number' && ivar.isFloat(mm.value))
		mm.value = Math.round(mm.value);
	
	if (ivar.isArray(mm)) {
		for(var i = 0; i < mm.length; i++) {
			if(mm[i].hasOwnProperty('type')) {
			
				if(type === mm[i].type)
					return jules.validator[fn](value, mm[i]);
			} else {
				if(!other_types) other_types = mm[i];
			}
		}
	}
	
	if(other_types)
		return jules.validator[fn](value, other_types);
		
	return true;
};

jules.validator.min = jules.validator._range;
jules.validator.max = jules.validator._range;

//+contition
jules.validator._if = function(value, if_obj) {
	var not = ivar.isSet(if_obj['not'])? if_obj['not']: false;
	var cond_res = jules._validate(value, if_obj['condition']);
	var bool = not? !cond_res: cond_res;
	if(bool) {
		return jules._validate(value, if_obj['then']);
	} else {
		if(ivar.isSet(if_obj['else']))
			return jules._validate(value, if_obj['else']);
	}
	return true;
};

jules.validator['if'] = function(value, i, schema) {
	var if_obj = schema[i];
	if (ivar.isArray(if_obj)) {
		for (var i = 0; i < if_obj.length; i++) {
			if(!jules.validator._if(value, if_obj[i]))
				return false;
		}
	} else {
		return jules.validator._if(value, if_obj);
	}
	return true;
};

//@see jules.validator.requiredProperties
jules.validator.required = function(value, i, schema) {
	var bool = schema[i];
	if(ivar.isArray(bool))
		return jules.validator.object.requiredProperties(value, i, schema);
	return bool ? value !== undefined : true;
};

jules.validator.notEmpty = function(value, i, schema) {
	var bool = schema[i];
	return bool ? !ivar.isEmpty() : true;
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

jules.validator.allow = jules.validator.type;

jules.validator.disallow = function(value, i, schema) {
	var type = schema[i];
	if(ivar.isArray(type)) {
		for(var i = 0; i < type.length; i++) {
			if(ivar.is(value, type[i]))
				return false;
		}
		return true;
	} else {
		return !ivar.is(value, type);
	}
};

jules.validator._allOf = function(value, schema_arr) {
	for(var i = 0; i < schema_arr.length; i++) {
		if(!jules._validate(value, schema_arr[i]))
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
		if(jules._validate(value, schema_arr[i]))
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
		if(jules._validate(value, schema_arr[i], false))
			passed += 1;
	}
	return passed === 1;
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
		if(jules._validate(value, schema_arr[i], false))
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

//TODO: REFERENCE RESOLVE!!! Needs refactoring in order to work
//XXX: has _validate, current, refs, getSchema
jules.validator.$ref = function(value, i, schema) {
	//TODO: $ref: '#', referencing itself
	var ref = schema[i];
	var parts = ref.split('#');
	if(ivar.isSet(parts[0]) && parts[0].length > 0) {
		if(!jules.refs.hasOwnProperty(parts[0])) {
			jules.getSchema(parts[0], function(ref_schema) {
				if(!ivar.isSet(ref_schema.id))
					ref_schema.id = parts[0];
				else
					parts[0] = ref_schema.id;
				jules.initRootSchema(ref_schema);
			});
		}
		schema = jules.refs[parts[0]];
	}
	
	if(ivar.isSet(parts[1]) && parts[1].length > 0) {
		if(parts[1].startsWith('/')) parts[1] = parts[1].removeFirst();
		var props = parts[1].split('/');
		schema = jules.current;
		for(var i = 0; i < props.length; i++) {
			props[i] = decodeURIComponent(props[i]);
			if(schema.hasOwnProperty(props[i])) {
				schema = schema[props[i]];
			} else {
				jules.error('Invalid reference!');
				return false;
			}
		}
		
		if(!schema.id)
			schema.id = ref;
	}
	
	//TODO:
	if(parts[0].length === 0 && parts[1].length === 0)
		schema = jules.current;
	return jules._validate(value, schema);
};

jules.validator['extends'] = function (value, i, schema) {
	//TODO: jules.validator.extended
	return true;
};

jules.validateSchema = function(schema) {
	if(schema.hasOwnProperty('$schema'))
		return jules._validate(schema, schema.$schema, false);
	return false;
};


// ====== Some utils... ====== //

ivar.namespace('jules.utils');
jules.utils.buildRangeObj = function(val, exclusive) {
	if(ivar.isString(val))
		val = parseFloat(val);
	if(!ivar.isSet(exclusive))
		exclusive = false;
	return ivar.isNumber(val)?{value:val, exclusive: exclusive}:val;
};

jules.utils.buildRegExp = function(val) {
	if(!ivar.isString(val))
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
ivar.echo(jules.validate([1,2,3], schema));


