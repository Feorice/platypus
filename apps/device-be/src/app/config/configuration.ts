export default () => ({
	port: parseInt(process.env.PORT as string, 10) || 3000,
	relayOptions: [
		{
			name: 'RELAY_ONE',
			pin: parseInt(process.env.RELAY_ONE_PIN as string, 10),
			mode: 'output',
			value: 1,
		},
		{
			name: 'RELAY_TWO',
			pin: parseInt(process.env.RELAY_TWO_PIN as string, 10),
			mode: 'output',
			value: 1,
		},
		{
			name: 'RELAY_THREE',
			pin: parseInt(process.env.RELAY_THREE_PIN as string, 10),
			mode: 'output',
			value: 1,
		},
		{
			name: 'RELAY_FOUR',
			pin: parseInt(process.env.RELAY_FOUR_PIN as string, 10),
			mode: 'output',
			value: 1,
		},
	],
	platform: process.env.PLATFORM as string,
});
