(function () {
  var container = document.getElementById('er-3d');
  if (!container) return;
  var canvas = document.getElementById('er-canvas');
  if (!canvas) return;

  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var msgEl = document.getElementById('er-3d-msg');

  function showMessage(text) {
    if (msgEl) {
      msgEl.textContent = text;
      msgEl.style.display = 'block';
    }
  }

  if (!window.BABYLON) {
    showMessage('No se pudo cargar Babylon.js. Revisa tu conexión a internet.');
    canvas.remove();
    return;
  }

  function cssVar(name, fallback) {
    var v = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
    return v || fallback;
  }

  var engine;
  try {
    engine = new BABYLON.Engine(canvas, true, { preserveDrawingBuffer: false, stencil: true });
  } catch (e) {
    showMessage('Tu navegador no soporta WebGL, así que no se puede mostrar el diagrama 3D.');
    canvas.remove();
    return;
  }

  var scene = new BABYLON.Scene(engine);
  scene.clearColor = new BABYLON.Color4(0, 0, 0, 0);

  var accentHex = cssVar('--accent', '#4f7cff');
  var textHex = cssVar('--text-primary', '#1a1a2e');
  var mutedHex = cssVar('--text-muted', '#7a7a94');

  /* Cámara orbital */
  var camera = new BABYLON.ArcRotateCamera('cam', Math.PI / 4, Math.PI / 3.1, 12, BABYLON.Vector3.Zero(), scene);
  camera.lowerRadiusLimit = 6;
  camera.upperRadiusLimit = 24;
  camera.wheelDeltaPercentage = 0.02;
  camera.panningSensibility = 60;
  camera.attachControl(canvas, true);
  if (!reduced) {
    camera.useAutoRotationBehavior = true;
    camera.autoRotationBehavior.idleRotationSpeed = 0.6;
  }

  /* Luces */
  var hemi = new BABYLON.HemisphericLight('hemi', new BABYLON.Vector3(0, 1, 0), scene);
  hemi.intensity = 0.75;
  var dir = new BABYLON.DirectionalLight('dir', new BABYLON.Vector3(-1, -2, -1), scene);
  dir.intensity = 0.6;
  dir.position = new BABYLON.Vector3(-6, 9, -6);

  /* Suelo con rejilla */
  var groundMat = new BABYLON.StandardMaterial('groundMat', scene);
  var groundTex = null;

  function makeGroundTexture() {
    var size = 512;
    if (groundTex) groundTex.dispose();
    groundTex = new BABYLON.DynamicTexture('groundTex', { width: size, height: size }, scene, true);
    var ctx = groundTex.getContext();
    ctx.clearRect(0, 0, size, size);
    ctx.strokeStyle = accentHex;
    ctx.globalAlpha = 0.5;
    ctx.lineWidth = 3;
    var step = size / 4;
    for (var i = 0; i <= 4; i++) {
      ctx.beginPath();
      ctx.moveTo(i * step, 0);
      ctx.lineTo(i * step, size);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(0, i * step);
      ctx.lineTo(size, i * step);
      ctx.stroke();
    }
    groundTex.update();
    return groundTex;
  }

  groundMat.diffuseTexture = makeGroundTexture();
  groundMat.alpha = 0.55;
  groundMat.emissiveColor = new BABYLON.Color3(1, 1, 1);
  groundMat.disableLighting = true;

  var ground = BABYLON.MeshBuilder.CreateGround('ground', { width: 12, height: 12, subdivisions: 8 }, scene);
  ground.material = groundMat;
  ground.position.y = -0.01;
  ground.isPickable = false;

  /* Entidades */
  var ENTITIES = [
    { name: 'AUTOR', x: -2.6, z: -2.6, attrs: 'id_autor · nombre · apellido · nacionalidad' },
    { name: 'LIBRO', x: 2.6, z: -2.6, attrs: 'isbn · titulo · anio_publicacion · genero' },
    { name: 'SOCIO', x: -2.6, z: 2.6, attrs: 'id_socio · nombre · direccion · telefono · email' },
    { name: 'PRESTAMO', x: 2.6, z: 2.6, attrs: 'id_prestamo · fecha_inicio · fecha_devolucion · estado' }
  ];

  var boxes = [];
  var boxMats = [];

  function createLabelMesh(text, textColor, width, height) {
    var plane = BABYLON.MeshBuilder.CreatePlane('label_' + text, { width: width, height: height }, scene);
    plane.billboardMode = BABYLON.Mesh.BILLBOARDMODE_ALL;
    plane.isPickable = false;
    var dyn = new BABYLON.DynamicTexture('dt_' + text, { width: 256, height: 64 }, scene, true);
    var ctx = dyn.getContext();
    ctx.clearRect(0, 0, 256, 64);
    ctx.fillStyle = textColor;
    ctx.font = 'bold 30px Poppins, Inter, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(text, 128, 32);
    dyn.update();
    var mat = new BABYLON.StandardMaterial('labmat_' + text, scene);
    mat.diffuseTexture = dyn;
    mat.diffuseTexture.hasAlpha = true;
    mat.emissiveColor = new BABYLON.Color3(1, 1, 1);
    mat.disableLighting = true;
    mat.backFaceCulling = false;
    plane.material = mat;
    return { mesh: plane, dyn: dyn };
  }

  ENTITIES.forEach(function (ent) {
    var box = BABYLON.MeshBuilder.CreateBox('box_' + ent.name, { width: 1.7, height: 0.5, depth: 1.7 }, scene);
    box.position = new BABYLON.Vector3(ent.x, 0.3, ent.z);
    var mat = new BABYLON.StandardMaterial('mat_' + ent.name, scene);
    mat.diffuseColor = BABYLON.Color3.FromHexString(accentHex);
    mat.specularColor = new BABYLON.Color3(0.12, 0.12, 0.12);
    mat.emissiveColor = new BABYLON.Color3.FromHexString(accentHex).scale(0.18);
    box.material = mat;
    boxes.push(box);
    boxMats.push(mat);

    var label = createLabelMesh(ent.name, textHex, 2.6, 0.62);
    label.mesh.position = new BABYLON.Vector3(ent.x, 0.95, ent.z);

    var attrLabel = createLabelMesh(ent.attrs, mutedHex, 4.4, 0.5);
    attrLabel.mesh.position = new BABYLON.Vector3(ent.x, -0.35, ent.z);
  });

  /* Relaciones */
  var RELATIONS = [
    { a: 'AUTOR', b: 'LIBRO', label: 'escribe', card: '1:N' },
    { a: 'SOCIO', b: 'PRESTAMO', label: 'realiza', card: '1:N' },
    { a: 'LIBRO', b: 'PRESTAMO', label: 'incluye', card: '1:N' }
  ];

  var posOf = {};
  ENTITIES.forEach(function (e) { posOf[e.name] = new BABYLON.Vector3(e.x, 0.3, e.z); });

  var relLines = [];
  var relPulseSpheres = [];

  RELATIONS.forEach(function (rel) {
    var p1 = posOf[rel.a];
    var p2 = posOf[rel.b];
    var mid = BABYLON.Vector3.Center(p1, p2);

    var line = BABYLON.MeshBuilder.CreateDashedLines('rel_' + rel.a + '_' + rel.b, {
      points: [p1, p2],
      dashSize: 0.16,
      gapSize: 0.12
    }, scene);
    line.color = BABYLON.Color3.FromHexString(accentHex);
    line.alpha = 0.9;
    line.isPickable = false;
    relLines.push(line);

    var pulse = BABYLON.MeshBuilder.CreateSphere('pulse_' + rel.label, { diameter: 0.22, segments: 12 }, scene);
    pulse.position = mid;
    var pulseMat = new BABYLON.StandardMaterial('pulseMat_' + rel.label, scene);
    pulseMat.diffuseColor = BABYLON.Color3.FromHexString(accentHex);
    pulseMat.emissiveColor = BABYLON.Color3.FromHexString(accentHex).scale(0.6);
    pulse.material = pulseMat;
    pulse.isPickable = false;
    relPulseSpheres.push({ mesh: pulse, mat: pulseMat });

    var label = createLabelMesh(rel.label, textHex, 2.0, 0.5);
    label.mesh.position = mid.add(new BABYLON.Vector3(0, 0.28, 0));

    var cardLabel = createLabelMesh(rel.card, mutedHex, 1.1, 0.4);
    cardLabel.mesh.position = BABYLON.Vector3.Lerp(p1, mid, 0.5).add(new BABYLON.Vector3(0, 0.18, 0));
  });

  /* Actualizar colores al cambiar tema */
  function applyTheme() {
    accentHex = cssVar('--accent', '#4f7cff');
    textHex = cssVar('--text-primary', '#1a1a2e');
    mutedHex = cssVar('--text-muted', '#7a7a94');

    boxMats.forEach(function (m) {
      m.diffuseColor = BABYLON.Color3.FromHexString(accentHex);
      m.emissiveColor = BABYLON.Color3.FromHexString(accentHex).scale(0.18);
    });
    relLines.forEach(function (l) {
      l.color = BABYLON.Color3.FromHexString(accentHex);
    });
    relPulseSpheres.forEach(function (s) {
      s.mat.diffuseColor = BABYLON.Color3.FromHexString(accentHex);
      s.mat.emissiveColor = BABYLON.Color3.FromHexString(accentHex).scale(0.6);
    });
    groundMat.diffuseTexture = makeGroundTexture();
    if (msgEl) msgEl.style.display = 'none';
  }
  document.addEventListener('theme-changed', applyTheme);

  /* Animación suave de los pulsos */
  if (!reduced) {
    scene.registerBeforeRender(function () {
      var t = performance.now() / 1000;
      relPulseSpheres.forEach(function (s, i) {
        var scale = 1 + Math.sin(t * 2 + i * 0.8) * 0.22;
        s.mesh.scaling = new BABYLON.Vector3(scale, scale, scale);
        s.mat.emissiveIntensity = 0.5 + Math.sin(t * 2 + i * 0.8) * 0.4;
      });
    });
  }

  window.addEventListener('resize', function () {
    engine.resize();
  });

  engine.runRenderLoop(function () {
    scene.render();
  });
})();
