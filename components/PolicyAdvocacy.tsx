'use client'
import React from 'react'
import Image from 'next/image'
import PolicyMobileBG from '../public/policy-mobile-bg.png';
import PolicyBG from '../public/policy-bg.png';
import PolicyIcon from '../public/policy-icon.png';
import { useState } from 'react';

const PolicyAdvocacy = () => {

  const [policy, setPolicy] = useState(true);
  const [economicClick, economicClicked] = useState(false);
  const [diasporaClick, diasporaClicked] = useState(false);
  const [knowledgeClick, knowledgeClicked] = useState(false);

  const policyVisibility = () => {
    setPolicy(!policy);
  }

  return (
    <div id="policy" className='w-full flex justify-center items-center p-4 sm:p-6 md:p-0'>
      <div className='w-full max-w-[90%] xl:max-w-[90%] flex flex-col  rounded-2xl pt-20'>
        <h1 className='text-[#16205B] text-2xl text-left sm:hidden sm:text-3xl'>What We Do</h1>

        {/* Responsive two-column: stacked on mobile, side-by-side on md+ */}
        <div className='flex flex-col md:flex-row mt-10 md:gap-4 items-start w-full'>

          {/* Left column: buttons (full width on mobile, half on md+) */}
          <div className='w-full md:w-1/3 flex flex-col items-start lg:mt-8'>
            <div className="w-full sm:mt-6 flex flex-col items-start gap-5 md:gap-3">

              <button
                className="box-border rounded-full border border-[#FF7300] px-8 sm:px-10 md:px-12 py-3 sm:py-4 md:py-5 w-full text-base sm:text-lg md:text-xl text-[#000000] font-extralight shadow-md bg-white sm:bg-none transition-all duration-300 hover:text-[#FF7300] hover:shadow-lg hover:scale-105 active:scale-95"
                type="button" onClick={policyVisibility}
              >Policy Advocacy</button>
              {/* Mobile-only image below the first button (kept mounted for smooth transitions) */}
              <div className={`block md:hidden mb-0 w-full shadow-lg transition-all duration-500 ease-out ${policy ? 'max-h-80 opacity-100 translate-y-0 scale-100' : 'max-h-0 opacity-0 -translate-y-3 scale-95 pointer-events-none'}`} aria-hidden={!policy}>
                <div className='w-full relative'>
                  <Image src={PolicyMobileBG} alt="Policy Mobile Background" width={900} height={160} className="w-full h-auto block rounded-lg" />

                  <div className='absolute bottom-2 left-2 z-20 bg-white/75 rounded-md px-3 py-2 flex items-start gap-3 w-[92%]'>
                    <Image src={PolicyIcon} alt='Policy Icon' width={40} height={40} className='w-8 h-8 object-contain' priority />
                    <div className='flex flex-col'>
                      <span className='text-sm font-semibold text-[#16205B]'>Policy Advocacy</span>
                      <span className='text-[13px] text-[#16205B]  sm:block'>Provide actionable recommendations to support Canada-Africa economic, diplomatic and development cooperation.</span>
                    </div>
                  </div>
                </div>
              </div>

              <button className="box-border rounded-full border border-[#FF7300] px-8 sm:px-10 md:px-12 py-3 sm:py-4 md:py-5 w-full text-base sm:text-lg md:text-xl text-[#000000] font-extralight shadow-md bg-white transition-all duration-300 hover:text-[#FF7300] hover:shadow-lg hover:scale-105 active:scale-95" type="button" onClick={() => economicClicked(true)}>Economic Cooperation</button>

              <button className="box-border rounded-full border border-[#FF7300] px-8 sm:px-10 md:px-12 py-3 sm:py-4 md:py-5 w-full text-base sm:text-lg md:text-xl text-[#000000] font-extralight shadow-md bg-white transition-all duration-300 hover:text-[#FF7300] hover:shadow-lg hover:scale-105 active:scale-95" type="button" onClick={() => diasporaClicked(true)}>Diaspora Engagement</button>

              <button className="box-border rounded-full border border-[#FF7300] px-8 sm:px-10 md:px-12 py-3 sm:py-4 md:py-5 w-full text-base sm:text-lg md:text-xl text-[#000000] font-extralight shadow-md bg-white transition-all duration-300 hover:text-[#FF7300] hover:shadow-lg hover:scale-105 active:scale-95" type="button" onClick={() => knowledgeClicked(true)}>Knowledge Engagement</button>

            </div>
          </div>

          {/* Right column: image (hidden on mobile, visible on md+ as half width) */}
          <div className='w-full hidden md:flex items-center justify-center pl-4'>
            <div className={`w-full relative transition-all duration-500 ease-out ${policy ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2 pointer-events-none'}`} aria-hidden={!policy}>
              <Image src={PolicyBG} alt='Policy Background' width={900} height={600} className='w-full h-auto object-cover rounded-lg' priority />

              {/* Policy icon positioned top-left over the image with semi-transparent background and room for a label */}
              <div className='absolute top-3 left-5 z-20 bg-white/30 backdrop-blur-sm rounded-sm px-4 py-3 w-[30%] flex flex-col gap-2'>
                <Image src={PolicyIcon} alt='Policy Icon' width={56} height={56} className='w-12 h-12 md:w-14 md:h-14 object-contain' priority />
                {/* optional label (hidden on extra-small screens) */}
                <div className='flex flex-col p-2'>
                  <span className='hidden sm:inline font-bold text-[#16205B] sm:text-3xl mb-2'>Policy Advocacy</span>
                  <span className='hidden sm:inline text-[#16205B] sm:text-xl'>Provide actionable recommendations to support Canada-Africa economic, diplomatic and development cooperation.</span>
                </div>
              </div>

            </div>
          </div>

        </div>

      </div>
    </div>
  )
}

export default PolicyAdvocacy