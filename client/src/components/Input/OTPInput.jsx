import { useRef } from "react";

function OTPInput({ length = 6, value = "", onChange }) {
  const inputsRef = useRef([]);

  const values = value.padEnd(length, " ").split("");

  const handleChange = (index, inputValue) => {
    const digit = inputValue.replace(/\D/g, "").slice(-1);

    const otp = [...values];
    otp[index] = digit || " ";

    onChange(otp.join("").trimEnd());

    if (digit && index < length - 1) {
      inputsRef.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace") {
      if (!values[index].trim() && index > 0) {
        inputsRef.current[index - 1]?.focus();
      }
    }

    if (e.key === "ArrowLeft" && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }

    if (e.key === "ArrowRight" && index < length - 1) {
      inputsRef.current[index + 1]?.focus();
    }
  };

  return (
    <div className="flex justify-center gap-3">
      {Array.from({ length }).map((_, index) => (
        <input
          key={index}
          ref={(el) => (inputsRef.current[index] = el)}
          type="text"
          inputMode="numeric"
          maxLength={1}
          value={values[index] === " " ? "" : values[index]}
          onChange={(e) => handleChange(index, e.target.value)}
          onKeyDown={(e) => handleKeyDown(index, e)}
          className="
            h-14
            w-12
            rounded-2xl
            border
            border-slate-300
            bg-white/70
            dark:bg-slate-900/70
            text-center
            text-xl
            font-bold
            text-slate-800
            dark:text-white
            outline-none
            backdrop-blur-xl
            transition-all
            duration-300
            focus:border-primary
            focus:ring-2
            focus:ring-primary/30
          "
        />
      ))}
    </div>
  );
}

export default OTPInput;