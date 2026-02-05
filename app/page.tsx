export default function Home() {
  return (
    <div className="min-h-screen bg-bg-primary">
      <main className="flex min-h-screen flex-col items-center justify-center p-8">
        <div className="bg-bg-card rounded-[var(--radius-card)] border border-border p-8 max-w-md w-full">
          <h1 className="text-text-primary text-2xl font-bold mb-4">
            AI Resume Roaster
          </h1>
          <p className="text-text-secondary mb-6">
            Design system configured. Ready for development.
          </p>

          {/* Color swatches demo */}
          <div className="space-y-4">
            <div className="flex gap-2">
              <div className="w-8 h-8 rounded bg-accent" title="Accent"></div>
              <div className="w-8 h-8 rounded bg-accent-hover" title="Accent Hover"></div>
            </div>
            <div className="flex gap-2">
              <div className="w-8 h-8 rounded bg-success" title="Success"></div>
              <div className="w-8 h-8 rounded bg-warning" title="Warning"></div>
              <div className="w-8 h-8 rounded bg-danger" title="Danger"></div>
            </div>
            <div className="flex gap-2">
              <div className="w-8 h-8 rounded bg-bg-primary border border-border" title="BG Primary"></div>
              <div className="w-8 h-8 rounded bg-bg-card border border-border" title="BG Card"></div>
              <div className="w-8 h-8 rounded bg-bg-elevated border border-border" title="BG Elevated"></div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
