import { createClient } from "@/lib/supabase/server";
import type { ChurchEvent } from "@odmooca/shared";

export async function getEvents(): Promise<ChurchEvent[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("events")
    .select("*")
    .order("date", { ascending: false });

  if (error) throw new Error(error.message);
  return (data ?? []).map(mapEvent);
}

export async function getEventById(
  id: string
): Promise<ChurchEvent | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("events")
    .select("*")
    .eq("id", id)
    .single();

  if (error) return null;
  return mapEvent(data);
}

export async function createEvent(input: {
  name: string;
  type: string;
  date: string;
}): Promise<ChurchEvent> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("events")
    .insert(input)
    .select()
    .single();

  if (error) throw new Error(error.message);
  return mapEvent(data);
}

export async function updateEvent(
  id: string,
  input: { name: string; type: string; date: string }
): Promise<ChurchEvent> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("events")
    .update(input)
    .eq("id", id)
    .select()
    .single();

  if (error) throw new Error(error.message);
  return mapEvent(data);
}

export async function deleteEvent(id: string): Promise<void> {
  const supabase = await createClient();
  const { error } = await supabase.from("events").delete().eq("id", id);
  if (error) throw new Error(error.message);
}

function mapEvent(row: Record<string, unknown>): ChurchEvent {
  return {
    id: row.id as string,
    name: row.name as string,
    type: row.type as ChurchEvent["type"],
    date: row.date as string,
    createdAt: row.created_at as string,
    updatedAt: row.updated_at as string,
  };
}
