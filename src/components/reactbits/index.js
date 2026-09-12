/**
 * React Bits Components Index
 * Premium animated components for stunning portfolio effects
 */

export { default as Particles } from './Particles'
export { default as ScrollReveal, ScrollRevealContainer, BlurFade, SplitText } from './ScrollReveal'
export { default as SplashCursor } from './SplashCursor'
export { default as ClickSpark } from './ClickSpark'
export { default as ElectricBorder } from './ElectricBorder'
export { default as StarBorder } from './StarBorder'
export { default as StaggeredMenu } from './StaggeredMenu'
export { default as LampContainer, LampContainer as Lamp } from './Lamp'
export { default as TracingBeam } from './TracingBeam'
export { default as Loader } from './Loader'

// Globe/World intentionally excluded from barrel export to avoid pulling
// Three.js + R3F + drei + three-globe (~2.6 MB) into the main bundle.
// Import directly via: React.lazy(() => import('./components/reactbits/Globe'))
