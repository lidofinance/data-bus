export const sleep = (ms: number) =>
  new Promise((resolve) => setTimeout(resolve, ms));

export const randomInt = (min: number, max: number) =>
  Math.floor(Math.random() * (max - min + 1)) + min;
