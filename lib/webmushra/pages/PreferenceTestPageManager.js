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
  
  
  for (subset of subsets(this.stimuli, _pageConfig.numPerTrial)){
    this.trials.push(subset);
  }
    
  shuffle(this.trials);
  
    
  for (var i = 0; i < this.trials.length; ++i) {
  	var page = new PreferenceTestPage(_pageManager, _pageTemplateRenderer, _audioContext, _bufferSize, _audioFileLoader, this.trials[i],
	_session, _pageConfig, _errorHandler, _language);
  	_pageManager.addPage(page);
  }  
};

function* subsets(array, length, start = 0) {
  if (start >= array.length || length < 1) {
    yield new Set();
  } else {
    while (start <= array.length - length) {
      let first = array[start];
      for (subset of subsets(array, length - 1, start + 1)) {
        subset.add(first);
        yield subset;
      }
      ++start;
    }
  }
}
  