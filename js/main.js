const container = document.getElementById('game-container');

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x87ceeb);

const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camera.position.set(0, 5, 10);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
container.appendChild(renderer.domElement);

const light = new THREE.HemisphereLight(0xffffff, 0x444444);
light.position.set(0, 20, 0);
scene.add(light);

const planeGeometry = new THREE.ConeGeometry(0.5, 2, 8);
const planeMaterial = new THREE.MeshStandardMaterial({ color: 0xff0000 });
const plane = new THREE.Mesh(planeGeometry, planeMaterial);
plane.rotation.x = Math.PI / 2;
scene.add(plane);

const buildings = new THREE.Group();
scene.add(buildings);
for (let i = -20; i <= 20; i += 2) {
  for (let j = -20; j <= 20; j += 2) {
    const height = Math.random() * 4 + 1;
    const geometry = new THREE.BoxGeometry(1, height, 1);
    const material = new THREE.MeshStandardMaterial({ color: 0x808080 });
    const building = new THREE.Mesh(geometry, material);
    building.position.set(i, height / 2, j);
    buildings.add(building);
  }
}

const items = [];
function createItem() {
  const geometry = new THREE.SphereGeometry(0.3, 16, 16);
  const material = new THREE.MeshStandardMaterial({ color: 0xffff00 });
  const item = new THREE.Mesh(geometry, material);
  item.position.set(
    (Math.random() - 0.5) * 40,
    Math.random() * 5 + 1,
    (Math.random() - 0.5) * 40
  );
  scene.add(item);
  items.push(item);
}
for (let i = 0; i < 10; i++) createItem();

const obstacles = [];
function createObstacle() {
  const geometry = new THREE.BoxGeometry(1, 1, 1);
  const material = new THREE.MeshStandardMaterial({ color: 0x00ffff });
  const ob = new THREE.Mesh(geometry, material);
  ob.position.set(
    (Math.random() - 0.5) * 40,
    Math.random() * 5 + 1,
    (Math.random() - 0.5) * 40
  );
  scene.add(ob);
  obstacles.push(ob);
}
for (let i = 0; i < 5; i++) createObstacle();

let score = 0;

function updateScore() {
  document.getElementById('score').textContent = 'Score: ' + score;
}
updateScore();

const keys = {};
document.addEventListener('keydown', (e) => {
  keys[e.code] = true;
});
document.addEventListener('keyup', (e) => {
  keys[e.code] = false;
});

function animate() {
  requestAnimationFrame(animate);
  const speed = 0.1;
  if (keys['ArrowUp']) plane.position.z -= speed;
  if (keys['ArrowDown']) plane.position.z += speed;
  if (keys['ArrowLeft']) plane.position.x -= speed;
  if (keys['ArrowRight']) plane.position.x += speed;
  if (keys['Space']) plane.position.y += speed;
  if (keys['ShiftLeft']) plane.position.y -= speed;

  camera.position.set(
    plane.position.x,
    plane.position.y + 5,
    plane.position.z + 10
  );
  camera.lookAt(plane.position);

  for (let i = items.length - 1; i >= 0; i--) {
    if (plane.position.distanceTo(items[i].position) < 1) {
      scene.remove(items[i]);
      items.splice(i, 1);
      score++;
      updateScore();
    }
  }

  for (let ob of obstacles) {
    if (plane.position.distanceTo(ob.position) < 1) {
      alert('Game Over! Your score: ' + score);
      window.location.reload();
      return;
    }
  }

  renderer.render(scene, camera);
}
animate();

window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
