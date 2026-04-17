import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import RestFoodData from './RestFoodData';
import ResturantTopFood from './ResturantTopFood';
import RestuarnatAllFood from "./ResturantAllFood";
import BestPlacesToEat from "./BestPlacesToEat";
import BestCuisines from "./BestCuisine";
import ExploreResturant from "./ExploreResturant";
import TopFoodShimmer from "../Shimmer/TopFoodShimmer";
import { fetchRestaurants } from '../../features/ResturantSlice';

export function ResturantDataFetch() {
    const { data, loading, error } = useSelector((state) => state.resturant);
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(fetchRestaurants());
    }, [dispatch]);

    if (loading || !data) return <div><TopFoodShimmer /></div>;
    if (error) return <p>{error.message}</p>;

    const foodData = data?.data?.cards?.[0]?.card?.card?.imageGridCards?.info;
    const TopFoodData = data?.data?.cards?.[1]?.card?.card?.gridElements?.infoWithStyle?.restaurants;
    const CategoryWise = data?.data?.cards?.[3]?.card?.card?.facetList;
    const BestPlacesData = data?.data?.cards?.[6]?.card?.card;
    const CuisineData = data?.data?.cards?.[7]?.card?.card;
    const ExploreResturantData = data?.data?.cards?.[8]?.card?.card;

    return (
        <div>
            <RestFoodData foodData={foodData} />
            <ResturantTopFood TopFoodData={TopFoodData} />
            <RestuarnatAllFood CategoryWise={CategoryWise} />
            <BestPlacesToEat BestPlacesData={BestPlacesData} />
            <BestCuisines CuisineData={CuisineData} />
            <ExploreResturant ExploreResturantData={ExploreResturantData} />
        </div>
    );
}

export default ResturantDataFetch;