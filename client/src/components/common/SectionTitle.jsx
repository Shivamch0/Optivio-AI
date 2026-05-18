export default function SectionTitle({ title, subtitle }) {
  return (
    <div className="mx-auto mb-8 max-w-3xl text-center">
      <h2 className="mb-3 text-3xl font-bold lg:text-4xl">{title}</h2>

      <p className="mx-auto max-w-2xl text-base leading-7 text-gray-600">{subtitle}</p>
    </div>
  );
}
