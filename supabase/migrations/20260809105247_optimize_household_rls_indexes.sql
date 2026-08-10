-- Cache the authenticated user ID once per query in the two household lookup
-- policies. This preserves the strict owner-and-membership boundary while
-- avoiding a repeated auth.uid() evaluation for every candidate row.
alter policy cookbooks_member_select
on public.cookbooks
using (
  private.is_app_owner()
  and exists (
    select 1
    from public.cookbook_members membership
    where membership.cookbook_id = cookbooks.id
      and membership.user_id = (select auth.uid())
  )
);

alter policy cookbook_members_self_select
on public.cookbook_members
using (
  private.is_app_owner()
  and user_id = (select auth.uid())
);

-- Cover both Auth foreign keys so account cleanup and integrity checks do not
-- need to scan the household table as it grows.
create index if not exists cookbooks_data_owner_user_idx
on public.cookbooks (data_owner_user_id);

create index if not exists cookbooks_created_by_idx
on public.cookbooks (created_by);
