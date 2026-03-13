"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { EventForm } from "@/components/EventForm";
import {
  createEventAction,
  updateEventAction,
  deleteEventAction,
} from "./actions";
import { EVENT_TYPE_LABELS } from "@/core/events";
import type { ChurchEvent } from "@odmooca/shared";

interface EventsClientProps {
  events: ChurchEvent[];
}

export function EventsClient({ events }: EventsClientProps) {
  const [createOpen, setCreateOpen] = useState(false);
  const [editEvent, setEditEvent] = useState<ChurchEvent | null>(null);

  function formatDate(dateStr: string) {
    return new Date(dateStr).toLocaleDateString("pt-BR", {
      weekday: "short",
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  return (
    <>
      <Button className="self-end" onClick={() => setCreateOpen(true)}>
        + Novo Evento
      </Button>

      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Novo Evento</DialogTitle>
          </DialogHeader>
          <EventForm
            action={createEventAction}
            onSuccess={() => setCreateOpen(false)}
          />
        </DialogContent>
      </Dialog>

      <Dialog
        open={!!editEvent}
        onOpenChange={(open) => !open && setEditEvent(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar Evento</DialogTitle>
          </DialogHeader>
          {editEvent && (
            <EventForm
              action={updateEventAction.bind(null, editEvent.id)}
              event={editEvent}
              onSuccess={() => setEditEvent(null)}
            />
          )}
        </DialogContent>
      </Dialog>

      {events.length === 0 ? (
        <div className="flex flex-col items-center gap-2 rounded-xl border border-dashed bg-card p-12 text-center">
          <p className="text-lg font-medium">Nenhum evento cadastrado</p>
          <p className="text-sm text-muted-foreground">
            Crie o primeiro evento para começar a montar escalas
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {events.map((event) => (
            <div
              key={event.id}
              className="flex items-center justify-between rounded-xl border bg-card p-4 shadow-sm"
            >
              <div className="flex flex-col gap-1">
                <h3 className="font-semibold">{event.name}</h3>
                <div className="flex flex-wrap gap-2 text-sm text-muted-foreground">
                  <span>{formatDate(event.date)}</span>
                  <span className="rounded bg-muted px-1.5 py-0.5 text-xs">
                    {EVENT_TYPE_LABELS[event.type]}
                  </span>
                </div>
              </div>
              <div className="flex gap-2">
                <Link href={`/dashboard/events/${event.id}/schedule`}>
                  <Button variant="secondary" size="sm">
                    Escala
                  </Button>
                </Link>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setEditEvent(event)}
                >
                  Editar
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={async () => {
                    if (confirm(`Excluir o evento "${event.name}"?`)) {
                      await deleteEventAction(event.id);
                    }
                  }}
                >
                  Excluir
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
}
