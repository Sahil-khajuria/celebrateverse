CREATE TABLE wishes (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    page_id BIGINT NOT NULL,
    author_name VARCHAR(100) DEFAULT 'Anonymous',
    message TEXT NOT NULL,
    photo_url VARCHAR(500),
    reaction_emoji VARCHAR(20),
    is_approved BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (page_id) REFERENCES birthday_pages(id) ON DELETE CASCADE
);
