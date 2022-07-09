// ==UserScript==
// @name         Disable Comment Button in Empty Fields
// @namespace    https://github.com/Yash-Singh1/UserScripts
// @version      1.0
// @description  Disables the comment button on empty textarea in gists
// @author       Yash Singh
// @match        https://gist.github.com/*
// @icon         https://github.githubassets.com/favicons/favicon.svg
// @grant        none
// @homepage     https://github.com/Yash-Singh1/UserScripts/tree/main/Disable_Comment_on_Empty_Field#readme
// @homepageURL  https://github.com/Yash-Singh1/UserScripts/tree/main/Disable_Comment_on_Empty_Field#readme
// @supportURL   https://github.com/Yash-Singh1/UserScripts/issues
// @license      MIT
// @downloadURL  https://raw.githubusercontent.com/Yash-Singh1/UserScripts/main/Disable_Comment_on_Empty_Field/Disable_Comment_on_Empty_Field.user.js
// @updateURL    https://raw.githubusercontent.com/Yash-Singh1/UserScripts/main/Disable_Comment_on_Empty_Field/Disable_Comment_on_Empty_Field.user.js
// ==/UserScript==

(function () {
  'use strict';

  if (
    document.querySelector('#new_comment_field') &&
    document.querySelector('#partial-new-comment-form-actions > button')
  ) {
    function checkAndDisable() {
      setTimeout(() => {
        if (
          document.querySelector('#new_comment_field').value.length === 0 &&
          !document.querySelector('#partial-new-comment-form-actions > button')
            .disabled
        ) {
          document.querySelector(
            '#partial-new-comment-form-actions > button'
          ).disabled = true;
        } else if (
          document.querySelector('#new_comment_field').value.length !== 0
        ) {
          document.querySelector(
            '#partial-new-comment-form-actions > button'
          ).disabled = false;
        }
      }, 0);
    }

    checkAndDisable();
    document.querySelector('#new_comment_field').onchange =
      document.querySelector('#new_comment_field').onkeydown = checkAndDisable;
  }
})();
