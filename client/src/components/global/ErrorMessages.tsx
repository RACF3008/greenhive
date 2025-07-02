import { useEffect, useState } from "react";

type ErrorMessagesProps = {
  requestErrors: string[];
};

const ErrorMessages = ({ requestErrors }: ErrorMessagesProps) => {
  const [visibleErrors, setVisibleErrors] = useState<string[]>([]);

  useEffect(() => {
    console.log(requestErrors);
    if (Array.isArray(requestErrors) && requestErrors.length > 0) {
      setVisibleErrors(requestErrors);
      const timer = setTimeout(() => setVisibleErrors([]), 4000);
      return () => clearTimeout(timer);
    }
  }, [requestErrors]);
  return (
    <>
      {visibleErrors.length > 0 && (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 bg-red-600 text-white px-6 py-3 rounded-md shadow-md z-50">
          <ul className="list-none pl-0 space-y-1 pl">
            {visibleErrors.map((msg, i) => (
              <li key={i}>{msg}</li>
            ))}
          </ul>
        </div>
      )}
    </>
  );
};

export default ErrorMessages;
