const React = require("react");
const ReactDomSever = require("react-dom/server");

const { relative } = require("path");

module.exports = function checkValidDefaultExport(Page, path, res) {
  const isDefaultExport = Page && Page.default;

  const relativePath = relative(process.cwd(), path);

  const _pathToRedirect = relativePath.startsWith(".")
    ? relativePath.replace(/\\/g, "/")
    : `./${relativePath}`.replace(/\\/g, "/");

  if (!isDefaultExport) {
    res.send(
      ReactDomSever.renderToString(
        React.createElement(
          "h1",
          {
            style: {
              color: "red",
              backgroundColor: "#fee2e2",
              padding: "16px",
            },
          },
          `Page must be default export. Check Path: ${_pathToRedirect}`
        )
      )
    );

    throw new Error(
      `\x1b[31mPage must be default export\x1b[0m` +
        "\n" +
        `\x1b[31m${_pathToRedirect}\x1b[0m`
    );
  }

  if (
    typeof Page.default !== "function" ||
    !React.isValidElement(React.createElement(Page.default))
  ) {
    res.send(
      ReactDomSever.renderToString(
        React.createElement(
          "h1",
          {
            style: {
              color: "red",
              backgroundColor: "#fee2e2",
              padding: "16px",
            },
          },
          `Default export is not a valid React component (must be a function or class). Check Path: ${_pathToRedirect}`
        )
      )
    );
    throw new Error(
      `\x1b[31mDefault export is not a valid React component (must be a function or class)\x1b[0m` +
        "\n" +
        `\x1b[31m${_pathToRedirect}\x1b[0m`
    );
  }
};
