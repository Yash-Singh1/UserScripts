// ==UserScript==
// @name         Udemy XML Encoding Fix
// @namespace    https://github.com/Yash-Singh1/UserScripts
// @version      0.1
// @description  Fix Udemy's XML Encoding Problem
// @author       Yash Singh
// @match        https://*.udemy.com/course/*/learn/quiz/*
// @icon         https://www.google.com/s2/favicons?domain=udemy.com
// @grant        none
// @homepage     https://github.com/Yash-Singh1/UserScripts/tree/main/Udemy_XML_Encoding_Fix#readme
// @homepageURL  https://github.com/Yash-Singh1/UserScripts/tree/main/Udemy_XML_Encoding_Fix#readme
// @supportURL   https://github.com/Yash-Singh1/UserScripts/issues
// @license      MIT
// @downloadURL  https://raw.githubusercontent.com/Yash-Singh1/UserScripts/main/Udemy_XML_Encoding_Fix/Udemy_XML_Encoding_Fix.user.js
// @updateURL    https://raw.githubusercontent.com/Yash-Singh1/UserScripts/main/Udemy_XML_Encoding_Fix/Udemy_XML_Encoding_Fix.user.js
// ==/UserScript==

(async function () {
  'use strict';

  let editor;
  do {
    editor = document.getElementById('editor');
    if (editor && editor.env) {
      console.log(editor.env.editor.session.getValue());
    }
    await new Promise((resolve) => setTimeout(() => resolve(true), 200));
    if (editor && editor.env) {
      editor.env.editor.session.setValue(
        editor.env.editor.session
          .getValue()
          .replaceAll('&lt;', '<')
          .replaceAll('&gt;', '>')
          .replaceAll('&quot;', '"')
          .replaceAll('&apos;', "'")
          .replaceAll('&amp;', '&')
      );
      break;
    }
  } while (!editor);
})();
