# How TanStack React Query Works in PressIt

This document explains the data flow of our application now that we have successfully reverted to **TanStack React Query**.

## 1. The Global Cache (`useQuery`)
At the heart of the app is the `useMe` hook located in `client/hooks/useMe.ts`:

```typescript
export function useMe() {
  return useQuery({
    queryKey: ["me"],
    queryFn: async () => { ... }
  });
}
```

Whenever any component (like the `Navbar` or `ProfilePage`) calls `useMe()`, TanStack checks its **global cache** for the key `["me"]`.
- If the data isn't there, it fetches it from the server and caches it.
- If the data *is* there, it instantly returns the cached data to the component (no loading spinners!).
- If multiple components call `useMe()` at the exact same time, TanStack automatically deduplicates the request so your server is only hit once.

## 2. Performing Actions (`useMutation`)
When a user performs an action that changes data on the server (like logging out, updating their profile picture, or compressing an image), we use `useMutation`.

For example, in `EditProfilePictureButton.tsx`:

```typescript
  // First, we get access to the queryClient which manages our cache
  const queryClient = useQueryClient();

  const uploadMutation = useMutation({
    mutationFn: uploadProfilePicture,
    onSuccess: () => {
      // Action was successful! Tell the queryClient to invalidate the cache
      queryClient.invalidateQueries({ queryKey: ["me"] });
    }
  });

  // Triggering the action
  uploadMutation.mutate(file);
```

`useMutation` automatically gives us access to helpful states like `uploadMutation.isPending`, which we use to easily disable buttons and show loading spinners without needing to manually create `const [isLoading, setIsLoading] = useState(false)`.

## 3. The "Magic" Cache Invalidation
The most powerful feature of TanStack Query is what happens inside the `onSuccess` block of our mutations:

```typescript
queryClient.invalidateQueries({ queryKey: ["me"] });
```

When an action succeeds (like an image is compressed), we tell TanStack to "invalidate" the `["me"]` cache key.
This tells TanStack: *"Hey, the user's data on the server has changed. The data you have cached is now stale."*

**What happens next is automatic:**
1. TanStack instantly triggers a silent background refetch to `/auth/me`.
2. When the fresh data arrives (e.g., the new usage limit), TanStack seamlessly swaps it into the cache.
3. **Every single component** currently on the screen that uses `useMe()` (like the Profile Page and Navbar) is instantly re-rendered with the new data.

This is why you don't need `window.location.reload()` or manual `useEffect` hooks to keep the Profile page up to date. The data flows magically from the mutation -> to the cache -> to the UI!
