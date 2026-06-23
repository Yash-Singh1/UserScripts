// ==UserScript==
// @name         SemiAnalysis High Contrast Scrollbar
// @namespace    https://github.com/Yash-Singh1/UserScripts
// @version      0.1
// @description  Improves scrollbar contrast on SemiAnalysis article pages
// @author       Yash Singh
// @match        https://newsletter.semianalysis.com/p/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=semianalysis.com
// @grant        none
// @run-at       document-start
// @homepage     https://github.com/Yash-Singh1/UserScripts/tree/main/SemiAnalysis_High_Contrast_Scrollbar#readme
// @homepageURL  https://github.com/Yash-Singh1/UserScripts/tree/main/SemiAnalysis_High_Contrast_Scrollbar#readme
// @supportURL   https://github.com/Yash-Singh1/UserScripts/issues
// @license      MIT
// @downloadURL  https://raw.githubusercontent.com/Yash-Singh1/UserScripts/main/SemiAnalysis_High_Contrast_Scrollbar/SemiAnalysis_High_Contrast_Scrollbar.user.js
// @updateURL    https://raw.githubusercontent.com/Yash-Singh1/UserScripts/main/SemiAnalysis_High_Contrast_Scrollbar/SemiAnalysis_High_Contrast_Scrollbar.user.js
// ==/UserScript==

(function () {
  'use strict';

  const css = `
    :root,
    html,
    body,
    * {
      scrollbar-width: auto !important;
      scrollbar-color: #f2c94c #120d18 !important;
    }

    ::-webkit-scrollbar {
      width: 14px !important;
      height: 14px !important;
    }

    ::-webkit-scrollbar-track {
      background: #120d18 !important;
      border-left: 1px solid #34283d !important;
    }

    ::-webkit-scrollbar-thumb {
      min-height: 48px !important;
      background: linear-gradient(180deg, #f2c94c, #38bdf8) !important;
      border: 3px solid #120d18 !important;
      border-radius: 999px !important;
      box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.35) !important;
    }

    ::-webkit-scrollbar-thumb:hover {
      background: linear-gradient(180deg, #ffe27a, #7dd3fc) !important;
    }

    ::-webkit-scrollbar-thumb:active {
      background: #ffffff !important;
    }

    ::-webkit-scrollbar-corner {
      background: #120d18 !important;
    }
  `;

  const style = document.createElement('style');
  style.textContent = css;

  function install() {
    document.documentElement.appendChild(style);
  }

  if (document.documentElement) {
    install();
  } else {
    document.addEventListener('DOMContentLoaded', install, { once: true });
  }
})();
