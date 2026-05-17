function Toast({ message, type = "error", onClose }) {
  if (!message) return null;

  const styles =
    type === "success"
      ? "border-emerald-200 bg-emerald-50 text-emerald-800"
      : "border-red-200 bg-red-50 text-red-700";

  return (
    <div
      className={`mb-5 flex items-start justify-between gap-4 rounded-lg border px-4 py-3 text-sm font-medium ${styles}`}
    >
      <p>{message}</p>
      {onClose && (
        <button
          type="button"
          onClick={onClose}
          className="font-bold opacity-70 transition hover:opacity-100"
          aria-label="Dismiss notification"
        >
          x
        </button>
      )}
    </div>
  );
}

export default Toast;
