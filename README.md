# English Dictionary

A simple web-based English dictionary built with HTML, CSS, and vanilla JavaScript. Type a word, press Enter, and get its meaning, an example sentence, pronunciation, and synonyms.

## Features

- Search any English word and get its definition
- Part of speech and phonetic spelling
- Example sentence (searches all definitions for the first available example)
- Pronunciation audio, with an automatic fallback to the browser's built-in voice when no recording is available
- Clickable synonyms that run a new search
- Clear button (✕) to reset the search
- Friendly messages for loading, "word not found", and network errors

## Demo

1. Type a word such as `happy` or `hello` into the search box.
2. Press **Enter**.
3. Click the speaker icon to hear the pronunciation.
4. Click any synonym to look it up.

## Project Structure

```
dictionary/
├── index.html   # Page layout
├── style.css    # Styling, hover and playing effects
├── script.js    # Search, API handling, audio, synonyms
└── README.md    # Project documentation
```

## Getting Started

### Prerequisites

- A modern web browser (Chrome, Edge, Firefox, or Safari)
- An internet connection (the app fetches data from an API and loads icons from a CDN)

### Run Locally

1. Download or clone this project into a folder.
2. Make sure `index.html`, `style.css`, and `script.js` are all in the same folder.
3. Open `index.html` in your browser.

For best results, use a local server such as the **Live Server** extension in VS Code. Some browsers restrict audio and network requests on files opened directly from disk.

## How It Works

1. The user types a word and presses Enter.
2. `script.js` sends a request to the Free Dictionary API:
   ```
   https://api.dictionaryapi.dev/api/v2/entries/en/<word>
   ```
3. The JSON response is parsed, and the page is filled in with:
   - The word, part of speech, and phonetic text
   - The first definition
   - The first example found across all definitions
   - Up to five synonyms
   - A list of available audio recordings
4. When the speaker icon is clicked, the app tries each audio recording in turn. If none play, it uses the browser's speech synthesis (`SpeechSynthesisUtterance`) instead.

## Technologies Used

- **HTML5** for structure
- **CSS3** for layout, hover effects, and the pulsing "playing" animation
- **JavaScript (ES6+)** using `fetch`, `async/await`, and the Web Speech API
- [Free Dictionary API](https://dictionaryapi.dev/) for word data
- [Font Awesome](https://fontawesome.com/) and [Material Icons](https://fonts.google.com/icons) for icons

## Troubleshooting

| Problem | What to check |
|---|---|
| Page has no styling | Make sure the stylesheet link is `style.css` and the file name matches exactly |
| Nothing happens when searching | Open the browser console (F12) and look for red errors; confirm `script.js` is linked at the bottom of `index.html` |
| Speaker icon is silent | Check that your device and tab are not muted; open the console to see whether API audio failed or the browser voice took over |
| "Can't find the meaning" message | The word may not exist in the API, so try a common word like `happy` |
| Old code still running | Hard refresh with Ctrl+Shift+R (Cmd+Shift+R on Mac) |
| No example shown | Some words have no example in the API, so "No example available." is expected |

## Known Limitations

- Only English words are supported.
- The app shows the first definition of the first meaning, not every meaning.
- Not every word has an example sentence, audio recording, or synonyms in the API.
- The Free Dictionary API is a free public service, so it may be slow or unavailable at times.

## Possible Improvements

- Show all meanings and parts of speech for a word
- Add a search history
- Add a dark mode
- Support other languages (the API offers several)
- Add a debounce for search-as-you-type

## Credits

- Word data provided by the [Free Dictionary API](https://dictionaryapi.dev/)
- Icons from Font Awesome and Google Material Icons

## License

This project is for learning purposes. Feel free to use and modify it.# dictionary
