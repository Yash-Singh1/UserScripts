// ==UserScript==
// @name         USACO Printing
// @namespace    https://github.com/Yash-Singh1/UserScripts
// @version      0.2
// @description  Makes printing out USACO problems a lot easier
// @author       Yash Singh
// @match        http://www.usaco.org/*
// @match        https://www.usaco.org/*
// @match        http://train.usaco.org/*
// @match        https://train.usaco.org/*
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

  if (location.host === 'train.usaco.org') {
    if (location.pathname === '/usacoprob2') {
      // Probably on a training problem page

      document.querySelector('form').parentElement.classList.add('submit');
      const styles = document.createElement('style');
      styles.innerText = `
        @media print {
          .submit, .submit + div, img {
            display: none;
          }
          center {
            text-align: left;
          }
        }
      `;
      document.head.appendChild(styles);
    }
  } else if (document.querySelector('.problem-text')) {
    // Probably a USACO contest problem page

    let interval = setInterval(() => {
      if (document.querySelector('style')) {
        clearInterval(interval);
        runMainCode();
      }
    }, 100);
    function runMainCode() {
      const styles = document.createElement('style');
      styles.innerText = `
        @media print {
          body
            *:not(body > div, .shadow1, .shadow1
              > .content, .problem-container, .problem-text, .problem-text
              *:not(script), body > br, div.panel-container, div.panel-container
              *:not(button)) {
            display: none;
          }

          .panel-container {
            position: static !important;
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
      document
        .querySelector('.panel')
        .parentElement.classList.add('panel-container');
      document.querySelector('style').before(styles);
      document.querySelector('.panel').innerHTML =
        document.querySelector('.panel').innerHTML +
        '\n<button onclick="window.print()">Print</button>';
    }
  }
})();
