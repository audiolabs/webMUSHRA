/*************************************************************************
         (C) Copyright AudioLabs 2017 

This source code is protected by copyright law and international treaties. This source code is made available to You subject to the terms and conditions of the Software License for the webMUSHRA.js Software. Said terms and conditions have been made available to You prior to Your download of this source code. By downloading this source code You agree to be bound by the above mentionend terms and conditions, which can also be found here: https://www.audiolabs-erlangen.de/resources/webMUSHRA. Any unauthorised use of this source code may result in severe civil and criminal penalties, and will be prosecuted to the maximum extent possible under law. 

**************************************************************************/

function FilePlayerController(_filePlayer){
	this.filePlayer = _filePlayer; 
}


FilePlayerController.prototype.bind = function(){
  var stimuli = this.filePlayer.getStimuli();  
  for (i = 0; i < stimuli.length; ++i) {
    (function(i) {
        Mousetrap.bind(String(i + 1), function() { $('#playCondition' + i).click(); });
    })(i);
  }
  Mousetrap.bind(['space'], function(e){ $('#pause').click(); });
};


FilePlayerController.prototype.unbind = function(){
  var stimuli = this.filePlayer.getStimuli();
  for (i = 0; i < stimuli.length; ++i) {
    Mousetrap.unbind(String(i + 1));
  }
  Mousetrap.unbind(['space']);
};