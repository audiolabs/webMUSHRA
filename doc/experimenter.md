# Documentation for Experimenters

## Configuring an Experiment

### General

An experiment is configured by config files written in YAML. 
The config files must be placed in the subfolder "/configs". 
When the webMUSHRA page (e.g. http://localhost/webMUSHRA) is accessed, default.yaml is loaded. 
In case another config file should be loaded, a parameter "config" must be added to the url. 
E.g. http://localhost/webMUSHRA?config=example.yaml loads the config stored in "/configs/example.yaml". 
Filepaths in the config files are always relative to the root folder "/".

### Configuration

At the top level of the config file, general options of the experiment are stored.

* **testname** Name of your listening test as it is shown to the participants. 
* **testId** Identifier of your listening test which is also stored into the result files.
* **bufferSize** The buffer size that is used for the audio processing. The smaller the buffer size, the smaller is the latency. However, small buffer sizes increase the computational load which can lead to audible artifacts. The buffer size must be one of the following values: 256, 512, 1024, 2048, 4096, 8192 or 16384.
* **stopOnErrors** If set to true, the experiment will stop on any errors (e.g. if samples sizes do not match). Please watch the console log especially when unexpected behaviour occurs.
* **showButtonPreviousPage** If set to true, the participant can navigate to previous pages.
* **remoteService** A service/URL to which the results (JSON object) are sent. A PHP web service ("service/write.php") is available which writes the results into the "/results" folder. 
* **pages** An array of experiment pages, random keyword or an pages array ([Array]). 

#### `random`

If the string "random" is the first element of an pages array, the content of the array is randomized (e.g. used for randomized experiments).

#### `generic` page

A generic page contains any content in HTML (e.g. useful for showing the instructions to the participants).

* **type** must be generic.
* **id** Identifier of the page.
* **name** Name of the page (is shown as title)
* **content** Content (HTML) of the page.

#### `consent` page

A generic page with a consent checkbox.

* **type** must be consent.
* **id** Identifier of the page.
* **name** Name of the page (is shown as title)
* **mustConsent** If set to true, the participant must give consent to continue.
* **content** Content (HTML) of the page.

#### `volume` page

The volume page can be used to set the volume used in the experiment.

* **type** must be volume.
* **id** Identifier of the page.
* **name** Name of the page (is shown as title)
* **content** Content (HTML) of the page.
* **stimulus** Filepath to the stimulus that is used for setting the volume.
* **defaultVolume** Default volume (must be between 0.0 and 1.0).

#### `mushra` page

A mushra page shows a trial according to ITU-R Recommendation BS.1534.

* **type** must be mushra.
* **id** Identifier of the page.
* **name** Name of the page (is shown as title)
* **content** Content (HTML) of the page. The content is shown on the upper part of the page.
* **showWaveform** If set to true, the waveform of the reference is shown. 
* **enableLooping** If set to true, the participant can set loops.
* **strict** If set to false, webMUSHRA will not check for a recommendation-compliant listening test.
* **reference** Filepath to the reference stimulus (WAV file).
* **createAnchor35** If set to true, the 3.5 kHZ anchor is automatically generated (Increase loading time of the experiment).
* **createAnchor70** If set to true, the 7 kHZ anchor is automatically generated (Increase loading time of the experiment).
* **randomize** If set to true, the conditions are randomized.
* **showConditionNames** If set to true, the names of the conditions are shown.
* **stimuli** A map of stimuli representing three conditions. The key is the name of the condition. The value is the filepath to the stimulus (WAV file).  
* **switchBack** If set to true, the time position is set back to the beginning (sample 0) when switching between test conditions and/or the reference. By default, this option is false.

#### `bs1116` page          

A bs1116 page shows a trial according to ITU-R Recommendation BS.1116.

* **type** must be bs1116.
* **id** Identifier of the page.
* **name** Name of the page (is shown as title)
* **content** Content (HTML) of the page. The content is shown on the upper part of the page.
* **showWaveform** If set to true, the waveform of the reference is shown. 
* **enableLooping** If set to true, the participant can set loops.
* **reference** Filepath to the reference stimulus (WAV file).
* **createAnchor35** If set to true, the 3.5 kHZ anchor is automatically generated (Increase loading time of the experiment).
* **createAnchor70** If set to true, the 7 kHZ anchor is automatically generated (Increase loading time of the experiment).
* **stimuli** A map of stimuli representing three conditions. The key is the name of the condition. The value is the filepath to the stimulus (WAV file).  

#### `paired_comparison` page

A paired comparison page creates a forced or unforced paired comparison (AB/ABX/ABN tests).

* **type** must be paired_comparison.
* **id** Identifier of the page.
* **name** Name of the page (is shown as title)
* **unforced** If this option is not set, a forced paired comparison is created. If the option is set to some string, the string is used as a label of the "unforced alternative" 
* **content** Content (HTML) of the page. The content is shown on the upper part of the page.
* **showWaveform** If set to true, the waveform of the reference is shown. 
* **enableLooping** If set to true, the participant can set loops.
* **reference** Filepath to the reference stimulus (WAV file).
* **stimuli** A map of stimuli representing three conditions. The key is the name of the condition. The value is the filepath to the stimulus (WAV file).  

#### `likert_multi_stimulus` page

A likert multi stimulus page creates a multi-stimulus likert rating.

* **type** must be likert_multi_stimulus.
* **id** Identifier of the page.
* **name** Name of the page (is shown as title)
* **content** Content (HTML) of the page. The content is shown on the upper part of the page.
* **mustRate** If set to true, the participant must rate all stimuli.
* **mustPlayback** If set to `ended`, the participant must fully play back all stimuli to the end. If set to `processUpdate`, the participant must start playing back all stimuli before rating becomes possible.
* **stimuli** A map of stimuli which will all be presented on the same page. The key is the name of the condition. The value is the filepath to the stimulus (WAV file).
* **response** A array which represents the Likert scale, where each array element represents a 'likert point'. The array elements are maps with the keys 'value' (value shown in results), 'label' (label of the likert point), 'img' (path to an image of the likert point), 'imgSelected' (image shown if likert point is selected), and 'imgHigherResponseSelected' (image shown when a 'higher' likert point is selected).  

#### `likert_single_stimulus` page

A likert single stimulus page creates a single-stimulus likert rating.

* **type** must be likert_single_stimulus.
* **id** Identifier of the page.
* **name** Name of the page (is shown as title)
* **content** Content (HTML) of the page. The content is shown on the upper part of the page.
* **showWaveform** If set to true, the waveform of the stimulus is shown. 
* **mustRate** If set to true, the participant must rate all stimuli.
* **mustPlayback** If set to `ended`, the participant must fully play back the stimulus to the end. If set to `processUpdate`, the participant must start it before rating becomes possible.
* **stimuli** A map of stimuli, each of which will be presented on a separate page. The key is the name of the condition. The value is the filepath to the stimulus (WAV file).
* **maxStimuli** An upper limit on the amount of stimuli presented to the user.
* **response** An array which represents the Likert scale, where each array element represents a 'likert point'. The array elements are maps with the keys 'value' (value shown in results), 'label' (label of the likert point), 'img' (path to an image of the likert point), 'imgSelected' (image shown if likert point is selected), and 'imgHigherResponseSelected' (image shown when a 'higher' likert point is selected).  

#### `finish` page

The finish page must be the last page of the experiment.

* **type** must be finish.
* **name** Name of the page (is shown as title).
* **content** Content (HTML) of the page. The content is shown on the upper part of the page.
* **showResults** The results are shown to the participant.  
* **writeResults** The results are sent to the remote service (which writes the results into a file).


## Results

The results are stored in the folder "/results". 
For each experiment, a subfolder is created having the name of the **testid** option. 
For each type of listening test, a CSV (comma separated values) file is created what contains the results.
