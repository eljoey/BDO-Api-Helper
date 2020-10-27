const mcache = require('memory-cache');

const cache = (duration) => {
  return (req, res, next) => {
    const key = 'BDO' + req.originalUrl || req.url;
    const cachedBody = mcache.get(key);

    if (cachedBody) {
      return res.json(cachedBody);
    } else {
      res.sendResponse = res.json;
      res.json = (body) => {
        mcache.put(key, body, duration * 1000);
        res.sendResponse(body);
      };
      next();
    }
  };
};

const unknownEndpoint = (req, res) => {
  res.status(404).send({ error: 'unknown endpoint' });
};

const errorHandler = (error, req, res, next) => {

  if (error.name === 'CastError' && error.kind === 'ObjectId') {
    return res.status(400).send({ error: 'malformatted id' });
  } else if (error.name === 'ValidationError') {
    return res.status(400).json({ error: error.message });
  } else if (error.name === 'JsonWebTokenError') {
    return res.status(400).json({ error: error.message });
  }
  next(error);
};

module.exports = {
  cache,
  unknownEndpoint,
  errorHandler
};
