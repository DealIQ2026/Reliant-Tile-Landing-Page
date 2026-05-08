const fs = require("fs");
const path = require("path");

const root = path.join(__dirname, "..");
const bodyPath = path.join(root, "content", "home-body.html");
const outPath = path.join(root, "public", "index.html");

const body = fs
  .readFileSync(bodyPath, "utf8")
  .replace(/^\uFEFF/, "")
  .replace(/\uFEFF/g, "");

const META_PIXEL_ID = "851972407264438";

const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Reliant Tile Company</title>
  <link rel="stylesheet" href="/css/styles.css" />
  <!-- Meta Pixel Code -->
  <script>
!function(f,b,e,v,n,t,s)
{if(f.fbq)return;n=f.fbq=function(){n.callMethod?
n.callMethod.apply(n,arguments):n.queue.push(arguments)};
if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
n.queue=[];t=b.createElement(e);t.async=!0;
t.src=v;s=b.getElementsByTagName(e)[0];
s.parentNode.insertBefore(t,s)}(window, document,'script',
'https://connect.facebook.net/en_US/fbevents.js');
fbq('init', '${META_PIXEL_ID}');
fbq('track', 'PageView');
  </script>
  <!-- End Meta Pixel Code -->
</head>
<body>
  <noscript>
    <img
      height="1"
      width="1"
      style="display:none"
      src="https://www.facebook.com/tr?id=${META_PIXEL_ID}&ev=PageView&noscript=1"
      alt=""
    />
  </noscript>
${body}
    </footer>
  <script src="/js/main.js" defer></script>
</body>
</html>
`;

fs.writeFileSync(outPath, html, "utf8");
