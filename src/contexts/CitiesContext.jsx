import { createContext, useContext, useEffect, useReducer, useState } from "react";



const URL='http://localhost:8000';
const CitiesContext=createContext();

const initialState={
  cities:[],
  isLoading:false,
  currentCity:{},
  error:""
}
function reducer(state,action){
  switch(action.type)
  {
    case 'loading':
      return {...state,isLoading:true}
    case 'cities/loaded':
      return {
        ...state,isLoading:false,cities:action.payload
      }

    case 'city/loaded':
      return {...state,isLoading:false,currentCity:action.payload}

    case 'city/created':
      return {
        ...state,isLoading:false,cities:[...state.cities,action.payload],currentCity:action.payload
      }

    case 'city/deleted':
      return {
        ...state,isLoading:false,cities:state.cities.filter((city)=>city.id!==action.payload),currentCity:{}
      }

    case 'rejected':
      return{
        ...state,isLoading:false,error:action.payload,
      }

    default: throw new Error('Unknown action type')
  }
}

function CitiesProvider({children})
{
const[{cities,isLoading,currentCity,error},dispatch]=useReducer(reducer,initialState)

    // const [cities,setCities]=useState([]);
    // const [isLoading,setIsLoading]=useState(false);
    // const [currentCity,setCurrentCity]=useState({});
   useEffect(function(){
    async function fetchCities(){
      dispatch({type:"loading"});
      try{
       
      const res=await fetch(`${URL}/cities`);
      const data=await res.json();
      dispatch({type: 'cities/loaded',payload:data});
      console.log(data);
     
    
    }catch{
      dispatch({type:'rejected',payload:"error loading cities"})
    }
  }
  
  fetchCities()
  
   },[]);
async function getCity(id){
  if(Number(id)===currentCity.id) return
  dispatch({type:"loading"});
     try{
          
        const res=await fetch(`${URL}/cities/${id}`);
        const data=await res.json();
        dispatch({type:"city/loaded",payload:data});
       }catch{
        dispatch({type:'rejected',payload:"error loading the city"})
      }
    }
    async function createCity(newCity){
      dispatch({type:"loading"});
      try{
          
         const res=await fetch(`${URL}/cities/`,{
          method: 'POST',
          body: JSON.stringify(newCity),
          headers: {
            "Content-Type": "application/json",
          },
         });
         const data=await res.json();
         dispatch({type:"city/created",payload:data})
        console.log(data);
        }catch{
          dispatch({type:'rejected',payload:"error creating the city"})
       }
       
     }
     
     async function deleteCity(id){
      dispatch({type:"loading"});
      try{
           
          const res=await fetch(`${URL}/cities/${id}`,{
          method: 'DELETE',
         
         });
         
         dispatch({type:"city/deleted",payload:id});
        
        }catch{
          dispatch({type:'rejected',payload:"error deleting the city"})}

     }

return (<CitiesContext.Provider value={{
    cities,
    isLoading,
    currentCity,
    getCity,
    createCity,
    deleteCity,
    error
}}>
    {children}
</CitiesContext.Provider>)
}
function useCities()
{
    const context=useContext(CitiesContext);
    if(context===undefined) 
        throw new Error("Cities context used outside the citiesProvider");
    return context;
}
export {CitiesProvider,useCities}