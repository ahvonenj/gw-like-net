function timestamp()
{
	return window.performance && window.performance.now ? window.performance.now() : new Date().getTime();
}

function Net()
{
	var self = this;

	this.stage = new PIXI.Container();
	this.renderer = PIXI.autoDetectRenderer(Global.width, Global.height, 
	{ 
		view: document.querySelector('canvas'),
		backgroundColor: 0x000000,
		antialias: true
	});

	Global.stageoffset = 
	{
		x: $(canvas).offset().left,
		y: $(canvas).offset().top
	}

	this.t = 
	{
		now: null,
		acc: 0,
		dt: 0.01,
		last: 0,
		step: 1/60,
		time: 0,
		ft: 0
	};

	this.stats = new Stats();
	this.stats.setMode(0);

	this.stats.domElement.style.position = 'absolute';
	this.stats.domElement.style.left = '0px';
	this.stats.domElement.style.top = '0px';

	document.body.appendChild(this.stats.domElement);


	// Init gameobject

	this.gameobjects = [];

	

    // Init net
    this.gwnet = new GwNet(this);


    this.blastivl = null;


    this.stage.interactive = true;

    this.stage.on('mousemove', function(data)
	{
		var evt = data.data.originalEvent;

		Global.mouse.x = evt.clientX - Global.stageoffset.x;
		Global.mouse.y = evt.clientY - Global.stageoffset.y;
	});

	this.stage.on('mousedown', function(data)
	{
		var evt = data.data.originalEvent;
		Global.mouse.isdown = true;
		Global.mouse.isup = false;

		var x = evt.clientX - Global.stageoffset.x;
		var y = evt.clientY - Global.stageoffset.y;

		self.blastivl = setInterval(function()
		{
			//self.blastNodes(Global.mouse.x, Global.mouse.y);
		}, Global.blastrate)
	});

	this.stage.on('mouseup', function(data)
	{
		var evt = data.data.originalEvent;
		Global.mouse.isdown = false;
		Global.mouse.isup = true;

		clearInterval(self.blastivl);
	});

	this.stage.on('click', function(data)
	{
		var evt = data.data.originalEvent;
		var vx = evt.clientX - Global.stageoffset.x;
		var vy = evt.clientY - Global.stageoffset.y;

		self.blastNodes(vx, vy);
	});

	this.stage.on('tap', function(data)
	{
		var evt = data.data.originalEvent;
		var vx = data.data.global.x;
		var vy = data.data.global.y;

		self.blastNodes(vx, vy);
	});

	this.clickhack = new PIXI.Graphics();
	this.clickhack.clear();
    this.clickhack.beginFill(0xffffff, 0);
    this.clickhack.drawRect(0, 0, Global.width, Global.height)
    this.clickhack.endFill();   

    this.stage.addChild(this.clickhack);

    PixiDebugger.SetProgram(this);
}

Net.prototype.start = function()
{
	var self = this;

	Global.stageoffset = 
	{
		x: $(canvas).offset().left,
		y: $(canvas).offset().top
	}

	/*PixiDebugger.DebugPoint(10, 10, null, null, null, function(dt, t)
	{
		this.position.x += dt;
		this.position.y += dt;
	});

	PixiDebugger.DebugLine(100, 100, 200, 200, null, null, null, function(dt, t)
	{
		this.clear();
		this.lineStyle(3, 0xFF00FF, 1);
		this.moveTo(100 + Math.cos(t) * 2000 * dt, 100 + Math.sin(t) * 2000 * dt)
		this.lineTo(300 + Math.cos(t / 10) * 1000 * dt, 300 + Math.sin(t / 10) * 1000 * dt)
	});*/

	requestAnimationFrame(function(t) { self.animate(self); });
}

Net.prototype.animate = function(net)
{
	this.stats.begin();

	net.t.now = timestamp();
	net.t.ft = net.t.now - net.t.last;

	if(net.t.ft > 0.25)
		net.t.ft = 0.25;

	net.t.last = net.t.now; 
	net.t.acc += net.t.ft;

	while(net.t.acc >= net.t.dt) 
	{
		net.update(net.t.dt, net.t.time);

		net.t.time += net.t.dt;
		net.t.acc -= net.t.dt;
	}

	net.render();
	this.stats.end();

	requestAnimationFrame(function(t) { net.animate(net); });
}

Net.prototype.update = function(dt, t)
{
	this.gwnet.update(dt, t);
	Lerppu.update(t);
	PixiDebugger.UpdateDebugState(dt, t);
}

Net.prototype.render = function()
{
	this.gwnet.draw();
	this.renderer.render(this.stage);
}

Net.prototype.blastNodes = function(mx, my)
{
	//console.log('Blast!');

	var nodes = this.gwnet.nodesInRadius(mx, my);

	for(var i = 0; i < nodes.length; i++)
	{
		var node = nodes[i];

		//node.color = 0x00FFFF;

		var vn = new Victor(node.x, node.y);
		var vm = new Victor(mx, my);

		node.blasted = true;
		node.blastenergy = Global.blastenergy;
		node.reachedterminaldistance = false;

		if(Math.floor(vm.distance(vn)) >= Math.ceil(Global.forceradius - Global.forceedge))
		{
			//node.color = 0xff0000;

			var affectednodes = this.gwnet.affectedNodes(node);

			for(var j = 0; j < affectednodes.length; j++)
			{
				affectednodes[j].color = 0x9b59b6;
			}
		}

		var angleRadians = Math.atan2(vn.y - vm.y, vn.x - vm.x);

		var randomAngle = chance.floating({min: -10, max: 10});

		angleRadians += (randomAngle * (Math.PI / 180));

		node.applyForce(angleRadians);
	}

	//console.log(nodes);
}