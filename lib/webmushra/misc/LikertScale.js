/*************************************************************************
         (C) Copyright AudioLabs 2017 

This source code is protected by copyright law and international treaties. This source code is made available to You subject to the terms and conditions of the Software License for the webMUSHRA.js Software. Said terms and conditions have been made available to You prior to Your download of this source code. By downloading this source code You agree to be bound by the above mentionend terms and conditions, which can also be found here: https://www.audiolabs-erlangen.de/resources/webMUSHRA. Any unauthorised use of this source code may result in severe civil and criminal penalties, and will be prosecuted to the maximum extent possible under law. 

**************************************************************************/

function LikertScale(_responseConfig, _prefix, _initDisabled, _callback) {
  this.responseConfig = _responseConfig;
  this.prefix = _prefix;
  this.initDisabled = _initDisabled;
  this.callback = _callback;  
  this.group = null;
  this.elements = null;
} 

LikertScale.prototype.enable = function () {
  $('input[name='+this.prefix+'_response]').checkboxradio('enable');
}


LikertScale.prototype.render = function (_parent) {
  
  this.group = $("<fieldset data-role='controlgroup' data-type='horizontal'></fieldset>");
  _parent.append(this.group);
  
  this.elements = [];
  var i;
  if(this.responseConfig != null){
    for (i = 0; i < this.responseConfig.length; ++i) {
      var responseValueConfig = this.responseConfig[i];
      var img = "";
      if (responseValueConfig.img) {
        img = "<img id='"+this.prefix+"_response_img_"+i+"' src='"+responseValueConfig.img+"'/><br/>";
      }
      var element = $("<input type='radio' data-mini='false' value='"+responseValueConfig.value+"' name='"+this.prefix+"_response' id='"+this.prefix+"_response_"+i+"'/> \
        <label for='"+this.prefix+"_response_"+i+"'><center>"+img+""+responseValueConfig.label+"</center></label> \
      ");
      this.elements[this.elements.length] = element;
      this.group.append(element);
    }

    this.group.change((function() {

      var set = false;
      for (i = 0; i < this.elements.length; ++i) {
        if (set === true) {
          $("#"+this.prefix+"_response_img_"+i).attr("src", this.responseConfig[i].img);
        } else {
          if ($("#"+this.prefix+"_response_"+i+":checked").val()) {
            set = true;
            $("#"+this.prefix+"_response_img_"+i).attr("src", this.responseConfig[i].imgSelected);
          } else {
            $("#"+this.prefix+"_response_img_"+i).attr("src", this.responseConfig[i].imgHigherResponseSelected);
          }
        }
      }

      if (this.callback) {
        this.callback(this.prefix);
      }
    }).bind(this));
  }
  if (this.initDisabled) {
    this.group.children().attr('disabled', 'disabled');    
  }
  
};

