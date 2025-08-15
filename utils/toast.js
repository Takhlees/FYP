import { toast } from 'react-toastify';

// Track active toasts to prevent duplicates
let activeToastIds = new Set();

// Clear all active toasts
export const clearAllToasts = () => {
  activeToastIds.forEach(id => toast.dismiss(id));
  activeToastIds.clear();
};

// Check if a toast with the same message is already active
const isToastActive = (message) => {
  return Array.from(activeToastIds).some(id => {
    const toastElement = document.querySelector(`[data-toastid="${id}"]`);
    if (toastElement) {
      const messageElement = toastElement.querySelector('.font-semibold');
      return messageElement && messageElement.textContent === message;
    }
    return false;
  });
};

// Success toast
export const showSuccessToast = (message, description = null) => {
  // Prevent duplicate toasts
  if (isToastActive(message)) {
    return;
  }

  const toastId = toast.success(
    <div className="min-w-0">
      <div className="font-semibold text-white text-sm sm:text-base break-words">{message}</div>
      {description && <div className="text-gray-300 text-xs sm:text-sm mt-1 break-words">{description}</div>}
    </div>,
    {
      position: window.innerWidth < 768 ? "top-center" : "top-right",
      autoClose: 4000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      theme: "dark",
      icon: "✓",
      className: "max-w-[90vw] sm:max-w-md",
      toastClassName: "max-w-[90vw] sm:max-w-md",
    }
  );
  
  activeToastIds.add(toastId);
  return toastId;
};

// Error toast
export const showErrorToast = (message, description = null) => {
  // Prevent duplicate toasts
  if (isToastActive(message)) {
    return;
  }

  const toastId = toast.error(
    <div className="min-w-0">
      <div className="font-semibold text-white text-sm sm:text-base break-words">{message}</div>
      {description && <div className="text-gray-300 text-xs sm:text-sm mt-1 break-words">{description}</div>}
    </div>,
    {
      position: window.innerWidth < 768 ? "top-center" : "top-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      theme: "dark",
      icon: "✕",
      className: "max-w-[90vw] sm:max-w-md",
      toastClassName: "max-w-[90vw] sm:max-w-md",
    }
  );
  
  activeToastIds.add(toastId);
  return toastId;
};

// Warning toast
export const showWarningToast = (message, description = null) => {
  // Prevent duplicate toasts
  if (isToastActive(message)) {
    return;
  }

  const toastId = toast.warning(
    <div className="min-w-0">
      <div className="font-semibold text-white text-sm sm:text-base break-words">{message}</div>
      {description && <div className="text-gray-300 text-xs sm:text-sm mt-1 break-words">{description}</div>}
    </div>,
    {
      position: window.innerWidth < 768 ? "top-center" : "top-right",
      autoClose: 4000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      theme: "dark",
      icon: "⚠️",
      className: "max-w-[90vw] sm:max-w-md",
      toastClassName: "max-w-[90vw] sm:max-w-md",
    }
  );
  
  activeToastIds.add(toastId);
  return toastId;
};

// Loading toast
export const showLoadingToast = (message, description = null) => {
  // Prevent duplicate loading toasts
  if (isToastActive(message)) {
    return;
  }

  const toastId = toast.info(
    <div className="flex items-center min-w-0">
      <div className="mr-3 flex-shrink-0">
        <div className="animate-spin rounded-full h-5 w-5 sm:h-6 sm:w-6 border-2 border-white border-t-transparent"></div>
      </div>
      <div className="min-w-0 flex-1">
        <div className="font-semibold text-white text-sm sm:text-base break-words">{message}</div>
        <div className="text-gray-300 text-xs sm:text-sm mt-1 break-words">Processing your request...</div>
      </div>
    </div>,
    {
      position: window.innerWidth < 768 ? "top-center" : "top-right",
      theme: "dark",
      icon: false,
      autoClose: 3000, // 3 second timeout
      className: "max-w-[90vw] sm:max-w-md",
      toastClassName: "max-w-[90vw] sm:max-w-md",
    }
  );
  
  activeToastIds.add(toastId);
  return toastId;
};

// Update loading toast to success/error
export const updateToast = (toastId, type, message, description = null) => {
  console.log("updateToast called with:", { toastId, type, message, description });
  
  const toastConfig = {
    render: (
      <div className="min-w-0">
        <div className="font-semibold text-white text-sm sm:text-base break-words">{message}</div>
        {description && <div className="text-gray-300 text-xs sm:text-sm mt-1 break-words">{description}</div>}
      </div>
    ),
    type: type,
    isLoading: false,
    autoClose: type === 'error' ? 5000 : 4000,
    icon: type === 'success' ? "✓" : type === 'error' ? "✕" : false,
    className: "max-w-[90vw] sm:max-w-md",
    toastClassName: "max-w-[90vw] sm:max-w-md",
  };

  console.log("Toast config:", toastConfig);
  console.log("Calling toast.update with ID:", toastId);
  
  try {
    toast.update(toastId, toastConfig);
    console.log("toast.update called successfully");
    
    // Remove from active toasts when updated
    if (activeToastIds.has(toastId)) {
      activeToastIds.delete(toastId);
    }
  } catch (error) {
    console.error("Error in toast.update:", error);
    throw error;
  }
};

// Default toast (for backward compatibility)
export const showToast = (message, type = 'success', description = null) => {
  switch (type) {
    case 'error':
      return showErrorToast(message, description);
    case 'warning':
      return showWarningToast(message, description);
    case 'loading':
      return showLoadingToast(message, description);
    default:
      return showSuccessToast(message, description);
  }
}; 