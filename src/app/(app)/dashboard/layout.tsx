/**
 * Dashboard Root Layout - Wird von allen Dashboard-Routen verwendet
 * Die eigentliche Layout-Logik ist in den einzelnen Dashboard-Komponenten
 */
export default function DashboardRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

