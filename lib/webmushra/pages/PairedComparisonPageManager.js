/*************************************************************************
         (C) Copyright AudioLabs 2017 

This source code is protected by copyright law and international treaties. This source code is made available to You subject to the terms and conditions of the Software License for the webMUSHRA.js Software. Said terms and conditions have been made available to You prior to Your download of this source code. By downloading this source code You agree to be bound by the above mentionend terms and conditions, which can also be found here: https://www.audiolabs-erlangen.de/resources/webMUSHRA. Any unauthorised use of this source code may result in severe civil and criminal penalties, and will be prosecuted to the maximum extent possible under law. 

**************************************************************************/

function PairedComparisonPageManager() {
  
}

PairedComparisonPageManager.prototype.createPages = function (_pageManager, _pageTemplateRenderer, _pageConfig, _audioContext, _bufferSize, _audioFileLoader, _session, _errorHandler, _language) {
  this.conditions = [];
  for (var key in _pageConfig.stimuli) {
    this.conditions[this.conditions.length] = new Stimulus(key, _pageConfig.stimuli[key]);
  }
  this.reference = new Stimulus("reference", _pageConfig.reference);
  shuffle(this.conditions);
  
  for (var i = 0; i < this.conditions.length; ++i) {
  	var page = new PairedComparisonPage(this.reference, this.conditions[i], _pageManager, _pageTemplateRenderer, _audioContext, _bufferSize, _audioFileLoader, _session, _pageConfig, _errorHandler, _language);
  	_pageManager.addPage(page);
  }  
};
