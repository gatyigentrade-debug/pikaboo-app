import { motion, AnimatePresence } from "framer-motion";
import { Crown, Check } from "lucide-react";

export default function VipSuccessModal({ isOpen, plan, onClose }) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[90] flex items-center justify-center bg-black/80 backdrop-blur-md px-6"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.85, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.85, opacity: 0, y: 20 }}
            transition={{ type: "spring", stiffness: 260, damping: 22 }}
            className="relative w-full max-w-sm rounded-3xl overflow-hidden text-center"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Gold gradient header */}
            <div className="bg-gradient-to-br from-yellow-500 via-amber-400 to-orange-500 px-6 pt-10 pb-8 relative overflow-hidden">
              <div className="absolute top-4 left-8 w-2 h-2 bg-white/70 rounded-full animate-sparkle" />
              <div className="absolute top-10 right-10 w-1.5 h-1.5 bg-white/60 rounded-full animate-sparkle" style={{ animationDelay: "0.4s" }} />
              <div className="absolute top-6 left-1/2 w-1 h-1 bg-white/50 rounded-full animate-sparkle" style={{ animationDelay: "0.8s" }} />

              <motion.div
                initial={{ scale: 0, rotate: -30 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ delay: 0.15, type: "spring", stiffness: 200 }}
                className="w-20 h-20 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center mx-auto mb-3"
              >
                <Crown className="w-10 h-10 text-white drop-shadow-lg" />
              </motion.div>
              <h2 className="text-2xl font-heading font-black text-white drop-shadow">Welcome to PikaBoo VIP!</h2>
              <p className="text-white/90 font-body text-sm mt-1">You're now a VIP member</p>
            </div>

            {/* Body */}
            <div className="bg-card px-6 py-6 space-y-3">
              <div className="flex items-center justify-center gap-2 text-foreground">
                <div className="w-7 h-7 rounded-full bg-green-500/20 flex items-center justify-center">
                  <Check className="w-4 h-4 text-green-400" />
                </div>
                <p className="font-heading font-bold">
                  {plan === "weekly" ? "Weekly" : plan === "monthly" ? "Monthly" : "3-Month"} VIP activated
                </p>
              </div>
              <p className="text-muted-foreground font-body text-xs">
                All VIP perks are now unlocked. Taking you back to the action...
              </p>
              <div className="w-7 h-7 border-2 border-amber border-t-transparent rounded-full animate-spin mx-auto" />
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}