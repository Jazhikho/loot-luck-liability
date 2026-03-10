/**
 * Fixed toasts for achievement unlocks.
 * @param {{ toasts: Array<{ id: number, e: string, name: string }> }} props
 */
export function ToastLayer({ toasts }) {
  if (toasts.length === 0) return null;
  return (
    <div
      className="fixed top-4 left-1/2 z-50 flex flex-col gap-2 items-center"
      style={{ transform: "translateX(-50%)" }}
    >
      {toasts.map((t) => (
        <div
          key={t.id}
          className="bg-yellow-900 border border-yellow-600 text-yellow-200 px-4 py-2 rounded-lg shadow-lg text-sm font-bold animate-bounce"
        >
          🏅 {t.e} {t.name} Unlocked!
        </div>
      ))}
    </div>
  );
}
