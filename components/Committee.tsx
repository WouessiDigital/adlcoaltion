'use client'
import React, { useState } from 'react'
import Image from 'next/image'
import { useI18n } from '../lib/i18n/LocaleProvider'
import { members, type Member } from '../lib/i18n/dictionaries'

const Card = ({ m, role }: { m: Member; role: string }) => (
    <div id={m.id} className="bg-gray-50 rounded-2xl shadow-xl overflow-hidden flex flex-col w-full sm:max-w-70 h-full">
        <div className="w-full h-40 sm:h-50 lg:h-70 overflow-hidden">
            <Image
                src={m.image}
                alt={m.name}
                width={350}
                height={160}
                className="w-full h-full object-cover"
            />
        </div>
        <div className='p-4 flex flex-col items-center gap-2 flex-1 justify-start'>
            <h2 className='font-bold text-[#16205B]'>{m.name}</h2>
            <p className='font-extralight text-center'>{role}</p>
        </div>
    </div>
)

const Committee: React.FC = () => {
    const { t, locale } = useI18n()
    const [showAll, setShowAll] = useState(false);

    return (
        <div id="committee" className='w-full flex flex-col mt-40 '>

            <div className='gap-4 p-6 sm:p-8 md:p-10 ml-10'>
                <h1 className='font-bold text-[#16205B] text-3xl mb-4 lg:text-5xl'>{t.committee.title}</h1>
                <p className='font-extralight lg:text-xl'>{t.committee.intro}</p>
            </div>

            <div className='w-full flex justify-center items-center align-middle p-4 sm:p-6 md:p-0 '>
                <div className='w-full max-w-full xl:max-w-[90%] flex flex-col rounded-2xl  '>
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8 mt-6 items-stretch">
                        {members.map((m) => {
                            const visibility = m.hiddenOnMobile && !showAll ? 'hidden sm:block' : 'block'
                            return m.linkedin ? (
                                <a
                                    key={m.id}
                                    href={m.linkedin}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className={`${visibility} h-full`}
                                >
                                    <Card m={m} role={m.role[locale]} />
                                </a>
                            ) : (
                                <div key={m.id} className={`${visibility} h-full`}>
                                    <Card m={m} role={m.role[locale]} />
                                </div>
                            )
                        })}
                    </div>

                    {/* Mobile-only toggle to reveal hidden members */}
                    <div className='w-full flex justify-center mt-6 sm:hidden'>
                        <button
                            className='box-border rounded-full border border-[#FF7300] px-6 sm:px-8 md:px-10 py-3 sm:py-4 sm:w-[50%] text-base sm:text-md md:text-md text-[#000000] font-extralight shadow-md bg-white transition-all duration-300 hover:text-[#FF7300] hover:shadow-lg hover:scale-105 active:scale-95'
                            onClick={() => setShowAll(prev => !prev)}
                            aria-expanded={showAll}
                        >
                            {showAll ? t.committee.showLess : t.committee.seeAll}
                        </button>
                    </div>
                </div>
            </div>

        </div>
    )
}

export default Committee
