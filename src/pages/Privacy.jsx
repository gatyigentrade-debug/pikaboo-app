import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

const SECTIONS = [
  {
    title: "1. Information We Collect",
    body: [
      "Account details: your name, email address, age, gender, and the city you call home.",
      "Profile content: photos, bio, braai starter, interests, and the local-flavour prompts you add to your profile.",
      "Activity data: the profiles you swipe on, likes and super likes, matches, and the messages you send and receive.",
      "Location: approximate distance to other members (derived from your device location) to show nearby matches.",
      "Device & usage: device type, app version, and basic analytics about how you use PikaBoo.",
      "Verification data: the photo you submit if you choose to verify your profile.",
    ],
  },
  {
    title: "2. How We Use Your Information",
    body: [
      "To create and maintain your dating profile and show it to other members.",
      "To suggest matches, power the swipe experience, and let you chat with your matches.",
      "To verify profiles and keep the community safer.",
      "To process subscriptions and in-app purchases (handled by our payment provider, Paystack).",
      "To send push notifications about new matches, messages, and boosts.",
      "To improve PikaBoo, fix issues, and prevent abuse or fake accounts.",
    ],
  },
  {
    title: "3. Who We Share With",
    body: [
      "Other members: your profile (name, age, photos, bio, prompts) is visible to other PikaBoo users as part of matching.",
      "Service providers: trusted partners that help us run the app (hosting, payments via Paystack, push notifications). They only get what they need and must keep it secure.",
      "Legal: if required by law or to protect the safety of our users, we may disclose information to authorities.",
      "We never sell your personal data.",
    ],
  },
  {
    title: "4. Data Retention",
    body: [
      "We keep your profile and activity while your account is active.",
      "If you delete your account, we remove your profile, matches, messages, and swipes from our systems within 30 days.",
      "Some records may be kept longer where required by law or to prevent fraud.",
    ],
  },
  {
    title: "5. Your Rights",
    body: [
      "Access: you can view the information stored on your profile at any time.",
      "Update: edit your profile, photos, and prompts whenever you like.",
      "Delete: you can delete your account from Profile → Safety & Settings, which erases your data.",
      "Withdraw consent: you can turn off push notifications or location sharing in your device settings.",
    ],
  },
  {
    title: "6. Security",
    body: [
      "We use industry-standard measures to protect your data, including encrypted connections and secure storage.",
      "No method of transmission over the internet is 100% secure, but we work hard to keep your information safe.",
    ],
  },
  {
    title: "7. Children's Privacy",
    body: [
      "PikaBoo is for people 18 and older. We do not knowingly collect data from anyone under 18.",
      "If you believe a minor is using the app, please contact us and we will remove the account.",
    ],
  },
  {
    title: "8. Changes to This Policy",
    body: [
      "We may update this Privacy Policy as PikaBoo grows. We'll let you know about significant changes inside the app.",
      "The date at the top shows when it was last updated.",
    ],
  },
  {
    title: "9. Contact Us",
    body: [
      "Questions about your data or this policy? Email us at privacy@pikaboo.app and we'll get back to you.",
    ],
  },
];

export default function Privacy() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#0A0A0C" }}>
      {/* Header */}
      <div
        className="sticky top-0 z-20 flex items-center gap-3 px-4 py-3 border-b border-border/30 backdrop-blur-xl"
        style={{ backgroundColor: "rgba(10,10,12,0.85)", paddingTop: "calc(0.75rem + env(safe-area-inset-top))" }}
      >
        <button
          onClick={() => navigate(-1)}
          className="w-11 h-11 rounded-full bg-secondary flex items-center justify-center active:scale-95 transition-transform"
          aria-label="Back"
        >
          <ArrowLeft className="w-5 h-5 text-foreground" />
        </button>
        <h1 className="text-lg font-heading font-bold text-foreground">Privacy Policy</h1>
      </div>

      {/* Body */}
      <div className="px-4 py-6 max-w-md mx-auto space-y-6">
        <p className="text-xs text-muted-foreground font-body">Last updated: 10 September 2026</p>

        <p className="text-sm text-foreground/80 font-body leading-relaxed">
          PikaBoo ("we", "us", "our") is a dating app built for South Africans to find their vibe and connect.
          This Privacy Policy explains what information we collect, how we use it, and the choices you have.
          By using PikaBoo, you agree to the practices described here.
        </p>

        {SECTIONS.map((section) => (
          <section key={section.title}>
            <h2 className="text-sm font-heading font-bold text-gold mb-2">{section.title}</h2>
            <ul className="space-y-2">
              {section.body.map((line, i) => (
                <li key={i} className="flex gap-2 text-sm text-foreground/75 font-body leading-relaxed">
                  <span className="text-gold/60 mt-1 flex-shrink-0">•</span>
                  <span>{line}</span>
                </li>
              ))}
            </ul>
          </section>
        ))}

        <div className="pt-2 pb-8">
          <p className="text-xs text-muted-foreground font-body text-center">
            Made with 💛 in South Africa · privacy@pikaboo.app
          </p>
        </div>
      </div>
    </div>
  );
}