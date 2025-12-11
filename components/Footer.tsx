import Link from 'next/link'

export default function Footer() {
  const footerColumns = [
    {
      title: 'SEARCH',
      type: 'search',
      items: [],
    },
    {
      title: 'contact',
      type: 'contact',
      items: [
        { label: '+1123456789', href: 'tel:+1123456789' },
        {
          label: '1316 Abbot Kinney Blvd. Copenhagen CA 90291',
          href: 'https://www.google.com/maps',
          external: true,
        },
      ],
    },
    {
      title: 'Help',
      items: [
        { label: "FAQ's", href: '/faqs' },
        { label: 'Pricing Plans', href: '/pricing-plans' },
        { label: 'Track Your Order', href: '/track-order' },
        { label: 'Returns', href: '/returns' },
      ],
    },
    {
      title: 'About Us',
      items: [
        { label: 'Our Story', href: '/our-story' },
        { label: 'Job Opportunities', href: '/jobs' },
        { label: 'Store Locator', href: '/store-locator' },
        { label: 'Contact Us', href: '/contact-us' },
      ],
    },
    {
      title: 'Customer Services',
      items: [
        { label: 'My Account', href: '/my-account' },
        { label: 'Terms of Use', href: '/terms-of-use' },
        { label: 'Deliveries & Returns', href: '/deliveries-returns' },
        { label: 'Gift card', href: '/gift-card' },
      ],
    },
  ]

  return (
    <footer className="site-footer">
      <div className="footer-widgets">
        <div className="container footer-grid">
          {footerColumns.map((column, index) => (
            <section
              key={index}
              className="footer-widget"
              aria-labelledby={`footer-${column.title.toLowerCase().replace(/\s+/g, '-')}-heading`}
            >
              <h2
                id={`footer-${column.title.toLowerCase().replace(/\s+/g, '-')}-heading`}
                className="footer-heading"
              >
                {column.title}
              </h2>
              {column.type === 'search' ? (
                <form className="footer-search-form" action="/search" method="get">
                  <label className="sr-only" htmlFor="footer-search-input">
                    Search for:
                  </label>
                  <input
                    id="footer-search-input"
                    name="s"
                    type="search"
                    placeholder="Search for..."
                    className="footer-search-input"
                  />
                </form>
              ) : column.type === 'contact' ? (
                <div className="footer-contact">
                  {column.items?.map((item, itemIndex) => (
                    <p key={itemIndex} className="footer-contact-item">
                      {item.external ? (
                        <a href={item.href} rel="noopener" target="_blank">
                          {item.label}
                        </a>
                      ) : (
                        <a href={item.href}>{item.label}</a>
                      )}
                    </p>
                  ))}
                </div>
              ) : (
                <ul className="footer-links">
                  {column.items?.map((item, itemIndex) => (
                    <li key={itemIndex}>
                      <Link href={item.href}>{item.label}</Link>
                    </li>
                  ))}
                </ul>
              )}
            </section>
          ))}
        </div>
      </div>

      <div className="footer-bottom">
        <div className="container">
          <p className="footer-copy">
            © 2024{' '}
            <a href="https://qodeinteractive.com" rel="noopener" target="_blank">
              QODE INTERACTIVE
            </a>
            , ALL RIGHTS RESERVED
          </p>
        </div>
      </div>

      <style jsx>{`
        .site-footer {
          background-color: var(--color-brand-accent);
          color: var(--color-text-inverse);
        }

        .footer-widgets {
          padding: var(--space-16) 0;
        }

        .footer-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: var(--space-8);
        }

        @media (min-width: 768px) {
          .footer-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        @media (min-width: 1024px) {
          .footer-grid {
            grid-template-columns: repeat(5, 1fr);
          }
        }

        .footer-widget {
          margin-bottom: var(--space-6);
        }

        .footer-heading {
          font-size: var(--font-size-sm);
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 1px;
          margin-bottom: var(--space-6);
          color: var(--color-text-inverse);
        }

        .footer-search-form {
          margin-top: var(--space-4);
        }

        .footer-search-input {
          width: 100%;
          padding: var(--space-3) var(--space-4);
          font-size: var(--font-size-sm);
          color: var(--color-text-primary);
          background-color: var(--color-bg-page);
          border: 1px solid var(--color-border-subtle);
          border-radius: var(--radius-sm);
        }

        .footer-search-input:focus {
          outline: none;
          border-color: var(--color-brand-primary);
        }

        .footer-contact {
          display: flex;
          flex-direction: column;
          gap: var(--space-2);
        }

        .footer-contact-item a {
          font-size: var(--font-size-sm);
          color: var(--color-text-inverse);
          opacity: 0.8;
          transition: opacity 0.2s;
        }

        .footer-contact-item a:hover {
          opacity: 1;
        }

        .footer-links {
          list-style: none;
          display: flex;
          flex-direction: column;
          gap: var(--space-2);
        }

        .footer-links a {
          font-size: var(--font-size-sm);
          color: var(--color-text-inverse);
          opacity: 0.8;
          transition: opacity 0.2s;
        }

        .footer-links a:hover {
          opacity: 1;
        }

        .footer-bottom {
          border-top: 1px solid rgba(255, 255, 255, 0.1);
          padding: var(--space-6) 0;
        }

        .footer-copy {
          text-align: center;
          font-size: var(--font-size-xs);
          color: var(--color-text-inverse);
          opacity: 0.7;
        }

        .footer-copy a {
          color: var(--color-text-inverse);
          opacity: 1;
          transition: opacity 0.2s;
        }

        .footer-copy a:hover {
          opacity: 0.8;
        }

        .sr-only {
          position: absolute;
          width: 1px;
          height: 1px;
          padding: 0;
          margin: -1px;
          overflow: hidden;
          clip: rect(0, 0, 0, 0);
          white-space: nowrap;
          border-width: 0;
        }
      `}</style>
    </footer>
  )
}

