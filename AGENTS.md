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
