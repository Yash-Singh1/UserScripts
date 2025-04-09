// ==UserScript==
// @name         T3Chat++
// @namespace    https://github.com/Yash-Singh1/UserScripts
// @version      0.2
// @description  Adds BYOK, local models, and TPS counter to t3.chat
// @author       Yash Singh
// @match        https://t3.chat/*?*
// @match        https://t3.chat/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=t3.chat
// @homepage     https://github.com/Yash-Singh1/UserScripts/tree/main/T3Chat++#readme
// @homepageURL  https://github.com/Yash-Singh1/UserScripts/tree/main/T3Chat++#readme
// @supportURL   https://github.com/Yash-Singh1/UserScripts/issues
// @license      MIT
// @downloadURL  https://raw.githubusercontent.com/Yash-Singh1/UserScripts/main/T3Chat++/T3Chat++.user.js
// @updateURL    https://raw.githubusercontent.com/Yash-Singh1/UserScripts/main/T3Chat++/T3Chat++.user.js
// @grant        unsafeWindow
// @sandbox      raw
// @run-at       document-start
// ==/UserScript==

(function () {
  "use strict";

  /* Note to self, you can set temperature, top-p, and top-k in localStorage */

  // Global map to track message id -> timestamp or TPS
  const messageTimes = new Map();
  let lastActiveMessageId = null;

  function setupHooks() {
    console.log("[T3Chat++] Setting up Hooks!");
    const messagesTable = unsafeWindow.dxdb?.messages;
    if (!messagesTable) {
      console.error("[T3Chat++] messages table not found");
      return;
    }

    messagesTable.hook("creating", function (primKey) {
      messageTimes.set(primKey, null);
    });

    messagesTable.hook("updating", function (mods, primKey) {
      // TODO: fix thinking tokens to also be handled
      if (mods?.status === "deleted" || mods?.status === "thinking") {
        messageTimes.set(primKey, null);
        return;
      }

      if (mods?.status === "streaming" && messageTimes.get(primKey) === null) {
        messageTimes.set(primKey, performance.now());
        lastActiveMessageId = primKey;
      }
    });
  }

  // This function is AI generated just to convert ReadableStream to JSON
  async function readStreamAsJSON(stream) {
    const reader = stream.getReader();
    const chunks = [];

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      chunks.push(value);
    }

    // Concatenate chunks
    const totalLength = chunks.reduce((acc, chunk) => acc + chunk.length, 0);
    const fullArray = new Uint8Array(totalLength);

    let offset = 0;
    for (const chunk of chunks) {
      fullArray.set(chunk, offset);
      offset += chunk.length;
    }

    // Decode bytes to string
    const text = new TextDecoder().decode(fullArray);

    // Parse JSON
    return JSON.parse(text);
  }

  // TODO: implement reasoning somehow (not standardized anywhere)
  async function processOpenAIStream({
    stream: { apiBaseURL, apiKey, apiInput, modelId },
    onTextPart,
    onDataPart,
    onFinishMessagePart,
    onErrorPart,
  }) {
    // TODO: actually fetch title somehow
    onDataPart?.([{ content: { title: "Local LLM placeholder" } }]);

    const response = await fetch(new URL("/v1/chat/completions", apiBaseURL), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(apiKey ? { Authorization: `Bearer ${apiKey}` } : {}),
      },
      body: JSON.stringify({
        model: modelId,
        messages: apiInput.messages,
        temperature: apiInput.temperature,
        stream: true,
        stream_options: {
          include_usage: true,
        },
      }),
    });

    if (!response.ok || !response.body) {
      throw new Error(`API error: ${response.status}\n${await response.text()}`);
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let buffer = "";

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      buffer += decoder.decode(value, { stream: true });

      const lines = buffer.split("\n");
      buffer = lines.pop() ?? "";
      let finish_reason = null;
      let usage = undefined;

      for (const line of lines) {
        const trimmed = line.trim();
        if (!trimmed || !trimmed.startsWith("data:")) continue;

        const data = trimmed.slice(5).trim();
        if (data === "[DONE]") {
          // End of stream
          await onFinishMessagePart?.({
            finishReason: finish_reason,
            usage,
          });
          return;
        }

        let parsed;
        try {
          parsed = JSON.parse(data);
        } catch {
          continue;
        }

        if (parsed?.usage) {
          usage = {};
          usage.completionTokens = parsed?.usage.completion_tokens;
          usage.promptTokens = parsed?.usage.prompt_tokens;
          usage.totalTokens = parsed?.usage.total_tokens;
        }

        const choice = parsed.choices?.[0];
        if (!choice) continue;

        // Handle delta content
        if (choice.delta?.content) {
          await onTextPart?.(choice.delta?.content);
        }

        if (choice.finish_reason) {
          finish_reason = choice.finish_reason;
        }

        // // Handle function_call / tool_call streaming start
        // if (choice.delta?.tool_calls) {
        //   for (const toolCall of choice.delta.tool_calls) {
        //     await onToolCallStreamingStartPart?.({
        //       toolCallId: toolCall.id,
        //       toolName: toolCall.function?.name ?? '',
        //     });
        //   }
        // }

        // // Handle tool_call delta
        // if (choice.delta?.tool_calls) {
        //   for (const toolCall of choice.delta.tool_calls) {
        //     await onToolCallDeltaPart?.({
        //       toolCallId: toolCall.id,
        //       argsTextDelta: toolCall.function?.arguments ?? '',
        //     });
        //   }
        // }

        // // Handle finish reason
        // if (choice.finish_reason) {
        //   await onFinishMessagePart?.({
        //     finishReason: choice.finish_reason,
        //     usage: parsed.usage ?? undefined,
        //   });
        // }
      }
    }
  }

  const TPSID = "__t3_chat_plus_tps";

  function findFormComponentParent() {
    const reactPropKey = Object.keys(document.querySelector("main")).find((key) =>
      key.startsWith("__reactProps"),
    );
    if (!reactPropKey) {
      throw new Error("React Prop Key not found");
    }
    for (const inputBox of document.querySelectorAll("form")) {
      let iterateForFormComponent = inputBox;
      while (
        iterateForFormComponent &&
        (!iterateForFormComponent?.[reactPropKey]?.children?.props ||
          !Object.hasOwn(iterateForFormComponent?.[reactPropKey]?.children?.props, "model")) &&
        !iterateForFormComponent?.[reactPropKey]?.children?.find?.(
          (child) => child?.props && Object.hasOwn(child.props, "model"),
        )
      ) {
        iterateForFormComponent = iterateForFormComponent.parentNode;
      }
      if (iterateForFormComponent) {
        return iterateForFormComponent;
      }
    }
  }

  function insertTPS(tps) {
    let tpsel;
    if ((tpsel = document.getElementById(TPSID))) {
      tpsel.innerText = tps + "tps";
      return;
    }
    const iterateForFormComponent = findFormComponentParent();
    if (iterateForFormComponent) {
      tpsel = document.createElement("p");
      tpsel.innerText = tps + "tps";
      tpsel.style.fontSize = "0.75rem";
      tpsel.style.marginBottom = "0.25rem";
      tpsel.style.marginLeft = "0.5rem";
      tpsel.style.textAlign = "start";
      tpsel.id = TPSID;
      iterateForFormComponent.prepend(tpsel);
    }
  }

  const T3_CHAT_MODAL_ID = "__t3chat_plus_modal";
  const T3_CHAT_MODAL_CONTENT_ID = "__t3chat_plus_modal_content";
  function popupModal() {
    if (document.getElementById(T3_CHAT_MODAL_ID)) {
      document.getElementById(T3_CHAT_MODAL_ID).style.display = "flex";
      return document.getElementById(T3_CHAT_MODAL_ID);
    }
    const modalWrapperDiv = document.createElement("div");
    modalWrapperDiv.id = T3_CHAT_MODAL_ID;
    modalWrapperDiv.style.backgroundColor = "rgba(0, 0, 0, 0.4)";
    modalWrapperDiv.style.width = "100vw";
    modalWrapperDiv.style.height = "100vh";
    modalWrapperDiv.style.zIndex = "9999999";
    modalWrapperDiv.style.position = "absolute";
    modalWrapperDiv.style.top = 0;
    modalWrapperDiv.style.left = 0;
    modalWrapperDiv.style.display = "flex";
    modalWrapperDiv.style.justifyContent = "center";
    modalWrapperDiv.style.alignItems = "center";
    const modalDiv = document.createElement("div");
    modalDiv.style.width = "max-content";
    modalDiv.style.height = "max-content";
    modalDiv.style.padding = "2rem 4rem";
    modalDiv.style.backgroundColor = "hsl(var(--chat-background))";
    modalDiv.style.borderRadius = "0.5rem";
    modalDiv.style.position = "relative";
    const closeSVG = document.createElement("button");
    closeSVG.addEventListener("click", () => {
      document.body.removeChild(document.getElementById(T3_CHAT_MODAL_ID));
    });
    modalDiv.appendChild(closeSVG);
    closeSVG.style.position = "absolute";
    closeSVG.style.top = "8px";
    closeSVG.style.right = "8px";
    closeSVG.style.cursor = "pointer";
    // style="position: absolute; top: 8; right: 8; cursor: pointer;"
    closeSVG.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-x-icon lucide-x"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>`;
    const content = document.createElement("div");
    content.id = T3_CHAT_MODAL_CONTENT_ID;
    modalDiv.appendChild(content);
    modalWrapperDiv.appendChild(modalDiv);
    return modalWrapperDiv;
  }

  const T3_CHAT_LOCAL_MODELS_BTN_ID = "__t3chat_plus_localmodel_button";
  let local_enabled = false;
  let local_set_model = "none";

  function insertLocalModelsBtn(localModels) {
    const iterateForFormComponent = findFormComponentParent();
    if (iterateForFormComponent && !document.getElementById(T3_CHAT_LOCAL_MODELS_BTN_ID)) {
      const modelSelector = iterateForFormComponent.querySelector('button[aria-haspopup="menu"]');
      const modelSelectorParent = modelSelector.parentNode;
      const localModelsBtn = modelSelector.cloneNode(true);
      localModelsBtn.id = T3_CHAT_LOCAL_MODELS_BTN_ID;
      localModelsBtn.removeChild(localModelsBtn.querySelector("svg"));
      localModelsBtn.querySelector("span").innerText = "Local Models";
      localModelsBtn.addEventListener("click", () => {
        console.log("[T3Chat++] Selecting local models");
        const modal = popupModal();
        const modalContent = modal.querySelector(`#${T3_CHAT_MODAL_CONTENT_ID}`);
        // modal.querySelector(`#${T3_CHAT_MODAL_CONTENT_ID}`).innerText = "hi";
        const dropdown = document.createElement("select");
        dropdown.style.padding = "0.25rem";
        dropdown.style.borderRadius = "0.25rem";
        dropdown.style.width = "40ch";
        for (const [index, localModel] of Object.entries(["None", ...localModels])) {
          const option = document.createElement("option");
          if (localModel === "None") {
            option.value = "none";
            option.innerText = localModel;
          } else {
            option.value = index.toString();
            option.innerText = localModel.title;
          }
          dropdown.appendChild(option);
        }
        const confirmBtn = document.createElement("button");
        confirmBtn.classList.add("__t3_chat_plus_confirmbtn");
        confirmBtn.style.borderRadius = "4px";
        confirmBtn.innerText = "Confirm";
        confirmBtn.addEventListener("click", () => {
          // console.log(dropdown.value, localModels[Number(dropdown.value) - 1]);
          if (dropdown.value === "none") {
            local_enabled = false;
          } else {
            local_set_model = localModels[Number(dropdown.value) - 1];
            local_enabled = true;
            const currentSetModel = modelSelector.querySelector("span").innerText;
            modelSelector.querySelector("span").innerText = local_set_model.id;
            // TODO: make this more friendly by only changing when the span changes with a MutationObserver
            let disabled_local_model = false;
            modelSelector.addEventListener("click", () => {
              if (disabled_local_model) return;
              local_enabled = false;
              disabled_local_model = true;
              if (modelSelector.querySelector("span").innerText == local_set_model.id) {
                modelSelector.querySelector("span").innerText = currentSetModel;
              }
            });
            // TODO: fix the generated by msg
          }
          document.body.removeChild(document.getElementById(T3_CHAT_MODAL_ID));
        });
        modalContent.style.display = "flex";
        modalContent.style.flexDirection = "column";
        modalContent.style.gap = "0.5rem";
        const style = document.createElement("style");
        style.innerHTML = `
        .__t3_chat_plus_confirmbtn {
          background-color: hsl(var(--primary));
          transition-duration: 0.1s;
          cursor: pointer;
        }
        .__t3_chat_plus_confirmbtn:hover {
          background-color: hsla(var(--primary) / 0.7);
          transition-duration: 0.25s;
        }`;
        modal.appendChild(style);
        modalContent.appendChild(dropdown);
        modalContent.appendChild(confirmBtn);
        document.body.appendChild(modal);
      });
      modelSelectorParent.appendChild(localModelsBtn);
      return true;
    }
    return false;
  }

  function insertLocalModelsBtnWait(localModels, timeout = 10000) {
    let counter = 0;
    const timerId = setInterval(() => {
      if (insertLocalModelsBtn(localModels)) return clearInterval(timerId);
      counter++;
      if (counter >= timeout / 50) clearInterval(timerId);
    }, 50);
  }

  function patchModuleFactories(modules) {
    for (const [chunkId, factory] of Object.entries(modules)) {
      if (typeof factory !== "function") continue;

      const factoryStr = factory.toString();

      if (
        factoryStr.includes("onFinishMessagePart") &&
        factoryStr.includes("async function") &&
        factoryStr.includes("getReader")
      ) {
        console.log("[T3Chat++] Patching streaming module:", chunkId);

        modules[chunkId] = function patchedFactory(module, exports, require) {
          const returnValue = factory.call(this, module, exports, require);

          // module.exports is frozen so we need to reset the exports
          const originalModuleExports = module.exports;
          module.exports = {};

          let exportFound = false;
          for (const key of Object.keys(originalModuleExports)) {
            const exported = originalModuleExports[key];
            if (typeof exported === "function" && exported.length === 1 && !exportFound) {
              console.log("[T3Chat++] patching exported function", exported);
              Object.defineProperty(module.exports, key, {
                value: async function wrapped(opts) {
                  // Wrap onFinishMessagePart first so localModels also get tps measurement
                  if (
                    opts &&
                    typeof opts.onFinishMessagePart === "function" &&
                    !opts.onFinishMessagePart._wrapped
                  ) {
                    const orig = opts.onFinishMessagePart;
                    opts.onFinishMessagePart = function (messagePart) {
                      try {
                        const usage = messagePart?.usage;
                        const completionTokens = usage?.completionTokens;
                        if (typeof completionTokens === "number" && lastActiveMessageId != null) {
                          const startTime = messageTimes.get(lastActiveMessageId);
                          if (typeof startTime === "number") {
                            const elapsed = performance.now() - startTime;
                            const tps = completionTokens / (elapsed / 1000);
                            messageTimes.set(lastActiveMessageId, tps);
                            console.log(
                              `[T3Chat++] Message ${lastActiveMessageId} TPS: ${tps.toFixed(2)}`,
                            );
                            insertTPS(tps.toFixed(2));
                          }
                        }
                      } catch (e) {
                        console.warn("Error calculating TPS", e);
                      }
                      return orig.apply(this, arguments);
                    };
                    opts.onFinishMessagePart._wrapped = true;
                    if (
                      opts &&
                      opts.stream &&
                      opts.stream?.local &&
                      typeof opts.stream.local === "boolean" &&
                      opts.stream.local === true
                    ) {
                      return await processOpenAIStream({
                        ...opts,
                        stream: {
                          apiInput: await readStreamAsJSON(opts.stream),
                          apiKey: opts.stream.modelInfo.apiKey,
                          apiBaseURL: opts.stream.modelInfo.apiBaseURL,
                          modelId: opts.stream.modelInfo.id,
                        },
                      });
                    }
                  }
                  return await exported.call(this, opts);
                },
              });
              exportFound = true;
            } else {
              module.exports[key] = exported;
            }
          }
          Object.freeze(module.exports);
          return returnValue;
        };
        break;
      }
    }
  }

  function patchPush(value, origPush) {
    const patchedPush = function (...args) {
      try {
        const modules = args[0][1];
        patchModuleFactories(modules);
      } catch (e) {
        console.warn("Error patching chunk modules", e);
      }
      return origPush.apply(webpackChunk_N_E2, args);
    };
    Object.defineProperty(patchedPush, "toString", {
      value: Array.prototype.push.toString,
    });
    Object.defineProperty(patchedPush, "name", {
      value: Array.prototype.push.name,
    });

    Object.defineProperty(value, "push", {
      configurable: true,
      get() {
        return patchedPush;
      },
      set(newPush) {
        patchPush(value, newPush);
      },
    });
  }

  let webpackChunk_N_E2 = undefined;
  Object.defineProperty(unsafeWindow, "webpackChunk_N_E", {
    configurable: true,
    get() {
      return webpackChunk_N_E2;
    },
    set(value) {
      patchPush(value, value.push);
      webpackChunk_N_E2 = value;
    },
  });

  function waitForDxdb() {
    if (unsafeWindow.dxdb?.messages) {
      setupHooks();
    } else {
      setTimeout(waitForDxdb, 500);
    }
  }

  function patchFetch() {
    const origFetch = unsafeWindow.fetch;
    unsafeWindow.fetch = function (...args) {
      if (local_enabled && (args[0].endsWith("/api/chat") || args?.[1].url === "/api/chat")) {
        return new Promise((resolve) => {
          const response = new Response(
            JSON.stringify({ ...JSON.parse(args[1].body), model: local_set_model.id, local: true }),
          );
          Object.defineProperty(response.body, "local", { value: true });
          Object.defineProperty(response.body, "modelInfo", { value: local_set_model });
          resolve(response);
        });
      } else {
        return origFetch.apply(this, args);
      }
    };
    Object.defineProperty(unsafeWindow.fetch, "name", { value: origFetch.name });
    Object.defineProperty(unsafeWindow.fetch, "toString", { value: origFetch.toString });
  }

  /*
  // This was a quick patch to fix a react-helmet problem
  Object.defineProperty(HTMLMetaElement.prototype, "parentNode", {
    get() {
      if (this.name === "theme-color") return document.head;
      return this.closest("*:not(meta)");
    },
  });
  const origRemoveChild = HTMLHeadElement.prototype.removeChild;
  Object.defineProperty(HTMLHeadElement.prototype, "removeChild", {
    get() {
      let self = this;
      return (...args) => {
        try {
          origRemoveChild.apply(self, args);
        } catch {}
      };
    },
  });
  */

  const originalPushState = history.pushState;
  const originalReplaceState = history.replaceState;

  // Override pushState
  unsafeWindow.history.pushState = function (...args) {
    const result = originalPushState.apply(this, args);
    unsafeWindow.dispatchEvent(new Event("pushstate"));
    unsafeWindow.dispatchEvent(new Event("historystatechanged"));
    return result;
  };

  // Override replaceState
  unsafeWindow.history.replaceState = function (...args) {
    const result = originalReplaceState.apply(this, args);
    unsafeWindow.dispatchEvent(new Event("replacestate"));
    unsafeWindow.dispatchEvent(new Event("historystatechanged"));
    return result;
  };

  // Popstate event listener
  unsafeWindow.addEventListener("popstate", () => {
    window.dispatchEvent(new Event("historystatechanged"));
  });

  const LOCAL_MODELS_UI_ID = "__t3_chat_plus_localmodels";
  const LOCAL_MODELS_STORAGE_ID = "__t3_chat_plus_localmodels";
  unsafeWindow.addEventListener("historystatechanged", async () => {
    const currentLocalModels = JSON.parse(localStorage.getItem(LOCAL_MODELS_STORAGE_ID) || "[]");
    if (!location.pathname.startsWith("/settings/")) {
      await waitForElement("main");
      insertLocalModelsBtnWait(currentLocalModels);
    }
    if (location.pathname === "/settings/models") {
      if (!document.getElementById(LOCAL_MODELS_UI_ID)) {
        let currentTab = null;
        while (currentTab === null) {
          await new Promise((resolve) => setTimeout(resolve, 100));
          currentTab = document.querySelector('div[role="tablist"] ~ div[data-state="active"]');
        }
        const mainTabFrame = currentTab.querySelector("div");
        const localModelTabFrame = mainTabFrame.cloneNode(/* deep = */ true);
        localModelTabFrame.id = LOCAL_MODELS_UI_ID;
        localModelTabFrame.querySelector("h2").innerText = "Custom Models";
        localModelTabFrame.querySelector("p").innerText =
          "Choose custom and local models with your own configured providers.";
        const styles = document.createElement("style");
        styles.innerText = `
          #__t3_chat_plus_localmodels button:not(.__t3chat_plus_button) {
            cursor: not-allowed;
            pointer-events: none;
          }
        `;
        localModelTabFrame.appendChild(styles);

        let filterBtn = null;
        for (const btn of localModelTabFrame.querySelectorAll("button")) {
          if (btn.innerText.toLowerCase().includes("filter by features")) {
            filterBtn = btn;
            break;
          }
        }
        const addBtn = filterBtn.cloneNode(true);
        const addBtnParent = filterBtn.parentNode;
        filterBtn.parentNode.removeChild(filterBtn);
        addBtn.innerText = "Add new model";
        addBtn.classList.add("__t3chat_plus_button");

        function promptModelInfo(defaultID = "", defaultBaseURL = "", defaultAPIKey = "") {
          const id = window.prompt("Model ID", defaultID);
          const apiBaseURL = window.prompt("Provider Base URL", defaultBaseURL);
          const apiKey = window.prompt("API Key (optional)", defaultAPIKey);
          return { id, apiBaseURL, apiKey };
        }

        addBtn.addEventListener("click", async () => {
          const { id, apiBaseURL, apiKey } = promptModelInfo();
          if (id && apiBaseURL) {
            let title = id;
            try {
              const modelList = await fetch(new URL("/v1/models", apiBaseURL), { mode: "no-cors" });
              const foundModel = modelList.find((model) => model.id === id);
              if (foundModel && foundModel.display_name) {
                title = foundModel.display_name;
              }
            } catch {}
            currentLocalModels.push({ id, apiBaseURL, apiKey, title, enabled: true });
            localStorage.setItem(LOCAL_MODELS_STORAGE_ID, JSON.stringify(currentLocalModels));
            renderLocalModels();
            alert("Successfully added model!");
          }
        });
        addBtnParent.appendChild(addBtn);

        const scrollContainer = localModelTabFrame.querySelector("div.overflow-y-auto");
        const modelCard = scrollContainer.children[0].cloneNode(/* deep = */ true);
        scrollContainer.innerHTML = "";

        // Quasar Alpha SVG
        modelCard.querySelector("svg").parentNode.innerHTML =
          `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" class="h-full w-full" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-house-icon lucide-house"><path d="M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8"/><path d="M3 10a2 2 0 0 1 .709-1.528l7-5.999a2 2 0 0 1 2.582 0l7 5.999A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/></svg>`;
        function renderLocalModels() {
          scrollContainer.innerHTML = "";
          for (const [index, currentLocalModel] of Object.entries(currentLocalModels)) {
            const currentLocalModelCard = modelCard.cloneNode(/* deep = */ true);

            // Model info
            currentLocalModelCard.querySelector("h3").parentNode.innerHTML =
              `<h3>${currentLocalModel.title
                .replace(/&/g, "&amp;")
                .replace(/</g, "&lt;")
                .replace(/>/g, "&gt;")
                .replace(/"/g, "&quot;")
                .replace(/'/g, "&#039;")}</h3>`;
            currentLocalModelCard.querySelector("p").innerText =
              `Model: ${currentLocalModel.id}, Provider: ${currentLocalModel.apiBaseURL}`;
            currentLocalModelCard
              .querySelector("p")
              .parentNode.removeChild(
                currentLocalModelCard.querySelector("p").parentNode.querySelector("button"),
              );

            // Button to edit model
            let searchButton = null;
            for (const btn of currentLocalModelCard.querySelectorAll("button")) {
              if (btn.innerText.toLowerCase().includes("search url")) {
                searchButton = btn;
                break;
              }
            }
            const editButton = searchButton.cloneNode(true);
            const deleteButton = searchButton.cloneNode(true);
            const editButtonParentParent = searchButton.parentNode;
            const editButtonParent = document.createElement("div");
            searchButton.parentNode.removeChild(searchButton);
            editButton.innerText = "Edit";
            const editButtonSvg = document.createElement("svg");
            editButton.prepend(editButtonSvg);
            editButtonSvg.outerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-pencil-icon lucide-pencil"><path d="M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z"/><path d="m15 5 4 4"/></svg>`;
            editButton.classList.add("__t3chat_plus_button");
            editButton.addEventListener("click", async () => {
              const { id, apiBaseURL, apiKey } = promptModelInfo(
                currentLocalModel.id,
                currentLocalModel.apiBaseURL,
                currentLocalModel.apiKey,
              );
              if (id && apiBaseURL) {
                currentLocalModels[index].id = id;
                currentLocalModels[index].apiBaseURL = apiBaseURL;
                currentLocalModels[index].apiKey = apiKey;
                let title = id;
                try {
                  const modelList = await fetch(new URL("/v1/models", apiBaseURL), {
                    mode: "no-cors",
                  });
                  const foundModel = modelList.find((model) => model.id === id);
                  if (foundModel && foundModel.display_name) {
                    title = foundModel.display_name;
                  }
                } catch {}
                currentLocalModels[index].title = title;
                localStorage.setItem(LOCAL_MODELS_STORAGE_ID, JSON.stringify(currentLocalModels));
                renderLocalModels();
              }
            });
            editButtonParent.appendChild(editButton);
            deleteButton.innerText = "Delete";
            const deleteButtonSvg = document.createElement("svg");
            deleteButton.prepend(deleteButtonSvg);
            deleteButtonSvg.outerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-trash2-icon lucide-trash-2"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><line x1="10" x2="10" y1="11" y2="17"/><line x1="14" x2="14" y1="11" y2="17"/></svg>`;
            deleteButton.classList.add("__t3chat_plus_button");
            deleteButton.addEventListener("click", () => {
              currentLocalModels = [
                ...currentLocalModes.slice(0, index),
                ...currentLocalModels.slice(index + 1),
              ];
              localStorage.setItem(LOCAL_MODELS_STORAGE_ID, JSON.stringify(currentLocalModels));
              renderLocalModels();
            });
            editButtonParent.appendChild(deleteButton);
            editButtonParent.style.display = "flex";
            editButtonParent.style.flexDirection = "row";
            editButtonParentParent.appendChild(editButtonParent);

            for (const editButtonSibling of editButtonParentParent.children) {
              if (editButtonSibling !== editButtonParent) {
                editButtonSibling.style.visibility = "hidden";
              }
            }

            const switchBtn = currentLocalModelCard.querySelector('button[role="switch"]');
            switchBtn.classList.add("__t3chat_plus_button");
            setSwitchState(switchBtn, currentLocalModel.enabled);
            switchBtn.addEventListener("click", () => {
              currentLocalModels[index].enabled = !currentLocalModels[index].enabled;
              localStorage.setItem(LOCAL_MODELS_STORAGE_ID, JSON.stringify(currentLocalModels));
              setSwitchState(switchBtn, currentLocalModels[index].enabled);
            });

            scrollContainer.appendChild(currentLocalModelCard);
          }
        }
        renderLocalModels();

        if (!document.getElementById(LOCAL_MODELS_UI_ID)) {
          currentTab.appendChild(localModelTabFrame);
        }
      }
    }
  });

  function waitForElement(selector, timeout = 10000) {
    return new Promise((resolve, reject) => {
      const element = document.querySelector(selector);
      if (element) {
        resolve(element);
        return;
      }

      const observer = new MutationObserver(() => {
        const el = document.querySelector(selector);
        if (el) {
          observer.disconnect();
          resolve(el);
        }
      });

      observer.observe(document.documentElement, {
        childList: true,
        subtree: true,
      });

      if (timeout) {
        setTimeout(() => {
          observer.disconnect();
          reject(new Error(`Timeout waiting for element: ${selector}`));
        }, timeout);
      }
    });
  }

  function setSwitchState(switchBtn, switchEnabled) {
    switchBtn.setAttribute("aria-checked", switchEnabled.toString());
    switchBtn.setAttribute("data-state", switchEnabled ? "checked" : "unchecked");
    switchBtn
      .querySelector("span")
      .setAttribute("data-state", switchEnabled ? "checked" : "unchecked");
  }

  patchFetch();
  waitForDxdb();
})();
