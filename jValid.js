/* @version 1.0 jValid
 * @author Dennis Hernández - djhvscf
 * @webSite: 
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
			  mask:'',
			  negkey: true,
              live:true,
              events:'keypress paste'
		};
		
		var options =  $.extend(defaults, options); 		
		//options.regex = RegEx[options.regex].toString();
		var base = this;		
		
		function validMask () {
			var input = (event.input) ? event.input : $(this);
			var key = event.charCode ? event.charCode : event.keyCode ? event.keyCode : 0;
			var string = String.fromCharCode(key);
		}
		
		function valid (event) {

            var input = (event.input) ? event.input : $(this);
            if (event.ctrlKey || event.altKey) {
				return;
			}
			
            if (event.type === eventsType.keypress.toString()) {
              var key = event.charCode ? event.charCode : event.keyCode ? event.keyCode : 0;

              // 8 = backspace, 9 = tab, 13 = enter, 35 = end, 36 = home, 37 = left, 39 = right, 46 = delete
              if (key === 8 || key === 9 || key === 13 || key === 35 || key === 36|| key === 37 || key === 39 || key === 46) {
                if (event.charCode === 0 && event.keyCode === key) {
					return true;             
                }
              }
			  
              var string = String.fromCharCode(key);
              /*Development section
			  // if they pressed the defined negative key
              if (options.negkey) && string === options.negkey) {
                // if there is already one at the beginning, remove it
                if (input.val().substr(0, 1) === string) {
                  input.val(input.val().substring(1, input.val().length)).change();
                } else {
                  // it isn't there so add it to the beginning of the string
                  input.val(string + input.val()).change();
                }
                return false;
              }
			  Development section*/
			  
              var regex = new RegExp(options.regex);
            } else if (event.type === eventsType.paste.toString()) {
              input.data('value_before_paste', event.target.value);
              setTimeout(function(){
                valid({type:'after_paste', input:input});
              }, 1);
              return true;
            } else if (event.type === eventsType.after_paste.toString()) {
              var string = input.val();
              var regex = new RegExp('^('+options.regex+')+$');
            } else {
              return false;
            }

            if (regex.test(string)) {
              return true;
            } else if (typeof(options.feedback) === 'function') {
              options.feedback.call(this, string);
            }
            if (event.type === eventsType.after_paste.toString()) {
				input.val(input.data('value_before_paste'));
			}
            return false;
          };
		  
		if(options.mask !== '' && options.regex !== '') {
			$.error("You have to use only Regular Expression or Mask input!");
		}
		else {
			var jqueryV = $.fn.jquery.split('.');
			if (options.live) {
				if (parseInt(jqueryV[0]) >= 1 && parseInt(jqueryV[1]) >= 7) {
					if(options.regex !== '') {
						$(this).on(options.events, valid); 
					}else {
						$(this).on(options.events, validMask); 
					}
				} else {
					if(options.regex !== '') {
						$(this).live(options.events, valid); 
					}else {
						$(this).live(options.events, validMask); 
					}
				}
			} else {
				return this.each(function() {
					var input = $(this);
					if (parseInt(jqueryV[0]) >= 1 && parseInt(jqueryV[1]) >= 7) {
						if(options.regex !== '') {
							input.off(options.events).on(options.events, valid);
						}else {
							input.off(options.events).on(options.events, validMask);
						}
					} else {
						if(options.regex !== '') {
							input.unbind(options.events).bind(options.events, valid);
						}else {
							input.unbind(options.events).bind(options.events, validMask);
						}
					}
				});  
			}
		}
    };
})(jQuery);