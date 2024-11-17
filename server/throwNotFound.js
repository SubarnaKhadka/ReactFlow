const path = require("path");

const { readFileSync } = require("fs");

const { existsSync } = require("node:fs");

const React = require("react");
const ReactDomSever = require("react-dom/server");

function notFound() {
  const defaultNotFoundTitle = "404 | not found";
  const defaultNotFoundDescription = "Page not found";

  const defaultNotFoundTemplate = readFileSync(
    path.resolve(__dirname, "../public/not-found.html"),
    "utf8"
  );

  const defaultNotFoundPage = defaultNotFoundTemplate
    .replace("{{title}}", defaultNotFoundTitle)
    .replace("{{description}}", defaultNotFoundDescription);
  return defaultNotFoundPage;
}

function throwNotFound(res) {
  const defaultNotFoundTitle = "404 | not found";
  const defaultNotFoundDescription = "Page not found";

  const defaultNotFoundTemplate = readFileSync(
    path.resolve(__dirname, "../public/not-found.html"),
    "utf8"
  );

  const customeNotFoundPage = path.join(process.cwd(), "not-found.js");
  if (existsSync(customeNotFoundPage)) {
    const CustomeNotFoundPage = require("../not-found.js");

    const NotFoundComponent = CustomeNotFoundPage.default;
    const NotFoundMetaData = CustomeNotFoundPage.metadata;

    const serverRenderedHtml = ReactDomSever.renderToString(
      React.createElement(NotFoundComponent)
    );

    const NotFoundPage = defaultNotFoundTemplate
      .replace("{{title}}", NotFoundMetaData?.title || defaultNotFoundTitle)
      .replace(
        "{{description}}",
        NotFoundMetaData?.description || defaultNotFoundDescription
      )
      .replace(/<div class="not-found">[\s\S]*?<\/div>/, serverRenderedHtml);

    res.setHeader("ContentType", "text/html");

    return res.send(NotFoundPage);
  } else {
    const defaultNotFoundPage = notFound();

    return res.send(defaultNotFoundPage);
  }
}

module.exports = {
  notFound,
  throwNotFound,
};
