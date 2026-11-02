const LOGO_URL = "https://media.base44.com/images/public/6a1ae3ef77b040df5f5f2e2c/eb969a81b_App_Icon-removebg-preview.png";

export default function EmptyState({ title, message, action, icon: Icon }) {
  return (
    <div className="flex flex-col items-center justify-center text-center px-8 py-16">
      {Icon ? (
        <Icon className="w-10 h-10 text-gold/70 mb-4" />
      ) : (
        <img src={LOGO_URL} alt="PikaBoo" className="w-16 h-16 object-contain mb-4 opacity-80" />
      )}
      <h3 className="font-heading text-base font-bold text-foreground">{title}</h3>
      {message && <p className="text-sm text-muted-foreground mt-1 max-w-xs">{message}</p>}
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}