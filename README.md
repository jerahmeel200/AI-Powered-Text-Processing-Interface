# AI-Powered-Text-Processing-Interface


## Overview
This project is an AI-powered chat application that supports message translation, language detection, and summarization. It utilizes the `Chrome Language API` API for real-time processing of user messages.

## Features
- 🌍 **Language Detection**: Automatically detects the language of user input.
- 🔄 **Translation**: Translates messages into different languages.
- ✂️ **Summarization**: Summarizes long messages to provide concise insights.
- ⏳ **Loading States**: Indicates when translation or summarization is in progress.
- ⚠️ **Error Handling**: Provides error messages when an operation fails.

## Technologies Used
- **React** (with hooks)
- **TypeScript**
- **Chrome Language API**

## Installation
1. Clone the repository:
   ```sh
   git clone https://github.com/jerahmeel200/AI-Powered-Text-Processing-Interface
   ```
2. Navigate to the project folder:
   ```sh
   cd your-repo
   ```
3. Install dependencies:
   ```sh
   npm install
   ```

## Usage
1. Start the development server:
   ```sh
   npm run dev
   ```
2. Open your browser and visit `http://localhost:3000`
3. Enter a message in the chat input field and see the magic happen!

## API Capabilities
### Language Detection
Detects the language of the provided text and returns a confidence score.
```ts
const result = await window.ai.languageDetector.create().detect(text);
```

### Translation
Translates text from the detected language to the target language.
```ts
const translator = await window.ai.translator.create({ sourceLanguage: "en", targetLanguage: "es" });
const translatedText = await translator.translate(text);
```

### Summarization
Generates a concise summary of long messages.
```ts
const summarizer = await window.ai.summarizer.create({ type: "headline", format: "plain-text", length: "short" });
const summary = await summarizer.summarize(text);
```

## Project Structure
```
📂 your-repo/
├── 📁 src/
│   ├── 📁 components/        # React components
│   ├── 📁 hooks/             # Custom hooks
│   │   ├── useChat.ts        # Main hook handling AI interactions
│   ├── 📁 lib/               # Utility functions & types
│   ├── 📁 pages/             # Next.js or React pages
├── 📄 README.md              # Project documentation
├── 📄 package.json           # Dependencies and scripts
```

## Contribution
Contributions are welcome! To contribute:
1. Fork the repository
2. Create a new branch: `git checkout -b feature-branch`
3. Commit your changes: `git commit -m "Add new feature"`
4. Push to the branch: `git push origin feature-branch`
5. Open a pull request

## License
This project is licensed under the [MIT License](LICENSE).

## Contact
📧 Email: Jamicojerahmeel@gmail.com 
🐙 GitHub: [your-username](https://github.com/jerahmeel200)

---
*Happy Coding! 🚀*

