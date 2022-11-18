// ==UserScript==
// @name         USACO Set Default Language
// @namespace    https://github.com/Yash-Singh1/UserScripts
// @version      0.3
// @description  Set the default language in the dropdown for USACO
// @author       Yash Singh
// @match        http://www.usaco.org/index.php?page=viewproblem2&cpid=*
// @match        http://usaco.org/index.php?page=viewproblem2&cpid=*
// @icon         http://www.usaco.org/current/images/usaco_logo.png
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_registerMenuCommand
// @homepage     https://github.com/Yash-Singh1/UserScripts/tree/main/USACO_Set_Default_Language#readme
// @homepageURL  https://github.com/Yash-Singh1/UserScripts/tree/main/USACO_Set_Default_Language#readme
// @supportURL   https://github.com/Yash-Singh1/UserScripts/issues
// @license      MIT
// @downloadURL  https://raw.githubusercontent.com/Yash-Singh1/UserScripts/main/USACO_Set_Default_Language/USACO_Set_Default_Language.user.js
// @updateURL    https://raw.githubusercontent.com/Yash-Singh1/UserScripts/main/USACO_Set_Default_Language/USACO_Set_Default_Language.user.js
// ==/UserScript==

(function () {
  'use strict';

  function changeDefault() {
    let selectEl = document.querySelector('select[name="language"]');
    let val = GM_getValue('lang', 'C++17');
    let lookFor = '';
    for (const optionEl of selectEl.children) {
      if (optionEl.innerText === val) {
        lookFor = optionEl.value;
      }
    }
    if (lookFor === '') {
      alert('Set language is not found');
    } else {
      selectEl.value = lookFor;
    }
  }

  changeDefault();

  GM_registerMenuCommand('Set the default language', () => {
    GM_setValue(
      'lang',
      prompt('What default language would you like to set to?', 'C++17')
    );
    changeDefault();
  });
})();
