/*************************************************************************
         (C) Copyright AudioLabs 2023

This source code is protected by copyright law and international treaties. This source code is made available to You subject to the terms and conditions of the Software License for the webMUSHRA.js Software. Said terms and conditions have been made available to You prior to Your download of this source code. By downloading this source code You agree to be bound by the above mentionend terms and conditions, which can also be found here: https://www.audiolabs-erlangen.de/resources/webMUSHRA. Any unauthorised use of this source code may result in severe civil and criminal penalties, and will be prosecuted to the maximum extent possible under law.

**************************************************************************/

function RankingPage(_pageManager, _audioContext, _bufferSize, _audioFileLoader, _session, _pageConfig, _mushraValidator, _errorHandler, _language) {
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



RankingPage.prototype.getName = function () {
  return this.pageConfig.name;
};

RankingPage.prototype.init = function () {
   var toDisable;
  var td;
  var active;

  if (this.pageConfig.strict !== false) {
    this.mushraValidator.checkNumConditions(this.conditions);
  }

  var i;
  for (i = 0; i < this.conditions.length; ++i) {
    this.mushraValidator.checkSamplerate(this.audioContext.sampleRate, this.conditions[i]);
  }
  this.mushraValidator.checkConditionConsistency(this.conditions[0], this.conditions);

  this.mushraAudioControl = new MushraAudioControl(this.audioContext, this.bufferSize, this.conditions[0], this.conditions, this.errorHandler, this.pageConfig.createAnchor35, this.pageConfig.createAnchor70, this.pageConfig.randomize, this.pageConfig.switchBack, false);

  this.mushraAudioControl.addEventListener((function (_event) {
  if (_event.name == 'stopTriggered') {
    $(".audioControlElement").text(this.pageManager.getLocalizer().getFragment(this.language, 'playButton'));

    for(i = 0; i < _event.conditionLength; i++) {
      active = '#buttonConditions' + i;
      toDisable = $(".scales").get(i);
      if($(active).attr("active") == "true") {
        $.mobile.activePage.find(active)      // remove color from conditions
          .removeClass('ui-btn-b')
          .addClass('ui-btn-a').attr('data-theme', 'a');
        //$(toDisable).slider('disable');
        $(toDisable).attr("active", "false");
        $(active).attr("active", "false");
    activeElim = '#buttonElim' + i;
    $.mobile.activePage.find(activeElim)    // remove color from eliminate
        .removeClass('ui-btn-b')
        .addClass('ui-btn-a').attr('data-theme', 'a');
        break;
      }
    }

    $.mobile.activePage.find('#buttonStop')    //add color to stop
      .removeClass('ui-btn-a')
      .addClass('ui-btn-b').attr('data-theme', 'b');
    $.mobile.activePage.find('#buttonStop').focus();
    $('#buttonStop').attr("active", "true");

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

  var k;
    for(k = 0; k < _event.length; k++) {
      active = '#buttonConditions' + k;
      toDisable = $(".scales").get(k);
      if($(active).attr("active") == "true") {
        $.mobile.activePage.find(active)    // remove color from conditions
          .removeClass('ui-btn-b')
          .addClass('ui-btn-a').attr('data-theme', 'a');
        //$(toDisable).slider('disable');
        $(active).attr("active", "false");
        $(toDisable).attr("active", "false");
    activeElim = '#buttonElim' + k;
    $.mobile.activePage.find(activeElim)    // remove color from conditions
          .removeClass('ui-btn-b')
          .addClass('ui-btn-a').attr('data-theme', 'a');
        break;
     }
    }


    /*$(activeSlider).slider('enable');
    $(activeSlider).attr("active", "true");*/
    $.mobile.activePage.find(selector)    //add color to conditions
      .removeClass('ui-btn-a')
      .addClass('ui-btn-b').attr('data-theme', 'b');
    $.mobile.activePage.find(selector).focus();
    $(selector).attr("active", "true");

  selectedElim = '#buttonElim' + index;
  $.mobile.activePage.find(selectedElim)    //add color to conditions
      .removeClass('ui-btn-a')
      .addClass('ui-btn-b').attr('data-theme', 'b');
    $.mobile.activePage.find(selectedElim).focus();
    $(selectedElim).attr("active", "true");

  } else if (_event.name == 'surpressLoop') {
    this.surpressLoop();
  }


}).bind(this));



};

RankingPage.prototype.render = function (_parent) {
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

  /* Unable to remove the below string without affecting the buttons */
  var tdConditionNamesReference = $("<td>" + this.pageManager.getLocalizer().getFragment(this.language, 'conditions') + "</td>");
  trConditionNames.append(tdConditionNamesReference);

  var tdConditionNamesScale = $("<td id='conditionNameScale'></td>");
  trConditionNames.append(tdConditionNamesScale);

  var conditions = this.mushraAudioControl.getConditions();
  var i;
  var idx = 0;
  for (i = 0; i < conditions.length; ++i) {
    var str = "";
    if (this.pageConfig.showConditionNames === true) {
      str = "<br/>" + conditions[i].id;
    }
    td = $("<td>" + this.pageManager.getLocalizer().getFragment(this.language, 'cond') + (idx + 1) + str + "</td>");
    trConditionNames.append(td);
    idx = idx + 1;
  }

  this.numCond = idx;
  this.score = new Array(this.conditions.length).fill(0);
  this.rank = 1;
  this.itemEliminated = -1;

  var trConditionPlay = $("<tr></tr>");
  tableMushra.append(trConditionPlay);

  var tdConditionPlayReference = $("<td></td>");
  trConditionPlay.append(tdConditionPlayReference);

  var tdConditionPlayScale = $("<td></td>");
  trConditionPlay.append(tdConditionPlayScale);

  for (i = 0; i < conditions.length; ++i) {
    td = $("<td></td>");
    var buttonPlay = $("<button data-role='button' class='center audioControlElement' onclick='" + this.pageManager.getPageVariableName(this) + ".btnCallbackCondition(" + i + ");'>" + this.pageManager.getLocalizer().getFragment(this.language, 'playButton') + "</button>");
    buttonPlay.attr("id", "buttonConditions" + i);
    td.append(buttonPlay);
    trConditionPlay.append(td);
  }

  // ratings
  var trConditionRatings = $("<tr id='tr_ConditionRatings'></tr>");
  tableMushra.append(trConditionRatings);

  var tdConditionRatingsReference = $("<td id='refCanvas'></td>");
  trConditionRatings.append(tdConditionRatingsReference);

  var tdConditionRatingsScale = $("<td></td>");
  trConditionRatings.append(tdConditionRatingsScale);

  for (i = 0; i < conditions.length; ++i) {
    td = $("<td></td>");
    var buttonElim = $("<button data-role='button' onclick='" + this.pageManager.getPageVariableName(this) + ".btnCallbackElimination(" + i + ");'>" + this.pageManager.getLocalizer().getFragment(this.language, 'eliminateButton') + "</button>");
    buttonElim.attr("id", "buttonElim" + i);
    td.append(buttonElim);
    trConditionRatings.append(td);
  }

  if (this.pageConfig.showResetButton === true){
    var buttonReset = $("<td><button data-role='button' onclick='" + this.pageManager.getPageVariableName(this) + ".btnCallbackReset();'>" + this.pageManager.getLocalizer().getFragment(this.language, 'resetButton') + "</button></td>");
    trConditionRatings.append(buttonReset);
  }


  this.macic = new MushraAudioControlInputController(this.mushraAudioControl, this.pageConfig.enableLooping, add_ref_to_conditions=false);
  this.macic.bind();

  //Wavform is not shown in ranking since there is no reference
  //this.waveformVisualizer = new WaveformVisualizer(this.pageManager.getPageVariableName(this) + ".waveformVisualizer", tdRight, this.conditions[0], this.pageConfig.showWaveform, this.pageConfig.enableLooping, this.mushraAudioControl);
  this.waveformVisualizer = new WaveformVisualizer(this.pageManager.getPageVariableName(this) + ".waveformVisualizer", tdRight, this.conditions[0], false, this.pageConfig.enableLooping, this.mushraAudioControl);
  this.waveformVisualizer.create();
  this.waveformVisualizer.load();

};

RankingPage.prototype.pause = function() {
    this.mushraAudioControl.pause();
};

RankingPage.prototype.setLoopStart = function() {
  var slider = document.getElementById('slider');
  var startSliderSamples = this.mushraAudioControl.audioCurrentPosition;

  var endSliderSamples = parseFloat(slider.noUiSlider.get()[1]);

  this.mushraAudioControl.setLoop(startSliderSamples, endSliderSamples);
};

RankingPage.prototype.setLoopEnd = function() {
  var slider = document.getElementById('slider');
  var startSliderSamples = parseFloat(slider.noUiSlider.get()[0]);

  var endSliderSamples = this.mushraAudioControl.audioCurrentPosition;

  this.mushraAudioControl.setLoop(startSliderSamples, endSliderSamples);
};

RankingPage.prototype.btnCallbackCondition = function(_index) {
  this.currentItem = _index;

  var label = $("#buttonConditions" + _index).text();
  var elimStatus = $("#buttonElim" + _index).text();

  if (label == this.pageManager.getLocalizer().getFragment(this.language, 'pauseButton')) {
    this.mushraAudioControl.pause();
    $("#buttonConditions" + _index).text(this.pageManager.getLocalizer().getFragment(this.language, 'playButton'));
  } else if (label == this.pageManager.getLocalizer().getFragment(this.language, 'playButton')) {
    if (elimStatus == this.pageManager.getLocalizer().getFragment(this.language, 'eliminateButton')) {
    $(".audioControlElement").text(this.pageManager.getLocalizer().getFragment(this.language, 'playButton'));
    this.mushraAudioControl.playCondition(_index);
    $("#buttonConditions" + _index).text(this.pageManager.getLocalizer().getFragment(this.language, 'pauseButton'));
    if (this.itemEliminated != -1) {
      this.rank = this.rank + 1;
      this.itemEliminated = -1;
    }
    }
  }
};

RankingPage.prototype.surpressLoop = function() {
  var id = $("#buttonConditions" + this.currentItem);
  id.text(this.pageManager.getLocalizer().getFragment(this.language, 'playButton'));
}

RankingPage.prototype.btnCallbackElimination = function(_index) {
  this.currentItem = _index;

  var label = $("#buttonElim" + _index).text();

  curButton = '#buttonConditions' + _index;

  if ($(curButton).attr("active") == "true") {
    if (label == this.pageManager.getLocalizer().getFragment(this.language, 'eliminateButton')) {

    //$("#buttonElim" + _index).text(this.pageManager.getLocalizer().getFragment(this.language, 'activateButton'));
    $("#buttonElim" + _index).text(this.rank);
    $("#buttonElim" + _index).addClass('ui-disabled');
    $("#buttonConditions" + _index).addClass('ui-disabled');

    this.score[_index] = this.rank;
    this.itemEliminated = _index;

    } else {

    $("#buttonElim" + _index).text(this.pageManager.getLocalizer().getFragment(this.language, 'eliminateButton'));

    if (this.itemEliminated == _index) {
      this.itemEliminated = -1;
      this.score[_index] = 0;
    }
    }

    if (this.pageConfig.forceRankAll & (this.rank == this.conditions.length)) {
      $("#__button_next").removeClass('ui-disabled');
    }
  }
};

RankingPage.prototype.btnCallbackReset = function() {
  this.rank = 1;
  this.itemEliminated = -1;
  this.score = new Array(this.conditions.length).fill(0);

   var conditions = this.mushraAudioControl.getConditions();

  for (i = 0; i < conditions.length; ++i) {
    $("#buttonElim" + i).text(this.pageManager.getLocalizer().getFragment(this.language, 'eliminateButton'));
    $("#buttonElim" + i).removeClass('ui-disabled');
    $("#buttonConditions" + i).removeClass('ui-disabled');
  }

  if (this.pageConfig.forceRankAll) {
    $("#__button_next").addClass('ui-disabled');
  }

};

RankingPage.prototype.renderCanvas = function(_parentId) {
  $('#mushra_canvas').remove();
  parent = $('#' + _parentId);
  var canvas = document.createElement("canvas");
  canvas.style.position = "absolute";
  canvas.style.left = 0;
  canvas.style.top = 0;
  canvas.style.zIndex = 0;
  canvas.setAttribute("id","mushra_canvas");
  parent.get(0).appendChild(canvas);

  $(".scales").siblings().css("zIndex", "1");
};


RankingPage.prototype.load = function () {

  this.startTimeOnPage = new Date();

  this.renderCanvas('mushra_items');

  this.mushraAudioControl.initAudio();

  if (this.loop.start !== null && this.loop.end !== null) {
    this.mushraAudioControl.setLoop(0, 0, this.mushraAudioControl.getDuration(), this.mushraAudioControl.getDuration() /this.waveformVisualizer.stimulus.audioBuffer.sampleRate);
    this.mushraAudioControl.setPosition(0);
  }

  if (this.pageConfig.forceRankAll) {
    $("#__button_next").addClass('ui-disabled');
  }

};

RankingPage.prototype.save = function () {
  this.macic.unbind();
  this.time += 	(new Date() - this.startTimeOnPage);
  this.mushraAudioControl.freeAudio();
  this.mushraAudioControl.removeEventListener(this.waveformVisualizer.numberEventListener);
  var scales = $(".scales");
  this.ratings = [];
  var i;
  if (this.itemEliminated != -1) {
    this.rank = this.rank + 1;
  }

  for (i = 0; i < this.conditions.length; i++){
    if (this.score[i] == 0) {
      this.score[i] = this.rank;
    }
  }

  this.loop.start = parseInt(this.waveformVisualizer.mushraAudioControl.audioLoopStart);
  this.loop.end = parseInt(this.waveformVisualizer.mushraAudioControl.audioLoopEnd);
};

RankingPage.prototype.store = function () {

  var trial = new Trial();
  trial.type = this.pageConfig.type;
  trial.id = this.pageConfig.id;
  var i;

  var conditions = this.mushraAudioControl.getConditions();

  for (i = 0; i < conditions.length; i++) {
      var ratingObj = new MUSHRARating();
      ratingObj.stimulus = conditions[i].id;
      ratingObj.score = this.score[i];
      ratingObj.time = this.time;
      trial.responses[trial.responses.length] = ratingObj;
  }
  this.session.trials[this.session.trials.length] = trial;
};
