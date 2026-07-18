"use client"
import React, { useState } from 'react'
import Logo from '../public/LOGO.png'
import Image from 'next/image'
import { CiCalendar } from 'react-icons/ci'
import MenuIcon from '../public/menu.png'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { IoIosClose } from "react-icons/io";
import { FaHome } from "react-icons/fa";
import { FaInfo } from "react-icons/fa";
import { MdPolicy } from "react-icons/md";
import { LuSquareMenu } from "react-icons/lu";


const Header: React.FC = () => {
    const router = useRouter()
    const [menuOpen, setMenuOpen] = useState(false)
    const [active, setActive] = useState<string>('home')

    const scrollToSection = (id: string) => {
        if (typeof document === 'undefined') return
        // If targeting the top of the page, scroll to window top instead of an element
        if (id === 'home') {
            // If already on the same page, just scroll to top
            if (window.location.pathname === '/') {
                window.scrollTo({ top: 0, behavior: 'smooth' })
                setActive('home')
                return
            }

            // Navigate to home then scroll to top
            router.push('/')
            setActive('home')
            setTimeout(() => window.scrollTo({ top: 0, behavior: 'smooth' }), 250)
            return
        }

        const el = document.getElementById(id)
        if (el) {
            el.scrollIntoView({ behavior: 'smooth', block: 'start' })
            setActive(id)
            return
        }

        // Not on the same page (e.g., user is on /calendar). Navigate to home with hash then try to scroll.
        const target = `/#${id}`
        router.push(target)
        setActive(id)

        // Attempt to scroll after navigation — small delay to allow the page to render.
        setTimeout(() => {
            const el2 = document.getElementById(id)
            if (el2) el2.scrollIntoView({ behavior: 'smooth', block: 'start' })
        }, 250)
    }

    const handleClose = (e?: React.MouseEvent) => {
        // small debug output to verify the click fires
        if (typeof window !== 'undefined') console.log('drawer: close clicked', e?.type)
        setMenuOpen(false)
    }

    // debug: log menu state changes
    useEffect(() => {
        if (typeof window !== 'undefined') console.log('drawer: menuOpen ->', menuOpen)
    }, [menuOpen])

    useEffect(() => {
        // lock scroll when menu is open
        if (menuOpen) {
            const prev = document.body.style.overflow
            document.body.style.overflow = 'hidden'
            return () => { document.body.style.overflow = prev }
        }
    }, [menuOpen])

    useEffect(() => {
        const onKey = (e: KeyboardEvent) => {
            if (e.key === 'Escape') setMenuOpen(false)
        }
        window.addEventListener('keydown', onKey)
        return () => window.removeEventListener('keydown', onKey)
    }, [])


    return (
        <div className='bg-[#16205B]'>

            {/* MOBILE VIEW */}
            <div className='p-3 sm:hidden'>
                <div className='flex justify-between'>
                    <Image src={Logo} alt='Logo' width={150} height={20} priority />

                    <button
                        type='button'
                        aria-label='Open mobile menu'
                        className={
                            'mr-4 inline-flex items-center justify-center   text-[#16205B] rounded relative ' +
                            (menuOpen ? 'pointer-events-none z-0' : 'pointer-events-auto z-60')
                        }
                        onClick={() => setMenuOpen(true)}
                    >
                        <LuSquareMenu size={30} color='white' />
                    </button>
                </div>
            </div>

            <div className={"md:hidden fixed inset-0 z-50 " + (menuOpen ? 'pointer-events-auto' : 'pointer-events-none')}>
                {/* overlay */}
                <div
                    onClick={(e) => { e.stopPropagation(); handleClose(); }}
                    className={
                        'absolute inset-0 bg-black/40 transition-opacity duration-300 z-40 ' +
                        (menuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none')
                    }
                    aria-hidden={!menuOpen}
                />

                <aside
                    className={
                        'absolute top-0 right-0 h-full w-72 bg-white shadow-xl p-6 overflow-auto transform transition-transform duration-300 z-50 ' +
                        (menuOpen ? 'translate-x-0 pointer-events-auto' : 'translate-x-full pointer-events-none')
                    }
                    aria-hidden={!menuOpen}
                >
                    <div className='flex items-center justify-between mb-6'>
                        <Image src={Logo} alt='Logo' width={120} height={32} />
                        <button
                            type='button'
                            aria-label='Close menu'
                            onClickCapture={(e) => { e.stopPropagation(); handleClose(e as any); }}
                            onPointerDown={(e) => { e.stopPropagation(); handleClose(e as any); }}
                            className='text-gray-600 pointer-events-auto'
                        >
                            <IoIosClose size={28} />
                        </button>
                    </div>

                    <nav>
                            <ul className='flex flex-col gap-4 mt-10'>
                            <li>
                                <button className={`text-[#16205B] ${active === 'home' ? 'font-bold underline' : 'font-light'}`} onClick={() => { scrollToSection('home'); setMenuOpen(false); }}>
                                    <FaHome size={25} color='#FF7300' className='inline-block mr-2' />
                                    Home
                                </button>
                            </li>
                            <li>
                                <button className={`text-[#16205B] ${active === 'about' ? 'font-bold underline' : 'font-light'}`} onClick={() => { scrollToSection('about'); setMenuOpen(false); }}>
                                    <FaInfo size={25} color='#FF7300' className='inline-block mr-2' />
                                    About Us
                                </button>
                            </li>
                            <li>
                                <button className={`text-[#16205B] ${active === 'policy' ? 'font-bold underline' : 'font-light'}`} onClick={() => { scrollToSection('policy'); setMenuOpen(false); }}>
                                    <MdPolicy size={25} color='#FF7300' className='inline-block mr-2' />
                                    Policy Advocacy
                                </button>
                            </li>
                            <li>
                                <a href='/calendar' className='flex items-center gap-2 text-[#16205B] font-light' onClick={() => setMenuOpen(false)}>
                                    <CiCalendar size={30} color='#FF7300' />
                                    Calendar
                                </a>
                            </li>
                            <li className='pt-4'>
                                <button className='inline-block rounded-full  bg-[#FF7300] px-4 py-2 text-md text-white shadow-md transition-all hover:bg-[#facc15] hover:shadow-lg ml-2 font-bold' onClick={() => { scrollToSection('join'); setMenuOpen(false); }}>
                                    Join Us
                                </button>
                            </li>
                        </ul>
                    </nav>
                </aside>
            </div>


            {/* DESKTOP VIEW */}
            <div className='hidden md:block pb-2 pt-5'>
                <header>
                    <div className='w-full flex justify-center items-center p-5 sm:p-6 md:p-0'>
                        <div className='w-full max-w-[90%] xl:max-w-[90%] flex items-center px-4 sm:px-6'>

                            {/* Logo - aligned with HomeCard left edge */}
                            <div className='shrink-0 self-end'>
                                <Image src={Logo} alt='Logo' width={200} height={40} priority />
                            </div>

                            <nav className='hidden md:flex flex-1 justify-start ml-20'>
                                <ul className='flex space-x-16'>
                                        <li>
                                            <button onClick={() => scrollToSection('home')} className={`${active === 'home' ? 'text-white font-bold underline' : 'text-white font-extralight'} transition-all duration-200`}>Home</button>
                                        </li>
                                        <li>
                                            <button onClick={() => scrollToSection('about')} className={`${active === 'about' ? 'text-white font-bold underline' : 'text-white font-extralight'} transition-all duration-200`}>About Us</button>
                                        </li>
                                        <li>
                                            <button onClick={() => scrollToSection('policy')} className={`${active === 'policy' ? 'text-white font-bold underline' : 'text-white font-extralight'} transition-all duration-200`}>Policy Advocacy</button>
                                        </li>
                                    </ul>
                            </nav>

                            <div className='flex items-center gap-3 '>
                                <a href='/calendar'>
                                    <CiCalendar size={33} color='#FF7300' className='cursor-pointer hover:scale-110 transition-transform' />
                                </a>

                                <button
                                    className='rounded-[0.625rem] bg-[#FF7300] px-4 py-2 text-sm text-white shadow-md transition-all hover:bg-[#facc15] hover:shadow-lg font-bold'
                                    type='button'
                                    onClick={() => scrollToSection('join')}
                                >
                                    Join Us
                                </button>
                            </div>

                        </div>
                    </div>
                </header>
            </div>
        </div>
    )
}

export default Header