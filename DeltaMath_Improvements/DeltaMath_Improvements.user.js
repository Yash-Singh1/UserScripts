// ==UserScript==
// @name         DeltaMath Improvements
// @namespace    https://github.com/Yash-Singh1/UserScripts
// @version      0.5
// @description  Various Improvements to the DeltaMath Student Page
// @author       Yash Singh
// @match        https://www.deltamath.com/app/student/*
// @match        https://www.deltamath.com/app/student
// @icon         https://deltamath.com/new3/images/flav3.png
// @grant        none
// @homepage     https://github.com/Yash-Singh1/UserScripts/tree/main/DeltaMath_Improvements#readme
// @homepageURL  https://github.com/Yash-Singh1/UserScripts/tree/main/DeltaMath_Improvements#readme
// @supportURL   https://github.com/Yash-Singh1/UserScripts/issues
// @license      MIT
// @downloadURL  https://raw.githubusercontent.com/Yash-Singh1/UserScripts/main/DeltaMath_Improvements/DeltaMath_Improvements.user.js
// @updateURL    https://raw.githubusercontent.com/Yash-Singh1/UserScripts/main/DeltaMath_Improvements/DeltaMath_Improvements.user.js
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

    span[style*="color:red;"] {
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
    if (
      document.documentElement.innerText.includes(
        'Sum of Triangle Angles Proof (Guided)'
      )
    ) {
      let initialCursor = false;

      if (
        ![...document.querySelectorAll('div')].find(
          (div) =>
            (div.innerText.trim() ===
              'Now move ALL THREE vertices of the triangle above with your mouse.' &&
              div.style.display !== 'none') ||
            div.innerText
              .trim()
              .startsWith('After moving the vertices, the new value of')
        ) ||
        document.documentElement.innerText.includes('You are done!')
      ) {
        initialCursor = true;
      }
      [
        ...document.querySelectorAll(
          '#inner > g[dots="false"][cursor="pointer"][stroke][stroke-width] > circle:nth-child(1)'
        )
      ].forEach((circle) => {
        circle.parentElement.style.cursor = initialCursor
          ? 'initial'
          : 'pointer';
      });
    }
  }).observe(document, { subtree: true, childList: true });
})();
