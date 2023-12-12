export const isValidName = (name) => {
  return /^[^0-9!`~=+\-)(*&%,@\\|}{\[\];:'"<>,.?/$]*$/.test(name);
};
