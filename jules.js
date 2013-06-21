/**
 *	@file		Part of ivartech JS library main.js
 *	@author		Nikola Stamatovic Stamat <stamat@ivartech.com>
 *	@copyright	IVARTECH http://ivartech.com
 *	@version	20130313  
 *	
 *	@namespace	ivar
 */
if(void 0===ivar)var ivar={};if(void 0===$i)var $i=ivar;ivar.DEBUG=!1;ivar._private={};ivar._global=this;ivar._private.output=void 0;ivar.regex={};ivar.regex.regex=/^\/(.*)\/(?:(?:i?g?m?)|(?:i?m?g?)|(?:g?i?m?)|(?:g?m?i?)|(?:m?g?i?)|(?:m?i?g?))$/;ivar.regex.email=/^[a-z0-9\._\-]+@[a-z\.\-]+\.[a-z]{2,4}$/;ivar.regex.uri=/^(?:([a-z\-\+\.]+):)?(?:\/\/)?(?:([^?#@:]*)(?::([^?#@:]*))?@)?([^?#\s\/]*)(?::([0-9]{1,5}))?(?:[^?#\s]*)(?:\?([^#\s"]*))?(?:#([^\s"]*))?$/;ivar.regex.time=/^(([0-1][0-9])|(2[0-3])):([0-5][0-9]):([0-5][0-9])$/;
ivar.regex.function_name=/function\s+([a-zA-Z0-9_\$]+?)\s*\(/;ivar.regex.getURIs=/(?:(?:https?|ftp):\/\/)(?:([^?#@:]*)(?::([^?#@:]*))?@)?((?:www\.|ftp\.)?([a-z0-9\-\.]+)\.(com|net|org|info|co|us|it|ca|cc|[a-z]{2,4})(:[0-9]{1,5})?((\/[^\/#\?\s]*)*)*)(\?([^#\s]*))?(#([^\s]*))?/ig;Number.prototype.roundFloat=function(a){void 0===a&&(a=2);a=Math.pow(10,a);return Math.round(this*a)/a};
Array.prototype.find=function(a,b){var c=ivar.isRegExp(a);if(0<this.length)for(var d=0;d<this.length;d++){var e=this[d];if(b&&("object"===typeof e||ivar.isArray(e)))e=this[d][b];if(c){if(a.test(e))return d}else if(e===a)return d}return-1};Array.prototype.findAll=function(a,b){var c=ivar.isRegExp(a),d=[];if(0<this.length)for(var e=0;e<this.length;e++){var f=this[e];if(b&&("object"===typeof f||ivar.isArray(f)))f=this[e][b];c?a.test(f)&&d.push(e):f===a&&d.push(e)}return d};Array.prototype.getFirst=function(){return this[0]};
Array.prototype.getLast=function(){return this[this.length-1]};Array.prototype.each=function(a,b){var c=0,d=1;b&&(d=-1,c=this.length-1);for(var e=0;e<this.length;e++)a(c,this[c]),c+=d};String.prototype.each=Array.prototype.each;Array.prototype.equal=function(a){var b=this;if(b===a)return!0;if(b.length!==a.length)return!1;b.each(function(c){if(b[c]!==a[c])return!1});return!0};Array.prototype.rm=function(a){return this.splice(a,1)};
Array.prototype.remove=function(a){if(ivar.isString(a)&&ivar.regex.regex.test(a)||ivar.isRegExp(a))return ivar.patternRemove(this,a);a=this.find(a);return-1<a?this.rm(a):!1};ivar.patternRemove=function(a,b){ivar.isString(b)&&(b=b.toRegExp());if(ivar.isArray(a))for(var c=0;c<a.length;c++)b.test(a[c])&&a.rm(c);else if("object"===typeof a)for(c in a)b.test(c)&&delete a[c];return a};
ivar.getAdditionalProperties=function(a,b,c){a=ivar.getProperties(value);if(b&&ivar.isArray(b))for(var d=0;d<b.length;d++)a.remove(b[d]);if(b&&ivar.isArray(c))for(d=0;d<c.length;d++)a.remove(c[d]);return a};Array.prototype.insert=function(a,b){return this.splice(a,0,b)};Array.prototype.shuffle=function(){for(var a=[];0!==this.length;){var b=Math.floor(Math.random()*this.length);a.push(this[b]);this.splice(b,1)}return a};
Array.prototype.toObject=function(){for(var a={},b=0;b<this.length;b++)a[b]=this[b];return a};
Array.prototype.map=function(a){for(var b={},c=0;c<this.length;c++){var d=this[c];ivar.isSet(a)&&(d=this[c][a]);d=ivar.toMapKey(d);!b.hasOwnProperty(d)?b[d]=[c]:b[d].push(c)}return b};String.prototype.hasOwnProperty("startsWith")||(String.prototype.startsWith=function(a,b){return this.substring(b,a.length)===a});String.prototype.hasOwnProperty("endsWith")||(String.prototype.endsWith=function(a,b){b||(b=this.length);return this.substring(b-a.length,b)===a});
String.prototype.hasOwnProperty("trim")||(String.prototype.trim=function(){return this.replace(/^\s+|\s+$/g,"")});String.prototype.hasOwnProperty("trimLeft")||(String.prototype.trimLeft=function(){return this.replace(/^\s+/,"")});String.prototype.hasOwnProperty("trimRight")||(String.prototype.trimRight=function(){return this.replace(/\s+$/,"")});String.prototype.removePrefix=function(a){return this.substring(a.length,this.length)};
String.prototype.removeSufix=function(a){return this.substring(0,this.length-a.length)};String.prototype.removeFirst=function(){return this.substring(1,this.length)};String.prototype.removeLast=function(){return this.substring(0,this.length-1)};String.prototype.getFirst=Array.prototype.getFirst;String.prototype.getLast=Array.prototype.getLast;
String.prototype.insert=function(a,b,c){"string"===typeof b&&(b=this.indexOf(b));c=c||b;var d=[];d.push(this.substring(0,b));d.push(a);d.push(this.substring(c,this.length));return d.join("")};String.prototype.hasUpperCase=function(){return this!==this.toLowerCase()?!0:!1};String.prototype.hasLowerCase=function(){return this.toUpperCase()!==this?!0:!1};
String.prototype.template=function(a,b,c){b=b||"{{";c=c||"}}";for(var d=this,e=d.indexOf(b);-1<e;)var f=d.indexOf(c,e),g=d.substring(e+b.length,f),g=a[g]||"",d=d.insert(g,e,f+c.length),e=d.indexOf(b,e+g.length);return d};String.prototype.swap=function(a,b,c){return c?this.replace(a,b):this.replace(RegExp(a+"+","g"),b)};String.prototype.toRegExp=function(){var a=[];ivar.regex.regex.test(this)?a=ivar.regex.regex.exec(this):a[1]=this;try{return RegExp(a[1],a[2])}catch(b){return!1}};
Function.prototype.parseName=function(){return ivar.regex.function_name.exec(this.toString())[1]};Function.prototype.method=function(a,b){void 0===b&&(b=a.parseName());this.prototype[b]=a};Function.prototype.inherit=function(a){for(var b=0,c=[];arguments.hasOwnProperty(b);){c.push(arguments[b]);var d=arguments[b];"function"===typeof d&&(d=new d);for(var e in d)this.prototype[e]=d[e];b++}1===c.length&&(c=c[0]);this.prototype.__super__=c};
ivar.request=function(a,b){var c={method:"GET",async:!0};ivar.isSet(a)&&ivar.extend(c,a);var d=new XMLHttpRequest;d.onload=function(){var a=d.responseText;200!=d.status&&(a=void 0);b&&b(a)};d.open(c.method,c.uri,c.async);d.send(c.messages)};ivar.eachArg=function(a,b){for(var c=0;a.hasOwnProperty(c);)void 0!==b&&b(c,a[c]),c++;return c-1};
ivar.getProperties=function(a,b){if(!b&&!ivar.isString(b)){var c=[],d;for(d in a)c.push(d)}else for(d in"regexp"!==ivar.whatis(b)&&(b=b.toRegExp()),c=[],a)b.test(d)&&c.push(d);return c};ivar.countProperties=function(a,b){var c=0,d;for(d in a)c++,b&&b(c,d);return c};ivar.isSet=function(a){return void 0!==a&&null!==a};ivar.isEmpty=function(a){if(ivar.isSet(a)){if(a.length&&0<a.length)return!1;for(var b in a)if(hasOwnProperty.call(a,b))return!1}return!0};
ivar.echo=function(a){var b=[];b.push("log");ivar.eachArg(arguments,function(a,d){b.push(d)});ivar.systemMessage.apply(null,b)};ivar.warn=function(a){var b=[];b.push("warn");ivar.eachArg(arguments,function(a,d){b.push(d)});ivar.systemMessage.apply(null,b)};
ivar.error=function(a){if(!ivar.isSet(arguments[0])||""===arguments[0]||" "===arguments[0])arguments[0]='[ERROR]: in function "'+arguments.callee.caller.parseName()+'"';var b=[];b.push("error");ivar.eachArg(arguments,function(a,d){b.push(d)});ivar.systemMessage.apply(null,b)};ivar.setDebugOutput=function(a){ivar._private.output=a};
ivar._private.consolePrint=function(a){if(0===a.msgs.length)console[a.type](a.title);else"log"===a.type||"warn"===a.type?console.groupCollapsed(a.title):console.group(a.title),a.msgs.each(function(b,c){console[a.type](c)}),console.groupEnd()};ivar._private.alertPrint=function(a){0===a.msgs.length?alert("["+a.type+"] "+a.title):alert(["["+a.type+"] "+a.title,"------"].join("\n")+"\n"+a.msgs.join("\n"))};
ivar.systemMessage=function(a,b){var c=ivar.isSet(arguments[2]),d=ivar.isSet(ivar._global.console)&&ivar.isSet(ivar._global.console[a]),e={type:a,title:arguments[1],msgs:[]};c&&ivar.eachArg(arguments,function(a,b){1<a&&e.msgs.push(b)});d&&ivar.DEBUG&&ivar._private.consolePrint(e);ivar.isSet(ivar._private.output)?ivar._private.output(e):!d&&ivar.DEBUG&&ivar._private.alertPrint(e)};
ivar.is=function(a,b){return"number"===b?isNumber(a):ivar.whatis(a)===b?!0:"empty"===b?ivar.isEmpty(a):"set"===b?ivar.isSet(a):!1};ivar.isArray=function(a){return ivar.is(a,"array")};ivar.isNumber=function(a){if(isNaN(a))return!1;var b=typeof a;"object"===b&&(b=ivar.getClass(a).toLowerCase());return"number"===b};ivar.isInt=function(a){return ivar.is(a,"integer")};ivar.isFloat=function(a){return ivar.is(a,"float")};ivar.isString=function(a){return ivar.is(a,"string")};
ivar.isObject=function(a){return ivar.is(a,"object")};ivar.isFunction=function(a){return ivar.is(a,"function")};ivar.isDate=function(a){return ivar.is(a,"date")};ivar.isBool=function(a){return ivar.is(a,"boolean")};ivar.isRegExp=function(a){return ivar.is(a,"regexp")};ivar.isNull=function(a){return null===a};ivar.isUndefined=function(a){return void 0===a};ivar.getClassName=function(a){return a.constructor.parseName()};
ivar.whatis=function(a){if(void 0===a)return"undefined";if(null===a)return"null";var b=typeof a;"object"===b&&(b=ivar.getClass(a).toLowerCase());return"number"===b?0<a.toString().indexOf(".")?"float":"integer":b};ivar.namespace=function(a,b){var c=a.split(".");ivar.isSet(b)||(b=ivar._global);var d=b;c.each(function(a,b){d.hasOwnProperty(b)||(d[b]={});d=d[b]});return d};ivar.getClass=function(a){return Object.prototype.toString.call(a).match(/^\[object\s(.*)\]$/)[1]};
ivar.parseText=function(a){return/^\s*$/.test(a)?null:/^(?:true|false)$/i.test(a)?"true"===a.toLowerCase():isFinite(a)?parseFloat(a):isFinite(Date.parse(a))?new Date(a):a};ivar._private.crc32_table="00000000 77073096 EE0E612C 990951BA 076DC419 706AF48F E963A535 9E6495A3 0EDB8832 79DCB8A4 E0D5E91E 97D2D988 09B64C2B 7EB17CBD E7B82D07 90BF1D91 1DB71064 6AB020F2 F3B97148 84BE41DE 1ADAD47D 6DDDE4EB F4D4B551 83D385C7 136C9856 646BA8C0 FD62F97A 8A65C9EC 14015C4F 63066CD9 FA0F3D63 8D080DF5 3B6E20C8 4C69105E D56041E4 A2677172 3C03E4D1 4B04D447 D20D85FD A50AB56B 35B5A8FA 42B2986C DBBBC9D6 ACBCF940 32D86CE3 45DF5C75 DCD60DCF ABD13D59 26D930AC 51DE003A C8D75180 BFD06116 21B4F4B5 56B3C423 CFBA9599 B8BDA50F 2802B89E 5F058808 C60CD9B2 B10BE924 2F6F7C87 58684C11 C1611DAB B6662D3D 76DC4190 01DB7106 98D220BC EFD5102A 71B18589 06B6B51F 9FBFE4A5 E8B8D433 7807C9A2 0F00F934 9609A88E E10E9818 7F6A0DBB 086D3D2D 91646C97 E6635C01 6B6B51F4 1C6C6162 856530D8 F262004E 6C0695ED 1B01A57B 8208F4C1 F50FC457 65B0D9C6 12B7E950 8BBEB8EA FCB9887C 62DD1DDF 15DA2D49 8CD37CF3 FBD44C65 4DB26158 3AB551CE A3BC0074 D4BB30E2 4ADFA541 3DD895D7 A4D1C46D D3D6F4FB 4369E96A 346ED9FC AD678846 DA60B8D0 44042D73 33031DE5 AA0A4C5F DD0D7CC9 5005713C 270241AA BE0B1010 C90C2086 5768B525 206F85B3 B966D409 CE61E49F 5EDEF90E 29D9C998 B0D09822 C7D7A8B4 59B33D17 2EB40D81 B7BD5C3B C0BA6CAD EDB88320 9ABFB3B6 03B6E20C 74B1D29A EAD54739 9DD277AF 04DB2615 73DC1683 E3630B12 94643B84 0D6D6A3E 7A6A5AA8 E40ECF0B 9309FF9D 0A00AE27 7D079EB1 F00F9344 8708A3D2 1E01F268 6906C2FE F762575D 806567CB 196C3671 6E6B06E7 FED41B76 89D32BE0 10DA7A5A 67DD4ACC F9B9DF6F 8EBEEFF9 17B7BE43 60B08ED5 D6D6A3E8 A1D1937E 38D8C2C4 4FDFF252 D1BB67F1 A6BC5767 3FB506DD 48B2364B D80D2BDA AF0A1B4C 36034AF6 41047A60 DF60EFC3 A867DF55 316E8EEF 4669BE79 CB61B38C BC66831A 256FD2A0 5268E236 CC0C7795 BB0B4703 220216B9 5505262F C5BA3BBE B2BD0B28 2BB45A92 5CB36A04 C2D7FFA7 B5D0CF31 2CD99E8B 5BDEAE1D 9B64C2B0 EC63F226 756AA39C 026D930A 9C0906A9 EB0E363F 72076785 05005713 95BF4A82 E2B87A14 7BB12BAE 0CB61B38 92D28E9B E5D5BE0D 7CDCEFB7 0BDBDF21 86D3D2D4 F1D4E242 68DDB3F8 1FDA836E 81BE16CD F6B9265B 6FB077E1 18B74777 88085AE6 FF0F6A70 66063BCA 11010B5C 8F659EFF F862AE69 616BFFD3 166CCF45 A00AE278 D70DD2EE 4E048354 3903B3C2 A7672661 D06016F7 4969474D 3E6E77DB AED16A4A D9D65ADC 40DF0B66 37D83BF0 A9BCAE53 DEBB9EC5 47B2CF7F 30B5FFE9 BDBDF21C CABAC28A 53B39330 24B4A3A6 BAD03605 CDD70693 54DE5729 23D967BF B3667A2E C4614AB8 5D681B02 2A6F2B94 B40BBE37 C30C8EA1 5A05DF1B 2D02EF8D";
ivar.crc32=function(a,b){b==window.undefined&&(b=0);var c=0,c=0;b^=-1;for(var d=0,e=a.length;d<e;d++)c=(b^a.charCodeAt(d))&255,c="0x"+ivar._private.crc32_table.substr(9*c,8),b=b>>>8^c;return b^-1};

String.prototype.parseJSON = function() {
	if(/^\s*\{.*\}\s*$/.test(this)) {
		try {
			return JSON.parse(this);	
		} catch(e) {
			return;
		}
	}
	return;
};

ivar.sortProperties = function(o, fn) {
	var props = [];
	var res = {};
	for(var i in o) {
		props.push(i);
	}
	props = props.sort(fn);
	
	for(var i = 0; i < props.length; i++) {
		if(ivar.is(o[props[i]], 'object'))
			o[props[i]] = ivar.sortProperties(o[props[i]]);
		res[props[i]] = o[props[i]];
	}
	
	return res;
};

ivar.objectCRC = function(o) {
	return ivar.crc32(JSON.stringify(ivar.sortProperties(o)));
};

ivar.toMapKey = function(value) {
	var type = ivar.whatis(value);
	
	if (type === 'function') {
		value = value.parseName()+_+ivar.crc32(value.toString());
	} else if (type === 'date') {
		value = value.getTime();
	} else if (type === 'object') {
		value = ivar.objectCRC(value);
	} else if (type === 'array') {
		value = ivar.arrayCRC(value);
	}
	
	return  type+'_'+value;
};

ivar.arrayCRC = function(a) {
	for(var i = 0; i < a.length; i++) {
		a[i] = ivar.toMapKey(a[i]);
	}
	return ivar.crc32(a.toString());
};

/*
 * jules.js
 * JULES - (another) JavaScript Schema Validator
 * Ezekiel 25:17
 *
 * @author Nikola Stamatovic Stamat < stamat@ivartech.com >
 * @copyright IVARTECH < http://ivartech.com >
 * @licence MIT
 * @since May 2013
 */
 
 
//TODO: hyper schema
//TODO: extends

var jules = {};
jules.aggregate_errors = false;
jules.dont_label = true;
jules.errors = [];
jules.error_messages = {};
//jules.error_messages['type'] = '{{schema_id}} Invalid type. Type of data should be {{key_val}}';
jules.refs = {};
jules.current_scope = null;

jules.onEachField = undefined;
jules.onEachFieldResult = undefined;
jules.onEachSchema = undefined;
jules.onEachSchemaResult = undefined;
jules.onStart = undefined;
jules.onFinish = undefined;

jules.validate = function(value, schema, nickcallback) {
	if(jules.onStart) jules.onStart(value, schema);
	jules.errors = [];
	if(ivar.isString(schema))
		schema = jules.getSchemaByReference(schema);
	jules.initScope(schema);
	var res = jules._validate(value, schema);
	if(nickcallback) nickcallback(value, schema, res); //This is how you remind me... Or is it Someday? Go suck somewhere else...
	if(jules.onFinish) jules.onFinish(value, schema, res);
	return res;
};

jules.initScope = function(schema) {
	//ivar.echo('=================');
	if(!schema.id && !jules.dont_label)
		schema.id = 'schema:'+ivar.crc32(JSON.stringify(schema));
	
	if(schema.id && !ivar.isSet(jules.refs[schema.id]))
		jules.refs[schema.id] = schema;
	
	jules.current_scope = schema;
		
	return schema;
};

jules._validate = function(value, schema, aggregate_errors) {
	if(jules.onEachSchema) jules.onEachSchema(value, schema);
	aggregate_errors = ivar.isSet(aggregate_errors)?aggregate_errors:jules.aggregate_errors;
	
	var result = true;
	
	var errors = [];
	
	for(var i in schema) {
		if(jules.current_scope.id !== schema.id && jules.refs.hasOwnProperty(schema.id)) {
			jules.current_scope = jules.refs[schema.id];
		}
		if(jules.onEachField) jules.onEachField(value, i, schema, valid);
		
		var type = ivar.whatis(value);
		if(type === 'integer' || type === 'float')
			type = 'number';
		var valid = true;
		if(jules.validator[i]) {
			valid = jules.validator[i](value, i, schema);
		} else if (jules.validator[type] && jules.validator[type][i]) {
			valid = jules.validator[type][i](value, i, schema);
		} else {
			if(jules.onEachFieldResult) jules.onEachFieldResult(value, i, schema, valid);
			continue;
		}
		//ivar.echo(schema.id+' - '+i+': '+valid);
		if(jules.onEachFieldResult) jules.onEachFieldResult(value, i, schema, valid);
		if(!valid) {
			errors.push(jules.generateErrorMessage(value, i, schema));
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
	if(jules.onEachSchemaResult) jules.onEachSchemaResult(value, schema, result, errors);
	return result;
};

jules.generateErrorMessage = function(value, i, schema) {
	var key_val = schema[i];
	var val = value;
	if(ivar.isObject(value))
		value = JSON.stringify(value);
	var sch = key_val.toString();
	if(ivar.isObject(key_val))
		sch = JSON.stringify(key_val);
	var message = jules.error_messages[i]?jules.error_messages[i].template({keyword: i, value: val, schema_id: schema.id, key_val: sch}):'['+schema.id+ ']: Invalid '+i;
	return message;
}

ivar.namespace('jules.validator');

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
	if(!ivar.isSet(value) || ivar.isBool(value)) return true;
	
	var mm = schema[i];
	var fn = '_'+i.substring(0, 3);
	var type = ivar.whatis(value);
	if(type === 'float')
		type = 'number';
	
	if(type === 'object') {
		value = ivar.countProperties(value); 
	} else if (value.hasOwnProperty('length')) {
		value = value.length;
	}
	
	if(ivar.isNumber(mm))
		mm = jules.buildRangeObj(mm, exclusive);
		
	if (ivar.isObject(mm)) {
		if(mm.hasOwnProperty('type') && type !== mm.type)
			return true;
		mm = [mm];
	}
	
	var other_types = null;
	
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
	return jules.validator._enum(value, i, schema, true);
};

jules.validator.type = function(value, i, schema) {
	var type = schema[i];
	
	if(/^\s*(any|\*|\s|^$)\s*$/i.test(type))
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
jules.getScope = function(ref, stack) {
	if(!stack.hasOwnProperty(ref)) {
		jules.getSchema(ref, function(ref_schema) {
			if(!ivar.isSet(ref_schema.id))
				ref_schema.id = ref;  //TODO: check why I wrote these lines
			else
				ref = ref_schema.id;
			jules.initScope(ref_schema);
		});
	}
	return stack[ref];
};

jules.getFragment = function(ref, scope) {
	if(ref.startsWith('/')) ref = ref.removeFirst();
	var props = ref.split('/');
	var schema = scope;
	for(var i = 0; i < props.length; i++) {
		props[i] = decodeURIComponent(props[i]);
		if(schema.hasOwnProperty(props[i])) {
			schema = schema[props[i]];
		} else {
			return undefined;
		}
	}
	
	if(!schema.id)
		schema.id = ref;
		
	return schema;
};

jules.getSchemaByReference = function(ref) {
	//TODO: $ref: '#', referencing itself
	var schema = null;
	var parts = ref.split('#');
	if(ivar.isSet(parts[0]) && parts[0].length > 0) {
		schema = jules.getScope(parts[0], jules.refs);
	}
	
	if(ivar.isSet(parts[1]) && parts[1].length > 0) {
		schema = jules.getFragment(parts[1], jules.current_scope);
	}
	
	//TODO:
	if(parts[0].length === 0 && parts[1].length === 0)
		schema = jules.current_scope;
		
	return schema;
};

jules.validator.$ref = function(value, i, schema) {
	return jules._validate(value, jules.getSchemaByReference(schema[i]));
};

jules.validator['extends'] = function (value, i, schema) {
	//TODO: jules.validator.extended
	return true;
};

jules.validateSchema = function(schema, metaschema) {
	if(!metaschema && schema.hasOwnProperty('$schema'))
		metaschema = jules.getSchemaByReference(schema.$schema);
	if(metaschema && ivar.isString(metaschema))
		metaschema = jules.getSchemaByReference(metaschema);
		
	return jules._validate(schema, metaschema);
};

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
		return jules._validateAdditionalProperties(value, i, schema);
	} else {
		if (prop === false) {
			return !jules._getAdditionalProperties(value, i, schema).length > 0;
		}
	}
	return true;
};

jules._validateAdditionalProperties = function(value, i, schema) {
	var arr = jules._getAdditionalProperties(value, i, schema);
	var additional_schema = schema[i];
	for(var i = 0; i < arr.length; i++) {
		if(value.hasOwnProperty(arr[i]) && !jules._validate(value[arr[i]], additional_schema))
			return false;
	}
	return true;
};

jules._getAdditionalProperties = function(value, i, schema) {
	var arr = ivar.getProperties(value);
	
	if(schema.hasOwnProperty('properties')) {
		for(var i in schema.properties) {
			arr.remove(i);
		}
	}
	
	if(schema.hasOwnProperty('patternProperties')) {
		for(var i in schema.patternProperties) {
			i = i.toRegExp();
			arr.remove(i);
		}
	}
	return arr;
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
		regex = jules.buildRegExp(schema[i]);	
	return regex.test(value);
};

jules.validator.string.pattern = jules.validator.string.regex;

jules.formats = {}; //date-time YYYY-MM-DDThh:mm:ssZ, date YYYY-MM-DD, time hh:mm:ss, utc-milisec, regex, color, style, phone E.123, uri, url, email, ipv4, ipv6, host-name
jules.formats.email = function(value) {
	return ivar.regex.email.test(value);
};

jules.formats.regex = function(value) {
	return !value.toRegExp() ? false : true;
};

jules.formats.json = function(value) {
	return !value.parseJSON() ? false : true;
};

jules.formats.time = function(value) {
	return ivar.regex.time.test(value);
};

jules.formats.uri = function(value) {
	return ivar.regex.uri.test(value);
};

jules.validator.string.format = function(value, i, schema) {
	return jules.formats[schema[i]](value);
};

jules.validator.string.minLength = jules.validator.min;
jules.validator.string.maxLength = jules.validator.max;

// ====== [Validators]: Number ====== //
ivar.namespace('jules.validator.number');

jules.validator.number.numberRegex = jules.validator.string.regex;
jules.validator.number.numberPattern = jules.validator.string.regex;

jules.validator.number.numberFormat = jules.validator.string.format;

jules.validator.number.minimum = jules.validator.min;
jules.validator.number.maximum = jules.validator.max;

jules.validator.number.exclusiveMinimum = function(value, i, schema) {
	return jules.validator.min(value, 'minimum', schema, schema[i]);
};

jules.validator.number.exclusiveMaximum = function(value, i, schema) {
	return jules.validator.max(value, 'maximum', schema, schema[i]);
};

jules.validator.number.dividableBy = function(value, i, schema) {
	if(schema[i] === 0)
		return false;
	return value%schema[i] === 0;
};
jules.validator.number.multipleOf = jules.validator.number.dividableBy;

// ====== Some utils... ====== //

jules.buildRangeObj = function(val, exclusive) {
	if(ivar.isString(val))
		val = parseFloat(val);
	if(!ivar.isSet(exclusive))
		exclusive = false;
	return ivar.isNumber(val)?{value:val, exclusive: exclusive}:val;
};

jules.buildRegExp = function(val) {
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

jules.getSchema = function(uri, callback) {
	var resp = undefined;
	ivar.request({uri: uri, async:false}, function(response) {
		if(ivar.isSet(response)) {
			try {
				resp = JSON.parse(response);
			} catch(e) {
				jules.error('Invalid Schema JSON syntax - ' + e);
			}
		} else {
			jules.error('Reference not accessible');
		}
	});
	callback(resp);
};
