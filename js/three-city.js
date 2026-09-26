/* Three.js — futuristic digital city for the hero.
   Procedural: emissive blocks/cylinders, neon edges, grid floor.
   Mouse-reactive camera + auto rotation. */

export function initCity3D(sel){
  const canvas = document.querySelector(sel);
  if (!canvas || !window.THREE) return;

  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const scene = new THREE.Scene();
  scene.background = null;
  scene.fog = new THREE.FogExp2(0x03050a, 0.012);

  const w = () => canvas.clientWidth;
  const h = () => canvas.clientHeight;

  const camera = new THREE.PerspectiveCamera(60, w() / h(), 0.1, 1000);
  camera.position.set(28, 18, 38);
  camera.lookAt(0, 6, 0);

  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(2, window.devicePixelRatio || 1));
  renderer.setSize(w(), h(), false);

  // lights
  scene.add(new THREE.AmbientLight(0x223344, .6));
  const pt1 = new THREE.PointLight(0x00f0ff, 1.2, 80); pt1.position.set(20, 20, 20); scene.add(pt1);
  const pt2 = new THREE.PointLight(0xff3aa6, 1.2, 80); pt2.position.set(-20, 12, -20); scene.add(pt2);
  const pt3 = new THREE.PointLight(0x5b6bff, 1, 80); pt3.position.set(0, 30, 0); scene.add(pt3);

  // ────────── city procedural ──────────
  const CITY = { size: 28, rows: 10, cols: 10, spacing: 4 };
  const buildings = [];
  const cityGroup = new THREE.Group();
  scene.add(cityGroup);

  // shared geometry / materials
  const boxGeo = new THREE.BoxGeometry(1, 1, 1);
  const cylGeo = new THREE.CylinderGeometry(.05, .05, 1, 6);
  const wireGeo = new THREE.EdgesGeometry(boxGeo);

  // helper material factory
  const wireColor = (c, op = 1) => new THREE.LineBasicMaterial({ color: c, transparent: true, opacity: op });

  for (let r = -CITY.rows/2; r < CITY.rows/2; r++){
    for (let c = -CITY.cols/2; c < CITY.cols/2; c++){
      const x = c * CITY.spacing + (Math.random() - .5) * .8;
      const z = r * CITY.spacing + (Math.random() - .5) * .8;
      const height = Math.random() * 10 + 1.2;
      const width = Math.random() * 1.6 + .8;
      const depth = Math.random() * 1.6 + .8;

      const towerGroup = new THREE.Group();
      towerGroup.position.set(x, 0, z);

      // wireframe box (no fill)
      const wireColor_ = Math.random() < .5 ? 0x00f0ff : (Math.random() < .5 ? 0x5b6bff : 0xff3aa6);
      const edges = new THREE.LineSegments(wireGeo, wireColor(wireColor_, .6 + Math.random() * .3));
      edges.scale.set(width, height, depth);
      edges.position.y = height / 2;
      towerGroup.add(edges);

      // solid block (transparent, low alpha) — gives interior depth
      const innerMat = new THREE.MeshBasicMaterial({
        color: wireColor_,
        transparent: true,
        opacity: .04 + Math.random() * .06,
        side: THREE.DoubleSide,
        depthWrite: false,
      });
      const inner = new THREE.Mesh(boxGeo, innerMat);
      inner.scale.set(width, height, depth);
      inner.position.y = height / 2;
      towerGroup.add(inner);

      // antenna on tall ones
      if (height > 7){
        const ant = new THREE.Mesh(cylGeo, new THREE.MeshBasicMaterial({ color: wireColor_ }));
        ant.scale.set(1, height * .5, 1);
        ant.position.y = height + height * .25;
        towerGroup.add(ant);

        // antenna tip
        const tip = new THREE.Mesh(
          new THREE.SphereGeometry(.15, 8, 8),
          new THREE.MeshBasicMaterial({ color: wireColor_ })
        );
        tip.position.y = height + height * .5 + .15;
        towerGroup.add(tip);
        buildings.push({ group: towerGroup, height, x, z, tip, color: wireColor_ });
      } else {
        buildings.push({ group: towerGroup, height, x, z, color: wireColor_ });
      }

      cityGroup.add(towerGroup);
    }
  }

  // ground grid
  const grid = new THREE.GridHelper(80, 40, 0x00f0ff, 0x0a0f1c);
  grid.material.opacity = .35;
  grid.material.transparent = true;
  grid.position.y = 0;
  scene.add(grid);

  // ring of light around the city
  const ringGeo = new THREE.RingGeometry(22, 22.3, 64);
  const ring = new THREE.Mesh(ringGeo, new THREE.MeshBasicMaterial({
    color: 0x00f0ff, transparent: true, opacity: .5, side: THREE.DoubleSide,
  }));
  ring.rotation.x = -Math.PI / 2;
  ring.position.y = 0.05;
  scene.add(ring);

  // ────────── camera orbit ──────────
  let targetRotY = 0;
  let mouseX = 0, mouseY = 0;
  const baseRadius = 38;
  const baseHeight = 18;
  const rotSpeed = .04;

  const onMove = (e) => {
    const ev = e.touches ? e.touches[0] : e;
    mouseX = ((ev.clientX / window.innerWidth)  - .5) * 2;
    mouseY = ((ev.clientY / window.innerHeight) - .5) * 2;
    targetRotY = -mouseX * .25;
  };
  window.addEventListener('mousemove', onMove, { passive: true });
  window.addEventListener('touchmove', onMove, { passive: true });

  const resize = () => {
    renderer.setSize(w(), h(), false);
    camera.aspect = w() / h();
    camera.updateProjectionMatrix();
  };
  window.addEventListener('resize', resize);
  resize();

  // ────────── render loop ──────────
  const clock = new THREE.Clock();
  let cancelled = false;
  const loop = () => {
    if (cancelled) return;
    const t = clock.getElapsedTime();
    if (!reduced){
      // orbit
      const angle = t * rotSpeed + targetRotY;
      camera.position.x = Math.cos(angle) * baseRadius + mouseX * 4;
      camera.position.z = Math.sin(angle) * baseRadius + mouseY * 4;
      camera.position.y = baseHeight + mouseY * -3;
      camera.lookAt(0, 4, 0);

      // antenna blinks
      for (const b of buildings){
        if (b.tip){
          const phase = (Math.sin(t * 2 + b.x + b.z) + 1) / 2;
          b.tip.material.color.setHex(b.color);
          b.tip.scale.setScalar(0.9 + phase * .6);
        }
      }
    }
    renderer.render(scene, camera);
    requestAnimationFrame(loop);
  };

  // only render when hero is in view (perf)
  let visible = true;
  const io = new IntersectionObserver(([e]) => { visible = e.isIntersecting; }, { threshold: 0 });
  io.observe(canvas);

  // rAF loop with visibility
  let raf;
  const safe = () => {
    if (!visible || reduced && !visible){ raf = requestAnimationFrame(safe); return; }
    loop();
    raf = requestAnimationFrame(safe);
  };
  if (!reduced){ safe(); } else {
    // single render
    renderer.render(scene, camera);
  }

  return () => { cancelled = true; cancelAnimationFrame(raf); };
}
