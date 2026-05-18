import FeatureCard from "./FeatureCard";
import SectionTitle from "../common/SectionTitle";

export default function FeaturesSection() {
  return (
    <section className="mx-auto max-w-7xl px-5 py-14">
      <SectionTitle
        title="Precision SEO Tools"
        subtitle="Everything you need to manage audits, keywords, competitors, and reports without dashboard clutter."
      />

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <FeatureCard
          title="SEO Analyzer"
          description="Run real HTML checks for titles, meta descriptions, headings, image alt coverage, links, and technical issues."
          icon="SEO"
          className="md:col-span-2"
          image="https://lh3.googleusercontent.com/aida-public/AB6AXuCbxpd6awjMB5Wm68Bcay-9lWXcwdMSeakCGbwYKbbSdlQ_w1c7rmeKkctIhA7Hk8jM9mwbMyYytgpGpcvvQbaQd4X3XXnx6G9Aw5AZzM4-cxL2TbVWeX1oiQ_UjVAFBiQQJiXXfdJaBE2ob7-ffmz9LyrQiKkppV3ZJxA1BzQYkhzhIwE8-J-4amZwXymB7I_Q5QJIWM6KJuUjSiVqoWr_ir9AMk5u-H7NU3fd1MondYdPEO9msU_SyWt452bIL7jrbJgOZLatJRQ"
        />

        <FeatureCard
          title="AI Insights"
          description="Turn audit results into prioritized optimization suggestions for content and technical SEO."
          icon="AI"
          dark
        />

        <FeatureCard
          title="Keyword Research"
          description="Track ranking estimates, difficulty, intent, and keyword ideas from a focused workspace."
          icon="KW"
        />

        <FeatureCard
          title="Competitors"
          description="Compare score, speed, and issue gaps in a simple side-by-side view."
          icon="CA"
        />

        <FeatureCard
          title="Reports"
          description="Export audit history as PDF, CSV, JSON, or printable HTML for viva and client demos."
          icon="PDF"
        />
      </div>
    </section>
  );
}
