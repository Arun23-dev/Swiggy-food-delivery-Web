export default function TopFoodShimmer() {
  return (
    <div className="w-[80%] mx-auto container mt-40 h-[379.492px]">
      {/* Header and Buttons */}
      <div className="mb-4 h-[25.195px] flex justify-between">
        <div className="h-6 w-[300px] bg-gray-300 rounded animate-pulse"></div>
        <div className="flex space-x-4">
          <div className="w-8 h-8 rounded-full bg-gray-300 animate-pulse"></div>
          <div className="w-8 h-8 rounded-full bg-gray-300 animate-pulse"></div>
        </div>
      </div>

      {/* Scroll Area Shimmer Cards */}
      <div className="h-[286.297px] flex flex-nowrap overflow-hidden space-x-5">
        {Array.from({ length: 5 }).map((_, idx) => (
          <div
            key={idx}
            className="w-[273px] h-[286.297px] animate-pulse bg-gray-200 rounded-xl"
          >
            <div className="h-[182px] w-full bg-gray-300 rounded-t-xl"></div>
            <div className="p-3 space-y-2">
              <div className="h-4 bg-gray-300 rounded w-[80%]"></div>
              <div className="h-4 bg-gray-300 rounded w-[60%]"></div>
              <div className="h-4 bg-gray-300 rounded w-[70%]"></div>
              <div className="h-4 bg-gray-300 rounded w-[50%]"></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
