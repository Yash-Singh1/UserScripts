// ==UserScript==
// @name         USACO Printing
// @namespace    https://github.com/Yash-Singh1/UserScripts
// @version      0.1
// @description  Makes printing out USACO problems a lot easier
// @author       Yash Singh
// @match        http://www.usaco.org/*
// @icon         http://www.usaco.org/current/images/usaco_logo.png
// @grant        none
// @homepage     https://github.com/Yash-Singh1/UserScripts/tree/main/USACO_Printing#readme
// @homepageURL  https://github.com/Yash-Singh1/UserScripts/tree/main/USACO_Printing#readme
// @supportURL   https://github.com/Yash-Singh1/UserScripts/issues
// @license      MIT
// @downloadURL  https://raw.githubusercontent.com/Yash-Singh1/UserScripts/main/USACO_Printing/USACO_Printing.user.js
// @updateURL    https://raw.githubusercontent.com/Yash-Singh1/UserScripts/main/USACO_Printing/USACO_Printing.user.js
// ==/UserScript==

(function () {
  'use strict';

  if (!document.querySelector('.problem-text')) {
    return;
  }
  let interval = setInterval(() => {
    if (document.querySelector('style')) {
      clearInterval(interval);
      runMainCode();
    }
  }, 100);
  function runMainCode() {
    const styles = document.createElement('style');
    styles.innerHTML = `
      @media print {
        body *:not(body > div, .shadow1, .shadow1 > .content, .problem-container, .problem-text, .problem-text *:not(script), body > br) {
          display: none;
        }
        .problem-container {
          top: 0 !important;
        }
        .problem-text {
          border: none;
        }
        html,
        body {
          margin: 0;
          padding: 0;
        }
        .problem-text {
          margin-top: auto;
        }
      }
`;
    document
      .querySelector('.problem-text')
      .parentElement.classList.add('problem-container');
    document.querySelector('style').before(styles);
    document.querySelector('.panel').innerHTML =
      document.querySelector('.panel').innerHTML +
      '\n<button onclick="window.print()">Print</button>';
  }
})();
