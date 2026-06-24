/* ──────────────────────────────────────────────────────────────
   Storage adapter — one API, two backends.
   • LIVE  : Supabase (PostgREST over fetch — no SDK, no build step).
             Syncs submissions + votes + "who's on stage" across phones.
   • LOCAL : localStorage. Single device. Automatic fallback when
             Supabase isn't configured OR a live call fails (flaky wifi).
   Every page talks to window.DB and never cares which backend is live.
   ────────────────────────────────────────────────────────────── */
(function () {
  var C = window.KMITL_CONFIG || {};
  var ROOM = C.ROOM || "default";
  var LIVE = !!(C.SUPABASE_URL && C.SUPABASE_ANON_KEY);

  // ---------- LIVE: Supabase PostgREST ----------
  function sb(path, opts) {
    opts = opts || {};
    var url = C.SUPABASE_URL.replace(/\/$/, "") + "/rest/v1/" + path;
    return fetch(url, {
      method: opts.method || "GET",
      headers: {
        apikey: C.SUPABASE_ANON_KEY,
        Authorization: "Bearer " + C.SUPABASE_ANON_KEY,
        "Content-Type": "application/json",
        Prefer: opts.prefer || "return=representation"
      },
      body: opts.body ? JSON.stringify(opts.body) : undefined
    }).then(function (r) {
      if (!r.ok) return r.text().then(function (t) { throw new Error(r.status + " " + t); });
      return r.status === 204 ? null : r.json();
    });
  }

  var Live = {
    submitCard: function (card) {
      return sb("submissions", { method: "POST", body: Object.assign({ room: ROOM }, card) })
        .then(function (rows) { return rows && rows[0]; });
    },
    updateCard: function (id, card) {
      return sb("submissions?id=eq." + id, { method: "PATCH", body: card })
        .then(function (rows) { return rows && rows[0]; });
    },
    listSubmissions: function () {
      return sb("submissions?room=eq." + ROOM + "&order=created_at.asc");
    },
    deleteSubmission: function (id) {
      return sb("submissions?id=eq." + id, { method: "DELETE", prefer: "return=minimal" });
    },
    setActive: function (id) {
      return sb("room_state?on_conflict=room", {
        method: "POST",
        prefer: "resolution=merge-duplicates,return=minimal",
        body: { room: ROOM, active_submission_id: id }
      });
    },
    getActive: function () {
      return sb("room_state?room=eq." + ROOM + "&select=active_submission_id")
        .then(function (rows) { return rows && rows[0] ? rows[0].active_submission_id : null; });
    },
    castVote: function (submissionId, choice, reason) {
      return sb("votes", {
        method: "POST", prefer: "return=minimal",
        body: { room: ROOM, submission_id: submissionId, choice: choice, reason: reason || null }
      });
    },
    listVotes: function (submissionId) {
      return sb("votes?room=eq." + ROOM + "&submission_id=eq." + submissionId + "&order=created_at.desc");
    },
    resetVotes: function (submissionId) {
      return sb("votes?submission_id=eq." + submissionId, { method: "DELETE", prefer: "return=minimal" });
    }
  };

  // ---------- LOCAL: localStorage ----------
  var K = "kmitl:" + ROOM;
  function load(k, d) { try { return JSON.parse(localStorage.getItem(K + ":" + k)) || d; } catch (e) { return d; } }
  function save(k, v) { localStorage.setItem(K + ":" + k, JSON.stringify(v)); }
  function uid() { return "id_" + Date.now().toString(36) + Math.floor(Math.random() * 1e6).toString(36); }

  var Local = {
    submitCard: function (card) {
      var subs = load("subs", []);
      var row = Object.assign({ id: uid(), room: ROOM, created_at: new Date().toISOString() }, card);
      subs.push(row); save("subs", subs); return Promise.resolve(row);
    },
    updateCard: function (id, card) {
      var subs = load("subs", []), i = subs.map(function (s) { return s.id; }).indexOf(id);
      if (i >= 0) { subs[i] = Object.assign(subs[i], card); save("subs", subs); return Promise.resolve(subs[i]); }
      return Local.submitCard(card);
    },
    listSubmissions: function () { return Promise.resolve(load("subs", [])); },
    deleteSubmission: function (id) {
      save("subs", load("subs", []).filter(function (s) { return s.id !== id; }));
      return Promise.resolve();
    },
    setActive: function (id) { save("active", id); return Promise.resolve(); },
    getActive: function () { return Promise.resolve(load("active", null)); },
    castVote: function (submissionId, choice, reason) {
      var v = load("votes", []);
      v.push({ id: uid(), submission_id: submissionId, choice: choice, reason: reason || null, created_at: new Date().toISOString() });
      save("votes", v); return Promise.resolve();
    },
    listVotes: function (submissionId) {
      return Promise.resolve(load("votes", []).filter(function (x) { return x.submission_id === submissionId; })
        .sort(function (a, b) { return b.created_at < a.created_at ? -1 : 1; }));
    },
    resetVotes: function (submissionId) {
      save("votes", load("votes", []).filter(function (x) { return x.submission_id !== submissionId; }));
      return Promise.resolve();
    }
  };

  // ---------- Public API ----------
  // ponytail: NO silent cross-backend fallback. In a shared room a local-only
  // write is invisible to everyone else, so a "saved" vote that never reached
  // the board is worse than an honest error. LIVE mode retries once, then
  // rejects so the caller can tell the user to try again. LOCAL mode (empty
  // config) is the deliberate single-device / podium mode and never fails.
  var backend = LIVE ? Live : Local;
  function call(name, args, tries) {
    return backend[name].apply(backend, args).catch(function (e) {
      if (tries > 1) return new Promise(function (r) { setTimeout(r, 700); }).then(function () { return call(name, args, tries - 1); });
      throw e;
    });
  }
  function api(name) { return function () { return call(name, arguments, LIVE ? 2 : 1); }; }

  window.DB = {
    mode: LIVE ? "live" : "local",
    online: LIVE,
    room: ROOM,
    submitCard: api("submitCard"),
    updateCard: api("updateCard"),
    listSubmissions: api("listSubmissions"),
    deleteSubmission: api("deleteSubmission"),
    setActive: api("setActive"),
    getActive: api("getActive"),
    castVote: api("castVote"),
    listVotes: api("listVotes"),
    resetVotes: api("resetVotes")
  };
})();
