/**
 * Reliant Tile Company — site interactions
 * Hero slideshow + mobile navigation
 */

(function () {
  const menuToggle = document.querySelector(".menu-toggle");
  const nav = document.querySelector(".nav");

  if (menuToggle && nav) {
    menuToggle.addEventListener("click", function () {
      const open = nav.classList.toggle("is-open");
      menuToggle.setAttribute("aria-expanded", open ? "true" : "false");
      document.body.style.overflow = open ? "hidden" : "";
    });

    nav.querySelectorAll('a[href^="#"]').forEach(function (link) {
      link.addEventListener("click", function () {
        nav.classList.remove("is-open");
        menuToggle.setAttribute("aria-expanded", "false");
        document.body.style.overflow = "";
      });
    });
  }

  // Hero slideshow — crossfade, auto-advance only
  const slides = document.querySelectorAll(".hero__slide");
  if (!slides.length) return;

  let index = 0;
  let timer = null;
  const interval = 5500;

  function goTo(i) {
    index = (i + slides.length) % slides.length;
    slides.forEach(function (s, j) {
      s.classList.toggle("is-active", j === index);
    });
  }

  function next() {
    goTo(index + 1);
  }

  function schedule() {
    clearInterval(timer);
    timer = setInterval(next, interval);
  }

  goTo(0);
  schedule();

  // Pause when tab hidden
  document.addEventListener("visibilitychange", function () {
    if (document.hidden) clearInterval(timer);
    else schedule();
  });
})();

/**
 * Our Work: horizontal strip — prev | current | next (equal thirds), smooth translateX.
 */
(function () {
  var root = document.getElementById("work-carousel");
  var dataTpl = document.getElementById("work-carousel-data");
  if (!root || !dataTpl) return;

  var slideEls = dataTpl.content.querySelectorAll("[data-src]");
  var slides = Array.prototype.map.call(slideEls, function (el) {
    return {
      src: el.getAttribute("data-src") || "",
      alt: el.getAttribute("data-alt") || "",
      label: el.getAttribute("data-label") || "",
    };
  });
  if (!slides.length) return;

  var n = slides.length;
  var idx = 0;
  var timer = null;
  var interval = 6000;
  var slidePx = 0;

  var track = document.getElementById("work-carousel-track");
  var mask = document.getElementById("work-carousel-mask");
  var dotsWrap = document.getElementById("work-carousel-dots");
  var prevArrow = root.querySelector(".work-carousel__arrow--prev");
  var nextArrow = root.querySelector(".work-carousel__arrow--next");
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

  if (!track || !mask) return;

  var realEls = [];

  slides.forEach(function (s, j) {
    var slideEl = document.createElement("div");
    slideEl.className = "work-carousel__strip-slide";
    slideEl.setAttribute("data-slide-index", String(j));
    slideEl.setAttribute("data-logical-index", String(j));
    slideEl.tabIndex = -1;

    var inner = document.createElement("span");
    inner.className = "work-carousel__strip-inner";

    var img = document.createElement("img");
    img.className = "work-carousel__strip-img";
    img.src = s.src;
    img.alt = s.alt || "";
    img.width = 700;
    img.height = 700;
    img.decoding = "async";

    inner.appendChild(img);
    var dim = document.createElement("span");
    dim.className = "work-carousel__strip-dim";
    dim.setAttribute("aria-hidden", "true");
    inner.appendChild(dim);
    slideEl.appendChild(inner);
    realEls.push(slideEl);
  });

  function cloneStripSlide(templateEl, logicalIndex) {
    var el = templateEl.cloneNode(true);
    el.setAttribute("data-logical-index", String(logicalIndex));
    el.removeAttribute("data-slide-index");
    return el;
  }

  /**
   * Full prefix + reals + suffix (3× n slides) so we can scroll into cloned slides,
   * then reset transform by n slides with no visible jump (seamless loop).
   */
  var pad = 0;
  var frag = document.createDocumentFragment();
  if (n >= 3) {
    pad = n;
    var p;
    for (p = 0; p < n; p++) {
      frag.appendChild(cloneStripSlide(realEls[p], p));
    }
    for (p = 0; p < n; p++) {
      frag.appendChild(realEls[p]);
    }
    for (p = 0; p < n; p++) {
      frag.appendChild(cloneStripSlide(realEls[p], p));
    }
  } else {
    for (var q = 0; q < n; q++) {
      frag.appendChild(realEls[q]);
    }
  }
  track.textContent = "";
  track.appendChild(frag);

  var totalSlides = track.querySelectorAll(".work-carousel__strip-slide").length;
  root.style.setProperty("--work-slide-count", String(totalSlides));

  var bridgeIndex = null;
  var wrappingForward = false;
  var wrappingBackward = false;

  function mod(a, m) {
    return ((a % m) + m) % m;
  }

  function visibleColumns() {
    if (n < 3) return 1;
    var w = Math.round(mask.getBoundingClientRect().width);
    /* One full-width slide on narrow viewports — thirds are too small (~120px wide on phones). */
    return w < 768 ? 1 : 3;
  }

  /** DOM index of the leftmost visible slide (includes prepended clones). */
  function physicalLeftIndex() {
    if (bridgeIndex !== null) {
      return bridgeIndex;
    }
    var vc = visibleColumns();
    if (vc === 1) {
      return pad + idx;
    }
    return pad + idx - 1;
  }

  function syncMetrics() {
    bridgeIndex = null;
    wrappingForward = false;
    wrappingBackward = false;
    var maskW = Math.max(1, Math.round(mask.getBoundingClientRect().width));
    var vc = visibleColumns();
    slidePx = maskW / vc;
    root.style.setProperty("--work-slide-px", slidePx + "px");
    updateTransform({ instant: true });
  }

  function updateTransform(opts) {
    opts = opts || {};
    var leftIx = physicalLeftIndex();
    var tx = -leftIx * slidePx;
    if (opts.instant || reduceMotion.matches) {
      track.classList.add("work-carousel__track--no-transition");
    }
    track.style.transform = "translate3d(" + tx + "px,0,0)";
    if (opts.instant || reduceMotion.matches) {
      void track.offsetWidth;
      track.classList.remove("work-carousel__track--no-transition");
    }
  }

  function syncCurrent() {
    track.querySelectorAll(".work-carousel__strip-slide").forEach(function (el) {
      var logical = el.getAttribute("data-logical-index");
      if (logical == null) return;
      var li = parseInt(logical, 10);
      var on = li === idx;
      el.classList.toggle("is-current", on);
      el.setAttribute("aria-hidden", on ? "false" : "true");
    });
  }

  function syncDots() {
    if (!dotsWrap) return;
    var dots = dotsWrap.querySelectorAll(".work-carousel__dot");
    dots.forEach(function (d, j) {
      d.classList.toggle("is-active", j === idx);
      d.setAttribute("aria-selected", j === idx ? "true" : "false");
    });
  }

  function goTo(i, opts) {
    opts = opts || {};
    bridgeIndex = null;
    wrappingForward = false;
    wrappingBackward = false;
    idx = mod(i, n);
    updateTransform(opts);
    syncCurrent();
    syncDots();
  }

  function next() {
    if (reduceMotion.matches || !pad) {
      goTo(idx + 1, {});
      return;
    }
    if (idx === n - 1) {
      var targetBridge = physicalLeftIndex() + 1;
      idx = 0;
      wrappingForward = true;
      bridgeIndex = targetBridge;
      updateTransform({});
      syncCurrent();
      syncDots();
      return;
    }
    goTo(idx + 1, {});
  }

  function prev() {
    if (reduceMotion.matches || !pad) {
      goTo(idx - 1, {});
      return;
    }
    if (idx === 0) {
      var targetBridge = physicalLeftIndex() - 1;
      idx = n - 1;
      wrappingBackward = true;
      bridgeIndex = targetBridge;
      updateTransform({});
      syncCurrent();
      syncDots();
      return;
    }
    goTo(idx - 1, {});
  }

  track.addEventListener("transitionend", function (e) {
    if (e.target !== track) return;
    if (!wrappingForward && !wrappingBackward) return;
    var prop = e.propertyName || "";
    if (prop.indexOf("transform") === -1) return;
    if (wrappingForward) {
      wrappingForward = false;
      bridgeIndex = null;
      goTo(0, { instant: true });
    } else if (wrappingBackward) {
      wrappingBackward = false;
      bridgeIndex = null;
      goTo(n - 1, { instant: true });
    }
  });

  function schedule() {
    clearInterval(timer);
    if (n < 2) return;
    timer = setInterval(next, interval);
  }

  slides.forEach(function (s, i) {
    var btn = document.createElement("button");
    btn.type = "button";
    btn.className = "work-carousel__dot";
    btn.setAttribute("role", "tab");
    btn.setAttribute("aria-label", "Slide " + (i + 1) + ": " + s.label);
    btn.addEventListener("click", function () {
      goTo(i, {});
      schedule();
    });
    if (dotsWrap) dotsWrap.appendChild(btn);
  });

  if (prevArrow) {
    prevArrow.addEventListener("click", function () {
      prev();
      schedule();
    });
  }
  if (nextArrow) {
    nextArrow.addEventListener("click", function () {
      next();
      schedule();
    });
  }

  var touchStartX = null;
  mask.addEventListener(
    "touchstart",
    function (e) {
      touchStartX = e.changedTouches[0].screenX;
    },
    { passive: true }
  );
  mask.addEventListener(
    "touchend",
    function (e) {
      if (touchStartX == null) return;
      var dx = e.changedTouches[0].screenX - touchStartX;
      touchStartX = null;
      if (Math.abs(dx) < 45) return;
      if (dx > 0) prev();
      else next();
      schedule();
    },
    { passive: true }
  );

  var resizeTimer = null;
  window.addEventListener("resize", function () {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(function () {
      syncMetrics();
    }, 120);
  });

  function onReduceMotionChange() {
    syncMetrics();
  }
  if (reduceMotion.addEventListener) {
    reduceMotion.addEventListener("change", onReduceMotionChange);
  } else if (reduceMotion.addListener) {
    reduceMotion.addListener(onReduceMotionChange);
  }

  requestAnimationFrame(function () {
    requestAnimationFrame(function () {
      syncMetrics();
      goTo(0, { instant: true });
      schedule();
    });
  });

  document.addEventListener("visibilitychange", function () {
    if (document.hidden) clearInterval(timer);
    else schedule();
  });
})();

/**
 * Contact form:
 * - Formspree (HTTPS action): submit via fetch + FormData so the page doesn’t navigate away;
 *   multipart encoding still sends file attachments when configured in Formspree.
 * - mailto: opens the user’s mail client with a composed message.
 */
(function () {
  var form = document.querySelector(".estimate-form");
  if (!form) return;

  var action = (form.getAttribute("action") || "").trim();
  var isFormspree = /formspree\.io/i.test(action);

  if (isFormspree) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var btn = form.querySelector('button[type="submit"]');
      if (btn) btn.disabled = true;
      var fd = new FormData(form);
      fetch(action, {
        method: "POST",
        body: fd,
        headers: { Accept: "application/json" },
      })
        .then(function (res) {
          return res.json().then(
            function (data) {
              return { res: res, data: data };
            },
            function () {
              return { res: res, data: null };
            },
          );
        })
        .then(function (x) {
          if (btn) btn.disabled = false;
          if (x.res.ok) {
            alert(
              "Thanks! We received your message and will get back to you soon.",
            );
            form.reset();
          } else {
            var msg = "Something went wrong. Please try again or call us.";
            if (x.data) {
              if (typeof x.data.error === "string") msg = x.data.error;
              else if (x.data.errors && x.data.errors.length) {
                msg = x.data.errors
                  .map(function (err) {
                    return err.message || err.field || "";
                  })
                  .filter(Boolean)
                  .join("\n");
              }
            }
            alert(msg);
          }
        })
        .catch(function () {
          if (btn) btn.disabled = false;
          alert("Something went wrong. Please try again or call us.");
        });
    });
    return;
  }

  if (action.indexOf("mailto:") !== 0) return;

  form.addEventListener("submit", function (e) {
    e.preventDefault();

    var raw = action.replace(/^mailto:/i, "");
    var addr = raw.split("?")[0].trim();
    var nameEl = form.querySelector('[name="name"]');
    var phoneEl = form.querySelector('[name="phone"]');
    var emailEl = form.querySelector('[name="email"]');
    var msgEl = form.querySelector('[name="message"]');

    var name = nameEl ? nameEl.value : "";
    var phone = phoneEl ? phoneEl.value : "";
    var email = emailEl ? emailEl.value : "";
    var message = msgEl ? msgEl.value : "";

    var body =
      "Name: " + name + "\n" +
      "Phone: " + phone + "\n" +
      "Email: " + email + "\n\n" +
      message;

    var subject = "Free estimate request — Reliant Tile Company";
    window.location.href =
      "mailto:" + addr +
      "?subject=" + encodeURIComponent(subject) +
      "&body=" + encodeURIComponent(body);
  });
})();
