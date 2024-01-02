export const isValidName = (name) => {
    return /^[^0-9!`~=+\-)(*&%,@\\|}{\[\];:'"<>,.?/$]*$/.test(name)
}

export const isBoolean = (char) => {
    return char === 'true' || char === 'false'
}
