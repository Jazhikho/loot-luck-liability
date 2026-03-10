/**
 * Fixed toasts for achievement unlocks.
 * @param {{ toasts: Array<{ id: string, e: string, name: string }> }} props
 */
export function ToastLayer({ toasts }) {
  if (toasts.length === 0) return null;

  return (
    <div
      className="fixed left-1/2 top-4 z-50 flex -translate-x-1/2 flex-col items-center gap-2"
      style={{ transform: "translateX(-50%)" }}
    >
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className="animate-bounce rounded-lg border border-yellow-500/70 bg-emerald-950 px-4 py-2 text-sm font-bold text-yellow-100 shadow-lg"
        >
          {toast.e} {toast.name} Unlocked!
        </div>
      ))}
    </div>
  );
}
