/*************************************************************************
         (C) Copyright AudioLabs 2017 

This source code is protected by copyright law and international treaties. This source code is made available to You subject to the terms and conditions of the Software License for the webMUSHRA.js Software. Said terms and conditions have been made available to You prior to Your download of this source code. By downloading this source code You agree to be bound by the above mentionend terms and conditions, which can also be found here: https://www.audiolabs-erlangen.de/resources/webMUSHRA. Any unauthorised use of this source code may result in severe civil and criminal penalties, and will be prosecuted to the maximum extent possible under law. 

**************************************************************************/

/**
 * Represents a session.
 * @constructor
 * @property {Participant} participant - Participant who has done the session.
 * @property {Trial[]} trials - Trials the participant has done within the session.
 * 
 */
function Session() {
  /*
  this.startTime = null;
  this.endTime = null;
  NOTE: not yet
  */
  this.testId = null;
  this.participant = new Participant();
  this.trials = [];
  this.uuid = uuidv4();
}

Session.prototype.getTrial = function(_type, _id) {
	
	for (var i = 0; i < this.trials.length; ++i) {
		var trial = this.trials[i];
		if (trial.type === _type && trial.id === _id) {
			return trial;
		}
	}
	return null;
};