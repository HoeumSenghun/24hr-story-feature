export type StoryErrorCode =
  | 'INVALID_FILE'
  | 'FILE_TOO_LARGE'
  | 'INVALID_IMAGE'
  | 'STORY_LIMIT_REACHED'
  | 'STORAGE_FAILED'
  | 'PROCESSING_FAILED'

export class StoryError extends Error {
  readonly code: StoryErrorCode

  constructor(code: StoryErrorCode, message: string) {
    super(message)
    this.name = 'StoryError'
    this.code = code
  }
}

export function getStoryErrorMessage(error: unknown) {
  if (error instanceof StoryError) {
    return error.message
  }

  if (error instanceof Error) {
    return error.message
  }

  return 'Something went wrong'
}
