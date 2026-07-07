import type { Role } from '../models/User'

export type MenuContext = 'anon' | Role

export interface MenuItem {
  id: string
  label: string
  to: string
  roles: MenuContext[]
  requiresVerified?: boolean
}

export const MENU_ITEMS: MenuItem[] = [
  {
    id: 'buscar-pisos',
    label: 'Buscar piso',
    to: '/pisos',
    roles: ['anon', 'docente', 'propietario', 'admin'],
  },
  {
    id: 'publicar-piso',
    label: 'Publicar piso',
    to: '/pisos/nuevo',
    roles: ['propietario', 'admin'],
    requiresVerified: true,
  },
  {
    id: 'mi-panel',
    label: 'Mi panel',
    to: '/dashboard',
    roles: ['docente', 'propietario', 'admin'],
  },
  {
    id: 'panel-admin',
    label: 'Panel admin',
    to: '/admin',
    roles: ['admin'],
  },
  {
    id: 'contacto',
    label: 'Contacto',
    to: '/contacto',
    roles: ['anon', 'docente', 'propietario', 'admin'],
  },
  {
    id: 'sobre-nosotros',
    label: 'Sobre nosotros',
    to: '/sobre-nosotros',
    roles: ['anon', 'docente', 'propietario', 'admin'],
  },
]

export function getMenuItems(context: MenuContext, verified: boolean): MenuItem[] {
  return MENU_ITEMS.filter((item) => {
    if (!item.roles.includes(context)) return false
    if (item.requiresVerified && !verified) return false
    return true
  })
}