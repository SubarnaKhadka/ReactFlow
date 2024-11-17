const path = require("path");
const { readFileSync } = require("fs");

module.exports = async function generateHtmlWithMetaData(Page) {
  const htmlTemplate = readFileSync(
    path.resolve(__dirname, "../public/index.html"),
    "utf8"
  );

  const defaulMetadataTitle = "React Flow";
  const defaultMetaDataDescription =
    "React with SSR, Server Components and streaming";
  const defaultMetadataKeywords = "React Flow, Server Components";

  let metadata = Page.metadata;
  const generateMetadataCallback = Page.generateMetadata;

  if (generateMetadataCallback) {
    metadata = await generateMetadataCallback();
  }

  if (metadata && metadata.keywords && Array.isArray(metadata.keywords)) {
    metadata.keywords = metadata.keywords.join(", ");
  }

  const htmlMetadata = htmlTemplate
    .replace("{{title}}", (metadata && metadata.title) || defaulMetadataTitle)
    .replace(
      "{{description}}",
      (metadata && metadata.description) || defaultMetaDataDescription
    )
    .replace(
      "{{keywords}}",
      (metadata && metadata.keywords) || defaultMetadataKeywords
    );

  return htmlMetadata;
};
