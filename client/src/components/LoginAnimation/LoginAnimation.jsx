import Ghost from "./Ghost";
import { useLoginAnimation } from "../../context/LoginAnimationContext";

export default function LoginAnimation() {
  const {
    coverEyes,
    sad,
    success,
  } = useLoginAnimation();

  return (
    <div className="mb-6 flex items-center justify-center overflow-hidden">
      <Ghost
        coverEyes={coverEyes}
        sad={sad}
        success={success}
      />
    </div>
  );
}
