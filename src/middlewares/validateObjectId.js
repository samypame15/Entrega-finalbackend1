import mongoose from 'mongoose';

export function validateObjectId(paramName) {
  return (req, res, next) => {
    const id = req.params[paramName];

    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: `ID inválido para el parámetro ${paramName}` });
    }

    next();
  };
}
