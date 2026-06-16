import { useState } from "react";
import { useCreateBooking } from "@workspace/api-client-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Calendar, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";

type Duration = "day" | "week" | "month";

const DURATION_LABELS: Record<Duration, string> = {
  day: "Por día (S/ 60)",
  week: "Por semana (S/ 350)",
  month: "Por mes (S/ 1,200)",
};

export function BookingForm() {
  const [form, setForm] = useState({
    name: "",
    phone: "",
    startDate: "",
    endDate: "",
    duration: "day" as Duration,
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);

  const { mutate, isPending, isError, error } = useCreateBooking({
    mutation: {
      onSuccess: () => setSubmitted(true),
    },
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutate({
      data: {
        name: form.name,
        phone: form.phone,
        startDate: form.startDate,
        endDate: form.endDate,
        duration: form.duration,
        message: form.message || undefined,
      },
    });
  };

  if (submitted) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <CheckCircle2 className="w-20 h-20 text-primary mb-6" />
        <h3 className="text-4xl font-display mb-4">¡RESERVA RECIBIDA!</h3>
        <p className="text-xl text-muted-foreground max-w-md">
          Te contactaremos por WhatsApp en las próximas horas para confirmar los detalles.
        </p>
        <Button
          className="mt-8 rounded-none border-2 border-primary h-14 px-10 text-lg font-display tracking-widest"
          onClick={() => {
            setSubmitted(false);
            setForm({ name: "", phone: "", startDate: "", endDate: "", duration: "day", message: "" });
          }}
        >
          HACER OTRA RESERVA
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="flex flex-col gap-2">
        <Label htmlFor="name" className="font-bold uppercase tracking-widest text-sm">
          Nombre completo *
        </Label>
        <Input
          id="name"
          name="name"
          value={form.name}
          onChange={handleChange}
          required
          placeholder="Ej. Carlos Pérez"
          className="rounded-none border-2 border-border h-12 bg-background text-foreground focus-visible:ring-primary"
        />
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="phone" className="font-bold uppercase tracking-widest text-sm">
          Celular (WhatsApp) *
        </Label>
        <Input
          id="phone"
          name="phone"
          type="tel"
          value={form.phone}
          onChange={handleChange}
          required
          placeholder="Ej. +51 999 999 999"
          className="rounded-none border-2 border-border h-12 bg-background text-foreground focus-visible:ring-primary"
        />
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="startDate" className="font-bold uppercase tracking-widest text-sm">
          Fecha de inicio *
        </Label>
        <div className="relative">
          <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground pointer-events-none" />
          <Input
            id="startDate"
            name="startDate"
            type="date"
            value={form.startDate}
            onChange={handleChange}
            required
            min={new Date().toISOString().split("T")[0]}
            className="rounded-none border-2 border-border h-12 bg-background text-foreground focus-visible:ring-primary pl-10"
          />
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="endDate" className="font-bold uppercase tracking-widest text-sm">
          Fecha de devolución *
        </Label>
        <div className="relative">
          <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground pointer-events-none" />
          <Input
            id="endDate"
            name="endDate"
            type="date"
            value={form.endDate}
            onChange={handleChange}
            required
            min={form.startDate || new Date().toISOString().split("T")[0]}
            className="rounded-none border-2 border-border h-12 bg-background text-foreground focus-visible:ring-primary pl-10"
          />
        </div>
      </div>

      <div className="flex flex-col gap-2 md:col-span-2">
        <Label htmlFor="duration" className="font-bold uppercase tracking-widest text-sm">
          Tarifa *
        </Label>
        <div className="grid grid-cols-3 gap-3">
          {(["day", "week", "month"] as Duration[]).map((d) => (
            <button
              key={d}
              type="button"
              onClick={() => setForm((prev) => ({ ...prev, duration: d }))}
              className={`h-14 border-2 font-bold uppercase tracking-wider text-sm transition-all ${
                form.duration === d
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border bg-background text-foreground hover:border-primary"
              }`}
            >
              {d === "day" && "Día · S/60"}
              {d === "week" && "Semana · S/350"}
              {d === "month" && "Mes · S/1,200"}
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-2 md:col-span-2">
        <Label htmlFor="message" className="font-bold uppercase tracking-widest text-sm">
          Mensaje adicional
        </Label>
        <Textarea
          id="message"
          name="message"
          value={form.message}
          onChange={handleChange}
          rows={3}
          placeholder="¿Alguna pregunta o detalle que quieras contarnos?"
          className="rounded-none border-2 border-border bg-background text-foreground focus-visible:ring-primary resize-none"
        />
      </div>

      {isError && (
        <div className="md:col-span-2 flex items-center gap-3 p-4 border-2 border-destructive bg-destructive/10 text-destructive">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <span className="font-bold text-sm">
            {(error as Error)?.message ?? "Error al enviar. Intenta de nuevo."}
          </span>
        </div>
      )}

      <div className="md:col-span-2">
        <Button
          type="submit"
          disabled={isPending}
          size="lg"
          className="w-full rounded-none border-2 border-primary h-16 text-xl font-display tracking-widest shadow-sm"
        >
          {isPending ? (
            <span className="flex items-center gap-3">
              <Loader2 className="w-6 h-6 animate-spin" />
              ENVIANDO...
            </span>
          ) : (
            "SOLICITAR RESERVA"
          )}
        </Button>
        <p className="text-center text-sm text-muted-foreground mt-3 font-bold uppercase tracking-wider">
          Te confirmaremos por WhatsApp
        </p>
      </div>
    </form>
  );
}
