import * as THREE from 'three';

(function () {
  var canvas = document.getElementById('hero-canvas');
  if (!canvas) return;

  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  var renderer;
  try {
    renderer = new THREE.WebGLRenderer({ canvas: canvas, alpha: true, antialias: true });
  } catch (e) {
    canvas.remove();
    return;
  }

  document.body.classList.add('webgl-active');
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  var scene = new THREE.Scene();
  var camera = new THREE.PerspectiveCamera(50, 1, 0.1, 100);
  camera.position.set(0, 1.7, 4.4);

  function cssVar(name, fallback) {
    var v = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
    return v || fallback;
  }

  function color(hex) {
    return new THREE.Color(hex);
  }

  var accentHex = cssVar('--accent', '#4f7cff');
  var mutedHex = cssVar('--text-muted', '#7a7a94');
  var accent = color(accentHex);

  /* Luces */
  scene.add(new THREE.AmbientLight(0xffffff, 0.65));
  var dirLight = new THREE.DirectionalLight(0xffffff, 1.1);
  dirLight.position.set(3, 5, 4);
  scene.add(dirLight);
  var pointLight = new THREE.PointLight(accentHex, 1.2, 12);
  pointLight.position.set(-2, 2, 3);
  scene.add(pointLight);

  var group = new THREE.Group();
  scene.add(group);

  /* Cilindro central (servidor de base de datos) */
  var serverMat = new THREE.MeshStandardMaterial({
    color: accent,
    metalness: 0.35,
    roughness: 0.35,
    emissive: accent,
    emissiveIntensity: 0.18
  });

  var cyl = new THREE.Mesh(new THREE.CylinderGeometry(0.5, 0.5, 1.1, 48), serverMat);
  cyl.position.y = 0.35;
  group.add(cyl);

  var cap = new THREE.Mesh(new THREE.SphereGeometry(0.24, 32, 32), serverMat);
  cap.position.y = 1.12;
  group.add(cap);

  /* Anillos tipo "platter" */
  var ringMat = new THREE.MeshStandardMaterial({
    color: accent,
    metalness: 0.7,
    roughness: 0.25,
    transparent: true,
    opacity: 0.8,
    emissive: accent,
    emissiveIntensity: 0.25
  });
  var torusGeo = new THREE.TorusGeometry(1.0, 0.035, 16, 64);
  [0.1, 0.62].forEach(function (y) {
    var ring = new THREE.Mesh(torusGeo, ringMat);
    ring.rotation.x = Math.PI / 2.1;
    ring.position.y = y;
    group.add(ring);
  });

  /* Nodos orbitantes */
  var nodeMat = new THREE.MeshStandardMaterial({
    color: accent,
    emissive: accent,
    emissiveIntensity: 0.35,
    roughness: 0.4
  });
  var nodeGeo = new THREE.IcosahedronGeometry(0.13, 0);
  var nodes = [];
  var COUNT = 8;
  var ORBIT_RADIUS = 2.05;
  for (var i = 0; i < COUNT; i++) {
    var m = new THREE.Mesh(nodeGeo, nodeMat.clone());
    var angle = (i / COUNT) * Math.PI * 2;
    var height = 0.1 + (i % 5) * 0.18;
    m.position.set(Math.cos(angle) * ORBIT_RADIUS, height, Math.sin(angle) * ORBIT_RADIUS);
    group.add(m);
    nodes.push({ mesh: m, angle: angle, height: height, speed: 1.2 + (i % 3) * 0.5 });
  }

  /* Esfera wireframe envolvente */
  var shell = new THREE.Mesh(
    new THREE.SphereGeometry(2.9, 16, 16),
    new THREE.MeshBasicMaterial({ color: accent, wireframe: true, transparent: true, opacity: 0.07 })
  );
  shell.position.y = 0.35;
  group.add(shell);

  /* Rejilla de suelo */
  var grid = new THREE.GridHelper(8, 16, accent, color(mutedHex));
  grid.material.transparent = true;
  grid.material.opacity = 0.18;
  grid.position.y = -0.85;
  scene.add(grid);

  /* Parallax con el mouse */
  var targetX = 0;
  var targetY = 0;
  if (!reduced && window.matchMedia('(pointer: fine)').matches) {
    document.addEventListener('mousemove', function (e) {
      targetX = (e.clientX / window.innerWidth - 0.5) * 0.9;
      targetY = (e.clientY / window.innerHeight - 0.5) * 0.5;
    });
  }

  function applyTheme() {
    accentHex = cssVar('--accent', '#4f7cff');
    mutedHex = cssVar('--text-muted', '#7a7a94');
    accent = color(accentHex);
    serverMat.color = accent;
    serverMat.emissive = accent;
    ringMat.color = accent;
    ringMat.emissive = accent;
    nodes.forEach(function (n) {
      n.mesh.material.color = accent;
      n.mesh.material.emissive = accent;
    });
    shell.material.color = accent;
    pointLight.color = accent;
    grid.geometry.dispose();
    grid.material.dispose();
    scene.remove(grid);
    grid = new THREE.GridHelper(8, 16, accent, color(mutedHex));
    grid.material.transparent = true;
    grid.material.opacity = 0.18;
    grid.position.y = -0.85;
    scene.add(grid);
  }

  document.addEventListener('theme-changed', applyTheme);

  /* Resize */
  function resize() {
    var parent = canvas.parentElement;
    if (!parent) return;
    var w = parent.clientWidth;
    var h = parent.clientHeight;
    if (w === 0 || h === 0) return;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
  }

  var ro = new ResizeObserver(resize);
  if (canvas.parentElement) ro.observe(canvas.parentElement);
  window.addEventListener('resize', resize);
  resize();

  /* Bucle de render */
  var clock = new THREE.Clock();

  function animate() {
    if (!reduced) {
      var t = clock.getElapsedTime();

      group.rotation.y = t * 0.12;

      nodes.forEach(function (n) {
        n.mesh.position.y = n.height + Math.sin(t * n.speed) * 0.05;
      });

      shell.rotation.x = t * 0.03;
      shell.rotation.y = t * 0.05;

      /* Parallax suave de cámara */
      camera.position.x += (targetX * 0.6 - camera.position.x) * 0.04;
      camera.position.y += (1.7 + targetY * 0.35 - camera.position.y) * 0.04;
      camera.lookAt(0, 0.35, 0);
    }

    renderer.render(scene, camera);
    requestAnimationFrame(animate);
  }

  if (reduced) {
    renderer.render(scene, camera);
  } else {
    animate();
  }
})();
