// Traverse the assets folder and generate the database
export async function generateDatabase(assetPath) {
    const DATABASE = {};
    function registerEntry(keypath, filepath) {
        const parts = keypath.split('.');

        const finalKey = parts.reduce((a, b, index) => {
            if (index === parts.length - 1) {
                return a;
            }

            // Collision Check (same as before)
            if (a[b] && typeof a[b] === 'string') {
                console.warn('SDBE | Conflict Detected', a[b], filepath);
                a[b] = { '01': a[b] }; 
            } else if (!a[b]) {
                a[b] = {};
            }
            
            return a[b];
        }, DATABASE);
        
        const lastPart = parts[parts.length - 1];
        finalKey[lastPart] = `${assetPath}/${filepath}`; // Store the backtick-wrapped string
    }

    let filepaths = await listAllFilesRecursive(assetPath);
    filepaths = filepaths.filter(f => !f.endsWith('.md')) // Remove all .md files (README.md)

    // Form the Database
    for (let filepath of filepaths) {
        const keypath = getKeyPath(filepath);
        registerEntry(keypath, filepath);
    }

    return DATABASE;
}

function getKeyPath(filepath) {
    // Remove the file extension
    filepath = filepath.replace(/\.[^/.]+$/, "");

    // Convert the remaining filepath to a sequencer database key
    filepath = filepath.replaceAll(' ', '.');         // Spaces become periods
    filepath = filepath.replaceAll('\\', '.');        // Backslashes become periods
    filepath = filepath.replaceAll('/', '.');         // Forwardslashes become periods
    filepath = filepath.replaceAll('%20', '_');       // Forwardslashes become periods
    filepath = filepath.replace(/_?(\d+)$/, ".$1");   // Place a period before trailing numbers
    filepath = filepath.replace(/\.(\d+)$/, (match, number) => `.${number.padStart(3, '0')}`); // Pad numbers to 3 digits
    filepath = filepath.replace(/\.{2,}/g, ".");      // Multiple periods are replaced by a single period
    filepath = filepath.replace(/\.+$/, "");          // Excess end of name periods are removed
    filepath = filepath.toLowerCase();
    
    return filepath;
}

async function listAllFilesRecursive(assetPath) {
  const source = "data";
  let allFiles = [];

  // Define the recursive crawler
  async function crawl(path) {
    const content = await foundry.applications.apps.FilePicker.browse(source, path);
    for (let file of content.files) { allFiles.push(file.replace(`${assetPath}/`, "")); }
    for (let dir of content.dirs) { await crawl(dir); }
  }

  try {
    await crawl(assetPath);
    return allFiles;

  } catch (err) {
    ui.notifications.error("SDBE | Error crawling directories.");
    console.error(`SDBE | ${err}`);
  }
}