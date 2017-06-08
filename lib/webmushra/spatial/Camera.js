/*************************************************************************
         (C) Copyright AudioLabs 2017 

This source code is protected by copyright law and international treaties. This source code is made available to You subject to the terms and conditions of the Software License for the webMUSHRA.js Software. Said terms and conditions have been made available to You prior to Your download of this source code. By downloading this source code You agree to be bound by the above mentionend terms and conditions, which can also be found here: https://www.audiolabs-erlangen.de/resources/webMUSHRA. Any unauthorised use of this source code may result in severe civil and criminal penalties, and will be prosecuted to the maximum extent possible under law. 

**************************************************************************/


CameraType = {
  PERSPECTIVE : 0,
  ORTHOGRAPHIC : 1
};


function Camera(_type, _parentDomElement){
  this.type = _type;
  this.camera = null;
	switch(this.type) {
	  case CameraType.PERSPECTIVE:
	   this.camera = new THREE.PerspectiveCamera(45, _parentDomElement.getAttribute("width") / _parentDomElement.getAttribute("height"), 1, 10000);
	  break;
	  case CameraType.ORTHOGRAPHIC:
     this.camera = new THREE.OrthographicCamera(- _parentDomElement.getAttribute("width") / 2, _parentDomElement.getAttribute("width") / 2, _parentDomElement.getAttribute("height") / 2, -_parentDomElement.getAttribute("height") / 2, 0, 10000);	  
	  break;
	  default:
	  console.log("Unknown camera type.");
	}	
}

/**
 * Sets the camera at the given position.
 * @param {Object} _x x-Coordinate of the camera.
 * @param {Object} _y y- Coordinate of the camera.
 * @param {Object} _z z-Coordinate of the camera.
 * @param {Object} _rotx Rotation of the x axis of the camera.
 * @param {Object} _roty Rotation of the y axis of the camera.
 * @param {Object} _rotz Rotation of the z axis of the camera.
 */
Camera.prototype.setPosition = function(_x, _y, _z, _rotx, _roty, _rotz) {
	this.camera.position.x = _x;
	this.camera.position.y = _y;
	this.camera.position.z = _z;
	this.camera.rotation.x = _rotx * 2* Math.PI / 360;
	this.camera.rotation.y = _roty * 2* Math.PI / 360;
	this.camera.rotation.z = _rotz * 2* Math.PI / 360;
	if(this.type == 0){
	this.camera.up.set(0,1,0); // z should be negativ and small due to up direction in top view (it's rotated otherwise)
	this.camera.lookAt(new THREE.Vector3(0,0,0));
	}
	this.camera.updateMatrix();
};

Camera.prototype.getCameraType = function() {
	return this.type;
};

Camera.prototype.setCameraPolar = function(_r, _phi, _theta) {
	if (_theta < Math.PI - 0.01 && _theta > 0.01) {
		var x = _r * Math.sin(_theta) * Math.cos(_phi);
		var z = _r * Math.sin(_theta) * Math.sin(_phi);
		var y = _r * Math.cos(_theta);

		var center = new THREE.Vector3(x, y, z);
		center.x = 0;
		center.y = 100;
		center.z = 0;
		this.setCamera(x, y, z);
		this.camera.lookAt(center);

	}

};

Camera.prototype.getCamera = function() {
  return this.camera;
};


Camera.prototype.getCameraR = function() {
	var x = this.getCameraX();
	var z = this.getCameraY();
	var y = this.getCameraZ();
	return Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2) + Math.pow(z, 2));
};

Camera.prototype.getCameraPhi = function() {
	var x = this.getCameraX();
	var z = this.getCameraY();
	var y = this.getCameraZ();

	if (x > 0) {
		return Math.atan(y / x);
	} else if (x == 0) {
		if (y < 0) {
			return -Math.PI / 2;
		} else {
			return Math.PI / 2;
		}
	} else if (y < 0) {
		return Math.atan(y / x) - Math.PI;
	} else {
		return Math.atan(y / x) + Math.PI;
	}
};

Camera.prototype.getCameraTheta = function() {
	var x = this.getCameraX();
	var z = this.getCameraY();
	var y = this.getCameraZ();

	return Math.acos(z / this.getCameraR());
};

/**
 *returns the x-coordinate of the camera.
 */
Camera.prototype.getCameraX = function() {
	return this.camera.position.x;
};
/**
 *returns the y-coordinate of the camera.
 */
Camera.prototype.getCameraY = function() {
	return this.camera.position.y;
};
/**
 *returns the z-coordinate of the camera.
 */
Camera.prototype.getCameraZ = function() {
	return this.camera.position.z;
};
/**
 *returns the rotation in x direction of the camera.
 */
Camera.prototype.getCameraRotX = function() {
	return this.camera.rotation.x;
};
/**
 *returns the rotation in y direction of the camera.
 */
Camera.prototype.getCameraRotY = function() {
	return this.camera.rotation.y;
};
/**
 *returns the rotation in z direction of the camera.
 */
Camera.prototype.getCameraRotZ = function() {
	return this.camera.rotation.z;
};