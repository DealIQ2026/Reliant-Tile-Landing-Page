const fs = require("fs");
const path = require("path");

const root = path.join(__dirname, "..");
const bodyPath = path.join(root, "content", "home-body.html");
const outPath = path.join(root, "public", "index.html");

const body = fs.readFileSync(bodyPath, "utf8");

const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Reliant Tile Company</title>
  <link rel="stylesheet" href="/css/styles.css" />
</head>
<body>
${body}
    </footer>
  <script src="/js/main.js" defer></script>
</body>
</html>
`;

fs.writeFileSync(outPath, html, "utf8");
