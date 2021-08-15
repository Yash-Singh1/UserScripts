// ==UserScript==
// @name         StudentVue Mark All Unread
// @namespace    https://github.com/Yash-Singh1/UserScripts
// @version      0.2
// @description  Marks all StudentVue/ParentVue messages as unread (button)
// @author       Yash Singh
// @match        https://*/*
// @match        http://*/*
// @icon         https://parentvue.cusdk8.org/synergy.ico
// @grant        none
// @homepage     https://github.com/Yash-Singh1/UserScripts/tree/main/StudentVue_Mark_All_Unread#readme
// @homepageURL  https://github.com/Yash-Singh1/UserScripts/tree/main/StudentVue_Mark_All_Unread#readme
// @supportURL   https://github.com/Yash-Singh1/UserScripts/issues
// @license      MIT
// @downloadURL  https://raw.githubusercontent.com/Yash-Singh1/UserScripts/main/StudentVue_Mark_All_Unread/StudentVue_Mark_All_Unread.user.js
// @updateURL    https://raw.githubusercontent.com/Yash-Singh1/UserScripts/main/StudentVue_Mark_All_Unread/StudentVue_Mark_All_Unread.user.js
// ==/UserScript==

(function () {
  'use strict';

  if (!document.getElementById('PXPMessages')) {
    return;
  }

  const searchParams = new URLSearchParams(location.search);

  if (!searchParams.get('PAGE')) {
    location.search = location.search + '&PAGE=0';
  }

  function markAllUnreadFn() {
    document.querySelectorAll('.UnreadMessage').forEach((el) => el.click());
    const nextPageBtn = [...document.querySelectorAll('#MainDiv a')].find(
      (el) => el.href.includes('AGU=') && el.href.includes('PAGE=') && el.innerHTML.toLowerCase().includes('next')
    );
    if (nextPageBtn) {
      location.href = nextPageBtn.href + '&UNREAD=true&UNREAD_PAGE=' + (searchParams.get('UNREAD_PAGE') || searchParams.get('PAGE'));
    } else if (searchParams.get('UNREAD') === 'true') {
      location.search = location.search.replace(/(PAGE=)\d+/, '$1' + searchParams.get('UNREAD_PAGE')).replace(/&UNREAD=true&UNREAD_PAGE=\d+/, '');
    }
  }

  if (searchParams.get('UNREAD') === 'true') {
    markAllUnreadFn();
  }

  let markAllUnreadBtn = document.createElement('div');
  markAllUnreadBtn.innerHTML = '<div class="layout-column"><a style="cursor: pointer;" id="mark-all-unread">Mark All As Unread</a></div>';
  markAllUnreadBtn.classList.add('layout-table');
  markAllUnreadBtn.classList.add('middle');
  markAllUnreadBtn.classList.add('padded');
  markAllUnreadBtn.classList.add('divided');
  markAllUnreadBtn.classList.add('pull-left');
  document.querySelector('#MainDiv > h1').after(markAllUnreadBtn);
  document.querySelector('#mark-all-unread').onclick = markAllUnreadFn;
})();
