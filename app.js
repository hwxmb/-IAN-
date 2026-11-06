(() => {
  "use strict";

  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => Array.from(root.querySelectorAll(selector));
  const STORAGE_KEY = "dprian-archive-custom-cds-v1";
  const BUILTIN_ALBUMS = (window.DPRIAN_ALBUMS && window.DPRIAN_ALBUMS.albums) || [];
  BUILTIN_ALBUMS.forEach((album) => {
    album.artist = album.artist || "DPR IAN";
    album.custom = false;
  });
  const ACCENT_FALLBACKS = ["#8fb6c5", "#d94f45", "#6fa47b", "#c3a46a", "#9b87c8"];

  const app = $("#app");
  const ambient = $("#ambient");
  const homeBtn = $("#homeBtn");
  const headLabel = $("#headLabel");
  const backBtn = $("#backBtn");
  const addBtn = $("#addBtn");
  const browse = $("#browse");
  const browseInfo = $("#browseInfo");
  const browseEyebrow = $("#browseEyebrow");
  const browseTitle = $("#browseTitle");
  const browseNote = $("#browseNote");
  const browseEditBtn = $("#browseEditBtn");
  const loadBtn = $("#loadBtn");
  const prevBtnBrowse = $("#prevBtnBrowse");
  const nextBtnBrowse = $("#nextBtnBrowse");
  const carousel = $("#carousel");
  const albumTrack = $("#albumTrack");
  const activeIndexLabel = $("#activeIndexLabel");
  const totalCountLabel = $("#totalCountLabel");
  const carouselTicks = $("#carouselTicks");

  const playerView = $("#playerView");
  const detail = $("#detail");
  const stageStateLabel = $("#stageStateLabel");
  const stageCatalog = $("#stageCatalog");
  const deck = $("#deck");
  const discSlot = $("#discSlot");
  const cdDisc = $("#cdDisc");
  const deckDiscImg = $("#deckDiscImg");
  const miniSleeve = $("#miniSleeve");
  const miniCoverImg = $("#miniCoverImg");
  const consoleAlbum = $("#consoleAlbum");
  const readoutState = $("#readoutState");
  const readoutTime = $("#readoutTime");
  const readoutTrack = $("#readoutTrack");
  const readoutFormat = $("#readoutFormat");
  const prevBtn = $("#prevBtn");
  const playBtn = $("#playBtn");
  const nextBtn = $("#nextBtn");
  const muteBtn = $("#muteBtn");
  const progressRange = $("#progressRange");
  const elapsedTime = $("#elapsedTime");
  const totalTime = $("#totalTime");
  const stageTrack = $("#stageTrack");
  const stageArtist = $("#stageArtist");
  const stageTrackCount = $("#stageTrackCount");
  const scrollCue = $("#scrollCue");
  const detailEyebrow = $("#detailEyebrow");
  const detailTitle = $("#detailTitle");
  const detailNote = $("#detailNote");
  const editBtn = $("#editBtn");
  const removeBtn = $("#removeBtn");
  const trackCountLabel = $("#trackCountLabel");
  const tracklist = $("#tracklist");
  const emptyTracks = $("#emptyTracks");
  const detailContent = $("#detailContent");
  const privatePanel = $("#privatePanel");
  const lyricsTitle = $("#lyricsTitle");
  const lyricsScroll = $("#lyricsScroll");
  const lyricsList = $("#lyricsList");
  const lyricsLive = $("#lyricsLive");
  const lyricsSource = $("#lyricsSource");

  const flyingDisc = $("#flyingDisc");
  const flyingDiscImg = $("#flyingDiscImg");
  const toast = $("#toast");

  const addDialog = $("#addDialog");
  const addDialogTitle = $("#addDialogTitle");
  const addForm = $("#addForm");
  const closeAddBtn = $("#closeAddBtn");
  const cancelAddBtn = $("#cancelAddBtn");
  const cdTitle = $("#cdTitle");
  const cdArtist = $("#cdArtist");
  const cdYear = $("#cdYear");
  const cdType = $("#cdType");
  const cdNote = $("#cdNote");
  const frontFile = $("#frontFile");
  const frontPreview = $("#frontPreview");
  const frontStatus = $("#frontStatus");
  const frontUploadTile = $("#frontUploadTile");
  const discFile = $("#discFile");
  const discPreview = $("#discPreview");
  const discStatus = $("#discStatus");
  const discUploadTile = $("#discUploadTile");
  const clearFrontBtn = $("#clearFrontBtn");
  const clearDiscBtn = $("#clearDiscBtn");
  const formError = $("#formError");
  const saveCdBtn = $("#saveCdBtn");
  const draftTrackCount = $("#draftTrackCount");
  const draftTrackList = $("#draftTrackList");
  const addTrackBtn = $("#addTrackBtn");
  const trackDialog = $("#trackDialog");
  const trackForm = $("#trackForm");
  const trackDialogTitle = $("#trackDialogTitle");
  const closeTrackBtn = $("#closeTrackBtn");
  const cancelTrackBtn = $("#cancelTrackBtn");
  const trackTitle = $("#trackTitle");
  const trackAudioTile = $("#trackAudioTile");
  const trackAudioFile = $("#trackAudioFile");
  const trackAudioBadge = $("#trackAudioBadge");
  const trackAudioName = $("#trackAudioName");
  const trackAudioMeta = $("#trackAudioMeta");
  const trackLyrics = $("#trackLyrics");
  const trackLyricsFile = $("#trackLyricsFile");
  const trackLyricsHint = $("#trackLyricsHint");
  const clearTrackLyrics = $("#clearTrackLyrics");
  const trackFormError = $("#trackFormError");
  const saveTrackBtn = $("#saveTrackBtn");
  const confirmDialog = $("#confirmDialog");
  const cancelRemoveBtn = $("#cancelRemoveBtn");
  const confirmRemoveBtn = $("#confirmRemoveBtn");
  const audio = $("#audio");

  const MEDIA_DB_NAME = "dprian-archive-media-v1";
  const MEDIA_STORE_NAME = "audio";
  const audioObjectUrls = new Map();
  const inlineTrackUrls = new WeakMap();
  const preloadedDiscs = new Set();
  let mediaDbPromise = null;

  const state = {
    albums: [],
    customAlbums: [],
    activeIndex: 2,
    view: "browse",
    currentAlbum: null,
    currentTrackIndex: -1,
    isPlaying: false,
    isTransitioning: false,
    userScrollUntil: 0,
    activeLyricIndex: -1,
    currentLyrics: [],
    lyricsTimed: false,
    volume: 0.72,
    muted: false,
    suppressClickUntil: 0,
    drag: null,
    wheelLockedUntil: 0,
    pendingRemoveId: null,
    upload: { front: null, disc: null },
    draftTracks: [],
    editingAlbumId: null,
    trackEditingIndex: -1,
    trackDraft: null,
    trackLoadToken: 0,
    autoPlayPending: false,
    autoPlayArmed: false,
    isTrackLoading: false,
    isSavingAlbum: false,
    toastTimer: null,
    scheduled: [],
    raf: 0,
  };

  /* ---------------- helpers ---------------- */

  function h(tag, className = "", text = "") {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (text !== "") node.textContent = text;
    return node;
  }

  function pad2(value) {
    return String(value).padStart(2, "0");
  }

  function trackCountText(count) {
    return `${pad2(count || 0)} TRACK${Number(count) === 1 ? "" : "S"}`;
  }

  function formatLrcTime(seconds) {
    const value = Math.max(0, Number(seconds) || 0);
    const minutes = Math.floor(value / 60);
    const wholeSeconds = Math.floor(value % 60);
    const centiseconds = Math.floor((value - Math.floor(value)) * 100);
    return `[${pad2(minutes)}:${pad2(wholeSeconds)}.${pad2(centiseconds)}]`;
  }

  function lyricsToEditorText(lines, timed) {
    return (Array.isArray(lines) ? lines : [])
      .map((line) => {
        const english = String(line[1] || "").trim();
        const chinese = String(line[2] || "").trim();
        const body = [english, chinese].filter(Boolean).join(" ");
        if (!body) return "";
        return timed && Number.isFinite(line[0]) ? `${formatLrcTime(line[0])}${body}` : body;
      })
      .filter(Boolean)
      .join("\n");
  }

  function setArtworkUpload(kind, dataUrl) {    const isFront = kind === "front";
    const tile = isFront ? frontUploadTile : discUploadTile;
    const preview = isFront ? frontPreview : discPreview;
    const status = isFront ? frontStatus : discStatus;
    const clearButton = isFront ? clearFrontBtn : clearDiscBtn;
    state.upload[kind] = dataUrl || null;

    if (dataUrl) {
      preview.src = dataUrl;
      tile.classList.add("has-image");
      status.textContent = "更换";
    } else {
      preview.removeAttribute("src");
      tile.classList.remove("has-image");
      status.textContent = "选择图片";
    }
    const fileInput = tile.querySelector('input[type="file"]');
    if (fileInput) fileInput.value = "";
    clearButton.hidden = !dataUrl;
  }

  function formatTime(seconds, padded = false) {
    if (!Number.isFinite(seconds) || seconds < 0) seconds = 0;
    const whole = Math.floor(seconds);
    const mins = Math.floor(whole / 60);
    const secs = whole % 60;
    return `${padded ? pad2(mins) : mins}:${pad2(secs)}`;
  }

  function hexToRgb(hex) {
    const clean = String(hex || "").replace("#", "").trim();
    if (clean.length === 3) {
      return `${parseInt(clean[0] + clean[0], 16)}, ${parseInt(clean[1] + clean[1], 16)}, ${parseInt(clean[2] + clean[2], 16)}`;
    }
    if (clean.length === 6) {
      return `${parseInt(clean.slice(0, 2), 16)}, ${parseInt(clean.slice(2, 4), 16)}, ${parseInt(clean.slice(4, 6), 16)}`;
    }
    return "111, 164, 123";
  }

  function setAccent(hex) {
    const color = hex || ACCENT_FALLBACKS[0];
    document.documentElement.style.setProperty("--accent", color);
    document.documentElement.style.setProperty("--accent-rgb", hexToRgb(color));
  }

  function setArtworkImage(img, url, container) {
    if (url) {
      img.src = url;
      img.hidden = false;
      if (container) container.classList.remove("is-blank");
    } else {
      img.removeAttribute("src");
      img.hidden = true;
      if (container) container.classList.add("is-blank");
    }
  }

  function encodeAssetPath(path) {
    return String(path)
      .split("/")
      .map((part) => encodeURIComponent(part))
      .join("/");
  }

  function fillEyebrow(node, parts) {
    node.replaceChildren();
    parts.filter(Boolean).forEach((part, index) => {
      if (index > 0) {
        const dot = h("span", "dot");
        node.append(dot);
      }
      node.append(document.createTextNode(String(part)));
    });
  }

  function showToast(message, duration = 2600) {
    window.clearTimeout(state.toastTimer);
    toast.textContent = message;
    toast.classList.add("is-visible");
    state.toastTimer = window.setTimeout(() => {
      toast.classList.remove("is-visible");
    }, duration);
  }

  function schedule(fn, delay) {
    const id = window.setTimeout(fn, delay);
    state.scheduled.push(id);
    return id;
  }

  function clearScheduled() {
    state.scheduled.forEach((id) => window.clearTimeout(id));
    state.scheduled = [];
  }

  function safeStorageGet() {
    try {
      return window.localStorage.getItem(STORAGE_KEY);
    } catch (error) {
      return null;
    }
  }

  function safeStorageSet(value) {
    try {
      window.localStorage.setItem(STORAGE_KEY, value);
      return true;
    } catch (error) {
      return false;
    }
  }

  function openMediaDb() {
    if (mediaDbPromise) return mediaDbPromise;
    mediaDbPromise = new Promise((resolve, reject) => {
      if (!window.indexedDB) {
        reject(new Error("IndexedDB is unavailable"));
        return;
      }
      let request;
      try {
        request = window.indexedDB.open(MEDIA_DB_NAME, 1);
      } catch (error) {
        reject(error);
        return;
      }
      request.onupgradeneeded = () => {
        const db = request.result;
        if (!db.objectStoreNames.contains(MEDIA_STORE_NAME)) {
          db.createObjectStore(MEDIA_STORE_NAME);
        }
      };
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error || new Error("Could not open media database"));
      request.onblocked = () => reject(new Error("Media database is blocked"));
    });
    return mediaDbPromise;
  }

  async function putAudioBlob(key, blob) {
    const db = await openMediaDb();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(MEDIA_STORE_NAME, "readwrite");
      transaction.objectStore(MEDIA_STORE_NAME).put(blob, key);
      transaction.oncomplete = () => resolve();
      transaction.onerror = () => reject(transaction.error || new Error("Could not store audio"));
      transaction.onabort = () => reject(transaction.error || new Error("Audio storage aborted"));
    });
  }

  async function getAudioBlob(key) {
    const db = await openMediaDb();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(MEDIA_STORE_NAME, "readonly");
      const request = transaction.objectStore(MEDIA_STORE_NAME).get(key);
      request.onsuccess = () => resolve(request.result || null);
      request.onerror = () => reject(request.error || new Error("Could not read audio"));
    });
  }

  async function deleteAudioKeys(keys) {
    if (!keys || !keys.length) return;
    const db = await openMediaDb();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(MEDIA_STORE_NAME, "readwrite");
      const store = transaction.objectStore(MEDIA_STORE_NAME);
      keys.forEach((key) => store.delete(key));
      transaction.oncomplete = () => resolve();
      transaction.onerror = () => reject(transaction.error || new Error("Could not delete audio"));
      transaction.onabort = () => reject(transaction.error || new Error("Audio delete aborted"));
    });
  }

  function purgeAudioKeys(keys) {
    if (!keys || !keys.length) return;
    keys.forEach((key) => {
      const url = audioObjectUrls.get(key);
      if (url) {
        URL.revokeObjectURL(url);
        audioObjectUrls.delete(key);
      }
    });
    deleteAudioKeys(keys).catch(() => {
      /* noop — orphaned blobs are harmless */
    });
  }

  function purgeAlbumAudio(album) {
    if (!album || !album.tracks) return;
    purgeAudioKeys(album.tracks.map((track) => track.audioKey).filter(Boolean));
  }

  function dataUrlToBlob(dataUrl) {
    const comma = dataUrl.indexOf(",");
    if (comma < 0) throw new Error("Invalid audio data");
    const header = dataUrl.slice(0, comma);
    const mimeMatch = /^data:([^;]+)/i.exec(header);
    const mime = mimeMatch ? mimeMatch[1] : "audio/mp4";
    const binary = atob(dataUrl.slice(comma + 1));
    const bytes = new Uint8Array(binary.length);
    for (let index = 0; index < binary.length; index += 1) {
      bytes[index] = binary.charCodeAt(index);
    }
    return new Blob([bytes], { type: mime });
  }

  function base64ToBlob(base64, mime = "audio/mp4") {
    const binary = atob(String(base64 || "").replace(/\s+/g, ""));
    const bytes = new Uint8Array(binary.length);
    for (let index = 0; index < binary.length; index += 1) {
      bytes[index] = binary.charCodeAt(index);
    }
    return new Blob([bytes], { type: mime });
  }

  async function resolveTrackSource(track) {
    if (track.audioEmbed) {
      if (inlineTrackUrls.has(track)) return inlineTrackUrls.get(track);
      const node = document.getElementById(track.audioEmbed);
      if (!node || !node.textContent.trim()) throw new Error("Embedded audio is missing");
      const url = URL.createObjectURL(base64ToBlob(node.textContent, track.audioMime || "audio/mp4"));
      inlineTrackUrls.set(track, url);
      return url;
    }
    if (track.audio) {
      if (String(track.audio).startsWith("data:")) {
        if (inlineTrackUrls.has(track)) return inlineTrackUrls.get(track);
        const url = URL.createObjectURL(dataUrlToBlob(track.audio));
        inlineTrackUrls.set(track, url);
        return url;
      }
      return encodeAssetPath(track.audio);
    }
    if (!track.audioKey) throw new Error("This track has no audio file");
    if (audioObjectUrls.has(track.audioKey)) return audioObjectUrls.get(track.audioKey);
    const blob = await getAudioBlob(track.audioKey);
    if (!blob) throw new Error("The stored audio file could not be found");
    const url = URL.createObjectURL(blob);
    audioObjectUrls.set(track.audioKey, url);
    return url;
  }

  function splitBilingualLine(text) {
    const raw = String(text || "").trim();
    if (!raw) return ["", ""];
    const match = raw.match(/[\u3400-\u4dbf\u4e00-\u9fff]/);
    if (!match) return [raw, ""];
    let index = match.index;
    while (index > 0 && "（(【[「『“\"".includes(raw[index - 1])) index -= 1;
    const english = raw
      .slice(0, index)
      .trim()
      .replace(/[\s\-–—/:]+$/, "");
    const chinese = raw.slice(index).trim();
    return [english, chinese];
  }

  function parseLyricsText(text) {
    const raw = String(text || "").replace(/^\uFEFF/, "").replace(/\r\n?/g, "\n").trim();
    if (!raw) return { lines: [], timed: false };

    const stampPattern = /\[(\d{1,3}):(\d{1,2})(?:[.:](\d{1,3}))?\]/g;
    const metadataPattern = /^\[(ar|ti|al|by|offset|re|ve|kana|length):/i;
    const creditPattern = /作词|作曲|编曲|制作|混音|母带|lyrics|composer|arranger|producer|mixed|mastered/i;
    const timedRows = [];
    let sawTimestamp = false;

    raw.split("\n").forEach((inputLine) => {
      const line = inputLine.trim();
      if (!line) return;
      if (metadataPattern.test(line)) return;
      const times = [];
      stampPattern.lastIndex = 0;
      let match;
      while ((match = stampPattern.exec(line))) {
        const minutes = Number(match[1]);
        const seconds = Number(match[2]);
        const fraction = match[3] ? Number(`0.${match[3].padEnd(3, "0")}`) : 0;
        times.push(minutes * 60 + seconds + fraction);
      }
      if (!times.length) return;
      sawTimestamp = true;
      const body = line.replace(stampPattern, "").trim();
      if (!body || creditPattern.test(body.slice(0, 40))) return;
      const [english, chinese] = splitBilingualLine(body);
      if (!english && !chinese) return;
      times.forEach((time) => timedRows.push([Math.round(time * 1000) / 1000, english, chinese]));
    });

    if (sawTimestamp && timedRows.length) {
      const groups = new Map();
      timedRows.forEach((row) => {
        const key = String(row[0]);
        if (!groups.has(key)) groups.set(key, []);
        groups.get(key).push(row);
      });
      const merged = [];
      Array.from(groups.keys())
        .map(Number)
        .sort((a, b) => a - b)
        .forEach((time) => {
          const group = groups.get(String(time));
          const englishRows = group.filter((row) => row[1]);
          const chineseRows = group.filter((row) => !row[1] && row[2]);
          if (englishRows.length) {
            const translated = chineseRows.map((row) => row[2]).join(" / ");
            if (translated) {
              englishRows[0][2] = englishRows[0][2]
                ? `${englishRows[0][2]} / ${translated}`
                : translated;
            }
            merged.push(...englishRows);
          } else if (chineseRows.length) {
            merged.push([time, "", chineseRows.map((row) => row[2]).join(" / ")]);
          }
        });
      const seen = new Set();
      const lines = merged.filter((row) => {
        const key = `${row[0]}|${row[1]}|${row[2]}`;
        if (seen.has(key)) return false;
        seen.add(key);
        return true;
      });
      if (lines.length) return { lines, timed: true };
    }

    const lines = [];
    raw.split("\n").forEach((inputLine) => {
      const line = inputLine.trim();
      if (!line || metadataPattern.test(line)) return;
      const [english, chinese] = splitBilingualLine(line);
      if (english) {
        lines.push([null, english, chinese]);
      } else if (chinese) {
        const previous = lines[lines.length - 1];
        if (previous && !previous[2]) previous[2] = chinese;
        else lines.push([null, "", chinese]);
      }
    });
    return { lines, timed: false };
  }

  function normalizeStoredLyric(line) {
    if (!Array.isArray(line) || line.length < 2) return null;
    const time = Number.isFinite(line[0]) ? Number(line[0]) : null;
    const english = String(line[1] || "").trim();
    const chinese = String(line[2] || "").trim();
    if (!english && !chinese) return null;
    return [time, english, chinese];
  }

  function normalizeCustomTrack(raw) {
    if (!raw || typeof raw !== "object" || !raw.title) return null;
    const lyrics = Array.isArray(raw.lyrics)
      ? raw.lyrics.map(normalizeStoredLyric).filter(Boolean)
      : [];
    return {
      title: String(raw.title).slice(0, 100),
      fileName: String(raw.fileName || "").slice(0, 180),
      duration: Number(raw.duration) || 0,
      format: String(raw.format || "MP3").toUpperCase().slice(0, 8),
      audioKey: String(raw.audioKey || ""),
      lyrics,
      lyricsTimed: lyrics.some((line) => Number.isFinite(line[0])),
    };
  }

  function normalizeCustomAlbum(raw) {
    if (!raw || typeof raw !== "object" || !raw.title) return null;
    const front = typeof raw.front === "string" && raw.front.startsWith("data:image") ? raw.front : "";
    const disc = typeof raw.disc === "string" && raw.disc.startsWith("data:image") ? raw.disc : "";
    const tracks = Array.isArray(raw.tracks)
      ? raw.tracks.map(normalizeCustomTrack).filter(Boolean)
      : [];
    return {
      id: String(raw.id || `custom-${Date.now()}-${Math.random().toString(16).slice(2)}`),
      custom: true,
      title: String(raw.title).slice(0, 80),
      shortTitle: String(raw.shortTitle || raw.title).slice(0, 80),
      artist: String(raw.artist || "DPR IAN").slice(0, 60),
      year: String(raw.year || new Date().getFullYear()).slice(0, 8),
      type: String(raw.type || "EP").toUpperCase().slice(0, 12),
      accent: /^#[0-9a-f]{6}$/i.test(raw.accent || "") ? raw.accent : ACCENT_FALLBACKS[0],
      note: String(raw.note || "私人收藏 · 自选封面、曲目与歌词。").slice(0, 220),
      front,
      disc,
      trackCount: tracks.length,
      tracks,
    };
  }

  function loadCustomAlbums() {
    const raw = safeStorageGet();
    if (!raw) return [];
    try {
      const parsed = JSON.parse(raw);
      if (!Array.isArray(parsed)) return [];
      return parsed.map(normalizeCustomAlbum).filter(Boolean);
    } catch (error) {
      return [];
    }
  }

  function albumRuntime(album) {
    if (!album.tracks || !album.tracks.length) return 0;
    return album.tracks.reduce((total, track) => total + (Number(track.duration) || 0), 0);
  }

  /* ---------------- carousel ---------------- */

  function buildAlbumCard(album, index) {
    const card = h("article", "album-card");
    card.dataset.index = String(index);
    card.id = `album-card-${index}`;
    card.tabIndex = 0;
    card.setAttribute("role", "option");
    card.setAttribute("aria-selected", "false");
    card.setAttribute("aria-label", `${album.title}，${album.year}，${album.trackCount} 首曲目`);
    card.style.setProperty("--album-accent", album.accent || ACCENT_FALLBACKS[index % ACCENT_FALLBACKS.length]);
    card.style.setProperty("--album-accent-rgb", hexToRgb(album.accent));

    const flip = h("div", "card-flip");

    const front = h("div", "card-face card-front");
    const jewel = h("div", "jewel");
    const spine = h("span", "spine");
    spine.append(h("span", "", album.shortTitle || album.title));
    if (album.front) {
      const cover = h("img", "cover-img");
      cover.src = album.front;
      cover.alt = `${album.title} 封面`;
      cover.loading = index > 2 ? "lazy" : "eager";
      jewel.append(spine, cover);
    } else {
      const fallback = h("div", "cover-fallback");
      fallback.append(h("span", "", album.title), h("small", "", "NO COVER ART"));
      jewel.append(spine, fallback);
    }

    const flipFront = makeFlipButton("查看碟面");
    const playHint = h("span", "card-play-hint", "▶ PLAY");
    front.append(jewel, flipFront, playHint);

    const back = h("div", "card-face card-back");
    const disc = h("div", "card-disc");
    if (album.disc) {
      const discImg = h("img");
      discImg.src = album.disc;
      discImg.alt = `${album.title} 碟面`;
      discImg.loading = "lazy";
      disc.append(discImg);
    } else {
      disc.classList.add("is-blank");
    }
    const backMeta = h("div", "card-back-meta");
    backMeta.append(h("strong", "", album.title), h("span", "", `${album.year} / ${album.type}`));
    const flipBack = makeFlipButton("查看封面");
    back.append(disc, backMeta, flipBack);

    flip.append(front, back);
    card.append(flip);
    return card;
  }

  function makeFlipButton(label) {
    const button = h("button", "flip-btn");
    button.type = "button";
    button.setAttribute("aria-label", label);
    button.title = label;
    button.innerHTML =
      '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20 12a8 8 0 1 1-2.35-5.65"/><path d="M20 4v5h-5"/></svg>';
    return button;
  }

  function renderCarousel() {
    albumTrack.replaceChildren();
    state.albums.forEach((album, index) => {
      albumTrack.append(buildAlbumCard(album, index));
    });

    carouselTicks.replaceChildren();
    state.albums.forEach((album, index) => {
      const tick = h("button");
      tick.type = "button";
      tick.setAttribute("aria-label", `查看 ${album.title}`);
      tick.addEventListener("click", () => setActiveIndex(index, { userAction: true }));
      carouselTicks.append(tick);
    });

    layoutCarousel();
    updateCarouselActiveState();
  }

  function layoutCarousel() {
    const cards = $$(".album-card", albumTrack);
    if (!cards.length) return;
    const albumCards = $$(".album-card:not(.is-add)", albumTrack);
    const sample = albumCards[0] || cards[0];
    const cardWidth = sample ? sample.offsetWidth : 280;
    const unit = Math.min(450, Math.max(285, cardWidth * 1.08, window.innerWidth * 0.25));

    state.albums.forEach((album, index) => {
      const card = albumTrack.querySelector(`.album-card[data-index="${index}"]`);
      if (!card) return;
      const offset = index - state.activeIndex;
      const abs = Math.abs(offset);
      const hidden = abs > 2.35;
      const distance = abs <= 1 ? abs : 1 + (abs - 1) * 0.55;
      const x = Math.sign(offset) * distance * unit;
      const z = -Math.min(abs, 2) * 95;
      const ry = -offset * 24;
      const scale = Math.max(0.76, 1 - abs * 0.105);
      const opacity = hidden ? 0 : Math.max(0.48, 1 - Math.max(0, abs - 1) * 0.25);
      card.style.setProperty("--x", `${x}px`);
      card.style.setProperty("--z", `${z}px`);
      card.style.setProperty("--ry", `${ry}deg`);
      card.style.setProperty("--scale", String(scale));
      card.style.opacity = String(opacity);
      card.style.zIndex = String(30 - Math.round(abs * 4));
      card.dataset.hidden = hidden ? "true" : "false";
      card.style.pointerEvents = hidden ? "none" : "";
    });

    const addCard = $(".album-card.is-add", albumTrack);
    if (addCard) addCard.remove();
  }

  function updateCarouselActiveState() {
    state.albums.forEach((album, index) => {
      const card = albumTrack.querySelector(`.album-card[data-index="${index}"]`);
      if (!card) return;
      const active = index === state.activeIndex;
      card.classList.toggle("is-active", active);
      card.setAttribute("aria-selected", active ? "true" : "false");
    });
    carousel.setAttribute("aria-activedescendant", `album-card-${state.activeIndex}`);

    $$("button", carouselTicks).forEach((tick, index) => {
      tick.classList.toggle("is-active", index === state.activeIndex);
    });

    activeIndexLabel.textContent = pad2(state.activeIndex + 1);
    totalCountLabel.textContent = pad2(state.albums.length);
  }

  function preloadAlbumDisc(album) {
    const src = album && album.disc;
    if (!src || preloadedDiscs.has(src)) return;
    preloadedDiscs.add(src);
    const image = new Image();
    image.decoding = "async";
    image.src = src;
  }

  function updateBrowseInfo(album) {
    if (!album) return;
    preloadAlbumDisc(album);
    fillEyebrow(browseEyebrow, [
      album.year,
      album.type,
      album.trackCount ? trackCountText(album.trackCount) : "PRIVATE PRESSING",
    ]);
    browseTitle.textContent = album.title;
    browseNote.textContent =
      album.note || (album.custom ? "私人收藏 · 自选封面、曲目与歌词。" : "");
    browseEditBtn.hidden = !album.custom;
    setAccent(album.accent);
    document.title = `${album.title} — DPR IAN Archive`;

    browseInfo.classList.remove("is-swapping");
    void browseInfo.offsetWidth;
    browseInfo.classList.add("is-swapping");
  }

  function setActiveIndex(index, options = {}) {
    const next = Math.max(0, Math.min(state.albums.length - 1, Number(index) || 0));
    if (next === state.activeIndex && !options.force) {
      updateCarouselActiveState();
      return;
    }
    state.activeIndex = next;
    layoutCarousel();
    updateCarouselActiveState();
    updateBrowseInfo(state.albums[next]);

    if (options.focus) {
      const card = albumTrack.querySelector(`.album-card[data-index="${next}"]`);
      if (card) card.focus({ preventScroll: true });
    }
  }

  function stepCarousel(direction) {
    const next = state.activeIndex + direction;
    if (next < 0 || next >= state.albums.length) return;
    setActiveIndex(next, { userAction: true });
  }

  function flipCard(card) {
    if (!card || card.classList.contains("is-add")) return;
    card.classList.toggle("is-flipped");
    const flipped = card.classList.contains("is-flipped");
    $$(".flip-btn", card).forEach((button) => {
      const label = flipped ? "查看封面" : "查看碟面";
      button.setAttribute("aria-label", label);
      button.title = label;
    });
  }

  /* ---------------- view / player ---------------- */

  function openAlbum(index = state.activeIndex) {
    if (state.isTransitioning) return;
    const album = state.albums[index];
    if (!album) return;

    if (app.dataset.view === "player") return;

    state.isTransitioning = true;
    state.currentAlbum = album;
    state.activeIndex = index;
    state.currentTrackIndex = -1;
    state.isPlaying = false;
    state.autoPlayPending = Boolean(album.tracks && album.tracks.length);
    state.autoPlayArmed = false;
    state.trackLoadToken += 1;
    clearScheduled();
    backBtn.hidden = false;
    backBtn.disabled = true;
    headLabel.textContent = "NOW LOADING";
    app.dataset.view = "player";
    playerView.classList.remove("is-split", "is-playing");
    playerView.classList.add("is-idle-spin");
    deck.classList.remove("cd-loaded");
    hideFlyingDisc();
    void playerView.offsetWidth;

    renderDetail(album);
    setAccent(album.accent);
    document.title = `${album.title} — DPR IAN Archive`;
    playerView.scrollTop = 0;

    const startTrack = album.tracks && album.tracks.length ? 0 : -1;
    if (startTrack >= 0) {
      selectTrack(startTrack, { autoplay: false, initial: true });
    } else {
      prepareEmptyPlayer(album);
    }

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        launchFlyingDisc(index);
      });
    });

    schedule(() => {
      deck.classList.add("cd-loaded");
      hideFlyingDisc();
      playerView.classList.add("is-idle-spin");
      state.autoPlayArmed = true;
      if (album.tracks && album.tracks.length) {
        tryAutoPlayIfArmed();
      }
    }, 930);

    schedule(() => {
      playerView.classList.add("is-split");
      if (album.tracks && album.tracks.length) {
        setStageStatus(state.isPlaying ? "NOW PLAYING" : "READY");
      } else {
        setStageStatus("PRIVATE PRESSING");
      }
    }, 1270);

    schedule(() => {
      state.isTransitioning = false;
      backBtn.disabled = false;
    }, 2300);
  }

  function closePlayer() {
    if (app.dataset.view !== "player" || state.isTransitioning) return;
    clearScheduled();
    audio.pause();
    state.isPlaying = false;
    state.isTransitioning = true;
    state.autoPlayPending = false;
    state.autoPlayArmed = false;
    state.isTrackLoading = false;
    state.trackLoadToken += 1;
    playerView.classList.remove("is-split", "is-playing", "is-idle-spin");
    deck.classList.remove("cd-loaded");
    hideFlyingDisc();
    app.dataset.view = "browse";
    backBtn.hidden = true;
    backBtn.disabled = false;
    headLabel.textContent = "SELECT A DISC";
    setStageStatus("STANDBY");
    if (state.currentAlbum) {
      document.title = `${state.currentAlbum.title} — DPR IAN Archive`;
    }
    if ("mediaSession" in navigator) {
      try {
        navigator.mediaSession.metadata = null;
      } catch (error) {
        /* noop */
      }
    }
    window.setTimeout(() => {
      state.isTransitioning = false;
      playerView.classList.remove("is-idle-spin");
    }, 620);
  }

  function launchFlyingDisc(index) {
    const card = albumTrack.querySelector(`.album-card[data-index="${index}"]`);
    const slotRect = discSlot.getBoundingClientRect();
    const album = state.albums[index];
    if (!album || !card) return;

    const cardRect = card.getBoundingClientRect();
    const size = Math.max(130, Math.min(cardRect.width, cardRect.height) * 0.68);
    const startX = cardRect.left + cardRect.width / 2 - size / 2;
    const startY = cardRect.top + cardRect.height / 2 - size / 2;
    const targetSize = Math.max(90, slotRect.width);
    const dx = slotRect.left + slotRect.width / 2 - (startX + size / 2);
    const dy = slotRect.top + slotRect.height / 2 - (startY + size / 2);
    const scale = targetSize / size;

    if (album.disc) {
      flyingDiscImg.src = album.disc;
      flyingDiscImg.hidden = false;
      flyingDisc.classList.remove("is-blank");
    } else {
      flyingDiscImg.removeAttribute("src");
      flyingDiscImg.hidden = true;
      flyingDisc.classList.add("is-blank");
    }
    flyingDisc.style.width = `${size}px`;
    flyingDisc.style.height = `${size}px`;
    flyingDisc.style.left = `${startX}px`;
    flyingDisc.style.top = `${startY}px`;
    flyingDisc.classList.add("is-visible");

    const animation = flyingDisc.animate(
      [
        { transform: "translate(0, 0) rotate(0deg) scale(1)", opacity: 0.35 },
        { transform: `translate(${dx}px, ${dy}px) rotate(420deg) scale(${scale})`, opacity: 1 },
      ],
      {
        duration: 880,
        easing: "cubic-bezier(0.22, 0.74, 0.2, 1)",
        fill: "forwards",
      }
    );

    animation.finished
      .then(() => {
        if (app.dataset.view !== "player") return;
        flyingDisc.classList.remove("is-visible");
        deck.classList.add("cd-loaded");
        animation.cancel();
      })
      .catch(() => {
        /* noop */
      });
  }

  function hideFlyingDisc() {
    flyingDisc.classList.remove("is-visible");
    flyingDisc.getAnimations().forEach((animation) => animation.cancel());
  }

  function setStageStatus(text) {
    stageStateLabel.textContent = text;
    if (text === "NOW PLAYING" || text === "PAUSED" || text === "READY" || text === "PRIVATE PRESSING") {
      headLabel.textContent = text;
    }
  }

  function prepareEmptyPlayer(album) {
    state.currentTrackIndex = -1;
    state.currentLyrics = [];
    state.activeLyricIndex = -1;
    setArtworkImage(deckDiscImg, album.disc, cdDisc);
    setArtworkImage(miniCoverImg, album.front, miniSleeve);
    consoleAlbum.textContent = album.title;
    stageTrack.textContent = "私人收藏 · 暂无曲目";
    stageArtist.textContent = album.artist;
    stageTrackCount.textContent = "0 TRACKS";
    readoutState.textContent = "PRIVATE";
    readoutTime.textContent = "00:00";
    readoutTrack.textContent = "NO TRACK";
    readoutFormat.textContent = "—";
    elapsedTime.textContent = "0:00";
    totalTime.textContent = "0:00";
    progressRange.max = 0;
    progressRange.value = 0;
    progressRange.style.setProperty("--p", "0%");
    playBtn.disabled = true;
    prevBtn.disabled = true;
    nextBtn.disabled = true;
    progressRange.disabled = true;
    tracklist.replaceChildren();
    emptyTracks.hidden = false;
    lyricsTitle.textContent = "私人收藏";
    lyricsList.replaceChildren(buildLyricsPlaceholder("这张 CD 没有曲目", "封面与碟面已被收入私人唱片架。"));
    lyricsLive.textContent = "—";
    lyricsSource.textContent = "—";
    updateTrackRows();
  }

  function renderDetail(album) {
    const hasTracks = Boolean(album.tracks && album.tracks.length);
    fillEyebrow(detailEyebrow, [
      album.year,
      album.type,
      hasTracks ? trackCountText(album.trackCount) : "PRIVATE PRESSING",
    ]);
    detailTitle.textContent = album.title;
    detailNote.textContent = album.note || (album.custom ? "私人收藏 · 自选封面、曲目与歌词。" : "");
    trackCountLabel.textContent = hasTracks ? pad2(album.trackCount) : "—";
    stageCatalog.textContent = `${pad2(state.activeIndex + 1)} / ${String(album.artist || "DPR IAN").toUpperCase()}`;
    stageArtist.textContent = album.artist || "DPR IAN";
    stageTrackCount.textContent = hasTracks ? trackCountText(album.trackCount) : "PRIVATE";
    consoleAlbum.textContent = album.title;
    setArtworkImage(deckDiscImg, album.disc, cdDisc);
    setArtworkImage(miniCoverImg, album.front, miniSleeve);
    removeBtn.hidden = !album.custom;
    editBtn.hidden = !album.custom;
    detailContent.classList.toggle("is-private", Boolean(album.custom) && !hasTracks);
    privatePanel.hidden = !(Boolean(album.custom) && !hasTracks);

    buildTrackList(album);
    setStageStatus("NOW LOADING");
  }

  function buildTrackList(album) {
    tracklist.replaceChildren();
    emptyTracks.hidden = Boolean(album.tracks && album.tracks.length);
    if (!album.tracks || !album.tracks.length) {
      emptyTracks.hidden = false;
      return;
    }

    album.tracks.forEach((track, index) => {
      const row = h("button", "track-row");
      row.type = "button";
      row.dataset.trackIndex = String(index);
      row.setAttribute("aria-label", `播放 ${track.title}`);

      const num = h("span", "track-num");
      num.append(h("span", "num", pad2(index + 1)));
      const eq = h("span", "eq");
      eq.append(document.createElement("i"), document.createElement("i"), document.createElement("i"));
      num.append(eq);

      const name = h("span", "track-name", track.title);
      const duration = h("span", "track-duration", formatTime(track.duration || 0));
      row.append(num, name, duration);
      tracklist.append(row);
    });
  }

  function refreshOpenPlayerAfterEdit(album) {
    state.currentAlbum = album;
    state.currentTrackIndex = -1;
    state.isPlaying = false;
    state.autoPlayPending = false;
    state.autoPlayArmed = false;
    state.isTrackLoading = false;
    state.trackLoadToken += 1;
    audio.pause();
    playerView.classList.remove("is-playing", "is-idle-spin");
    playerView.scrollTop = 0;
    renderDetail(album);
    setAccent(album.accent);
    document.title = `${album.title} — DPR IAN Archive`;

    if (album.tracks && album.tracks.length) {
      selectTrack(0, { autoplay: false, force: true });
      setStageStatus("READY");
    } else {
      prepareEmptyPlayer(album);
      setStageStatus("PRIVATE PRESSING");
    }
  }

  /* ---------------- track + playback ---------------- */

  function trackFormatLabel(track, album) {
    if (track && track.format) return `${String(track.format).toUpperCase()} / LOCAL`;
    return album && album.custom ? "AUDIO / LOCAL" : "M4A / 44.1K";
  }

  async function selectTrack(index, options = {}) {
    const album = state.currentAlbum;
    if (!album || !album.tracks || !album.tracks[index]) return;
    const track = album.tracks[index];

    if (!options.initial && state.currentTrackIndex === index && !options.force) {
      togglePlayback();
      return;
    }

    audio.pause();
    state.currentTrackIndex = index;
    state.isTrackLoading = true;
    const token = ++state.trackLoadToken;
    audio.volume = state.muted ? 0 : state.volume;

    readoutState.textContent = "LOAD";
    readoutTime.textContent = "00:00";
    readoutTrack.textContent = track.title.toUpperCase();
    readoutFormat.textContent = trackFormatLabel(track, album);
    stageTrack.textContent = track.title;
    lyricsTitle.textContent = track.title;
    totalTime.textContent = formatTime(track.duration || 0);
    elapsedTime.textContent = "0:00";
    progressRange.max = track.duration || 0;
    progressRange.value = 0;
    progressRange.style.setProperty("--p", "0%");
    playBtn.disabled = true;
    prevBtn.disabled = false;
    nextBtn.disabled = false;
    progressRange.disabled = true;

    renderLyrics(track.lyrics || [], { custom: Boolean(album.custom), timed: Boolean(track.lyricsTimed) });
    updateTrackRows();
    updateMediaSession(album, track);
    if (!options.initial) scrollActiveTrackIntoView();
    updatePlaybackUI(0);

    let source = "";
    try {
      source = await resolveTrackSource(track);
    } catch (error) {
      if (token !== state.trackLoadToken) return;
      state.isTrackLoading = false;
      state.autoPlayPending = false;
      readoutState.textContent = "ERR";
      setStageStatus("PAUSED");
      showToast("曲目音频未能读取，请重新添加这张 CD");
      return;
    }

    if (token !== state.trackLoadToken || state.currentAlbum !== album) return;
    state.isTrackLoading = false;
    audio.src = source;
    audio.load();
    audio.volume = state.muted ? 0 : state.volume;
    try {
      audio.currentTime = 0;
    } catch (error) {
      /* noop */
    }
    playBtn.disabled = false;
    progressRange.disabled = false;
    readoutState.textContent = "READY";

    if (options.autoplay) {
      playAudio();
    } else if (options.initial) {
      tryAutoPlayIfArmed();
    }
  }

  function tryAutoPlayIfArmed() {
    if (!state.autoPlayPending || !state.autoPlayArmed || state.isTrackLoading) return;
    if (!state.currentAlbum || state.currentTrackIndex < 0 || !audio.src) return;
    state.autoPlayPending = false;
    playAudio();
  }

  function playAudio() {
    if (!state.currentAlbum || state.currentTrackIndex < 0) {
      if (state.currentAlbum && state.currentAlbum.tracks.length) {
        selectTrack(0, { autoplay: true });
      }
      return;
    }
    if (!audio.src || state.isTrackLoading) return;
    const promise = audio.play();
    if (promise && typeof promise.catch === "function") {
      promise.catch((error) => {
        if (error && (error.name === "AbortError" || error.name === "NotAllowedError")) {
          if (error.name === "NotAllowedError") {
            if (state.currentTrackIndex >= 0) {
              readoutState.textContent = "READY";
              setStageStatus("READY");
              playerView.classList.add("is-idle-spin");
            }
            showToast("点击播放键开始");
          }
          return;
        }
        if (error || !audio.error) {
          showToast("音频暂时无法播放，请检查歌曲文件是否仍在原文件夹");
        }
      });
    }
  }

  function togglePlayback() {
    if (!state.currentAlbum) return;
    if (!state.currentAlbum.tracks || !state.currentAlbum.tracks.length) return;
    if (state.currentTrackIndex < 0) {
      selectTrack(0, { autoplay: true });
      return;
    }
    if (audio.paused) {
      playAudio();
    } else {
      audio.pause();
    }
  }

  function nextTrack() {
    const album = state.currentAlbum;
    if (!album || !album.tracks || !album.tracks.length) return;
    const next = state.currentTrackIndex < 0 ? 0 : (state.currentTrackIndex + 1) % album.tracks.length;
    selectTrack(next, { autoplay: true });
  }

  function previousTrack() {
    const album = state.currentAlbum;
    if (!album || !album.tracks || !album.tracks.length) return;
    if (audio.currentTime > 3) {
      audio.currentTime = 0;
      updatePlaybackUI(0);
      return;
    }
    const previous =
      state.currentTrackIndex <= 0 ? album.tracks.length - 1 : state.currentTrackIndex - 1;
    selectTrack(previous, { autoplay: true });
  }

  function updateTrackRows() {
    const rows = $$(".track-row", tracklist);
    rows.forEach((row) => {
      const index = Number(row.dataset.trackIndex);
      const active = index === state.currentTrackIndex;
      row.classList.toggle("is-active", active);
      row.classList.toggle("is-playing", active && state.isPlaying);
      if (active) {
        row.setAttribute("aria-current", "true");
      } else {
        row.removeAttribute("aria-current");
      }
    });
  }

  function scrollActiveTrackIntoView() {
    const row = tracklist.querySelector(`.track-row[data-track-index="${state.currentTrackIndex}"]`);
    if (!row) return;
    const listRect = tracklist.getBoundingClientRect();
    const rowRect = row.getBoundingClientRect();
    if (rowRect.top < listRect.top + 4 || rowRect.bottom > listRect.bottom - 4) {
      row.scrollIntoView({ block: "nearest", behavior: "smooth" });
    }
  }

  function updatePlaybackUI(time) {
    const track =
      state.currentAlbum && state.currentAlbum.tracks
        ? state.currentAlbum.tracks[state.currentTrackIndex]
        : null;
    const fallbackDuration = track ? Number(track.duration) || 0 : 0;
    const duration = Number.isFinite(audio.duration) && audio.duration > 0 ? audio.duration : fallbackDuration;
    const current = Number.isFinite(time) ? time : audio.currentTime;

    elapsedTime.textContent = formatTime(current);
    totalTime.textContent = formatTime(duration);
    readoutTime.textContent = formatTime(current, true);
    if (!Number.isNaN(duration) && duration > 0) {
      progressRange.max = duration;
      progressRange.value = Math.min(current, duration);
      progressRange.style.setProperty("--p", `${Math.max(0, Math.min(100, (current / duration) * 100))}%`);
    }
    syncLyrics(current);
  }

  function startProgressLoop() {
    cancelAnimationFrame(state.raf);
    const tick = () => {
      if (!state.isPlaying) return;
      updatePlaybackUI(audio.currentTime);
      state.raf = requestAnimationFrame(tick);
    };
    state.raf = requestAnimationFrame(tick);
  }

  function setPlayingUI(playing) {
    state.isPlaying = playing;
    playerView.classList.toggle("is-playing", playing);
    playBtn.setAttribute("aria-label", playing ? "暂停" : "播放");
    if (app.dataset.view !== "player") {
      updateTrackRows();
      return;
    }
    if (playing) {
      playerView.classList.remove("is-idle-spin");
      readoutState.textContent = "PLAY";
      setStageStatus("NOW PLAYING");
      startProgressLoop();
    } else {
      cancelAnimationFrame(state.raf);
      readoutState.textContent = state.currentTrackIndex >= 0 ? "PAUSE" : "STANDBY";
      setStageStatus(
        state.currentAlbum && state.currentAlbum.custom && !(state.currentAlbum.tracks || []).length
          ? "PRIVATE PRESSING"
          : "PAUSED"
      );
      updatePlaybackUI(audio.currentTime);
    }
    updateTrackRows();
  }

  function updateMediaSession(album, track) {
    if (!("mediaSession" in navigator) || !window.MediaMetadata) return;
    try {
      const metadata = {
        title: track.title,
        artist: album.artist,
        album: album.title,
      };
      if (window.location.protocol !== "file:" && album.front) {
        metadata.artwork = [
          {
            src: new URL(album.front, window.location.href).href,
            sizes: "512x512",
            type: "image/jpeg",
          },
        ];
      }
      navigator.mediaSession.metadata = new MediaMetadata(metadata);
    } catch (error) {
      /* noop */
    }
  }

  /* ---------------- lyrics ---------------- */

  function buildLyricsPlaceholder(title, sub) {
    const wrap = h("div", "lyrics-placeholder");
    wrap.append(h("span", "placeholder-line"));
    if (title) {
      const p = h("p");
      p.append(document.createTextNode(title), document.createElement("br"), document.createTextNode(sub || ""));
      wrap.append(p);
    } else {
      wrap.append(h("p", "", "从左侧选择曲目\n歌词会随音乐滚动"));
    }
    return wrap;
  }

  function renderLyrics(lines, options = {}) {
    state.currentLyrics = Array.isArray(lines) ? lines : [];
    state.activeLyricIndex = -1;
    state.lyricsTimed = state.currentLyrics.some((line) => Number.isFinite(line[0]));
    lyricsList.replaceChildren();
    lyricsList.classList.toggle("is-unsynced", !state.lyricsTimed);

    if (!state.currentLyrics.length) {
      const album = state.currentAlbum;
      lyricsList.append(
        buildLyricsPlaceholder(
          album && album.custom ? "这首歌还没有歌词" : "暂无歌词",
          album && album.custom
            ? "可以重新添加这张 CD，为曲目补上 LRC 或纯文本歌词。"
            : "这首歌还没有附上歌词。"
        )
      );
      lyricsLive.textContent = "—";
      if (lyricsSource) lyricsSource.textContent = "—";
      return;
    }

    state.currentLyrics.forEach((line, index) => {
      const time = Number.isFinite(line[0]) ? Number(line[0]) : null;
      const row = h("div", "lyric-line");
      row.dataset.index = String(index);
      if (time !== null) {
        row.dataset.time = String(time);
        row.setAttribute("role", "button");
        row.setAttribute("aria-label", `跳转到 ${formatTime(time)}`);
      }
      row.tabIndex = -1;

      const englishText = String(line[1] || "").trim();
      const chineseText = String(line[2] || "").trim();
      if (englishText) {
        const en = h("div", "lyric-en", englishText);
        if (englishText === "♪") row.classList.add("is-instrumental");
        row.append(en);
        if (chineseText) row.append(h("div", "lyric-zh", chineseText));
      } else if (chineseText) {
        row.append(h("div", "lyric-en lyric-only-zh", chineseText));
      } else {
        row.classList.add("is-instrumental");
        row.append(h("div", "lyric-en", "♪"));
      }

      if (!state.lyricsTimed) row.classList.add("is-unsynced-line");
      lyricsList.append(row);
    });

    if (state.lyricsTimed) {
      lyricsLive.textContent = `01 / ${pad2(state.currentLyrics.length)}`;
      syncLyrics(0, { force: true, scroll: false });
    } else {
      lyricsLive.textContent = "TEXT";
    }

    if (lyricsSource) {
      if (options.custom) {
        lyricsSource.textContent = state.lyricsTimed
          ? "自定义 LRC · 已同步"
          : "自定义歌词 · 未同步";
      } else {
        lyricsSource.textContent = "英文原词 / 中文译配经整理";
      }
    }
  }

  function lyricIndexAt(time) {
    if (!state.currentLyrics.length || !state.lyricsTimed) return -1;
    let found = -1;
    for (let index = 0; index < state.currentLyrics.length; index += 1) {
      const lineTime = state.currentLyrics[index][0];
      if (!Number.isFinite(lineTime)) continue;
      if (lineTime <= time + 0.12) {
        found = index;
      } else {
        break;
      }
    }
    return found;
  }

  function syncLyrics(time, options = {}) {
    if (!state.currentLyrics.length || !state.lyricsTimed) return;
    const index = lyricIndexAt(time);
    if (index === state.activeLyricIndex && !options.force) return;
    activateLyric(index, options);
  }

  function activateLyric(index, options = {}) {
    const lines = $$(".lyric-line", lyricsList);
    if (index < 0) {
      state.activeLyricIndex = -1;
      lines.forEach((line) => {
        line.classList.remove("is-active", "is-past");
        line.removeAttribute("aria-current");
      });
      lyricsLive.textContent = `— / ${pad2(state.currentLyrics.length)}`;
      return;
    }
    state.activeLyricIndex = index;
    lines.forEach((line, lineIndex) => {
      line.classList.toggle("is-active", lineIndex === index);
      line.classList.toggle("is-past", lineIndex < index);
      if (lineIndex === index) {
        line.setAttribute("aria-current", "true");
      } else {
        line.removeAttribute("aria-current");
      }
    });
    lyricsLive.textContent = `${pad2(index + 1)} / ${pad2(state.currentLyrics.length)}`;

    if (options.scroll !== false && Date.now() > state.userScrollUntil) {
      const active = lines[index];
      if (active) {
        const top = active.offsetTop - lyricsScroll.clientHeight * 0.42;
        lyricsScroll.scrollTo({ top: Math.max(0, top), behavior: "smooth" });
      }
    }
  }

  /* ---------------- custom track drafts ---------------- */

  function updateButtonLabel(button, label) {
    const span = button.querySelector("span");
    if (span) span.textContent = label;
  }

  function titleFromFileName(fileName) {
    return String(fileName || "")
      .replace(/\.[^.]+$/, "")
      .replace(/[_]+/g, " ")
      .trim()
      .slice(0, 80);
  }

  function formatFromFileName(fileName) {
    const extension = String(fileName || "").split(".").pop().toLowerCase();
    if (extension === "m4a") return "M4A";
    if (extension === "mp3") return "MP3";
    return "AUDIO";
  }

  function readAudioDuration(file) {
    return new Promise((resolve, reject) => {
      const probe = document.createElement("audio");
      const url = URL.createObjectURL(file);
      let settled = false;
      const timer = window.setTimeout(() => finish(reject, new Error("Audio metadata timed out")), 12000);

      function finish(callback, value) {
        if (settled) return;
        settled = true;
        window.clearTimeout(timer);
        probe.removeAttribute("src");
        probe.load();
        URL.revokeObjectURL(url);
        callback(value);
      }

      probe.preload = "metadata";
      probe.addEventListener(
        "loadedmetadata",
        () => {
          if (Number.isFinite(probe.duration) && probe.duration > 0) {
            finish(resolve, probe.duration);
            return;
          }
          try {
            probe.currentTime = 1e101;
          } catch (error) {
            finish(reject, new Error("Audio duration is unavailable"));
          }
        },
        { once: true }
      );
      probe.addEventListener(
        "durationchange",
        () => {
          if (Number.isFinite(probe.duration) && probe.duration > 0) {
            finish(resolve, probe.duration);
          }
        }
      );
      probe.addEventListener("error", () => finish(reject, new Error("Audio could not be decoded")));
      probe.src = url;
      probe.load();
    });
  }

  function renderDraftTracks() {
    draftTrackCount.textContent = pad2(state.draftTracks.length);
    draftTrackList.replaceChildren();

    if (!state.draftTracks.length) {
      const empty = h("div", "draft-track-empty");
      empty.append(
        h("p", "", "还没有添加曲目"),
        h("span", "", "可以只收藏封面，也可以加入 MP3 和歌词。")
      );
      draftTrackList.append(empty);
      return;
    }

    state.draftTracks.forEach((track, index) => {
      const row = h("div", "draft-track");
      const number = h("span", "draft-track-index", pad2(index + 1));
      const open = h("button", "draft-track-open");
      open.type = "button";
      open.setAttribute("aria-label", `编辑 ${track.title}`);
      const text = h("span", "draft-track-text");
      text.append(
        h("strong", "", track.title),
        h("small", "", `${track.format || "AUDIO"} · ${formatTime(track.duration || 0)}`)
      );
      open.append(text);
      open.addEventListener("click", () => openTrackDialog(index));

      const badge = h(
        "span",
        "draft-lyrics-badge",
        track.lyrics && track.lyrics.length ? (track.lyricsTimed ? "LRC" : "TXT") : "NO LYRICS"
      );
      const remove = h("button", "draft-track-remove");
      remove.type = "button";
      remove.setAttribute("aria-label", `删除 ${track.title}`);
      remove.innerHTML =
        '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m7 7 10 10M17 7 7 17"/></svg>';
      remove.addEventListener("click", (event) => {
        event.stopPropagation();
        state.draftTracks.splice(index, 1);
        renderDraftTracks();
      });

      row.append(number, open, badge, remove);
      draftTrackList.append(row);
    });
  }

  function openTrackDialog(index = -1) {
    if (state.isSavingAlbum) return;
    state.trackEditingIndex = index;
    state.trackDraft = null;
    trackForm.reset();
    trackAudioFile.value = "";
    trackLyricsFile.value = "";
    trackFormError.textContent = "";
    trackAudioTile.classList.remove("has-audio");
    trackAudioBadge.textContent = "MP3";
    trackAudioName.textContent = "选择音频文件";
    trackAudioMeta.textContent = "MP3 / M4A，最大 40MB";
    trackLyricsHint.textContent = "带时间轴会自动同步；纯文本会静态显示。";
    trackLyrics.value = "";
    saveTrackBtn.disabled = false;
    updateButtonLabel(saveTrackBtn, "保存曲目");

    if (index >= 0 && state.draftTracks[index]) {
      const track = state.draftTracks[index];
      trackDialogTitle.textContent = "编辑歌曲";
      trackTitle.value = track.title;
      state.trackDraft = {
        file: track.file || null,
        fileName: track.fileName || "",
        duration: track.duration || 0,
        format: track.format || "AUDIO",
        audioKey: track.audioKey || "",
        originalAudioKey: track.audioKey || "",
      };
      const hasAudio = Boolean(track.file || track.audioKey);
      if (hasAudio) {
        trackAudioTile.classList.add("has-audio");
      }
      trackAudioName.textContent =
        track.fileName ||
        (track.audioKey ? `${track.title} · 已保存音频` : "选择音频文件");
      trackAudioMeta.textContent = `${track.format || "AUDIO"} · ${formatTime(track.duration || 0)}${track.audioKey ? " · 已保存" : ""}`;
      trackAudioBadge.textContent = track.format || "AUDIO";
      trackLyrics.value =
        track.lyricsRaw || lyricsToEditorText(track.lyrics || [], Boolean(track.lyricsTimed));
      if (track.lyrics && track.lyrics.length) {
        trackLyricsHint.textContent = track.lyricsTimed
          ? "已识别时间轴，播放时会自动滚动。"
          : "已识别纯文本歌词，将在歌词区静态显示。";
      }
    } else {
      trackDialogTitle.textContent = "添加歌曲";
    }

    if (typeof trackDialog.showModal === "function") trackDialog.showModal();
    else trackDialog.setAttribute("open", "");
    window.setTimeout(() => trackTitle.focus(), 80);
  }

  function closeTrackDialog(reset = true) {
    if (trackDialog.open) trackDialog.close();
    else trackDialog.removeAttribute("open");
    if (reset) {
      state.trackEditingIndex = -1;
      state.trackDraft = null;
      trackAudioFile.value = "";
      trackLyricsFile.value = "";
    }
  }

  async function handleTrackAudio(file) {
    if (!file) return;
    const baseName = file.name.toLowerCase();
    if (!/\.(mp3|m4a)$/.test(baseName) && !String(file.type || "").startsWith("audio/")) {
      trackFormError.textContent = "请选择 MP3 或 M4A 音频文件。";
      return;
    }
    if (!/\.(mp3|m4a)$/.test(baseName)) {
      trackFormError.textContent = "目前只支持 MP3 / M4A 格式。";
      return;
    }
    if (file.size > 40 * 1024 * 1024) {
      trackFormError.textContent = "音频文件过大，请选择 40MB 以内的文件。";
      return;
    }

    trackFormError.textContent = "";
    trackAudioName.textContent = "正在读取音频…";
    trackAudioMeta.textContent = file.name;
    try {
      const duration = await readAudioDuration(file);
      const format = formatFromFileName(file.name);
      const previousKey = state.trackDraft?.audioKey || "";
      state.trackDraft = {
        file,
        fileName: file.name,
        duration,
        format,
        audioKey: previousKey,
        originalAudioKey: previousKey,
      };
      trackAudioName.textContent = file.name;
      trackAudioMeta.textContent = `${format} · ${formatTime(duration)}`;
      trackAudioBadge.textContent = format;
      trackAudioTile.classList.add("has-audio");
      if (!trackTitle.value.trim()) trackTitle.value = titleFromFileName(file.name);
    } catch (error) {
      const format = formatFromFileName(file.name);
      const previousKey = state.trackDraft?.audioKey || "";
      state.trackDraft = {
        file,
        fileName: file.name,
        duration: 0,
        format,
        audioKey: previousKey,
        originalAudioKey: previousKey,
      };
      trackAudioName.textContent = file.name;
      trackAudioMeta.textContent = `${format} · 时长将在播放时识别`;
      trackAudioBadge.textContent = format;
      trackAudioTile.classList.add("has-audio");
      if (!trackTitle.value.trim()) trackTitle.value = titleFromFileName(file.name);
      trackFormError.textContent = "已选择音频，但无法预读时长；播放时会自动识别。";
    }
  }

  function saveTrackDraft(event) {
    event.preventDefault();
    const title = trackTitle.value.trim();
    if (!title) {
      trackFormError.textContent = "请填写歌曲名称。";
      trackTitle.focus();
      return;
    }
    if (!state.trackDraft || (!state.trackDraft.file && !state.trackDraft.audioKey)) {
      trackFormError.textContent = "请选择这首歌的 MP3 / M4A 音频。";
      trackAudioTile.scrollIntoView({ block: "center", behavior: "smooth" });
      return;
    }

    const rawLyrics = trackLyrics.value.trim();
    const parsed = rawLyrics ? parseLyricsText(rawLyrics) : { lines: [], timed: false };
    if (rawLyrics && !parsed.lines.length) {
      trackFormError.textContent = "没有识别到歌词内容，请检查文本或 LRC 时间轴。";
      return;
    }

    const draft = {
      title,
      fileName: state.trackDraft.fileName,
      file: state.trackDraft.file || null,
      duration: state.trackDraft.duration || 0,
      format: state.trackDraft.format || "MP3",
      audioKey: state.trackDraft.audioKey || "",
      originalAudioKey: state.trackDraft.audioKey || "",
      lyrics: parsed.lines,
      lyricsTimed: parsed.timed,
      lyricsRaw: rawLyrics,
    };

    if (state.trackEditingIndex >= 0 && state.draftTracks[state.trackEditingIndex]) {
      state.draftTracks[state.trackEditingIndex] = draft;
    } else {
      state.draftTracks.push(draft);
    }
    renderDraftTracks();
    closeTrackDialog();
  }

  /* ---------------- add / remove custom CDs ---------------- */

  function openAddDialog(album = null) {
    if (trackDialog.open) closeTrackDialog();
    state.editingAlbumId = album && album.custom ? album.id : null;
    state.upload.front = null;
    state.upload.disc = null;
    state.draftTracks = [];
    state.trackEditingIndex = -1;
    state.trackDraft = null;
    state.isSavingAlbum = false;
    addForm.reset();
    formError.textContent = "";
    saveCdBtn.disabled = false;

    if (album && album.custom) {
      addDialogTitle.textContent = "编辑唱片";
      updateButtonLabel(saveCdBtn, "保存修改");
      cdTitle.value = album.title || "";
      cdArtist.value = album.artist || "DPR IAN";
      cdYear.value = album.year || String(new Date().getFullYear());
      cdType.value = album.type || "EP";
      cdNote.value = album.note || "";
      let matchedAccent = false;
      addForm.querySelectorAll('input[name="accent"]').forEach((input) => {
        const selected = input.value === album.accent;
        input.checked = selected;
        if (selected) matchedAccent = true;
      });
      if (!matchedAccent) {
        const firstAccent = addForm.querySelector('input[name="accent"]');
        if (firstAccent) firstAccent.checked = true;
      }
      state.draftTracks = (album.tracks || []).map((track) => ({
        ...track,
        file: null,
        audioKey: track.audioKey || "",
        originalAudioKey: track.audioKey || "",
        lyricsRaw: lyricsToEditorText(track.lyrics || [], Boolean(track.lyricsTimed)),
      }));
      setArtworkUpload("front", album.front || null);
      setArtworkUpload("disc", album.disc || null);
    } else {
      addDialogTitle.textContent = "添加一张 CD";
      updateButtonLabel(saveCdBtn, "收入唱片架");
      cdArtist.value = "DPR IAN";
      cdYear.value = String(new Date().getFullYear());
      setArtworkUpload("front", null);
      setArtworkUpload("disc", null);
    }

    renderDraftTracks();
    if (typeof addDialog.showModal === "function") addDialog.showModal();
    else addDialog.setAttribute("open", "");
    window.setTimeout(() => cdTitle.focus(), 80);
  }

  function closeAddDialog() {
    if (trackDialog.open) closeTrackDialog();
    if (addDialog.open) addDialog.close();
    else addDialog.removeAttribute("open");
    state.draftTracks = [];
    state.trackEditingIndex = -1;
    state.trackDraft = null;
    state.editingAlbumId = null;
  }

  async function handleUpload(file, kind) {
    if (!file) return;
    const tile = kind === "front" ? frontUploadTile : discUploadTile;
    const status = kind === "front" ? frontStatus : discStatus;
    const clearButton = kind === "front" ? clearFrontBtn : clearDiscBtn;
    const previous = state.upload[kind];

    if (!file.type || !file.type.startsWith("image/")) {
      formError.textContent = "请选择 JPG、PNG 或 WebP 图片。";
      return;
    }
    if (file.size > 25 * 1024 * 1024) {
      formError.textContent = "图片文件过大，请选择 25MB 以内的图片。";
      return;
    }

    formError.textContent = "";
    status.textContent = "处理中…";
    tile.classList.remove("has-image");
    clearButton.hidden = true;

    try {
      const dataUrl = await processImage(file, kind === "front" ? "cover" : "disc");
      setArtworkUpload(kind, dataUrl);
    } catch (error) {
      setArtworkUpload(kind, previous);
      formError.textContent = "图片读取失败，请换一张试试。";
    }
  }

  async function decodeImage(file) {
    if ("createImageBitmap" in window) {
      try {
        return await createImageBitmap(file, { imageOrientation: "from-image" });
      } catch (error) {
        /* fall through to Image() */
      }
    }
    return new Promise((resolve, reject) => {
      const image = new Image();
      const url = URL.createObjectURL(file);
      image.onload = () => {
        URL.revokeObjectURL(url);
        resolve(image);
      };
      image.onerror = () => {
        URL.revokeObjectURL(url);
        reject(new Error("Unable to decode image"));
      };
      image.src = url;
    });
  }

  async function processImage(file, mode) {
    const image = await decodeImage(file);
    const size = 1100;
    const canvas = document.createElement("canvas");
    canvas.width = size;
    canvas.height = size;
    const context = canvas.getContext("2d");
    const width = image.width;
    const height = image.height;

    if (mode === "cover") {
      const scale = Math.max(size / width, size / height);
      const drawWidth = width * scale;
      const drawHeight = height * scale;
      context.drawImage(image, (size - drawWidth) / 2, (size - drawHeight) / 2, drawWidth, drawHeight);
      if (image.close) image.close();
      return canvas.toDataURL("image/jpeg", 0.87);
    }

    context.clearRect(0, 0, size, size);
    const scale = Math.min((size * 0.94) / width, (size * 0.94) / height);
    const drawWidth = width * scale;
    const drawHeight = height * scale;
    context.drawImage(image, (size - drawWidth) / 2, (size - drawHeight) / 2, drawWidth, drawHeight);
    context.globalCompositeOperation = "destination-in";
    context.beginPath();
    context.arc(size / 2, size / 2, size / 2 - 3, 0, Math.PI * 2);
    context.fill();
    context.globalCompositeOperation = "source-over";
    if (image.close) image.close();
    return canvas.toDataURL("image/webp", 0.9);
  }

  function persistCustomAlbums() {
    return safeStorageSet(JSON.stringify(state.customAlbums));
  }

  async function saveCustomAlbum(event) {
    event.preventDefault();
    if (state.isSavingAlbum) return;
    const title = cdTitle.value.trim();
    const artist = cdArtist.value.trim() || "DPR IAN";
    const year = cdYear.value.trim() || String(new Date().getFullYear());
    const type = cdType.value || "EP";
    const note = cdNote.value.trim();

    if (!title) {
      formError.textContent = "请先填写专辑名称。";
      cdTitle.focus();
      return;
    }

    const editingId = state.editingAlbumId;
    const editingAlbum = editingId
      ? state.customAlbums.find((album) => album.id === editingId)
      : null;
    if (editingId && !editingAlbum) {
      formError.textContent = "找不到这张唱片，请关闭后重新打开。";
      return;
    }

    const wasPlayer = app.dataset.view === "player";
    const currentIdAtOpen = state.currentAlbum ? state.currentAlbum.id : null;
    state.isSavingAlbum = true;
    saveCdBtn.disabled = true;
    updateButtonLabel(saveCdBtn, "保存中…");
    formError.textContent = "";
    const createdKeys = [];

    try {
      const tracks = [];
      for (const draft of state.draftTracks) {
        let audioKey = draft.audioKey || "";
        if (draft.file) {
          audioKey = `track-${Date.now()}-${Math.random().toString(16).slice(2)}`;
          await putAudioBlob(audioKey, draft.file);
          createdKeys.push(audioKey);
        }
        if (!audioKey) continue;
        tracks.push({
          title: draft.title,
          fileName: draft.fileName || "",
          duration: Number(draft.duration) || 0,
          format: draft.format || "MP3",
          audioKey,
          lyrics: Array.isArray(draft.lyrics) ? draft.lyrics : [],
          lyricsTimed: Boolean(draft.lyricsTimed),
        });
      }

      const checkedAccent = $('input[name="accent"]:checked', addForm);
      const previousCustomAlbums = state.customAlbums;
      const baseAlbum = {
        custom: true,
        title,
        shortTitle: title,
        artist,
        year,
        type,
        accent: checkedAccent ? checkedAccent.value : ACCENT_FALLBACKS[0],
        note: note || (tracks.length ? "私人收藏 · 自选封面、曲目与歌词。" : "私人收藏 · 等待曲目加入。"),
        front: state.upload.front || "",
        disc: state.upload.disc || "",
        trackCount: tracks.length,
        tracks,
      };

      let album;
      if (editingAlbum) {
        album = { ...editingAlbum, ...baseAlbum };
        state.customAlbums = previousCustomAlbums.map((item) =>
          item.id === editingAlbum.id ? album : item
        );
      } else {
        album = { id: `custom-${Date.now()}`, ...baseAlbum };
        state.customAlbums = [...previousCustomAlbums, album];
      }

      if (!persistCustomAlbums()) {
        state.customAlbums = previousCustomAlbums;
        throw new Error("Local metadata storage is full");
      }

      state.albums = [...BUILTIN_ALBUMS, ...state.customAlbums];
      const albumIndex = state.albums.findIndex((item) => item.id === album.id);
      const oldKeys = editingAlbum
        ? editingAlbum.tracks.map((track) => track.audioKey).filter(Boolean)
        : [];
      const usedKeys = new Set(tracks.map((track) => track.audioKey));
      const staleKeys = oldKeys.filter((key) => !usedKeys.has(key));

      closeAddDialog();
      renderCarousel();
      setActiveIndex(albumIndex, { force: true, userAction: true });

      if (wasPlayer && currentIdAtOpen === album.id) {
        refreshOpenPlayerAfterEdit(album);
        showToast(
          tracks.length ? `唱片修改已保存 · ${pad2(tracks.length)} 首曲目` : "唱片修改已保存"
        );
      } else {
        showToast(
          editingAlbum
            ? tracks.length
              ? `唱片修改已保存 · ${pad2(tracks.length)} 首曲目`
              : "唱片修改已保存"
            : tracks.length
              ? `已收入唱片架 · ${pad2(tracks.length)} 首曲目`
              : "已收入私人唱片架"
        );
      }
      purgeAudioKeys(staleKeys);
    } catch (error) {
      await deleteAudioKeys(createdKeys).catch(() => {
        /* noop */
      });
      formError.textContent =
        error && /metadata/i.test(error.message)
          ? "本机浏览器存储空间不足，请删除一些旧 CD 后重试。"
          : "保存失败，可能是浏览器阻止了本地音频存储，请换 Chrome / Edge 再试。";
    } finally {
      state.isSavingAlbum = false;
      saveCdBtn.disabled = false;
      updateButtonLabel(saveCdBtn, editingId ? "保存修改" : "收入唱片架");
    }
  }

  function askRemoveAlbum() {
    if (!state.currentAlbum || !state.currentAlbum.custom) return;
    state.pendingRemoveId = state.currentAlbum.id;
    const title = state.currentAlbum.title;
    const text = $("p", confirmDialog);
    if (text) text.textContent = `“${title}”的封面、碟面、曲目与记录会从本机唱片架移除，此操作不可撤销。`;
    if (typeof confirmDialog.showModal === "function") confirmDialog.showModal();
    else confirmDialog.setAttribute("open", "");
  }

  function closeConfirmDialog() {
    if (confirmDialog.open) confirmDialog.close();
    else confirmDialog.removeAttribute("open");
    state.pendingRemoveId = null;
  }

  function confirmRemoveAlbum() {
    const id = state.pendingRemoveId;
    if (!id) return;
    const removedAlbum = state.customAlbums.find((album) => album.id === id);
    const wasPlayingCurrent =
      state.currentAlbum && state.currentAlbum.id === id && app.dataset.view === "player";
    const removedIndex = state.activeIndex;
    state.customAlbums = state.customAlbums.filter((album) => album.id !== id);
    persistCustomAlbums();
    state.albums = [...BUILTIN_ALBUMS, ...state.customAlbums];
    closeConfirmDialog();

    if (wasPlayingCurrent) {
      clearScheduled();
      audio.pause();
      state.isPlaying = false;
      state.isTransitioning = false;
      state.autoPlayPending = false;
      state.autoPlayArmed = false;
      state.isTrackLoading = false;
      state.trackLoadToken += 1;
      app.dataset.view = "browse";
      playerView.classList.remove("is-split", "is-playing", "is-idle-spin");
      deck.classList.remove("cd-loaded");
      state.currentAlbum = null;
      state.currentTrackIndex = -1;
      backBtn.hidden = true;
      headLabel.textContent = "SELECT A DISC";
      if ("mediaSession" in navigator) {
        try {
          navigator.mediaSession.metadata = null;
        } catch (error) {
          /* noop */
        }
      }
    }

    if (removedAlbum) purgeAlbumAudio(removedAlbum);
    renderCarousel();
    const nextIndex = Math.max(0, Math.min(removedIndex, state.albums.length - 1));
    setActiveIndex(nextIndex, { force: true });
    showToast("已从唱片架移出");
  }

  /* ---------------- event wiring ---------------- */

  function bindEvents() {
    homeBtn.addEventListener("click", () => {
      if (app.dataset.view === "player") closePlayer();
      else setActiveIndex(Math.min(2, state.albums.length - 1), { userAction: true });
    });

    backBtn.addEventListener("click", closePlayer);
    if (addBtn) addBtn.addEventListener("click", () => openAddDialog());
    browseEditBtn.addEventListener("click", () => {
      const album = state.albums[state.activeIndex];
      if (album && album.custom) openAddDialog(album);
    });
    editBtn.addEventListener("click", () => {
      if (!state.currentAlbum || !state.currentAlbum.custom) return;
      audio.pause();
      openAddDialog(state.currentAlbum);
    });
    clearFrontBtn.addEventListener("click", () => setArtworkUpload("front", null));
    clearDiscBtn.addEventListener("click", () => setArtworkUpload("disc", null));
    loadBtn.addEventListener("click", () => openAlbum(state.activeIndex));
    scrollCue.addEventListener("click", () => {
      if (app.dataset.view !== "player") return;
      const top =
        playerView.scrollTop +
        detail.getBoundingClientRect().top -
        playerView.getBoundingClientRect().top -
        76;
      playerView.scrollTo({ top: Math.max(0, top), behavior: "smooth" });
    });
    prevBtnBrowse.addEventListener("click", () => stepCarousel(-1));
    nextBtnBrowse.addEventListener("click", () => stepCarousel(1));

    carousel.addEventListener("click", (event) => {
      const flipButton = event.target.closest(".flip-btn");
      if (flipButton) {
        event.stopPropagation();
        const card = flipButton.closest(".album-card");
        if (card) {
          const index = Number(card.dataset.index);
          if (Number.isFinite(index) && index !== state.activeIndex) {
            setActiveIndex(index, { userAction: true });
          }
          flipCard(card);
        }
        return;
      }

      if (performance.now() < state.suppressClickUntil) return;

      const addCard = event.target.closest(".album-card.is-add");
      if (addCard) {
        openAddDialog();
        return;
      }

      const card = event.target.closest(".album-card");
      if (!card) return;
      const index = Number(card.dataset.index);
      if (index !== state.activeIndex) {
        setActiveIndex(index, { userAction: true });
        return;
      }
      openAlbum(index);
    });

    carousel.addEventListener("keydown", (event) => {
      const card = event.target.closest(".album-card");
      if (!card) return;
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        if (card.classList.contains("is-add")) {
          openAddDialog();
          return;
        }
        const index = Number(card.dataset.index);
        if (event.key === " " && !card.classList.contains("is-add")) {
          flipCard(card);
        } else if (index === state.activeIndex) {
          openAlbum(index);
        } else {
          setActiveIndex(index, { userAction: true, focus: true });
        }
      }
    });

    carousel.addEventListener(
      "wheel",
      (event) => {
        if (state.isTransitioning) return;
        if (performance.now() < state.wheelLockedUntil) {
          event.preventDefault();
          return;
        }
        if (Math.abs(event.deltaY) < 6 && Math.abs(event.deltaX) < 6) return;
        event.preventDefault();
        const direction = (event.deltaY || event.deltaX) > 0 ? 1 : -1;
        stepCarousel(direction);
        state.wheelLockedUntil = performance.now() + 480;
      },
      { passive: false }
    );

    carousel.addEventListener("pointerdown", (event) => {
      if (event.target.closest(".flip-btn")) return;
      state.drag = {
        x: event.clientX,
        y: event.clientY,
        moved: false,
        pointerId: event.pointerId,
        captured: false,
      };
      carousel.classList.add("is-dragging");
    });

    carousel.addEventListener("pointermove", (event) => {
      if (!state.drag) return;
      const dx = event.clientX - state.drag.x;
      const dy = event.clientY - state.drag.y;
      if (!state.drag.moved && (Math.abs(dx) > 8 || Math.abs(dy) > 8)) {
        state.drag.moved = true;
        try {
          carousel.setPointerCapture(state.drag.pointerId);
          state.drag.captured = true;
        } catch (error) {
          /* noop */
        }
      }
    });

    const finishDrag = (event) => {
      if (!state.drag) return;
      const dx = event.clientX - state.drag.x;
      const moved = state.drag.moved;
      const pointerId = state.drag.pointerId;
      carousel.classList.remove("is-dragging");
      if (state.drag.captured) {
        try {
          carousel.releasePointerCapture(pointerId);
        } catch (error) {
          /* noop */
        }
      }
      state.drag = null;
      if (moved && Math.abs(dx) > 38) {
        state.suppressClickUntil = performance.now() + 260;
        stepCarousel(dx < 0 ? 1 : -1);
      }
    };
    carousel.addEventListener("pointerup", finishDrag);
    carousel.addEventListener("pointercancel", (event) => {
      if (state.drag && state.drag.captured) {
        try {
          carousel.releasePointerCapture(state.drag.pointerId);
        } catch (error) {
          /* noop */
        }
      }
      state.drag = null;
      carousel.classList.remove("is-dragging");
    });

    tracklist.addEventListener("click", (event) => {
      const row = event.target.closest(".track-row");
      if (!row) return;
      const index = Number(row.dataset.trackIndex);
      if (!Number.isFinite(index)) return;
      if (index === state.currentTrackIndex) {
        togglePlayback();
      } else {
        selectTrack(index, { autoplay: true });
      }
    });

    lyricsList.addEventListener("click", (event) => {
      const line = event.target.closest(".lyric-line");
      if (!line || !state.currentAlbum || state.currentTrackIndex < 0) return;
      const time = Number(line.dataset.time);
      if (!Number.isFinite(time) || !audio.src) return;
      try {
        audio.currentTime = time;
      } catch (error) {
        return;
      }
      updatePlaybackUI(time);
      if (audio.paused) playAudio();
    });

    ["wheel", "touchstart", "pointerdown"].forEach((type) => {
      lyricsScroll.addEventListener(
        type,
        () => {
          state.userScrollUntil = Date.now() + 2800;
        },
        { passive: true }
      );
    });

    playBtn.addEventListener("click", togglePlayback);
    prevBtn.addEventListener("click", previousTrack);
    nextBtn.addEventListener("click", nextTrack);
    muteBtn.addEventListener("click", () => {
      state.muted = !state.muted;
      audio.volume = state.muted ? 0 : state.volume;
      muteBtn.classList.toggle("is-muted", state.muted);
      muteBtn.setAttribute("aria-label", state.muted ? "取消静音" : "静音");
    });

    progressRange.addEventListener("input", () => {
      if (state.currentTrackIndex < 0) return;
      const value = Number(progressRange.value);
      if (!Number.isFinite(value)) return;
      try {
        audio.currentTime = value;
      } catch (error) {
        return;
      }
      updatePlaybackUI(value);
    });

    audio.addEventListener("play", () => {
      setPlayingUI(true);
    });
    audio.addEventListener("pause", () => {
      setPlayingUI(false);
    });
    audio.addEventListener("loadedmetadata", () => {
      if (Number.isFinite(audio.duration) && audio.duration > 0) {
        progressRange.max = audio.duration;
        totalTime.textContent = formatTime(audio.duration);
        const track =
          state.currentAlbum && state.currentAlbum.tracks
            ? state.currentAlbum.tracks[state.currentTrackIndex]
            : null;
        readoutFormat.textContent = trackFormatLabel(track, state.currentAlbum);
      }
      updatePlaybackUI(audio.currentTime);
    });
    audio.addEventListener("timeupdate", () => {
      if (!state.isPlaying) updatePlaybackUI(audio.currentTime);
    });
    audio.addEventListener("ended", nextTrack);
    audio.addEventListener("error", () => {
      if (!state.currentAlbum || state.currentTrackIndex < 0 || app.dataset.view !== "player") return;
      readoutState.textContent = "ERR";
      setStageStatus("PAUSED");
      showToast("音频未能加载，请确认歌曲文件仍在原文件夹。");
    });

    closeAddBtn.addEventListener("click", closeAddDialog);
    cancelAddBtn.addEventListener("click", closeAddDialog);
    addForm.addEventListener("submit", saveCustomAlbum);
    addDialog.addEventListener("click", (event) => {
      if (event.target === addDialog) closeAddDialog();
    });

    addTrackBtn.addEventListener("click", () => openTrackDialog(-1));
    closeTrackBtn.addEventListener("click", () => closeTrackDialog());
    cancelTrackBtn.addEventListener("click", () => closeTrackDialog());
    trackForm.addEventListener("submit", saveTrackDraft);
    trackDialog.addEventListener("click", (event) => {
      if (event.target === trackDialog) closeTrackDialog();
    });
    trackAudioFile.addEventListener("change", async () => {
      const file = trackAudioFile.files && trackAudioFile.files[0];
      if (file) await handleTrackAudio(file);
      trackAudioFile.value = "";
    });
    trackLyricsFile.addEventListener("change", async () => {
      const file = trackLyricsFile.files && trackLyricsFile.files[0];
      if (!file) return;
      if (!/\.(lrc|txt)$/i.test(file.name) || file.size > 2 * 1024 * 1024) {
        trackFormError.textContent = "请选择 2MB 以内的 .lrc 或 .txt 歌词文件。";
        trackLyricsFile.value = "";
        return;
      }
      try {
        trackLyrics.value = await file.text();
        trackLyricsHint.textContent = `已读取 ${file.name} · 保存曲目时自动解析`;
        trackFormError.textContent = "";
      } catch (error) {
        trackFormError.textContent = "歌词文件读取失败，请重试。";
      }
      trackLyricsFile.value = "";
    });
    clearTrackLyrics.addEventListener("click", () => {
      trackLyrics.value = "";
      trackLyricsHint.textContent = "带时间轴会自动同步；纯文本会静态显示。";
      trackLyrics.focus();
    });

    frontFile.addEventListener("change", () => handleUpload(frontFile.files[0], "front"));
    discFile.addEventListener("change", () => handleUpload(discFile.files[0], "disc"));

    [frontUploadTile, discUploadTile].forEach((tile, index) => {
      const input = index === 0 ? frontFile : discFile;
      const kind = index === 0 ? "front" : "disc";
      tile.addEventListener("dragover", (event) => {
        event.preventDefault();
        tile.classList.add("is-dragover");
      });
      tile.addEventListener("dragleave", () => tile.classList.remove("is-dragover"));
      tile.addEventListener("drop", (event) => {
        event.preventDefault();
        tile.classList.remove("is-dragover");
        const file = event.dataTransfer.files && event.dataTransfer.files[0];
        if (file) {
          try {
            input.files = event.dataTransfer.files;
          } catch (error) {
            /* noop */
          }
          handleUpload(file, kind);
        }
      });
    });

    cancelRemoveBtn.addEventListener("click", closeConfirmDialog);
    confirmRemoveBtn.addEventListener("click", confirmRemoveAlbum);
    confirmDialog.addEventListener("click", (event) => {
      if (event.target === confirmDialog) closeConfirmDialog();
    });
    removeBtn.addEventListener("click", askRemoveAlbum);

    let lastOrientation = window.matchMedia("(orientation: landscape)").matches
      ? "landscape"
      : "portrait";

    const refreshLayout = () => {
      window.cancelAnimationFrame(layoutCarousel._raf);
      layoutCarousel._raf = window.requestAnimationFrame(layoutCarousel);
    };

    window.addEventListener("resize", () => {
      const orientation = window.matchMedia("(orientation: landscape)").matches
        ? "landscape"
        : "portrait";
      if (orientation !== lastOrientation) {
        lastOrientation = orientation;
        if (app.dataset.view === "player") playerView.scrollTop = 0;
      }
      refreshLayout();
    });

    const relayoutAfterRotation = () => {
      if (app.dataset.view === "player") playerView.scrollTop = 0;
      window.setTimeout(refreshLayout, 180);
    };
    window.addEventListener("orientationchange", relayoutAfterRotation);
    if (window.visualViewport) {
      window.visualViewport.addEventListener("resize", refreshLayout);
    }

    document.addEventListener("keydown", (event) => {
      if (addDialog.open || confirmDialog.open) return;
      const interactive = event.target.closest("button, input, select, textarea, [contenteditable]");

      if (app.dataset.view === "browse") {
        if (event.key === "ArrowLeft" && !interactive) {
          event.preventDefault();
          stepCarousel(-1);
        } else if (event.key === "ArrowRight" && !interactive) {
          event.preventDefault();
          stepCarousel(1);
        } else if (event.key === "Enter" && !interactive) {
          event.preventDefault();
          openAlbum(state.activeIndex);
        }
        return;
      }

      if (app.dataset.view === "player") {
        if (event.key === "Escape") {
          event.preventDefault();
          closePlayer();
        } else if (event.key === " " && !interactive) {
          event.preventDefault();
          togglePlayback();
        } else if (event.key === "ArrowRight" && !interactive) {
          event.preventDefault();
          nextTrack();
        } else if (event.key === "ArrowLeft" && !interactive) {
          event.preventDefault();
          previousTrack();
        }
      }
    });
  }

  function initMediaSession() {
    if (!("mediaSession" in navigator)) return;
    try {
      navigator.mediaSession.setActionHandler("play", () => playAudio());
      navigator.mediaSession.setActionHandler("pause", () => audio.pause());
      navigator.mediaSession.setActionHandler("previoustrack", previousTrack);
      navigator.mediaSession.setActionHandler("nexttrack", nextTrack);
    } catch (error) {
      /* noop */
    }
  }

  function clearLegacyCustomData() {
    try {
      window.localStorage.removeItem(STORAGE_KEY);
    } catch (error) {
      /* noop */
    }
    try {
      indexedDB.deleteDatabase(MEDIA_DB_NAME);
    } catch (error) {
      /* noop */
    }
  }

  function init() {
    if (!BUILTIN_ALBUMS.length) {
      console.warn("DPRIAN album data was not loaded.");
      return;
    }
    clearLegacyCustomData();
    state.customAlbums = [];
    state.albums = [...BUILTIN_ALBUMS];
    state.activeIndex = Math.min(2, state.albums.length - 1);
    audio.volume = state.volume;

    renderCarousel();
    setActiveIndex(state.activeIndex, { force: true });
    bindEvents();
    initMediaSession();
    window.setTimeout(layoutCarousel, 120);
  }

  init();
})();
