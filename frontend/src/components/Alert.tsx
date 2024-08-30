import React, { useCallback, useEffect, useState } from "react";
import { AlertType } from "../types/alert";

const Alert: React.FC<AlertType> = ({
  id,
  text,
  type,
  timeout = 4000,
  removeAlert,
}) => {
  const [isClosing, setIsClosing] = useState(false);

  const handleClose = useCallback(() => {
    setIsClosing(true);

    setTimeout(() => {
      if (removeAlert) {
        removeAlert(id);
      }
    }, 300);
  }, [id, removeAlert]);

  useEffect(() => {
    const timer = setTimeout(() => {
      handleClose();
    }, timeout);

    return () => clearTimeout(timer);
  }, [handleClose, timeout]);

  const typeStyles = {
    success: {
      iconBg: "bg-green-800",
      iconText: "text-green-200",
      alertBg: "bg-green-900",
      alertText: "text-green-400",
      svg: (
        <svg
          className="w-5 h-5"
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm3.707 8.207-4 4a1 1 0 0 1-1.414 0l-2-2a1 1 0 0 1 1.414-1.414L9 10.586l3.293-3.293a1 1 0 0 1 1.414 1.414Z" />
        </svg>
      ),
    },
    danger: {
      iconBg: "bg-red-800",
      iconText: "text-red-200",
      alertBg: "bg-red-900",
      alertText: "text-red-400",
      svg: (
        <svg
          className="w-5 h-5"
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm3.707 11.793a1 1 0 1 1-1.414 1.414L10 11.414l-2.293 2.293a1 1 0 0 1-1.414-1.414L8.586 10 6.293 7.707a1 1 0 0 1 1.414-1.414L10 8.586l2.293-2.293a1 1 0 0 1 1.414 1.414L11.414 10l2.293 2.293Z" />
        </svg>
      ),
    },
    primary: {
      iconBg: "bg-blue-800",
      iconText: "text-blue-200",
      alertBg: "bg-blue-900",
      alertText: "text-blue-400",
      svg: (
        <svg
          className="w-5 h-5"
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm3.707 8.207-4 4a1 1 0 0 1-1.414 0l-2-2a1 1 0 0 1 1.414-1.414L9 10.586l3.293-3.293a1 1 0 0 1 1.414 1.414Z" />
        </svg>
      ),
    },
  };

  const styles = typeStyles[type] || typeStyles.primary;

  return (
    <div
      className={`flex items-center w-full max-w-xs p-4 rounded-lg shadow text-gray-400 bg-gray-900 min-w-60 gap-2 transition-all duration-300 ease-in-out opacity-0 ${isClosing ? "opacity-0" : "opacity-100"
        }`}
      role="alert"
    >
      <div
        className={`inline-flex items-center justify-center flex-shrink-0 w-8 h-8 rounded-lg ${styles.iconBg} ${styles.iconText}`}
      >
        {styles.svg}
      </div>
      <div className="ms-3 text-sm font-normal">{text}</div>
      <button
        type="button"
        className="ms-auto -mx-1.5 -my-1.5 rounded-lg p-1.5 inline-flex items-center justify-center h-8 w-8 text-gray-500 hover:text-white bg-gray-900 hover:bg-gray-800"
        aria-label="Close"
        onClick={handleClose}
      >
        <span className="sr-only">Close</span>
        <svg
          className="w-3 h-3"
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 14 14"
        >
          <path
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
          />
        </svg>
      </button>
    </div>
  );
};

export default Alert;