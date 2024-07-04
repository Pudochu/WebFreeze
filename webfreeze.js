/**
 * WebFreeze: A tool to capture and serve static versions of dynamic web pages
 * 
 * This script uses Puppeteer to capture a web page and its resources, saving them locally.
 * It can then serve these local files, effectively "freezing" the web page at a specific point in time.
 */

const puppeteer = require('puppeteer');
const fs = require('fs');
const fsPromises = require('fs').promises;
const path = require('path');
const https = require('https');
const URL = require('url');

// Configuration
const SITE_URL = 'https://example.com';
const SAVE_DIRECTORY = './files';
const isDownloadMode = false; // true: download and save, false: use local files or block

/**
 * Downloads a file from a given URL and saves it to the specified path
 * @param {string} url - The URL of the file to download
 * @param {string} filePath - The local path where the file will be saved
 * @returns {Promise<void>}
 */
async function downloadFile(url, filePath) {
    return new Promise((resolve, reject) => {
        https.get(url, (response) => {
            if (response.statusCode === 200) {
                const fileStream = fs.createWriteStream(filePath);
                response.pipe(fileStream);
                fileStream.on('finish', () => {
                    fileStream.close();
                    console.log(`Downloaded: ${url}`);
                    resolve();
                });
            } else {
                reject(`Failed to download ${url}: ${response.statusCode}`);
            }
        }).on('error', reject);
    });
}

/**
 * Generates a local file path for a given URL
 * @param {string} url - The URL to convert to a local path
 * @returns {string} The local file path
 */
function getFilePath(url) {
    const parsedUrl = new URL.URL(url);
    let filePath = parsedUrl.pathname;
    
    // Handle paths starting with _next
    if (filePath.startsWith('/_next')) {
        filePath = filePath.replace(/^\//, '');
    }
    
    return path.join(SAVE_DIRECTORY, filePath);
}

/**
 * Intercepts requests and handles them based on the current mode
 * @param {puppeteer.Page} page - The Puppeteer page object
 */
async function interceptRequests(page) {
    await page.setRequestInterception(true);
    page.on('request', async (request) => {
        const url = request.url();
        const resourceType = request.resourceType();
        
        if (['stylesheet', 'script', 'image'].includes(resourceType)) {
            const filePath = getFilePath(url);

            if (isDownloadMode) {
                // Download mode: Download and save files
                try {
                    await fsPromises.access(filePath);
                    request.continue();
                } catch (error) {
                    try {
                        const directoryPath = path.dirname(filePath);
                        await fsPromises.mkdir(directoryPath, { recursive: true });
                        await downloadFile(url, filePath);
                        request.continue();
                    } catch (downloadError) {
                        console.error(`Failed to download ${url}: ${downloadError}`);
                        request.continue();
                    }
                }
            } else {
                // Block mode: Use local files or block requests
                try {
                    await fsPromises.access(filePath);
                    const content = await fsPromises.readFile(filePath);
                    console.log(`Serving: ${filePath}`);
                    request.respond({
                        status: 200,
                        contentType: request.headers()['content-type'],
                        body: content
                    });
                } catch (error) {
                    console.log(`Blocked: ${filePath}`);
                    request.abort();
                }
            }
        } else {
            request.continue();
        }
    });
}

/**
 * Main function to run the script
 */
async function main() {
    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();

    await interceptRequests(page);

    console.log(`Navigating to ${SITE_URL}`);
    await page.goto(SITE_URL, { waitUntil: 'networkidle0' });

    // Save the main HTML
    const content = await page.content();
    const htmlPath = path.join(SAVE_DIRECTORY, 'index.html');
    await fsPromises.writeFile(htmlPath, content);
    console.log(`Saved main HTML to ${htmlPath}`);

    // Keep the browser open for inspection
    console.log('Browser will remain open. Close it manually when done.');
    // Uncomment the next line to close the browser automatically
    // await browser.close();
}

main().catch(console.error);
