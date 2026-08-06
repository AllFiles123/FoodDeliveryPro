import Ghost from "./Ghost";
import { useLoginAnimation } from "../../context/LoginAnimationContext";

export default function LoginAnimation() {
  const {
    coverEyes,
    sad,
    success,
  } = useLoginAnimation();

  return (
    <div className="flex items-center justify-center py-8">
      <Ghost
        coverEyes={coverEyes}
        sad={sad}
        success={success}
      />
    </div>
  );
}
