// components/layout/Footer.jsx

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
            <a
              href="#"
              className="text-gray-500 hover:text-purple-700 transition"
            >
              🌐
            </a>

            <a
              href="#"
              className="text-gray-500 hover:text-purple-700 transition"
            >
              ✉️
            </a>

            <a
              href="#"
              className="text-gray-500 hover:text-purple-700 transition"
            >
              📢
            </a>
          </div>
        </div>

        {/* Links */}
        <div>
          <h3 className="font-bold text-lg mb-6">Product</h3>

          <ul className="space-y-4 text-gray-600">
            <li>
              <a href="#">SEO Analyzer</a>
            </li>
            <li>
              <a href="#">Keyword Research</a>
            </li>
            <li>
              <a href="#">AI Insights</a>
            </li>
            <li>
              <a href="#">Backlink Monitor</a>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="font-bold text-lg mb-6">Company</h3>

          <ul className="space-y-4 text-gray-600">
            <li>
              <a href="#">About Us</a>
            </li>
            <li>
              <a href="#">Blog</a>
            </li>
            <li>
              <a href="#">Careers</a>
            </li>
            <li>
              <a href="#">Security</a>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="font-bold text-lg mb-6">Legal</h3>

          <ul className="space-y-4 text-gray-600">
            <li>
              <a href="#">Privacy Policy</a>
            </li>
            <li>
              <a href="#">Terms of Service</a>
            </li>
            <li>
              <a href="#">API Status</a>
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
            <a href="#">English (US)</a>
            <a href="#">EUR (€)</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
