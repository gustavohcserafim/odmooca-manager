// Shared types for OD Mooca Manager

// ── Member ──────────────────────────────────────────────────────────
export interface Member {
  id: string;
  name: string;
  email: string;
  phone?: string;
  avatarUrl?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

// ── Ministry ────────────────────────────────────────────────────────
export interface Ministry {
  id: string;
  name: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

// ── Volunteer Role ──────────────────────────────────────────────────
export interface VolunteerRole {
  id: string;
  memberId: string;
  ministryId: string;
  role: string;
  createdAt: string;
  updatedAt: string;
}

// ── Event ───────────────────────────────────────────────────────────
export type EventType = "sunday_service" | "wednesday_service" | "special_event";

export interface ChurchEvent {
  id: string;
  name: string;
  type: EventType;
  date: string;
  createdAt: string;
  updatedAt: string;
}

// ── Schedule ────────────────────────────────────────────────────────
export type ScheduleStatus = "draft" | "published" | "archived";

export interface Schedule {
  id: string;
  eventId: string;
  status: ScheduleStatus;
  createdAt: string;
  updatedAt: string;
}

// ── Schedule Assignment ─────────────────────────────────────────────
export type AssignmentStatus = "pending" | "confirmed" | "declined";

export interface ScheduleAssignment {
  id: string;
  scheduleId: string;
  volunteerRoleId: string;
  status: AssignmentStatus;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}
