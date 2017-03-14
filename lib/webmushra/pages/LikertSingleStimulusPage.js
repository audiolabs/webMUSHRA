/*************************************************************************
         (C) Copyright AudioLabs 2017 

This source code is protected by copyright law and international treaties. This source code is made available to You subject to the terms and conditions of the Software License for the webMUSHRA.js Software. Said terms and conditions have been made available to You prior to Your download of this source code. By downloading this source code You agree to be bound by the above mentionend terms and conditions, which can also be found here: https://www.audiolabs-erlangen.de/resources/webMUSHRA. Any unauthorised use of this source code may result in severe civil and criminal penalties, and will be prosecuted to the maximum extent possible under law. 

**************************************************************************/

function LikertSingleStimulusPage(_pageManager, _pageTemplateRenderer, _pageConfig, _audioContext, _bufferSize, _audioFileLoader, _stimulus, _session, _errorHandler, _language) {
  this.pageManager = _pageManager;
  this.pageTemplateRenderer = _pageTemplateRenderer; 
  this.pageConfig = _pageConfig;  
  this.audioContext = _audioContext;
  this.bufferSize = _bufferSize;
  this.audioFileLoader = _audioFileLoader;
  this.stimulus = _stimulus;  
  this.session = _session;      
  this.errorHandler = _errorHandler;
  this.language = _language;
  this.fpc = null;    
    
  this.audioFileLoader.addFile(this.stimulus.getFilepath(), (function (_buffer, _stimulus) { _stimulus.setAudioBuffer(_buffer); }), this.stimulus);
  this.filePlayer = null;
  this.likert = null;
  this.ratingMap = new Array();
    
  this.time = 0; 
  this.startTimeOnPage = null;
  this.result= null;
} 

LikertSingleStimulusPage.prototype.getName = function () {
  return this.pageConfig.name;
};

LikertSingleStimulusPage.prototype.init = function (_callbackError) { 
  this.filePlayer = new FilePlayer(this.audioContext, this.bufferSize, [this.stimulus], this.errorHandler, this.language, this.pageManager.getLocalizer());
  
    var cbk = (function(_prefix) {
    this.ratingMap[_prefix] = true;
    if (Object.keys(this.ratingMap).length == 1) {
      this.pageTemplateRenderer.unlockNextButton();
    }
  }).bind(this);
  
  
  if (this.pageConfig.mustRate === false) {
    cbk = false;  
  }
  
  
    this.likert = new LikertScale(this.pageConfig.response, "1_", this.pageConfig.mustPlayback == true, cbk);
 
 
  if (this.pageConfig.mustPlayback) {
    this.filePlayer.genericAudioControl.addEventListener((function (_event) {
      if (_event.name == 'ended') {
        this.likert.enable();
      } 
    }).bind(this));

	}

};
  



LikertSingleStimulusPage.prototype.render = function (_parent) {  
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

  
  this.likert.render(_parent); 
  
  this.fpc = new FilePlayerController(this.filePlayer);
  this.fpc.bind();
};

LikertSingleStimulusPage.prototype.load = function () {  
  this.startTimeOnPage = new Date();
  if(this.pageConfig.mustRate == true){
    this.pageTemplateRenderer.lockNextButton();
  }
	if(this.result){
    $("input[name='"+this.likert.prefix +"_response'][value='"+this.result+"']").attr("checked", "checked");
    $("input[name='"+this.likert.prefix +"_response'][value='"+this.result+"']").checkboxradio("refresh");
    this.likert.group.change();  
  }
  
  this.filePlayer.init();
};

LikertSingleStimulusPage.prototype.save = function () {
  this.fpc.unbind(); 
  this.time += (new Date() - this.startTimeOnPage);
  
  this.result = $("input[name='"+this.likert.prefix +"_response']:checked").val();
  
  this.filePlayer.free();
};

LikertSingleStimulusPage.prototype.store = function (_reponsesStorage) {
		
	
	
  var trial = this.session.getTrial(this.pageConfig.type, this.pageConfig.id);
  if (trial === null) {
    trial = new Trial();
	trial.type = this.pageConfig.type;
	trial.id = this.pageConfig.id;
	this.session.trials[this.session.trials.length] = trial;	  
  }
  var rating = new LikertSingleStimulusRating();
  rating.stimulus = this.stimulus.id;
  
  if(this.result == undefined){
    rating.stimulusRating = "NA";
  }else{
    rating.stimulusRating = this.result;
  }
    
  rating.time = this.time;
  trial.responses[trial.responses.length] = rating;


};
