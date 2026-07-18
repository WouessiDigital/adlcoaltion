'use client'
import React from 'react'
import { useRouter } from 'next/navigation'

const HomeCard = () => {
  const router = useRouter()

  
  return (
  <div className=''>
    <div id="home" className=" bg-gradient-to-b from-[#16205B]  to-white ">
      <div className="w-full flex justify-center items-center p-4 sm:p-6 md:p-0">
        <div className="
          w-full max-w-[90%]  xl:max-w-[90%]
          p-6 sm:p-8 md:p-10 lg:p-12 lg:pb-30
          flex flex-col items-center
          rounded-2xl bg-white
          shadow-xl
        ">
          {/* Title */}
          <h1 className="
            text-2xl sm:text-3xl md:text-4xl lg:text-7xl
            leading-tight
            text-center
            text-[#0c1555]
            font-semibold
            mb-0 sm:mb-15
            max-w-full sm:max-w-[80%] lg:max-w-[60%] md:max-w-[90%]
            px-2
            
          ">
            Advancing Canada-Africa relations through African Diaspora leadership
          </h1>

          {/* Subtitle */}
          <p className="
            text-black
            text-base sm:text-lg md:text-xl lg:text-2xl
            font-light
            text-center
            mb-6 sm:mb-8 md:mb-20
            max-w-full sm:max-w-[90%] md:max-w-[85%] lg:max-w-[50%]
            px-4
          ">
            Uniting African voices in Canada to shape policy, foster investment, and drive sustainable development across Africa.
          </p>

          {/* Buttons */}
          <div className="
            flex flex-col sm:flex-row
            gap-4 sm:gap-6
            w-full sm:w-auto
            items-center
            justify-center
            px-4 sm:px-0
          ">
            <button
              className="
                rounded-full
                bg-[#FF7300]
                px-6 sm:px-8 md:px-10
                py-3 sm:py-4
                w-full sm:w-auto sm:min-w-[200px] md:min-w-[250px]
                text-base sm:text-lg md:text-xl
                text-white
                font-semibold
                shadow-md
                transition-all duration-300
                hover:bg-[#facc15] hover:shadow-lg hover:scale-105
                active:scale-95
              "
              type="button"
              onClick={() => {
                if (window.location.pathname === '/') {
                  const el = document.getElementById('join')
                  if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
                } else {
                  router.push('/#join')
                  setTimeout(() => {
                    const el = document.getElementById('join')
                    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
                  }, 300)
                }
              }}
            >
              Become a Member
            </button>

            <button
              className="
                rounded-full
                border-2 border-[#FF7300]
                px-6 sm:px-8 md:px-10
                py-3 sm:py-4
                w-full sm:w-auto sm:min-w-[200px] md:min-w-[250px]
                text-base sm:text-lg md:text-xl
                text-[#FF7300]
                font-semibold
                shadow-md
                transition-all duration-300
                hover:bg-[#FF7300] hover:text-white hover:shadow-lg hover:scale-105
                active:scale-95
              "
              type="button"
            >
              Learn More
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
  )
}

export default HomeCard