import React from 'react'

const page =async  ({params}) => {
    let {id} = await params ;

  return (
    <div>This is danamic Routes {id} </div>
  )
}

export default page