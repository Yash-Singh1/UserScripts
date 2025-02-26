// ==UserScript==
// @name         Hide Email on Claude Sidebar
// @namespace    https://github.com/Yash-Singh1/UserScripts
// @version      0.1
// @description  ^^
// @author       Yash Singh
// @match        https://claude.ai/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=claude.ai
// @grant        none
// @homepage     https://github.com/Yash-Singh1/UserScripts/tree/main/Hide_Email_on_Claude_Sidebar#readme
// @homepageURL  https://github.com/Yash-Singh1/UserScripts/tree/main/Hide_Email_on_Claude_Sidebar#readme
// @supportURL   https://github.com/Yash-Singh1/UserScripts/issues
// @license      MIT
// @downloadURL  https://raw.githubusercontent.com/Yash-Singh1/UserScripts/main/Hide_Email_on_Claude_Sidebar/Hide_Email_on_Claude_Sidebar.user.js
// @updateURL    https://raw.githubusercontent.com/Yash-Singh1/UserScripts/main/Hide_Email_on_Claude_Sidebar/Hide_Email_on_Claude_Sidebar.user.js
// ==/UserScript==

(function () {
  'use strict';
  const hideEmailStyles = document.createElement('style');
  hideEmailStyles.textContent = ` [data-testid="user-menu-button"] > div:nth-child(2) > div:nth-child(2) {
    display: none;
  }`;
  document.body.appendChild(hideEmailStyles);
})();
