import { DineData } from "../../Utils/DineData";
import { useState, useRef, useEffect } from "react";
import DineCard from "./DineCard";

export default function DineOption() {
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
    handleScroll(); // Initial check

    return () => current.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="min-h-[298px] max-w-[80%] container mx-auto mt-20  mb-4 gap-10 ">
      {/* Header & Buttons */}
      <div className="relative pb-8">
        <h2 className="text-[24px] font-semibold min-h-[26px] text-[#02060ceb]">
          Discover best restaurants on Dineout
        </h2>
        <div className="absolute top-0 right-0 flex z-10">
          <button
            onClick={scrollLeft}
            disabled={!buttonLeft}
            className={`w-12 h-12 rounded-full shadow mr-4 transition-colors duration-100 ${
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
            className={`w-12 h-12 rounded-full shadow transition-colors duration-100 ${
              buttonRight
                ? "bg-gray-600 text-white"
                : "bg-gray-200 text-gray-400 cursor-not-allowed"
            }`}
          >
            &rarr;
          </button>
        </div>
      </div>

      {/* Scrollable Dine cards */}
      <div
        ref={scrollRef}
        className="flex flex-nowrap overflow-x-auto scrollbar-hide min-h-[409px] gap-10 scroll-smooth "
      >
        {DineData.map((data) => (
          <DineCard key={data.id} resturantdata={data} />
        ))}
      </div>
    </div>
  );
}
