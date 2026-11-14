-- TEAM Sahélia · Schéma SQLite / Cloudflare D1 (Offre Gratuite 0 €/mois)

CREATE TABLE IF NOT EXISTS learners (
  learner_id TEXT PRIMARY KEY,
  display_name TEXT,
  email TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS course_progress (
  learner_id TEXT NOT NULL,
  progress_key TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'valide',
  xp INTEGER NOT NULL DEFAULT 150,
  updated_at TEXT NOT NULL DEFAULT (datetime('now')),
  PRIMARY KEY (learner_id, progress_key)
);

CREATE TABLE IF NOT EXISTS badges (
  badge_id TEXT PRIMARY KEY,
  holder_name TEXT NOT NULL,
  achievement_id TEXT NOT NULL,
  issued_on TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'active',
  revocation_reason TEXT,
  signature TEXT
);

CREATE INDEX IF NOT EXISTS idx_progress_learner ON course_progress(learner_id);
CREATE INDEX IF NOT EXISTS idx_badges_status ON badges(status);
