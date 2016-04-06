function Netnode(net, tex, x, y)
{
	this.net = net;

	this.x = x;
	this.y = y;


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
	this.x += 5 * dt;
	this.y += 5 * dt;

	if(this.sprite !== null)
	{
		this.sprite.position.x = this.x;
		this.sprite.position.y = this.y;
	}
}