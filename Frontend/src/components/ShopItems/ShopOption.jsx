import { useRef, useState, useEffect } from "react";
import { ShopData } from "../../Utils/ShopData";
import ShopCard from "./ShopCard";

export default function ShopOption() {
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
    handleScroll(); // initial check

    return () => current.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="min-h-[298px] max-w-[80%] container mx-auto mt-30 gap-10 ">
      {/* Header & Buttons */}
      <div className="relative ">
        <h2 className="text-[24px] font-semibold min-h-[26px] text-[#02060ceb]">
          Shop groceries on Instamart
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


      {/* Scroll container */}
      <div
        ref={scrollRef}
        className="overflow-x-auto px-6 scrollbar-hide pt-10  mx-auto scroll-smooth"
      >
        <div className="grid grid-flow-col auto-cols-[9rem] gap-x-8 min-h-[260px]">
          {ShopData.map((data) => (
            <ShopCard key={data.id} shopdata={data} />
          ))}
        </div>
      </div>
    </div>
  );
}
