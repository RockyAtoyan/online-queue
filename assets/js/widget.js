class Widget {
  rootId = 'queue-widget';

  url_widget = 'http://localhost:3000/widgets/';

  constructor(id, rootId = 'queue-widget') {
    this.url_widget += id;
    this.rootId = rootId
  }

  init() {
    const root = document.getElementById(this.rootId);
    if (!root) {
      console.log('The specified block id="' + this.rootId + '" is missing');
      return;
    }
    try {
      const XHR =
        'onload' in new XMLHttpRequest() ? XMLHttpRequest : XDomainRequest;
      const xhr = new XHR();
      xhr.open('GET', this.url_widget, true);
      xhr.onload = function () {
        if (this.response) {
          root.innerHTML = this.response;
        }
      };
      xhr.onerror = function () {
        console.log('onerror ' + this.status);
      };
      xhr.send();
    } catch (e) {}
  }

  addStyle() {
    const style = document.createElement('link');
    style.rel = 'stylesheet';
    style.type = 'text/css';
    style.href = this.url_style;
    document.head.appendChild(style);
  }
}
