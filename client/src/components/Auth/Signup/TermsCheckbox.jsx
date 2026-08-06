import { Link } from "react-router-dom";

function TermsCheckbox({
  checked,
  onChange,
  error,
}) {
  return (
    <div className="w-full">
      <label className="flex items-start gap-3 cursor-pointer">
        <input
          type="checkbox"
          checked={checked}
          onChange={onChange}
          className="
            mt-1
            h-5
            w-5
            rounded
            accent-primary
            cursor-pointer
          "
        />

        <span className="text-sm leading-6 text-slate-600 dark:text-slate-300">
          I agree to the{" "}
          <Link
            to="/terms"
            className="font-semibold text-primary hover:text-primary"
          >
            Terms & Conditions
          </Link>{" "}
          and{" "}
          <Link
            to="/privacy"
            className="font-semibold text-primary hover:text-primary"
          >
            Privacy Policy
          </Link>
          .
        </span>
      </label>

      {error && (
        <p className="mt-2 text-sm text-red-500">
          {error}
        </p>
      )}
    </div>
  );
}

export default TermsCheckbox;