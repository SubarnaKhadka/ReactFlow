import { use } from "react";
import { createRoot } from "react-dom/client";

import { createFromFetch } from "react-server-dom-webpack/client";

const root = createRoot(document.getElementById("root"));
root.render(<Root />);

const cache = new Map();

function Root() {
  const key = window.__rscKey || "";

  let content = cache.get(key);

  if (!content) {
    content = createFromFetch(fetch(`/rsc?id=${key}`));
    cache.set(key, content);
  }

  return <>{use(content)}</>;
}
