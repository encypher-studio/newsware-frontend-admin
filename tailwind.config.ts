import { TailwindPreset } from "@newsware/ui"
import { Config } from "tailwindcss"

const config: Config = {
	presets: [TailwindPreset],
	content: [
		"./src/**/*.{js,jsx,ts,tsx}",
		"./node_modules/@newsware/ui/dist/**/*.{js,jsx,ts,tsx}"
	],
}

export default config