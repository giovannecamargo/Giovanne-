drop policy if exists "public reads shows" on public.shows;
create policy "public reads upcoming shows" on public.shows for select to anon, authenticated using (event_date >= current_date);

drop policy if exists "public reads photos" on public.photos;
create policy "public reads site photos" on public.photos for select to anon, authenticated using (section in ('shows','galeria'));

drop policy if exists "public reads gallery videos" on public.gallery_videos;
create policy "public reads complete gallery videos" on public.gallery_videos for select to anon, authenticated using (video_path <> '' and cover_path <> '');

drop policy if exists "Contact details are publicly readable" on public.contact_settings;
create policy "Site contact row is publicly readable" on public.contact_settings for select to anon, authenticated using (id = true);

drop policy if exists "anyone views media" on storage.objects;
create policy "admin views all media" on storage.objects for select to authenticated using (bucket_id = 'media' and public.has_role(auth.uid(), 'admin'));
create policy "public views published media" on storage.objects for select to anon, authenticated using (
  bucket_id = 'media' and (
    exists (select 1 from public.photos p where p.url = name and p.section in ('shows','galeria'))
    or exists (select 1 from public.sponsors s where s.logo_url = name and now() >= s.starts_at and now() < s.ends_at)
    or exists (select 1 from public.gallery_videos v where v.video_path = name or v.cover_path = name)
  )
);