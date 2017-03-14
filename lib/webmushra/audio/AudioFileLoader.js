/*************************************************************************
         (C) Copyright AudioLabs 2017 

This source code is protected by copyright law and international treaties. This source code is made available to You subject to the terms and conditions of the Software License for the webMUSHRA.js Software. Said terms and conditions have been made available to You prior to Your download of this source code. By downloading this source code You agree to be bound by the above mentionend terms and conditions, which can also be found here: https://www.audiolabs-erlangen.de/resources/webMUSHRA. Any unauthorised use of this source code may result in severe civil and criminal penalties, and will be prosecuted to the maximum extent possible under law. 

**************************************************************************/


function AudioFileLoader(_audioContext, _errorHandler) {
    this.audioContext = _audioContext;
    this.errorHandler = _errorHandler;
    this.callbackSuccess = null;
    this.files = [];
}

AudioFileLoader.prototype.addFile = function(_url, _callback, _callbackArgument) {
    this.files[this.files.length] = {url: _url, callback: _callback, callbackArgument: _callbackArgument};
};



AudioFileLoader.prototype.startLoading = function(_callbackSuccess) {
    this.callbackSuccess = _callbackSuccess;
    
    if (this.files.length === 0) {
      _callbackSuccess();
    }
    
    for (var i = 0; i < this.files.length; ++i) {

      var req = new XMLHttpRequest(); 
      req.open("GET", this.files[i].url, true);
      req.responseType = "arraybuffer"; 
      req.onerror = (function (e) {
        this.errorHandler.sendError("Loading audio file failed: " + e);
        _callbackSuccess();
      }).bind(this);
      
      var param = {index: i, loader: this, request: req};
      req.onload = (function() { 
        this.loader.audioContext.decodeAudioData(this.request.response, (function(buffer) {
          this.loader.files[this.index].callback(buffer, this.loader.files[this.index].callbackArgument);
          this.loader.files[this.index] = null;
          for (var j = 0; j < this.loader.files.length; ++j) {
            if(this.loader.files[j] != null) {
              return;
            }
          }
          _callbackSuccess();
          }).bind(this),
        (function(e){
          this.errorHandler.sendError("Loading audio file failed: " + e);          
          return;
        }).bind(this));
      }).bind(param);           
      req.send();
    }
    
    
      
    

           
};



/*
AudioFileLoader.prototype.startLoading = function(_callbackSuccess) {
    this.callbackSuccess = _callbackSuccess;
    if (this.files.length === 0) {
      _callbackSuccess();
      return;
    } 
    	
    var req = new XMLHttpRequest(); 
    req.open("GET", this.files[0].url, true);
    req.responseType = "arraybuffer"; 
    req.onerror = (function (e) {
      this.errorHandler.sendError("Loading audio file failed: " + e);
      _callbackSuccess();
    }).bind(this);
    
    req.onload = (function() { 
      this.audioContext.decodeAudioData(req.response, (function(buffer) {
        this.files[0].callback(buffer, this.files[0].callbackArgument);
        this.files.splice(0,1); 
        this.startLoading(this.callbackSuccess);
        }).bind(this),
      (function(e){
        this.errorHandler.sendError("Loading audio file failed: " + e);
        _callbackSuccess();
        return;
      }).bind(this));
    }).bind(this); 
    

    req.send();       
};*/

