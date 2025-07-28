import { useState,useEffect } from "react";
import { useParams } from "react-router"



export default function Search()
{   
    const [food, setFood]=useState("");
    const [RestData,setRestData]=useState(null)
    const {id}=useParams();
    // console.log(id)

    useEffect(() => {
        async function fetchData() {
          const proxy = "https://cors-anywhere.herokuapp.com/";
          const swiggyFoodMenuAPI = `https://www.swiggy.com/dapi/menu/pl?page-type=REGULAR_MENU&complete-menu=true&lat=28.7040592&lng=77.10249019999999&restaurantId=${id}&catalog_qa=undefined&submitAction=ENTER`;
          const response = await fetch(proxy + swiggyFoodMenuAPI);
          const data = await response.json();
          const temp = data?.data?.cards[4]?.groupedCard?.cardGroupMap?.REGULAR?.cards;
          const filteredData = temp?.filter(
            (items) => "title" in items?.card?.card
          );
          setRestData(filteredData);
        }
        fetchData();
      }, [food]);
     
    return (
        <div className="w-8/10 mt-10 mx-auto">
     <input    placeholder ="Search for food " onChange={(event)=>{setFood(event.target.value)}}className=" px-4 bg-gray-300 rounded-2xl h-[50px] w-8/10 mx-auto justify-center flex "></input>
        </div>
    )
}

