window.onload = function() {
	init()
};
var public_spreadsheet_url = 'https://docs.google.com/spreadsheets/d/1CGPpVjMxRvJjuli28rxbwvANYZwca18tvaxw2AWyw3k/pubhtml';

function init() {
	Tabletop.init({
		key: public_spreadsheet_url,
		callback: showInfo,
		simpleSheet: true
	});
}

var num = 100;
var things = new thing(1, 1);
var width = 800;
var height = 800;
var originX = width / 2 + 200;
var originY = height / 2 + 100;

var canvas = document.getElementById('myCanvas');
var c = canvas.getContext('2d');

function showInfo(data) {
	for (var i = 0; i < data.length; i++) {
		var d = radial(400, data.length, i);
		things[i] = new thing(d[0], d[1], data[i].influence, data[i].name);
	}

	for (var i = 0; i < data.length; i++) {
		for (var j = 0; j < data.length; j++) {
			if (things[i].influence === things[j].name) {
				things[i].influenceX[0] = things[j].x;
				things[i].influenceY[0] = things[j].y;
				console.log(things[i].influenceX[0]);
			}
		}
	}



	for (var i = 0; i < data.length; i++) {
		drawRadial(i, data.length);
		drawCurvedLines(i);
	}
}


function thing(x, y, name, influence) {
	this.x = x;
	this.y = y;
	this.name = name;
	this.influence = influence;
	this.influenceX = [0, 0, 0, 0, 0];
	this.influenceY = [0, 0, 0, 0, 0];
	this.locked = false;
}

function radial(rad, arraySize, inid) {
	this.rad = rad;
	this.arraySize = arraySize;
	this.inid = inid;
	var d = 360.0 / arraySize;
	var g = d * inid;
	var x = Math.cos(radians(g)) * rad + originX;
	var y = Math.sin(radians(g)) * rad + originY;
	return [x, y];
}

function radians(degrees) {
	return degrees * Math.PI / 180;
};

function degrees(radians) {
	return (radians * 360) / Math.PI;
};

function delta(n) {
	return (Math.PI * 2) / n;
}

function drawRadial(n, p) {
	c.save();
	c.beginPath();
	c.translate(things[n].x, things[n].y);
	c.rotate(delta(p) * n);
	c.lineWidth = 1;
	c.font = "11px Helvetica";
	c.fillStyle = "#ffffff";
	c.fillText(things[n].name, 5, 5);
	c.stroke();
	c.restore();
}

function drawLines(n) {
	c.save();
	c.beginPath();
	c.translate(things[n].x, things[n].y);
	c.lineWidth = 1;
	c.strokeStyle = "#ff0000";
	c.moveTo(0, 0);
	c.restore();
	c.lineTo(things[n].influenceX, things[n].influenceY);
	c.stroke();
	c.restore();
}

function drawCurvedLines(n) {
	if (things[n].influenceX[0] > 0) {
		c.save();
		c.beginPath();
		c.translate(things[n].x, things[n].y);
		c.moveTo(0, 0);
		c.restore();
		c.bezierCurveTo(things[n].x, things[n].y, originX, originY, things[n].influenceX[0], things[n].influenceY[0]);
		c.lineWidth = 1;
		c.strokeStyle = "#ff0000";
		c.stroke();
		c.restore();
	}
}
