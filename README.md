# FlavorVault

Discover and explore delicious recipes

### Setup & Run

```bash
npm ci
npm run dev
```

Open [http://localhost:4000](http://localhost:4000) with your browser to see the result.

### Run Tests

```bash
npm run test
```

# Coding Exercise

Open a PR in ≤ 45 min that:

✅ Fixes all 3 core issues.

Issues:

1. Incorporate more information into the recipe card.
   - Include the ingredients and instructions on the recipe card.
   - Optionally include a photo of the finished dish (can be a random placeholder photo, like https://picsum.photos/seed/recipe/200/300).
2. Fix failing Jest test 'create recipe'.
3. Add debouncing to the search input

Notes:

- There is a `useDebounce` hook already implemented in `src/hooks/useDebounce.ts`.

Rules:

- No use of LLMs or other AI code completion tools.
- Any public docs/snippets allowed.
- Keep commit history (no squash).
- Push (or Zip up and send) whatever is done when the timer hits—partial credit counts.

Stretch:

- Add a Create Recipe modal
- Add an optimistic update mutation using `onMutate/onError/onSettled`.

Have fun & good luck!
