import React, { useState } from "react";

interface Window {
  ai: {
    languageDetector: {
      create: () => Promise<{ detect: (text: string) => Promise<{ detectedLanguage: string }[]> }>;
    };
    summarizer: {
      create: () => Promise<{ summarize: (text: string) => Promise<string> }>;
    };
    translator: {
      create: () => Promise<{ translate: (text: string, targetLang: string) => Promise<string> }>;
    };
  };
}

declare let window: Window;

const AiTextProcessor: React.FC = () => {
  const [inputText, setInputText] = useState("");
  const [messages, setMessages] = useState<{ text: string; type: string; language?: string }[]>([]);
  const [selectedLanguage, setSelectedLanguage] = useState("en");
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    if (!inputText.trim()) return;
    setMessages((prev) => [...prev, { text: inputText, type: "user" }]);
    setLoading(true);

    try {
      // Detect Language
      const detectedLang = await detectLanguage(inputText);
      const newMessage = { text: inputText, type: "bot", language: detectedLang };
      setMessages((prev) => [...prev, newMessage]);
    } catch (error) {
      console.error("Error detecting language:", error);
    }

    setInputText("");
    setLoading(false);
  };

  const detectLanguage = async (text: string) => {
    if ("ai" in window && "languageDetector" in window.ai) {
      const detector = await window.ai.languageDetector.create();
      const results = await detector.detect(text);
      return results[0]?.detectedLanguage || "unknown";
    }
    return "unsupported";
  };

  const summarizeText = async (text: string) => {
    if (text.length <= 150) return; // No need to summarize if the text is short

    try {
      if ("ai" in window && "summarizer" in window.ai) {
        const summarizer = await window.ai.summarizer.create();
        const summary = await summarizer.summarize(text);
        setMessages((prev) => [...prev, { text: summary, type: "bot" }]);
      }
    } catch (error) {
      console.error("Error summarizing text:", error);
    }
  };

  const translateText = async (text: string, targetLang: string) => {
    try {
      if ("ai" in window && "translator" in window.ai) {
        const translator = await window.ai.translator.create();
        const translation = await translator.translate(text, targetLang);
        setMessages((prev) => [...prev, { text: translation, type: "bot" }]);
      }
    } catch (error) {
      console.error("Error translating text:", error);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      {/* Chat Output Area */}
      <div className="flex-grow p-4 overflow-auto">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`p-3 mb-2 rounded-lg ${
              msg.type === "user" ? "bg-blue-500 text-white ml-auto" : "bg-gray-300 text-black"
            }`}
          >
            {msg.text}
            {msg.language && <p className="text-sm text-gray-600">Detected: {msg.language}</p>}

            {/* Summarize Button (Only for English and if text > 150 chars) */}
            {msg.language === "en" && msg.text.length > 150 && (
              <button
                className="mt-2 bg-green-500 text-white px-3 py-1 rounded text-sm"
                onClick={() => summarizeText(msg.text)}
              >
                Summarize
              </button>
            )}

            {/* Language Selector & Translate Button */}
            <div className="mt-2 flex gap-2 items-center">
              <select
                className="border rounded p-1 text-sm"
                value={selectedLanguage}
                onChange={(e) => setSelectedLanguage(e.target.value)}
              >
                <option value="en">English</option>
                <option value="pt">Portuguese</option>
                <option value="es">Spanish</option>
                <option value="ru">Russian</option>
                <option value="tr">Turkish</option>
                <option value="fr">French</option>
              </select>
              <button
                className="bg-purple-500 text-white px-3 py-1 rounded text-sm"
                onClick={() => translateText(msg.text, selectedLanguage)}
              >
                Translate
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Input Area */}
      <div className="p-4 flex items-center bg-white border-t">
        <textarea
          className="flex-grow border rounded-md p-2 mr-2"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Type here..."
        />
        <button className="bg-blue-500 text-white p-2 rounded-md" onClick={handleSend} disabled={loading}>
          {loading ? "..." : "Send"}
        </button>
      </div>
    </div>
  );
};

export default AiTextProcessor;
