/*************************************************************************
         (C) Copyright AudioLabs 2017 

This source code is protected by copyright law and international treaties. This source code is made available to You subject to the terms and conditions of the Software License for the webMUSHRA.js Software. Said terms and conditions have been made available to You prior to Your download of this source code. By downloading this source code You agree to be bound by the above mentionend terms and conditions, which can also be found here: https://www.audiolabs-erlangen.de/resources/webMUSHRA. Any unauthorised use of this source code may result in severe civil and criminal penalties, and will be prosecuted to the maximum extent possible under law. 

**************************************************************************/

function MushraPage(_pageManager, _audioContext, _bufferSize, _audioFileLoader, _session, _pageConfig, _mushraValidator, _errorHandler, _language) {
	this.isMushra = true; 
  this.pageManager = _pageManager;
  this.audioContext = _audioContext;
  this.bufferSize = _bufferSize;
  this.audioFileLoader = _audioFileLoader;
  this.session = _session;
  this.pageConfig = _pageConfig;
  this.mushraValidator = _mushraValidator;
  this.errorHandler = _errorHandler;
  this.language = _language
  this.mushraAudioControl = null;
  this.div = null;
  this.waveformVisualizer = null;
  this.macic = null; 
  
  this.currentItem = null;
  
  this.tdLoop2 = null; 

  this.conditions = [];
  for (var key in this.pageConfig.stimuli) {
    this.conditions[this.conditions.length] = new Stimulus(key, this.pageConfig.stimuli[key]);
  }
  this.reference = new Stimulus("reference", this.pageConfig.reference);
  this.audioFileLoader.addFile(this.reference.getFilepath(), (function (_buffer, _stimulus) { _stimulus.setAudioBuffer(_buffer); }), this.reference);
  for (var i = 0; i < this.conditions.length; ++i) {
    this.audioFileLoader.addFile(this.conditions[i].getFilepath(), (function (_buffer, _stimulus) { _stimulus.setAudioBuffer(_buffer); }), this.conditions[i]);
  }

  // data
  this.ratings = [];
  this.loop = {start: null, end: null};
  this.slider = {start: null, end: null};
  
  this.time = 0;
  this.startTimeOnPage = null;
}



MushraPage.prototype.getName = function () {
  return this.pageConfig.name;
};

MushraPage.prototype.init = function () {
   var toDisable;
  var td;
  var active; 
  
  if (this.pageConfig.strict !== false) {
    this.mushraValidator.checkNumConditions(this.conditions);
    this.mushraValidator.checkStimulusDuration(this.reference);
  }
  
  this.mushraValidator.checkNumChannels(this.audioContext, this.reference);
	var i;
  for (i = 0; i < this.conditions.length; ++i) {
    this.mushraValidator.checkSamplerate(this.audioContext.sampleRate, this.conditions[i]);
  }
  this.mushraValidator.checkConditionConsistency(this.reference, this.conditions);

  this.mushraAudioControl = new MushraAudioControl(this.audioContext, this.bufferSize, this.reference, this.conditions, this.errorHandler, this.pageConfig.createAnchor35, this.pageConfig.createAnchor70, this.pageConfig.randomize, this.pageConfig.switchBack);
  this.mushraAudioControl.addEventListener((function (_event) {
  if (_event.name == 'stopTriggered') {
    $(".audioControlElement").text(this.pageManager.getLocalizer().getFragment(this.language, 'playButton'));

    if($('#buttonReference').attr("active") == "true") {
      $.mobile.activePage.find('#buttonReference')  //remove color from Reference
        .removeClass('ui-btn-b')
        .addClass('ui-btn-a').attr('data-theme', 'a');
      $('#buttonReference').attr("active", "false");
    }


    for(i = 0; i < _event.conditionLength; i++) {
      active = '#buttonConditions' + i;
      toDisable = $(".scales").get(i);
      if($(active).attr("active") == "true") {
        $.mobile.activePage.find(active)      // remove color from conditions
          .removeClass('ui-btn-b')
          .addClass('ui-btn-a').attr('data-theme', 'a');
        $(toDisable).slider('disable');
        $(toDisable).attr("active", "false");
        $(active).attr("active", "false");
        break;
      }
    }

    $.mobile.activePage.find('#buttonStop')    //add color to stop
      .removeClass('ui-btn-a')
      .addClass('ui-btn-b').attr('data-theme', 'b');
    $.mobile.activePage.find('#buttonStop').focus();
    $('#buttonStop').attr("active", "true");

  } else if (_event.name == 'playReferenceTriggered') {

    if($('#buttonStop').attr("active") == "true") {
      $.mobile.activePage.find('#buttonStop')  //remove color from Stop
        .removeClass('ui-btn-b')
        .addClass('ui-btn-a').attr('data-theme', 'a');
      $('#buttonStop').attr("active", "false");
    }

	var j;
    for(j = 0; j < _event.conditionLength; j++) {
  	  active = '#buttonConditions' + j; 
  	  toDisable = $(".scales").get(j); 
  		if($(active).attr("active") == "true") {
  			$.mobile.activePage.find(active)			// remove color from conditions
  			  .removeClass('ui-btn-b')
  			  .addClass('ui-btn-a').attr('data-theme', 'a'); 
  			$(active).attr("active", "false");
  			$(toDisable).slider('disable');
  			$(toDisable).attr("active", "false");
  			break;
  		}
  	}

    $.mobile.activePage.find('#buttonReference')		//add color to reference
  	  .removeClass('ui-btn-a')
  	  .addClass('ui-btn-b').attr('data-theme', 'b');
    $.mobile.activePage.find('#buttonReference').focus();
  	$('#buttonReference').attr("active", "true");
  } else if(_event.name == 'playConditionTriggered') {

    var index = _event.index;
    var activeSlider = $(".scales").get(index);
    var selector = '#buttonConditions' + index;

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
	var k;
    for(k = 0; k < _event.length; k++) {
      active = '#buttonConditions' + k;
      toDisable = $(".scales").get(k); 
      if($(active).attr("active") == "true") {
  	    $.mobile.activePage.find(active)    // remove color from conditions
  	      .removeClass('ui-btn-b')
  	      .addClass('ui-btn-a').attr('data-theme', 'a');
  	    $(toDisable).slider('disable');
  	    $(active).attr("active", "false");
  	    $(toDisable).attr("active", "false");
  	    break;
     }
    }


    $(activeSlider).slider('enable');
    $(activeSlider).attr("active", "true");
    $.mobile.activePage.find(selector)    //add color to conditions
      .removeClass('ui-btn-a')
      .addClass('ui-btn-b').attr('data-theme', 'b');
    $.mobile.activePage.find(selector).focus();
    $(selector).attr("active", "true");
  } else if (_event.name == 'surpressLoop') {
    this.surpressLoop();
  }


}).bind(this));
  
  
  
};

MushraPage.prototype.render = function (_parent) {
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

  var tableUp = $("<table id='mainUp'></table>");
  var tableDown = $("<table id='mainDown' align = 'center'></table>"); 
  div.append(tableUp);
  div.append(tableDown);

  var trLoop = $("<tr id='trWs'></tr>");
  tableUp.append(trLoop);

  var tdLoop1 = $(" \
    <td class='stopButton'> \
      <button data-role='button' data-inline='true' id='buttonStop' onclick='"+ this.pageManager.getPageVariableName(this) + ".mushraAudioControl.stop();'>" + this.pageManager.getLocalizer().getFragment(this.language, 'stopButton') + "</button> \
    </td> \
  ");
  trLoop.append(tdLoop1);


  
  var tdRight = $("<td></td>");
  trLoop.append(tdRight);
  

  var trMushra = $("<tr></tr>");
  tableDown.append(trMushra);
  var tdMushra = $("<td id='td_Mushra' colspan='2'></td>");
  trMushra.append(tdMushra);

  var tableMushra = $("<table id='mushra_items'></table>");
  tdMushra.append(tableMushra);

  var trConditionNames = $("<tr></tr>");
  tableMushra.append(trConditionNames);

  var tdConditionNamesReference = $("<td>" + this.pageManager.getLocalizer().getFragment(this.language, 'reference') + "</td>");
  trConditionNames.append(tdConditionNamesReference);

  var tdConditionNamesScale = $("<td id='conditionNameScale'></td>");
  trConditionNames.append(tdConditionNamesScale);

  var conditions = this.mushraAudioControl.getConditions();
  var i;
  for (i = 0; i < conditions.length; ++i) {
    var str = "";
    if (this.pageConfig.showConditionNames === true) {
      if(this.language == 'en'){
        str = "<br/>" + conditions[i].id;
      }else{
        if(conditions[i].id == 'reference'){
          str = "<br/>" + this.pageManager.getLocalizer().getFragment(this.language, 'reference');
        }else if(conditions[i].id == 'anchor35'){
          str = "<br/>" + this.pageManager.getLocalizer().getFragment(this.language, '35');
        }else if(conditions[i].id == 'anchor70'){
          str = "<br/>" + this.pageManager.getLocalizer().getFragment(this.language, '70');
        }else{
          str = "<br/>" + conditions[i].id;
        }
      }
    }
    td = $("<td>" + this.pageManager.getLocalizer().getFragment(this.language, 'cond') + (i + 1) + str + "</td>");
    trConditionNames.append(td);
  }

  var trConditionPlay = $("<tr></tr>");
  tableMushra.append(trConditionPlay);

  var tdConditionPlayReference = $("<td></td>");
  trConditionPlay.append(tdConditionPlayReference);

  var buttonPlayReference = $("<button data-theme='a' id='buttonReference' data-role='button' class='audioControlElement' onclick='" + this.pageManager.getPageVariableName(this) + ".btnCallbackReference()' style='margin : 0 auto;'>" + this.pageManager.getLocalizer().getFragment(this.language, 'playButton') + "</button>");
  tdConditionPlayReference.append(buttonPlayReference);

  var tdConditionPlayScale = $("<td></td>");
  trConditionPlay.append(tdConditionPlayScale);

  for (i = 0; i < conditions.length; ++i) {
    td = $("<td></td>"); 
    var buttonPlay = $("<button data-role='button' class='center audioControlElement' onclick='" + this.pageManager.getPageVariableName(this) + ".btnCallbackCondition(" + i + ");'>" + this.pageManager.getLocalizer().getFragment(this.language, 'playButton') + "</button>");
    buttonPlay.attr("id", "buttonConditions" + i);
    td.append(buttonPlay);
    trConditionPlay.append(td);
    // (function(i) {
        // Mousetrap.bind(String(i + 1), function() { this.pageManager.getCurrentPage().btnCallbackCondition(i); });
    // })(i);
  }

    // ratings
  var trConditionRatings = $("<tr id='tr_ConditionRatings'></tr>");
  tableMushra.append(trConditionRatings);

  var tdConditionRatingsReference = $("<td id='refCanvas'></td>");
  trConditionRatings.append(tdConditionRatingsReference);

  var tdConditionRatingsScale = $("<td id='spaceForScale'></td>");
  trConditionRatings.append(tdConditionRatingsScale);


  for (i = 0; i < conditions.length; ++i) {
    td = $("<td class='spaceForSlider'> \
      <span><input type='range' name='"+conditions[i].getId()+"' class='scales' value='100' min='0' max='100' data-vertical='true' data-highlight='true' style='display : inline-block; float : none;'/></span> \
    </td>");
    $(".ui-slider-handle").unbind('keydown');
    trConditionRatings.append(td);
  }


  this.macic = new MushraAudioControlInputController(this.mushraAudioControl, this.pageConfig.enableLooping);
  this.macic.bind(); 

this.waveformVisualizer = new WaveformVisualizer(this.pageManager.getPageVariableName(this) + ".waveformVisualizer", tdRight, this.reference, this.pageConfig.showWaveform, this.pageConfig.enableLooping, this.mushraAudioControl);
  this.waveformVisualizer.create();
  this.waveformVisualizer.load();
};

MushraPage.prototype.pause = function() {
    this.mushraAudioControl.pause();
};

MushraPage.prototype.setLoopStart = function() {
  var slider = document.getElementById('slider');
  var startSliderSamples = this.mushraAudioControl.audioCurrentPosition;

  var endSliderSamples = parseFloat(slider.noUiSlider.get()[1]);

  this.mushraAudioControl.setLoop(startSliderSamples, endSliderSamples);
};

MushraPage.prototype.setLoopEnd = function() {
  var slider = document.getElementById('slider'); 
  var startSliderSamples = parseFloat(slider.noUiSlider.get()[0]);

  var endSliderSamples = this.mushraAudioControl.audioCurrentPosition;

  this.mushraAudioControl.setLoop(startSliderSamples, endSliderSamples);
};

MushraPage.prototype.btnCallbackReference = function() {
  this.currentItem = "ref";
  var label = $("#buttonReference").text();
  if (label == this.pageManager.getLocalizer().getFragment(this.language, 'pauseButton')) {
    this.mushraAudioControl.pause();
    $("#buttonReference").text(this.pageManager.getLocalizer().getFragment(this.language, 'playButton'));
  } else if (label == this.pageManager.getLocalizer().getFragment(this.language, 'playButton')) {
    $(".audioControlElement").text(this.pageManager.getLocalizer().getFragment(this.language, 'playButton'));
    this.mushraAudioControl.playReference();
    $("#buttonReference").text(this.pageManager.getLocalizer().getFragment(this.language, 'pauseButton'));
  }
};

MushraPage.prototype.surpressLoop = function() {
  if (this.currentItem == "ref") {
    var id = $("#buttonReference");
  } else {
    var id = $("#buttonConditions" + this.currentItem);
  }
  id.text(this.pageManager.getLocalizer().getFragment(this.language, 'playButton'));
}

MushraPage.prototype.btnCallbackCondition = function(_index) {
	this.currentItem = _index;
	
  var label = $("#buttonConditions" + _index).text();
  if (label == this.pageManager.getLocalizer().getFragment(this.language, 'pauseButton')) {
    this.mushraAudioControl.pause();
    $("#buttonConditions" + _index).text(this.pageManager.getLocalizer().getFragment(this.language, 'playButton'));
  } else if (label == this.pageManager.getLocalizer().getFragment(this.language, 'playButton')) {
    $(".audioControlElement").text(this.pageManager.getLocalizer().getFragment(this.language, 'playButton'));
    this.mushraAudioControl.playCondition(_index);
    $("#buttonConditions" + _index).text(this.pageManager.getLocalizer().getFragment(this.language, 'pauseButton'));
  }
};

MushraPage.prototype.renderCanvas = function(_parentId) {
	$('#mushra_canvas').remove(); 
  parent = $('#' + _parentId);
  var canvas = document.createElement("canvas");
  canvas.style.position = "absolute";
  canvas.style.left = 0;
  canvas.style.top = 0;
  canvas.style.zIndex = 0;
  canvas.setAttribute("id","mushra_canvas");
  parent.get(0).appendChild(canvas);
  $('#mushra_canvas').offset({top: $('#refCanvas').offset().top, left : $('#refCanvas').offset().left});
  canvas.height = parent.get(0).offsetHeight - (parent.get(0).offsetHeight - $('#tr_ConditionRatings').height());
  canvas.width = parent.get(0).offsetWidth;

  $(".scales").siblings().css("zIndex", "1");
  $(".scales").slider("disable");

  var canvasContext = canvas.getContext('2d');

  var YfreeCanvasSpace = $(".scales").prev().offset().top - $(".scales").parent().offset().top;
  var YfirstLine = $(".scales").parent().get(0).offsetTop + parseInt($(".scales").css("borderTopWidth"), 10) + YfreeCanvasSpace;
  var prevScalesHeight = $(".scales").prev().height();
  var xDrawingStart = $('#spaceForScale').offset().left - $('#spaceForScale').parent().offset().left + canvasContext.measureText("100 ").width * 1.5;
  var xAbsTableOffset = -$('#mushra_items').offset().left - ($('#mushra_canvas').offset().left - $('#mushra_items').offset().left);
  var xDrawingBeforeScales = $('.scales').first().prev().children().eq(0).offset().left + xAbsTableOffset;
  var xDrawingEnd = $('.scales').last().offset().left - $('#mushra_items').offset().left + $('.scales').last().width()/2;

  canvasContext.beginPath();
  canvasContext.moveTo(xDrawingStart, YfirstLine);
  canvasContext.lineTo(xDrawingEnd, YfirstLine);
  canvasContext.stroke();

  var scaleSegments = [0.2, 0.4, 0.6, 0.8];
  var i;
  for (i = 0; i < scaleSegments.length; ++i) {
    canvasContext.beginPath();
    canvasContext.moveTo(xDrawingStart, prevScalesHeight * scaleSegments[i] +  YfirstLine);
    canvasContext.lineTo(xDrawingBeforeScales, prevScalesHeight * scaleSegments[i] +  YfirstLine);
    canvasContext.stroke();

    var predecessorXEnd = null;
    $('.scales').each(function( index ) {
      var sliderElement = $(this).prev().first();
      if (index > 0) {
        canvasContext.beginPath();
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
  var xLetters = $("#refCanvas").width() + ($("#spaceForScale").width() + canvasContext.measureText("1 ").width) / 2.0;

  canvasContext.fillText(this.pageManager.getLocalizer().getFragment(this.language, 'excellent'),xLetters , prevScalesHeight * 0.1 + YfirstLine);
  canvasContext.fillText(this.pageManager.getLocalizer().getFragment(this.language, 'good'), xLetters, prevScalesHeight * 0.3 + YfirstLine);
  canvasContext.fillText(this.pageManager.getLocalizer().getFragment(this.language, 'fair'), xLetters, prevScalesHeight * 0.5 + YfirstLine);
  canvasContext.fillText(this.pageManager.getLocalizer().getFragment(this.language, 'poor'), xLetters, prevScalesHeight * 0.7 + YfirstLine);
  canvasContext.fillText(this.pageManager.getLocalizer().getFragment(this.language, 'bad'), xLetters, prevScalesHeight * 0.9 + YfirstLine);

  canvasContext.font = "1em Calibri";
  canvasContext.textAlign = "right";
  var xTextScoreRanges =  xDrawingStart - canvasContext.measureText("100 ").width * 0.25; // $("#refCanvas").width()
  canvasContext.fillText("100", xTextScoreRanges, YfirstLine);
  canvasContext.fillText("80", xTextScoreRanges, prevScalesHeight * 0.2 + YfirstLine);
  canvasContext.fillText("60", xTextScoreRanges, prevScalesHeight * 0.4 + YfirstLine);
  canvasContext.fillText("40", xTextScoreRanges, prevScalesHeight * 0.6 + YfirstLine);
  canvasContext.fillText("20", xTextScoreRanges, prevScalesHeight * 0.8 + YfirstLine);
  canvasContext.fillText("0", xTextScoreRanges, prevScalesHeight + YfirstLine);

};


MushraPage.prototype.load = function () {

  this.startTimeOnPage = new Date();
	
	
  this.renderCanvas('mushra_items');
 
 
  this.mushraAudioControl.initAudio();
 
  if (this.ratings.length !== 0) {
    var scales = $(".scales");
    var i;
    for (i = 0; i  < scales.length; ++i) {
      $(".scales").eq(i).val(this.ratings[i].value).slider("refresh");
    }
  }
  if (this.loop.start !== null && this.loop.end !== null) {
    this.mushraAudioControl.setLoop(0, 0, this.mushraAudioControl.getDuration(), this.mushraAudioControl.getDuration() /this.waveformVisualizer.stimulus.audioBuffer.sampleRate);
    this.mushraAudioControl.setPosition(0);
  }
 
};

MushraPage.prototype.save = function () {
  this.macic.unbind(); 
  this.time += 	(new Date() - this.startTimeOnPage);
  this.mushraAudioControl.freeAudio();
  this.mushraAudioControl.removeEventListener(this.waveformVisualizer.numberEventListener);  
  var scales = $(".scales");
  this.ratings = [];
  var i;
  for (i = 0; i  < scales.length; ++i) {
    this.ratings[i] = {name: scales[i].name, value: scales[i].value};
  }
 
  this.loop.start = parseInt(this.waveformVisualizer.mushraAudioControl.audioLoopStart);
  this.loop.end = parseInt(this.waveformVisualizer.mushraAudioControl.audioLoopEnd);
};

MushraPage.prototype.store = function () {
	
  var trial = new Trial();
  trial.type = this.pageConfig.type;
  trial.id = this.pageConfig.id;
  var i;
  for (i = 0; i  < this.ratings.length; ++i) {
    var rating = this.ratings[i];
    var ratingObj = new MUSHRARating();
    ratingObj.stimulus = rating.name;
    ratingObj.score = rating.value;
    ratingObj.time = this.time;
    trial.responses[trial.responses.length] = ratingObj;
  }
  this.session.trials[this.session.trials.length] = trial;
};
