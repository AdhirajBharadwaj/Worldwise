import React, { useEffect, useState } from 'react'
import {BrowserRouter, Routes,Route, Navigate} from "react-router-dom"
import Product from './pages/Product'
import Pricing from './pages/Pricing'
import HomePage from './pages/HomePage'
import PageNotFound from './pages/PageNotFound'
import PageNav from './components/PageNav'
import AppLayout from './pages/AppLayout';
import Login from './pages/Login'
import CityList from './components/CityList'
import CountryList from './components/CountryList'
import City from './components/City'
import Form from './components/Form'

const URL='http://localhost:8000';
export default function App() {

  const [cities,setCities]=useState([]);
  const [isLoading,setIsLoading]=useState(false);
 useEffect(function(){
  async function fetchCities(){
    try{
      setIsLoading(true);
    const res=await fetch(`${URL}/cities`);
    const data=await res.json();
    console.log(data);
    setCities(data);
  
  }catch{
    alert("error loading data")
  }finally
  {
    setIsLoading(false);
    
  }
}

fetchCities()

 },[]);

  return (
    <div>
      
    <BrowserRouter>
    <Routes>
      <Route path="product" element={<Product/>}></Route>
      <Route path="pricing" element={<Pricing/>}></Route>
      <Route path="/" element={<HomePage/>}></Route>
      <Route path='*' element={<PageNotFound/>}></Route>
      <Route path='app' element={<AppLayout/>}>
        <Route index element={<Navigate replace to="cities"/>}></Route>
        <Route path='cities' element={<CityList cities={cities} isLoading={isLoading}/>}></Route>
        <Route path='cities/:id' element={<City/>}></Route>
        
        <Route path='countries' element={<CountryList cities={cities} isLoading={isLoading}/>}></Route>
        <Route path='form' element={<Form/>}></Route>
      </Route>
      <Route path='login' element={<Login/>}></Route>
    </Routes>
    </BrowserRouter>
    </div>
  )
}
