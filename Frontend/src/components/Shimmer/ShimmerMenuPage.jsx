export default function ShimmerMenuPage() {
  return (
    <div className="w-full pt-24 animate-pulse">
      <div className="w-[800px] mx-auto">
        {/* Breadcrumb */}
        <div className="h-4 bg-gray-200 w-[200px] rounded mb-4"></div>

        {/* Restaurant Name */}
        <div className="h-6 bg-gray-300 w-[300px] rounded mb-6"></div>

        {/* Restaurant Info Box */}
        <div className="h-[164px] w-full rounded-3xl pr-4 pl-4 pb-4 mx-auto bg-gradient-to-t from-slate-200">
          <div className="w-full border border-[#02060c26] rounded-2xl bg-white h-full pl-3">
            <div className="flex items-center gap-3 mt-5">
              <div className="w-6 h-6 bg-gray-200 rounded-full"></div>
              <div className="h-4 w-[100px] bg-gray-200 rounded"></div>
              <div className="h-4 w-[60px] bg-gray-200 rounded"></div>
            </div>
            <div className="mt-2 h-4 w-[70%] bg-gray-200 rounded"></div>
            <div className="flex mt-4 gap-3">
              <div className="w-[5px] h-[40px] bg-gray-300"></div>
              <div>
                <div className="h-4 w-[120px] bg-gray-200 rounded mb-2"></div>
                <div className="h-4 w-[100px] bg-gray-200 rounded"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Deals */}
        <div className="pt-6">
          <div className="h-6 bg-gray-300 w-[200px] rounded mb-4"></div>
          <div className="flex gap-4 overflow-x-auto">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className="w-[328px] h-[76px] border border-gray-300 rounded-2xl bg-white p-3 flex gap-4"
              >
                <div className="w-12 h-12 bg-gray-300 rounded-full"></div>
                <div>
                  <div className="h-4 w-[150px] bg-gray-300 rounded mb-2"></div>
                  <div className="h-4 w-[100px] bg-gray-200 rounded"></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Menu Filter */}
        <div className="flex gap-4 mt-8">
          <div className="w-[72px] h-[34px] bg-gray-300 rounded-xl"></div>
          <div className="w-[80px] h-[34px] bg-gray-300 rounded-xl"></div>
          <div className="w-[100px] h-[34px] bg-gray-300 rounded-xl"></div>
        </div>

        {/* Menu Sections */}
        <div className="mt-8 space-y-10">
          {[...Array(3)].map((_, i) => (
            <div key={i}>
              <div className="h-6 w-[200px] bg-gray-300 rounded mb-4"></div>
              {[...Array(2)].map((_, j) => (
                <div
                  key={j}
                  className="h-[174px] w-full mb-6 flex justify-between"
                >
                  <div className="flex-1 pr-4">
                    <div className="h-5 w-[150px] bg-gray-300 rounded mb-2"></div>
                    <div className="h-5 w-[100px] bg-gray-200 rounded mb-2"></div>
                    <div className="h-4 w-[80px] bg-gray-200 rounded mb-2"></div>
                    <div className="h-4 w-[200px] bg-gray-100 rounded"></div>
                  </div>
                  <div className="relative w-[156px] h-[144px]">
                    <div className="h-[144px] w-[156px] bg-gray-300 rounded-xl"></div>
                    <div className="absolute bottom-[-20px] left-4 w-[120px] h-[38px] bg-gray-200 rounded-xl"></div>
                  </div>
                </div>
              ))}
              <div className="h-5 bg-gray-200 mt-2 mb-2"></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
