export interface Message{
    id: string
    text: string 
    sender: string
    timestamp: string
    detectedLanguage?: string
    detectedLanguageName?: string
    isTranslating?: boolean
    isSummarizing?: boolean
    translation?: string
    translatedSummary?: string;
	summary?: string;
	error?: string;
}


export interface Language {
	code: string;
	name: string;
}