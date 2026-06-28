// vite.config.ts
import path from "node:path"
import { fileURLToPath } from "node:url"
import { TanStackRouterVite } from "file:///D:/Kuliah/Semester%206/kecerdasan%20buatan/strokecareAi/node_modules/.pnpm/@tanstack+router-plugin@1.1_8ae5f4442b1598056b4954459a8ee7f2/node_modules/@tanstack/router-plugin/dist/esm/vite.js"
import react from "file:///D:/Kuliah/Semester%206/kecerdasan%20buatan/strokecareAi/node_modules/.pnpm/@vitejs+plugin-react@4.7.0_vite@5.4.21_@types+node@20.19.43_/node_modules/@vitejs/plugin-react/dist/index.js"
import { defineConfig } from "file:///D:/Kuliah/Semester%206/kecerdasan%20buatan/strokecareAi/node_modules/.pnpm/vite@5.4.21_@types+node@20.19.43/node_modules/vite/dist/node/index.js"
var __vite_injected_original_import_meta_url =
	"file:///D:/Kuliah/Semester%206/kecerdasan%20buatan/strokecareAi/apps/web/vite.config.ts"
var __dirname = path.dirname(fileURLToPath(__vite_injected_original_import_meta_url))
var vite_config_default = defineConfig({
	envDir: "../../",
	plugins: [TanStackRouterVite(), react()],
	resolve: {
		alias: {
			"@web": path.resolve(__dirname, "./src"),
			"@api": path.resolve(__dirname, "../api/src"),
		},
	},
	server: {
		proxy: {
			"/api": {
				target: "http://localhost:3001",
				changeOrigin: true,
			},
			"/rpc": {
				target: "http://localhost:3001",
				changeOrigin: true,
			},
		},
	},
	build: {},
})
export { vite_config_default as default }
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJEOlxcXFxLdWxpYWhcXFxcU2VtZXN0ZXIgNlxcXFxrZWNlcmRhc2FuIGJ1YXRhblxcXFxzdHJva2VjYXJlQWlcXFxcYXBwc1xcXFx3ZWJcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIkQ6XFxcXEt1bGlhaFxcXFxTZW1lc3RlciA2XFxcXGtlY2VyZGFzYW4gYnVhdGFuXFxcXHN0cm9rZWNhcmVBaVxcXFxhcHBzXFxcXHdlYlxcXFx2aXRlLmNvbmZpZy50c1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vRDovS3VsaWFoL1NlbWVzdGVyJTIwNi9rZWNlcmRhc2FuJTIwYnVhdGFuL3N0cm9rZWNhcmVBaS9hcHBzL3dlYi92aXRlLmNvbmZpZy50c1wiO2ltcG9ydCBwYXRoIGZyb20gXCJub2RlOnBhdGhcIlxuaW1wb3J0IHsgZmlsZVVSTFRvUGF0aCB9IGZyb20gXCJub2RlOnVybFwiXG5pbXBvcnQgeyBUYW5TdGFja1JvdXRlclZpdGUgfSBmcm9tIFwiQHRhbnN0YWNrL3JvdXRlci1wbHVnaW4vdml0ZVwiXG5pbXBvcnQgcmVhY3QgZnJvbSBcIkB2aXRlanMvcGx1Z2luLXJlYWN0XCJcbmltcG9ydCB7IGRlZmluZUNvbmZpZyB9IGZyb20gXCJ2aXRlXCJcblxuY29uc3QgX19kaXJuYW1lID0gcGF0aC5kaXJuYW1lKGZpbGVVUkxUb1BhdGgoaW1wb3J0Lm1ldGEudXJsKSlcblxuZXhwb3J0IGRlZmF1bHQgZGVmaW5lQ29uZmlnKHtcblx0ZW52RGlyOiBcIi4uLy4uL1wiLFxuXHRwbHVnaW5zOiBbVGFuU3RhY2tSb3V0ZXJWaXRlKCksIHJlYWN0KCldLFxuXHRyZXNvbHZlOiB7XG5cdFx0YWxpYXM6IHtcblx0XHRcdFwiQHdlYlwiOiBwYXRoLnJlc29sdmUoX19kaXJuYW1lLCBcIi4vc3JjXCIpLFxuXHRcdFx0XCJAYXBpXCI6IHBhdGgucmVzb2x2ZShfX2Rpcm5hbWUsIFwiLi4vYXBpL3NyY1wiKSxcblx0XHR9LFxuXHR9LFxuXHRzZXJ2ZXI6IHtcblx0XHRwcm94eToge1xuXHRcdFx0XCIvYXBpXCI6IHtcblx0XHRcdFx0dGFyZ2V0OiBcImh0dHA6Ly9sb2NhbGhvc3Q6MzAwMVwiLFxuXHRcdFx0XHRjaGFuZ2VPcmlnaW46IHRydWUsXG5cdFx0XHR9LFxuXHRcdFx0XCIvcnBjXCI6IHtcblx0XHRcdFx0dGFyZ2V0OiBcImh0dHA6Ly9sb2NhbGhvc3Q6MzAwMVwiLFxuXHRcdFx0XHRjaGFuZ2VPcmlnaW46IHRydWUsXG5cdFx0XHR9LFxuXHRcdH0sXG5cdH0sXG5cdGJ1aWxkOiB7fSxcbn0pXG4iXSwKICAibWFwcGluZ3MiOiAiO0FBQXdYLE9BQU8sVUFBVTtBQUN6WSxTQUFTLHFCQUFxQjtBQUM5QixTQUFTLDBCQUEwQjtBQUNuQyxPQUFPLFdBQVc7QUFDbEIsU0FBUyxvQkFBb0I7QUFKZ04sSUFBTSwyQ0FBMkM7QUFNOVIsSUFBTSxZQUFZLEtBQUssUUFBUSxjQUFjLHdDQUFlLENBQUM7QUFFN0QsSUFBTyxzQkFBUSxhQUFhO0FBQUEsRUFDM0IsUUFBUTtBQUFBLEVBQ1IsU0FBUyxDQUFDLG1CQUFtQixHQUFHLE1BQU0sQ0FBQztBQUFBLEVBQ3ZDLFNBQVM7QUFBQSxJQUNSLE9BQU87QUFBQSxNQUNOLFFBQVEsS0FBSyxRQUFRLFdBQVcsT0FBTztBQUFBLE1BQ3ZDLFFBQVEsS0FBSyxRQUFRLFdBQVcsWUFBWTtBQUFBLElBQzdDO0FBQUEsRUFDRDtBQUFBLEVBQ0EsUUFBUTtBQUFBLElBQ1AsT0FBTztBQUFBLE1BQ04sUUFBUTtBQUFBLFFBQ1AsUUFBUTtBQUFBLFFBQ1IsY0FBYztBQUFBLE1BQ2Y7QUFBQSxNQUNBLFFBQVE7QUFBQSxRQUNQLFFBQVE7QUFBQSxRQUNSLGNBQWM7QUFBQSxNQUNmO0FBQUEsSUFDRDtBQUFBLEVBQ0Q7QUFBQSxFQUNBLE9BQU8sQ0FBQztBQUNULENBQUM7IiwKICAibmFtZXMiOiBbXQp9Cg==
