/*************************************************************************
         (C) Copyright AudioLabs 2017 

This source code is protected by copyright law and international treaties. This source code is made available to You subject to the terms and conditions of the Software License for the webMUSHRA.js Software. Said terms and conditions have been made available to You prior to Your download of this source code. By downloading this source code You agree to be bound by the above mentionend terms and conditions, which can also be found here: https://www.audiolabs-erlangen.de/resources/webMUSHRA. Any unauthorised use of this source code may result in severe civil and criminal penalties, and will be prosecuted to the maximum extent possible under law. 

**************************************************************************/

function FilePlayer(_audioContext, _bufferSize, _stimuli, _errorHandler, _language, _localizer, _hideProgressBar) {
  this.audioContext = _audioContext;
  this.bufferSize = _bufferSize;
  this.stimuli = _stimuli;  
  this.errorHandler = _errorHandler;
  this.language = _language;
  this.localizer = _localizer;
  this.genericAudioControl = new GenericAudioControl(this.audioContext, this.bufferSize, this.stimuli, this.errorHandler);
  this.progressBars = [];
  this.hideProgressBar = _hideProgressBar;
  
  this.genericAudioControl.addEventListener((function (_event) {
    if (_event.name == 'processUpdate') {
      $("#FilePlayer_progressbar_"+_event.index).progressbar('option', 'value', (_event.currentSample/(_event.numSamples-1)) * 100);
    } 
  }).bind(this));

  this.hooks = [];  
  
}

FilePlayer.prototype.init = function() {
  this.genericAudioControl.initAudio();
  if (this.hideProgressBar != true) {
    for (var i = 0; i < this.stimuli.length; ++i) {
      TolitoProgressBar(this.progressBars[i].attr('id')).setOuterTheme('a').setInnerTheme('b').isMini(true).setMax(100).setStartFrom(0).setInterval(0).showCounter(false).build();
    }
  }
};

FilePlayer.prototype.free = function() {
  this.genericAudioControl.freeAudio();
};


FilePlayer.prototype.load = function() {
};


FilePlayer.prototype.renderElement = function(_parent, _i) {
  var buttonPlay = $('<button data-role="button" id="playCondition'+_i+'" name="'+_i+'">' + this.localizer.getFragment(this.language, 'playButton')  + '</button>');
  buttonPlay.bind( "click", (function(event, ui) {
    this.genericAudioControl.play(parseInt(event.target.name));
  }).bind(this));
    
  var buttonPause = $('<button data-role="button" id="pause">' + this.localizer.getFragment(this.language, 'pauseButton')  + '</button>');
  buttonPause.bind( "click", (function(event, ui) {
    this.genericAudioControl.pause();
  }).bind(this));
  
  if (this.hideProgressBar != true) {
    var id = "FilePlayer_progressbar_" + _i;
    var progressBar = $('<div id = "' + id + '" class="fileplayer_progressbar" ></div>');
    this.progressBars[_i] = progressBar;
  }
  this.hooks[_i] = $('<td></td>');    
  _parent.append(
    $('<table></table>').append(
      $('<tr></tr>').append(
        $('<td></td>').append(buttonPlay), 
        $('<td></td>').append(buttonPause),
        $('<td></td>').append(progressBar),
        this.hooks[_i]
      )
    )
  );
};

FilePlayer.prototype.render = function(_parent) {
  
  var table = $('<table align="center" class="default_padding"></table>');
  _parent.append(table);

  for (var i = 0; i < this.stimuli.length; ++i) {
    var tr = $('<tr></tr>');
    table.append(tr);

    var td = $('<td></td>');
          
    this.renderElement(td, i);
    
    
    tr.append(td);       
    
  }  
};

FilePlayer.prototype.getHook = function(_index) {
  return this.hooks[_index];
};

FilePlayer.prototype.getStimuli = function() {
	return this.stimuli;
};

