export const validateRequest = (schema) => (req, res, next) => {
  try {
    const parsed = schema.parse({
      body: req.body,
      query: req.query,
      params: req.params,
    });
    // Replace validated portions
    req.body = parsed.body || req.body;
    req.query = parsed.query || req.query;
    req.params = parsed.params || req.params;
    next();
  } catch (err) {
    const errorDetails = err.errors?.map((e) => ({
      field: e.path.join('.').replace(/^(body|query|params)\./, ''),
      issue: e.message,
    })) || [{ issue: err.message }];

    return res.status(400).json({
      success: false,
      error: {
        code: 'VALIDATION_FAILED',
        message: 'Invalid input parameters or request body format.',
        details: errorDetails,
        timestamp: new Date().toISOString(),
      },
    });
  }
};
