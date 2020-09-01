const path = require('path');
const fs = require('fs/promises');

async function updateDirectory(dir) {
  const files = (await fs.readdir(path.join(__dirname, dir)))
    .map(file => path.join(dir, file));
  console.log(files);
  await Promise.all(files.map(async file => {
    const stat = await fs.stat(file);
    if (stat.isDirectory(file)) {
      await updateDirectory(file);
    }
    else {
      await updateFile(file);
    }
  }));
}

async function updateFile(file) {
  let contents = '';
  if (file.endsWith('.json')) {
    contents = `{
  "status": "301 Moved Permanently",
  "location": "https://w3c.github.io/webref/${file.replace(/\\/g, '/')}",
  "comment": "The reffy-reports project moved to the W3C organization and JSON files are now available under https://w3c.github.io/webref. Please update your pointers accordinly!"
}`;
  }
  else if (file.endsWith('.md')) {
    contents = `The reffy-reports project moved to the W3C organization and the Markdown report is now available at [https://w3c.github.io/webref/${file.replace(/\\/g, '/')}](https://w3c.github.io/webref/${file.replace(/\\/g, '/')}). Please update your pointers accordinly!`;
  }
  else if (file.endsWith('.html')) {
    contents = `<!DOCTYPE html>
<script>
    let currentHash = window.location.hash;
    let newLocation = "https://w3c.github.io/webref/${file.replace(/\\/g, '/')}" + currentHash;
    window.location = newLocation;
</script>`;
  }
  else if (file.endsWith('.idl')) {
    contents = `// The reffy-reports project moved to the W3C organization and the Markdown report is now available at https://w3c.github.io/webref/${file.replace(/\\/g, '/')}. Please update your pointers accordinly!`;
  }
  else {
    throw new Error(`Unexpected MIME type for file: ${file}`);
  }
  await fs.writeFile(file, contents, 'utf8');
}

async function main() {
  await updateDirectory('ed');
  await updateDirectory('tr');
}

main()
  .catch(console.error);