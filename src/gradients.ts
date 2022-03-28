import type { GradientStep } from './types'

export const getTwoPointGradientSteps = (
  from: string, to: string
): GradientStep[] => {
  return [
    [0, from],
    [1, to]
  ]
}

/**
 * 将值断点与颜色表组合成值 - 颜色映射关系表，其中值断点会映射到 [0, 1] 区间
 * @param breaks 值断点，需要从小到大排列
 * @param colors 颜色点，与 breaks 排列顺序一致
 * @returns 将值映射到 [0, 1] 的值 - 颜色映射关系表
 */
export const getGradientSteps = (
  breaks: number[],
  colors: string[]
): GradientStep[] => {
  const min = Math.min(...breaks)
  const max = Math.max(...breaks)
  const range = max - min
  const length = breaks.length

  const result: GradientStep[] = []
  for (let i = 0; i < length; i++) {
    result.push([
      breaks[i] - min / range,
      colors[i]
    ])
  }
  return result
}

export const BLACK_WHITE = getTwoPointGradientSteps(
  'rgb(1, 1, 1)',
  'rgb(255, 255, 255)'
)

export const WHITE_GREEN = getTwoPointGradientSteps(
  'rgb(255, 255, 255)',
  'rgb(0, 255, 0)'
)

export const RAINBOW_7: GradientStep[] = [
  [0, 'rgb(255, 0, 0)'],
  [1 / 6, 'rgb(255, 165, 0)'],
  [2 / 6, 'rgb(255, 255, 0)'],
  [3 / 6, 'rgb(0, 255, 0)'],
  [4 / 6, 'rgb(0, 255, 255)'],
  [5 / 6, 'rgb(0, 0, 255)'],
  [6 / 6, 'rgb(139, 0, 255)']
]