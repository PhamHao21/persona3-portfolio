import icon1 from '$lib/assets/icon1.png';
import icon2 from '$lib/assets/icon2.png';
import icon3 from '$lib/assets/icon3.png';

export const socialRoles = [
	{ text: 'LEADER', color: '#e8c100' },
	{ text: 'PARTY', color: '#4a8fff' },
	{ text: 'PARTY', color: '#4a8fff' }
];

export const socialItems = [
	{
		id: 'twitch',
		label: 'TWITCH',
		handle: '@yourname',
		href: 'https://twitch.tv/yourname',
		barIcon: icon1,
		bars: 1,
		newBars: [0],
		counts: ['56'],
		links: ['twitch.tv/videos/2041837265'],
		stats: [
			{ tag: 'FOL', value: '1.2K', color: '#9147ff' },
			{ tag: 'VWR', value: '042', color: '#bf94ff' }
		]
	},
	{
		id: 'instagram',
		label: 'INSTAGRAM',
		handle: '@yourhandle',
		href: 'https://instagram.com/yourhandle',
		barIcon: icon2,
		bars: 5,
		newBars: [1, 2],
		counts: ['3.4M', '2.5M', '676K', '412K', '198K'],
		links: ['instagram.com/p/C4xQmRrNk2a', 'instagram.com/p/C3wLpBsOj7f', 'instagram.com/reel/C2vKoArMi6e', 'instagram.com/p/C1uJnZqLh5d', 'instagram.com/reel/C0tImYpKg4c'],
		stats: [
			{ tag: 'FOL', value: '3.4K', color: '#e1306c' },
			{ tag: 'PST', value: '128', color: '#f77737' }
		]
	},
	{
		id: 'tiktok',
		label: 'TIKTOK',
		handle: '@yourhandle',
		href: 'https://tiktok.com/@yourhandle',
		barIcon: icon3,
		bars: 7,
		newBars: [0, 3, 5, 6],
		counts: ['5.1M', '3.7M', '2.2M', '1.4M', '831K', '490K', '217K'],
		links: ['tiktok.com/@yourhandle/video/7318492016374859054', 'tiktok.com/@yourhandle/video/7305837261940183342', 'tiktok.com/@yourhandle/video/7291046385720348974', 'tiktok.com/@yourhandle/video/7278392047163820334', 'tiktok.com/@yourhandle/video/7264819203847165742', 'tiktok.com/@yourhandle/video/7251047382916430126', 'tiktok.com/@yourhandle/video/7237294018463851822'],
		stats: [
			{ tag: 'FOL', value: '8.9K', color: '#00f2ea' },
			{ tag: 'LKS', value: '52K', color: '#ff0050' }
		]
	}
];
