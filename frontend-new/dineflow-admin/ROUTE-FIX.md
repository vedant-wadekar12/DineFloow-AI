# Preview route fix

The preview navigation is implemented under `/preview/*` so these URLs are valid:

- /preview
- /preview/accounts
- /preview/subscriptions
- /preview/access
- /preview/audit

After replacing the folder, stop the old Vite process with Ctrl+C and restart `npm run dev`.
If Chrome still shows the old bundle, hard refresh with Ctrl+Shift+R.
