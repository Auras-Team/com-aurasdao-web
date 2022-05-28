const defaultTheme = require('tailwindcss/defaultTheme')

const config = {
	content: ['./src/**/*.{html,js,svelte,ts}'],

	theme: {
		fontFamily: {
			'sans': ['raleway', ...defaultTheme.fontFamily.sans],
			'mono': ['roboto-mono', ...defaultTheme.fontFamily.mono],
			'serif': ['roboto-slab', ...defaultTheme.fontFamily.serif],
		},
		extend: {}
	},

	plugins: []
};

module.exports = config;
