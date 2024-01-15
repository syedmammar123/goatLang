const startTime = Date.now();

export const checkIfInfiniteLoop = () => {
    if (Date.now() - startTime > 5000) {
        throw new Error('Infinite loop detected');
    }
}
