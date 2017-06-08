/*************************************************************************
         (C) Copyright AudioLabs 2017 

This source code is protected by copyright law and international treaties. This source code is made available to You subject to the terms and conditions of the Software License for the webMUSHRA.js Software. Said terms and conditions have been made available to You prior to Your download of this source code. By downloading this source code You agree to be bound by the above mentionend terms and conditions, which can also be found here: https://www.audiolabs-erlangen.de/resources/webMUSHRA. Any unauthorised use of this source code may result in severe civil and criminal penalties, and will be prosecuted to the maximum extent possible under law. 

**************************************************************************/

function LocalizationObject(_objConfig) {
  this.objConfig = _objConfig;

  this.material = new THREE.MeshPhongMaterial({ 
    color : _objConfig.color,
    ambient : 0x330000,
    emmissive : 0x222222,    
  });
  this.geometry = new THREE.SphereGeometry(_objConfig.size, 34, 30); 
  this.mesh = new THREE.Mesh(this.geometry, this.material);  
  this.mesh.position.x = _objConfig.position[0];
  this.mesh.position.y = _objConfig.position[1];
  this.mesh.position.z = _objConfig.position[2];
}

LocalizationObject.prototype.init = function(_scene) { 
  _scene.add(this.mesh); 
};

LocalizationObject.prototype.eventOnMouseUp = function(_event, _x, _y, _z) {    
};

LocalizationObject.prototype.eventOnMouseDown = function(_event, _x, _y, _z) {  
  if (_x != null) {
    this.mesh.position.x = _x;
  }
  if (_y != null) {
    this.mesh.position.y = _y;
  }
  if (_z != null) {
    this.mesh.position.z = _z;
  }
};

LocalizationObject.prototype.render = function() {  
};

LocalizationObject.prototype.getCenterPosition = function() {
  return [this.mesh.position.x, this.mesh.position.y, this.mesh.position.z];  
};


/**
 * Returns a hash map with values to save. 
 */
LocalizationObject.prototype.storeValues = function(_trial, _session, _trial_id) {  
  if (_trial === null) {
    _trial = new Trial();
	_trial.type = this.objConfig.type;
	_trial.id = _trial_id;
	_session.trials[_session.trials.length] = _trial;	  
  }
  var rating = new SpatialLocalizationRating();
  rating.name = this.objConfig.name;
  rating.stimulus = this.objConfig.stimulus; 
  rating.position = [];
  rating.position[0] = this.mesh.position.x;
  rating.position[1] = this.mesh.position.y;
  rating.position[2] = this.mesh.position.z;
  
  
  _trial.responses[_trial.responses.length] = rating;
};


