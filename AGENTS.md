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

Use the shared Logo component for header and footer branding, with uploaded media referenced through Lovable Assets pointers; derive the favicon from the same logo to keep the brand consistent.

## Browser tabs stay independent

Never persist interface state (current page, scroll position, menu, lightbox) to
`localStorage`, `sessionStorage`, cookies or IndexedDB. Keep it in React state,
the URL, or the router's per-tab scroll cache, so two open tabs never influence
each other. Guarded by `src/test/tab-independence.test.ts`.

## Admin content
Sponsors, agenda shows and page photos live in Lovable Cloud tables; images go in the private `media` bucket and are shown via signed URLs (public buckets are blocked in this workspace). The first account created becomes the only admin; writes are allowed only for the admin role.
A sponsor may carry an optional destination address: when it has one, its logo on the public site opens that address in a new tab; when it has none, the logo stays non-clickable. Typed addresses are sanitized to plain http(s) by `normalizeSponsorLink` (`src/lib/sponsor-link.ts`) so a logo can never open a script — guarded by `src/test/sponsor-link.test.ts`.
