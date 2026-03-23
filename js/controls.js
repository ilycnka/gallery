// Управление: мышь, тач-события, гироскоп, колесо прокрутки
export function initControls(isMobile, onTap) {
  const mouse = new THREE.Vector2();
  const targetMouse = new THREE.Vector2();
  let speed = 0.02;
  let targetSpeed = 0.02;

  // Слайдер скорости
  const speedSlider = document.getElementById('speedSlider');
  speedSlider.addEventListener('input', () => {
    targetSpeed = (speedSlider.value / 100) * 0.08;
  });

  // Колесо мыши меняет скорость
  window.addEventListener('wheel', (e) => {
    targetSpeed = Math.max(0, Math.min(0.1, targetSpeed + e.deltaY * 0.00005));
    speedSlider.value = (targetSpeed / 0.08) * 100;
  }, { passive: true });

  // Движение мыши управляет камерой
  window.addEventListener('mousemove', (e) => {
    targetMouse.x = (e.clientX / window.innerWidth) * 2 - 1;
    targetMouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
  });

  // Тач-управление
  let touchStartX = 0, touchStartY = 0, touchMoved = false, isTouchDrag = false;

  window.addEventListener('touchstart', (e) => {
    if (e.target.closest('#speed-control') || e.target.closest('#detail')) return;
    const t = e.touches[0];
    touchStartX = t.clientX; touchStartY = t.clientY;
    touchMoved = false; isTouchDrag = true;
  }, { passive: true });

  window.addEventListener('touchmove', (e) => {
    if (!isTouchDrag) return;
    const t = e.touches[0];
    const dx = t.clientX - touchStartX, dy = t.clientY - touchStartY;
    if (Math.abs(dx) > 5 || Math.abs(dy) > 5) touchMoved = true;
    targetMouse.x = Math.max(-1, Math.min(1, dx * 0.004));
    targetMouse.y = Math.max(-1, Math.min(1, -dy * 0.004));
  }, { passive: true });

  window.addEventListener('touchend', (e) => {
    if (!touchMoved && isTouchDrag) {
      const touch = e.changedTouches[0];
      onTap(touch.clientX, touch.clientY);
    }
    isTouchDrag = false;
    targetMouse.x *= 0.3; targetMouse.y *= 0.3;
  }, { passive: true });

  // Гироскоп на мобильных
  let gyroEnabled = false, gyroBaseAlpha = null, gyroBaseBeta = null;

  function startGyro() {
    window.addEventListener('deviceorientation', (e) => {
      if (!gyroEnabled) return;
      const alpha = e.gamma || 0, beta = e.beta || 0;
      if (gyroBaseAlpha === null) { gyroBaseAlpha = alpha; gyroBaseBeta = beta; }
      targetMouse.x = Math.max(-1, Math.min(1, (alpha - gyroBaseAlpha) / 30));
      targetMouse.y = Math.max(-1, Math.min(1, -(beta - gyroBaseBeta) / 40));
    }, { passive: true });
  }

  if (isMobile && window.DeviceOrientationEvent) {
    if (typeof DeviceOrientationEvent.requestPermission === 'function') {
      const gb = document.createElement('button');
      gb.textContent = '🔄 Включить гироскоп';
      gb.style.cssText = 'position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);z-index:300;padding:16px 28px;border-radius:30px;background:#1a1a1a;color:#fff;border:none;font-size:14px;font-family:inherit;cursor:pointer;-webkit-tap-highlight-color:transparent;box-shadow:0 8px 30px rgba(0,0,0,0.15);';
      document.body.appendChild(gb);
      gb.addEventListener('click', async () => {
        try {
          if ((await DeviceOrientationEvent.requestPermission()) === 'granted') {
            gyroEnabled = true; startGyro();
          }
        } catch {}
        gb.remove();
      });
    } else {
      gyroEnabled = true; startGyro();
    }
  }

  function updateSpeed() {
    speed += (targetSpeed - speed) * 0.03;
    return speed;
  }

  return { mouse, targetMouse, updateSpeed };
}
