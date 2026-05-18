import Button from "../common/Button";

export default function SearchBar() {
  return (
    <div className="mt-7 flex max-w-xl flex-col gap-3 sm:flex-row">
      <input
        type="text"
        placeholder="Enter your website URL"
        className="h-12 flex-1 rounded-lg border border-[#cfd8e3] px-4 text-sm outline-none focus:border-[#2563eb] focus:ring-4 focus:ring-[#2563eb]/15"
      />

      <Button>Analyze Website</Button>
    </div>
  );
}
