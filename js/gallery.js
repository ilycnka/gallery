// Данные работ, генерация текстур, размещение картин и панель детали

export const ARTWORKS = [
  { id:0,  title:"Тихий горизонт",  price:12000, medium:"Графика, тушь",     year:2025, color:0xe8ddd3, accent:"#8b7355", owner:null },
  { id:1,  title:"Линии памяти",    price:8500,  medium:"Карандаш, бумага",   year:2024, color:0xd4dde8, accent:"#5570a0", owner:"Анна М." },
  { id:2,  title:"Фрагмент №7",     price:15000, medium:"Перо, чернила",      year:2025, color:0xdde8d4, accent:"#5a7a50", owner:null },
  { id:3,  title:"Внутренний шум",  price:9200,  medium:"Смешанная техника",  year:2024, color:0xe8d4d4, accent:"#a05555", owner:null },
  { id:4,  title:"Контур тишины",   price:11000, medium:"Графит",             year:2025, color:0xd8d4e8, accent:"#6b55a0", owner:"Yuki S." },
  { id:5,  title:"Слой за слоем",   price:7800,  medium:"Тушь, акварель",     year:2024, color:0xe8e4d4, accent:"#8a7a50", owner:null },
  { id:6,  title:"Эхо формы",       price:13500, medium:"Графика",            year:2025, color:0xd4e0e8, accent:"#4a7a8a", owner:null },
  { id:7,  title:"Пауза",           price:6900,  medium:"Уголь, бумага",      year:2024, color:0xe5dce8, accent:"#7a5580", owner:null },
  { id:8,  title:"Структура сна",   price:10500, medium:"Тушь",               year:2025, color:0xdce8dc, accent:"#558060", owner:"Marc L." },
  { id:9,  title:"Между строк",     price:14200, medium:"Смешанная техника",  year:2025, color:0xe8e0d4, accent:"#8a6a3a", owner:null },
  { id:10, title:"Растворение",     price:9800,  medium:"Акварель",           year:2024, color:0xd4d8e8, accent:"#5560a0", owner:null },
  { id:11, title:"Точка опоры",     price:11800, medium:"Графит, перо",       year:2025, color:0xe0e8d4, accent:"#6a8a4a", owner:null },
];

// Модульное состояние
let _paintings = [];
let _isMobile = false;
let selectedArt = null;

function updateCounter() {
  const n = ARTWORKS.filter(a => !a.owner).length;
  document.getElementById('counter').textContent = window.I18N ? I18N.tf('works_available', n) : n + ' работ доступно';
}
window.addEventListener('langchange', updateCounter);

export function createArtTexture(art, w, h) {
  const canvas = document.createElement('canvas');
  canvas.width = w; canvas.height = h;
  const ctx = canvas.getContext('2d');
  const r = (art.color >> 16) & 0xff, g = (art.color >> 8) & 0xff, b = art.color & 0xff;
  ctx.fillStyle = `rgb(${r},${g},${b})`;
  ctx.fillRect(0, 0, w, h);
  const grad = ctx.createLinearGradient(0, 0, w, h);
  grad.addColorStop(0, art.accent + '30'); grad.addColorStop(1, art.accent + '10');
  ctx.fillStyle = grad; ctx.fillRect(0, 0, w, h);

  ctx.strokeStyle = art.accent; ctx.lineCap = 'round';
  const seed = art.id * 137;
  for (let i = 0; i < 4 + art.id % 3; i++) {
    ctx.beginPath(); ctx.lineWidth = 1 + (i % 3) * 0.8; ctx.globalAlpha = 0.15 + i * 0.05;
    const x1 = (seed + i * 67) % w, y1 = (seed + i * 43) % h;
    const x2 = (seed + i * 91 + 100) % w, y2 = (seed + i * 53 + 80) % h;
    ctx.moveTo(x1, y1);
    ctx.bezierCurveTo(x1 + 60, y1 - 40, x2 - 60, y2 + 40, x2, y2);
    ctx.stroke();
  }
  ctx.globalAlpha = 0.12;
  for (let i = 0; i < 3; i++) {
    ctx.beginPath();
    ctx.arc((seed + i * 120) % w, (seed + i * 80) % h, 20 + i * 18, 0, Math.PI * 2);
    ctx.strokeStyle = art.accent; ctx.lineWidth = 0.8; ctx.stroke();
  }
  const step = _isMobile ? 5 : 3;
  ctx.globalAlpha = 0.03;
  for (let x = 0; x < w; x += step) for (let y = 0; y < h; y += step) {
    const v = Math.random() * 255;
    ctx.fillStyle = `rgb(${v},${v},${v})`; ctx.fillRect(x, y, step, step);
  }
  ctx.globalAlpha = 1;
  if (art.owner) {
    const bw = 90, bh = 22, bx = w - bw - 12, by = h - bh - 12;
    ctx.fillStyle = 'rgba(255,255,255,0.88)';
    ctx.beginPath(); ctx.roundRect(bx, by, bw, bh, 11); ctx.fill();
    ctx.fillStyle = art.accent; ctx.beginPath(); ctx.arc(bx + 14, by + 11, 4, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#666'; ctx.font = '10px sans-serif'; ctx.fillText(art.owner, bx + 24, by + 15);
  }
  return new THREE.CanvasTexture(canvas);
}

export function initGallery(scene, isMobile) {
  _isMobile = isMobile;
  const paintings = [];
  const SPREAD_Z = 200;

  function spawnPainting(art, z) {
    const aspect = 0.65 + Math.random() * 0.5;
    const h = 2.2 + Math.random() * 1.2;
    const w = h * aspect;
    const texSize = isMobile ? 384 : 512;
    const tex = createArtTexture(art, texSize, Math.round(texSize / aspect));
    const geo = new THREE.PlaneGeometry(w, h);
    const mat = new THREE.MeshStandardMaterial({ map: tex, roughness: 0.85, metalness: 0.02, side: THREE.DoubleSide });
    const mesh = new THREE.Mesh(geo, mat);

    const angle = Math.random() * Math.PI * 2;
    const radius = isMobile ? (2.5 + Math.random() * 5) : (3 + Math.random() * 7);
    mesh.position.set(Math.cos(angle) * radius, -2 + Math.random() * 5, -z);
    mesh.lookAt(0, mesh.position.y, mesh.position.z + 20);
    mesh.rotation.y += 25 * (Math.PI / 180);
    mesh.rotation.x += (Math.random() - 0.5) * 0.1;
    mesh.rotation.z += (Math.random() - 0.5) * 0.08;

    if (!isMobile) { mesh.castShadow = true; mesh.receiveShadow = true; }
    scene.add(mesh);
    paintings.push({
      mesh, art, origPos: mesh.position.clone(), origRot: mesh.rotation.clone(),
      floatOffset: Math.random() * Math.PI * 2, floatSpeed: 0.3 + Math.random() * 0.4, floatAmp: 0.08 + Math.random() * 0.12,
    });
  }

  ARTWORKS.forEach((art, i) => spawnPainting(art, 10 + i * (SPREAD_Z / ARTWORKS.length) + Math.random() * 8));
  ARTWORKS.forEach((art, i) => spawnPainting(art, 10 + SPREAD_Z + i * (SPREAD_Z / ARTWORKS.length) + Math.random() * 8));

  const pCount = isMobile ? 150 : 300;
  const pGeo = new THREE.BufferGeometry();
  const pPos = new Float32Array(pCount * 3);
  for (let i = 0; i < pCount; i++) {
    pPos[i*3] = (Math.random()-0.5)*30; pPos[i*3+1] = (Math.random()-0.5)*14; pPos[i*3+2] = -Math.random()*SPREAD_Z*2.2;
  }
  pGeo.setAttribute('position', new THREE.BufferAttribute(pPos, 3));
  const particles = new THREE.Points(pGeo, new THREE.PointsMaterial({
    color:0xcccccc, size: isMobile ? 0.08 : 0.06, transparent:true, opacity:0.5, sizeAttenuation:true
  }));
  scene.add(particles);

  _paintings = paintings;
  updateCounter();
  return { paintings, particles, SPREAD_Z };
}

export function isDetailOpen() {
  return !!selectedArt;
}

export function openDetail(art) {
  selectedArt = art;
  document.getElementById('detail').classList.add('open');
  document.getElementById('d-meta').textContent = art.medium + ' · ' + art.year;
  document.getElementById('d-title').textContent = art.title;
  document.getElementById('d-line').style.background = art.accent;
  document.getElementById('d-price').textContent = art.price.toLocaleString('ru-RU') + ' ₽';

  const btn = document.getElementById('d-btn'), badge = document.getElementById('detail-owner-badge');
  if (art.owner) {
    btn.textContent = I18N.t('btn_owned'); btn.className = 'owned'; btn.disabled = true;
    badge.style.display = 'flex'; badge.querySelector('.dot').style.background = art.accent;
    document.getElementById('d-owner-name').textContent = I18N.t('owner_prefix') + art.owner;
  } else {
    btn.textContent = I18N.t('btn_acquire'); btn.className = ''; btn.disabled = false;
    badge.style.display = 'none';
  }

  const c = document.getElementById('detail-art');
  const cw = _isMobile ? Math.min(280, window.innerWidth * 0.7) : 340;
  const ch = Math.round(cw * 1.24);
  c.width = cw; c.height = ch; c.style.width = cw + 'px'; c.style.height = ch + 'px';
  const ctx = c.getContext('2d');
  const rv = (art.color >> 16) & 0xff, gv = (art.color >> 8) & 0xff, bv = art.color & 0xff;
  ctx.fillStyle = `rgb(${rv},${gv},${bv})`; ctx.fillRect(0, 0, cw, ch);
  const grad = ctx.createLinearGradient(0, 0, cw, ch);
  grad.addColorStop(0, art.accent + '30'); grad.addColorStop(1, art.accent + '10');
  ctx.fillStyle = grad; ctx.fillRect(0, 0, cw, ch);
  ctx.strokeStyle = art.accent; ctx.lineCap = 'round';
  const seed = art.id * 137;
  for (let i = 0; i < 5; i++) {
    ctx.beginPath(); ctx.lineWidth = 1 + i * 0.7; ctx.globalAlpha = 0.18 + i * 0.04;
    ctx.moveTo((seed + i * 67) % cw, (seed + i * 43) % ch);
    ctx.bezierCurveTo(cw * 0.24 + i * 20, ch * 0.24 - i * 15, cw * 0.76 - i * 20, ch * 0.76 + i * 10, (seed + i * 91) % cw, (seed + i * 53) % ch);
    ctx.stroke();
  }
}

export function closeDetail() {
  selectedArt = null;
  document.getElementById('detail').classList.remove('open');
}

export function handleBuy() {
  if (!selectedArt || selectedArt.owner) return;
  const btn = document.getElementById('d-btn');
  btn.textContent = I18N.t('btn_processing'); btn.disabled = true;
  setTimeout(() => {
    selectedArt.owner = I18N.t('owner_you');
    btn.textContent = I18N.t('btn_bought'); btn.className = 'bought';
    const badge = document.getElementById('detail-owner-badge');
    badge.style.display = 'flex'; badge.querySelector('.dot').style.background = selectedArt.accent;
    document.getElementById('d-owner-name').textContent = I18N.t('owner_prefix') + I18N.t('owner_you');
    _paintings.forEach(p => {
      if (p.art.id === selectedArt.id) {
        const ts = _isMobile ? 384 : 512;
        p.mesh.material.map = createArtTexture(selectedArt, ts, ts);
        p.mesh.material.needsUpdate = true;
      }
    });
    updateCounter();
  }, 1200);
}
