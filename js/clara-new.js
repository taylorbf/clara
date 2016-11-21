
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
function codeToData() {
	data = {}
	var code = codeeditor.value
  code = code.split("\n")
	for (var i=0;i<code.length;i++) {
		key = code[i].substring(0,code[i].indexOf(":"))
		value = code[i].substring(code[i].indexOf(": ")+2)
		data[key] = value
	}
	return data
}

function evalCode() {
/*	var code = codeeditor.value
  code = code.split("\n")
	for (var i=0;i<code.length;i++) {
		key = code[i].substring(0,code[i].indexOf(":"))
		value = code[i].substring(code[i].indexOf(": ")+2)
		melodies[0].code[key] = value
	} */
	melodies[0].code = codeToData()
	melodies[0].engine = new Melody(melodies[0].code.pitch)
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


var VizNotes = []

function vizCode() {
	data = codeToData()
	var tempmelody = false
	try {
		tempmelody = eval("with (dtm) {"+data.pitch+"}")
	} catch(e) {
		return
	}
	if (tempmelody) {
		for (var i=0;i<VizNotes.length;i++) {
			scene.remove(VizNotes[i])
		}
		VizNotes = []
		arr = tempmelody.get()
		for (var i=0;i<arr.length;i++) {
			if (typeof arr[i] === "function" ) {
				var group = arr[i].get()
			} else {
				var group = [ arr[i] ]
			}
			for (var j=0;j<group.length;j++) {
				note = group[j]
				if (note>=0) {

					Graph.addNote(note)

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
	addNote: function() {

		var geometry = new THREE.Geometry();

		xloc = VizNotes.length;
		geometry.vertices.push({
			x: xloc,
			y: note-30,
			z: 0
		});
		geometry.vertices.push({
			x: xloc + 2,
			y: note-30,
			z: 0
		});

		var line = new THREE.Line( geometry, new THREE.LineBasicMaterial( { color: 0xffffff, opacity: 1, linewidth: 2, linecap: "round"  } ) );
		scene.add( line );
		VizNotes.push( line )
	//	camera.position.z = VizNotes.length
	}
}





vizCode()












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
