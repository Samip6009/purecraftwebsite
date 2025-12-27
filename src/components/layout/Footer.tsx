import { Container } from './SiteShell';

const footerLinks = [
  { name: 'Services', href: '#services' },
  { name: 'About', href: '#about' },
  { name: 'Contact', href: '#contact' },
  { name: 'Privacy', href: '#' },
];

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="py-12 md:py-16 border-t border-border">
      <Container size="wide">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
          {/* Logo & Copyright */}
          <div>
            <a href="/" className="font-serif text-xl font-medium text-text-primary mb-2 block">
              Pure Craft
            </a>
            <p className="text-small text-text-muted">
              © {currentYear} samipkc.com.np. All rights reserved.
            </p>
          </div>

          {/* Links */}
          <nav className="flex flex-wrap gap-6 md:gap-8" aria-label="Footer navigation">
            {footerLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="text-small text-text-secondary hover:text-text-primary transition-colors duration-medium"
              >
                {link.name}
              </a>
            ))}
          </nav>
        </div>
      </Container>
    </footer>
  );
}
