import { useEffect } from "react"                              // ✅ remove useState
import { useDispatch, useSelector } from "react-redux"
import { fetchResturant } from '../../Store/ResturantSlice'
import RestFoodData from './RestFoodData'
import ResturantTopFood from './ResturantTopFood'
import RestuarnatAllFood from "./ResturantAllFood"
import BestPlacesToEat from "./BestPlacesToEat"
import BestCuisines from "./BestCuisine"
import ExploreResturant from "./ExploreResturant"
import TopFoodShimmer from "../Shimmer/TopFoodShimmer"

export function ResturantDataFetch() {

  const { data, loading, error } = useSelector((state) => state.resturant)
  const dispatch = useDispatch()

  useEffect(() => {
    if(!data){
    dispatch(fetchResturant())
    }
  }, [])

 { console.log(loading)}
  if (loading || !data) return <div><TopFoodShimmer /></div>
  if (error)            return <p>{error.message}</p>

  // ✅ derive everything directly from data — no useState, no useEffect, no delay
  const foodData             = data?.data?.cards?.[0]?.card?.card?.imageGridCards?.info
  const TopFoodData          = data?.data?.cards?.[1]?.card?.card?.gridElements?.infoWithStyle?.restaurants
  const CategoryWise         = data?.data?.cards?.[3]?.card?.card?.facetList
  const BestPlacesData       = data?.data?.cards?.[6]?.card?.card
  const CuisineData          = data?.data?.cards?.[7]?.card?.card
  const ExploreResturantData = data?.data?.cards?.[8]?.card?.card

  // ✅ derive restaurants directly — no useState needed
  const ResturantAllFood = (() => {
    const cards = data?.data?.cards ?? []
    for (const card of cards) {
      const list = card?.card?.card?.gridElements?.infoWithStyle?.restaurants
      if (Array.isArray(list)) return list
    }
    return []
  })()

  return (
    <div>
      <RestFoodData foodData={foodData} />
      <ResturantTopFood TopFoodData={TopFoodData} />
      <RestuarnatAllFood CategoryWise={CategoryWise} ResturantAllFood={ResturantAllFood} />
      <BestPlacesToEat BestPlacesData={BestPlacesData} />
      <BestCuisines CuisineData={CuisineData} />
      <ExploreResturant ExploreResturantData={ExploreResturantData} />
    </div>
  )
}

export default ResturantDataFetch