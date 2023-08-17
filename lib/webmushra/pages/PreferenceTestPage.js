/*************************************************************************
         (C) Copyright AudioLabs 2017 

This source code is protected by copyright law and international treaties. This source code is made available to You subject to the terms and conditions of the Software License for the webMUSHRA.js Software. Said terms and conditions have been made available to You prior to Your download of this source code. By downloading this source code You agree to be bound by the above mentionend terms and conditions, which can also be found here: https://www.audiolabs-erlangen.de/resources/webMUSHRA. Any unauthorised use of this source code may result in severe civil and criminal penalties, and will be prosecuted to the maximum extent possible under law. 

**************************************************************************/

function PreferenceTestPage(_pageManager, _pageTemplateRenderer, _audioContext, _bufferSize, _audioFileLoader, _stimuli,  _session, _pageConfig, _errorHandler, _language) {
  this.pageManager = _pageManager;
  this.pageTemplateRenderer = _pageTemplateRenderer;
  this.audioContext = _audioContext;
  this.bufferSize = _bufferSize;
  this.audioFileLoader = _audioFileLoader;
  this.session = _session;
  this.pageConfig = _pageConfig;
  this.errorHandler = _errorHandler;
  this.language = _language;
  this.div = null;
  this.fpc = null;

  this.currentItem = null; 

  this.stimuli = _stimuli;
	this.played = [];
  for (var i = 0; i < this.stimuli.length; ++i) {
    this.audioFileLoader.addFile(this.stimuli[i].getFilepath(), (function (_buffer, _stimulus) { _stimulus.setAudioBuffer(_buffer); }), this.stimuli[i]);
    this.played.push(false);
  }

  this.filePlayer = null;
  this.choice = null;
  this.time = 0; 
  this.startTimeOnPage = null;
}



PreferenceTestPage.prototype.getName = function () {
  return this.pageConfig.name;
};

PreferenceTestPage.prototype.init = function () { 
  this.filePlayer = new FilePlayer(this.audioContext, this.bufferSize, this.stimuli, this.errorHandler, this.language, this.pageManager.getLocalizer());
  
  if (typeof this.pageConfig.mustPlayback !== "undefined") {
    this.filePlayer.genericAudioControl.addEventListener((function (_event) {
      if (_event.name == this.pageConfig.mustPlayback) {
        this.played[_event.index] = true;
        if (this.played.every((element) => element === true)){
          $('#radio-choice-a').checkboxradio('enable');
          $('#radio-choice-b').checkboxradio('enable');
        }
      } 
    }).bind(this));
  }
};

PreferenceTestPage.prototype.render = function (_parent) {
  var div = $("<div id='player'></div>");
  _parent.append(div);

  var content; 
  if(this.pageConfig.content === null){
	content ="";
  } else {
	content = this.pageConfig.content;
  }
	
  var p = $("<p>" + content + "</p>");
  div.append(p);

  var outerTable = $("<table id='outerTable' align='center'></table>");
  div.append(outerTable);
  var trOuter = $("<tr></tr>");
  outerTable.append(trOuter);
  var tdLabels = $("<td></td>");
  trOuter.append(tdLabels);
  var innerTable = $("<table id='innerTable' align='center' class='default_padding'></table>");
  tdLabels.append(innerTable);
  var trA = $("<tr></tr>");
  innerTable.append(trA);
  trA.append($("<td><b>A:</b></td>"));
  var trB = $("<tr></tr>");
  innerTable.append(trB);
  trB.append($("<td><b>B:</b></td>"));  
  trA.height(tdLabels.height());
  trB.height(tdLabels.height());
  var tdPlayer = $("<td></td>");
  trOuter.append(tdPlayer);
  this.filePlayer.render(tdPlayer);
   
  var table = $("<table id='main' align='center'></table>");
  div.append(table);
    
  var trAB = $("<tr></tr>");
  table.append(trAB);
  var tdAB = $("<td id='td_AB' colspan='2'></td>");
  trAB.append(tdAB);
  
  var tableAB = $("<table id='table_ab' class='center'></table>");
  tdAB.append(tableAB);

  var trPlays = $("<tr></tr>");
  tableAB.append(trPlays);

  var trResponse = $("<tr></tr>");
  tableAB.append(trResponse);
  var tdResponse = $("<td  colspan='3'></td>");
  trResponse.append(tdResponse);
  
  var radioChoice = $("<div id='radio-choice' data-role='controlgroup' data-type='horizontal'>\
    <input type='radio' name='radio-choice' id='radio-choice-a' value='a'>\
    <label for='radio-choice-a'>A</label>\
    <input type='radio' name='radio-choice' id='radio-choice-b' value='b'>\
    <label for='radio-choice-b'>B</label>\
  </div>");
  if (typeof this.pageConfig.mustPlayback !== "undefined"){
    radioChoice.find("input[type='radio']").attr("disabled", true);;
  }
  
  radioChoice.find("input[type='radio']").bind("change", (function(){
	this.pageTemplateRenderer.unlockNextButton();
	}
  ).bind(this));
  
  tdResponse.append(radioChoice);
  
  this.fpc = new FilePlayerController(this.filePlayer);
  this.fpc.bind();
  
};

PreferenceTestPage.prototype.load = function () {
  this.startTimeOnPage = new Date();
	
  if (this.choice === null) {
  	this.pageTemplateRenderer.lockNextButton();
  }
  // audio
  this.filePlayer.init();  
  
  //choice   
  if(this.choice === 'a') {
  	$('#radio-choice-a').prop('checked', true).checkboxradio('refresh');
  	$('#radio-choice-b').prop('checked', false).checkboxradio('refresh');
  } else if (this.choice === 'b') {
  	$('#radio-choice-b').prop('checked', true).checkboxradio('refresh');
  	$('#radio-choice-a').prop('checked', false).checkboxradio('refresh');
  }
};

PreferenceTestPage.prototype.save = function () {
  this.fpc.unbind(); 
  this.time += 	(new Date() - this.startTimeOnPage);
  // audio
  this.filePlayer.free();
  // choice
  var radio = $('#radio-choice :radio:checked');
  this.choice = (radio.length > 0) ? radio[0].value : null;
};


PreferenceTestPage.prototype.store = function () {
  var trial = this.session.getTrial(this.pageConfig.type, this.pageConfig.id);
  if (trial === null) {
	  trial = new Trial();
	  trial.type = this.pageConfig.type;
	  trial.id = this.pageConfig.id;
	  this.session.trials[this.session.trials.length] = trial;	  
  }
  var choice = new PreferenceTestChoice();
  choice.optionA = this.stimuli[0].getId();
  choice.optionB = this.stimuli[1].getId();
  choice.answer = (this.choice == 'a') ? choice.optionA : choice.optionB;
  
  if (this.choice === null) {
  	choice.answer = "unknown";
  } else if (this.choice === "n") { 
  	choice.answer = "undecided";
  }
  choice.time = this.time;
  trial.responses[trial.responses.length] = choice;
  
};
