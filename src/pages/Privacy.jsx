import { Shield } from "lucide-react";
import ScreenHeader from "@/components/pika/ScreenHeader";
import PikaCard from "@/components/pika/PikaCard";

const SECTIONS = [
  {
    title: "1. Information We Collect",
    body: [
      "Account information: name, email address, age, gender, and home language you provide when registering.",
      "Profile content: photos, bio, braai starter, city, interests, and other details you choose to add to your dating profile.",
      "Activity data: swipes, likes, super likes, matches, messages, and profile views.",
      "Location data: approximate distance is derived to show nearby profiles; precise location is never shared with other users.",
      "Device and usage data: app version, device type, and basic analytics to improve the experience.",
    ],
  },
  {
    title: "2. How We Use Your Information",
    body: [
      "To create and maintain your account and dating profile.",
      "To show you potential matches and power the swipe, match, and chat features.",
      "To deliver push notifications about new matches and messages.",
      "To process subscriptions and one-time purchases via our payment partners.",
      "To keep the community safe through verification and abuse prevention.",
    ],
  },
  {
    title: "3. How We Share Your Information",
    body: [
      "With other users: only the profile content you choose to display (name, age, photos, bio, prompts).",
      "With payment providers (Paystack/Stripe) to process transactions — we never store full card details.",
      "With service providers that help us run the app (hosting, analytics, push notifications) under strict confidentiality.",
      "When required by law or to protect the rights, property, or safety of PikaBoo, our users, or others.",
    ],
  },
  {
    title: "4. Data Retention",
    body: [
      "We keep your profile and activity data while your account is active.",
      "If you delete your account, your profile, matches, messages, and associated data are removed within 30 days.",
      "Some anonymous, aggregated data may be retained for analytics.",
    ],
  },
  {
    title: "5. Your Rights",
    body: [
      "Access and update your profile information at any time.",
      "Request a copy of your personal data.",
      "Request correction or deletion of your data.",
      "Withdraw consent for push notifications through your device settings.",
      "Delete your account at any time from Profile → Safety & Settings → Delete Account.",
    ],
  },
  {
    title: "6. Security",
    body: [
      "We use industry-standard measures to protect your data, including encrypted connections and access controls.",
      "No method of transmission over the internet is 100% secure, but we work hard to safeguard your information.",
    ],
  },
  {
    title: "7. Children's Privacy",
    body: [
      "PikaBoo is for users 18 years and older. We do not knowingly collect data from anyone under 18.",
      "If you believe a minor is using the app, please contact us so we can remove the account.",
    ],
  },
  {
    title: "8. Changes to This Policy",
    body: [
      "We may update this Privacy Policy from time to time. We will notify you of significant changes within the app.",
      "Continued use of PikaBoo after changes means you accept the updated policy.",
    ],
  },
  {
    title: "9. Contact Us",
    body: [
      "If you have questions about this Privacy Policy or your personal data, contact us at privacy@pikaboo.app.",
    ],
  },
];

export default function Privacy() {
  return (
    <div className="min-h-screen pb-16" style={{ textShadow: "none" }}>
      <ScreenHeader title="Privacy Policy" subtitle="Last updated: September 2026" icon={Shield} />

      <div className="px-4">
        <PikaCard className="p-4 mb-4">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-11 h-11 rounded-2xl bg-gold/12 flex items-center justify-center">
              <Shield className="w-5 h-5 text-gold" />
            </div>
            <p className="text-sm text-foreground/85 font-body leading-relaxed">
              At PikaBoo, your privacy matters. This policy explains what information we collect, how we
              use it, and the choices you have.
            </p>
          </div>
        </PikaCard>

        <div className="space-y-3">
          {SECTIONS.map((s) => (
            <PikaCard key={s.title} className="p-4">
              <h2 className="text-sm font-heading font-bold text-gradient-gold mb-2.5">{s.title}</h2>
              <ul className="space-y-2">
                {s.body.map((line, i) => (
                  <li key={i} className="text-sm text-foreground/80 font-body leading-relaxed flex gap-2">
                    <span className="text-gold/70 flex-shrink-0 mt-1.5">•</span>
                    <span>{line}</span>
                  </li>
                ))}
              </ul>
            </PikaCard>
          ))}
        </div>
      </div>
    </div>
  );
}