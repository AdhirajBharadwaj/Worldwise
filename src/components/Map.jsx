import { useNavigate, useSearchParams } from 'react-router-dom'
import { MapContainer,TileLayer,Marker,Popup, useMap, useMapEvent } from 'react-leaflet';
import styles from './Map.module.css'
import { useEffect, useState } from 'react';
import { useCities} from "../contexts/CitiesContext"
import { latLng } from 'leaflet';
import { useGeolocation } from '../hooks/useGeolocation';
import Button from "./Button";
import { useUrlPostion } from '../hooks/useUrlPosition';
function Map() {
  const {isLoading:isLoadingPosition,position:geolocationposition,getPosition}=useGeolocation();


 const {cities}=useCities();
 
 const [mapPosition,setMapPosition]=useState([40,0])
 
 const [mapLat,mapLng]=useUrlPostion();
 useEffect(function(){
  if(mapLat && mapLng)
  {
    setMapPosition([mapLat,mapLng]);
  }
 },[mapLat,mapLng])

 useEffect(function(){
  if(geolocationposition) setMapPosition([geolocationposition.lat,geolocationposition.lng]);
 },[geolocationposition])
  return (
    <div className={styles.mapContainer}>
     {!geolocationposition &&(<Button type='position' onClick={getPosition}>
        {isLoadingPosition?"Loading":"use your position"}
      </Button>)} 
      <MapContainer 
      center={mapPosition} 
      zoom={7} scrollWheelZoom={true} className={styles.map}>
    <TileLayer
      attribution='&copy; <a href="https://www.openstreetmap.fr/hot/copyright">OpenStreetMap</a> contributors'
      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
    />
    {cities.map((city)=><Marker position={[city.position.lat,city.position.lng]} key={city.id}>
      <Popup>
       <span>{city.cityName}</span>
      </Popup>
    </Marker>)}
    <ChangeCenter position={mapPosition}></ChangeCenter>
  <DetectClick/>
  </MapContainer>
    </div>
  )
}
function ChangeCenter({position})
{
    const map=useMap({position})
    map.setView(position)
    return null;
}
function DetectClick()
{
  const navigate=useNavigate()

  useMapEvent({
    click:e=>navigate(`form?lat=${e.latlng.lat}&lng=${e.latlng.lng}`)
  })
}
export default Map