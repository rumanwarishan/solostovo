"use client";

import { useEffect } from "react";

/**
 * Injects admin-supplied HTML directly into <head> or just before </body> —
 * the conventional spot for analytics/verification tags (head) and chat
 * widgets/tracking pixels (body end), matching how WordPress's "Insert
 * Headers and Footers" or Shopify's theme custom-code fields work.
 *
 * insertAdjacentHTML doesn't execute <script> tags (a DOM quirk, not
 * React's doing), so this recreates any it finds to force them to run.
 * Mounted once in the root layout — renders no DOM node of its own.
 */
export function RawCodeInjector({ html, target }: { html: string; target: "head" | "body" }) {
  useEffect(() => {
    if (!html) return;
    const container = target === "head" ? document.head : document.body;
    const before = target === "head" ? container.children.length : 0;

    if (target === "head") {
      container.insertAdjacentHTML("beforeend", html);
    } else {
      container.insertAdjacentHTML("beforeend", html);
    }

    const inserted = Array.from(container.children).slice(before);
    for (const node of inserted) {
      if (node.tagName === "SCRIPT") {
        const oldScript = node as HTMLScriptElement;
        const newScript = document.createElement("script");
        for (const attr of Array.from(oldScript.attributes)) {
          newScript.setAttribute(attr.name, attr.value);
        }
        newScript.textContent = oldScript.textContent;
        oldScript.replaceWith(newScript);
      }
    }

    return () => {
      for (const node of inserted) node.remove();
    };
  }, [html, target]);

  return null;
}
