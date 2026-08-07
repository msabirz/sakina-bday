"use client";

import { motion } from "framer-motion";
import { Heart } from "lucide-react";

export function LoadingScreen() {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-background">
      <motion.div
        animate={{ opacity: [0.3, 1, 0.3] }}
        transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
      >
        <Heart className="size-5 fill-rose/60 text-rose/60" />
      </motion.div>
    </div>
  );
}
