import { mkdirSync, copyFileSync, writeFileSync } from "fs";
import { join } from "path";

const outputDir = ".vercel/output/functions/index.func";

// Tạo thư mục function
mkdirSync(outputDir, { recursive: true });

// Copy file server build
copyFileSync("dist/server/node-build.mjs", join(outputDir, "index.mjs"));

// Tạo .vc-config.json
writeFileSync(
  join(outputDir, ".vc-config.json"),
  JSON.stringify(
    {
      runtime: "nodejs20.x",
      handler: "index.mjs",
      launcherType: "Nodejs",
    },
    null,
    2,
  ),
);

// Tạo config.json (root routes)
mkdirSync(".vercel/output", { recursive: true });
writeFileSync(
  ".vercel/output/config.json",
  JSON.stringify(
    {
      version: 3,
      routes: [{ src: "/(.*)", dest: "index" }],
    },
    null,
    2,
  ),
);

console.log("✅ Vercel output prepared!");
