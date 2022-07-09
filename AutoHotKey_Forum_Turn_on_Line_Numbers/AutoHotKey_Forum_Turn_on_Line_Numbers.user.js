// ==UserScript==
// @name         AutoHotKey Forum Turn on Line Numbers
// @namespace    https://github.com/Yash-Singh1/UserScripts
// @version      0.1
// @description  Turns on line numbers by default on the AutoHotKey Forum
// @author       Yash Singh
// @match        https://www.autohotkey.com/boards/viewtopic.php?*
// @icon         https://www.autohotkey.com/favicon.ico
// @grant        none
// @homepage     https://github.com/Yash-Singh1/UserScripts/tree/main/AutoHotKey_Forum_Turn_on_Line_Numbers#readme
// @homepageURL  https://github.com/Yash-Singh1/UserScripts/tree/main/AutoHotKey_Forum_Turn_on_Line_Numbers#readme
// @supportURL   https://github.com/Yash-Singh1/UserScripts/issues
// @license      MIT
// @downloadURL  https://raw.githubusercontent.com/Yash-Singh1/UserScripts/main/AutoHotKey_Forum_Turn_on_Line_Numbers/AutoHotKey_Forum_Turn_on_Line_Numbers.user.js
// @updateURL    https://raw.githubusercontent.com/Yash-Singh1/UserScripts/main/AutoHotKey_Forum_Turn_on_Line_Numbers/AutoHotKey_Forum_Turn_on_Line_Numbers.user.js
// ==/UserScript==

(function () {
  'use strict';

  if (document.querySelector('.codebox')) {
    const _LINE_NUM_INTERVAL = setInterval(() => {
      const links = document.querySelectorAll('.codebox a[title*="Line"]');
      if (links.length > 0) {
        links.forEach((link) => link.click());
        clearInterval(_LINE_NUM_INTERVAL);
      }
    }, 100);
  }
})();
