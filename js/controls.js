// Управление камерой: мышь, тач и гироскоп

export function initControls(camera, canvas) {
  initMouseControls(camera, canvas);
  initTouchControls(camera, canvas);
  initGyroscope(camera);
}

// Управление мышью
function initMouseControls(camera, canvas) {
  let isDragging = false;
  let prevX = 0;
  let prevY = 0;

  canvas.addEventListener('mousedown', (e) => {
    isDragging = true;
    prevX = e.clientX;
    prevY = e.clientY;
  });

  canvas.addEventListener('mousemove', (e) => {
    if (!isDragging) return;
    const dx = e.clientX - prevX;
    const dy = e.clientY - prevY;
    rotateCamera(camera, dx, dy);
    prevX = e.clientX;
    prevY = e.clientY;
  });

  canvas.addEventListener('mouseup', () => { isDragging = false; });
  canvas.addEventListener('mouseleave', () => { isDragging = false; });
}

// Тач-управление
function initTouchControls(camera, canvas) {
  let prevTouchX = 0;
  let prevTouchY = 0;

  canvas.addEventListener('touchstart', (e) => {
    prevTouchX = e.touches[0].clientX;
    prevTouchY = e.touches[0].clientY;
  });

  canvas.addEventListener('touchmove', (e) => {
    e.preventDefault();
    const dx = e.touches[0].clientX - prevTouchX;
    const dy = e.touches[0].clientY - prevTouchY;
    rotateCamera(camera, dx, dy);
    prevTouchX = e.touches[0].clientX;
    prevTouchY = e.touches[0].clientY;
  }, { passive: false });
}

// Гироскоп (мобильные устройства)
function initGyroscope(camera) {
  window.addEventListener('deviceorientation', (e) => {
    if (e.beta === null || e.gamma === null) return;
    // Нормализуем углы в небольшое смещение камеры
    camera.rotation.x = THREE.MathUtils.degToRad(e.beta - 90) * 0.1;
    camera.rotation.y = THREE.MathUtils.degToRad(e.gamma) * 0.1;
  });
}

// Поворот камеры на основе дельты движения
function rotateCamera(camera, dx, dy) {
  const sensitivity = 0.003;
  camera.rotation.y -= dx * sensitivity;
  camera.rotation.x -= dy * sensitivity;
  // Ограничиваем вертикальный угол
  camera.rotation.x = Math.max(-Math.PI / 4, Math.min(Math.PI / 4, camera.rotation.x));
}
