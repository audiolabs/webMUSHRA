/*************************************************************************
         (C) Copyright AudioLabs 2017 

This source code is protected by copyright law and international treaties. This source code is made available to You subject to the terms and conditions of the Software License for the webMUSHRA.js Software. Said terms and conditions have been made available to You prior to Your download of this source code. By downloading this source code You agree to be bound by the above mentionend terms and conditions, which can also be found here: https://www.audiolabs-erlangen.de/resources/webMUSHRA. Any unauthorised use of this source code may result in severe civil and criminal penalties, and will be prosecuted to the maximum extent possible under law. 

**************************************************************************/

function Scene(_parentDomElement, _camera, _pageConfig, _viewConfig) {
	this.pageConfig = _pageConfig;
	this.scene = new THREE.Scene();
	this.parser = new DOMParser();
	this.wmCamera = _camera; // webMUSHRA camera
	this.camera = _camera.getCamera();
	this.viewConfig = _viewConfig;

	this.renderer = new THREE.WebGLRenderer({
  	  antialias : true, // to get smoother output
	  preserveDrawingBuffer : true
	});


	this.renderer.setSize(_parentDomElement.getAttribute("width"), _parentDomElement.getAttribute("height"));
	_parentDomElement.appendChild(this.renderer.domElement);

	this.divHeight = _parentDomElement.getAttribute("height");

	this.height = null;
	this.width = null;
	this.depth = null;
	this.materialWall = null;
	this.material = null;
	this.materialWallLeft = null;
	this.materialWallRight = null;
	this.materialFloor = null;
	this.materialCeiling = null;
	this.ambient = null;
	this.wallLeft = null;
	this.wallRight = null;
	this.wall = null;
	this.wallfront = null;
	this.floor = null;
	this.ceiling = null;


};


Scene.prototype.transformRelativeCoordinates = function(_relX, _relY, _activeObjX, _activeObjY, _activeObjZ) {

  var position = [null, null, null];
  if(this.wmCamera.type == 1){ //orthographic camera
  	if(this.viewConfig.view == 'front'){
		position[1] = -_relY + this.divHeight /2;
		position[0] = _relX;
	} else if(this.viewConfig.view == 'back'){
		position[1] = -_relY + this.divHeight /2;
		position[0] = -_relX;
	} else if(this.viewConfig.view == 'top'){
		position[0] = _relX;
		position[2] = _relY;
	} else if(this.viewConfig.view == 'right'){
		position[1] = -_relY + this.divHeight /2;
		position[2] = -_relX ;
	} else if(this.viewConfig.view == 'left'){
		position[1] = -_relY + this.divHeight/2;
		position[2] = _relX ;
	}

  }else { 
  	var cameraDir = (new THREE.Vector3(-this.wmCamera.getCameraX(), -this.wmCamera.getCameraY(),-this.wmCamera.getCameraZ()));
  	var cameraDir_n = new THREE.Vector3();
  	cameraDir_n.copy(cameraDir);	
  	cameraDir_n.normalize();
  	
  
  	var quaternion_y = new THREE.Quaternion(); 
  	quaternion_y.setFromUnitVectors(new THREE.Vector3(0,0,-1), (new THREE.Vector3(cameraDir_n.x, 0, cameraDir_n.z)).normalize());
  	var horizontal_rot = new THREE.Vector3(); 
  	horizontal_rot = new THREE.Vector3(0,0,-1);
  	horizontal_rot.applyQuaternion(quaternion_y);
  	
  	var quaternion_tilt = new THREE.Quaternion();
  	quaternion_tilt.setFromUnitVectors(horizontal_rot, cameraDir_n);
  	
  	var shift = cameraDir_n.dot(new THREE.Vector3(_activeObjX, _activeObjY, _activeObjZ));
  	
  	
  	var scaling = (cameraDir.length())*Math.tan(22.5* Math.PI / 180) / (this.divHeight /2); 
  	var unrotated = new THREE.Vector3(_relX * scaling, -_relY * scaling, 0); 
  	var rotated = unrotated.applyQuaternion(quaternion_y);
  	
  	rotated = rotated.applyQuaternion(quaternion_tilt);
  	
  	var newPos_vector = new THREE.Vector3(rotated.x, rotated.y, rotated.z );

  	var newPos = new THREE.Vector3;
  	newPos.addVectors(cameraDir, newPos_vector);
  	newPos.normalize();

  	newPos.multiplyScalar(Math.sqrt(Math.pow((cameraDir.length() + shift),2) + Math.pow(newPos_vector.length() * (cameraDir.length() + shift) / cameraDir.length(),2)));
  	newPos.addVectors(newPos, cameraDir.negate());


  	position[0] = newPos.x;
  	position[1] = newPos.y;
  	position[2] = newPos.z;
  }

  return position;

};

/**
 * Loads a scene into the room viewer.
 * @param {String} _roomXML Content of a room xml.
 */
Scene.prototype.load = function() {
 	 var parser = new DOMParser();
   this.setAmbientLight(0xeeeeee);
   this.setDirectionalLight();
 	 this.scene.add(this.camera);
	 this.buildRectangularElement();
};

/**
 *Renders the scene.
 */
Scene.prototype.render = function() {
	this.renderer.render(this.scene, this.camera);
};

Scene.prototype.buildRectangularElement = function() {
	this.width = this.pageConfig.roomMeasurements[0];
	this.height = this.pageConfig.roomMeasurements[1];
	this.depth = this.pageConfig.roomMeasurements[2];

	var carpet = THREE.ImageUtils.loadTexture('res/spatial/carpet.png');
	carpet.wrapS = THREE.RepeatWrapping;
	carpet.wrapT = THREE.RepeatWrapping;
	carpet.repeat.x = 8;
	carpet.repeat.y = 8;

	this.materialFloor = new THREE.MeshBasicMaterial({
		map : carpet,
		// side : THREE.SingleSided,

	});
	this.floor = new THREE.Mesh(new THREE.PlaneGeometry(this.width, this.depth), this.materialFloor);

	var wallpaper = new THREE.ImageUtils.loadTexture("res/spatial/ceiling.png");
	wallpaper.wrapS = THREE.RepeatWrapping;
	wallpaper.wrapT = THREE.RepeatWrapping;
	wallpaper.repeat.x = 8;
	wallpaper.repeat.y = 8;

	var wall = new THREE.ImageUtils.loadTexture("res/spatial/wall.png");
	wall.wrapS = THREE.RepeatWrapping;
	wall.wrapT = THREE.RepeatWrapping;
	wall.repeat.x = 4;
	wall.repeat.y = 2;

	this.materialWall = new THREE.MeshLambertMaterial({
		map : wall,
		// side : THREE.SingleSided,
	});

	this.materialCeiling = new THREE.MeshLambertMaterial({
		map : wallpaper,
		// side : THREE.SingleSided,
	});

	this.wall = new THREE.Mesh(new THREE.PlaneGeometry(this.width, this.height, 10, 10), this.materialWall);

	this.materialWallLeft = new THREE.MeshLambertMaterial({
		map : wall,
		// side : THREE.SingleSided,
	});

	this.wallfront = new THREE.Mesh(new THREE.PlaneGeometry(this.width, this.height, 10, 10), this.materialWall);

	this.materialWallLeft = new THREE.MeshLambertMaterial({
		map : wall,
		// side : THREE.SingleSided,
	});

	this.wallLeft = new THREE.Mesh(new THREE.PlaneGeometry(this.depth, this.height, 10, 10), this.materialWallLeft);

	this.materialWallRight = new THREE.MeshLambertMaterial({
		map : wall,
		// side : THREE.SingleSided,
	});

	this.wallRight = new THREE.Mesh(new THREE.PlaneGeometry(this.depth, this.height, 10, 10), this.materialWallRight);

	this.ceiling = new THREE.Mesh(new THREE.PlaneGeometry(this.width, this.depth, 10, 10), this.materialCeiling);

	this.material = new THREE.MeshBasicMaterial({
		map : wallpaper,
		// side : THREE.SingleSided,
		wireframe : true,
		opacity : 0.3,
	});

	this.floor.rotation.x = -Math.PI / 2;

	this.wallLeft.position.x = -this.width / 2;
	this.wallLeft.rotation.y = Math.PI / 2;
	this.wallLeft.position.y = this.height / 2;

	this.wallRight.position.x = this.width / 2;
	this.wallRight.rotation.y = -Math.PI / 2;
	this.wallRight.position.y = this.height / 2;

	this.wall.position.z = -this.depth / 2;
	this.wall.position.y = this.height / 2;

	this.wallfront.position.z = this.depth / 2;
	this.wallfront.position.y = this.height / 2;
	this.wallfront.rotation.y = Math.PI;

	this.ceiling.position.y = this.height / 2;
	this.ceiling.rotation.x = Math.PI / 2;
	this.ceiling.position.y = this.height;

	this.scene.add(this.ceiling);
	this.scene.add(this.wallRight);
	this.scene.add(this.wallLeft);
	this.scene.add(this.wall);
	this.scene.add(this.wallfront);
	this.scene.add(this.floor);


};

Scene.prototype.getHeight = function() {
	return this.height;
};

Scene.prototype.getWidth = function() {
	return this.width;
};
Scene.prototype.getDepth = function() {
	return this.depth;
};


/**
 *Adds the Listener into the scene.
 *  @param{ .xml} _listener Reeds the positions of all listeners and adds the Listener and the listenerstand to the scene.
 */
Scene.prototype.addListener = function(_configListener) {

	var x = _configListener.position[0];
	var y0 = 0;
	var y = _configListener.position[1];
	var z = _configListener.position[2];
	var rotx = (_configListener.rotation[0] + 180) * 2 * Math.PI / 360.0;
	var roty = _configListener.rotation[1] * 2 * Math.PI / 360.0;
	var rotz = _configListener.rotation[2] * 2 * Math.PI / 360.0;
	var loader = new THREE.ColladaLoader();

	var str = "var tempScene = this.scene; loader.load('res/spatial/listener_head.dae', function(collada) {";
	str += "collada.scene.scale.x = collada.scene.scale.y = collada.scene.scale.z = 10;";
	str += "collada.scene.rotation.x =-Math.PI / 2 + " + rotx + ";";
	str += "collada.scene.rotation.y = " + roty + " - Math.PI;";
	str += "collada.scene.rotation.z = Math.PI + " + rotz + ";";
	str += "collada.scene.position.x = " + x + ";";
	str += "collada.scene.position.y = " + y + ";";
	str += "collada.scene.position.z = " + z + ";";
	str += "tempScene.add(collada.scene)";
	str += "});";
	eval(str);


};

/**
 *Adds the Objects into the scene.
 *  @param{ .xml} _obj Reeds the positions and shapes the of all objects and adds them to the scene.
 */
Scene.prototype.addCustomObject = function(_objectConfig) {


	var loader = new THREE.ColladaLoader();
	var path = _objectConfig.path;

  var parameter = {config: _objectConfig, scene: this.scene};

  loader.load(path, (function(model) {

    var x = this.config.position[0];
    var y = this.config.position[1];
    var z = this.config.position[2];
    var rotx = this.config.rotation[0]* 2 * Math.PI / 360.0;;
    var roty = this.config.rotation[1]* 2 * Math.PI / 360.0;;
    var rotz = this.config.rotation[2]* 2 * Math.PI / 360.0;;


    model.scene.scale.x = model.scene.scale.y = model.scene.scale.z = this.config.scale;
    model.scene.position.x = x;
    model.scene.position.y = y;
    model.scene.position.z = z;
    model.scene.rotation.x = -Math.PI / 2 + rotx;
    model.scene.rotation.y = roty;
    model.scene.rotation.z = rotz;
    this.scene.add(model.scene);
  }).bind(parameter));
};


/**
 *set the DirectionalLight in the scene
 */
Scene.prototype.setDirectionalLight = function() {
	var light1 = new THREE.DirectionalLight(0x999999);
	light1.position.set(0, 100, 0);
	light1.target.position.set(0, 0, 0);
	light1.castShadow = true;
	light1.shadowDarkness = 0.2;
	light1.shadowCameraVisible = true;
	this.scene.add(light1);

	var light2 = new THREE.DirectionalLight(0x666666);
	light2.position.set(100, 0, 0);
	light2.target.position.set(0, 0, 0);
	light2.castShadow = true;
	light2.shadowDarkness = 0.2;
	light2.shadowCameraVisible = true;
	this.scene.add(light2);

	var light3 = new THREE.DirectionalLight(0x666666);
	light3.position.set(-100, 0, 0);
	light3.target.position.set(0, 0, 0);
	light3.castShadow = true;
	light3.shadowDarkness = 0.2;
	light3.shadowCameraVisible = true;
	this.scene.add(light3);

	var light4 = new THREE.DirectionalLight(0x666666);
	light4.position.set(0, 0, 100);
	light4.target.position.set(0, 0, 0);
	light4.castShadow = true;
	light4.shadowDarkness = 0.2;
	light4.shadowCameraVisible = true;
	this.scene.add(light4);

	var light5 = new THREE.DirectionalLight(0x666666);
	light5.position.set(0, 0, -100);
	light5.target.position.set(0, 0, 0);
	light5.castShadow = true;
	light5.shadowDarkness = 0.2;
	light5.shadowCameraVisible = true;
	this.scene.add(light5);
};
/**
 *sets the ambient light in the scene
 * @param {string} hexadecimal number _i color of the Light.
 */
Scene.prototype.setAmbientLight = function(_i) {
	this.ambient = new THREE.AmbientLight(_i);
	this.scene.add(this.ambient);
};



/**
 * sets the material of the wall in the background.
 * @param {boolean} true if the wall is transparent, false otherwise
 **/
Scene.prototype.setGridWall = function(_grid) {
	if (_grid == true) {
		this.wall.material = this.material;
	} else if (_grid == false) {
		this.wall.material = this.materialWall;
	}
};
/**
 * sets the material of the wall on the left hand side.
 * @param {boolean} true if the wall is transparent, false otherwise
 **/
Scene.prototype.setGridWallLeft = function(_grid) {
	if (_grid == true) {
		this.wallLeft.material = this.material;
	} else if (_grid == false) {
		this.wallLeft.material = this.materialWallLeft;
	}
};
/**
 * sets the material of the wall on the right hand side.
 * @param {boolean} true if the wall is transparent, false otherwise
 **/
Scene.prototype.setGridWallRight = function(_grid) {
	if (_grid == true) {
		this.wallRight.material = this.material;
	} else if (_grid == false) {
		this.wallRight.material = this.materialWallRight;
	}
};
/**
 * sets the material of the floor.
 * @param {boolean} true if the wall is transparent, false otherwise
 **/
Scene.prototype.setGridFloor = function(_grid) {
	if (_grid == true) {
		this.floor.material = this.material;
	} else if (_grid == false) {
		this.floor.material = this.materialFloor;
	}
};

/**
 * sets the material of the ceiling
 * @param {boolean} true if the wall is transparent, false otherwise
 **/
Scene.prototype.setGridCeiling = function(_grid) {
	if (_grid == true) {
		this.ceiling.material = this.material;
	} else if (_grid == false) {
		this.ceiling.material = this.materialCeiling;
	}
};

/**
 *sets the color of the left wall
 * @param {Object} _color the color the left wall will have
 */
Scene.prototype.setColorLeftWall = function(_color) {
	this.wallLeft.material.color.setHex(_color);

};

/**
 *returns the color of the wall in the background
 */
Scene.prototype.getColorWall = function() {
	return this.wall.material.color.getHex();

};

/**
 *sets the color of the wall in the background
 * @param {Object} _color the color the wall will have
 */
Scene.prototype.setColorWall = function(_color) {
	this.wall.material.color.setHex(_color);
};
