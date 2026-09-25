export const profileSections = [
	{
		code: '01',
		label: 'IDENTITY',
		title: 'Creative frontend developer',
		description:
			'I build expressive web interfaces where motion, visual systems, and usable interaction support the same idea.',
		points: ['Computer Science', 'Based in Vietnam', 'Open to frontend opportunities'],
		accent: '#67ecff'
	},
	{
		code: '02',
		label: 'APPROACH',
		title: 'Design with a reason',
		description:
			'I turn strong references into reusable components, then tune the details until the experience feels deliberate on every screen.',
		points: ['Interaction systems', 'Responsive UI', 'Performance-aware motion'],
		accent: '#ff4f70'
	},
	{
		code: '03',
		label: 'CURRENT ARC',
		title: 'Sharper products, stronger stories',
		description:
			'I am currently refining portfolio work, exploring richer transitions, and building interfaces that are memorable without becoming difficult to use.',
		points: ['SvelteKit experiments', 'Game-inspired UI', 'Case-study documentation'],
		accent: '#ffffff'
	}
];

export const skillGroups = [
	{
		code: 'I',
		label: 'FRONTEND',
		subtitle: 'Core implementation',
		rank: '05',
		description: 'Component-driven interfaces with clean state, responsive behavior, and maintainable structure.',
		skills: [
			{ name: 'Svelte / SvelteKit', level: 92, note: 'Components, routing, runes' },
			{ name: 'JavaScript', level: 88, note: 'Interaction and application logic' },
			{ name: 'HTML / CSS', level: 94, note: 'Layout, responsive systems, motion' }
		]
	},
	{
		code: 'II',
		label: 'INTERACTION',
		subtitle: 'Motion and feedback',
		rank: '04',
		description: 'Animation systems that communicate state and give an interface its own rhythm.',
		skills: [
			{ name: 'CSS Motion', level: 90, note: 'Keyframes, easing, choreography' },
			{ name: 'Canvas / WebGL', level: 72, note: 'Custom visual transitions' },
			{ name: 'Micro-interactions', level: 86, note: 'Input, focus, hover, feedback' }
		]
	},
	{
		code: 'III',
		label: 'DESIGN',
		subtitle: 'Visual systems',
		rank: '04',
		description: 'Reference-led design translated into consistent typography, spacing, color, and reusable patterns.',
		skills: [
			{ name: 'UI Systems', level: 86, note: 'Tokens and component patterns' },
			{ name: 'Responsive Design', level: 88, note: 'Desktop through mobile' },
			{ name: 'Prototyping', level: 80, note: 'Fast iteration and visual testing' }
		]
	},
	{
		code: 'IV',
		label: 'WORKFLOW',
		subtitle: 'Shipping reliably',
		rank: '03',
		description: 'A practical workflow from source control and testing through optimized production builds.',
		skills: [
			{ name: 'Git / GitHub', level: 82, note: 'Version control and collaboration' },
			{ name: 'Vite / Vitest', level: 76, note: 'Tooling and verification' },
			{ name: 'Vercel', level: 78, note: 'Preview and production delivery' }
		]
	}
];

export const portfolioProjects = [
	{
		code: 'P-01',
		title: 'PERSONA 3 PORTFOLIO',
		category: 'INTERACTIVE WEB EXPERIENCE',
		status: 'ACTIVE',
		year: '2026',
		description:
			'A portfolio experience that translates Persona 3 visual language into responsive web interaction without sacrificing clear navigation.',
		challenge: 'Unify video, shader transitions, keyboard input, and content-heavy portfolio screens.',
		result: 'A reusable SvelteKit interface system with synchronized motion and game-inspired navigation.',
		tags: ['SVELTEKIT', 'WEBGL', 'MOTION'],
		href: 'https://github.com/PhamHao21'
	},
	{
		code: 'P-02',
		title: 'INTERACTION LAB',
		category: 'FRONTEND EXPERIMENTS',
		status: 'ONGOING',
		year: '2026',
		description:
			'A growing collection of interface studies focused on transitions, tactile feedback, and expressive navigation patterns.',
		challenge: 'Keep complex motion responsive, accessible, and easy to reuse across different layouts.',
		result: 'A practical motion vocabulary built from small, testable interaction patterns.',
		tags: ['CSS', 'CANVAS', 'PROTOTYPING'],
		href: 'https://github.com/PhamHao21'
	},
	{
		code: 'P-03',
		title: 'NEXT CASE STUDY',
		category: 'IN DEVELOPMENT',
		status: 'LOCKED',
		year: 'SOON',
		description:
			'The next project slot is reserved for a complete product case study: problem, process, implementation, and measurable result.',
		challenge: 'Document the decisions behind the interface—not only the finished screenshots.',
		result: 'Coming soon.',
		tags: ['PRODUCT', 'UX', 'BUILD'],
		href: null
	}
];

export const workTimeline = [
	{
		code: 'NOW',
		period: 'CURRENT STATUS',
		role: 'FRONTEND / CREATIVE DEVELOPER',
		organization: 'OPEN TO OPPORTUNITIES',
		status: 'AVAILABLE',
		description:
			'Looking for work where strong frontend craft, visual detail, and thoughtful interaction are treated as product quality.',
		focus: ['Frontend development', 'Creative UI engineering', 'Design implementation']
	},
	{
		code: '2026',
		period: 'FEATURED BUILD',
		role: 'PERSONA 3 PORTFOLIO',
		organization: 'INDEPENDENT PROJECT',
		status: 'IN PROGRESS',
		description:
			'Designed and implemented a themed SvelteKit portfolio with custom WebGL transitions, video choreography, and keyboard navigation.',
		focus: ['SvelteKit architecture', 'Motion direction', 'Responsive interface']
	},
	{
		code: 'EXP',
		period: 'CONTINUOUS PRACTICE',
		role: 'COMPUTER SCIENCE + WEB',
		organization: 'LEARNING ARC',
		status: 'ONGOING',
		description:
			'Building stronger fundamentals through coursework, interface experiments, source control, and production deployment.',
		focus: ['Computer science', 'Modern web tooling', 'Visual systems']
	}
];
