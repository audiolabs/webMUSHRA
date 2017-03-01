// vertical slider extension
// add data-vertical="true" to the input to enable verticality
// data-height lets you set height in px
$.widget("mobile.slider", $.mobile.slider, {
    options: {
        vertical: false,
        height: 250
    },

    _create: function() {
        if (this.options.vertical) {
            // TODO: Each of these should have comments explain what they're for
            var self = this,
                control = this.element,
                trackTheme = this.options.trackTheme || $.mobile.getAttribute( control[ 0 ], "theme" ),
                trackThemeClass = trackTheme ? " ui-bar-" + trackTheme : " ui-bar-inherit",
                cornerClass = ( this.options.corners || control.jqmData( "corners" ) ) ? " ui-corner-all" : "",
                miniClass = ( this.options.mini || control.jqmData( "mini" ) ) ? " ui-mini" : "",
                cType = control[ 0 ].nodeName.toLowerCase(),
                isToggleSwitch = ( cType === "select" ),
                isRangeslider = control.parent().is( ":jqmData(role='rangeslider')" ),
                selectClass = ( isToggleSwitch ) ? "ui-slider-switch" : "",
                controlID = control.attr( "id" ),
                $label = $( "[for='" + controlID + "']" ),
                labelID = $label.attr( "id" ) || controlID + "-label",
                trueMin = !isToggleSwitch ? parseFloat( control.attr( "min" ) ) : 0,
                trueMax =  !isToggleSwitch ? parseFloat( control.attr( "max" ) ) : control.find( "option" ).length-1,
                min = trueMax * -1,
                max = trueMin * -1,
                step = window.parseFloat( control.attr( "step" ) || 1 ),
                domHandle = document.createElement( "a" ),
                handle = $( domHandle ),
                domSlider = document.createElement( "div" ),
                slider = $( domSlider ),
                valuebg = this.options.highlight && !isToggleSwitch ? (function() {
                    var bg = document.createElement( "div" );
                    bg.className = "ui-slider-bg " + $.mobile.activeBtnClass;
                    return $( bg ).prependTo( slider );
                })() : false,
                options,
                wrapper,
                j, length,
                i, optionsCount, origTabIndex,
                side, activeClass, sliderImg;

            $label.attr( "id", labelID );
            this.isToggleSwitch = isToggleSwitch;

            domHandle.setAttribute( "href", "#" );
            domSlider.setAttribute( "role", "application" );
            domSlider.className = [ this.isToggleSwitch ? "ui-slider ui-slider-track ui-shadow-inset " : "ui-slider-track ui-shadow-inset ", selectClass, trackThemeClass, cornerClass, miniClass ].join( "" );
            domHandle.className = "ui-slider-handle";
            domSlider.appendChild( domHandle );

            handle.attr({
                "role": "slider",
                "aria-valuemin": min,
                "aria-valuemax": max,
                "aria-valuenow": this._value(),
                "aria-valuetext": this._value(),
                "title": this._value(),
                "aria-labelledby": labelID
            });

            $.extend( this, {
                slider: slider,
                handle: handle,
                control: control,
                type: cType,
                step: step,
                max: max,
                min: min,
                valuebg: valuebg,
                isRangeslider: isRangeslider,
                dragging: false,
                beforeStart: null,
                userModified: false,
                mouseMoved: false
            });

            if ( isToggleSwitch ) {
                // TODO: restore original tabindex (if any) in a destroy method
                origTabIndex = control.attr( "tabindex" );
                if ( origTabIndex ) {
                    handle.attr( "tabindex", origTabIndex );
                }
                control.attr( "tabindex", "-1" ).focus(function() {
                    $( this ).blur();
                    handle.focus();
                });

                wrapper = document.createElement( "div" );
                wrapper.className = "ui-slider-inneroffset";

                for ( j = 0, length = domSlider.childNodes.length; j < length; j++ ) {
                    wrapper.appendChild( domSlider.childNodes[j] );
                }

                domSlider.appendChild( wrapper );

                // slider.wrapInner( "<div class='ui-slider-inneroffset'></div>" );

                // make the handle move with a smooth transition
                handle.addClass( "ui-slider-handle-snapping" );

                options = control.find( "option" );

                for ( i = 0, optionsCount = options.length; i < optionsCount; i++ ) {
                    side = !i ? "b" : "a";
                    activeClass = !i ? "" : " " + $.mobile.activeBtnClass;
                    sliderImg = document.createElement( "span" );

                    sliderImg.className = [ "ui-slider-label ui-slider-label-", side, activeClass ].join( "" );
                    sliderImg.setAttribute( "role", "img" );
                    sliderImg.appendChild( document.createTextNode( options[i].innerHTML ) );
                    $( sliderImg ).prependTo( slider );
                }

                self._labels = $( ".ui-slider-label", slider );

            }

            // monitor the input for updated values
            control.addClass( isToggleSwitch ? "ui-slider-switch" : "ui-slider-input" );

            this._on( control, {
                "change": "_controlChange",
                "keyup": "_controlKeyup",
                "blur": "_controlBlur",
                "vmouseup": "_controlVMouseUp"
            });

            slider.bind( "vmousedown", $.proxy( this._sliderVMouseDown, this ) )
                .bind( "vclick", false );

            // We have to instantiate a new function object for the unbind to work properly
            // since the method itself is defined in the prototype (causing it to unbind everything)
            this._on( document, { "vmousemove": "_preventDocumentDrag" });
            this._on( slider.add( document ), { "vmouseup": "_sliderVMouseUp" });

            slider.insertAfter( control );

            // wrap in a div for styling purposes
            if ( !isToggleSwitch && !isRangeslider ) {
                wrapper = this.options.mini ? "<div class='ui-slider ui-mini'>" : "<div class='ui-slider'>";

                control.add( slider ).wrapAll( wrapper );
            }

            // bind the handle event callbacks and set the context to the widget instance
            this._on( this.handle, {
                "vmousedown": "_handleVMouseDown",
                "keydown": "_handleKeydown",
                "keyup": "_handleKeyup"
            });

            this.handle.bind( "vclick", false );

            this._handleFormReset();

            this.refresh( undefined, undefined, true );

            this.slider.attr("style", "width:20px !important; margin: 0 auto 20px auto !important; height:"+this.options.height+"px !important;")
            $(this.control).detach()
            $(this.slider).parent().append(this.control)
            $(this.slider).parent().css("margin-bottom", (this.options.height + 30) + "px")
        } else {
            this._super()
        }
    },
    
    _value: function() {
        if (!this.options.vertical) {
            this._super()
        } else {
            return  this.isToggleSwitch ? this.element[0].selectedIndex : parseFloat( this.element.val() * -1 );
        }
    },

    refresh: function(val, isfromControl, preventInputUpdate) {
        if (!this.options.vertical) {
            this._super(val, isfromControl, preventInputUpdate)
        } else {
            var self = this,
                parentTheme = $.mobile.getAttribute( this.element[ 0 ], "theme" ),
                theme = this.options.theme || parentTheme,
                themeClass =  theme ? " ui-btn-" + theme : "",
                trackTheme = this.options.trackTheme || parentTheme,
                trackThemeClass = trackTheme ? " ui-bar-" + trackTheme : " ui-bar-inherit",
                cornerClass = this.options.corners ? " ui-corner-all" : "",
                miniClass = this.options.mini ? " ui-mini" : "",
                top, height, data, tol,
                pyStep, percent,
                control, isInput, optionElements, min, max, step,
                newval, valModStep, alignValue, percentPerStep,
                handlePercent, aPercent, bPercent,
                valueChanged;

            self.slider[0].className = [ this.isToggleSwitch ? "ui-slider ui-slider-switch ui-slider-track ui-shadow-inset" : "ui-slider-track ui-shadow-inset", trackThemeClass, cornerClass, miniClass ].join( "" );
            if ( this.options.disabled || this.element.prop( "disabled" ) ) {
                this.disable();
            }

            // set the stored value for comparison later
            this.value = this._value();
            if ( this.options.highlight && !this.isToggleSwitch && this.slider.find( ".ui-slider-bg" ).length === 0 ) {
                this.valuebg = (function() {
                    var bg = document.createElement( "div" );
                    bg.className = "ui-slider-bg " + $.mobile.activeBtnClass;
                    return $( bg ).prependTo( self.slider );
                })();
            }
            this.handle.addClass( "ui-btn" + themeClass + " ui-shadow" );

            control = this.element;
            isInput = !this.isToggleSwitch;
            optionElements = isInput ? [] : control.find( "option" );

// invert min and max
            trueMin =  isInput ? parseFloat( control.attr( "min" ) ) : 0
            trueMax = isInput ? parseFloat( control.attr( "max" ) ) : optionElements.length - 1;
            min = trueMax * -1
            max = trueMin * -1

            /* original
            min =  isInput ? parseFloat( control.attr( "min" ) ) : 0
            max = isInput ? parseFloat( control.attr( "max" ) ) : optionElements.length - 1;*/


            step = ( isInput && parseFloat( control.attr( "step" ) ) > 0 ) ? parseFloat( control.attr( "step" ) ) : 1;

            if ( typeof val === "object" ) {
                data = val;
                // a slight tolerance helped get to the ends of the slider
                tol = 8;

                top = this.slider.offset().top;
                height = this.slider.height();
                pyStep = height/((max-min)/step);
                if ( !this.dragging ||
                        data.pageY < top - tol ||
                        data.pageY > top + height + tol ) {
                    return;
                }
                if ( pyStep > 1 ) {
                    percent = ( ( data.pageY - top ) / height ) * 100;
                } else {
                    percent = Math.round( ( ( data.pageY - top ) / height ) * 100 );
                }
            } else {
                if ( val == null ) {
                    val = isInput ? parseFloat( control.val() * -1 || 0 ) : control[0].selectedIndex;
                }
                percent = ( parseFloat( val ) - min ) / ( max - min ) * 100;
            }

            if ( isNaN( percent ) ) {
                return;
            }

            newval = ( percent / 100 ) * ( max - min ) + min;

            //from jQuery UI slider, the following source will round to the nearest step
            valModStep = ( newval - min ) % step;
            alignValue = newval - valModStep;

            if ( Math.abs( valModStep ) * 2 >= step ) {
                alignValue += ( valModStep > 0 ) ? step : ( -step );
            }

            percentPerStep = 100/((max-min)/step);
            // Since JavaScript has problems with large floats, round
            // the final value to 5 digits after the decimal point (see jQueryUI: #4124)
            newval = parseFloat( alignValue.toFixed(5) );

            if ( typeof pyStep === "undefined" ) {
                pyStep = height / ( (max-min) / step );
            }
            if ( pyStep > 1 && isInput ) {
                percent = ( newval - min ) * percentPerStep * ( 1 / step );
            }
            if ( percent < 0 ) {
                percent = 0;
            }

            if ( percent > 100 ) {
                percent = 100;
            }

            if ( newval < min ) {
                newval = min;
            }

            if ( newval > max ) {
                newval = max;
            }
            
            newval *= -1;

            this.handle.css( "top", percent + "%" );
            this.handle.css("margin-left", "-5px");

            this.handle[0].setAttribute( "aria-valuenow", isInput ? newval : optionElements.eq( newval ).attr( "value" ) );

            this.handle[0].setAttribute( "aria-valuetext", isInput ? newval : optionElements.eq( newval ).getEncodedText() );

            this.handle[0].setAttribute( "title", isInput ? newval : optionElements.eq( newval ).getEncodedText() );

            if ( this.valuebg ) { // NOTE modified
            	
                var height = this.options.height;
                var heightFilled = height * ((100 - percent) / 100.0);
                this.valuebg.css("margin-top", height-heightFilled);
                this.valuebg.css( "height", heightFilled + "px" );
            }

            // drag the label heights
            if ( this._labels ) {
                handlePercent = this.handle.height() / this.slider.height() * 100;
                aPercent = percent && handlePercent + ( 100 - handlePercent ) * percent / 100;
                bPercent = percent === 100 ? 0 : Math.min( handlePercent + 100 - aPercent, 100 );

                this._labels.each(function() {
                    var ab = $( this ).hasClass( "ui-slider-label-a" );
                    $( this ).height( ( ab ? aPercent : bPercent  ) + "%" );
                });
            }

            if ( !preventInputUpdate ) {
                valueChanged = false;

                // update control"s value
                if ( isInput ) {
                    valueChanged = control.val() !== newval;
                    control.val( newval );
                } else {
                    valueChanged = control[ 0 ].selectedIndex !== newval;
                    control[ 0 ].selectedIndex = newval;
                }
                if ( this._trigger( "beforechange", val ) === false) {
                        return false;
                }
                if ( !isfromControl && valueChanged ) {
                    control.trigger( "change" );
                }
            }
        }
    }
})
