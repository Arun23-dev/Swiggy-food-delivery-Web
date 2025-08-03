import { Link } from "react-router";
function Header() {
  return (
    <header className="bg-[#ff5200] font-serif">
      
      
      <div className="flex justify-between items-center container mx-auto py-8 max-w-[80%]">
  <img
    src="https://res.cloudinary.com/dutdah0l9/image/upload/v1720058694/Swiggy_logo_bml6he.png"
    alt="logo"
    className="h-[3rem] w-[10rem]"
  />

  <div className="flex items-center text-white gap-8 font-bold text-base">
    <a
      href="https://www.swiggy.com/corporate/"
      target="_blank"
      className="text-white text-[16px] font-bold"
    >
      Swiggy Corporate
    </a>
    <a
      href="https://partner.swiggy.com/login#/swiggy"
      target="_blank"
      className="text-white text-[16px]"
    >
      Partner with us
    </a>
    <a href="#"
      className="text-white rounded-[16px] flex justify-center items-center border border-white min-w-[154px] min-h-[54px] px-4 gap-2 font-bold">
      Get the App
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="w-5 h-5"
        fill="none"
        viewBox="0 0 24 24"
        stroke="white"
        strokeWidth="2"
      >
        <path strokeLinecap="round" strokeLinejoin="round" d="M5 19L19 5M9 5h10v10" />
      </svg>
    </a>

  
    <a  href="#"
        className="bg-black w-[135px] h-[54px] flex items-center justify-center rounded-[16px]" >
      Sign in
    </a>
  </div>
</div>

      

      <div className=" pt-14 pb-8 relative">
        <img
          src="https://media-assets.swiggy.com/swiggy/image/upload/fl_lossy,f_auto,q_auto/portal/testing/seo-home/Veggies_new.png"
          alt="img1"
          className="absolute top-0 left-0 w-62 h-112"
        ></img>
        <img
          src="https://media-assets.swiggy.com/swiggy/image/upload/fl_lossy,f_auto,q_auto/portal/testing/seo-home/Sushi_replace.png"
          alt="img2"
          className="absolute top-0 right-0 w-62 h-112"
        ></img>
        <div className=" container mx-auto flex  text-5xl font-bold  text-center max-w-[50%] text-white">
          Order food & groceries. Discover best restaurants. Swiggy it!
        </div>

        <div className="flex justify-center gap-4 max-w-7/10 container mx-auto mt-13">
            <div class="flex items-center justify-between bg-white rounded-2xl px-4 py-3 w-80 shadow">
    
    <div class="flex items-center space-x-2">
 
      <svg class="w-5 h-5 text-red-500" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 2C8.1 2 5 5.1 5 9c0 5.3 7 13 7 13s7-7.7 7-13c0-3.9-3.1-7-7-7zm0 9.5c-1.4 0-2.5-1.1-2.5-2.5S10.6 6.5 12 6.5 14.5 7.6 14.5 9 13.4 11.5 12 11.5z"/>
      </svg>


      <span class="text-gray-700 font-medium text-base">Delhi, India</span>
    </div>


    <svg class="w-5 h-5 text-gray-800" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7" />
    </svg>
  </div>
          <input
            className="
        border-black rounded-2xl bg-white h-15 w-121 px-4 py-6 border-1.25 font-normal text-[1.125rem] text-[#02060c73]"
            type="text"
            placeholder="Search for resturants,item or1 more"
          />
        </div>
      </div> 

      <div>
        <div className="flex justify-center ">
        <Link to="/resturants">
          <img
            src="https://media-assets.swiggy.com/swiggy/image/upload/fl_lossy,f_auto,q_auto/MERCHANDISING_BANNERS/IMAGES/MERCH/2024/7/23/ec86a309-9b06-48e2-9adc-35753f06bc0a_Food3BU.png"
            alt="img3"
            className="h-[18.75rem] w-[20.375rem]"
          />
          </Link>
          

        <a href="https://www.swiggy.com/instamart?entryId=1234&entryName=mainTileEntry4&v=1" >
          <img src="https://media-assets.swiggy.com/swiggy/image/upload/fl_lossy,f_auto,q_auto/MERCHANDISING_BANNERS/IMAGES/MERCH/2024/7/23/b5c57bbf-df54-4dad-95d1-62e3a7a8424d_IM3BU.png"
           alt="img4"
            className="h-[18.75rem] w-[20.375rem]"
           />
          </a>

          <Link to="/resturants">
          <img src="https://media-assets.swiggy.com/swiggy/image/upload/fl_lossy,f_auto,q_auto/MERCHANDISING_BANNERS/IMAGES/MERCH/2024/7/23/b6d9b7ab-91c7-4f72-9bf2-fcd4ceec3537_DO3BU.png"
          alt="img5"
            className="h-[18.75rem] w-[20.375rem]"
          />
         </Link>
        </div>
      </div>
 
    </header>
  );
}
export default Header;
