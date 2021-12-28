AOS.init();

function scrollMore() {
  document
    .getElementById('more-container')
    .scrollIntoView({ behavior: 'smooth' });
}

if (location.hash === '#more') {
  setTimeout(() => scrollMore(), 250);
}

function reactToQuery() {
  let searchQuery = new URLSearchParams(location.search).get('q');
  if (!searchQuery) {
    searchQuery = '';
  }
  document.getElementById('card-search').value = searchQuery;
  let invisible = 0;
  for (card of document.querySelectorAll('userscript-card')) {
    if (
      typeof card.innerText
        .replaceAll(/\s+/g, '\n')
        .replace(/\nGitHub\nInstall$/, '')
        .split('\n')
        .find((line) => line.toLowerCase().includes(searchQuery)) ===
        'undefined' &&
      typeof card
        .querySelector('.card-keywords')
        .innerText.split(/\s+/)
        .find((part) => part.includes(searchQuery)) === 'undefined'
    ) {
      card.classList.add('d-none');
      invisible++;
    } else {
      card.classList.remove('d-none');
    }
  }
  if (invisible === document.querySelectorAll('userscript-card').length) {
    document.getElementById('none-found').style.display = 'block';
  } else {
    document.getElementById('none-found').style.display = 'none';
  }
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
      <p class="card-keywords d-none">${this.getAttribute('keywords') || ''}</p>
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

reactToQuery();

function submitted() {
  window.history.pushState(
    '',
    '',
    `?q=${document.getElementById('card-search').value}${location.hash}`
  );
  reactToQuery();
}

document.getElementById('search-btn').addEventListener('click', submitted);
document.getElementById('card-search').addEventListener('keypress', (event) => {
  if (event.code === 'Enter') {
    submitted();
  }
});
