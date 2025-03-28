export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-4rem)] w-full max-w-7xl mx-auto p-4">{children}</div>
  );
}
