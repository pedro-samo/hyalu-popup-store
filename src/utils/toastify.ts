import type { ToastOptions } from "react-toastify";
import { toast } from "react-toastify";

type ToastMessageType = "success" | "error" | "warning" | "info";

export const toastMessage = (message: string, type: ToastMessageType = "info", options?: ToastOptions) => {
  const defaultOptions: ToastOptions = {
    position: "top-right",
    autoClose: 3000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    ...options
  };

  switch (type) {
    case "success":
      return toast.success(message, defaultOptions);
    case "error":
      return toast.error(message, defaultOptions);
    case "warning":
      return toast.warning(message, defaultOptions);
    case "info":
      return toast.info(message, defaultOptions);
    default:
      return toast(message, defaultOptions);
  }
};
