// ==UserScript==
// @name         Yohoho.io Block Video Ads
// @namespace    https://github.com/Yash-Singh1/UserScripts
// @version      0.2
// @description  Blocks all video ads from Yohoho.io
// @author       Yash Singh
// @match        https://yohoho.io/
// @icon         https://www.google.com/s2/favicons?domain=yohoho.io
// @grant        none
// @homepage     https://github.com/Yash-Singh1/UserScripts/tree/main/Yohoho.io_Block_Video_Ads#readme
// @homepageURL  https://github.com/Yash-Singh1/UserScripts/tree/main/Yohoho.io_Block_Video_Ads#readme
// @supportURL   https://github.com/Yash-Singh1/UserScripts/issues
// @license      MIT
// @downloadURL  https://raw.githubusercontent.com/Yash-Singh1/UserScripts/main/Yohoho.io_Block_Video_Ads/Yohoho.io_Block_Video_Ads.user.js
// @updateURL    https://raw.githubusercontent.com/Yash-Singh1/UserScripts/main/Yohoho.io_Block_Video_Ads/Yohoho.io_Block_Video_Ads.user.js
// ==/UserScript==

/* global aipAPItag */

(function () {
  'use strict';

  function main() {
    aipAPItag.sdkBlocked = true;
  }

  const script = document.createElement('script');
  script.textContent = `(${main.toString()})();`;
  document
    .getElementById('play-button')
    .addEventListener('click', () => document.body.appendChild(script));
})();
