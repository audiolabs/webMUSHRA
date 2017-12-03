/**
 * 
 * @param {int} radius 
 * @param {int} segments number of segements the object has
 * @param {double} segmentsRadius number of corners the object has
 * @param {Object3D} path the beziercurve 
 * @param {int} _height the height of the curve
 * @param {int} _width the width of the curve
 */

THREE.Tube = function(_radius, _segments, _segmentsRadius, _path, _height, _width) {

	THREE.Geometry.call(this);

	var scope = this;

	this.radius = _radius || 40;
	this.segments = _segments || 64;
	this.segmentsRadius = _segmentsRadius || 8;
	this.grid = new Array(this.segments);
	this.path = _path;

	var tang = new THREE.Vector3();

	var binormal = new THREE.Vector3();

	var normal = new THREE.Vector3();

	var pos = new THREE.Vector3();

	var epsilon = 0.001;

	var u, v;

	var p1, p2;
	var cx, cy;

	var oldB;

	for (var i = 0; i < this.segments; ++i) {

		this.grid[i] = new Array(this.segmentsRadius);

		u = i / (this.segments-1);

		var pos = this.path.getPointAt(u);
		tang = this.path.getTangentAt(u);

		if (oldB === undefined) {
			oldB = new THREE.Vector3(0, 0, 1).normalize();
		}

		normal.cross(oldB, tang).normalize();
		binormal.cross(tang, normal).normalize();

		oldB = binormal;

		for (var j = 0; j < this.segmentsRadius; ++j) {

			v = j / this.segmentsRadius * 2 * Math.PI;

			cx = -_height * this.radius * Math.cos(v + Math.PI / 4);
			cy = _width * this.radius * Math.sin(v + Math.PI / 4);

			var rCosN = new THREE.Vector3();
			rCosN.copy(normal);
			rCosN.multiplyScalar(cx);

			var rSinB = new THREE.Vector3();
			rSinB.copy(binormal);
			rSinB.multiplyScalar(cy);

			var pt = new THREE.Vector3();
			pt.add(pos);
			pt.add(rCosN);
			pt.add(rSinB);

			this.grid[i][j] = vert(pt.x, pt.y, pt.z);
		}
	}

	for (var i = 0; i < this.segments - 1; ++i) {

		for (var j = 0; j < this.segmentsRadius; ++j) {

			var ip = (i + 1) % this.segments;
			var jp = (j + 1) % this.segmentsRadius;

			var a = this.grid[i][j];
			var b = this.grid[ip][j];
			var c = this.grid[ip][jp];
			var d = this.grid[i][jp];

		this.faces.push(new THREE.Face3(a, b, c));
		this.faces.push(new THREE.Face3(a, c, d));
		}
	}
	var a = this.grid[this.segments - 1][3];
	var b = this.grid[this.segments - 1][2];
	var c = this.grid[this.segments - 1][1];
	var d = this.grid[this.segments - 1][0];


	this.faces.push(new THREE.Face3(a, b, c));
	this.faces.push(new THREE.Face3(a, c, d));
	var a = this.grid[0][0];
	var b = this.grid[0][1];
	var c = this.grid[0][2];
	var d = this.grid[0][3];

	this.faces.push(new THREE.Face3(a, b, c));
	this.faces.push(new THREE.Face3(a, c, d));
	// this.computeCentroids();
	this.computeFaceNormals();
	this.computeVertexNormals();

	function vert(x, y, z) {
		return scope.vertices.push((new THREE.Vector3(x, y, z))) - 1;
	}

	function getPathPos(u, path) {
		return path.getPoint(u);
	}

};

THREE.Tube.prototype = new THREE.Geometry();
