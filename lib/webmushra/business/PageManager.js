/*************************************************************************
         (C) Copyright AudioLabs 2017 

This source code is protected by copyright law and international treaties. This source code is made available to You subject to the terms and conditions of the Software License for the webMUSHRA.js Software. Said terms and conditions have been made available to You prior to Your download of this source code. By downloading this source code You agree to be bound by the above mentionend terms and conditions, which can also be found here: https://www.audiolabs-erlangen.de/resources/webMUSHRA. Any unauthorised use of this source code may result in severe civil and criminal penalties, and will be prosecuted to the maximum extent possible under law. 

**************************************************************************/

function PageManager (_variableName, _htmlParenElementId, _localizer) {
    this.pages = [];
    this.pagesIndex = -1;
    this.parentElementId = _htmlParenElementId;
    this.varName = _variableName;
    this.callbacksPageEventChanged = [];
    this.localizer = _localizer;
}

PageManager.prototype.addCallbackPageEventChanged = function (_callback) {
    this.callbacksPageEventChanged[this.callbacksPageEventChanged.length] = _callback;
};


PageManager.prototype.addPage = function (_page) {
    this.pages[this.pages.length] = _page;
};

PageManager.prototype.getNextPage = function () {
  return this.pages[this.pagesIndex+1];
};

PageManager.prototype.getPageIndex = function () {
  return this.pagesIndex;
};

PageManager.prototype.getNumPages = function () {
  return this.pages.length;
};

PageManager.prototype.getPage = function (_index) {
  return this.pages[_index];
};

PageManager.prototype.getCurrentPage = function () {
  return this.pages[this.pagesIndex];
};

PageManager.prototype.nextPage = function () {
  ++this.pagesIndex;

  if (this.pagesIndex <= this.pages.length) {
      if (this.pages[this.pagesIndex - 1] !== undefined && this.pages[this.pagesIndex - 1].save !== undefined) {
        this.pages[this.pagesIndex - 1].save();
      }

      if (this.pagesIndex >= (this.pages.length - 1) && pageManager.getCurrentPage() instanceof FinishPage) { // last page will be rendered
        for (var i = 0; i < this.pages.length; ++i) {
            if (this.pages[i].store !== undefined) {
                this.pages[i].store();
            }
        }
      }


      var id = this.parentElementId;
      $("#"+id).empty();
      this.pages[this.pagesIndex].render($("#"+id));
      this.pageEventChanged();
      if (this.getCurrentPage().load !== undefined) {
        $("#"+id).append($("<script> " + this.getPageVariableName(this.getCurrentPage()) + ".load();</script>"));
      }
      window.scrollTo(0, 0);
  } else {
    --this.pagesIndex;
  }
};

PageManager.prototype.previousPage = function () {
    --this.pagesIndex;
    if (this.pagesIndex <= this.pages.length) {
      if (this.pages[this.pagesIndex + 1] !== null && this.pages[this.pagesIndex + 1].save !== null) {
        this.pages[this.pagesIndex + 1].save();
      }
      var id = this.parentElementId;
      $("#"+id).empty();
      this.pages[this.pagesIndex].render($("#"+id));
      this.pageEventChanged();
      if (this.getCurrentPage().load !== undefined) {
        $("#"+id).append($("<script> " + this.getPageVariableName(this.getCurrentPage()) + ".load();</script>"));
      }
      window.scrollTo(0, 0);
    } else {
      ++this.pagesIndex;
    }
};

PageManager.prototype.start = function () {
    for (var i = 0; i < this.pages.length; ++i) {
        if (this.pages[i].init !== undefined) {
            this.pages[i].init();
        }
    }
    this.nextPage();
};

PageManager.prototype.restart = function () {
    this.pagesIndex = -1;
    this.start();
};



PageManager.prototype.getPageVariableName = function (_page) {
    for (var i = 0; i < this.pages.length; ++i) {
        if (this.pages[i] == _page) {
            return this.varName + ".pages[" + i +"]";
        }
    }
    return false;
};

PageManager.prototype.getPageManagerVariableName = function () {
    return this.varName;
};

PageManager.prototype.pageEventChanged = function () {
    for (var i = 0; i < this.callbacksPageEventChanged.length; ++i) {
      this.callbacksPageEventChanged[i]();
    }
};

PageManager.prototype.getLocalizer = function () {
  return this.localizer;
};


