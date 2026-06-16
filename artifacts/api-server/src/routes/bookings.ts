import { Router, type IRouter } from "express";
import { db, bookingsTable } from "@workspace/db";
import { CreateBookingBody } from "@workspace/api-zod";

const router: IRouter = Router();

router.post("/bookings", async (req, res): Promise<void> => {
  const parsed = CreateBookingBody.safeParse(req.body);
  if (!parsed.success) {
    req.log.warn({ errors: parsed.error.message }, "Invalid booking request body");
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const { name, phone, startDate, endDate, duration, message } = parsed.data;

  const toDateString = (d: Date | string): string =>
    d instanceof Date ? d.toISOString().split("T")[0]! : String(d);

  const [booking] = await db
    .insert(bookingsTable)
    .values({
      name,
      phone,
      startDate: toDateString(startDate),
      endDate: toDateString(endDate),
      duration,
      message: message ?? null,
    })
    .returning();

  req.log.info({ bookingId: booking!.id }, "Booking created");

  res.status(201).json(booking);
});

export default router;
