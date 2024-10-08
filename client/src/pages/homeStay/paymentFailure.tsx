

const paymentFailure = () => {
    const errorMessage = 'ไม่สามารถดำเนินการชำระเงินได้ในขณะนี้ กรุณาลองใหม่อีกครั้งภายหลัง';
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-red-100 p-4">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
        <svg
          className="w-16 h-16 text-red-500 mx-auto mb-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
        <h1 className="text-2xl font-bold text-center text-red-800">
          การชำระเงินล้มเหลว!
        </h1>
        <p className="mt-4 text-center text-gray-600">{errorMessage}</p>
        <div className="mt-6 text-center">
          <button
            onClick={() => (window.location.href = "/")}
            className="bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500"
          >
            กลับสู่หน้าหลัก
          </button>
        </div>
      </div>
    </div>
  );
};

export default paymentFailure;
