import React, { useEffect, useRef } from 'react';
import BrowserOnly from '@docusaurus/BrowserOnly';

let idCounter = 0;

function MermaidInner({ chart }: { chart: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const id = `mermaid-${++idCounter}`;

  useEffect(() => {
    if (!ref.current) return;

    const isDark =
      document.documentElement.getAttribute('data-theme') === 'dark';

    import('mermaid').then((mod) => {
      const mermaid = mod.default;
      mermaid.initialize({
        startOnLoad: false,
        theme: isDark ? 'dark' : 'default',
        fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
        fontSize: 13,
        flowchart: { curve: 'basis', padding: 20 },
        sequence: { actorMargin: 50, messageMargin: 40 },
      });

      mermaid.render(id, chart).then(({ svg }) => {
        if (ref.current) ref.current.innerHTML = svg;
      });
    });
  }, [chart]);

  return (
    <div
      ref={ref}
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        margin: '2rem 0',
        padding: '1.5rem 1rem',
        background: 'rgba(255,255,255,0.02)',
        border: '1px solid rgba(255,255,255,0.07)',
        borderRadius: '10px',
        overflowX: 'auto',
      }}
    />
  );
}

export default function Mermaid({ chart }: { chart: string }) {
  return (
    <BrowserOnly
      fallback={
        <div
          style={{
            margin: '2rem 0',
            padding: '2rem',
            textAlign: 'center',
            color: 'rgba(255,255,255,0.25)',
            fontSize: 13,
            border: '1px solid rgba(255,255,255,0.06)',
            borderRadius: 10,
          }}
        >
          Loading diagram…
        </div>
      }
    >
      {() => <MermaidInner chart={chart} />}
    </BrowserOnly>
  );
}
