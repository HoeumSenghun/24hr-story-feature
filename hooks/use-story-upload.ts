import { useCallback, useState } from 'react'
import { getStoryErrorMessage, processStoryImage } from '@/lib/stories'

export function useStoryUpload(onSuccess: (imageData: string) => void) {
  const [isProcessing, setIsProcessing] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const upload = useCallback(
    async (file: File | undefined) => {
      if (!file) {
        return
      }

      setError(null)
      setIsProcessing(true)

      try {
        const imageData = await processStoryImage(file)
        onSuccess(imageData)
      } catch (err) {
        setError(getStoryErrorMessage(err))
      } finally {
        setIsProcessing(false)
      }
    },
    [onSuccess],
  )

  const clearError = useCallback(() => {
    setError(null)
  }, [])

  return {
    upload,
    isProcessing,
    error,
    clearError,
  }
}
