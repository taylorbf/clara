
/* DEFINE MUSICAL INFO */
var scale = [0,1,2,3,4,5,6,7,8,9,10,11]
var range = scale.length * 5
var base = 36
mode = [0,2,4,5,7,9,11]

/* DEFINE VIZ info */
var activeNotes = []
var a,b,c,d,e,f,g

/* Get DOM elements */
var codeeditor = document.getElementById("codeeditor")

/* TRANSFORMS DATA INTO A SERIES OF MUSICAL EVENTS */
var melody = function() {
	var arr = []
	if ( typeof arguments[0] == "string" ) {
		return new Melody( dtm.gen(arguments[0]) )
	} else {
		return new Melody( dtm.data(Array.from(arguments)) )
	}
}

var DTMeval = eval.bind(false,dtm)
function DTMeval(code) {
	console.log(code)
	return eval(code)
}

function Melody(code) {
	this.code = code
	console.log(code)
//	this.arr = DTMeval.call(dtm,this.code)
/*	this.arr = function(str){
		console.log(this)
  	return eval(str);
	}.call(dtm,code); */
	this.arr = eval("with (dtm) {"+code+"}")
	this.temp = this.arr
	this.notes = this.arr.get()
	this.next = function() {
		if (this.notes.length<=0) {
			this.arr = eval("with (dtm) {"+code+"}")
			this.notes = this.arr.get()
		}
		var note = this.notes.slice(0,1)
		this.notes = this.notes.slice(1)
		if (Array.isArray(note)) {
			var group = note[0].get()
		} else {
			var group = [ note ]
		}
		for (var i=0;i<group.length;i++) {
			note = group[i]
			if (note > 0) {
				note = Math.floor(note)
				note = indexToNote(note)
				this.playNote(note)
			}
		}
	}
	this.playNote = function(note) {
	//	console.log("playing",note)

		var geometry = new THREE.Geometry();

		xloc += 1
		particle = new THREE.Sprite( material );
		particle.position.x = camera.position.x + 100
		particle.position.y = note/2;
		particle.position.z = 0;
		geometry.vertices.push( particle.position );

		particle2 = new THREE.Sprite( material );
		particle2.position.x = camera.position.x + 100 + 1
		particle2.position.y = note/2;
		particle2.position.z = 0;
	//	scene.add( particle );
	//	scene.add( particle2 );
		geometry.vertices.push( particle2.position );

		var line = new THREE.Line( geometry, new THREE.LineBasicMaterial( { color: 0xffffff, opacity: 1, linewidth: 2, linecap: "round"  } ) );
		scene.add( line );


		var velocity = 0.01
		var duration = 3
		var time = 0
		piano.keyDown(note, velocity).keyUp(note, duration)
		activeNotes.push(note)
		setTimeout("activeNotes.splice(activeNotes.indexOf("+note+"),1)",duration*1000)
	}
	this.kill = function() {
		this.cycle.kill()
	}
	this.ms = function(newms) {
		this.interval.ms(newms)
	}
	this.interval = mt.interval(200,this.next.bind(this))
}



var melodies = []
melodies[0] = {
	code: {},
	engine: false
}

function evalCode() {
	var code = codeeditor.value
  code = code.split("\n")
	for (var i=0;i<code.length;i++) {
		key = code[i].substring(0,code[i].indexOf(":"))
		value = code[i].substring(code[i].indexOf(": ")+2)
		melodies[0].code[key] = value
	}
	console.log(melodies[0].code)
	melodies[0].engine = new Melody(melodies[0].code.pitch)
/*	try {
		eval("with (dtm) { phrase = "+code+"}")
		console.log(phrase)
	} catch(e) {
		console.log(e)
	} */
}






/* KEYBOARD VIS */

viz = document.getElementById("viz")
ctx = viz.getContext("2d")
viz.width = 700
viz.height = 100;
viz.style.width = "700px";
viz.style.height = "100px";

codeeditor.addEventListener("keyup",function(e) {
	if (e.which!=13) {
	//	vizCode()
	} else {
		return false
	}
})
codeeditor.addEventListener("keydown",function(e) {
	if (e.which==13) {
		evalCode()
		e.preventDefault()
		colorItBlue()
		return false;
	}
})

function colorItBlue() {
	codeeditor.style.backgroundColor = "#1ce"
	codeeditor.style.color = "#333"
	setTimeout(function() {
		codeeditor.style.backgroundColor = "transparent"
		codeeditor.style.color = "#1ce"
	}, 40)
}

function vizCode() {
	code = codeeditor.value
	var tempmelody = false
	try {
			tempmelody = false
		tempmelody = eval(code)
		tempmelody = tempmelody.temp
	} catch(e) {
		return
	}
	if (tempmelody) {
		with (ctx) {
			clearRect(0,0,viz.width,viz.height)
			arr = tempmelody.get()
			for (var i=0;i<arr.length;i++) {
				if (typeof arr[i] === "function" ) {
					var group = arr[i].get()
				} else {
					var group = [ arr[i] ]
				}
				for (var j=0;j<group.length;j++) {
					note = group[j]
					if (note>0) {
						fillStyle = "#1ce"
						var w = (viz.width / arr.length) / group.length
						w = w > 40 ? 40 : w;
						var x = i * (viz.width / arr.length)
						var y = ((range - note)/range) * viz.height
						x *= ( (viz.width-10) / viz.width )
						x += 20
						y *= ( (viz.height-10) / viz.height )
						y += 20
						beginPath()
						ellipse(x,y,w/2,w/2,0,0,Math.PI*2)
						fill()
						closePath()
					}
				}
			}
		}
	}
}

vizCode()
/*
nx.onload = function() {
	nx.colorize("fill","#222")
	nx.colorize("accent","#1be")
	nx.colorize("white","#000")
	nx.colorize("black","#333")
	nx.colorize("border","#000")
	keyviz.octaves = 5
	keyviz.colors.keydownw = "#1be"
	keyviz.colors.keydownb = "#1be"
	keyviz.init()
	//db.setup(Tone.Context,Tone.Master)
	setInterval(updateKeyboard,100)
}
*/

function updateKeyboard() {
	for (var i=0;i<keyviz.keys.length;i++) {
		keyviz.toggle( keyviz.keys[i], false )
	}
	for (var i=0;i<activeNotes.length;i++) {
		var note = activeNotes[i] - base
		keyviz.toggle( keyviz.keys[ note ], true )
	}
}



/* CYCLE VIZ */

var Cycle = function(arr) {
	this.data = arr
	this.parent = document.getElementById("cycles")
	this.canvas = document.createElement("canvas")
	this.ctx = this.canvas.getContext("2d")
	this.diameter = 75
	this.canvas.height = this.diameter
	this.canvas.width = this.diameter
	this.canvas.style.width = this.diameter + "px"
	this.canvas.style.height = this.diameter + "px"
	this.canvas.className = "cycle"
	this.parent.appendChild(this.canvas)
	this.drawmelody = function() {
		with(this.ctx) {
			fillStyle = "#000"
			fillRect(0,0,this.canvas.width,this.canvas.height)
			beginPath()
			fillStyle="#1ce"
			for (var i=0;i<this.data.length;i++) {
				var r = (this.diameter/2 - 15) * (this.data[i]/range) + 6
				var angle = (Math.PI * 2) - ( i / this.data.length ) * Math.PI * 2
				var loc = toCartesian(r,angle)
				loc.x += (this.canvas.width/2)
				loc.y += (this.canvas.height/2)
				beginPath()
					ellipse(loc.x,loc.y,1,1,0,Math.PI*2,false)
					fill()
				closePath()
			}
			strokeStyle = "#1ce"
			fillStyle="#1ce"
			lineWidth = 2
			beginPath()
				ellipse(this.canvas.width/2,this.canvas.height/2,6,6,0,Math.PI*2,false)
				stroke()
				fill()
			closePath()
		}
	}
	this.drawmelody()
	this.drawprogress = function(n) {
		// n is how many notes are left
		with (this.ctx) {
			strokeStyle = "#1ce"
			lineWidth = 2
			var progress = (this.data.length - n) / this.data.length
			if (progress > 0) {
				beginPath()
					arc(this.canvas.width/2,this.canvas.height/2,this.diameter/2-2,0,progress*Math.PI*2,false)
					stroke()
				closePath()
			}
		}
	}
	this.tempactions = []
	this.kill = function() {
		this.tempactions.push( this._kill )
	}
	this._kill = function() {
		this.parent.removeChild(this.canvas)
	}
	this.update = function(arr) {
		this.data = arr
		this.drawmelody()
		for (var i=0;i<this.tempactions.length;i++) {
			this.tempactions[i]()
		}
		this.tempactions = []
	}
}

cycles = []
//var testmelody = dtm.line(20).repeat(4)
//cycles.push[ new Cycle(testmelody.get()) ]






/* UTIL */
function indexToNote(index) {
	var degree = index % scale.length;
	var octave = Math.floor( index / scale.length )
	var modaldegree = mode[mode.length-1]
	for (var i=0;i<mode.length;i++) {
		if (mode[i]>scale[degree]) {
			modaldegree = mode[i-1]
			break;
		}
	}
	console.log(modaldegree)
	var midinote = base + octave*12 + modaldegree
	return midinote
}

var toPolar = function(x,y) {
  var r = Math.sqrt(x*x + y*y);
  var theta = Math.atan2(y,x);
  if (theta < 0.) {
    theta = theta + (2 * Math.PI);
  }
  return {radius: r, angle: theta};
}

var toCartesian = function(radius, angle){
  var cos = Math.cos(angle);
  var sin = Math.sin(angle);
  return {x: radius*cos, y: radius*sin*-1};
}
