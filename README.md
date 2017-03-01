# webMUSHRA.js

a MUSHRA compliant web audio API based experiment software.

## Introduction

Listening tests are widely used to assess the quality of audio systems. In the last few years, conducting listening experiments over the Internet, as so called web-based experiments, has become popular. Until now, it was only possible to implement a limited number of listening test types as web-based experiments because web standards were missing some crucial features, e.g. sample manipulation of audio streams. MUSHRA tests are designed to compare the audio quality of several test conditions with intermediate impairments to a high quality reference. With the upcoming of the (http://webaudio.github.io/web-audio-api/ Web Audio API), for the first time MUSHRA experiments can be carried out within the web browser while at the same time being compliant to the ITU-R Recommendation BS.1534 (MUSHRA).

## Features

 * page based design with support for
 * compliant to ITU recommendations (looping, fade-out/in, sample accurate switching)
 * client side processing using web audio api
 * page based experiments supporting
  * MUSHRA (ITU-R BS.1534)
  * AB (ITU-R BS.1116)
  * training/introduction
  * finish page to gather the results
 * simple configuration using YAML preference files
 * automatically generates ITU-R compliant lower anchor files on the fly

## Supported Browsers

 * Google Chrome on Windows, Mac and Linux

## Getting started

### For Experimenters

To load the audio files and save the results webMUSHRA needs to run on webserver.
A simple mushra test in YAML looks like this:

```yaml
pages:
  - type: mushra
    id: Item 1
    name: Orchestra
    content: Try to concentrate on the violins!
    showWaveform: true
    reference: reference.wav
    createAnchor35: true
    createAnchor70: true
    stimuli:
      C1: codec1.wav
      C2: codec2.wav
      C3: codec3.wav
```

## User Guide

 * [Experimenters Manual](doc/experimenter.md)
 * [Participants Manual](doc/participant.md)

## Copyright/Licence

(C) Copyright AudioLabs 2015

This source code is protected by copyright law and international treaties. This source code is made available to you subject to the terms and conditions of the Software License for the webMUSHRA.js Software. Said terms and conditions have been made available to you prior to your download of this source code. By downloading this source code you agree to be bound by the above mentionend terms and conditions, which can also be found [here.](LICENSE.txt)
Any unauthorised use of this source code may result in severe civil and criminal penalties, and will be prosecuted to the maximum extent possible under law.

## Citation
If you want to cite webMUSHRA, please refer to (see References for the link to the paper):
"Towards the Next Generation of Web-based Experiments: A Case Study Assessing Basic Audio Quality Following the ITU-R Recommendation BS.1534 (MUSHRA)", Michael Schoeffler, Fabian-Robert Stöter, Bernd Edler and Jürgen Herre, 1st Web Audio Conference, 2015, Paris, France.

## References

* [Web Audio Conference 2015 Paper](http://wac.ircam.fr/pdf/wac15_submission_8.pdf)
* [Web Audio Conference 2015 Presentation](http://www.audiolabs-erlangen.de/content/resources/webMUSHRA/slides.html#/)