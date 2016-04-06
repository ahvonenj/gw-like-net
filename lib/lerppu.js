var Lerppu = 
{
	time: 0, // Program / game elapsed time
	lerps: [],

	interpolate: function(v0, v1, t, f, easing, id, callback)
	{
		var self = this;

		var multiple = null; // Does v0 have multiple values to interpolate
		var nto1 = null; // Do v0 values have corresponding v1 or is there only one v1

		if(Object.prototype.toString.call(v0) === '[object Array]') 
		{
			multiple = true;

			if(Object.prototype.toString.call(v1) === '[object Array]' && v0.length === v1.length) 
			{
				nto1 = false;
			}
			else
			{
				nto1 = true;
			}
		}

		var id = id || null;
		var callback = callback || function() {};

		var lerp = 
		{
			v0: v0,
			v1: v1,
			t: t,
			st: self.time,
			f: f,
			easing: easing,
			id: id,
			callback: callback,
			complete: false,
			multiple: multiple,
			nto1: nto1
		}

		this.lerps.push(lerp);

		return lerp;
	},

	update: function(time)
	{
		var self = this;

		self.time = time;

		for(var i = 0; i < this.lerps.length; i++)
		{
			var lerp = this.lerps[i];
			var ct = Math.min((self.time - lerp.st) / lerp.t, 1);

			if(lerp.multiple)
			{
				var lr = [];

				if(lerp.nto1)
				{
					lerp.v0.forEach(function(v, i)
					{
						lr.push(lerp.easing(v, lerp.v1, ct));
					});
				}
				else
				{
					for(var j = 0; j < lerp.v0.length; j++)
					{
						lr.push(lerp.easing(lerp.v0[j], lerp.v1[j], ct));
					}
				}
			}
			else
			{
				var lr = lerp.easing(lerp.v0, lerp.v1, ct);
			}

			lerp.f(lr);

			if(ct >= 1)
			{
				lerp.callback();
				lerp.complete = true;
				self.lerps.splice(i, 1);
				continue;
			}
		}
	},

	interrupt: function(lerptointerrupt)
	{
		for(var i = 0; i < this.lerps.length; i++)
		{
			var lerp = this.lerps[i];

			if(lerp.id !== null && lerp.id === lerptointerrupt)
			{
				this.lerps.splice(i, 1);
				break;
			}
			else
			{
				continue;
			}
		}
	},

	find: function(id)
	{
		if(this.lerps.length === 0 || 
		this.lerps.indexOf(id) === -1 || 
		typeof this.lerps[id] === 'undefined')
		{
			return null;
		}
		else
		{
			return this.lerps[id];
		}
	},

	easings:
	{

		linear: function(v0, v1, t) 
		{
			return v0 + t * (v1 - v0);
		},

		// Accurate
		accurateLinear: function(v0, v1, t) 
		{
	  		return (1 - t) * v0 + t * v1;
		},

		easeInQuad: function (v0, v1, t) 
		{ 
			return (v1 - v0) * (t*t) + v0; 
		},

		// decelerating to zero velocity
		easeOutQuad: function (v0, v1, t) 
		{ 
			return (v1 - v0) * (t*(2-t)) + v0; 
		},

		// acceleration until halfway, then deceleration
		easeInOutQuad: function (v0, v1, t) 
		{ 
			return t<.5 ? (v1 - v0) * (2*t*t) + v0 : (v1 - v0) * (-1+(4-2*t)*t) + v0; 
		},

		// accelerating from zero velocity 
		easeInCubic: function (v0, v1, t) 
		{ 
			return (v1 - v0) * (t*t*t) + v0; 
		},

		// decelerating to zero velocity 
		easeOutCubic: function (v0, v1, t) 
		{ 
			return (v1 - v0) * ((--t)*t*t+1) + v0;
		},

		// acceleration until halfway, then deceleration 
		easeInOutCubic: function (v0, v1, t) 
		{ 
			return t<.5 ? (v1 - v0) * (4*t*t*t) + v0 : (v1 - v0) * ((t-1)*(2*t-2)*(2*t-2)+1) + v0; 
		},

		// accelerating from zero velocity 
		easeInQuart: function (v0, v1, t) 
		{ 
			return (v1 - v0) * (t*t*t*t) + v0; 
		},

		// decelerating to zero velocity 
		easeOutQuart: function (v0, v1, t) 
		{
	    	return (v1 - v0) * (1-(--t)*t*t*t) + v0;
		},

		// acceleration until halfway, then deceleration
		easeInOutQuart: function (v0, v1, t) 
		{ 
			return t<.5 ? (v1 - v0) * (8*t*t*t*t) + v0 : (v1 - v0) * (1-8*(--t)*t*t*t) + v0; 
		},

		// accelerating from zero velocity
		easeInQuint: function (v0, v1, t) 
		{ 
			return (v1 - v0) * (t*t*t*t*t) + v0; 
		},

		// decelerating to zero velocity
		easeOutQuint: function (v0, v1, t) 
		{ 
			return (v1 - v0) * (1+(--t)*t*t*t*t) + v0;
		},

		// acceleration until halfway, then deceleration 
		easeInOutQuint: function (v0, v1, t) 
		{ 
			return t<.5 ? (v1 - v0) * (16*t*t*t*t*t) + v0 : (v1 - v0) * (1+16*(--t)*t*t*t*t) + v0;
		}
	}
}


// Aliases
Lerppu.lerp = Lerppu.interpolate;
Lerppu.ip = Lerppu.interpolate;
Lerppu.stop = Lerppu.interrupt;

Lerppu.easings.lerp = Lerppu.easings.linear;
Lerppu.easings.lerp2 = Lerppu.easings.accurateLinear;