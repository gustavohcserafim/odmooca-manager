import { createClient } from "@/lib/supabase/server";

export interface ScheduleAssignmentRow {
  id: string;
  schedule_id: string;
  member_id: string;
  ministry_id: string;
  role: string;
  status: string;
  notes: string | null;
  created_at: string;
  member_name: string;
  ministry_name: string;
}

export interface ScheduleWithAssignments {
  id: string;
  eventId: string;
  status: string;
  assignments: ScheduleAssignmentRow[];
}

export async function getOrCreateSchedule(
  eventId: string
): Promise<ScheduleWithAssignments> {
  const supabase = await createClient();

  // Try to get existing schedule
  let { data: schedule } = await supabase
    .from("schedules")
    .select("*")
    .eq("event_id", eventId)
    .single();

  // Create if not exists
  if (!schedule) {
    const { data, error } = await supabase
      .from("schedules")
      .insert({ event_id: eventId, status: "draft" })
      .select()
      .single();
    if (error) throw new Error(error.message);
    schedule = data;
  }

  // Fetch assignments with member and ministry names
  const { data: assignments } = await supabase
    .from("schedule_assignments")
    .select(
      `
      id,
      schedule_id,
      volunteer_role_id,
      status,
      notes,
      created_at,
      volunteer_roles!inner (
        member_id,
        ministry_id,
        role,
        members!inner ( name ),
        ministries!inner ( name )
      )
    `
    )
    .eq("schedule_id", schedule.id)
    .order("created_at");

  // Type for the Supabase nested join result
  interface AssignmentJoinRow {
    id: string;
    schedule_id: string;
    volunteer_role_id: string;
    status: string;
    notes: string | null;
    created_at: string;
    volunteer_roles: {
      member_id: string;
      ministry_id: string;
      role: string;
      members: { name: string };
      ministries: { name: string };
    };
  }

  const mapped: ScheduleAssignmentRow[] = (
    (assignments ?? []) as unknown as AssignmentJoinRow[]
  ).map((a) => ({
    id: a.id,
    schedule_id: a.schedule_id,
    member_id: a.volunteer_roles.member_id,
    ministry_id: a.volunteer_roles.ministry_id,
    role: a.volunteer_roles.role,
    status: a.status,
    notes: a.notes,
    created_at: a.created_at,
    member_name: a.volunteer_roles.members.name,
    ministry_name: a.volunteer_roles.ministries.name,
  }));

  const s = schedule as { id: string; event_id: string; status: string };
  return {
    id: s.id,
    eventId: s.event_id,
    status: s.status,
    assignments: mapped,
  };
}

export async function addAssignment(
  scheduleId: string,
  memberId: string,
  ministryId: string,
  role: string
): Promise<void> {
  const supabase = await createClient();

  // Get or create volunteer_role
  let { data: volunteerRole } = await supabase
    .from("volunteer_roles")
    .select("id")
    .eq("member_id", memberId)
    .eq("ministry_id", ministryId)
    .eq("role", role)
    .single();

  if (!volunteerRole) {
    const { data, error } = await supabase
      .from("volunteer_roles")
      .insert({ member_id: memberId, ministry_id: ministryId, role })
      .select("id")
      .single();
    if (error) throw new Error(error.message);
    volunteerRole = data;
  }

  // Create assignment
  const { error } = await supabase.from("schedule_assignments").insert({
    schedule_id: scheduleId,
    volunteer_role_id: volunteerRole!.id,
    status: "pending",
  });

  if (error) {
    if (error.message.includes("duplicate") || error.message.includes("unique")) {
      throw new Error("Este voluntário já está escalado neste evento");
    }
    throw new Error(error.message);
  }
}

export async function removeAssignment(id: string): Promise<void> {
  const supabase = await createClient();
  const { error } = await supabase
    .from("schedule_assignments")
    .delete()
    .eq("id", id);
  if (error) throw new Error(error.message);
}

export async function updateScheduleStatus(
  id: string,
  status: string
): Promise<void> {
  const supabase = await createClient();
  const { error } = await supabase
    .from("schedules")
    .update({ status })
    .eq("id", id);
  if (error) throw new Error(error.message);
}
