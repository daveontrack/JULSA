declare module 'next/navigation' {
  export function useRouter(): { refresh(): void; replace(href: string): void }
  export function usePathname(): string | null
  export function redirect(href: string): never
}
