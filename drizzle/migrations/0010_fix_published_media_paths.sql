drop policy if exists "public views published media" on storage.objects;
create policy "public views published media" on storage.objects for select to anon, authenticated using (
  bucket_id = 'media' and (
    exists (select 1 from public.photos p where p.url = storage.objects.name and p.section in ('shows','galeria'))
    or exists (select 1 from public.sponsors s where s.logo_url = storage.objects.name and now() >= s.starts_at and now() < s.ends_at)
    or exists (select 1 from public.gallery_videos v where v.video_path = storage.objects.name or v.cover_path = storage.objects.name)
  )
);