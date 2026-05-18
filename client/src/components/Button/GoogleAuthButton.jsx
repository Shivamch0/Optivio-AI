import { useEffect, useRef, useState } from "react";
import { renderGoogleButton } from "../../utils/googleAuth.js";

function GoogleAuthButton({ onCredential, onError }) {
  const buttonRef = useRef(null);
  const [message, setMessage] = useState("");

  useEffect(() => {
    let isMounted = true;

    Promise.resolve()
      .then(() =>
        renderGoogleButton({
          container: buttonRef.current,
          onCredential,
          onError,
        }),
      )
      .catch((error) => {
        if (isMounted) {
          setMessage(error.message);
        }
        onError?.(error);
      });

    return () => {
      isMounted = false;
    };
  }, [onCredential, onError]);

  return (
    <div>
      <div ref={buttonRef} className="min-h-11 w-full" />
      {message && <p className="mt-2 text-xs font-semibold text-red-600">{message}</p>}
    </div>
  );
}

export default GoogleAuthButton;
