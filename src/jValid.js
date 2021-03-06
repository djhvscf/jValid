 /**
 * jvalid.js
 * @version: v1.0.9
 * @author: Dennis Hernández
 * @webSite: http://djhvscf.github.io/Blog
 *
 * Created by Dennis Hernández on 03/Oct/2014.
 *
 * Copyright (c) 2014 Dennis Hernández http://djhvscf.github.io/Blog
 *
 * The MIT License (http://www.opensource.org/licenses/mit-license.php)
 *
 * Permission is hereby granted, free of charge, to any person
 * obtaining a copy of this software and associated documentation
 * files (the "Software"), to deal in the Software without
 * restriction, including without limitation the rights to use,
 * copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the
 * Software is furnished to do so, subject to the following
 * conditions:
 *
 * The above copyright notice and this permission notice shall be
 * included in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
 * EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
 * OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
 * NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
 * HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
 * WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
 * FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
 * OTHER DEALINGS IN THE SOFTWARE.
 */
 

;(function ($) {
    'use strict'
    $.fn.jValid = function (options) {
		
		var defaults = {
              regex:'S-S',
			  behaviorRegExp:  false,
              live:true,
			  ignoredKeys: [8, 9, 13, 35, 36, 37, 39, 46],
			  placeholder: '',
			  onError: $.noop,
			  onComplete: $.noop,
			  onChange: $.noop
		};
		
		/*		
		Default Mask Legend
		0: Only Numbers.
		*9: Only Numbers but optional.
		*#: Only Numbers but recusive.
		*A: Numbers and Letters.
		S: Only A-Z characters.
		s: Only a-z characters.
		*/
		
		var defaultMasks = {'0': {pattern: /\d/}, 'S': {pattern: /[A-Z]/}, 's': {pattern: /[a-z]/}},
			defaultMasksArray = ['0', 'S', 's'],
			options =  $.extend(defaults, options),
			maxCharac = options.regex.length,
			globalRegExpMay = new RegExp("[A-Z]"),
			globalRegExpMin = new RegExp("[a-z]"),
			specialRegExp = new RegExp("[^a-zA-Z0-9]", "g"),
			defaultEvents = 'keydown paste blur keyup',
			eventsType = {keydown: 'keydown', paste: 'paste', after_paste: 'after_paste', blur: 'blur'},
			oldValue = '',
			base = $(this);
		
		var sd = {
			/*
			*	This functions returns the actual position of the string
			*/
			getPosition: function () {
				var docSelection = document.selection,
					selection = base.get(0).selectionStart;
			
				if (docSelection && !~navigator.appVersion.indexOf("MSIE 10")) {
					return docSelection.createRange().moveStart('character', base.is("input") ? -base.val().length : -base.text().length).text.length;
				} else if (selection || selection === 0) {
					return selection;
				}
			},
			
			/*
			*	This function returns the value of the key pressed by the user
			*/
			getKeyCode: function (event){
			
				var key = event.charCode ? event.charCode : event.keyCode ? event.keyCode : 0;

				// 8 = backspace, 9 = tab, 13 = enter, 35 = end, 36 = home, 37 = left, 39 = right, 46 = delete
				if(sd.inArray(key, options.ignoredKeys)) {
					if (event.charCode === 0 && event.keyCode === key) {
						return true;
					}
				}

				return String.fromCharCode(key);
			},
			
			/*
			*	This function validates if the input value correspond with mask created
			*/
			isValidMask: function (mask) {
				var maskTemp = mask.replace(specialRegExp, "");
				for(var i = 0; i < maskTemp.length; i++) {
					if(!sd.inArray(maskTemp.charAt(i), defaultMasksArray)) {
						return false;
					}
				}
				return true;
			},
			
			/*
			*	This functions get or set the value of the input
			*/
			inputVal: function (value) {
				var isInput = base.is('input'),
					method = isInput ? 'val' : 'text',
					objReturn;

				if (arguments.length > 0) {
					base[method](value);
					objReturn = base;
				} else {
					objReturn = base[method]();
				}
				
				return objReturn;
			},
			
			/*
			*	This function validate if a number is a number
			*/
			isNumeric: function(number) {
				return $.isNumeric(number);
			},
			
			/*
			*	This function returns the next character if this is special character
			*/
			getNextSpecialCharacter: function() {
				var nextCharacter = options.regex.charAt(sd.getPosition());
				
				if(sd.isSpecialCharacter(nextCharacter)) {
					sd.inputVal(sd.inputVal() + nextCharacter);
					return true;
				} else {
					return false;
				}
			},
			
			/*
			*	This function returns true if the value is a special character, otherwise, false
			*/
			isSpecialCharacter: function(value) {
				return specialRegExp.test(value);
			},
			
			/*
			*	This function calls a function
			*/
			callGetNextCharacter: function() {
				setTimeout(function(){ sd.getNextSpecialCharacter(); }, 1);
			},
			
			/*
			*	This function returns the input value without special characters
			*/
			cleanValue: function(whitespace) {
				return sd.inputVal().replace(specialRegExp, whitespace ? " " : "");			
			},
			
			/*
			*	This function validates if the value exists in an array
			*/
			inArray: function(obj, array) {
				return $.inArray(obj, array) === -1 ? false : true;
			},
			
			/*
			* This functions call the callbacks functions
			*/
			callbacks: function (e) {
                var val = sd.inputVal(),
                    changed = val !== oldValue,
					defaultArgs = [val, e, base, options],
                    callback = function(name, criteria, args) {
                        if (typeof(options[name]) === "function" && criteria) {
                            options[name].apply(this, args);
                        }
                    };

                callback('onChange', changed === true, defaultArgs);
                //callback('onKeyPress', changed === true, defaultArgs);
                callback('onComplete', val.length === options.regex.length, defaultArgs);
                //callback('onError', p.invalid.length > 0, [val, e, el, p.invalid, options]);
            },
						
			/*
			*	This function destroys all the events associate with the DOM element
			*/
			destroyEvents: function(obj) {
				var isInstantiated  = !! $.data(obj.get(0));
				if (isInstantiated) {
					$.removeData(obj.get(0));
					obj.off(defaultEvents);
					obj.unbind('.' + defaultEvents);
				}
			},
			
			/*
			*	This function verify the jQuery version and bind the event to input object
			*/
			bindjValid: function (inputObject) {
			
				if(options.regex === '') {
					$.error("You have to give the Regular expression or the mask to apply!");
				} else {
					var jqueryV = sd.getjQueryVersion(), 
						input = $(inputObject), callback;
						input.get(0).placeholder = options.placeholder;
						
					if(options.behaviorRegExp){
						callback = valid;
					} else {
						if(sd.isValidMask(options.regex)){
							callback = validMask;
						} else { 
							$.error("You have to create a valid mask");
						}
					}
					
					if (options.live) {
						if (parseInt(jqueryV[0]) >= 1 && parseInt(jqueryV[1]) >= 7) {
							input.on(defaultEvents, callback);
						} else {
							input.live(defaultEvents, callback);
						}
					} else {
						return inputObject.each(function() {
							if (parseInt(jqueryV[0]) >= 1 && parseInt(jqueryV[1]) >= 7) {
								input.off(defaultEvents).on(defaultEvents, callback);
							} else {
								input.unbind(defaultEvents).bind(defaultEvents, callback);
							}
						});
					}
				}
			},
			
			/*
			*	This function returns the jQuery version used
			*/
			getjQueryVersion: function () {
				return $.fn.jquery.split('.');
			}
		};
		
		/*
		*	This function valid the input value filled by the user
		*	Return true if the value is correct, otherwise, false
		*/
		function valid (event) {
			var newRegex, 
				keyString;
			
            if (event.ctrlKey || event.altKey) {
				return;
			}
			
            if (event.type === eventsType.keydown.toString()) {
			
				keyString = sd.getKeyCode(event);
				if(typeof(keyString) === 'boolean') {
					return keyString;
				}
				
              newRegex = new RegExp(options.regex);
			  
            } else if (event.type === eventsType.paste.toString()) {
              base.data('value_before_paste', event.target.value);
              setTimeout(function(){
                valid({type:'after_paste', input:base});
              }, 1);
              return true;
            } else if (event.type === eventsType.after_paste.toString()) {
              keyString = sd.inputVal();
              newRegex = new RegExp('^('+options.regex+')+$');
            } else {
              return false;
            }

            if (newRegex.test(keyString)) {
				return true;
            } else if (typeof(options.onError) === 'function') {
				//Error and callback
            }
            if (event.type === eventsType.after_paste.toString()) {
				sd.inputVal(base.data('value_before_paste'));
			}
            return false;
		};
		
		/*
		*	This functions validates if input value is valid with the mask
		*/
		function validMask(event) {
			var actualValue = sd.inputVal(),
				keyString = sd.getKeyCode(event);
				
			if (event.ctrlKey || event.altKey) {
				return;
			}
			
            if (event.type === eventsType.keydown.toString()) {
				if(typeof(keyString) === 'string') {
					switch (options.regex.charAt(sd.getPosition())) {
						case "0":
							if(sd.isNumeric(keyString)) {
								return sd.callGetNextCharacter();
							} else {
								return false;
							}
						case "S":
							if(globalRegExpMay.test(keyString)) {
								return sd.callGetNextCharacter();
							} else {
								return false;
							}
						case "s":
							if(globalRegExpMin.test(keyString)) {
								return sd.callGetNextCharacter();
							} else {
								return false;
							}
						default:
							return false;
					};
				} else {
					return keyString;
				}
			} else if (event.type === eventsType.blur.toString()) {
				oldValue = sd.inputVal();
			}
			
			sd.callbacks(event);
		};
		
		/*
		*	Returns the value without mask or regular expression
		*/
		$.fn.cleanValue = function(whitespace) {
			return sd.cleanValue(whitespace);
		};
		
		/*
		*	Destroys the events associated to DOM element
		*/
		$.fn.unjValid = function() {
			sd.destroyEvents(this);
		};
		
		sd.bindjValid(base);
    };
})(jQuery);