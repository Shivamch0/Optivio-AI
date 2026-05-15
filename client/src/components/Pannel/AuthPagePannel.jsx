
function AuthPagePannel() {
  return (
    <div className="bg-gradient-to-br from-[#121826] to-[#1f2a44] p-8 flex flex-col justify-between">
      <div>
        <div className="text-white text-xl font-bold mb-6">✦ RankPilot AI</div>

        <div className="rounded-2xl overflow-hidden bg-[#0b1120] p-4 shadow-lg">
          <img
            src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1200&auto=format&fit=crop"
            alt="analytics"
            className="rounded-xl w-full h-[360px] object-cover"
          />
        </div>
      </div>

      <div className="text-center mt-8">
        <h1 className="text-white text-5xl font-bold leading-tight">
          Master the Search Landscape.
        </h1>

        <p className="text-gray-300 mt-6 text-lg leading-relaxed">
          Experience SEO precision engineered by artificial intelligence. Scale
          your visibility with RankPilot AI’s predictive keyword modeling.
        </p>
      </div>
    </div>
  );
}

export default AuthPagePannel