// Точка входа — инициализация и цикл анимации
import { initScene } from './scene.js';
import { initGallery, openDetail, closeDetail, handleBuy, isDetailOpen } from './gallery.js';
import { initControls } from './controls.js';

const isMobile = /Android|iPhone|iPad|iPod|webOS/i.test(navigator.userAgent) || window.innerWidth < 768;

if (isMobile) {
  document.getElementById('hint').textContent = 'касайтесь работ · наклоняйте телефон · слайдер — скорость';
}

const { scene, camera, renderer, pointLight } = initScene(isMobile);
const { paintings, particles, SPREAD_Z } = initGallery(scene, isMobile);

const raycaster = new THREE.Raycaster();

function handleTapOrClick(cx, cy) {
  if (isDetailOpen()) return;
  const m = new THREE.Vector2((cx / window.innerWidth) * 2 - 1, -(cy / window.innerHeight) * 2 + 1);
  raycaster.setFromCamera(m, camera);
  const hits = raycaster.intersectObjects(paintings.map(p => p.mesh));
  if (hits.length > 0) {
    const p = paintings.find(pp => pp.mesh === hits[0].object);
    if (p) openDetail(p.art);
  }
}

const { mouse, targetMouse, updateSpeed } = initControls(camera, renderer, isMobile, handleTapOrClick);

// Клик мышью на десктопе
window.addEventListener('click', (e) => {
  if (isMobile || isDetailOpen()) return;
  if (e.target.closest('#speed-control')) return;
  handleTapOrClick(e.clientX, e.clientY);
});

// Кнопки панели детали
document.getElementById('detail-close').addEventListener('click', closeDetail);
document.getElementById('d-back').addEventListener('click', closeDetail);
document.getElementById('d-btn').addEventListener('click', handleBuy);
document.getElementById('detail-inner').addEventListener('click', (e) => e.stopPropagation());

// Свайп вниз закрывает панель на мобильном
let dtsy = 0;
document.getElementById('detail').addEventListener('touchstart', (e) => { dtsy = e.touches[0].clientY; }, { passive: true });
document.getElementById('detail').addEventListener('touchend', (e) => { if (e.changedTouches[0].clientY - dtsy > 80) closeDetail(); }, { passive: true });

// Цикл анимации
const clock = new THREE.Clock();

function animate() {
  requestAnimationFrame(animate);
  const t = clock.getElapsedTime();
  const speed = updateSpeed();

  camera.position.z -= speed;
  if (camera.position.z < -SPREAD_Z) camera.position.z += SPREAD_Z;

  mouse.x += (targetMouse.x - mouse.x) * 0.05;
  mouse.y += (targetMouse.y - mouse.y) * 0.05;
  camera.rotation.y = -mouse.x * 0.15;
  camera.rotation.x = mouse.y * 0.08;
  camera.position.x += (-mouse.x * 2 - camera.position.x) * 0.02;
  camera.position.y += (mouse.y * 1.2 + 1 - camera.position.y) * 0.02;
  pointLight.position.z = camera.position.z;
  pointLight.position.x = camera.position.x;

  // Ховер-эффект (только десктоп)
  let hoveredMesh = null;
  if (!isMobile) {
    raycaster.setFromCamera(mouse, camera);
    const hh = raycaster.intersectObjects(paintings.map(p => p.mesh));
    hoveredMesh = hh.length > 0 ? hh[0].object : null;
  }

  paintings.forEach(p => {
    p.mesh.position.y = p.origPos.y + Math.sin(t * p.floatSpeed + p.floatOffset) * p.floatAmp;
    p.mesh.position.x = p.origPos.x + Math.sin(t * p.floatSpeed * 0.7 + p.floatOffset + 1) * p.floatAmp * 0.5;
    const isH = p.mesh === hoveredMesh;
    const ce = p.mesh.material.emissiveIntensity || 0;
    p.mesh.material.emissive = new THREE.Color(0xffffff);
    p.mesh.material.emissiveIntensity = ce + ((isH ? 0.12 : 0) - ce) * 0.1;
    p.mesh.scale.lerp(new THREE.Vector3(isH ? 1.08 : 1, isH ? 1.08 : 1, 1), 0.1);
    if (isH) renderer.domElement.style.cursor = 'pointer';
  });
  if (!hoveredMesh && !isMobile) renderer.domElement.style.cursor = 'default';

  particles.position.z = camera.position.z;
  renderer.render(scene, camera);
}

animate();
