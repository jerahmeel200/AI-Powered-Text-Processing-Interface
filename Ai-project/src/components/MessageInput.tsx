import { Send, SendHorizonal } from "lucide-react";
import React from "react";

const MessageInput = () => {
  return (
	<div className="p-4 border-t dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-800 dark:text-white">
			<div className="flex items-center gap-2 max-w-4xl mx-auto">
				<div className="flex-1 relative">
					<input
						type="text"
						// value={value}
						// onChange={(e) => onChange(e.target.value)}
						placeholder="Type a message..."
						className="w-full sm:hidden rounded-lg p-3 pr-12 bg-gray-100 dark:bg-gray-700
                     focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400
                     h-11 transition-all duration-200"
					/>

					<textarea
						// ref={textareaRef}
						// value={value}
						// onChange={(e) => onChange(e.target.value)}
						// onKeyPress={handleKeyPress}
						placeholder="Type your message here... Press Shift + Enter for a new line"
						className="hidden sm:block w-full resize-none rounded-lg p-3 pr-12 bg-gray-100 dark:bg-gray-700
                     focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400
                      transition-all duration-200"
						rows={3}
					/>
				</div>
				<button
					// onClick={onSend}
					// disabled={!value.trim() || isLoading}
					className="h-11 px-4 transition-all duration-200"
				>
				 
						<Send className="w-5 h-5" />
				</button>
			</div>
		</div>
  );
};

export default MessageInput;
