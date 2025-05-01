import Error from './Error.jsx';
import Places from './Places.jsx';
import { useState, useEffect } from 'react';
import { sortPlacesByDistance } from '../loc.js';
import { fetchAvailablePlaces } from '../http.js';
export default function AvailablePlaces({ onSelectPlace }) {

  const [isFetching, setIsFetching] = useState(false);
  const [availablePlaces, setAvailablePlaces] = useState([]);
  const [error, setError] = useState(null);
  const payload = {
    title: "Forest Waterfall",
    description: "A beautiful waterfall located in the middle of a forest."
  }

  useEffect(() => {
    async function fetchPlaces() {
      setIsFetching(true);
      try {
        const places = await fetchAvailablePlaces();
        navigator.geolocation.getCurrentPosition((position) => {
          const sortedPlaces = sortPlacesByDistance(
            places,
            position.coords.latitude,
            position.coords.longitude)
          setAvailablePlaces(sortedPlaces)
          setIsFetching(false);
        })
      }
      catch (error) {
        setError({
          message: error.message || 'An error occurred!',
        });
        setIsFetching(false);
      }
    }

    fetchPlaces();
    // fetch('http://localhost:3000/places').then((response) => {
    //   return response.json();
    // }).then((resData) => {
    //   setAvailablePlaces(resData.places)
    // })
    // fetch('http://localhost:3000/places/add', {
    //   method: 'POST',
    //   body: JSON.stringify(payload),
    //   headers: {
    //     'content-type': 'application/json'
    //   },
    // }).then((response) => {
    //   return response.json();
    // }).then((resData) => {
    //   console.log(resData);
    // })
  }, []);

  if (error) {
    return <Error title="an error occurred!" message={error.message} />
  }

  // console.log(availablePlaces);
  return (
    <Places
      title="Available Places"
      places={availablePlaces}
      isLoading={isFetching}
      laodingText="Loading available places..."
      fallbackText="No places available."
      onSelectPlace={onSelectPlace}
    />
  );
}
