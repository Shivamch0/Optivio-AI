import { Link } from "react-router-dom";
export default function Footer() {
  return (
    <footer className="bg-white border-t border-gray-200">
      {/* Top Footer */}
      <div className="max-w-7xl mx-auto px-6 py-20 grid grid-cols-1 md:grid-cols-5 gap-12">
        {/* Brand */}
        <div className="md:col-span-2">
          <h2 className="text-3xl font-bold mb-6">RankPilot AI</h2>

          <p className="text-gray-600 leading-relaxed max-w-md mb-8">
            Precision SEO Engineering for the AI era. Empowering brands to
            dominate search with intelligent, data-backed insights.
          </p>

          <div className="flex gap-5 text-2xl">
            <Link
              className="text-gray-500 hover:text-purple-700 transition"
            >
              🌐
            </Link>

            <Link
              className="text-gray-500 hover:text-purple-700 transition"
            >
              ✉️
            </Link>

            <Link
              className="text-gray-500 hover:text-purple-700 transition"
            >
              📢
            </Link>
          </div>
        </div>

        {/* Links */}
        <div>
          <h3 className="font-bold text-lg mb-6">Product</h3>

          <ul className="space-y-4 text-gray-600">
            <li>
              <Link>SEO Analyzer</Link>
            </li>
            <li>
              <Link>Keyword Research</Link>
            </li>
            <li>
              <Link>AI Insights</Link>
            </li>
            <li>
              <Link>Backlink Monitor</Link>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="font-bold text-lg mb-6">Company</h3>

          <ul className="space-y-4 text-gray-600">
            <li>
              <Link>About Us</Link>
            </li>
            <li>
              <Link>Blog</Link>
            </li>
            <li>
              <Link>Careers</Link>
            </li>
            <li>
              <Link>Security</Link>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="font-bold text-lg mb-6">Legal</h3>

          <ul className="space-y-4 text-gray-600">
            <li>
              <Link>Privacy Policy</Link>
            </li>
            <li>
              <Link>Terms of Service</Link>
            </li>
            <li>
              <Link>API Status</Link>
            </li>
          </ul>
        </div>
      </div>

      {/* Bottom Footer */}
      <div className="border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-6 py-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-gray-500 text-sm">
            © 2024 RankPilot AI. All rights reserved.
          </p>

          <div className="flex gap-6 text-sm text-gray-500">
            <Link>English (US)</Link>
            <Link>EUR (€)</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
