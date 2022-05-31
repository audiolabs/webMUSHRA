/*************************************************************************
         (C) Copyright AudioLabs 2017 

This source code is protected by copyright law and international treaties. This source code is made available to You subject to the terms and conditions of the Software License for the webMUSHRA.js Software. Said terms and conditions have been made available to You prior to Your download of this source code. By downloading this source code You agree to be bound by the above mentionend terms and conditions, which can also be found here: https://www.audiolabs-erlangen.de/resources/webMUSHRA. Any unauthorised use of this source code may result in severe civil and criminal penalties, and will be prosecuted to the maximum extent possible under law. 

**************************************************************************/

function PreferenceTestPageManager() {
  
}

PreferenceTestPageManager.prototype.createPages = function (_pageManager, _pageTemplateRenderer, _pageConfig, _audioContext, _bufferSize, _audioFileLoader, _session, _errorHandler, _language) {

  /* Create a set of trials */
  this.stimuli = [];
  for (var key in _pageConfig.stimuli) {
    this.stimuli[this.stimuli.length] = new Stimulus(key, _pageConfig.stimuli[key]);
  }
  this.trials = [];
  for (pair of pairs(this.stimuli, _pageConfig.considerOrder)){
      this.trials.push(pair);
  }
    
  shuffle(this.trials);
  
    
  for (var i = 0; i < this.trials.length; ++i) {
  	var page = new PreferenceTestPage(_pageManager, _pageTemplateRenderer, _audioContext, _bufferSize, _audioFileLoader, this.trials[i],
	_session, _pageConfig, _errorHandler, _language);
  	_pageManager.addPage(page);
  }  
};

function* pairs(array, fullSet = true) {
/* 
 * This generator returns the items from arrays in pairs.
 * If fullSet is true, all pairs are returned (i.e. {A, B} and {B, A}). 
 * If it is false, only the first half of pairs is returned (i.e. only {A, B} and not {B, A})
 */
  if (array.length < 2) {
    yield new Set();
  } else {
    for (let i = 0; i < array.length; ++i){
        for (let j = fullSet ? 0 : i; j < array.length; ++j){
        if (i == j){continue;}
        var pair = [array[i], array[j]];
        yield pair;
        }
    }    
  }
}
  