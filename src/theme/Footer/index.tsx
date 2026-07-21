import React from 'react';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';

const YEAR = new Date().getFullYear();

const COLUMNS = [
  {
    title: 'Getting Started',
    links: [
      { label: 'Introduction',        to: '/' },
      { label: 'System Requirements', to: '/getting-started/system-requirements' },
      { label: 'Installation',        to: '/getting-started/installation' },
      { label: 'Quick Start',         to: '/getting-started/quick-start' },
    ],
  },
  {
    title: 'User Guide',
    links: [
      { label: 'Dashboard',    to: '/user-guide/dashboard' },
      { label: 'Customers',    to: '/user-guide/customers' },
      { label: 'Suppliers',    to: '/user-guide/suppliers' },
      { label: 'WhatsApp',     to: '/user-guide/whatsapp' },
      { label: 'Reports',      to: '/user-guide/reports' },
      { label: 'Settings',     to: '/user-guide/settings' },
    ],
  },
  {
    title: 'Developer',
    links: [
      { label: 'API Reference',   to: '/api/overview' },
      { label: 'Authentication',  to: '/api/authentication' },
      { label: 'Architecture',    to: '/developer/architecture' },
      { label: 'Local Setup',     to: '/developer/local-setup' },
      { label: 'Sync Engine',     to: '/developer/sync-engine' },
      { label: 'Building APK',    to: '/developer/building-apk' },
    ],
  },
  {
    title: 'Deployment',
    links: [
      { label: 'Docker Compose',          to: '/deployment/docker' },
      { label: 'Environment Variables',   to: '/deployment/environment-variables' },
      { label: 'Nginx & SSL',             to: '/deployment/nginx-ssl' },
      { label: 'Cloud Sync Setup',        to: '/sync/cloud-sync' },
      { label: 'Server Dashboard',        to: '/deployment/server-dashboard' },
    ],
  },
];

const SOCIAL = [
  {
    label: 'GitHub',
    href: 'https://github.com/your-org/superfast',
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18">
        <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
      </svg>
    ),
  },
];

export default function Footer(): React.JSX.Element {
  const { siteConfig } = useDocusaurusContext();

  return (
    <footer
      style={{
        background: '#080808',
        borderTop: '1px solid rgba(255,255,255,0.06)',
        marginTop: 'auto',
      }}
    >
      {/* ── Top accent line ── */}
      <div
        style={{
          height: 2,
          background: '#3b82f6',
          opacity: 0.8,
        }}
      />

      {/* ── Main footer body ── */}
      <div
        style={{
          maxWidth: 1280,
          margin: '0 auto',
          padding: '56px 40px 40px',
        }}
      >
        {/* ── Brand + columns row ── */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '260px repeat(4, 1fr)',
            gap: '40px',
            alignItems: 'flex-start',
          }}
        >
          {/* Brand block */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
              <img
                src="/img/logo.png"
                alt="SuperFast"
                width={38}
                height={38}
                style={{ borderRadius: 10, boxShadow: '0 2px 10px rgba(0,0,0,0.5)' }}
              />
              <div>
                <div
                  style={{
                    fontSize: 16,
                    fontWeight: 800,
                    letterSpacing: '-0.02em',
                    color: '#ffffff',
                  }}
                >
                  SuperFast
                </div>
                <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.3)', marginTop: 1, fontWeight: 500 }}>
                  v1.0.0 · Enterprise
                </div>
              </div>
            </div>

            <p
              style={{
                fontSize: 13,
                color: 'rgba(255,255,255,0.4)',
                lineHeight: 1.7,
                margin: 0,
                marginBottom: 20,
              }}
            >
              Enterprise supermarket debt &amp; supplier management. Offline-first, multi-device, WhatsApp-integrated.
            </p>

            {/* Status badge */}
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 7,
                background: 'rgba(16, 185, 129, 0.08)',
                border: '1px solid rgba(16, 185, 129, 0.2)',
                borderRadius: 99,
                padding: '5px 12px',
                fontSize: 12,
                color: '#10b981',
                fontWeight: 600,
                marginBottom: 20,
              }}
            >
              <span
                style={{
                  width: 7,
                  height: 7,
                  borderRadius: '50%',
                  background: '#10b981',
                  boxShadow: '0 0 6px #10b981',
                  display: 'inline-block',
                  animation: 'pulse 2s infinite',
                }}
              />
              All Systems Operational
            </div>

            {/* Social links */}
            <div style={{ display: 'flex', gap: 10 }}>
              {SOCIAL.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={s.label}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: 36,
                    height: 36,
                    borderRadius: 8,
                    background: 'rgba(255,255,255,0.05)',
                    border: '1px solid rgba(255,255,255,0.08)',
                    color: 'rgba(255,255,255,0.5)',
                    transition: 'all 0.15s ease',
                    textDecoration: 'none',
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.1)';
                    (e.currentTarget as HTMLElement).style.color = '#fff';
                    (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.15)';
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.05)';
                    (e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.5)';
                    (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.08)';
                  }}
                >
                  {s.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Link columns */}
          {COLUMNS.map((col) => (
            <div key={col.title}>
              <div
                style={{
                  fontSize: 11,
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  letterSpacing: '0.09em',
                  color: 'rgba(255,255,255,0.25)',
                  marginBottom: 16,
                }}
              >
                {col.title}
              </div>
              <ul style={{ listStyle: 'none', margin: 0, padding: 0 }}>
                {col.links.map((link) => (
                  <li key={link.label} style={{ marginBottom: 10 }}>
                    <Link
                      to={link.to}
                      style={{
                        fontSize: 13.5,
                        color: 'rgba(255,255,255,0.45)',
                        textDecoration: 'none',
                        transition: 'color 0.15s ease',
                        fontWeight: 400,
                      }}
                      onMouseEnter={(e) => {
                        (e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.85)';
                      }}
                      onMouseLeave={(e) => {
                        (e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.45)';
                      }}
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* ── Divider ── */}
        <div
          style={{
            height: 1,
            background: 'rgba(255,255,255,0.06)',
            margin: '40px 0 28px',
          }}
        />

        {/* ── Bottom bar ── */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: 16,
          }}
        >
          {/* Left: copyright */}
          <div style={{ fontSize: 12.5, color: 'rgba(255,255,255,0.25)', display: 'flex', alignItems: 'center', gap: 8 }}>
            <span>© {YEAR} SuperFast.</span>
            <span style={{ color: 'rgba(255,255,255,0.12)' }}>·</span>
            <span>
              Built with{' '}
              <a
                href="https://docusaurus.io"
                target="_blank"
                rel="noreferrer"
                style={{ color: 'rgba(255,255,255,0.35)', textDecoration: 'none' }}
              >
                Docusaurus
              </a>
            </span>
          </div>

          {/* Center: version + platform badges */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            {['v1.0.0', 'Windows', 'Android', 'Self-hosted'].map((label) => (
              <span
                key={label}
                style={{
                  fontSize: 11,
                  fontWeight: 500,
                  padding: '3px 10px',
                  borderRadius: 4,
                  background: 'rgba(255,255,255,0.04)',
                  border: '1px solid rgba(255,255,255,0.09)',
                  color: 'rgba(255,255,255,0.38)',
                  letterSpacing: '0.02em',
                }}
              >
                {label}
              </span>
            ))}
          </div>

          {/* Right: legal links */}
          <div style={{ display: 'flex', gap: 20 }}>
            {['Privacy Policy', 'Terms of Service', 'Support'].map((label) => (
              <span
                key={label}
                style={{
                  fontSize: 12.5,
                  color: 'rgba(255,255,255,0.25)',
                  cursor: 'pointer',
                  transition: 'color 0.15s',
                }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.55)'; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.25)'; }}
              >
                {label}
              </span>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }
        @media (max-width: 996px) {
          footer > div:last-child > div:first-child {
            grid-template-columns: 1fr 1fr !important;
            gap: 32px !important;
          }
        }
        @media (max-width: 640px) {
          footer > div:last-child > div:first-child {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </footer>
  );
}
