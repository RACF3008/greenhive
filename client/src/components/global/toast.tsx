import { useEffect, useState } from "react";

type ToastProps = {
  type: "success" | "error" | "info";
  message: string[];
};

const Toast = ({ type, message }: ToastProps) => {
  const baseStyle =
    "fixed top-4 left-1/2 transform -translate-x-1/2 text-white px-6 py-3 rounded-md shadow-md z-50";

  const typeColors = {
    success: "bg-green-600",
    error: "bg-red-600",
    info: "bg-blue-600",
  };

  const [toast, setToast] = useState<string[]>([]);

  useEffect(() => {
    if (Array.isArray(message) && message.length > 0) {
      setToast(message);
      const timer = setTimeout(() => setToast([]), 4000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  return (
    <>
      {toast.length > 0 && (
        <div className={`${baseStyle} ${typeColors[type]}`}>
          <ul className="list-none pl-0 space-y-1 pl">
            {toast.map((msg, i) => (
              <li key={i}>{msg}</li>
            ))}
          </ul>
        </div>
      )}
    </>
  );
};

export default Toast;
