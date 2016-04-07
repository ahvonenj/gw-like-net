function Netnode(net, tex, x, y)
{
	this.net = net;

	this.ox = x;
	this.oy = y;

	this.x = x;
	this.y = y;

	this.velocity = 
	{
		x: 0,
		y: 0
	}

	this.acceleration = 
	{
		x: 0,
		y: 0
	}

	this.friends = [];
	this.friendgraphics = [];

	this.blasted = false;
	this.affected = false;
	this.blastenergy = Global.blastenergy;


	this.tex = tex;
	this.sprite = new PIXI.Sprite(this.tex);

	this.sprite.position.x = this.x;
	this.sprite.position.y = this.y;
	this.sprite.anchor = new PIXI.Point(0.5, 0.5);

	this.net.stage.addChild(this.sprite);
}

Netnode.prototype.addFriend = function(dir, netnode)
{
	switch(dir)
	{
		case 'up':
			this.friends[0] = netnode;
			break;

		case 'right':
			this.friends[1] = netnode;
			break;

		case 'down':
			this.friends[2] = netnode;
			break;

		case 'left':
			this.friends[3] = netnode;
			break;

		default:
			break;
	}
	this.friends.push(netnode);
}

Netnode.prototype.getFriend = function(dir)
{
	var n = null;

	switch(dir)
	{
		case 'up':
			n = this.friends[0];
			break;

		case 'right':
			n = this.friends[1];
			break;

		case 'down':
			n = this.friends[2];
			break;

		case 'left':
			n = this.friends[3];
			break;

		default:
			n = null;
			break;
	}

	return n;
}

Netnode.prototype.update = function(dt)
{
	if(this.blasted)
	{
		var vs;
		
		var vn = new Victor(this.x, this.y);
		var vo = new Victor(this.ox, this.oy);

		if(vn.distance(vo) > 0)
		{
			var sa = Math.atan2(vo.y - vn.y, vo.x - vn.x);


			vs = new Victor();
			
			vs.x = Math.cos(sa);
			vs.y = Math.sin(sa);

		
			var vonormal = vo.normalize();
			var vnnormal = vn.normalize();
			var dot = vnnormal.dot(vonormal);

			//vs = vs.invert();
		}
		else
		{
			vs = new Victor(0, 0);
		}



		this.acceleration.x += vs.x * Global.spanningforce;
		this.acceleration.y += vs.y * Global.spanningforce;

		this.acceleration.x += -vs.x * 10000.005;
		this.acceleration.y += -vs.y * 10000.005;


		this.velocity.x += this.acceleration.x;
		this.velocity.y += this.acceleration.y;

		

		if(this.velocity.x > Global.maxvel)
			this.velocity.x = Global.maxvel;

		if(this.velocity.x < -Global.maxvel)
			this.velocity.x = -Global.maxvel;

		if(this.velocity.y > Global.maxvel)
			this.velocity.y = Global.maxvel;

		if(this.velocity.y < -Global.maxvel)
			this.velocity.y = -Global.maxvel;

		this.x += this.velocity.x * dt;
		this.y += this.velocity.y * dt;

		/*if(vn.distance(vo) < 0.000001)
		{
			this.x = this.ox;
			this.y = this.oy;
			this.acceleration.x = 0;
			this.acceleration.y = 0;
			this.velocity.x = 0;
			this.velocity.y = 0;
		}*/

		var vos = new Victor(Math.cos(this.acceleration.x), Math.sin(this.acceleration.y));
	}

	if(this.sprite !== null)
	{
		this.sprite.position.x = this.x;
		this.sprite.position.y = this.y;
	}
}

Netnode.prototype.applyForce = function(a)
{
	var self = this;

	var v = new Victor(Math.cos(a) * Global.blastforce, Math.sin(a) * Global.blastforce);

	/*if(Math.cos(a) > 0 || Math.cos(a) < Math.PI / 2)
	{
		v.invertX();
	}

	if(Math.sin(a) > 0 || Math.sin(a) < Math.PI / 2)
	{
		v.invertY();
	}*/

	this.vv = v;

	this.acceleration.x = v.x;
	this.acceleration.y = v.y;

	/*PixiDebugger.DebugVector({ x: this.ox, y: this.oy }, { x: v.x, y: v.y }, null, null, null, function(dt, t, o, v)
	{
		this.moveTo(self.ox, self.oy);
		this.lineTo(self.vv.x, self.vv.y);
	})*/

	/*PixiDebugger.DebugVector({ x: this.ox, y: this.oy }, { x: this.x, y: this.y }, null, null, null, function(dt, t, o, v)
	{
		var vo = new Victor(self.ox, self.oy);
		var vn = new Victor(self.x, self.y);

		var sa = Math.atan2(vn.y - vo.y, vn.x - vo.x);
		vs = new Victor();

	
		vs.x = Math.cos(sa);
		vs.y = Math.sin(sa);

		var vonormal = vo.normalize();
		var vnnormal = vn.normalize();
		var dot = vnnormal.dot(vonormal);

		var fv = new Victor(vs.x * Global.spanningforce * 1000, vs.y * Global.spanningforce * 1000);

		if(Math.cos(sa) > 0 || Math.cos(sa) < Math.PI / 2)
			fv.invertX();

		if(Math.sin(sa) > 0 || Math.sin(sa) < Math.PI / 2)
			fv.invertY();

		/*if(Math.sin(sa) > 0)
			fv.invertY();*/

		/*this.moveTo(self.ox, self.oy);
		this.lineTo(self.x, self.y);*/

		/*this.moveTo(self.ox, self.oy);
		this.lineStyle(4, 0x00FF00, 1);
		this.lineTo(self.ox + vs.x * 20, self.oy + vs.y * 20);

		this.moveTo(self.ox, self.oy);
		this.lineStyle(2, 0xFFFF00, 1);
		this.lineTo(self.ox + fv.x, self.oy + fv.y);*/

		/*this.moveTo(self.x, self.y);
		this.lineStyle(4, 0x00FFFF, 0.5);
		this.lineTo(self.x + Math.cos(self.acceleration.x) * self.acceleration.x * 100, self.y + Math.sin(self.acceleration.y) * self.acceleration.y * 100);*/
	//});

	//console.log('applying force', this.velocity.x, this.velocity.y);
}