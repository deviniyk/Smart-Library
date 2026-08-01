import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// IMPORTANT: if you create a new repo with a different name, change the
// value below to match: base: '/YOUR-NEW-REPO-NAME/'
// (This must exactly match your GitHub repository name, case-sensitive.)
export default defineConfig({
  plugins: [react()],
  base: '/Smart-Library/',
})
