# Project Improvements for 9.5/10

1. Refactor repeated UI logic
- Convert `src/SideBar.jsx` from repeated `NavLink` blocks into a route-config array and map.
- Extract button/list styling into reusable components if needed.

2. Centralize auth & token handling
- Create an auth utility or React context for token storage, user state, login/logout, and auth checks.
- Move `localStorage.getItem("token")` / `removeItem` out of `api.js` and `ProtectedRoute.jsx`.
- Replace `window.location.href = "/login"` in `api.js` with a controlled error state or callback.

3. Improve API layer
- Normalize `request()` responses and errors into a single structured format.
- Add URL validation for `API_URL` and a clear error when it is missing.
- Avoid duplicated request patterns in `api.js`; extract common POST/GET helpers.
- Rename confusing helper functions like `apiGet` to something more explicit if needed.

4. Clean up navigation logic
- Remove unused imports like `useNavigate` in `src/SideBar.jsx`.
- Simplify `src/LogOut.jsx` so it only performs logout and redirects cleanly.

5. Separate concerns in data pages
- Extract repeated fetch/useEffect logic in pages like `Dashboard.jsx` into custom hooks (e.g. `useDashboardStats`, `useFetchResource`).
- Reduce large component state blobs by splitting form state from list state.

6. Improve table component architecture
- Refactor `src/Table.jsx` so it is less monolithic:
  - Move confirmation/delete handling into a smaller helper or component.
  - Separate editing state from rendering state.
  - Avoid passing too many props through the table component.

7. Strengthen typing and linting
- Add `propTypes` or TypeScript to key components.
- Tighten ESLint rules for unused imports, consistent formatting, and hook dependency arrays.
- Remove unnecessary devDependencies like `util` if unused.

8. Add tests and coverage
- Add unit tests for:
  - `src/api.js` request handling
  - `src/ProtectedRoute.jsx`
  - `src/SideBar.jsx`
  - `src/Login.jsx`
- Add component tests for table behavior and auth flows.

9. Improve README accuracy
- Ensure README matches actual package versions and repo structure.
- Document required backend endpoints and auth contract clearly.

10. Polish UX and error handling
- Standardize error notifications across pages.
- Add loading states and fallback UI where missing.
- Ensure chart/data fetch failures are handled gracefully.
