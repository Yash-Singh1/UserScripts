// ==UserScript==
// @name         Copy Youtube Video Frame
// @namespace    https://github.com/Yash-Singh1/UserScripts
// @version      0.1
// @description  Copies the current frame from a youtube video
// @author       Yash Singh
// @match        https://www.youtube.com/watch?*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=youtube.com
// @grant        none
// @homepage     https://github.com/Yash-Singh1/UserScripts/tree/main/Copy_Youtube_Video_Frame#readme
// @homepageURL  https://github.com/Yash-Singh1/UserScripts/tree/main/Copy_Youtube_Video_Frame#readme
// @supportURL   https://github.com/Yash-Singh1/UserScripts/issues
// @license      MIT
// @downloadURL  https://raw.githubusercontent.com/Yash-Singh1/UserScripts/main/Copy_Youtube_Video_Frame/Copy_Youtube_Video_Frame.user.js
// @updateURL    https://raw.githubusercontent.com/Yash-Singh1/UserScripts/main/Copy_Youtube_Video_Frame/Copy_Youtube_Video_Frame.user.js
// ==/UserScript==

(function() {
    'use strict';

    function captureVideo(video) {
        var canvas = document.createElement("canvas");
        const box = video.getBoundingClientRect();
        canvas.width = box.width;
        canvas.height = box.height;
        var canvasContext = canvas.getContext("2d");
        canvasContext.drawImage(video, 0, 0, box.width, box.height);
        return canvas.toDataURL('image/png');
    }

    const timer = setInterval(() => {
        const menuSelector = '.ytp-popup.ytp-contextmenu .ytp-panel .ytp-panel-menu';
        const ytmenu = document.querySelector(menuSelector);
        if (ytmenu == null || ytmenu.querySelector('.ytp-menuitem .ytp-menuitem-label') == null) return;
        clearInterval(timer);
        const thirdItem = ytmenu.querySelector('.ytp-menuitem:nth-child(3)');
        const newItem = thirdItem.cloneNode();
        const img = document.createElement('img');
        img.src = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIGhlaWdodD0iMTAwJSIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9IndoaXRlIiBzdHJva2Utd2lkdGg9IjIiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIgY2xhc3M9Imx1Y2lkZSBsdWNpZGUtY29weSI+PHJlY3Qgd2lkdGg9IjE0IiBoZWlnaHQ9IjE0IiB4PSI4IiB5PSI4IiByeD0iMiIgcnk9IjIiLz48cGF0aCBkPSJNNCAxNmMtMS4xIDAtMi0uOS0yLTJWNGMwLTEuMS45LTIgMi0yaDEwYzEuMSAwIDIgLjkgMiAyIi8+PC9zdmc+';
        img.style.height = '24px';
        img.style.width = '24px';
        const newIcon = document.createElement('div');
        newIcon.classList.add('ytp-menuitem-icon');
        newIcon.append(img);
        newItem.append(newIcon);
        const newLabel = document.createElement('div');
        newLabel.classList.add('ytp-menuitem-label');
        newLabel.textContent = 'Copy video frame';
        newItem.append(newLabel);
        const newContent = document.createElement('div');
        newContent.classList.add('ytp-menuitem-content');
        newItem.append(newContent);
        newItem.addEventListener('click', () => {
            const vidElement = document.querySelector('.html5-video-container video');
            const dataUri = captureVideo(vidElement);
            const blob = fetch(dataUri).then(res => res.blob());
            try {
                navigator.clipboard.write([
                    new ClipboardItem({
                        'image/png': blob
                    })
                ]);
            } catch (error) {
                console.error(error);
            }
        });
        thirdItem.parentNode.insertBefore(newItem, thirdItem.nextSibling);
    }, 100);
})();
