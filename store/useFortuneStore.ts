import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

interface FortuneState {
  loading: boolean
  result: string | null
  streamingResult: string
  encryptedData: string | null
  templateId: number | null
  error: string | null
  setLoading: (loading: boolean) => void
  appendChunk: (chunk: string) => void
  completeStream: () => void
  setStreamRequest: (encryptedData: string, templateId: number) => void
  setError: (error: string) => void
  clear: () => void
}

const useFortuneStore = create<FortuneState>()(
  persist(
    (set, get) => ({
      loading: false,
      result: null,
      streamingResult: '',
      encryptedData: null,
      templateId: null,
      error: null,
      setLoading: (loading) => set({ loading }),
      appendChunk: (chunk) => set({ streamingResult: get().streamingResult + chunk }),
      completeStream: () => {
        const { streamingResult } = get()
        set({ result: streamingResult, streamingResult: '', loading: false, encryptedData: null, templateId: null })
      },
      setStreamRequest: (encryptedData, templateId) => set({ encryptedData, templateId, streamingResult: '', result: null, error: null }),
      setError: (error) => set({ error, loading: false, encryptedData: null, templateId: null, streamingResult: '' }),
      clear: () => set({ loading: false, result: null, streamingResult: '', encryptedData: null, templateId: null, error: null }),
    }),
    {
      name: 'fortune-store',
      storage: createJSONStorage(() => sessionStorage),
      partialize: (state) => ({
        result: state.result,
        streamingResult: state.streamingResult,
        encryptedData: state.encryptedData,
        templateId: state.templateId,
      }),
    },
  ),
)

export default useFortuneStore
