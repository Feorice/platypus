export default () => ({
	port: parseInt(process.env.PORT as string, 10) || 3000,
	relayOptions: [
		{
			RELAY_ONE: { pin: parseInt(process.env.RELAY_ONE_PIN as string, 10) },
		},
		{
			RELAY_TWO: { pin: parseInt(process.env.RELAY_TWO_PIN as string, 10) },
		},
		{
			RELAY_THREE: { pin: parseInt(process.env.RELAY_THREE_PIN as string, 10) },
		},
		{
			RELAY_FOUR: { pin: parseInt(process.env.RELAY_FOUR_PIN as string, 10) },
		},
	],
	platform: process.env.PLATFORM as string,
});
