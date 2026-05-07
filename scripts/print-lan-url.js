const os = require("os");

const port = process.argv[2] || process.env.PORT || "3000";

console.log("");
console.log("Serve this site from another device on the same Wi‑Fi:");
for (const infos of Object.values(os.networkInterfaces())) {
  if (!infos) continue;
  for (const info of infos) {
    const isV4 =
      info.family === "IPv4" || info.family === 4;
    if (!isV4 || info.internal) continue;
    console.log(`  http://${info.address}:${port}`);
  }
}
console.log("");
console.log("On your phone, use one of the addresses above—not localhost.");
console.log(
  "If it still fails, allow Node.js (or TCP port "
    + port
    + ") through Windows Firewall for Private networks.",
);
console.log("");
