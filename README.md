jValid
================

A jQuery Plugin to make valid inputs on form fields and HTML elements


Author Homepage:      http://djhvscf.github.io/Blog/<br />

How to use it?
==============

Just add this in your html

$(document).ready(function() {
 $('#test').jValid({regex:'0-0000-0000'});
});

This plugin has options and sets default values:

* regex:'S-S',
* behaviorRegExp:  false,
* negkey: true,
* live:true,
* events:'keypress keyup paste',
* onErrorFeedback: ''

For more information about it:
 
 http://djhvscf.github.io/Blog/

Dependencies
=============
This plugin has these dependencies:

* jquery-1.10.2.js

Repo Contents
=============

* jValid.js
* README

MIT Open Source License
=======================

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
