-- Public website form records are private operational data. Route handlers write
-- through the service role; no browser role may read or write these records.
CREATE TABLE IF NOT EXISTS dove.form_submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  form_type TEXT NOT NULL CHECK (form_type IN ('contact', 'volunteer', 'travel', 'partnership')),
  status TEXT NOT NULL CHECK (status IN ('received', 'delivered', 'delivery_failed', 'spam', 'archived')) DEFAULT 'received',
  recipient TEXT NOT NULL,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  organization TEXT,
  reason TEXT,
  message TEXT,
  locale TEXT NOT NULL CHECK (locale IN ('en', 'es')),
  payload JSONB NOT NULL DEFAULT '{}'::jsonb,
  delivery_error TEXT,
  received_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  delivered_at TIMESTAMPTZ,
  archived_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_dove_form_submissions_status_received
  ON dove.form_submissions (status, received_at DESC);

ALTER TABLE dove.form_submissions ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON TABLE dove.form_submissions FROM anon, authenticated;
GRANT ALL ON TABLE dove.form_submissions TO service_role;
