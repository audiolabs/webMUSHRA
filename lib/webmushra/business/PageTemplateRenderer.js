/*************************************************************************
         (C) Copyright AudioLabs 2017 

This source code is protected by copyright law and international treaties. This source code is made available to You subject to the terms and conditions of the Software License for the webMUSHRA.js Software. Said terms and conditions have been made available to You prior to Your download of this source code. By downloading this source code You agree to be bound by the above mentionend terms and conditions, which can also be found here: https://www.audiolabs-erlangen.de/resources/webMUSHRA. Any unauthorised use of this source code may result in severe civil and criminal penalties, and will be prosecuted to the maximum extent possible under law. 

**************************************************************************/

function PageTemplateRenderer(_pageManager, _showButtonPreviousPage, _language) {
  this.progressbarId = null;
  this.headerId = null;
  this.navigationId = 0;
  this.showButtonPreviousPage = _showButtonPreviousPage;
  this.language = _language;
  this.pageManager = _pageManager;
  this.lockNextButtonQueued = false;
  
  this.callbacksEventRefreshed = [];  
}

PageTemplateRenderer.prototype.addCallbackEventRefreshed = function (_callback) {
    this.callbacksEventRefreshed[this.callbacksEventRefreshed.length] = _callback;
};

PageTemplateRenderer.prototype.eventRefreshed = function () {	
    for (var i = 0; i < this.callbacksEventRefreshed.length; ++i) {
      this.callbacksEventRefreshed[i]();
    }	
};



PageTemplateRenderer.prototype.renderProgressBar = function(_parentId) {
  this.progressbarId = _parentId;  
  TolitoProgressBar(this.progressbarId)
                .setOuterTheme('a')
                .setInnerTheme('b')
                .isMini(true)
                .setMax(100)
                .setStartFrom(0)
                .setInterval(0)
                .showCounter(false)
                .build();      
};

PageTemplateRenderer.prototype.renderHeader = function(_parentId) {
  this.headerId = _parentId;
  $('#' + this.headerId).append(this.pageManager.getCurrentPage().getName());  
};

PageTemplateRenderer.prototype.renderNavigation = function(_parentId) {
  this.navigationId = _parentId;
  var renderedSomething = false;
  
  if (this.pageManager.getPageIndex() > 0 && this.showButtonPreviousPage && this.pageManager.getPageIndex() < (this.pageManager.getNumPages() - 1)) {
    var buttonPrevious = $("<button data-role='button' data-inline='true' onclick='" + this.pageManager.getPageManagerVariableName() + ".previousPage();'>" + this.pageManager.getLocalizer().getFragment(this.language, "previousButton")  + "</button>");
    $('#' + this.navigationId).append(buttonPrevious);
    renderedSomething = true;
  }

  
  if (this.pageManager.getPageIndex() < (this.pageManager.getNumPages() - 1)) {
    var buttonNext = $("<button id='__button_next' data-role='button' data-inline='true' onclick='" + this.pageManager.getPageManagerVariableName() + ".nextPage();'>" + this.pageManager.getLocalizer().getFragment(this.language, "nextButton")  + "</button>");
    if (this.lockNextButtonQueued) {
    	buttonNext.attr('disabled', 'disabled');
    }
    $('#' + this.navigationId).append(buttonNext);
    renderedSomething = true;
  }
  
  if (!renderedSomething) {
    $('#' + this.navigationId).remove();
  }
  this.lockNextButtonQueued = false;
};

PageTemplateRenderer.prototype.lockNextButton = function() {
  if ($('#__button_next').length > 0) {
  	$('#__button_next').attr('disabled', 'disabled');
  } else {
  	this.lockNextButtonQueued = true;
  }
};

PageTemplateRenderer.prototype.unlockNextButton = function() {
  $('#__button_next').removeAttr('disabled');
};



PageTemplateRenderer.prototype.refresh = function() {
    $('#' + this.progressbarId).progressbar('option', 'value', ((this.pageManager.getPageIndex()) / (this.pageManager.getNumPages()-1)) * 100);
    $('#' + this.headerId).empty();
    this.renderHeader(this.headerId);

    $('#' + this.navigationId).empty();
    this.renderNavigation(this.navigationId);

    if ($.mobile.activePage) {
        $.mobile.activePage.trigger('create');
    } 
	setTimeout((function() { this.eventRefreshed()}).bind(this), 1);
};


PageTemplateRenderer.prototype.clear = function() {
    if (this.headerId != null) {
      $('#' + this.headerId).empty();
    }

    if (this.navigationId != null) {
      $('#' + this.navigationId).empty();
    }
};
