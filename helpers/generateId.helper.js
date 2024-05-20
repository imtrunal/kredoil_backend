function generateRandomId(length) {
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  const charactersLength = characters.length;
  let id = "KL";

  for (let i = 0; i < length - 2; i++) {
    // Subtracting 2 for the length of 'KL'
    id += characters.charAt(Math.floor(Math.random() * charactersLength));
  }

  return id;
}

module.exports = { generateRandomId };
