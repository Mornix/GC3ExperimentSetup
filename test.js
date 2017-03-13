let target = document.getElementById('target');
let dist = document.getElementById('distractor');
let input = document.getElementById("resp");

let trials_per_test = 3;

let base_array = [3,4,5,6,7,8,9];
let base_distractors = [0,1,2]; // None, Colour, Text

let background_distractors = ['#000000', '#FF0000', '#00FF00', '#0000FF', '#FFFF00', '#FF00FF', '#00FFFF', '#FFFFFF'];

var trials = [];

function generateTests() {
	// Be lazy iterate through. Nothing cool or efficient
	for(var i = 0; i < base_array.length; i++) {
		for (var j = 0; j < base_distractors.length; j++) {
			for(var k = 0; k < trials_per_test; k++) {
				trials = trials.concat([{length:base_array[i],distractor_type:base_distractors[j]}]);
			}
		}
	}

	var trials_temp = [];

	for(var i = trials.length-1; i >= 0; i--) {
		trials_temp = trials_temp.concat(trials.splice(Math.round(Math.random()*i),1));
	}
	trials = trials_temp;
}

var last_word = "";
var last_colour_hex = "";
var run = false;
var running = false;

var st = [];

function newTrial () {
	if (run) {
		var a = trials.shift();
		a.text = last_word;
		a.input_text = input.value.toUpperCase();
		if (a.distractor_type != 0) {
			a.distractor_value = a.distractor_type==1?last_colour_hex:dist.innerText;
		}
		st = st.concat([a]);
	}
	if(trials.length == 0) {
		run = false;
		running = false;
		target.innerText = "Press Ctrl+B to start.";
		input.style.opacity = 0;
		dump();
		return;
	}
	run = true;
	last_word = makeid(trials[0].length);
    target.innerText = last_word;

    if(trials[0].distractor_type == 0) {
    	dist.style.opacity = 0;
    } else if (trials[0].distractor_type == 1) {
    	dist.style.opacity = 1;
    	dist.innerText = '\xa0';
    	last_colour_hex = background_distractors[Math.round(Math.random()*background_distractors.length)];
    	dist.style.backgroundColor = last_colour_hex;
    }
    else if (trials[0].distractor_type == 2) {
    	dist.style.opacity = 1;
    	dist.innerText = makeid(trials[0].length);
    	dist.style.backgroundColor = "transparent";
    }
    input.value = "";
    input.style.opacity = 0;
    setTimeout(callClearText, 500);
    setTimeout(newTrial, 5000);
}

function makeid(len) {
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

    for(var i = 0; i < len; i++)
        text += possible[Math.round(Math.random() * (possible.length - 1))];
    return text;
}

function callClearText() {
	target.innerText = '';
	dist.style.opacity = 0;
	input.style.opacity = 100;
	input.focus();
}

function dump() {
	var text = "Text Length,Text,Response,Distactor Type,Distractor Value\n";
	for(var i = 0; i < st.length; i++) {
		text += st[i].length + "," + st[i].text + "," + st[i].input_text + "," + st[i].distractor_type + "," + st[i].distractor_value + "\n";
	}
	var e = document.createElement('a');
 	e.setAttribute('href', 'data:text/csv;charset=utf-8,' + encodeURIComponent(text));
 	e.setAttribute('download', "dump.csv");
 	e.style.display = 'none';
	document.body.appendChild(e);
	e.click();
	document.body.removeChild(e);
}

document.addEventListener('keydown', function (e) {
	if(e.ctrlKey && e.keyCode == 66 && !running) {
		e.preventDefault();
		st = [];
		running = true;
		target.innerText = '';
		generateTests();
		setTimeout(newTrial, 5000);
	}
});