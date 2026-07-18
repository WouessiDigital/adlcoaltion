import React from 'react'

const Calendar = () => {
  const now = new Date()
  const month = now.toLocaleString('en-US', { month: 'long' })
  const day = now.getDate()
  const title = `${month} ${day}`

  return (
    <div  className=" bg-gradient-to-b from-[#16205B]  to-white ">
      <div className="w-full flex justify-center items-center p-4 sm:p-6 md:p-0">
        <div className="
          w-full max-w-[90%]  xl:max-w-[90%]
          p-6 sm:p-8 md:p-10 lg:p-12 lg:pb-30
          flex flex-col items-center
          rounded-2xl bg-white
          shadow-xl
        ">
      <div className='w-full max-w-[90%] xl:max-w-[90%]'>
  <h1 className='text-2xl font-bold text-[#16205B] mb-5 flex justify-center lg:text-5xl '>Events</h1>

        {/* Responsive iframe: full width of container, taller on larger screens */}
        <div className='w-full'>
              <div className='relative w-full' style={{ paddingTop: '75%' }}>
                <iframe
                  title='ADLC Google Calendar'
                  src='https://calendar.google.com/calendar/embed?src=64eadc05afab2a85a534d13908d8a5260b39a3c8b8b2a2ae15ef04a0f2d26b5e%40group.calendar.google.com&ctz=America%2FToronto'
                  className='absolute inset-0 w-full h-full border-2 border-gray-300 rounded-[25px] shadow-lg '
                  frameBorder='0'
                  scrolling='no'
                  loading='lazy'
                />
              </div>
        </div>
      </div>
      </div>
    </div>
    </div>
  )
}

export default Calendar