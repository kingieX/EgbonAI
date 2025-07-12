export default function Footer() {
  return (
    <footer className="w-full border-t border-border bg-background text-muted-foreground">
      <div className="max-w-6xl mx-auto px-4 py-6 text-sm text-center">
        &copy; {new Date().getFullYear()} EgbónAI. All rights reserved.
      </div>
    </footer>
  );
}
