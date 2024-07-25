/**
 * Sijia Zhao (2020-2021) sijia.zhao@psy.ox.ac.uk
 * Read LICENSE file before using
 */

class HeadphonesCheck {

    /**
     * Stylesheet
     */
    _stylesheet = '@charset "utf-8";' +
        '.no-close .ui-dialog-titlebar-close {' +
        '  display: none;' +
        '}' +
        '#headphones-dialog {' +
        '  text-align: justify;' +
        '}' +
        '#headphones-dialog .center {' +
        '  text-align: center;' +
        '}' +
        '#headphones-dialog table {' +
        '  margin: 2em auto;' +
        '}' +
        '#headphones-dialog table,' +
        '#headphones-dialog table td {' +
        '  border: none;' +
        '  vertical-align: text-top;' +
        '}' +
        '#headphones-dialog td {' +
        '  padding: 0.5em;' +
        '}' +
        '#headphones-dialog .notice {' +
        '  text-align: center;' +
        '  font-weight: bold;' +
        '  margin: 2em 0;' +
        '}' +
        '#headphones-dialog .left {' +
        '  text-align: left !important;' +
        '}' +
        '#headphones-dialog hr {' +
        '  border: none;' +
        '  border-top: 1px solid #ddd;' +
        '  margin: 1em auto;' +
        '}' +
        'button[data-helper-button] {' +
        '  width: 60px;' +
        '  height: 60px;' +
        '  border: 1px solid #c5c5c5;' +
        '  border-radius: 10px;' +
        '  background-color: #f6f6f6;' +
        '  margin: 0.5em;' +
        '  padding: 15px 0;' +
        '  text-align: center;' +
        '  cursor: pointer;' +
        '  color: #000;' +
        '}' +
        'button[data-headphones-audio-control] {' +
        '  border: 1px solid #03a9f4;' +
        '}' +
        'button[data-headphones-check-next] {' +
        '  width: auto;' +
        '  padding: 1em;' +
        '}' +
        '#headphones-dialog [data-headphones-check-target] {' +
        '  height: 10em;' +
        '}' +
        '#headphones-dialog table {' +
        '  margin-bottom: 3em;' +
        '}' +
        '#headphones-dialog td {' +
        '  width: 16em;' +
        '}' +
        '#headphones-dialog td span {' +
        '  font-weight: normal;' +
        '  display: block;' +
        '  margin-bottom: 1em;' +
        '}' +
        '#headphones-dialog td span.disabled {' +
        '  color: #c5c5c5;' +
        '}' +
        '#headphones-dialog [data-headphones-progress] {' +
        '  position: relative;' +
        '}' +
        '#headphones-dialog [data-headphones-progress] span {' +
        '  display: block;' +
        '  width: 100%;' +
        '  padding: 0.5em;' +
        '  position: absolute;' +
        '  text-align: center;' +
        '}' +
        'button[data-helper-button]:hover {' +
        '  background-color: #f0f0f0;' +
        '}' +
        'button[data-helper-button]:active {' +
        '  background-color: #eaeaea;' +
        '  border-width: 2px;' +
        '}' +
        'button[data-helper-button][disabled],' +
        'button[data-helper-button][disabled]:hover,' +
        'button[data-helper-button][disabled]:active {' +
        '  background-color: #f6f6f6;' +
        '  border: 1px solid #c5c5c5;' +
        '  width: auto;' +
        '  padding: 1em;' +
        '  cursor: initial;' +
        '  color: #c5c5c5;' +
        '}' +
        'button[data-headphones-check-response][disabled],' +
        'button[data-headphones-check-response][disabled]:hover,' +
        'button[data-headphones-check-response][disabled]:active {' +
        '  width: 60px;' +
        '}' +
        'button[data-helper-button=\'selected\'] {' +
        '  border-color: #32CD32;' +
        '  background-color: #bbf8bb;' +
        '  font-weight: bold;' +
        '}' +
        'button[data-helper-button=\'selected\']:hover {' +
        '  background-color: #b5f2b5;' +
        '}' +
        'button[data-helper-button=\'selected\']:active {' +
        '  background-color: #afecaf;' +
        '  border-width: 2px;' +
        '}' +
        'button[data-helper-button][disabled] img {' +
        '  display: none;' +
        '}' +
        'button[data-helper-button] img {' +
        '  height: 30px;' +
        '}';

    /**
     * Constructor
     *
     * @constructor
     * @param {object} [settings={}] - settings for the Headphones Check
     * @param {Function} [settings.callback] - optional callback function on completion
     * @param {string} [settings.volumeSound] - sound for volume adjustment
     * @param {string} [settings.volumeText] - override text shown on volume adjustment page
     * @param {string} [settings.checkType=huggins] - headphones check paradigm,`huggins` or `antiphase`, or `beat`
     * @param {int} [settings.checkVolume=1] - volume setting for check sounds, from `0` (quietest) to `1` (loudest)
     * @param {string} [settings.checkExample] - example check sound (`huggins` and `beat` checkType only)
     * @param {object[]} [settings.checkSounds] - sounds for headphones check. `object` format: `{answer: int, file: string}`
     * @param {int} [settings.trialCount=6] - number of headphones check trials
     * @param {int} [settings.passMark=6] - number of correct trials to pass the check
     * @param {int} [settings.maxAttempts=2] - max number of attempts
     */
    constructor(settings = {}) {
      this._settings = {
        callback: undefined,
        volumeSound: 'stimuli_HugginsPitch/HugginsPitch_calibration.flac',
        volumeText: '<p class="notice">Please put on your headphones.</p>' +
            '<p>If you do not have headphones, you can use earbuds (headphones are preferred).</p>' +
            '<p>Click the <span style="color:#03a9f4;"><b>blue</b></span> button below to play a sound to check your volume.</p>',
        checkType: 'huggins',
        checkVolume: 1,
        checkExample: 'stimuli_HugginsPitch/HugginsPitch_example_2.flac',
        checkSounds: [
          {answer: 1, file: 'stimuli_HugginsPitch/HugginsPitch_set1_1.flac'},
          {answer: 2, file: 'stimuli_HugginsPitch/HugginsPitch_set1_2.flac'},
          {answer: 3, file: 'stimuli_HugginsPitch/HugginsPitch_set1_3.flac'},
          {answer: 1, file: 'stimuli_HugginsPitch/HugginsPitch_set2_1.flac'},
          {answer: 2, file: 'stimuli_HugginsPitch/HugginsPitch_set2_2.flac'},
          {answer: 3, file: 'stimuli_HugginsPitch/HugginsPitch_set2_3.flac'},
          {answer: 1, file: 'stimuli_HugginsPitch/HugginsPitch_set3_1.flac'},
          {answer: 2, file: 'stimuli_HugginsPitch/HugginsPitch_set3_2.flac'},
          {answer: 3, file: 'stimuli_HugginsPitch/HugginsPitch_set3_3.flac'},
          {answer: 1, file: 'stimuli_HugginsPitch/HugginsPitch_set4_1.flac'},
          {answer: 2, file: 'stimuli_HugginsPitch/HugginsPitch_set4_2.flac'},
          {answer: 3, file: 'stimuli_HugginsPitch/HugginsPitch_set4_3.flac'},
          {answer: 1, file: 'stimuli_HugginsPitch/HugginsPitch_set5_1.flac'},
          {answer: 2, file: 'stimuli_HugginsPitch/HugginsPitch_set5_2.flac'},
          {answer: 3, file: 'stimuli_HugginsPitch/HugginsPitch_set5_3.flac'},
          {answer: 1, file: 'stimuli_HugginsPitch/HugginsPitch_set6_1.flac'},
          {answer: 2, file: 'stimuli_HugginsPitch/HugginsPitch_set6_2.flac'},
          {answer: 3, file: 'stimuli_HugginsPitch/HugginsPitch_set6_3.flac'},
        ],
        trialCount: 6,
        passMark: 6,
        maxAttempts: 2,
      };
      this.htmlElements = {
        huggins: {
          instruction: '<p class="notice">Now we will check your headphones.</p>' +
              '<p>We need to make sure that your headphones are adjusted and are functioning correctly.</p>' +
              '<p>On the next few pages, each page will have a button that plays a sound. You can only play each sound once, so don\'t press the button until you are ready.</p>' +
              '<p>Each sound contains three noises with silent gaps in-between. One of the noises has a faint beep hidden within.</p>' +
              '<p>Your task is to decide which of the three noises contains the beep, and click on the correct button: <b>1</b>, <b>2</b>, or <b>3</b>.</p>' +
              '<p>Click the <span style="color:#03a9f4;"><b>blue</b></span> button below to play an example. The beep is hidden inside the second noise, so the answer is <b>2</b>.' +
              '    You can play the example as many times as you like.</p>' +
              '<div class="notice"><button type="button" data-helper-button data-headphones-audio-control data-headphones-audio-group="group1" disabled>Loading sounds...</button></div>' +
              '<span data-headphones-check-target></span>',
          checkPage: '<p class="notice">Remember, you can only play each sound once. Please listen carefully.</p>' +
              '<p class="center">Which noise contains the hidden beep? Is it <b>1</b>, <b>2</b>, or <b>3</b>?</p>',
        },
        beat: {
          instruction: '<p class="notice">Now we will check your headphones.</p>' +
              '<p>We need to make sure that your headphones are adjusted and are functioning correctly.</p>' +
              '<p>On the next few pages, each page will have a button that plays a sound. You can only play each sound once, so don\'t press the button until you are ready.</p>' +
              '<p>Each sound contains three noises with silent gaps in-between.</p>' +
              '<p>Your task is to decide which of the three noises was smoothest, and click on the correct button: <b>1</b>, <b>2</b>, or <b>3</b>.</p>' +
              '<p>Click the <span style="color:#03a9f4;"><b>blue</b></span> button below to play an example. The smoothest tone is the second noise, so the answer is <b>2</b>.' +
              '    You can play the example as many times as you like.</p>' +
              '<div class="notice"><button type="button" data-helper-button data-headphones-audio-control data-headphones-audio-group="group1" disabled>Loading sounds...</button></div>' +
              '<span data-headphones-check-target></span>',
          checkPage: '<p class="notice">Remember, you can only play each sound once. Please listen carefully.</p>' +
              '<p class="center">Which noise is the smoothest? Is it <b>1</b>, <b>2</b>, or <b>3</b>?</p>',
        },
        antiphase: {
          instruction: '<p class="notice">Now we will check your headphones.</p>' +
              '<p>We need to make sure that your headphones are adjusted and are functioning correctly.</p>' +
              '<p>On the next few pages, each page will have a button that plays a sound. You can only play each sound once, so don\'t press the button until you are ready.</p>' +
              '<p>Each sound contains three noises with silent gaps in-between.</p>' +
              '<p>Your task is to decide which of the three noises was quietest or softest, and click on the correct button: <b>1</b>, <b>2</b>, or <b>3</b>.</p>',
          checkPage: '<p class="notice">Remember, you can only play each sound once. Please listen carefully.</p>' +
              '<p class="center">Which noise is the quietest or softest? Is it <b>1</b>, <b>2</b>, or <b>3</b>?</p>',
        },
        reattempt: '<p class="notice">Unfortunately, you did not pass the headphones check.</p>' +
            '<p>Please make sure that you are in a quiet room, and that you are wearing your headphones correctly.</p>' +
            '<p>You may also try using a different pair of headphones. It is possible that the sound quality of the headphones was not good enough.</p>' +
            '<p class="notice">If you are sure that your headphones are working properly, you can try the headphones check again.</p>',
        audioProblem: '<p>Your browser cannot play the audio files used in this study.<br>This study will not work.</p>' +
            '<p>Please try again using a different web browser (Firefox and Chrome are recommended), and update your web browser to its newest version.</p>',
      };
      if (settings) {
        this._settings = Object.assign(this._settings, settings);
        this.callback = (typeof this._settings.callback === 'function') ? this._settings.callback : function() {};
        if (this._settings.checkVolume > 1) {
          this._settings.checkVolume = 1;
        } else {
          if (this._settings.checkVolume < 0) {
            this._settings.checkVolume = 0;
          }
        }
        if (settings.checkType) {
          switch (settings.checkType.toLowerCase()) {
            case 'antiphase':
              this._settings.checkType = 'antiphase';
              break;
            case 'beat':
              this._settings.checkType = 'beat';
              break;
            case 'huggins':
            default:
              this._settings.checkType = 'huggins';
          }
        }
        if (this._settings.passMark > this._settings.trialCount) {
          this._settings.passMark = this._settings.trialCount;
        }
      }
      this.isHeadphones = undefined;
      this.attemptCount = 0;
      this.attemptRecord = {};
      const stylesheet = document.createElement('style');
      stylesheet.innerText = this._stylesheet;
      document.head.appendChild(stylesheet);
    }

    /**
     * Perform a volume check
     *
     * @member HeadphonesCheck.checkVolume
     * @param {Function} [callback] - (if set) callback on completion
     * @returns {Promise} resolved on completion
     */
    checkVolume(callback) {
      if (typeof callback === 'function') {
        this.callback = callback;
      }
      let resolveCall;
      this._promise = new Promise(resolve => resolveCall = resolve);
      this._promise.resolve = resolveCall;
      this._adjustVolume().then(() => {
        this._promise.resolve();
        this.callback();
      });
      return this._promise;
    }

    /**
     * Perform a headphones check (including a volume check)
     *
     * @member HeadphonesCheck.checkHeadphones
     * @param {Function} [callback] - (if set) callback on completion, with the result as argument: `true` or `false`
     * @param {boolean} [checkVolume=true] - whether to perform a volume check before the headphones check
     * @param {boolean} [repeat] - indicates if user has returned to the checkVolume page, so enable the "I have finished..." button
     * @returns {Promise} fulfilled with the result of the headphones check (pass: resolve, fail: reject)
     */
    checkHeadphones(callback, checkVolume = true, repeat) {
      if (typeof callback === 'function') {
        this.callback = callback;
      }
      this._checkVolume = checkVolume;
      if (this._checkVolume) {
        const promise = this._adjustVolume();
        if (repeat) {
          $('button:contains("finished")').button('option', 'disabled', false);
        }
        promise.then(() => {
          this._instruction();
        });
      } else {
        this._instruction();
      }
      if (!this._promise || this._promise.fulfilled === true) {
        let resolveCall, rejectCall;
        this._promise = new Promise((resolve, reject) => {
          resolveCall = resolve;
          rejectCall = reject;
        });
        this._promise.resolve = resolveCall;
        this._promise.reject = rejectCall;
      }
      return this._promise;
    }

    /**
     * Volume adjustment page
     * @private
     * @member HeadphonesCheck._adjustVolume
     * @return {Promise}
     */
    _adjustVolume() {
      const html = this._settings.volumeText +
          '<div class="notice">' +
          '<button type="button" data-helper-button data-headphones-audio-control data-headphones-audio-group="group1" disabled>Loading sounds...</button>' +
          '<audio data-headphones-audio-group="group1" data-headphones-volume="1" preload="auto" loop><source src="' + this._settings.volumeSound + '">' + this.htmlElements.audioProblem + '</audio>' +
          '</div>' +
          '<p>If you do not adjust your volume correctly, you will not be able to successfully complete the study, and the study may stop before completion.</p>';
      const promise = this._createDialog({content: html, title: 'Adjust your sound volume', yes: 'I have finished adjusting my sound volume'});
      this._createPlayer('button:contains("finished")');
      return promise;
    }

    /**
     * Instructions page
     * @private
     * @member HeadphonesCheck._instruction
     */
    _instruction() {
      let html = this.htmlElements[this._settings.checkType].instruction +
          '<p class="notice">Remember, from now on, you can only play each sound once.<br>Please listen carefully and choose your answer.</p>' +
          '<p class="notice">Are you ready?</p>';
      const promise = this._createDialog({content: html, title: 'Headphones check', yes: 'I am ready to begin', back: 'Back'});
      if (this._settings.checkType === 'huggins' || this._settings.checkType === 'beat') {
        $('span[data-headphones-check-target]').html(
            '<audio data-headphones-audio-group="group1" data-headphones-volume="' + this._settings.checkVolume + '" preload="auto"><source src="' + this._settings.checkExample + '">' + this.htmlElements.audioProblem + '</audio>',
        );
        this._createPlayer('button:contains("ready")');
      }
      promise.then(
          () => {
            this._performCheck();
          },
          () => {
            void this.checkHeadphones(undefined, this._checkVolume, true);
          },
      );
    }

    /**
     * Offer another attempt, if allowed by settings
     * @private
     * @member HeadphonesCheck._offerReattempt
     */
    _offerReattempt() {
      let html = this.htmlElements.reattempt;
      if (+this.attemptCount === this._settings.maxAttempts - 1) {
        html += '<p class="notice">If you do not pass on your next attempt, the study cannot continue.</p>';
      }
      this._createDialog({content: html, title: 'Headphones check failed', yes: 'Try again', color: '#FFA500'})
          .then(() => {
            this._instruction();
          });
    }

    /**
     * Perform the headphones check
     * @private
     * @member HeadphonesCheck._performCheck
     */
    _performCheck() {
      let html = this.htmlElements[this._settings.checkType].checkPage +
          '<div class="center" data-headphones-check-target></div>' +
          '<hr><div data-headphones-progress><span></span></div>';
      const promise = this._createDialog({content: html, title: 'Headphones check', yes: 'Continue'});
      $('button:contains("Continue")')
          .button('option', 'disabled', true)
          .css('visibility', 'hidden');
      this._trialHandler(this._settings.trialCount);
      promise.then(() => {
        if (this.isHeadphones) {
          this._promise.resolve();
          this._promise.fulfilled = true;
          this.callback(true);
        } else {
          if (this.attemptCount < this._settings.maxAttempts) {
            this._offerReattempt();
          } else {
            this._promise.reject();
            this._promise.fulfilled = true;
            this.callback(false);
          }
        }
      });
    }

    /**
     * Display individual headphones check trials
     * @private
     * @member HeadphonesCheck._trialHandler
     * @param {int} remaining
     * @param {int} current
     */
    _trialHandler(remaining, current = 0) {
      $('[data-headphones-check-target]').empty();
      if (!current) {
        current = 1;
        this.attemptCount++;
        this._currentRecord = {};
        this._currentRecord.trials = [];
        this._currentRecord.numberCorrect = 0;
        this._stimuli = this._shuffle([...this._settings.checkSounds]);
        this._stimuli.index = 0;
      }
      if (remaining <= 0) {
        this._currentRecord.isHeadphones = (this._currentRecord.numberCorrect >= this._settings.passMark);
        this.isHeadphones = this._currentRecord.isHeadphones;
        this.attemptRecord[this.attemptCount] = this._currentRecord;
        $('button:contains("Continue")')
            .button('option', 'disabled', false)
            .css('visibility', 'visible')
            .trigger('click');
        return;
      }
      $('#headphones-dialog').dialog('option', 'title', 'Headphones check (' + current + ' of ' + this._settings.trialCount + ')');
      $('[data-headphones-progress]')
          .progressbar({max: this._settings.trialCount, value: current})
          .children('span').html('Progress: ' + current + '/' + this._settings.trialCount);
      if (current > this._stimuli.length) {
        this._shuffle(this._stimuli);
        this._stimuli.index = 0;
      }
      const trialData = this._stimuli[this._stimuli.index++];
      this._createTrial(trialData.file)
          .then((response) => {
            if (+response === trialData.answer) {
              this._currentRecord.numberCorrect++;
            }
            this._currentRecord.trials.push({
              answer: trialData.answer,
              file: trialData.file,
              response: response,
              correct: +response === trialData.answer,
            });
            this._trialHandler(--remaining, ++current);
          });
    }

    /**
     * Creates individual headphones check trials
     * @private
     * @member HeadphonesCheck._createTrial
     * @param {string} soundFile
     * @return {Promise}
     */
    _createTrial(soundFile) {
      let html = '<table><tr>' +
          '<td>' +
          '<span data-headphones-check-stage="1">Listen to the sound</span>' +
          '<button type="button" data-helper-button data-headphones-audio-control data-headphones-audio-group="group1" disabled>Loading sound...</button>' +
          '</td>' +
          '<td>' +
          '<span class="disabled" data-headphones-check-stage="2">choose your answer</span>' +
          '<button type="button" data-headphones-check-response="1" data-helper-button disabled>1</button>' +
          '<button type="button" data-headphones-check-response="2" data-helper-button disabled>2</button>' +
          '<button type="button" data-headphones-check-response="3" data-helper-button disabled>3</button>' +
          '</td>' +
          '<td>' +
          '<span class="disabled" data-headphones-check-stage="3">and continue to the next sound</span>' +
          '<button type="button" data-helper-button data-headphones-check-next disabled>Confirm and continue</button>' +
          '</td>' +
          '</tr></table>' +
          '<audio data-headphones-audio-group="group1" data-headphones-volume="' + this._settings.checkVolume + '" preload="auto"><source src="' + soundFile + '">' + this.htmlElements.audioProblem + '</audio>';
      $('[data-headphones-check-target]').html(html);
      const audioSelector = $('audio[data-headphones-audio-group]');
      let audioCount = audioSelector.length;
      return new Promise((resolve) => {
        audioSelector.on('canplaythrough', () => {
          if (--audioCount <= 0) {
            $('button[data-headphones-audio-control]')
                .html('<img alt="Play" src="data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 31.7 31.9\'%3E%3Cpath d=\'M8.6,0.5C6.8-0.6,5.2,0.2,5.2,2.4v27c0,2.2,1.5,3.1,3.4,1.9L30.3,18c1.9-1.2,1.9-3,0-4.2L8.6,0.5z\' fill=\'%2303A9F4\'/%3E%3C/svg%3E">')
                .prop('disabled', false)
                .on('click', function() {
                  $(this)
                      .prop('disabled', true)
                      .html('Playing...');
                  const audioElements = $('audio[data-headphones-audio-group=' + this.dataset.headphonesAudioGroup + ']');
                  audioElements.on('ended', () => {
                    $('button[data-headphones-audio-control]').html('Already played');
                    $('span[data-headphones-check-stage]').addClass('disabled');
                    $('span[data-headphones-check-stage="2"]').removeClass('disabled');
                    $('button[data-headphones-check-response]')
                        .prop('disabled', false)
                        .on('click', function() {
                          $('span[data-headphones-check-stage="3"]').removeClass('disabled');
                          $('button[data-headphones-check-response]').attr('data-helper-button', '');
                          $(this).attr('data-helper-button', 'selected');
                          $('button:contains("continue")')
                              .prop('disabled', false)
                              .on('click', () => {
                                resolve(
                                    $('button[data-headphones-check-response][data-helper-button="selected"]')
                                        .attr('data-headphones-check-response'),
                                );
                              });
                        });
                  });
                  for (const audio of audioElements) {
                    audio.volume = audio.dataset.headphonesVolume;
                    audio.play();
                  }
                });
          }
        });
      });
    }

    /**
     * Create audio player and disable `selector` button until played
     * @private
     * @member HeadphonesCheck._createPlayer
     * @param {string} selector
     */
    _createPlayer(selector) {
      if (selector) {
        $(selector).button('option', 'disabled', true);
      }
      const audioSelector = $('audio[data-headphones-audio-group]');
      let audioCount = audioSelector.length;
      audioSelector
          .on('canplaythrough', function() {
            $(this).off('canplaythrough');
            if (--audioCount <= 0) {
              $('button[data-headphones-audio-control]')
                  .html('<img alt="Play" src="data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 31.7 31.9\'%3E%3Cpath d=\'M8.6,0.5C6.8-0.6,5.2,0.2,5.2,2.4v27c0,2.2,1.5,3.1,3.4,1.9L30.3,18c1.9-1.2,1.9-3,0-4.2L8.6,0.5z\' fill=\'%2303A9F4\'/%3E%3C/svg%3E">')
                  .prop('disabled', false)
                  .on('click', function() {
                    const audioElements = $('audio[data-headphones-audio-group=' + this.dataset.headphonesAudioGroup + ']');
                    for (const audio of audioElements) {
                      audio.volume = audio.dataset.headphonesVolume;
                      if (audio.paused || audio.ended) {
                        audio.play();
                        $(this).css('border-color', '#f0f')
                            .children('img').attr('src', 'data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 17.7 31.9\'%3E%3Crect width=\'6.2\' height=\'31.9\' rx=\'3.1\' ry=\'3.1\' fill=\'%23f0f\'/%3E%3Crect x=\'11.4\' width=\'6.2\' height=\'31.9\' rx=\'3.1\' ry=\'3.1\' fill=\'%23f0f\'/%3E%3C/svg%3E').attr('alt', 'Pause');
                        if (selector) {
                          $(selector).button('option', 'disabled', false);
                        }
                      } else {
                        audio.pause();
                        $(this).css('border-color', '#03a9f4')
                            .children('img').attr('src', 'data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 31.7 31.9\'%3E%3Cpath d=\'M8.6,0.5C6.8-0.6,5.2,0.2,5.2,2.4v27c0,2.2,1.5,3.1,3.4,1.9L30.3,18c1.9-1.2,1.9-3,0-4.2L8.6,0.5z\' fill=\'%2303A9F4\'/%3E%3C/svg%3E').attr('alt', 'Play');
                      }
                    }
                  });
            }
          })
          .on('ended', () => {
            $('button[data-headphones-audio-control]')
                .css('border-color', '#03a9f4')
                .children('img').attr('src', 'data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 31.7 31.9\'%3E%3Cpath d=\'M8.6,0.5C6.8-0.6,5.2,0.2,5.2,2.4v27c0,2.2,1.5,3.1,3.4,1.9L30.3,18c1.9-1.2,1.9-3,0-4.2L8.6,0.5z\' fill=\'%2303A9F4\'/%3E%3C/svg%3E').attr('alt', 'Play');
          });
    }

    /**
     * Shuffle an array
     * @private
     * @member HeadphonesCheck._shuffle
     * @param {[]} [array=[]]
     * @returns {[]}
     */
    _shuffle(array = []) {
      for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
      }
      return array;
    }

    /**
     * Create a dialog with a `Promise` resolved/rejected by buttons, using JQueryUI
     * @private
     * @member HeadphonesCheck._createDialog
     * @param {{}} options
     * @param {string} [options.content=''] - dialog content
     * @param {string} [options.title='Headphones check'] - dialog title
     * @param {string} [options.color='#32CD32'] - title bar color
     * @param {string|undefined} [options.back=undefined] - 'Back' button text, or `undefined` for no button
     * @param {string|undefined} [options.yes=undefined] - 'Yes' button text, or `undefined` for no button
     * @return {Promise} Promise - `resolve()` by 'Yes' button, `reject('back')` by 'Back' button
     */
    _createDialog(options = {}) {
      const defaults = {
        content: '',
        title: 'Headphones check',
        color: '#32CD32',
      };
      options = Object.assign(defaults, options);
      return new Promise((resolve, reject) => {
        function resizeToFit() {
          dialog
              .dialog('option', 'height', 'auto')
              .dialog('option', 'position', {my: 'center', at: 'center', of: window});
          const maxHeight = document.documentElement.clientHeight - 40;
          if (dialog.outerHeight(true) > maxHeight) {
            dialog.dialog('option', 'height', maxHeight);
          }
        }

        $('body').append('<div id="headphones-dialog" title="' + options.title + '">' + options.content + '</div>');
        const dialog = $('#headphones-dialog');
        const dialogOptions = {
          width: 1000,
          height: 'auto',
          classes: {'ui-dialog': 'no-close'},
          modal: true,
          resizable: false,
          draggable: false,
          closeOnEscape: false,
          buttons: [],
          open: resizeToFit,
          close: function() {
            $(window).off('resize', resizeToFit);
            $(this).dialog('destroy').remove();
          },
        };
        if (options.back) {
          dialogOptions.buttons.push({
            text: options.back,
            click() {
              $(this).dialog('close');
              reject('back');
            },
          });
        }
        if (options.yes) {
          dialogOptions.buttons.push({
            text: options.yes,
            click() {
              $(this).dialog('close');
              resolve(true);
            },
          });
        }
        dialog
            .dialog(dialogOptions)
            .prev('.ui-dialog-titlebar')
            .css('background', options.color);
        $(window).on('resize', resizeToFit);
      });
    }
  }

  window.HeadphonesCheck = HeadphonesCheck;