import CityItem from './CityItem';
import styles from './CountryList.module.css'
import Spinner from "./Spinner";
import Message from "./Message";
import CountryItem from "./CountryItem"
export default function CountryList({cities,isLoading}) {
  if(isLoading) return <Spinner/>

  if(!cities.length) return <Message message={'Add city first'}/>

  const countries=cities.reduce((acc,city)=>{
    if(!(acc.map(el=>el.country)).includes(city.country))
    {
      return [...acc, {country:city.country,emoji:city.emoji}]
    }
    else
    {
      return acc;
    }
  },[])
  console.log(countries);
    return (
    <ul className={styles.countryList}>
        {countries.map((country)=><CountryItem key={country.country} country={country}/>)}
    </ul>
  )
}
