-- Owner-managed, pre-moderated public discussions. No direct browser table access.
begin;

create table public.discussion_projects (
  slug text primary key check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  enabled boolean not null default true
);
create table public.discussion_comments (
  id uuid primary key default gen_random_uuid(),
  project_slug text not null references public.discussion_projects(slug),
  parent_id uuid references public.discussion_comments(id) on delete cascade,
  author_name text not null check (char_length(btrim(author_name)) between 2 and 60),
  body text not null check (char_length(btrim(body)) between 5 and 3000),
  language text not null check (language in ('hy','en','ru')),
  status text not null default 'pending' check (status in ('pending','approved','rejected')),
  created_at timestamptz not null default now(),
  published_at timestamptz,
  request_id uuid not null unique,
  request_digest text not null check (length(request_digest) = 64),
  check (status <> 'approved' or published_at is not null)
);
create index discussion_public_order on public.discussion_comments (project_slug, published_at, id) where status = 'approved';
create index discussion_queue_order on public.discussion_comments (created_at) where status = 'pending';
create index discussion_parent on public.discussion_comments (parent_id) where parent_id is not null;
create table public.discussion_rate_limits (
  bucket text primary key,
  hits integer not null,
  expires_at timestamptz not null
);
create table public.discussion_moderation_log (
  id bigint generated always as identity primary key,
  comment_id uuid not null,
  action text not null,
  actor text not null,
  changed_at timestamptz not null default now()
);

alter table public.discussion_projects enable row level security;
alter table public.discussion_comments enable row level security;
alter table public.discussion_rate_limits enable row level security;
alter table public.discussion_moderation_log enable row level security;
revoke all on public.discussion_projects, public.discussion_comments,
  public.discussion_rate_limits, public.discussion_moderation_log from public, anon, authenticated;
grant select, insert, update, delete on public.discussion_projects, public.discussion_comments,
  public.discussion_rate_limits, public.discussion_moderation_log to service_role;
grant usage, select on sequence public.discussion_moderation_log_id_seq to service_role;

create function public.discussion_comment_guard() returns trigger
language plpgsql set search_path = '' as $$
declare parent public.discussion_comments;
begin
  if tg_op = 'DELETE' then
    insert into public.discussion_moderation_log(comment_id, action, actor)
      values(old.id, 'deleted', coalesce(auth.uid()::text, session_user));
    return old;
  end if;
  if new.parent_id is not null then
    select * into parent from public.discussion_comments where id = new.parent_id for share;
    if not found or parent.project_slug <> new.project_slug or parent.parent_id is not null then
      raise exception 'invalid_parent';
    end if;
    if (tg_op = 'INSERT' or new.status = 'approved') and parent.status <> 'approved' then
      raise exception 'parent_not_published';
    end if;
  end if;
  if tg_op = 'UPDATE' then
    if new.id <> old.id or new.project_slug <> old.project_slug
      or new.parent_id is distinct from old.parent_id
      or new.request_id <> old.request_id or new.request_digest <> old.request_digest
      or new.created_at <> old.created_at then
      raise exception 'immutable_comment_identity';
    end if;
  end if;
  if new.status = 'approved' and (tg_op = 'INSERT' or old.status <> 'approved') then
    new.published_at := clock_timestamp();
  elsif new.status <> 'approved' then
    new.published_at := null;
  end if;
  if tg_op = 'UPDATE' and (new.status is distinct from old.status or new.body is distinct from old.body or new.author_name is distinct from old.author_name) then
    insert into public.discussion_moderation_log(comment_id, action, actor)
      values(new.id, new.status || case when new.body is distinct from old.body or new.author_name is distinct from old.author_name then ':edited' else '' end,
        coalesce(auth.uid()::text, session_user));
  end if;
  return new;
end;
$$;
create trigger discussion_comment_guard before insert or update or delete on public.discussion_comments
  for each row execute function public.discussion_comment_guard();
revoke all on function public.discussion_comment_guard() from public, anon, authenticated;

-- This is not exposed to browsers. The Edge Function supplies server-HMAC'd values.
create function public.discussion_submit(
  p_project text, p_author text, p_body text, p_language text, p_parent uuid,
  p_request_id uuid, p_digest text, p_actor_hash text
) returns jsonb language plpgsql security invoker set search_path = '' as $$
declare existing_digest text; n integer; window_id bigint;
begin
  if not exists(select 1 from public.discussion_projects where slug = p_project and enabled) then
    raise exception 'unknown_project';
  end if;
  if p_actor_hash !~ '^[0-9a-f]{64}$' or p_digest !~ '^[0-9a-f]{64}$' then
    raise exception 'invalid_request';
  end if;
  -- Serialize retries before the unique constraint, including concurrent retries.
  perform pg_advisory_xact_lock(hashtextextended(p_request_id::text, 0));
  select request_digest into existing_digest from public.discussion_comments where request_id = p_request_id;
  if found then
    if existing_digest <> p_digest then raise exception 'request_conflict'; end if;
    return jsonb_build_object('status', 'pending');
  end if;
  delete from public.discussion_rate_limits where expires_at < now();
  window_id := floor(extract(epoch from now()) / 600)::bigint;
  insert into public.discussion_rate_limits(bucket, hits, expires_at)
    values('actor:' || p_actor_hash || ':' || window_id, 1, now() + interval '11 minutes')
    on conflict(bucket) do update set hits = public.discussion_rate_limits.hits + 1
    returning hits into n;
  if n > 5 then raise exception 'rate_limited'; end if;
  insert into public.discussion_rate_limits(bucket, hits, expires_at)
    values('global:' || floor(extract(epoch from now()) / 3600)::bigint, 1, now() + interval '61 minutes')
    on conflict(bucket) do update set hits = public.discussion_rate_limits.hits + 1
    returning hits into n;
  if n > 100 then raise exception 'rate_limited'; end if;
  if (select count(*) from public.discussion_comments where status = 'pending') >= 5000 then
    raise exception 'queue_full';
  end if;
  insert into public.discussion_comments(project_slug, parent_id, author_name, body, language, status, request_id, request_digest)
    values(p_project, p_parent, btrim(p_author), btrim(p_body), p_language, 'pending', p_request_id, p_digest);
  return jsonb_build_object('status', 'pending');
end;
$$;
revoke all on function public.discussion_submit(text,text,text,text,uuid,uuid,text,text) from public, anon, authenticated;
grant execute on function public.discussion_submit(text,text,text,text,uuid,uuid,text,text) to service_role;

-- Only explicit public fields are returned. Parent moderation hides its replies too.
create function public.discussion_list(p_project text, p_after_time timestamptz default null, p_after_id uuid default null)
returns jsonb language plpgsql security invoker set search_path = '' as $$
declare records jsonb; last_record jsonb; has_more boolean;
begin
  if not exists(select 1 from public.discussion_projects where slug = p_project and enabled) then
    raise exception 'unknown_project';
  end if;
  select coalesce(jsonb_agg(to_jsonb(page) order by published_at, id), '[]'::jsonb) into records from (
    select c.id, c.parent_id, c.author_name, c.body, c.language, c.published_at
    from public.discussion_comments c
    where c.project_slug = p_project and c.status = 'approved'
      and (c.parent_id is null or exists(select 1 from public.discussion_comments parent where parent.id = c.parent_id and parent.status = 'approved'))
      and (p_after_time is null or (c.published_at, c.id) > (p_after_time, p_after_id))
    order by c.published_at, c.id limit 51
  ) page;
  has_more := jsonb_array_length(records) > 50;
  if has_more then records := records - 50; end if;
  last_record := records -> (jsonb_array_length(records) - 1);
  return jsonb_build_object('items', records, 'next_cursor', case when has_more then
    (last_record ->> 'published_at') || '|' || (last_record ->> 'id') else null end);
end;
$$;
revoke all on function public.discussion_list(text,timestamptz,uuid) from public, anon, authenticated;
grant execute on function public.discussion_list(text,timestamptz,uuid) to service_role;

create function public.discussion_withdraw_replies() returns trigger
language plpgsql set search_path = '' as $$
begin
  if old.status = 'approved' and new.status <> 'approved' and new.parent_id is null then
    update public.discussion_comments set status = 'pending'
      where parent_id = new.id and status = 'approved';
  end if;
  return new;
end;
$$;
create trigger discussion_withdraw_replies after update of status on public.discussion_comments
  for each row execute function public.discussion_withdraw_replies();
revoke all on function public.discussion_withdraw_replies() from public, anon, authenticated;

commit;
