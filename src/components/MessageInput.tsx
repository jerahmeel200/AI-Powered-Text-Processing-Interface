import { SendHorizonal } from "lucide-react";
import React, { useEffect, useRef } from "react";

interface MessageInputProps {
  value: string;
  onChange: (value: string) => void;
  onSend: () => void;
  isLoading: boolean;
}

const MessageInput: React.FC<MessageInputProps> = ({
  value,
  onChange,
  onSend,
  isLoading,
}) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [value]);

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      onSend();
    }
  };
  return (
    <div className="p-4  bg-black  text-gray-800  ">
      <div className="flex items-center gap-2 max-w-4xl mx-auto">
        <div className="flex-1 relative">
          <input
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="Type a message..."
            className="w-full sm:hidden rounded-lg p-3 pr-12 bg-gray-700  
                     focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400
                     h-11 transition-all duration-200"
          />

          <textarea
            ref={textareaRef}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type your message..."
            className="hidden sm:block w-full resize-none rounded-lg p-3 pr-12 bg-gray-900 text-amber-50
                     focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400
                      transition-all duration-200"
            rows={3}
          />
        </div>
        <button
          onClick={onSend}
          disabled={!value.trim() || isLoading}
          className="h-11 px-4 transition-all duration-200"
        >
          <SendHorizonal className="w-5 h-5 text-white" />
        </button>
      </div>
    </div>
  );
};

export default MessageInput;
