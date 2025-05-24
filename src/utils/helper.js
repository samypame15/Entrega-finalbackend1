
export const helpers = {
  multiply: (a, b) => {
    if (typeof a !== 'number' || typeof b !== 'number') return '0';
    const result = a * b;
    return new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP' }).format(result);
  },
  formatCurrency: (value) => {
    if (typeof value !== 'number') return '0';
    return new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP' }).format(value);
  }
};
