;(function () {
  const center = [53.2521, 34.3717] // Брянск
  const initialZoom = 8

  // Демоданные: чистые и проблемные точки
  let cleanPlaces = [
    { name: 'Брянск — Центральный парк', coords: [53.2469, 34.3649], note: 'Низкая запыленность, хорошая вентиляция' },
    { name: 'Нацпарк «Брянский лес»', coords: [52.5660, 33.8360], note: 'Водоохранная зона, низкая антропогенная нагрузка' },
    { name: 'Карачевский район — лесной массив', coords: [53.1250, 34.9520], note: 'Преобладание лесов, удалённость от магистралей' },
    { name: 'Трубчевск — пойма Десны', coords: [52.5800, 33.7700], note: 'Природная пойма, хорошая аэрация' },
    { name: 'Жуковка — сосновый бор', coords: [53.5320, 33.7300], note: 'Близость лесного массива, низкий транспортный поток' },
    { name: 'Суражский район — заповедные участки', coords: [53.0200, 32.3800], note: 'Малая антропогенная нагрузка' },
    { name: 'Севский район — лесополоса', coords: [52.1500, 34.5000], note: 'Защитные лесополосы, проветриваемость' },
    { name: 'Почеп — прибрежная зона', coords: [52.9300, 33.4500], note: 'Береговая линия, зелёные насаждения' },
    { name: 'Стародуб — городской парк', coords: [52.5850, 32.7600], note: 'Высокая доля зелёных насаждений' },
    { name: 'Унеча — лесной массив', coords: [52.8500, 32.6800], note: 'Удалённость от крупных трасс' },
    { name: 'Злынка — природный ландшафт', coords: [52.4300, 31.7300], note: 'Низкая плотность застройки' },
    { name: 'Клинцы — городской сквер', coords: [52.7500, 32.2400], note: 'Локальная зона отдыха, зелёный каркас' }
  ]

  let dirtyPlaces = [
    { name: 'Промзона г. Брянска (Бежицкий р-н)', coords: [53.2900, 34.2900], severity: 'высокая', pollutant: 'PM10, NO₂' },
    { name: 'Окружная трасса (южный участок)', coords: [53.2000, 34.4500], severity: 'средняя', pollutant: 'PM2.5, NO₂' },
    { name: 'Неорганизованные свалки', coords: [53.3200, 34.5200], severity: 'высокая', pollutant: 'твердые отходы' },
    { name: 'Дятьково — промышленная зона', coords: [53.6000, 34.3300], severity: 'средняя', pollutant: 'PM10, VOC' },
    { name: 'Новозыбков — наследие техногенных воздействий', coords: [52.5400, 31.9400], severity: 'средняя', pollutant: 'почвенные загрязнения' },
    { name: 'Клинцы — транспортный узел', coords: [52.7500, 32.2600], severity: 'средняя', pollutant: 'NO₂, PM2.5' },
    { name: 'Почеп — склад ГСМ', coords: [52.9200, 33.4700], severity: 'высокая', pollutant: 'ЛВЖ, углеводороды' },
    { name: 'Трубчевск — участок у трассы', coords: [52.5900, 33.8000], severity: 'средняя', pollutant: 'PM2.5, NO₂' },
    { name: 'Севск — несанкционированный сброс', coords: [52.1400, 34.5200], severity: 'высокая', pollutant: 'бытовые отходы' },
    { name: 'Стародуб — промплощадка', coords: [52.5750, 32.7800], severity: 'средняя', pollutant: 'PM10' },
    { name: 'Унеча — перегрузочный узел', coords: [52.8600, 32.7000], severity: 'средняя', pollutant: 'пыль, шум' },
    { name: 'Жуковка — участок интенсивного движения', coords: [53.5400, 33.7500], severity: 'средняя', pollutant: 'NO₂' }
  ]

  // KPI заполнение
  function setKpis() {
    const avgAqi = 58 // демо: ниже — лучше
    const waterIdx = 70 // демо индекс качества воды
    animateNumber(document.getElementById('kpi-air'), avgAqi)
    animateNumber(document.getElementById('kpi-water'), waterIdx)
    animateNumber(document.getElementById('kpi-clean'), cleanPlaces.length)
    animateNumber(document.getElementById('kpi-dirty'), dirtyPlaces.length)
  }

  function animateNumber(el, target) {
    if (!el) return
    const start = Number(el.textContent.replace(/[^0-9.-]/g, '')) || 0
    const duration = 700
    const startTime = performance.now()
    function frame(now) {
      const p = Math.min(1, (now - startTime) / duration)
      const val = Math.round(start + (target - start) * (1 - Math.cos(p * Math.PI)) / 2)
      el.textContent = val
      if (p < 1) requestAnimationFrame(frame)
    }
    requestAnimationFrame(frame)
  }

  // Список загрязнённых зон
  function renderPollutionList() {
    const list = document.getElementById('pollutionList')
    const items = dirtyPlaces.map((p) => {
      const severity = p.severity === 'высокая' ? 'bad' : 'warn'
      return `<li>
        <div>
          <strong>${p.name}</strong>
          <div style="color:#b6c4bf;font-size:12px;margin-top:2px;">Потенциальные загрязнители: ${p.pollutant}</div>
        </div>
        <span class="badge ${severity}">${p.severity}</span>
      </li>`
    })
    list.innerHTML = items.join('')
  }

  // Предприятия (демоданные) и рендер списка
  const emitters = [
    { name: 'Брянсксельмаш', percent: 18 },
    { name: 'Дядьковский хрустальный завод', percent: 14 },
    { name: 'Брянский электромеханический завод', percent: 12 },
    { name: 'Газэнергокомплект', percent: 10 },
    { name: 'Брянский машиностроительный завод', percent: 9 },
    { name: 'Кондитерская фабрика „Брянконфи“', percent: 7 },
    { name: 'Карачевский завод „Электродеталь“', percent: 6 },
    { name: 'Консервсушпрод', percent: 5 },
    { name: 'Брасовские сыры', percent: 6 },
    { name: 'Клинцовский автокрановый завод', percent: 6 } 
  ]

  function renderEmittersList() {
    const list = document.getElementById('emittersList')
    if (!list) return
    list.innerHTML = emitters
      .map((e) => `<li><div><strong>${e.name}</strong></div><span class="chip">${e.percent}%</span></li>`)
      .join('')
  }

  // Инициализация карты Leaflet
  let map, cleanLayer, dirtyLayer
  let cleanCluster, dirtyCluster, heatLayer
  let addPointMode = false
  function initMap() {
    map = L.map('mapContainer').setView(center, initialZoom)

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '© OpenStreetMap contributors'
    }).addTo(map)

    cleanLayer = L.layerGroup()
    dirtyLayer = L.layerGroup()
    cleanCluster = L.markerClusterGroup({ disableClusteringAtZoom: 14 })
    dirtyCluster = L.markerClusterGroup({ disableClusteringAtZoom: 14 })
    // no draw tools

    cleanPlaces.forEach((p) => {
      const marker = L.circleMarker(p.coords, { radius: 8, color: '#22c55e', fillColor: '#22c55e', fillOpacity: 0.8 })
        .bindPopup(`<strong>${p.name}</strong><br>${p.note}`)
      cleanLayer.addLayer(marker)
      cleanCluster.addLayer(L.marker(p.coords, { title: p.name }))
    })

    dirtyPlaces.forEach((p) => {
      const marker = L.circleMarker(p.coords, { radius: 8, color: '#ef4444', fillColor: '#ef4444', fillOpacity: 0.85 })
        .bindPopup(`<strong>${p.name}</strong><br>Степень: ${p.severity}<br>${p.pollutant}`)
      dirtyLayer.addLayer(marker)
      dirtyCluster.addLayer(L.marker(p.coords, { title: p.name }))
    })

    cleanLayer.addTo(map)
    dirtyLayer.addTo(map)
    cleanCluster.addTo(map)
    dirtyCluster.addTo(map)

    // Heatmap по проблемным точкам
    const heatData = dirtyPlaces.map((p) => [...p.coords, p.severity === 'высокая' ? 0.9 : 0.5])
    heatLayer = L.heatLayer(heatData, { radius: 22, blur: 18, maxZoom: 12 })

    const overlays = {
      'Чистые локации': cleanLayer,
      'Проблемные локации': dirtyLayer,
    }
    L.control.layers({}, overlays, { collapsed: false, position: 'topright' }).addTo(map)

    // Легенда
    const legend = L.control({ position: 'bottomright' })
    legend.onAdd = function () {
      const div = L.DomUtil.create('div', 'card')
      div.style.padding = '10px'
      div.innerHTML = `
        <div style="font-weight:700;margin-bottom:6px;">Легенда</div>
        <div style="display:flex;gap:8px;align-items:center;margin-bottom:4px;">
          <span style="width:10px;height:10px;border-radius:50%;background:#22c55e;display:inline-block"></span>
          <span style="color:#b6c4bf;font-size:13px;">Чистая зона</span>
        </div>
        <div style="display:flex;gap:8px;align-items:center;">
          <span style="width:10px;height:10px;border-radius:50%;background:#ef4444;display:inline-block"></span>
          <span style="color:#b6c4bf;font-size:13px;">Проблемная зона</span>
        </div>
      `
      return div
    }
    legend.addTo(map)

    // Переключатели
    const toggleClean = document.getElementById('toggleClean')
    const toggleDirty = document.getElementById('toggleDirty')
    const toggleClusters = document.getElementById('toggleClusters')
    const toggleHeat = document.getElementById('toggleHeat')
    const btnAddPoint = document.getElementById('btnAddPoint')
    toggleClean.addEventListener('change', () => {
      if (toggleClean.checked) cleanLayer.addTo(map)
      else map.removeLayer(cleanLayer)
    })
    toggleDirty.addEventListener('change', () => {
      if (toggleDirty.checked) dirtyLayer.addTo(map)
      else map.removeLayer(dirtyLayer)
    })
    toggleClusters.addEventListener('change', () => {
      if (toggleClusters.checked) {
        cleanCluster.addTo(map)
        dirtyCluster.addTo(map)
      } else {
        map.removeLayer(cleanCluster)
        map.removeLayer(dirtyCluster)
      }
    })
    toggleHeat.addEventListener('change', () => {
      if (toggleHeat.checked) heatLayer.addTo(map)
      else map.removeLayer(heatLayer)
    })
    let pendingMarkerCoords = null
    const markerModal = document.getElementById('markerModal')
    const markerType = document.getElementById('markerType')
    const markerName = document.getElementById('markerName')
    const markerNote = document.getElementById('markerNote')
    const markerSeverity = document.getElementById('markerSeverity')
    const markerPollutant = document.getElementById('markerPollutant')
    const markerNoteGroup = document.getElementById('markerNoteGroup')
    const markerSeverityGroup = document.getElementById('markerSeverityGroup')
    const markerPollutantGroup = document.getElementById('markerPollutantGroup')
    const markerSubmit = document.getElementById('markerSubmit')
    const markerCancel = document.getElementById('markerCancel')
    const modalClose = document.getElementById('modalClose')

    // Переключение видимости полей при смене типа точки
    markerType.addEventListener('change', () => {
      if (markerType.value === 'clean') {
        markerNoteGroup.style.display = 'block'
        markerSeverityGroup.style.display = 'none'
        markerPollutantGroup.style.display = 'none'
      } else {
        markerNoteGroup.style.display = 'none'
        markerSeverityGroup.style.display = 'block'
        markerPollutantGroup.style.display = 'block'
      }
    })

    // Открытие модального окна
    btnAddPoint.addEventListener('click', () => {
      addPointMode = !addPointMode
      if (addPointMode) {
        btnAddPoint.textContent = 'Отменить добавление'
        btnAddPoint.style.background = 'var(--danger)'
      } else {
        btnAddPoint.textContent = 'Добавить точку кликом'
        btnAddPoint.style.background = ''
        closeModal()
      }
    })

    // Обработка клика на карте
    map.on('click', (ev) => {
      if (!addPointMode) return
      pendingMarkerCoords = ev.latlng
      markerName.value = ''
      markerNote.value = ''
      markerPollutant.value = ''
      markerType.value = 'clean'
      markerSeverity.value = 'средняя'
      markerNoteGroup.style.display = 'block'
      markerSeverityGroup.style.display = 'none'
      markerPollutantGroup.style.display = 'none'
      markerModal.classList.add('show')
      markerName.focus()
    })

    // Закрытие модального окна
    function closeModal() {
      markerModal.classList.remove('show')
      addPointMode = false
      btnAddPoint.textContent = 'Добавить точку кликом'
      btnAddPoint.style.background = ''
      pendingMarkerCoords = null
    }

    modalClose.addEventListener('click', closeModal)
    markerCancel.addEventListener('click', closeModal)
    markerModal.addEventListener('click', (e) => {
      if (e.target === markerModal) closeModal()
    })

    // Отправка формы
    function submitMarker() {
      if (!pendingMarkerCoords) return
      const name = markerName.value.trim()
      if (!name) {
        markerName.focus()
        markerName.style.borderColor = 'var(--danger)'
        setTimeout(() => {
          markerName.style.borderColor = ''
        }, 2000)
        return
      }
      const { lat, lng } = pendingMarkerCoords
      
      if (markerType.value === 'clean') {
        cleanPlaces.push({ 
          name, 
          coords: [lat, lng], 
          note: markerNote.value.trim() || '' 
        })
      } else {
        dirtyPlaces.push({ 
          name, 
          coords: [lat, lng], 
          severity: markerSeverity.value || 'средняя', 
          pollutant: markerPollutant.value.trim() || '' 
        })
      }
      closeModal()
      rerender()
    }

    markerSubmit.addEventListener('click', submitMarker)
    
    // Отправка по Enter
    markerName.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault()
        submitMarker()
      }
    })
    markerNote.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && e.ctrlKey) {
        e.preventDefault()
        submitMarker()
      }
    })
    markerPollutant.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && e.ctrlKey) {
        e.preventDefault()
        submitMarker()
      }
    })

    // Закрытие по Escape
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && markerModal.classList.contains('show')) {
        closeModal()
      }
    })
  }

  // Диаграммы (демо)
  function initCharts() {
    const airCtx = document.getElementById('airChart')
    const waterCtx = document.getElementById('waterChart')
    const emittersCtx = document.getElementById('emittersChart')

    // Воздух: PM2.5, PM10, NO2, SO2
    new Chart(airCtx, {
      type: 'line',
      data: {
        labels: ['Янв', 'Фев', 'Мар', 'Апр', 'Май', 'Июн', 'Июл', 'Авг', 'Сен', 'Окт', 'Ноя', 'Дек'],
        datasets: [
          { label: 'PM2.5', data: [18, 22, 19, 16, 14, 12, 11, 12, 15, 18, 20, 23], borderColor: '#22c55e', backgroundColor: 'rgba(34,197,94,0.15)', tension: 0.35, fill: true },
          { label: 'PM10', data: [28, 30, 27, 24, 20, 18, 16, 17, 19, 23, 25, 29], borderColor: '#6ee7b7', backgroundColor: 'rgba(110,231,183,0.15)', tension: 0.35, fill: true },
          { label: 'NO₂', data: [24, 26, 22, 20, 18, 17, 16, 16, 18, 21, 22, 24], borderColor: '#a7f3d0', backgroundColor: 'rgba(167,243,208,0.1)', tension: 0.35, fill: true },
          { label: 'SO₂', data: [10, 11, 10, 9, 8, 7, 7, 7, 8, 9, 10, 11], borderColor: '#86efac', backgroundColor: 'rgba(134,239,172,0.1)', tension: 0.35, fill: true },
        ]
      },
      options: {
        plugins: { legend: { labels: { color: '#e8f1ee' } } },
        scales: {
          x: { ticks: { color: '#b6c4bf' }, grid: { color: 'rgba(255,255,255,0.06)' } },
          y: { ticks: { color: '#b6c4bf' }, grid: { color: 'rgba(255,255,255,0.06)' } }
        }
      }
    })

    // Вода: мутность, нитраты, БПК5, pH (относительно)
    new Chart(waterCtx, {
      type: 'radar',
      data: {
        labels: ['Мутность', 'Нитраты', 'БПК5', 'pH', 'Жесткость'],
        datasets: [
          { label: 'Среднее по регионам', data: [65, 52, 58, 70, 60], backgroundColor: 'rgba(52,199,89,0.15)', borderColor: '#34c759' },
          { label: 'Брянская область', data: [60, 48, 62, 72, 58], backgroundColor: 'rgba(110,231,183,0.12)', borderColor: '#6ee7b7' }
        ]
      },
      options: {
        plugins: { legend: { labels: { color: '#e8f1ee' } } },
        scales: {
          r: {
            angleLines: { color: 'rgba(255,255,255,0.06)' },
            grid: { color: 'rgba(255,255,255,0.06)' },
            pointLabels: { color: '#b6c4bf' },
            ticks: { display: false }
          }
        }
      }
    })

    // Предприятия: горизонтальные бары (демоданные)
    if (emittersCtx) {
      const labels = emitters.map((e) => e.name)
      const data = emitters.map((e) => e.percent)
      new Chart(emittersCtx, {
        type: 'bar',
        data: { labels, datasets: [{ label: '% вклада', data, backgroundColor: '#ef4444' }] },
        options: {
          indexAxis: 'y',
          plugins: { legend: { display: false } },
          scales: {
            x: { ticks: { color: '#b6c4bf', callback: (v) => v + '%' }, grid: { color: 'rgba(255,255,255,0.06)' }, max: 100 },
            y: { ticks: { color: '#e8f1ee' }, grid: { display: false } }
          }
        }
      })
    }
  }


  function rerender() {
    // Перерисовать KPI, список и слои карты
    setKpis()
    renderPollutionList()
    if (map) {
      map.removeLayer(cleanLayer)
      map.removeLayer(dirtyLayer)
      cleanLayer = L.layerGroup()
      dirtyLayer = L.layerGroup()
      cleanCluster.clearLayers()
      dirtyCluster.clearLayers()
      cleanPlaces.forEach((p) => {
        const marker = L.circleMarker(p.coords, { radius: 8, color: '#22c55e', fillColor: '#22c55e', fillOpacity: 0.8 })
          .bindPopup(`<strong>${p.name}</strong><br>${p.note || ''}`)
        cleanLayer.addLayer(marker)
        cleanCluster.addLayer(L.marker(p.coords, { title: p.name }))
      })
      dirtyPlaces.forEach((p) => {
        const marker = L.circleMarker(p.coords, { radius: 8, color: '#ef4444', fillColor: '#ef4444', fillOpacity: 0.85 })
          .bindPopup(`<strong>${p.name}</strong><br>Степень: ${p.severity || ''}<br>${p.pollutant || ''}`)
        dirtyLayer.addLayer(marker)
        dirtyCluster.addLayer(L.marker(p.coords, { title: p.name }))
      })
      cleanLayer.addTo(map)
      dirtyLayer.addTo(map)
      const heatData = dirtyPlaces.map((p) => [...p.coords, p.severity === 'высокая' ? 0.9 : 0.5])
      if (heatLayer) heatLayer.setLatLngs(heatData)
    }
  }


  // Инициализация
  setKpis()
  renderPollutionList()
  renderEmittersList()
  initMap()
  initCharts()

  // Scroll reveal
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) e.target.classList.add('visible')
    })
  }, { threshold: 0.15 })
  document.querySelectorAll('.reveal').forEach((el) => observer.observe(el))

  // Theme toggle
  const root = document.documentElement
  const themeToggle = document.getElementById('themeToggle')
  function getPreferredTheme() {
    const saved = localStorage.getItem('theme')
    if (saved === 'light' || saved === 'dark') return saved
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark'
  }
  function applyTheme(theme) {
    if (theme === 'light') root.setAttribute('data-theme', 'light')
    else root.removeAttribute('data-theme')
    if (themeToggle) themeToggle.textContent = theme === 'light' ? '🌞' : '🌓'
  }
  const initialTheme = getPreferredTheme()
  applyTheme(initialTheme)
  if (themeToggle) themeToggle.addEventListener('click', () => {
    const current = root.getAttribute('data-theme') === 'light' ? 'light' : 'dark'
    const next = current === 'light' ? 'dark' : 'light'
    localStorage.setItem('theme', next)
    applyTheme(next)
  })

})()


