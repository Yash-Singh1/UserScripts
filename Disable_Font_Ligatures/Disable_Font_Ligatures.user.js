// ==UserScript==
// @name         Disable Font Ligatures
// @namespace    https://github.com/Yash-Singh1/UserScripts
// @version      0.1
// @description  Disable font ligatures everywhere
// @author       Yash Singh
// @match        https://*/*
// @match        http://*/*
// @grant        none
// @homepage     https://github.com/Yash-Singh1/UserScripts/tree/main/Disable_Font_Ligatures#readme
// @homepageURL  https://github.com/Yash-Singh1/UserScripts/tree/main/Disable_Font_Ligatures#readme
// @supportURL   https://github.com/Yash-Singh1/UserScripts/issues
// @license      MIT
// @downloadURL  https://raw.githubusercontent.com/Yash-Singh1/UserScripts/main/Disable_Font_Ligatures/Disable_Font_Ligatures.user.js
// @updateURL    https://raw.githubusercontent.com/Yash-Singh1/UserScripts/main/Disable_Font_Ligatures/Disable_Font_Ligatures.user.js
// ==/UserScript==

(function() {
    'use strict';

    let style = document.createElement("style");
    style.innerText = `* {
      font-variant-ligatures: none;
    }`;
    window.onload = () => document.head.appendChild(style);
})();
