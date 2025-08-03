import { useRef, useState, useEffect } from "react";

export default function RestFoodData({ foodData }) {
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
    handleScroll(); 

    return () => current.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="w-[80%] mx-auto container gap-10  mb-5 mt-5 min-h-[221px] h-[221px] pt-20">
      <div className="relative ">
         <h2 className=" left-[10%] text-[24px] font-semibold min-h-[26px] text-[#02060ceb]">
          What's on your mind?
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

      <div
        ref={scrollRef}
        className="overflow-x-auto  scrollbar-hide pt-6  mx-auto scroll-smooth">
        <div className="flex gap-6 min-w-max  min-h-[180px] ">
          {foodData?.map((data, index) => (
            <a href={data?.action?.link ?? "#"} key={data?.id ?? index}>
              <img     onLoad={handleScroll}
                className="h-[11.25rem] w-[9rem] min-h-[11.25rem] min-w-[9rem] object-cover rounded-xl"
                src={`https://media-assets.swiggy.com/swiggy/image/upload/${data?.imageId}`}
                alt={data?.action?.text ?? "Food Image"}
              />
            </a>
          ))}
        </div>
      </div>

      <hr className=" border mt-5 border-gray-500"></hr>
    </div>
  );
}
