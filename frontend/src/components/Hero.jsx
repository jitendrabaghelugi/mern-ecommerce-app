import React from 'react'
import { Button } from './ui/button'

const Hero = () => {
  return (
    <section className='bg-linear-to-r from-blue-500 to-violet-500'>
     <div className="max-w-7xl mx-auto px-4 h-full ">

        <div className="grid md:grid-cols-2 gap-8 items-center text-white">

            <div className='flex gap-4 flex-col'>
                <h1 className='text-5xl font-bold'>Latest Electronics at Best Prices</h1>
                <p>Discover cutting-egde technology wiht the unbeatable deals on smartphones, laptops and more.</p>
                <div className="flex gap-4">
                    <Button className="bg-white text-blue-500">Shop Now</Button>
                    <Button className="bg-transparent border-white">View Deals</Button>
                </div>
            </div>
            <div className="relative rounded-lg shadow-2xl flex justify-center items-center my-12 py-8 mx-12">
                <img src="/images/2149437105.png" className=''  alt="Photo" />
            </div>
        </div>
        
     </div>
     
    </section>
  )
}

export default Hero;