import { useEffect, useState,useRef } from "react";
import { useParams, Link } from "react-router";
import MenuList from "./MenuList";

export default function ResturantFoodMenu() {
  const { id } = useParams();
  const [RestData, setRestData] = useState(null);
  const [selected, SetSelected] = useState(null);
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


  const temp = RestData?.data?.cards[4]?.groupedCard?.cardGroupMap?.REGULAR?.cards;
  const FilteredData = temp?.filter((items) => "title" in items?.card?.card);
  const RestInfo = RestData?.data?.cards[2]?.card?.card?.info;
  const Offers=RestData?.data?.cards[3]?.card?.card?.gridElements?.infoWithStyle?.offers;

  useEffect(() => {
    async function fetchData() {
      const proxy = "https://cors-anywhere.herokuapp.com/";
      const swiggyFoodMenuAPI = `https://www.swiggy.com/dapi/menu/pl?page-type=REGULAR_MENU&complete-menu=true&lat=28.7040592&lng=77.10249019999999&restaurantId=${id}&catalog_qa=undefined&submitAction=ENTER`;
      const response = await fetch(proxy + swiggyFoodMenuAPI);
      const data = await response.json();
      setRestData(data);
    }
    fetchData();
  }, [id]);


  

  console.log(Offers);
  return (
    <div className="w-full pt-24">
      <div className="w-[800px] mx-auto">
        <Link to="/resturants">
          <span className="hover:cursor-pointer text-[10px]">Home</span>
        </Link>
        <span className="text-[10px]">/{RestInfo?.city}</span>
        <span className="text-[10px]">/{RestInfo?.name}</span>

        <h1 className="mt-4 mb-4 text-[28px] font-bold text-[#02060ceb]">{RestInfo?.name}</h1>

        <div className="h-[164px] w-full rounded-3xl pr-4 pl-4 pb-4 mx-auto bg-gradient-to-t from-slate-200">
          <div className="w-full border border-[#02060c26] rounded-2xl bg-white h-full pl-3">
            <div className="gap-1 flex  mt-5   text-[16px] font-semibold">
              <span><svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true" strokeColor="rgba(2, 6, 12, 0.92)" fillColor="rgba(2, 6, 12, 0.92)"><circle cx="10" cy="10" r="9" fill="url(#StoreRating20_svg__paint0_linear_32982_71567)"></circle><path d="M10.0816 12.865C10.0312 12.8353 9.96876 12.8353 9.91839 12.865L7.31647 14.3968C6.93482 14.6214 6.47106 14.2757 6.57745 13.8458L7.27568 11.0245C7.29055 10.9644 7.26965 10.9012 7.22195 10.8618L4.95521 8.99028C4.60833 8.70388 4.78653 8.14085 5.23502 8.10619L8.23448 7.87442C8.29403 7.86982 8.34612 7.83261 8.36979 7.77777L9.54092 5.06385C9.71462 4.66132 10.2854 4.66132 10.4591 5.06385L11.6302 7.77777C11.6539 7.83261 11.706 7.86982 11.7655 7.87442L14.765 8.10619C15.2135 8.14085 15.3917 8.70388 15.0448 8.99028L12.7781 10.8618C12.7303 10.9012 12.7095 10.9644 12.7243 11.0245L13.4225 13.8458C13.5289 14.2757 13.0652 14.6214 12.6835 14.3968L10.0816 12.865Z" fill="white"></path><defs><linearGradient id="StoreRating20_svg__paint0_linear_32982_71567" x1="10" y1="1" x2="10" y2="19" gradientUnits="userSpaceOnUse"><stop stop-color="#21973B"></stop><stop offset="1" stop-color="#128540"></stop></linearGradient></defs></svg></span>
            <span>{RestInfo?.avgRating}</span>
            <span>({RestInfo?.totalRatingsString})</span>
            <span>·</span>
            <span>{RestInfo?.costForTwoMessage}</span>
            </div>

           <p className="text-[#ff5200] underline">  { RestInfo?.cuisines?.join(", ")} </p> 

            <div className="flex gap-1 ">
                  <div className="flex  flex-col align-middle w-[5px] justify-center items-center">
                      <span className="inline-block w-[5px] h-[5px] rounded-full bg-gray-600"></span>
                      <span className="inline-block w-[2px] h-[30px]  bg-gray-600  "></span>
                      <span className="inline-block w-[5px] h-[5px] rounded-full bg-gray-600"></span>
                  </div>

                  <div className="pl-2">
                    <div className="flex gap-1 ">
                      <span className="font-semibold text-[14px]">Outlet</span>
                      <span className="text-[#02060c99] text-[14px]">{RestInfo?.areaName}</span>

                    </div>
                    <div className="pt-1 text-[14px] font-semibold">
                      {RestInfo?.sla?.slaString}
                    </div>
                     <div>
                      
                    </div>
                  </div>




            </div>
          </div>
        </div> 

        <div className="pt-6">
          <div  className="relative mb-8">
        <h1 className="text-[20px] font-bold">Deals for You</h1>
         <div className="absolute top-0 right-0 flex z-10">
          <button onClick={scrollLeft} disabled={!buttonLeft} className={`w-12 h-12 rounded-full shadow mr-4 transition-colors duration-100 ${
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

            <div>
            
              <div  ref={scrollRef} className="flex gap-4 overflow-x-auto scrollbar-hide">
            
                {
                  Offers?.map((data)=>{
                    return (
                      <div className="w-[328px] h-[76px] border border-gray-300 rounded-2xl ">
                      
                    <div className="w-[300px] h-[48px]  mx-auto mt-3 ml-3  flex" key={data?.info?.header}>


                      <img src={`https://media-assets.swiggy.com/swiggy/image/upload/${data?.info?.offerLogo}`} className="h-12 w-12"></img>
                      <div className="ml-3">

                        <div className="text-[18px] font-extrabold hover:cursor-pointer">{data?.info?.header}</div>
                        <div className="text-[14px] font-semibold text-[#02060c73]">{data?.info?.description}</div>
                      
                      </div>    
                      
                    </div>
                    </div>

                  )

                  })

                }
                </div>
                
              </div>
            </div>

              <div className="flex justify-center mt-8 ">
                MENU
              </div>

                <Link to={`/city/delhi/${id}/search`}>
                <div className="mt-6 bg-gray-300 h-[50px] rounded-2xl  font-bold text-[16px]   flex items-center justify-center ">
                Search for Dishes
                </div>
            </Link>

        <div className="flex gap-2 pt-4">
     
       <div> 
        <div className="w-[72px] h-[34px] border">
          <button 
            className={`rounded-xl ${selected === "veg" ? "bg-green-400" : "bg-white"}`}
            onClick={() => SetSelected(selected === "veg" ? null : "veg")} >Veg
        </button>

        </div>
        
        </div>
        <div>
         <button
          className={`border-4 w-[80px] rounded-xl ${selected === "nonveg" ? "bg-red-500" : "bg-white"}`}
          onClick={() => SetSelected(selected === "nonveg" ? null : "nonveg")}>Non-Veg
        </button>
        </div>
        <div>
          <button>Bestseller</button>
        </div>
        </div>
     

    
          <div className="">
            {FilteredData?.map((menuitems) => (
              <MenuList
                key={menuitems?.card?.card?.title}
                menuitems={menuitems?.card?.card}
                foodSelected={selected}
              />
            ))}
          </div>
      </div>   
         
    
  
     
    </div>
  );
}
