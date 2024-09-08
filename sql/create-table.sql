CREATE TABLE IF NOT EXISTS diary (
    id bigserial PRIMARY KEY,
    title text NOT NULL,
    content text NOT NULL,
    created_at timestamp NOT NULL DEFAULT NOW(),
    embedding vector(1536) NOT NULL
);