import { createClient } from "@/lib/supabase/server";
import type { Ministry } from "@odmooca/shared";

export async function getMinistries(): Promise<Ministry[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("ministries")
    .select("*")
    .order("name");

  if (error) throw new Error(error.message);
  return (data ?? []).map(mapMinistry);
}

export async function getMinistryById(id: string): Promise<Ministry | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("ministries")
    .select("*")
    .eq("id", id)
    .single();

  if (error) return null;
  return mapMinistry(data);
}

export async function createMinistry(input: {
  name: string;
  description?: string;
}): Promise<Ministry> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("ministries")
    .insert(input)
    .select()
    .single();

  if (error) throw new Error(error.message);
  return mapMinistry(data);
}

export async function updateMinistry(
  id: string,
  input: { name: string; description?: string }
): Promise<Ministry> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("ministries")
    .update(input)
    .eq("id", id)
    .select()
    .single();

  if (error) throw new Error(error.message);
  return mapMinistry(data);
}

export async function deleteMinistry(id: string): Promise<void> {
  const supabase = await createClient();
  const { error } = await supabase.from("ministries").delete().eq("id", id);

  if (error) throw new Error(error.message);
}

// Map snake_case DB row to camelCase TypeScript interface
function mapMinistry(row: Record<string, unknown>): Ministry {
  return {
    id: row.id as string,
    name: row.name as string,
    description: (row.description as string) ?? undefined,
    createdAt: row.created_at as string,
    updatedAt: row.updated_at as string,
  };
}
