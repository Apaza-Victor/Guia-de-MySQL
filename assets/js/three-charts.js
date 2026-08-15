import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

(function () {
  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var containers = document.querySelectorAll('.chart-3d[data-chart3d]');
  if (!containers.length) return;

  function cssVar(name, fallback) {
    var v = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
    return v || fallback;
  }

  function hexColor(hex) {
    return new THREE.Color(hex);
  }

  /* Color de barra derivado del accent variando la luminosidad */
  function barColor(baseHex, i, count) {
    var c = hexColor(baseHex);
    var hsl = { h: 0, s: 0, l: 0 };
    c.getHSL(hsl);
    var step = 0.09;
    var l = Math.min(0.72, Math.max(0.2, hsl.l + (i - (count - 1) / 2) * step));
    return new THREE.Color().setHSL(hsl.h, hsl.s, l);
  }

  function formatNumber(v) {
    var n = Number(v);
    if (Number.isInteger(n)) return n.toLocaleString('es');
    return n.toLocaleString('es', { maximumFractionDigits: 2 });
  }

  function buildUI(wrap, data) {
    var canvas = document.createElement('canvas');
    canvas.setAttribute('aria-hidden', 'true');

    var canvasWrap = document.createElement('div');
    canvasWrap.className = 'chart-3d-canvas-wrap';
    canvasWrap.appendChild(canvas);

    var caption = document.createElement('div');
    caption.className = 'chart-3d-caption';

    if (data.title) {
      var title = document.createElement('p');
      title.className = 'chart-3d-title';
      title.textContent = data.title;
      caption.appendChild(title);
    }

    var legend = document.createElement('ul');
    legend.className = 'chart-3d-legend';
    data.bars.forEach(function (b, i) {
      var li = document.createElement('li');
      var dot = document.createElement('span');
      dot.className = 'chart-3d-dot';
      dot.style.background = '#' + barColor(cssVar('--accent', '#4f7cff'), i, data.bars.length).getHexString();
      li.appendChild(dot);
      var txt = document.createElement('span');
      txt.textContent = b.label + ': ' + formatNumber(b.value);
      li.appendChild(txt);
      legend.appendChild(li);
    });
    caption.appendChild(legend);

    wrap.innerHTML = '';
    wrap.appendChild(canvasWrap);
    wrap.appendChild(caption);
    return canvas;
  }

  containers.forEach(function (wrap) {
    var data;
    try {
      data = JSON.parse(wrap.getAttribute('data-chart3d'));
    } catch (e) {
      wrap.classList.add('chart-3d-error');
      wrap.innerHTML = '<p class="chart-3d-msg">No se pudieron leer los datos de la gráfica.</p>';
      return;
    }
    if (!data || !Array.isArray(data.bars) || !data.bars.length) return;

    var canvas = buildUI(wrap, data);
    var canvasWrap = wrap.querySelector('.chart-3d-canvas-wrap');
    var loadingMsg = document.createElement('p');
    loadingMsg.className = 'chart-3d-msg';
    loadingMsg.textContent = 'Cargando gráfica 3D...';
    canvasWrap.appendChild(loadingMsg);

    var renderer;
    try {
      renderer = new THREE.WebGLRenderer({ canvas: canvas, alpha: true, antialias: true });
    } catch (e) {
      wrap.classList.add('chart-3d-error');
      wrap.innerHTML = '<p class="chart-3d-msg">Tu navegador no soporta WebGL, así que no se puede mostrar esta gráfica.</p>';
      return;
    }
    if (loadingMsg) loadingMsg.remove();
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    var scene = new THREE.Scene();
    var camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100);
    camera.position.set(4.6, 4.6, 6.2);
    camera.lookAt(0, 0.7, 0);

    var controls = new OrbitControls(camera, canvas);
    controls.enableDamping = true;
    controls.dampingFactor = 0.08;
    controls.minDistance = 3;
    controls.maxDistance = 18;
    controls.maxPolarAngle = Math.PI / 2.05;
    controls.target.set(0, 0.7, 0);
    controls.autoRotate = true;
    controls.autoRotateSpeed = 1.1;

    scene.add(new THREE.AmbientLight(0xffffff, 0.7));
    var dir = new THREE.DirectionalLight(0xffffff, 1.05);
    dir.position.set(4, 7, 3);
    scene.add(dir);

    var accentHex = cssVar('--accent', '#4f7cff');
    var mutedHex = cssVar('--text-muted', '#7a7a94');

    var group = new THREE.Group();
    scene.add(group);

    var maxVal = Math.max.apply(null, data.bars.map(function (b) { return b.value; }));
    var BAR_W = 0.75;
    var GAP = 0.55;
    var totalW = data.bars.length * (BAR_W + GAP) - GAP;
    var barHeight = 2.4;
    var bars = [];

    data.bars.forEach(function (b, i) {
      var h = maxVal > 0 ? (b.value / maxVal) * barHeight : 0.1;
      var geo = new THREE.BoxGeometry(BAR_W, 1, BAR_W);
      geo.translate(0, 0.5, 0);
      var mat = new THREE.MeshStandardMaterial({
        color: barColor(accentHex, i, data.bars.length),
        metalness: 0.2,
        roughness: 0.55
      });
      var mesh = new THREE.Mesh(geo, mat);
      mesh.position.set(-totalW / 2 + BAR_W / 2 + i * (BAR_W + GAP), 0, 0);
      mesh.scale.y = reduced ? h : 0.001;
      group.add(mesh);
      bars.push({ mesh: mesh, target: h });
    });

    var grid = null;
    function makeGrid() {
      if (grid) {
        grid.geometry.dispose();
        grid.material.dispose();
        group.remove(grid);
      }
      grid = new THREE.GridHelper(Math.max(totalW + 2.5, 6), Math.max(data.bars.length * 4, 8), hexColor(accentHex), hexColor(mutedHex));
      grid.material.transparent = true;
      grid.material.opacity = 0.25;
      grid.position.y = 0.001;
      group.add(grid);
    }
    makeGrid();

    var basePlane = new THREE.Mesh(
      new THREE.PlaneGeometry(totalW + 2.5, totalW + 2),
      new THREE.MeshBasicMaterial({ color: hexColor(accentHex), transparent: true, opacity: 0.05 })
    );
    basePlane.rotation.x = -Math.PI / 2;
    basePlane.position.y = 0;
    group.add(basePlane);

    function applyTheme() {
      accentHex = cssVar('--accent', '#4f7cff');
      mutedHex = cssVar('--text-muted', '#7a7a94');
      bars.forEach(function (bar, i) {
        bar.mesh.material.color = barColor(accentHex, i, bars.length);
      });
      basePlane.material.color = hexColor(accentHex);
      makeGrid();
    }
    document.addEventListener('theme-changed', applyTheme);

    var started = false;
    var startTime = 0;

    function animate() {
      if (!started) {
        requestAnimationFrame(animate);
        return;
      }
      var t = (performance.now() - startTime) / 1000;
      var growing = !reduced;
      bars.forEach(function (bar) {
        if (growing && bar.mesh.scale.y < bar.target) {
          var ease = 1 - Math.pow(1 - Math.min(t / 0.9, 1), 3);
          bar.mesh.scale.y = Math.max(0.001, Math.min(bar.target, bar.target * ease));
        }
      });
      controls.update();
      renderer.render(scene, camera);
      requestAnimationFrame(animate);
    }

    function resize() {
      var w = canvasWrap.clientWidth;
      var h = canvasWrap.clientHeight;
      if (!w || !h) return;
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    }

    var ro = new ResizeObserver(resize);
    ro.observe(canvasWrap);
    window.addEventListener('resize', resize);
    resize();

    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting && !started) {
          started = true;
          startTime = performance.now();
          io.unobserve(wrap);
          requestAnimationFrame(animate);
        }
      });
    }, { threshold: 0.1 });
    io.observe(wrap);
  });
})();
