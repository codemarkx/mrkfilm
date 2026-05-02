import React from 'react'
import MyImg from '@/assets/mark.png'


const navLinks =[
    {href: '#hero', label: 'Hero'},
    {href: '#about', label: 'About'},
    {href: '#services', label: 'Services'},
    {href: '#portfolio', label: 'Portfolio'},
    {href: '#contact', label: 'Contact'},
]
const Hero = () => {
  return (
    <header className='fixed top-0 left-0 right-0 bg-transparent py-5'>
<nav className='container mx-auto px-45 flex item-center justify-between'>
    <img src={MyImg} alt="Logo" className='w-40 h-40 rounded '>
    </img>

    <div>
        <a>
            {navLinks.map((link) => (
                <a key={link.href} href={link.href}>
                    {link.label}
                </a>
            ))}
        </a>
    </div>
</nav>
    </header>
  )
}

export default Hero
