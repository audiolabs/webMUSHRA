/*************************************************************************
         (C) Copyright AudioLabs 2017 

This source code is protected by copyright law and international treaties. This source code is made available to You subject to the terms and conditions of the Software License for the webMUSHRA.js Software. Said terms and conditions have been made available to You prior to Your download of this source code. By downloading this source code You agree to be bound by the above mentionend terms and conditions, which can also be found here: https://www.audiolabs-erlangen.de/resources/webMUSHRA. Any unauthorised use of this source code may result in severe civil and criminal penalties, and will be prosecuted to the maximum extent possible under law. 

**************************************************************************/

/**
* @class ConsentPage
* @property {string} title the page title
* @property {string} the page content
*/
function ConsentPage(_pageManager, _pageTemplateRenderer, _pageConfig) {
  this.pageManager = _pageManager;
  this.title = _pageConfig.name;
  this.content = _pageConfig.content;
  this.language = _pageConfig.language;
  this.mustConsent = _pageConfig.mustConsent;
  this.pageTemplateRenderer = _pageTemplateRenderer;
}

/**
* Loads the page
* @memberof ConsentPage
*/
ConsentPage.prototype.load = function () {
  if (this.mustConsent == true){
    this.pageTemplateRenderer.lockNextButton();
  }
}

/**
* Returns the page title.
* @memberof ConsentPage
* @returns {string}
*/
ConsentPage.prototype.getName = function () {
  return this.title;
};

/**
* Renders the page
* @memberof ConsentPage
*/
ConsentPage.prototype.render = function (_parent) {
  _parent.append(this.content);

  var radioChoice = $("<div id='radio-choice' data-role='controlgroup' data-type='vertical'>\
    <input type='radio' name='radio-choice' id='radio-choice-accept' value='accept'>\
    <label for='radio-choice-accept'>I give consent.</label>\
    <input type='radio' name='radio-choice' id='radio-choice-reject' value='reject'>\
    <label for='radio-choice-reject'>I do not give consent.</label>\
  </div>");
  radioChoice.find("input[type='radio']").bind("change", (function(){
    if ($('#radio-choice-accept')[0].checked) {
      this.pageTemplateRenderer.unlockNextButton();
    } else {
      this.pageTemplateRenderer.lockNextButton();
    }
  }).bind(this));
  _parent.append(radioChoice);
  return;
};

/**
* Saves the page
* @memberof ConsentPage
*/
ConsentPage.prototype.save = function () {
};
