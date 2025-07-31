import { useState, useEffect, useRef } from "react";
import RestFoodData from './RestFoodData';
import ResturantTopFood from './ResturantTopFood';
import RestuarnatAllFood from "./ResturantAllFood";
import BestPlacesToEat from "./BestPlacesToEat";
import BestCuisines from "./BestCuisine";
import ExploreResturant from "./ExploreResturant";


export default function ResturantDataFetch() {
  const [Data, setData] = useState({});
  const [ResturantAllFood, setResturantAllFood] = useState([]);
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const loaderRef = useRef();

  const proxyServer = "https://cors-anywhere.herokuapp.com/";
  const baseAPI = "https://www.swiggy.com/dapi/restaurants/list/v5";
  const queryParams = "?lat=28.7040592&lng=77.10249019999999&is-seo-homepage-enabled=true&page_type=DESKTOP_WEB_LISTING";

  const foodData = Data?.data?.cards?.[0]?.card?.card?.imageGridCards?.info;
  const TopFoodData = Data?.data?.cards?.[1]?.card?.card?.gridElements?.infoWithStyle?.restaurants;
  const CategoryWise = Data?.data?.cards?.[3]?.card?.card?.facetList;
  const BestPlacesData=Data?.data?.cards?.[6]?.card?.card;
  const CuisineData=Data?.data?.cards?.[7]?.card?.card;
  const ExploreResturantData=Data?.data?.cards?.[8]?.card?.card;


  const extractRestaurantsFromCards = (cards = []) => {
    for (const card of cards) {
      const list = card?.card?.card?.gridElements?.infoWithStyle?.restaurants;
      if (Array.isArray(list)) {
        return list;
      }
    }
    return [];
  };

  useEffect(() => {
    async function fetchInitialData() {
      try {
        const response = await fetch(proxyServer + baseAPI + queryParams);
        const data = await response.json();
        setData(data);

        const initialRestaurants = extractRestaurantsFromCards(data?.data?.cards);
        setResturantAllFood(initialRestaurants);
        setOffset(initialRestaurants.length);
      } catch (error) {
        console.error("Error fetching Swiggy data:", error);
      }
    }
    fetchInitialData();
  }, []);

  async function loadMoreData() {
    if (!hasMore) return;
    try {
      const url = `${proxyServer}${baseAPI}${queryParams}&offset=${offset}`;
      const response = await fetch(url);
      const json = await response.json();
      const moreRestaurants = extractRestaurantsFromCards(json?.data?.cards);

      if (!moreRestaurants.length) {
        setHasMore(false);
        return;
      }

      setResturantAllFood(prev => [...prev, ...moreRestaurants]);
      setOffset(prev => prev + moreRestaurants.length);
    } catch (error) {
      console.error("Error loading more restaurants:", error);
    }
  }

  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting && hasMore) {
          loadMoreData();
        }
      },
      { rootMargin: '100px', threshold: 0.1 }
    );

    const currentRef = loaderRef.current;
    if (currentRef) observer.observe(currentRef);

    return () => {
      if (currentRef) observer.unobserve(currentRef);
    };
  }, [hasMore, offset]);

  return (
    <div>
      <RestFoodData foodData={foodData} />
      <ResturantTopFood TopFoodData={TopFoodData} />
      <RestuarnatAllFood CategoryWise={CategoryWise} ResturantAllFood={ResturantAllFood} />
      {hasMore && <div ref={loaderRef} className="h-10 bg-transparent"></div>}
      <BestPlacesToEat  BestPlacesData={BestPlacesData}/>
      <BestCuisines CuisineData={CuisineData} />
      <ExploreResturant ExploreResturantData={ExploreResturantData}/>
    </div>
  );
}
