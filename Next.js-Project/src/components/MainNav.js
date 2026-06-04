import React from 'react'
import Link from 'next/link'

const MainNav = () => {
  return (
    <div className='flex gap-5'>
      <Link href={"/mainlayout/home"} >Home</Link>
      <Link href={"/mainlayout/about"} >About</Link>
      <Link href={"/mainlayout/service"} >Service</Link>
      <Link href={"/mainlayout/contact"} >Contact</Link>
    </div>
  )
}

export default MainNav
