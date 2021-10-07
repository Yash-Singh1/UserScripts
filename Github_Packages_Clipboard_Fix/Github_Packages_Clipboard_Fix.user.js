// ==UserScript==
// @name         Github Packages Clipboard Fix
// @namespace    https://github.com/Yash-Singh1/UserScripts
// @version      0.1
// @description  Fixes a clipboard problem in Github Packages
// @author       Yash Singh
// @match        https://github.com/*/*/packages/*
// @icon         https://github.githubassets.com/favicons/favicon.svg
// @grant        none
// @homepage     https://github.com/Yash-Singh1/UserScripts/tree/main/Github_Packages_Clipboard_Fix#readme
// @homepageURL  https://github.com/Yash-Singh1/UserScripts/tree/main/Github_Packages_Clipboard_Fix#readme
// @supportURL   https://github.com/Yash-Singh1/UserScripts/issues
// @license      MIT
// @downloadURL  https://raw.githubusercontent.com/Yash-Singh1/UserScripts/main/Github_Packages_Clipboard_Fix/Github_Packages_Clipboard_Fix.user.js
// @updateURL    https://raw.githubusercontent.com/Yash-Singh1/UserScripts/main/Github_Packages_Clipboard_Fix/Github_Packages_Clipboard_Fix.user.js
// ==/UserScript==

(function () {
  'use strict';

  [
    ...document.querySelectorAll(
      'clipboard-copy > svg.octicon.octicon-copy.js-clipboard-copy-icon'
    )
  ].forEach((icon) => (icon.style.right = '5px'));
})();
