import FeatureCard from "./FeatureCard";
import SectionTitle from "../common/SectionTitle";

export default function FeaturesSection() {
  return (
    <section className="max-w-7xl mx-auto px-6 py-28">
      <SectionTitle
        title="Precision SEO Tools"
        subtitle="Everything you need to outrank your competition and own the first page."
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <FeatureCard
          title="SEO Analyzer"
          description="Deep crawl technology that identifies technical SEO debt, broken links, and metadata optimization opportunities in seconds."
          icon="🔍"
          className="md:col-span-2"
          image="https://lh3.googleusercontent.com/aida-public/AB6AXuCbxpd6awjMB5Wm68Bcay-9lWXcwdMSeakCGbwYKbbSdlQ_w1c7rmeKkctIhA7Hk8jM9mwbMyYytgpGpcvvQbaQd4X3XXnx6G9Aw5AZzM4-cxL2TbVWeX1oiQ_UjVAFBiQQJiXXfdJaBE2ob7-ffmz9LyrQiKkppV3ZJxA1BzQYkhzhIwE8-J-4amZwXymB7I_Q5QJIWM6KJuUjSiVqoWr_ir9AMk5u-H7NU3fd1MondYdPEO9msU_SyWt452bIL7jrbJgOZLatJRQ"
        />

        <FeatureCard
          title="AI Insights"
          description="Generative AI that writes optimized meta descriptions and suggests high-intent keywords."
          icon="✨"
          dark
        />

        <FeatureCard
          title="Keyword Research"
          description="Discover long-tail keywords with low difficulty and high conversion potential."
          icon="🔑"
        />

        <FeatureCard
          title="Competitor Analysis"
          description="Reverse engineer your competitor rankings and SEO strategy."
          icon="📊"
        />

        <FeatureCard
          title="PDF Reports"
          description="Generate beautiful white-labeled SEO reports in one click."
          icon="📄"
        />
      </div>
    </section>
  );
}
