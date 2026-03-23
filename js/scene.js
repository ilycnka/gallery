// Инициализация сцены, камеры, рендерера и освещения
export function initScene(isMobile) {
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0xf5f5f5);
  scene.fog = new THREE.FogExp2(0xf5f5f5, 0.012);

  const camera = new THREE.PerspectiveCamera(isMobile ? 70 : 60, window.innerWidth / window.innerHeight, 0.1, 500);
  camera.position.set(0, 0, 0);

  const renderer = new THREE.WebGLRenderer({ antialias: !isMobile, powerPreference: 'high-performance' });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, isMobile ? 1.5 : 2));
  renderer.shadowMap.enabled = !isMobile;
  if (!isMobile) renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  document.body.appendChild(renderer.domElement);

  scene.add(new THREE.AmbientLight(0xffffff, 0.75));
  const dirLight = new THREE.DirectionalLight(0xffffff, 0.5);
  dirLight.position.set(5, 10, 5);
  scene.add(dirLight);
  const pointLight = new THREE.PointLight(0xfff5ee, 0.3, 100);
  pointLight.position.set(0, 5, 0);
  scene.add(pointLight);

  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });

  return { scene, camera, renderer, pointLight };
}
