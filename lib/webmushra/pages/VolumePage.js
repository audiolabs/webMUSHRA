/*************************************************************************
         (C) Copyright AudioLabs 2017 

This source code is protected by copyright law and international treaties. This source code is made available to You subject to the terms and conditions of the Software License for the webMUSHRA.js Software. Said terms and conditions have been made available to You prior to Your download of this source code. By downloading this source code You agree to be bound by the above mentionend terms and conditions, which can also be found here: https://www.audiolabs-erlangen.de/resources/webMUSHRA. Any unauthorised use of this source code may result in severe civil and criminal penalties, and will be prosecuted to the maximum extent possible under law. 

**************************************************************************/

function VolumePage(_pageManager, _audioContext, _audioFileLoader, _pageConfig, _bufferSize, _errorHandler, _language) {
  this.pageManager = _pageManager;
  this.audioContext = _audioContext;
  this.audioFileLoader = _audioFileLoader;
  this.pageConfig = _pageConfig;
  this.bufferSize = _bufferSize;
  this.errorHandler = _errorHandler;
  this.language = _language;
  this.fpc = null;  
  this.played = false;

  this.stimulus = new Stimulus("stimulus", _pageConfig.stimulus);

  this.audioFileLoader.addFile(this.pageConfig.stimulus, (function (_buffer, _stimulus) { _stimulus.setAudioBuffer(_buffer); }), this.stimulus);
  this.filePlayer = null;
  
  this.audioContext.volume = this.volume = this.pageConfig.defaultVolume; 
}

VolumePage.prototype.init = function (_callbackError) {
  this.filePlayer = new FilePlayer(this.audioContext, this.bufferSize, [this.stimulus], this.errorHandler, this.language, this.pageManager.getLocalizer()); 
};


VolumePage.prototype.getName = function () {
  return this.pageConfig.name;
};

VolumePage.prototype.load = function() {
  this.filePlayer.init(); 
};

VolumePage.prototype.save = function() {
  this.volume = this.audioContext.volume;
  this.filePlayer.free();
};

VolumePage.prototype.gainVolume = function(value) {
  this.audioContext.volume = parseInt(value, 10) / 100.0;
};


VolumePage.prototype.render = function (_parent) {
  var content = $(" <p> " + this.pageConfig.content + " </p>");
  var slider = $("<table width='600' style='margin: 0 auto;'></table>");
  slider.append(
    $('<tr></tr>').append(
      $('<td></td>').append(
        $('<input type="range" name="slider"  min="0" max="100" value="'+ this.volume * 100 +'"  data-highlight="true" onchange = "' + this.pageManager.getPageVariableName(this) + '.gainVolume(this.value)">')
      )
    )
  );
  _parent.append(content);
  this.filePlayer.render(_parent);
  _parent.append(slider); 
};
