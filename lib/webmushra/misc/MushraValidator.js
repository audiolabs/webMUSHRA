/*************************************************************************
         (C) Copyright AudioLabs 2017 

This source code is protected by copyright law and international treaties. This source code is made available to You subject to the terms and conditions of the Software License for the webMUSHRA.js Software. Said terms and conditions have been made available to You prior to Your download of this source code. By downloading this source code You agree to be bound by the above mentionend terms and conditions, which can also be found here: https://www.audiolabs-erlangen.de/resources/webMUSHRA. Any unauthorised use of this source code may result in severe civil and criminal penalties, and will be prosecuted to the maximum extent possible under law. 

**************************************************************************/

function MushraValidator(_errorHandler) {
  this.errorHandler = _errorHandler;
}

/**
 * Audio device and files must have same sample rate.
 */
MushraValidator.prototype.checkSamplerate = function(_sampleRateDevice, _stimulus) {
  if (_sampleRateDevice != _stimulus.getAudioBuffer().sampleRate) {
    this.errorHandler.sendError("Sample rate of device and stimulus (" + _stimulus.getId() + " is different.");
    return false;
  }
  return true;
};


/**
 * Audio device must have enough channels
 */
MushraValidator.prototype.checkNumChannels = function(_audioContext, _stimulus) {
  if (_audioContext.destination.channelCount < _stimulus.getAudioBuffer().numberOfChannels) {
    this.errorHandler.sendError("Audio device has not enough channels (" + _audioContext.destination.channelCount + ") for playing back stimulus " + _stimulus.getId() + " (" + _stimulus.getAudioBuffer().numberOfChannels + ").");
    return false;
  }
  return true;
};

/**
 * Number of conditions must be no more than 12.
 */
MushraValidator.prototype.checkNumConditions = function(_conditions) {
  if (_conditions.length > 12) {
    this.errorHandler.sendError("Number of conditions must be no more than 12.");
    return false;
  }
  return true;
};

/**
 * Duration of stimulus must not exceed 300s.
 */
MushraValidator.prototype.checkStimulusDuration = function(_stimulus) {
  if (_stimulus.getAudioBuffer().duration > 300.0) {
    this.errorHandler.sendError("Duration of stimulus (" + _stimulus.getId() + ") must not exceed 300s.");
    return false;
  }
  return true;
};

MushraValidator.prototype.checkConditionConsistency = function(_reference, _conditions) {
  var sampleRate = _reference.getAudioBuffer().sampleRate;
  var length = _reference.getAudioBuffer().length;
  var numberOfChannels = _reference.getAudioBuffer().numberOfChannels;
  var noError = true;
  for (var i = 0; i < _conditions.length; ++i) {
    if (sampleRate != _conditions[i].getAudioBuffer().sampleRate) {
      this.errorHandler.sendError("Reference/Conditions have different sample rates.");
      noError = false;
    }
    // length
    if (length != _conditions[i].getAudioBuffer().length) {
      this.errorHandler.sendError("Reference/Conditions have different (sample) lengths.");
      noError = false;
    }
    // numberOfChannels
    if (numberOfChannels != _conditions[i].getAudioBuffer().numberOfChannels) {
      this.errorHandler.sendError("Reference/Conditions have different numbers of channels.");
      noError = false;
    }
  }
  return noError;
};
