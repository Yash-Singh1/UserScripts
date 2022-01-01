// ==UserScript==
// @name         Disappear Play Button Udemy
// @namespace    https://github.com/Yash-Singh1/UserScripts
// @version      0.1
// @description  Makes the play button disappear when the video is inactive to let you view the content (like other streaming platforms)
// @author       Yash Singh
// @match        https://*.udemy.com/course/*/learn/lecture/*
// @icon         https://www.google.com/s2/favicons?domain=udemy.com
// @grant        none
// @homepage     https://github.com/Yash-Singh1/UserScripts/tree/main/Disappear_Play_Button_Udemy#readme
// @homepageURL  https://github.com/Yash-Singh1/UserScripts/tree/main/Disappear_Play_Button_Udemy#readme
// @supportURL   https://github.com/Yash-Singh1/UserScripts/issues
// @license      MIT
// @downloadURL  https://raw.githubusercontent.com/Yash-Singh1/UserScripts/main/Disappear_Play_Button_Udemy/Disappear_Play_Button_Udemy.user.js
// @updateURL    https://raw.githubusercontent.com/Yash-Singh1/UserScripts/main/Disappear_Play_Button_Udemy/Disappear_Play_Button_Udemy.user.js
// ==/UserScript==

(async function () {
  "use strict";

  const observer = new MutationObserver(() => {
    if (document.querySelector(".vjs-user-inactive")) {
      document.querySelector(
        '[class*="video-player--center--"]'
      ).style.visibility = "hidden";
    } else {
      document.querySelector(
        '[class*="video-player--center--"]'
      ).style.visibility = "visible";
    }
  });
  do {
    if (document.querySelector('[class*="video-player--video-player"]')) {
      observer.observe(
        document.querySelector('[class*="video-player--video-player"]'),
        {
          attributes: true,
        }
      );
      break;
    } else {
      await new Promise((resolve) => setTimeout(() => resolve(true), 200));
    }
  } while (true);
})();
