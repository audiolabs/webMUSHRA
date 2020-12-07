/*************************************************************************
         (C) Copyright AudioLabs 2017 

This source code is protected by copyright law and international treaties. This source code is made available to You subject to the terms and conditions of the Software License for the webMUSHRA.js Software. Said terms and conditions have been made available to You prior to Your download of this source code. By downloading this source code You agree to be bound by the above mentionend terms and conditions, which can also be found here: https://www.audiolabs-erlangen.de/resources/webMUSHRA. Any unauthorised use of this source code may result in severe civil and criminal penalties, and will be prosecuted to the maximum extent possible under law. 

**************************************************************************/

function LikertMultiStimulusPage(_pageManager, _pageTemplateRenderer, _pageConfig, _audioContext, _bufferSize, _audioFileLoader, _session, _errorHandler, _language) {
  this.pageManager = _pageManager;
  this.pageConfig = _pageConfig;
  this.pageTemplateRenderer = _pageTemplateRenderer;  
  this.audioContext = _audioContext;
  this.bufferSize = _bufferSize;
  this.audioFileLoader = _audioFileLoader;
  this.session = _session;      
  this.errorHandler = _errorHandler;
  this.language = _language;
  this.fpc = null; 
  
  this.results = [];
  this.time = 0;
  this.startTimeOnPage = null;
	
  this.ratingMap = new Array();

  this.stimuli = [];
  for (var key in _pageConfig.stimuli) {
    this.stimuli[this.stimuli.length] = new Stimulus(key, _pageConfig.stimuli[key]);
  }
  shuffle(this.stimuli);
  
  
  for (var i = 0; i < this.stimuli.length; ++i) {
    this.audioFileLoader.addFile(this.stimuli[i].getFilepath(), (function (_buffer, _stimulus) { _stimulus.setAudioBuffer(_buffer); }), this.stimuli[i]);
  }
  this.filePlayer = null;
  this.likerts = [];
  
  
} 

LikertMultiStimulusPage.prototype.getName = function () {
  return this.pageConfig.name;
};

LikertMultiStimulusPage.prototype.init = function (_callbackError) { 
  this.likerts = [];

  var cbk = (function(_prefix) {
    this.ratingMap[_prefix] = true;
    if (Object.keys(this.ratingMap).length == this.stimuli.length) {
      this.pageTemplateRenderer.unlockNextButton();
    }
  }).bind(this);
  
  
  if (this.pageConfig.mustRate === false) {
    cbk = false;
    //this.pageTemplateRenderer.unlockNextButton();
  }
  
  for (var i = 0; i < this.stimuli.length; ++i) {    
    this.likerts[i] = new LikertScale(this.pageConfig.response, i + "_", this.pageConfig.mustPlayback, cbk);
  }
  this.filePlayer = new FilePlayer(this.audioContext, this.bufferSize, this.stimuli, this.errorHandler, this.language, this.pageManager.getLocalizer());
  if (this.pageConfig.mustPlayback) {
    this.filePlayer.genericAudioControl.addEventListener((function (_event) {
      if (_event.name == this.pageConfig.mustPlayback) {
        this.likerts[_event.index].enable();
      } 
    }).bind(this));

	}

};
LikertMultiStimulusPage.prototype.render = function (_parent) {  
  var div = $("<div></div>");
  _parent.append(div);

  var content; 
  if(this.pageConfig.content === null){
    content ="";
  } else {
    content = this.pageConfig.content;
  }
  
  var p = $("<p>" + content + "</p>");
  div.append(p);

  this.filePlayer.render(_parent);
  
  for (var i = 0; i < this.stimuli.length; ++i) {
    this.likerts[i].render(this.filePlayer.getHook(i));     
  }
  
  this.fpc = new FilePlayerController(this.filePlayer);
  this.fpc.bind();
};

LikertMultiStimulusPage.prototype.load = function () {  
  this.startTimeOnPage = new Date();
  if(this.pageConfig.mustRate == true){
  	this.pageTemplateRenderer.lockNextButton();
  }
  for(var i = 0; i < this.stimuli.length; ++i){
  	if(this.results[i]){
      $("input[name='"+this.likerts[i].prefix +"_response'][value='"+this.results[i]+"']").attr("checked", "checked");
      $("input[name='"+this.likerts[i].prefix +"_response'][value='"+this.results[i]+"']").checkboxradio("refresh");
      this.likerts[i].group.change();
    }
  }
  
    
  this.filePlayer.init();
};

LikertMultiStimulusPage.prototype.save = function () {
  this.fpc.unbind(); 
  this.time += (new Date() - this.startTimeOnPage);
  for(var i = 0; i < this.stimuli.length; ++i){
    this.results[i] = $("input[name='"+this.likerts[i].prefix +"_response']:checked").val();
  }
  this.filePlayer.free();
};

LikertMultiStimulusPage.prototype.store = function (_reponsesStorage) {
	
	if(this.pageConfig.response != null){
  trial = new Trial();
  trial.type = this.pageConfig.type;
  trial.id = this.pageConfig.id;
	
  for(var i = 0; i < this.stimuli.length; ++i){
  	 	
  	var rating = new LikertMultiStimulusRating();
  	
    rating.stimulus = this.stimuli[i].id;
    if(this.results[i] == undefined){
      rating.stimulusRating = "NA";
    }else{
      rating.stimulusRating = this.results[i];
    }
    
    rating.time = this.time;
    trial.responses[trial.responses.length] = rating;
  }


  this.session.trials[this.session.trials.length] = trial;	  
  }
 
 
};
