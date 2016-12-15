
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



function Pattern(code) {
	this.next = function() {
		if (this.arr.length<=0) {
			this.update(this.code)
		}
		var nextItem = this.arr.slice(0,1)[0]
		this.arr = this.arr.slice(1)
		return nextItem
	}
	this.update = function(code) {
		this.code = code
		this.arr = eval("with (dtm) {"+code+"}")
		if (typeof this.arr == "number") {
			this.arr = dtm.data(this.arr)
		}
		this.arr = this.arr.get()
	}
	this.getRange = function(range) {
		var output = []
		while (output.length < range) {
			//this.update(this.code)
			//output = output.concat(this.arr)
			output.push(this.arr[output.length%this.arr.length])
		}
		return output
	}
	this.update(code)
}

Tone.setContext(piano.Tone.context)

var Clara = {
	ms: new Pattern(120),
	vol: new Pattern(120),
	fx: {
		gain: new Tone.Volume(-12),
		delay: new Tone.FeedbackDelay(.2, 0.5),
		filter: new Tone.Filter(800, "bandpass"),
		reverb: new Tone.JCReverb(0.4)
	}
}

piano.chain( Clara.fx.gain,Clara.fx.delay,Clara.fx.filter,Clara.fx.reverb,Tone.Master )

function Melody(patterns) {
	this.next = function() {
		var note = this.pitches.next()
		var velocity = this.vel.next()
		var duration = this.dur.next()
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
				this.playNote(note,velocity,duration)
			}
		}
	}
	this.playNote = function(note,vel,dur) {
		var velocity = vel
		var duration = dur
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
	this.update = function(patterns) {
		if (patterns) {
			this.pitches = new Pattern(patterns.pitch || 0)
			this.vel = new Pattern(patterns.vel || 0.01)
			this.dur = new Pattern(patterns.dur || 3)
		} else {
			this.pitches = this.vel = this.dur = false
		}
	}
	this.update(patterns)
}


var melodies = []
for (var i=0;i<4;i++) {
	melodies[i] = {
		code: {},
		engine: new Melody(),
		viz: {
			notes: []
		}
	}
}
function codeToData(code) {
	if (code){
		console.log(code)
		data = {}
	  code = code.split("\n")
		for (var i=0;i<code.length;i++) {
			key = code[i].substring(0,code[i].indexOf(": "))
			value = code[i].substring(code[i].indexOf(": ")+2)
			data[key] = value
		}
		return data
	}
}

function evalCode() {
	var parts = codeeditor.value.split('\n\n')
	var metadata = parts.splice(0,1)[0]
	var linenumber = codeeditor.value.substr(0, codeeditor.selectionStart).split("\n").length;

	metadata = codeToData(metadata)
	Clara.ms = new Pattern(metadata.ms || 120)
	Clara.vol = new Pattern(metadata.vol || 0.5)


	for (var i=0;i<parts.length;i++) {
		melodies[i].code = codeToData(parts[i])
		melodies[i].engine.update(melodies[i].code)
		//melodies[i].engine = new Melody(melodies[i].code.pitch)
	}
	if (Loop.state=="stopped") {
		Loop.start()
	}
}


/* KEYBOARD VIS */

codeeditor.addEventListener("keyup",function(e) {
	if (e.which!=13) {
		vizCode()
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
	var parts = codeeditor.value.split('\n\n')
	var metadata = parts.splice(0,1)
	var linenumber = codeeditor.value.substr(0, codeeditor.selectionStart).split("\n").length;

	try {
		for (var i=0;i<parts.length;i++) {
			if (melodies[i].viz.text != parts[i]) {
				melodies[i].viz.text = parts[i]
				melodies[i].viz.code = codeToData(parts[i])
				var mel = melodies[i].viz.code
				melodies[i].viz.pitch = new Pattern(mel.pitch)
				melodies[i].viz.vel = new Pattern(mel.vel)
				melodies[i].viz.dur = new Pattern(mel.dur)
				melodies[i].viz.changed = true
			} else {
				melodies[i].viz.changed = false
			}
		}
	} catch (e) {
		console.log(e)
		return
	}
	for (var i=0;i<melodies.length;i++) {
		if (melodies[i].viz.changed) {
			var mel = melodies[i].viz
			if (mel.pitch) {
				for (var j=0;j<mel.notes.length;j++) {
					scene.remove(mel.notes[j])
				}
				mel.notes = []
				// will show next x notes
				var pitches = mel.pitch.getRange(400)
				var vels = mel.vel.getRange(400)
				var durs = mel.dur.getRange(400)

				for (var k=0;k<pitches.length;k++) {
					var pitch = pitches[k]
					var vel = vels[k]
					var dur = durs[k]
					if (typeof pitch === "function" ) {
						var group = pitch.get()
					} else {
						var group = [ pitch ]
					}
					for (var j=0;j<group.length;j++) {
						var note = group[j]
						Graph.addNote(note,dur,vel,mel)
					}
				}
			}
		}
	}
}

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





/* Graphing */


var Graph = {
	addNote: function(note,dur,vel,mel) {

		if (note <= 0) {
			var op = 0
		} else {
			var op = 1
		}

		var geometry = new THREE.Geometry();

		xloc = mel.notes.length;
		geometry.vertices.push({
			x: xloc,
			y: note-30,
			z: 0
		});
		geometry.vertices.push({
			x: xloc + dur,
			y: note-30,
			z: 0
		});

		var line = new THREE.Line( geometry, new THREE.LineBasicMaterial( { color: 0xffffff, opacity: op, linewidth: vel*10, linecap: "round"  } ) );
		scene.add( line );
		mel.notes.push( line )
	//	camera.position.z = VizNotes.length
	}
}

/* essentially the *init* code */

vizCode()
Tone.Transport.start()
piano.setVolume("release", -80)
piano.setVolume("harmonics", -40)
piano.setVolume("pedal", -40)


var Loop = new Tone.Loop(function(time){
	Loop.interval = Clara.ms.next() / 1000
	for (var i=0;i<melodies.length;i++) {
		melodies[i].engine.next()
	}
}, .1)










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
	var midinote = base + octave*12 + modaldegree
	return midinote
}
