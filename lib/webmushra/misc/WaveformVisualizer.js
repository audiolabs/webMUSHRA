/*************************************************************************
         (C) Copyright AudioLabs 2017 

This source code is protected by copyright law and international treaties. This source code is made available to You subject to the terms and conditions of the Software License for the webMUSHRA.js Software. Said terms and conditions have been made available to You prior to Your download of this source code. By downloading this source code You agree to be bound by the above mentionend terms and conditions, which can also be found here: https://www.audiolabs-erlangen.de/resources/webMUSHRA. Any unauthorised use of this source code may result in severe civil and criminal penalties, and will be prosecuted to the maximum extent possible under law. 

**************************************************************************/

function WaveformVisualizer(_variableName, _parent, _stimulus, _showWaveform, _enableLooping, _mushraAudioControl){
  this.variableName = _variableName;
  this.parent = _parent;
  this.stimulus = _stimulus;
  this.showWaveform = _showWaveform;
  this.enableLooping = _enableLooping;
  this.mushraAudioControl = _mushraAudioControl;
  this.mushraAudioControl.audioLoopingActive = this.enableLooping;
  
  this.table = $('<table id="waveTable"></table>');
  this.slider = $('<div id="slider"></div');
  this.parentWavesurfer = $('<div id="parentWavesurfer"></div');
  this.parentSlider = $('<div></div>');
  this.canvas = document.createElement("canvas");
  this.context = this.canvas.getContext("2d");
  
  if(this.enableLooping){
    this.parent.append(this.table);
  }else{
    
    this.parent.append(this.parentWavesurfer);
  }

  var audioBuffer = _stimulus.getAudioBuffer();
  var numberOfChannels = audioBuffer.numberOfChannels;
  this.avgOriginalSamples = new Float32Array(audioBuffer.length);
  
  for(var i = 0; i < audioBuffer.length; ++i) {
    var sum = 0;
    for(var j = 0; j < numberOfChannels; j++){
      sum += audioBuffer.getChannelData(j)[i];
    }
    var avg = sum * (1.0/numberOfChannels);
    this.avgOriginalSamples[i] = avg;
    
  }
  
  this.resampledSamples = this.avgOriginalSamples;
  
  this.currentPosition = 0; // samples
  this.leftRegionPosition = 0; // samples
  this.rightRegionPosition = this.resampledSamples.length; // samples
  
    this.numberEventListener = this.mushraAudioControl.addEventListener((function (_event) {
      if (_event.name == 'processUpdate') {
        this.setCurrentPosition(_event.currentSample);
      }  
    
      if (this.enableLooping) {
  
        if (_event.name == "loopStartChanged" || _event.name == "loopChanged") {
          var startSamples = _event.start;
          if (parseFloat(this.slider.get(0).noUiSlider.get()[0]) != _event.start) {
            this.slider.get(0).noUiSlider.set([startSamples, this.slider.get(0).noUiSlider.get()[1]]);
          }                                
          var startRegionSamples = this.leftRegionPosition;     
          this.setLeftRegionPosition(startSamples);
          if (startRegionSamples != this.leftRegionPosition) {
            this.refresh();
          }
        }
      
        if (_event.name == "loopEndChanged" || _event.name == "loopChanged") {
          var endSamples = _event.end;
          if (parseFloat(this.slider.get(0).noUiSlider.get()[1]) != _event.end) {
            this.slider.get(0).noUiSlider.set([this.slider.get(0).noUiSlider.get()[0], endSamples]);
          }                 
          
                      
          var endRegionSamples = this.rightRegionPosition;
          this.setRightRegionPosition(endSamples);          
          if (endRegionSamples != this.rightRegionPosition) {
            this.refresh();
          }
        }  
      }
    }).bind(this));
};

WaveformVisualizer.prototype.translateOrigToResampled = function(_i) {
  return Number.parseInt((this.resampledSamples.length / this.avgOriginalSamples.length) * _i);
}

WaveformVisualizer.prototype.resample = function() {
  this.resampledSamples = [];
  if(this.showWaveform == false){
    
    for(var l = 0; l < this.canvas.width; l++){
      this.resampledSamples[l] = 0.3;
    }
  }else{
    var blockCount = Math.ceil(this.avgOriginalSamples.length / this.canvas.width);
    var k = 0;
    for(var i = 0; i < this.avgOriginalSamples.length; i += blockCount) {
      var sum = 0;
      for(var j = 0; j < blockCount; j++){
        sum += Math.abs(this.avgOriginalSamples[j + i]);
      }
      var avg = Math.abs(sum * (1.0/blockCount));
      this.resampledSamples[k] = avg;
      k++;
    }
  }
  this.currentPosition = 0; // samples
  this.leftRegionPosition = 0; // samples
  this.rightRegionPosition = this.resampledSamples.length; // samples
}

WaveformVisualizer.prototype.scaleToHeight = function() {
  var max = 0;
  this.scaledToHeight = 0;
  if(this.showWaveform == false){
    max = this.resampledSamples[0];
    this.scaledToHeight = this.canvas.height / max;
  }else{
    
    for(var i = 0; i < this.resampledSamples.length; i++){
      if(max < this.resampledSamples[i]){
        
        max = this.resampledSamples[i];
      }
    }
    this.scaledToHeight = this.canvas.height / max;
  }
}

WaveformVisualizer.prototype.renderSlider = function() {
  
  this.parentSlider.append(this.slider);
  $.mobile.activePage.trigger('create');
    
  noUiSlider.create(this.slider.get(0), {
    connect : true,
    range: {
    'min': 0,
    'max': this.stimulus.audioBuffer.length
    },
    start: [0, this.stimulus.audioBuffer.length],
    step: 1,
    margin: 25000
  });

  var sampleRate = this.stimulus.audioBuffer.sampleRate;
  this.slider.get(0).noUiSlider.on('update', (function(values, handle){
    
    var startSliderSeconds = Math.floor(values[0]/sampleRate * 100) / 100;
    var endSliderSeconds = Math.floor(values[1]/sampleRate * 100) / 100;    
       
    $('#lowerLim').val(startSliderSeconds.toFixed(2));
    $('#upperLim').val(endSliderSeconds.toFixed(2));
    
    var startSliderSamples = parseInt(values[0]);
    var endSliderSamples = parseInt(values[1]);
    this.mushraAudioControl.setLoop(startSliderSamples, endSliderSamples);
    
    if(endSliderSamples < this.currentPosition/this.scale){
      
      this.mushraAudioControl.setPosition(parseInt(this.rightRegionPosition/this.scale))
    }
  }).bind(this)
  );
};

WaveformVisualizer.prototype.renderTable = function() {
  
  var tr1_ = $("<tr valign='bottom'></tr>");
  this.table.append(tr1_);
  var td11_ = $("<td id='sliderLim'></td>");
  var td12_ = $("<td></td>");
  var td13_ = $("<td id='sliderLim'></td>");  
  tr1_.append(td11_);
  tr1_.append(td12_);
  tr1_.append(td13_);

  var tdLoop2 = $(" \
    <td> \
    </td> \
  "); // TODO mschoeff variable size
  tdLoop2.append(this.parentWavesurfer);
  tdLoop2.append(this.parentSlider);
  
  td12_.append(tdLoop2);
  tdLoop2.css("width",td12_.width().toString());
  var lowerLim = $("<div id='div_lower_limit'><input type=\"text\" name=\"name\" id=\"lowerLim\" class=\"limits\" data-inline=\"true\" data-mini=\"true\"disabled=\"disabled\"></input></div>");
  var upperLim = $("<div id='div_upper_limit'><input type=\"text\" name=\"name\" id=\"upperLim\" class=\"limits\" data-inline=\"true\" data-mini=\"true\"disabled=\"disabled\"></input></div>");
  td11_.append(lowerLim);
  td13_.append(upperLim);


};

WaveformVisualizer.prototype.create = function(){
  
  if(this.enableLooping){
    this.renderTable();
    this.renderSlider();
  }
  
  this.canvas.style.left = this.parent.get(0).style.left;
  this.canvas.style.top = this.parent.get(0).style.top;
  this.canvas.style.position = "relative";
  this.canvas.style.zIndex = 0;
  this.canvas.setAttribute("id","canvas");
  this.parentWavesurfer.append(this.canvas);
  this.canvas.height = this.parentWavesurfer.height();
  this.canvas.width = this.parentWavesurfer.width();
  this.scale = this.canvas.offsetWidth/this.resampledSamples.length;
  this.resample();
  this.scaleToHeight();

  
  this.regionStart = 0; // pixel
  this.regionWidth = this.canvas.offsetWidth; // pixel
  
  this.canvas.addEventListener('click', (function(event){
    
    if(event.x != undefined){
      var newRegion = this.calculateRegion(event.x);
    }else{ // for Firefox
      var newRegion = this.calculateRegion(event.clientX + document.body.scrollLeft + document.documentElement.scrollLeft);
    } 
    if(this.enableLooping){
      if(this.leftRegionPosition != newRegion.left){
        this.mushraAudioControl.setLoopStart(parseInt(newRegion.left/this.scale));
      }else if(this.rightRegionPosition != newRegion.right){
        this.mushraAudioControl.setLoopEnd(parseInt(newRegion.right/this.scale + newRegion.left / this.scale)); 
      }
    }else{
      if(this.leftRegionPosition != newRegion.left){
        this.mushraAudioControl.setPosition(parseInt(newRegion.left/this.scale)) 
      }else if(this.rightRegionPosition != newRegion.right){
        this.mushraAudioControl.setPosition(parseInt(newRegion.right/this.scale + newRegion.left/this.scale))
      }     
    }
  }).bind(this));
   
  this.refresh();

};

WaveformVisualizer.prototype.draw = function(){
  
  this.context.clearRect ( 0 , 0 , this.canvas.width, this.canvas.height );

  this.context.translate(0, this.canvas.height/2);
  
  this.context.fillStyle= 'rgba(0, 0, 0, 0.1)';
  this.context.fillRect(this.leftRegionPosition, -1 * this.canvas.height/2, (this.rightRegionPosition - this.leftRegionPosition), 2 * this.canvas.height);
  
  var selected = this.leftRegionPosition > 0 || this.rightRegionPosition < this.resampledSamples.length;

  var state = 0;         
  this.context.beginPath();
  if (selected) {
    this.context.strokeStyle = '#808080';
  } else if(this.currentPosition != 0) {
    state = 0;
  }else {
    this.context.strokeStyle = '#F8DEBD';
    state = 1;
  }
  
  for(var j = 0; j < this.resampledSamples.length; j++) {

    if(state == 0 && j >= this.leftRegionPosition){
      // state 1 before current position
      this.context.stroke();
      this.context.beginPath();
      this.context.strokeStyle = '#ED8C01';
      state = 1;      
    }else if(state == 1 && j > this.currentPosition){
      // after current position
      this.context.stroke();
      this.context.beginPath();
      this.context.strokeStyle = '#F8DEBD';
      state = 2;
    }else if(state == 2 && j > this.rightRegionPosition){
      this.context.stroke();
      this.context.beginPath();
      this.context.strokeStyle = '#808080';
      state = 3;     
    }
    
    this.context.moveTo(j, -1 * this.resampledSamples[j] * this.scaledToHeight/2); //this.canvas.height/2
    this.context.lineTo(j,this.resampledSamples[j] * this.scaledToHeight/2);
 
  }
  
  this.context.stroke();
  this.context.translate(0, -this.canvas.height/2); 
};


WaveformVisualizer.prototype.refresh = function(){
  
  this.draw();
};

WaveformVisualizer.prototype.setWidth = function(width){
  
  this.canvas.width = width;
  this.resample();
  this.scaleToHeight();
  this.refresh();
};

WaveformVisualizer.prototype.setHeight = function(height){
  
  this.canvas.height = height;
  this.resample();
  this.scaleToHeight();
  this.refresh();
};


WaveformVisualizer.prototype.calculateRegion= function(changingPoint){
    var region = {left: this.leftRegionPosition, right: this.rightRegionPosition};
    var offset = changingPoint - (this.canvas.offsetLeft + this.canvas.offsetParent.offsetLeft);
    var center = this.leftRegionPosition + (this.rightRegionPosition - this.leftRegionPosition)/2
    
    if(offset < center){
      
      region.left = offset;
      region.right = this.rightRegionPosition - this.leftRegionPosition;      
    }else{
      
      region.left = this.leftRegionPosition;
      region.right = offset - this.leftRegionPosition;
    }
    
    return region;
};

WaveformVisualizer.prototype.setLeftRegionPosition = function(_leftRegionPosition) {
  this.leftRegionPosition = this.translateOrigToResampled(_leftRegionPosition); 
};

WaveformVisualizer.prototype.setRightRegionPosition = function(_rightRegionPosition) {
  this.rightRegionPosition = this.translateOrigToResampled(_rightRegionPosition);
};


WaveformVisualizer.prototype.setCurrentPosition = function(_currentPosition) {  
  this.currentPosition = this.translateOrigToResampled(_currentPosition);
  if (this.currentPosition < this.leftRegionPosition) {
    this.currentPosition = this.leftRegionPosition;
  }
  if (this.currentPosition > this.rightRegionPosition) {
    this.currentPosition = this.rightRegionPosition;
  }
  
  this.draw();

};

WaveformVisualizer.prototype.load = function() {
  $('#upperLim').parent().css('opacity', '1');
  $('#lowerLim').parent().css('opacity', '1');
  
  $('#div_lower_limit').css('opacity', '1');
  $('#div_upper_limit').css('opacity', '1');  
};


