# WebFreeze 🕸️🧊

WebFreeze is a powerful tool that allows you to capture and serve static versions of dynamic web pages. It's perfect for archiving, offline viewing, or preserving specific site versions.

## 🚀 Features

- Captures entire web pages including stylesheets, scripts, and images
- Saves resources locally for offline access
- Serves local files to recreate the page exactly as captured
- Supports both download and block modes
- Built with Puppeteer for robust web scraping capabilities

## 🛠️ Installation

1. Clone this repository:
   ```
   git clone https://github.com/yourusername/webfreeze.git
   ```
2. Navigate to the project directory:
   ```
   cd webfreeze
   ```
3. Install dependencies:
   ```
   npm install
   ```

## 📘 Usage

1. Open `webfreeze.js` and set your configuration:

   - `SITE_URL`: The URL of the website you want to capture
   - `SAVE_DIRECTORY`: The directory where files will be saved
   - `isDownloadMode`: Set to `true` for initial capture, `false` for serving local files

2. Run the script:

   ```
   npm start
   ```

3. The script will open a browser window. When in download mode, it will capture the site. In block mode, it will serve the local version.

4. Close the browser window when done, or let it remain open for inspection.

## 🔧 Configuration

- `isDownloadMode`:
  - `true`: Downloads and saves web resources
  - `false`: Serves local files and blocks new requests

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🤝 Contributing

Contributions, issues, and feature requests are welcome! Feel free to check [issues page](https://github.com/pudochu/webfreeze/issues).

---

Project Link: [https://github.com/pudochu/webfreeze](https://github.com/pudochu/webfreeze)
