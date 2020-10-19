/*************************************************************************
         (C) Copyright AudioLabs 2017 

This source code is protected by copyright law and international treaties. This source code is made available to You subject to the terms and conditions of the Software License for the webMUSHRA.js Software. Said terms and conditions have been made available to You prior to Your download of this source code. By downloading this source code You agree to be bound by the above mentionend terms and conditions, which can also be found here: https://www.audiolabs-erlangen.de/resources/webMUSHRA. Any unauthorised use of this source code may result in severe civil and criminal penalties, and will be prosecuted to the maximum extent possible under law. 

**************************************************************************/

function GenericAudioControl(_audioContext, _bufferSize, _stimuli, _errorHandler) {
  this.audioContext = _audioContext;
  this.bufferSize = parseInt(_bufferSize);
  this.stimuli = _stimuli;    
  this.errorHandler = _errorHandler;
  
  this.eventListeners = [];

  this.audioMaxPositions = [];  
  this.audioCurrentPositions = [];  
  this.audioStimulusIndex = null;
  this.audioCommand = null; // 'play', 'pause', 'stop', 'switch'
  this.audioCommandSwitchIndex = null;
}


GenericAudioControl.prototype.removeEventListener = function(_index) {
  this.eventListeners[_index] = null;  
};


GenericAudioControl.prototype.addEventListener = function(_listenerFunction) {
  this.eventListeners[this.eventListeners.length] = _listenerFunction;
  return this.eventListeners.length-1;
};

GenericAudioControl.prototype.sendEvent = function(_event) {
  for (var i = 0; i < this.eventListeners.length; ++i) {
    if (this.eventListeners[i] === null) {
      continue;
    }
    this.eventListeners[i](_event);
  }
};


GenericAudioControl.prototype.play = function(_index) {
  if (this.audioStimulusIndex === null) {
    this.audioStimulusIndex = _index;
    this.audioCommand = 'play';
  } else if (this.audioStimulusIndex !== _index) {
    this.audioCommand = 'switch';
    this.audioCommandSwitchIndex = _index;
  }
  
};


GenericAudioControl.prototype.stop = function() {
  if (this.audioStimulusIndex !== null) {
    this.audioCommand = 'stop';
    this.audioStimulusIndex = null;
  }
};

GenericAudioControl.prototype.pause = function() {
  if (this.audioStimulusIndex !== null) {
    this.audioCommand = 'pause';
  }
};



GenericAudioControl.prototype.getPosition = function(_index) {
  return this.audioCurrentPositions[_index];
};

GenericAudioControl.prototype.getDuration = function(_index) {
  return this.audioMaxPositions[_index];
};


GenericAudioControl.prototype.initAudio = function() {

  this.audioMaxPositions = [];  
  this.audioCurrentPositions = [];
  var i;
  for (i = 0; i < this.stimuli.length; ++i) {
    this.audioCurrentPositions[i] = 0;
    this.audioMaxPositions[i] = this.stimuli[i].getAudioBuffer().length;    
  }
  
    
  
  
  this.dummyBufferSource = this.audioContext.createBufferSource(); // nothing to do
  this.dummyBufferSource.loop = true;
  this.dummyBufferSource.buffer = this.audioContext.createBuffer(1, this.bufferSize, this.audioContext.sampleRate);
  
  var maxChannels = 0;
  for (i = 0; i < this.stimuli.length; ++i) {
    channels = this.stimuli[i].getAudioBuffer().numberOfChannels;
    if (channels > maxChannels) {
      maxChannels = channels;
    }    
  }

  var channelCount = (maxChannels > 2) ?  this.audioContext.destination.channelCount : maxChannels;   
  this.scriptNode = this.audioContext.createScriptProcessor(this.bufferSize, 1, channelCount);
  this.scriptNode.onaudioprocess = (function(audioProcessingEvent) { this.process(audioProcessingEvent); }).bind(this);
  
  this.dummyBufferSource.connect(this.scriptNode);
  this.scriptNode.connect(this.audioContext.destination);
  this.dummyBufferSource.start();
};

GenericAudioControl.prototype.freeAudio = function() {
  this.stop();

  this.dummyBufferSource.disconnect(); // TODO mschoeff hard stop
  this.scriptNode.disconnect();

  this.scriptNode.onaudioprocess = null;
  this.dummyBufferSource = null; // nothing to do
  this.scriptNode = null;
};

GenericAudioControl.prototype.process = function(audioProcessingEvent) {

  var outputBuffer = audioProcessingEvent.outputBuffer;
  var inputBuffer = audioProcessingEvent.inputBuffer;
  
  var index = this.audioStimulusIndex;
  var indexSwitch = this.audioCommandSwitchIndex;
  var sample;
  var channel;
  var outputData;
  var inputData;
  var currentPositionSwitch;
 
  if (index === null) {
    // set to zero
    for (channel = 0; channel < outputBuffer.numberOfChannels; ++channel) {
      outputData = outputBuffer.getChannelData(channel);
      for (sample = 0; sample < outputBuffer.length; ++sample) {  
        outputData[sample] = 0;         
      }   
    }
    return;
  }
  var stimulus = this.stimuli[index];
  
  var audioBuffer = stimulus.getAudioBuffer();
  var currentPosition = null;

  if (this.audioCommand === 'switch') {
    currentPositionSwitch = null;
    var stimulusSwitch = this.stimuli[indexSwitch];
    var audioBufferSwitch = stimulusSwitch.getAudioBuffer();    
    
    for ( channel = 0; channel < stimulus.getAudioBuffer().numberOfChannels; ++channel) { // already definied
      outputData = outputBuffer.getChannelData(channel); // already definied
      inputData = audioBuffer.getChannelData(channel);
      var inputDataSwitch = audioBufferSwitch.getChannelData(channel);
  
      currentPosition = this.audioCurrentPositions[index];
      currentPositionSwitch = this.audioCurrentPositions[indexSwitch];    
      for (sample = 0; sample < outputBuffer.length; ++sample) {
       outputData[sample] = inputData[currentPosition++] * (1.0 - sample/outputBuffer.length) + inputDataSwitch[currentPositionSwitch++] * (sample/outputBuffer.length);      
        if (currentPosition >= this.audioMaxPositions[index]) {
            currentPosition = 0;
            event = { 
              name: 'ended',
              index:  index
            };  
            this.sendEvent(event);
            this.stop();
        }
        if (currentPositionSwitch >= this.audioMaxPositions[indexSwitch]) {
            currentPositionSwitch = 0;
            event = { 
              name: 'ended',
              index:  indexSwitch
            };  
            this.sendEvent(event);
            this.stop();
        }
      }
    }    
  } else {
    for (channel = 0; channel < stimulus.getAudioBuffer().numberOfChannels; ++channel) { 
      outputData = outputBuffer.getChannelData(channel);
      inputData = audioBuffer.getChannelData(channel);
  
      currentPosition = this.audioCurrentPositions[index];    
      for (sample = 0; sample < outputBuffer.length; ++sample) {
        outputData[sample] = inputData[currentPosition++];      
        if (currentPosition >= this.audioMaxPositions[index]) {
            currentPosition = 0;
            event = { 
              name: 'ended',
              index:  index
            };  
            this.sendEvent(event);
            this.stop();
        }
      }
    }
  } 
  this.audioCurrentPositions[index] = currentPosition;
  
  // fadeout 
  if (this.audioCommand === 'pause' || this.audioCommand === 'stop') {
    for (channel = 0; channel < outputBuffer.numberOfChannels; ++channel) { 
      outputData = outputBuffer.getChannelData(channel); 
      for (sample = 0; sample < outputBuffer.length; ++sample) {  
        outputData[sample] = outputData[sample] * (1 - sample/outputBuffer.length);         
      }   
    }
    
    this.audioStimulusIndex = null;
    if (this.audioCommand === 'stop') {
      this.audioCurrentPositions[index] = 0;
    }
  }
  // fadein
  if (this.audioCommand === 'play') {
    for (channel = 0; channel < outputBuffer.numberOfChannels; ++channel) {
      outputData = outputBuffer.getChannelData(channel);
      for (sample = 0; sample < outputBuffer.length; ++sample) {  
        outputData[sample] = outputData[sample] * (sample/outputBuffer.length);         
      }   
    }
  }  

  // volume  
  for (channel = 0; channel < outputBuffer.numberOfChannels; ++channel) {
    outputData = outputBuffer.getChannelData(channel);
    for (sample = 0; sample < outputBuffer.length; ++sample) {  
      outputData[sample] = outputData[sample] * this.audioContext.volume;         
    }   
  }      
  
   var event = {
    name: 'processUpdate',
    currentSample:  currentPosition,
    numSamples: this.audioMaxPositions[index],
    index:  index
    //sampleRate: this.audioSampleRate
  };  
  this.sendEvent(event);
  
  if (this.audioCommand === 'switch') {
    this.audioCurrentPositions[indexSwitch] = currentPositionSwitch; 
    this.audioStimulusIndex = indexSwitch;
    event = { 
      name: 'processUpdate',
      currentSample:  currentPositionSwitch,
      numSamples: this.audioMaxPositions[indexSwitch],
      index:  indexSwitch
      //sampleRate: this.audioSampleRate
    };  
    this.sendEvent(event);    
  }     
  this.audioCommand = null;
  
};

GenericAudioControl.prototype.setPosition = function(_position, _setStartEnd) {
  var index = this.audioStimulusIndex;
  if (index == null) {
    index = 0;
  }
  this.audioCurrentPositions[index] = _position;
  var eventUpdate = {
    name: 'processUpdate',
    currentSample: this.audioCurrentPositions[index],
    numSamples: this.audioMaxPositions[index],
    index: index
    // sampleRate: this.audioSampleRate
  };  
  this.sendEvent(eventUpdate);  
};
