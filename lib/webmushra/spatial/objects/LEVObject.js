/*************************************************************************
         (C) Copyright AudioLabs 2017 

This source code is protected by copyright law and international treaties. This source code is made available to You subject to the terms and conditions of the Software License for the webMUSHRA.js Software. Said terms and conditions have been made available to You prior to Your download of this source code. By downloading this source code You agree to be bound by the above mentionend terms and conditions, which can also be found here: https://www.audiolabs-erlangen.de/resources/webMUSHRA. Any unauthorised use of this source code may result in severe civil and criminal penalties, and will be prosecuted to the maximum extent possible under law. 

**************************************************************************/

function LEVObject(_objConfig) {
	
	this.objConfig = _objConfig;
	
	this.activeObj;
	this.materialLEV;  
	this.mesh; 
	
	this.point0 = new THREE.Vector3(_objConfig.position[0],_objConfig.position[1],_objConfig.position[2]);
	this.point1 = new THREE.Vector3(_objConfig.size[0] + _objConfig.position[0],_objConfig.position[1],0);
	this.point2 = new THREE.Vector3(0,_objConfig.position[1],_objConfig.size[2] + _objConfig.position[2]);
	this.point3 = new THREE.Vector3(_objConfig.position[0],_objConfig.size[1]+_objConfig.position[1],_objConfig.position[2]);
	
	this.xAxis = null;
	this.yAxis = null;
	this.zAxis = null;
	
	this.dragNdrop0 = null;
	this.dragNdrop1 = null;
	this.material1;
	
	this.dragNdrop2 = null;
	this.material1;
		
	
	this.material0 = new THREE.MeshPhongMaterial({ 
	    color : _objConfig.color,
		opacitiy: 0.1,
		ambient : 0x330000,
	});
	this.material1 = new THREE.MeshPhongMaterial({ 
	    color : _objConfig.color,
		opacitiy: 0.1,
		ambient : 0x330000,
	});
		
	this.material2 = new THREE.MeshPhongMaterial({ 
	    color : _objConfig.color,
		opacitiy: 0.1,
		ambient : 0x330000,
	});
	this.material3 = new THREE.MeshPhongMaterial({ 
	    color : _objConfig.color,
		opacitiy: 0.1,
		ambient : 0x330000,
	});
 	var geometry = new THREE.SphereGeometry(8, 34, 30); // (firts parameter: radius in cm)
	this.dragNdrop0 = new THREE.Mesh(geometry, this.material0);
  	this.dragNdrop0.position.x = this.point0.x;
  	this.dragNdrop0.position.y = this.point0.y;
  	this.dragNdrop0.position.z = this.point0.z;
	this.dragNdrop1 = new THREE.Mesh(geometry, this.material1);
	this.dragNdrop1.position.x = this.point1.x;
	this.dragNdrop1.position.y = this.point1.y;
	this.dragNdrop1.position.z = this.point1.z;
	this.dragNdrop2 = new THREE.Mesh(geometry, this.material2);
  	this.dragNdrop2.position.x = this.point2.x;
  	this.dragNdrop2.position.y = this.point2.y;
  	this.dragNdrop2.position.z = this.point2.z;
	this.dragNdrop3 = new THREE.Mesh(geometry, this.material3);
  	this.dragNdrop3.position.x = this.point3.x;
  	this.dragNdrop3.position.y = this.point3.y;
  	this.dragNdrop3.position.z = this.point3.z; 

	var geometry1 = new THREE.Geometry();
		geometry1.vertices.push(this.dragNdrop0.position);
		geometry1.vertices.push(this.dragNdrop1.position);
		this.xAxis = new THREE.Line(geometry1,  new THREE.LineBasicMaterial({'linewidth': 3}), THREE.LineStrip);
		
		var geometry2 = new THREE.Geometry();
		geometry2.vertices.push(this.dragNdrop0.position);
		geometry2.vertices.push(this.dragNdrop2.position);
		this.yAxis = new THREE.Line(geometry2,  new THREE.LineBasicMaterial({'linewidth': 3}), THREE.LineStrip);
		
		var geometry3 = new THREE.Geometry();
		geometry3.vertices.push(this.dragNdrop0.position);
		geometry3.vertices.push(this.dragNdrop3.position);
		this.zAxis = new THREE.Line(geometry3,  new THREE.LineBasicMaterial({'linewidth': 3}), THREE.LineStrip);
	
	
	this.materialLEV = new THREE.MeshPhongMaterial({ 
	        color : _objConfig.color,
			opacity: 0.5,
			transparent : true,
			ambient : 0x330000,
		});
     	this.geometry = new THREE.SphereGeometry(1, 50, 50); // (firts parameter: radius in cm)
		this.mesh= new THREE.Mesh(this.geometry, this.materialLEV);
		this.setPosition0(this.point0.x, this.point0.y, this.point0.z);
		this.setPosition1(this.point1.x, this.point1.y, this.point1.z);	
		this.setPosition2(this.point2.x, this.point2.y, this.point2.z);	
		this.setPosition3(this.point3.x, this.point3.y, this.point3.z);
  
}


LEVObject.prototype.init = function(_scene) { 
  _scene.add(this.dragNdrop0);
  _scene.add(this.dragNdrop1);
  _scene.add(this.dragNdrop2);
  _scene.add(this.dragNdrop3);
  _scene.add(this.xAxis);
  _scene.add(this.yAxis);
  _scene.add(this.zAxis); 
  _scene.add(this.mesh);
  
};

LEVObject.prototype.eventOnMouseUp = function(_event, _x, _y, _z) {  
	this.activeObj = null;   
};


LEVObject.prototype.eventOnMouseDown = function(_event, _x, _y, _z) {
	var threshold = 10;
	if(_x == null){
		 if(this.distance(new THREE.Vector3(this.dragNdrop0.position.x, _y, _z), new THREE.Vector3(this.dragNdrop0.position.x, this.dragNdrop0.position.y, this.dragNdrop0.position.z))< threshold){
		  	this.activeObj = 0;
		  }	else if(this.distance(new THREE.Vector3(this.dragNdrop1.position.x, _y, _z), new THREE.Vector3(this.dragNdrop1.position.x, this.dragNdrop1.position.y, this.dragNdrop1.position.z))< threshold){
		  	this.activeObj = 1;
		  }	else if(this.distance(new THREE.Vector3(this.dragNdrop2.position.x, _y, _z), new THREE.Vector3(this.dragNdrop2.position.x, this.dragNdrop2.position.y, this.dragNdrop2.position.z))< threshold){
		  	this.activeObj = 2;
		  } else if(this.distance(new THREE.Vector3(this.dragNdrop3.position.x, _y, _z), new THREE.Vector3(this.dragNdrop3.position.x, this.dragNdrop3.position.y, this.dragNdrop3.position.z))< threshold){
		  	this.activeObj = 3;
		  }	else {
		  	this.activeObj = null; 
		  }  
	} else if(_y == null){
		 if(this.distance(new THREE.Vector3(_x, this.dragNdrop0.position.y, _z), new THREE.Vector3(this.dragNdrop0.position.x, this.dragNdrop0.position.y, this.dragNdrop0.position.z))< threshold){
		  	this.activeObj = 0;
		  }	else if(this.distance(new THREE.Vector3(_x, this.dragNdrop1.position.y, _z), new THREE.Vector3(this.dragNdrop1.position.x, this.dragNdrop1.position.y, this.dragNdrop1.position.z))< threshold){
		  	this.activeObj = 1;
		  }	else if(this.distance(new THREE.Vector3(_x, this.dragNdrop2.position.y, _z), new THREE.Vector3(this.dragNdrop2.position.x, this.dragNdrop2.position.y, this.dragNdrop2.position.z))< threshold){
		  	this.activeObj = 2;
		  } else if(this.distance(new THREE.Vector3(_x, this.dragNdrop3.position.y, _z), new THREE.Vector3(this.dragNdrop3.position.x, this.dragNdrop3.position.y, this.dragNdrop3.position.z))< threshold){
		  	this.activeObj = 3;
		  }	else {
		  	this.activeObj = null; 
		  }  
	}
	if(_z == null){
		  if(this.distance(new THREE.Vector3(_x, _y, this.dragNdrop0.position.z), new THREE.Vector3(this.dragNdrop0.position.x, this.dragNdrop0.position.y, this.dragNdrop0.position.z))< threshold){
		  	this.activeObj = 0;
		  }	else if(this.distance(new THREE.Vector3(_x, _y, this.dragNdrop1.position.z), new THREE.Vector3(this.dragNdrop1.position.x, this.dragNdrop1.position.y, this.dragNdrop1.position.z))< threshold){
		  	this.activeObj = 1;
		  }	else if(this.distance(new THREE.Vector3(_x, _y, this.dragNdrop2.position.z), new THREE.Vector3(this.dragNdrop2.position.x, this.dragNdrop2.position.y, this.dragNdrop2.position.z))< threshold){
		  	this.activeObj = 2;
		  } else if(this.distance(new THREE.Vector3(_x, _y, this.dragNdrop3.position.z), new THREE.Vector3(this.dragNdrop3.position.x, this.dragNdrop3.position.y, this.dragNdrop3.position.z))< threshold){
		  	this.activeObj = 3;
		  }	else {
		  	this.activeObj = null; 
		  } 
	} 
};

LEVObject.prototype.distance =function(v1, v2){
    var dx = v1.x - v2.x;
    var dy = v1.y - v2.y;
    var dz = v1.z - v2.z;

    return Math.sqrt(dx*dx+dy*dy+dz*dz);
};

LEVObject.prototype.eventOnMouseMove = function(_event, _x, _y, _z) {
  if(this.activeObj != null){
  	if(this.activeObj == 0){
  	  this.setPosition0(_x,_y,_z);	
  	} else if(this.activeObj == 1){
  	  this.setPosition1(_x,_y,_z);	
  	} else if(this.activeObj == 2){
  	  this.setPosition2(_x,_y,_z);	
  	} else if(this.activeObj == 3){
  	  this.setPosition3(_x,_y,_z);	
  	}
  
  }
};

LEVObject.prototype.render = function() {  
};

LEVObject.prototype.getCenterPosition = function() {
  return [this.mesh.position.x, this.mesh.position.y, this.mesh.position.z];  
};



LEVObject.prototype.setPosition0 = function(_x,_y,_z){
	
	if(_x != null){
		this.point1.x = this.point1.x - this.point0.x + _x;
		this.point2.x = this.point2.x - this.point0.x +_x;
		this.point0.x = _x; 
	}
	if(_y != null){
		this.point1.y = this.point1.y - this.point0.y + _y;
		this.point2.y = this.point2.y  - this.point0.y + _y;
		this.point0.y = _y;
	}
	if(_z != null){
		this.point1.z = this.point1.z - this.point0.z + _z;
		this.point2.z = this.point2.z - this.point0.z + _z;
		this.point0.z = _z;
	}
	
	
	this.dragNdrop1.position.x = this.point1.x;
	this.dragNdrop1.position.z = this.point1.z;
	
	
	
	
	this.dragNdrop2.position.x = this.point2.x;
	this.dragNdrop2.position.z = this.point2.z;
	
	
	
	
	
	var h = this.dragNdrop3.position.y - this.dragNdrop0.position.y;
	
	this.dragNdrop0.position.x = this.point0.x;
	this.dragNdrop0.position.y = this.point0.y;
	this.dragNdrop0.position.z = this.point0.z;
	this.dragNdrop3.position.x = this.point0.x;
	this.dragNdrop3.position.y = this.point0.y + h;
	this.dragNdrop3.position.z = this.point0.z;
	this.dragNdrop1.position.y = this.point0.y;
	this.dragNdrop2.position.y = this.point0.y;
	this.mesh.position.x = this.point0.x;
	this.mesh.position.y = this.point0.y;
	this.mesh.position.z = this.point0.z;
	
	this.xAxis.geometry.verticesNeedUpdate = true;
	this.yAxis.geometry.verticesNeedUpdate = true;
	this.zAxis.geometry.verticesNeedUpdate = true;
};

LEVObject.prototype.setPosition1 = function(_x,_y,_z){
	if(_x != null){
	  this.point1.x = _x;
	}
	if(_y != null){
	  this.point1.y = _y;
	}
	if(_z != null){
     this.point1.z = _z;
	}
	this.dragNdrop1.position.x = this.point1.x;
	this.dragNdrop1.position.z = this.point1.z;
	
	
	var dist1 = Math.sqrt((this.point1.x - this.point0.x) * (this.point1.x- this.point0.x) + (this.point1.z- this.point0.z) * (this.point1.z- this.point0.z));
	var dist2 = Math.sqrt((this.point2.x - this.point0.x) * (this.point2.x- this.point0.x)  + (this.point2.z- this.point0.z) * (this.point2.z- this.point0.z));
	
	var directionX = this.point1.z - this.point0.z;
	var directionZ = -this.point1.x + this.point0.x;
	var norm = Math.sqrt(directionX * directionX + directionZ * directionZ); 
	var directionXn = directionX / norm;
	var directionZn = directionZ / norm; 
	var norm2 = Math.sqrt(directionXn * directionXn + directionZn * directionZn); 
	console.log(norm2);
	this.point2.x = directionXn * dist2 + this.point0.x; 
	this.point2.z = directionZn * dist2 + this.point0.z;
	console.log(dist2);
	this.dragNdrop2.position.x = this.point2.x;
	this.dragNdrop2.position.z = this.point2.z;
	
	this.mesh.scale.x = dist1;
	this.mesh.scale.z = dist2; 
			
	this.mesh.rotation.y = Math.atan(-(this.point1.z-this.point0.z) / (this.point1.x- this.point0.x));
	this.mesh.position.x = this.point0.x;
	this.mesh.position.y = this.point0.y;
	this.mesh.position.z = this.point0.z;
	
	this.xAxis.geometry.verticesNeedUpdate = true;
	this.yAxis.geometry.verticesNeedUpdate = true;
    this.zAxis.geometry.verticesNeedUpdate = true;
	
};


LEVObject.prototype.setPosition2 = function(_x,_y,_z){
	if(_x != null){
	  this.point2.x = _x;
	}
	if(_y != null){
	  this.point2.y = _y;
	}
	if(_z != null){
	  this.point2.z = _z;
	}
	
	this.dragNdrop2.position.x = this.point2.x;
	this.dragNdrop2.position.z = this.point2.z;
	
	var dist1 = Math.sqrt((this.point1.x - this.point0.x) * (this.point1.x- this.point0.x) + (this.point1.z- this.point0.z) * (this.point1.z- this.point0.z));
	var dist2 = Math.sqrt((this.point2.x - this.point0.x) * (this.point2.x- this.point0.x) + (this.point2.z- this.point0.z) * (this.point2.z- this.point0.z));
	
	var directionX = -this.point2.z + this.point0.z;
	var directionZ = this.point2.x - this.point0.x;
	var norm = Math.sqrt(directionX * directionX + directionZ * directionZ); 
	var directionXn = directionX / norm;
	var directionZn = directionZ / norm; 
	
	this.point1.x = directionXn * dist1 + this.point0.x; 
	this.point1.z = directionZn * dist1 + this.point0.z;
	
	this.dragNdrop1.position.x = this.point1.x;
	this.dragNdrop1.position.z = this.point1.z;
	
	
	this.mesh.scale.x = dist1;
	this.mesh.scale.z = dist2; 
	

	this.mesh.rotation.y = Math.atan(-(this.point1.z-this.point0.z) / (this.point1.x- this.point0.x));
	this.mesh.position.x = this.point0.x;
	this.mesh.position.y = this.point0.y;
	this.mesh.position.z = this.point0.z;

	this.xAxis.geometry.verticesNeedUpdate = true;
	this.yAxis.geometry.verticesNeedUpdate = true;
    this.zAxis.geometry.verticesNeedUpdate = true;
	
};

LEVObject.prototype.setPosition3 = function(_x,_y,_z){
	this.point3.x = _x;
	this.point3.y = _y;
	this.point3.z = _z;
	this.dragNdrop3.position.y = _y;
	var dist3 = this.point3.y - this.point0.y;
	this.mesh.scale.y = dist3;
	
	this.xAxis.geometry.verticesNeedUpdate = true;
	this.yAxis.geometry.verticesNeedUpdate = true;
    this.zAxis.geometry.verticesNeedUpdate = true;
};

/**
 * Returns a hash map with values to save. 
 */
LEVObject.prototype.storeValues = function(_trial, _session, _trial_id) {  
  if (_trial === null) {
    _trial = new Trial();
	_trial.type = this.objConfig.type;
	_trial.id = _trial_id;
	_session.trials[_session.trials.length] = _trial;
	}
  var rating = new SpatialLEVRating();
  rating.name = this.objConfig.name;
  rating.stimulus = this.objConfig.stimulus; 

  rating.position_center = [];
  rating.position_width1 = [];
  rating.position_width2 = [];
  rating.position_height = [];
  rating.position_center[0] = this.point0.x;
  rating.position_center[1] = this.point0.y;
  rating.position_center[2] = this.point0.z;
  rating.position_width1[0] = this.point1.x;
  rating.position_width1[1] = this.point1.y;
  rating.position_width1[2] = this.point1.z;
  
  rating.position_width2[0] = this.point2.x;
  rating.position_width2[1] = this.point2.y;
  rating.position_width2[2] = this.point2.z;
  rating.position_height[0] = this.point3.x;
  rating.position_height[1] = this.point3.y;
  rating.position_height[2] = this.point3.z;
  
  _trial.responses[_trial.responses.length] = rating;
};