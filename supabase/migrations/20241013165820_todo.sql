create table
todo (
    id bigint primary key generated always as identity,
    title text,
    created_at timestamp with time zone default now(),
    priority numeric,
    updated_at timestamp with time zone,
    deleted boolean
);