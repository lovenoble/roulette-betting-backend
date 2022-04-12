import { useRef, useState, useMemo, useCallback, useEffect } from 'react'
import styled, { css } from 'styled-components'
import { motion, AnimatePresence, useAnimation } from 'framer-motion'
import { useDebounce } from 'react-use'
import { useNavigate } from 'react-router-dom'

// Assets
import openMenuLogo from '../../../assets/navbar/open-menu.svg'
import unlockLogo from '../../../assets/navbar/unlock.svg'
import lockLogo from '../../../assets/navbar/lock.svg'
import closeLogo from '../../../assets/navbar/close.svg'
import minimizeLogo from '../../../assets/navbar/minimize.svg'
import maximizeLogo from '../../../assets/navbar/maximize.svg'
import hoverOpenArrowsLogo from '../../../assets/navbar/hover-open-arrows.svg'

// Nav Options
import analysisIcon from '../../../assets/crypto/analysis.svg'
import analyticsIcon from '../../../assets/crypto/analytics.svg'
import blockchainIcon from '../../../assets/crypto/blockchain.svg'
import computerIcon from '../../../assets/crypto/computer.svg'
import cryptoIcon from '../../../assets/crypto/crypto.svg'
import exchangeIcon from '../../../assets/crypto/exchange.svg'
import globeIcon from '../../../assets/crypto/globe.svg'
import miningIcon from '../../../assets/crypto/mining.svg'
import p2pIcon from '../../../assets/crypto/p2p.svg'
import strategyIcon from '../../../assets/crypto/strategy.svg'

// Hooks
import useDebounceCallback from '../../../hooks/useDebounceCallback'
import useAuth from '../../../hooks/useAuth'

// Components
import UserAvatar from '../../UI/UserAvatar'

const NAV_OPENED_ATTACHED_WIDTH = 74

const SNavbar = styled(motion.nav)`
    height: 100vh;
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    width: 0px;
    background: linear-gradient(
        135deg,
        rgba(135, 15, 79, 0.65) 0%,
        rgba(135, 15, 79, 0.9) 50%,
        rgba(135, 15, 79, 0.6) 100%
    );
    padding-top: 54px;
    position: relative;
    user-select: none;
    position: fixed;
    left: 0px;
    top: 0px;
    z-index: 150;
    overflow: hidden;
`

const SActionHint = styled(motion.div)`
    width: ${NAV_OPENED_ATTACHED_WIDTH}px;
    height: 20px;
    display: flex;
    align-items: center;
    justify-content: center;
    box-sizing: border-box;
    font-size: 12px;
    font-weight: bold;
    position: fixed;
    top: 32px;
    background: rgba(38, 10, 38, 0.66);
    color: rgba(255, 255, 255, 0.66);
    border: 1px solid rgba(110, 0, 110, 0.4);
    overflow: hidden;
`

const SActionGroup = styled(motion.div)<{ isDetached: boolean }>`
    display: flex;
    align-items: center;
    justify-content: flex-start;
    position: absolute;
    top: 12px;
    min-width: ${NAV_OPENED_ATTACHED_WIDTH}px;
    width: 100%;
    .action-dot {
        margin-left: 4px;
        margin-right: 4px;
        &.dot-red {
            margin-left: 8px;
            background: #ff5f57;
        }
        &.dot-yellow {
            background: #febc2d;
        }
        &.dot-green {
            background: #27c840;
        }
    }
`

const SActionDot = styled(motion.div)`
    cursor: pointer;
    height: 14px;
    width: 14px;
    background: #bdbdbd;
    border-radius: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    &.disabled {
        filter: grayscale(1) brightness(0.5);
        cursor: not-allowed;
    }
    > img {
        height: 8px;
        width: 8px;
    }
`

const actionDotVariants = {
    initial: {
        scale: 1,
        transition: {
            duration: 0.15,
            type: 'tween',
        },
    },
    hover: {
        scale: 1.3,
        transition: {
            duration: 0.15,
            type: 'tween',
        },
    },
}

const actionGroupVariants = {
    initial: {
        x: -20,
    },
    hover: {
        x: 0,
    },
    attached: {
    },
    detached: {
    },
}

const actionHintVariant = {
    initial: {
        opacity: 0,
        height: 0,
        marginTop: 10,
    },
    animate: {
        opacity: 1,
        height: 20,
        marginTop: 0,
        transition: {
            type: 'tween',
            duration: 0.2,
        },
    },
    exit: {
        height: 0,
        opacity: 0,
        marginTop: 10,
        transition: {
            type: 'tween',
            duration: 0.2,
        },
    },
}

function ActionDot({
    src = '',
    alt = '',
    setHint = (val: string) => {},
    removeHint = () => {},
    toggle = () => {},
    className = '',
    isDisabled = false,
}) {
    const hintToggle = () => {
        if (isDisabled) return
        setHint(alt)
        toggle()
    }

    return (
        <SActionDot
            className={`${className} action-dot ${isDisabled && 'disabled'}`}
            onClick={hintToggle}
            onMouseEnter={isDisabled ? () => {} : () => setHint(alt)}
            onMouseLeave={isDisabled ? () => {} : removeHint}
            variants={actionDotVariants}
            initial="initial"
            animate="animate"
            whileHover={!isDisabled ? 'hover' : ''}
        >
            <img alt={alt} src={src} />
        </SActionDot>
    )
}

const navbarVariants = {
    initial: {
        y: 0,
        x: 0,
        width: 16,
        opacity: 1,
        scale: 1,
        borderRadius: 0,
        height: '100vh',
        cursor: 'default',
    },
    maximized: {
        y: 0,
        x: 0,
        opacity: 1,
        scale: 1,
        borderRadius: 0,
        width: NAV_OPENED_ATTACHED_WIDTH,
    },
    closed: {
        opacity: [1, 0.4, 0],
        scale: [1, 0],
        transition: {
            type: 'spring',
            duration: 0.3,
        },
    },
    detached: {
        y: 16,
        x: 16,
        width: 300,
        height: 210,
        opacity: 1,
        scale: 1,
        borderRadius: 6,
        cursor: 'grab',
    },
    tap: {
        cursor: 'grabbing',
    },
    hover: {
        opacity: 1,
        scale: 1,
        width: NAV_OPENED_ATTACHED_WIDTH,
        y: 0,
        x: 0,
        borderRadius: 0,
        height: '100vh',
    },
}

const SOpenNav = styled(motion.div)`
    position: fixed;
    z-index: 151;
    top: 18px;
    left: 18px;
    background: linear-gradient(
        135deg,
        rgba(135, 15, 79, 0.8) 0%,
        rgba(135, 15, 79, 0.9) 50%,
        rgba(135, 15, 79, 0.8) 100%
    );
    box-shadow: -50px 0px 100px 40px rgba(38, 10, 38, 0.58);
    display: flex;
    align-items: center;
    justify-content: center;
    height: 32px;
    width: 32px;
    border-radius: 100%;
    cursor: pointer;
    > img {
        height: 20px;
    }
`

const openNavVariants = {
    initial: {
        scale: 1,
        y: -60,
    },
    animate: {
        y: 0,
        scale: 1,
        transition: {
            type: 'spring',
            duration: 0.25,
        },
    },
    hover: {
        scale: 1.2,
        transition: {
            type: 'spring',
            duration: 0.25,
        },
    },
    tap: {
        scale: 0.9,
        transition: {
            type: 'spring',
            duration: 0.25,
        },
    },
    exit: {
        y: -60,
    },
}

function OpenNav({ onClick = () => {} }) {
    return (
        <SOpenNav
            variants={openNavVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            whileHover="hover"
            whileTap="tap"
            onClick={onClick}
        >
            <img alt="Open Menu" src={openMenuLogo} />
        </SOpenNav>
    )
}

interface INavbar {
    dragAreaRef: any
}

const useMyPrevious = (val: boolean) => {
    const ref = useRef(val)
    useEffect(() => {
        ref.current = val
    }, [val])
    return ref.current
}

const SHoverArrowsIcon = styled(motion.div)`
    width: 16px;
    height: 100vh;
    top: 0px;
    left: 0px;
    position: fixed;
    z-index: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    overflow-x: visible;
    pointer-events: none;
    user-select: none;
    > img {
        position: absolute;
        right: -20px;
        height: 20px;
    }
`

const hoverArrowsVariants = {
    initial: {
        x: -60,
    },
    animate: {
        x: 0,
        transition: {
            type: 'tween',
        }
    },
    exit: {
        x: -60,
        transition: {
            type: 'tween',
            duration: 0.1,
        }
    }
}

function HoverArrowsIcon() {
    return (
        <SHoverArrowsIcon variants={hoverArrowsVariants} initial="initial" animate="animate" exit="exit">
            <img alt="Hover Arrows" src={hoverOpenArrowsLogo} />
        </SHoverArrowsIcon>
    )
}

const SNavbarOptions = styled(motion.div)`
    display: flex;
    flex-wrap: wrap;
`

const SNavbarOption = styled(motion.div)`
    width: ${NAV_OPENED_ATTACHED_WIDTH}px;
    height: ${NAV_OPENED_ATTACHED_WIDTH}px;
    box-sizing: border-box;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
`

// Home
// Chat
// Wallet
// Settings
// Game
// Metaverse
// Info
// Analytics
// Docs
// Notifications
// Logout

const SNavOptionBar = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    > .nav-option-bar {
        padding-top: 8px;
        margin-bottom: 12px;
        width: ${NAV_OPENED_ATTACHED_WIDTH * .66}px;
        border-bottom: 1px solid rgba(255, 255, 255, 0.12);
    }
`

function NavOptionBar() {
    return (
        <SNavOptionBar>
            <div className="nav-option-bar" />
        </SNavOptionBar>
    )
}

const SNavbarUserOption = styled(motion.div)`
    height: 100%;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    height: 62px;
    width: 62px;
    background: rgba(0, 0, 0, .25);
    border-radius: 12px;
    box-shadow: rgb(0 0 0 / 20%) 0px 3px 3px -2px,
        rgb(0 0 0 / 14%) 0px 3px 4px 0px, rgb(0 0 0 / 12%) 0px 1px 8px 0px;
    > img {
        height: 50px;
    }
`

const navOptionVariants = {
    initial: {
        scale: 1,
   },
    hover: {
        scale: 1.1,
        transition: {
            type: 'spring',
            duration: 0.25,
        },
    },
    tap: {
        scale: 0.9,
        transition: {
            type: 'spring',
            duration: 0.25,
        },
    },
}

const SSmallNavOptionWrapper = styled.div`
    height: ${NAV_OPENED_ATTACHED_WIDTH * .6}px;
    width: ${NAV_OPENED_ATTACHED_WIDTH}px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 12px;
    user-select: none;
`

const SSmallNavOption = styled(motion.div)`
    cursor: pointer;
    height: 100%;
    width: ${NAV_OPENED_ATTACHED_WIDTH * 0.6}px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: rgba(0, 0, 0, 0.25);
    border-radius: 12px;
    box-shadow: rgb(0 0 0 / 20%) 0px 3px 3px -2px,
        rgb(0 0 0 / 14%) 0px 3px 4px 0px, rgb(0 0 0 / 12%) 0px 1px 8px 0px;
    > img {
        height: 30px;
    }
`

const navbarOptionsVariant = {
    initial: {
        x: -20,
    },
    show: {
        x: 0,
    },
}

function NavbarOptions({
    publicAddress = '',
    setHint = (val: string) => {},
    removeHint = () => {},
    isOpen = false,
}) {
    const navigate = useNavigate()

    return (
        <SNavbarOptions
            variants={navbarOptionsVariant}
            initial="initial"
            animate={isOpen ? 'show' : 'initial'}
        >
            <SNavbarOption>
                <SNavbarUserOption
                    variants={navOptionVariants}
                    initial="initial"
                    whileHover="hover"
                    whileTap="tap"
                    onClick={() => navigate('/')}
                    onMouseEnter={() => setHint('Profile')}
                    onMouseLeave={removeHint}
                >
                    <UserAvatar publicAddress={publicAddress} />
                </SNavbarUserOption>
            </SNavbarOption>
            <NavOptionBar />
            <SSmallNavOptionWrapper>
                <SSmallNavOption
                    variants={navOptionVariants}
                    initial="initial"
                    whileHover="hover"
                    whileTap="tap"
                    onClick={() => navigate('/chat')}
                    onMouseEnter={() => setHint('Bridge')}
                    onMouseLeave={removeHint}
                >
                    <img alt="Bridge" src={globeIcon} />
                </SSmallNavOption>
            </SSmallNavOptionWrapper>
            <SSmallNavOptionWrapper>
                <SSmallNavOption
                    variants={navOptionVariants}
                    initial="initial"
                    whileHover="hover"
                    whileTap="tap"
                    onClick={() => navigate('/crypto')}
                    onMouseEnter={() => setHint('Wallet')}
                    onMouseLeave={removeHint}
                >
                    <img alt="Wallet" src={cryptoIcon} />
                </SSmallNavOption>
            </SSmallNavOptionWrapper>
            <SSmallNavOptionWrapper>
                <SSmallNavOption
                    variants={navOptionVariants}
                    initial="initial"
                    whileHover="hover"
                    whileTap="tap"
                    onClick={() => navigate('/crypto/games')}
                    onMouseEnter={() => setHint('Games')}
                    onMouseLeave={removeHint}
                >
                    <img alt="Games" src={strategyIcon} />
                </SSmallNavOption>
            </SSmallNavOptionWrapper>
            <SSmallNavOptionWrapper>
                <SSmallNavOption
                    variants={navOptionVariants}
                    initial="initial"
                    whileHover="hover"
                    whileTap="tap"
                    onClick={() => navigate('/chat')}
                    onMouseEnter={() => setHint('Analytics')}
                    onMouseLeave={removeHint}
                >
                    <img alt="Analytics" src={analyticsIcon} />
                </SSmallNavOption>
            </SSmallNavOptionWrapper>
            <SSmallNavOptionWrapper>
                <SSmallNavOption
                    variants={navOptionVariants}
                    initial="initial"
                    whileHover="hover"
                    whileTap="tap"
                    onClick={() => navigate('/chat')}
                    onMouseEnter={() => setHint('Exchange')}
                    onMouseLeave={removeHint}
                >
                    <img alt="Exchange" src={exchangeIcon} />
                </SSmallNavOption>
            </SSmallNavOptionWrapper>
            <SSmallNavOptionWrapper>
                <SSmallNavOption
                    variants={navOptionVariants}
                    initial="initial"
                    whileHover="hover"
                    whileTap="tap"
                    onClick={() => navigate('/chat')}
                    onMouseEnter={() => setHint('Mining')}
                    onMouseLeave={removeHint}
                >
                    <img alt="Mining" src={miningIcon} />
                </SSmallNavOption>
            </SSmallNavOptionWrapper>
            <SSmallNavOptionWrapper>
                <SSmallNavOption
                    variants={navOptionVariants}
                    initial="initial"
                    whileHover="hover"
                    whileTap="tap"
                    onClick={() => navigate('/chat')}
                    onMouseEnter={() => setHint('Connect')}
                    onMouseLeave={removeHint}
                >
                    <img alt="Connect" src={computerIcon} />
                </SSmallNavOption>
            </SSmallNavOptionWrapper>
            <SSmallNavOptionWrapper>
                <SSmallNavOption
                    variants={navOptionVariants}
                    initial="initial"
                    whileHover="hover"
                    whileTap="tap"
                    onClick={() => navigate('/crypto/pump')}
                    onMouseEnter={() => setHint('Pump')}
                    onMouseLeave={removeHint}
                >
                    <img alt="Pump" src={analysisIcon} />
                </SSmallNavOption>
            </SSmallNavOptionWrapper>
        </SNavbarOptions>
    )
}

function Navbar({ dragAreaRef }: INavbar) {
    const { publicAddress } = useAuth()
    const [actionHint, _setActionHint] = useState('')
    const [isMaximized, setIsMaximized] = useState(true)
    const prevIsMaximized = useMyPrevious(isMaximized)
    const [isNavbarHovered, setIsNavbarHovered] = useState(false)
    const [isNavbarHoveredDebounce, setIsNavbarHoveredDebounce] =
        useState(false)
    const [isClosed, setIsClosed] = useState(false)
    const prevIsClosed = useMyPrevious(isClosed)
    const [isDetached, setIsDetached] = useState(false)
    const [navbarAnimState, setNavbarAnimState] = useState('initial')
    const navbarControls = useAnimation()

    // Memos
    const toggleDetached = useCallback(() => {
        setIsDetached((_isDetached) => !_isDetached)
    }, [])

    const toggleMaximize = useCallback(() => {
        setIsMaximized((_isMax) => !_isMax)
    }, [])

    const toggleClose = useCallback(() => {
        setIsClosed((_closed) => !_closed)
    }, [])

    const openNav = useCallback(() => {
        setIsClosed(false)
        setIsMaximized(true)
    }, [])

    // Callbacks
    const removeHint = useDebounceCallback(
        (v: any) => {
            setActionHint('')
        },
        150,
        {}
    )

    const setActionHint = useCallback(
        (hint: string) => {
            _setActionHint(hint)

            if (removeHint) {
                removeHint.cancel()
            }
        },
        [removeHint]
    )

    // Effects
    useEffect(() => {
        if (isNavbarHovered) {
            setIsNavbarHoveredDebounce(true)
        }
    }, [isNavbarHovered])

    useDebounce(
        () => {
            if (!isNavbarHovered && !isDetached) {
                setIsNavbarHoveredDebounce(false)
            }
        },
        500,
        [isNavbarHovered, isDetached]
    )

    useEffect(() => {
        if (prevIsMaximized && !isMaximized) {
            setTimeout(() => {
                navbarControls.start(navbarVariants.initial)
            }, 0)
        }
    }, [prevIsMaximized, isMaximized, navbarControls])

    useEffect(() => {
        if (!navbarControls) return

        if (isClosed && !prevIsClosed) {
            setNavbarAnimState('closed')
            navbarControls.start(navbarVariants.closed)
            return
        } else if (isClosed) {
            return
        }

        if (isDetached) {
            setNavbarAnimState('detached')
            navbarControls.start(navbarVariants.detached)
            return
        }

        if (prevIsMaximized && !isMaximized) {
            setNavbarAnimState('minimized')
            navbarControls.start(navbarVariants.initial)
            return
        }

        if (isNavbarHoveredDebounce) {
            setNavbarAnimState('hover')
            navbarControls.start(navbarVariants.hover)
            return
        } else {
            if (isMaximized) {
                setNavbarAnimState('hover')
                navbarControls.start(navbarVariants.hover)
                return
            } else {
                setNavbarAnimState('initial')
                navbarControls.start(navbarVariants.initial)
                return
            }
        }
    }, [
        prevIsClosed,
        isNavbarHoveredDebounce,
        isDetached,
        isMaximized,
        isClosed,
        navbarControls,
        prevIsMaximized,
    ])

    const actionGroupAnimateState = useMemo(() => {
        if (navbarAnimState === 'detached' || navbarAnimState === 'hover') {
            return 'hover'
        }
        return 'initial'
    }, [navbarAnimState])

    return (
        <>
            <AnimatePresence>
                {isClosed && <OpenNav onClick={openNav} />}
            </AnimatePresence>
            <SNavbar
                variants={navbarVariants}
                animate={navbarControls}
                drag={isDetached}
                dragConstraints={dragAreaRef}
                dragTransition={{ bounceStiffness: 800, bounceDamping: 25 }}
                onHoverStart={() => setIsNavbarHovered(true)}
                onHoverEnd={() => setIsNavbarHovered(false)}
                whileTap={isDetached ? 'tap' : ''}
            >
                <SActionGroup
                    variants={actionGroupVariants}
                    initial="initial"
                    animate={actionGroupAnimateState}
                    whileHover="hover"
                    isDetached={isDetached}
                >
                    <ActionDot
                        className="dot-red"
                        src={closeLogo}
                        alt={'Close'}
                        isDisabled={false}
                        toggle={toggleClose}
                        setHint={setActionHint}
                        removeHint={removeHint}
                    />
                    <ActionDot
                        className="dot-yellow"
                        src={!isMaximized ? maximizeLogo : minimizeLogo}
                        alt={!isMaximized ? 'Maximize' : 'Minimize'}
                        isDisabled={isDetached}
                        toggle={toggleMaximize}
                        setHint={setActionHint}
                        removeHint={removeHint}
                    />
                    <ActionDot
                        className="dot-green"
                        src={!isDetached ? unlockLogo : lockLogo}
                        alt={!isDetached ? 'Detach' : 'Attach'}
                        isDisabled={false}
                        toggle={toggleDetached}
                        setHint={setActionHint}
                        removeHint={removeHint}
                    />

                    <AnimatePresence>
                        {actionHint && (
                            <SActionHint
                                variants={actionHintVariant}
                                initial="initial"
                                animate="animate"
                                exit="exit"
                            >
                                <span>{actionHint}</span>
                            </SActionHint>
                        )}
                    </AnimatePresence>
                </SActionGroup>
                <NavbarOptions
                    isOpen={navbarAnimState === 'hover' || navbarAnimState === 'detached'}
                    publicAddress={publicAddress}
                    setHint={setActionHint}
                    removeHint={removeHint}
                />
            </SNavbar>
            <AnimatePresence>
                {navbarAnimState === 'initial' && <HoverArrowsIcon />}
            </AnimatePresence>
        </>
    )
}

export default Navbar
