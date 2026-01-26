// mapa.js
(function initMapa() {
  const el = document.getElementById("map");
  if (!el) return;

  // Centro inicial (ajusta depois pra sua fazenda)
  const map = L.map("map", {
    zoomControl: true
  }).setView([-16.767, -47.613], 12);

  // Base: Satélite (Esri World Imagery)
  L.tileLayer(
    "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
    {
      maxZoom: 19,
      attribution: "Tiles © Esri"
    }
  ).addTo(map);

  // (Opcional) camada de labels por cima, fica bem “Google-like”
  L.tileLayer(
    "https://services.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}",
    {
      maxZoom: 19,
      opacity: 0.85
    }
  ).addTo(map);

  // Exemplo: um marcador só pra você ver que tá vivo
  L.marker([-16.767, -47.613]).addTo(map).bindPopup("Mapa carregado ✅");
})();

(function initMapCard() {
  const toggles = document.querySelectorAll(".map-card__item--toggle");
  if (!toggles.length) return;

  toggles.forEach(toggle => {
    toggle.addEventListener("click", () => {
      const panelId = toggle.dataset.panel;
      const panel = document.querySelector(`.map-card__panel[data-panel="${panelId}"]`);
      if (!panel) return;

      const isOpen = panel.classList.toggle("is-open");
      toggle.classList.toggle("is-open", isOpen);
      toggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
      panel.setAttribute("aria-hidden", isOpen ? "false" : "true");
    });
  });
})();
