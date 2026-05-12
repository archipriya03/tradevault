import React from 'react';
import Awards from './Awards';
import Education from './Education';
import Hero from './Hero';
import Stats from './Stats';
import Pricing from './Pricing';
import Footer from '../Footer';
import OpenAccount from '../OpenAccount';
import Navbar from '../Navbar';

function HomePage() {
    return ( 
        <>

        <Hero/>
        <Awards/>
        <Stats/>
        <Education/>
        <Pricing/>
        <OpenAccount/>

        </>
     );
}

export default HomePage;