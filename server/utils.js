export function isFile(path) {
  const fileExtensionRegex = /\.[a-zA-Z0-9]+$/;
  return fileExtensionRegex.test(path);
}

export async function turnJSXToClientObject(jsx) {
  if (!jsx) return null;

  if (["string", "number", "boolean"].includes(typeof jsx)) return jsx;

  if (Array.isArray(jsx)) {
    return await Promise.all(jsx.map(turnJSXToClientObject));
  }

  if (typeof jsx === "object") {
    if (jsx.$$typeof === Symbol.for("react.element")) {
      if (typeof jsx.type === "string") {
        return {
          ...jsx,
          props: await turnJSXToClientObject(jsx.props),
        };
      }
      if (typeof jsx.type === "function") {
        const Component = jsx.type;
        const props = jsx.props;
        const rendered = await Component(props);
        return await turnJSXToClientObject(rendered);
      }
    }
    const entries = Object.entries(jsx);
    const processedEntries = await Promise.all(
      entries.map(async ([prop, value]) => [
        prop,
        await turnJSXToClientObject(value),
      ])
    );
    return Object.fromEntries(processedEntries);
  }
}
