/* @version 1.0 jValid
 * @author Dennis Hernández - djhvscf
 * @webSite: http://djhvscf.github.io/Blog
 * jValid is a jQuery plugin that...
 */

;(function ($) {
    'use strict'
    $.fn.jValid = function (options) {
		
		/* Development section
		var RegEx = 
		{
			LetterMin :  '[a-z]',
			//UserName : '/^[a-z0-9_-]{3,16}$/',
			//Password : '/^[a-z0-9_-]{6,18}$/',
			//Hex : '/^#?([a-f0-9]{6}|[a-f0-9]{3})$/',
			//Email : '/^([a-z0-9_\.-]+)@([\da-z\.-]+)\.([a-z\.]{2,6})$/',
			//URL : '/^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/',
			IP : '/^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/',
			//HTML : '/^<([a-z]+)([^<]+)*(?:>(.*)<\/\1>|\s+\/>)$/',
			USPhone : '/^(\+\d{1,2}\s)?\(?\d{3}\)?[\s.-]\d{3}[\s.-]\d{4}$',
			Phone : '/^(\+0?1\s)?\(?\d{3}\)?[\s.-]\d{3}[\s.-]\d{4}$',
			Float : '[-+]?([0-9]*.[0-9]+|[0-9]+)',
			Int : '[0-9]',
			ZeroTo255 : '^([01][0-9][0-9]|2[0-4][0-9]|25[0-5])$',
			ZeroTo999 : '^([0-9]|[1-9][0-9]|[1-9][0-9][0-9])$',
			OneTo50 : '/(^[1-9]{1}$|^[1-4]{1}[0-9]{1}$|^50$)/gm',
			CreditCard : '^(?:4[0-9]{12}(?:[0-9]{3})?|5[1-5][0-9]{14}|6(?:011|5[0-9][0-9])[0-9]{12}|3[47][0-9]{13}|3(?:0[0-5]|[68][0-9])[0-9]{11}|(?:2131|1800|35d{3})d{11})$',
			//Date : '/(d{1,2}/d{1,2}/d{4})/gm', //MatchDate (e.g. 21/3/2006)
			MMDDYYYY : '^(0[1-9]|1[012])[- /.](0[1-9]|[12][0-9]|3[01])[- /.](19|20)dd$', //match date in format MM/DD/YYYY
			DDMMYYYY : '^(0[1-9]|[12][0-9]|3[01])[- /.](0[1-9]|1[012])[- /.](19|20)dd$', //match date in format DD/MM/YYYY
			Vowel : /[aeiou]/ig,
			HTTP : '/(.*?)[^w{3}.]([a-zA-Z0-9]([a-zA-Z0-9-]{0,65}[a-zA-Z0-9])?.)+[a-zA-Z]{2,6}/igm', //match domain name (with HTTP)
			WWW : '/[^w{3}.]([a-zA-Z0-9]([a-zA-Z0-9-]{0,65}[a-zA-Z0-9])?.)+[a-zA-Z]{2,6}/igm', //match domain name (www. only) 
			Domain : '/(.*?).(com|net|org|info|coop|int|com.au|co.uk|org.uk|ac.uk|)/igm', //match domain name (alternative)
			ImageGIFPNGJPG : '/([^s]+(?=.(jpg|gif|png)).2)/gm', //Match jpg, gif or png image
			RGB : '/^rgb((d+),s*(d+),s*(d+))$/',
			HexCode : '/(#?([A-Fa-f0-9]){3}(([A-Fa-f0-9]){3})?)/gm',
			JS : '/<script .+?src="(.+?.js(?:?v=d)*).+?script>/ig', //match all .js includes
			CSS : '/<link .+?href="(.+?.css(?:?v=d)*).+?/>/ig', //match all .css includes
		};
		Development section*/
		
		var eventsType = {
			keypress: 'keypress',
			paste: 'paste',
			after_paste: 'after_paste'
		};
		
		var defaults = {  
              regex:'[a-z]',
			  negkey: true,
              live:true,
              events:'keypress keyup paste',
			  onErrorFeedback: ''
		};
		
		var defaultsMask = ['0','S'];

/*		
Default Mask Legend
0: Only Numbers.
*9: Only Numbers but optional.
*#: Only Numbers but recusive.
*A: Numbers and Letters.
S: Only A-Z and a-z characters.
*/
		
		var options =  $.extend(defaults, options);
		var maxCharac = options.regex.length;
		//options.regex = RegEx[options.regex].toString();
		
		/*
		*	This function valid the input value filled by the user
		*	Return true if the value is correct, otherwise, false
		*/
		function valid (event) {
			var input, regex, keyString;
			
            input = (event.input) ? event.input : $(this);
            if (event.ctrlKey || event.altKey) {
				return;
			}
			
            if (event.type === eventsType.keypress.toString()) {
			
				keyString = takeKeyCode(event);
				if(typeof(keyString) === 'boolean'){
					return keyString;
				}
				/*Development section
				// if they pressed the defined negative key
				if (options.negkey) && keyString === options.negkey) {
					// if there is already one at the beginning, remove it
					if (input.val().substr(0, 1) === keyString) {
					input.val(input.val().substring(1, input.val().length)).change();
					} else {
					// it isn't there so add it to the beginning of the string
					input.val(keyString + input.val()).change();
					}
					return false;
				}
				Development section*/
			  
              regex = new RegExp(options.regex);
			  
            } else if (event.type === eventsType.paste.toString()) {
              input.data('value_before_paste', event.target.value);
              setTimeout(function(){
                valid({type:'after_paste', input:input});
              }, 1);
              return true;
            } else if (event.type === eventsType.after_paste.toString()) {
              keyString = input.val();
              regex = new RegExp('^('+options.regex+')+$');
            } else {
              return false;
            }

            if (regex.test(keyString)) {
              return true;
            } else if (typeof(options.onErrorFeedback) === 'function') {
              options.onErrorFeedback.call(this, keyString);
            }
            if (event.type === eventsType.after_paste.toString()) {
				input.val(input.data('value_before_paste'));
			}
            return false;
		};
		
		/*
		*	This functions validates if input value is valid with the mask
		*/
		function validMask(event) {
			if(isValidMask(options.regex)){
			
				var input, keyString, actualValue;
				input = (event.input) ? event.input : $(this);
				actualValue = input.val();
				keyString = takeKeyCode(event);
				if(typeof(keyString) === 'boolean') {
					return keyString;
				}
				
				if(actualValue.length <= maxCharac) {
					if(options.regex.charAt(getPosition(actualValue)) === '0') {
						return $.isNumeric(keyString);
					} else if(options.regex.charAt(getPosition(actualValue)) === 'S') {
						return new RegExp("[a-zA-Z]").test(keyString);
					} else {
						keyString = options.regex.charAt(getPosition(actualValue));
						input.val(actualValue + options.regex.charAt(getPosition(actualValue)));
						return false;
					}
				}else {
					return false;
				}
				
			} else {
				$.error("You have to create a valid mask");
			}
		};
		
		function getPosition(keyString) {
			return keyString.length;
		};
		
		function getNextCharacterMask(actualValue) {
			options.regex.charAt(getPosition(actualValue));
		};
		
		/*
		*	This function validates if the input value correspond with mask created
		*/
		function isValidMask(mask) {
			for(var i = 0; i < defaultsMask.length; i++) {
				if(mask.indexOf(defaultsMask[i].toString()) === -1) {
					return false;
				}
			}
			return true;
		};
		
		/*
		*	This function returns the value of the key pressed by the user
		*/
		function takeKeyCode(event){
			
			var key = event.charCode ? event.charCode : event.keyCode ? event.keyCode : 0;

			// 8 = backspace, 9 = tab, 13 = enter, 35 = end, 36 = home, 37 = left, 39 = right, 46 = delete
			if (key === 8 || key === 9 || key === 13 || key === 35 || key === 36|| key === 37 || key === 39 || key === 46) {
				if (event.charCode === 0 && event.keyCode === key) {
					return true;
				}
			}
            
			return String.fromCharCode(key);
		};
		
		/*
		*	This function validates if the regular expression passed by user is correct
		*/
		function isRegExp(RegEx) {
			try { 
				new RegExp(RegEx);
				return true;
			}
			catch(e) {
				return false;
			}
		};
		
		/*
		*	This function verify the jQuery version and bind the event to input object
		*/
		function verifyjQueryVersion(inputObject) {
			if(options.regex === '') {
				$.error("You have to give the Regular expression or the mask to apply!");
			} else {
				var jqueryV, input, callback;
				jqueryV = $.fn.jquery.split('.');
				input = $(inputObject);
				
				if(isRegExp(options.regex)){
					callback = validMask;
				} else {
					callback = validMask;
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
		};
		
		verifyjQueryVersion(this);
    };
})(jQuery);