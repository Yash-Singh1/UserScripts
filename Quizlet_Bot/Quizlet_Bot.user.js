// ==UserScript==
// @name         Quizlet Bot
// @namespace    https://github.com/Yash-Singh1/UserScripts
// @version      0.1
// @description  Automate Quizlet "Learn" section
// @author       Yash Singh
// @match        https://quizlet.com/ID/learn?*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=quizlet.com
// @grant        none
// @homepage     https://github.com/Yash-Singh1/UserScripts/tree/main/Quizlet_Bot#readme
// @homepageURL  https://github.com/Yash-Singh1/UserScripts/tree/main/Quizlet_Bot#readme
// @supportURL   https://github.com/Yash-Singh1/UserScripts/issues
// @license      MIT
// @downloadURL  https://raw.githubusercontent.com/Yash-Singh1/UserScripts/main/Quizlet_Bot/Quizlet_Bot.user.js
// @updateURL    https://raw.githubusercontent.com/Yash-Singh1/UserScripts/main/Quizlet_Bot/Quizlet_Bot.user.js
// ==/UserScript==

(function () {
  'use strict';

  // TODO: Automate pulling data from HTML
  const data =
    Object.fromEntries(/* DATA in [key, value][] format, can be pulled from HTML hardcoded */);
  setInterval(() => {
    console.log('runner');
    const answerBtn = document.querySelector(
      'button[type=submit][aria-label=Answer]'
    );
    const continueBtn = document.querySelector(
      'button[type=button][aria-label=Continue]'
    );
    const txt = document.querySelector('article div.FormattedText').innerText;

    if (answerBtn) {
      const input = document.querySelector('article input[aria-label]');
      const setMethod = Object.getOwnPropertyDescriptor(
        input.__proto__,
        'value'
      ).set;
      const event = new Event('input', { bubbles: true });
      setMethod.call(input, data[txt]);
      input.dispatchEvent(event);
      answerBtn.click();
    } else if (continueBtn) {
      continueBtn.click();
    } else {
      const option = document.querySelector(
        'div[aria-label="' + data[txt] + '"]'
      );
      option.click();
    }
  }, 500);
})();
