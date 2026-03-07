import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

interface FortuneState {
  loading: boolean
  result: string | null
  setLoading: (loading: boolean) => void
  setResult: (result: string) => void
  clear: () => void
}

const useFortuneStore = create<FortuneState>()(
  persist(
    (set) => ({
      loading: false,
      result: null,
      setLoading: (loading) => set({ loading }),
      setResult: (result) => set({ result, loading: false }),
      clear: () => set({ loading: false, result: null }),
    }),
    {
      name: 'fortune-store',
      storage: createJSONStorage(() => sessionStorage),
      partialize: (state) => ({ result: state.result }),
    },
  ),
)

export default useFortuneStore
