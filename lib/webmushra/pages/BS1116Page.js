/*************************************************************************
         (C) Copyright AudioLabs 2017 

This source code is protected by copyright law and international treaties. This source code is made available to You subject to the terms and conditions of the Software License for the webMUSHRA.js Software. Said terms and conditions have been made available to You prior to Your download of this source code. By downloading this source code You agree to be bound by the above mentionend terms and conditions, which can also be found here: https://www.audiolabs-erlangen.de/resources/webMUSHRA. Any unauthorised use of this source code may result in severe civil and criminal penalties, and will be prosecuted to the maximum extent possible under law. 

**************************************************************************/

function BS1116Page(_reference, _condition, _pageManager, _pageTemplateRenderer, _audioContext, _bufferSize, _audioFileLoader, _session, _pageConfig, _errorHandler, _language) {
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
  this.language = _language
  this.mushraAudioControl = null;
  this.div = null;
  this.waveformVisualizer = null;

  this.currentItem = null; 

  this.audioFileLoader.addFile(this.reference.getFilepath(), (function (_buffer, _stimulus) { _stimulus.setAudioBuffer(_buffer); }), this.reference);
  this.audioFileLoader.addFile(this.condition.getFilepath(), (function (_buffer, _stimulus) { _stimulus.setAudioBuffer(_buffer); }), this.condition);

  this.ratingB = null;
  this.ratingC = null;

  // data
  this.ratings = [];
  this.loop = {start: null, end: null};
  this.slider = {start: null, end: null};
  
  this.time = 0;
  this.startTimeOnPage = null;
}



BS1116Page.prototype.getName = function () {
  return this.pageConfig.name;
};

BS1116Page.prototype.init = function () {

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
      $.mobile.activePage.find('#buttonConditions0')  //remove color from Condition0
        .removeClass('ui-btn-b')
        .addClass('ui-btn-a').attr('data-theme', 'a');
        $('#rating0').slider('disable');
        $('#rating0').attr("active", "false");        
        $('#buttonConditions0').attr("active", "false");
    }

    if($('#buttonConditions1').attr("active") == "true") {
      $.mobile.activePage.find('#buttonConditions1')  //remove color from Condition1
        .removeClass('ui-btn-b')
        .addClass('ui-btn-a').attr('data-theme', 'a');
        $('#rating1').slider('disable');
        $('#rating1').attr("active", "false"); 
        $('#buttonConditions1').attr("active", "false");
    }



    $.mobile.activePage.find('#buttonStop')    //add color to stop
      .removeClass('ui-btn-a')
      .addClass('ui-btn-b').attr('data-theme', 'b');
    $('#buttonStop').focus()
    $('#buttonStop').attr("active", "true");

  } 
  }).bind(this));
  
  

  
};

BS1116Page.prototype.render = function (_parent) {
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

  var trSliderStop = $("<tr id='trWs'></tr>");
  table.append(trSliderStop);
/*jshint multistr: true */

  var tdStop = $(" \
    <td class='stopButton' id='tdStopButton'> \
      <button data-role='button' data-inline='true' id='buttonStop' class='center' onclick='"+ this.pageManager.getPageVariableName(this) + ".mushraAudioControl.stop();'>"+ this.pageManager.getLocalizer().getFragment(this.language, 'stopButton') +"</button> \
    </td> \
  ");
  trSliderStop.append(tdStop);


  var waveform = $("<td></td>");
  trSliderStop.append(waveform);
  
  this.waveformVisualizer = new WaveformVisualizer(this.pageManager.getPageVariableName(this) + ".waveformVisualizer", waveform, this.reference, this.pageConfig.showWaveform, this.pageConfig.enableLooping, this.mushraAudioControl);
  this.waveformVisualizer.create();
  this.waveformVisualizer.load();
 


  var trBS = $("<tr></tr>");
  var tdBS= $("<td id='td_Mushra' colspan='2'></td>");
  trBS.append(tdBS);
  table.append(trBS);

  var tableBS1116 = $("<table id='tableBS1116'></table>");
  var trNames = $("<tr><td>A ("+ this.pageManager.getLocalizer().getFragment(this.language, 'reference') + ") </td><td></td><td>B</td><td>C</td></tr>");
  tableBS1116.append(trNames);
  
  var trPlays = $("<tr></tr>");

  var buttonPlayReference = $("<td id='tdPlayButton' ><button data-theme='a' id='buttonReference' data-role='button' class='audioControlElement' onclick='" + this.pageManager.getPageVariableName(this) + ".btnCallbackReference()' >"+ this.pageManager.getLocalizer().getFragment(this.language, 'playButton') +"</button></td>");
  trPlays.append(buttonPlayReference);

  var tdConditionNamesScale = $("<td id='BS1116conditionNameScale'></td>");
  trPlays.append(tdConditionNamesScale);

  var buttonPlayB = $("<td><button data-theme='a' id='buttonConditions0' data-role='button' class='audioControlElement' onclick='" + this.pageManager.getPageVariableName(this) + ".btnCallbackB()' >"+ this.pageManager.getLocalizer().getFragment(this.language, 'playButton') +"</button></td>");
  trPlays.append(buttonPlayB);
  var buttonPlayC = $("<td><button data-theme='a' id='buttonConditions1' data-role='button' class='audioControlElement' onclick='" + this.pageManager.getPageVariableName(this) + ".btnCallbackC()' >"+ this.pageManager.getLocalizer().getFragment(this.language, 'playButton') +"</button></td>");
  trPlays.append(buttonPlayC);
  
  tableBS1116.append(trPlays);

  // ratings
  var trConditionRatings = $("<tr id='tr_ConditionRatings'></tr>");
  tableBS1116.append(trConditionRatings);

  var tdConditionRatingsReference = $("<td id='refCanvas'></td>");
  trConditionRatings.append(tdConditionRatingsReference);
  
  var tdConditionRatingsScale = $("<td id='spaceForScale'></td>");
  trConditionRatings.append(tdConditionRatingsScale);

  for (var i = 0; i < 2; ++i) {
    var td = $("<td class='spaceForSlider'> \
      <span><input type='range'  class='scales' id='rating" + i + "' value='5' min='1' max='5' step='0.01' data-vertical='true' data-highlight='true' style='display : inline-block; float : none;'/></span> \
    </td>");
    $(".ui-slider-handle").unbind('keydown');    
    trConditionRatings.append(td);
  }

  tdBS.append(tableBS1116);
 
  this.bacic = new BS1116AudioControlInputController(this.mushraAudioControl, this.pageConfig.enableLooping);
  this.bacic.bind(); 

};

BS1116Page.prototype.pause = function() {
    this.mushraAudioControl.pause();
}


BS1116Page.prototype.setLoopStart = function() {
  var slider = document.getElementById('slider');
  var startSliderSamples = this.mushraAudioControl.audioCurrentPosition;

  var endSliderSamples = parseFloat(slider.noUiSlider.get()[1]);

  this.mushraAudioControl.setLoop(startSliderSamples, endSliderSamples);
}


BS1116Page.prototype.setLoopEnd = function() {
  var slider = document.getElementById('slider'); 
  var startSliderSamples = parseFloat(slider.noUiSlider.get()[0]);

  var endSliderSamples = this.mushraAudioControl.audioCurrentPosition;

  this.mushraAudioControl.setLoop(startSliderSamples, endSliderSamples);
}



BS1116Page.prototype.renderCanvas = function(_parentId) {
	
  parent = $('#' + _parentId);
  var canvas = document.createElement("canvas");
  canvas.style.position = "absolute";
  canvas.style.left = 0;
  canvas.style.top = 0;
  canvas.style.zIndex = 0;
  canvas.setAttribute("id","BS116canvas");
  parent.get(0).appendChild(canvas);

  $('#BS116canvas').offset({top: $('#refCanvas').offset().top, left : $('#refCanvas').offset().left});

  canvas.height = parent.get(0).offsetHeight - (parent.get(0).offsetHeight - $('#tr_ConditionRatings').height());
  canvas.width = parent.get(0).offsetWidth;

  $(".scales").siblings().css("zIndex", "1");
  $(".scales").slider("disable");

  var canvasContext = canvas.getContext('2d');

  var YfreeCanvasSpace = $(".scales").prev().offset().top - $(".scales").parent().offset().top;
  var YfirstLine = $(".scales").parent().get(0).offsetTop + parseInt($(".scales").css("borderTopWidth"), 10) + YfreeCanvasSpace;
  var prevScalesHeight = $(".scales").prev().height();
  var xDrawingStart = $('#spaceForScale').offset().left - $('#spaceForScale').parent().offset().left + canvasContext.measureText("Perceptible, but not annoying    4").width * 1.5;
  var xAbsTableOffset = -$('#tableBS1116').offset().left - ($('#BS116canvas').offset().left - $('#tableBS1116').offset().left);
  var xDrawingBeforeScales = $('.scales').first().prev().children().eq(0).offset().left + xAbsTableOffset;
  var xDrawingEnd = $('.scales').last().offset().left - $('#tableBS1116').offset().left + $('.scales').last().width()/2;

  canvasContext.beginPath();
  canvasContext.lineWidth="1.5";
  canvasContext.moveTo(xDrawingStart, YfirstLine);
  canvasContext.lineTo(xDrawingEnd, YfirstLine);
  canvasContext.stroke();

  var scaleSegments = [0.25, 0.5, 0.75];
  for (var i = 0; i < scaleSegments.length; ++i) {
    canvasContext.beginPath();
    canvasContext.lineWidth="1.5";
    canvasContext.moveTo(xDrawingStart, prevScalesHeight * scaleSegments[i] +  YfirstLine);
    canvasContext.lineTo(xDrawingBeforeScales, prevScalesHeight * scaleSegments[i] +  YfirstLine);
    canvasContext.stroke();

    var predecessorXEnd = null;
    $('.scales').each(function( index ) {
      var sliderElement = $(this).prev().first();
      if (index > 0) {
        canvasContext.beginPath();
        canvasContext.lineWidth="1.5";
        canvasContext.moveTo(predecessorXEnd, prevScalesHeight * scaleSegments[i] +  YfirstLine);
        canvasContext.lineTo(sliderElement.offset().left + xAbsTableOffset, prevScalesHeight * scaleSegments[i] +  YfirstLine);
        canvasContext.stroke();
      }
      predecessorXEnd = sliderElement.offset().left + sliderElement.width() + xAbsTableOffset + 1;
    });
  }


  canvasContext.beginPath();
  canvasContext.moveTo(xDrawingStart, prevScalesHeight +  YfirstLine);
  canvasContext.lineTo(xDrawingEnd, prevScalesHeight + YfirstLine);
  canvasContext.stroke();

  canvasContext.font = "1.25em Calibri";
  canvasContext.textBaseline = "middle";
  canvasContext.textAlign = "center";
  var xLetters = $("#refCanvas").width() + ($("#spaceForScale").width() + canvasContext.measureText("Perceptible, but not annoying    4 ").width) / 2.0;

  canvasContext.font = "1em Calibri";
  canvasContext.textAlign = "right";
  var xTextScoreRanges =  xDrawingStart - canvasContext.measureText("Perceptible, but not annoying    4").width * 0.25; // $("#refCanvas").width()
  canvasContext.fillText(this.pageManager.getLocalizer().getFragment(this.language, 'imperceptible') +"    5", xTextScoreRanges, YfirstLine);
  canvasContext.fillText(this.pageManager.getLocalizer().getFragment(this.language, 'perceptible') +"    4", xTextScoreRanges, prevScalesHeight * 0.25 + YfirstLine);
  canvasContext.fillText(this.pageManager.getLocalizer().getFragment(this.language, 'slightly') +"    3", xTextScoreRanges, prevScalesHeight * 0.5 + YfirstLine);
  canvasContext.fillText(this.pageManager.getLocalizer().getFragment(this.language, 'annoying') +"    2", xTextScoreRanges, prevScalesHeight * 0.75 + YfirstLine);
  canvasContext.fillText(this.pageManager.getLocalizer().getFragment(this.language, 'very') +"    1", xTextScoreRanges, prevScalesHeight + YfirstLine);

};




BS1116Page.prototype.cleanButtons = function() {
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
    $.mobile.activePage.find('#buttonConditions0')	//remove color from Conditions0
	    .removeClass('ui-btn-b')
		  .addClass('ui-btn-a').attr('data-theme', 'a');
      $('#rating0').slider('disable');
      $('#rating0').attr("active", "false");
		  $('#buttonConditions0').attr("active", "false");
  }

  if($('#buttonConditions1').attr("active") == "true") {
    $.mobile.activePage.find('#buttonConditions1')	//remove color from Conditions1
	  .removeClass('ui-btn-b')
	    .addClass('ui-btn-a').attr('data-theme', 'a');
    $('#rating1').slider('disable');
    $('#rating1').attr("active", "false");
		$('#buttonConditions1').attr("active", "false");
  }    
};

BS1116Page.prototype.btnCallbackReference = function() {
  this.currentItem = "ref";
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
	  $('#buttonReference').focus()
  	$('#buttonReference').attr("active", "true");

  }
    
};

BS1116Page.prototype.btnCallbackB = function() {
	this.currentItem = "B";
  var label = $("#buttonConditions0").text();
  if (label == this.pageManager.getLocalizer().getFragment(this.language, 'pauseButton')) {
    this.mushraAudioControl.pause();
    $("#buttonConditions0").text(this.pageManager.getLocalizer().getFragment(this.language, 'playButton'));
  } else if (label == this.pageManager.getLocalizer().getFragment(this.language, 'playButton')) {
    $(".audioControlElement").text(this.pageManager.getLocalizer().getFragment(this.language, 'playButton'));
    this.mushraAudioControl.playCondition(0);
    $("#buttonConditions0").text(this.pageManager.getLocalizer().getFragment(this.language, 'pauseButton'));

  	this.cleanButtons();
    $.mobile.activePage.find('#buttonConditions0')		//add color to Condition0
  	  .removeClass('ui-btn-a')
  	  .addClass('ui-btn-b').attr('data-theme', 'b');
    $('#rating0').slider('enable');
    $('#rating0').attr("active", "true");
	  $('#buttonConditions0').focus()
  	$('#buttonConditions0').attr("active", "true");


  }
};

BS1116Page.prototype.btnCallbackC = function() {
	this.currentItem = "C";
  var label = $("#buttonConditions1").text();
  if (label == this.pageManager.getLocalizer().getFragment(this.language, 'pauseButton')) {
    this.mushraAudioControl.pause();
    $("#buttonConditions1").text(this.pageManager.getLocalizer().getFragment(this.language, 'playButton'));
  } else if (label == this.pageManager.getLocalizer().getFragment(this.language, 'playButton')) {
    $(".audioControlElement").text(this.pageManager.getLocalizer().getFragment(this.language, 'playButton'));
    this.mushraAudioControl.playCondition(1);
    $("#buttonConditions1").text(this.pageManager.getLocalizer().getFragment(this.language, 'pauseButton'));
    
  	this.cleanButtons();
    $.mobile.activePage.find('#buttonConditions1')		//add color to Conditions1
  	  .removeClass('ui-btn-a')
  	  .addClass('ui-btn-b').attr('data-theme', 'b');
    $('#rating1').slider('enable');
    $('#rating1').attr("active", "true");
	  $('#buttonConditions1').focus()
  	$('#buttonConditions1').attr("active", "true");        
  }
};



BS1116Page.prototype.load = function () {
  this.startTimeOnPage = new Date();
  this.renderCanvas('tableBS1116');
  if (this.ratings.length !== 0) {
    var scales = $(".scales");
    for (var i = 0; i  < scales.length; ++i) {
      $(".scales").eq(i).val(this.ratings[i].value).slider("refresh");
    }
  }
  this.mushraAudioControl.initAudio();  
  var startSec = this.loop.start/this.waveformVisualizer.stimulus.audioBuffer.sampleRate;
  var endSec = this.loop.end/this.waveformVisualizer.stimulus.audioBuffer.sampleRate;
  if (this.loop.start !== null && this.loop.end !== null) {

  this.mushraAudioControl.setLoop(0, 0, this.mushraAudioControl.getDuration(), this.mushraAudioControl.getDuration() /this.waveformVisualizer.stimulus.audioBuffer.sampleRate);
  this.mushraAudioControl.setPosition(0);
  }

 
};

BS1116Page.prototype.save = function () {
 this.bacic.unbind();
  this.time += 	(new Date() - this.startTimeOnPage);
  this.mushraAudioControl.removeEventListener(this.waveformVisualizer.numberEventListener);
  this.mushraAudioControl.freeAudio(); 
  var scales = $(".scales");
  this.ratings = [];
  for (var i = 0; i  < scales.length; ++i) {
    this.ratings[i] = {name: scales[i].name, value: scales[i].value};
  }
  this.loop.start = parseInt(this.waveformVisualizer.mushraAudioControl.audioLoopStart);
  this.loop.end = parseInt(this.waveformVisualizer.mushraAudioControl.audioLoopEnd);
};

BS1116Page.prototype.store = function () {

  var trial = this.session.getTrial(this.pageConfig.type, this.pageConfig.id);
  if (trial === null) {
    trial = new Trial();
	trial.type = this.pageConfig.type;
	trial.id = this.pageConfig.id;
	this.session.trials[this.session.trials.length] = trial;	  
  }
  var rating = new BS1116Rating();
  rating.reference = this.reference.getId();
  rating.nonReference = this.condition.getId();
  
  var isBReference = this.mushraAudioControl.getReferenceIndexOfConditions() === 0;
  
  if (isBReference) {
  	rating.referenceScore = this.ratings[0].value;
  	rating.nonReferenceScore = this.ratings[1].value;
  } else {
  	rating.nonReferenceScore = this.ratings[0].value;
  	rating.referenceScore = this.ratings[1].value;
  	
  }
  rating.time = this.time;
  trial.responses[trial.responses.length] = rating;
};
