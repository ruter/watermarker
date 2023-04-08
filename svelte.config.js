import adapter from '@sveltejs/adapter-static';
import { vitePreprocess } from '@sveltejs/kit/vite';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	preprocess: vitePreprocess(),

	kit: {
		adapter: adapter({
			pages: 'build', // 输出目录
			assets: 'build', // 静态资源目录
			fallback: null, // 404 页面
			strict: true,
		}),
		prerender: {
			handleMissingId: "ignore",
		},
	}
};

export default config;
