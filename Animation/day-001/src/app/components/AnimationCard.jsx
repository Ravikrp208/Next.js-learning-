"use client";

import { motion } from "framer-motion";

const cards = [
  {
    title: "Ravi Kumar Pandit",
    role: "Frontend Developer",
    gradient: "from-blue-500 to-cyan-400",
  },
  {
    title: "React Developer",
    role: "UI/UX Enthusiast",
    gradient: "from-purple-500 to-pink-500",
  },
  {
    title: "Next.js Expert",
    role: "Full Stack Developer",
    gradient: "from-green-500 to-emerald-400",
  },
  {
    title: "JavaScript",
    role: "Problem Solver",
    gradient: "from-orange-500 to-yellow-400",
  },
  {
    title: "Creative Coder",
    role: "Motion Designer",
    gradient: "from-rose-500 to-red-500",
  },
];

export default function AnimatedCard() {
  return (
    <div className="min-h-screen bg-[#030014] flex flex-col items-center justify-center p-8 relative overflow-hidden">
      {/* Ambient spotlights */}
      <div className="absolute top-1/4 left-1/4 w-[400px] h-[400px] bg-blue-500/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-purple-500/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-indigo-500/5 rounded-full blur-[130px] pointer-events-none" />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 z-10">
        {cards.map((card, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 80 }}
            animate={{
              opacity: 1,
              y: [0, -10, 0],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              delay: index * 0.3,
            }}
            whileHover={{
              scale: 1.08,
              rotate: 3,
              y: -15,
            }}
            whileTap={{ scale: 0.95 }}
            className={`w-80 p-6 rounded-3xl bg-gradient-to-br ${card.gradient}
              shadow-2xl cursor-pointer text-white
              backdrop-blur-lg border border-white/20`}
          >
            <h2 className="text-2xl font-bold mb-3">
              {card.title}
            </h2>

            <p className="text-white/90">
              {card.role}
            </p>

            <div className="mt-6 h-1 rounded-full bg-white/30 overflow-hidden">
              <motion.div
                className="h-full bg-white"
                initial={{ width: "0%" }}
                animate={{ width: "100%" }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                }}
              />
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}