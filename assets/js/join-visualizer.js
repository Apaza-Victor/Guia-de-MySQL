(function () {
  var viz = document.getElementById('join-visualizer');
  if (!viz) return;

  var venn = viz.querySelector('.join-venn');
  var caption = viz.querySelector('.join-caption');
  var rowsEl = viz.querySelector('.join-rows');
  var buttons = Array.prototype.slice.call(viz.querySelectorAll('.join-btn'));

  var DATA = {
    inner: {
      caption: 'Solo las filas con coincidencia en ambas tablas. David Mora (sin pedidos) y el pedido 105 (sin cliente) quedan fuera.',
      rows: [
        { a: 'Ana López', b: 'pedido 101', v: '250.00' },
        { a: 'Ana López', b: 'pedido 102', v: '480.00' },
        { a: 'Carlos Ruiz', b: 'pedido 103', v: '150.00' },
        { a: 'Elena Gómez', b: 'pedido 104', v: '920.00' }
      ]
    },
    left: {
      caption: 'Todas las filas de clientes (A) más las coincidencias de pedidos (B). David Mora se incluye aunque no tenga pedidos (columnas en NULL).',
      rows: [
        { a: 'Ana López', b: 'pedido 101', v: '250.00' },
        { a: 'Ana López', b: 'pedido 102', v: '480.00' },
        { a: 'Carlos Ruiz', b: 'pedido 103', v: '150.00' },
        { a: 'Elena Gómez', b: 'pedido 104', v: '920.00' },
        { a: 'David Mora', b: 'pedido NULL', v: 'NULL', ghost: true }
      ]
    },
    right: {
      caption: 'Todas las filas de pedidos (B) más las coincidencias de clientes (A). El pedido 105 se incluye aunque no tenga cliente (columna en NULL).',
      rows: [
        { a: 'Ana López', b: 'pedido 101', v: '250.00' },
        { a: 'Ana López', b: 'pedido 102', v: '480.00' },
        { a: 'Carlos Ruiz', b: 'pedido 103', v: '150.00' },
        { a: 'Elena Gómez', b: 'pedido 104', v: '920.00' },
        { a: 'NULL', b: 'pedido 105', v: '300.00', ghost: true }
      ]
    },
    cross: {
      caption: 'Producto cartesiano: cada fila de clientes se combina con cada fila de pedidos. 4 clientes × 5 pedidos = 20 filas.',
      rows: [
        { a: 'Ana López', b: '101', v: '' },
        { a: 'Ana López', b: '102', v: '' },
        { a: 'Ana López', b: '105', v: '' },
        { a: 'Carlos Ruiz', b: '101', v: '' },
        { a: 'Elena Gómez', b: '103', v: '' },
        { a: 'David Mora', b: '105', v: '' }
      ]
    }
  };

  function render(join) {
    venn.setAttribute('data-join', join);
    caption.textContent = DATA[join].caption;
    rowsEl.innerHTML = '';

    var frag = document.createDocumentFragment();
    DATA[join].rows.forEach(function (r) {
      var div = document.createElement('div');
      div.className = 'join-row' + (r.ghost ? ' join-row-ghost' : '');
      var a = document.createElement('span');
      a.className = 'join-row-a';
      a.textContent = r.a;
      var arrow = document.createElement('span');
      arrow.className = 'join-row-arrow';
      arrow.setAttribute('aria-hidden', 'true');
      arrow.textContent = '→';
      var b = document.createElement('span');
      b.className = 'join-row-b';
      b.textContent = r.b;
      div.appendChild(a);
      div.appendChild(arrow);
      div.appendChild(b);
      if (r.v) {
        var v = document.createElement('span');
        v.className = 'join-row-val';
        v.textContent = r.v;
        div.appendChild(v);
      }
      frag.appendChild(div);
    });
    if (join === 'cross') {
      var note = document.createElement('div');
      note.className = 'join-row-note';
      note.textContent = '… 20 filas en total (4 clientes × 5 pedidos)';
      frag.appendChild(note);
    }
    rowsEl.appendChild(frag);

    buttons.forEach(function (b) {
      var active = b.getAttribute('data-join') === join;
      b.classList.toggle('is-active', active);
      b.setAttribute('aria-selected', active ? 'true' : 'false');
    });

    if (window.anime && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      window.anime({
        targets: rowsEl.querySelectorAll('.join-row'),
        opacity: [0, 1],
        translateY: [6, 0],
        duration: 350,
        easing: 'easeOutQuad',
        delay: function (el, i) { return i * 45; }
      });
    }
  }

  buttons.forEach(function (b) {
    b.addEventListener('click', function () {
      render(b.getAttribute('data-join'));
    });
  });

  render('inner');
})();
