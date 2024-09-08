create or replace function search_diary(
    query_embedding vector(1536),
    similarity_threshold float,
    match_count int
)
returns table (
    id bigint,
    title text,
    content text,
    created_at timestamp,
    similarity float
)
language plpgsql
as $$
begin
    return query
    select
        diary.id,
        diary.title,
        diary.content,
        diary.created_at,
        1 - (diary.embedding <=> query_embedding) as similarity
    from
        diary
    where
        1 - (diary.embedding <=> query_embedding) > similarity_threshold
    order by
        diary.embedding <=> query_embedding
    limit
        match_count;
end;
$$;