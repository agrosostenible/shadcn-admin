import { Shield, User } from 'lucide-react'

export const roles = [
  {
    label: 'User',
    value: 'user',
    icon: User,
  },
  {
    label: 'Admin',
    value: 'admin',
    icon: Shield,
  },
] as const
