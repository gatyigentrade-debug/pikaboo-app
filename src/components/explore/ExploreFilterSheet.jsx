import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, MapPin, Calendar, Heart } from "lucide-react";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from "@/components/ui/drawer";

const INTERESTS = [
  "Amapiano", "Soccer", "Braai", "Road Trips", "Foodie",
  "Nightlife", "Outdoors", "Gaming", "Music", "Fitness",
  "Travel", "Movies", "Art", "Coffee", "Hiking",
];

function AgeDrawer({ label, value, onChange }) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="w-full h-11 rounded-xl bg-secondary border border-border/40 px-3 text-sm font-body text-foreground flex items-center justify-between"
      >
        <span className="text-xs text-muted-foreground">{label}</span>
        <span className="font-heading font-bold text-foreground">{value}</span>
      </button>
      <Drawer open={open} onOpenChange={setOpen}>
        <DrawerContent className="max-h-[50vh]">
          <DrawerHeader>
            <DrawerTitle>Select {label}</DrawerTitle>
          </DrawerHeader>
          <div className="px-6 pb-8">
            <input
              type="range"
              min="18"
              max="99"
              value={value}
              onChange={(e) => onChange(Number(e.target.value))}
              className="w-full accent-primary"
            />
            <div className="text-center mt-3 text-2xl font-heading font-bold text-foreground">{value}</div>
          </div>
        </DrawerContent>
      </Drawer>
    </>
  );
}

export default function ExploreFilterSheet({ isOpen, onClose, filters, onApply }) {
  const [localFilters, setLocalFilters] = useState(filters);

  useEffect(() => {
    setLocalFilters(filters);
  }, [filters]);

  const toggleInterest = (interest) => {
    setLocalFilters((prev) => ({
      ...prev,
      interests: prev.interests.includes(interest)
        ? prev.interests.filter((i) => i !== interest)
        : [...prev.interests, interest],
    }));
  };

  const handleApply = () => {
    onApply(localFilters);
    onClose();
  };

  const handleReset = () => {
    setLocalFilters({ distance: 50, ageMin: 18, ageMax: 45, interests: [] });
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm"
          />
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed bottom-0 left-0 right-0 z-50 bg-background rounded-t-3xl max-h-[85vh] overflow-y-auto"
          >
            {/* Header */}
            <div className="sticky top-0 z-10 bg-background/90 backdrop-blur-xl flex items-center justify-between px-4 py-4 border-b border-border/30">
              <button onClick={onClose} className="w-11 h-11 rounded-full bg-secondary flex items-center justify-center active:scale-95 transition-transform">
                <X className="w-5 h-5 text-foreground" />
              </button>
              <h2 className="text-lg font-heading font-bold text-foreground">Filters</h2>
              <button onClick={handleReset} className="text-xs text-primary font-heading font-bold">
                Reset
              </button>
            </div>

            <div className="px-4 py-5 space-y-6">
              {/* Distance */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <MapPin className="w-4 h-4 text-primary" />
                  <h3 className="text-sm font-heading font-bold text-foreground">Distance</h3>
                </div>
                <span className="text-xs text-muted-foreground font-body block mb-2">
                  Up to {localFilters.distance} km
                </span>
                <input
                  type="range"
                  min="1"
                  max="100"
                  value={localFilters.distance}
                  onChange={(e) => setLocalFilters((prev) => ({ ...prev, distance: Number(e.target.value) }))}
                  className="w-full accent-primary"
                />
              </div>

              {/* Age Range */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <Calendar className="w-4 h-4 text-primary" />
                  <h3 className="text-sm font-heading font-bold text-foreground">Age Range</h3>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex-1">
                    <label className="text-xs text-muted-foreground font-body block mb-1">Min</label>
                    <AgeDrawer
                      label="Min"
                      value={localFilters.ageMin}
                      onChange={(v) => setLocalFilters((prev) => ({ ...prev, ageMin: v }))}
                    />
                  </div>
                  <span className="text-muted-foreground mt-5">—</span>
                  <div className="flex-1">
                    <label className="text-xs text-muted-foreground font-body block mb-1">Max</label>
                    <AgeDrawer
                      label="Max"
                      value={localFilters.ageMax}
                      onChange={(v) => setLocalFilters((prev) => ({ ...prev, ageMax: v }))}
                    />
                  </div>
                </div>
              </div>

              {/* Interests */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <Heart className="w-4 h-4 text-primary" />
                  <h3 className="text-sm font-heading font-bold text-foreground">Interests</h3>
                </div>
                <div className="flex flex-wrap gap-2">
                  {INTERESTS.map((interest) => (
                    <button
                      key={interest}
                      onClick={() => toggleInterest(interest)}
                      className={`px-3 py-1.5 rounded-full text-xs font-body font-semibold transition-colors ${
                        localFilters.interests.includes(interest)
                          ? "bg-primary text-primary-foreground border border-primary"
                          : "bg-secondary text-muted-foreground border border-border/40"
                      }`}
                    >
                      {interest}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Apply button */}
            <div
              className="sticky bottom-0 bg-background/90 backdrop-blur-xl px-4 py-4 border-t border-border/30"
              style={{ paddingBottom: "calc(env(safe-area-inset-bottom) + 1rem)" }}
            >
              <button
                onClick={handleApply}
                className="w-full h-12 rounded-full bg-primary text-primary-foreground font-heading font-bold text-sm"
              >
                Apply Filters
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}