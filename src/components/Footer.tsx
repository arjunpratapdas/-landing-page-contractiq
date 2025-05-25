
import { File, Twitter, Instagram, Youtube, Linkedin } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const footerSections = [
    {
      title: 'Product',
      links: [
        { name: 'Features', url: '#features' },
        { name: 'Tools', url: '#tools' },
        { name: 'Pricing', url: '#pricing' },
        { name: 'Enterprise', url: '#enterprise' },
      ]
    },
    {
      title: 'Resources',
      links: [
        { name: 'Documentation', url: '#' },
        { name: 'Blog', url: '#' },
        { name: 'Case Studies', url: '#' },
        { name: 'API', url: '#' },
      ]
    },
    {
      title: 'Company',
      links: [
        { name: 'About', url: '#' },
        { name: 'Careers', url: '#' },
        { name: 'Contact', url: '#' },
        { name: 'Privacy', url: '#' },
      ]
    }
  ];

  return (
    <footer className="pt-16 pb-8 border-t border-white/5">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          <div>
            <Link to="/" className="flex items-center space-x-2 mb-5">
              <File className="h-8 w-8 text-contractBlue-400" />
              <span className="text-xl font-semibold text-white tracking-tight">Contract IQ</span>
            </Link>
            <p className="text-white/60 mb-4 text-sm">
              Transforming contract management with powerful AI technology
            </p>
          </div>
          
          {footerSections.map((section, i) => (
            <div key={i}>
              <h3 className="font-medium mb-4">{section.title}</h3>
              <ul className="space-y-2">
                {section.links.map((link, j) => (
                  <li key={j}>
                    {link.url.startsWith('#') ? (
                      <a href={link.url} className="text-white/60 hover:text-contractBlue-400 transition-colors text-sm">
                        {link.name}
                      </a>
                    ) : (
                      <Link to={link.url} className="text-white/60 hover:text-contractBlue-400 transition-colors text-sm">
                        {link.name}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        
        <div className="border-t border-white/5 pt-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between">
            <p className="text-white/50 text-sm order-2 md:order-1 mt-4 md:mt-0">
              © {currentYear} Contract IQ. All rights reserved.
            </p>
            
            <div className="flex space-x-5 order-1 md:order-2">
              <a href="#" className="text-white/50 hover:text-contractBlue-400 transition-colors">
                <Twitter size={20} />
              </a>
              <a href="#" className="text-white/50 hover:text-contractBlue-400 transition-colors">
                <Instagram size={20} />
              </a>
              <a href="#" className="text-white/50 hover:text-contractBlue-400 transition-colors">
                <Youtube size={20} />
              </a>
              <a href="#" className="text-white/50 hover:text-contractBlue-400 transition-colors">
                <Linkedin size={20} />
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
