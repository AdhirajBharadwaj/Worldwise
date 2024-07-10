// 

import { useEffect, useState } from "react";

import styles from "./Form.module.css";
import Button from "./Button";
import { useNavigate } from "react-router-dom";
import BackButton from "./BackButton";
import Message from "./Message"
import Spinner from "./Spinner"
import { useUrlPostion } from "../hooks/useUrlPosition";

export function convertToEmoji(countryCode) {
  const codePoints = countryCode
    .toUpperCase()
    .split("")
    .map((char) => 127397 + char.charCodeAt());
  return String.fromCodePoint(...codePoints);
}
const BASE="https://api.bigdatacloud.net/data/reverse-geocode-client"

function Form() {

  const [lat,lng]=useUrlPostion();

  const navigate=useNavigate();

  const[isLoadingGeocoding,setIsLoadingGeocoding]=useState(false);
  const [cityName, setCityName] = useState("");
  const [country, setCountry] = useState("");
  const [date, setDate] = useState(new Date());
  const [notes, setNotes] = useState("");
  const [emoji,setEmoji]=useState("")
  const[geoCodingError,setGeoCodingError]=useState("");
  
  useEffect(function(){
    if(!lat && !lng) return;
    async function fetchCityData(){
      try{
        setIsLoadingGeocoding(true)
        setGeoCodingError("");
        const res=await fetch(`${BASE}?latitude=${lat}&longitude=${lng}`);
        const data=await res.json();
        if(!data.countryCode)
        {
          throw new Error("That does not seem to be a city, CLick somewhere else!")
        }
        setCityName(data.city || data.locality || "");
        setCountry(data.countryName);
        setEmoji(convertToEmoji(data.countryCode))
      }
      catch(err){
        setGeoCodingError(err.message);
      }
      finally{
        setIsLoadingGeocoding(false);
      }
    }
    fetchCityData();
  },[lat,lng])
  if(isLoadingGeocoding) return <Spinner></Spinner>

  if(!lat && !lng) return <Message message={"Start by clicking somewhere on the map"}></Message>

if(geoCodingError) return <Message message={geoCodingError}></Message>
  return (
    <form className={styles.form}>
      <div className={styles.row}>
        <label htmlFor="cityName">{cityName}</label>
        <input
          id="cityName"
          onChange={(e) => setCityName(e.target.value)}
          value={cityName}
        />
        <span className={styles.flag}>{emoji}</span>
      </div>

      <div className={styles.row}>
        <label htmlFor="date">When did you go to {cityName}?</label>
        <input
          id="date"
          onChange={(e) => setDate(e.target.value)}
          value={date}
        />
      </div>

      <div className={styles.row}>
        <label htmlFor="notes">Notes about your trip to {cityName}</label>
        <textarea
          id="notes"
          onChange={(e) => setNotes(e.target.value)}
          value={notes}
        />
      </div>

      <div className={styles.buttons}>
       <Button type="primary">Add</Button>
       <BackButton/>
        
      </div>
    </form>
  );
}

export default Form;
