function Header() {
  return (
    <header className="bg-[#ff5200] font-serif">
      <div className="flex justify-between container mx-auto py-8">
        <img
          src="https://res.cloudinary.com/dutdah0l9/image/upload/v1720058694/Swiggy_logo_bml6he.png"
          alt="logo"
          className="h-[3rem] w-[10rem] "
        />
        <div className="flex justify-between font-serif text-white gap-4 font-bold text-base">
          <a
            href="https://www.swiggy.com/corporate/"
            target="_blank"
            className="text-white"
          >
            Swiggy Corporate
          </a>
          <a href="https://partner.swiggy.com/login#/swiggy" target="_blank">
            Partner with us
          </a>
          <a href="" className="text-white">
            Get the App
          </a>
          <a href="">Sign in </a>
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
        <div className=" container mx-auto flex  text-5xl font-bold  text-center max-w-6/10 text-white">
          Order food & groceries. Discover best restaurants. Swiggy it!
        </div>

        <div className="flex justify-center gap-4 max-w-7/10 container mx-auto mt-13">
          <input
            className="
          border-black  rounded-2xl bg-white h-15 w-81 px-4 py-6 border-1.25 text-[1.125rem]"
            type="text"
            placeholder="Delhi,India"
          />
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
         <a href="https://www.swiggy.com/restaurants" >
          <img
            src="https://media-assets.swiggy.com/swiggy/image/upload/fl_lossy,f_auto,q_auto/MERCHANDISING_BANNERS/IMAGES/MERCH/2024/7/23/ec86a309-9b06-48e2-9adc-35753f06bc0a_Food3BU.png"
            alt="img3"
            className="h-[18.75rem] w-[20.375rem]"
          />
          </a> 

        <a href="https://www.swiggy.com/instamart?entryId=1234&entryName=mainTileEntry4&v=1" >
          <img src="https://media-assets.swiggy.com/swiggy/image/upload/fl_lossy,f_auto,q_auto/MERCHANDISING_BANNERS/IMAGES/MERCH/2024/7/23/b5c57bbf-df54-4dad-95d1-62e3a7a8424d_IM3BU.png"
           alt="img4"
            className="h-[18.75rem] w-[20.375rem]"
           />
          </a>

          <a href="https://www.swiggy.com/dineout" >
          <img src="https://media-assets.swiggy.com/swiggy/image/upload/fl_lossy,f_auto,q_auto/MERCHANDISING_BANNERS/IMAGES/MERCH/2024/7/23/b6d9b7ab-91c7-4f72-9bf2-fcd4ceec3537_DO3BU.png"
          alt="img5"
            className="h-[18.75rem] w-[20.375rem]"
          />
        </a>
        </div>
      </div>
    </header>
  );
}
export default Header;
