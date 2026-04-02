import { useRef, useState, useEffect } from "react";
import { FoodData } from "../../Utils/FoodData";
import FoodCard from "./FoodCard";

export default function FoodOption() {
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
    <div className="h-[26.125rem] mb-8 mt-20 relative">
      
      <div className="absolute top-0 right-[10%] flex z-10">
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

      {/* Scrollable Food Items */}
      <div
        ref={scrollRef}
        className="overflow-x-auto px-6 scrollbar-hide pt-16 max-w-8/10 mx-auto scroll-smooth"
      >
        <div className="grid grid-flow-col grid-rows-2 auto-cols-[9rem] gap-x-8 gap-y-8 min-h-[360px]">
          {FoodData.map((data) => (
            <FoodCard key={data.id} fooddata={data} />
          ))}
        </div>
      </div>
    </div>
  );
}
