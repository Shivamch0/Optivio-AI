// components/testimonials/TestimonialsSection.jsx

import TestimonialCard from "./TestimonialCard";
import SectionTitle from "../common/SectionTitle";

export default function TestimonialsSection() {
  const testimonials = [
    {
      quote:
        "RankPilot's AI recommendations completely changed how we handle content strategy. Traffic increased by 40% in three months.",
      name: "Sarah Jenkins",
      role: "SEO Director at TechFlow",
      image:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuBnyiB9B_Oohad2M91Inxaz6405nJK57Tw5Lre3WHx8ZMCqwXLBg9D4nzIFMH9LvBOyu9cV-qhHKcg7daGLutFZpgCLMIoenuNQ5fDIPNfM06097p-mTWJlLtW5bdWf5oyjWVg6DPUlDspDaVB2paJ94j6Ay2WLLLy8jlHUyKGZARaMvuixJfVEIcaVDbyiu7EJVzz9LXchUB4wdMkNPEmOBPC5ZgYKNq4U_T-aRuoG56jCiDJg9e_41p1GAFicCuNYMrDzmfAoWow",
    },
    {
      quote:
        "The competitor analysis tools are unparalleled. We discovered ranking gaps that gave us a massive edge in the market.",
      name: "Marcus Thorne",
      role: "Founder, GrowthSync",
      image:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuCD1mZ9COZticrAtiMqvIvWduUNskBeQfk4s1q87rJmZsLuOUoTr8_KjunJyaM2Z66jai5MXKQOW7J7vHF9OKxaNW_DmpFXoVHfX27G-TIjVmMwEAJ26wHeMuAXWhd0cG_BbKgxGuHabs6UiiJRkNWt6MPJsuz6UmnSH_-Jufw_SNbcNRlDoW4zdCWMtpeWa0UZAeq6UEJ4Lxv-bNzoQvCymqpZSOsxjGFByQhAVMd5NVUP6lGbQ_PPnzrYVN9zUOI-Dny4Q7Xni7c",
    },
  ];

  return (
    <section className="bg-[#eef2f7] py-28 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        <SectionTitle
          title="Trusted by Marketing Leaders"
          subtitle="Thousands of businesses use RankPilot to scale organic growth."
        />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {testimonials.map((item) => (
            <TestimonialCard key={item.name} {...item} />
          ))}
        </div>
      </div>
    </section>
  );
}
