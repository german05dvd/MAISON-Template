import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useMemo, useRef, useState } from "react";
import { z } from "zod";
import { ArrowLeft, Upload, X, Loader2, CreditCard, Wallet, Building2 } from "lucide-react";
import { SiteHeader } from "@/components/site-header";
import { cn } from "@/lib/utils";
import { useCartStore, useCartItems, useCartTotal } from "@/stores/cart-store";

export const Route = createFileRoute("/checkout")({
  head: () => ({
    meta: [
      { title: "Checkout — Maison" },
      { name: "description", content: "Finaliza tu pedido editorial. Tarjeta, PayPal o transferencia directa." },
      { property: "og:title", content: "Checkout — Maison" },
      { property: "og:description", content: "Finaliza tu pedido editorial. Tarjeta, PayPal o transferencia directa." },
    ],
  }),
  component: CheckoutPage,
});

// ───────────────────────── Schemas ─────────────────────────

const billingSchema = z.object({
  email: z.string().trim().email("Email inválido").max(255),
  fullName: z.string().trim().min(2, "Mínimo 2 caracteres").max(120),
  phone: z
    .string()
    .trim()
    .min(6, "Teléfono inválido")
    .max(20)
    .regex(/^[+\d][\d\s().-]{5,}$/, "Formato inválido"),
  address: z.string().trim().min(3, "Mínimo 3 caracteres").max(200),
  city: z.string().trim().min(2).max(80),
  postalCode: z.string().trim().min(3).max(20),
  country: z.string().trim().min(2).max(80),
});
type Billing = z.infer<typeof billingSchema>;
type BillingErrors = Partial<Record<keyof Billing, string>>;

const cardSchema = z.object({
  number: z.string().regex(/^\d{13,19}$/, "Número inválido"),
  expiry: z.string().regex(/^(0[1-9]|1[0-2])\/\d{2}$/, "MM/AA"),
  cvc: z.string().regex(/^\d{3,4}$/, "CVC inválido"),
});

const zelleSchema = z.object({
  reference: z.string().trim().min(4).max(60),
});

const SHIPPING_COST = 25;

const formatPrice = (n: number) => `€ ${n.toLocaleString("es-ES")}`;

// ───────────────────────── Page ─────────────────────────

type Method = "card" | "paypal" | "zelle";

const initialBilling: Billing = {
  email: "", fullName: "", phone: "", address: "", city: "", postalCode: "", country: "",
};

function CheckoutPage() {
  const navigate = useNavigate();
  const items = useCartItems();
  const subtotal = useCartTotal();
  const clearCart = useCartStore((s) => s.clear);

  const [billing, setBilling] = useState<Billing>(initialBilling);
  const [billingErrors, setBillingErrors] = useState<BillingErrors>({});
  const [touched, setTouched] = useState<Record<keyof Billing, boolean>>({
    email: false, fullName: false, phone: false, address: false, city: false, postalCode: false, country: false,
  });
  const [submitAttempted, setSubmitAttempted] = useState(false);

  const [method, setMethod] = useState<Method>("card");
  const [card, setCard] = useState({ number: "", expiry: "", cvc: "" });
  const [zelleRef, setZelleRef] = useState("");
  const [zelleFile, setZelleFile] = useState<File | null>(null);
  const [zelleFileError, setZelleFileError] = useState<string | null>(null);
  const [paypalReady, setPaypalReady] = useState(false);

  const [processing, setProcessing] = useState(false);

  const total = subtotal + SHIPPING_COST;

  // Validate billing on every change
  const billingResult = useMemo(() => billingSchema.safeParse(billing), [billing]);
  const billingValid = billingResult.success;

  const errorsToShow: BillingErrors = useMemo(() => {
    if (billingResult.success) return {};
    const errs: BillingErrors = {};
    for (const issue of billingResult.error.issues) {
      const k = issue.path[0] as keyof Billing;
      if (!errs[k]) errs[k] = issue.message;
    }
    return errs;
  }, [billingResult]);

  const paymentValid = useMemo(() => {
    if (method === "card") {
      return cardSchema.safeParse({
        number: card.number.replace(/\s+/g, ""),
        expiry: card.expiry,
        cvc: card.cvc,
      }).success;
    }
    if (method === "zelle") {
      return zelleSchema.safeParse({ reference: zelleRef }).success && !!zelleFile;
    }
    return paypalReady;
  }, [method, card, zelleRef, zelleFile, paypalReady]);

  const canSubmit = billingValid && paymentValid && !processing && items.length > 0;

  const showError = (k: keyof Billing) =>
    (touched[k] || submitAttempted) ? errorsToShow[k] : undefined;

  const handleBlur = (k: keyof Billing) => () =>
    setTouched((t) => ({ ...t, [k]: true }));

  const handleSubmit = async () => {
    setSubmitAttempted(true);
    setBillingErrors(errorsToShow);
    if (!billingValid || !paymentValid || items.length === 0) return;

    setProcessing(true);
    // Simulación de procesamiento
    await new Promise((r) => setTimeout(r, 2000));
    clearCart();
    setProcessing(false);
    navigate({ to: "/order-confirmed" });
  };

  // Si el carrito está vacío, mostrar mensaje
  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-background text-foreground">
        <SiteHeader />
        <main className="mx-auto flex min-h-[calc(100vh-120px)] max-w-7xl flex-col items-center justify-center px-6 py-24 text-center">
          <h1 className="font-serif text-4xl leading-[1.05] md:text-6xl">Checkout</h1>
          <p className="mt-6 max-w-md text-sm text-muted-foreground">
            Tu carrito está vacío. Añade productos para continuar con tu pedido.
          </p>
          <Link
            to="/"
            className="mt-10 inline-flex items-center justify-center bg-black px-10 py-4 text-[11px] uppercase tracking-[0.28em] text-background transition-opacity duration-300 hover:opacity-80"
          >
            Volver a la tienda
          </Link>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteHeader />

      <main className="mx-auto max-w-7xl px-6 py-12 md:py-16">
        <div className="mb-10 flex items-center justify-between">
          <Link to="/" className="inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.22em] hover:opacity-60">
            <ArrowLeft strokeWidth={1} className="h-4 w-4" /> Volver
          </Link>
          <span className="text-[11px] uppercase tracking-[0.28em] text-muted-foreground">Paso 02 — Pago</span>
        </div>

        <h1 className="font-serif text-4xl leading-[1.05] md:text-6xl">Checkout</h1>
        <p className="mt-3 max-w-md text-sm text-muted-foreground">
          Completa tu información para finalizar el pedido. Procesamos pagos de manera segura.
        </p>

        <div className="mt-14 grid gap-16 lg:grid-cols-2 lg:gap-20">
          {/* LEFT */}
          <section className="flex flex-col gap-12">
            <BillingForm
              value={billing}
              onChange={setBilling}
              errors={{
                email: showError("email"),
                fullName: showError("fullName"),
                phone: showError("phone"),
                address: showError("address"),
                city: showError("city"),
                postalCode: showError("postalCode"),
                country: showError("country"),
              }}
              onBlur={handleBlur}
            />

            <div>
              <SectionTitle index="02" title="Método de pago" />
              <MethodSelector method={method} setMethod={setMethod} />

              <div className="mt-8">
                {method === "card" && <CardForm value={card} onChange={setCard} />}
                {method === "paypal" && <PayPalPanel ready={paypalReady} setReady={setPaypalReady} />}
                {method === "zelle" && (
                  <ZellePanel
                    reference={zelleRef}
                    setReference={setZelleRef}
                    file={zelleFile}
                    setFile={(f) => { setZelleFile(f); setZelleFileError(null); }}
                    fileError={zelleFileError}
                    setFileError={setZelleFileError}
                    submitAttempted={submitAttempted}
                  />
                )}
              </div>
            </div>
          </section>

          {/* RIGHT */}
          <aside className="lg:sticky lg:top-28 lg:self-start">
            <SectionTitle index="03" title="Resumen del pedido" />
            <div className="mt-6 flex flex-col divide-y divide-border/60">
              {items.map((it) => (
                <div key={it.id} className="flex items-baseline justify-between py-4">
                  <div className="flex flex-col">
                    <span className="font-serif text-base">{it.name}</span>
                    <span className="mt-0.5 text-xs text-muted-foreground">Cantidad · {it.quantity}</span>
                  </div>
                  <span className="text-sm tabular-nums">{formatPrice(it.priceNum * it.quantity)}</span>
                </div>
              ))}
            </div>

            <div className="mt-6 flex flex-col gap-2 border-t border-border/60 pt-6 text-sm">
              <Row label="Subtotal" value={formatPrice(subtotal)} />
              <Row label="Envío" value={formatPrice(SHIPPING_COST)} />
              <div className="mt-3 flex items-baseline justify-between border-t border-foreground/80 pt-4">
                <span className="font-serif text-lg">Total</span>
                <span className="font-serif text-xl tabular-nums">{formatPrice(total)}</span>
              </div>
            </div>

            <button
              type="button"
              onClick={handleSubmit}
              disabled={!canSubmit}
              className={cn(
                "mt-10 flex w-full items-center justify-center gap-3 bg-black py-4 text-center text-[11px] uppercase tracking-[0.28em] text-background transition-all duration-300 ease-in-out",
                !canSubmit && "cursor-not-allowed opacity-40",
              )}
            >
              {processing ? (
                <>
                  <Loader2 strokeWidth={1.5} className="h-4 w-4 animate-spin" />
                  Procesando…
                </>
              ) : (
                <>Finalizar pedido · {formatPrice(total)}</>
              )}
            </button>
            {submitAttempted && !billingValid && (
              <p className="mt-3 text-xs text-destructive">
                Revisa los campos marcados en rojo para continuar.
              </p>
            )}
            <p className="mt-3 text-[11px] text-muted-foreground">
              Al confirmar aceptas los términos y la política de privacidad.
            </p>
          </aside>
        </div>
      </main>
    </div>
  );
}

// ───────────────────────── Pieces ─────────────────────────

function SectionTitle({ index, title }: { index: string; title: string }) {
  return (
    <div className="flex items-baseline gap-4">
      <span className="text-[11px] uppercase tracking-[0.28em] text-muted-foreground">{index}</span>
      <h2 className="font-serif text-2xl md:text-3xl">{title}</h2>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-baseline justify-between">
      <span className="text-muted-foreground">{label}</span>
      <span className="tabular-nums">{value}</span>
    </div>
  );
}

function Field({
  label, value, onChange, onBlur, error, type = "text", placeholder, maxLength, autoComplete,
}: {
  label: string; value: string; onChange: (v: string) => void; onBlur?: () => void;
  error?: string; type?: string; placeholder?: string; maxLength?: number; autoComplete?: string;
}) {
  const hasError = !!error;
  return (
    <label className="flex flex-col gap-2">
      <span className="text-[10px] uppercase tracking-[0.24em] text-muted-foreground">{label}</span>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onBlur={onBlur}
        placeholder={placeholder}
        maxLength={maxLength}
        autoComplete={autoComplete}
        aria-invalid={hasError}
        className={cn(
          "w-full border-0 border-b bg-transparent pb-2 text-base text-foreground outline-none transition-colors duration-300 ease-in-out placeholder:text-muted-foreground/50",
          hasError ? "border-destructive focus:border-destructive" : "border-border focus:border-foreground",
        )}
      />
      {hasError && <span className="text-[11px] text-destructive">{error}</span>}
    </label>
  );
}

function BillingForm({
  value, onChange, errors, onBlur,
}: {
  value: Billing; onChange: (v: Billing) => void;
  errors: BillingErrors; onBlur: (k: keyof Billing) => () => void;
}) {
  const set = (k: keyof Billing) => (v: string) => onChange({ ...value, [k]: v });
  return (
    <div>
      <SectionTitle index="01" title="Envío y facturación" />
      <div className="mt-8 grid grid-cols-1 gap-7 md:grid-cols-2">
        <div className="md:col-span-2">
          <Field label="Correo electrónico" type="email" value={value.email} onChange={set("email")} onBlur={onBlur("email")} error={errors.email} placeholder="tu@correo.com" autoComplete="email" maxLength={255} />
        </div>
        <div className="md:col-span-2">
          <Field label="Nombre completo" value={value.fullName} onChange={set("fullName")} onBlur={onBlur("fullName")} error={errors.fullName} placeholder="Nombre y apellidos" autoComplete="name" maxLength={120} />
        </div>
        <div className="md:col-span-2">
          <Field label="Teléfono" type="tel" value={value.phone} onChange={set("phone")} onBlur={onBlur("phone")} error={errors.phone} placeholder="+34 600 000 000" autoComplete="tel" maxLength={20} />
        </div>
        <div className="md:col-span-2">
          <Field label="Dirección" value={value.address} onChange={set("address")} onBlur={onBlur("address")} error={errors.address} placeholder="Calle, número, piso" autoComplete="street-address" maxLength={200} />
        </div>
        <Field label="Ciudad" value={value.city} onChange={set("city")} onBlur={onBlur("city")} error={errors.city} autoComplete="address-level2" maxLength={80} />
        <Field label="Código postal" value={value.postalCode} onChange={set("postalCode")} onBlur={onBlur("postalCode")} error={errors.postalCode} autoComplete="postal-code" maxLength={20} />
        <div className="md:col-span-2">
          <Field label="País" value={value.country} onChange={set("country")} onBlur={onBlur("country")} error={errors.country} autoComplete="country-name" maxLength={80} />
        </div>
      </div>
    </div>
  );
}

function MethodSelector({ method, setMethod }: { method: Method; setMethod: (m: Method) => void }) {
  const options: { id: Method; label: string; sub: string; Icon: typeof CreditCard }[] = [
    { id: "card", label: "Tarjeta bancaria", sub: "Visa · Mastercard · Amex", Icon: CreditCard },
    { id: "paypal", label: "PayPal", sub: "Pago seguro", Icon: Wallet },
    { id: "zelle", label: "Transferencia directa", sub: "Zelle · USD", Icon: Building2 },
  ];
  return (
    <div
      role="tablist"
      aria-label="Método de pago"
      className="mt-6 grid grid-cols-1 gap-px overflow-hidden border border-border md:grid-cols-3"
    >
      {options.map(({ id, label, sub, Icon }) => {
        const active = method === id;
        return (
          <button
            key={id}
            type="button"
            role="tab"
            aria-selected={active}
            onClick={() => setMethod(id)}
            className={cn(
              "flex items-center gap-3 bg-background px-5 py-4 text-left transition-all duration-300 ease-in-out hover:opacity-80",
              active && "bg-foreground text-background hover:opacity-100",
            )}
          >
            <Icon strokeWidth={1} className="h-5 w-5 shrink-0" />
            <div className="flex flex-col">
              <span className="text-[11px] uppercase tracking-[0.22em]">{label}</span>
              <span className={cn("text-[10px]", active ? "text-background/70" : "text-muted-foreground")}>{sub}</span>
            </div>
          </button>
        );
      })}
    </div>
  );
}

// ─── Card ───

function formatCardNumber(v: string) {
  const digits = v.replace(/\D/g, "").slice(0, 19);
  return digits.replace(/(.{4})/g, "$1 ").trim();
}
function formatExpiry(v: string) {
  const d = v.replace(/\D/g, "").slice(0, 4);
  if (d.length < 3) return d;
  return `${d.slice(0, 2)}/${d.slice(2)}`;
}

function CardForm({
  value, onChange,
}: { value: { number: string; expiry: string; cvc: string }; onChange: (v: { number: string; expiry: string; cvc: string }) => void }) {
  const numberDigits = value.number.replace(/\s/g, "");
  const numberOk = /^\d{13,19}$/.test(numberDigits);
  const expiryOk = /^(0[1-9]|1[0-2])\/\d{2}$/.test(value.expiry);
  const cvcOk = /^\d{3,4}$/.test(value.cvc);

  const fieldClass = (touched: boolean, ok: boolean) =>
    cn(
      "w-full border-0 border-b bg-transparent pb-2 font-mono text-base tracking-[0.08em] outline-none transition-colors duration-300 ease-in-out placeholder:text-muted-foreground/50",
      !touched && "border-border focus:border-foreground",
      touched && ok && "border-foreground",
      touched && !ok && "border-destructive",
    );

  return (
    <div role="tabpanel" className="border border-border p-6">
      <div className="mb-5 flex items-center justify-between">
        <span className="text-[10px] uppercase tracking-[0.24em] text-muted-foreground">Datos de la tarjeta</span>
        <span className="text-[10px] uppercase tracking-[0.24em] text-muted-foreground">Conexión segura</span>
      </div>

      <label className="flex flex-col gap-2">
        <span className="text-[10px] uppercase tracking-[0.24em] text-muted-foreground">Número</span>
        <input
          inputMode="numeric"
          autoComplete="cc-number"
          placeholder="4242 4242 4242 4242"
          value={value.number}
          onChange={(e) => onChange({ ...value, number: formatCardNumber(e.target.value) })}
          className={fieldClass(value.number.length > 0, numberOk)}
        />
      </label>

      <div className="mt-6 grid grid-cols-2 gap-6">
        <label className="flex flex-col gap-2">
          <span className="text-[10px] uppercase tracking-[0.24em] text-muted-foreground">Expira</span>
          <input
            inputMode="numeric"
            autoComplete="cc-exp"
            placeholder="MM/AA"
            value={value.expiry}
            onChange={(e) => onChange({ ...value, expiry: formatExpiry(e.target.value) })}
            className={fieldClass(value.expiry.length > 0, expiryOk)}
          />
        </label>
        <label className="flex flex-col gap-2">
          <span className="text-[10px] uppercase tracking-[0.24em] text-muted-foreground">CVC</span>
          <input
            inputMode="numeric"
            autoComplete="cc-csc"
            placeholder="123"
            maxLength={4}
            value={value.cvc}
            onChange={(e) => onChange({ ...value, cvc: e.target.value.replace(/\D/g, "").slice(0, 4) })}
            className={fieldClass(value.cvc.length > 0, cvcOk)}
          />
        </label>
      </div>
    </div>
  );
}

// ─── PayPal (Simulado) ───

function PayPalPanel({ ready, setReady }: { ready: boolean; setReady: (v: boolean) => void }) {
  return (
    <div role="tabpanel" className="flex min-h-[180px] flex-col items-center justify-center gap-4 border border-border p-8">
      <Wallet strokeWidth={1} className="h-6 w-6 text-foreground/70" />
      <p className="text-[11px] uppercase tracking-[0.24em] text-muted-foreground">
        Serás redirigido a PayPal para completar el pago
      </p>
      <label className="flex cursor-pointer items-center gap-2 text-xs text-foreground">
        <input
          type="checkbox"
          checked={ready}
          onChange={(e) => setReady(e.target.checked)}
          className="h-3.5 w-3.5 accent-foreground"
        />
        Confirmo que deseo pagar con PayPal
      </label>
    </div>
  );
}

// ─── Zelle (Simulado) ───

const ALLOWED_TYPES = ["image/jpeg", "image/png"];
const MAX_SIZE = 5 * 1024 * 1024;

function ZellePanel({
  reference, setReference, file, setFile, fileError, setFileError, submitAttempted,
}: {
  reference: string;
  setReference: (v: string) => void;
  file: File | null;
  setFile: (f: File | null) => void;
  fileError: string | null;
  setFileError: (e: string | null) => void;
  submitAttempted: boolean;
}) {
  const [dragOver, setDragOver] = useState(false);
  const [refTouched, setRefTouched] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = (f: File | undefined) => {
    if (!f) return;
    if (!ALLOWED_TYPES.includes(f.type)) {
      setFileError("Solo archivos .jpg o .png");
      return;
    }
    if (f.size > MAX_SIZE) {
      setFileError("Tamaño máximo 5MB");
      return;
    }
    setFile(f);
  };

  const refInvalid = (refTouched || submitAttempted) && reference.trim().length < 4;
  const fileMissing = submitAttempted && !file;

  return (
    <div role="tabpanel" className="flex flex-col gap-6 border border-border p-6">
      <div className="flex flex-col gap-3">
        <span className="text-[10px] uppercase tracking-[0.24em] text-muted-foreground">Datos para la transferencia</span>
        <dl className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div>
            <dt className="text-[10px] uppercase tracking-[0.22em] text-muted-foreground">Correo Zelle</dt>
            <dd className="font-serif text-lg">pagos@maison.studio</dd>
          </div>
          <div>
            <dt className="text-[10px] uppercase tracking-[0.22em] text-muted-foreground">Titular</dt>
            <dd className="font-serif text-lg">Maison Editorial LLC</dd>
          </div>
        </dl>
        <p className="text-xs text-muted-foreground">
          Realiza la transferencia por el monto exacto. Tu pedido queda reservado por 24 horas.
        </p>
      </div>

      <label className="flex flex-col gap-2">
        <span className="text-[10px] uppercase tracking-[0.24em] text-muted-foreground">
          Número de referencia <span className="text-foreground">*</span>
        </span>
        <input
          value={reference}
          onChange={(e) => setReference(e.target.value.slice(0, 60))}
          onBlur={() => setRefTouched(true)}
          placeholder="ID de transacción"
          aria-invalid={refInvalid}
          className={cn(
            "w-full border-0 border-b bg-transparent pb-2 font-mono text-base tracking-[0.08em] outline-none transition-colors duration-300 ease-in-out placeholder:text-muted-foreground/50",
            refInvalid ? "border-destructive focus:border-destructive" : "border-border focus:border-foreground",
          )}
        />
        {refInvalid && <span className="text-[11px] text-destructive">Mínimo 4 caracteres</span>}
      </label>

      <div>
        <span className="mb-2 block text-[10px] uppercase tracking-[0.24em] text-muted-foreground">
          Comprobante de transferencia <span className="text-foreground">*</span>
        </span>
        <div
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={(e) => {
            e.preventDefault();
            setDragOver(false);
            handleFile(e.dataTransfer.files?.[0]);
          }}
          onClick={() => inputRef.current?.click()}
          className={cn(
            "flex cursor-pointer flex-col items-center justify-center gap-2 border border-dashed py-10 text-center transition-all duration-300 ease-in-out",
            dragOver && "border-foreground bg-muted/40",
            !dragOver && fileMissing && "border-destructive",
            !dragOver && !fileMissing && "border-border hover:border-foreground/60",
          )}
        >
          {file ? (
            <div className="flex items-center gap-3">
              <span className="font-mono text-xs">{file.name}</span>
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); setFile(null); }}
                className="text-muted-foreground hover:text-foreground"
                aria-label="Eliminar archivo"
              >
                <X strokeWidth={1} className="h-4 w-4" />
              </button>
            </div>
          ) : (
            <>
              <Upload strokeWidth={1} className="h-5 w-5 text-foreground/70" />
              <p className="text-sm text-foreground">
                Arrastra tu captura aquí o <span className="underline underline-offset-4">selecciona un archivo</span>
              </p>
              <p className="text-[10px] uppercase tracking-[0.22em] text-muted-foreground">JPG · PNG · máx 5MB</p>
            </>
          )}
          <input
            ref={inputRef}
            type="file"
            accept="image/jpeg,image/png"
            className="hidden"
            onChange={(e) => handleFile(e.target.files?.[0] ?? undefined)}
          />
        </div>
        {fileError && <p className="mt-2 text-xs text-destructive">{fileError}</p>}
        {!fileError && fileMissing && (
          <p className="mt-2 text-xs text-destructive">Adjunta el comprobante para continuar</p>
        )}
      </div>
    </div>
  );
}