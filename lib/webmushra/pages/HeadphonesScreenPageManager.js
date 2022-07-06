/*************************************************************************
         (C) Copyright AudioLabs 2017 

This source code is protected by copyright law and international treaties. This source code is made available to You subject to the terms and conditions of the Software License for the webMUSHRA.js Software. Said terms and conditions have been made available to You prior to Your download of this source code. By downloading this source code You agree to be bound by the above mentionend terms and conditions, which can also be found here: https://www.audiolabs-erlangen.de/resources/webMUSHRA. Any unauthorised use of this source code may result in severe civil and criminal penalties, and will be prosecuted to the maximum extent possible under law. 

**************************************************************************/

function HeadphonesScreenPageManager() {
  
}

HeadphonesScreenPageManager.prototype.createPages = function (_pageManager, _pageTemplateRenderer, _pageConfig, _audioContext, _bufferSize, _audioFileLoader, _session, _errorHandler, _language) {
  
  this.stimuli = [];
  /* Create stimuli */  
  this.stimuli[this.stimuli.length] = new Stimulus("target", _pageConfig.target);
  for (var key in _pageConfig.other){
    this.stimuli[this.stimuli.length] = new Stimulus(key, _pageConfig.other[key]);
  }
       
  for (var i = 0; i < _pageConfig.repetitions; ++i) {
    /* 
    IMPORTANT: We cannot simply repeatedly shuffle the stimuli list and pass it to each page because everything is a reference! 
    All pages would use the same order of stimuli. 
    */
    shuffle(this.stimuli);
    page_stimuli = []
    for (stimulus of this.stimuli){
      page_stimuli[page_stimuli.length] = new Stimulus(stimulus.getId(), stimulus.getFilepath());
    }
    var page = new HeadphonesScreenPage(_pageManager, _pageTemplateRenderer, _audioContext, _bufferSize, _audioFileLoader, page_stimuli,
    _session, _pageConfig, _errorHandler, _language);
    _pageManager.addPage(page);
  }  
};

  