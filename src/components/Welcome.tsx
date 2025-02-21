const Welcome = () => {
  return (
    <div className="h-full flex flex-col items-center justify-center relative overflow-hidden p-4">
      <div className="text-center space-y-4 sm:space-y-6 w-full max-w-2xl mx-auto px-2 sm:px-4 relative z-10">
        <div className="space-y-2 sm:space-y-3">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold animate-gradient-x text-gray-400    px-2">
            Hello, Welcome 👋🏿
          </h2>
          <div className="flex items-center justify-center gap-2 text-gray-600 dark:text-gray-300">
            <p className="text-base sm:text-lg h-6 overflow-hidden"></p>
          </div>
        </div>

        <div className="relative pt-2">
          <p className="text-sm sm:text-base text-gray-500 dark:text-gray-400 animate-float px-4">
            Start a conversation below 👇🏿
          </p>
          <div className="absolute left-1/2 transform -translate-x-1/2 mt-2">
            <div className="w-4 h-4 sm:w-5 sm:h-5 animate-bounce">↓</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Welcome;
