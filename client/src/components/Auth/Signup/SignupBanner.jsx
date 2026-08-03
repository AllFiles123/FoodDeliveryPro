import { motion } from "framer-motion";
import { UtensilsCrossed, ShieldCheck, Truck, Star } from "lucide-react";

const features = [
  {
    icon: <Truck size={20} />,
    title: "Fast Delivery",
    description: "Fresh food delivered quickly to your doorstep.",
  },
  {
    icon: <ShieldCheck size={20} />,
    title: "100% Secure",
    description: "Safe login and protected customer information.",
  },
  {
    icon: <Star size={20} />,
    title: "Top Rated",
    description: "Discover restaurants loved by thousands of customers.",
  },
];

function SignupBanner() {
  return (
    <motion.section
      initial={{ opacity: 0, x: -40 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6 }}
      className="hidden lg:flex flex-col justify-center"
    >
      <div className="max-w-lg">
        <div className="inline-flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-r from-orange-500 to-amber-400 shadow-2xl shadow-orange-500/30">
          <UtensilsCrossed className="text-white" size={38} />
        </div>

        <h1 className="mt-8 text-5xl font-bold leading-tight text-white">
          Welcome to
          <span className="block bg-gradient-to-r from-orange-400 to-yellow-300 bg-clip-text text-transparent">
            Food Delivery Pro
          </span>
        </h1>

        <p className="mt-5 text-lg leading-8 text-slate-300">
          Discover your favourite restaurants, order delicious meals and
          enjoy a premium food delivery experience with a modern interface.
        </p>

        <div className="mt-10 space-y-5">
          {features.map((item) => (
            <div
              key={item.title}
              className="flex items-start gap-4 rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-xl"
            >
              <div className="rounded-xl bg-orange-500/20 p-3 text-orange-400">
                {item.icon}
              </div>

              <div>
                <h3 className="font-semibold text-white">
                  {item.title}
                </h3>

                <p className="mt-1 text-sm text-slate-400">
                  {item.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </motion.section>
  );
}

export default SignupBanner;