// ==UserScript==
// @name         StudentVue Mark All Read
// @namespace    https://github.com/Yash-Singh1/UserScripts
// @version      0.7
// @description  Marks all StudentVue/ParentVue messages as read (button)
// @author       Yash Singh
// @match        https://*/*
// @match        http://*/*
// @icon         https://parentvue.cusdk8.org/synergy.ico
// @grant        none
// @homepage     https://github.com/Yash-Singh1/UserScripts/tree/main/StudentVue_Mark_All_Read#readme
// @homepageURL  https://github.com/Yash-Singh1/UserScripts/tree/main/StudentVue_Mark_All_Read#readme
// @supportURL   https://github.com/Yash-Singh1/UserScripts/issues
// @license      MIT
// @downloadURL  https://raw.githubusercontent.com/Yash-Singh1/UserScripts/main/StudentVue_Mark_All_Read/StudentVue_Mark_All_Read.user.js
// @updateURL    https://raw.githubusercontent.com/Yash-Singh1/UserScripts/main/StudentVue_Mark_All_Read/StudentVue_Mark_All_Read.user.js
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

  async function markAllRead() {
    document.querySelectorAll('.UnreadMessage').forEach((el) => el.click());
    const closeBtn = document.querySelector(
      '#viewMessageDialog > div > div > div.modal-footer > button'
    );

    if (closeBtn) {
      closeBtn.click();
    }

    const nextPageBtn = [...document.querySelectorAll('#MainDiv a')].find(
      (el) =>
        el.href.includes('AGU=') &&
        el.href.includes('PAGE=') &&
        el.innerHTML.toLowerCase().includes('next')
    );

    $(document).ajaxStop(function () {
      if (nextPageBtn) {
        location.href =
          nextPageBtn.href +
          '&READ=true&READ_PAGE=' +
          (searchParams.get('READ_PAGE') || searchParams.get('PAGE'));
      } else if (searchParams.get('READ') === 'true') {
        location.search = location.search
          .replace(/(PAGE=)\d+/, '$1' + searchParams.get('READ_PAGE'))
          .replace(/&READ=true&READ_PAGE=\d+/, '');
      }
    });
  }

  if (searchParams.get('READ') === 'true') {
    markAllRead();
  }

  let ran = false;

  function loadEventListener() {
    ran = true;
    let markAllReadBtn = document.createElement('div');
    markAllReadBtn.innerHTML =
      '<div class="layout-column"><a style="cursor: pointer;" id="mark-all-read">Mark All As Read</a></div>';
    markAllReadBtn.classList.add('layout-table');
    markAllReadBtn.classList.add('middle');
    markAllReadBtn.classList.add('padded');
    markAllReadBtn.classList.add('divided');
    markAllReadBtn.classList.add('pull-left');
    document.querySelector('#MainDiv > h1').after(markAllReadBtn);
    document.querySelector('#mark-all-read').onclick = markAllRead;
  }

  window.addEventListener('load', loadEventListener);

  if (document.readyState === 'complete' && !ran) {
    loadEventListener();
  }
})();
