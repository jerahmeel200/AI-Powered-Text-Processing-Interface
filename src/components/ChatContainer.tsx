import React, { useState } from "react";
import { Message as MessageType } from "../lib/types";
 
import { Bot } from "lucide-react";
import { LanguageSelector } from "./LanguegeSelector";
import { formatTimestamp } from "../utils/helper";

interface MessageProps {
  message: MessageType;
  onTranslate: (
    id: string,
    lang: string,
    textToTranslate?: string
  ) => Promise<void>;
  onSummarize: (id: string) => Promise<void>;
}

export const Message: React.FC<MessageProps> = ({
  message,
  onTranslate,
  onSummarize,
}) => {
  const isUser = message.sender === "user";
  const [targetLanguage, setTargetLanguage] = useState("");
  const [isTranslating, setIsTranslating] = useState(false);
  const [isSummarizing, setIsSummarizing] = useState(false);
  const [currentTranslationId, setCurrentTranslationId] = useState<
    string | null
  >(null);

  const languageMap: { [key: string]: string } = {
    en: "English",
    es: "Spanish",
    fr: "French",
    pt: "Portuguese",
    ru: "Russian",
    tr: "Turkish",
  };

  const isNotEnglish = message.detectedLanguage !== "en";
  const isLongMessage = message.text.length > 150;

  const handleSummarize = async () => {
    setIsSummarizing(true);
    setCurrentTranslationId(message.id);
    await onSummarize(message.id);
    setIsSummarizing(false);
  };

  const handleTranslateSummary = async () => {
    if (message.summary) {
      setIsTranslating(true);
      setCurrentTranslationId(message.id);
      await onTranslate(message.id, targetLanguage, message.summary);
      setIsTranslating(false);
    }
  };

  const handleTranslate = async () => {
    setIsTranslating(true);
    setCurrentTranslationId(message.id);
    message.translation = "";
    await onTranslate(message.id, targetLanguage);
    setIsTranslating(false);
  };

  const handleTranslateToEnglish = async () => {
    setIsTranslating(true);
    setCurrentTranslationId(message.id);
    await onTranslate(message.id, "en");
    setIsTranslating(false);
  };

  return (
    <div className="w-full mb-6 text-sm">
      <div
        className={`flex ${
          isUser ? "justify-end" : "justify-start"
        } mb-2 animate-slideIn`}
      >
        <div
          className={`
          relative max-w-[80%] rounded-2xl p-4 
          ${
            isUser
              ? "bg-gradient-to-br from-blue-500 to-blue-600 text-white ml-auto rounded-br-none"
              : "bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800 rounded-bl-none"
          } shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all
        `}
        >
          <div className="flex items-start justify-between gap-3">
            <p
              className={`text-${
                isUser ? "white" : "gray-800 dark:text-white"
              } leading-relaxed`}
            >
              {message.text}
            </p>
            <span className="text-xs opacity-75 whitespace-nowrap mt-1 font-medium">
              {formatTimestamp(String(message.timestamp))}
            </span>
          </div>
        </div>
      </div>

      {isUser && (
        <div className="mt-2 flex flex-col items-end gap-2">
          <div className="flex items-center gap-2">
            {message.detectedLanguageName && (
              <div className=" text-[10px] font-bold rounded-full  text-green-800 ">
                {message.detectedLanguageName}
              </div>
            )}
            {!(
              (isNotEnglish && isLongMessage) ||
              (isLongMessage && !message.summary)
            ) && (
              <LanguageSelector
                selectedLanguage={targetLanguage}
                onChange={(lang) => {
                  setTargetLanguage(lang);
                  message.translation = "";
                }}
                disabledLanguages={
                  message.detectedLanguage ? [message.detectedLanguage] : []
                }
              />
            )}
            {isNotEnglish && isLongMessage ? (
              <>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  This message cannot be summarized from{" "}
                  {message.detectedLanguageName}.Please translate to English and
                  re-send.
                </p>
                <button
                  onClick={handleTranslateToEnglish}
                  className="p-1 bg-blue-500 text-white rounded-lg text-xs"
                  disabled={isTranslating}
                >
                  Translate to English
                </button>
              </>
            ) : isNotEnglish && !isLongMessage ? (
              <button
                onClick={handleTranslate}
                className="p-1 bg-green-500 text-white rounded-lg text-xs"
                disabled={isTranslating}
              >
                eme;lem
              </button>
            ) : (
              <>
                {message.text.length > 150 ? (
                  <>
                    {!message.summary && (
                      <>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          This message is too long, please summarize
                        </p>
                        <button
                          onClick={handleSummarize}
                          className="p-1 bg-blue-500 text-white rounded-lg text-xs cursor-pointer"
                          disabled={isSummarizing}
                        >
                          Summarize
                        </button>
                      </>
                    )}
                    {message.summary && (
                      <button
                        onClick={handleTranslateSummary}
                        className="p-1 bg-blue-500 text-white rounded-lg text-xs cursor-pointer"
                        disabled={isTranslating}
                      >
                        Translate Summary
                      </button>
                    )}
                  </>
                ) : (
                  <button
                    onClick={handleTranslate}
                    className="p-1 bg-green-500 text-white rounded-lg text-xs cursor-pointer"
                    disabled={isTranslating}
                  >
                    Translate
                  </button>
                )}
              </>
            )}
          </div>
        </div>
      )}

      {(isTranslating || isSummarizing) &&
        currentTranslationId === message.id && (
          <div className="flex items-start gap-3 mt-4">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center shadow-md">
              <Bot className="w-5 h-5 text-white" />
            </div>
            <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400 animate-pulse bg-green-50 dark:bg-green-900/20 py-2 px-4 rounded-lg">
              <span>
                {isSummarizing
                  ? "Bot is summarizing..."
                  : "Bot is translating..."}
              </span>
              <div className="flex space-x-1">
                <div
                  className="w-2 h-2 bg-green-500 rounded-full animate-bounce"
                  style={{ animationDelay: "0s" }}
                />
                <div
                  className="w-2 h-2 bg-green-500 rounded-full animate-bounce"
                  style={{ animationDelay: "0.2s" }}
                />
                <div
                  className="w-2 h-2 bg-green-500 rounded-full animate-bounce"
                  style={{ animationDelay: "0.4s" }}
                />
              </div>
            </div>
          </div>
        )}

      {(message.translation || message.summary) && !isTranslating && (
        <div className={`flex justify-${isUser ? "start" : "end"} mt-4`}>
          <div className="max-w-[75%] space-y-3 rounded-xl p-4 bg-gradient-to-br from-pink-500 to-pink-600 text-white shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all">
            {message.translation && (
              <div className="animate-fadeIn">
                <p className="text-sm font-medium mb-1 text-white/80">
                  Translation to
                  <span className="ml-1">
                    {currentTranslationId === message.id && isNotEnglish
                      ? "English"
                      : languageMap[targetLanguage]}
                  </span>
                </p>
                <p className="text-sm leading-relaxed">{message.translation}</p>
              </div>
            )}

            {message.summary && (
              <div className="animate-fadeIn pt-3 border-t border-white/20">
                <p className="text-sm font-medium mb-1 text-white/80">
                  Summary
                </p>
                <p className="text-sm leading-relaxed">{message.summary}</p>
                {message.translatedSummary && (
                  <div className="mt-2  bg-gradient-to-br from-green-700 to-green-600 p-2 rounded">
                    <p className="text-sm font-medium mb-1 text-white/80 ">
                      Translated Summary to {languageMap[targetLanguage]}
                    </p>
                    <p className="text-sm leading-relaxed">
                      {message.translatedSummary}
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
