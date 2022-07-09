// ==UserScript==
// @name         CoolMathGames Free FullScreen
// @namespace    https://github.com/Yash-Singh1/UserScripts
// @version      0.1
// @description  Fullscreen gaming for free on coolmathgames
// @author       Yash Singh
// @match        https://www.coolmathgames.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=coolmathgames.com
// @grant        none
// @homepage     https://github.com/Yash-Singh1/UserScripts/tree/main/CoolMathGames_Free_FullScreen#readme
// @homepageURL  https://github.com/Yash-Singh1/UserScripts/tree/main/CoolMathGames_Free_FullScreen#readme
// @supportURL   https://github.com/Yash-Singh1/UserScripts/issues
// @license      MIT
// @downloadURL  https://raw.githubusercontent.com/Yash-Singh1/UserScripts/main/CoolMathGames_Free_FullScreen/CoolMathGames_Free_FullScreen.user.js
// @updateURL    https://raw.githubusercontent.com/Yash-Singh1/UserScripts/main/CoolMathGames_Free_FullScreen/CoolMathGames_Free_FullScreen.user.js
// ==/UserScript==

(function() {
    'use strict';

    if (document.querySelector('.game-field-wrapper')) {
        alert('here')
        const interval = setInterval(() => {
            if (document.querySelector('span.big-screen-popover-span')) {
                const btn = document.createElement('button');
                btn.innerText = 'Fullscreen';
                btn.onclick = () => {
                    location.pathname += '/play';
                };
                document.querySelector('.immerse-button').before(btn);
                clearInterval(interval);
            }
        }, 500);
    }
})();
