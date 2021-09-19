// ==UserScript==
// @name         AWS Federation Shell Environment Variables
// @namespace    https://github.com/Yash-Singh1/UserScripts
// @icon         data:image/png;base64,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
// @version      0.1
// @description  Adds a button to the AWS Federation UI to copy code to paste into the shell
// @author       Yash Singh
// @match        https://*/federate_access
// @grant        none
// @homepage     https://github.com/Yash-Singh1/UserScripts/tree/main/AWS_Federation_Shell_Environment_Variables#readme
// @homepageURL  https://github.com/Yash-Singh1/UserScripts/tree/main/AWS_Federation_Shell_Environment_Variables#readme
// @supportURL   https://github.com/Yash-Singh1/UserScripts/issues
// @license      MIT
// @downloadURL  https://raw.githubusercontent.com/Yash-Singh1/UserScripts/main/AWS_Federation_Shell_Environment_Variables/AWS_Federation_Shell_Environment_Variables.user.js
// @updateURL    https://raw.githubusercontent.com/Yash-Singh1/UserScripts/main/AWS_Federation_Shell_Environment_Variables/AWS_Federation_Shell_Environment_Variables.user.js
// ==/UserScript==

(function () {
  'use strict';

  if (!location.host.startsWith('federation.aws.')) {
    return;
  }

  var x = document.getElementsByClassName('account_right');

  var credentials = '';
  credentials += 'export AWS_ACCESS_KEY_ID="' + x[0].innerHTML + '"\n';
  credentials += 'export AWS_SECRET_ACCESS_KEY="' + x[1].innerHTML + '"\n';
  credentials += 'export AWS_SESSION_TOKEN="' + x[2].innerHTML + '"';

  var btn = document.createElement('button');
  btn.id = 'copy-btn';
  btn.innerHTML = 'Copy Variables';
  btn.onclick = function () {
    navigator.permissions
      .query({ name: 'clipboard-write' })
      .then((permissionStatus) => {
        if (
          permissionStatus.state == 'granted' ||
          permissionStatus.state == 'prompt'
        ) {
          navigator.clipboard.writeText(credentials);
          document.getElementById('copy-btn').innerHTML = 'Copied!';
          document.getElementById('copy-btn').style.backgroundColor = 'green';
          setTimeout(function () {
            document.getElementById('copy-btn').innerHTML = 'Copy Variables';
            document.getElementById('copy-btn').style.backgroundColor = 'gray';
          }, 5000);
        } else {
          alert(
            'Access was denied to clipboard-write, please give access to continue.'
          );
        }
      });
  };

  document.body.appendChild(btn);
})();
