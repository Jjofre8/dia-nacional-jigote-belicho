
"use client";

import { Turnstile } from "@marsidev/react-turnstile";

type Props = {
  onVerify: (token: string | null) => void;
};

export default function VerificacionTurnstile({
  onVerify,
}: Props) {
  const siteKey =
    process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;

  if (!siteKey) {
    return (
      <p className="text-red-600">
        Falta configurar Cloudflare Turnstile.
      </p>
    );
  }

  return (
    <div className="my-5">
      <p className="mb-3 text-sm font-semibold">
        Verificación de seguridad
      </p>

      <Turnstile
        siteKey={siteKey}
        options={{ theme: "light" }}
        onSuccess={(token) => onVerify(token)}
        onExpire={() => onVerify(null)}
        onError={() => onVerify(null)}
      />
    </div>
  );
}
