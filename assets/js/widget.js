class Widget {
  rootId = 'queue-widget';

  url_widget = 'http://localhost:3000/widgets/';
  url_style = 'http://localhost:3000/css/style.css';

  currentEvent;

  constructor(id, rootId = 'queue-widget') {
    this.url_widget += id;
    this.rootId = rootId;
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
      xhr.onload = (event) => {
        const target = event.currentTarget;
        if (target.response) {
          root.innerHTML = target.response;
          this.addStyle();
          this.addScripts();
          fetch(this.url_widget + '/appointments')
            .then((res) => res.json())
            .then((data) => {
              const calendarRoot = document.getElementById(
                'online-queue-calendar',
              );
              if (!calendarRoot) return;
              calendarRoot.innerHTML = '';
              const calendar = new FullCalendar.Calendar(calendarRoot, {
                initialView: 'dayGridMonth',
                locale: 'ru',
                events: data,
                eventClick: (eventInfo) => {
                  const info = {
                    id: eventInfo.event.id,
                    title: eventInfo.event.title,
                    date: new Date(eventInfo.event.start).toLocaleDateString(),
                    time:
                      new Date(eventInfo.event.start)
                        .toTimeString()
                        .slice(0, 5) +
                      ':' +
                      new Date(eventInfo.event.end).toTimeString().slice(0, 5),
                  };
                  this.openForm(info);
                  this.currentEvent = info;
                },
              });
              calendar.render();
              document
                .getElementById('online-queue-form')
                ?.addEventListener('submit', (event) => {
                  event.preventDefault();
                  const data = new FormData(event.target);
                  const body = {
                    email: data.get('email'),
                    name: data.get('name'),
                    phone: data.get('phone'),
                    appointmentId: data.get('appointmentId'),
                  };
                  fetch(event.target.action, {
                    body: JSON.stringify(body),
                    method: 'post',
                    headers: {
                      'Content-Type': 'application/json',
                    },
                  })
                    .then((res) => res.json())
                    .then((res) => {
                      if (res.error) {
                        this.openError();
                        return;
                      }
                      fetch(this.url_widget + '/appointments')
                        .then((res) => res.json())
                        .then((data) => {
                          calendar.batchRendering(() => {
                            calendar
                              .getEvents()
                              .forEach((event) => event.remove());
                            calendar.addEventSource(data);
                          });
                          this.openSuccess();
                          event.target.reset();
                        });
                    });
                });
              document
                .querySelectorAll('#online-queue-form .close')
                .forEach((btn) => {
                  btn.addEventListener('click', () => {
                    this.closeSuccess();
                    this.closeError();
                    this.closeForm();
                  });
                });
            });
        }
      };
      xhr.onerror = function () {
        console.log('onerror ' + this.status);
      };
      xhr.send();
    } catch (e) {}
  }

  addStyle(styles) {
    const style = document.createElement('link');
    style.rel = 'stylesheet';
    style.type = 'text/css';
    style.href = this.url_style;
    document.head.appendChild(style);
    if (!styles) return;
    const styleTag = document.createElement('style');
    styleTag.innerHTML = `
      :root {
        --fc-border-color: ${styles.calendarBorder};
      }
    `;
    document.head.appendChild(styleTag);
  }

  addScripts(locale = 'ru') {
    const script = document.createElement('script');
    script.src =
      'https://cdn.jsdelivr.net/npm/fullcalendar@6.1.15/index.global.min.js';
    script.setAttribute('defer', true);
    document.head.appendChild(script);
    const localeScript = document.createElement('script');
    localeScript.src = `https://cdn.jsdelivr.net/npm/@fullcalendar/core@6.1.15/locales/${locale}.global.js`;
    localeScript.setAttribute('defer', true);
    document.head.appendChild(localeScript);
  }

  openForm(event) {
    const form = document?.getElementById('online-queue-form');
    if (!form) return;
    const info = document.querySelector('#online-queue-form #info');
    const title = document.createElement('span');
    title.innerText = event.title;
    const date = document.createElement('span');
    date.innerText = event.date;
    const time = document.createElement('span');
    time.innerText = event.time;
    info.appendChild(title);
    info.appendChild(date);
    info.appendChild(time);
    document.querySelector('#online-queue-form #appointmentId').value =
      event.id;
    form.classList.remove('hidden');
    form.classList.add('active');
  }

  closeForm() {
    const form = document?.getElementById('online-queue-form');
    if (!form) return;
    form.classList.remove('active');
    form.classList.add('hidden');
    setTimeout(() => {
      const info = document.querySelector('#online-queue-form #info');
      if (info) info.innerHTML = '';
    }, 1000);
  }

  openSuccess() {
    const form = document?.getElementById('online-queue-form');
    if (!form) return;
    const success = document.createElement('div');
    success.innerHTML = `
      <p>Вы записаны!</p>
      <button type="button" class="close">Назад</button>
    `;
    success.classList.add('success');
    success.classList.add('active');
    form.appendChild(success);
    document
      .querySelector('#online-queue-form .success .close')
      .addEventListener('click', () => {
        this.closeSuccess();
        this.closeForm();
      });
  }

  closeSuccess() {
    const form = document?.getElementById('online-queue-form');
    if (!form) return;
    const success = document.querySelector('#online-queue-form .success');
    if (!success) return;
    success.classList.remove('active');
    success.classList.add('hidden');
    setTimeout(() => {
      form.removeChild(success);
    }, 1000);
  }

  openError() {
    const form = document?.getElementById('online-queue-form');
    if (!form) return;
    this.closeSuccess();
    const error = document.createElement('div');
    error.innerHTML = `
      <p>Произошла ошибка!</p>
      <button type="button" class="close">Назад</button>
    `;
    error.classList.add('success');
    error.classList.add('active');
    form.appendChild(error);
    document
      .querySelector('#online-queue-form .success .close')
      .addEventListener('click', () => {
        this.closeError();
        this.closeForm();
      });
  }

  closeError() {
    const form = document?.getElementById('online-queue-form');
    if (!form) return;
    const error = document.querySelector('#online-queue-form .error');
    if (!error) return;
    error.classList.remove('active');
    error.classList.add('hidden');
    setTimeout(() => {
      form.removeChild(error);
    }, 1000);
  }
}
