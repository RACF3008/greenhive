const ErrorMessage = ({ message }: { message: string }) => {
  return (
    <div className="fixed top-4 left-1/2 transform -translate-x-1/2 bg-red-600 text-white px-6 py-3 rounded-md shadow-md z-50 transition-opacity duration-300">
      {message}
    </div>
  );
};

export default ErrorMessage;
