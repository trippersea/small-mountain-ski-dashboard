import sharp from "sharp";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");

const svgPath = join(root, "ski-decision-logo.svg");

async function main() {
  const logo = await sharp(svgPath)
    .resize(520, 572, { fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png()
    .toBuffer();

  await sharp({
    create: {
      width: 1200,
      height: 630,
      channels: 4,
      background: { r: 247, g: 250, b: 252, alpha: 1 },
    },
  })
    .composite([{ input: logo, gravity: "center" }])
    .png()
    .toFile(join(root, "og-image.png"));

  await sharp(svgPath)
    .resize(180, 198, { fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png()
    .toFile(join(root, "ski-decision-logo.png"));

  console.log("Wrote og-image.png and ski-decision-logo.png");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
