// ==UserScript==
// @name         DuckDuckGo Bangs for Google
// @namespace    https://github.com/Yash-Singh1/UserScripts
// @version      0.1
// @description  DuckDuckGo Bangs for Google
// @author       Yash Singh
// @match        *://*.google.com/search*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=google.com
// @grant        none
// @homepage     https://github.com/Yash-Singh1/UserScripts/tree/main/DuckDuckGo_Bangs_for_Google#readme
// @homepageURL  https://github.com/Yash-Singh1/UserScripts/tree/main/DuckDuckGo_Bangs_for_Google#readme
// @supportURL   https://github.com/Yash-Singh1/UserScripts/issues
// @license      MIT
// @downloadURL  https://raw.githubusercontent.com/Yash-Singh1/UserScripts/main/DuckDuckGo_Bangs_for_Google/DuckDuckGo_Bangs_for_Google.user.js
// @updateURL    https://raw.githubusercontent.com/Yash-Singh1/UserScripts/main/DuckDuckGo_Bangs_for_Google/DuckDuckGo_Bangs_for_Google.user.js
// @run-at       document-start
// ==/UserScript==

(async function () {
  'use strict';

  const urlParams = new URLSearchParams(window.location.search);
  const myParam = urlParams.get('q');

  if (myParam.match(/(\+|^|\s)!\S*?(\+|\s|$)/)) {
    location.href = 'https://duckduckgo.com/?q=' + myParam;
  }
})();
