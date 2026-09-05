export const validateName = (name) => {
  if (!name.trim()) return 'El nombre es obligatorio.';
  if (name.length < 3) return 'Debe tener al menos 3 caracteres.';
  return '';
};

export const validateEmail = (email) => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email.trim()) return 'El correo es obligatorio.';
  if (!regex.test(email)) return 'Formato de correo inválido.';
  return '';
};

export const getPasswordStrength = (password) => {
  if (!password) return { strength: '', color: 'transparent' };
  if (password.length < 6) return { strength: 'Débil', color: 'red' };
  if (password.length < 10 || !/[A-Z]/.test(password) || !/[0-9]/.test(password)) {
    return { strength: 'Media', color: 'orange' };
  }
  if (password.length < 15 || !/[A-Z]/.test(password) || !/[0-9]/.test(password)) {
    return {  strength: 'Fuerte', color: 'green'};
  }
};

export const validatePassword = (password) => {
  if (!password) return 'La contraseña es obligatoria.';
  if (password.length < 6) return 'Mínimo 6 caracteres.';
  return '';
};

export const validatePhone = (phone) => {
  const regex = /^[0-9]{9}$/;
  if (!phone.trim()) return 'El teléfono es obligatorio.';
  if (!regex.test(phone)) return 'Debe tener 9 dígitos numéricos.';
  return '';
};