// ==UserScript==
// @name         XKCD Title Information
// @namespace    https://github.com/Yash-Singh1/UserScripts
// @version      0.1
// @description  Shows extra information on the comic based on the onhover tooltip that some people don't know about
// @author       Yash Singh
// @match        https://xkcd.com/*
// @icon         https://www.google.com/s2/favicons?domain=xkcd.com
// @grant        none
// @homepage     https://github.com/Yash-Singh1/UserScripts/tree/main/XKCD_Title_Information#readme
// @homepageURL  https://github.com/Yash-Singh1/UserScripts/tree/main/XKCD_Title_Information#readme
// @supportURL   https://github.com/Yash-Singh1/UserScripts/issues
// @license      MIT
// @downloadURL  https://raw.githubusercontent.com/Yash-Singh1/UserScripts/main/XKCD_Title_Information/XKCD_Title_Information.user.js
// @updateURL    https://raw.githubusercontent.com/Yash-Singh1/UserScripts/main/XKCD_Title_Information/XKCD_Title_Information.user.js
// ==/UserScript==

(function () {
  'use strict';

  if (document.getElementById('comic')) {
    const p = document.createElement('p');
    p.innerText = `More info: ${document
      .querySelector('#comic > img')
      .getAttribute('title')}`;
    document
      .querySelector('div#middleContainer > a[href*="imgs.xkcd.com"]')
      .after(p);
    document
      .querySelector('div#middleContainer > a[href*="imgs.xkcd.com"]')
      .after(document.createElement('br'));
    const style = document.createElement('style');
    style.innerText = `
    p {
      margin: 0 auto;
      width: 75%;
    }
    `;
    style.classList.add('--xkcd-title-information-styles');
    document.head.appendChild(style);
  }
})();
