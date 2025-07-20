export default function Footer() {
  return (
    <div className=" bg-[#F0F0F0] ">
      <div
        className="text-[#02060c99] grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5

        gap-8 container   max-w-[1520px] pr-76 pl-57 pb-12 min-h-[451px] w-[95rem] "
      >
        {/* Logo and Copyright */}
        <div className="pt-10">
          <img
            src="https://media-assets.swiggy.com/portal/testing/seo-home/Group.svg"
            alt="Swiggy Logo"
            className="h-[48px] w-[160px]"
          />
          <p className="mt-4  text-[16px] text-[#02060c99]">
            &copy; 2025 Swiggy Limited
          </p>
        </div>

        {/* Company */}
        <div className="flex flex-col gap-[16px] text-[16px] pt-10  leading-[16.8px]  ">
          <h3 className="text-[18px] text-[#02060ceb] font-bold mb-2">
            Company
          </h3>
          <span>About Us</span>
          <span>Swiggy Corporate</span>
          <span>Careers</span>
          <span>Team</span>
          <span>Swiggy One</span>
          <span>Swiggy Instamart</span>
          <span>Swiggy Dineout</span>
          <span>Minis</span>
          <span>Pyng</span>
        </div>

        {/* Contact Us */}
        <div className="flex flex-col gap-[16px] text-sm pt-10  ">
          <h3 className="text-[18px] text-[#02060ceb] font-bold mb-2">
            Contact Us
          </h3>
          <span>Help & Support</span>
          <span>Partner With Us</span>
          <span>Ride With Us</span>

          <h3 className="text-[18px] gap-[16px] text-[#02060ceb] font-bold mb-2 mt-5">
            Legal
          </h3>
          <span>Terms & Conditions</span>
          <span>Cookie Policy</span>
          <span>Privacy Policy</span>
        </div>

        {/* Available in */}
        <div className="flex flex-col  text-sm pt-10 gap-[16px]">
          <h3 className="text-[18px] text-[#02060ceb] font-bold mb-2">
            Available in:
          </h3>
          <span>Bangalore</span>
          <span>Gurgaon</span>
          <span>Hyderabad</span>
          <span>Delhi</span>
          <span>Mumbai</span>
          <span>Pune</span>
          <select className="mt-2 border px-2 py-1 rounded text-black text-sm">
            <option>685 cities</option>
          </select>
        </div>

        {/* Life at Swiggy */}
        <div className="flex flex-col text-sm pt-10 gap-[16px]">
          <h3 className="text-[18px] text-[#02060ceb] font-bold mb-2">
            Life at Swiggy
          </h3>
          <span>Explore With Swiggy</span>
          <span>Swiggy News</span>
          <span>Snackables</span>

          <h3 className="text-[18px] text-[#02060ceb] font-bold mb- mt-5">
            Social Links
          </h3>
          <div className="flex gap-3 text-xl">
            {/* //linkden */}
            <a href="https://www.linkedin.com/company/swiggy-in/" target="_blank"
            class="p-2 rounded-lg flex items-center border border-gray-300 justify-center transition-all duration-500 hover:border-gray-100 hover:bg-gray-100">
            <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="#0077B5">
            <path
             d="M20.447 20.452h-3.554v-5.568c0-1.327-.027-3.037-1.849-3.037-1.853 0-2.136 1.445-2.136 2.937v5.668H9.354V9h3.413v1.561h.049c.476-.897 1.637-1.849 3.367-1.849 3.599 0 4.262 2.368 4.262 5.451v6.289zM5.337 7.433c-1.144 0-2.07-.927-2.07-2.07 0-1.144.926-2.07 2.07-2.07 1.144 0 2.07.926 2.07 2.07 0 1.143-.926 2.07-2.07 2.07zm1.777 13.019H3.56V9h3.554v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.226.792 24 1.771 24h20.451C23.2 24 24 23.226 24 22.271V1.729C24 .774 23.2 0 22.225 0z" />
           </svg>
            </a>

            {/* //facebook */}
            <a
              href="https://www.facebook.com/swiggy.in/"
              target="_blank"
              class="p-2 rounded-lg flex items-center border border-gray-300 justify-center transition-all duration-500 hover:border-gray-100 hover:bg-gray-100"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="28"
                height="28"
                viewBox="0 0 71 72"
                fill="none"
              >
                <path
                  d="M46.4233 38.6403L47.7279 30.3588H39.6917V24.9759C39.6917 22.7114 40.8137 20.4987 44.4013 20.4987H48.1063V13.4465C45.9486 13.1028 43.7685 12.9168 41.5834 12.8901C34.9692 12.8901 30.651 16.8626 30.651 24.0442V30.3588H23.3193V38.6403H30.651V58.671H39.6917V38.6403H46.4233Z"
                  fill="#111827"
                />
              </svg>
            </a>
            {/* //instagram */}
            <a
              href="https://www.instagram.com/swiggyindia/?hl=en" target="_blank"
              class="p-2 rounded-lg flex items-center border border-gray-300 justify-center transition-all duration-500 hover:border-gray-100 hover:bg-gray-100"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="28"
                height="28"
                viewBox="0 0 71 72"
                fill="none"
              >
                <path
                  d="M27.3762 35.7808C27.3762 31.1786 31.1083 27.4468 35.7132 27.4468C40.3182 27.4468 44.0522 31.1786 44.0522 35.7808C44.0522 40.383 40.3182 44.1148 35.7132 44.1148C31.1083 44.1148 27.3762 40.383 27.3762 35.7808ZM22.8683 35.7808C22.8683 42.8708 28.619 48.618 35.7132 48.618C42.8075 48.618 48.5581 42.8708 48.5581 35.7808C48.5581 28.6908 42.8075 22.9436 35.7132 22.9436C28.619 22.9436 22.8683 28.6908 22.8683 35.7808ZM46.0648 22.4346C46.0646 23.0279 46.2404 23.608 46.5701 24.1015C46.8997 24.595 47.3684 24.9797 47.9168 25.2069C48.4652 25.4342 49.0688 25.4939 49.6511 25.3784C50.2334 25.2628 50.7684 24.9773 51.1884 24.5579C51.6084 24.1385 51.8945 23.6041 52.0105 23.0222C52.1266 22.4403 52.0674 21.8371 51.8404 21.2888C51.6134 20.7406 51.2289 20.2719 50.7354 19.942C50.2418 19.6122 49.6615 19.436 49.0679 19.4358H49.0667C48.2708 19.4361 47.5077 19.7522 46.9449 20.3144C46.3821 20.8767 46.0655 21.6392 46.0648 22.4346ZM25.6072 56.1302C23.1683 56.0192 21.8427 55.6132 20.9618 55.2702C19.7939 54.8158 18.9606 54.2746 18.0845 53.4002C17.2083 52.5258 16.666 51.6938 16.2133 50.5266C15.8699 49.6466 15.4637 48.3214 15.3528 45.884C15.2316 43.2488 15.2073 42.4572 15.2073 35.781C15.2073 29.1048 15.2336 28.3154 15.3528 25.678C15.4639 23.2406 15.8731 21.918 16.2133 21.0354C16.668 19.8682 17.2095 19.0354 18.0845 18.1598C18.9594 17.2842 19.7919 16.7422 20.9618 16.2898C21.8423 15.9466 23.1683 15.5406 25.6072 15.4298C28.244 15.3086 29.036 15.2844 35.7132 15.2844C42.3904 15.2844 43.1833 15.3106 45.8223 15.4298C48.2612 15.5408 49.5846 15.9498 50.4677 16.2898C51.6356 16.7422 52.4689 17.2854 53.345 18.1598C54.2211 19.0342 54.7615 19.8682 55.2161 21.0354C55.5595 21.9154 55.9658 23.2406 56.0767 25.678C56.1979 28.3154 56.2221 29.1048 56.2221 35.781C56.2221 42.4572 56.1979 43.2466 56.0767 45.884C55.9656 48.3214 55.5573 49.6462 55.2161 50.5266C54.7615 51.6938 54.2199 52.5266 53.345 53.4002C52.4701 54.2738 51.6356 54.8158 50.4677 55.2702C49.5872 55.6134 48.2612 56.0194 45.8223 56.1302C43.1855 56.2514 42.3934 56.2756 35.7132 56.2756C29.033 56.2756 28.2432 56.2514 25.6072 56.1302ZM25.4001 10.9322C22.7371 11.0534 20.9174 11.4754 19.3282 12.0934C17.6824 12.7316 16.2892 13.5878 14.897 14.977C13.5047 16.3662 12.6502 17.7608 12.0116 19.4056C11.3933 20.9948 10.971 22.8124 10.8497 25.4738C10.7265 28.1394 10.6982 28.9916 10.6982 35.7808C10.6982 42.57 10.7265 43.4222 10.8497 46.0878C10.971 48.7494 11.3933 50.5668 12.0116 52.156C12.6502 53.7998 13.5049 55.196 14.897 56.5846C16.289 57.9732 17.6824 58.8282 19.3282 59.4682C20.9204 60.0862 22.7371 60.5082 25.4001 60.6294C28.0687 60.7506 28.92 60.7808 35.7132 60.7808C42.5065 60.7808 43.3592 60.7526 46.0264 60.6294C48.6896 60.5082 50.5081 60.0862 52.0983 59.4682C53.7431 58.8282 55.1373 57.9738 56.5295 56.5846C57.9218 55.1954 58.7745 53.7998 59.4149 52.156C60.0332 50.5668 60.4575 48.7492 60.5768 46.0878C60.698 43.4202 60.7262 42.57 60.7262 35.7808C60.7262 28.9916 60.698 28.1394 60.5768 25.4738C60.4555 22.8122 60.0332 20.9938 59.4149 19.4056C58.7745 17.7618 57.9196 16.3684 56.5295 14.977C55.1395 13.5856 53.7431 12.7316 52.1003 12.0934C50.5081 11.4754 48.6894 11.0514 46.0284 10.9322C43.3612 10.811 42.5085 10.7808 35.7152 10.7808C28.922 10.7808 28.0687 10.809 25.4001 10.9322Z"
                  fill="#111827"
                />
              </svg>
            </a>
            {/* //pininterest */}
            <a
              href="https://in.pinterest.com/swiggyindia/" target="_blank"
              class="p-2 rounded-lg flex items-center border border-gray-300 justify-center transition-all duration-500 hover:border-gray-100 hover:bg-gray-100"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="28"
                height="28"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path
                  d="M12.04 2C6.96 2 2.75 6.1 2.75 11c0 3.43 2.05 6.39 5 7.81-.07-.66-.14-1.67.03-2.39.15-.65 1-4.11 1-4.11s-.25-.5-.25-1.25c0-1.17.68-2.05 1.54-2.05.73 0 1.08.55 1.08 1.22 0 .74-.47 1.85-.71 2.88-.2.84.42 1.52 1.25 1.52 1.5 0 2.66-1.58 2.66-3.85 0-2.01-1.45-3.42-3.52-3.42-2.4 0-3.8 1.8-3.8 3.66 0 .72.28 1.5.63 1.93a.26.26 0 01.06.24c-.07.27-.23.84-.27.96-.04.13-.14.16-.32.1-1.19-.46-1.93-1.91-1.93-3.07 0-2.5 1.82-4.79 5.25-4.79 2.75 0 4.89 1.96 4.89 4.57 0 2.73-1.72 4.93-4.12 4.93-.8 0-1.56-.42-1.82-.92l-.5 1.91c-.18.71-.67 1.6-.99 2.14.75.23 1.54.36 2.36.36 5.07 0 9.25-4.1 9.25-9.14C21.25 6.1 17.12 2 12.04 2Z"
                  fill="#E60023"
                />
              </svg>
            </a>
            {/* //twitter button */}
            <a
              href="https://x.com/Swiggy" target="_blank"
              class="p-2 rounded-lg flex items-center border border-gray-300 justify-center transition-all duration-500 hover:border-gray-100 hover:bg-gray-100"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="28"
                height="28"
                viewBox="0 0 24 24"
                fill="#1DA1F2"
              >
                <path d="M19.633 7.997c.013.18.013.36.013.54 0 5.487-4.177 11.81-11.81 11.81-2.35 0-4.532-.687-6.366-1.873.33.04.66.054.99.054 1.946 0 3.737-.66 5.164-1.774a4.153 4.153 0 01-3.878-2.88c.255.04.51.067.78.067.375 0 .75-.053 1.1-.147a4.146 4.146 0 01-3.327-4.07v-.054a4.2 4.2 0 001.872.514 4.145 4.145 0 01-1.846-3.45c0-.75.2-1.447.547-2.05a11.77 11.77 0 008.53 4.328 4.675 4.675 0 01-.1-.95 4.145 4.145 0 017.165-2.83 8.116 8.116 0 002.63-1.006 4.15 4.15 0 01-1.82 2.287 8.26 8.26 0 002.385-.653 8.962 8.962 0 01-2.083 2.143z" />
              </svg>
            </a>
          </div>
        </div>
      </div>

      <hr className="max-w-[90%] container mx-auto"></hr>

      <div className="flex justify-center flex-wrap mx-auto container gap-8 mt-8  pb-8 h-[8rem] items-center">
        <div className="min-w-[35.25rem]  text-[1.625rem] flex font-semibold text-[#02060cbf]">
          For better experience, download the Swiggy app now
        </div>

        <img
          className="w-[196px] h-[65px]"
          src="https://media-assets.swiggy.com/swiggy/image/upload/fl_lossy,f_auto,q_auto,w_200,h_65/icon-AppStore_lg30tv"
          alt=""
        />
        <img
          className="w-[196px] h-[65px]"
          src="https://media-assets.swiggy.com/swiggy/image/upload/fl_lossy,f_auto,q_auto,w_200,h_65/icon-GooglePlay_1_zixjxl"
        ></img>
      </div>
    </div>
  );
}
