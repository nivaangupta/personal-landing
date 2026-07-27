export default function PageShell({
  maxWidth = 1120,
  children,
}: {
  maxWidth?: number;
  children: React.ReactNode;
}) {
  return (
    <div className="shell" style={{ maxWidth }}>
      {children}
    </div>
  );
}
