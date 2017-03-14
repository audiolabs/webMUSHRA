/*************************************************************************
         (C) Copyright AudioLabs 2017 

This source code is protected by copyright law and international treaties. This source code is made available to You subject to the terms and conditions of the Software License for the webMUSHRA.js Software. Said terms and conditions have been made available to You prior to Your download of this source code. By downloading this source code You agree to be bound by the above mentionend terms and conditions, which can also be found here: https://www.audiolabs-erlangen.de/resources/webMUSHRA. Any unauthorised use of this source code may result in severe civil and criminal penalties, and will be prosecuted to the maximum extent possible under law. 

**************************************************************************/

function PairedComparisonPage(_reference, _condition, _pageManager, _pageTemplateRenderer, _audioContext, _bufferSize, _audioFileLoader, _session, _pageConfig, _errorHandler, _language) {
  this.reference = _reference;
  this.condition = _condition;
  this.pageManager = _pageManager;
  this.pageTemplateRenderer = _pageTemplateRenderer;
  this.audioContext = _audioContext;
  this.bufferSize = _bufferSize;
  this.audioFileLoader = _audioFileLoader;
  this.session = _session;
  this.pageConfig = _pageConfig;
  this.errorHandler = _errorHandler;
  this.language = _language;
  this.mushraAudioControl = null;
  this.div = null;
  this.waveformVisualizer = null;
  this.macic = null; 

  this.currentItem = null; 

  this.audioFileLoader.addFile(this.reference.getFilepath(), (function (_buffer, _stimulus) { _stimulus.setAudioBuffer(_buffer); }), this.reference);
  this.audioFileLoader.addFile(this.condition.getFilepath(), (function (_buffer, _stimulus) { _stimulus.setAudioBuffer(_buffer); }), this.condition);

  this.choice = null;

  // data
  this.ratings = [];
  this.loop = {start: null, end: null};
  this.slider = {start: null, end: null};
  
  this.time = 0;
  this.startTimeOnPage = null;
}



PairedComparisonPage.prototype.getName = function () {
  return this.pageConfig.name;
};

PairedComparisonPage.prototype.init = function () {


  this.mushraAudioControl = new MushraAudioControl(this.audioContext, this.bufferSize, this.reference, [this.condition], this.errorHandler, false, false);
  this.mushraAudioControl.addEventListener((function (_event) {
      if (_event.name == 'stopTriggered') {
        $(".audioControlElement").text(this.pageManager.getLocalizer().getFragment(this.language, 'playButton'));
 
      if($('#buttonReference').attr("active") == "true") {
        $.mobile.activePage.find('#buttonReference')  //remove color from Reference
          .removeClass('ui-btn-b')
          .addClass('ui-btn-a').attr('data-theme', 'a');
          $('#buttonReference').attr("active", "false");
      }

      if($('#buttonConditions0').attr("active") == "true") {
        $.mobile.activePage.find('#buttonConditions0')  //remove color from Reference
          .removeClass('ui-btn-b')
          .addClass('ui-btn-a').attr('data-theme', 'a');
          $('#buttonConditions0').attr("active", "false");
      }

      if($('#buttonConditions1').attr("active") == "true") {
        $.mobile.activePage.find('#buttonConditions1')  //remove color from Reference
          .removeClass('ui-btn-b')
          .addClass('ui-btn-a').attr('data-theme', 'a');
          $('#buttonConditions1').attr("active", "false");
      }



      $.mobile.activePage.find('#buttonStop')    //add color to stop
        .removeClass('ui-btn-a')
        .addClass('ui-btn-b').attr('data-theme', 'b');
      $.mobile.activePage.find('#buttonStop').focus();
      $('#buttonStop').attr("active", "true");

    } 
  }).bind(this));
};

PairedComparisonPage.prototype.render = function (_parent) {
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

  var trLoop = $("<tr id='trWs'></tr>");
  table.append(trLoop);

  var tdLoop1 = $(" \
    <td class='stopButton'> \
      <button data-role='button' data-inline='true' id='buttonStop' class='center' onclick='"+ this.pageManager.getPageVariableName(this) + ".mushraAudioControl.stop();'>" + this.pageManager.getLocalizer().getFragment(this.language, 'stopButton') + "</button> \
    </td> \
  ");
  trLoop.append(tdLoop1);

  var waveform = $("<td></td>");
  trLoop.append(waveform);


  this.waveformVisualizer = new WaveformVisualizer(this.pageManager.getPageVariableName(this) + ".waveformVisualizer", waveform, this.reference, this.pageConfig.showWaveform, this.pageConfig.enableLooping, this.mushraAudioControl);
  this.waveformVisualizer.create();
  this.waveformVisualizer.load();
  
  
  var trAB = $("<tr></tr>");
  table.append(trAB);
  var tdAB = $("<td id='td_AB' colspan='2'></td>");
  trAB.append(tdAB);

  var tableAB = $("<table id='table_ab' class='center'></table>");
  tdAB.append(tableAB);

  // names
  var trNames = $("<tr><td>" + this.pageManager.getLocalizer().getFragment(this.language, 'reference') + "</td><td>A</td><td>B</td></tr>");
  tableAB.append(trNames);


  var trPlays = $("<tr></tr>");
  tableAB.append(trPlays);
  var buttonPlayReference = $("<td><button data-theme='a' id='buttonReference' data-role='button' class='audioControlElement' onclick='" + this.pageManager.getPageVariableName(this) + ".btnCallbackReference()' style='margin : 0 auto;'>" + this.pageManager.getLocalizer().getFragment(this.language, 'playButton') + "</button></td>");
  trPlays.append(buttonPlayReference);

  var buttonPlayA = $("<td><button data-theme='a' id='buttonConditions0' data-role='button' class='audioControlElement' onclick='" + this.pageManager.getPageVariableName(this) + ".btnCallbackA()' style='margin : 0 auto;'>" + this.pageManager.getLocalizer().getFragment(this.language, 'playButton') + "</button></td>");
  trPlays.append(buttonPlayA);
  var buttonPlayB = $("<td><button data-theme='a' id='buttonConditions1' data-role='button' class='audioControlElement' onclick='" + this.pageManager.getPageVariableName(this) + ".btnCallbackB()' style='margin : 0 auto;'>" + this.pageManager.getLocalizer().getFragment(this.language, 'playButton') + "</button></td>");
  trPlays.append(buttonPlayB);
  

  var trQuestion = $("<tr><td  colspan='3'><br/><br/>" + this.pageManager.getLocalizer().getFragment(this.language, 'quest') + "</td></tr>");
  tableAB.append(trQuestion);


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
  
  if (this.pageConfig.unforced) {
  	radioChoice.append($("<input type='radio' name='radio-choice' id='radio-choice-n' value='n'><label for='radio-choice-n'>" + this.pageConfig.unforced + "</label>"));
  }
  
  radioChoice.find("input[type='radio']").bind("change", (function(){
	this.pageTemplateRenderer.unlockNextButton();
	}
  ).bind(this));
  
  tdResponse.append(radioChoice);
  
  this.macic = new MushraAudioControlInputController(this.mushraAudioControl, this.pageConfig.enableLooping);
  this.macic.bind();
};


PairedComparisonPage.prototype.setLoopStart = function() {
  var slider = document.getElementById('slider');
  var startSliderSamples = this.mushraAudioControl.audioCurrentPosition;

  var endSliderSamples = parseFloat(slider.noUiSlider.get()[1]);

  this.mushraAudioControl.setLoop(startSliderSamples, endSliderSamples);
}


PairedComparisonPage.prototype.setLoopEnd = function() {
  var slider = document.getElementById('slider'); 
  var startSliderSamples = parseFloat(slider.noUiSlider.get()[0]);

  var endSliderSamples = this.mushraAudioControl.audioCurrentPosition;

  this.mushraAudioControl.setLoop(startSliderSamples, endSliderSamples);
}


PairedComparisonPage.prototype.pause = function() {
    this.mushraAudioControl.pause();
};

PairedComparisonPage.prototype.cleanButtons = function() {
  if($('#buttonStop').attr("active") == "true") {
    $.mobile.activePage.find('#buttonStop')  //remove color from Stop
      .removeClass('ui-btn-b')
      .addClass('ui-btn-a').attr('data-theme', 'a');
      $('#buttonStop').attr("active", "false");
  }
    
  if($('#buttonReference').attr("active") == "true") {
    $.mobile.activePage.find('#buttonReference')	//remove color from Reference
  	 .removeClass('ui-btn-b')
       .addClass('ui-btn-a').attr('data-theme', 'a');
     $('#buttonReference').attr("active", "false");
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


PairedComparisonPage.prototype.btnCallbackReference = function() {
	this.currentItem ="ref";
  var label = $("#buttonReference").text();
  if (label == this.pageManager.getLocalizer().getFragment(this.language, 'pauseButton')) {
    this.mushraAudioControl.pause();
    $("#buttonReference").text(this.pageManager.getLocalizer().getFragment(this.language, 'playButton'));
  } else if (label == this.pageManager.getLocalizer().getFragment(this.language, 'playButton')) {
    $(".audioControlElement").text(this.pageManager.getLocalizer().getFragment(this.language, 'playButton'));
    this.mushraAudioControl.playReference();
    $("#buttonReference").text(this.pageManager.getLocalizer().getFragment(this.language, 'pauseButton'));

  	this.cleanButtons();
    $.mobile.activePage.find('#buttonReference')		//add color to reference
  	  .removeClass('ui-btn-a')
  	  .addClass('ui-btn-b').attr('data-theme', 'b');
	  $('#buttonReference').focus(); 
  	$('#buttonReference').attr("active", "true");

  }
};

PairedComparisonPage.prototype.btnCallbackA = function() {
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

PairedComparisonPage.prototype.btnCallbackB = function() {
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



PairedComparisonPage.prototype.load = function () {
  this.startTimeOnPage = new Date();
	
  if (this.choice === null) {
  	this.pageTemplateRenderer.lockNextButton();
  }
  // audio
  this.mushraAudioControl.initAudio();  
  //choice 
  
  if(this.choice === 'a') {
  	$('#radio-choice-a').prop('checked', true).checkboxradio('refresh');
  	$('#radio-choice-b').prop('checked', false).checkboxradio('refresh');
  	$('#radio-choice-n').prop('checked', false).checkboxradio('refresh');
  } else if (this.choice === 'b') {
  	$('#radio-choice-b').prop('checked', true).checkboxradio('refresh');
  	$('#radio-choice-a').prop('checked', false).checkboxradio('refresh');
  	$('#radio-choice-n').prop('checked', false).checkboxradio('refresh');  	
  } else if (this.choice ==='n') {
  	$('#radio-choice-b').prop('checked', false).checkboxradio('refresh');
  	$('#radio-choice-a').prop('checked', false).checkboxradio('refresh');
  	$('#radio-choice-n').prop('checked', true).checkboxradio('refresh');
  }
  // loop
  if (this.loop.start !== null && this.loop.end !== null) {
    this.mushraAudioControl.setLoop(0, 0, this.mushraAudioControl.getDuration(), this.mushraAudioControl.getDuration() /this.waveformVisualizer.stimulus.audioBuffer.sampleRate);
    this.mushraAudioControl.setPosition(0);
  }

};

PairedComparisonPage.prototype.save = function () {
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


PairedComparisonPage.prototype.store = function () {
  var trial = this.session.getTrial(this.pageConfig.type, this.pageConfig.id);
  if (trial === null) {
	  trial = new Trial();
	  trial.type = this.pageConfig.type;
	  trial.id = this.pageConfig.id;
	  this.session.trials[this.session.trials.length] = trial;	  
  }
  var choice = new PairedComparisonChoice();
  choice.reference = this.reference.getId();
  choice.nonReference = this.condition.getId();

  var isAReference = this.mushraAudioControl.getReferenceIndexOfConditions() === 0;	
  if ((this.choice === "a" && isAReference) || (this.choice === "b" && !isAReference)) {
  	choice.answer = "correct";
  } else {
  	choice.answer = "incorrect";
  }
  
  if (this.choice === null) {
  	choice.answer = "unknown";
  } else if (this.choice === "n") { 
  	choice.answer = "undecided";
  }
  choice.time = this.time;
  trial.responses[trial.responses.length] = choice;
  
};
