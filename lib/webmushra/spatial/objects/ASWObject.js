/*************************************************************************
         (C) Copyright AudioLabs 2017 

This source code is protected by copyright law and international treaties. This source code is made available to You subject to the terms and conditions of the Software License for the webMUSHRA.js Software. Said terms and conditions have been made available to You prior to Your download of this source code. By downloading this source code You agree to be bound by the above mentionend terms and conditions, which can also be found here: https://www.audiolabs-erlangen.de/resources/webMUSHRA. Any unauthorised use of this source code may result in severe civil and criminal penalties, and will be prosecuted to the maximum extent possible under law. 

**************************************************************************/

function ASWObject(_objConfig) {
	
	this.objConfig = _objConfig;
	this.group;
	this.height = _objConfig.height;
	this.depth = _objConfig.depth; 
	if(_objConfig.depth == null){
		this.depth = 20;
	}
	if(_objConfig.height == null){
		this.height = 0;
	}
	this.x = 0;
	this.y = 0;
	this.z = 0;
	
	this.geometryLine1 = new THREE.Geometry();
	this.geometryLine2 = new THREE.Geometry();
	
	this.controlPoints = [];
	this.controlPoints[0] = [];
	this.controlPoints[1] = [];
	this.controlPoints[2] = [];
	this.controlPoints[3] = [];
	if(this.height != 0){
		this.controlPoints[4] = [];
		this.controlPoints[5] = [];
	}
	this.controlPoints[0][0] = _objConfig.bezierOuterLeft[0];
	this.controlPoints[0][1] = _objConfig.bezierOuterLeft[1];
	this.controlPoints[0][2] = _objConfig.bezierOuterLeft[2];
	this.controlPoints[1][0] = _objConfig.bezierInnerLeft[0];
	this.controlPoints[1][1] = _objConfig.bezierInnerLeft[1];
	this.controlPoints[1][2] = _objConfig.bezierInnerLeft[2];
	this.controlPoints[2][0] = _objConfig.bezierInnerRight[0];
	this.controlPoints[2][1] = _objConfig.bezierInnerRight[1];
	this.controlPoints[2][2] = _objConfig.bezierInnerRight[2];
	this.controlPoints[3][0] = _objConfig.bezierOuterRight[0];
	this.controlPoints[3][1] = _objConfig.bezierOuterRight[1];
	this.controlPoints[3][2] = _objConfig.bezierOuterRight[2];
	this.derivative = [];
	this.midpointOnCurve = []; 

	
	this.tmp = [];
	this.extrudeBend = null;
	this.activeObj = null;
	this.group = new THREE.Object3D();
	this.scene; 
	this.line = []; 
	this.points = []; 
	this.material = []; 
	this.geometrySphere = new THREE.SphereGeometry(8, 34, 30); // (firts parameter: radius in cm)
	
	for(var j = 0; j < this.controlPoints.length; ++j){
		this.material[j] = new THREE.MeshPhongMaterial({ 
			color : _objConfig.color,
			ambient : _objConfig.color,
			emmissive : _objConfig.color,
		});
		this.points[j] = new THREE.Mesh(this.geometrySphere, this.material[j]);
		
	}
		
	this.update();
}


ASWObject.prototype.init = function(_scene) { 
	this.scene = _scene; 
	this.updateGeometry(); 
	_scene.add(this.line1);
	if(this.height!= 0){
		_scene.add(this.line2);
	}
	for(var i = 0; i < this.points.length; ++i){
		_scene.add(this.points[i]);
	}
	
};
/**
 *updates the geometry of the beziercurve 
 */
ASWObject.prototype.update = function() {
	this.updateGeometry();
	this.updateControlPolygon();
};
/**
 * builds a new geometry and material with new values 
 */
ASWObject.prototype.updateGeometry = function() {

	this.extrudeBend = new THREE.CubicBezierCurve3(
		new THREE.Vector3(this.controlPoints[3][0], this.controlPoints[3][1], this.controlPoints[3][2]),
		new THREE.Vector3(this.controlPoints[2][0], this.controlPoints[2][1], this.controlPoints[2][2]), 
		new THREE.Vector3(this.controlPoints[1][0], this.controlPoints[1][1], this.controlPoints[1][2]),
		new THREE.Vector3(this.controlPoints[0][0], this.controlPoints[0][1], this.controlPoints[0][2]));
	
	var geometry = new THREE.Tube(1, 64, 20, this.extrudeBend, this.height/2, this.depth/2);
	var material = new THREE.MeshPhongMaterial({
		color : this.objConfig.color,
		ambient: this.objConfig.color,
		opacity: 0.5,
		transparent : true,
		side: THREE.DoubleSide
	});
	this.updateGroup(geometry, material);
};


/**
 * updates the group, where the material and the geometry is stored 
 */
ASWObject.prototype.updateGroup = function (_geometry, _material ) {
	// delete all elements	
	if(this.tmp != undefined){
		if (this.scene != null) {	
			this.scene.remove(this.group.children[0]);
		}
		for( var i = 0; i < this.tmp.length; i++){
			this.group.remove(this.tmp[i]);
		}
	}
	//redraw bezier curve
	this.tmp[0] = new THREE.Mesh( _geometry, _material );		
	this.group.add(this.tmp[0]);
	
	if (this.scene != null) {
		var temp0 = this.group.children[0];
		this.scene.add(this.group.children[0]);
		this.group.children[0] = temp0;
	}			
};


ASWObject.prototype.updateControlPolygon = function(){
	//bezier curve
	//points:	
	this.points[0].position.set(this.controlPoints[0][0],this.controlPoints[0][1], this.controlPoints[0][2]);
	this.points[1].position.set(this.controlPoints[1][0],this.controlPoints[1][1], this.controlPoints[1][2]);
	this.points[2].position.set(this.controlPoints[2][0],this.controlPoints[2][1], this.controlPoints[2][2]);
	this.points[3].position.set(this.controlPoints[3][0],this.controlPoints[3][1], this.controlPoints[3][2]);
	
	
	//line:
	this.geometryLine1.vertices.pop();
	this.geometryLine1.vertices.pop();
	this.geometryLine1.vertices.pop();
	this.geometryLine1.vertices.pop();
		
    this.geometryLine1.vertices.push(new THREE.Vector3(this.controlPoints[0][0],this.controlPoints[0][1], this.controlPoints[0][2]));
    this.geometryLine1.vertices.push(new THREE.Vector3(this.controlPoints[1][0],this.controlPoints[1][1], this.controlPoints[1][2]));
    this.geometryLine1.vertices.push(new THREE.Vector3(this.controlPoints[2][0],this.controlPoints[2][1], this.controlPoints[2][2]));
    this.geometryLine1.vertices.push(new THREE.Vector3(this.controlPoints[3][0],this.controlPoints[3][1], this.controlPoints[3][2]));
    
  
	this.line1 = new THREE.Line(this.geometryLine1,  new THREE.LineBasicMaterial({'linewidth': 3}),THREE.LineStrip);
	this.line1.geometry.verticesNeedUpdate = true;
	
	//control points for depth and heigth
	  if(this.height != 0 && this.depth!= 0){
	  	
	  	this.midpointOnCurve[0] = 0.125 * this.controlPoints[0][0] + 0.375 * this.controlPoints[1][0] + 0.375 * this.controlPoints[2][0] + 0.125 * this.controlPoints[3][0];
		this.midpointOnCurve[1] = 0.125 * this.controlPoints[0][1] + 0.375 * this.controlPoints[1][1] + 0.375 * this.controlPoints[2][1] + 0.125 * this.controlPoints[3][1];
		this.midpointOnCurve[2] = 0.125 * this.controlPoints[0][2] + 0.375 * this.controlPoints[1][2] + 0.375 * this.controlPoints[2][2] + 0.125 * this.controlPoints[3][2];
		this.derivative[0] = 3 * (this.controlPoints[0][0] + this.controlPoints[1][0] - this.controlPoints[2][0] - this.controlPoints[3][0]);
		this.derivative[1] = 3 * (this.controlPoints[0][1] + this.controlPoints[1][1] - this.controlPoints[2][1] - this.controlPoints[3][1]);
		this.derivative[2] = 3 * (this.controlPoints[0][2] + this.controlPoints[1][2] - this.controlPoints[2][2] - this.controlPoints[3][2]);
		var norm = Math.sqrt(Math.pow(this.derivative[0],2) + Math.pow(this.derivative[2],2));
		this.derivative[0] = this.derivative[0] /  norm;
		this.derivative[2] = this.derivative[2] / norm;
		this.controlPoints[5][0] = this.midpointOnCurve[0] + this.derivative[2] * this.depth/2;
		this.controlPoints[5][1] = this.midpointOnCurve[1];
		this.controlPoints[5][2] = this.midpointOnCurve[2] - this.derivative[0] * this.depth/2; 
		this.controlPoints[4][0] = this.midpointOnCurve[0];
		this.controlPoints[4][1] = this.midpointOnCurve[1] + this.height / 2;
		this.controlPoints[4][2] = this.midpointOnCurve[2];	
		
		this.points[4].position.set(this.controlPoints[4][0],this.controlPoints[4][1], this.controlPoints[4][2]); 
		this.points[5].position.set(this.controlPoints[5][0],this.controlPoints[5][1], this.controlPoints[5][2]); 
		
		this.geometryLine2.vertices.pop();
		this.geometryLine2.vertices.pop();
		this.geometryLine2.vertices.pop();
		
		this.geometryLine2.vertices.push(new THREE.Vector3(this.controlPoints[4][0],this.controlPoints[4][1], this.controlPoints[4][2]));
		this.geometryLine2.vertices.push(new THREE.Vector3(this.midpointOnCurve[0],this.midpointOnCurve[1], this.midpointOnCurve[2]));	
		this.geometryLine2.vertices.push(new THREE.Vector3(this.controlPoints[5][0],this.controlPoints[5][1], this.controlPoints[5][2]));
	     	
		this.line2 = new THREE.Line(this.geometryLine2,  new THREE.LineBasicMaterial({'linewidth': 3}),THREE.LineStrip);
		this.line2.geometry.verticesNeedUpdate = true;
	}
};

ASWObject.prototype.eventOnMouseUp = function(_event, _x, _y, _z) { 
	this.activeObj = null;    
};


ASWObject.prototype.eventOnMouseDown = function(_event, _x, _y, _z) {
	var threshold = 10;
	if(_x == null){
		this.activeObj = null;
		for(var i = 0; i < this.controlPoints.length; ++i){
		  if(this.distance(new THREE.Vector3(this.controlPoints[i][0], _y, _z), new THREE.Vector3(this.controlPoints[i][0], this.controlPoints[i][1], this.controlPoints[i][2]))< threshold){
		    this.activeObj = i;
		  } 
		}
	} else if(_y == null){
		this.activeObj = null;
		for(var i = 0; i < this.controlPoints.length; ++i){
		 if(this.distance(new THREE.Vector3(_x, this.controlPoints[i][1], _z), new THREE.Vector3(this.controlPoints[i][0], this.controlPoints[i][1], this.controlPoints[i][2]))< threshold){
		  	this.activeObj = i;
		  }
		} 
	}
	if(_z == null){
		this.activeObj = null;
		for(var i = 0; i < this.controlPoints.length; ++i){
		 if(this.distance(new THREE.Vector3(_x, _y, this.controlPoints[i][2]), new THREE.Vector3(this.controlPoints[i][0], this.controlPoints[i][1], this.controlPoints[i][2]))< threshold){
		  	this.activeObj = i;
		  }
		} 
	} 
};

ASWObject.prototype.distance =function(v1, v2){
    var dx = v1.x - v2.x;
    var dy = v1.y - v2.y;
    var dz = v1.z - v2.z;

    return Math.sqrt(dx*dx+dy*dy+dz*dz);
};

ASWObject.prototype.eventOnMouseMove = function(_event, _x, _y, _z) {
	if(this.activeObj != null){
		if(this.activeObj == 4 && _y != null){
			this.height = 2*(_y - this.controlPoints[1][1]);	
		} else if ( this.activeObj == 5 && _x != null && _z != null){
			this.depth = Math.sqrt(Math.pow(_x - this.midpointOnCurve[0], 2) +(Math.pow(_z - this.midpointOnCurve[2], 2)));
		} else {
			if(_x != null){
				this.controlPoints[this.activeObj][0] = _x;
			}
			if(_y != null&& this.height != 0){
				this.controlPoints[this.activeObj][1] = _y;
			}
			if(_z != null){
				this.controlPoints[this.activeObj][2] = _z;
			}
		}
	}
	this.updateControlPolygon();
	this.updateGeometry(); 
};

ASWObject.prototype.render = function() {  
};

ASWObject.prototype.getCenterPosition = function() {
	return [this.group.position.x, this.group.position.y, this.group.position.z];
};


/**
 * Returns a hash map with values to save. 
 */
ASWObject.prototype.storeValues = function(_trial, _session, _trial_id) {  
  if (_trial === null) {
    _trial = new Trial();
	_trial.type = this.objConfig.type;
	_trial.id = _trial_id;
	_session.trials[_session.trials.length] = _trial;
	}
  if(this.height == 0){
  var rating = new SpatialASWRating();
  
  rating.stimulus = this.objConfig.stimulus; 
  rating.name = this.objConfig.name; 
  rating.position_outerRight = this.controlPoints[3]; 
  rating.position_innerRight = this.controlPoints[2];
  rating.position_innerLeft = this.controlPoints[1];
  rating.position_outerLeft = this.controlPoints[0];
  _trial.responses[_trial.responses.length] = rating;
	} else {
		var rating = new SpatialHWDRating();
		rating.stimulus = this.objConfig.stimulus; 
  rating.name = this.objConfig.name; 
  rating.position_outerRight = this.controlPoints[3]; 
  rating.position_innerRight = this.controlPoints[2];
  rating.position_innerLeft = this.controlPoints[1];
  rating.position_outerLeft = this.controlPoints[0];
  rating.height = this.height; 
  rating.depth = this.depth; 
  _trial.responses[_trial.responses.length] = rating;
	}
	
};
