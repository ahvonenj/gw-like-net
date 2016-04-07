var PixiDebugger =
{
	program: null,

	debugobjects: [],
	namedobjects: [],

	// Program must be set for PixiDebugger before use
	// Program is an object that contains pixi.stage and pixi.renderer
	SetProgram: function(p)
	{
		PixiDebugger.program = p;
	},

	HasProgram: function()
	{
		if(PixiDebugger.program !== null)
		{
			return true;
		}
		else
		{
			console.log('PixiDebugger: No program set for rendering debug graphics!');
			return false;
		}
	},

	UpdateDebugState: function(dt, t)
	{
		for(var i = 0; i < PixiDebugger.debugobjects.length; i++)
		{
			var obj = PixiDebugger.debugobjects[i];
			var debugdata = obj.debugdata;

			switch(debugdata.type)
			{
				case 'point':
				case 'line':
					debugdata.update.call(obj, dt, t);
					break;
				case 'vector':
					obj.clear();
					obj.lineStyle(debugdata.width, debugdata.color, 1);
					debugdata.update.call(obj, dt, t);
			}
		}

		for(var key in PixiDebugger.namedobjects)
		{
			if(PixiDebugger.namedobjects.hasOwnProperty(key))
			{
				var obj = PixiDebugger.namedobjects[key];
				var debugdata = obj.debugdata;

				switch(debugdata.type)
				{
					case 'point':
					case 'line':
						debugdata.update.call(obj, dt, t);
						break;
					case 'vector':
						obj.clear();
						obj.lineStyle(debugdata.width, debugdata.color, 1);
						debugdata.update.call(obj, dt, t);
				}

			}
		}
	},

	DebugPoint: function(x, y, radius, color, name, callback)
	{
		if(!PixiDebugger.HasProgram)
			return;

		if(name && PixiDebugger.namedobjects.indexOf(name) > -1)
			return;

		x = x || 0;
		y = y || 0;
		radius = radius || 3;
		color = color || 0xFF00FF;
		name = name || null;
		callback = callback || function(dt, t) { };	

		var dbgg = new PIXI.Graphics();
		dbgg.clear();
		dbgg.beginFill(color, 1);
		dbgg.drawCircle(999999, 999999, radius);
		dbgg.endFill();   

		var dbgsprite = new PIXI.Sprite(dbgg.generateTexture());

		dbgsprite.anchor = new PIXI.Point(0.5, 0.5);
		
		dbgsprite.debugdata = 
		{
			update: callback,
			type: 'point',
			radius: radius,
			color: color
		}

		PixiDebugger.program.stage.addChild(dbgsprite);
		
		if(name)
		{
			PixiDebugger.namedobjects[name] = dbgsprite;
		}
		else
		{
			PixiDebugger.debugobjects.push(dbgsprite);
		}
	},

	DebugLine: function(x1, y1, x2, y2, width, color, name, callback)
	{
		if(!PixiDebugger.HasProgram)
			return;

		if(name && PixiDebugger.namedobjects.indexOf(name) > -1)
			return;

		x1 = x1 || 0;
		y1 = y1 || 0;
		x2 = x2 || 0;
		y2 = y2 || 0;
		width = width || 3;
		color = color || 0xFF00FF;
		name = name || null;
		callback = callback || function(dt, t) { };	

		var dbgg = new PIXI.Graphics();
		dbgg.clear();
		dbgg.lineStyle(width, color, 1);
		dbgg.moveTo(x1, y1);
		dbgg.lineTo(x2, y2); 

		dbgg.debugdata = 
		{
			update: callback,
			type: 'line',
			width: width,
			color: color
		}

		PixiDebugger.program.stage.addChild(dbgg);
		
		if(name)
		{
			PixiDebugger.namedobjects[name] = dbgg;
		}
		else
		{
			PixiDebugger.debugobjects.push(dbgg);
		}
	},

	DebugVector: function(origin, vector, width, color, name, callback)
	{

		if(!PixiDebugger.HasProgram)
			return;

		name = name || null;

		if(PixiDebugger.namedobjects.indexOf(name) > -1)
			return;

		origin.x = origin.x || 0;
		origin.y = origin.y || 0;
		vector.x = vector.x || 0;
		vector.y = vector.y || 0;
		width = width || 3;
		color = color || 0xFF00FF;
		callback = callback || function(dt, t, origin, vector) { };	

		var dbgg = new PIXI.Graphics();
		dbgg.clear();
		dbgg.lineStyle(width, color, 1);
		dbgg.moveTo(origin.x, origin.y);
		dbgg.lineTo(vector.x, vector.y); 

		dbgg.debugdata = 
		{
			update: callback,
			type: 'vector',
			width: width,
			color: color,
			origin: origin,
			vector: vector
		}

		PixiDebugger.program.stage.addChild(dbgg);

		if(name)
		{

			PixiDebugger.namedobjects[name] = dbgg;
		}
		else
		{
			PixiDebugger.debugobjects.push(dbgg);
		}
	}
}

var PD = PixiDebugger;