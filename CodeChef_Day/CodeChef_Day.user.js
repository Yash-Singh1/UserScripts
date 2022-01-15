// ==UserScript==
// @name         CodeChef Day
// @namespace    https://github.com/Yash-Singh1/UserScripts
// @version      0.1
// @description  Tells the day for CodeChef contests on the contests page
// @author       Yash Singh
// @match        https://www.codechef.com/contests
// @icon         https://t1.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=http://codechef.com&size=16
// @grant        none
// @homepage     https://github.com/Yash-Singh1/UserScripts/tree/main/CodeChef_Day#readme
// @homepageURL  https://github.com/Yash-Singh1/UserScripts/tree/main/CodeChef_Day#readme
// @supportURL   https://github.com/Yash-Singh1/UserScripts/issues
// @license      MIT
// @downloadURL  https://raw.githubusercontent.com/Yash-Singh1/UserScripts/main/CodeChef_Day/CodeChef_Day.user.js
// @updateURL    https://raw.githubusercontent.com/Yash-Singh1/UserScripts/main/CodeChef_Day/CodeChef_Day.user.js
// ==/UserScript==

(function () {
  'use strict';

  document.querySelector('span#timezone_on > a').click();

  function realDay(day) {
    switch (day) {
      case 0:
        return 'Sunday';
      case 1:
        return 'Monday';
      case 2:
        return 'Tuesday';
      case 3:
        return 'Wednesday';
      case 4:
        return 'Thursday';
      case 5:
        return 'Friday';
      case 6:
        return 'Saturday';
    }
  }

  setInterval(() => {
    document.querySelectorAll('.start_date:not(.day-also)').forEach((row) => {
      row.innerText = `${realDay(
        new Date(row.getAttribute('data-starttime')).getDay()
      )}, ${row.innerText}`;
      row.classList.add('day-also');
    });
  }, 1000);
})();
