// Модуль локализации — подключать как обычный <script> до всех остальных
(function () {
  const DICT = {
    ru: {
      nav_collections: 'коллекции',
      gyro_allow:      '🔄 Разрешить гироскоп',
      gyro_enable:     '🔄 Включить гироскоп',
      back:            '← назад',
      hint_rotate:     'перетащи чтобы вращать',
      hint_zoom:       'скролл чтобы приблизить',
      hint_open:       'приблизь чтобы открыть',
      zoom_hint:        'скролл чтобы перейти',
      enter_collection: 'перейти в коллекцию',
      gallery_title:   'Галерея',
      gallery_sub:     '3D пространство',
      hint_desktop:    'скролл — скорость · нажмите на работу · двигайте мышь',
      hint_mobile:     'касайтесь работ · наклоняйте телефон · слайдер — скорость',
      speed_label:     'Скорость',
      art_desc:        'Оригинальная работа. При покупке вы становитесь единственным владельцем — ваше имя отображается на произведении в галерее.',
      btn_acquire:     'приобрести',
      btn_owned:       'в коллекции',
      btn_processing:  'оформление...',
      btn_bought:      '✓ теперь это ваше',
      owner_prefix:    'Владелец: ',
      owner_you:       'Вы',
      back_gallery:    '← назад в галерею',
      works_available: (n) => `${n} работ доступно`,
      coming_soon:     'Скоро',
      coming_not_soon: 'Не скоро',
      nav_about:       'проект',
      nav_acquire:     'поддержать',
    },
    en: {
      nav_collections: 'collections',
      gyro_allow:      '🔄 Allow gyroscope',
      gyro_enable:     '🔄 Enable gyroscope',
      back:            '← back',
      hint_rotate:     'drag to rotate',
      hint_zoom:       'scroll to zoom',
      hint_open:       'zoom to open',
      zoom_hint:        'scroll to enter',
      enter_collection: 'open collection',
      gallery_title:   'Gallery',
      gallery_sub:     '3D space',
      hint_desktop:    'scroll — speed · click artwork · move mouse',
      hint_mobile:     'tap artworks · tilt phone · slider — speed',
      speed_label:     'Speed',
      art_desc:        'Original artwork. Upon purchase you become the sole owner — your name is displayed on the work in the gallery.',
      btn_acquire:     'acquire',
      btn_owned:       'in collection',
      btn_processing:  'processing...',
      btn_bought:      '✓ now this is yours',
      owner_prefix:    'Owner: ',
      owner_you:       'You',
      back_gallery:    '← back to gallery',
      works_available: (n) => `${n} works available`,
      coming_soon:     'coming soon',
      coming_not_soon: 'coming not soon',
      nav_about:       'about',
      nav_acquire:     'support',
    },
  };

  let _lang = sessionStorage.getItem('vw_lang') || 'en';
  document.documentElement.lang = _lang;

  window.I18N = {
    get lang() { return _lang; },

    t(key) {
      return DICT[_lang][key] ?? DICT.ru[key] ?? key;
    },

    // Для ключей-функций: I18N.tf('works_available', 5)
    tf(key, ...args) {
      const v = DICT[_lang][key] ?? DICT.ru[key];
      return typeof v === 'function' ? v(...args) : v;
    },

    setLang(l) {
      _lang = l;
      sessionStorage.setItem('vw_lang', l);
      document.documentElement.lang = l;
      window.dispatchEvent(new Event('langchange'));
    },

    toggle() {
      window.I18N.setLang(_lang === 'ru' ? 'en' : 'ru');
    },

    // Добавляет кнопку переключения; theme: 'light' | 'dark'
    addToggle(theme) {
      const dark = theme === 'dark';
      const colorBase  = dark ? 'rgba(255,255,255,0.32)' : 'rgba(0,0,0,0.22)';
      const colorHover = dark ? 'rgba(255,255,255,0.80)' : 'rgba(0,0,0,0.55)';
      const btn = document.createElement('button');
      btn.id = 'lang-toggle';
      btn.style.cssText = [
        'position:fixed;top:22px;right:22px;z-index:200',
        'background:none;border:none;cursor:pointer',
        'font-family:inherit;font-size:9px;letter-spacing:0.18em;text-transform:uppercase',
        `color:${colorBase};transition:color 0.2s;padding:4px 0`,
        '-webkit-tap-highlight-color:transparent',
      ].join(';');

      function render() {
        btn.innerHTML = _lang === 'en'
          ? '<span>en</span> · <span style="opacity:0.4">ru</span>'
          : '<span style="opacity:0.4">en</span> · <span>ru</span>';
      }
      render();
      window.addEventListener('langchange', render);
      btn.addEventListener('click', () => window.I18N.toggle());
      btn.addEventListener('mouseenter', () => { btn.style.color = colorHover; });
      btn.addEventListener('mouseleave', () => { btn.style.color = colorBase;  });
      document.body.appendChild(btn);
    },
  };
})();
