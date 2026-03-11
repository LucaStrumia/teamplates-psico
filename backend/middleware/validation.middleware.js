const validator = require('validator');

/**
 * Valida entrada de usuario
 */
function validateInput(schema) {
  return (req, res, next) => {
    const errors = {};

    Object.keys(schema).forEach(field => {
      const rules = schema[field];
      const value = req.body[field];

      // Verificar si es requerido
      if (rules.required && (!value || value.trim() === '')) {
        errors[field] = `${field} es requerido`;
        return;
      }

      // Validaciones específicas
      if (rules.type === 'email' && value && !validator.isEmail(value)) {
        errors[field] = 'Email inválido';
      }

      if (rules.minLength && value && value.length < rules.minLength) {
        errors[field] = `${field} debe tener al menos ${rules.minLength} caracteres`;
      }

      if (rules.maxLength && value && value.length > rules.maxLength) {
        errors[field] = `${field} no puede exceder ${rules.maxLength} caracteres`;
      }

      if (rules.pattern && value && !rules.pattern.test(value)) {
        errors[field] = rules.errorMessage || `${field} tiene formato inválido`;
      }
    });

    if (Object.keys(errors).length > 0) {
      return res.status(400).json({ errors });
    }

    next();
  };
}

module.exports = {
  validateInput
};
