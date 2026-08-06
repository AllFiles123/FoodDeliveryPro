import { Link } from "react-router-dom";
import PrimaryButton from "../../Button/PrimaryButton";

function SignupActions({ loading = false }) {
  return (
    <div className="space-y-5">
      <PrimaryButton
        type="submit"
        disabled={loading}
      >
        {loading ? "Creating Account..." : "Create Account"}
      </PrimaryButton>

      <div className="flex items-center gap-3">
        <div className="h-px flex-1 bg-slate-300 dark:bg-slate-700" />

        <span className="text-xs uppercase tracking-widest text-slate-400">
          OR
        </span>

        <div className="h-px flex-1 bg-slate-300 dark:bg-slate-700" />
      </div>

      <p className="text-center text-sm text-slate-600 dark:text-slate-400">
        Already have an account?{" "}
        <Link
          to="/login"
          className="font-semibold text-primary transition-colors hover:text-primary"
        >
          Login
        </Link>
      </p>
    </div>
  );
}

export default SignupActions;