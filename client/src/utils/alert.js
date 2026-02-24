import Swal from "sweetalert2";

export const showAlert = (message, type = "error") => {
  return Swal.fire({
    text: message,
    icon: type,
    confirmButtonColor: "#4f46e5",
    confirmButtonText: "OK",
    background: "#1e293b",
    color: "#f8fafc",
  });
};

export const showSuccess = (message) => {
  return Swal.fire({
    text: message,
    icon: "success",
    confirmButtonColor: "#10b981",
    confirmButtonText: "OK",
    background: "#1e293b",
    color: "#f8fafc",
  });
};

export const showConfirm = async (message) => {
  const result = await Swal.fire({
    text: message,
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#4f46e5",
    cancelButtonColor: "#ef4444",
    confirmButtonText: "OK",
    cancelButtonText: "Hủy",
    background: "#1e293b",
    color: "#f8fafc",
  });
  return result.isConfirmed;
};
