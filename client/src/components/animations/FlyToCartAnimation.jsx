import { AnimatePresence, motion } from "framer-motion";

export default function FlyToCartAnimation({
  show,
  image,
  start
}){

  if(!show || !image) return null;

  return (

    <AnimatePresence>

      <motion.img

        src={image}

        initial={{
          position:"fixed",
          left:start.x,
          top:start.y,
          width:120,
          height:120,
          scale:1,
          opacity:1,
          rotate:0,
          zIndex:9999,
          boxShadow:"0 15px 35px rgba(0,0,0,0.25)"
        }}

        animate={{

          left:[
            start.x,
            window.innerWidth*0.65,
            window.innerWidth-45
          ],

          top:[
            start.y,
            window.innerHeight*0.55,
            window.innerHeight-90
          ],

          width:[
            120,
            95,
            42
          ],

          height:[
            120,
            95,
            42
          ],

          scale:[
            1,
            1.15,
            0.45
          ],

          rotate:[
            0,
            180,
            360
          ],

          opacity:[
            1,
            1,
            0.25
          ]

        }}

        transition={{
          duration:1,
          ease:"easeInOut"
        }}

        className="pointer-events-none rounded-full object-cover"

      />

    </AnimatePresence>

  );

}
