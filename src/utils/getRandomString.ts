export const getRandomString = (length: number): string => {
  const possible =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const text = [];
  for (let i = 0; i < length; i++) {
    text.push(possible.charAt(Math.floor(Math.random() * possible.length)));
  }
  return text.join('');
};
