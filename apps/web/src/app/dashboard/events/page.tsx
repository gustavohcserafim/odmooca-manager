import { getEvents } from "@/services/events";
import { EventsClient } from "./client";

export default async function EventsPage() {
  const events = await getEvents();

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Eventos</h2>
        <p className="text-muted-foreground">
          Gerencie cultos e eventos da igreja
        </p>
      </div>

      <EventsClient events={events} />
    </div>
  );
}
