
var VariableSpeedInterval = function(rate,func) {
	this.rate = rate
	this.on = true;
	this.event = func ? func : function() { };
	this.pulse = function() {
		if (this.on) {
    //  var diff = new Date().getTime() - this.time.last
    //  var wander = diff - this.rate
    //  this.time.tempRate = this.rate - wander
    //  this.time.tempRate = (this.rate + this.time.tempRate) / 2
		//	this.time.last = new Date().getTime()
			this.event();
			this.timeout = setTimeout(this.pulse.bind(this),this.rate)
		}
	}
	this.stop = function() {
		this.on = false;
	}
	this.start = function() {
		this.on = true;
		this.pulse();
	}
	this.time = {
		last: false,
		cur: false,
    tempRate: this.rate
	}
	this.ms = function(newrate) {
		var oldrate = this.rate;
		this.rate = newrate;

		this.time.cur = new Date().getTime()
		if (this.time.cur - this.time.last > newrate) {
			clearTimeout(this.timeout)
			this.pulse();
		} else if (newrate < oldrate) {
			clearTimeout(this.timeout)
			var delay = this.rate - (this.time.cur - this.time.last);
			if (delay < 0 ) { delay = 0 }
			this.timeout = setTimeout(this.pulse.bind(this),delay)
		}
	}
	this.start();
}

var interval = function(rate,func) {
	var _int = new VariableSpeedInterval(rate,func)
	return _int;
}
