import { motion } from "framer-motion";
import { MapPin, Utensils, Heart } from "lucide-react";

const prompts = [
  {
    icon: MapPin,
    question: "My dream date is a sunset at",
    color: "text-primary",
    key: "dream_date_location",
  },
  {
    icon: Utensils,
    question: "I can't live without a weekly",
    color: "text-amber",
    key: "cant_live_without",
  },
  {
    icon: Heart,
    question: "My spirit animal is a",
    color: "text-violet",
    key: "spirit_animal",
  },
];

export default function ProfilePrompts({ profile }) {
  return (
    <div className="space-y-3">
      <h3 className="text-xs font-heading font-semibold text-muted-foreground uppercase tracking-wider">
        Proudly South African
      </h3>
      {prompts.map((prompt, i) => {
        const answer = profile?.[prompt.key];
        const Icon = prompt.icon;
        return (
          <motion.div
            key={prompt.key}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-secondary/50 rounded-2xl p-4 border border-border/30"
          >
            <div className="flex items-center gap-2 mb-1">
              <Icon className={`w-4 h-4 ${prompt.color}`} />
              <span className="text-xs text-muted-foreground font-body">
                {prompt.question}
              </span>
            </div>
            <p className="text-sm font-heading font-semibold text-foreground pl-6">
              {answer || "Not answered yet..."}
            </p>
          </motion.div>
        );
      })}
    </div>
  );
}