import { useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { MessageCircle, X } from "lucide-react";
import OpeningMoveComposer from "./OpeningMoveComposer";

export default function MatchModal({ matchedProfile, createdMatch, onChat }) {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [showComposer, setShowComposer] = useState(false);
  const isOpen = searchParams.get("match") === "true";

  const handleClose = () => {
    const next = new URLSearchParams(searchParams);
    next.delete("match");
    setSearchParams(next, { replace: true });
  };

  const handleSend = (message) => {
    setShowComposer(false);
    handleClose();
    if (createdMatch?.id) {
      navigate(`/chat/${createdMatch.id}`, { state: { match: createdMatch, openingMessage: message } });
    } else {
      onChat?.(message);
    }
  };

  return (
    <>
      <AnimatePresence>
        {isOpen && matchedProfile && !showComposer && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-lg"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              className="relative text-center px-8 py-10"
            >
              {/* Close */}
              <button
                onClick={handleClose}
                className="absolute top-2 right-2 w-11 h-11 rounded-full flex items-center justify-center text-muted-foreground hover:text-foreground"
              >
                <X className="w-6 h-6" />
              </button>

              {/* Sparkles */}
              <div className="absolute top-0 left-1/4 w-2 h-2 rounded-full bg-primary animate-sparkle" />
              <div className="absolute top-8 right-1/4 w-1.5 h-1.5 rounded-full bg-gold animate-sparkle" style={{ animationDelay: "0.5s" }} />
              <div className="absolute bottom-20 left-1/3 w-2 h-2 rounded-full bg-violet animate-sparkle" style={{ animationDelay: "1s" }} />

              {/* Title */}
              <h2 className="text-4xl font-heading font-black text-primary glow-text-orange mb-2">
                It's a Lekker Match!
              </h2>
              <p className="text-muted-foreground font-body mb-8">
                Start the vibe with {matchedProfile.name} 🔥
              </p>

              {/* Avatar */}
              <motion.div
                initial={{ y: 30 }}
                animate={{ y: 0 }}
                className="w-32 h-32 rounded-full mx-auto mb-8 border-4 border-primary glow-orange overflow-hidden"
              >
                <img
                  src={matchedProfile.photos?.[0] || ""}
                  alt={matchedProfile.name}
                  className="w-full h-full object-cover"
                />
              </motion.div>

              {/* Actions */}
              <div className="flex gap-3 justify-center">
                <Button
                  onClick={() => setShowComposer(true)}
                  className="bg-primary hover:bg-primary/90 text-primary-foreground font-heading font-semibold px-8 py-3 rounded-full glow-orange"
                >
                  <MessageCircle className="w-5 h-5 mr-2" />
                  Send Opening Move 🔥
                </Button>
                <Button
                  onClick={handleClose}
                  variant="outline"
                  className="border-border text-foreground rounded-full px-6 py-3"
                >
                  Keep Swiping
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Opening Move Composer */}
      <AnimatePresence>
        {showComposer && matchedProfile && (
          <OpeningMoveComposer
            matchedProfile={matchedProfile}
            isVerified={matchedProfile.is_verified ?? true}
            onSend={handleSend}
            onClose={() => setShowComposer(false)}
          />
        )}
      </AnimatePresence>
    </>
  );
}