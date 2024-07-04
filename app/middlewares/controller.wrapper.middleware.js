// Middleware to wrap the controller in a try-catch block to handle errors
// We use this middleware in our router to wrap the controller
export default (controller) => async (req, res, next) => {
  try {
    return await controller(req, res, next);
  } catch (err) {
    console.error(err);
    return res.status(400).json({ errorMessage: err.message });
  }
};
