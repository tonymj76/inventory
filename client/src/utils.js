import toastr from 'toastr';

// Formats money value to Naira
export const formatNaira = (value) => {
  return Number(value).toLocaleString('en-NG', {
    style: 'currency',
    currency: 'NGN',
  });
};

// Formats date from date/datetime string
export const formatDate = (value) => {
  if (!value) return value;
  return new Date(value).toDateString();
};

export const showToast = (toastType, message, title) => {
  switch (toastType) {
  case 'success':
    return toastr.success(message, title, {timeOut: 3000});
  case 'info':
    return toastr.info(message, title, {timeOut: 4000});
  case 'warning':
    return toastr.warning(message, title, {timeOut: 5000});
  case 'error':
    return toastr.error(message, title, {timeOut: 6000});
  }
};
