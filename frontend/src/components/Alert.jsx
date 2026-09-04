export default function Alert({ type = "error", message, onClose }) {
  const bgColor = {
    error: "bg-red-50",
    success: "bg-green-50",
    info: "bg-blue-50",
    warning: "bg-yellow-50",
  }[type];

  const textColor = {
    error: "text-red-800",
    success: "text-green-800",
    info: "text-blue-800",
    warning: "text-yellow-800",
  }[type];

  const borderColor = {
    error: "border-red-200",
    success: "border-green-200",
    info: "border-blue-200",
    warning: "border-yellow-200",
  }[type];

  return (
    <div className={`${bgColor} border ${borderColor} rounded-lg p-4 mb-4`}>
      <div className="flex justify-between items-start">
        <p className={textColor}>{message}</p>
        {onClose && (
          <button
            onClick={onClose}
            className={`${textColor} font-bold hover:opacity-75`}
          >
            ×
          </button>
        )}
      </div>
    </div>
  );
}
