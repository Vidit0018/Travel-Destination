import { useState ,useEffect } from 'react';
import Places from './Places.jsx';
import Error from './Error.jsx';
import sortPlacesByDistance from '../loc.js';
import { fetchAvailablePlaces, updateUserPlaces } from '../http.js';

export default function AvailablePlaces({ onSelectPlace }) {
  
  const [availablePlaces, setAvailablePlaces] = useState([]);
  const [isFetching , setIsFetching] = useState(false);
  const [error,setError] =useState();
  useEffect(()=>{
    async function fetchPlaces(){
      setIsFetching(true);
      try{

        const fetched_places = await fetchAvailablePlaces();
        navigator.geolocation.getCurrentPosition((position)=>{
          const sortedPlaces = sortPlacesByDistance(fetched_places,position.coords.latitude,position.coords.longitude )

          setAvailablePlaces(sortedPlaces);
        })
        setIsFetching(false);
      }
      catch(error){
        setError({message:error.message || 'serer error'});
        console.log(error);
      }
     setIsFetching(false)
    }
    fetchPlaces();
   },[]);

   if(error){
    return (
      <Error
      title="An Error Occured"
      message={error.message}
      ></Error>
    )

   }
  else{
    return (
      <Places
        title="Available Places"
        places={availablePlaces}
        isFetching={isFetching}
        fetchingText="Fetching Data of Places"
        fallbackText="No places available."
        onSelectPlace={onSelectPlace}
      />
    );
    
  }
}
