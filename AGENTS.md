<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

## Brand assets

Use the shared Logo component for header and footer branding. Keep the original uploaded media records as Lovable Assets pointers, but serve fixed brand, editorial and legacy media from `public/` so external hosts such as Vercel can load them without Lovable's asset route. Map only exact legacy database paths to their local copies; never use this as a fallback that resurrects deleted records. Derive the favicon from the same logo and serve it from `public/` to keep the brand consistent.

## Browser tabs stay independent

Never persist interface state (current page, scroll position, menu, lightbox) to
`localStorage`, `sessionStorage`, cookies or IndexedDB. Keep it in React state,
the URL, or the router's per-tab scroll cache, so two open tabs never influence
each other. Guarded by `src/test/tab-independence.test.ts`.

## Admin content
Sponsors, agenda shows and page photos live in Lovable Cloud tables; images go in the private `media` bucket and are shown via signed URLs (public buckets are blocked in this workspace). The first account created becomes an admin; additional admin access is granted only explicitly through `public.user_roles`, and writes are allowed only for the admin role.
A sponsor may carry an optional destination address: when it has one, its logo on the public site opens that address in a new tab; when it has none, the logo stays non-clickable. Typed addresses are sanitized to plain http(s) by `normalizeSponsorLink` (`src/lib/sponsor-link.ts`) so a logo can never open a script — guarded by `src/test/sponsor-link.test.ts`.
Sponsor panels keep a fixed size with the logo centered inside; the empty strips around the logo are painted with the logo's own edge color, sampled client-side by `edgeColor` (`src/lib/logo-bg.ts`) — guarded by `src/test/logo-bg.test.ts`. Never resize a panel to fit a logo.
Every agenda show carries an access state (`public` = open to the public, `private` = closed event), set in the admin agenda form; the public agenda labels each card through `normalizeShowAccess` / `showAccessLabel` (`src/lib/show-access.ts`) — guarded by `src/test/show-access.test.ts`. Anything that is not explicitly `private` is treated as public.

## Route performance
Keep the site shell and each page's sections in separate modules so a route downloads only the code and media it uses; this prevents unrelated photo and video assets from slowing every page.

## Gallery presentation
Keep the editorial gallery isolated from shared site sections so gallery layout changes cannot affect other pages. Read existing gallery photo records and bundled media without writing or duplicating records; interface filters and lightbox selection live only in React state. Only expose categories backed by available media; current gallery photos are live-show records and no backstage classification exists in the admin.
Show videos (displayed on the Shows page, not the Gallery) are read exclusively from public.gallery_videos with admin-role write policies; uploaded video and cover files use private media storage and signed URLs. Legacy asset references are managed records, not a fallback, so deleting a video cannot make it reappear. Resolve each video/cover path independently to allow either file to be replaced without duplicating the unchanged media.
