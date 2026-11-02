export default function LoadingState({ label = "Loading…", className = "" }) {
  return (
    <div className={`flex flex-col items-center justify-center py-16 ${className}`}>
      <div className="w-8 h-8 border-2 border-gold/30 border-t-gold rounded-full animate-spin" />
      {label && <p className="mt-3 text-sm text-muted-foreground">{label}</p>}
    </div>
  );
}