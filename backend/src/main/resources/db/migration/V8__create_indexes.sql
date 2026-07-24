CREATE INDEX idx_birthday_pages_slug ON birthday_pages(slug);
CREATE INDEX idx_birthday_pages_owner ON birthday_pages(owner_user_id);
CREATE INDEX idx_media_assets_page ON media_assets(page_id);
CREATE INDEX idx_wishes_page ON wishes(page_id);
CREATE INDEX idx_engagement_events_page ON engagement_events(page_id);
