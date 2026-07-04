// Generate a scannable QR PNG for a given URL into public/roofely-qr.png
// Usage: node scripts/genqr.js http://192.168.x.x:3000
const QRCode = require("qrcode");
const path = require("path");

const url = process.argv[2];
if (!url) {
  console.error("Usage: node scripts/genqr.js <url>");
  process.exit(1);
}

const out = path.join(__dirname, "..", "public", "roofely-qr.png");

QRCode.toFile(
  out,
  url,
  {
    width: 640,
    margin: 2,
    errorCorrectionLevel: "M",
    color: { dark: "#0a0e17", light: "#ffffff" },
  },
  (err) => {
    if (err) {
      console.error("QR_ERROR:", err.message);
      process.exit(1);
    }
    console.log("WROTE " + out + " for " + url);
  }
);
