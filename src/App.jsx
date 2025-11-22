// src/App.jsx
import React, { useEffect, useRef, useState } from "react";
import { BrowserRouter, Routes, Route, NavLink, Outlet, useLocation } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import {
  SITE_NAME, SITE_TAGLINE, ADDRESS, CHECKOUT_TIME, airbnbUrl,
  images, amenities, thingsToDo, faqs,
  welcomeStats, topFeatures,
  amenityCategories, heroAmenities,
  bedroomGalleries, otherRooms,
  townsToExplore, hvHighlights, localHikes, nearbyIdeas, localEats, hydeParkCenter, townsCoords
} from "./data";
import { Loader } from "@googlemaps/js-api-loader";
const CONTAINER = "max-w-7xl mx-auto px-4 md:px-8 lg:px-12"; // widen site? try max-w-screen-2xl

/* ----------------------- Shared UI ----------------------- */
// --- DEBUG: Error Boundary ---
class ErrorBoundary extends React.Component {
  constructor(props){ super(props); this.state = { hasError: false, err: null }; }
  static getDerivedStateFromError(err){ return { hasError: true, err }; }
  componentDidCatch(err, info){ console.error("💥 Render error:", err, info); }
  render(){
    if (this.state.hasError) {
      return (
        <div style={{padding:16, background:"#fee2e2", color:"#7f1d1d", fontFamily:"ui-sans-serif"}}>
          <div style={{fontWeight:700}}>Component crashed:</div>
          <pre style={{whiteSpace:"pre-wrap"}}>{String(this.state.err)}</pre>
        </div>
      );
    }
    return this.props.children;
  }
}
function LeafDivider() {
  return (
    <div className="flex items-center gap-3 text-sage">
      <span className="h-px w-8 bg-sage/40" />
      <svg width="18" height="18" viewBox="0 0 24 24" className="opacity-80" aria-hidden="true">
        <path d="M12 2C7 7 4 10 4 14a8 8 0 0 0 8 8c4 0 7-3 12-8-5 0-8-3-12-12Z" fill="currentColor" />
      </svg>
      <span className="h-px w-8 bg-sage/40" />
    </div>
  );
}

function Section({ id, title, children, intro, tone = "light" }) {
  const wrapper = tone === "light" ? "bg-ivory" : "bg-linen";
  return (
    <section id={id} className={`${wrapper} py-16 px-4 md:px-8 lg:px-12`}>
      <div className={CONTAINER}>
        {title && (
          <div className="mb-8">
            <LeafDivider />
            <h2 className="mt-4 text-3xl md:text-4xl font-semibold tracking-tight text-moss">{title}</h2>
            {intro && <p className="text-coal/70 mt-2 text-base md:text-lg">{intro}</p>}
          </div>
        )}
        {children}
      </div>
    </section>
  );
}

function Badge({ children }) {
  return (
    <span className="inline-flex items-center rounded-full border border-sage/30 bg-linen px-3 py-1 text-sm leading-6 text-coal mr-2 mb-2">
      {children}
    </span>
  );
}

/* ---------- Canvas Crossfade (Safari-safe) ---------- */

function drawCover(ctx, img, W, H, scale = 1.0) {
  const iw = img.naturalWidth || 1;
  const ih = img.naturalHeight || 1;

  // basic "object-cover" behavior, no extra zoom
  const base = Math.max(W / iw, H / ih) * scale;
  const dw = iw * base;
  const dh = ih * base;
  const dx = (W - dw) / 2;
  const dy = (H - dh) / 2;

  ctx.drawImage(img, 0, 0, iw, ih, dx, dy, dw, dh);
}

function CrossfadeImage({ src, alt, duration = 2200 }) {
  const canvasRef = useRef(null);
  const currentRef = useRef(null);
  const nextRef = useRef(null);
  const rafRef = useRef(0);
  const startRef = useRef(0);
  const tokenRef = useRef(0);
  const firstPaintedRef = useRef(false);
  const ease = (t) => 0.5 - 0.5 * Math.cos(Math.PI * t); // easeInOutSine

  // DPR-aware resize + repaint
  useEffect(() => {
    const c = canvasRef.current;
    if (!c) return;

    const resize = () => {
      const rect = c.getBoundingClientRect();
      const dpr = Math.max(1, Math.min(2, window.devicePixelRatio || 1));
      c.width = Math.max(1, Math.floor(rect.width * dpr));
      c.height = Math.max(1, Math.floor(rect.height * dpr));

      const ctx = c.getContext("2d", { alpha: false });
      ctx.clearRect(0, 0, c.width, c.height);

      if (currentRef.current) {
        drawCover(ctx, currentRef.current, c.width, c.height, 1.0);
      }
    };

    resize();
    window.addEventListener("resize", resize);
    return () => window.removeEventListener("resize", resize);
  }, []);

  // Initial paint (no zoom)
  useEffect(() => {
    if (firstPaintedRef.current) return;

    const img = new Image();
    img.decoding = "async";
    img.src = src;
    img.onload = () => {
      currentRef.current = img;
      const c = canvasRef.current;
      if (!c) return;

      const ctx = c.getContext("2d", { alpha: false });
      ctx.clearRect(0, 0, c.width, c.height);
      drawCover(ctx, img, c.width, c.height, 1.0);
      firstPaintedRef.current = true;
    };
  }, [src]);

  // Animate on src change (no scaling animation)
  useEffect(() => {
    const token = ++tokenRef.current;
    const next = new Image();
    next.decoding = "async";
    next.src = src;

    next.onload = () => {
      if (tokenRef.current !== token) return;

      // If no current image yet, just paint and stop
      if (!currentRef.current) {
        currentRef.current = next;
        const c = canvasRef.current;
        if (c) {
          const ctx = c.getContext("2d", { alpha: false });
          ctx.clearRect(0, 0, c.width, c.height);
          drawCover(ctx, next, c.width, c.height, 1.0);
        }
        return;
      }

      nextRef.current = next;
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      startRef.current = performance.now();

      const step = (now) => {
        if (tokenRef.current !== token) return;
        const c = canvasRef.current;
        const cur = currentRef.current;
        const nxt = nextRef.current;
        if (!c || !cur || !nxt) return;

        const ctx = c.getContext("2d", { alpha: false });
        const t = Math.min(1, (now - startRef.current) / duration);
        const k = ease(t);

        ctx.clearRect(0, 0, c.width, c.height);
        // base image
        drawCover(ctx, cur, c.width, c.height, 1.0);

        // fade in next image on top
        ctx.globalAlpha = k;
        drawCover(ctx, nxt, c.width, c.height, 1.0);
        ctx.globalAlpha = 1;

        if (t < 1) {
          rafRef.current = requestAnimationFrame(step);
        } else {
          currentRef.current = nxt;
          nextRef.current = null;
          rafRef.current = 0;
        }
      };

      rafRef.current = requestAnimationFrame(step);
    };

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      rafRef.current = 0;
    };
  }, [src, duration]);

  return (
    <div className="relative h-full w-full">
      <canvas
        ref={canvasRef}
        aria-label={alt}
        role="img"
        style={{
          display: "block",
          width: "100%",
          height: "100%",
          transform: "translateZ(0)",
          backfaceVisibility: "hidden",
        }}
      />
    </div>
  );
}

/* ----------------------- Top Nav + Footer ----------------------- */

function Nav() {
  const [open, setOpen] = useState(false);
  const location = useLocation();

  const links = [
    { to: "/", label: "Home" },
    { to: "/amenities", label: "Amenities" },
    { to: "/rooms", label: "Rooms" },
    { to: "/things", label: "Things to Do" },
    { to: "/faq", label: "FAQ" },
  ];

  const houseManualHref = "/guides/house_manual.pdf";

  // Close mobile menu on route change
  useEffect(() => {
    setOpen(false);
  }, [location.pathname]);

  return (
    <nav className="sticky top-0 z-40 bg-ivory/80 backdrop-blur border-b border-coal/10">
      <div className={`${CONTAINER} h-16 w-full`}>
        <div className="flex items-center justify-between h-full w-full">
          {/* Left: site name/tagline */}
          <NavLink
            to="/"
            className="font-display font-semibold tracking-tight text-moss whitespace-nowrap"
          >
            {SITE_NAME} • {SITE_TAGLINE}
          </NavLink>

          {/* Middle: desktop nav links */}
          <div className="hidden md:flex items-center gap-6 text-sm mx-6 flex-1 justify-center">
            {links.map((it) => (
              <NavLink
                key={it.to}
                to={it.to}
                className={({ isActive }) =>
                  `hover:text-moss ${isActive ? "text-moss" : "text-coal/80"}`
                }
              >
                {it.label}
              </NavLink>
            ))}
          </div>

          {/* Right: desktop Book now + mobile hamburger */}
          <div className="flex items-center gap-3">
           
            {/* Desktop-only House Guide */}
            <a
              href={houseManualHref}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden md:inline-flex rounded-2xl border border-moss text-moss px-4 py-2 text-sm font-medium shadow-sm hover:bg-moss/5"
            >
              House Guide
            </a>

             {/* Desktop-only Book now */}
            <a
              href={airbnbUrl}
              className="hidden md:inline-flex rounded-2xl bg-moss text-white px-4 py-2 text-sm font-medium shadow hover:opacity-90"
            >
              Book now
            </a>

            {/* Hamburger only on mobile */}
            <button
              type="button"
              className="md:hidden inline-flex items-center justify-center rounded-xl border border-coal/20 bg-white/80 p-2 shadow-sm"
              onClick={() => setOpen((v) => !v)}
              aria-label="Toggle navigation menu"
            >
              <span className="relative block w-5 h-3">
                <span
                  className={`absolute inset-x-0 top-0 h-[2px] rounded-full bg-coal transition-transform duration-200 ${
                    open ? "translate-y-[6px] rotate-45" : ""
                  }`}
                />
                <span
                  className={`absolute inset-x-0 top-1/2 h-[2px] -translate-y-1/2 rounded-full bg-coal transition-opacity duration-200 ${
                    open ? "opacity-0" : "opacity-100"
                  }`}
                />
                <span
                  className={`absolute inset-x-0 bottom-0 h-[2px] rounded-full bg-coal transition-transform duration-200 ${
                    open ? "-translate-y-[6px] -rotate-45" : ""
                  }`}
                />
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden border-t border-coal/10 bg-ivory/95">
          <div className={`${CONTAINER} py-3 flex flex-col gap-2`}>
            {/* Mobile Book now button */}
            <a
              href={airbnbUrl}
              className="mb-1 inline-flex w-full items-center justify-center rounded-2xl bg-moss text-white px-4 py-2 text-sm font-medium shadow hover:opacity-90"
            >
              Book now on Airbnb
            </a>

                        {/* Mobile House Manual button */}
            <a
              href={houseManualHref}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex w-full items-center justify-center rounded-xl border border-moss bg-white text-moss px-4 py-2 text-sm font-medium shadow-sm hover:bg-moss/5"
            >
              House Guide
            </a>

            {links.map((it) => (
              <NavLink
                key={it.to}
                to={it.to}
                className={({ isActive }) =>
                  `block rounded-xl px-3 py-2 text-sm ${
                    isActive
                      ? "bg-moss/10 text-moss font-medium"
                      : "text-coal/80 hover:bg-coal/5"
                  }`
                }
              >
                {it.label}
              </NavLink>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
}
function Footer() {
  return (
    <footer className="border-t border-coal/10">
      <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-12 py-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <p className="font-display text-moss">{SITE_NAME} • {SITE_TAGLINE}</p>
          <p className="text-coal/60">© {new Date().getFullYear()} Carver Home LLC. All rights reserved.</p>
        </div>
        <div className="text-sm text-coal/70">
          <a href="mailto:info@thehydeparkcottage.com" className="underline">info@thehydeparkcottage.com</a>
          <span className="mx-2">•</span>
          <NavLink to="/faq" className="underline">FAQs</NavLink>
        </div>
      </div>
    </footer>
  );
}

// Scroll to top on route change
function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo(0, 0); }, [pathname]);
  return null;
}

/* ----------------------- Home Page (only Title + About + Gallery + Location) ----------------------- */

function useArrowKeys(setActive, len) {
  useEffect(() => {
    const onKey = (e) => {
      const t = e.target;
      const typing = t && (t.tagName === "INPUT" || t.tagName === "TEXTAREA" || t.isContentEditable);
      if (typing) return;
      if (e.key === "ArrowLeft") setActive((i) => (i - 1 + len) % len);
      else if (e.key === "ArrowRight") setActive((i) => (i + 1) % len);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [setActive, len]);
}

function useAutoAdvance(enabled, setActive, len, ms = 4800) {
  useEffect(() => {
    if (!enabled || len <= 1) return;
    const id = setInterval(() => setActive((i) => (i + 1) % len), ms);
    return () => clearInterval(id);
  }, [enabled, setActive, len, ms]);
}

function GalleryFeatured({ images, active, setActive, setPaused }) {
  const stripRef = useRef(null);
  const touchStartX = useRef(null);
  const touchStartY = useRef(null);
  const touchDeltaX = useRef(0);

  const handleTouchStart = (e) => {
    if (e.touches.length !== 1) return;
    const t = e.touches[0];
    touchStartX.current = t.clientX;
    touchStartY.current = t.clientY;
    touchDeltaX.current = 0;
    setPaused(true); // pause auto-advance while interacting
  };

  const handleTouchMove = (e) => {
    if (touchStartX.current == null) return;
    const t = e.touches[0];
    const dx = t.clientX - touchStartX.current;
    const dy = t.clientY - touchStartY.current;

    // Only care about mostly horizontal swipes
    if (Math.abs(dx) > Math.abs(dy)) {
      touchDeltaX.current = dx;
      // You *can* call e.preventDefault() here, but mobile browsers
      // require passive listeners to be disabled. We'll skip it for now.
    }
  };

  const handleTouchEnd = () => {
    if (touchStartX.current == null) {
      setPaused(false);
      return;
    }

    const dx = touchDeltaX.current;

    const threshold = 40; // px needed to count as a swipe
    if (Math.abs(dx) > threshold) {
      if (dx < 0) {
        // Swiped left → next image
        next();
      } else {
        // Swiped right → previous image
        prev();
      }
    }

    touchStartX.current = null;
    touchStartY.current = null;
    touchDeltaX.current = 0;
    setPaused(false);
  };
  const prev = () => setActive((i) => (i - 1 + images.length) % images.length);
  const next = () => setActive((i) => (i + 1) % images.length);

  // Keep active thumb in view
  useEffect(() => {
    const el = stripRef.current?.querySelector(`[data-index="${active}"]`);
    if (el && stripRef.current) {
      const { offsetLeft } = el;
      stripRef.current.scrollTo({ left: offsetLeft - 16, behavior: "smooth" });
    }
  }, [active]);

  return (
    <div className="space-y-5">
      {/* Featured */}
      <div className="relative group">
        <div
          className="relative aspect-[16/9] overflow-hidden rounded-3xl shadow-soft ring-1 ring-coal/5"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          <CrossfadeImage src={images[active].src} alt={images[active].alt} duration={2200} />
        </div>

        {/* Arrows — hidden until hover */}
        <button
          onClick={prev}
          aria-label="Previous image"
          className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full bg-white/80 hover:bg-white px-3 py-2 shadow border border-coal/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        >
          ‹
        </button>
        <button
          onClick={next}
          aria-label="Next image"
          className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-white/80 hover:bg-white px-3 py-2 shadow border border-coal/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        >
          ›
        </button>
      </div>

      {/* Thumb strip */}
      <div className="relative">
        <div
          ref={stripRef}
          className="flex gap-3 overflow-x-auto no-scrollbar scroll-smooth snap-x snap-mandatory"
        >
          {images.map((img, i) => (
            <button
              key={i}
              data-index={i}
              onClick={() => setActive(i)}
              className={`snap-start shrink-0 w-40 aspect-[4/3] rounded-xl overflow-hidden border ${
                i === active ? "border-moss" : "border-coal/10"
              } ring-1 ring-coal/5`}
              aria-label={`Show image ${i + 1}`}
            >
              <img
                src={img.src}
                alt={img.alt}
                className="h-full w-full object-cover"
                loading="lazy"
              />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
function HomePage() {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  useArrowKeys(setActive, images.length);
  useAutoAdvance(!paused, setActive, images.length, 4800);

   return (
    <>
      <Helmet>
        <title>The Hyde Park Cottage – Historic Hyde Park NY Airbnb</title>
        <meta
          name="description"
          content="Stay at The Hyde Park Cottage, a cozy 1940s retreat in historic Hyde Park, NY—modern amenities, vintage charm, and a perfect base for exploring the Hudson Valley, CIA, FDR Library, and the Walkway Over the Hudson."
        />
        <link rel="canonical" href="https://www.thehydeparkcottage.com/" />

        {/* Open Graph */}
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="The Hyde Park Cottage" />
        <meta property="og:title" content="The Hyde Park Cottage – Historic Hyde Park NY Airbnb" />
        <meta
          property="og:description"
          content="Stay at The Hyde Park Cottage, a cozy 1940s retreat in historic Hyde Park, NY—modern amenities, vintage charm, and a perfect base for exploring the Hudson Valley, CIA, FDR Library, and the Walkway Over the Hudson."
        />
        <meta property="og:url" content="https://www.thehydeparkcottage.com/" />
        <meta
          property="og:image"
          content="https://thehydeparkcottage.com/og/the-hyde-park-cottage-og.jpg
"
        />
        <meta
          property="og:image:alt"
          content="The Hyde Park Cottage exterior and backyard in Hyde Park, NY"
        />
        <meta property="og:locale" content="en_US" />

        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="The Hyde Park Cottage – Historic Hyde Park NY Airbnb" />
        <meta
          name="twitter:description"
          content="Stay at The Hyde Park Cottage, a cozy 1940s retreat in historic Hyde Park, NY—modern amenities, vintage charm, and a perfect base for exploring the Hudson Valley."
        />
        <meta
          name="twitter:image"
          content="https://thehydeparkcottage.com/og/the-hyde-park-cottage-og.jpg
"
        />

        <meta name="robots" content="index,follow" />
      </Helmet>

      {/* Title / hero (square image) */}
      <section className="relative bg-sage/30 border-b border-coal/10">
        <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-12 py-12 md:py-16">
          <div className="grid md:grid-cols-2 gap-10 items-center">
            {/* Left: Title + CTA */}
            <div className="p-0 md:p-2">
              <p className="uppercase tracking-wider text-xs text-coal/60">Short-Term Rental • Hudson Valley</p>
              <h1 className="text-4xl md:text-5xl font-display font-semibold tracking-tight mt-2 text-moss">
                {SITE_NAME} • {SITE_TAGLINE}
              </h1>
              <p className="mt-4 text-lg text-coal/80">
                A cozy home with vintage charm and modern comforts—your base for exploring Hyde Park and the Hudson Valley.
              </p>
              <p className="mt-6 text-base md:text-lg text-coal/80 leading-relaxed max-w-xl">
  Centered in historic Hyde Park, this cozy 1940s home blends vintage character with modern comfort.
  Whether you’re planning a family getaway, a weekend retreat with friends, or a quiet escape,
  our home offers the perfect base to explore the Hudson River, Rhinebeck, and the many cultural gems of the Hudson Valley.
</p>

<div className="mt-8 flex gap-3">
  <a
    href={airbnbUrl}
    className="inline-flex rounded-2xl bg-clay text-white px-6 py-3 text-base font-medium shadow-soft hover:opacity-95"
  >
    Book your stay
  </a>
  <a
    href="#gallery"
    className="inline-flex rounded-2xl border border-coal/10 bg-ivory px-6 py-3 text-base font-medium shadow-sm hover:shadow-soft"
  >
    View photos
  </a>
</div>

            </div>

            {/* Right: square image synced with gallery */}
            <div className="mx-auto w-full max-w-[720px]">
              <div
                className="aspect-square overflow-hidden rounded-3xl shadow-soft ring-1 ring-coal/5"
                onMouseEnter={() => setPaused(true)}
                onMouseLeave={() => setPaused(false)}
              >
                <CrossfadeImage src={images[active].src} alt={images[active].alt} duration={2200} />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* About */}
      <Section id="about" title="About" intro="A bright, comfortable base for exploring the Hudson Valley." tone="dark">
  {/* Beds & Baths — quick stats */}
  <div className="grid sm:grid-cols-3 gap-4 mb-8">
    {welcomeStats.map((s, i) => (
      <div
        key={i}
        className="rounded-2xl border border-coal/10 bg-white/80 p-5 text-center shadow-soft"
      >
        <div className="text-3xl font-display text-moss leading-none">{s.value}</div>
        <div className="mt-1 text-coal/70">{s.label}</div>
      </div>
    ))}
  </div>

  {/* Long intro paragraph */}
  <p className="text-lg leading-relaxed text-coal/85 max-w-3xl">
    Some stand out amenities.
  </p>

  {/* Top features — six tiles */}
  <div className="mt-8 grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
    {topFeatures.map((f, i) => (
      <div
        key={i}
        className="rounded-2xl border border-coal/10 bg-white/80 p-5 shadow-soft"
      >
        <h3 className="text-lg font-display text-moss">{f.title}</h3>
        <p className="text-coal/80 mt-1">{f.desc}</p>
      </div>
    ))}
  </div>
</Section>
      {/* Gallery */}
      <Section id="gallery" title="Gallery" intro="A glimpse of the spaces you’ll enjoy.">
        <GalleryFeatured images={images} active={active} setActive={setActive} setPaused={setPaused} />
      </Section>

      {/* Location */}
<Section
  id="location"
  title="Location"
  intro="Central to Hyde Park highlights and Hudson Valley day trips."
  tone="dark"
>
  <div className="grid md:grid-cols-2 gap-6 items-stretch">
    {/* Points of Interest (same height as map) */}
    <div className="rounded-3xl border border-coal/10 bg-white/70 p-6 shadow-soft h-full min-h-[360px] flex items-center">
      <div className="w-full">
        <h3 className="text-lg font-display text-moss">Nearby</h3>
        <ul className="mt-3 space-y-2 text-coal/85">
          {thingsToDo.map((t, i) => (
            <li key={i}>
              <span className="font-medium">{t.name}</span>
              <span className="text-coal/60"> • {t.time}</span>
              <div className="text-coal/80">{t.desc}</div>
            </li>
          ))}
        </ul>
      </div>
    </div>

    {/* Map */}
    <div className="overflow-hidden rounded-3xl border border-coal/10 shadow-soft bg-white/70 h-full min-h-[360px]">
      <iframe
        title="Map"
        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3051.466967599726!2d-73.933!3d41.783!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNDFuNDYnNTguOCJOIDczwrA1NSc1OC44Ilc!5e0!3m2!1sen!2sus!4v0000000000000"
        className="w-full h-full"
        style={{ border: 0 }}
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
      />
    </div>
  </div>
</Section>

{/* Your Hosts */}
<Section
  id="hosts"
  title="Your Hosts"
  intro="Meet the people behind Hyde Park Cottage."
>
  <div className="flex flex-col md:flex-row items-center gap-6">
    {/* Photo - responsive square, left aligned */}
    <div className="w-40 h-40 md:w-60 md:h-60 lg:w-96 lg:h-96 overflow-hidden rounded-2xl shadow-soft ring-1 ring-coal/5 flex-shrink-0">
      <img
  src="/photos/hosts/marc_caitlin.jpg"
  alt="Marc & Caitlin"
  className="w-full h-full object-cover"
/>
    </div>

    {/* Text - vertically centered next to photo */}
    <div className="flex-1 flex flex-col justify-center">
      <h3 className="text-2xl font-display text-moss">Marc & Caitlin</h3>
      <p className="mt-3 text-coal/80 leading-relaxed">
        We’re thrilled to welcome you to Hyde Park Cottage. As hands-on hosts, we’ve put care into every
        detail of the home—from the cozy fireplace to the well-stocked kitchen—so your stay is as
        comfortable as possible. Whether you’re here for a weekend getaway, exploring the Hudson Valley’s
        history, or simply relaxing, we’re happy to share our local favorites and help you feel at home.
      </p>
      <p className="mt-3 text-coal/70 text-sm">
        Questions before or during your stay? Reach us anytime at{" "}
        <a href="mailto:stay@carverhome.co" className="underline">
          info@thehydeparkcottage.com
        </a>.
      </p>
    </div>
  </div>
</Section>
    </>
  );
}

/* ----------------------- Subpages (own URLs) ----------------------- */
function IconLeaf() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true" className="text-sage">
      <path d="M12 2C7 7 4 10 4 14a8 8 0 0 0 8 8c4 0 7-3 12-8-5 0-8-3-12-12Z" fill="currentColor" />
    </svg>
  );
}

/* Mini slideshow used on hero amenity cards */
function MiniSlideshow({ imgs = [], interval = 4200 }) {
  const [i, setI] = React.useState(0);
  const [paused, setPaused] = React.useState(false);
  React.useEffect(() => {
    if (imgs.length <= 1 || paused) return;
    const id = setInterval(() => setI((v) => (v + 1) % imgs.length), interval);
    return () => clearInterval(id);
  }, [imgs.length, interval, paused]);
  const prev = () => setI((v) => (v - 1 + imgs.length) % imgs.length);
  const next = () => setI((v) => (v + 1) % imgs.length);

  return (
    <div
      className="relative aspect-[4/3] overflow-hidden rounded-2xl ring-1 ring-coal/5 group"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* Uses the same CrossfadeImage you already have in this file */}
      <CrossfadeImage src={imgs[i]} alt="" duration={1600} />
      {imgs.length > 1 && (
        <>
          <button
            onClick={prev}
            aria-label="Previous"
            className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-white/80 hover:bg-white px-2 py-1 shadow border border-coal/10 opacity-0 group-hover:opacity-100 transition-opacity"
          >‹</button>
          <button
            onClick={next}
            aria-label="Next"
            className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-white/80 hover:bg-white px-2 py-1 shadow border border-coal/10 opacity-0 group-hover:opacity-100 transition-opacity"
          >›</button>
          <div className="absolute bottom-2 inset-x-0 flex justify-center gap-1">
            {imgs.map((_, idx) => (
              <span
                key={idx}
                className={`h-1.5 w-1.5 rounded-full ${idx === i ? "bg-moss" : "bg-white/70"}`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}

function AmenitiesPage() {
  const [activeKey, setActiveKey] = React.useState("essentials");
  const cats = amenityCategories;

  const allItems = cats.flatMap((c) => c.items.map((txt) => ({ cat: c.key, txt })));
  const items = activeKey === "all" ? allItems : allItems.filter((i) => i.cat === activeKey);

  return (
    <>
      <Helmet>
        <title>Amenities | The Hyde Park Cottage – Hudson Valley Getaway</title>
        <meta
          name="description"
          content="Discover the amenities at The Hyde Park Cottage in Hyde Park, NY: fully equipped kitchen, cozy living room, fast Wi-Fi, smart TVs, wood-burning fireplace, dedicated workspaces, and a spacious backyard with patio and grill."
        />
        <link rel="canonical" href="https://www.thehydeparkcottage.com/amenities" />

        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="The Hyde Park Cottage" />
        <meta
          property="og:title"
          content="Amenities | The Hyde Park Cottage – Hudson Valley Getaway"
        />
        <meta
          property="og:description"
          content="Discover the amenities at The Hyde Park Cottage in Hyde Park, NY: fully equipped kitchen, cozy living room, fast Wi-Fi, smart TVs, wood-burning fireplace, dedicated workspaces, and a spacious backyard with patio and grill."
        />
        <meta
          property="og:url"
          content="https://www.thehydeparkcottage.com/amenities"
        />
        <meta
          property="og:image"
          content="https://thehydeparkcottage.com/og/the-hyde-park-cottage-og.jpg
"
        />
        <meta
          property="og:image:alt"
          content="Inviting living space and amenities at The Hyde Park Cottage in Hyde Park, NY"
        />
        <meta property="og:locale" content="en_US" />

        <meta name="twitter:card" content="summary_large_image" />
        <meta
          name="twitter:title"
          content="Amenities | The Hyde Park Cottage – Hudson Valley Getaway"
        />
        <meta
          name="twitter:description"
          content="Discover the amenities at The Hyde Park Cottage in Hyde Park, NY: fully equipped kitchen, cozy living room, fast Wi-Fi, smart TVs, wood-burning fireplace, dedicated workspaces, and a spacious backyard with patio and grill."
        />
        <meta
          name="twitter:image"
          content="https://thehydeparkcottage.com/og/the-hyde-park-cottage-og.jpg
"
        />

        <meta name="robots" content="index,follow" />
      </Helmet>

    <Section title="Amenities" intro="Everything you need for a comfortable stay." tone="dark">
      {/* Hero Amenities (4 cards with their own sliders) */}
      <div className="grid md:grid-cols-2 gap-6 mb-10">
        {heroAmenities.map((h) => (
          <div
            key={h.key}
            className="rounded-3xl border border-coal/10 bg-white/80 p-5 shadow-soft"
          >
            <MiniSlideshow imgs={h.images} />
            <div className="mt-4">
              <h3 className="text-lg font-display text-moss">{h.title}</h3>
              <p className="text-coal/80 mt-1">{h.desc}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Category Tabs */}
      <div className="flex flex-wrap gap-2 mb-6">
        {[{ key: "all", label: "All" }, ...cats.map((c) => ({ key: c.key, label: c.label }))].map(
          (tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveKey(tab.key)}
              className={`rounded-full border px-3 py-1.5 text-sm transition ${
                activeKey === tab.key
                  ? "bg-moss text-white border-moss shadow"
                  : "bg-white/80 text-coal/80 border-coal/10 hover:bg-white"
              }`}
              aria-pressed={activeKey === tab.key}
            >
              {tab.label}
            </button>
          )
        )}
      </div>

      {/* Tiles (filtered) */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {items.map((i, idx) => (
          <div
            key={idx}
            className="rounded-2xl border border-coal/10 bg-white/80 p-5 shadow-soft flex gap-3"
          >
            <div className="mt-1">
              <IconLeaf />
            </div>
            <p className="text-coal/90">{i.txt}</p>
          </div>
        ))}
      </div>

      {/* Removed the long category lists */}
    </Section>
 </>
  );
}
  /* Smooth sliding carousel (translateX) */
function SlidingCarousel({ images = [], interval = 5200 }) {
  const [index, setIndex] = React.useState(0);
  const [paused, setPaused] = React.useState(false);
  const trackRef = React.useRef(null);
    const touchStartX = React.useRef(null);
  const touchStartY = React.useRef(null);
  const touchDeltaX = React.useRef(0);

  const handleTouchStart = (e) => {
    if (e.touches.length !== 1) return;
    const t = e.touches[0];
    touchStartX.current = t.clientX;
    touchStartY.current = t.clientY;
    touchDeltaX.current = 0;
    setPaused(true);
  };

  const handleTouchMove = (e) => {
    if (touchStartX.current == null) return;
    const t = e.touches[0];
    const dx = t.clientX - touchStartX.current;
    const dy = t.clientY - touchStartY.current;

    if (Math.abs(dx) > Math.abs(dy)) {
      touchDeltaX.current = dx;
    }
  };

  const handleTouchEnd = () => {
    if (touchStartX.current == null) {
      setPaused(false);
      return;
    }

    const dx = touchDeltaX.current;
    const threshold = 40;
    if (Math.abs(dx) > threshold) {
      if (dx < 0) {
        next();
      } else {
        prev();
      }
    }

    touchStartX.current = null;
    touchStartY.current = null;
    touchDeltaX.current = 0;
    setPaused(false);
  };

  // Auto-advance
  React.useEffect(() => {
    if (images.length <= 1 || paused) return;
    const id = setInterval(() => {
      setIndex((i) => (i + 1) % images.length);
    }, interval);
    return () => clearInterval(id);
  }, [images.length, interval, paused]);

  const prev = () => setIndex((i) => (i - 1 + images.length) % images.length);
  const next = () => setIndex((i) => (i + 1) % images.length);

  return (
    <div
      className="relative overflow-hidden rounded-2xl ring-1 ring-coal/5 group"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Track */}
      <div
        ref={trackRef}
        className="flex transition-transform duration-700 ease-[cubic-bezier(.22,.61,.36,1)]"
        style={{ transform: `translateX(-${index * 100}%)` }}
      >
        {images.map((src, i) => (
          <div key={i} className="min-w-full aspect-[4/3]">
            <img src={src} alt="" className="w-full h-full object-cover block" loading="lazy" />
          </div>
        ))}
      </div>

      {/* Arrows (show on hover) */}
      {images.length > 1 && (
        <>
          <button
            onClick={prev}
            aria-label="Previous"
            className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full bg-white/85 hover:bg-white px-3 py-2 shadow border border-coal/10 opacity-0 group-hover:opacity-100 transition"
          >
            ‹
          </button>
          <button
            onClick={next}
            aria-label="Next"
            className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-white/85 hover:bg-white px-3 py-2 shadow border border-coal/10 opacity-0 group-hover:opacity-100 transition"
          >
            ›
          </button>
        </>
      )}

      {/* Dots */}
      {images.length > 1 && (
        <div className="absolute bottom-2 inset-x-0 flex justify-center gap-2">
          {images.map((_, i) => (
            <button
              key={i}
              onClick={() => setIndex(i)}
              aria-label={`Go to slide ${i + 1}`}
              className={`h-2 w-2 rounded-full transition ${i === index ? "bg-moss" : "bg-white/70"}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}

/* Bedroom card */
function BedroomCard({ name, subtitle, images }) {
  return (
    <div className="rounded-3xl border border-coal/10 bg-white/80 p-5 shadow-soft">
      <SlidingCarousel images={images} />
      <div className="mt-4">
        <h3 className="text-xl font-display text-moss">{name}</h3>
        <p className="text-coal/75 mt-1">{subtitle}</p>
      </div>
    </div>
  );
}

function RoomsPage() {
  return (
    <>
    <Helmet>
        <title>Rooms & Sleeping Arrangements | The Hyde Park Cottage</title>
        <meta
          name="description"
          content="Explore the rooms at The Hyde Park Cottage in Hyde Park, NY. Comfortable bedrooms, quality mattresses, fresh linens, and flexible sleeping arrangements for families, couples, and small groups visiting the Hudson Valley."
        />
        <link rel="canonical" href="https://www.thehydeparkcottage.com/rooms" />

        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="The Hyde Park Cottage" />
        <meta
          property="og:title"
          content="Rooms & Sleeping Arrangements | The Hyde Park Cottage"
        />
        <meta
          property="og:description"
          content="Explore the rooms at The Hyde Park Cottage in Hyde Park, NY. Comfortable bedrooms, quality mattresses, fresh linens, and flexible sleeping arrangements for families, couples, and small groups visiting the Hudson Valley."
        />
        <meta property="og:url" content="https://www.thehydeparkcottage.com/rooms" />
        <meta
          property="og:image"
          content="https://thehydeparkcottage.com/og/the-hyde-park-cottage-og.jpg
"
        />
        <meta
          property="og:image:alt"
          content="Cozy bedroom at The Hyde Park Cottage vacation rental in Hyde Park, NY"
        />
        <meta property="og:locale" content="en_US" />

        <meta name="twitter:card" content="summary_large_image" />
        <meta
          name="twitter:title"
          content="Rooms & Sleeping Arrangements | The Hyde Park Cottage"
        />
        <meta
          name="twitter:description"
          content="Explore the rooms at The Hyde Park Cottage in Hyde Park, NY. Comfortable bedrooms, quality mattresses, fresh linens, and flexible sleeping arrangements for families, couples, and small groups visiting the Hudson Valley."
        />
        <meta
          name="twitter:image"
          content="https://thehydeparkcottage.com/og/the-hyde-park-cottage-og.jpg
"
        />

        <meta name="robots" content="index,follow" />
      </Helmet>

      <Section
        title="Bedrooms"
        intro="Three restful bedrooms with cozy, cottage-core touches."
        tone="dark"
      >
        <div className="grid lg:grid-cols-3 gap-6">
          <BedroomCard
            name="The Acorn Suite"
            subtitle="Queen bed • First floor"
            images={bedroomGalleries.acorn}
          />
          <BedroomCard
            name="The Mushroom Room"
            subtitle="Full/Double bed • Upstairs"
            images={bedroomGalleries.mushroom}
          />
          <BedroomCard
            name="The Fern Room"
            subtitle="Full/Double bed • Upstairs"
            images={bedroomGalleries.fern}
          />
        </div>
      </Section>

      <Section
        title="More Spaces"
        intro="Additional rooms for relaxing, working, and staying active."
      >
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {otherRooms.map((r, i) => (
            <div key={i} className="rounded-3xl border border-coal/10 bg-white/80 shadow-soft overflow-hidden">
              <div className="aspect-[4/3]">
                <img src={r.img} alt={r.name} className="w-full h-full object-cover" loading="lazy" />
              </div>
              <div className="p-5">
                <h4 className="text-lg font-display text-moss">{r.name}</h4>
                <p className="text-coal/75 mt-1">{r.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </Section>
    </>
  );
}
/* ---------- Mini fade slider for highlight cards ---------- */
function MiniFade({ imgs = [], interval = 5200 }) {
  const [i, setI] = React.useState(0);
  const [paused, setPaused] = React.useState(false);
  React.useEffect(() => {
    if (imgs.length <= 1 || paused) return;
    const id = setInterval(() => setI((v) => (v + 1) % imgs.length), interval);
    return () => clearInterval(id);
  }, [imgs.length, interval, paused]);
  return (
    <div
      className="relative aspect-[16/10] overflow-hidden rounded-2xl ring-1 ring-coal/5"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <CrossfadeImage src={imgs[i]} alt="" duration={1600} />
    </div>
  );
}

/* ---------- Google Map with classic pins (safe load) ---------- */
const TownsMap = React.forwardRef(function TownsMap(
  { center, towns, height = 420, initialZoom = 12 },
  ref
) {
  const mapRef = React.useRef(null);
  const gmapRef = React.useRef(null);
  const homeMarkerRef = React.useRef(null);
  const townMarkersRef = React.useRef([]);
  const selectedMarkerRef = React.useRef(null);
  const infoForClicksRef = React.useRef(null);

  // Create pins only AFTER Google API is loaded
  const defaultPinRef = React.useRef(null);
  const selectedPinRef = React.useRef(null);

  React.useEffect(() => {
    let cancelled = false;

    async function init() {
      const loader = new Loader({
        apiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
        version: "weekly",
      });
      await loader.load();
      if (cancelled || !mapRef.current) return;

      // Now it's safe to reference "google"
      defaultPinRef.current = {
        url: "https://maps.google.com/mapfiles/ms/icons/red-dot.png",
        scaledSize: new google.maps.Size(32, 32),
        anchor: new google.maps.Point(16, 32),
      };
      selectedPinRef.current = {
        url: "https://maps.google.com/mapfiles/ms/icons/blue-dot.png",
        scaledSize: new google.maps.Size(36, 36),
        anchor: new google.maps.Point(18, 36),
      };

      const map = new google.maps.Map(mapRef.current, {
        center,
        zoom: initialZoom,
        gestureHandling: "greedy",
        disableDefaultUI: false,
      });
      gmapRef.current = map;

      infoForClicksRef.current = new google.maps.InfoWindow();

      // Hyde Park "home" marker
      homeMarkerRef.current = new google.maps.Marker({
        map,
        position: center,
        title: "Hyde Park (Center)",
        zIndex: 1000,
        icon: {
          url: "https://cdn-icons-png.flaticon.com/512/69/69524.png",
          scaledSize: new google.maps.Size(34, 34),
          anchor: new google.maps.Point(17, 34),
          labelOrigin: new google.maps.Point(17, 45),
        },
        label: {
          text: "Hyde Park",
          color: "#2f2f2f",
          fontSize: "12px",
          fontWeight: "600",
        },
      });

      // Town markers
      townMarkersRef.current = (Array.isArray(towns) ? towns : [])
        .map((t) => ({ ...t, lat: Number(t.lat), lng: Number(t.lng) }))
        .filter((t) => Number.isFinite(t.lat) && Number.isFinite(t.lng))
        .map((t) => {
          const pos = { lat: t.lat, lng: t.lng };
          const marker = new google.maps.Marker({
            map,
            position: pos,
            title: t.name || "Point",
            icon: defaultPinRef.current,
          });

          marker.addListener("click", () => {
            selectMarker(marker);
            infoForClicksRef.current.setContent(
              `<div style="font-weight:600">${t.name || "Point"}</div>`
            );
            infoForClicksRef.current.open(map, marker);
          });

          return { data: t, marker };
        });
    }

    init();
    return () => { cancelled = true; };
  }, [center, towns, initialZoom]);

  function selectMarker(marker) {
    if (!marker) return;
    if (selectedMarkerRef.current && selectedMarkerRef.current !== marker) {
      selectedMarkerRef.current.setIcon(defaultPinRef.current);
      selectedMarkerRef.current.setZIndex(undefined);
    }
    marker.setIcon(selectedPinRef.current);
    marker.setZIndex(1100);
    selectedMarkerRef.current = marker;
  }

  React.useImperativeHandle(ref, () => ({
    resetView() {
      if (!gmapRef.current) return;
      if (selectedMarkerRef.current) {
        selectedMarkerRef.current.setIcon(defaultPinRef.current);
        selectedMarkerRef.current.setZIndex(undefined);
        selectedMarkerRef.current = null;
      }
      gmapRef.current.setCenter(center);
      gmapRef.current.setZoom(initialZoom);
      infoForClicksRef.current?.close();
    },
    focusTown(townLike) {
      if (!gmapRef.current) return;
      const map = gmapRef.current;

      const match =
        townMarkersRef.current.find(
          (tm) =>
            (townLike?.name && tm.data.name === townLike.name) ||
            (Number(townLike?.lat) === tm.data.lat &&
              Number(townLike?.lng) === tm.data.lng)
        ) || null;

      const bounds = new google.maps.LatLngBounds();
      bounds.extend(center);
      if (match) bounds.extend({ lat: match.data.lat, lng: match.data.lng });
      map.fitBounds(bounds, 64);

      if (match) {
        selectMarker(match.marker);
        infoForClicksRef.current?.close();
      }
    },
  }));

  return (
    <div className="overflow-hidden rounded-3xl border border-coal/10 shadow-soft bg-white/70">
      <div ref={mapRef} style={{ width: "100%", height }} />
    </div>
  );
});
/* ---------- ThingsPage (full, hardened) ---------- */
function ThingsPage() {
  // --- Safe fallbacks for all external data/objects ---
  const safeHvHighlights =
    typeof hvHighlights !== "undefined" && Array.isArray(hvHighlights)
      ? hvHighlights
      : [];

  const safeTownsToExplore =
    typeof townsToExplore !== "undefined" && Array.isArray(townsToExplore)
      ? townsToExplore
      : [];

  const safeTownsCoords =
    typeof townsCoords !== "undefined" && Array.isArray(townsCoords)
      ? townsCoords
      : [];

  const safeNearbyIdeas =
    typeof nearbyIdeas !== "undefined" && Array.isArray(nearbyIdeas)
      ? nearbyIdeas
      : [];

  const safeLocalHikes =
    typeof localHikes !== "undefined" && Array.isArray(localHikes)
      ? localHikes
      : [];

  const safeHydeParkCenter =
    typeof hydeParkCenter !== "undefined" && hydeParkCenter
      ? hydeParkCenter
      : null; // if null, we'll hide the map

  // 1) Map API ref so the page can talk to the map component
  const mapApiRef = React.useRef(null);

  // 2) Quick index of towns by name for easy lookup (uses the *safe* coords)
  const townIndex = React.useMemo(() => {
    const byName = {};
    (safeTownsCoords || []).forEach((t) => {
      if (t && t.name) {
        byName[t.name] = {
          name: t.name,
          lat: Number(t.lat),
          lng: Number(t.lng),
        };
      }
    });
    return byName;
  }, [safeTownsCoords]);

  return (
    <>
    <Helmet>
        <title>Things to Do in Hyde Park & the Hudson Valley | The Hyde Park Cottage</title>
        <meta
          name="description"
          content="Plan your Hudson Valley getaway with our curated guide to things to do near The Hyde Park Cottage: Culinary Institute of America, FDR Presidential Library, Vanderbilt Mansion, Walkway Over the Hudson, Rhinebeck, wineries, hikes, and more."
        />
        <link rel="canonical" href="https://www.thehydeparkcottage.com/things" />

        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="The Hyde Park Cottage" />
        <meta
          property="og:title"
          content="Things to Do in Hyde Park & the Hudson Valley | The Hyde Park Cottage"
        />
        <meta
          property="og:description"
          content="Plan your Hudson Valley getaway with our curated guide to things to do near The Hyde Park Cottage: Culinary Institute of America, FDR Presidential Library, Vanderbilt Mansion, Walkway Over the Hudson, Rhinebeck, wineries, hikes, and more."
        />
        <meta property="og:url" content="https://www.thehydeparkcottage.com/things" />
        <meta
          property="og:image"
          content="https://thehydeparkcottage.com/og/the-hyde-park-cottage-og.jpg
"
        />
        <meta
          property="og:image:alt"
          content="Map and photos of Hudson Valley attractions near The Hyde Park Cottage in Hyde Park, NY"
        />
        <meta property="og:locale" content="en_US" />

        <meta name="twitter:card" content="summary_large_image" />
        <meta
          name="twitter:title"
          content="Things to Do in Hyde Park & the Hudson Valley | The Hyde Park Cottage"
        />
        <meta
          name="twitter:description"
          content="Plan your Hudson Valley getaway with our curated guide to things to do near The Hyde Park Cottage."
        />
        <meta
          name="twitter:image"
          content="https://thehydeparkcottage.com/og/the-hyde-park-cottage-og.jpg
"
        />

        <meta name="robots" content="index,follow" />
      </Helmet>

      {/* Hero banner */}
      <section className="relative bg-sage/20 border-b border-coal/10">
        <div className={`${CONTAINER} py-10 md:py-14`}>
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <p className="uppercase tracking-wider text-xs text-coal/60">
                Explore • Hudson Valley
              </p>
              <h1 className="text-4xl md:text-5xl font-display font-semibold tracking-tight mt-2 text-moss">
                Things to Do
              </h1>
              <p className="mt-4 text-coal/80 max-w-xl">
                Handpicked experiences, hikes, and local eats—perfect day trips from Hyde Park.
              </p>
            </div>
            <div className="hidden md:block">
              <div className="aspect-[4/3] overflow-hidden rounded-3xl ring-1 ring-coal/5 shadow-soft">
                {/* Assuming CrossfadeImage is defined/imported in your app */}
                <CrossfadeImage
                  src="/photos/things_to_do/hero/walkway.jpg"
                  alt="Hudson Valley"
                  duration={1800}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured highlights (4 cards with mini sliders) */}
      {safeHvHighlights.length > 0 && (
        <Section
          title="Featured Highlights"
          intro="Our favorite must-see spots near Hyde Park."
          tone="dark"
        >
          <div className="grid md:grid-cols-2 gap-6">
            {safeHvHighlights.map((h, i) => (
              <div
                key={h?.key ?? i}
                className="rounded-3xl border border-coal/10 bg-white/80 p-5 shadow-soft"
              >
                {/* Assuming MiniFade is defined/imported in your app */}
                <MiniFade imgs={Array.isArray(h?.imgs) ? h.imgs : []} />
                <div className="mt-4 flex items-start justify-between gap-4">
                  <div>
                    <h3 className="text-lg font-display text-moss">
                      {h?.title ?? "—"}
                    </h3>
                    {h?.blurb && (
                      <p className="text-coal/75 mt-1">{h.blurb}</p>
                    )}
                  </div>
                  {h?.dist && (
                    <span className="text-sm text-coal/60 whitespace-nowrap">
                      {h.dist}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </Section>
      )}

      {/* Towns to explore + Map */}
      <Section
        title="Towns to Explore"
        intro="Each downtown has its own flavor—shops, bites, river views."
      >
        {/* Clickable chips */}
        {safeTownsToExplore.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-6">
            {safeTownsToExplore.map((t, i) => {
              const match = t?.name ? townIndex[t.name] : undefined;
              return (
                <button
                  key={i}
                  type="button"
                  onClick={() =>
                    mapApiRef.current?.focusTown(match || { name: t?.name ?? "Town" })
                  }
                  className="inline-flex items-center rounded-full border border-sage/30 bg-linen px-3 py-1.5 text-sm text-coal hover:bg-white transition"
                  title={`Center map to show "${t?.name ?? "Town"}" and Hyde Park`}
                >
                  <span className="font-medium">{t?.name ?? "—"}</span>
                  {t?.dist && (
                    <span className="ml-2 text-coal/60">{t.dist}</span>
                  )}
                </button>
              );
            })}

            {/* Reset button (only useful if we have a map below) */}
            {safeHydeParkCenter && (
              <button
                type="button"
                onClick={() => mapApiRef.current?.resetView()}
                className="ml-2 inline-flex items-center rounded-full border border-coal/20 bg-white/80 px-3 py-1.5 text-sm text-coal hover:bg-white transition"
                title="Reset map to Hyde Park"
              >
                Reset to Hyde Park
              </button>
            )}
          </div>
        )}

        {/* Map (connect the ref) — render only if center + coords + component exist */}
        {safeHydeParkCenter && safeTownsCoords.length > 0 && (
          // Assuming TownsMap is defined/imported (forwardRef)
          <TownsMap
            ref={mapApiRef}
            center={safeHydeParkCenter}
            towns={safeTownsCoords}
            initialZoom={12} // start closer; change to 13 if you prefer even tighter
          />
        )}
      </Section>

      {/* Local hikes */}
      {safeLocalHikes.length > 0 && (
        <Section
          title="Local Hikes"
          intro="From riverside walks to ridge climbs. Dress for changeable weather."
          tone="dark"
        >
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {safeLocalHikes.map((h, i) => (
              <div
                key={i}
                className="rounded-3xl border border-coal/10 bg-white/80 p-5 shadow-soft"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="text-lg font-display text-moss">
                      {h?.name ?? "—"}
                    </h3>
                    {h?.level && (
                      <p className="text-coal/70 mt-1">{h.level}</p>
                    )}
                  </div>
                  {h?.dist && (
                    <span className="text-sm text-coal/60 whitespace-nowrap">
                      {h.dist}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </Section>
      )}

      {/* Nearby ideas quick list */}
      {safeNearbyIdeas.length > 0 && (
        <Section title="Nearby Ideas" intro="Easy activities close to the cottage.">
          <ul className="grid sm:grid-cols-2 gap-3 text-coal/90">
            {safeNearbyIdeas.map((n, i) => (
              <li key={i} className="flex items-start gap-3">
                <span className="mt-2 h-1.5 w-1.5 rounded-full bg-moss/80" />
                <span>
                  <span className="font-medium">
                    {n?.title ?? n?.name ?? "—"}
                  </span>{" "}
                  — {n?.desc ?? n?.description ?? ""}
                </span>
              </li>
            ))}
          </ul>
        </Section>
      )}

      <Section
  title="Local Eats"
  intro="Hand-picked bites nearby — quick breakfasts, casual meals, and a few special-occasion spots."
  tone="dark"
>
  <div className="space-y-10">
    {/* Row 1: Three compact columns */}
    <div className="grid md:grid-cols-3 gap-6">
      {[
        { heading: "Breakfast & Cafés", list: localEats?.breakfast },
        { heading: "Lunch & Dinner",    list: localEats?.lunchDinner },
        { heading: "Ice Cream",         list: localEats?.iceCream },
      ].map(({ heading, list }, i) => (
        <div
          key={i}
          className="rounded-3xl border border-coal/10 bg-white/90 shadow-soft p-6"
        >
          <h3 className="text-lg font-display text-moss mb-3">{heading}</h3>
          <ul className="divide-y divide-coal/10">
            {(list ?? []).map((e, j) => (
              <li key={j} className="py-3">
                <div className="flex items-start justify-between gap-3">
                  <span className="font-medium text-coal">
                    {e?.name ?? "—"}
                  </span>
                  {e?.dist && (
                    <span className="shrink-0 rounded-full bg-moss/10 text-moss/90 text-xs px-2 py-0.5">
                      {e.dist}
                    </span>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>

    {/* Row 2: Full-width Fine Dining */}
    <div className="rounded-3xl border border-coal/10 bg-white shadow-soft p-6 md:p-8">
      <div className="flex items-baseline justify-between gap-4">
        <h3 className="text-xl md:text-2xl font-display text-moss">Fine Dining</h3>
        <span className="hidden md:inline text-sm text-coal/60">
          Special-occasion favorites nearby
        </span>
      </div>

      <ul className="mt-5">
        {(localEats?.fineDining ?? []).map((e, i) => (
          <li
            key={i}
            className={[
              "py-5",
              i !== 0 ? "border-t border-coal/10" : "",
            ].join(" ")}
          >
            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-3">
              <div>
                {e?.link ? (
                  <a
                    href={e.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-base md:text-lg font-semibold text-coal hover:underline"
                  >
                    {e?.name ?? "—"}
                  </a>
                ) : (
                  <span className="text-base md:text-lg font-semibold text-coal">
                    {e?.name ?? "—"}
                  </span>
                )}
                {e?.desc && (
                  <p className="mt-2 text-sm md:text-[0.95rem] leading-relaxed text-coal/75 max-w-3xl">
                    {e.desc}
                  </p>
                )}
              </div>

              {e?.dist && (
                <span className="self-start md:self-auto shrink-0 rounded-full bg-moss/10 text-moss/90 text-xs md:text-sm px-2.5 py-1">
                  {e.dist}
                </span>
              )}
            </div>
          </li>
        ))}
            </ul>
    </div>
    </div>
</Section>
    </>
  );
}
 /* ----------------------- App Shell + Routing ----------------------- */
function Shell() {

  return (
    <>
      <Nav />
      <ScrollToTop />
      <Outlet />
      <Footer />
    </>
  );
}
/* ================== FAQ PAGE (START) ================== */
/* You can change the answers in this array any time. */
const FAQS = [
  {
    q: "Where is the house located?",
    a: "Hyde Park, New York — near Route 9 and the Hudson River, close to the Culinary Institute of America, FDR House and Museum, and Rhinebeck."
  },
  {
    q: "How many guests can stay?",
    a: "Up to 6 guests. Please include all guests (adults and children) on the booking."
  },
  {
    q: "Is there parking?",
    a: "Yes. Free off-street parking is available for up to 3 vehicle(s) directly next to the home."
  },
  {
    q: "Do you allow pets?",
    a: "We love furry friends, but Hyde Park Cottage is not pet-friendly at this time."
  },
  {
    q: "What are the quiet hours?",
    a: "10:00 PM – 9:00 AM. No parties or events. Please be considerate of our neighbors."
  },
  {
    q: "Do you have a stay minimum?",
    a: "2-night minimum most dates. Longer minimums may apply on holidays."
  },
  {
    q: "What time is check in?",
    a: "Check-in is after 4:00 PM"
  },
  {
    q: "What time is check out?",
    a: "Check-out is by 11:00 AM."
  },
  {
    q: "How is the home accessed?",
    a: "Self check-in via smart lock. Your unique code and instructions are sent the morning of arrival."
  },
];

/* One FAQ item (native, accessible accordion) */
function FAQItem({ q, a }) {
  return (
    <details className="group rounded-2xl border border-coal/10 bg-white/90 p-4 md:p-5 shadow-soft open:bg-white">
      <summary className="flex cursor-pointer list-none items-start justify-between gap-3">
        <h3 className="text-base md:text-lg font-medium text-coal group-open:text-moss">
          {q}
        </h3>
        <span className="shrink-0 translate-y-0.5 rounded-full border border-coal/15 px-2 py-0.5 text-xs text-coal/60 group-open:bg-moss/10 group-open:text-moss">
          <span className="inline group-open:hidden">+</span>
          <span className="hidden group-open:inline">–</span>
        </span>
      </summary>
      <div className="mt-3 text-sm md:text-[0.95rem] leading-relaxed text-coal/75">
        {a}
      </div>
    </details>
  );
}

/* The full FAQ page section */
function FAQPage() {
  return (
    <>
      <Helmet>
        <title>FAQ | The Hyde Park Cottage – Policies, Check-In & Stay Details</title>
        <meta
          name="description"
          content="Find answers to common questions about The Hyde Park Cottage in Hyde Park, NY, including check-in and check-out times, house rules, parking, Wi-Fi, pets, cancellations, and how to book your stay in the Hudson Valley."
        />
        <link rel="canonical" href="https://www.thehydeparkcottage.com/faq" />

        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="The Hyde Park Cottage" />
        <meta
          property="og:title"
          content="FAQ | The Hyde Park Cottage – Policies, Check-In & Stay Details"
        />
        <meta
          property="og:description"
          content="Find answers to common questions about The Hyde Park Cottage in Hyde Park, NY, including check-in and check-out times, house rules, parking, Wi-Fi, pets, cancellations, and how to book your stay in the Hudson Valley."
        />
        <meta property="og:url" content="https://www.thehydeparkcottage.com/faq" />
        <meta
          property="og:image"
          content="https://thehydeparkcottage.com/og/the-hyde-park-cottage-og.jpg
"
        />
        <meta
          property="og:image:alt"
          content="Guest information and FAQs for The Hyde Park Cottage in Hyde Park, NY"
        />
        <meta property="og:locale" content="en_US" />

        <meta name="twitter:card" content="summary_large_image" />
        <meta
          name="twitter:title"
          content="FAQ | The Hyde Park Cottage – Policies, Check-In & Stay Details"
        />
        <meta
          name="twitter:description"
          content="Find answers to common questions about The Hyde Park Cottage in Hyde Park, NY."
        />
        <meta
          name="twitter:image"
          content="https://thehydeparkcottage.com/og/the-hyde-park-cottage-og.jpg
"
        />

        <meta name="robots" content="index,follow" />
      </Helmet>

    <Section
      title="Frequently Asked Questions"
      intro="Quick answers to the most common questions about your stay."
      tone="light"
    >
      <div className="grid gap-4 md:gap-5">
        {(FAQS ?? []).map((f, i) => (
          <FAQItem key={i} q={f.q} a={f.a} />
        ))}
      </div>
    </Section>
    </>
  );
}
/* ================== FAQ PAGE (END) ================== */

/* ====== MAIN APP (routes) — keep this at the very bottom ====== */
export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Shell />}>
          <Route index element={<HomePage />} />
          <Route path="amenities" element={<AmenitiesPage />} />
          <Route path="rooms" element={<RoomsPage />} />
          <Route path="things" element={<ThingsPage />} />
          <Route path="faq" element={<FAQPage />} />
          {/* optional catch-all */}
          {/* <Route path="*" element={<HomePage />} /> */}
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
