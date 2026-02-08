import SweetAlert2 from "sweetalert2";

type MessageModalIcon = "success" | "error" | "warning" | "info" | "question";

export const messageModal = (message: string, icon: MessageModalIcon, title?: string) => {
  return SweetAlert2.fire({
    title: title,
    text: String(message),
    icon: icon,
    confirmButtonText: "Ok"
  });
};
