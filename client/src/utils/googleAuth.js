const googleScriptSrc = "https://accounts.google.com/gsi/client";

let googleScriptPromise;

const loadGoogleScript = () => {
  if (window.google?.accounts?.id) {
    return Promise.resolve();
  }

  if (!googleScriptPromise) {
    googleScriptPromise = new Promise((resolve, reject) => {
      const existingScript = document.querySelector(`script[src="${googleScriptSrc}"]`);

      if (existingScript) {
        existingScript.addEventListener("load", resolve, { once: true });
        existingScript.addEventListener("error", reject, { once: true });
        return;
      }

      const script = document.createElement("script");
      script.src = googleScriptSrc;
      script.async = true;
      script.defer = true;
      script.onload = resolve;
      script.onerror = reject;
      document.head.appendChild(script);
    });
  }

  return googleScriptPromise;
};

export const renderGoogleButton = async ({ container, onCredential, onError }) => {
  const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

  if (!clientId) {
    throw new Error("Google login is not configured. Add VITE_GOOGLE_CLIENT_ID in client/.env.");
  }

  await loadGoogleScript();

  window.google.accounts.id.initialize({
    client_id: clientId,
    callback: (response) => {
      if (response?.credential) {
        onCredential(response.credential);
      } else {
        onError?.(new Error("Google did not return an ID token."));
      }
    },
  });

  window.google.accounts.id.renderButton(container, {
    theme: "outline",
    size: "large",
    text: "continue_with",
    shape: "rectangular",
    width: container.clientWidth || 360,
  });
};
