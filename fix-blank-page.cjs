const fs = require("fs");
const path = require("path");

const root = path.join(process.cwd(), "artifacts/matrimony/src");
const exts = new Set([".ts", ".tsx", ".js", ".jsx"]);

let changedFiles = [];

function walk(dir) {
  for (const item of fs.readdirSync(dir)) {
    const full = path.join(dir, item);
    const stat = fs.statSync(full);

    if (stat.isDirectory()) {
      walk(full);
      continue;
    }

    if (!exts.has(path.extname(full))) continue;

    let code = fs.readFileSync(full, "utf8");
    const original = code;

    // Fix: variable?.slice(...).map(...)
    code = code.replace(
      /\b([A-Za-z_$][\w$]*)\?\.slice\(([^)]*)\)\.map\(/g,
      "(Array.isArray($1) ? $1 : []).slice($2).map("
    );

    // Fix: variable.slice(...).map(...) for common list names only
    code = code.replace(
      /\b(profiles|members|users|matches|items|data|results|plans|testimonials|services|successStories|featuredProfiles|latestProfiles|filteredProfiles|allProfiles)\.slice\(([^)]*)\)\.map\(/g,
      "(Array.isArray($1) ? $1 : []).slice($2).map("
    );

    if (code !== original) {
      fs.writeFileSync(full, code);
      changedFiles.push(path.relative(process.cwd(), full));
    }
  }
}

if (!fs.existsSync(root)) {
  console.error("Source folder not found:", root);
  process.exit(1);
}

walk(root);

console.log("Changed files:");
console.log(changedFiles.length ? changedFiles.join("\n") : "No matching files found");
