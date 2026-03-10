/**
 * Styled button with optional disabled and full-width.
 * @param {{ onClick: () => void, children: React.ReactNode, disabled?: boolean, c?: string, full?: boolean }} props
 */
export function Btn({ onClick, children, disabled, c = "bg-indigo-600 hover:bg-indigo-500", full }) {
  const base = "rounded-lg px-4 py-2 text-sm font-semibold leading-tight transition-colors";
  const disabledClass = disabled ? "bg-gray-700 text-gray-500 cursor-not-allowed" : c + " text-white cursor-pointer";
  const widthClass = full ? "w-full" : "";
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`${disabledClass} ${base} ${widthClass}`}
    >
      {children}
    </button>
  );
}
