import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { base44 } from "@/api/base44Client";

const VIBES = [
  { value: "singles_only", label: "Singles Only 🔥" },
  { value: "social", label: "Social 🤝" },
  { value: "chill", label: "Chill Vibes 😎" },
  { value: "family_friendly", label: "Family Friendly 👨‍👩‍👧" },
];

export default function CreateMeetupSheet({ onClose, onCreated }) {
  const [form, setForm] = useState({
    title: "",
    description: "",
    location_name: "",
    city: "",
    date: "",
    max_attendees: 20,
    vibe: "singles_only",
    bring: "",
  });
  const [loading, setLoading] = useState(false);

  const set = (key, val) => setForm((f) => ({ ...f, [key]: val }));

  const handleSubmit = async () => {
    if (!form.title || !form.location_name || !form.date) return;
    setLoading(true);
    const user = await base44.auth.me();
    await base44.entities.BraaiMeetup.create({
      ...form,
      max_attendees: Number(form.max_attendees),
      host_name: user.full_name || "Anonymous",
      host_photo: "",
      attendee_ids: [user.id],
      attendee_names: [user.full_name || "You"],
      attendee_photos: [],
    });
    setLoading(false);
    onCreated();
    onClose();
  };

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
        className="fixed bottom-0 left-0 right-0 z-[60] bg-card rounded-t-3xl max-h-[92vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-center pt-3 pb-1 flex-shrink-0">
          <div className="w-10 h-1 rounded-full bg-border" />
        </div>

        <div className="flex items-center justify-between px-4 py-3 border-b border-border/40 flex-shrink-0">
          <h2 className="font-heading font-bold text-foreground text-lg">Host a Braai 🔥</h2>
          <button onClick={onClose} className="w-7 h-7 rounded-full bg-secondary flex items-center justify-center">
            <X className="w-4 h-4 text-muted-foreground" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          <div>
            <label className="text-xs font-heading font-semibold text-muted-foreground uppercase tracking-wide mb-1.5 block">Meetup Name *</label>
            <Input
              placeholder="e.g. Saturday Boerewors Braai"
              value={form.title}
              onChange={(e) => set("title", e.target.value)}
              className="bg-secondary border-none rounded-xl font-body"
            />
          </div>

          <div>
            <label className="text-xs font-heading font-semibold text-muted-foreground uppercase tracking-wide mb-1.5 block">Description</label>
            <textarea
              placeholder="Tell people what to expect..."
              value={form.description}
              onChange={(e) => set("description", e.target.value)}
              rows={2}
              className="w-full bg-secondary border-none rounded-xl font-body text-sm text-foreground placeholder:text-muted-foreground p-3 resize-none focus:outline-none focus:ring-1 focus:ring-ring"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-heading font-semibold text-muted-foreground uppercase tracking-wide mb-1.5 block">Spot / Venue *</label>
              <Input
                placeholder="e.g. Walter Sisulu Park"
                value={form.location_name}
                onChange={(e) => set("location_name", e.target.value)}
                className="bg-secondary border-none rounded-xl font-body"
              />
            </div>
            <div>
              <label className="text-xs font-heading font-semibold text-muted-foreground uppercase tracking-wide mb-1.5 block">City</label>
              <Input
                placeholder="e.g. Joburg"
                value={form.city}
                onChange={(e) => set("city", e.target.value)}
                className="bg-secondary border-none rounded-xl font-body"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-heading font-semibold text-muted-foreground uppercase tracking-wide mb-1.5 block">Date & Time *</label>
              <Input
                type="datetime-local"
                value={form.date}
                onChange={(e) => set("date", e.target.value)}
                className="bg-secondary border-none rounded-xl font-body text-sm"
              />
            </div>
            <div>
              <label className="text-xs font-heading font-semibold text-muted-foreground uppercase tracking-wide mb-1.5 block">Max Guests</label>
              <Input
                type="number"
                min={2}
                max={100}
                value={form.max_attendees}
                onChange={(e) => set("max_attendees", e.target.value)}
                className="bg-secondary border-none rounded-xl font-body"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-heading font-semibold text-muted-foreground uppercase tracking-wide mb-1.5 block">Vibe</label>
            <div className="flex flex-wrap gap-2">
              {VIBES.map((v) => (
                <button
                  key={v.value}
                  onClick={() => set("vibe", v.value)}
                  className={`px-3 py-1.5 rounded-full text-xs font-heading font-semibold border transition-colors ${
                    form.vibe === v.value
                      ? "bg-primary text-primary-foreground border-primary"
                      : "border-border/40 text-muted-foreground bg-secondary"
                  }`}
                >
                  {v.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-xs font-heading font-semibold text-muted-foreground uppercase tracking-wide mb-1.5 block">What to Bring?</label>
            <Input
              placeholder="e.g. Your own meat & drinks"
              value={form.bring}
              onChange={(e) => set("bring", e.target.value)}
              className="bg-secondary border-none rounded-xl font-body"
            />
          </div>

          <Button
            className="w-full rounded-full bg-primary font-heading text-primary-foreground glow-orange"
            disabled={loading || !form.title || !form.location_name || !form.date}
            onClick={handleSubmit}
          >
            {loading ? "Creating..." : "🔥 Create Braai"}
          </Button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}