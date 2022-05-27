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

  this.stimuli = _stimuli
	
  for (var i = 0; i < this.stimuli.length; ++i) {
    this.audioFileLoader.addFile(this.stimuli[i].getFilepath(), (function (_buffer, _stimulus) { _stimulus.setAudioBuffer(_buffer); }), this.stimuli[i]);
  }
  this.filePlayer = null;
  this.choice = null;
}



PreferenceTestPage.prototype.getName = function () {
  return this.pageConfig.name;
};

PreferenceTestPage.prototype.init = function () {
  this.choice = null
  
  this.filePlayer = new FilePlayer(this.audioContext, this.bufferSize, this.stimuli, this.errorHandler, this.language, this.pageManager.getLocalizer());
};

PreferenceTestPage.prototype.render = function (_parent) {
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

  var table = $("<table id='main' align='center'></table>");
  div.append(table);

  this.filePlayer.render(_parent);
    
  var trAB = $("<tr></tr>");
  table.append(trAB);
  var tdAB = $("<td id='td_AB' colspan='2'></td>");
  trAB.append(tdAB);

  var tableAB = $("<table id='table_ab' class='center'></table>");
  tdAB.append(tableAB);

  // names
  var trNames = $("<tr><td>A</td><td>B</td></tr>");
  tableAB.append(trNames);

  var trPlays = $("<tr></tr>");
  tableAB.append(trPlays);

  var buttonPlayA = $("<td><button data-theme='a' id='buttonConditions0' data-role='button' class='audioControlElement' onclick='" + this.pageManager.getPageVariableName(this) + ".btnCallbackA()' style='margin : 0 auto;'>" + this.pageManager.getLocalizer().getFragment(this.language, 'playButton') + "</button></td>");
  trPlays.append(buttonPlayA);
  var buttonPlayB = $("<td><button data-theme='a' id='buttonConditions1' data-role='button' class='audioControlElement' onclick='" + this.pageManager.getPageVariableName(this) + ".btnCallbackB()' style='margin : 0 auto;'>" + this.pageManager.getLocalizer().getFragment(this.language, 'playButton') + "</button></td>");
  trPlays.append(buttonPlayB);
  

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
  
  radioChoice.find("input[type='radio']").bind("change", (function(){
	this.pageTemplateRenderer.unlockNextButton();
	}
  ).bind(this));
  
  tdResponse.append(radioChoice);
  
  this.fpc = new FilePlayerController(this.filePlayer);
  this.fpc.bind();
  
};

PreferenceTestPage.prototype.cleanButtons = function() {
  if($('#buttonStop').attr("active") == "true") {
    $.mobile.activePage.find('#buttonStop')  //remove color from Stop
      .removeClass('ui-btn-b')
      .addClass('ui-btn-a').attr('data-theme', 'a');
      $('#buttonStop').attr("active", "false");
  }
    
   	
  if($('#buttonConditions0').attr("active") == "true") {
    $.mobile.activePage.find('#buttonConditions0')	//remove color from Reference
      .removeClass('ui-btn-b')
    	.addClass('ui-btn-a').attr('data-theme', 'a');
      $('#buttonConditions0').attr("active", "false");
  }

  if($('#buttonConditions1').attr("active") == "true") {
    $.mobile.activePage.find('#buttonConditions1')	//remove color from Reference
      .removeClass('ui-btn-b')
        .addClass('ui-btn-a').attr('data-theme', 'a');
      $('#buttonConditions1').attr("active", "false");
  }    
};


PreferenceTestPage.prototype.btnCallbackA = function() {
	this.currentItem = "A";
  var label = $("#buttonConditions0").text();
  if (label == this.pageManager.getLocalizer().getFragment(this.language, 'pauseButton')) {
    this.mushraAudioControl.pause();
    $("#buttonConditions0").text(this.pageManager.getLocalizer().getFragment(this.language, 'playButton'));
  } else if (label == this.pageManager.getLocalizer().getFragment(this.language, 'playButton')) {
    $(".audioControlElement").text(this.pageManager.getLocalizer().getFragment(this.language, 'playButton'));
    this.mushraAudioControl.playCondition(0);
    $("#buttonConditions0").text(this.pageManager.getLocalizer().getFragment(this.language, 'pauseButton'));

  	this.cleanButtons();
    $.mobile.activePage.find('#buttonConditions0')		//add color to reference
  	  .removeClass('ui-btn-a')
  	  .addClass('ui-btn-b').attr('data-theme', 'b');
	  $('#buttonConditions0').focus();
  	$('#buttonConditions0').attr("active", "true");
  }
};

PreferenceTestPage.prototype.btnCallbackB = function() {
	this.currentItem = "B";
  var label = $("#buttonConditions1").text();
  if (label == this.pageManager.getLocalizer().getFragment(this.language, 'pauseButton')) {
    this.mushraAudioControl.pause();
    $("#buttonConditions1").text(this.pageManager.getLocalizer().getFragment(this.language, 'playButton'));
  } else if (label == this.pageManager.getLocalizer().getFragment(this.language, 'playButton')) {
    $(".audioControlElement").text(this.pageManager.getLocalizer().getFragment(this.language, 'playButton'));
    this.mushraAudioControl.playCondition(1);
    $("#buttonConditions1").text(this.pageManager.getLocalizer().getFragment(this.language, 'pauseButton'));
    
  	this.cleanButtons();
    $.mobile.activePage.find('#buttonConditions1')		//add color to reference
  	  .removeClass('ui-btn-a')
  	  .addClass('ui-btn-b').attr('data-theme', 'b');
	  $('#buttonConditions1').focus();
  	$('#buttonConditions1').attr("active", "true");
    
  }
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
  this.macic.unbind(); 
  this.time += 	(new Date() - this.startTimeOnPage);
	this.mushraAudioControl.removeEventListener(this.waveformVisualizer.numberEventListener);
  // audio
  this.mushraAudioControl.freeAudio();
  // choice
  var radio = $('#radio-choice :radio:checked');
  this.choice = (radio.length > 0) ? radio[0].value : null;
  //loop
  this.loop.start = parseInt(this.waveformVisualizer.mushraAudioControl.audioLoopStart);
  this.loop.end = parseInt(this.waveformVisualizer.mushraAudioControl.audioLoopEnd);
};


PreferenceTestPage.prototype.store = function () {
  var trial = this.session.getTrial(this.pageConfig.type, this.pageConfig.id);
  if (trial === null) {
	  trial = new Trial();
	  trial.type = this.pageConfig.type;
	  trial.id = this.pageConfig.id;
	  this.session.trials[this.session.trials.length] = trial;	  
  }
  var choice = new PairedComparisonChoice();
  choice.nonReference = this.condition.getId();
  choice.answer = this.choice
  
  if (this.choice === null) {
  	choice.answer = "unknown";
  } else if (this.choice === "n") { 
  	choice.answer = "undecided";
  }
  choice.time = this.time;
  trial.responses[trial.responses.length] = choice;
  
};
