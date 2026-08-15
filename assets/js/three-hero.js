import * as THREE from 'three';
import { FontLoader } from 'three/addons/loaders/FontLoader.js';
import { TextGeometry } from 'three/addons/geometries/TextGeometry.js';

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

  /* Constelación de datos: líneas entre nodos */
  var connections = [];
  for (var c = 0; c < COUNT; c++) {
    connections.push([c, (c + 1) % COUNT]);
    connections.push([c, (c + 2) % COUNT]);
    connections.push([c, (c + 3) % COUNT]);
  }
  var lineGeo = new THREE.BufferGeometry();
  lineGeo.setAttribute('position', new THREE.BufferAttribute(new Float32Array(connections.length * 6), 3));
  var lineMat = new THREE.LineBasicMaterial({
    color: accent,
    transparent: true,
    opacity: 0.3,
    blending: THREE.AdditiveBlending
  });
  var lines = new THREE.LineSegments(lineGeo, lineMat);
  scene.add(lines);

  /* Paquetes de datos viajando por las conexiones */
  var packetGeo = new THREE.SphereGeometry(0.045, 12, 12);
  var packets = [];
  var PACKET_COUNT = 7;
  for (var p = 0; p < PACKET_COUNT; p++) {
    var conn = connections[(p * 5) % connections.length];
    var mesh = new THREE.Mesh(packetGeo, new THREE.MeshBasicMaterial({
      color: accent,
      transparent: true,
      opacity: 0.9
    }));
    scene.add(mesh);
    packets.push({ mesh: mesh, a: conn[0], b: conn[1], t: p / PACKET_COUNT, speed: 0.28 + (p % 4) * 0.08 });
  }

  /* Campo de partículas flotantes */
  var PARTICLE_COUNT = 420;
  var particlePositions = new Float32Array(PARTICLE_COUNT * 3);
  var pSpeeds = new Float32Array(PARTICLE_COUNT);
  for (var i = 0; i < PARTICLE_COUNT; i++) {
    var radius = 2 + Math.random() * 3.6;
    var theta = Math.random() * Math.PI * 2;
    particlePositions[i * 3] = Math.cos(theta) * radius;
    particlePositions[i * 3 + 1] = Math.random() * 2.8 - 0.4;
    particlePositions[i * 3 + 2] = Math.sin(theta) * radius;
    pSpeeds[i] = 0.02 + Math.random() * 0.07;
  }
  var particleGeo = new THREE.BufferGeometry();
  particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
  var particleMat = new THREE.PointsMaterial({
    color: accent,
    size: 0.045,
    transparent: true,
    opacity: 0.5,
    blending: THREE.AdditiveBlending,
    depthWrite: false
  });
  var particles = new THREE.Points(particleGeo, particleMat);
  scene.add(particles);

  /* Texto 3D "MySQL" */
  var textGroup = new THREE.Group();
  scene.add(textGroup);
  var textMesh = null;
  var fontLoader = new FontLoader();
  fontLoader.load(
    'https://cdn.jsdelivr.net/npm/three@0.160.0/examples/fonts/helvetiker_bold.typeface.json',
    function (font) {
      var geo = new TextGeometry('MySQL', {
        font: font,
        size: 0.3,
        height: 0.08,
        curveSegments: 8,
        bevelEnabled: true,
        bevelThickness: 0.012,
        bevelSize: 0.012,
        bevelSegments: 2
      });
      geo.center();
      textMesh = new THREE.Mesh(geo, new THREE.MeshStandardMaterial({
        color: accent,
        metalness: 0.5,
        roughness: 0.3,
        emissive: accent,
        emissiveIntensity: 0.3
      }));
      textMesh.position.y = 1.2;
      textGroup.add(textMesh);
    }
  );



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
    nodes.forEach(function (n) {
      n.mesh.material.color = accent;
      n.mesh.material.emissive = accent;
    });
    shell.material.color = accent;
    pointLight.color = accent;
    lineMat.color = accent;
    packets.forEach(function (pkt) {
      pkt.mesh.material.color = accent;
    });
    particleMat.color = accent;
    if (textMesh) {
      textMesh.material.color = accent;
      textMesh.material.emissive = accent;
    }
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
  var elapsed = 0;
  var vA = new THREE.Vector3();
  var vB = new THREE.Vector3();

  function animate() {
    if (!reduced) {
      var delta = clock.getDelta();
      elapsed += delta;
      var t = elapsed;

      group.rotation.y = t * 0.12;

      nodes.forEach(function (n) {
        n.mesh.position.y = n.height + Math.sin(t * n.speed) * 0.05;
      });

      shell.rotation.x = t * 0.03;
      shell.rotation.y = t * 0.05;

      /* Líneas de la constelación: siguen a los nodos en coordenadas del mundo */
      var posArr = lineGeo.attributes.position.array;
      var li = 0;
      connections.forEach(function (conn) {
        nodes[conn[0]].mesh.getWorldPosition(vA);
        nodes[conn[1]].mesh.getWorldPosition(vB);
        posArr[li++] = vA.x; posArr[li++] = vA.y; posArr[li++] = vA.z;
        posArr[li++] = vB.x; posArr[li++] = vB.y; posArr[li++] = vB.z;
      });
      lineGeo.attributes.position.needsUpdate = true;

      /* Paquetes de datos viajando */
      packets.forEach(function (pkt) {
        pkt.t += delta * pkt.speed;
        if (pkt.t >= 1) pkt.t -= 1;
        nodes[pkt.a].mesh.getWorldPosition(vA);
        nodes[pkt.b].mesh.getWorldPosition(vB);
        pkt.mesh.position.lerpVectors(vA, vB, pkt.t);
      });

      /* Partículas flotando hacia arriba */
      var pArr = particleGeo.attributes.position.array;
      for (var i = 0; i < PARTICLE_COUNT; i++) {
        pArr[i * 3 + 1] += pSpeeds[i] * delta * 3;
        if (pArr[i * 3 + 1] > 2.4) pArr[i * 3 + 1] = -0.4;
      }
      particleGeo.attributes.position.needsUpdate = true;
      particles.rotation.y += delta * 0.02;

      /* Texto 3D girando suavemente */
      if (textMesh) {
        textGroup.rotation.y += delta * 0.35;
        textMesh.position.y = 1.2 + Math.sin(t * 0.5) * 0.04;
      }

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
