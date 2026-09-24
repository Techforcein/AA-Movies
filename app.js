/* ============================================================
   AA Moviez — Movie Database
   Demo/placeholder data only. Replace poster/backdrop/videoUrl
   with your own licensed assets before going live.
   ============================================================ */

const movies = [
  { id: "m1", title: "Man vs Wild", year: 2006, language: "English", type: "Show", genres: ["Adventure", "Documentary"], rating: 8.2, duration: "45m", description: "Bear Grylls takes on extreme environments and survival challenges.", poster: "https://i.ibb.co/tT7fZjRv/file-00000000700481f8960496e24da5ea48.png", page: "M1.html", cast: ["Bear Grylls"], director: "Discovery", keywords: ["survival", "wild", "adventure", "bear gry"], videoUrl: "https://player.mediadelivery.net/play/756384/15fd2780-7a09-443d-a48a-92efab2c5e53" },
  { id: "m2", title: "Deadpool & Wolverine", year: 2024, language: "English", type: "Movie", genres: ["Action", "Comedy", "Sci-Fi"], rating: 7.7, duration: "2h 8m", description: "Deadpool and Wolverine are brought together for a chaotic multiverse adventure.", poster:"https://techforcein.github.io/AA-Movies/images.jpeg", page: "M2.html", cast: ["Ryan Reynolds", "Hugh Jackman"], director: "Shawn Levy", keywords: ["marvel", "deadpool", "wolverine", "superhero"], videoUrl: "https://player.mediadelivery.net/play/756384/53f1afe3-e08e-4b93-866f-47e444b24610" },
  { id: "m3", title: "Guardians of the Galaxy Vol. 2", year: 2017, language: "English", type: "Movie", genres: ["Action", "Adventure", "Sci-Fi"], rating: 7.6, duration: "2h 16m", description: "The Guardians continue their cosmic journey while Peter Quill discovers more about his family.", poster: "p_guardiansofthegalaxyvol2_19888_6cc63663.jpeg", page: "M3.html", cast: ["Chris Pratt", "Zoe Saldana", "Dave Bautista"], director: "James Gunn", keywords: ["marvel", "guardians", "groot", "space"], videoUrl: "https://player.mediadelivery.net/play/756384/d39e8b45-669d-4e44-90db-df95c4c19b00" },
  { id: "m4", title: "Dhamaal 4", year: 2026, language: "Hindi", type: "Movie", genres: ["Comedy", "Adventure"], rating: 7.5, duration: "2h 23m", description: "The Dhamaal gang returns for another chaotic treasure-hunt adventure.", poster: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQMjeB1ueqgX3F5aarH5OSZBNQozqwwWwDMK240CblsDg&s=10", page: "M4.html", cast: ["Ajay Devgn", "Riteish Deshmukh", "Arshad Warsi"], director: "Indra Kumar", keywords: ["dhamaal", "comedy", "treasure", "hindi"], videoUrl: "https://player.mediadelivery.net/play/756384/05829b70-2d29-472a-a474-48f13222f2c5" }
];

// The homepage contains only the four requested movies.
const featuredMovieIds = ["m1", "m2", "m3", "m4"];

if (typeof module !== "undefined") module.exports = { movies, featuredMovieIds };



// Normalize demo records so search/recommendation code remains safe if a record omits optional fields.
movies.forEach(m => {
  m.genres = Array.isArray(m.genres) ? m.genres : [];
  m.cast = Array.isArray(m.cast) ? m.cast : [];
  m.keywords = Array.isArray(m.keywords) ? m.keywords : [];
  m.rating = Number(m.rating || 0);
  m.year = Number(m.year || 0);
  m.language = m.language || "Unknown";
  m.type = m.type || "Movie";
  m.duration = m.duration || "";
  m.description = m.description || "";
  m.director = m.director || "Unknown";
});


/* ============================================================
   AA Moviez — Watchlist (localStorage, no accounts)
   ============================================================ */

const WATCHLIST_KEY = "aamoviez_watchlist";

function getWatchlist() {
  try {
    const raw = localStorage.getItem(WATCHLIST_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    console.error("AA Moviez: could not read watchlist", e);
    return [];
  }
}

function saveWatchlistIds(ids) {
  try {
    localStorage.setItem(WATCHLIST_KEY, JSON.stringify(ids));
  } catch (e) {
    console.error("AA Moviez: could not save watchlist", e);
  }
}

function addToWatchlist(movieId) {
  const ids = getWatchlist();
  if (!ids.includes(movieId)) {
    ids.unshift(movieId);
    saveWatchlistIds(ids);
  }
  document.dispatchEvent(new CustomEvent("watchlist:changed"));
}

function removeFromWatchlist(movieId) {
  const ids = getWatchlist().filter(id => id !== movieId);
  saveWatchlistIds(ids);
  document.dispatchEvent(new CustomEvent("watchlist:changed"));
}

function isInWatchlist(movieId) {
  return getWatchlist().includes(movieId);
}

function toggleWatchlist(movieId) {
  if (isInWatchlist(movieId)) removeFromWatchlist(movieId);
  else addToWatchlist(movieId);
  return isInWatchlist(movieId);
}

function getWatchlistMovies() {
  const ids = getWatchlist();
  return ids.map(id => movies.find(m => m.id === id)).filter(Boolean);
}

/* ---------------- Continue Watching ---------------- */

const CONTINUE_KEY = "aamoviez_continue_watching";

function getContinueWatching() {
  try {
    const raw = localStorage.getItem(CONTINUE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch (e) {
    console.error("AA Moviez: could not read continue-watching", e);
    return {};
  }
}

function saveProgress(movieId, position, duration) {
  const data = getContinueWatching();
  data[movieId] = { position, duration, lastWatched: Date.now() };
  try {
    localStorage.setItem(CONTINUE_KEY, JSON.stringify(data));
  } catch (e) {
    console.error("AA Moviez: could not save progress", e);
  }
}

function getProgress(movieId) {
  const data = getContinueWatching();
  return data[movieId] || null;
}

function getContinueWatchingMovies() {
  const data = getContinueWatching();
  return Object.keys(data)
    .sort((a, b) => data[b].lastWatched - data[a].lastWatched)
    .map(id => {
      const movie = movies.find(m => m.id === id);
      return movie ? { ...movie, progress: data[id] } : null;
    })
    .filter(Boolean);
}

function removeFromContinueWatching(movieId) {
  const data = getContinueWatching();
  delete data[movieId];
  localStorage.setItem(CONTINUE_KEY, JSON.stringify(data));
}


/* ============================================================
   AA Moviez — Recommendation Engine
   Scores every other movie against a source movie using genre,
   language, cast, director, keyword and year proximity overlap.
   ============================================================ */

function overlapScore(a = [], b = []) {
  const setB = new Set(b.map(x => x.toLowerCase()));
  return a.reduce((score, item) => score + (setB.has(item.toLowerCase()) ? 1 : 0), 0);
}

function similarityScore(source, candidate) {
  if (source.id === candidate.id) return -1;

  let score = 0;
  score += overlapScore(source.genres, candidate.genres) * 3;
  score += source.language === candidate.language ? 2 : 0;
  score += overlapScore(source.cast, candidate.cast) * 4;
  score += source.director === candidate.director ? 3 : 0;
  score += overlapScore(source.keywords, candidate.keywords) * 2;

  const yearGap = Math.abs(source.year - candidate.year);
  score += yearGap <= 1 ? 1.5 : yearGap <= 3 ? 0.75 : 0;

  return score;
}

/**
 * getRecommendations(movieId, limit = 12) -> ranked list of movies
 * similar to the given movie, most similar first.
 */
function getRecommendations(movieId, limit = 12) {
  const source = movies.find(m => m.id === movieId);
  if (!source) return [];

  return movies
    .map(candidate => ({ candidate, score: similarityScore(source, candidate) }))
    .filter(r => r.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map(r => r.candidate);
}

/**
 * A lightweight "Recommended For You" pull for the homepage, based on
 * whatever the visitor currently has in their watchlist / continue
 * watching. Falls back to top-rated titles for a first-time visitor.
 */
function getHomeRecommendations(limit = 12) {
  const seedIds = [
    ...(typeof getWatchlist === "function" ? getWatchlist() : []),
    ...(typeof getContinueWatching === "function" ? Object.keys(getContinueWatching()) : [])
  ];

  if (seedIds.length === 0) {
    return [...movies].sort((a, b) => b.rating - a.rating).slice(0, limit);
  }

  const tally = new Map();
  seedIds.forEach(id => {
    getRecommendations(id, 8).forEach(m => {
      tally.set(m.id, (tally.get(m.id) || 0) + 1);
    });
  });

  const ranked = [...tally.entries()]
    .filter(([id]) => !seedIds.includes(id))
    .sort((a, b) => b[1] - a[1])
    .map(([id]) => movies.find(m => m.id === id))
    .filter(Boolean);

  return ranked.length ? ranked.slice(0, limit) : [...movies].sort((a, b) => b.rating - a.rating).slice(0, limit);
}


/* ============================================================
   AA Moviez — Search Engine
   Multi-field, typo-tolerant, multi-word search over the local
   movie catalog. No backend required.
   ============================================================ */

const SEARCH_GENRES = ["action","adventure","comedy","drama","thriller","horror","romance","sci-fi","fantasy","animation","family","documentary"];
const SEARCH_LANGUAGES = ["hindi","english","tamil","telugu","malayalam","kannada","bengali","marathi","punjabi"];

/** Levenshtein distance for typo tolerance */
function levenshtein(a, b) {
  a = a.toLowerCase(); b = b.toLowerCase();
  const m = a.length, n = b.length;
  if (m === 0) return n;
  if (n === 0) return m;
  const dp = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(0));
  for (let i = 0; i <= m; i++) dp[i][0] = i;
  for (let j = 0; j <= n; j++) dp[0][j] = j;
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      dp[i][j] = Math.min(
        dp[i - 1][j] + 1,
        dp[i][j - 1] + 1,
        dp[i - 1][j - 1] + cost
      );
    }
  }
  return dp[m][n];
}

/** Fuzzy word match: exact/substring gets top score, else distance-based */
function wordScore(query, target) {
  if (!target) return 0;
  const q = query.toLowerCase();
  const t = target.toLowerCase();
  if (t === q) return 100;
  if (t.startsWith(q)) return 85;
  if (t.includes(q)) return 70;
  const dist = levenshtein(q, t);
  const maxLen = Math.max(q.length, t.length);
  const similarity = 1 - dist / maxLen;
  if (q.length >= 3 && similarity >= 0.6) return Math.round(similarity * 60);
  return 0;
}

function bestFieldScore(query, value) {
  if (Array.isArray(value)) {
    return Math.max(0, ...value.map(v => wordScore(query, v)));
  }
  return wordScore(query, String(value ?? ""));
}

/**
 * Score a single movie against a single query token, checking every
 * relevant field (title, cast, director, genres, language, keywords, year).
 */
function scoreMovieForToken(movie, token) {
  const yearMatch = /^\d{4}$/.test(token) ? (String(movie.year) === token ? 120 : 0) : 0;
  const scores = [
    bestFieldScore(token, movie.title) * 1.5,
    bestFieldScore(token, movie.genres) * 1.1,
    bestFieldScore(token, movie.language) * 1.0,
    bestFieldScore(token, movie.cast) * 1.0,
    bestFieldScore(token, movie.director) * 0.9,
    bestFieldScore(token, movie.keywords) * 0.8,
    yearMatch
  ];
  return Math.max(...scores);
}

/**
 * searchMovies(query) -> array of movies sorted by relevance.
 * Supports multi-word queries like "comedy hindi" or "action 2024"
 * by requiring every token to find *some* match, then summing scores.
 */
function searchMovies(query) {
  if (!query || !query.trim()) return [];
  const tokens = query.trim().toLowerCase().split(/\s+/).filter(Boolean);

  const results = movies
    .map(movie => {
      const tokenScores = tokens.map(t => scoreMovieForToken(movie, t));
      const matchedTokens = tokenScores.filter(s => s > 0).length;
      const total = tokenScores.reduce((a, b) => a + b, 0);
      return { movie, total, matchedTokens };
    })
    // require at least half the tokens (rounded up) to match something
    .filter(r => r.matchedTokens >= Math.ceil(tokens.length / 2) && r.total > 0)
    .sort((a, b) => b.total - a.total)
    .map(r => r.movie);

  return results;
}

/**
 * getSuggestions(query) -> up to 6 movies for the live dropdown,
 * biased toward title matches.
 */
function getSuggestions(query) {
  if (!query || !query.trim()) return [];
  const q = query.trim().toLowerCase();
  return movies
    .map(movie => ({ movie, score: wordScore(q, movie.title) }))
    .filter(r => r.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 6)
    .map(r => r.movie);
}

/**
 * filterMovies(filters) -> filter a movie list by type/genre/language/year.
 * filters: { list, type, genre, language, year, sort }
 */
function filterMovies({ list, type, genre, language, year, sort } = {}) {
  let result = [...(list || movies)];

  if (type && type !== "all") {
    result = result.filter(m => m.type.toLowerCase() === type.toLowerCase());
  }
  if (genre && genre !== "all") {
    result = result.filter(m => m.genres.some(g => g.toLowerCase() === genre.toLowerCase()));
  }
  if (language && language !== "all") {
    result = result.filter(m => m.language.toLowerCase() === language.toLowerCase());
  }
  if (year && year !== "all") {
    result = result.filter(m => String(m.year) === String(year));
  }

  switch (sort) {
    case "rating":
      result.sort((a, b) => b.rating - a.rating);
      break;
    case "year":
      result.sort((a, b) => b.year - a.year);
      break;
    case "recent":
      result.sort((a, b) => movies.indexOf(b) - movies.indexOf(a));
      break;
    default:
      break; // relevance: leave as-is (already scored order when coming from search)
  }
  return result;
}

function debounce(fn, delay = 250) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
}


/* ============================================================
   AA Moviez — Custom Video Player
   Only initialized on watch.html. Uses native <video> under a
   fully custom control bar.
   ============================================================ */

function formatTime(seconds) {
  if (!isFinite(seconds) || seconds < 0) return "0:00";
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.floor(seconds % 60).toString().padStart(2, "0");
  return h > 0 ? `${h}:${String(m).padStart(2, "0")}:${s}` : `${m}:${s}`;
}

function savePlaybackPosition(movieId, video) {
  if (!video || !video.duration) return;
  saveProgress(movieId, video.currentTime, video.duration);
}

function loadPlaybackPosition(movieId) {
  const progress = getProgress(movieId);
  return progress ? progress.position : 0;
}

function initPlayer(movie) {
  const root = document.getElementById("player");
  if (!root || !movie) return;

  const video = root.querySelector("#video");
  const playBtn = root.querySelector("#playBtn");
  const progressBar = root.querySelector("#progressBar");
  const progressFill = root.querySelector("#progressFill");
  const timeLabel = root.querySelector("#timeLabel");
  const volumeSlider = root.querySelector("#volumeSlider");
  const muteBtn = root.querySelector("#muteBtn");
  const speedBtn = root.querySelector("#speedBtn");
  const qualityBtn = root.querySelector("#qualityBtn");
  const pipBtn = root.querySelector("#pipBtn");
  const fullscreenBtn = root.querySelector("#fullscreenBtn");
  const rewindBtn = root.querySelector("#rewindBtn");
  const forwardBtn = root.querySelector("#forwardBtn");
  const subtitlesBtn = root.querySelector("#subtitlesBtn");
  const controls = root.querySelector(".player-controls");
  const centerPlay = root.querySelector("#centerPlay");
  const speeds = [0.5, 0.75, 1, 1.25, 1.5, 2];
  let speedIndex = 2;

  video.src = movie.videoUrl;
  video.addEventListener("loadedmetadata", () => {
    const resume = loadPlaybackPosition(movie.id);
    if (resume > 2 && resume < video.duration - 5) {
      video.currentTime = resume;
    }
  });

  video.addEventListener("error", () => {
    root.querySelector(".player-error").hidden = false;
  });

  function togglePlay() {
    if (video.paused) { video.play(); } else { video.pause(); }
  }

  video.addEventListener("play", () => {
    playBtn.textContent = "⏸";
    centerPlay.hidden = true;
  });
  video.addEventListener("pause", () => {
    playBtn.textContent = "▶";
    centerPlay.hidden = false;
  });

  playBtn.addEventListener("click", togglePlay);
  centerPlay.addEventListener("click", togglePlay);
  video.addEventListener("click", togglePlay);

  video.addEventListener("timeupdate", () => {
    if (!video.duration) return;
    const pct = (video.currentTime / video.duration) * 100;
    progressFill.style.width = pct + "%";
    timeLabel.textContent = `${formatTime(video.currentTime)} / ${formatTime(video.duration)}`;
    savePlaybackPosition(movie.id, video);
  });

  progressBar.addEventListener("click", (e) => {
    const rect = progressBar.getBoundingClientRect();
    const pct = (e.clientX - rect.left) / rect.width;
    video.currentTime = pct * video.duration;
  });

  rewindBtn.addEventListener("click", () => { video.currentTime = Math.max(0, video.currentTime - 10); });
  forwardBtn.addEventListener("click", () => { video.currentTime = Math.min(video.duration, video.currentTime + 10); });

  volumeSlider.addEventListener("input", (e) => {
    video.volume = Number(e.target.value);
    video.muted = video.volume === 0;
    muteBtn.textContent = video.muted ? "🔇" : "🔊";
  });

  muteBtn.addEventListener("click", () => {
    video.muted = !video.muted;
    muteBtn.textContent = video.muted ? "🔇" : "🔊";
    if (!video.muted && video.volume === 0) {
      video.volume = 0.6;
      volumeSlider.value = 0.6;
    }
  });

  speedBtn.addEventListener("click", () => {
    speedIndex = (speedIndex + 1) % speeds.length;
    video.playbackRate = speeds[speedIndex];
    speedBtn.textContent = `${speeds[speedIndex]}x`;
  });

  const qualities = ["Auto", "1080p", "720p", "480p"];
  let qualityIndex = 0;
  qualityBtn.addEventListener("click", () => {
    qualityIndex = (qualityIndex + 1) % qualities.length;
    qualityBtn.textContent = qualities[qualityIndex];
    // Placeholder: swap-in real quality-variant URLs here if available.
  });

  pipBtn.addEventListener("click", async () => {
    try {
      if (document.pictureInPictureElement) {
        await document.exitPictureInPicture();
      } else if (document.pictureInPictureEnabled) {
        await video.requestPictureInPicture();
      }
    } catch (e) {
      console.warn("AA Moviez: PiP unavailable", e);
    }
  });

  fullscreenBtn.addEventListener("click", () => {
    if (!document.fullscreenElement) {
      root.requestFullscreen?.().catch(() => {});
    } else {
      document.exitFullscreen?.();
    }
  });

  let subtitlesOn = false;
  subtitlesBtn.addEventListener("click", () => {
    subtitlesOn = !subtitlesOn;
    subtitlesBtn.classList.toggle("active", subtitlesOn);
    const track = video.querySelector("track");
    if (track) track.track.mode = subtitlesOn ? "showing" : "hidden";
  });

  // Auto-hide controls
  let hideTimer;
  function showControls() {
    controls.classList.add("visible");
    clearTimeout(hideTimer);
    hideTimer = setTimeout(() => {
      if (!video.paused) controls.classList.remove("visible");
    }, 2800);
  }
  root.addEventListener("mousemove", showControls);
  root.addEventListener("touchstart", showControls);
  showControls();

  // Keyboard shortcuts
  document.addEventListener("keydown", (e) => {
    if (!document.body.contains(root)) return;
    if (e.key === " ") { e.preventDefault(); togglePlay(); }
    if (e.key === "ArrowRight") video.currentTime = Math.min(video.duration, video.currentTime + 10);
    if (e.key === "ArrowLeft") video.currentTime = Math.max(0, video.currentTime - 10);
    if (e.key === "f") fullscreenBtn.click();
    if (e.key === "m") muteBtn.click();
  });

  window.addEventListener("beforeunload", () => savePlaybackPosition(movie.id, video));
}


/* ============================================================
   AA Moviez — Shared App Utilities
   Card rendering, horizontal row interactions, sticky header,
   hero carousel, lazy loading, and small shared helpers.
   ============================================================ */

const PLACEHOLDER_POSTER = "https://picsum.photos/seed/aamoviez-fallback/400/600";
const PLACEHOLDER_BACKDROP = "https://picsum.photos/seed/aamoviez-fallback-bg/1600/900";

function qs(name) {
  return new URLSearchParams(window.location.search).get(name);
}

function escapeHtml(str = "") {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

/* ---------------- Sticky / transparent header ---------------- */

function initHeader() {
  const header = document.querySelector(".site-header");
  if (!header) return;
  const onScroll = () => header.classList.toggle("scrolled", window.scrollY > 40);
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  const menuToggle = document.querySelector(".menu-toggle");
  const mobileNav = document.querySelector(".mobile-nav");
  if (menuToggle && mobileNav) {
    menuToggle.addEventListener("click", () => {
      mobileNav.classList.toggle("open");
      menuToggle.classList.toggle("open");
    });
  }
}

/* ---------------- Movie card ---------------- */

function movieCardHTML(movie) {
  const genre = movie.genres[0] || "";
  return `
    <a class="movie-card" href="${movie.page ? movie.page : `#movie/${encodeURIComponent(movie.id)}`}" data-id="${movie.id}">
      <div class="card-poster">
        <img data-src="${movie.poster}" alt="${escapeHtml(movie.title)} poster"
             src="${PLACEHOLDER_POSTER}" class="lazy-img" loading="lazy" />
        <div class="card-overlay">
          <button class="card-play" aria-label="Play ${escapeHtml(movie.title)}">▶</button>
          <div class="card-meta">
            <span class="card-title">${escapeHtml(movie.title)}</span>
            <span class="card-sub">${movie.year} · ${escapeHtml(genre)} · ★ ${movie.rating}</span>
          </div>
          <span class="card-more">More Info</span>
        </div>
      </div>
      <div class="card-info">
        <span class="card-title-static">${escapeHtml(movie.title)}</span>
        <span class="card-sub-static">${movie.year} · ${escapeHtml(genre)} · ★ ${movie.rating}</span>
      </div>
    </a>`;
}

function continueCardHTML(item) {
  const pct = item.progress?.duration ? Math.min(100, (item.progress.position / item.progress.duration) * 100) : 0;
  return `
    <a class="movie-card continue-card" href="#watch/${encodeURIComponent(item.id)}">
      <div class="card-poster">
        <img data-src="${item.backdrop}" alt="${escapeHtml(item.title)}" src="${PLACEHOLDER_BACKDROP}" class="lazy-img landscape" loading="lazy" />
        <div class="card-overlay">
          <button class="card-play">▶</button>
        </div>
        <div class="progress-track"><div class="progress-fill" style="width:${pct}%"></div></div>
      </div>
      <div class="card-info">
        <span class="card-title-static">${escapeHtml(item.title)}</span>
      </div>
    </a>`;
}

/* ---------------- Rows: scroll, drag, wheel, arrows ---------------- */

function renderRow(container, list, { continueMode = false } = {}) {
  if (!container) return;
  if (!list.length) {
    container.closest(".content-row")?.classList.add("empty-row");
    return;
  }
  container.innerHTML = list.map(m => continueMode ? continueCardHTML(m) : movieCardHTML(m)).join("");
  initLazyImages(container);
}

function initRowScrollers() {
  document.querySelectorAll(".row-track").forEach(track => {
    let isDown = false, startX = 0, scrollStart = 0;

    track.addEventListener("wheel", (e) => {
      if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
        track.scrollLeft += e.deltaY;
        e.preventDefault();
      }
    }, { passive: false });

    track.addEventListener("mousedown", (e) => {
      isDown = true;
      track.classList.add("dragging");
      startX = e.pageX;
      scrollStart = track.scrollLeft;
    });
    window.addEventListener("mouseup", () => { isDown = false; track.classList.remove("dragging"); });
    window.addEventListener("mousemove", (e) => {
      if (!isDown) return;
      e.preventDefault();
      track.scrollLeft = scrollStart - (e.pageX - startX);
    });

    const section = track.closest(".content-row");
    const prevBtn = section?.querySelector(".row-arrow.prev");
    const nextBtn = section?.querySelector(".row-arrow.next");
    const scrollAmount = () => track.clientWidth * 0.8;
    prevBtn?.addEventListener("click", () => track.scrollBy({ left: -scrollAmount(), behavior: "smooth" }));
    nextBtn?.addEventListener("click", () => track.scrollBy({ left: scrollAmount(), behavior: "smooth" }));
  });
}

/* ---------------- Lazy image loading ---------------- */

function initLazyImages(root = document) {
  const imgs = root.querySelectorAll("img.lazy-img[data-src]");
  if (!("IntersectionObserver" in window)) {
    imgs.forEach(img => { img.src = img.dataset.src; });
    return;
  }
  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target;
        img.src = img.dataset.src;
        img.addEventListener("error", () => {
          img.src = img.classList.contains("landscape") ? PLACEHOLDER_BACKDROP : PLACEHOLDER_POSTER;
        }, { once: true });
        img.removeAttribute("data-src");
        obs.unobserve(img);
      }
    });
  }, { rootMargin: "200px" });
  imgs.forEach(img => observer.observe(img));
}

/* ---------------- Hero carousel ---------------- */

function initHeroCarousel(movieList) {
  const root = document.querySelector(".hero-carousel");
  if (!root || !movieList.length) return;

  root.innerHTML = movieList.map((m, i) => `
    <div class="hero-slide ${i === 0 ? "active" : ""}" style="background-image:url('${m.backdrop}')">
      <div class="hero-gradient"></div>
      <div class="hero-content">
        <h1 class="hero-title">${escapeHtml(m.title)}</h1>
        <div class="hero-meta">${m.year} · ${escapeHtml(m.genres.join(", "))} · ${m.duration} · ★ ${m.rating}</div>
        <p class="hero-desc">${escapeHtml(m.description)}</p>
        <div class="hero-actions">
          <a class="btn btn-primary" href="#watch/${m.id}">▶ Watch Now</a>
          <a class="btn btn-secondary" href="#movie/${m.id}">More Info</a>
        </div>
      </div>
    </div>`).join("") + `
    <button class="hero-nav prev" aria-label="Previous">‹</button>
    <button class="hero-nav next" aria-label="Next">›</button>
    <div class="hero-dots">
      ${movieList.map((_, i) => `<button class="hero-dot ${i === 0 ? "active" : ""}" data-index="${i}"></button>`).join("")}
    </div>`;

  const slides = root.querySelectorAll(".hero-slide");
  const dots = root.querySelectorAll(".hero-dot");
  let index = 0;
  let timer;

  function goTo(i) {
    slides[index].classList.remove("active");
    dots[index].classList.remove("active");
    index = (i + slides.length) % slides.length;
    slides[index].classList.add("active");
    dots[index].classList.add("active");
  }

  function next() { goTo(index + 1); }
  function prev() { goTo(index - 1); }
  function startAuto() { timer = setInterval(next, 6000); }
  function stopAuto() { clearInterval(timer); }

  root.querySelector(".hero-nav.next").addEventListener("click", () => { next(); stopAuto(); startAuto(); });
  root.querySelector(".hero-nav.prev").addEventListener("click", () => { prev(); stopAuto(); startAuto(); });
  dots.forEach(dot => dot.addEventListener("click", () => { goTo(Number(dot.dataset.index)); stopAuto(); startAuto(); }));
  root.addEventListener("mouseenter", stopAuto);
  root.addEventListener("mouseleave", startAuto);

  // touch swipe
  let touchStartX = 0;
  root.addEventListener("touchstart", (e) => { touchStartX = e.touches[0].clientX; }, { passive: true });
  root.addEventListener("touchend", (e) => {
    const diff = e.changedTouches[0].clientX - touchStartX;
    if (Math.abs(diff) > 40) { diff < 0 ? next() : prev(); stopAuto(); startAuto(); }
  }, { passive: true });

  startAuto();
}

/* ---------------- Watchlist toggle buttons (shared) ---------------- */

function initWatchlistButtons(root = document) {
  root.querySelectorAll("[data-watchlist-toggle]").forEach(btn => {
    const id = btn.dataset.watchlistToggle;
    const sync = () => {
      const inList = isInWatchlist(id);
      btn.classList.toggle("active", inList);
      btn.textContent = inList ? "✓ In Watchlist" : "＋ Add to Watchlist";
    };
    sync();
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      toggleWatchlist(id);
      sync();
    });
  });
  document.addEventListener("watchlist:changed", () => initWatchlistButtons(root));
}





/* ============================================================
   AA Moviez — SINGLE-PAGE ROUTER + VIEW RENDERING
   Exactly one HTML file, one CSS file and one JS file.
============================================================ */

const APP = document.getElementById("app");
const SEARCH_POPULAR = ["Spider-Man", "The Last Journey", "Hindi comedy", "Action", "Thriller", "2025"];

function routeHash() {
  const raw = (location.hash || "#home").slice(1);
  const [path, queryString = ""] = raw.split("?");
  const parts = path.split("/").filter(Boolean).map(decodeURIComponent);
  return { path: parts[0] || "home", id: parts[1] || null, params: new URLSearchParams(queryString) };
}

function navigate(hash) {
  if (location.hash === hash) renderRoute();
  else location.hash = hash;
}

function headerHTML(active = "home") {
  const activeClass = key => active === key ? "active" : "";
  return `
    <header class="site-header scrolled">
      <div class="header-inner">
        <a href="#home" class="logo" aria-label="AA Moviez Home"><span class="logo-mark">AA</span> Moviez</a>
        <nav class="main-nav">
          <a href="#home" class="${activeClass("home")}">Home</a>
          <a href="#explore" class="${activeClass("explore")}">Explore</a>
          <a href="#search?type=Movie" class="${activeClass("movies")}">Movies</a>
          <a href="#search?type=Show" class="${activeClass("shows")}">Shows</a>
          <a href="#watchlist" class="${activeClass("watchlist")}">Watchlist</a>
        </nav>
        <div class="header-actions">
          <a href="#explore" class="search-link">⌕ <span class="search-label">Search</span></a>
          <button class="menu-toggle" aria-label="Menu">☰</button>
        </div>
      </div>
    </header>
    <nav class="mobile-nav">
      <a href="#home">Home</a>
      <a href="#explore">Explore</a>
      <a href="#search">Search</a>
      <a href="#watchlist">Watchlist</a>
    </nav>`;
}

function footerHTML() {
  return `<footer class="site-footer"><span>© 2026 AA Moviez. Demo project — use only content you are authorized to distribute.</span><span><a href="#home">Home</a> · <a href="#explore">Explore</a> · <a href="#watchlist">Watchlist</a></span></footer>`;
}

function pageShell(content, active="home", extraClass="") {
  APP.innerHTML = `${headerHTML(active)}<main class="${extraClass}">${content}</main>${footerHTML()}`;
  initHeader();
}

function categoryMovies(category) {
  const byGenre = g => movies.filter(m => (m.genres || []).includes(g));
  const byLanguage = l => movies.filter(m => m.language === l);
  const builders = {
    "Trending Now": () => [...movies].sort((a,b) => b.rating - a.rating).slice(0, 14),
    "Popular Movies": () => movies.filter(m => m.type === "Movie").sort((a,b) => b.rating - a.rating).slice(0, 14),
    "Recently Added": () => [...movies].reverse().slice(0, 14),
    "Hindi Movies": () => byLanguage("Hindi"),
    "English Movies": () => byLanguage("English"),
    "Action": () => byGenre("Action"),
    "Comedy": () => byGenre("Comedy"),
    "Thriller": () => byGenre("Thriller"),
    "Family": () => byGenre("Family")
  };
  return builders[category] ? builders[category]() : [];
}

function renderHome() {
  pageShell(`
    <section class="hero-carousel"><div class="skeleton" style="position:absolute;inset:0;border-radius:0;"></div></section>
    <div class="rows-wrap">
      <section class="content-row" id="row-continue"><h2 class="section-title">Continue Watching</h2><button class="row-arrow prev" aria-label="Scroll left">‹</button><div class="row-track" id="track-continue"></div><button class="row-arrow next" aria-label="Scroll right">›</button></section>
      ${["Trending Now","Popular Movies","Recently Added","Hindi Movies","English Movies","Action","Comedy","Thriller","Family"].map(c => `<section class="content-row" data-category="${c}"><h2 class="section-title">${c}</h2><button class="row-arrow prev" aria-label="Scroll left">‹</button><div class="row-track" data-track></div><button class="row-arrow next" aria-label="Scroll right">›</button></section>`).join("")}
      <section class="content-row" id="row-recommended"><h2 class="section-title">Recommended For You</h2><button class="row-arrow prev" aria-label="Scroll left">‹</button><div class="row-track" id="track-recommended"></div><button class="row-arrow next" aria-label="Scroll right">›</button></section>
    </div>`, "home");

  const featured = featuredMovieIds.map(id => movies.find(m => m.id === id)).filter(Boolean);
  initHeroCarousel(featured);
  document.querySelectorAll(".content-row[data-category]").forEach(section => renderRow(section.querySelector("[data-track]"), categoryMovies(section.dataset.category)));
  renderRow(document.getElementById("track-continue"), getContinueWatchingMovies(), {continueMode:true});
  renderRow(document.getElementById("track-recommended"), getHomeRecommendations(14));
  initRowScrollers();
  document.title = "AA Moviez — Watch Movies & Shows";
}

function suggestionHTML(list) {
  if (!list.length) return "";
  return list.map(m => `<a class="suggestion-item" href="#movie/${encodeURIComponent(m.id)}"><img src="${m.poster}" alt="" loading="lazy" onerror="this.src='${PLACEHOLDER_POSTER}'"><span><span class="suggestion-title">${escapeHtml(m.title)}</span><span class="suggestion-sub">${m.year} · ${escapeHtml(m.type)} · ★ ${m.rating}</span></span></a>`).join("");
}

function bindSearchBox(input, dropdown) {
  if (!input) return;
  const update = debounce(() => {
    const suggestions = getSuggestions(input.value);
    if (dropdown) {
      dropdown.innerHTML = suggestionHTML(suggestions);
      dropdown.classList.toggle("open", Boolean(input.value.trim() && suggestions.length));
    }
  }, 160);
  input.addEventListener("input", update);
  input.addEventListener("keydown", e => {
    if (e.key === "Enter") {
      e.preventDefault();
      const q = input.value.trim();
      if (q) navigate(`#search?q=${encodeURIComponent(q)}`);
    }
    if (e.key === "Escape" && dropdown) dropdown.classList.remove("open");
  });
  document.addEventListener("click", e => {
    if (dropdown && !input.parentElement.contains(e.target)) dropdown.classList.remove("open");
  }, {once:true});
}

function renderExplore() {
  const genres = ["Action","Adventure","Comedy","Drama","Thriller","Horror","Romance","Sci-Fi","Fantasy","Animation","Family","Documentary"];
  const languages = ["Hindi","English","Tamil","Telugu","Malayalam","Kannada","Bengali","Marathi","Punjabi"];
  const years = [...new Set(movies.map(m => m.year))].sort((a,b) => b-a);
  pageShell(`
    <section class="page-head">
      <h1 class="page-title">Explore AA Moviez</h1>
      <div class="explore-search"><span class="icon">⌕</span><input id="exploreSearch" autocomplete="off" placeholder="Search movies, actors, genres, languages..." aria-label="Search movies"><div class="suggestions-dropdown" id="exploreSuggestions"></div></div>
    </section>
    <section class="browse-section"><h2 class="browse-heading">Browse by Genre</h2><div class="chip-grid">${genres.map(g => `<button class="chip" data-explore-query="${g}">${g}</button>`).join("")}</div></section>
    <section class="browse-section"><h2 class="browse-heading">Browse by Language</h2><div class="chip-grid">${languages.map(l => `<button class="chip" data-explore-query="${l}">${l}</button>`).join("")}</div></section>
    <section class="browse-section"><h2 class="browse-heading">Browse by Year</h2><div class="chip-grid">${years.map(y => `<button class="chip" data-explore-query="${y}">${y}</button>`).join("")}</div></section>
    <section class="browse-section"><h2 class="browse-heading">Popular Searches</h2><div class="popular-list">${SEARCH_POPULAR.map(t => `<a class="popular-term" href="#search?q=${encodeURIComponent(t)}">${t}</a>`).join("")}</div></section>
    <div class="rows-wrap"><section class="content-row"><h2 class="section-title">Popular on AA Moviez</h2><button class="row-arrow prev">‹</button><div class="row-track" id="explorePopular"></div><button class="row-arrow next">›</button></section></div>`, "explore");
  bindSearchBox(document.getElementById("exploreSearch"), document.getElementById("exploreSuggestions"));
  document.querySelectorAll("[data-explore-query]").forEach(btn => btn.addEventListener("click", () => navigate(`#search?q=${encodeURIComponent(btn.dataset.exploreQuery)}`)));
  renderRow(document.getElementById("explorePopular"), [...movies].sort((a,b)=>b.rating-a.rating).slice(0,14));
  initRowScrollers();
  document.title = "Explore — AA Moviez";
}

function renderSearch(params) {
  const query = params.get("q") || "";
  const type = params.get("type") || "all";
  let base = query ? searchMovies(query) : [...movies];
  const selectedType = type;
  pageShell(`
    <section class="page-head"><h1 class="page-title">${query ? `Search results for “${escapeHtml(query)}”` : "Browse Movies & Shows"}</h1><div class="explore-search"><span class="icon">⌕</span><input id="resultsSearch" value="${escapeHtml(query)}" autocomplete="off" placeholder="Search movies, actors, genres, languages..."><div class="suggestions-dropdown" id="resultsSuggestions"></div></div></section>
    <div class="filter-bar">
      <div class="type-tabs">
        ${[["all","All"],["Movie","Movies"],["Show","Shows"]].map(([v,l])=>`<button class="type-tab ${selectedType.toLowerCase()===v.toLowerCase()?"active":""}" data-type="${v}">${l}</button>`).join("")}
      </div>
      <select id="genreFilter"><option value="all">All Genres</option>${SEARCH_GENRES.map(g=>`<option value="${g}">${g[0].toUpperCase()+g.slice(1)}</option>`).join("")}</select>
      <select id="languageFilter"><option value="all">All Languages</option>${SEARCH_LANGUAGES.map(l=>`<option value="${l}">${l[0].toUpperCase()+l.slice(1)}</option>`).join("")}</select>
      <select id="yearFilter"><option value="all">All Years</option>${[...new Set(movies.map(m=>m.year))].sort((a,b)=>b-a).map(y=>`<option>${y}</option>`).join("")}</select>
      <select id="sortFilter"><option value="relevance">Relevance</option><option value="recent">Recently Added</option><option value="rating">Rating</option><option value="year">Release Year</option></select>
    </div>
    <div class="results-count" id="resultsCount"></div>
    <div class="results-grid" id="resultsGrid"></div>`, query ? "movies" : "explore");

  const input=document.getElementById("resultsSearch"), dropdown=document.getElementById("resultsSuggestions");
  bindSearchBox(input, dropdown);
  const state={list:base,type:selectedType,genre:"all",language:"all",year:"all",sort:"relevance"};
  const draw=()=>{ const result=filterMovies(state); document.getElementById("resultsCount").textContent=`${result.length} result${result.length===1?"":"s"}`; document.getElementById("resultsGrid").innerHTML=result.map(movieCardHTML).join("") || `<div class="empty-state" style="grid-column:1/-1"><h2>No movies found</h2><p>Try another title, actor, genre, language, or year.</p></div>`; initLazyImages(document.getElementById("resultsGrid")); };
  document.querySelectorAll(".type-tab").forEach(btn=>btn.addEventListener("click",()=>{state.type=btn.dataset.type; document.querySelectorAll(".type-tab").forEach(x=>x.classList.toggle("active",x===btn)); draw();}));
  ["genreFilter","languageFilter","yearFilter","sortFilter"].forEach(id=>document.getElementById(id).addEventListener("change",e=>{state[{genreFilter:"genre",languageFilter:"language",yearFilter:"year",sortFilter:"sort"}[id]]=e.target.value;draw();}));
  draw();
  document.title = query ? `Search: ${query} — AA Moviez` : "Movies & Shows — AA Moviez";
}

function renderMovie(id) {
  const movie=movies.find(m=>m.id===id);
  if(!movie){ pageShell(`<div class="empty-state" style="padding:150px 5vw"><h2>Movie not found</h2><p>The title you're looking for isn't available.</p><p style="margin-top:18px"><a class="btn btn-secondary" href="#home">Back to Home</a></p></div>`); return; }
  pageShell(`
    <div class="detail-backdrop" style="background-image:url('${movie.backdrop}')"></div>
    <div class="detail-body fade-in">
      <img class="detail-poster" src="${movie.poster}" alt="${escapeHtml(movie.title)} poster" onerror="this.src='${PLACEHOLDER_POSTER}'">
      <div class="detail-info"><h1 class="detail-title">${escapeHtml(movie.title)}</h1><div class="detail-meta"><span>${movie.year}</span><span class="rating">★ ${movie.rating}</span><span>${escapeHtml((movie.genres||[]).join(", "))}</span><span>${escapeHtml(movie.duration||"")}</span><span>${escapeHtml(movie.language||"")}</span></div><p class="detail-desc">${escapeHtml(movie.description||"")}</p><div class="detail-actions"><a class="btn btn-primary" href="#watch/${movie.id}">▶ Watch Now</a><button class="btn btn-secondary" data-watchlist-toggle="${movie.id}">＋ Add to Watchlist</button></div><div class="detail-facts">${movie.cast?.length?`<div><b>Cast:</b> ${escapeHtml(movie.cast.join(", "))}</div>`:""}<div><b>Director:</b> ${escapeHtml(movie.director||"Unknown")}</div><div><b>Type:</b> ${escapeHtml(movie.type)}</div></div></div>
    </div>
    <div class="recs-wrap"><section class="content-row"><h2 class="section-title">You May Also Like</h2><button class="row-arrow prev">‹</button><div class="row-track" id="movieRecs"></div><button class="row-arrow next">›</button></section></div>`, "home");
  initWatchlistButtons(APP);
  renderRow(document.getElementById("movieRecs"), getRecommendations(movie.id,14));
  initRowScrollers();
  document.title=`${movie.title} — AA Moviez`;
}

function renderWatch(id) {
  const movie=movies.find(m=>m.id===id);
  if(!movie){ pageShell(`<div class="empty-state" style="padding:100px 5vw"><h2>Movie not found</h2><p>The title you're looking for isn't available.</p><p style="margin-top:18px"><a class="btn btn-secondary" href="#home">Back to Home</a></p></div>`); return; }
  pageShell(`<div class="player-page-header"><a href="#movie/${movie.id}" class="back-link">‹ Back to ${escapeHtml(movie.title)}</a></div><div id="watchRoot"><div id="player"><video id="video" playsinline preload="metadata"><track kind="subtitles" srclang="en" label="English"></video><button class="center-play" id="centerPlay">▶</button><div class="player-error" hidden><h2>Playback error</h2><p>This video couldn't be played. Please try again later.</p></div><div class="player-controls visible"><div class="progress-bar" id="progressBar"><div class="progress-fill" id="progressFill"></div></div><div class="controls-row"><button id="playBtn">▶</button><button id="rewindBtn">⟲10</button><button id="forwardBtn">10⟳</button><div class="volume-group"><button id="muteBtn">🔊</button><input type="range" id="volumeSlider" min="0" max="1" step="0.05" value="0.6"></div><span class="time-label" id="timeLabel">0:00 / 0:00</span><span class="spacer"></span><button id="subtitlesBtn">CC</button><button id="speedBtn">1x</button><button id="qualityBtn">Auto</button><button id="pipBtn">⧉</button><button id="fullscreenBtn">⛶</button></div></div></div><div class="watch-info"><h1 class="watch-title">${escapeHtml(movie.title)}</h1><p class="watch-desc">${escapeHtml(movie.description||"")}</p>${movie.cast?.length?`<p class="watch-cast"><b>Cast:</b> ${escapeHtml(movie.cast.join(", "))}</p>`:""}</div></div><div class="recs-wrap"><section class="content-row"><h2 class="section-title">More Like This</h2><button class="row-arrow prev">‹</button><div class="row-track" id="watchRecs"></div><button class="row-arrow next">›</button></section></div>`, "home");
  initPlayer(movie);
  renderRow(document.getElementById("watchRecs"), getRecommendations(movie.id,12));
  initRowScrollers();
  document.title=`Watch ${movie.title} — AA Moviez`;
}

function renderWatchlist() {
  const list=getWatchlistMovies();
  const cont=getContinueWatchingMovies();
  pageShell(`<section class="page-head"><h1 class="page-title">My Watchlist</h1><p style="color:var(--text-muted);max-width:65ch">Saved locally in this browser. No account or login is required.</p></section><section class="browse-section"><h2 class="browse-heading">Saved Movies</h2></section><div class="results-grid" id="watchlistGrid">${list.length?list.map(movieCardHTML).join(""):`<div class="empty-state" style="grid-column:1/-1"><h2>Your watchlist is empty</h2><p>Add movies from their details page to save them here.</p><p style="margin-top:18px"><a class="btn btn-primary" href="#explore">Explore Movies</a></p></div>`}</div>${cont.length?`<div class="rows-wrap"><section class="content-row"><h2 class="section-title">Continue Watching</h2><button class="row-arrow prev">‹</button><div class="row-track" id="watchlistContinue"></div><button class="row-arrow next">›</button></section></div>`:""}`, "watchlist");
  initLazyImages(APP);
  if(cont.length){renderRow(document.getElementById("watchlistContinue"),cont,{continueMode:true});initRowScrollers();}
}

function renderRoute() {
  window.scrollTo(0,0);
  const r=routeHash();
  switch(r.path){
    case "explore": renderExplore(); break;
    case "search": renderSearch(r.params); break;
    case "movie": renderMovie(r.id); break;
    case "watch": renderWatch(r.id); break;
    case "watchlist": renderWatchlist(); break;
    case "home": default: renderHome(); break;
  }
}

window.addEventListener("hashchange", renderRoute);
document.addEventListener("DOMContentLoaded", renderRoute);
