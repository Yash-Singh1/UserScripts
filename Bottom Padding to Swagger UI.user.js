// ==UserScript==
// @name         Bottom Padding to Swagger UI
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Adds bottom padding to the Swagger UI
// @author       You
// @match        https://*/*
// @match        http://*/*
// @icon         https://petstore.swagger.io/favicon-32x32.png
// @grant        none
// ==/UserScript==

(function() {
    'use strict';
    if (document.querySelector('div#swagger-ui')) {
        document.body.style.paddingBottom = '5%';
    }
})();
