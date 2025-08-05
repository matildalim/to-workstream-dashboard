export const metadata = {
  title: 'Workstream Dashboard',
  description: 'Transformation Program Dashboard',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
