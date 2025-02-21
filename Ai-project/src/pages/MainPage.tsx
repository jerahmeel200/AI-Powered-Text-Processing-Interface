import React, { useEffect, useRef, useState } from 'react'
import MessageInput from '../components/MessageInput'
import { useChat } from '../hooks/useChat'
import { Bot, User } from 'lucide-react'
import { Message } from '../components/ChatContainer'
import Welcome from '../components/Welcome'
 
// import <Message></Message> from '../components/LanguegeSelector'


const MainPage = () => {
    const  [inputValue,  setInputValue] = useState("")
    const  [isTyping,  setIsTyping] = useState(false)

     const {
      messages,
		isLoading,
		error,
		clearError,
		sendMessage,
		translateMessage,
		summarizeMessage,
     } = useChat()


const messagesEndRef = useRef<HTMLDivElement | null>(null)

useEffect(()=>{
  messagesEndRef.current?.scrollIntoView({behavior:"smooth"})
}, [messages])


useEffect(()=>{
  if(error){
    const timer = setTimeout(()=>{
      clearError()
    }, 3000)

    return ()=> clearTimeout(timer)
  }
}, [clearError, error])

const handleSendMessage = async ()=>{
  if(inputValue.trim()){
setIsTyping(true)
await sendMessage(inputValue)
setInputValue("")
setIsTyping(false)
  }
}

const getTypingMessage = () => {
  if (isTyping) {
    if (messages[messages.length - 1]?.text.length > 150) {
      return "summarizing...";
    }
    return "translating...";
  }
  return "";
};


   return (
      <div className="flex flex-col h-screen bg-black         ">
        <div className="w-full bg-black  backdrop-blur-md border-b border-gray-200 dark:border-gray-700 shadow-lg">
          <div className="max-w-6xl mx-auto p-4">
            <div className="relative flex flex-col sm:flex-row items-center gap-4">
              <div className="absolute right-0 top-0 sm:hidden">
                {/* <ThemeToggle /> */}
              </div>
              <div className="hidden sm:block border border-gray-200 rounded-xl dark:border-gray-700 shadow-sm">
                {/* <ThemeToggle /> */}
              </div>
              <header className="flex-1 text-center">
                <h1 className="text-3xl font-bold text-gray-200 bg-black   mb-2">
                Language Translator 
                </h1>
             
              </header>
            </div>
          </div>
        </div>
  
        <div
          className={`${
            messages.length === 0 && "shadow-lg  rounded-2xl  my-2"
          } flex-1 overflow-hidden relative max-w-6xl w-full mx-auto p-4`}
        >
          <div className="h-full bg-transparent backdrop-blur-md rounded-2xl  border-gray-200 dark:border-gray-700">
            <div className="h-full overflow-y-auto p-6 custom-scrollbar">
              {messages.length === 0 ? (
                <Welcome />

                
              ) : (
                <div className="space-y-6">
                  {messages.map((message, index) => (
                    <div
                      key={message.id}
                      className="animate-slideIn"
                      style={{
                        animationDelay: `${index * 0.1}s`,
                      }}
                    >
                      <div
                        className={`flex items-start gap-3 ${
                          message.sender === "user"
                            ? "flex-row-reverse"
                            : "flex-row"
                        }`}
                      >
                        <div
                          className={`w-8 h-8 rounded-full bg-gradient-to-br hidden sm:inline-flex ${
                            message.sender === "user"
                              ? "from-gray-500 to-gray-400"
                              : "from-green-500 to-green-600"
                          } flex items-center justify-center shadow-md`}
                        >
                          {message.sender === "user" ? (
                            <User className="w-5 h-5 text-white" />
                          ) : (
                            <Bot className="w-5 h-5 text-white" />
                          )}
                        </div>
                        <div className="flex-1">
                          <Message
                            message={message}
                            onTranslate={translateMessage}
                            onSummarize={summarizeMessage}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                  {isTyping && (
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center shadow-md">
                      <Bot className="w-5 h-5 text-white" />
                      </div>
                      <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400 animate-pulse bg-green-50 dark:bg-green-900/20 py-2 px-4 rounded-lg">
                      <span>{getTypingMessage()}</span>
                      <div className="flex items-center justify-center">
                        <svg
                        className="w-5 h-5 text-green-500 animate-spin"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                        </svg>
                      </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          </div>
        </div>
  
        {error && (
          <div className="fixed top-20 left-1/2 transform -translate-x-1/2 w-full max-w-md px-4">
            <div className="p-4 bg-red-100 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-xl animate-shake">
              <p className="text-red-600 dark:text-red-400 text-sm">{error}</p>
            </div>
          </div>
        )}
  
        <div className="w-full bg-black   backdrop-blur-md border-t border-gray-400  shadow-lg">
          <div className="max-w-6xl mx-auto p-4">
            <MessageInput
              value={inputValue}
              onChange={setInputValue}
              onSend={handleSendMessage}
              isLoading={isLoading}
            />
          </div>
        </div>
   
      </div>
    );
}

export default MainPage