(function () {
  "use strict";

  var STORAGE_KEY = "benatky_state_v1";

  var state = {
    lang: window.DEFAULT_LANG || "cz",
    unlocked: [],
    completed: [],
    progress: {}, // routeId -> question index
    currentRoute: null
  };

  // ---------- persistence ----------
  function loadState() {
    try {
      var raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return;
      var saved = JSON.parse(raw);
      if (saved && typeof saved === "object") {
        state.lang = saved.lang || state.lang;
        state.unlocked = Array.isArray(saved.unlocked) ? saved.unlocked : [];
        state.completed = Array.isArray(saved.completed) ? saved.completed : [];
        state.progress = saved.progress && typeof saved.progress === "object" ? saved.progress : {};
      }
    } catch (e) { /* private mode / storage unavailable: ignore */ }
  }

  function persist() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({
        lang: state.lang,
        unlocked: state.unlocked,
        completed: state.completed,
        progress: state.progress
      }));
    } catch (e) { /* ignore */ }
  }

  function isUnlocked(id) { return state.unlocked.indexOf(id) !== -1; }
  function isCompleted(id) { return state.completed.indexOf(id) !== -1; }

  // ---------- helpers ----------
  function t(key, vars) {
    var dict = window.I18N[state.lang] || window.I18N[window.DEFAULT_LANG];
    var str = dict[key] != null ? dict[key] : (window.I18N[window.DEFAULT_LANG][key] || "");
    if (vars) {
      Object.keys(vars).forEach(function (k) {
        str = str.replace("{" + k + "}", vars[k]);
      });
    }
    return str;
  }

  function normalize(str) {
    if (str == null) return "";
    return String(str)
      .trim()
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "");
  }

  function getRouteData(routeId) {
    return window.ROUTE_DATA && window.ROUTE_DATA[routeId];
  }

  function getRouteConfig(routeId) {
    return window.ROUTES_CONFIG.filter(function (r) { return r.id === routeId; })[0];
  }

  function el(id) { return document.getElementById(id); }

  // ---------- toast ----------
  var toastTimer = null;
  function showToast(msg) {
    var toast = el("toast");
    toast.textContent = msg;
    toast.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { toast.classList.remove("show"); }, 2400);
  }

  // ---------- confetti ----------
  var CONFETTI_COLORS = ["#d4af37", "#f3d878", "#8c1c2b", "#b23a4e", "#1c5d8c", "#3f96c9", "#f8efdb"];
  function spawnConfetti(count) {
    var layer = el("confetti-layer");
    var frag = document.createDocumentFragment();
    for (var i = 0; i < count; i++) {
      var piece = document.createElement("div");
      piece.className = "confetti-piece";
      var size = 6 + Math.random() * 8;
      var isCircle = Math.random() > 0.5;
      piece.style.left = (Math.random() * 100) + "vw";
      piece.style.width = size + "px";
      piece.style.height = (isCircle ? size : size * 2.2) + "px";
      piece.style.background = CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)];
      if (isCircle) piece.style.borderRadius = "50%";
      piece.style.setProperty("--drift", (Math.random() * 160 - 80) + "px");
      var dur = 1.3 + Math.random() * 1.1;
      var delay = Math.random() * 0.25;
      piece.style.animationDuration = dur + "s";
      piece.style.animationDelay = delay + "s";
      frag.appendChild(piece);
      (function (p, total) {
        setTimeout(function () { if (p.parentNode) p.parentNode.removeChild(p); }, total * 1000 + 200);
      })(piece, dur + delay);
    }
    layer.appendChild(frag);
  }

  // ---------- i18n application ----------
  function applyI18n() {
    document.documentElement.lang = state.lang;
    document.title = t("docTitle");

    document.querySelectorAll("[data-i18n]").forEach(function (node) {
      var key = node.getAttribute("data-i18n");
      node.textContent = t(key);
    });
    document.querySelectorAll("[data-i18n-placeholder]").forEach(function (node) {
      var key = node.getAttribute("data-i18n-placeholder");
      node.setAttribute("placeholder", t(key));
    });

    document.querySelectorAll(".lang-switch button").forEach(function (btn) {
      btn.classList.toggle("active", btn.getAttribute("data-lang") === state.lang);
    });

    renderRoutePills();
    renderRouteCards();
    updatePillFades();

    if (currentView === "quiz" && state.currentRoute) {
      updateQuizRouteTag(state.currentRoute);
      if (quizSub === "question") renderQuestion();
    }
  }

  // ---------- views ----------
  var currentView = "home";
  var quizSub = "intro"; // intro | question | complete

  function switchView(name) {
    currentView = name;
    document.querySelectorAll(".view").forEach(function (v) { v.classList.remove("active"); });
    el("view-" + name).classList.add("active");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  // ---------- route pills ----------
  function routeAccentStyle(cfg) {
    return "--card-accent:" + cfg.accent + ";--card-accent2:" + cfg.accent2 + ";";
  }

  function buildPill(cfg) {
    var btn = document.createElement("button");
    btn.type = "button";
    btn.className = "route-pill" + (isUnlocked(cfg.id) ? " is-unlocked" : "") + (state.currentRoute === cfg.id && currentView === "quiz" ? " active" : "");
    var lockIco = isUnlocked(cfg.id) ? "" : "🔒 ";
    btn.innerHTML = '<span class="dot"></span><span class="lock-ico">' + lockIco + "</span>" +
      t("routeCardWord") + " " + cfg.number;
    btn.addEventListener("click", function () { handleRouteSelect(cfg.id); });
    return btn;
  }

  function renderRoutePills() {
    var wrap = el("routePills");
    var mobile = el("mobileRouteStrip");
    wrap.innerHTML = "";
    mobile.innerHTML = "";
    window.ROUTES_CONFIG.forEach(function (cfg) {
      wrap.appendChild(buildPill(cfg));
      mobile.appendChild(buildPill(cfg));
    });
  }

  // ---------- pill strip edge fades ----------
  // Shows a soft fade on whichever edge of a horizontally-scrollable pill
  // strip still has more content to scroll to, instead of an abrupt cut.
  function updateFadeFor(scrollEl) {
    var viewport = scrollEl.closest(".pill-scroll-viewport");
    if (!viewport) return;
    var maxScroll = scrollEl.scrollWidth - scrollEl.clientWidth;
    viewport.classList.toggle("at-start", scrollEl.scrollLeft <= 2);
    viewport.classList.toggle("at-end", maxScroll <= 2 || scrollEl.scrollLeft >= maxScroll - 2);
  }
  function updatePillFades() {
    updateFadeFor(el("routePills"));
    updateFadeFor(el("mobileRouteStrip"));
  }
  ["routePills", "mobileRouteStrip"].forEach(function (id) {
    el(id).addEventListener("scroll", function () { updateFadeFor(el(id)); }, { passive: true });
  });
  window.addEventListener("resize", updatePillFades);

  // ---------- route cards ----------
  function renderRouteCards() {
    var grid = el("routeGrid");
    grid.innerHTML = "";
    window.ROUTES_CONFIG.forEach(function (cfg) {
      var unlocked = isUnlocked(cfg.id);
      var completed = isCompleted(cfg.id);
      var started = state.progress[cfg.id] != null;

      var card = document.createElement("div");
      card.className = "route-card" + (unlocked ? " unlocked" : "") + (completed ? " completed" : "");
      card.setAttribute("style", routeAccentStyle(cfg));

      var statusText = completed ? "✓ " + t("routeCardCompleted") : unlocked ? "🔓 " + t("routeCardUnlocked") : "🔒 " + t("routeCardLocked");
      var ctaText = completed ? t("routeCardRestart") : (started ? t("routeCardContinue") : t("routeCardPlay"));

      card.innerHTML =
        '<div class="rc-top">' +
          '<div class="rc-num">🚣 ' + t("routeCardWord") + " " + cfg.number + "</div>" +
          '<div class="rc-status">' + statusText + "</div>" +
        "</div>" +
        "<h3>" + ((cfg.name && cfg.name[state.lang]) || cfg.id) + "</h3>" +
        "<p>" + (cfg.teaser[state.lang] || cfg.teaser.cz) + "</p>" +
        '<div class="rc-bottom">' +
          '<div class="rc-stops"><b>' + cfg.stops + "</b> " + t("routeCardStops") + "</div>" +
          '<button type="button" class="btn btn-primary btn-sm rc-cta">' + ctaText + "</button>" +
        "</div>";

      card.addEventListener("click", function (e) {
        handleRouteSelect(cfg.id, completed);
      });
      grid.appendChild(card);
    });
  }

  // ---------- password modal ----------
  var pendingRoute = null;

  function openPasswordModal(routeId) {
    var cfg = getRouteConfig(routeId);
    pendingRoute = routeId;
    el("pwModalCard").setAttribute("style", routeAccentStyle(cfg));
    el("pwModalRouteName").textContent = t("modalRouteLabel") + " " + cfg.number;
    el("pwInput").value = "";
    el("pwError").textContent = "";
    el("pwModal").classList.add("open");
    setTimeout(function () { el("pwInput").focus(); }, 260);
  }

  function closePasswordModal() {
    el("pwModal").classList.remove("open");
    pendingRoute = null;
  }

  function handlePasswordSubmit(e) {
    e.preventDefault();
    if (!pendingRoute) return;
    var cfg = getRouteConfig(pendingRoute);
    var typed = normalize(el("pwInput").value);
    if (typed && typed === normalize(cfg.password)) {
      if (!isUnlocked(cfg.id)) state.unlocked.push(cfg.id);
      persist();
      var enteringId = pendingRoute;
      closePasswordModal();
      showToast(t("modalSuccess"));
      spawnConfetti(26);
      enterRoute(enteringId);
    } else {
      el("pwError").textContent = t("modalError");
      var card = el("pwModalCard");
      card.classList.remove("shake");
      void card.offsetWidth;
      card.classList.add("shake");
      el("pwInput").focus();
      el("pwInput").select();
    }
  }

  // ---------- route selection / entry ----------
  function handleRouteSelect(routeId, restart) {
    if (!isUnlocked(routeId)) {
      openPasswordModal(routeId);
      return;
    }
    if (restart) {
      delete state.progress[routeId];
      state.completed = state.completed.filter(function (id) { return id !== routeId; });
      persist();
    }
    enterRoute(routeId);
  }

  function updateQuizRouteTag(routeId) {
    var cfg = getRouteConfig(routeId);
    el("quizRouteTag").setAttribute("style", routeAccentStyle(cfg));
    el("quizRouteTagText").textContent = t("routeCardWord") + " " + cfg.number;
  }

  function enterRoute(routeId) {
    state.currentRoute = routeId;
    switchView("quiz");
    updateQuizRouteTag(routeId);
    renderRoutePills();

    if (isCompleted(routeId)) {
      showCompletionView(routeId, false);
      return;
    }
    var savedIdx = state.progress[routeId];
    if (savedIdx == null) {
      showIntroView(routeId);
    } else {
      showQuestionView(routeId, savedIdx);
    }
  }

  // ---------- intro sub-view ----------
  function showIntroView(routeId) {
    quizSub = "intro";
    el("quizIntro").hidden = false;
    el("quizQuestion").hidden = true;
    el("quizComplete").hidden = true;
    el("progressWrap").hidden = true;

    var data = getRouteData(routeId);
    var photosWrap = el("introPhotos");
    photosWrap.innerHTML = "";
    if (data && data.introPhotos) {
      data.introPhotos.forEach(function (src) {
        var img = document.createElement("img");
        img.src = src;
        img.alt = "Venezia";
        img.loading = "lazy";
        photosWrap.appendChild(img);
      });
    }
  }

  el("startQuizBtn").addEventListener("click", function () {
    if (!state.currentRoute) return;
    state.progress[state.currentRoute] = 0;
    persist();
    showQuestionView(state.currentRoute, 0);
  });

  // ---------- question sub-view ----------
  var quizState = { routeId: null, index: 0, revealedHints: 0, correct: false };

  function showQuestionView(routeId, idx) {
    quizSub = "question";
    el("quizIntro").hidden = true;
    el("quizComplete").hidden = true;
    el("quizQuestion").hidden = false;
    el("progressWrap").hidden = false;

    quizState = { routeId: routeId, index: idx, revealedHints: 0, correct: false };
    el("qInput").value = "";
    el("qInput").classList.remove("wrong", "correct");
    renderQuestion();
    // each new question starts at the top of the card, regardless of how far
    // the player had scrolled while reading the previous one's hints/funfact
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function renderQuestion() {
    var route = getRouteData(quizState.routeId);
    if (!route) return;
    var total = route.questions.length;
    var q = route.questions[quizState.index];
    var lang = state.lang;
    var cfg = getRouteConfig(quizState.routeId);

    el("progressLabel").textContent = t("quizProgress", { current: quizState.index + 1, total: total });
    el("progressFill").style.width = Math.round((quizState.index / total) * 100) + "%";
    el("progressFill").style.background = "linear-gradient(90deg," + cfg.accent + "," + cfg.accent2 + ")";

    var title = (q.QuizTitle && q.QuizTitle[lang]) || "";
    var titleEl = el("qTitle");
    titleEl.textContent = title;
    titleEl.style.display = title ? "" : "none";

    var loc = (q.Location && q.Location[lang]) || "";
    el("qLocationBlock").hidden = !loc;
    el("qLocation").textContent = loc;

    el("qQuestion").textContent = (q.question && q.question[lang]) || "";

    el("qPrevBtn").hidden = quizState.index === 0;
    el("qNextBtn").hidden = !quizState.correct;

    // hints
    var hintBox = el("qHintBox");
    var hintContent = el("qHintContent");
    hintContent.innerHTML = "";
    if (quizState.revealedHints > 0 && !quizState.correct) {
      for (var i = 0; i < quizState.revealedHints && i < q.hints.length; i++) {
        appendHintOrFact(hintContent, q.hints[i], lang);
      }
      hintBox.hidden = false;
    } else {
      hintBox.hidden = true;
    }

    // fun fact
    var factBox = el("qFunFactBox");
    var factContent = el("qFunFactContent");
    factContent.innerHTML = "";
    if (quizState.correct && q.funFact) {
      var hasContent = q.funFact.type === "image" ? !!q.funFact.content :
        !!(q.funFact.content && q.funFact.content[lang]);
      if (hasContent) {
        appendHintOrFact(factContent, q.funFact, lang);
        factBox.hidden = false;
      } else {
        factBox.hidden = true;
      }
    } else {
      factBox.hidden = true;
    }

    el("qInput").classList.remove("wrong", "correct");
    if (quizState.correct) el("qInput").classList.add("correct");
  }

  function appendHintOrFact(container, item, lang) {
    if (item.type === "image") {
      var img = document.createElement("img");
      img.src = item.content;
      img.alt = "Venezia";
      img.loading = "lazy";
      container.appendChild(img);
    } else {
      var text = (item.content && item.content[lang]) || "";
      if (!text) return;
      var p = document.createElement("p");
      p.textContent = text;
      container.appendChild(p);
    }
  }

  function checkAnswer() {
    var route = getRouteData(quizState.routeId);
    var q = route.questions[quizState.index];
    var lang = state.lang;
    var raw = el("qInput").value;
    var norm = normalize(raw);

    var answerField = q.answer ? q.answer[lang] : "";
    var accepted = Array.isArray(answerField) ? answerField.map(normalize) : [normalize(answerField)];

    if (accepted.indexOf(norm) !== -1) {
      handleCorrectAnswer();
    } else {
      handleIncorrectAnswer(q);
    }
  }

  function handleCorrectAnswer() {
    quizState.correct = true;
    persist_progress();
    renderQuestion();
    showToast(t("quizCorrectToast"));
    spawnConfetti(36);
  }

  function handleIncorrectAnswer(q) {
    var input = el("qInput");
    input.classList.remove("correct");
    input.classList.remove("wrong");
    void input.offsetWidth;
    input.classList.add("wrong");

    if (quizState.revealedHints < q.hints.length) {
      quizState.revealedHints++;
    }
    renderQuestion();
  }

  function persist_progress() {
    state.progress[quizState.routeId] = quizState.index;
    persist();
  }

  el("qCheckBtn").addEventListener("click", checkAnswer);
  el("qInput").addEventListener("keydown", function (e) {
    if (e.key === "Enter") { e.preventDefault(); checkAnswer(); }
  });

  el("qPrevBtn").addEventListener("click", function () {
    if (quizState.index === 0) return;
    showQuestionView(quizState.routeId, quizState.index - 1);
    state.progress[quizState.routeId] = quizState.index;
    persist();
  });

  el("qNextBtn").addEventListener("click", function () {
    var route = getRouteData(quizState.routeId);
    var nextIdx = quizState.index + 1;
    if (nextIdx < route.questions.length) {
      showQuestionView(quizState.routeId, nextIdx);
      state.progress[quizState.routeId] = nextIdx;
      persist();
    } else {
      showCompletionView(quizState.routeId, true);
    }
  });

  // ---------- completion sub-view ----------
  function showCompletionView(routeId, celebrate) {
    quizSub = "complete";
    el("quizIntro").hidden = true;
    el("quizQuestion").hidden = true;
    el("quizComplete").hidden = false;
    el("progressWrap").hidden = true;

    if (state.completed.indexOf(routeId) === -1) state.completed.push(routeId);
    persist();

    if (celebrate) {
      spawnConfetti(110);
      showToast(t("completionTitle"));
    }
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  el("completeBackBtn").addEventListener("click", function () {
    switchView("home");
    renderRouteCards();
  });
  el("completeAnotherBtn").addEventListener("click", function () {
    switchView("home");
    renderRouteCards();
  });

  // ---------- misc UI wiring ----------
  el("brandHome").addEventListener("click", function () { switchView("home"); });
  el("exitLink").addEventListener("click", function () { switchView("home"); renderRouteCards(); });

  el("pwCancelBtn").addEventListener("click", closePasswordModal);
  el("pwModalClose").addEventListener("click", closePasswordModal);
  el("pwModal").addEventListener("click", function (e) {
    if (e.target === el("pwModal")) closePasswordModal();
  });
  el("pwForm").addEventListener("submit", handlePasswordSubmit);

  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && el("pwModal").classList.contains("open")) closePasswordModal();
  });

  document.querySelectorAll(".lang-switch button").forEach(function (btn) {
    btn.addEventListener("click", function () {
      state.lang = btn.getAttribute("data-lang");
      persist();
      applyI18n();
    });
  });

  // ---------- boot ----------
  loadState();
  applyI18n();
  switchView("home");
})();
