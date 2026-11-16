import {
  PREVIEW_PROMPTS,
  PREVIEW_VERSION_HISTORY,
  PREVIEW_COMMUNITY,
  PREVIEW_SIDEBAR_ITEMS,
} from "../content/landing-content";

/** ILLUSTRATIVE SAMPLE DATA — static decorative preview; no data fetching. */
export function ProductPreview() {
  return (
    <div
      role="img"
      aria-label="Preview of the PromptLok prompt library"
      className="relative w-full pointer-events-none select-none"
    >
      {/* Golden glow behind the window */}
      <div
        aria-hidden
        className="absolute -inset-8 rounded-3xl bg-primary/15 blur-3xl opacity-60 dark:opacity-40"
      />

      {/* ── Main app window ─────────────────────────── */}
      <div className="relative rounded-2xl border border-border bg-card shadow-2xl ring-1 ring-inset ring-primary/10 overflow-hidden">
        <div className="flex min-h-0" style={{ minHeight: 420 }}>

          {/* Sidebar */}
          <aside
            aria-hidden
            className="hidden sm:flex flex-col w-44 shrink-0 border-r border-border bg-card/80 py-4 px-2 gap-1"
          >
            <p className="px-3 mb-2 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
              Workspace
            </p>
            {PREVIEW_SIDEBAR_ITEMS.map((item) => (
              <div
                key={item.label}
                className={[
                  "flex items-center gap-2 rounded-xl px-3 py-2.5 text-xs font-medium transition-colors",
                  item.active
                    ? "bg-accent-soft text-accent-foreground"
                    : "text-muted-foreground",
                ].join(" ")}
              >
                <span
                  className={[
                    "size-1.5 rounded-full shrink-0",
                    item.active ? "bg-accent-foreground" : "bg-transparent",
                  ].join(" ")}
                />
                {item.label}
              </div>
            ))}
          </aside>

          {/* Main area */}
          <div className="flex-1 min-w-0 p-4 flex flex-col gap-3 overflow-hidden">
            {/* Header row */}
            <div className="flex items-center justify-between gap-2">
              <h3 className="text-sm font-semibold text-foreground">My Prompts</h3>
              <div className="h-6 w-24 rounded-full bg-muted/60 text-[10px] flex items-center px-3 text-muted-foreground">
                Search…
              </div>
            </div>

            {/* Search bar */}
            <div
              aria-hidden
              className="flex h-8 items-center rounded-lg border border-border bg-background/60 px-3 text-xs text-muted-foreground gap-2"
            >
              <svg className="size-3 shrink-0 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
                <circle cx="11" cy="11" r="8" strokeWidth="2" />
                <path d="m21 21-4.35-4.35" strokeWidth="2" strokeLinecap="round" />
              </svg>
              <span className="truncate opacity-60">Search by title or description…</span>
            </div>

            {/* Prompt cards */}
            <div className="flex flex-col gap-2.5 overflow-hidden">
              {PREVIEW_PROMPTS.map((prompt, i) => (
                <div
                  key={i}
                  aria-hidden
                  className="rounded-xl border border-border bg-background/70 p-3 flex flex-col gap-2"
                >
                  {/* Badge row */}
                  <div className="flex items-center justify-between gap-2">
                    <span className="rounded-full bg-muted px-2 py-0.5 text-[10px] font-medium text-muted-foreground capitalize">
                      {prompt.status}
                    </span>
                    <span className="rounded-full bg-muted px-2 py-0.5 text-[10px] font-medium text-muted-foreground">
                      {prompt.type}
                    </span>
                  </div>
                  {/* Title */}
                  <p className="text-xs font-semibold text-foreground leading-snug line-clamp-1">
                    {prompt.title}
                  </p>
                  {/* Description */}
                  <p className="text-[10px] text-muted-foreground leading-relaxed line-clamp-2">
                    {prompt.description}
                  </p>
                  {/* Footer */}
                  <div className="flex items-center justify-between gap-2 border-t border-border pt-2">
                    <div className="flex items-center gap-1 flex-wrap">
                      <span className="rounded-full bg-accent-soft text-accent-foreground px-1.5 py-0.5 text-[10px] font-medium">
                        {prompt.category}
                      </span>
                      {prompt.tags.map((tag) => (
                        <span key={tag} className="text-[10px] text-muted-foreground">
                          #{tag}
                        </span>
                      ))}
                    </div>
                    <span className="text-[10px] text-muted-foreground shrink-0">
                      {prompt.model}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── Floating card (b): Version history — bottom-left ─── */}
      <div
        aria-hidden
        className="absolute -bottom-4 -left-4 w-52 rounded-2xl border border-border bg-card/90 backdrop-blur-md shadow-xl p-3 flex flex-col gap-2 ring-1 ring-inset ring-primary/10"
        style={{ WebkitBackdropFilter: "blur(12px)" }}
      >
        <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">
          Version history
        </p>
        <p className="text-xs font-semibold text-foreground leading-snug">
          {PREVIEW_VERSION_HISTORY.promptTitle}
        </p>
        <div className="flex flex-col gap-1.5 pl-3 relative">
          {/* Vertical timeline line */}
          <div className="absolute left-1 top-1 bottom-1 w-px bg-border" />
          {PREVIEW_VERSION_HISTORY.versions.map((v) => (
            <div key={v.label} className="flex items-center gap-2">
              <div
                className={[
                  "size-2 rounded-full shrink-0 ring-2 ring-card",
                  v.isCurrent ? "bg-accent-foreground" : "bg-border",
                ].join(" ")}
              />
              <span
                className={[
                  "text-[10px] leading-tight",
                  v.isCurrent
                    ? "font-semibold text-accent-foreground"
                    : "text-muted-foreground",
                ].join(" ")}
              >
                {v.label}
                {v.isCurrent && (
                  <span className="ml-1 rounded-full bg-accent-soft px-1.5 py-px text-[9px] text-accent-foreground">
                    Current
                  </span>
                )}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* ── Floating card (c): Community — top-right, hidden below sm ─── */}
      <div
        aria-hidden
        className="hidden sm:flex absolute -top-4 -right-4 w-48 flex-col gap-2 rounded-2xl border border-border bg-card/90 backdrop-blur-md shadow-xl p-3 ring-1 ring-inset ring-primary/10"
        style={{ WebkitBackdropFilter: "blur(12px)" }}
      >
        <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">
          {PREVIEW_COMMUNITY.label}
        </p>
        {PREVIEW_COMMUNITY.items.map((item) => (
          <div key={item.title} className="flex flex-col gap-0.5">
            <p className="text-[10px] font-semibold text-foreground leading-snug line-clamp-1">
              {item.title}
            </p>
            <p className="text-[10px] text-accent-foreground">{item.tag}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
