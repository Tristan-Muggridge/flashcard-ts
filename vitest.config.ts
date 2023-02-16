import {defineConfig} from 'vitest/config'

export default defineConfig({
    define: {
        "import.meta.vitest": "undefined" // prevents testing in ts file from being sent to client
    },
    test: {
        includeSource: ["src/**/*.{js,ts}"],
        coverage: {
            reporter: ["text", "html"]
        }
    }
})