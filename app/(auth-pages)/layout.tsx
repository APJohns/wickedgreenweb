export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <main className="page-padding page-padding-v">{children}</main>;
}
