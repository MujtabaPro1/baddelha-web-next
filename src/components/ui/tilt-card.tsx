 "use client"
 
 import { motion } from "motion/react"
 import { useRef, useState } from "react"
 
 interface TiltCardProps {
   children: React.ReactNode
   maxRotate?: number
   scaleOnHover?: number
   className?: string
 }
 
 const TiltCard: React.FC<TiltCardProps> = ({
   children,
   maxRotate = 10,
   scaleOnHover = 1.02,
   className,
 }) => {
   const ref = useRef<HTMLDivElement>(null)
   const [hover, setHover] = useState(false)
   const [rx, setRx] = useState(0)
   const [ry, setRy] = useState(0)
 
   const handleMove = (e: React.MouseEvent<HTMLDivElement>) => {
     const el = ref.current
     if (!el) return
     const rect = el.getBoundingClientRect()
     const x = e.clientX - rect.left
     const y = e.clientY - rect.top
     const rY = ((x / rect.width) - 0.5) * maxRotate
     const rX = ((y / rect.height) - 0.5) * -maxRotate
     setRy(rY)
     setRx(rX)
   }
 
   const reset = () => {
     setHover(false)
     setRx(0)
     setRy(0)
   }
 
   return (
     <div style={{ perspective: 1000 }} className={className}>
       <motion.div
         ref={ref}
         className="card-3d"
         onMouseEnter={() => setHover(true)}
         onMouseMove={handleMove}
         onMouseLeave={reset}
         animate={{ rotateX: rx, rotateY: ry, scale: hover ? scaleOnHover : 1 }}
         transition={{ type: "spring", stiffness: 220, damping: 18 }}
       >
         {children}
       </motion.div>
     </div>
   )
 }
 
 export default TiltCard
