import { Message } from "./../lib/types";
import { useCallback, useState } from "react";

declare global {
  interface Window {
    ai: any;
  }
}

export const useChat = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isBrowser = typeof window !== "undefined";

  const isSummariser =
    isBrowser && "ai" in window && "summarizer" in (window.ai as any);
  const isTranslator =
    isBrowser && "ai" in window && "translator" in (window.ai as any);
  const isLanguegeDetector =
    isBrowser && "ai" in window && "languageDetector" in (window.ai as any);

  const detectLanguage = async (text: string) => {
    if (!isLanguegeDetector) {
      console.warn("Languege is not supported");

      return null;
    }

    try {
      const capabilities = await window.ai.languageDetector.capabilities();
      if (capabilities.available === "no") {
        console.warn("Language Detector API is not found");
        return null;
      }

      const detector = await window.ai.languageDetector.create();
      const result = await detector.detect(text);
      console.log("Language Detection Result:", result);
      return result[0];
    } catch (error) {
      console.error("Error durring detection", error);
    }
  };

  const sendMessage = async (text: string) => {
    setLoading(true);
    setError(null);

    try {
      const detectionResult = await detectLanguage(text);
      const detectedLanguageCode = detectionResult?.detectLanguage || "en";
      const confidence = detectionResult?.confidence || 0;

      const languageMap: { [key: string]: string } = {
        en: "English",
        es: "Spanish",
        fr: "French",
        ru: "Russian",
        tr: "Turkish",
      };

      const detectedLanguageName =
        languageMap[detectedLanguageCode] || detectedLanguageCode;

      const userMessage: Message = {
        id: Date.now().toString(),
        text,
        sender: "user",
        timestamp: new Date().toISOString(),
        detectedLanguage: detectedLanguageCode,
        detectedLanguageName: `i am (${(confidence * 100).toFixed(
          1
        )}% ) sure that this is ${detectedLanguageName}`,
        isTranslating: text.length <= 150,
        isSummarizing: text.length > 150,
      };

      setMessages((prev) => [...prev, userMessage]);
      if (text.length > 150) {
        await summarizeMessage(userMessage.id);
      } else {
        await translateMessage(userMessage.id, "es");
      }
    } catch (error: any) {
      console.error("Error during summarization or translation", error);
      setError(error.message || "Failed to process message");
    } finally {
      setLoading(false);
    }
  };

  const translateMessage = useCallback(
    async (messageId: string, targetLang: string, textToTranslate?: string) => {
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === messageId ? { ...msg, isTranslating: true } : msg
        )
      );

      try {
        const message = messages.find((m) => m.id === messageId);
        if (!message) return;

        const text = textToTranslate || message.text;
        const detectedLanguageCode = message.detectedLanguage || "en";

        // console.log(
        // 	"Detected Language Code in translateMessage:",
        // 	detectedLanguageCode
        // );
        // console.log("Target Language:", targetLang);
        if (detectedLanguageCode === targetLang) {
          // console.log(
          // 	"Detected language matches target language. Skipping translation."
          // );
          setMessages((prev) =>
            prev.map((msg) =>
              msg.id === messageId
                ? {
                    ...msg,
                    isTranslating: false,
                    translation: textToTranslate ? msg.translation : text,
                    translatedSummary: textToTranslate
                      ? text
                      : msg.translatedSummary,
                  }
                : msg
            )
          );
          return;
        }

        if (isTranslator) {
          const capabilities = await window.ai.translator.capabilities();
          // console.log("Translation Capabilities:", capabilities);

          const languagePairStatus = capabilities.languagePairAvailable(
            detectedLanguageCode,
            targetLang
          );
          // console.log("Language Pair Status:", languagePairStatus);

          if (languagePairStatus === "no") {
            console.warn(
              `Translation from  ${detectedLanguageCode} to ${targetLang} is not supported`
            );

            setError(`translation to ${targetLang} is not supported.`);
            return;
          }

          const translator = await window.ai.translator.create({
            sourceLanguage: detectedLanguageCode,
            targetLanguage: targetLang,
          });

          const translatedText = await translator.translate(text);

          setMessages((prev) =>
            prev.map((msg) =>
              msg.id === messageId
                ? {
                    ...msg,
                    isTranslating: false,
                    translation: textToTranslate
                      ? msg.translation
                      : translatedText,
                    translatedSummary: textToTranslate
                      ? translatedText
                      : msg.translatedSummary,
                  }
                : msg
            )
          );
        } else {
          console.warn("Translator API is not supported in this browser.");
          setError("Translator is not supported in your browser.");
        }
      } catch (error: any) {
        console.error("Error during translation:", error);
        setError(error.message);
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === messageId
              ? { ...msg, isTranslating: false, error: error.message }
              : msg
          )
        );
      }
    },
    [messages]
  );

  const summarizeMessage = useCallback(async (messageId: string) => {
    setMessages((prev) =>
      prev.map((msg) =>
        msg.id === messageId ? { ...msg, isSummarizing: true } : msg
      )
    );

    try {
      const message = messages.find((m) => m.id === messageId);
      if (!message) return

      if (isSummariser)
    } catch (error) {}
  });
};
