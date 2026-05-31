import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Flag, Ban, AlertTriangle, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const REPORT_REASONS = [
  "Inappropriate messages or photos",
  "Harassment or bullying",
  "Fake profile / catfish",
  "Underage user",
  "Spam or scam",
  "Hate speech or racism",
  "Other",
];

export default function ReportBlockSheet({ matchName, onClose }) {
  const [mode, setMode] = useState(null); // null | "report" | "block" | "done"
  const [selectedReason, setSelectedReason] = useState(null);

  const handleReport = () => {
    setMode("done");
  };

  const handleBlock = () => {
    setMode("blocked");
  };

  const isDone = mode === "done" || mode === "blocked";

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />
      <motion.div
        initial={{ y: "100%" }}
        animate={{ y: 0 }}
        exit={{ y: "100%" }}
        transition={{ type: "spring", stiffness: 300, damping: 32 }}
        className="fixed bottom-0 left-0 right-0 z-[60] bg-card rounded-t-3xl max-h-[85vh] overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Handle */}
        <div className="flex justify-center pt-3 pb-1 flex-shrink-0">
          <div className="w-10 h-1 rounded-full bg-border" />
        </div>

        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-border/40 flex-shrink-0">
          <h2 className="font-heading font-bold text-foreground">
            {isDone ? (mode === "blocked" ? "Blocked" : "Report Sent") : `Safety Options`}
          </h2>
          <button onClick={onClose} className="w-7 h-7 rounded-full bg-secondary flex items-center justify-center">
            <X className="w-4 h-4 text-muted-foreground" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          {/* Done states */}
          {mode === "done" && (
            <div className="flex flex-col items-center py-8 text-center gap-4">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                <Flag className="w-7 h-7 text-primary" />
              </div>
              <div>
                <h3 className="font-heading font-bold text-foreground text-lg">Report submitted 🙏</h3>
                <p className="text-sm text-muted-foreground font-body mt-1">
                  Siyabonga! We'll review <span className="text-foreground font-semibold">{matchName}</span>'s profile and take action. Your safety is our priority.
                </p>
              </div>
              <Button className="rounded-full w-full bg-primary font-heading" onClick={onClose}>
                Close
              </Button>
            </div>
          )}

          {mode === "blocked" && (
            <div className="flex flex-col items-center py-8 text-center gap-4">
              <div className="w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center">
                <Ban className="w-7 h-7 text-destructive" />
              </div>
              <div>
                <h3 className="font-heading font-bold text-foreground text-lg">{matchName} has been blocked</h3>
                <p className="text-sm text-muted-foreground font-body mt-1">
                  They can no longer see your profile or message you. You've been removed from each other's match lists.
                </p>
              </div>
              <Button className="rounded-full w-full bg-primary font-heading" onClick={onClose}>
                Done
              </Button>
            </div>
          )}

          {/* Main options */}
          {mode === null && (
            <div className="space-y-3">
              <div className="flex items-start gap-3 p-3 rounded-xl bg-secondary/40 mb-4">
                <AlertTriangle className="w-4 h-4 text-amber mt-0.5 flex-shrink-0" />
                <p className="text-xs text-muted-foreground font-body">
                  Your report is confidential. <span className="text-foreground">{matchName}</span> won't know you reported them. We take all reports seriously.
                </p>
              </div>

              <button
                onClick={() => setMode("report")}
                className="w-full flex items-center gap-3 p-4 rounded-2xl bg-secondary hover:bg-secondary/80 transition-colors text-left"
              >
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Flag className="w-5 h-5 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-heading font-semibold text-foreground text-sm">Report {matchName}</p>
                  <p className="text-xs text-muted-foreground font-body mt-0.5">Flag inappropriate behavior</p>
                </div>
                <ChevronRight className="w-4 h-4 text-muted-foreground flex-shrink-0" />
              </button>

              <button
                onClick={handleBlock}
                className="w-full flex items-center gap-3 p-4 rounded-2xl bg-destructive/10 hover:bg-destructive/20 transition-colors text-left"
              >
                <div className="w-10 h-10 rounded-full bg-destructive/10 flex items-center justify-center flex-shrink-0">
                  <Ban className="w-5 h-5 text-destructive" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-heading font-semibold text-destructive text-sm">Block {matchName}</p>
                  <p className="text-xs text-muted-foreground font-body mt-0.5">Remove & prevent all contact</p>
                </div>
                <ChevronRight className="w-4 h-4 text-muted-foreground flex-shrink-0" />
              </button>
            </div>
          )}

          {/* Report reason selection */}
          {mode === "report" && (
            <div className="space-y-2">
              <p className="text-sm font-heading font-semibold text-foreground mb-3">
                What's the reason? 🤔
              </p>
              {REPORT_REASONS.map((reason) => (
                <button
                  key={reason}
                  onClick={() => setSelectedReason(reason)}
                  className={`w-full flex items-center gap-3 p-3.5 rounded-xl border transition-colors text-left ${
                    selectedReason === reason
                      ? "border-primary bg-primary/10 text-primary"
                      : "border-border/40 bg-secondary/40 text-foreground"
                  }`}
                >
                  <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                    selectedReason === reason ? "border-primary bg-primary" : "border-muted-foreground"
                  }`}>
                    {selectedReason === reason && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                  </div>
                  <span className="text-sm font-body">{reason}</span>
                </button>
              ))}

              <div className="pt-3 space-y-2">
                <Button
                  className="w-full rounded-full bg-primary font-heading"
                  disabled={!selectedReason}
                  onClick={handleReport}
                >
                  Submit Report
                </Button>
                <Button
                  variant="ghost"
                  className="w-full rounded-full font-heading text-muted-foreground"
                  onClick={() => setMode(null)}
                >
                  Back
                </Button>
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  );
}