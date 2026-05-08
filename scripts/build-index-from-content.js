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

/** Public site URL (no trailing slash). Used for canonical + Open Graph. Update if your live domain differs. */
const SITE_ORIGIN = "https://www.relianttileco.com";

const OG_TITLE = "Reliant Tile Company";
const OG_DESCRIPTION =
  "Professional tile installation, remodels, flooring, and custom tile work for homeowners and builders in the Mid-South. Family-owned, serving the Mid-South for over 60 years.";

const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>${OG_TITLE}</title>
  <meta name="description" content="${OG_DESCRIPTION}" />
  <link rel="canonical" href="${SITE_ORIGIN}/" />
  <link rel="icon" href="/favicon.png" type="image/png" sizes="512x512" />
  <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
  <meta property="og:type" content="website" />
  <meta property="og:url" content="${SITE_ORIGIN}/" />
  <meta property="og:title" content="${OG_TITLE}" />
  <meta property="og:description" content="${OG_DESCRIPTION}" />
  <meta property="og:image" content="${SITE_ORIGIN}/og-image.png" />
  <meta property="og:image:alt" content="Reliant Tile Co. logo" />
  <meta property="og:locale" content="en_US" />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="${OG_TITLE}" />
  <meta name="twitter:description" content="${OG_DESCRIPTION}" />
  <meta name="twitter:image" content="${SITE_ORIGIN}/og-image.png" />
  <link rel="stylesheet" href="/css/styles.css" />
  <script type="application/ld+json">
${JSON.stringify(
  {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: OG_TITLE,
    url: `${SITE_ORIGIN}/`,
    image: `${SITE_ORIGIN}/og-image.png`,
    description: OG_DESCRIPTION,
    email: "hello@relianttileco.com",
    telephone: "+1-901-734-4020",
    address: {
      "@type": "PostalAddress",
      addressLocality: "Memphis",
      addressRegion: "TN",
      addressCountry: "US",
    },
    areaServed: { "@type": "AdministrativeArea", name: "Mid-South" },
  },
  null,
  2,
)}
  </script>
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
