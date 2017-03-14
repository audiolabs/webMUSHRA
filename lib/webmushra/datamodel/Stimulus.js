/*************************************************************************
         (C) Copyright AudioLabs 2017 

This source code is protected by copyright law and international treaties. This source code is made available to You subject to the terms and conditions of the Software License for the webMUSHRA.js Software. Said terms and conditions have been made available to You prior to Your download of this source code. By downloading this source code You agree to be bound by the above mentionend terms and conditions, which can also be found here: https://www.audiolabs-erlangen.de/resources/webMUSHRA. Any unauthorised use of this source code may result in severe civil and criminal penalties, and will be prosecuted to the maximum extent possible under law. 

**************************************************************************/

/**
 * Represents a Stimulus
 * @param {Object} _id Identifier of the stimulus.
 * @param {Object} _filepath Filepath to the audio file.
 * @constructor
 * @property {String} id Identifier of the stimulus.
 * @property {String} filepath Filepath
 * @property {AudioBuffer} audioBuffer Web Audio API audio buffer.
 */
function Stimulus(_id, _filepath) {
  this.id = _id;
  this.filepath = _filepath;
  this.audioBuffer = null;
}

Stimulus.prototype.getId = function() {
  return this.id;
};

Stimulus.prototype.getAudioBuffer = function() {
  return this.audioBuffer;
};

Stimulus.prototype.setAudioBuffer = function(_audioBuffer) {
  this.audioBuffer = _audioBuffer;
};

Stimulus.prototype.getFilepath = function() {
  return this.filepath;
};

