import Link from "next/link";
import { notFound } from "next/navigation";
import { getEventById } from "@/services/events";
import { getOrCreateSchedule } from "@/services/schedules";
import { getMembers } from "@/services/members";
import { getMinistries } from "@/services/ministries";
import { EVENT_TYPE_LABELS } from "@/core/events";
import { ScheduleClient } from "./client";

export default async function SchedulePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const event = await getEventById(id);
  if (!event) notFound();

  const [schedule, members, ministries] = await Promise.all([
    getOrCreateSchedule(id),
    getMembers(),
    getMinistries(),
  ]);

  const eventDate = new Date(event.date).toLocaleDateString("pt-BR", {
    weekday: "long",
    day: "2-digit",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div className="flex flex-col gap-6">
      <div>
        <Link
          href="/dashboard/events"
          className="text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          ← Voltar para Eventos
        </Link>
        <h2 className="mt-2 text-2xl font-bold tracking-tight">
          {event.name}
        </h2>
        <div className="flex flex-wrap gap-2 text-sm text-muted-foreground">
          <span>{eventDate}</span>
          <span className="rounded bg-muted px-1.5 py-0.5 text-xs">
            {EVENT_TYPE_LABELS[event.type]}
          </span>
        </div>
      </div>

      <ScheduleClient
        eventId={id}
        schedule={schedule}
        members={members}
        ministries={ministries}
      />
    </div>
  );
}
