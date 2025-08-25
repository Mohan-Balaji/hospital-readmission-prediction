import { Toaster } from 'sonner';

const ToastProvider = () => {
  return (
    <Toaster
      position="top-right"
      richColors
      closeButton
      duration={4000}
    />
  );
};

export default ToastProvider;
