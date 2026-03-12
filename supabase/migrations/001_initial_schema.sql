-- ============================================================
-- OD Mooca Manager — Initial Schema Migration
-- Run this in Supabase SQL Editor (Dashboard → SQL Editor)
-- ============================================================

-- ── Custom Types ────────────────────────────────────────────
CREATE TYPE event_type AS ENUM ('sunday_service', 'wednesday_service', 'special_event');
CREATE TYPE schedule_status AS ENUM ('draft', 'published', 'archived');
CREATE TYPE assignment_status AS ENUM ('pending', 'confirmed', 'declined');

-- ── Members ─────────────────────────────────────────────────
CREATE TABLE members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  phone TEXT,
  avatar_url TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ── Ministries ──────────────────────────────────────────────
CREATE TABLE ministries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT UNIQUE NOT NULL,
  description TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ── Volunteer Roles ─────────────────────────────────────────
CREATE TABLE volunteer_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  member_id UUID NOT NULL REFERENCES members(id) ON DELETE CASCADE,
  ministry_id UUID NOT NULL REFERENCES ministries(id) ON DELETE CASCADE,
  role TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (member_id, ministry_id, role)
);

-- ── Events ──────────────────────────────────────────────────
CREATE TABLE events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  type event_type NOT NULL,
  date TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ── Schedules ───────────────────────────────────────────────
CREATE TABLE schedules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  status schedule_status NOT NULL DEFAULT 'draft',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ── Schedule Assignments ────────────────────────────────────
CREATE TABLE schedule_assignments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  schedule_id UUID NOT NULL REFERENCES schedules(id) ON DELETE CASCADE,
  volunteer_role_id UUID NOT NULL REFERENCES volunteer_roles(id) ON DELETE CASCADE,
  status assignment_status NOT NULL DEFAULT 'pending',
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (schedule_id, volunteer_role_id)
);

-- ── Indexes ─────────────────────────────────────────────────
CREATE INDEX idx_volunteer_roles_member ON volunteer_roles(member_id);
CREATE INDEX idx_volunteer_roles_ministry ON volunteer_roles(ministry_id);
CREATE INDEX idx_events_date ON events(date);
CREATE INDEX idx_schedules_event ON schedules(event_id);
CREATE INDEX idx_schedules_status ON schedules(status);
CREATE INDEX idx_assignments_schedule ON schedule_assignments(schedule_id);
CREATE INDEX idx_assignments_volunteer ON schedule_assignments(volunteer_role_id);

-- ── Auto-update updated_at trigger ──────────────────────────
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_members_updated_at
  BEFORE UPDATE ON members FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER trg_ministries_updated_at
  BEFORE UPDATE ON ministries FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER trg_volunteer_roles_updated_at
  BEFORE UPDATE ON volunteer_roles FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER trg_events_updated_at
  BEFORE UPDATE ON events FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER trg_schedules_updated_at
  BEFORE UPDATE ON schedules FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER trg_assignments_updated_at
  BEFORE UPDATE ON schedule_assignments FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ── Row Level Security (RLS) ────────────────────────────────
-- Enable RLS on all tables (policies will be added per-feature)
ALTER TABLE members ENABLE ROW LEVEL SECURITY;
ALTER TABLE ministries ENABLE ROW LEVEL SECURITY;
ALTER TABLE volunteer_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE schedules ENABLE ROW LEVEL SECURITY;
ALTER TABLE schedule_assignments ENABLE ROW LEVEL SECURITY;

-- Temporary permissive policies for development
-- TODO: Replace with proper role-based policies when auth is implemented
CREATE POLICY "Allow all for authenticated users" ON members
  FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Allow all for authenticated users" ON ministries
  FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Allow all for authenticated users" ON volunteer_roles
  FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Allow all for authenticated users" ON events
  FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Allow all for authenticated users" ON schedules
  FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Allow all for authenticated users" ON schedule_assignments
  FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Allow anon read for development (remove in production)
CREATE POLICY "Allow anon read" ON members FOR SELECT TO anon USING (true);
CREATE POLICY "Allow anon read" ON ministries FOR SELECT TO anon USING (true);
CREATE POLICY "Allow anon read" ON volunteer_roles FOR SELECT TO anon USING (true);
CREATE POLICY "Allow anon read" ON events FOR SELECT TO anon USING (true);
CREATE POLICY "Allow anon read" ON schedules FOR SELECT TO anon USING (true);
CREATE POLICY "Allow anon read" ON schedule_assignments FOR SELECT TO anon USING (true);
