/*************************************************************************
         (C) Copyright AudioLabs 2017 

This source code is protected by copyright law and international treaties. This source code is made available to You subject to the terms and conditions of the Software License for the webMUSHRA.js Software. Said terms and conditions have been made available to You prior to Your download of this source code. By downloading this source code You agree to be bound by the above mentionend terms and conditions, which can also be found here: https://www.audiolabs-erlangen.de/resources/webMUSHRA. Any unauthorised use of this source code may result in severe civil and criminal penalties, and will be prosecuted to the maximum extent possible under law. 

**************************************************************************/

function LikertSingleStimulusPageManager() {
  
}

LikertSingleStimulusPageManager.prototype.createPages = function (_pageManager, pageTemplateRenderer, _pageConfig, _audioContext, _bufferSize, _audioFileLoader, _session, _errorHandler, _language) {
  this.stimuli = [];
  for (var key in _pageConfig.stimuli) {
    this.stimuli[this.stimuli.length] = new Stimulus(key, _pageConfig.stimuli[key]);
  }
  shuffle(this.stimuli);
  
  var numStimuli = this.stimuli.length;
  if (_pageConfig.maxStimuli > 0) {
    numStimuli = Math.min(numStimuli, _pageConfig.maxStimuli);
  }
  for (var i = 0; i < numStimuli; ++i) {    
    var page = new LikertSingleStimulusPage(_pageManager, pageTemplateRenderer, _pageConfig, _audioContext, _bufferSize, _audioFileLoader, this.stimuli[i], _session, _errorHandler, _language);
    _pageManager.addPage(page);
  }  
};
