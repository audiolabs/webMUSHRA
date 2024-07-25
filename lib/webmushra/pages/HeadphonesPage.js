/*************************************************************************
         (C) Copyright AudioLabs 2017

This source code is protected by copyright law and international treaties. This source code is made available to You subject to the terms and conditions of the Software License for the webMUSHRA.js Software. Said terms and conditions have been made available to You prior to Your download of this source code. By downloading this source code You agree to be bound by the above mentionend terms and conditions, which can also be found here: https://www.audiolabs-erlangen.de/resources/webMUSHRA. Any unauthorised use of this source code may result in severe civil and criminal penalties, and will be prosecuted to the maximum extent possible under law.

**************************************************************************/

/**
* @class HeadphonesPage
* @property {string} title the page title
* @property {string} the page content
*/
function HeadphonesPage(_pageManager, _pageTemplateRenderer, _pageConfig) {
    this.pageManager = _pageManager;
    this.title = _pageConfig.name;
    this.content = _pageConfig.content;
    this.language = _pageConfig.language;
    this.pageTemplateRenderer = _pageTemplateRenderer;
}


HeadphonesPage.prototype.load = function () {
    this.pageTemplateRenderer.lockNextButton();
}

/**
* Returns the page title.
* @memberof HeadphonesPage
* @returns {string}
*/
HeadphonesPage.prototype.getName = function () {
    return this.title;
};

/**
* Renders the page
* @memberof HeadphonesPage
*/
HeadphonesPage.prototype.render = function (_parent) {
    this.pageTemplateRenderer.lockNextButton();

    // Optional: set options (see JSDoc in headphonesCheck.js for a full list of options).
    // For example:
    //    - set the check type to 'beat' for a Beat test
    //    - provide a volume calibration sound
    //    - provide an example check sound
    //    - provide a set of check sounds
    const options = {
        checkType: 'beat',
        volumeSound: 'stimuli_Beat/Beat_calibration.flac',
        checkExample: 'stimuli_Beat/Beat_example_2.flac',
        checkSounds: [
            { answer: 2, file: 'stimuli_Beat/Beat_1_2.flac' },
            { answer: 3, file: 'stimuli_Beat/Beat_2_3.flac' },
            { answer: 1, file: 'stimuli_Beat/Beat_3_1.flac' },
            { answer: 3, file: 'stimuli_Beat/Beat_4_3.flac' },
            { answer: 3, file: 'stimuli_Beat/Beat_5_3.flac' },
            { answer: 2, file: 'stimuli_Beat/Beat_6_2.flac' },
            { answer: 1, file: 'stimuli_Beat/Beat_7_1.flac' },
            { answer: 2, file: 'stimuli_Beat/Beat_8_2.flac' },
            { answer: 3, file: 'stimuli_Beat/Beat_9_3.flac' },
            { answer: 1, file: 'stimuli_Beat/Beat_10_1.flac' },
            { answer: 1, file: 'stimuli_Beat/Beat_11_1.flac' },
            { answer: 2, file: 'stimuli_Beat/Beat_12_2.flac' },
        ],
        parentElement: _parent,
    };

    // Create a new HeadphonesCheck using the options set above.
    const headphonesCheck = new HeadphonesCheck(options);

    // Perform the check (optional: call the showResult function when finished).
    headphonesCheck.checkHeadphones(showResult);

    // Function to display the result after completing the test.
    function showResult(result) {
        let resultMessage = result ? 'Pass' : 'Fail';
        _parent.append('<div id="testResults" style="width: 100%; text-align: center; font-size: 3em;"></div>');
        $('#testResults')
            .append('<p style="margin-top: 1em;">' + resultMessage + '</p>')
            .append('<p>' + headphonesCheck.attemptRecord[headphonesCheck.attemptCount].numberCorrect + ' out of 6 correct<br>after ' + headphonesCheck.attemptCount + ' attempt(s).<br>(The pass mark is 6.)</p>')
            .append('<p>Sorry, you must pass the headphones check to continue. Please contact the researcher to help troubleshoot your set up.</p>')

        if (result === "Pass") {
            this.pageTemplateRenderer.unlockNextButton();
        }
    }


    return;
};

/**
* Saves the page
* @memberof HeadphonesPage
*/
HeadphonesPage.prototype.save = function () {
};
