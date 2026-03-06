import { create } from 'zustand'

interface FortuneState {
  loading: boolean
  result: string | null
  setLoading: (loading: boolean) => void
  setResult: (result: string) => void
  clear: () => void
}

const useFortuneStore = create<FortuneState>((set) => ({
  loading: false,
  result: null,
  setLoading: (loading) => set({ loading }),
  setResult: (result) => set({ result, loading: false }),
  clear: () => set({ loading: false, result: null }),
}))

export default useFortuneStore
