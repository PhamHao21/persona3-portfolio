import icon1 from '$lib/assets/icon1.png';
import icon2 from '$lib/assets/icon2.png';
import icon3 from '$lib/assets/icon3.png';
import mainm from '$lib/assets/mainm.jpeg';
import mainm2 from '$lib/assets/mainm2.jpeg';
import mainf from '$lib/assets/mainf.jpeg';

export const aboutImages = [mainm, mainm2, mainf];

export const revealContent = [
	{
		upper: ['name moneybagg', 'age:23'],
		lower: 'major: computer science'
	},
	{
		upper: [
			'Cleopatra lived closer to the Moon landing than to the building of the pyramids.',
			'Vikings kept cats on ships for pest control.',
			'In medieval Europe, animals could be put on trial for crimes.'
		],
		lower: 'above is some history fun fact'
	},
	{
		upper: [
			'Oxford University founding is older than the Aztec Empire.',
			'The shortest war in history lasted 38-45 minutes.',
			'Humans have been writing for about 5,000 years.'
		],
		lower: "yes it's a placeholder"
	}
];

export const aboutItems = [
	{
		id: 'about',
		label: 'ABOUT ME',
		barIcon: icon1
	},
	{
		id: 'facts',
		label: 'FUN FACT ABOUT ME',
		barIcon: icon2
	},
	{
		id: 'weird',
		label: 'WEIRD FACT ABOUT ME',
		barIcon: icon3
	}
];
