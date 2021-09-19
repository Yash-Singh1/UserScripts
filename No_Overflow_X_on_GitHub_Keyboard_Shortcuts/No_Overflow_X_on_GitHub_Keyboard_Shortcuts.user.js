// ==UserScript==
// @name         No Overflow X on GitHub Keyboard Shortcuts
// @namespace    https://github.com/Yash-Singh1/UserScripts
// @version      0.1
// @description  Removes the overflow-x on the GitHub Keyboard Shortcuts page
// @author       Yash Singh
// @match        https://github.com/*
// @icon         https://github.githubassets.com/favicons/favicon.svg
// @grant        none
// @homepage     https://github.com/Yash-Singh1/UserScripts/tree/main/No_Overflow_X_on_GitHub_Keyboard_Shortcuts#readme
// @homepageURL  https://github.com/Yash-Singh1/UserScripts/tree/main/No_Overflow_X_on_GitHub_Keyboard_Shortcuts#readme
// @supportURL   https://github.com/Yash-Singh1/UserScripts/issues
// @license      MIT
// @downloadURL  https://raw.githubusercontent.com/Yash-Singh1/UserScripts/main/No_Overflow_X_on_GitHub_Keyboard_Shortcuts/No_Overflow_X_on_GitHub_Keyboard_Shortcuts.user.js
// @updateURL    https://raw.githubusercontent.com/Yash-Singh1/UserScripts/main/No_Overflow_X_on_GitHub_Keyboard_Shortcuts/No_Overflow_X_on_GitHub_Keyboard_Shortcuts.user.js
// ==/UserScript==

(function () {
  'use strict';

  setInterval(() => {
    const keyboardShortcutBox = document.querySelector(
      'body > details > details-dialog > div > div.Box-body.p-0.overflow-scroll'
    );

    if (keyboardShortcutBox) {
      keyboardShortcutBox.style.setProperty(
        'overflow-x',
        'hidden',
        'important'
      );
    }
  }, 1000);
})();
