# webMUSHRA

a MUSHRA compliant web audio API based experiment software.

<img width="1011" alt="screen shot 2017-03-08 at 12 38 20" src="https://cloud.githubusercontent.com/assets/72940/23702580/2a49bc82-03fc-11e7-99ea-22d550604a73.png">

## Introduction

Listening tests are widely used to assess the quality of audio systems. In the last few years, conducting listening experiments over the Internet, as so called web-based experiments, has become popular. Until now, it was only possible to implement a limited number of listening test types as web-based experiments because web standards were missing some crucial features, e.g. sample manipulation of audio streams. MUSHRA tests are designed to compare the audio quality of several test conditions with intermediate impairments to a high quality reference. With the rise of [Web Audio API](http://webaudio.github.io/web-audio-api/), for the first time MUSHRA experiments can be carried out within the web browser while at the same time being compliant to the ITU-R Recommendation BS.1534 (MUSHRA).

## Features

* page based experiments supporting
 * MUSHRA (ITU-R BS.1534)
 * AB (ITU-R BS.1116)
 * training/introduction
* compliant to ITU recommendations (looping, fade-out/in, sample accurate switching)
* finish page to gather the results and send to a provided PHP service
* client side processing using web audio api
* simple configuration using YAML preference files
* automatically generates ITU-R compliant lower anchor files on the fly

## Supported Browsers

 * Google Chrome on Windows, Mac and Linux

## Getting started: Setting up webMUSHRA

To load audio files and save the results as csv text files, webMUSHRA needs to run on a web server. If you already have `php` installed on your system (for example on Mac OS X), you can run a php development server on port 8000 from the terminal using `php -S localhost:8000`. 

Another way to run webMUSHRA would be to install a complete web server stack like [XAMPP](https://www.apachefriends.org/download.html).

Now you can run webMUSHRA using the following URL: http://localhost:8000

The experiment configurations are stored in the `configs/` folder. To load a configuration/experiment, specify the `config` argument in the url http://localhost:8000/?config=mushra_showresults.yaml.


#### Change or add a configuration

webMUSHRA uses [YAML](https://en.wikipedia.org/wiki/YAML) to configure experiments. Since YAML is using whitespace indentation (no tab characters!), we recommend to use a text editor like [Atom](http://atom.io) that supports YAML out of the box.

A simple MUSHRA test in YAML looks like this:

```yaml
pages:
  - type: mushra
    id: Item 1
    name: Orchestra
    content: Add additional notes for the participants
    showWaveform: true
    reference: reference.wav
    createAnchor35: true
    createAnchor70: true
    stimuli:
      C1: codec1.wav
      C2: codec2.wav
      C3: codec3.wav
```

The specific parameters are described in the [Experimenters Manual](doc/experimenter.md).

## Documentation

 * [Experimenters Manual](doc/experimenter.md)
 * [Participants Manual](doc/participant.md)

## Citation
If you want to cite webMUSHRA, please refer to (see References for the link to the paper):

> "Towards the Next Generation of Web-based Experiments: A Case Study Assessing Basic Audio Quality Following the ITU-R Recommendation BS.1534 (MUSHRA)", Michael Schoeffler, Fabian-Robert Stöter, Bernd Edler and Jürgen Herre, 1st Web Audio Conference, 2015, Paris, France.

## References

* [Web Audio Conference 2015 Paper](http://wac.ircam.fr/pdf/wac15_submission_8.pdf)
* [Web Audio Conference 2015 Presentation](http://www.audiolabs-erlangen.de/content/resources/webMUSHRA/slides.html#/)

## Copyright/Licence

(C) Copyright AudioLabs 2017

This source code is protected by copyright law and international treaties. This source code is made available to you subject to the terms and conditions of the Software License for the webMUSHRA.js Software. Said terms and conditions have been made available to you prior to your download of this source code. By downloading this source code you agree to be bound by the above mentionend terms and conditions, which can also be found [here.](LICENSE.txt)
Any unauthorised use of this source code may result in severe civil and criminal penalties, and will be prosecuted to the maximum extent possible under law.

