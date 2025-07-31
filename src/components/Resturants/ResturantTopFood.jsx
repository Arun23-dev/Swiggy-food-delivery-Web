import ResturantTopFoodCard from "./ResturantTopFoodCard"
import { useRef, useState, useEffect } from "react";
export default function ResturantTopFood({ TopFoodData }) {
  const scrollRef = useRef();
  const [buttonLeft, setButtonLeft] = useState(false);
  const [buttonRight, setButtonRight] = useState(true);

  const scrollLeft = () => {
    scrollRef.current.scrollBy({ left: -700, behavior: "smooth" });
  };

  const scrollRight = () => {
    scrollRef.current.scrollBy({ left: 700, behavior: "smooth" });
  };

  const handleScroll = () => {
    const scrollElement = scrollRef.current;
    const scrollLeftVal = scrollElement.scrollLeft;
    const maxScrollLeft = scrollElement.scrollWidth - scrollElement.clientWidth;

    setButtonLeft(scrollLeftVal > 0);
    setButtonRight(scrollLeftVal < maxScrollLeft - 1);
  };

  useEffect(() => {
    const current = scrollRef.current;
    if (!current) return;

    current.addEventListener("scroll", handleScroll);
    handleScroll(); // Initial check on mount

    return () => current.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className=" w-[80%] mx-auto container mt-40  h-[379.492px]">
      {/* arrow and header */}
      <div className="mb-4 h-[25.195px]  flex justify-between ">
        <h2 className="text-[21px] font-bold  text-[#02060ceb]">
          Top Resturants Chain in Delhi
        </h2>
        <div className="flex">
          <button
            onClick={scrollLeft}
            disabled={!buttonLeft}
            className={`w-8 h-8 rounded-full shadow mr-4 transition-colors duration-100 ${
              buttonLeft
                ? "bg-gray-600 text-white"
                : "bg-gray-200 text-gray-400 cursor-not-allowed"
            }`}
          >
            &larr;
          </button>
          <button
            onClick={scrollRight}
            disabled={!buttonRight}
            className={`w-8 h-8 rounded-full shadow transition-colors duration-100 ${
              buttonRight
                ? "bg-gray-600 text-white"
                : "bg-gray-200 text-gray-400 cursor-not-allowed"
            }`}
          >
            &rarr;
          </button>
        </div>
      </div>
    

      <div
        ref={scrollRef}
        className=" h-[286.297px] flex flex-nowrap overflow-x-auto scrollbar-hide scroll scroll-smooth mb-4"
      >
       { TopFoodData?.map((data)=><ResturantTopFoodCard key={data?.info?.id} data={data}></ResturantTopFoodCard>)
        }
      </div>
    </div>
  );
}
