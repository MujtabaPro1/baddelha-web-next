 "use client"
 
 import { motion } from "motion/react"
 import { useEffect, useRef, useState } from "react"
 
 interface RevealOnScrollProps {
   children: React.ReactNode
   className?: string
   delay?: number
   distance?: number
   direction?: "up" | "down" | "left" | "right"
   threshold?: number
   rootMargin?: string
 }
 
 const RevealOnScroll: React.FC<RevealOnScrollProps> = ({
   children,
   className,
   delay = 0,
   distance = 24,
   direction = "up",
   threshold = 0.15,
   rootMargin = "0px",
 }) => {
   const [inView, setInView] = useState(false)
   const ref = useRef<HTMLDivElement>(null)
 
   useEffect(() => {
     if (!ref.current) return
     const observer = new IntersectionObserver(
       ([entry]) => {
         if (entry.isIntersecting) {
           setInView(true)
           observer.unobserve(ref.current as Element)
         }
       },
       { threshold, rootMargin }
     )
     observer.observe(ref.current)
     return () => observer.disconnect()
   }, [threshold, rootMargin])
 
   const initial = {
     opacity: 0,
     x: direction === "left" ? -distance : direction === "right" ? distance : 0,
     y: direction === "up" ? distance : direction === "down" ? -distance : 0,
   }
 
   const animate = {
     opacity: 1,
     x: 0,
     y: 0,
     transition: { duration: 0.6, delay: delay / 1000, ease: [0.22, 1, 0.36, 1] },
   }
 
   return (
     <motion.div ref={ref} className={className} initial={initial} animate={inView ? animate : initial}>
       {children}
     </motion.div>
   )
 }
 
 export default RevealOnScroll
