import styled from 'styled-components'
import { forwardRef } from 'react'

import pearPlanetSvg from '../../assets/background/pear-planet.svg'
import pearPlanetPng from '../../assets/background/pear-planet.png'

const SLayout = styled.div`
    background-color: #000000;
    position: relative;
    overflow-y: hidden;
    overflow-x: hidden;
`
const SPearPlanet = styled.div`
    position: fixed;
    width: 100%;
    height: 120vh;
    bottom: -50%;
    background: url(${pearPlanetSvg});
    filter: blur(6px);
    background-size: contain;
    background-position: center;
    background-repeat: no-repeat;
`

const SPearPlanetBackground = styled.div`
    position: fixed;
    width: 100vw;
    height: 100vh;
    bottom: 0;
    left: 0px;
    background: url(${pearPlanetPng});
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
`

const Layout: any = forwardRef(({ children }, ref: any) => {
    return <SLayout ref={ref}>
        {children}
        {/* <SPearPlanet /> */}
        <SPearPlanetBackground />
    </SLayout>
})

export default Layout