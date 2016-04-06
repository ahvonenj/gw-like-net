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
	}
	this.friends.push(netnode);
}

Netnode.prototype.update = function(dt)
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

		if(dot < 0)
		{
			vs.invertX();
		}

		/*if(vn.y > vo.y)
		{
			vs.invertY();
		}*/
	}
	else
	{
		vs = new Victor(0, 0);
	}


	

	this.acceleration.x += vs.x * Global.spanningforce * vo.distance(vn);
	this.acceleration.y += vs.y * Global.spanningforce;



	this.acceleration.x -= Global.decceleration;
	this.acceleration.y -= Global.decceleration;

	if(this.acceleration.x > 1)
		this.acceleration.x = 1;

	if(this.acceleration.y > 1)
		this.acceleration.y = 1;

	this.velocity.x += this.acceleration.x;
	//this.velocity.y += this.acceleration.y;

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



	if(this.sprite !== null)
	{
		this.sprite.position.x = this.x;
		this.sprite.position.y = this.y;
	}
}

Netnode.prototype.applyForce = function(a)
{
	var v = new Victor(Math.cos(a) * Global.blastforce, Math.sin(a) * Global.blastforce).invert();
	this.acceleration.x = v.x;
	this.acceleration.y = v.y;

	console.log('applying force', this.velocity.x, this.velocity.y);
}