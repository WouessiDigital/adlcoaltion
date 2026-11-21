'use client'
import React from 'react'
import { useI18n } from '../lib/i18n/LocaleProvider'
import Image from 'next/image'
import AboutIMG from '../public/about-img.png'

const About = () => {
    const { t } = useI18n()
    return (
        <div id="about" className='w-full flex justify-center items-center p-4 sm:p-6 md:p-0'>
        <div className="  w-full max-w-[90%]  xl:max-w-[90%]
          flex flex-col items-center
          rounded-2xl
          pt-20">
           
            <div className='flex flex-col sm:flex-row gap-10 w-full '>

                    

                <div className=" sm:w-[60%] flex flex-col items-center sm:items-start  p-9 sm:p-8 md:p-10 lg:p-20 lg:pb-30 rounded-2xl bg-white shadow-xl">
                    <h1 className='text-3xl pb-5 font-bold text-[#16205B] lg:text-4xl'>{t.about.title}</h1>

                    <div className=''>
                    <p className='font-extralight pb-10 lg:text-xl'>{t.about.p1}</p>
                    <p className='font-extralight pb-10 lg:text-xl'>{t.about.p2}</p>

                    <Image
                        src={AboutIMG}
                        alt={t.about.imageAlt}
                        width={1000}
                        height={200}
                    />
                    </div>
                </div>


                <div className='flex sm:w-[40%] flex-col gap-10'>
                    <div className="w-full  flex  p-9  sm:p-8 md:p-10 lg:p-20 lg:pb-30 flex-col rounded-2xl bg-white shadow-xl">
                        <h1 className='text-3xl lg:text-4xl pb-5 font-bold text-[#16205B] '>{t.about.missionTitle}</h1>
                        <p className='font-extralight lg:text-xl'>{t.about.mission}</p>
                    </div>


                    <div className="w-full flex  h-full p-9 sm:p-8 md:p-10 lg:p-20 lg:pb-30 flex-col rounded-2xl bg-white shadow-xl">
                        <h1 className='text-3xl pb-5 font-bold lg:text-4xl text-[#16205B]'>{t.about.visionTitle}</h1>
                        <p className='font-extralight lg:text-xl'>{t.about.vision}</p>
                    </div>
                </div>

            </div>
        </div>
        </div>
    )
}

export default About