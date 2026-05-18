import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="border-t border-gray-200 bg-white">
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-8 px-5 py-10 md:grid-cols-5">
        <div className="md:col-span-2">
          <h2 className="text-2xl font-bold">Optivio AI</h2>
          <p className="mt-3 max-w-md text-sm leading-6 text-gray-600">
            A focused SEO analytics SaaS for audits, keyword research, competitor analysis, AI recommendations, and reports.
          </p>
        </div>

        {[
          ["Product", "SEO Analyzer", "Keyword Research", "AI Insights"],
          ["Company", "About", "Security", "Status"],
          ["Legal", "Privacy", "Terms", "Contact"],
        ].map(([title, ...links]) => (
          <div key={title}>
            <h3 className="font-bold">{title}</h3>
            <ul className="mt-3 space-y-2 text-sm text-gray-600">
              {links.map((item) => (
                <li key={item}>
                  <Link>{item}</Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="border-t border-gray-100">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 px-5 py-4 text-sm text-gray-500 md:flex-row">
          <p>Copyright 2026 Optivio AI. All rights reserved.</p>
          <div className="flex gap-5">
            <Link>English (US)</Link>
            <Link>USD</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
