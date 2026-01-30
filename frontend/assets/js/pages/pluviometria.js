// assets/js/pages/pluviometria.js
(function () {
  "use strict";

  // ======== mock inicial (você troca por API depois) ========
  const PLUVIOS = [
    {
      id: "norte-a",
      nome: "Norte A",
      sub: "Talhão 1 - Soja",
      pivos: ["Pivô Norte A", "Pivô Norte B"],
      lat: -16.7672,
      lng: -47.6134,
      status: "rain",
      statusLabel: "Chovendo agora",
      statusMeta: "há 45 min",
      mm: 12.5,
      intensidade: "Moderada",
      intensidadeMeta: "desde 07h",
      updated: "Atualizado há 32 min",
      tipo: "Báscula",
      alimentacao: "Solar",
      alimentacaoEstado: "OK",
      unidade: "mm",
      uso: { irrigacao: true, alertas: true, relatorios: true },
      model: "Davis",
      radioCentral: "0013A20041F0BC0C",
      radioControlador: "0013A200422E3C4B",
      radioGps: "0013A200422E7D7C",
      battery: 81,
      net: "4G",
      semComunicacao: false,
    },
    {
      id: "norte-b",
      nome: "Norte B",
      sub: "Talhão 2 - Milho",
      pivos: ["Pivô Norte B"],
      lat: -16.7619,
      lng: -47.6029,
      status: "dry",
      statusLabel: "Tempo seco",
      statusMeta: "última chuva há 6h",
      mm: 8.2,
      intensidade: "Moderada",
      intensidadeMeta: "desde 07h",
      updated: "Atualizado há 42 min",
      tipo: "Digital",
      alimentacao: "Bateria",
      alimentacaoEstado: "OK",
      unidade: "mm/h",
      uso: { irrigacao: true, alertas: true, relatorios: true },
      model: "Davis",
      radioCentral: "0013A20041F0BC0C",
      radioControlador: "0013A200422E3C4B",
      radioGps: "0013A200422E7D7C",
      battery: 72,
      net: "RADIO",
      semComunicacao: false,
    },
    {
      id: "sul",
      nome: "Sul",
      sub: "Talhão 3 - Algodão",
      pivos: ["Pivô Sul"],
      lat: -16.7744,
      lng: -47.6218,
      status: "none",
      statusLabel: "Sem chuva no momento",
      statusMeta: "última chuva há 6h",
      mm: 0.0,
      intensidade: "Sem chuva",
      intensidadeMeta: "desde 07h",
      updated: "Offline há 1 dia",
      tipo: "Estação compacta",
      alimentacao: "Bateria",
      alimentacaoEstado: "Aten\u00e7\u00e3o",
      unidade: "mm",
      uso: { irrigacao: false, alertas: true, relatorios: true },
      model: "Acurite",
      radioCentral: "0013A20041F0BC0C",
      radioControlador: "0013A200422E3C4B",
      radioGps: "0013A200422E7D7C",
      battery: 12,
      net: "RADIO",
      semComunicacao: true,
    },
    {
      id: "leste",
      nome: "Leste",
      sub: "Talhão 4 - Soja",
      pivos: ["Pivô Leste"],
      lat: -16.7698,
      lng: -47.5885,
      status: "none",
      statusLabel: "Sem chuva no momento",
      statusMeta: "última chuva há 6h",
      mm: 5.7,
      intensidade: "Moderada",
      intensidadeMeta: "desde 07h",
      updated: "Atualizado há 29 min",
      tipo: "Báscula",
      alimentacao: "Rede",
      alimentacaoEstado: "OK",
      unidade: "mm",
      uso: { irrigacao: true, alertas: true, relatorios: false },
      model: "Davis",
      radioCentral: "0013A20041F0BC0C",
      radioControlador: "0013A200422E3C4B",
      radioGps: "0013A200422E7D7C",
      battery: 64,
      net: "4G",
      semComunicacao: false,
    },
  ];

  function slugify(text) {
    return String(text || "")
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
  }

  const PIVOS = Array.from(
    new Set(PLUVIOS.flatMap((p) => p.pivos || []))
  ).map((name) => ({ id: slugify(name), nome: name }));

  const PIVO_BY_NAME = new Map(PIVOS.map((p) => [p.nome, p.id]));
  PLUVIOS.forEach((p) => {
    if (!p.pivosAssoc) {
      p.pivosAssoc = (p.pivos || []).map((name) => PIVO_BY_NAME.get(name)).filter(Boolean);
    }
  });

  // Dados mock de manutenção (1 por pluviômetro)
  const PLUV_MAINTENANCE = {
    "norte-a": {
      status: "ok",
      daysRemaining: 10,
      lastDate: "08/01/2026",
      nextDate: "07/02/2026",
      progress: 72,
      confirmTitle: "Aguardando confirmação",
      confirmHint: "Pressione o botão físico no equipamento",
      frequency: "Mensal",
      responsible: "João Silva",
      reminderDays: 5,
      reminderEnabled: true,
    },
    "norte-b": {
      status: "ok",
      daysRemaining: 6,
      lastDate: "15/01/2026",
      nextDate: "12/02/2026",
      progress: 64,
      confirmTitle: "Confirmado no dispositivo",
      confirmHint: "Última confirmação via painel",
      frequency: "Mensal",
      responsible: "Maria Santos",
      reminderDays: 3,
      reminderEnabled: true,
    },
    "sul": {
      status: "late",
      daysRemaining: -3,
      lastDate: "25/12/2025",
      nextDate: "25/01/2026",
      progress: 100,
      confirmTitle: "Atrasada",
      confirmHint: "Substituição de bateria necessária",
      frequency: "Mensal",
      responsible: "Carlos Oliveira",
      reminderDays: 2,
      reminderEnabled: true,
    },
    "leste": {
      status: "ok",
      daysRemaining: 12,
      lastDate: "02/01/2026",
      nextDate: "01/02/2026",
      progress: 58,
      confirmTitle: "Aguardando confirmação",
      confirmHint: "Verifique limpeza do sensor",
      frequency: "Mensal",
      responsible: "João Silva",
      reminderDays: 4,
      reminderEnabled: false,
    },
  };

  // Dados mock de sensores (1 por pluviômetro)
  const PLUV_SENSORS = {
    "norte-a": {
      model: "Davis",
      pulse: "0.254",
      thresholdMin: 1,
      thresholdMinMinutes: 15,
    },
    "norte-b": {
      model: "Davis",
      pulse: "0.254",
      thresholdMin: 1,
      thresholdMinMinutes: 10,
    },
    "sul": {
      model: "Acurite",
      pulse: "0.200",
      thresholdMin: 0.8,
      thresholdMinMinutes: 20,
    },
    "leste": {
      model: "Davis",
      pulse: "0.254",
      thresholdMin: 1.2,
      thresholdMinMinutes: 15,
    },
  };

  // Dados mock de redundância (1 por pluviômetro)
  const PLUV_REDUNDANCY = {
    "norte-a": { limit: 18, alertAuto: true },
    "norte-b": { limit: 22, alertAuto: true },
    "sul": { limit: 30, alertAuto: false },
    "leste": { limit: 15, alertAuto: true },
  };

  // seleção: vazio => TODOS
  const selected = new Set();
  let layer = null;

  // filtros e expansão dos cards
  let pluvFilter = "highlights"; // highlights | all | rain | offline
  let pluvSearch = "";
  const expanded = new Set();

  // estado do gráfico/calendário
  let rainPeriod = "24h"; // 24h | 7d | 30d
  let calAnchor = new Date(); // mês base do popover
  let calStart = null; // Date
  let calEnd = null; // Date
  let rainBound = false; // evita duplicar listeners
  let rainCalBound = false;
  let rainCalState = { year: new Date().getFullYear(), month: new Date().getMonth() };
  const rainCalCache = new Map();
  let clampBound = false;
  let clampTimer = null;
  let settingsBound = false;
  let settingsFocusId = null;
  let maintMenuOpen = null;
  let reminderMenuOpen = null;
  let maintTicker = null;

  const MAINT_FREQUENCIES = ["Semanal", "Quinzenal", "Mensal", "Trimestral"];
  const REMINDER_DAYS = [2, 3, 5, 7, 10];
  const EDIT_TYPES = ["Báscula", "Digital", "Estação compacta"];
  const EDIT_POWER = ["Bateria", "Solar", "Rede"];
  const EDIT_UNITS = ["mm", "mm/h"];
  const EDIT_SELECTS = {
    type: { options: EDIT_TYPES, key: "tipo" },
    power: { options: EDIT_POWER, key: "alimentacao" },
    unit: { options: EDIT_UNITS, key: "unidade" },
  };

  const $ = (id) => document.getElementById(id);
  let editMap = null;
  let editMarker = null;

  function isAllMode() {
    return selected.size === 0;
  }

  function selectedList() {
    return isAllMode() ? PLUVIOS : PLUVIOS.filter((p) => selected.has(p.id));
  }

  function statusIcon(p) {
    if (p.semComunicacao) return "fa-triangle-exclamation";
    if (p.status === "rain") return "fa-cloud-rain";
    if (p.status === "dry") return "fa-sun";
    return "fa-cloud";
  }

  function nowIconStyle(p) {
    if (p.status === "rain") return { bg: "rgba(37,99,235,.10)", color: "#2563eb" };
    if (p.status === "dry") return { bg: "rgba(245,158,11,.16)", color: "#b45309" };
    if (p.semComunicacao) return { bg: "rgba(245,158,11,.18)", color: "#92400e" };
    return { bg: "rgba(100,116,139,.12)", color: "#334155" };
  }

  function isRaining(p) {
    return p.status === "rain";
  }

  function isOffline(p) {
    return !!p.semComunicacao;
  }

  function isHighlight(p) {
    return isRaining(p) || isOffline(p);
  }

  function filterLabel() {
    if (pluvFilter === "highlights") return "Destaques";
    if (pluvFilter === "rain") return "Chovendo";
    if (pluvFilter === "offline") return "Offline";
    return "Todos";
  }

  function matchesSearch(p) {
    const term = pluvSearch.trim().toLowerCase();
    if (!term) return true;
    const haystack = [
      p.nome,
      p.sub,
      p.statusLabel,
      p.statusMeta,
      p.intensidade,
      p.intensidadeMeta,
      (p.pivos || []).join(" "),
    ].filter(Boolean).join(" ").toLowerCase();
    return haystack.includes(term);
  }

  function matchesFilter(p) {
    if (pluvFilter === "highlights") return isHighlight(p);
    if (pluvFilter === "rain") return isRaining(p);
    if (pluvFilter === "offline") return isOffline(p);
    return true;
  }

  function filteredList() {
    return PLUVIOS.filter((p) => matchesFilter(p) && matchesSearch(p));
  }

  function syncSelectionUI() {
    const crumb = $("pluvCrumb");
    if (crumb) {
      crumb.textContent = `• ${filterLabel()}`;
    }

    const counts = {
      all: PLUVIOS.length,
      rain: PLUVIOS.filter(isRaining).length,
      offline: PLUVIOS.filter(isOffline).length,
    };

    const panel = $("pluvPanel");
    panel?.querySelectorAll("[data-count]").forEach((el) => {
      const key = el.getAttribute("data-count");
      if (!key || !(key in counts)) return;
      el.textContent = String(counts[key]);
    });

    const badgeRain = $("pluvHighlightRain");
    if (badgeRain) badgeRain.textContent = `${counts.rain} chovendo agora`;

    const badgeOffline = $("pluvHighlightOffline");
    if (badgeOffline) badgeOffline.textContent = `${counts.offline} sem comunicação`;

    const highlights = $("pluvHighlights");
    if (highlights) highlights.hidden = pluvFilter !== "highlights";

    panel?.querySelectorAll("[data-filter]").forEach((btn) => {
      const isActive = btn.getAttribute("data-filter") === pluvFilter;
      btn.classList.toggle("is-active", isActive);
      btn.setAttribute("aria-selected", isActive ? "true" : "false");
    });
  }

  function cardTone(p) {
    if (isOffline(p)) return "pluv-card--alert";
    if (isRaining(p)) return "pluv-card--rain";
    if (p.status === "dry") return "pluv-card--dry";
    return "";
  }

  function statusLine(p) {
    if (isOffline(p)) return p.updated || "Offline";
    if (p.statusLabel && p.statusMeta) return `${p.statusLabel} • ${p.statusMeta}`;
    return p.statusLabel || p.statusMeta || "—";
  }

  function renderCard(p) {
    const isOpen = expanded.has(p.id);
    const isSelected = selected.has(p.id);
    const tone = cardTone(p);
    const signalIcon = "fa-wifi";
    const signalClass = p.semComunicacao ? "is-off" : "is-on";
    const mutedLine = p.semComunicacao ? "" : (p.updated || "");
    const pivos = (p.pivos && p.pivos.length) ? p.pivos.join(", ") : "—";
    const intensidadeMeta = p.intensidadeMeta
      ? `<span class="pluv-card__value-note">${p.intensidadeMeta}</span>`
      : "";

    const expandId = `pluv-card-expand-${p.id}`;

    return `
      <article class="pluv-card ${tone} ${isSelected ? "is-selected" : ""} ${isOpen ? "is-open" : ""}" data-pluv-card data-id="${p.id}" aria-expanded="${isOpen}">
        <div class="pluv-card__row">
          <div class="pluv-card__icon">
            <i class="fa-solid ${statusIcon(p)}"></i>
          </div>
          <div class="pluv-card__main">
            <div class="pluv-card__title">
              <span class="pluv-card__name">${p.nome}</span>
              <span class="pluv-card__signal ${signalClass}" title="${p.semComunicacao ? "Sem comunicação" : (p.net || "Online")}">
                <i class="fa-solid ${signalIcon}"></i>
              </span>
            </div>
            <div class="pluv-card__meta">${statusLine(p)}</div>
            ${mutedLine ? `<div class="pluv-card__meta pluv-card__meta--muted">${mutedLine}</div>` : ""}
          </div>
          <div class="pluv-card__right">
            <div class="pluv-card__mm">
              <i class="fa-solid fa-droplet"></i>
              <span class="pluv-card__mm-val">${p.mm.toFixed(1)}</span>
              <span class="pluv-card__mm-unit">mm</span>
            </div>
            <button class="pluv-card__toggle" type="button" data-card-toggle aria-label="Expandir detalhes" aria-expanded="${isOpen}" aria-controls="${expandId}">
              <i class="fa-solid fa-chevron-down"></i>
            </button>
          </div>
        </div>
        <div class="pluv-card__expand" id="${expandId}">
          <div class="pluv-card__kv">
            <span class="pluv-card__k">Talhão</span>
            <span class="pluv-card__v">${p.sub}</span>
          </div>
          <div class="pluv-card__kv">
            <span class="pluv-card__k">Intensidade</span>
            <span class="pluv-card__v">${p.intensidade || "—"}${intensidadeMeta}</span>
          </div>
          <div class="pluv-card__kv">
            <span class="pluv-card__k">Pivôs</span>
            <span class="pluv-card__v">${pivos}</span>
          </div>
        </div>
      </article>
    `;
  }

  function renderGroup(title, icon, items, kind) {
    if (!items.length) return "";
    return `
      <section class="pluv-group ${kind ? `pluv-group--${kind}` : ""}">
        <header class="pluv-group__head">
          <span class="pluv-group__icon"><i class="fa-solid ${icon}"></i></span>
          <span>${title}</span>
          <span class="pluv-group__count">(${items.length})</span>
        </header>
        <div class="pluv-group__list">
          ${items.map(renderCard).join("")}
        </div>
      </section>
    `;
  }

  function renderCards() {
    const host = $("pluvCards");
    if (!host) return;

    const list = filteredList();
    const emptyText = pluvSearch.trim()
      ? "Nenhum pluviômetro encontrado."
      : "Nenhum pluviômetro neste filtro.";

    if (pluvFilter === "highlights") {
      const raining = list.filter(isRaining);
      const alerts = list.filter(isOffline);
      const html = [
        renderGroup("Chovendo agora", "fa-cloud-rain", raining, "rain"),
        renderGroup("Alertas", "fa-triangle-exclamation", alerts, "alert"),
      ].filter(Boolean).join("");
      host.innerHTML = html || `<div class="pluv-empty">${emptyText}</div>`;
    } else {
      host.innerHTML = list.length
        ? `<div class="pluv-group__list">${list.map(renderCard).join("")}</div>`
        : `<div class="pluv-empty">${emptyText}</div>`;
    }

    host.onclick = (e) => {
      const toggle = e.target.closest("[data-card-toggle]");
      const card = e.target.closest("[data-pluv-card]");
      if (!card) return;

      const id = card.getAttribute("data-id");
      if (!id) return;

      if (toggle) {
        const isOpen = card.classList.toggle("is-open");
        card.setAttribute("aria-expanded", isOpen ? "true" : "false");
        const btn = card.querySelector("[data-card-toggle]");
        if (btn) btn.setAttribute("aria-expanded", isOpen ? "true" : "false");
        if (isOpen) expanded.add(id);
        else expanded.delete(id);
        return;
      }

      if (selected.has(id)) selected.delete(id);
      else selected.add(id);

      renderCards();
      renderData();
      renderMarkers();
      focusOnMapIfSingle();
      renderRainChart();
    };
  }

  function renderData() {
    const title = $("pluvDataTitle");
    const hint = $("pluvDataHint");
    const kpis = $("pluvKpis");
    if (!title || !hint || !kpis) return;

    const list = selectedList();

    if (isAllMode()) {
      title.textContent = "Dados — Todos os pluviômetros";
      hint.textContent = "Sem seleção: mostrando dados agregados.";
    } else if (selected.size === 1) {
      const only = list[0];
      title.textContent = `Dados — ${only?.nome || "Selecionado"}`;
      hint.textContent = "Mostrando apenas do selecionado.";
    } else {
      title.textContent = `Dados — ${selected.size} selecionados`;
      hint.textContent = "Mostrando apenas dos selecionados.";
    }

    // KPIs (placeholder)
    const total = list.reduce((acc, p) => acc + (Number(p.mm) || 0), 0);
    const off = list.filter((p) => p.semComunicacao).length;
    const max = list.reduce((m, p) => Math.max(m, Number(p.mm) || 0), 0);

    kpis.innerHTML = `
      <div class="pluv-box">
        <div class="pluv-box__t">Chuva (soma)</div>
        <div class="pluv-box__v">${total.toFixed(1)} mm</div>
      </div>
      <div class="pluv-box">
        <div class="pluv-box__t">Máximo (sensor)</div>
        <div class="pluv-box__v">${max.toFixed(1)} mm</div>
      </div>
      <div class="pluv-box">
        <div class="pluv-box__t">Sem comunicação</div>
        <div class="pluv-box__v">${off}</div>
      </div>
    `;
  }

  function iconFor(p) {
    const cls = `pluv-pin ${p.semComunicacao ? "is-off" : ""}`;
    const mmValue = p.semComunicacao
      ? "--"
      : Number.isFinite(Number(p.mm))
        ? Number(p.mm).toFixed(1).replace(".", ",")
        : "--";
    return L.divIcon({
      className: "",
      html: `
        <div class="${cls}" title="${p.nome}">
          <div class="pluv-pin__bubble">
            <span class="pluv-pin__value">${mmValue}</span>
            <span class="pluv-pin__unit">mm</span>
          </div>
        </div>
      `,
      iconSize: [52, 60],
      iconAnchor: [26, 60],
    });
  }

  function renderMarkers() {
    if (!window.icMap || !window.L) return;

    if (layer) {
      try { layer.remove(); } catch (_) {}
      layer = null;
    }

    layer = L.layerGroup().addTo(window.icMap);

    const list = selectedList();
    list.forEach((p) => {
      L.marker([p.lat, p.lng], { icon: iconFor(p) })
        .addTo(layer)
        .bindPopup(`<strong>${p.nome}</strong><br/>${p.mm.toFixed(1)} mm<br/>${p.updated}`);
    });
  }

  function focusOnMapIfSingle() {
    if (selected.size !== 1) return;
    const only = PLUVIOS.find((p) => selected.has(p.id));
    if (!only) return;
    window.icMap?.setView?.([only.lat, only.lng], 16);
  }

  function clearSelection() {
    selected.clear();
    syncSelectionUI();
    renderCards();
    renderData();
    renderMarkers();
    renderRainChart(); // 🔥 atualiza gráfico também
  }

  function bindPluvFilters() {
    const filterWrap = document.querySelector(".pluv-filters");
    if (filterWrap) {
      filterWrap.addEventListener("click", (e) => {
        const btn = e.target.closest("[data-filter]");
        if (!btn) return;
        const next = btn.getAttribute("data-filter");
        if (!next || next === pluvFilter) return;
        pluvFilter = next;
        expanded.clear();
        syncSelectionUI();
        renderCards();
      });
    }

    const search = $("pluvSearchInput");
    if (search) {
      search.addEventListener("input", () => {
        pluvSearch = search.value || "";
        renderCards();
      });
    }
  }

  async function mountPanel() {
    const slot = $("pageSlot");
    if (!slot) return;

    // você disse que está em frontend/pages/pluviometria.html
    const html = await fetch("./pages/pluviometria.html").then((r) => r.text());
    slot.innerHTML = html;

    bindPluvFilters();

    bindSettingsUI();
    initSettingsFocus();
  }

  async function mountEditPanel() {
    const slot = $("pageSlot");
    if (!slot) return;

    const html = await fetch("./pages/pluviometria-edit.html").then((r) => r.text());
    slot.innerHTML = html;

    bindEditUI();
    initSettingsFocus();
    renderEditSelect();
    renderEditSummary();
    initEditMap();
  }

  async function showMainView() {
    document.body.classList.add("is-pluviometria");
    document.body.classList.remove("is-pluviometria-edit");
    document.body.classList.remove("pluv-settings-open");
    document.body.classList.remove("rain-cal-open");

    const mapCard = $("mapCard");
    if (mapCard) mapCard.style.display = "none";

    pluvFilter = "highlights";
    pluvSearch = "";
    expanded.clear();

    await mountPanel();

    syncSelectionUI();
    const searchInput = $("pluvSearchInput");
    if (searchInput) searchInput.value = pluvSearch;
    renderCards();
    renderData();
    renderMarkers();

    bindRainUI();
    bindRainCalendarUI();
    renderRainChart();
    bindClampPanels();
    scheduleClampPanels();

    const map = window.icMap;
    if (map && typeof map.invalidateSize === "function") {
      map.invalidateSize({ pan: false });
      requestAnimationFrame(() => map.invalidateSize({ pan: false }));
      setTimeout(() => map.invalidateSize({ pan: false }), 180);
    }
  }

  async function showEditView() {
    document.body.classList.add("is-pluviometria");
    document.body.classList.add("is-pluviometria-edit");
    document.body.classList.remove("pluv-settings-open");
    document.body.classList.remove("rain-cal-open");

    const mapCard = $("mapCard");
    if (mapCard) mapCard.style.display = "none";

    await mountEditPanel();
    syncFocusFromSelection();
    initSettingsFocus();
    renderEditSelect();
    renderEditSummary();
    updateEditMap();

    const map = window.icMap;
    if (map && typeof map.invalidateSize === "function") {
      map.invalidateSize({ pan: false });
      requestAnimationFrame(() => map.invalidateSize({ pan: false }));
      setTimeout(() => map.invalidateSize({ pan: false }), 180);
    }
  }

  // =========================
  // CHUVA (barras) + calendário
  // =========================
  function formatDateBR(d) {
    const dd = String(d.getDate()).padStart(2, "0");
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const yy = d.getFullYear();
    return `${dd}/${mm}/${yy}`;
  }

  function setRainChips() {
    const scope = $("rainScopeChip");
    const dateChip = $("rainDateChip");
    const note = $("rainPeriodNote");
    if (!scope || !dateChip) return;

    const selCount = selected.size;
    scope.textContent = selCount === 0 ? "Todos os pluviômetros" : `${selCount} selecionado(s)`;

    const now = new Date();
    let rangeStart = null;
    let rangeEnd = null;

    if (calStart && calEnd) {
      dateChip.textContent = `Período: ${formatDateBR(calStart)} → ${formatDateBR(calEnd)}`;
      rangeStart = calStart;
      rangeEnd = calEnd;
    } else {
      dateChip.textContent =
        rainPeriod === "24h" ? "Período: últimas 24h" :
        rainPeriod === "7d"  ? "Período: últimos 7 dias" :
                               "Período: este mês";

      if (rainPeriod === "24h") {
        rangeEnd = now;
        rangeStart = new Date(now);
        rangeStart.setDate(now.getDate() - 1);
      } else if (rainPeriod === "7d") {
        rangeEnd = now;
        rangeStart = new Date(now);
        rangeStart.setDate(now.getDate() - 6);
      } else {
        rangeStart = new Date(now.getFullYear(), now.getMonth(), 1);
        rangeEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0);
      }
    }

    if (note && rangeStart && rangeEnd) {
      note.textContent = `Informações referentes ao período de ${formatDateBR(rangeStart)} a ${formatDateBR(rangeEnd)}.`;
    }
  }

  function daysInCurrentMonth() {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
  }

  function getSeries(period) {
    const len = period === "24h" ? 24 : (period === "7d" ? 7 : daysInCurrentMonth());
    const base = selectedList().length || PLUVIOS.length;
    const seed = period.split("").reduce((acc, c) => acc + c.charCodeAt(0), 0) + (base * 97);
    const rand = seededRandom(seed);

    const arr = new Array(len).fill(0);
    const factor = Math.min(1.6, 0.85 + base * 0.12);
    const maxVal = period === "24h" ? 14 : (period === "7d" ? 16 : 16);
    const eventCount = period === "24h"
      ? 1 + Math.floor(rand() * 3)
      : period === "7d"
        ? 1 + Math.floor(rand() * 2)
        : 3 + Math.floor(rand() * 4);

    const drizzleChance = period === "24h" ? 0.08 : (period === "7d" ? 0.12 : 0.18);
    const maxLen = period === "24h" ? 4 : (period === "7d" ? 2 : 3);

    function addEvent(start, length, peak) {
      for (let j = 0; j < length; j++) {
        const idx = Math.min(len - 1, start + j);
        const t = length === 1 ? 0.5 : j / (length - 1);
        const shape = 0.6 + 0.8 * (1 - Math.abs(t - 0.5) * 2);
        const variance = 0.7 + rand() * 0.6;
        arr[idx] += peak * shape * variance;
      }
    }

    for (let e = 0; e < eventCount; e++) {
      const length = 1 + Math.floor(rand() * maxLen);
      const start = Math.floor(rand() * Math.max(1, len - length));
      const heavy = rand() < 0.2;
      const peakBase = heavy ? (8 + rand() * 6) : (2 + rand() * 4);
      addEvent(start, length, peakBase);
    }

    for (let i = 0; i < len; i++) {
      if (rand() < drizzleChance) {
        arr[i] = Math.max(arr[i], 0.3 + rand() * 1.4);
      }
    }

    return arr.map((v) => {
      const scaled = Math.min(maxVal, Math.max(0, v * factor));
      return Math.round(scaled * 10) / 10;
    });
  }

  function renderRainChart() {
    const barsHost = $("rainBars");
    const xHost = $("rainXAxis");
    const totalEl = $("rainTotal");
    if (!barsHost || !xHost || !totalEl) return;

    const series = getSeries(rainPeriod);
    const maxAxis = 16;
    const total = series.reduce((a, b) => a + b, 0);

    totalEl.textContent = total.toFixed(1);

    const styles = getComputedStyle(barsHost);
    const padTop = parseFloat(styles.paddingTop) || 0;
    const padBottom = parseFloat(styles.paddingBottom) || 0;
    const plotHeight = Math.max(0, barsHost.clientHeight - padTop - padBottom) || 180;

    barsHost.innerHTML = series.map((v) => {
      const clamped = Math.min(Math.max(v, 0), maxAxis);
      const h = Math.round((clamped / maxAxis) * plotHeight);
      return `<div class="rain-bar" style="height:${Math.max(2, h)}px" title="${v.toFixed(1)} mm"></div>`;
    }).join("");

    const labels =
      rainPeriod === "24h"
        ? series.map((_, i) => `${String(i).padStart(2, "0")}h`)
        : rainPeriod === "7d"
          ? ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"]
          : series.map((_, i) => String(i + 1));

    xHost.innerHTML = labels.map((t) => `<div>${t}</div>`).join("");

    setRainChips();
  }

  function toggleCalendar(open) {
    const cal = $("rainCalendar");
    if (!cal) return;
    cal.setAttribute("aria-hidden", open ? "false" : "true");
    if (open) renderCalendar();
  }

  function monthTitle(d) {
    const meses = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"];
    return `${meses[d.getMonth()]} ${d.getFullYear()}`;
  }

  function startOfMonth(d) { return new Date(d.getFullYear(), d.getMonth(), 1); }
  function addMonths(d, n) { return new Date(d.getFullYear(), d.getMonth() + n, 1); }

  function sameDay(a, b) {
    return a && b &&
      a.getFullYear() === b.getFullYear() &&
      a.getMonth() === b.getMonth() &&
      a.getDate() === b.getDate();
  }

  function pickDate(d) {
    if (!calStart || (calStart && calEnd)) {
      calStart = d;
      calEnd = null;
      return;
    }
    if (d < calStart) {
      calEnd = calStart;
      calStart = d;
    } else {
      calEnd = d;
    }
  }

  function renderMonthGrid(targetId, titleId, baseMonth) {
    const title = $(titleId);
    const grid = $(targetId);
    if (!title || !grid) return;

    title.textContent = monthTitle(baseMonth);

    const first = startOfMonth(baseMonth);
    const startDay = first.getDay();
    const daysInMonth = new Date(first.getFullYear(), first.getMonth() + 1, 0).getDate();

    grid.innerHTML = "";

    // nomes dias
    ["D", "S", "T", "Q", "Q", "S", "S"].forEach((d) => {
      const el = document.createElement("div");
      el.style.fontWeight = "900";
      el.style.fontSize = "11px";
      el.style.color = "#94a3b8";
      el.style.textAlign = "center";
      el.textContent = d;
      grid.appendChild(el);
    });

    // blanks
    for (let i = 0; i < startDay; i++) {
      const b = document.createElement("button");
      b.type = "button";
      b.className = "cal__day is-muted";
      b.disabled = true;
      b.textContent = "";
      grid.appendChild(b);
    }

    // days
    for (let day = 1; day <= daysInMonth; day++) {
      const d = new Date(first.getFullYear(), first.getMonth(), day);
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "cal__day";
      btn.textContent = String(day);

      if (calStart && sameDay(d, calStart)) btn.classList.add("is-selected");
      if (calEnd && sameDay(d, calEnd)) btn.classList.add("is-selected");
      if (calStart && calEnd && d > calStart && d < calEnd) btn.classList.add("is-inrange");

      btn.addEventListener("click", () => {
        pickDate(d);
        renderCalendar();
      });

      grid.appendChild(btn);
    }
  }

  function renderCalendar() {
    const a = startOfMonth(calAnchor);
    const b = addMonths(a, 1);

    renderMonthGrid("calGridA", "calMonthA", a);
    renderMonthGrid("calGridB", "calMonthB", b);

    const rangeText = $("calRangeText");
    if (rangeText) {
      if (calStart && calEnd) rangeText.textContent = `${formatDateBR(calStart)} → ${formatDateBR(calEnd)}`;
      else if (calStart) rangeText.textContent = `Início: ${formatDateBR(calStart)} (selecione o fim)`;
      else rangeText.textContent = "Selecione um intervalo";
    }
  }

  function bindRainUI() {
    if (rainBound) return; // não duplica
    rainBound = true;

    // pills (delegação: funciona mesmo após reinjetar HTML)
    document.addEventListener("click", (e) => {
      const pill = e.target.closest(".rain__pill");
      if (!pill) return;

      document.querySelectorAll(".rain__pill").forEach((b) => b.classList.remove("is-active"));
      pill.classList.add("is-active");

      rainPeriod = pill.getAttribute("data-period") || "24h";
      calStart = null;
      calEnd = null;
      renderRainChart();
    });

    // botões calendário
    document.addEventListener("click", (e) => {
      const btnView = e.target.closest("#rainBtnCalendarView");
      if (btnView) {
        openRainCalendar();
        return;
      }

      const btnCal = e.target.closest("#rainBtnCalendar");
      if (btnCal) {
        toggleCalendar(true);
        return;
      }

      const nav = e.target.closest("[data-cal-nav]");
      if (nav) {
        const dir = Number(nav.getAttribute("data-cal-nav") || "0");
        calAnchor = addMonths(calAnchor, dir);
        renderCalendar();
        return;
      }

      const quick = e.target.closest(".cal__quick");
      if (quick) {
        const days = Number(quick.getAttribute("data-range") || "1");
        const end = new Date();
        const start = new Date();
        start.setDate(end.getDate() - (days - 1));
        calStart = start;
        calEnd = end;
        renderCalendar();
        return;
      }

      const cancel = e.target.closest("#calCancel");
      if (cancel) {
        toggleCalendar(false);
        return;
      }

      const apply = e.target.closest("#calApply");
      if (apply) {
        if (calStart && calEnd) {
          document.querySelectorAll(".rain__pill").forEach((b) => b.classList.remove("is-active"));
          toggleCalendar(false);
          renderRainChart();
        } else {
          alert("Selecione o início e o fim do período.");
        }
        return;
      }
    });

    // fechar popover clicando fora
    document.addEventListener("click", (e) => {
      const cal = $("rainCalendar");
      const btn = $("rainBtnCalendar");
      if (!cal || cal.getAttribute("aria-hidden") === "true") return;
      if (cal.contains(e.target) || btn?.contains(e.target)) return;
      toggleCalendar(false);
    });
  }

  function bindEditUI() {
    const back = $("pluvEditBack");
    if (back && !back.dataset.bound) {
      back.dataset.bound = "1";
      back.addEventListener("click", (e) => {
        e.preventDefault();
        showMainView();
      });
    }

    const centerBtn = $("pluvEditCenterBtn");
    if (centerBtn && !centerBtn.dataset.bound) {
      centerBtn.dataset.bound = "1";
      centerBtn.addEventListener("click", () => {
        if (editMap) {
          const p = getFocusPluvio();
          if (p) {
            const c = editMap.getCenter();
            p.lat = c.lat;
            p.lng = c.lng;
          }
        }
        renderEditLocation();
        updateEditMap();
      });
    }

    const pivotList = $("pluvEditPivotList");
    if (pivotList && !pivotList.dataset.bound) {
      pivotList.dataset.bound = "1";
      pivotList.addEventListener("change", (e) => {
        const input = e.target.closest("input[type='checkbox']");
        if (!input) return;
        const p = getFocusPluvio();
        if (!p) return;
        const value = input.value;
        const set = new Set(p.pivosAssoc || []);
        if (input.checked) set.add(value);
        else set.delete(value);
        p.pivosAssoc = Array.from(set);
      });
    }

    if (!document.body.dataset.editSelectBound) {
      document.body.dataset.editSelectBound = "1";
      document.addEventListener("click", (e) => {
        const pluvOption = e.target.closest("[data-pluv-option]");
        if (pluvOption) {
          const id = pluvOption.getAttribute("data-value");
          if (id) setSettingsFocus(id);
          closeCustomSelects();
          return;
        }

        const option = e.target.closest(".pluv-edit__select-option");
        if (option) {
          const menu = option.closest("[data-edit-menu]");
          const kind = menu?.getAttribute("data-edit-menu");
          const value = option.getAttribute("data-value");
          const p = getFocusPluvio();
          if (kind && value && p) {
            const conf = EDIT_SELECTS[kind];
            if (conf) p[conf.key] = value;
            renderEditGeneral();
          }
          closeCustomSelects();
          return;
        }

        const pluvTrigger = e.target.closest("[data-pluv-select-trigger]");
        if (pluvTrigger) {
          const wrap = pluvTrigger.closest("[data-pluv-select]");
          if (!wrap) return;
          const isOpen = wrap.classList.contains("is-open");
          closeCustomSelects();
          wrap.classList.toggle("is-open", !isOpen);
          pluvTrigger.setAttribute("aria-expanded", !isOpen ? "true" : "false");
          return;
        }

        const trigger = e.target.closest("[data-edit-select]");
        if (trigger) {
          const wrap = trigger.closest(".pluv-edit__select-field");
          if (!wrap) return;
          const isOpen = wrap.classList.contains("is-open");
          closeCustomSelects();
          wrap.classList.toggle("is-open", !isOpen);
          trigger.setAttribute("aria-expanded", !isOpen ? "true" : "false");
          return;
        }

        closeCustomSelects();
      });
    }

    document.querySelectorAll(".pluv-edit__tab").forEach((tab) => {
      if (tab.dataset.bound) return;
      tab.dataset.bound = "1";
      tab.addEventListener("click", () => {
        const target = tab.getAttribute("data-tab");
        if (!target) return;
        document.querySelectorAll(".pluv-edit__tab").forEach((btn) => {
          const active = btn === tab;
          btn.classList.toggle("is-active", active);
          btn.setAttribute("aria-selected", active ? "true" : "false");
        });
        document.querySelectorAll("[data-tab-body]").forEach((body) => {
          const active = body.getAttribute("data-tab-body") === target;
          body.classList.toggle("is-active", active);
        });
      });
    });

    document.querySelectorAll(".pluv-edit__nav-item").forEach((btn) => {
      if (btn.dataset.bound) return;
      btn.dataset.bound = "1";
      btn.addEventListener("click", () => {
        document.querySelectorAll(".pluv-edit__nav-item").forEach((item) => {
          item.classList.toggle("is-active", item === btn);
        });
        const target = btn.getAttribute("data-target");
        if (!target) return;
        document.querySelectorAll(".pluv-edit__section").forEach((section) => {
          const active = `#${section.id}` === target;
          section.classList.toggle("is-active", active);
        });
        const el = document.querySelector(target);
        el?.scrollIntoView({ behavior: "smooth", block: "start" });
        if (target === "#pluvEditLocation") {
          setTimeout(() => {
            editMap?.invalidateSize?.();
            updateEditMap();
          }, 60);
        }
      });
    });
  }

  function bindSettingsUI() {
    const editBtn = $("pluvEditBtn");
    if (editBtn && !editBtn.dataset.bound) {
      editBtn.dataset.bound = "1";
      editBtn.addEventListener("click", (e) => {
        e.preventDefault();
        showEditView();
      });
    }

    if (!settingsBound) {
      settingsBound = true;
      document.addEventListener("click", (e) => {
        const reminderOpt = e.target.closest("[data-reminder-option]");
        if (reminderOpt) {
          const value = Number(reminderOpt.getAttribute("data-reminder-option"));
          if (!Number.isNaN(value)) setReminderDays(value);
          closeReminderMenu();
          return;
        }

        const reminderTrigger = e.target.closest("[data-reminder-trigger]");
        if (reminderTrigger) {
          const select = reminderTrigger.closest("[data-reminder-select]");
          toggleReminderMenu(select);
          return;
        }

        const reminderToggle = e.target.closest("[data-reminder-toggle]");
        if (reminderToggle) {
          toggleReminderEnabled();
          return;
        }

        const opt = e.target.closest("[data-frequency-option]");
        if (opt) {
          setMaintenanceFrequency(opt.getAttribute("data-frequency-option"));
          closeMaintMenu();
          closeReminderMenu();
          return;
        }

        const trigger = e.target.closest("[data-maint-trigger]");
        if (trigger) {
          const select = trigger.closest("[data-maint-frequency]");
          toggleMaintMenu(select);
          return;
        }

        if (e.target.closest(".pluv-maint__menu")) return;
        closeMaintMenu();
        closeReminderMenu();
      });

      document.addEventListener("input", (e) => {
        const range = e.target.closest("[data-red-range]");
        if (!range) return;
        const p = getFocusPluvio();
        if (!p) return;
        if (range.disabled) return;
        const data = PLUV_REDUNDANCY[p.id];
        if (!data) return;
        const value = clampLimit(range.value);
        range.value = value;
        range.style.setProperty("--red-fill", `${value}%`);
        data.limit = value;
        const wrap = range.closest(".pluv-red__slider");
        const valueEl = wrap?.querySelector("[data-red-value]");
        if (valueEl) valueEl.textContent = `${value}%`;
      });

      document.addEventListener("click", (e) => {
        const toggle = e.target.closest("[data-red-toggle]");
        if (!toggle) return;
        const p = getFocusPluvio();
        if (!p) return;
        const data = PLUV_REDUNDANCY[p.id];
        if (!data) return;
        const kind = toggle.getAttribute("data-red-toggle");
        if (kind === "alert") data.alertAuto = !data.alertAuto;
        // Bind do alerta -> habilita/desabilita o slider via re-render.
        renderRedundancy();
      });
    }
  }

  // =========================
  // Calendário de chuvas (modal)
  // =========================
  function openRainCalendar() {
    document.body.classList.add("rain-cal-open");
    $("rainCalModal")?.setAttribute("aria-hidden", "false");
    renderRainCalendar();
  }

  function closeRainCalendar() {
    document.body.classList.remove("rain-cal-open");
    $("rainCalModal")?.setAttribute("aria-hidden", "true");
  }

  function bindRainCalendarUI() {
    if (rainCalBound) return;
    rainCalBound = true;

    document.addEventListener("click", (e) => {
      const closeBtn = e.target.closest("[data-rain-cal-close]");
      if (closeBtn) {
        closeRainCalendar();
        return;
      }

      const nav = e.target.closest("[data-rain-cal-nav]");
      if (nav) {
        const dir = Number(nav.getAttribute("data-rain-cal-nav") || "0");
        rainCalState = shiftMonth(rainCalState.year, rainCalState.month, dir);
        renderRainCalendar();
        return;
      }
    });
  }

  function shiftMonth(year, month, delta) {
    const d = new Date(year, month + delta, 1);
    return { year: d.getFullYear(), month: d.getMonth() };
  }

  function monthLabel(year, month) {
    const meses = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"];
    return `${meses[month]} ${year}`;
  }

  function seededRandom(seed) {
    let t = seed >>> 0;
    return function () {
      t += 0x6d2b79f5;
      let x = t;
      x = Math.imul(x ^ (x >>> 15), x | 1);
      x ^= x + Math.imul(x ^ (x >>> 7), x | 61);
      return ((x ^ (x >>> 14)) >>> 0) / 4294967296;
    };
  }

  function getRainMonthData(year, month) {
    const key = `${year}-${month}`;
    if (rainCalCache.has(key)) return rainCalCache.get(key);

    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const rand = seededRandom(year * 100 + month * 7 + 13);
    const data = [];
    for (let d = 1; d <= daysInMonth; d++) {
      const chance = rand();
      let mm = 0;
      if (chance > 0.45) {
        const base = rand();
        mm = Math.max(0, Math.round((base * base) * 70 * 10) / 10); // até ~70mm
        if (mm < 1) mm = Math.round((rand() * 5) * 10) / 10;
      }
      data.push({ day: d, mm });
    }

    rainCalCache.set(key, data);
    return data;
  }

  function rainLevel(mm) {
    if (mm <= 0) return null;
    if (mm <= 5) return "l1";
    if (mm <= 20) return "l2";
    if (mm <= 50) return "l3";
    return "l4";
  }

  function renderRainCalendar() {
    const grid = $("rainCalGrid");
    const monthEl = $("rainCalMonth");
    const totalEl = $("rainCalTotal");
    const daysEl = $("rainCalDays");
    const avgEl = $("rainCalAvg");
    if (!grid || !monthEl || !totalEl || !daysEl || !avgEl) return;

    const { year, month } = rainCalState;
    const first = new Date(year, month, 1);
    const startDay = first.getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const data = getRainMonthData(year, month);

    const total = data.reduce((acc, d) => acc + d.mm, 0);
    const daysWithRain = data.filter((d) => d.mm > 0).length;
    const avg = daysWithRain ? (total / daysWithRain) : 0;

    monthEl.textContent = monthLabel(year, month);
    totalEl.textContent = `${total.toFixed(1)} mm`;
    daysEl.textContent = `${daysWithRain} dias`;
    avgEl.textContent = `${avg.toFixed(1)} mm`;

    const weekdays = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];
    let html = "";
    weekdays.forEach((w) => {
      html += `<div class="rain-cal__cell rain-cal__cell--head">${w}</div>`;
    });

    for (let i = 0; i < startDay; i++) {
      html += `<div class="rain-cal__cell"></div>`;
    }

    for (let d = 1; d <= daysInMonth; d++) {
      const info = data[d - 1];
      const level = rainLevel(info.mm);
      const cellClass = level ? `rain-cal__cell is-rain ${level}` : "rain-cal__cell";
      const pillClass = level ? `rain-cal__rain-pill rain-cal__rain-pill--${level}` : "";
      const rainText = info.mm > 0
        ? `<span class="${pillClass}">${info.mm.toFixed(1)} mm</span>`
        : `<span class="rain-cal__rain">Sem chuva</span>`;
      html += `
        <div class="${cellClass}">
          <div class="rain-cal__day-circle">${d}</div>
          ${rainText}
        </div>
      `;
    }

    grid.innerHTML = html;
  }

  function openMaintMenu(wrapper) {
    if (!wrapper) return;
    if (reminderMenuOpen) closeReminderMenu();
    if (maintMenuOpen && maintMenuOpen !== wrapper) closeMaintMenu();
    wrapper.classList.add("is-open");
    wrapper.querySelector("[data-maint-trigger]")?.setAttribute("aria-expanded", "true");
    maintMenuOpen = wrapper;
  }

  function closeMaintMenu() {
    if (!maintMenuOpen) return;
    maintMenuOpen.classList.remove("is-open");
    maintMenuOpen.querySelector("[data-maint-trigger]")?.setAttribute("aria-expanded", "false");
    maintMenuOpen = null;
  }

  function toggleMaintMenu(wrapper) {
    if (!wrapper) return;
    if (maintMenuOpen === wrapper) closeMaintMenu();
    else openMaintMenu(wrapper);
  }

  function openReminderMenu(wrapper) {
    if (!wrapper) return;
    if (maintMenuOpen) closeMaintMenu();
    if (reminderMenuOpen && reminderMenuOpen !== wrapper) closeReminderMenu();
    wrapper.classList.add("is-open");
    wrapper.querySelector("[data-reminder-trigger]")?.setAttribute("aria-expanded", "true");
    reminderMenuOpen = wrapper;
  }

  function closeReminderMenu() {
    if (!reminderMenuOpen) return;
    reminderMenuOpen.classList.remove("is-open");
    reminderMenuOpen.querySelector("[data-reminder-trigger]")?.setAttribute("aria-expanded", "false");
    reminderMenuOpen = null;
  }

  function toggleReminderMenu(wrapper) {
    if (!wrapper) return;
    if (reminderMenuOpen === wrapper) closeReminderMenu();
    else openReminderMenu(wrapper);
  }

  function syncFocusFromSelection() {
    if (selected.size === 1) {
      const id = Array.from(selected)[0];
      if (id) setSettingsFocus(id);
    }
  }

  function getFocusPluvio() {
    return PLUVIOS.find((p) => p.id === settingsFocusId) || PLUVIOS[0];
  }

  function renderEditSelect() {
    const btn = $("pluvEditSelectBtn");
    const menu = $("pluvEditSelectMenu");
    if (!btn || !menu) return;

    const current = PLUVIOS.find((p) => p.id === settingsFocusId) || PLUVIOS[0];
    const currentLabel = current ? `${current.nome} • ${current.sub}` : "Selecionar pluviômetro";
    btn.textContent = currentLabel;
    btn.dataset.value = current?.id || "";

    menu.innerHTML = PLUVIOS.map((p) => {
      const label = `${p.nome} • ${p.sub}`;
      const isActive = current && p.id === current.id;
      return `
        <button class="pluv-edit__select-option ${isActive ? "is-active" : ""}" type="button" data-pluv-option data-value="${p.id}">
          ${label}
        </button>
      `;
    }).join("");
  }

  function formatLatLng(lat, lng) {
    if (lat == null || lng == null) return "—";
    const a = Number(lat);
    const b = Number(lng);
    if (Number.isNaN(a) || Number.isNaN(b)) return "—";
    return `${a.toFixed(6)}, ${b.toFixed(6)}`;
  }

  function renderEditLocation() {
    const p = getFocusPluvio();
    if (!p) return;

    const center = $("pluvEditCenter");
    if (center) center.value = formatLatLng(p.lat, p.lng);

    const list = $("pluvEditPivotList");
    if (!list) return;
    list.innerHTML = PIVOS.map((pivot) => {
      const checked = (p.pivosAssoc || []).includes(pivot.id);
      return `
        <label class="pluv-edit__check">
          <input type="checkbox" value="${pivot.id}" ${checked ? "checked" : ""} />
          ${pivot.nome}
        </label>
      `;
    }).join("");
  }

  function initEditMap() {
    const container = $("pluvEditMap");
    if (!container || !window.L) return;
    if (editMap) {
      try { editMap.remove(); } catch (_) {}
      editMap = null;
      editMarker = null;
    }

    editMap = L.map(container, { zoomControl: true, attributionControl: false });
    L.tileLayer(
      "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
      { maxZoom: 19 }
    ).addTo(editMap);
    L.tileLayer(
      "https://services.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}",
      { maxZoom: 19, opacity: 0.85 }
    ).addTo(editMap);

    editMap.on("click", (e) => {
      const p = getFocusPluvio();
      if (!p || !e?.latlng) return;
      p.lat = e.latlng.lat;
      p.lng = e.latlng.lng;
      renderEditLocation();
      updateEditMap();
    });
  }

  function updateEditMap() {
    if (!editMap) return;
    const p = getFocusPluvio();
    if (!p) return;
    const lat = Number(p.lat);
    const lng = Number(p.lng);
    if (Number.isNaN(lat) || Number.isNaN(lng)) return;

    editMap.setView([lat, lng], 16);
    if (!editMarker) {
      editMarker = L.marker([lat, lng]).addTo(editMap);
    } else {
      editMarker.setLatLng([lat, lng]);
    }
  }

  function renderCustomSelect(kind, value) {
    const conf = EDIT_SELECTS[kind];
    if (!conf) return;
    const btn = document.querySelector(`[data-edit-select="${kind}"]`);
    const menu = document.querySelector(`[data-edit-menu="${kind}"]`);
    if (!btn || !menu) return;

    const current = value || conf.options[0];
    btn.textContent = current;
    btn.dataset.value = current;
    menu.innerHTML = conf.options.map((opt) => `
      <button class="pluv-edit__select-option ${opt === current ? "is-active" : ""}" type="button" data-value="${opt}">
        ${opt}
      </button>
    `).join("");
  }

  function closeCustomSelects() {
    document.querySelectorAll(".pluv-edit__select-field").forEach((wrap) => {
      wrap.classList.remove("is-open");
      const btn = wrap.querySelector("[data-edit-select]");
      if (btn) btn.setAttribute("aria-expanded", "false");
      const pluvBtn = wrap.querySelector("[data-pluv-select-trigger]");
      if (pluvBtn) pluvBtn.setAttribute("aria-expanded", "false");
    });
  }

  function editStatusInfo(p) {
    if (!p) return { label: "—", cls: "" };
    if (p.semComunicacao) return { label: "Sem comunicação", cls: "pluv-edit__badge--danger" };
    if (p.status === "rain") return { label: "Operando", cls: "pluv-edit__badge--ok" };
    return { label: "Aten\u00e7\u00e3o", cls: "pluv-edit__badge--warn" };
  }

  function renderEditGeneral() {
    const p = getFocusPluvio();
    if (!p) return;

    const status = $("pluvEditStatus");
    if (status) {
      const info = editStatusInfo(p);
      status.className = `pluv-edit__badge ${info.cls}`;
      status.textContent = info.label;
    }

    const note = $("pluvEditLastUpdate");
    if (note) {
      const label = p.updated ? `Última comunicação: ${p.updated}` : "Última comunicação: —";
      note.textContent = label;
    }

    const name = $("pluvEditName");
    if (name) name.value = p.nome || "";

    const plot = $("pluvEditPlot");
    if (plot) plot.value = p.sub || "";

    const model = $("pluvEditModel");
    if (model) model.value = p.model || "";

    const network = $("pluvEditNetwork");
    if (network) network.value = p.net || "";

    const radioCentral = $("pluvEditRadioCentral");
    if (radioCentral) radioCentral.value = p.radioCentral || "";
    const radioControl = $("pluvEditRadioControl");
    if (radioControl) radioControl.value = p.radioControlador || "";
    const radioGps = $("pluvEditRadioGps");
    if (radioGps) radioGps.value = p.radioGps || "";

    renderCustomSelect("type", p.tipo || EDIT_TYPES[0]);
    renderCustomSelect("power", p.alimentacao || EDIT_POWER[0]);
    renderCustomSelect("unit", p.unidade || EDIT_UNITS[0]);

    const powerState = $("pluvEditPowerState");
    if (powerState) {
      const state = p.alimentacaoEstado || "—";
      powerState.textContent = `Estado: ${state}`;
    }

    const use = p.uso || {};
    const useIrr = $("pluvEditUseIrrigation");
    const useAlerts = $("pluvEditUseAlerts");
    const useReports = $("pluvEditUseReports");
    if (useIrr) useIrr.checked = !!use.irrigacao;
    if (useAlerts) useAlerts.checked = !!use.alertas;
    if (useReports) useReports.checked = !!use.relatorios;
  }

  function renderEditSummary() {
    renderEditGeneral();
    renderEditLocation();
  }

  function parseBrDate(value) {
    if (!value || typeof value !== "string") return null;
    const parts = value.split("/").map((v) => Number(v));
    if (parts.length !== 3) return null;
    const [day, month, year] = parts;
    if (!day || !month || !year) return null;
    return new Date(year, month - 1, day, 12, 0, 0);
  }

  function clamp01(value) {
    return Math.max(0, Math.min(1, value));
  }

  function lerp(a, b, t) {
    return a + (b - a) * t;
  }

  function calcMaintenanceTimeline(data) {
    const lastPos = 1;
    const todayPos = 60;
    const endPos = 99;
    const lastDate = parseBrDate(data.lastDate);
    const nextDate = parseBrDate(data.nextDate);
    const now = new Date();
    const dayMs = 24 * 60 * 60 * 1000;
    let isOverdue = false;
    let daysValue = 0;
    let nextPos = endPos;

    if (lastDate && nextDate && nextDate > lastDate) {
      if (now > nextDate) {
        isOverdue = true;
        daysValue = Math.max(1, Math.ceil((now - nextDate) / dayMs));
        const overdueShift = Math.min(daysValue / 30, 1);
        nextPos = lerp(todayPos, endPos, overdueShift);
      } else {
        const progress = clamp01((now - lastDate) / (nextDate - lastDate));
        daysValue = Math.max(0, Math.ceil((nextDate - now) / dayMs));
        nextPos = lerp(endPos, todayPos, progress);
      }
    } else {
      const fallback = Number(data.daysRemaining || 0);
      if (fallback < 0) {
        isOverdue = true;
        daysValue = Math.abs(fallback);
      } else {
        daysValue = fallback;
      }
      nextPos = isOverdue ? todayPos : endPos;
    }

    const isWarn = data.status === "warn" && !isOverdue;
    return {
      lastPos,
      todayPos,
      endPos,
      nextPos,
      isOverdue,
      isWarn,
      daysValue,
    };
  }

  function applyMaintTimelineState(state) {
    if (!document.body.classList.contains("is-pluviometria-edit")) return;
    const timeline = document.querySelector(".maint-timeline");
    if (!timeline) return;

    timeline.style.setProperty("--pos-last", `${state.lastPos}%`);
    timeline.style.setProperty("--pos-today", `${state.todayPos}%`);
    timeline.style.setProperty("--pos-end", `${state.endPos}%`);
    timeline.style.setProperty("--pos-next", `${state.nextPos}%`);

    timeline.classList.toggle("is-overdue", state.isOverdue);
    timeline.classList.toggle("is-warn", state.isWarn);
    const isCollide = Math.abs(state.nextPos - state.todayPos) < 6;
    timeline.classList.toggle("is-collide", isCollide);

    const todayMarker = timeline.querySelector(".maint-marker--today");
    const nextMarker = timeline.querySelector(".maint-marker--next");
    if (todayMarker) todayMarker.classList.toggle("maint-marker--overdue", state.isOverdue);
    if (nextMarker) nextMarker.classList.remove("maint-marker--overdue");

    const status = document.querySelector(".pluv-maint__status");
    if (status) {
      status.classList.toggle("pluv-maint__status--warn", state.isOverdue || state.isWarn);
      const statusLabel = status.querySelector("span:first-child");
      const daysLabel = status.querySelector("span:last-child");
      if (statusLabel) statusLabel.textContent = state.isOverdue ? "Atraso" : (state.isWarn ? "Aten\u00e7\u00e3o" : "Em dia");
      if (daysLabel) {
        daysLabel.textContent = state.isOverdue
          ? `Atrasado h\u00e1 ${state.daysValue} dias`
          : `${state.daysValue} dias restantes`;
      }
    }
  }

  function startMaintTimelineTicker() {
    if (!document.body.classList.contains("is-pluviometria-edit")) return;
    if (maintTicker) clearInterval(maintTicker);
    const prefersReduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const interval = prefersReduce ? 60000 : 1000;
    maintTicker = setInterval(() => {
      const p = getFocusPluvio();
      if (!p) return;
      const data = PLUV_MAINTENANCE[p.id] || PLUV_MAINTENANCE["norte-a"];
      if (!data) return;
      const state = calcMaintenanceTimeline(data);
      applyMaintTimelineState(state);
    }, interval);
  }

  function setMaintenanceFrequency(value) {
    if (!value) return;
    const p = getFocusPluvio();
    if (!p) return;
    const data = PLUV_MAINTENANCE[p.id];
    if (!data) return;
    data.frequency = value;
    renderMaintenance();
  }

  function setReminderDays(value) {
    if (!value) return;
    const p = getFocusPluvio();
    if (!p) return;
    const data = PLUV_MAINTENANCE[p.id];
    if (!data) return;
    data.reminderDays = value;
    renderMaintenance();
  }

  function toggleReminderEnabled() {
    const p = getFocusPluvio();
    if (!p) return;
    const data = PLUV_MAINTENANCE[p.id];
    if (!data) return;
    data.reminderEnabled = !data.reminderEnabled;
    renderMaintenance();
  }

  function renderMaintenance() {
    const host = document.querySelector('[data-section-body="maintenance"]');
    if (!host) return;

    const p = getFocusPluvio();
    const data = (p && PLUV_MAINTENANCE[p.id]) || PLUV_MAINTENANCE["norte-a"];
    if (!data) return;

    const timelineState = calcMaintenanceTimeline(data);
    const isLate = timelineState.isOverdue || data.status === "late";
    const progress = Math.max(0, Math.min(100, Number(data.progress || 0)));
    const barClass = isLate ? "pluv-maint__bar pluv-maint__bar--warn" : "pluv-maint__bar";
    const statusClass = (timelineState.isOverdue || timelineState.isWarn)
      ? "pluv-maint__status pluv-maint__status--warn"
      : "pluv-maint__status";
    const statusLabel = timelineState.isOverdue
      ? "Atraso"
      : (timelineState.isWarn ? "Aten\u00e7\u00e3o" : "Em dia");
    const daysLabel = timelineState.isOverdue
      ? `Atrasado h\u00e1 ${timelineState.daysValue} dias`
      : `${timelineState.daysValue} dias restantes`;
    const timelineVars = `--pos-last:${timelineState.lastPos}%; --pos-today:${timelineState.todayPos}%; --pos-end:${timelineState.endPos}%; --pos-next:${timelineState.nextPos}%;`;
    const menuOptions = MAINT_FREQUENCIES.map((opt) => {
      const active = opt === data.frequency;
      return `
        <button class="pluv-maint__option ${active ? "is-active" : ""}"
                type="button"
                role="option"
                data-frequency-option="${opt}">
          <span>${opt}</span>
          ${active ? '<i class="fa-solid fa-check"></i>' : ""}
        </button>
      `;
    }).join("");

    const reminderOptions = REMINDER_DAYS.map((day) => {
      const active = Number(day) === Number(data.reminderDays);
      return `
        <button class="pluv-maint__option ${active ? "is-active" : ""}"
                type="button"
                role="option"
                data-reminder-option="${day}">
          <span>${day} dias</span>
          ${active ? '<i class="fa-solid fa-check"></i>' : ""}
        </button>
      `;
    }).join("");

    const confirmTitle = data.confirmTitle || "";
    const alertTone = confirmTitle.includes("Confirmado")
      ? "ok"
      : (confirmTitle.includes("Atrasada") || data.status === "late")
        ? "danger"
        : "warn";
    const alertIcon = alertTone === "ok"
      ? "fa-check"
      : "fa-triangle-exclamation";

    maintMenuOpen = null;
    reminderMenuOpen = null;
    host.innerHTML = `
      <div class="pluv-maint">
        <div class="${statusClass}">
          <span>${statusLabel}</span>
          <span>${daysLabel}</span>
        </div>

        <div class="maint-timeline ${timelineState.isOverdue ? "is-overdue" : ""} ${timelineState.isWarn ? "is-warn" : ""}" style="${timelineVars}">
          <div class="maint-track">
            <span class="maint-line maint-line--base"></span>
            <span class="maint-line maint-line--done"></span>
            <span class="maint-line maint-line--future"></span>
            <span class="maint-marker maint-marker--done"><i class="fa-solid fa-check"></i></span>
            <span class="maint-marker maint-marker--today"></span>
            <span class="maint-marker maint-marker--next ${timelineState.isOverdue ? "maint-marker--overdue" : ""}"></span>
          </div>
          <div class="maint-labels">
            <span class="maint-label maint-label--left">Última: ${data.lastDate}</span>
            <span class="maint-label maint-label--center">Hoje</span>
            <span class="maint-label maint-label--right">${timelineState.isOverdue ? `Manutenção: ${data.nextDate}` : `Próxima: ${data.nextDate}`}</span>
          </div>
        </div>

        <div class="pluv-maint__progress">
          <div class="${barClass}" style="width:${progress}%"></div>
        </div>

        <div class="pluv-maint__dates">
          <span>Última: ${data.lastDate}</span>
          <span>Próxima: ${data.nextDate}</span>
        </div>

        <div class="pluv-maint__alert pluv-maint__alert--${alertTone}">
          <span class="pluv-maint__alert-ico"><i class="fa-solid ${alertIcon}"></i></span>
          <div>
            <div class="pluv-maint__alert-title">${data.confirmTitle}</div>
            <div class="pluv-maint__alert-sub">${data.confirmHint}</div>
          </div>
        </div>

        <div class="pluv-maint__grid">
          <div class="pluv-maint__field">
            <label>Frequência</label>
            <div class="pluv-maint__select" data-maint-frequency>
              <button class="pluv-maint__input pluv-maint__input--select" type="button" data-maint-trigger aria-expanded="false">
                <span>${data.frequency}</span>
                <i class="fa-solid fa-chevron-down"></i>
              </button>
              <div class="pluv-maint__menu" role="listbox" aria-label="Frequência">
                ${menuOptions}
              </div>
            </div>
          </div>
          <div class="pluv-maint__field">
            <label>Responsável</label>
            <div class="pluv-maint__input">
              <i class="fa-solid fa-user"></i>
              <span>${data.responsible}</span>
            </div>
          </div>
        </div>

        <div class="pluv-maint__reminder">
          <span><i class="fa-regular fa-bell"></i> Lembrete antecipado</span>
          <div class="pluv-maint__reminder-right">
            <div class="pluv-maint__select" data-reminder-select>
              <button class="pluv-maint__input pluv-maint__input--select" type="button" data-reminder-trigger aria-expanded="false">
                <span>${data.reminderDays} dias</span>
                <i class="fa-solid fa-chevron-down"></i>
              </button>
              <div class="pluv-maint__menu" role="listbox" aria-label="Dias de lembrete">
                ${reminderOptions}
              </div>
            </div>
            <button class="pluv-switch ${data.reminderEnabled ? "is-on" : ""}" type="button" data-reminder-toggle aria-pressed="${data.reminderEnabled ? "true" : "false"}"></button>
          </div>
        </div>
      </div>
    `;

    applyMaintTimelineState(timelineState);
    startMaintTimelineTicker();
  }

  function renderSensors() {
    const host = document.querySelector('[data-section-body="sensors"]');
    if (!host) return;

    const p = getFocusPluvio();
    const data = (p && PLUV_SENSORS[p.id]) || PLUV_SENSORS["norte-a"];
    if (!data) return;

    const min = Number(data.thresholdMin);
    const mins = Number(data.thresholdMinMinutes);

    host.innerHTML = `
      <div class="pluv-sensors">
        <div class="pluv-sensors__grid">
          <div class="pluv-sensors__field">
            <label>Modelo do Sensor</label>
            <input class="pluv-sensors__input" value="${data.model}" />
          </div>
          <div class="pluv-sensors__field">
            <label>Valor por Pulso (mm)</label>
            <input class="pluv-sensors__input" value="${data.pulse}" />
            <span class="pluv-sensors__hint">Até 3 casas decimais</span>
          </div>
        </div>

        <div class="pluv-sensors__divider"></div>

        <div class="pluv-sensors__section-title">Chuva Válida (threshold)</div>
        <div class="pluv-sensors__inline">
          <div class="pluv-sensors__field">
            <label>Mínimo (mm)</label>
            <input class="pluv-sensors__input" value="${min}" />
          </div>
          <span class="pluv-sensors__inline-text">em</span>
          <div class="pluv-sensors__field">
            <label>Tempo (min)</label>
            <input class="pluv-sensors__input" value="${mins}" />
          </div>
        </div>

        <div class="pluv-sensors__note">
          Considera chuva válida se &gt;${min}mm em ${mins} minutos
        </div>
      </div>
    `;
  }

  function clampLimit(value) {
    const n = Number(value);
    if (Number.isNaN(n)) return 10;
    return Math.min(99, Math.max(10, Math.round(n)));
  }

  function renderRedundancy() {
    const host = document.querySelector('[data-section-body="redundancy"]');
    if (!host) return;

    const p = getFocusPluvio();
    const data = (p && PLUV_REDUNDANCY[p.id]) || PLUV_REDUNDANCY["norte-a"];
    if (!data) return;

    const limit = clampLimit(data.limit);
    // Toggle superior removido: alerta automático ? o controle mestre da redundância.
    const isAlertOn = !!data.alertAuto;
    const hintText = isAlertOn
      ? "Alertar quando a diferença entre sensores exceder este limite"
      : "Ative o alerta para definir o limite de divergência";
    const disabledClass = isAlertOn ? "" : "is-disabled";
    const disabledAttr = isAlertOn ? "" : "disabled";

    host.innerHTML = `
      <div class="pluv-red">
        <div class="pluv-red__row pluv-red__row--main">
          <div class="pluv-red__control ${disabledClass}">
            <div class="pluv-red__label">Limite de divergência</div>
            <div class="pluv-red__slider">
              <input type="range" min="0" max="100" step="1" value="${limit}" data-red-range style="--red-fill: ${limit}%;" ${disabledAttr} />
              <span class="pluv-red__value" data-red-value>${limit}%</span>
            </div>
            <div class="pluv-red__hint" data-red-hint>${hintText}</div>
          </div>

          <div class="pluv-red__alert">
            <div class="pluv-red__alert-left">
              <span class="pluv-red__alert-ico"><i class="fa-solid fa-triangle-exclamation"></i></span>
              <div>
                <div class="pluv-red__title">Alerta automático</div>
                <div class="pluv-red__sub">quando exceder o limite</div>
              </div>
            </div>
            <button class="pluv-switch ${isAlertOn ? "is-on" : ""}" type="button" data-red-toggle="alert" aria-pressed="${isAlertOn ? "true" : "false"}"></button>
          </div>
        </div>
      </div>
    `;
  }

  function setSettingsFocus(id) {
    settingsFocusId = id;
    renderMaintenance();
    renderSensors();
    renderRedundancy();
    renderEditSelect();
    renderEditSummary();
  }

  function initSettingsFocus() {
    if (!settingsFocusId) {
      settingsFocusId = PLUVIOS[0]?.id || null;
    }
    setSettingsFocus(settingsFocusId);
  }

  // =========================
  // Scroll dos painéis (mostrar 3 itens)
  // =========================
  function clampPanelList(listEl, count) {
    if (!listEl) return;
    const items = Array.from(listEl.children).filter((el) => el && el.nodeType === 1);
    if (items.length === 0) return;

    const take = Math.min(count, items.length);
    const styles = getComputedStyle(listEl);
    const gap = parseFloat(styles.rowGap || styles.gap || "0") || 0;

    let total = 0;
    for (let i = 0; i < take; i++) {
      total += items[i].getBoundingClientRect().height;
      if (i < take - 1) total += gap;
    }

    if (total > 0) {
      listEl.style.setProperty("--pluv-scroll-max", `${Math.ceil(total)}px`);
    }
  }

  function clampPanels() {
    clampPanelList(document.querySelector(".pluv-events"), 3);
    clampPanelList(document.querySelector(".pluv-maint"), 3);
  }

  function scheduleClampPanels() {
    if (clampTimer) clearTimeout(clampTimer);
    requestAnimationFrame(clampPanels);
    clampTimer = setTimeout(clampPanels, 140);
  }

  function bindClampPanels() {
    if (clampBound) return;
    clampBound = true;
    window.addEventListener("resize", scheduleClampPanels);
  }

  // =========================
  // API pública da página
  // =========================
  window.IcPluviometria = {
    getSelectedCount() {
      return selected.size;
    },

    getSelectedPluvios() {
      return selectedList();
    },

    async open() {
      await showMainView();
    },

    async openEdit() {
      await showEditView();
    },

    close() {
      document.body.classList.remove("is-pluviometria");
      document.body.classList.remove("is-pluviometria-edit");
      document.body.classList.remove("pluv-has-selection");
      document.body.classList.remove("pluv-settings-open");
      document.body.classList.remove("rain-cal-open");
      selected.clear();
      expanded.clear();

      // limpa slot
      const slot = $("pageSlot");
      if (slot) slot.innerHTML = "";

      // remove markers
      if (layer) {
        try { layer.remove(); } catch (_) {}
        layer = null;
      }

      // volta card do mapa
      const mapCard = $("mapCard");
      if (mapCard) mapCard.style.display = "";

      // 🔧 FORÇA O LEAFLET A REDESENHAR (evita mapa preto)
      const map = window.icMap;
      if (map && typeof map.invalidateSize === "function") {
        map.invalidateSize({ pan: false });
        requestAnimationFrame(() => map.invalidateSize({ pan: false }));
        setTimeout(() => map.invalidateSize({ pan: false }), 220);
      }

      // se outros módulos escutam isso (mapa.js já escuta)
      window.dispatchEvent(new Event("ic:layout-change"));
    },
  };
})();
