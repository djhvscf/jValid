 /**
 * jvalid.js
 * @version: v1.0.1
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
		
		var eventsType = {
			keypress: 'keypress',
			paste: 'paste',
			after_paste: 'after_paste',
			keyUp: 'keyup'
		};
		
		var defaults = {
              regex:'S-S',
			  behaviorRegExp:  false,
			  negkey: true,
              live:true,
              events:'keypress keyup paste',
			  onErrorFeedback: ''
		};
		
		/*		
		Default Mask Legend
		0: Only Numbers.
		*9: Only Numbers but optional.
		*#: Only Numbers but recusive.
		*A: Numbers and Letters.
		S: Only A-Z and a-z characters.
		*/
		var defaultMasks = ['0','S'],
			options =  $.extend(defaults, options),
			maxCharac = options.regex.length,
			globalRegExp = new RegExp("[a-zA-Z]"),
			specialRegExp = new RegExp("[^a-zA-Z0-9]", "g"),
			base = $(this);
		
		var sd = {
			/*
			*	This functions returns the actual position of the string
			*/
			getPosition: function (keyString) {
				return keyString.length;
			},
			
			/*
			*	This function returns the value of the key pressed by the user
			*/
			getKeyCode: function (event){
			
				var key = event.charCode ? event.charCode : event.keyCode ? event.keyCode : 0;

				// 8 = backspace, 9 = tab, 13 = enter, 35 = end, 36 = home, 37 = left, 39 = right, 46 = delete
				if (key === 8 || key === 9 || key === 13 || key === 35 || key === 36|| key === 37 || key === 39 || key === 46) {
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
					if(maskTemp.charAt(i) !== "0" && maskTemp.charAt(i) !== "S") {
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
			getNextCharacter: function(valuefuture) {
				var nextCharacter = options.regex.charAt(sd.getPosition(valuefuture));
				if(sd.isSpecialCharacter(nextCharacter))
				{
					sd.inputVal(sd.inputVal() + nextCharacter);
					return true;
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
			callGetNextCharacter: function(value) {
				setTimeout(function(){
							sd.getNextCharacter(value);
				}, 1);
			},
			
			/*
			*	This functions validate if an object is in an array
			*/
			contains: function(obj, array) {
				for (var i = 0; i < array.length; i++) {
					for(var j = 0; j < obj.length; j++) {
						if (obj.charAt(j) === array[i]) {
							return true;
						}
					}
				}
				return false;
			},
			
			/*
			*	This function returns the input value without special characters
			*/
			cleanValue: function() {
				return sd.inputVal().replace(specialRegExp, "");			
			},
			
			/*
			*	This function verify the jQuery version and bind the event to input object
			*/
			verifyjQueryVersion: function (inputObject) {
				if(options.regex === '') {
					$.error("You have to give the Regular expression or the mask to apply!");
				} else {
					var jqueryV = $.fn.jquery.split('.'), 
						input = $(inputObject), callback;
					
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
							input.on(options.events, callback);
						} else {
							input.live(options.events, callback);
						}
					} else {
						return inputObject.each(function() {
							if (parseInt(jqueryV[0]) >= 1 && parseInt(jqueryV[1]) >= 7) {
								input.off(options.events).on(options.events, callback);
							} else {
								input.unbind(options.events).bind(options.events, callback);
							}
						});
					}
				}
			},
			
			/*
			*	Working on it
			*/
			isRegExp: function (RegEx) {
				/*Development section
				var parts = pattern.split('/'),
				regex = pattern,
				options = "";
				if (parts.length > 1) {
					regex = parts[1];
					options = parts[2];
				}
				try {
					new RegExp(regex, options);
					return true;
					//just remove this return and return true instead
				}
				catch(e) {
					return false;
				}
				Development section*/
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
			
            if (event.type === eventsType.keypress.toString()) {
			
				keyString = sd.getKeyCode(event);
				if(typeof(keyString) === 'boolean'){
					return keyString;
				}
				/*Development section
				// if they pressed the defined negative key
				if (options.negkey) && keyString === options.negkey) {
					// if there is already one at the beginning, remove it
					if (sd.inputVal().substr(0, 1) === keyString) {
					sd.inputVal(sd.inputVal().substring(1, sd.inputVal().length)).change();
					} else {
					// it isn't there so add it to the beginning of the string
					sd.inputVal(keyString + sd.inputVal()).change();
					}
					return false;
				}
				Development section*/
			  
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
            } else if (event.type === eventsType.keyUp.toString()) {
				return true;
				//Do something
			} else {
              return false;
            }

            if (newRegex.test(keyString)) {
              return true;
            } else if (typeof(options.onErrorFeedback) === 'function') {
              options.onErrorFeedback.call(this, keyString);
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
			
            if (event.type === eventsType.keypress.toString()) {
				if(typeof(keyString) === 'boolean') {
					return keyString;
				}
				
				if(actualValue.length <= maxCharac) {
					
					switch (options.regex.charAt(sd.getPosition(actualValue))) {
						case "0":
							if(sd.isNumeric(keyString))
							{
								sd.callGetNextCharacter(actualValue + options.regex.charAt(sd.getPosition(actualValue)));
								return true;
							} else {
								return false;
							}
						case "S":
							if(globalRegExp.test(keyString))
							{
								sd.callGetNextCharacter(actualValue + options.regex.charAt(sd.getPosition(actualValue)));
								return true;
							} else {
								return false;
							}
						default:
							sd.inputVal(actualValue + options.regex.charAt(sd.getPosition(actualValue)));
							return false;
					};
				} else {
					return false;
				}
			} else if (event.type === eventsType.keyUp.toString()) {
				return true;
				//Do something
			} else {
				return false;
			}
		};
		
		sd.verifyjQueryVersion(base);
		
		$.fn.cleanValue = function() {
			return sd.cleanValue();
		};
    };
})(jQuery);