import Button from "../common/Button";

export default function SearchBar() {
  return (
    <div className="flex flex-col md:flex-row gap-4 max-w-2xl mx-auto">
      <input
        type="text"
        placeholder="Enter your website URL"
        className="flex-1 px-5 py-4 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-600"
      />

      <Button>Analyze Website</Button>
    </div>
  );
}
