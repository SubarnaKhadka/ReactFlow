require("@babel/register");

const path = require("path");
const fs = require("fs");
const ReactDomSever = require("react-dom/server");
const checkValidDefaultExport = require("../server/checkValidDefaultExport");
const generateHtmlWithMetadata = require("../server/generateHtmlWithMetadata");

async function generateStaticHtml(dir, buildDir) {
  let count = 0;

  const files = fs.readdirSync(dir);

  for (const file of files) {
    const fullPath = path.join(dir, file);

    const stat = fs.statSync(fullPath);

    let pagePath = fullPath;

    let outPath = path.join(buildDir, file, "page.html");

    if (stat.isDirectory()) {
      pagePath = path.join(fullPath, "page.js");
    } else {
      if (file !== "page.js") continue;
      outPath = path.join(buildDir, `${file.split(".")[0]}.html`);
    }

    const Page = require(pagePath);

    const DefaultPageExport = Page.default;

    await checkValidDefaultExport(Page, pagePath);

    if (Page.environment && (Page.environment = "static")) {
      const Component = await DefaultPageExport();

      const renderedHtml = ReactDomSever.renderToString(Component);

      let html = await generateHtmlWithMetadata(Page);

      html = html
        .replace(
          /<div id="root">[\s\S]*?<\/div>/,
          `<div id="root">${renderedHtml}</div>`
        )
        .replace("{{script}}", ``);

      if (!fs.existsSync(path.dirname(outPath))) {
        fs.mkdirSync(path.dirname(outPath), { recursive: true });
      }

      fs.writeSync(fs.openSync(outPath, "w"), html);

      console.log(`Generating static page: ${outPath}`);

      ++count;
    }
  }
  console.log(`Total Static page: ${count}`);
}

const appDir = path.join(__dirname, "../app");
const buildDir = path.resolve(__dirname, "../.reactflow/server/app");

generateStaticHtml(appDir, buildDir);
