import { useEffect, useRef } from "react";
import { base44 } from "@/api/base44Client";

function sendNotification(title, body, icon) {
  if (Notification.permission !== "granted") return;
  new Notification(title, {
    body,
    icon: icon || "https://media.base44.com/images/public/6a1ae3ef77b040df5f5f2e2c/8b5857139_PikaBoo_logo-removebg-preview.png",
    badge: "https://media.base44.com/images/public/6a1ae3ef77b040df5f5f2e2c/8b5857139_PikaBoo_logo-removebg-preview.png",
    tag: title, // prevents duplicate stacking
  });
}

export function useAppNotifications() {
  // Store known match IDs and message snapshots to detect new ones
  const knownMatchIds = useRef(null);
  const knownMessageSigs = useRef(null); // map of matchId -> last_message_time

  useEffect(() => {
    // Request permission silently (no prompt if already decided)
    if (Notification.permission === "default") {
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
            sendNotification(
              "🔥 It's a Lekker Match!",
              `You and ${match.matched_name} matched! Send the first move.`,
              match.matched_photo
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
              match.matched_photo
            );
          }
        }

        knownMatchIds.current = currentIds;
        knownMessageSigs.current = currentSigs;
      } catch (e) {
        // silent fail
      }
    };

    // Subscribe to real-time match changes
    const unsubscribe = base44.entities.Match.subscribe(handleMatchEvent);

    // Also initialise baseline on mount
    handleMatchEvent();

    return unsubscribe;
  }, []);
}