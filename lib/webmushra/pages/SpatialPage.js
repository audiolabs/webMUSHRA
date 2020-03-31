/*************************************************************************
         (C) Copyright AudioLabs 2017 

This source code is protected by copyright law and international treaties. This source code is made available to You subject to the terms and conditions of the Software License for the webMUSHRA.js Software. Said terms and conditions have been made available to You prior to Your download of this source code. By downloading this source code You agree to be bound by the above mentionend terms and conditions, which can also be found here: https://www.audiolabs-erlangen.de/resources/webMUSHRA. Any unauthorised use of this source code may result in severe civil and criminal penalties, and will be prosecuted to the maximum extent possible under law. 

**************************************************************************/

function SpatialPage(_pageManager, _pageConfig, _session, _audioContext, _bufferSize, _audioFileLoader, _errorHandler, _language) {
	this.session = _session;
	this.pageManager = _pageManager;
	this.pageConfig = _pageConfig;
	this.numberOfSpheres = this.pageConfig.numberofLocObj;
	this.time = new Date().getTime();
	this.audioContext = _audioContext;
	this.bufferSize = _bufferSize;
	this.audioFileLoader = audioFileLoader;
	this.errorHandler = errorHandler;
	this.language = _language;

	this.stimuli = [];

	this.div = null;

	this.renderDivs = [];

	this.scenes = [];
	this.cameras = [];
	this.responses = {};
	this.activeResponse = null;

	this.time = 0;
	this.framerate = this.pageConfig.framerate;
	this.filePlayer = null;
	this.fpc = null;

	this.mouseDown = false;

	for (var key in _pageConfig.stimuli) {
		this.stimuli[this.stimuli.length] = new Stimulus(key, _pageConfig.stimuli[key]);
	}
	shuffle(this.stimuli);

	for (var i = 0; i < this.stimuli.length; ++i) {
		this.audioFileLoader.addFile(this.stimuli[i].getFilepath(), (function(_buffer, _stimulus) {
			_stimulus.setAudioBuffer(_buffer);
		}), this.stimuli[i]);
	}
}

SpatialPage.prototype.initScenes = function() {

	for (var i = 0; i < this.pageConfig.views.length; ++i) {
		this.renderDivs[i] = document.createElement("div");
		this.renderDivs[i].setAttribute("id", "renderArea" + i);
		this.renderDivs[i].setAttribute("style", "border = solid");

		// camera
		if (this.pageConfig.views[i].view == 'front') {
			this.renderDivs[i].setAttribute("width", this.pageConfig.roomMeasurements[0]);
			this.renderDivs[i].setAttribute("height", this.pageConfig.roomMeasurements[1]);

			this.cameras[i] = new Camera(CameraType.ORTHOGRAPHIC, this.renderDivs[i]);
			this.cameras[i].setPosition(0, this.pageConfig.roomMeasurements[1] / 2, 800, 0, 0, 0);
		} else if (this.pageConfig.views[i].view == 'back') {
			this.renderDivs[i].setAttribute("width", this.pageConfig.roomMeasurements[0]);
			this.renderDivs[i].setAttribute("height", this.pageConfig.roomMeasurements[1]);

			this.cameras[i] = new Camera(CameraType.ORTHOGRAPHIC, this.renderDivs[i]);
			this.cameras[i].setPosition(0, this.pageConfig.roomMeasurements[1] / 2, -800, 0, 180, 0);
		} else if (this.pageConfig.views[i].view == 'top') {
			this.renderDivs[i].setAttribute("width", this.pageConfig.roomMeasurements[0]);
			this.renderDivs[i].setAttribute("height", this.pageConfig.roomMeasurements[2]);

			this.cameras[i] = new Camera(CameraType.ORTHOGRAPHIC, this.renderDivs[i]);
			this.cameras[i].setPosition(0, 500, 0, 90, 180, 180);
		} else if (this.pageConfig.views[i].view == 'right') {
			this.renderDivs[i].setAttribute("width", this.pageConfig.roomMeasurements[2]);
			this.renderDivs[i].setAttribute("height", this.pageConfig.roomMeasurements[1]);

			this.cameras[i] = new Camera(CameraType.ORTHOGRAPHIC, this.renderDivs[i]);
			this.cameras[i].setPosition(500, this.pageConfig.roomMeasurements[1] / 2, 0, 0, 90, 0);
		} else if (this.pageConfig.views[i].view == 'left') {
			this.renderDivs[i].setAttribute("width", this.pageConfig.roomMeasurements[2]);
			this.renderDivs[i].setAttribute("height", this.pageConfig.roomMeasurements[1]);

			this.cameras[i] = new Camera(CameraType.ORTHOGRAPHIC, this.renderDivs[i]);
			this.cameras[i].setPosition(-500, this.pageConfig.roomMeasurements[1] / 2, 0, 0, -90, 0);
		} else if (this.pageConfig.views[i].view == '3d') {
			this.renderDivs[i].setAttribute("width", this.pageConfig.roomMeasurements[2]);
			// TODO: Susi
			this.renderDivs[i].setAttribute("height", this.pageConfig.roomMeasurements[1]);

			var position = this.pageConfig.views[i].position;
			var rotation = this.pageConfig.views[i].rotation;
			this.cameras[i] = new Camera(CameraType.PERSPECTIVE, this.renderDivs[i]);
			this.cameras[i].setPosition(position[0], position[1], position[2], 0, 0, 0);
		}

		// scene
		this.scenes[i] = new Scene(this.renderDivs[i], this.cameras[i], this.pageConfig, this.pageConfig.views[i]);

		this.renderDivs[i].onmousedown = (function(event) {
			this.page.mouseDown = true;
			var parentOffset = $(event.target).parent().offset();
			var width = parseFloat(this.div.getAttribute("width"));
			var height = parseFloat(this.div.getAttribute("height"));
			var relX = event.pageX - parentOffset.left;
			var relY = event.pageY - parentOffset.top;
			var relPosX = relX - width / 2.0;
			var relPosY = relY - height / 2.0;

			if (this.page.activeResponse !== null) {
				var objects = this.page.responses[this.page.activeResponse].objects;
				var centerPosition = objects[0].getCenterPosition();
				var positions = this.scene.transformRelativeCoordinates(relPosX, relPosY, centerPosition[0], centerPosition[1], centerPosition[2]);
				for (var j = 0; j < objects.length; ++j) {
					if (objects[j].eventOnMouseDown) {
						objects[j].eventOnMouseDown(event, positions[0], positions[1], positions[2]);
					}
				}
			}

		}).bind({
			page : this,
			div : this.renderDivs[i],
			scene : this.scenes[i]
		});

		this.renderDivs[i].onmouseup = (function(event) {
			this.page.mouseDown = false;
		}).bind({
			page : this
		});

		this.renderDivs[i].onmousemove = (function(event) {
			var newtime = new Date().getTime();
			if((newtime - this.page.time) >= this.page.framerate){
				this.page.time = newtime; 
				console.log("update");
				var parentOffset = $(event.target).parent().offset();
				var width = parseFloat(this.div.getAttribute("width"));
				var height = parseFloat(this.div.getAttribute("height"));
				var relX = event.pageX - parentOffset.left;
				var relY = event.pageY - parentOffset.top;
				var relPosX = relX - width / 2.0;
				var relPosY = relY - height / 2.0;
	
				if (this.page.mouseDown == true) {
					if (this.page.activeResponse !== null) {
						var objects = this.page.responses[this.page.activeResponse].objects;
						var centerPosition = objects[0].getCenterPosition();
						var positions = this.scene.transformRelativeCoordinates(relPosX, relPosY, centerPosition[0], centerPosition[1], centerPosition[2]);
						for (var j = 0; j < objects.length; ++j) {
							if (objects[j].eventOnMouseMove && this.scene.camera.type !="PerspectiveCamera") {
								objects[j].eventOnMouseMove(event, positions[0], positions[1], positions[2]);
							}
						}
					}
				}
			}
		}).bind({
			page : this,
			div : this.renderDivs[i],
			scene : this.scenes[i]
		});
		
	}

	for (var i = 0; i < this.pageConfig.views.length; ++i) {
		this.scenes[i].load();
	}

	for (var i = 0; i < this.pageConfig.objects.length; ++i) {
		var objConfig = this.pageConfig.objects[i];
		if (objConfig.type == "listener") {
			for (var j = 0; j < this.pageConfig.views.length; ++j) {
				this.scenes[j].addListener(objConfig);
			}
		} else if (objConfig.type == "custom") {
			for (var j = 0; j < this.pageConfig.views.length; ++j) {
				this.scenes[j].addCustomObject(objConfig);
			}
		}
	}

	for (var i = 0; i < this.pageConfig.responses.length; ++i) {
		var respConfig = this.pageConfig.responses[i];
		if (respConfig.type == "localization") {
			this.responses[respConfig.name] = {
				objects : [],
				config : respConfig
			};
			for (var j = 0; j < this.pageConfig.views.length; ++j) {
				var locObj = new LocalizationObject(respConfig);
				locObj.init(this.scenes[j].scene);
				this.responses[respConfig.name].objects[this.responses[respConfig.name].objects.length] = locObj;
			}
		}
		if (respConfig.type == "lev") {
			this.responses[respConfig.name] = {
				objects : [],
				config : respConfig
			};
			for (var j = 0; j < this.pageConfig.views.length; ++j) {
				var levObj = new LEVObject(respConfig);
				levObj.init(this.scenes[j].scene);
				this.responses[respConfig.name].objects[this.responses[respConfig.name].objects.length] = levObj;
			}
		}
		if (respConfig.type == "asw") {
			this.responses[respConfig.name] = {
				objects : [],
				config : respConfig
			};
			for (var j = 0; j < this.pageConfig.views.length; ++j) {
				respConfig.height = null;
				respConfig.depth = null;
				var aswObj = new ASWObject(respConfig);
				aswObj.init(this.scenes[j].scene);
				this.responses[respConfig.name].objects[this.responses[respConfig.name].objects.length] = aswObj;
			}
		}
		if (respConfig.type == "hwd") {
			this.responses[respConfig.name] = {
				objects : [],
				config : respConfig
			};
			for (var j = 0; j < this.pageConfig.views.length; ++j) {
				var hwdObj = new ASWObject(respConfig);
				hwdObj.init(this.scenes[j].scene);
				this.responses[respConfig.name].objects[this.responses[respConfig.name].objects.length] = hwdObj;
			}
		}
	}
};

SpatialPage.prototype.init = function() {
	this.initScenes();
	this.filePlayer = new FilePlayer(this.audioContext, this.bufferSize, this.stimuli, this.errorHandler, this.language, this.pageManager.getLocalizer());
};

SpatialPage.prototype.render = function(_id) {

	var div = document.createElement("div");

	// content
	var content;
	if (this.pageConfig.content !== undefined) {
		content = this.pageConfig.content;
		var text = document.createElement("div");
		text.innerHTML = content;
		div.appendChild(text);
	}
	_id.append(div);

	// stimuli
	var tableStimuli = document.createElement("table");
	tableStimuli.setAttribute("border", "0");
	tableStimuli.setAttribute("align", "center");
	tableStimuli.setAttribute("style", "margin-top: 0em;");
	var trStimuli = document.createElement("tr");
	for (var i = 0; i < this.stimuli.length; ++i) {
		var td = $("<td></td>");
		var divStimulus = $("<div id='spatial_stimuli_" + i + "' class='ui-body ui-body-a ui-corner-all'></div>");
		td.append(divStimulus);
		this.filePlayer.renderElement(divStimulus, i);

		trStimuli.appendChild(td.get(0));
	}
	tableStimuli.appendChild(trStimuli);
	div.appendChild(tableStimuli);

	// responses

	for (var i = 0; i < this.pageConfig.responses.length; ++i) {
		var respConfig = this.pageConfig.responses[i];
		var stimulus = null;
		var stimulusIndex = null;
		for (var j = 0; j < this.stimuli.length; ++j) {
			if (this.stimuli[j].getId() == respConfig.stimulus) {
				stimulus = this.stimuli[j];
				stimulusIndex = j;
				break;
			}
		}

		var color = "#" + ((1 << 24) + respConfig.color).toString(16).substr(1);
		button = $("<button id='" + respConfig.name + "' data-inline='true' style='background-color:#" + ((1 << 24) + respConfig.color).toString(16).substr(1) + "; background-image:radial-gradient(#ffffff 0%, " + color + " 100%)'>" + respConfig.label + "</button>");
		button.on("click", (function() {
			this.page.setBoxShadow(this.page.activeResponse, this.name, "#555555");
			this.page.activeResponse = this.name;
		}).bind({
			page : this,
			label : respConfig.label,
			name : respConfig.name,
			button : button
		}));
		$("#spatial_stimuli_" + stimulusIndex).append(button);
	}
	// scenes
	var tableScenes = document.createElement("table");
	tableScenes.setAttribute("border", "0");
	tableScenes.setAttribute("align", "center");
	tableScenes.setAttribute("style", "margin-top: 0em;");
	var trScenes = document.createElement("tr");
	for (var i = 0; i < this.pageConfig.views.length; ++i) {
		var td = document.createElement("td");
		td.appendChild(this.renderDivs[i]);
		trScenes.appendChild(td);
	}

	tableScenes.appendChild(trScenes);
	div.appendChild(tableScenes);

	this.renderScene();

	_id.append(div);
};

SpatialPage.prototype.setBoxShadow = function(_lastActiveButton, _currentActiveButton, color) {
	if (_lastActiveButton != null) {
		document.getElementById(_lastActiveButton).style.boxShadow = "0 0 0 white , 0 0 0 white";

	}
	document.getElementById(_currentActiveButton).style.boxShadow = "0 0 30px " + color + " , 0 0 30px " + color;
};

SpatialPage.prototype.renderScene = function() {
	for (var i = 0; i < this.pageConfig.views.length; ++i) {
		this.scenes[i].render();
	}
};

SpatialPage.prototype.store = function() {
  var trial_localization = this.session.getTrial("localization", this.pageConfig.id);
 
  var trial_asw = this.session.getTrial("asw", this.pageConfig.id);
 
  var trial_lev = this.session.getTrial("lev", this.pageConfig.id);
 
  var trial_hwd = this.session.getTrial("hwd", this.pageConfig.id);
  
  
	for (key in this.responses) { 
		if(this.responses[key].objects[0] instanceof (ASWObject) && key.height == 0){
			this.responses[key].objects[0].storeValues(trial_asw, this.session, this.pageConfig.id);
		}
		if(this.responses[key].objects[0] instanceof (LocalizationObject)){
			this.responses[key].objects[0].storeValues(trial_localization, this.session, this.pageConfig.id);
		}
		if(this.responses[key].objects[0] instanceof (LEVObject)){
			this.responses[key].objects[0].storeValues(trial_lev, this.session, this.pageConfig.id);
		}
		if(this.responses[key].objects[0] instanceof (ASWObject)){
			this.responses[key].objects[0].storeValues(trial_hwd, this.session, this.pageConfig.id);
		}
		
	}
};

SpatialPage.prototype.load = function() {
	this.startTimeOnPage = new Date();
	this.frameUpdateInterval = setInterval((function() {
		this.renderScene();
	}).bind(this), this.framerate);
	this.filePlayer.init();
};

SpatialPage.prototype.save = function() {
	clearInterval(this.frameUpdateInterval);
	this.time += (new Date() - this.startTimeOnPage);
	this.filePlayer.free();
};

SpatialPage.prototype.getName = function() {
	return this.pageConfig.name;
};
