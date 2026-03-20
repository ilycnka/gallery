// Управление картинами в галерее
import * as THREE from 'three';

// Создаёт плоскость с текстурой картины
export function createPainting(texturePath, position) {
  const texture = new THREE.TextureLoader().load(texturePath);
  const geometry = new THREE.PlaneGeometry(2, 1.4);
  const material = new THREE.MeshStandardMaterial({ map: texture });
  const mesh = new THREE.Mesh(geometry, material);
  mesh.position.set(...position);
  return mesh;
}

// Расставляет картины по сцене
export function populateGallery(scene, paintings) {
  paintings.forEach(({ src, position }) => {
    const painting = createPainting(src, position);
    scene.add(painting);
  });
}
