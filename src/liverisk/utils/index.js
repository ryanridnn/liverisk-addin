export const convertData = (message) => {
	return JSON.parse(message.data);
};

export const generateRandomNumber = (min = 0, max = 100) => {
	return Math.random() * (max - min) + min;
};
