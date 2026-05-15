export default function DashboardPreview() {
  return (
    <div className="relative mt-24">
      <div className="absolute -top-10 -left-10 w-72 h-72 bg-purple-500/20 blur-3xl rounded-full"></div>

      <div className="absolute -bottom-10 -right-10 w-72 h-72 bg-blue-500/20 blur-3xl rounded-full"></div>

      <div className="relative bg-white rounded-3xl border border-gray-200 shadow-2xl overflow-hidden p-4">
        <img
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuA1scv9dYajeOhXUPGQ3MYhJFsC_B_8oab1r0a49mktMTK28OOqRV0hqFVaEU4jXlhTmkJJMw7SNvP9DZhOybh9ToDtPae7-l6ub0e27ULeQmEbX4u17Z6NHcpdnh31qjaQ98lMAIwqN0vWOPMUWW72BGPmyL1WAXaaArR6Z2jgIIlY4krqFtrPRfuzHKAHo733emhVKUUNsbvb7odRQStxGDEYudckW_cj_frN6eLJk5OBvnx6VGyLUkSQwEFlnNxKfbqs-Zd_Zqk"
          alt="dashboard"
          className="rounded-2xl w-full"
        />

        <div className="hidden lg:block absolute top-24 -right-6 bg-white/70 backdrop-blur-xl border border-white/40 shadow-xl rounded-2xl p-5 w-64">
          <h4 className="font-semibold text-purple-700 mb-2">
            AI Recommendation
          </h4>

          <p className="text-sm text-gray-600">
            Update H1 tags on 12 pages to boost visibility by 15%
          </p>
        </div>

        <div className="hidden lg:block absolute bottom-20 -left-6 bg-white rounded-2xl shadow-xl p-5 border border-gray-100">
          <p className="text-sm text-gray-500">SEO Score</p>

          <h3 className="text-4xl font-bold text-purple-700">94/100</h3>
        </div>
      </div>
    </div>
  );
}
