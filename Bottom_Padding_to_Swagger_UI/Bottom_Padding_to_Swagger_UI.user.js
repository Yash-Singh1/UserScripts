// ==UserScript==
// @name         Bottom Padding to Swagger UI
// @namespace    https://github.com/Yash-Singh1/UserScripts
// @version      1.3
// @description  Adds bottom padding to the Swagger UI
// @author       Yash Singh
// @match        https://*/*
// @match        http://*/*
// @icon         https://petstore.swagger.io/favicon-32x32.png
// @grant        none
// @homepage     https://github.com/Yash-Singh1/UserScripts/tree/main/Bottom_Padding_to_Swagger_UI#readme
// @homepageURL  https://github.com/Yash-Singh1/UserScripts/tree/main/Bottom_Padding_to_Swagger_UI#readme
// @supportURL   https://github.com/Yash-Singh1/UserScripts/issues
// @license      MIT
// @downloadURL  https://raw.githubusercontent.com/Yash-Singh1/UserScripts/main/Bottom_Padding_to_Swagger_UI/Bottom_Padding_to_Swagger_UI.user.js
// @updateURL    https://raw.githubusercontent.com/Yash-Singh1/UserScripts/main/Bottom_Padding_to_Swagger_UI/Bottom_Padding_to_Swagger_UI.user.js
// ==/UserScript==

/* global SwaggerUIStandalonePreset */

(function () {
  'use strict';
  if (
    document.querySelector('div#swagger-ui') &&
    Array.isArray(SwaggerUIStandalonePreset) &&
    SwaggerUIStandalonePreset.filter((val) => typeof val !== 'function') &&
    typeof SwaggerUIBundle === 'function'
  ) {
    document.body.style.paddingBottom = '5%';
  }
})();
