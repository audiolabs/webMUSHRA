/*************************************************************************
         (C) Copyright AudioLabs 2017 

This source code is protected by copyright law and international treaties. This source code is made available to You subject to the terms and conditions of the Software License for the webMUSHRA.js Software. Said terms and conditions have been made available to You prior to Your download of this source code. By downloading this source code You agree to be bound by the above mentionend terms and conditions, which can also be found here: https://www.audiolabs-erlangen.de/resources/webMUSHRA. Any unauthorised use of this source code may result in severe civil and criminal penalties, and will be prosecuted to the maximum extent possible under law. 

**************************************************************************/

/**
* @class GenericPage
* @property {string} title the page title
* @property {string} the page content
*/
function GenericPage(_pageManager, _pageConfig) {
  this.pageManager = _pageManager;
  this.title = _pageConfig.name;
  this.content = _pageConfig.content;
  this.language = _pageConfig.language;
}

/**
* Returns the page title.
* @memberof GenericPage
* @returns {string}
*/
GenericPage.prototype.getName = function () {
  return this.title;
};

/**
* Renders the page
* @memberof GenericPage
*/
GenericPage.prototype.render = function (_parent) {
    _parent.append(this.content);
    return;
};

/**
* Saves the page
* @memberof GenericPage
*/
GenericPage.prototype.save = function () {
};
