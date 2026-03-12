import { createClient } from "@/lib/supabase/server";
import type { Member } from "@odmooca/shared";

export async function getMembers(): Promise<Member[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("members")
    .select("*")
    .order("name");

  if (error) throw new Error(error.message);
  return (data ?? []).map(mapMember);
}

export async function getMemberById(
  id: string
): Promise<Member | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("members")
    .select("*")
    .eq("id", id)
    .single();

  if (error) return null;
  return mapMember(data);
}

export async function createMember(input: {
  name: string;
  email: string;
  phone?: string;
}): Promise<Member> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("members")
    .insert(input)
    .select()
    .single();

  if (error) throw new Error(error.message);
  return mapMember(data);
}

export async function updateMember(
  id: string,
  input: { name: string; email: string; phone?: string }
): Promise<Member> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("members")
    .update(input)
    .eq("id", id)
    .select()
    .single();

  if (error) throw new Error(error.message);
  return mapMember(data);
}

export async function deleteMember(id: string): Promise<void> {
  const supabase = await createClient();
  const { error } = await supabase.from("members").delete().eq("id", id);

  if (error) throw new Error(error.message);
}

function mapMember(row: Record<string, unknown>): Member {
  return {
    id: row.id as string,
    name: row.name as string,
    email: row.email as string,
    phone: (row.phone as string) ?? undefined,
    avatarUrl: (row.avatar_url as string) ?? undefined,
    isActive: row.is_active as boolean,
    createdAt: row.created_at as string,
    updatedAt: row.updated_at as string,
  };
}
