function GwNet(net)
{
	this.net = net;

	this.netg = new PIXI.Graphics();
	this.netg.clear();
    this.netg.beginFill(0x3498db, 1);
    this.netg.drawCircle(999999, 999999, Global.noderad);
    this.netg.endFill();   

    this.nettex = this.netg.generateTexture();

    this.flg = new PIXI.Graphics();
    this.net.stage.addChild(this.flg);



    this.netresolution = Global.width / Global.netpoints - 1;

	this.netnodes = [];

	var prevnode = null;
	var prevrow = null;

	for(var y = 0; y < Global.height / this.netresolution; y++)
	{
		var noderow = [];

		for(var x = 0; x < Global.width / this.netresolution; x++)
		{
			var nx = x * this.netresolution;
			var ny = y * this.netresolution;

			var node = new Netnode(this.net, this.nettex, nx + Global.noderad * 2, ny + Global.noderad * 2);

			if(x > 0)
			{
				node.addFriend('left', noderow[x - 1]);
			}

			if(typeof noderow[x + 1] !== 'undefined')
			{
				
			}

			if(y > 0)
			{
				node.addFriend('up', this.netnodes[y - 1][x]);
			}

			if(typeof this.netnodes[y + 1] !== 'undefined')
			{
				node.addFriend('down', this.netnodes[y + 1][x]);
			}

			if(prevnode !== null)
			{
				prevnode.addFriend('right', node);
			}

			if(prevrow !== null)
			{
				prevrow[x].addFriend('down', node);
			}

			prevnode = node;

			noderow.push(node);
		}

		prevrow = noderow;
		this.netnodes.push(noderow);
	}
}

GwNet.prototype.update = function(dt)
{
	for(var y = 0; y < this.netnodes.length; y++)
	{
		for(var x = 0; x < this.netnodes[y].length; x++)
		{
			var node = this.netnodes[y][x];

			node.update(dt);
		}
	}
}

GwNet.prototype.draw = function()
{
	this.flg.clear();
    //this.flg.beginFill(0x00FF00, 1);
    this.flg.lineStyle(1, 0x2980b9, 1);

	for(var y = 0; y < this.netnodes.length; y++)
	{
		for(var x = 0; x < this.netnodes[y].length; x++)
		{
			var node = this.netnodes[y][x];
			
			this.flg.moveTo(node.x, node.y);

			if(node.friends[0])
			{
				this.flg.lineTo(node.friends[0].x, node.friends[0].y);
			}

			this.flg.moveTo(node.x, node.y);

			if(node.friends[3])
			{
				this.flg.lineTo(node.friends[3].x, node.friends[3].y);
			}

		}
	}

	this.flg.endFill();  
}

GwNet.prototype.nodesInRadius = function(mx, my)
{
	var nodes = [];

	for(var y = 0; y < this.netnodes.length; y++)
	{
		for(var x = 0; x < this.netnodes[y].length; x++)
		{
			var node = this.netnodes[y][x];

			var vm = new Victor(mx, my);
			var vn = new Victor(node.x, node.y);

			if(vm.distance(vn) <= Global.forceradius)
			{
				nodes.push(node);
			}
		}
	}

	return nodes;
}

GwNet.prototype.affectedNodes = function(node)
{
	var initialnode = node;
	var affectednodes = [];

	if(node.blastenergy === 0)
		return [];

	var e = initialnode.blastenergy;
	var node = initialnode.getFriend('up');

	while(e > 0 && node !== null && typeof node !== 'undefined')
	{
		affectednodes.push(node);
		node = node.getFriend('up');
		e -= Global.energyconsumption;
	}

	var node = initialnode.getFriend('right');
	e = initialnode.blastenergy;

	while(e > 0 && node !== null && typeof node !== 'undefined')
	{
		affectednodes.push(node);
		node = node.getFriend('right');
		e -= Global.energyconsumption;
	}


	var node = initialnode.getFriend('down');
	e = initialnode.blastenergy;

	while(e > 0 && node !== null && typeof node !== 'undefined')
	{
		affectednodes.push(node);
		node = node.getFriend('down');
		e -= Global.energyconsumption;
	}


	var node = initialnode.getFriend('left');
	e = initialnode.blastenergy;

	while(e > 0 && node !== null && typeof node !== 'undefined')
	{
		affectednodes.push(node);
		node = node.getFriend('left');
		e -= Global.energyconsumption;
	}

	return affectednodes;
}