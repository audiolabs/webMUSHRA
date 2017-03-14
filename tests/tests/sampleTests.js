/*************************************************************************
         (C) Copyright AudioLabs 2017 

This source code is protected by copyright law and international treaties. This source code is made available to You subject to the terms and conditions of the Software License for the webMUSHRA.js Software. Said terms and conditions have been made available to You prior to Your download of this source code. By downloading this source code You agree to be bound by the above mentionend terms and conditions, which can also be found here: https://www.audiolabs-erlangen.de/resources/webMUSHRA. Any unauthorised use of this source code may result in severe civil and criminal penalties, and will be prosecuted to the maximum extent possible under law. 

**************************************************************************/


var configFile = new Array;
for (i = 0; i < configs.length; i++) { 
	configFile[i] = '../configs/'+configs[i]+'.yaml'; 
}
	
$q(function() {
	$q('#testframe0').load(function() {
		YAML.load(configFile[0], (function(result) {
			var config = result;
			$q('#testframe0').get(0).contentWindow.pageTemplateRenderer.addCallbackEventRefreshed(function() {
				QUnit.module("Testframe0");
				QUnit.test('Check Headers', 2, function() {  
					QUnit.strictEqual($q('#testframe0').contents().find('#header').get(0).innerHTML, config.testname, "Header Matches");
					QUnit.strictEqual($q('#testframe0').contents().find('#page_header').get(0).innerHTML, config.pages[0].name, "Page Header Matches");
				});
				QUnit.test('Check Button Texts at Testframe0', 5, function() {  
				
					QUnit.strictEqual($q('#testframe0').contents().find('#pause').get(0).innerHTML, "Pause", "Pause Button Text Matches");
					QUnit.strictEqual($q('#testframe0').contents().find('#playCondition0').get(0).innerHTML, "Play", "Play Button Text Matches");
					QUnit.strictEqual($q('#testframe0').contents().find('#__button_next').get(0).innerHTML, "Next", "Next Button Text Matches");
					for (i = 0; i < config.pages[0].response.length; i++) { 
						QUnit.strictEqual($q('#testframe0').contents().find('#1__response_'+i).get(0).value, config.pages[0].response[i].value, "Likert"+i+" Button Text Matches");
					}
				});
			});
		}));
	});
	
	$q('#testframe1').load(function(){		
		YAML.load(configFile[1], (function(result) {
			var config = result;
			$q('#testframe1').get(0).contentWindow.pageTemplateRenderer.addCallbackEventRefreshed(function() {
				QUnit.module( "Testframe1");
				QUnit.test('check if name matches', 1, function() { 
					QUnit.strictEqual($q('#testframe1').contents().find('#page_header').get(0).innerHTML, config.pages[0].name, "page_header matches");
				});
			});
		}));
	});
		
	/*});
	
	//MORE TESTS TO COME
	
	
		$q('#testframe2').load(function(){		
		YAML.load(configFile[2], (function(result) {
			var config = result;
			$q('#testframe2').get(0).contentWindow.pageTemplateRenderer.addCallbackEventRefreshed(function() {
				QUnit.module( "Testframe2");
				QUnit.test('check if name matches', 1, function() { 
					QUnit.strictEqual($q('#testframe2').contents().find('#page_header').get(0).innerHTML, config.pages[0].name, "page_header matches");
				});
			});
		}));
	});
	
	
	
	*/
});