// ==UserScript==
// @name         ZSH Docs CSS
// @namespace    https://github.com/Yash-Singh1/UserScripts
// @version      0.1
// @description  Makes the ZSH Docs look amazing with Kumiko CSS
// @author       Yash Singh
// @match        https://zsh.sourceforge.io/*
// @icon         https://raw.githubusercontent.com/melindachang/kumiko/master/.github/assets/logo.svg
// @grant        none
// @homepage     https://github.com/Yash-Singh1/UserScripts/tree/main/ZSH_Docs_CSS#readme
// @homepageURL  https://github.com/Yash-Singh1/UserScripts/tree/main/ZSH_Docs_CSS#readme
// @supportURL   https://github.com/Yash-Singh1/UserScripts/issues
// @license      MIT
// @downloadURL  https://raw.githubusercontent.com/Yash-Singh1/UserScripts/main/ZSH_Docs_CSS/ZSH_Docs_CSS.user.js
// @updateURL    https://raw.githubusercontent.com/Yash-Singh1/UserScripts/main/ZSH_Docs_CSS/ZSH_Docs_CSS.user.js
// ==/UserScript==

(function () {
  'use strict';

  const stylesheet = document.createElement('link');
  stylesheet.rel = 'stylesheet';
  stylesheet.href = 'https://unpkg.com/kumiko@0.0.1/dist/kumiko.css';
  document.head.appendChild(stylesheet);
  const scrollbarStyles = document.createElement('style');
  scrollbarStyles.textContent = `
  :root {
    --scrollbar-width: initial;
  }

  ::-webkit-scrollbar {
    background-color: #202324 !important;
    color: #aba499 !important;
  }

  ::-webkit-scrollbar-corner {
    background-color: #181a1b !important;
  }

  ::-webkit-scrollbar-thumb {
    background-color: #454a4d !important;
  }

  ::-webkit-scrollbar-thumb:hover {
    background-color: #575e62 !important;
  }

  ::-webkit-scrollbar-track {
    background: none;
  }

  a:visited {
    color: #074fff;
  }
`;
  document.head.appendChild(scrollbarStyles);
  document.body.style.padding = '5%';
})();
