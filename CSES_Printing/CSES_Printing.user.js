// ==UserScript==
// @name         CSES Printing
// @namespace    https://github.com/Yash-Singh1/UserScripts
// @version      0.1
// @description  Ability to print out CSES problems
// @author       Yash Singh
// @match        https://cses.fi/problemset/task/*
// @match        https://cses.fi/problemset/task/*/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=cses.fi
// @grant        none
// @homepage     https://github.com/Yash-Singh1/UserScripts/tree/main/CSES_Printing#readme
// @homepageURL  https://github.com/Yash-Singh1/UserScripts/tree/main/CSES_Printing#readme
// @supportURL   https://github.com/Yash-Singh1/UserScripts/issues
// @license      MIT
// @downloadURL  https://raw.githubusercontent.com/Yash-Singh1/UserScripts/main/CSES_Printing/CSES_Printing.user.js
// @updateURL    https://raw.githubusercontent.com/Yash-Singh1/UserScripts/main/CSES_Printing/CSES_Printing.user.js
// ==/UserScript==

(function() {
    'use strict';

    const style = document.createElement('style');
    style.innerHTML = `
      @media print {
        div.nav.sidebar {
          display: none;
        }

        div.title-block > h3, div.title-block > ul.nav {
          display: none;
        }

        div.title-block > h1 {
          padding: unset;
        }

        body > div.header {
          display: none;
        }

        body {
          color: #000;
        }
      }
    `;
    document.head.appendChild(style);
})();
