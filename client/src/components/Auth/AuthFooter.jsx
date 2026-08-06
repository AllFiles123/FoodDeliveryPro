import { Link } from "react-router-dom";
import { motion } from "framer-motion";

function AuthFooter({
  text,
  linkText,
  linkTo,
}) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.4 }}
      className="mt-6 text-center"
    >
      <p className="text-sm text-slate-600 dark:text-slate-400">
        {text}{" "}
        <Link
          to={linkTo}
          className="font-semibold text-primary transition-colors duration-300 hover:text-primary"
        >
          {linkText}
        </Link>
      </p>
    </motion.div>
  );
}

export default AuthFooter;