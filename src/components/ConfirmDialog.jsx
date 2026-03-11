import { Btn } from "./Btn.jsx";
import { useI18n } from "../i18n/index.jsx";

/**
 * Modal confirmation dialog for destructive or irreversible actions.
 * @param {{
 *   open: boolean,
 *   title: string,
 *   body: string,
 *   confirmLabel: string,
 *   onConfirm: () => void,
 *   onCancel: () => void,
 *   tone?: string,
 * }} props
 */
export function ConfirmDialog({
  open,
  title,
  body,
  confirmLabel,
  onConfirm,
  onCancel,
  tone = "bg-red-600 hover:bg-red-500",
}) {
  const { t } = useI18n();
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/70 p-4">
      <div className="w-full max-w-md rounded-xl border border-gray-700 bg-gray-900 p-5 shadow-2xl">
        <h2 className="text-lg font-bold text-white">{title}</h2>
        <p className="mt-2 text-sm leading-relaxed text-gray-300">{body}</p>
        <div className="mt-4 flex flex-wrap justify-end gap-2">
          <Btn onClick={onCancel} c="bg-gray-700 hover:bg-gray-600">
            {t("ui.common.cancel")}
          </Btn>
          <Btn onClick={onConfirm} c={tone}>
            {confirmLabel}
          </Btn>
        </div>
      </div>
    </div>
  );
}
