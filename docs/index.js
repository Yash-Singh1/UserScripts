AOS.init();
function scrollMore() {
  document
    .getElementById('more-container')
    .scrollIntoView({ behavior: 'smooth' });
}
if (location.hash === '#more') {
  setTimeout(() => scrollMore(), 250);
}
