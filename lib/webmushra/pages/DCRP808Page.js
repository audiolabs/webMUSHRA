/*************************************************************************
         (C) Copyright AudioLabs 2017 

This source code is protected by copyright law and international treaties. This source code is made available to You subject to the terms and conditions of the Software License for the webMUSHRA.js Software. Said terms and conditions have been made available to You prior to Your download of this source code. By downloading this source code You agree to be bound by the above mentionend terms and conditions, which can also be found here: https://www.audiolabs-erlangen.de/resources/webMUSHRA. Any unauthorised use of this source code may result in severe civil and criminal penalties, and will be prosecuted to the maximum extent possible under law. 

**************************************************************************/



function DCRP808Page(_reference, _condition, _pageManager, _pageTemplateRenderer, _audioContext, _bufferSize, _audioFileLoader, _session, _pageConfig, _errorHandler, _language) {
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



DCRP808Page.prototype.getName = function () {
  return this.pageConfig.name;
};

DCRP808Page.prototype.init = function () {
  this.mushraAudioControl = new DCRP808AudioControl(this.audioContext, this.bufferSize, this.reference, [this.condition], this.errorHandler, false, false);
  this.mushraAudioControl.setLoopingActive(this.pageConfig.enableLooping);
  this.mushraAudioControl.addEventListener((function (_event) {

    if (_event.name == 'playReferenceTriggered') {
      $.mobile.activePage.find('#buttonStop')  //remove color from Stop
      .removeClass('ui-btn-b')
      .addClass('ui-btn-a').attr('data-theme', 'a');
      $('#buttonStop').attr("active", "false");      
      $.mobile.activePage.find('#refIndButton')  //remove color from Stop
      .removeClass('ui-btn-a')
      .addClass('ui-btn-b').attr('data-theme', 'b')
      .focus();
      $('#refIndButton').attr("active", "true");  
    }
    if (_event.name == 'startStimuli') {
      $('#refIndButton').attr("active", "false").removeClass('ui-btn-b').addClass('ui-btn-a').attr('data-theme', 'a');
      $('#condIndButton').attr("active", "true").removeClass('ui-btn-a').addClass('ui-btn-b').attr('data-theme', 'b');
    };
    if (_event.name == 'surpressLoop') {
      if (this.condPlayed === true) {
            this.cleanButtons();
            $.mobile.activePage.find('#condIndButton') // remove color from condition
              .removeClass('ui-btn-b')
              .addClass('ui-btn-a').attr('data-theme', 'a');
            $('#condIndButton').attr("active", "false");
            $('#condIndButton').blur();
            $('#rating0').slider('enable');
            $('#rating0').attr("active", "true");
          }

      if($('#buttonPlayReference').attr("active") == "true") {
        $.mobile.activePage.find('#buttonPlayReference')  //remove color from Reference
          .removeClass('ui-btn-b')
          .addClass('ui-btn-a').attr('data-theme', 'a');
          $('#buttonPlayReference').attr("active", "false");
      }
      // Reset refIndButton and condIndButton to their default text
      if ($('#refIndButton').attr("active") == "true") {
        $.mobile.activePage.find('#refIndButton')  // remove color from Reference
          .removeClass('ui-btn-b')
          .addClass('ui-btn-a').attr('data-theme', 'a');
        $('#refIndButton').attr("active", "false");
        $('#refIndButton').text(this.pageManager.getLocalizer().getFragment(this.language, 'refButton'));
      }

    };

    if (_event.name == 'stopTriggered') {
      this.cleanButtons();
       $("#buttonPlayReference").text(this.pageManager.getLocalizer().getFragment(this.language, 'playButton'));
      if($('#buttonPlayReference').attr("active") == "true") {
        $.mobile.activePage.find('#buttonPlayReference')  //remove color from Reference
          .removeClass('ui-btn-b')
          .addClass('ui-btn-a').attr('data-theme', 'a');
          $('#buttonPlayReference').attr("active", "false");
          $('#buttonPlayReference').blur();
      }
      // Reset refIndButton and condIndButton to their default text
      if ($('#refIndButton').attr("active") == "true") {
        $.mobile.activePage.find('#refIndButton')  // remove color from Reference
          .removeClass('ui-btn-b')
          .addClass('ui-btn-a').attr('data-theme', 'a');
        $('#refIndButton').attr("active", "false");
        $('#refIndButton').text(this.pageManager.getLocalizer().getFragment(this.language, 'refButton'));
        $('#refIndButton').blur();

      }
      if ($('#condIndButton').attr("active") == "true") {
        $.mobile.activePage.find('#condIndButton')  // remove color from Condition
          .removeClass('ui-btn-b')
          .addClass('ui-btn-a').attr('data-theme', 'a');
        $('#condIndButton').attr("active", "false");
        $('#condIndButton').text(this.pageManager.getLocalizer().getFragment(this.language, 'condButton'));
        $('#condIndButton').blur();

      }

    $.mobile.activePage.find('#buttonStop')    //add color to stop
      .removeClass('ui-btn-a')
      .addClass('ui-btn-b').attr('data-theme', 'b');
    $('#buttonStop').focus();
    $('#buttonStop').attr("active", "true");

  }
  
  }).bind(this));
  
  

  
};

DCRP808Page.prototype.render = function (_parent) {
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


  var trBS = $("<tr></tr>");
  var tdBS= $("<td id='td_Mushra' colspan='2'></td>");
  trBS.append(tdBS);
  table.append(trBS);

  var tableDCRP808 = $("<table id='tableDCRP808'></table>");

  var trPlays = $("<tr></tr>");

  var buttonStyle = "font-size: 1em; padding: 10px 1px; width: 160px; text-align: center; margin: 0 0px;";


  var tdStop = $("<td id='tdStopButton'> <button data-theme='a' id='buttonStop' data-role='button' data-inline='true' class='audioControlElement' style='" + buttonStyle + "' onclick='" + this.pageManager.getPageVariableName(this) + ".mushraAudioControl.stop();'>" + this.pageManager.getLocalizer().getFragment(this.language, 'stopButton') + "</button> </td>");
  trPlays.append(tdStop);

  var buttonPlayReference = $("<td id='tdPlayButton'><button data-theme='a' id='buttonPlayReference' data-role='button' data-inline='true' class='audioControlElement' style='" + buttonStyle + " margin-left: 0;' onclick='" + this.pageManager.getPageVariableName(this) + ".btnCallbackReferenceSequential()'>" + this.pageManager.getLocalizer().getFragment(this.language, 'playButton') + "</button></td>");

  trPlays.append(buttonPlayReference);

  var tdConditionNamesScale = $("<td id='DCRP808conditionNameScale'></td>");
  trPlays.append(tdConditionNamesScale);

  var unclickableButton1 = $("<td><button data-theme='a' id='refIndButton' data-role='button' data-inline='true' class='audioControlElement' style='" + buttonStyle + "'>" + this.pageManager.getLocalizer().getFragment(this.language, 'refButton') + "</button></td>");
  trPlays.append(unclickableButton1);

  var unclickableButton2 = $("<td><button data-theme='a' id='condIndButton' data-role='button' data-inline='true' class='audioControlElement' style='" + buttonStyle + "'>" + this.pageManager.getLocalizer().getFragment(this.language, 'condButton') + "</button></td>");
  trPlays.append(unclickableButton2);

 
  tableDCRP808.append(trPlays);

  // ratings
  var trConditionRatings = $("<tr id='tr_ConditionRatings'></tr>");
  tableDCRP808.append(trConditionRatings);

  var tdConditionRatingsReference = $("<td id='refCanvas'></td>");
  trConditionRatings.append(tdConditionRatingsReference);
  
  var tdConditionRatingsScale = $("<td id='spaceForScale'></td>");
  trConditionRatings.append(tdConditionRatingsScale);
  
  for (var i = 0; i < 1; ++i) {
    var td = $("<td class='spaceForSlider'> \
      <span><input type='range'  class='scales' id='rating" + i + "' value='5' min='1' max='5' step='1' data-vertical='true' data-highlight='true' style='display : inline-block; float : none;'/></span> \
    </td>");
    $(".ui-slider-handle").unbind('keydown');    
    trConditionRatings.append(td);
  }

  tdBS.append(tableDCRP808);
 
  this.bacic = new DCRP808AudioControlInputController(this.mushraAudioControl, this.pageConfig.enableLooping);
  this.bacic.bind(); 

};

DCRP808Page.prototype.pause = function() {
    this.mushraAudioControl.pause();
}



DCRP808Page.prototype.renderCanvas = function(_parentId) {
	
  parent = $('#' + _parentId);
  var canvas = document.createElement("canvas");
  canvas.style.position = "absolute";
  canvas.style.left = 0; // Adjusted to increase the width by shifting the starting position
  canvas.style.top = 0;
  canvas.style.zIndex = 0;
  canvas.setAttribute("id", "DCRP808canvas");
  parent.get(0).appendChild(canvas);
  $('#DCRP808canvas').offset({ top: $('#refCanvas').offset().top, left: $('#refCanvas').offset().left  }); 


  canvas.height = parent.get(0).offsetHeight - (parent.get(0).offsetHeight - $('#tr_ConditionRatings').height());
  canvas.width = parent.get(0).offsetWidth*3;

  $(".scales").siblings().css("zIndex", "1");
  $(".scales").slider("disable");

  var canvasContext = canvas.getContext('2d');

  var YfreeCanvasSpace = $(".scales").prev().offset().top - $(".scales").parent().offset().top;
  var YfirstLine = $(".scales").parent().get(0).offsetTop + parseInt($(".scales").css("borderTopWidth"), 10) + YfreeCanvasSpace;
  var prevScalesHeight = $(".scales").prev().height();
  var xDrawingStart = $('#spaceForScale').offset().left - $('#spaceForScale').parent().offset().left + canvasContext.measureText("Degradation is audible but not annoying    4 ").width * 1.75;
  var xAbsTableOffset = -$('#tableDCRP808').offset().left - ($('#DCRP808canvas').offset().left - $('#tableDCRP808').offset().left);
  var xDrawingBeforeScales = $('.scales').first().prev().children().eq(0).offset().left + xAbsTableOffset;
  var xDrawingEnd = $('.scales').last().offset().left - $('#tableDCRP808').offset().left + $('.scales').last().width()/2.5;

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
  var xLetters = $("#refCanvas").width() + ($("#spaceForScale").width() + canvasContext.measureText("Degradation is audible but not annoying    4 ").width) / 1.2;

  canvasContext.font = "1em Calibri";
  canvasContext.textAlign = "right";
  var xTextScoreRanges =  xDrawingStart - canvasContext.measureText("Degradation is audible but not annoying   4").width * 0.58; 
  canvasContext.fillText(this.pageManager.getLocalizer().getFragment(this.language, 'dcr_excellent') +"   5", xTextScoreRanges, YfirstLine);
  canvasContext.fillText(this.pageManager.getLocalizer().getFragment(this.language, 'dcr_good') +"  4", xTextScoreRanges, prevScalesHeight * 0.25 + YfirstLine);
  canvasContext.fillText(this.pageManager.getLocalizer().getFragment(this.language, 'dcr_fair') +"  3", xTextScoreRanges, prevScalesHeight * 0.5 + YfirstLine);
  canvasContext.fillText(this.pageManager.getLocalizer().getFragment(this.language, 'dcr_poor') +"  2", xTextScoreRanges, prevScalesHeight * 0.75 + YfirstLine);
  canvasContext.fillText(this.pageManager.getLocalizer().getFragment(this.language, 'dcr_bad') +"  1", xTextScoreRanges, prevScalesHeight + YfirstLine);

};


DCRP808Page.prototype.cleanButtons = function() {
  if($('#buttonStop').attr("active") == "true") {
    $.mobile.activePage.find('#buttonStop')  //remove color from Stop
	  .removeClass('ui-btn-b')
	  .addClass('ui-btn-a').attr('data-theme', 'a');
	  $('#buttonStop').attr("active", "false");
    $('#buttonStop').blur();
  }
  $('#buttonPlayReference').prop('disabled', false);
  if($('#buttonPlayReference').attr("active") == "true") {
    $.mobile.activePage.find('#buttonPlayReference')	//remove color from Reference
	    .removeClass('ui-btn-b')
		  .addClass('ui-btn-a').attr('data-theme', 'a');
		  $('#buttonPlayReference').attr("active", "false");
      $('#buttonPlayReference').blur();

  }

  if($('#refIndButton').attr("active") == "true") {
    $.mobile.activePage.find('#refIndButton')	//remove color from Conditions0
	    .removeClass('ui-btn-b')
		  .addClass('ui-btn-a').attr('data-theme', 'a');
		  $('#refIndButton').attr("active", "false");
      $('#refIndButton').blur();

  }

  if($('#condIndButton').attr("active") == "true") {
    $.mobile.activePage.find('#condIndButton')	//remove color from Conditions1
	  .removeClass('ui-btn-b')
	    .addClass('ui-btn-a').attr('data-theme', 'a');
		$('#condIndButton').attr("active", "false");
    $('#condIndButton').blur();
 
  }  
};
DCRP808Page.prototype.btnCallbackReferenceSequential = function() {
  this.currentItem = "ref and A";
  this.refPlayed = false;
  this.condPlayed = false;


  
  // Disable #buttonPlayReference initially
  $('#buttonPlayReference').prop('disabled', true);
  // Disable all keyboard keys linked to buttonPlayReference
  $(document).on('keydown', function (e) {
    if ($('#buttonPlayReference').is(':disabled') && ['space', 'r', '0'].includes(e.key)) {
      e.preventDefault(); 1123 
    }
  });

  this.mushraAudioControl.playReference();
  this.refPlayed = true;

  this.mushraAudioControl.addEventListener(function (_event) {
    if (_event.name === 'surpressLoop' && this.condPlayed === false) {
      this.mushraAudioControl.removeEventListener(arguments.callee); // Remove listener to avoid multiple triggers
      condition_id = -1*(this.mushraAudioControl.getReferenceIndexOfConditions()-1);
      for (var i = 0; i < this.mushraAudioControl.conditions.length; ++i) {
        if (this.mushraAudioControl.conditions[i].id == "reference") {
          continue;
        }else{
          condition_id = i;
        }
      }
      this.mushraAudioControl.playCondition(condition_id);

      // Activate condIndButton
      $.mobile.activePage.find('#condIndButton') // add color to condition
        .removeClass('ui-btn-a')
        .addClass('ui-btn-b').attr('data-theme', 'b');
      $('#condIndButton').focus();
      $('#condIndButton').attr("active", "true");

      // Activate reference button
      $.mobile.activePage.find('#buttonPlayReference') // add color to reference
        .removeClass('ui-btn-a')
        .addClass('ui-btn-b').attr('data-theme', 'b');
      $('#buttonPlayReference').attr("active", "true");

      this.condPlayed = true;


    }
  }.bind(this));

  $.mobile.activePage.find('#buttonPlayReference') // add color to reference
    .removeClass('ui-btn-a')
    .addClass('ui-btn-b').attr('data-theme', 'b');
  $('#buttonPlayReference').attr("active", "true");

}


DCRP808Page.prototype.load = function () {
  this.startTimeOnPage = new Date();
  this.renderCanvas('tableDCRP808');
  if (this.ratings.length !== 0) {
    var scales = $(".scales");
    for (var i = 0; i  < scales.length; ++i) {
      $(".scales").eq(i).val(this.ratings[i].value).slider("refresh");
    }
  }
  this.mushraAudioControl.initAudio();  
  if (this.loop.start !== null && this.loop.end !== null) {
  this.mushraAudioControl.setLoop(0, 0, this.mushraAudioControl.getDuration(), this.mushraAudioControl.getDuration() /this.waveformVisualizer.stimulus.audioBuffer.sampleRate);
  this.mushraAudioControl.setPosition(0);
  this.mushraAudioControl.audioFadingActive = 1;
  }

 
};

DCRP808Page.prototype.save = function () {
 this.bacic.unbind();
  this.time += 	(new Date() - this.startTimeOnPage);
  this.mushraAudioControl.freeAudio(); 
  var scales = $(".scales");
  this.ratings = [];
  for (var i = 0; i  < scales.length; ++i) {
    this.ratings[i] = {name: scales[i].name, value: scales[i].value};
  }
  this.loop.start = parseInt(this.mushraAudioControl.audioLoopStart);
  this.loop.end = parseInt(this.mushraAudioControl.audioLoopEnd);
};

DCRP808Page.prototype.store = function () {
  debugger;
  var trial = this.session.getTrial(this.pageConfig.type, this.pageConfig.id);
  if (trial === null) {
    trial = new Trial();
	trial.type = this.pageConfig.type;
	trial.id = this.pageConfig.id;
	this.session.trials[this.session.trials.length] = trial;
  }
  var rating = new DCRP808Rating();
  rating.nonReference = this.condition.getId();
  	rating.nonReferenceScore = this.ratings[0].value;
  rating.time = this.time;
  trial.responses[trial.responses.length] = rating;
};
