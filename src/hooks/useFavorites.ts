import { useLocalStorage } from './useLocalStorage'

export function useFavorites() {
  const [ids, setIds] = useLocalStorage<string[]>('paraat_favorites', [])

  const toggle = (id: string) =>
    setIds((prev) => prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id])

  const isFav = (id: string) => ids.includes(id)

  return { ids, toggle, isFav }
}
