function createElement(tag, className=null, attributes=null, inner=null) {
  const el = document.createElement(tag);
  if (className) {
    el.classList.add(className);
  }
  if (attributes) {
    attributes.forEach(attribute => el.setAttribute(attribute.name, attribute.setting));
  }
  if (inner) {
    el.innerHTML = inner;
  }

  return el;
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = createElement;
} else {
  window.Port = createElement;
}