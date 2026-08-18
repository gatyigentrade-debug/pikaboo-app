import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Flag, CheckCircle } from "lucide-react";

const REASONS = [
  { id: "fake", label: "Fake profile or catfishing" },
  { id: "inappropriate", label: "Inappropriate photos or content" },
  { id: "harassment", label: "Harassment or threatening messages" },
  { id: "spam", label: "Spam or scam" },
  { id: "underage", label: "Appears to be underage" },
  { id: "other", label: "Other" },
];

export default function ReportUserSheet({ profileName, onClose }) {
  const [selected, setSelected] = useState(null);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = () => {
    if (!selected) return;
    // In production: persist a report record via entity
    setSubmitted(true);
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        className="fixed inset-0 z-[80] bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />
      <motion.div
        initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }}
        transition={{ type: "spring", stiffness: 300, damping: 32 }}
        className="fixed bottom-0 left-0 right-0 z-[80] bg-card rounded-t-3xl overscroll-y-contain"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-center pt-3 pb-1">
          <div className="w-10 h-1 rounded-full bg-border" />
        </div>

        <div className="flex items-center justify-between px-4 py-3 border-b border-border/40">
          <div className="flex items-center gap-2">
            <Flag className="w-4 h-4 text-destructive" />
            <h2 className="font-heading font-bold text-foreground text-base">
              {submitted ? "Report Submitted" : `Report ${profileName || "Profile"}`}
            </h2>
          </div>
          <button onClick={onClose} className="w-7 h-7 rounded-full bg-secondary flex items-center justify-center">
            <X className="w-4 h-4 text-muted-foreground" />
          </button>
        </div>

        <div className="p-4">
          {submitted ? (
            <div className="flex flex-col items-center gap-3 py-6 text-center">
              <div className="w-14 h-14 rounded-full bg-green-500/15 flex items-center justify-center">
                <CheckCircle className="w-7 h-7 text-green-500" />
              </div>
              <p className="font-heading font-bold text-foreground">Thanks for keeping PikaBoo safe</p>
              <p className="text-sm text-muted-foreground font-body">
                Our team will review this report. We take all reports seriously.
              </p>
              <button
                onClick={onClose}
                className="mt-2 px-6 py-2.5 rounded-full bg-secondary text-foreground text-sm font-heading font-semibold"
              >
                Done
              </button>
            </div>
          ) : (
            <>
              <p className="text-sm text-muted-foreground font-body mb-4">
                Why are you reporting this profile?
              </p>
              <div className="space-y-2 mb-5">
                {REASONS.map((r) => (
                  <button
                    key={r.id}
                    onClick={() => setSelected(r.id)}
                    className={`w-full flex items-center justify-between px-4 py-3 rounded-xl border text-sm font-body transition-colors ${
                      selected === r.id
                        ? "border-destructive/60 bg-destructive/10 text-foreground"
                        : "border-border/40 bg-secondary/40 text-muted-foreground hover:bg-secondary"
                    }`}
                  >
                    <span>{r.label}</span>
                    {selected === r.id && (
                      <div className="w-4 h-4 rounded-full bg-destructive flex items-center justify-center flex-shrink-0">
                        <div className="w-1.5 h-1.5 rounded-full bg-white" />
                      </div>
                    )}
                  </button>
                ))}
              </div>
              <button
                onClick={handleSubmit}
                disabled={!selected}
                className="w-full py-3 rounded-full bg-destructive text-destructive-foreground text-sm font-heading font-bold disabled:opacity-40 transition-opacity"
              >
                Submit Report
              </button>
              <p className="text-[11px] text-muted-foreground font-body text-center mt-3">
                Reports are anonymous and reviewed within 24 hours.
              </p>
            </>
          )}
        </div>
      </motion.div>
    </>
  );
}