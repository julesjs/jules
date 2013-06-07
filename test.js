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
		max: [{type: 'object', value: 4, exclusive: false}],
		
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
			then: {max:[{type: 'object', value: 4, exclusive: false}]},
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

//TEST
ivar.echo(jules.validate({lol:6, rofl:2, omg:4, foo:'a'}, schema));
