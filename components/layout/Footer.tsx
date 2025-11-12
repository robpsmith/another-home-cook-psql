import Link from 'next/link'
import { Heart, Instagram, Twitter, Facebook, Mail } from 'lucide-react'

export function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="border-t border-neutral-200 bg-neutral-50 mt-auto">
      <div className="container mx-auto px-4 md:px-6 py-8 md:py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="md:col-span-2">
            <h3 className="text-lg font-bold text-neutral-900 mb-3">Another Home Cook</h3>
            <p className="text-neutral-600 text-sm leading-relaxed max-w-md">
              Discover and share delicious recipes from around the world. 
              Join our community of food lovers and home chefs creating magic in their kitchens.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold text-neutral-900 mb-3">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/" className="text-neutral-600 hover:text-primary transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/recipes" className="text-neutral-600 hover:text-primary transition-colors">
                  Browse Recipes
                </Link>
              </li>
              <li>
                <Link href="/admin" className="text-neutral-600 hover:text-primary transition-colors">
                  Submit Recipe
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-neutral-600 hover:text-primary transition-colors">
                  About Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Social Links */}
          <div>
            <h4 className="font-semibold text-neutral-900 mb-3">Connect With Us</h4>
            <div className="flex gap-3">
              <a 
                href="https://instagram.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="p-2 rounded-full bg-white border border-neutral-200 text-neutral-600 hover:text-primary hover:border-primary transition-all"
                aria-label="Instagram"
              >
                <Instagram className="h-4 w-4" />
              </a>
              <a 
                href="https://twitter.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="p-2 rounded-full bg-white border border-neutral-200 text-neutral-600 hover:text-primary hover:border-primary transition-all"
                aria-label="Twitter"
              >
                <Twitter className="h-4 w-4" />
              </a>
              <a 
                href="https://facebook.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="p-2 rounded-full bg-white border border-neutral-200 text-neutral-600 hover:text-primary hover:border-primary transition-all"
                aria-label="Facebook"
              >
                <Facebook className="h-4 w-4" />
              </a>
              <a 
                href="mailto:hello@recipehaven.com"
                className="p-2 rounded-full bg-white border border-neutral-200 text-neutral-600 hover:text-primary hover:border-primary transition-all"
                aria-label="Email"
              >
                <Mail className="h-4 w-4" />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-8 pt-8 border-t border-neutral-200 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-neutral-600 text-center md:text-left">
            © {currentYear} Another Home Cook. Made with <Heart className="h-4 w-4 inline text-red-500" /> by food lovers.
          </p>
          <div className="flex gap-6 text-sm">
            <Link href="/privacy" className="text-neutral-600 hover:text-primary transition-colors">
              Privacy Policy
            </Link>
            <Link href="/terms" className="text-neutral-600 hover:text-primary transition-colors">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}

