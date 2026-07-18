
'use client'
import React from 'react'
import Image from 'next/image'
import Instagram from '../public/social-icons/instagram.png'
import Linkedin from '../public/social-icons/linkedin.png'
import X from '../public/social-icons/X.png'
import { useRouter } from 'next/navigation'
import { Form } from '../components/index'
const JoinForm = () => {
    const router = useRouter()
    return (
        <div>
            <div id="join" className='w-full flex justify-center items-center p-4 sm:p-6 md:p-0  pt-10 sm:mt-50'>
                <div className=' w-full h-fit max-w-6xl xl:max-w-6xl
        p-6 sm:p-8 md:p-10 lg:p-12 lg:pb-30
        flex flex-col items-center
        rounded-2xl bg-white align-middle border
        shadow-xl gap-10 relative z-40 -mb-50 md:-mb-20 lg:-mb-42'>
                    <div className='flex justify-center flex-col sm:w-[70%]'>
                        <h1 className='font-bold text-[#16205B] text-2xl sm:text-3xl self-center mb-10 lg:text-5xl'>Join the Movement</h1>
                        <p className='font-extralight text-center sm:text-xl'>ADLC is a recognized non-profit organization dedicated to creating a new framework for Diaspora-led diplomacy and development.
                            Join our growing alliance to define the next chapter of Africa-Canada relations.</p>
                    </div>
                    <Form />

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
                            hidden
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
                            Join our Newsletter
                        </button>
                    </div>
                </div>

                <div>

                </div>

            </div>
            <div className='bg-[#16205B] w-full h-130 z-0 pt-10 md:pt-20 lg:pt-0'>

                <div className='w-full h-[80%] flex flex-col justify-end items-center'>
                    {/* Social icons row right above the divider */}
                    <div className='flex text-white gap-10 justify-start w-[90%]'>
                        <p>About</p>
                        <p>Contact</p>
                        <p>Blog</p>
                        <p>Resources</p>
                    </div>

                    <div className='sm:w-[90%] flex justify-center sm:justify-end items-center gap-10 mt-8 sm:mt-0 mb-7'>
                        <Image src={Linkedin} alt="LinkedIn" width={24} height={24} className='sm:h-6 h-10 w-auto' priority />
                        <Image src={X} alt="X" width={24} height={24} className='sm:h-6 h-10 w-auto' priority />
                        <Image src={Instagram} alt="Instagram" width={24} height={24} className='sm:h-6 h-10 w-auto' priority />
                    </div>

                    <div className='w-[90%] border-t border-white'></div>

                    <div className='w-[90%] flex justify-between  mt-4 '>
                <a className='text-white font-extralight flex justify-self-start' href="https://wouessi.com">Designed by Wouessi Inc.</a>

                        <p className='text-white font-extralight text-center sm:text-left'>© 2026 African Diaspora Leaders Coalition – All Rights Reserved</p>
                    </div>

                </div>


            </div>
        </div>
    )
}

export default JoinForm