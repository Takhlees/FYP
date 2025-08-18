import { toast } from 'react-toastify';
let activeToastIds = new Set();

export const clearAllToasts = () => {
  activeToastIds.forEach(id => toast.dismiss(id));
  activeToastIds.clear();
};

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

export const showSuccessToast = (message, description = null) => {
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
      autoClose: 2000,
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

export const showErrorToast = (message, description = null) => {
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
      autoClose: 2000,
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

export const showWarningToast = (message, description = null) => {

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
      autoClose: 2000,
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

export const showLoadingToast = (message, description = null) => {
  if (isToastActive(message)) {
    return;
  }

  const toastId = toast.loading(
    <div className="flex items-center min-w-0">
      <div className="mr-3 flex-shrink-0">
        <div className="custom-spin lg"></div>
      </div>
      <div className="min-w-0 flex-1">
        <div className="font-semibold text-white text-sm sm:text-base break-words">{message}</div>
        {description && <div className="text-gray-300 text-xs sm:text-sm mt-1 break-words">{description}</div>}
      </div>
    </div>,
    {
      position: window.innerWidth < 768 ? "top-center" : "top-right",
      theme: "dark",
      icon: false,
      autoClose: false,
      className: "max-w-[90vw] sm:max-w-md",
      toastClassName: "max-w-[90vw] sm:max-w-md",
    }
  );
  
  activeToastIds.add(toastId);
  return toastId;
};

export const updateToast = (toastId, type, message, description = null) => {
  const toastConfig = {
    render: (
      <div className="min-w-0">
        <div className="font-semibold text-white text-sm sm:text-base break-words">{message}</div>
        {description && <div className="text-gray-300 text-xs sm:text-sm mt-1 break-words">{description}</div>}
      </div>
    ),
    type: type,
    isLoading: false,
    autoClose: 2000,
    icon: type === 'success' ? "✓" : type === 'error' ? "✕" : false,
    className: "max-w-[90vw] sm:max-w-md",
    toastClassName: "max-w-[90vw] sm:max-w-md",
  };
  
  try {
    toast.update(toastId, toastConfig);
    
    if (activeToastIds.has(toastId)) {
      activeToastIds.delete(toastId);
    }
  } catch (error) {
    console.error("Error in toast.update:", error);
    throw error;
  }
};

// Dismiss a specific toast
export const dismissToast = (toastId) => {
  if (toastId && activeToastIds.has(toastId)) {
    toast.dismiss(toastId);
    activeToastIds.delete(toastId);
  }
};

// Update loading toast message while keeping the spinner
export const updateLoadingToast = (toastId, message) => {
  if (toastId && activeToastIds.has(toastId)) {
    toast.update(toastId, {
      render: (
        <div className="flex items-center min-w-0">
          <div className="mr-3 flex-shrink-0">
            <div className="custom-spin lg"></div>
          </div>
          <div className="min-w-0 flex-1">
            <div className="font-semibold text-white text-sm sm:text-base break-words">{message}</div>
            <div className="text-gray-300 text-xs sm:text-sm mt-1 break-words">Processing your request...</div>
          </div>
        </div>
      ),
      isLoading: true,
      autoClose: false
    });
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