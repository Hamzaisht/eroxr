
create table if not exists public.tips (
    id uuid default gen_random_uuid() primary key,
    sender_id uuid references auth.users(id) on delete cascade not null,
    recipient_id uuid references auth.users(id) on delete cascade not null,
    amount decimal(10,2) not null check (amount > 0),
    call_id text not null,
    sender_name text,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Add RLS policies
alter table public.tips enable row level security;

-- Recipients can view their received tips
create policy "Recipients can view their received tips"
on public.tips for select
to authenticated
using (recipient_id = auth.uid());

-- Users can create tips
create policy "Users can create tips"
on public.tips for insert
to authenticated
with check (sender_id = auth.uid());

-- Create an index for faster queries
create index tips_recipient_id_idx on public.tips(recipient_id);
create index tips_call_id_idx on public.tips(call_id);
