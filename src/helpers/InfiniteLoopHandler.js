const startTime = Date.now();

export const checkIfInfiniteLoop = () => {
    console.log(startTime, Date.now())
    if (Date.now() - startTime > 5000) {
        throw new Error('Infinite loop detected');
    }
}
