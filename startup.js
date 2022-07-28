/*************************************************************************
         (C) Copyright AudioLabs 2017

This source code is protected by copyright law and international treaties. This source code is made available to You subject to the terms and conditions of the Software License for the webMUSHRA.js Software. Said terms and conditions have been made available to You prior to Your download of this source code. By downloading this source code You agree to be bound by the above mentionend terms and conditions, which can also be found here: https://www.audiolabs-erlangen.de/resources/webMUSHRA. Any unauthorised use of this source code may result in severe civil and criminal penalties, and will be prosecuted to the maximum extent possible under law.

**************************************************************************/

function checkOrientation() {//when changing from potrait to landscape change to the rigth width

  var siteWidth = document.body.scrollWidth;
  $("#header").css("width", siteWidth.toString());

}

window.onresize = function(event) {
  if (pageManager.getCurrentPage() && pageManager.getCurrentPage().isMushra == true) {
    pageManager.getCurrentPage().renderCanvas("mushra_items");
  }

  checkOrientation();
};

// $(document).ready(function(){
// $(window).scroll(function(){
// $('#header').css({
// 'left': $(this).scrollLeft()//Note commented because it causes the endless scrolling to the left
// });
// });
// });


// callbacks
function callbackFilesLoaded() {
  pageManager.start();
  pageTemplateRenderer.renderProgressBar(("page_progressbar"));
  pageTemplateRenderer.renderHeader(("page_header"));
  pageTemplateRenderer.renderNavigation(("page_navigation"));

  if (config.stopOnErrors == false || !errorHandler.errorOccurred()) {
    $.mobile.loading("hide");
    $("body").children().children().removeClass('ui-disabled');
  } else {
    var errors = errorHandler.getErrors();
    var ul = $("<ul style='text-align:left;'></ul>");
    $('#popupErrorsContent').append(ul);
    for (var i = 0; i < errors.length; ++i) {
      ul.append($('<li>' + errors[i] + '</li>'));
    }
    $("#popupErrors").popup("open");
    $.mobile.loading("hide");
  }

  if ($.mobile.activePage) {
    $.mobile.activePage.trigger('create');
  }
}

function callbackURLFound() {
  var errors = errorHandler.getErrors();
  var ul = $("<ul style='text-align:left;'></ul>");
  $('#popupErrorsContent').append(ul);
  for (var i = 0; i < errors.length; ++i) {
    ul.append($('<li>' + errors[i] + '</li>'));
  }
  $("#popupErrors").popup("open");
}

function addPagesToPageManager(_pageManager, _pages) {
  for (var i = 0; i < _pages.length; ++i) {
    if (Array.isArray(_pages[i])) {
      if (_pages[i][0] === "random") {
        _pages[i].shift();
        shuffle(_pages[i]);
      }
      addPagesToPageManager(_pageManager, _pages[i]);
    } else {
      var pageConfig = _pages[i];
      if (pageConfig.type == "generic") {
        _pageManager.addPage(new GenericPage(_pageManager, pageConfig));
      } else if (pageConfig.type == "consent") {
        _pageManager.addPage(new ConsentPage(_pageManager, pageTemplateRenderer, pageConfig));
      } else if (pageConfig.type == "volume") {
        var volumePage = new VolumePage(_pageManager, audioContext, audioFileLoader, pageConfig, config.bufferSize, errorHandler, config.language);
        _pageManager.addPage(volumePage);
      } else if (pageConfig.type == "mushra") {
        var mushraPage = new MushraPage(_pageManager, audioContext, config.bufferSize, audioFileLoader, session, pageConfig, mushraValidator, errorHandler, config.language);
        _pageManager.addPage(mushraPage);
      } else if ( pageConfig.type == "spatial"){
        _pageManager.addPage(new SpatialPage(_pageManager, pageConfig, session, audioContext, config.bufferSize, audioFileLoader, errorHandler, config.language));
      } else if (pageConfig.type == "paired_comparison") {
        var pcPageManager = new PairedComparisonPageManager();
        pcPageManager.createPages(_pageManager, pageTemplateRenderer, pageConfig, audioContext, config.bufferSize, audioFileLoader, session, errorHandler, config.language);
        pcPageManager = null;
      } else if (pageConfig.type == "bs1116") {
        var bs1116PageManager = new BS1116PageManager();
        bs1116PageManager.createPages(_pageManager, pageTemplateRenderer, pageConfig, audioContext, config.bufferSize, audioFileLoader, session, errorHandler, config.language);
        bs1116PageManager = null;
      } else if (pageConfig.type == "likert_single_stimulus") {
        var likertSingleStimulusPageManager = new LikertSingleStimulusPageManager();
        likertSingleStimulusPageManager.createPages(_pageManager, pageTemplateRenderer, pageConfig, audioContext, config.bufferSize, audioFileLoader, session, errorHandler, config.language);
        likertSingleStimulusPageManager = null;
      } else if (pageConfig.type == "likert_multi_stimulus") {
        var likertMultiStimulusPage = new LikertMultiStimulusPage(pageManager, pageTemplateRenderer, pageConfig, audioContext, config.bufferSize, audioFileLoader, session, errorHandler, config.language);
        _pageManager.addPage(likertMultiStimulusPage);
      } else if (pageConfig.type == "finish") {
        var finishPage = new FinishPage(_pageManager, session, dataSender, pageConfig, config.language);
        _pageManager.addPage(finishPage);
      } else {

        errorHandler.sendError("Type not specified.");

      }
    }
  }
}

for (var i = 0; i < $("body").children().length; i++) {
  if ($("body").children().eq(i).attr('id') != "popupErrors" && $("body").children().eq(i).attr('id') != "popupDialog") {
    $("body").children().eq(i).addClass('ui-disabled');
  }
}




function startup(config) {


  if (config == null) {
    errorHandler.sendError("URL couldn't be found!");
    callbackURLFound();
  }

  $.mobile.page.prototype.options.theme = 'a';
  var interval = setInterval(function() {
    $.mobile.loading("show", {
      text : "Loading...",
      textVisible : true,
      theme : "a",
      html : ""
    });
    clearInterval(interval);
  }, 1);
  
  
  if (pageManager !== null) { // clear everything for new experiment
    pageTemplateRenderer.clear();
    $("#page_content").empty();
    $('#header').empty();
  }

  localizer = new Localizer();
  localizer.initializeNLSFragments(nls);

  pageManager = null;
  audioContext;
  audioFileLoader = null;
  mushraValidator = null;
  dataSender = null;
  session = null;
  pageTemplateRenderer = null;
  interval2 = null;

  document.title = config.testname;
  $('#header').append(document.createTextNode(config.testname));

  pageManager = new PageManager("pageManager", "page_content", localizer);
  window.AudioContext = window.AudioContext || window.webkitAudioContext;

  if ( typeof AudioContext !== 'undefined') {
    audioContext = new AudioContext();
  } else if ( typeof webkitAudioContext !== 'undefined') {
    audioContext = new webkitAudioContext();
  }

  document.addEventListener("click", function () {
    if (audioContext.state !== 'running') {
      audioContext.resume();
    }
  }, true);

  try {
    audioContext.destination.channelCountMode = "explicit";
    audioContext.destination.channelInterpretation = "discrete";
    audioContext.destination.channelCount = audioContext.destination.maxChannelCount;
  } catch (e) {
    console.log("webMUSHRA: Could not set channel count of destination node.");
    console.log(e);
  }
  audioContext.volume = 1.0;

  audioFileLoader = new AudioFileLoader(audioContext, errorHandler);
  mushraValidator = new MushraValidator(errorHandler);
  dataSender = new DataSender(config);

  session = new Session();
  session.testId = config.testId;
  session.config = configFile;

  if (config.language == undefined) {
    config.language = 'en';
  }
  pageTemplateRenderer = new PageTemplateRenderer(pageManager, config.showButtonPreviousPage, config.language);
  pageManager.addCallbackPageEventChanged(pageTemplateRenderer.refresh.bind(pageTemplateRenderer));

  addPagesToPageManager(pageManager, config.pages);

  interval2 = setInterval(function() {
    clearInterval(interval2);
    audioFileLoader.startLoading(callbackFilesLoaded);
  }, 10);

}

// start code (loads config) 

function getParameterByName(name) {
  var match = RegExp('[?&]' + name + '=([^&]*)').exec(window.location.search);
  return match && decodeURIComponent(match[1].replace(/\+/g, ' '));
}

var config = null;
var configArg = getParameterByName("config");
var configFile = '';
if (configArg) {
  configFile = 'configs/' + configArg;
} else {
  configFile = 'configs/default.yaml';
}


// global variables
var errorHandler = new ErrorHandler();
var localizer = null;
var pageManager = null;
var audioContext = null;
var audioFileLoader = null;
var mushraValidator = null;
var dataSender = null;
var session = null;
var pageTemplateRenderer = null;
var interval2 = null;


YAML.load(configFile, (function(result) {
  config = result;
  startup(result);
}));
