const register = require("react-server-dom-webpack/node-register");
register();

require("@babel/register");

const path = require("path");
const { readFileSync } = require("fs");

const { existsSync } = require("node:fs");

const { renderToPipeableStream } = require("react-server-dom-webpack/server");
const express = require("express");

const React = require("react");
const { isFile } = require("./utils");
const { throwNotFound } = require("./throwNotFound");
const checkValidDefaultExport = require("./checkValidDefaultExport");
const generateHtmlWithMetadata = require("./generateHtmlWithMetadata");

const app = express();

app.use(
  "/.reactflow/static/chunks",
  express.static(path.join(__dirname, "../.reactflow/static/chunks"))
);

app.get("/rsc", async (req, res) => {
  const PagePath = req.query.id;

  const Component = await require(path.join(
    process.cwd(),
    "app",
    PagePath.replace(/^['"]+|['"]+$/g, ""),
    "page.js"
  )).default;

  const manifest = readFileSync(
    path.resolve(
      __dirname,
      "../.reactflow/static/chunks/react-client-manifest.json"
    ),
    "utf8"
  );
  const moduleMap = JSON.parse(manifest);
  const { pipe } = renderToPipeableStream(
    React.createElement(Component),
    moduleMap
  );
  pipe(res);
});

app.get("/", async (req, res) => {
  const PagePath = path.join(process.cwd(), "app", "page.js");

  if (!existsSync(PagePath)) {
    throw new Error(
      "starting page missing.Please ensure  that app/page.(js| ts| jsx) exists."
    );
  }

  const Page = require(PagePath);

  checkValidDefaultExport(Page, PagePath, res);

  let html = await generateHtmlWithMetadata(Page);

  html = html.replace(
    "{{script}}",
    `<script>
      window.__rscKey = '';
      </script>`
  );

  res.send(html);
});

app.get("/:dynamicPath", async (req, res) => {
  let { dynamicPath } = req.params;

  if (isFile(dynamicPath)) return;

  const PagePath = path.join(process.cwd(), "app", dynamicPath, "page.js");

  if (!existsSync(PagePath)) {
    return throwNotFound(res);
  }

  const Page = require(PagePath);

  checkValidDefaultExport(Page, PagePath, res);

  let html = await generateHtmlWithMetadata(Page);

  html = html.replace(
    "{{script}}",
    `<script>
      window.__rscKey = \`${JSON.stringify(dynamicPath)}\`;
      </script>`
  );

  res.send(html);
});

app.listen(process.env.PORT || 3000, () => {
  console.log(`server running on port ${process.env.PORT || 3000}`);
});
