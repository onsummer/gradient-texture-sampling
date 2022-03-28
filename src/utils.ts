import type { GradientTextureOption } from './types'

const LEGNTH_8BIT = 1 << 8 // 256
const offscreenCanvas = document.createElement('canvas')
const ctx = offscreenCanvas.getContext('2d')!

// 8bit RGB 颜色需要使用 256 个像素展示
offscreenCanvas.width = LEGNTH_8BIT 
offscreenCanvas.height = 1

/**
 * 判断一个数字是否是 2 的次幂
 * 
 * 另有位运算实现 (num & (num - 1)) == 0
 */
export const isPowOf2 = (num: number) => Number.isInteger(Math.log2(num))

/**
 * 将一个非 2 次幂的数削到比它小的、最大的 2 的次幂数
 * 
 * @example
 * 
 * ``` js
 * console.log(snapToPowOf2(1200)) // 1024
 * ```
 */
export const snapToPowOf2 = (num: number) => {
  if (isPowOf2(num)) {
    return num
  }

  const integerPow = Math.floor(Math.log2(num))
  return 2 << (integerPow - 1)
}

const fillDefaultColor = (
  defaultColor: string = 'rgba(255, 255, 255, 1)'
) => {
  ctx.clearRect(0, 0, 256, 1)
  ctx.fillStyle = defaultColor
  ctx.fillRect(0, 0, 256, 1)
}

/**
 * 创建渐变色带
 * @param options 
 * @returns 
 */
export const getGradientTextureBuffer = (
  options: GradientTextureOption
) => {
  const {
    steps
  } = options

  fillDefaultColor()

  // 线性渐变对象 是一块区域 [(x1, y1), (x2, y2)]，在这里与渐变色带一样大
  const gradientStyle = ctx.createLinearGradient(0, 0, LEGNTH_8BIT, 1)
  steps.forEach((step) => {
    gradientStyle.addColorStop(step[0], step[1])
  })
  ctx.fillStyle = gradientStyle
  ctx.fillRect(0, 0, LEGNTH_8BIT, 1)
  const imgData = ctx.getImageData(0, 0, 256, 1)
  return imgData
}