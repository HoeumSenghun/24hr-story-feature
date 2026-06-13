import { MAX_IMAGE_HEIGHT, MAX_IMAGE_WIDTH } from './constants'
import { StoryError } from './errors'
import { isValidImageDataUrl, validateUploadFile } from './validators'

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const image = new Image()
    image.onload = () => resolve(image)
    image.onerror = () => reject(new StoryError('INVALID_IMAGE', 'Failed to load image'))
    image.src = src
  })
}

function getScaledDimensions(
  width: number,
  height: number,
  maxWidth: number,
  maxHeight: number,
) {
  const scale = Math.min(maxWidth / width, maxHeight / height, 1)

  return {
    width: Math.round(width * scale),
    height: Math.round(height * scale),
  }
}

export async function processStoryImage(file: File): Promise<string> {
  validateUploadFile(file)

  const objectUrl = URL.createObjectURL(file)

  try {
    const image = await loadImage(objectUrl)

    if (image.naturalWidth === 0 || image.naturalHeight === 0) {
      throw new StoryError('INVALID_IMAGE', 'Image has invalid dimensions')
    }

    const { width, height } = getScaledDimensions(
      image.naturalWidth,
      image.naturalHeight,
      MAX_IMAGE_WIDTH,
      MAX_IMAGE_HEIGHT,
    )

    const canvas = document.createElement('canvas')
    canvas.width = width
    canvas.height = height

    const context = canvas.getContext('2d')
    if (!context) {
      throw new StoryError('PROCESSING_FAILED', 'Could not process image')
    }

    context.drawImage(image, 0, 0, width, height)

    const imageData = canvas.toDataURL('image/jpeg', 0.85)

    if (!isValidImageDataUrl(imageData)) {
      throw new StoryError('PROCESSING_FAILED', 'Processed image is invalid')
    }

    return imageData
  } catch (error) {
    if (error instanceof StoryError) {
      throw error
    }

    throw new StoryError('PROCESSING_FAILED', 'Could not process image')
  } finally {
    URL.revokeObjectURL(objectUrl)
  }
}
