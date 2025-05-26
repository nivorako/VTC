import React, { useState, useRef } from "react";
import {
  GoogleMap,
  LoadScript,
  Autocomplete,
  DirectionsRenderer
} from "@react-google-maps/api";

const libraries = ["places"] as ("places")[];

 
const containerStyle = {
  width: "100%",
  height: "400px"
};

const center = {
  lat: 48.8566, // Paris par défaut
  lng: 2.3522
};

interface MapWithRouteProps {
    depart: string;
    arrivee: string;
  }

const MapWithRoute: React.FC<MapWithRouteProps> = ({ depart, arrivee }: MapWithRouteProps) => {
  const [directions, setDirections] = useState<google.maps.DirectionsResult | null>(null);
  const [distance, setDistance] = useState("");
  const [duration, setDuration] = useState("");

  const originRef = useRef<HTMLInputElement>(null);
  const destinationRef = useRef<HTMLInputElement>(null);
  const autocompleteOrigin = useRef<google.maps.places.Autocomplete | null>(null);
  const autocompleteDestination = useRef<google.maps.places.Autocomplete | null>(null);

  const calculateRoute = async () => {
    if (!originRef.current || !destinationRef.current) return;

    //const directionsService = new google.maps.DirectionsService();

    // const result = await directionsService.route({
    //   origin: originRef.current.value,
    //   destination: destinationRef.current.value,
    //   travelMode: google.maps.TravelMode.DRIVING
    // });

    (directionResult: google.maps.DirectionsResult, status: google.maps.DirectionsStatus) => {
      if (status === "OK") {
        setDirections(directionResult);
        const leg = directionResult.routes[0].legs[0];
        setDistance(leg.distance?.text || "");
        setDuration(leg.duration?.text || "");
      }
    }
    
  };

  return (
    <LoadScript
      googleMapsApiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY!}
      libraries={libraries}
    >
      <div>
        <Autocomplete
          onLoad={(auto) => (autocompleteOrigin.current = auto)}
        >
          <input type="text" placeholder="Lieu de départ" ref={originRef}  defaultValue={depart}/>
        </Autocomplete>

        <Autocomplete
          onLoad={(auto) => (autocompleteDestination.current = auto)}
        >
          <input type="text" placeholder="Lieu d’arrivée" ref={destinationRef} defaultValue={arrivee}/>
        </Autocomplete>

        <button onClick={calculateRoute}>Afficher le trajet</button>

        {distance && duration && (
          <p>Distance : {distance} – Durée estimée : {duration}</p>
        )}

        <GoogleMap
          mapContainerStyle={containerStyle}
          center={center}
          zoom={11}
        >
          {directions && <DirectionsRenderer directions={directions} />}
        </GoogleMap>
      </div>
    </LoadScript>
  );
};

export default MapWithRoute;
