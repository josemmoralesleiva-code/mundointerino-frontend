export const verifyEmailMessages: Record<string, string> = {
  'token-invalido': 'El enlace no es válido o ya ha sido utilizado.',
  'token-expirado': 'El enlace ha caducado. Puedes solicitar uno nuevo.',
  'demasiados-intentos': 'Has realizado demasiados intentos. Espera unos minutos.',
  'usuario-ya-verificado': 'Tu cuenta ya estaba verificada. Puedes iniciar sesión.',
  'usuario-no-encontrado': 'No encontramos ninguna cuenta con ese correo.',
}

export function translateVerifyEmailError(code?: string): string {
  if (!code) return 'Se ha producido un error. Inténtalo de nuevo.'
  return verifyEmailMessages[code] ?? code
}
