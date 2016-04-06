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


	// Init gameobject

	this.gameobjects = [];

	

    // Init net
    this.gwnet = new GwNet(this);


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
	});

	this.stage.on('mouseup', function(data)
	{
		var evt = data.data.originalEvent;
		Global.mouse.isdown = false;
		Global.mouse.isup = true;
	});

	this.stage.on('click', function(data)
	{
		var evt = data.data.originalEvent;
		var vx = evt.clientX - Global.stageoffset.x;
		var vy = evt.clientY - Global.stageoffset.y;

		self.blastNodes(vx, vy);
	});

	this.clickhack = new PIXI.Graphics();
	this.clickhack.clear();
    this.clickhack.beginFill(0xffffff, 0);
    this.clickhack.drawRect(0, 0, Global.width, Global.height)
    this.clickhack.endFill();   

    this.stage.addChild(this.clickhack);
}

Net.prototype.start = function()
{
	var self = this;

	Global.stageoffset = 
	{
		x: $(canvas).offset().left,
		y: $(canvas).offset().top
	}


	requestAnimationFrame(function(t) { self.animate(self); });
}

Net.prototype.animate = function(net)
{
	net.t.now = timestamp();
	net.t.ft = net.t.now - net.t.last;

	if(net.t.ft > 0.25)
		net.t.ft = 0.25;

	net.t.last = net.t.now; 
	net.t.acc += net.t.ft;

	while(net.t.acc >= net.t.dt) 
	{
		net.update(net.t.dt);

		net.t.time += net.t.dt;
		net.t.acc -= net.t.dt;
	}

	net.render();
	requestAnimationFrame(function(t) { net.animate(net); });
}

Net.prototype.update = function(dt)
{
	this.gwnet.update(dt);

	Lerppu.update(this.t.time);
}

Net.prototype.render = function()
{
	this.gwnet.draw();
	this.renderer.render(this.stage);
}

Net.prototype.blastNodes = function(mx, my)
{
	console.log('Blast!');

	var nodes = this.gwnet.nodesInRadius(mx, my);

	for(var i = 0; i < nodes.length; i++)
	{
		var node = nodes[i];

		var vn = new Victor(node.x, node.y);
		var vm = new Victor(mx, my);

		var angleRadians = Math.atan2(vm.y - vn.y, vm.x - vn.x);

		node.applyForce(angleRadians);
	}

	console.log(nodes);
}