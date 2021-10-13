AOS.init();

function scrollMore() {
  document
    .getElementById('more-container')
    .scrollIntoView({ behavior: 'smooth' });
}

if (location.hash === '#more') {
  setTimeout(() => scrollMore(), 250);
}

class UserScriptCardElement extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    this.classList.add('card');
    const shortName =
      this.getAttribute('short-name') ||
      this.getAttribute('name').replaceAll(' ', '_');
    this.innerHTML = `
    <div class="card-body">
      <h5 class="card-title">${this.getAttribute('name')}</h5>
      <p class="card-text">
        ${this.innerHTML}
      </p>
      <a
        href="https://github.com/Yash-Singh1/UserScripts/tree/main/${shortName}#readme"
        class="btn btn-primary"
        target="_blank"
      >
        GitHub
      </a>
      <a
        href="https://github.com/Yash-Singh1/UserScripts/raw/main/${shortName}/${shortName}.user.js"
        class="install btn btn-primary"
      >
        Install
      </a>
    </div>
`;
  }
}

customElements.define('userscript-card', UserScriptCardElement);
