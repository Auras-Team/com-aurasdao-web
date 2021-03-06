export const get = async (): Promise<unknown> => {
	try {
		return {
			status: 200,
			//body: process.env
			body: { error: 'Something did not align.' }
		};
	} catch (error) {
		console.log(error);
		return {
			status: 500,
			body: {
				ok: false,
				error: 'Something did not align.'
			}
		};
	}
};
