// ==UserScript==
// @name         Poki Block Reward Ads
// @namespace    https://github.com/Yash-Singh1/UserScripts
// @version      0.1
// @description  Poki Block Reward Ads
// @author       Yash Singh
// @match        https://*.poki-gdn.com/*/index.html?*
// @icon         https://www.google.com/s2/favicons?domain_url=poki.com
// @grant        none
// @homepage     https://github.com/Yash-Singh1/UserScripts/tree/main/Poki_Block_Reward_Ads#readme
// @homepageURL  https://github.com/Yash-Singh1/UserScripts/tree/main/Poki_Block_Reward_Ads#readme
// @supportURL   https://github.com/Yash-Singh1/UserScripts/issues
// @license      MIT
// @downloadURL  https://raw.githubusercontent.com/Yash-Singh1/UserScripts/main/Poki_Block_Reward_Ads/Poki_Block_Reward_Ads.user.js
// @updateURL    https://raw.githubusercontent.com/Yash-Singh1/UserScripts/main/Poki_Block_Reward_Ads/Poki_Block_Reward_Ads.user.js
// ==/UserScript==

/* global PokiSDK */

(function () {
  'use strict';

  window.addEventListener('load', () => {
    const interval = setInterval(() => {
      if (window.PokiSDK) {
        PokiSDK.rewardedBreak = () => new Promise((r) => r(true));
      }
    }, 1000);
  });
})();
