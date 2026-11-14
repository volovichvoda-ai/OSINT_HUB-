
/**
 * OSINT ANALYTICAL DASHBOARD & TOOLKIT
 * Pure Vanilla JavaScript Single Page Application
 */

(function () {
  'use strict';

  // ==========================================
  // 1. БАЗА ДАННЫХ OSINT-ИНСТРУМЕНТОВ И МЕТОДОВ
  // ==========================================

  const OSINT_DATABASE = [
    {
      id: 'dorks',
      category: 'Поисковые операторы',
      title: 'Google Dorks & Advanced Search',
      risk: 'Low',
      description: 'Использование расширенных операторов поиска для обнаружения индексированных документов, открытых директорий и утечек конфигураций.',
      tools: [
        {
          name: 'Google Hacking Database (GHDB)',
          url: 'https://exploit-db.com',
          desc: 'База готовых поисковых запросов'
        },
        {
          name: 'Shodan.io',
          url: 'https://www.shodan.io',
          desc: 'Поисковик по подключенным к сети устройствам и серверам'
        },
        {
          name: 'Censys Search',
          url: 'https://search.censys.io',
          desc: 'Анализ сертификатов, хостов и открытых портов'
        }
      ]
    },
    {
      id: 'domain',
      category: 'Инфраструктура и Домены',
      title: 'Анализ доменов, DNS и IP',
      risk: 'Low',
      description: 'Сбор регистрационных данных (WHOIS), истории DNS-записей, поддоменов и сетевой маршрутизации.',
      tools: [
        {
          name: 'SecurityTrails',
          url: 'https://securitytrails.com',
          desc: 'История DNS, MX и NS записей'
        },
        {
          name: 'crt.sh',
          url: 'https://crt.sh',
          desc: 'Поиск поддоменов через логи Certificate Transparency'
        },
        {
          name: 'ViewDNS.info',
          url: 'https://viewdns.info',
          desc: 'Набор утилит для Reverse IP и проверки DNS'
        },
        {
          name: 'BGP.he.net',
          url: 'https://bgp.he.net',
          desc: 'Анализ автономных систем (ASN) и IP-префиксов'
        }
      ]
    },
    {
      id: 'socmint',
      category: 'Социальные сети (SOCMINT)',
      title: 'Анализ профилей и никнеймов',
      risk: 'Medium',
      description: 'Поиск цифрового следа человека по никнейму, почте или номеру телефона в открытых источниках.',
      tools: [
        {
          name: 'WhatsMyName',
          url: 'https://whatsmyname.app',
          desc: 'Проверка наличия никнейма на сотнях платформ'
        },
        {
          name: 'Sherlock Project',
          url: 'https://github.com/sherlock-project/sherlock',
          desc: 'CLI-утилита для поиска аккаунтов по юзернейму'
        },
        {
          name: 'Epieos',
          url: 'https://epieos.com',
          desc: 'Поиск привязанных сервисов по Email и телефону'
        }
      ]
    },
    {
      id: 'geoint',
      category: 'Геолокация (GEOINT)',
      title: 'Анализ изображений и карт',
      risk: 'Low',
      description: 'Определение места съемки по архитектуре, дорожным знакам, ландшафту и спутниковым снимкам.',
      tools: [
        {
          name: 'Google Earth Pro',
          url: 'https://earth.google.com',
          desc: 'Исторические спутниковые снимки и 3D-рельеф'
        },
        {
          name: 'SunCalc',
          url: 'https://www.suncalc.org',
          desc: 'Определение времени съемки по углу падения теней'
        },
        {
          name: 'Overpass Turbo',
          url: 'https://overpass-turbo.eu',
          desc: 'Сложные географические запросы к OpenStreetMap'
        }
      ]
    },
    {
      id: 'metadata',
      category: 'Файлы и Метаданные',
      title: 'Извлечение EXIF и скрытых данных',
      risk: 'Low',
      description: 'Анализ служебной информации внутри фотографий, PDF-документов и офисных файлов.',
      tools: [
        {
          name: 'ExifTool',
          url: 'https://exiftool.org',
          desc: 'Стандарт индустрии для чтения и редактирования метаданных'
        },
        {
          name: 'FotoForensics',
          url: 'https://fotoforensics.com',
          desc: 'ELA-анализ изображений на предмет фотомонтажа'
        },
        {
          name: 'CyberChef',
          url: 'https://gchq.github.io/CyberChef',
          desc: 'Швейцарский нож для декодирования, хешей и анализа данных'
        }
      ]
    },
    {
      id: 'breaches',
      category: 'Утечки и Безопасность',
      title: 'Проверка компрометации данных',
      risk: 'Medium',
      description: 'Проверка наличия корпоративных или личных учетных записей в публичных базах утечек.',
      tools: [
        {
          name: 'Have I Been Pwned',
          url: 'https://haveibeenpwned.com',
          desc: 'Проверка email по базам известных утечек'
        },
        {
          name: 'IntelX (Intelligence X)',
          url: 'https://intelx.io',
          desc: 'Поисковая система по архивам и открытым источникам'
        },
        {
          name: 'DeHashed',
          url: 'https://dehashed.com',
          desc: 'Поиск скомпрометированных активов'
        }
      ]
    }
  ];

  // Шаблоны для генератора Google Dorks

  const DORK_TEMPLATES = [
    {
      label: 'Поиск по конкретному сайту',
      template: 'site:{target}'
    },
    {
      label: 'Открытые PDF-документы',
      template: 'site:{target} filetype:pdf'
    },
    {
      label: 'Таблицы Excel / CSV',
      template: 'site:{target} filetype:xlsx OR filetype:csv'
    },
    {
      label: 'Индекс директорий (Index of)',
      template: 'site:{target} intitle:"index of"'
    },
    {
      label: 'Страницы входа / Админки',
      template: 'site:{target} inurl:admin OR inurl:login'
    },
    {
      label: 'Конфигурационные файлы',
      template: 'site:{target} ext:xml OR ext:conf OR ext:env'
    },
    {
      label: 'Упоминание на Pastebin',
      template: 'site:pastebin.com "{target}"'
    },
    {
      label: 'Поиск в публичных репозиториях GitHub',
      template: 'site:github.com "{target}"'
    }
  ];

  // ==========================================
  // 2. СОСТОЯНИЕ ПРИЛОЖЕНИЯ (STATE)
  // ==========================================

  let savedNotes = [];

  try {
    savedNotes = JSON.parse(
      localStorage.getItem('osint_notes') || '[]'
    );

    if (!Array.isArray(savedNotes)) {
      savedNotes = [];
    }
  } catch (error) {
    savedNotes = [];
  }

  const state = {
    activeTab: 'dashboard',
    searchQuery: '',
    selectedCategory: 'All',
    logs: [],
    savedNotes: savedNotes
  };

  // ==========================================
  // 3. ГЕНЕРАЦИЯ СТИЛЕЙ ЧЕРЕЗ JAVASCRIPT
  // ==========================================

  function injectStyles() {
    const css = `
      :root {
        --bg-main: #0b0f17;
        --bg-panel: #131a26;
        --bg-card: #192231;
        --bg-input: #0f1520;
        --border: #263348;
        --accent: #00e5ff;
        --accent-dim: rgba(0, 229, 255, 0.12);
        --success: #00e676;
        --warning: #ffab00;
        --danger: #ff5252;
        --text-main: #e2e8f0;
        --text-muted: #8b9bb4;
        --font-mono: 'Consolas', 'Courier New', monospace;
        --font-sans: 'Segoe UI', system-ui, -apple-system, sans-serif;
      }

      * {
        box-sizing: border-box;
        margin: 0;
        padding: 0;
      }

      body {
        background-color: var(--bg-main);
        color: var(--text-main);
        font-family: var(--font-sans);
        line-height: 1.6;
        min-height: 100vh;
        display: flex;
        flex-direction: column;
      }

      /* Шапка */

      .navbar {
        background: var(--bg-panel);
        border-bottom: 1px solid var(--border);
        padding: 16px 32px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        flex-wrap: wrap;
        gap: 16px;
        position: sticky;
        top: 0;
        z-index: 100;
      }

      .brand {
        display: flex;
        align-items: center;
        gap: 12px;
        font-family: var(--font-mono);
        font-size: 20px;
        font-weight: bold;
        color: var(--accent);
        letter-spacing: 1px;
      }

      .brand-badge {
        background: var(--accent-dim);
        border: 1px solid var(--accent);
        padding: 2px 8px;
        border-radius: 4px;
        font-size: 11px;
      }

      .nav-tabs {
        display: flex;
        gap: 8px;
        flex-wrap: wrap;
      }

      .tab-btn {
        background: transparent;
        border: 1px solid transparent;
        color: var(--text-muted);
        padding: 8px 16px;
        border-radius: 6px;
        cursor: pointer;
        font-size: 14px;
        font-weight: 600;
        transition: all 0.2s;
      }

      .tab-btn:hover {
        color: var(--text-main);
        background: var(--bg-card);
      }

      .tab-btn.active {
        background: var(--accent-dim);
        color: var(--accent);
        border-color: var(--accent);
      }

      /* Основной макет */

      .layout {
        display: grid;
        grid-template-columns: 1fr 340px;
        gap: 24px;
        max-width: 1440px;
        width: 100%;
        margin: 24px auto;
        padding: 0 24px;
        flex: 1;
      }

      @media (max-width: 1024px) {
        .layout {
          grid-template-columns: 1fr;
        }
      }

      .panel {
        background: var(--bg-panel);
        border: 1px solid var(--border);
        border-radius: 10px;
        padding: 24px;
      }

      h2 {
        font-size: 20px;
        margin-bottom: 16px;
        color: #ffffff;
        display: flex;
        align-items: center;
        gap: 10px;
      }

      /* Поиск и фильтры */

      .controls {
        display: flex;
        gap: 12px;
        margin-bottom: 24px;
        flex-wrap: wrap;
      }

      input[type="text"],
      textarea,
      select {
        background: var(--bg-input);
        border: 1px solid var(--border);
        color: var(--text-main);
        padding: 10px 14px;
        border-radius: 6px;
        font-size: 14px;
        font-family: var(--font-sans);
        outline: none;
        transition: border-color 0.2s;
      }

      input[type="text"]:focus,
      textarea:focus,
      select:focus {
        border-color: var(--accent);
      }

      .search-input {
        flex: 1;
        min-width: 240px;
      }

      .btn {
        background: var(--accent);
        color: #05080d;
        border: none;
        padding: 10px 18px;
        border-radius: 6px;
        font-weight: 700;
        font-size: 14px;
        cursor: pointer;
        transition: opacity 0.2s, transform 0.1s;
      }

      .btn:hover {
        opacity: 0.9;
      }

      .btn:active {
        transform: scale(0.98);
      }

      .btn-outline {
        background: transparent;
        border: 1px solid var(--border);
        color: var(--text-main);
      }

      .btn-outline:hover {
        border-color: var(--accent);
        color: var(--accent);
      }

      /* Карточки инструментов */

      .cards-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
        gap: 20px;
      }

      .card {
        background: var(--bg-card);
        border: 1px solid var(--border);
        border-radius: 8px;
        padding: 20px;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        transition: border-color 0.2s, transform 0.2s;
      }

      .card:hover {
        border-color: var(--accent);
        transform: translateY(-2px);
      }

      .card-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 10px;
      }

      .category-tag {
        font-size: 11px;
        text-transform: uppercase;
        letter-spacing: 1px;
        color: var(--accent);
        font-weight: 700;
      }

      .card h3 {
        font-size: 17px;
        margin-bottom: 8px;
        color: #fff;
      }

      .card p {
        font-size: 13px;
        color: var(--text-muted);
        margin-bottom: 16px;
      }

      .tool-list {
        list-style: none;
        border-top: 1px solid var(--border);
        padding-top: 12px;
      }

      .tool-list li {
        margin-bottom: 10px;
        font-size: 13px;
      }

      .tool-list a {
        color: var(--accent);
        text-decoration: none;
        font-weight: 600;
      }

      .tool-list a:hover {
        text-decoration: underline;
      }

      .tool-desc {
        display: block;
        color: var(--text-muted);
        font-size: 12px;
      }

      /* Генератор Dorks и Анализатор */

      .dork-box {
        background: var(--bg-input);
        border: 1px solid var(--border);
        border-radius: 6px;
        padding: 14px;
        margin-bottom: 12px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        gap: 12px;
        flex-wrap: wrap;
      }

      .dork-code {
        font-family: var(--font-mono);
        color: var(--success);
        font-size: 14px;
        word-break: break-all;
      }

      .analyzer-result {
        background: var(--bg-input);
        border-left: 3px solid var(--accent);
        padding: 16px;
        border-radius: 4px;
        margin-top: 20px;
        font-family: var(--font-mono);
        font-size: 13px;
      }

      .analyzer-row {
        display: flex;
        justify-content: space-between;
        gap: 12px;
        padding: 6px 0;
        border-bottom: 1px solid rgba(255, 255, 255, 0.05);
      }

      .result-links {
        display: flex;
        gap: 10px;
        flex-wrap: wrap;
        margin-top: 12px;
      }

      .result-links a {
        color: var(--accent);
        text-decoration: none;
      }

      /* Боковая панель */

      .sidebar {
        display: flex;
        flex-direction: column;
        gap: 24px;
      }

      .terminal {
        background: #070a0f;
        border: 1px solid var(--border);
        border-radius: 8px;
        padding: 14px;
        font-family: var(--font-mono);
        font-size: 12px;
        height: 260px;
        overflow-y: auto;
      }

      .log-entry {
        margin-bottom: 8px;
        line-height: 1.4;
      }

      .log-time {
        color: var(--text-muted);
      }

      .log-info {
        color: var(--accent);
      }

      .log-warn {
        color: var(--warning);
      }

      .note-item {
        background: var(--bg-card);
        padding: 10px 12px;
        border-radius: 6px;
        margin-top: 10px;
        font-size: 13px;
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        gap: 8px;
      }

      .delete-note {
        color: var(--danger);
        background: none;
        border: none;
        cursor: pointer;
        font-weight: bold;
      }

      footer {
        text-align: center;
        padding: 20px;
        border-top: 1px solid var(--border);
        color: var(--text-muted);
        font-size: 13px;
        margin-top: 40px;
      }
    `;

    const styleEl = document.createElement('style');
    styleEl.textContent = css;
    document.head.appendChild(styleEl);
  }

  // ==========================================
  // 4. ЛОГИРОВАНИЕ ДЕЙСТВИЙ
  // ==========================================

  function addLog(message, type = 'info') {
    const now = new Date();
    const time = now.toTimeString().split(' ')[0];

    state.logs.unshift({
      time,
      message,
      type
    });

    if (state.logs.length > 50) {
      state.logs.pop();
    }

    renderLogs();
  }

  function renderLogs() {
    const terminal = document.getElementById('osint-terminal');

    if (!terminal) return;

    terminal.innerHTML = state.logs
      .map(
        (log) => `
          <div class="log-entry">
            <span class="log-time">[${log.time}]</span>
            <span class="log-${log.type}">${escapeHtml(log.message)}</span>
          </div>
        `
      )
      .join('');
  }

  function escapeHtml(str) {
    const div = document.createElement('div');
    div.textContent = String(str);
    return div.innerHTML;
  }

  // ==========================================
  // 5. ОТРИСОВКА ВКЛАДОК
  // ==========================================

  // Вкладка 1: Каталог инструментов

  function renderCatalogTab() {
    const categories = [
      'All',
      ...new Set(OSINT_DATABASE.map((item) => item.category))
    ];

    const filtered = OSINT_DATABASE.filter((item) => {
      const matchesCat =
        state.selectedCategory === 'All' ||
        item.category === state.selectedCategory;

      const q = state.searchQuery.toLowerCase();

      const matchesText =
        item.title.toLowerCase().includes(q) ||
        item.description.toLowerCase().includes(q) ||
        item.tools.some(
          (t) =>
            t.name.toLowerCase().includes(q) ||
            t.desc.toLowerCase().includes(q)
        );

      return matchesCat && matchesText;
    });

    return `
      <h2>Каталог OSINT-методов и ресурсов</h2>

      <div class="controls">
        <input
          type="text"
          id="search-tools"
          class="search-input"
          placeholder="Поиск по инструментам (например: Shodan, DNS, EXIF)..."
          value="${escapeHtml(state.searchQuery)}"
        >

        <select id="filter-category">
          ${categories
            .map(
              (cat) => `
                <option
                  value="${escapeHtml(cat)}"
                  ${state.selectedCategory === cat ? 'selected' : ''}
                >
                  ${cat === 'All' ? 'Все категории' : escapeHtml(cat)}
                </option>
              `
            )
            .join('')}
        </select>
      </div>

      <div class="cards-grid">
        ${
          filtered.length === 0
            ? '<p style="color: var(--text-muted);">Инструменты по вашему запросу не найдены.</p>'
            : filtered
                .map(
                  (item) => `
                    <div class="card">
                      <div>
                        <div class="card-header">
                          <span class="category-tag">
                            ${escapeHtml(item.category)}
                          </span>
                        </div>

                        <h3>${escapeHtml(item.title)}</h3>

                        <p>${escapeHtml(item.description)}</p>
                      </div>

                      <ul class="tool-list">
                        ${item.tools
                          .map(
                            (tool) => `
                              <li>
                                <a
                                  href="${escapeHtml(tool.url)}"
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  data-tool="${escapeHtml(tool.name)}"
                                >
                                  ↗ ${escapeHtml(tool.name)}
                                </a>

                                <span class="tool-desc">
                                  ${escapeHtml(tool.desc)}
                                </span>
                              </li>
                            `
                          )
                          .join('')}
                      </ul>
                    </div>
                  `
                )
                .join('')
        }
      </div>
    `;
  }

  // Вкладка 2: Генератор Google Dorks

  function renderDorksTab() {
    return `
      <h2>Конструктор поисковых операторов (Google Dorks)</h2>

      <p style="color: var(--text-muted); margin-bottom: 20px; font-size: 14px;">
        Введите целевой домен или ключевое слово, чтобы автоматически
        сформировать поисковые запросы для Google.
      </p>

      <div class="controls">
        <input
          type="text"
          id="dork-target"
          class="search-input"
          placeholder="Введите домен (например: example.com)"
          value="example.com"
        >

        <button class="btn" id="generate-dorks-btn">
          Обновить запросы
        </button>
      </div>

      <div id="dorks-list"></div>
    `;
  }

  function updateDorksList() {
    const targetInput = document.getElementById('dork-target');
    const container = document.getElementById('dorks-list');

    if (!targetInput || !container) return;

    const target = targetInput.value.trim() || 'example.com';

    addLog(`Сгенерированы Dork-запросы для цели: ${target}`);

    container.innerHTML = DORK_TEMPLATES
      .map((item) => {
        const query = item.template.replace('{target}', target);

        const googleUrl =
          'https://www.google.com/search?q=' +
          encodeURIComponent(query);

        return `
          <div class="dork-box">
            <div>
              <div style="font-size: 12px; color: var(--text-muted); margin-bottom: 4px;">
                ${escapeHtml(item.label)}
              </div>

              <div class="dork-code">
                ${escapeHtml(query)}
              </div>
            </div>

            <div style="display: flex; gap: 8px;">
              <button
                class="btn btn-outline copy-dork-btn"
                data-query="${escapeHtml(query)}"
              >
                Копировать
              </button>

              <a
                href="${googleUrl}"
                target="_blank"
                rel="noopener noreferrer"
                class="btn"
                style="text-decoration: none;"
              >
                Искать
              </a>
            </div>
          </div>
        `;
      })
      .join('');
  }

  // Вкладка 3: Анализатор индикаторов (IOC Parser)

  function renderAnalyzerTab() {
    return `
      <h2>Анализатор цифровых индикаторов (IOC)</h2>

      <p style="color: var(--text-muted); margin-bottom: 20px; font-size: 14px;">
        Вставьте IPv4-адрес, Email, домен, URL или хеш (MD5 / SHA-256).
        Система определит тип объекта и подготовит ссылки для проверки.
      </p>

      <div class="controls">
        <input
          type="text"
          id="ioc-input"
          class="search-input"
          placeholder="Пример: 8.8.8.8 или test@domain.com"
        >

        <button class="btn" id="analyze-ioc-btn">
          Анализировать
        </button>
      </div>

      <div id="ioc-output"></div>
    `;
  }

  function analyzeIOC() {
    const input = document.getElementById('ioc-input');
    const output = document.getElementById('ioc-output');

    if (!input || !output) return;

    const val = input.value.trim();

    if (!val) {
      output.textContent = 'Введите значение для анализа.';
      return;
    }

    let type = 'Неизвестный формат / Текстовый идентификатор';
    let links = [];

    const ipv4Regex =
      /^(25[0-5]|2[0-4]\d|[01]?\d\d?)\.(25[0-5]|2[0-4]\d|[01]?\d\d?)\.(25[0-5]|2[0-4]\d|[01]?\d\d?)\.(25[0-5]|2[0-4]\d|[01]?\d\d?)$/;

    const emailRegex =
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    const domainRegex =
      /^(?!:\/\/)([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}$/;

    const md5Regex = /^[a-fA-F0-9]{32}$/;
    const sha256Regex = /^[a-fA-F0-9]{64}$/;

    if (ipv4Regex.test(val)) {
      type = 'IPv4-адрес';

      links = [
        {
          name: 'Shodan Host Info',
          url: 'https://www.shodan.io/host/' + encodeURIComponent(val)
        },
        {
          name: 'VirusTotal IP Report',
          url: 'https://www.virustotal.com/gui/ip-address/' + encodeURIComponent(val)
        },
        {
          name: 'AbuseIPDB Check',
          url: 'https://www.abuseipdb.com/check/' + encodeURIComponent(val)
        }
      ];

    } else if (emailRegex.test(val)) {
      type = 'Электронная почта (Email)';

      const domain = val.split('@')[1];

      links = [
        {
          name: 'Have I Been Pwned',
          url: 'https://haveibeenpwned.com'
        },
        {
          name: 'Epieos Email Lookup',
          url: 'https://epieos.com'
        },
        {
          name: 'Поиск упоминаний в Google',
          url: 'https://www.google.com/search?q=' + encodeURIComponent('"' + val + '"')
        },
        {
          name: 'Анализ домена почты (' + domain + ')',
          url: 'https://securitytrails.com'
        }
      ];

    } else if (domainRegex.test(val)) {
      type = 'Доменное имя';

      links = [
        {
          name: 'SecurityTrails DNS',
          url: 'https://securitytrails.com'
        },
        {
          name: 'crt.sh Поддомены',
          url: 'https://crt.sh/?q=' + encodeURIComponent(val)
        },
        {
          name: 'VirusTotal Domain',
          url: 'https://www.virustotal.com/gui/domain/' + encodeURIComponent(val)
        },
        {
          name: 'Wayback Machine (Архив)',
          url: 'https://web.archive.org/web/*/' + encodeURIComponent(val)
        }
      ];

    } else if (md5Regex.test(val) || sha256Regex.test(val)) {
      type = md5Regex.test(val)
        ? 'Криптографический хеш (MD5)'
        : 'Криптографический хеш (SHA-256)';

      links = [
        {
          name: 'VirusTotal File Hash',
          url: 'https://www.virustotal.com/gui/search/' + encodeURIComponent(val)
        },
        {
          name: 'Hybrid Analysis',
          url: 'https://www.hybrid-analysis.com'
        }
      ];

    } else {
      type = 'Никнейм / Ключевое слово';

      links = [
        {
          name: 'WhatsMyName Web',
          url: 'https://whatsmyname.app'
        },
        {
          name: 'Точный поиск в Google',
          url: 'https://www.google.com/search?q=' + encodeURIComponent('"' + val + '"')
        }
      ];
    }

    addLog(`Проанализирован индикатор [${type}]: ${val}`);

    output.innerHTML = `
      <div class="analyzer-result">

        <div class="analyzer-row">
          <span style="color: var(--text-muted);">
            Объект:
          </span>

          <span style="color: #fff; font-weight: bold;">
            ${escapeHtml(val)}
          </span>
        </div>

        <div class="analyzer-row">
          <span style="color: var(--text-muted);">
            Определенный тип:
          </span>

          <span style="color: var(--accent);">
            ${escapeHtml(type)}
          </span>
        </div>

        <div class="analyzer-row">
          <span style="color: var(--text-muted);">
            Длина строки:
          </span>

          <span>
            ${val.length} симв.
          </span>
        </div>

        <div style="margin-top: 14px;">
          <div style="color: var(--text-muted); margin-bottom: 8px;">
            Рекомендуемые точки проверки:
          </div>

          <div class="result-links">
            ${links
              .map(
                (link) => `
                  <a
                    href="${escapeHtml(link.url)}"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    ↗ ${escapeHtml(link.name)}
                  </a>
                `
              )
              .join('')}
          </div>
        </div>

      </div>
    `;
  }

  // ==========================================
  // 6. РЕНДЕРИНГ ВСЕГО ПРИЛОЖЕНИЯ И СОБЫТИЯ
  // ==========================================

  function renderNotes() {
    const list = document.getElementById('notes-list');

    if (!list) return;

    list.innerHTML = state.savedNotes
      .map(
        (note, index) => `
          <div class="note-item">
            <span>${escapeHtml(note)}</span>

            <button
              class="delete-note"
              data-index="${index}"
              title="Удалить"
            >
              ✕
            </button>
          </div>
        `
      )
      .join('');
  }

  function renderMainContent() {
    const mainContainer = document.getElementById('main-content');

    if (!mainContainer) return;

    if (state.activeTab === 'dashboard') {
      mainContainer.innerHTML = renderCatalogTab();

    } else if (state.activeTab === 'dorks') {
      mainContainer.innerHTML = renderDorksTab();
      updateDorksList();

    } else if (state.activeTab === 'analyzer') {
      mainContainer.innerHTML = renderAnalyzerTab();
    }
  }

  function buildAppSkeleton() {
    document.body.innerHTML = `
      <header class="navbar">

        <div class="brand">
          OSINT_HUB

          <span class="brand-badge">
            JS ENGINE
          </span>
        </div>

        <nav class="nav-tabs">

          <button
            class="tab-btn active"
            data-tab="dashboard"
          >
            База инструментов
          </button>

          <button
            class="tab-btn"
            data-tab="dorks"
          >
            Генератор Google Dorks
          </button>

          <button
            class="tab-btn"
            data-tab="analyzer"
          >
            Анализатор IOC
          </button>

        </nav>

      </header>

      <div class="layout">

        <main
          class="panel"
          id="main-content"
        >
        </main>

        <aside class="sidebar">

          <section class="panel">

            <h2>Журнал сессии</h2>

            <div
              class="terminal"
              id="osint-terminal"
            >
            </div>

          </section>

          <section class="panel">

            <h2>Заметки расследования</h2>

            <textarea
              id="note-input"
              rows="4"
              style="width: 100%; resize: vertical;"
              placeholder="Введите заметку..."
            ></textarea>

            <button
              class="btn"
              id="save-note-btn"
              style="width: 100%; margin-top: 10px;"
            >
              Сохранить в LocalStorage
            </button>

            <div id="notes-list"></div>

          </section>

        </aside>

      </div>

      <footer>
        Образовательный OSINT-справочник.
        Используйте методы разведки по открытым источникам
        исключительно в законных целях.
      </footer>
    `;
  }

  function bindGlobalEvents() {

    // Переключение вкладок

    document.querySelectorAll('.tab-btn').forEach((btn) => {

      btn.addEventListener('click', (e) => {

        document.querySelectorAll('.tab-btn').forEach((b) => {
          b.classList.remove('active');
        });

        e.currentTarget.classList.add('active');

        state.activeTab = e.currentTarget.dataset.tab;

        addLog(`Переход в раздел: ${e.currentTarget.textContent.trim()}`);

        renderMainContent();

      });

    });

    // Делегирование событий внутри main-content

    document.getElementById('main-content').addEventListener('input', (e) => {

      if (e.target.id === 'search-tools') {

        state.searchQuery = e.target.value;

        renderMainContent();

        const input = document.getElementById('search-tools');

        input.focus();

        input.setSelectionRange(
          input.value.length,
          input.value.length
        );

      }

    });

    document.getElementById('main-content').addEventListener('change', (e) => {

      if (e.target.id === 'filter-category') {

        state.selectedCategory = e.target.value;

        addLog(`Фильтр категории: ${state.selectedCategory}`);

        renderMainContent();

      }

    });

    document.getElementById('main-content').addEventListener('click', (e) => {

      if (e.target.id === 'generate-dorks-btn') {
        updateDorksList();
      }

      if (e.target.classList.contains('copy-dork-btn')) {

        const query = e.target.dataset.query;

        navigator.clipboard.writeText(query)
          .then(() => {
            e.target.textContent = 'Скопировано!';
            addLog(`Скопирован Dork: ${query}`);

            setTimeout(() => {
              e.target.textContent = 'Копировать';
            }, 1500);
          })
          .catch(() => {
            addLog('Не удалось скопировать запрос', 'warn');
          });

      }

      if (e.target.id === 'analyze-ioc-btn') {
        analyzeIOC();
      }

      if (e.target.dataset.tool) {
        addLog(`Переход к внешнему ресурсу: ${e.target.dataset.tool}`);
      }

    });

    // Сохранение заметок

    document.getElementById('save-note-btn').addEventListener('click', () => {

      const input = document.getElementById('note-input');

      const noteText = input.value.trim();

      if (!noteText) return;

      state.savedNotes.unshift(noteText);

      localStorage.setItem(
        'osint_notes',
        JSON.stringify(state.savedNotes)
      );

      input.value = '';

      addLog('Добавлена новая заметка в локальное хранилище');

      renderNotes();

    });

    // Удаление заметок

    document.getElementById('notes-list').addEventListener('click', (e) => {

      if (e.target.classList.contains('delete-note')) {

        const idx = Number(e.target.dataset.index);

        state.savedNotes.splice(idx, 1);

        localStorage.setItem(
          'osint_notes',
          JSON.stringify(state.savedNotes)
        );

        addLog('Заметка удалена', 'warn');

        renderNotes();

      }

    });

  }

  // ==========================================
  // 7. ИНИЦИАЛИЗАЦИЯ ПРИЛОЖЕНИЯ
  // ==========================================

  document.addEventListener('DOMContentLoaded', () => {

    injectStyles();

    buildAppSkeleton();

    renderMainContent();

    renderNotes();

    addLog('Система OSINT_HUB инициализирована');

    addLog(
      'Загружено категорий инструментов: ' +
      OSINT_DATABASE.length
    );

    bindGlobalEvents();

  });

})();
