export default function SectionTitle({ title, subtitle }) {
  return (
    <div className="text-center mb-20">
      <h2 className="text-5xl font-bold mb-6">{title}</h2>

      <p className="text-xl text-gray-600 max-w-2xl mx-auto">{subtitle}</p>
    </div>
  );
}
