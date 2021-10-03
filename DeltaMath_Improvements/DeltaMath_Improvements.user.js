// ==UserScript==
// @name         DeltaMath Improvements
// @namespace    https://github.com/Yash-Singh1/UserScripts
// @version      0.1
// @description  Various Improvements to the DeltaMath Student Page
// @author       Yash Singh
// @match        https://www.deltamath.com/app/student/*
// @match        https://www.deltamath.com/app/student
// @icon         https://deltamath.com/new3/images/flav3.png
// @grant        none
// ==/UserScript==

(function () {
  'use strict';

  const styles = document.createElement('style');
  styles.id = 'deltamath-improvements';
  styles.innerHTML = `
    body::after {
      content: none;
    }

    .footer::after {
      content: none;
    }

    .navbar {
      border-radius: 0px !important;
    }

    .navbar .navbar-brand.deltamath-brand {
      cursor: pointer;
    }

    #instructions {
      color: black !important;
    }

    line[stroke="red"] {
      stroke: black !important;
    }

    span[style="color:red;"] {
      color: black !important;
    }

    text[fill="red"] {
      fill: black !important;
    }
    `;

  document.head.appendChild(styles);

  new MutationObserver(() => {
    const links = [...document.querySelectorAll('a')];
    let foundLink;
    if (
      (foundLink = links.find((link) => link.innerHTML === 'Watch help video'))
    ) {
      foundLink.innerHTML = 'Show help video';
    }
  }).observe(document, { subtree: true, childList: true });
})();
