/* Ask Novara - interactions & motion */
(() => {
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const hasGSAP = typeof window.gsap !== 'undefined';
  if (reduced || !hasGSAP) document.documentElement.classList.add('reduced');
  if (hasGSAP) gsap.registerPlugin(ScrollTrigger);

  document.getElementById('yr').textContent = new Date().getFullYear();

  /* ---------- Smooth scroll (Lenis) ---------- */
  let lenis = null;
  if (!reduced && window.Lenis) {
    lenis = new Lenis({ duration: 1.15, smoothWheel: true });
    if (hasGSAP) {
      lenis.on('scroll', ScrollTrigger.update);
      gsap.ticker.add((t) => lenis.raf(t * 1000));
      gsap.ticker.lagSmoothing(0);
    } else {
      const raf = (t) => { lenis.raf(t); requestAnimationFrame(raf); };
      requestAnimationFrame(raf);
    }
  }
  document.querySelectorAll('a[href^="#"]').forEach((a) => {
    a.addEventListener('click', (e) => {
      const id = a.getAttribute('href');
      if (id.length < 2) return;
      const el = document.querySelector(id);
      if (!el) return;
      e.preventDefault();
      // let offcanvas close first
      setTimeout(() => (lenis ? lenis.scrollTo(el, { offset: -70 }) : el.scrollIntoView({ behavior: 'smooth' })), a.hasAttribute('data-bs-dismiss') ? 300 : 0);
    });
  });

  /* ---------- Nav: hide on scroll down, solid after hero ---------- */
  const nav = document.getElementById('nav');
  let lastY = 0;
  const onScroll = () => {
    const y = window.scrollY;
    nav.classList.toggle('scrolled', y > 40);
    nav.classList.toggle('hide', y > lastY && y > 400);
    lastY = y;
  };
  window.addEventListener('scroll', onScroll, { passive: true });

  /* ---------- Magnetic buttons (subtle) ---------- */
  if (window.matchMedia('(hover: hover)').matches && hasGSAP && !reduced) {
    document.querySelectorAll('[data-magnetic]').forEach((el) => {
      el.addEventListener('mousemove', (e) => {
        const r = el.getBoundingClientRect();
        gsap.to(el, { x: (e.clientX - r.left - r.width / 2) * 0.12, y: (e.clientY - r.top - r.height / 2) * 0.18, duration: 0.4, ease: 'power3' });
      });
      el.addEventListener('mouseleave', () => gsap.to(el, { x: 0, y: 0, duration: 0.6, ease: 'power3.out' }));
    });
  }

  /* ---------- Ask bar typewriter ---------- */
  const input = document.getElementById('askInput');
  const prompts = [
    'build a SaaS for dental clinic bookings…',
    'automate my sales follow-ups with AI…',
    'move our product to scalable AWS infra…',
    'help my SaaS upsell premium plans…',
    'turn my marketplace idea into an MVP…',
  ];
  let pi = 0, ci = 0, del = false, typing = true;
  const tick = () => {
    if (!typing) return;
    const p = prompts[pi];
    ci += del ? -1 : 1;
    input.setAttribute('placeholder', p.slice(0, ci));
    let wait = del ? 28 : 55;
    if (!del && ci === p.length) { del = true; wait = 1800; }
    else if (del && ci === 0) { del = false; pi = (pi + 1) % prompts.length; wait = 350; }
    setTimeout(tick, wait);
  };
  if (reduced) input.setAttribute('placeholder', prompts[0]); else tick();
  input.addEventListener('focus', () => { typing = false; input.setAttribute('placeholder', 'Describe your idea in one line…'); });
  document.getElementById('askForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const idea = document.getElementById('fIdea');
    if (input.value.trim()) idea.value = input.value.trim();
    const target = document.getElementById('contact');
    lenis ? lenis.scrollTo(target, { offset: -40 }) : target.scrollIntoView({ behavior: 'smooth' });
    setTimeout(() => document.getElementById('fName').focus({ preventScroll: true }), 1200);
  });

  /* ---------- Next 1:1 slot ---------- */
  (() => {
    const d = new Date();
    d.setDate(d.getDate() + (d.getDay() === 5 ? 3 : d.getDay() === 6 ? 2 : 1));
    const day = d.toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'short' });
    document.getElementById('nextSlot').textContent = `${day} · 10:30 GMT`;
  })();

  /* ---------- Automations data ---------- */
  const autos = [
    ['sales', 'bi-funnel', 'Lead scoring agent', 'Ranks inbound leads by fit & intent'],
    ['sales', 'bi-envelope-paper', 'AI follow-up sequences', 'Personalised emails that book calls'],
    ['sales', 'bi-telephone-forward', 'Call summary → CRM', 'Notes, next steps, deal stage, auto'],
    ['sales', 'bi-file-earmark-text', 'Proposal generator', 'On-brand proposals in 60 seconds'],
    ['marketing', 'bi-megaphone', 'Content repurposing', 'One post → 12 channel-ready assets'],
    ['marketing', 'bi-search', 'SEO & AI visibility', 'Briefs, clusters and on-page fixes'],
    ['marketing', 'bi-graph-up-arrow', 'Ad spend optimiser', 'Reallocates budget to winners daily'],
    ['ops', 'bi-box-seam', 'Inventory forecasting', 'Predicts stock-outs before they happen'],
    ['ops', 'bi-diagram-3', 'Workflow orchestrator', 'Connects 400+ apps with logic & AI'],
    ['ops', 'bi-file-earmark-check', 'Document extraction', 'PDFs & invoices → structured data'],
    ['finance', 'bi-receipt', 'Invoice reconciliation', 'Matches payments to invoices nightly'],
    ['finance', 'bi-cash-coin', 'Churn & dunning rescue', 'Recovers failed SaaS payments'],
    ['finance', 'bi-bar-chart', 'MRR board report', 'Investor-ready metrics every Monday'],
    ['support', 'bi-chat-dots', 'AI support agent', 'Resolves 60% of tickets instantly'],
    ['support', 'bi-emoji-smile', 'Sentiment triage', 'Flags at-risk customers in real time'],
    ['support', 'bi-journal-text', 'Knowledge base builder', 'Turns tickets into help articles'],
    ['hr', 'bi-person-badge', 'CV screening', 'Shortlists candidates against the role'],
    ['hr', 'bi-calendar-week', 'Onboarding autopilot', 'Accounts, docs & training on day one'],
  ];
  const grid = document.getElementById('autoGrid');
  grid.innerHTML = autos.map(([c, ic, t, d]) => `
    <div class="auto-item" data-c="${c}">
      <div class="top"><span class="ic"><i class="bi ${ic}"></i></span><span class="cat">${c}</span></div>
      <div><h6>${t}</h6><small>${d}</small></div>
    </div>`).join('');
  const rail = (arr) => [...arr, ...arr].map(([, ic, t]) => `<span class="chip"><i class="bi ${ic} me-2" style="color:var(--signal)"></i>${t}</span>`).join('');
  document.getElementById('rail1').innerHTML = rail(autos.slice(0, 9));
  document.getElementById('rail2').innerHTML = rail(autos.slice(9));

  document.getElementById('filters').addEventListener('click', (e) => {
    const b = e.target.closest('button');
    if (!b) return;
    document.querySelectorAll('#filters button').forEach((x) => x.classList.toggle('active', x === b));
    const f = b.dataset.f;
    const items = grid.querySelectorAll('.auto-item');
    items.forEach((it) => it.classList.toggle('hidden', f !== 'all' && it.dataset.c !== f));
    if (hasGSAP && !reduced) gsap.fromTo(grid.querySelectorAll('.auto-item:not(.hidden)'), { opacity: 0, y: 20 }, { opacity: 1, y: 0, stagger: 0.04, duration: 0.5, ease: 'power3.out' });
    window.ScrollTrigger && ScrollTrigger.refresh();
  });

  /* ---------- Manifesto split into words ---------- */
  const man = document.getElementById('manifesto');
  man.innerHTML = man.textContent.trim().split(/\s+/).map((w) => {
    const mark = w.startsWith('*');
    return `<span class="w${mark ? ' mark' : ''}">${w.replace(/\*/g, '')}</span>`;
  }).join(' ');

  /* ---------- Cinematic 3D globe (globe.gl / three.js) ---------- */
  const hubs = [
    { name: 'London', lat: 51.5, lng: -0.12, n: 38 },
    { name: 'New York', lat: 40.71, lng: -74.0, n: 19 },
    { name: 'San Francisco', lat: 37.77, lng: -122.42, n: 12 },
    { name: 'Toronto', lat: 43.65, lng: -79.38, n: 8 },
    { name: 'Dubai', lat: 25.2, lng: 55.27, n: 11 },
    { name: 'Berlin', lat: 52.52, lng: 13.4, n: 6 },
    { name: 'Sydney', lat: -33.87, lng: 151.21, n: 6 },
    { name: 'Mumbai', lat: 19.08, lng: 72.88, n: 5 },
  ];
  const hubName = document.getElementById('hubName'), hubCount = document.getElementById('hubCount');
  const initGlobe = () => {
    const el = document.getElementById('globe');
    if (!el || el.dataset.ready) return;
    el.dataset.ready = '1';
    if (typeof window.Globe !== 'function') { el.innerHTML = '<div class="globe-fallback"></div>'; return; }
    const ORANGE = '#ff5b04';
    const lon = hubs[0];
    const arcs = hubs.slice(1).map((h, i) => ({ startLat: lon.lat, startLng: lon.lng, endLat: h.lat, endLng: h.lng, delay: i * 400 }));
    const size = () => el.clientWidth;
    const g = Globe({ animateIn: true })(el)
      .width(size()).height(size())
      .backgroundColor('rgba(0,0,0,0)')
      .globeImageUrl('https://unpkg.com/three-globe@2.31.1/example/img/earth-night.jpg')
      .bumpImageUrl('https://unpkg.com/three-globe@2.31.1/example/img/earth-topology.png')
      .showAtmosphere(true).atmosphereColor('#3aa0a0').atmosphereAltitude(0.16)
      .arcsData(arcs)
      .arcColor(() => ['rgba(255,91,4,0.15)', ORANGE])
      .arcStroke(0.45).arcAltitudeAutoScale(0.45)
      .arcDashLength(0.45).arcDashGap(1.2).arcDashInitialGap((d) => d.delay / 1000)
      .arcDashAnimateTime(2600)
      .pointsData(hubs).pointColor(() => ORANGE).pointAltitude(0.012).pointRadius((d) => 0.25 + d.n / 60).pointsMerge(false)
      .ringsData(hubs).ringColor(() => (t) => `rgba(255,91,4,${1 - t})`).ringMaxRadius((d) => 2 + d.n / 8).ringPropagationSpeed(1.6).ringRepeatPeriod(1400)
      .labelsData(hubs).labelLat('lat').labelLng('lng').labelText((d) => d.name.toUpperCase())
      .labelSize(1.5).labelDotRadius(0).labelColor(() => 'rgba(255,255,255,0.85)').labelAltitude(0.02).labelResolution(3)
      .onPointHover((d) => { if (d) { hubName.textContent = d.name; hubCount.textContent = d.n + ' products'; } });
    const mat = g.globeMaterial();
    mat.bumpScale = 6;
    if (mat.color) mat.color.multiplyScalar(0.9);
    const ctr = g.controls();
    ctr.autoRotate = !reduced; ctr.autoRotateSpeed = 0.55; ctr.enableZoom = false; ctr.enablePan = false;
    g.pointOfView({ lat: 38, lng: -30, altitude: 2.1 }, 0);
    // cinematic fly-in
    setTimeout(() => g.pointOfView({ lat: 30, lng: 10, altitude: 1.85 }, 2600), 300);
    // cycle HUD through hubs
        let hi = 0;
    setInterval(() => { hi = (hi + 1) % hubs.length; hubName.textContent = hubs[hi].name; hubCount.textContent = hubs[hi].n + ' products'; }, 2600);
    new ResizeObserver(() => g.width(size()).height(size())).observe(el);
    // pause rendering off-screen
    new IntersectionObserver(([e]) => (e.isIntersecting ? g.resumeAnimation() : g.pauseAnimation())).observe(el);
  };
  const globeEl = document.getElementById('globe');
  new IntersectionObserver((entries, o) => { if (entries[0].isIntersecting) { initGlobe(); o.disconnect(); } }, { rootMargin: '400px' }).observe(globeEl);

  /* ---------- Lead form (Bootstrap validation) ---------- */
  const form = document.getElementById('leadForm');
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    form.classList.add('was-validated');
    if (!form.checkValidity()) return;
    form.style.display = 'none';
    document.getElementById('formOk').classList.add('show');
    // Hook your CRM / email endpoint here.
  });

  /* ---------- Counters ---------- */
  const runCount = (el) => {
    const end = +el.dataset.count;
    if (!hasGSAP || reduced) { el.textContent = end.toLocaleString(); return; }
    const o = { v: 0 };
    gsap.to(o, { v: end, duration: 2, ease: 'power3.out', onUpdate: () => (el.textContent = Math.round(o.v).toLocaleString()) });
  };

  /* ---------- Preloader + Motion ---------- */
  const loader = document.getElementById('loader');
  const startHero = () => {
    if (!hasGSAP || reduced) {
      loader.remove();
      document.querySelectorAll('[data-count]').forEach(runCount);
      document.querySelectorAll('#bars div').forEach((b) => (b.style.height = b.dataset.h + '%'));
      document.querySelectorAll('.meter span').forEach((s) => (s.style.width = s.dataset.w + '%'));
      document.querySelectorAll('.manifesto .w').forEach((w) => w.classList.add('on'));
      return;
    }
    const tl = gsap.timeline();
    tl.to(loader, { yPercent: -100, duration: 1, ease: 'expo.inOut', onComplete: () => loader.remove() })
      .from('.hero-media', { scale: 1.25, duration: 2.2, ease: 'expo.out' }, '-=0.7')
      .from('.hero-title .line > span', { yPercent: 110, duration: 1.2, stagger: 0.1, ease: 'expo.out' }, '-=2')
      .from('.hero-in', { y: 30, opacity: 0, duration: 1, stagger: 0.08, ease: 'power3.out' }, '-=1.4')
      .from('.hero-foot .stat', { y: 30, opacity: 0, duration: 0.9, stagger: 0.08, ease: 'power3.out', onStart: () => document.querySelectorAll('.hero [data-count]').forEach(runCount) }, '-=1.1')
      .from('.nav-n', { opacity: 0, duration: 0.8, ease: 'power3.out', clearProps: 'opacity' }, '-=1');
  };

  // Simulated preloader counter (fast; finishes on window load)
  let p = 0;
  const loadNum = document.getElementById('loadNum'), loadBar = document.getElementById('loadBar');
  const loadTick = setInterval(() => {
    p = Math.min(p + Math.ceil(Math.random() * 9), 96);
    loadNum.textContent = p; loadBar.style.width = p + '%';
  }, 40);
  const finish = () => {
    clearInterval(loadTick);
    loadNum.textContent = 100; loadBar.style.width = '100%';
    setTimeout(startHero, reduced ? 0 : 250);
  };
  if (document.readyState === 'complete') finish(); else window.addEventListener('load', finish);
  setTimeout(() => { if (document.body.contains(loader) && loadNum.textContent !== '100') finish(); }, 3500); // safety

  if (!hasGSAP || reduced) return;

  /* Hero parallax */
  gsap.to('.hero-media', { yPercent: 18, ease: 'none', scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true } });
  gsap.to('.hero .wrap', { yPercent: -10, opacity: 0.2, ease: 'none', scrollTrigger: { trigger: '.hero', start: 'center top', end: 'bottom top', scrub: true } });

  /* Generic reveals */
  gsap.utils.toArray('.reveal').forEach((el) => {
    gsap.to(el, { opacity: 1, y: 0, duration: 1.1, ease: 'expo.out', scrollTrigger: { trigger: el, start: 'top 88%' } });
  });

  /* Image parallax inside split rows */
  gsap.utils.toArray('[data-parallax]').forEach((img) => {
    gsap.fromTo(img, { yPercent: -8 }, { yPercent: 8, ease: 'none', scrollTrigger: { trigger: img.parentElement, start: 'top bottom', end: 'bottom top', scrub: true } });
    gsap.from(img.parentElement, { clipPath: 'inset(12% 12% 12% 12%)', duration: 1.4, ease: 'expo.out', scrollTrigger: { trigger: img.parentElement, start: 'top 80%' } });
  });

  /* Manifesto word fill */
  const words = gsap.utils.toArray('.manifesto .w');
  ScrollTrigger.create({
    trigger: '#manifesto', start: 'top 80%', end: 'bottom 45%', scrub: true,
    onUpdate: (s) => { const n = Math.round(s.progress * words.length); words.forEach((w, i) => w.classList.toggle('on', i < n)); },
  });

  /* Horizontal process (desktop) */
  const mm = gsap.matchMedia();
  mm.add('(min-width: 992px)', () => {
    const track = document.getElementById('hTrack');
    const dist = () => track.scrollWidth - window.innerWidth;
    const tw = gsap.to(track, {
      x: () => -dist(), ease: 'none',
      scrollTrigger: { trigger: '#process', start: 'top top', end: () => '+=' + dist(), pin: true, scrub: 1, invalidateOnRefresh: true },
    });
    gsap.to('#hProg', { width: '100%', ease: 'none', scrollTrigger: { trigger: '#process', start: 'top top', end: () => '+=' + dist(), scrub: true } });
    return () => tw.kill();
  });
  mm.add('(max-width: 991.98px)', () => {
    gsap.utils.toArray('.step').forEach((s) => gsap.from(s, { y: 50, opacity: 0, duration: 1, ease: 'expo.out', scrollTrigger: { trigger: s, start: 'top 88%' } }));
  });

  /* Bars, meters, counters on view */
  ScrollTrigger.create({ trigger: '#bars', start: 'top 80%', once: true, onEnter: () => gsap.to('#bars div', { height: (i, el) => el.dataset.h + '%', duration: 1.2, stagger: 0.06, ease: 'expo.out' }) });
  ScrollTrigger.create({ trigger: '#countries', start: 'top 80%', once: true, onEnter: () => gsap.to('.meter span', { width: (i, el) => el.dataset.w + '%', duration: 1.4, stagger: 0.1, ease: 'expo.out' }) });
  document.querySelectorAll('[data-count]').forEach((el) => {
    if (el.closest('.hero')) return;
    ScrollTrigger.create({ trigger: el, start: 'top 85%', once: true, onEnter: () => runCount(el) });
  });

  /* Automation cards stagger */
  ScrollTrigger.create({ trigger: '#autoGrid', start: 'top 85%', once: true, onEnter: () => gsap.from('#autoGrid .auto-item', { y: 40, opacity: 0, stagger: 0.035, duration: 0.8, ease: 'expo.out' }) });

  /* Footer giant word */
  gsap.from('.foot .giant', { yPercent: 40, opacity: 0, duration: 1.4, ease: 'expo.out', scrollTrigger: { trigger: '.foot', start: 'top 85%' } });

  window.addEventListener('load', () => ScrollTrigger.refresh());
})();
