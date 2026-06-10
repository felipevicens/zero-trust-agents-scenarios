import { motion } from "framer-motion";

interface SlideOverlayProps {
  image: string;
}

export function SlideOverlay({ image }: SlideOverlayProps) {
  return (
    <motion.div
      key={image}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
      style={{
        position: "absolute",
        inset: 0,
        background: "rgba(10,10,20,0.97)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 25,
      }}
    >
      <img
        src={image}
        alt=""
        style={{
          maxWidth: "90%",
          maxHeight: "90%",
          objectFit: "contain",
          borderRadius: "8px",
          boxShadow: "0 8px 48px rgba(0,0,0,0.8)",
        }}
      />
    </motion.div>
  );
}
