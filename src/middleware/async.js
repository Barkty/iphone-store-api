/**
 * 
 * @param {*} fn 
 * @returns 
 */
const asyncWrapper = (fn) => async (req, res, next) => {
    try {
        await fn(req, res, next);
    } catch (error) {
        // eslint-disable-next-line no-console
        console.log(error);
        next(error);
    }
};
  
export default asyncWrapper;
  