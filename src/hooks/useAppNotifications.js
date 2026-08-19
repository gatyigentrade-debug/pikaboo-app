import { useEffect, useRef } from "react";
import { base44 } from "@/api/base44Client";

const LOGO = "https://media.base44.com/images/public/6a1ae3ef77b040df5f5f2e2c/b85857139_PikaBoo_logo-removebg-preview.png";

function sendNotification(title, body, icon, onClickUrl) {
  if (typeof Notification === "undefined" || Notification.permission !== "granted") return;
  const n = new Notification(title, {
    body,
    icon: icon || LOGO,
    badge: LOGO,
    tag: title, // prevents duplicate stacking
  });
  if (onClickUrl) {
    n.onclick = () => {
      n.close();
      window.focus();
      window.location.href = onClickUrl;
    };
  }
}

// Pleasant two-tone "ping" via Web Audio API — no asset file needed.
let audioCtx = null;
function playPing() {
  try {
    if (!audioCtx) {
      const AC = window.AudioContext || window.webkitAudioContext;
      if (!AC) return;
      audioCtx = new AC();
    }
    if (audioCtx.state === "suspended") audioCtx.resume();
    const now = audioCtx.currentTime;
    const notes = [880, 1320]; // A5 → E6, bright and cheerful
    notes.forEach((freq, i) => {
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = "sine";
      osc.frequency.value = freq;
      const start = now + i * 0.12;
      gain.gain.setValueAtTime(0, start);
      gain.gain.linearRampToValueAtTime(0.25, start + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, start + 0.35);
      osc.connect(gain).connect(audioCtx.destination);
      osc.start(start);
      osc.stop(start + 0.36);
    });
  } catch (e) {
    // silent fail — audio not critical
  }
}

export function useAppNotifications() {
  // Store known match IDs and message snapshots to detect new ones
  const knownMatchIds = useRef(null);
  const knownMessageSigs = useRef(null); // map of matchId -> last_message_time

  useEffect(() => {
    const hasNotifications = typeof Notification !== "undefined";
    // Request permission silently (no prompt if already decided)
    if (hasNotifications && Notification.permission === "default") {
      Notification.requestPermission();
    }

    const handleMatchEvent = async () => {
      try {
        const matches = await base44.entities.Match.list();

        const currentIds = new Set(matches.map((m) => m.id));
        const currentSigs = {};
        matches.forEach((m) => {
          currentSigs[m.id] = m.last_message_time || null;
        });

        if (knownMatchIds.current === null) {
          // First load — just record baseline, no notification
          knownMatchIds.current = currentIds;
          knownMessageSigs.current = currentSigs;
          return;
        }

        // Detect new matches
        for (const match of matches) {
          if (!knownMatchIds.current.has(match.id)) {
            // Always ping instantly so you never miss a new match
            playPing();
            // Skip the browser notification when the user just swiped (the MatchModal is showing)
            // and the app is in the foreground — only notify when they're away/backgrounded.
            const createdMs = match.created_date ? new Date(match.created_date).getTime() : 0;
            const isFresh = Date.now() - createdMs < 8000;
            if (isFresh && !document.hidden) continue;
            sendNotification(
              "🔥 It's a Lekker Match!",
              `You and ${match.matched_name} matched! Tap to start the conversation.`,
              match.matched_photo,
              "/matches"
            );
          }
        }

        // Detect new messages on existing matches
        for (const match of matches) {
          const prevSig = knownMessageSigs.current[match.id];
          const newSig = match.last_message_time || null;
          if (
            prevSig !== undefined && // known match
            newSig &&
            newSig !== prevSig &&
            match.last_message
          ) {
            sendNotification(
              `💬 New message from ${match.matched_name}`,
              match.last_message,
              match.matched_photo,
              "/chat"
            );
          }
        }

        knownMatchIds.current = currentIds;
        knownMessageSigs.current = currentSigs;
      } catch (e) {
        // silent fail
      }
    };

    // Subscribe to real-time match changes (guarded so offline/restricted networks don't break the UI)
    let unsubscribe = () => {};
    try {
      const unsub = base44.entities.Match.subscribe(handleMatchEvent);
      if (typeof unsub === "function") unsubscribe = unsub;
    } catch (e) {
      // silent fail — UI still renders without realtime
    }

    // Also initialise baseline on mount
    handleMatchEvent();

    return () => unsubscribe();
  }, []);
}