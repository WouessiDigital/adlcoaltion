import React from 'react'
import Image from 'next/image'
import AboutIMG from '../public/about-img.png'

const About = () => {
    return (
        <div id="about" className='w-full flex justify-center items-center p-4 sm:p-6 md:p-0'>
        <div className="  w-full max-w-[90%]  xl:max-w-[90%]
          flex flex-col items-center
          rounded-2xl
          pt-20">
           
            <div className='flex flex-col sm:flex-row gap-10 w-full '>

                    

                <div className=" sm:w-[60%] flex flex-col items-center sm:items-start  p-9 sm:p-8 md:p-10 lg:p-20 lg:pb-30 rounded-2xl bg-white shadow-xl">
                    <h1 className='text-3xl pb-5 font-bold text-[#16205B] lg:text-4xl'>About ADLC</h1>

                    <div className=''>
                    <p className='font-extralight pb-10 lg:text-xl'>The African Diaspora Leaders Coalition (ADLC) is a dynamic alliance of African-descended professionals in Canada — including investors, academics, artists, athletes, and corporate leaders — committed to advancing African affairs through strategic collaboration with the Government of Canada and the private sector.</p>
                    <p className='font-extralight pb-10 lg:text-xl'>We serve as a platform to amplify Diaspora leadership, design impactful policies, and unlock opportunities for mutual growth between Canada and Africa.</p>

                    <Image
                        src={AboutIMG}
                        alt="About Image"
                        width={1000}
                        height={200}
                    />
                    </div>
                </div>


                <div className='flex sm:w-[40%] flex-col gap-10'>
                    <div className="w-full  flex  p-9  sm:p-8 md:p-10 lg:p-20 lg:pb-30 flex-col rounded-2xl bg-white shadow-xl">
                        <h1 className='text-3xl lg:text-4xl pb-5 font-bold text-[#16205B] '>Our Mission</h1>
                        <p className='font-extralight lg:text-xl'>To convene a diverse, cross-sectoral network of African Diaspora leaders from across Canada who are committed to mobilizing their lived experience, professional expertise, and global networks with mutual respect and dignity. Through principled collaboration, we aim to influence foreign policy, catalyze economic opportunity, and co-create solutions that promote equity, innovation, and shared progress between Canada and African nations.</p>
                    </div>


                    <div className="w-full flex  h-full p-9 sm:p-8 md:p-10 lg:p-20 lg:pb-30 flex-col rounded-2xl bg-white shadow-xl">
                        <h1 className='text-3xl pb-5 font-bold lg:text-4xl text-[#16205B]'>Our Vision</h1>
                        <p className='font-extralight lg:text-xl'>To be the preeminent platform of African Diaspora leadership in Canada, united in advancing bold, equitable, and enduring partnerships that redefine and strengthen Canada-Africa relations for mutual prosperity.</p>
                    </div>
                </div>

            </div>
        </div>
        </div>
    )
}

export default About