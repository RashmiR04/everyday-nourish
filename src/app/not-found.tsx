import Link from "next/link";

export default function NotFound() {
  return (
    <div className="space-y-4">
      <h1 className="font-display text-2xl text-ink">Page not found</h1>
      <p className="text-sm text-muted">The page you&apos;re looking for doesn&apos;t exist.</p>
      <Link href="/" className="text-sm text-accentDeep underline">
        Back to home
      </Link>
    </div>
  );
}
