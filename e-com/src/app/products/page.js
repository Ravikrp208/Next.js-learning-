import React from 'react'
import axios from '@/lib/api'   

const page = () => {

let products = axios.get("https://fakestoreapi.com/products")
console.log(products.data)

  return (
    <div>page</div>
  )
}

export default page