-- LazyTools ratings — the entire database schema.
-- Deliberately minimal: no user identifiers of any kind.
CREATE TABLE IF NOT EXISTS ratings (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  tool VARCHAR(120) NOT NULL,
  stars TINYINT UNSIGNED NOT NULL,
  created_at DATETIME NOT NULL,
  KEY idx_tool (tool)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
