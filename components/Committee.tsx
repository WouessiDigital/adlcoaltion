'use client'
import React, { useState } from 'react'
import Image from 'next/image'
import Headshot from '../public/placeholder.png'
import JudeKong from '../public/committee/JudeKong.png'    
import KofiAchampong from '../public/committee/KofiAchampong.png'
import MinervaGray from '../public/committee/MinervaGray.png'
import NerissaAllen from '../public/committee/NerissaAllen.png'
import PatrickMakokoro from '../public/committee/PatrickMakokoro.png'
import PerryChuinkam from '../public/committee/PerryChuinkam.png'
import TapfumaMusewe    from '../public/committee/TapfumaMusewe.png'
// Use public path for this image to avoid import/resolution issues
const SereineMNPath = '/committee/SereineMN.png'
const Committee: React.FC = () => {

    const [showAll, setShowAll] = useState(false);
    
    return (
        <div className='w-full flex flex-col mt-40 '>

            <div className='gap-4 p-6 sm:p-8 md:p-10 ml-10'>
                <h1 className='font-bold text-[#16205B] text-3xl mb-4 lg:text-5xl'>Meet the Interim Leadership Committee</h1>
                <p className='font-extralight lg:text-xl'>
                    Meet our diverse network of thought leaders shaping Africa’s future —
                    from corporate executives and researchers to artists and
                    entrepreneurs.
                </p>
            </div>

            {/* Use Tailwind grid so each child is an individual grid item */}
            <div className='w-full flex justify-center items-center align-middle p-4 sm:p-6 md:p-0 '>
                <div className='w-full max-w-full xl:max-w-[90%] flex flex-col rounded-2xl  '>
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8 mt-6 items-stretch">
                            <a href="https://www.linkedin.com/in/dzevela/" target="_blank" rel="noopener noreferrer" className="block h-full">
                              <div id="Jude-Kong" className="bg-gray-50 rounded-2xl shadow-xl overflow-hidden flex flex-col w-full sm:w-70 lg:w-70 h-full">
                                  <div className="w-full h-40 sm:h-50 lg:h-70 overflow-hidden">
                                      <Image
                                          src={JudeKong}
                                          alt="Policy Mobile Background"
                                          width={350}
                                          height={160}
                                          className="w-full h-full object-cover"
                                      />
                                  </div>
                                  <div className='p-4 flex flex-col items-center gap-2 flex-1 justify-start'>
                                      <h2 className='font-bold text-[#16205B]'>Jude Kong</h2>
                                      <p className='font-extralight text-center'>Executive Director at Africa-Canada AI & Data Innovation Consortium</p>
                                  </div>
                              </div>
                            </a>

                            <a href="https://www.linkedin.com/in/dzevela/" target="_blank" rel="noopener noreferrer" className="block h-full">

                            <div id="Kofi-Achampong" className="bg-gray-50 rounded-2xl shadow-xl overflow-hidden flex flex-col w-full sm:max-w-70 h-full">
                                <div className="w-full h-40 sm:h-50 lg:h-70 overflow-hidden">
                                    <Image
                                        src={KofiAchampong}
                                        alt="Kofi Achampong"
                                        width={350}
                                        height={160}
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                                <div className='p-4 flex flex-col items-center gap-2 flex-1 justify-start'>
                                    <h2 className='font-bold text-[#16205B]'>Kofi Achampong</h2>
                                    <p className='font-extralight text-center'>Principal Lawyer & Government Relations Advisor at Achampong Law</p>
                                </div>
                            </div>
                            </a>
                            <a href="https://www.linkedin.com/in/minervavsaddlergray/" target="_blank" rel="noopener noreferrer" className="block h-full">

                            <div id="Minerva-Gray" className="bg-gray-50 rounded-2xl shadow-xl overflow-hidden flex flex-col w-full sm:w-70 h-full">
                                <div className='w-full h-40 sm:h-50 lg:h-70 overflow-hidden'>
                                    <Image
                                        src={MinervaGray}
                                        alt="Minerva Saddler Gray"
                                        width={350}
                                        height={160}
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                                <div className='p-4 flex flex-col items-center gap-2 flex-1 justify-start'>
                                    <h2 className='font-bold text-[#16205B]'>Minerva Saddler Gray</h2>
                                    <p className='font-extralight text-center'>Founder of Kuinua Consulting</p>
                                </div>
                            </div>
                            </a>

                            <a href="https://www.linkedin.com/in/nerissa-allen/" target="_blank" rel="noopener noreferrer" className="block h-full">

                            <div id="Nerissa-Allen" className="bg-gray-50 rounded-2xl shadow-xl overflow-hidden flex flex-col w-full sm:w-70 h-full">
                                <div className="w-full h-40 sm:h-50 lg:h-70 overflow-hidden">
                                    <Image
                                        src={NerissaAllen}
                                        alt="Nerissa Allen"
                                        width={350}
                                        height={160}
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                                <div className='p-4 flex flex-col items-center gap-2 flex-1 justify-start'>
                                    <h2 className='font-bold text-[#16205B]'>Nerissa Allen</h2>
                                    <p className='font-extralight text-center'>Co-Founder & President of Black Business Association of BC</p>
                                </div>
                            </div>
                            </a>

                            {/* Remaining cards — keep them as grid items so rows have consistent gaps */}
                            <a href="https://www.linkedin.com/in/patrick-makokoro/" target="_blank" rel="noopener noreferrer" className="block h-full">

                            <div id="Patrick-Makokoro" className={`${showAll ? 'block' : 'hidden sm:block'} bg-gray-50 rounded-2xl shadow-xl overflow-hidden flex flex-col w-full sm:max-w-60 lg:max-w-70 h-full`}>
                                 <div className="w-full h-40 sm:h-50 lg:h-70 overflow-hidden">
                                     <Image
                                         src={PatrickMakokoro}
                                         alt="Patrick Makokoro"
                                         width={350}
                                         height={160}
                                         className="w-full h-full object-cover"
                                     />
                                 </div>
                                 <div className='p-4 flex flex-col items-center gap-2 flex-1 justify-start'>
                                     <h2 className='font-bold text-[#16205B]'>Patrick Makokoro</h2>
                                     <p className='font-extralight text-center'>Principal Consultant at HuUbuntu Consulting</p>
                                 </div>
                             </div>
                             </a>

                            <a href="https://www.linkedin.com/in/perry-chuinkam-66076211/" target="_blank" rel="noopener noreferrer" className="block h-full">
                            <div id="Perry-Chuinkam" className={`${showAll ? 'block' : 'hidden sm:block'} bg-gray-50 rounded-2xl shadow-xl overflow-hidden flex flex-col w-full sm:max-w-60 lg:max-w-70 h-full`}>
                                 <div className="w-full h-40 sm:h-50 lg:h-70 overflow-hidden">
                                     <Image
                                         src={PerryChuinkam}
                                         alt="Perry Chuinkam"
                                         width={350}
                                         height={160}
                                         className="w-full h-full object-cover"
                                     />
                                 </div>
                                 <div className='p-4 flex flex-col items-center gap-2 flex-1 justify-start'>
                                     <h2 className='font-bold text-[#16205B]'>Perry Chuinkam</h2>
                                    <p className='font-extralight text-center'>Vice President of Morgan Stanely</p>
                                </div>
                             </div>
                             </a>
                             
                            <a href="https://www.linkedin.com/in/tapfuma-musewe/" target="_blank" rel="noopener noreferrer" className="block h-full">
                            <div id="Tapfuma-Musewe" className={`${showAll ? 'block' : 'hidden sm:block'} bg-gray-50 rounded-2xl shadow-xl overflow-hidden flex flex-col w-full sm:w-80 lg:w-70 h-full`}>
                                 <div className="w-full h-40 sm:h-50 lg:h-70 overflow-hidden">
                                     <Image
                                         src={TapfumaMusewe}
                                         alt="Tapfuma Musewe"
                                         width={350}
                                         height={160}
                                         className="w-full h-full object-cover"
                                     />
                                 </div>
                                 <div className='p-4 flex flex-col items-center gap-2 flex-1 justify-start'>
                                     <h2 className='font-bold text-[#16205B]'>Tapfuma Musewe</h2>
                                    <p className='font-extralight text-center'>President of ESG Global Advisors</p>
                                </div>
                            </div>
                            </a>

                             <a href="https://www.linkedin.com/in/sereine-m-n-74236584/" target="_blank" rel="noopener noreferrer" className="block h-full">
                            <div id="Sereine M. N." className={`${showAll ? 'block' : 'hidden sm:block'} bg-gray-50 rounded-2xl shadow-xl overflow-hidden flex flex-col w-full sm:w-80 lg:w-70 h-full`}>
                                 <div className="w-full h-40 sm:h-50 lg:h-70 overflow-hidden">
                                    <Image
                                        src={SereineMNPath}
                                        alt="Sereine M. N."
                                        width={350}
                                        height={160}
                                        className="w-full h-full object-cover"
                                    />
                                 </div>
                                 <div className='p-4 flex flex-col items-center gap-2 flex-1 justify-start'>
                                     <h2 className='font-bold text-[#16205B]'>Sereine M. N.</h2>
                                    <p className='font-extralight text-center'>Administrator at Desjardins</p>
                                </div>
                            </div>
                            </a>
                             </div>

                        {/* Mobile-only toggle to reveal hidden members */}
                        <div className='w-full flex justify-center mt-6 sm:hidden'>
                            <button
                                className='box-border rounded-full border border-[#FF7300] px-6 sm:px-8 md:px-10 py-3 sm:py-4 sm:w-[50%] text-base sm:text-md md:text-md text-[#000000] font-extralight shadow-md bg-white transition-all duration-300 hover:text-[#FF7300] hover:shadow-lg hover:scale-105 active:scale-95'
                                onClick={() => setShowAll(prev => !prev)}
                                aria-expanded={showAll}
                            >
                                {showAll ? 'Show Less' : 'See All Members'}
                            </button>
                        </div>
             </div>
             </div>

         </div>
     )
 }

 export default Committee