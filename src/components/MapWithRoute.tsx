import React, { useState } from "react";
import {
    GoogleMap,
    useJsApiLoader,
    DirectionsRenderer,
} from "@react-google-maps/api";
import styled from "styled-components";

const libraries = ["places"] as "places"[];

const MapContainer = styled.div`
    width: 100%;
    margin-bottom: 1rem;
`;

const MapWrapper = styled.div`
    width: 100%;
    height: 400px;
    border-radius: 8px;
    overflow: hidden;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const InfoBox = styled.div`
    background: #f8f9fa;
    padding: 1rem;
    border-radius: 8px;
    margin-top: 1rem;
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;
    gap: 1rem;
`;

const InfoItem = styled.div`
    flex: 1;
    min-width: 120px;
`;

const InfoLabel = styled.div`
    font-size: 0.875rem;
    color: #6c757d;
    margin-bottom: 0.25rem;
`;

const InfoValue = styled.div`
    font-weight: 600;
    color: #212529;
`;

interface MapWithRouteProps {
    depart: string;
    arrivee: string;
    onRouteCalculated: (routeData: {
        distance: string;
        duration: string;
    }) => void;
}

const MapWithRoute: React.FC<MapWithRouteProps> = ({
    depart,
    arrivee,
    onRouteCalculated,
}) => {
    const { isLoaded, loadError } = useJsApiLoader({
        id: "google-map-script",
        googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY!,
        libraries: libraries,
    });

    const [directions, setDirections] =
        useState<google.maps.DirectionsResult | null>(null);
    const [distance, setDistance] = useState("");
    const [duration, setDuration] = useState("");
    const [startAddress, setStartAddress] = useState("");
    const [endAddress, setEndAddress] = useState("");

    // Calculer le trajet quand les props changent ET que la carte est chargée
    React.useEffect(() => {
        if (isLoaded && depart && arrivee) {
            const directionsService = new google.maps.DirectionsService();

            directionsService.route(
                {
                    origin: depart,
                    destination: arrivee,
                    travelMode: google.maps.TravelMode.DRIVING,
                },
                (result, status) => {
                    if (status === "OK" && result) {
                        setDirections(result);
                        const leg = result.routes[0].legs[0];
                        const distanceText = leg.distance?.text || "";
                        const durationText = leg.duration?.text || "";
                        setDistance(distanceText);
                        setDuration(durationText);
                        setStartAddress(leg.start_address || "");
                        setEndAddress(leg.end_address || "");
                        onRouteCalculated({
                            distance: distanceText,
                            duration: durationText,
                        });
                    }
                }
            );
        }
    }, [isLoaded, depart, arrivee, onRouteCalculated]);

    if (loadError) {
        return (
            <div>
                Erreur lors du chargement de la carte. Vérifiez votre clé API et
                la console.
            </div>
        );
    }

    if (!isLoaded) {
        return <div>Chargement de la carte...</div>;
    }

    return (
        <MapContainer>
            <MapWrapper>
                <GoogleMap
                    mapContainerStyle={{ width: "100%", height: "100%" }}
                    center={
                        directions?.routes[0]?.bounds?.getCenter() || {
                            lat: 48.8566,
                            lng: 2.3522,
                        }
                    }
                    zoom={12}
                    options={{
                        zoomControl: true,
                        mapTypeControl: false,
                        streetViewControl: false,
                        fullscreenControl: true,
                    }}
                >
                    {directions && (
                        <DirectionsRenderer directions={directions} />
                    )}
                </GoogleMap>
            </MapWrapper>

            <InfoBox>
                <InfoItem>
                    <InfoLabel>Départ</InfoLabel>
                    <InfoValue>{startAddress || ""}</InfoValue>
                </InfoItem>
                <InfoItem>
                    <InfoLabel>Arrivée</InfoLabel>
                    <InfoValue>{endAddress || ""}</InfoValue>
                </InfoItem>
                <InfoItem>
                    <InfoLabel>Distance</InfoLabel>
                    <InfoValue>{distance || "0 KM"}</InfoValue>
                </InfoItem>
                <InfoItem>
                    <InfoLabel>Durée estimée</InfoLabel>
                    <InfoValue>{duration || "0h 00mn"}</InfoValue>
                </InfoItem>
            </InfoBox>
        </MapContainer>
    );
};

export default MapWithRoute;
