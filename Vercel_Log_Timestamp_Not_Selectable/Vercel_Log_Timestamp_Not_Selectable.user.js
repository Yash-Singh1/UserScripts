// ==UserScript==
// @name         Vercel Log Timestamp Not Selectable
// @namespace    https://github.com/Yash-Singh1/UserScripts
// @version      0.1
// @description  Make the timestamps not selectable in Vercel logs
// @author       Yash Singh
// @match        https://vercel.com/*/*/*
// @icon         https://assets.vercel.com/image/upload/front/favicon/vercel/favicon.ico
// @grant        none
// @homepage     https://github.com/Yash-Singh1/UserScripts/tree/main/Vercel_Log_Timestamp_Not_Selectable#readme
// @homepageURL  https://github.com/Yash-Singh1/UserScripts/tree/main/Vercel_Log_Timestamp_Not_Selectable#readme
// @supportURL   https://github.com/Yash-Singh1/UserScripts/issues
// @license      MIT
// @downloadURL  https://raw.githubusercontent.com/Yash-Singh1/UserScripts/main/Vercel_Log_Timestamp_Not_Selectable/Vercel_Log_Timestamp_Not_Selectable.user.js
// @updateURL    https://raw.githubusercontent.com/Yash-Singh1/UserScripts/main/Vercel_Log_Timestamp_Not_Selectable/Vercel_Log_Timestamp_Not_Selectable.user.js
// ==/UserScript==

(function () {
  'use strict';

  const styles = document.createElement('style');
  styles.innerText = `
    .realtime-log_timestamp__3Y1_M {
        user-select: none;
        -moz-user-select: none;
        -khtml-user-select: none;
        -webkit-user-select: none;
        -o-user-select: none;
    }
    `;
  document.head.appendChild(styles);
})();
