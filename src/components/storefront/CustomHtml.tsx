"use client";

import { useEffect, useRef } from "react";

/**
 * Renders admin-supplied raw HTML. Plain innerHTML silently refuses to run
 * <script> tags (a browser/DOM-spec quirk, not a React thing), which would
 * make pasting an analytics or chat-widget snippet here just not work — so
 * this recreates any script tags found after mounting to force them to run.
 *
 * This only ever renders content typed into /admin by an authenticated
 * site owner, never visitor input — that's what makes it safe to do at all.
 */
export function CustomHtml({ html, className }: { html: string; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = ref.current;
    if (!container || !html) return;
    container.innerHTML = html;
    const scripts = Array.from(container.querySelectorAll("script"));
    for (const oldScript of scripts) {
      const newScript = document.createElement("script");
      for (const attr of Array.from(oldScript.attributes)) {
        newScript.setAttribute(attr.name, attr.value);
      }
      newScript.textContent = oldScript.textContent;
      oldScript.replaceWith(newScript);
    }
  }, [html]);

  if (!html) return null;
  return <div ref={ref} className={className} />;
}
