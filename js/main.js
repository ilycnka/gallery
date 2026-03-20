// Точка входа — инициализация сцены и управления
import { initScene } from './scene.js';
import { initControls } from './controls.js';

const canvas = document.getElementById('canvas');

const { scene, camera, renderer } = initScene(canvas);
initControls(camera, canvas);
