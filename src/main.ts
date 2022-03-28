import './style.css'
import { getGradientTextureBuffer } from './utils'
import {
  BLACK_WHITE,
  WHITE_GREEN,
  RAINBOW_7
} from './gradients'
import {
  SquareGeometry
} from './square'
import {
  vs as vsSource,
  fs as fsSource
} from './shader'
import { buildUI } from './ui'
import type { GradientStep } from './types'

const app = document.querySelector<HTMLDivElement>('#app')!

const canvas = document.createElement('canvas')
canvas.width = 500
canvas.height = 500
canvas.style.border = '1px solid rgb(150, 150, 150)'

const framer = document.createElement('span')
framer.innerText = `初始化...`

app.appendChild(framer)
app.appendChild(canvas)

let time = 0
const gl = canvas.getContext('webgl')!
const program = gl.createProgram()!
const context = {
  program: program,
  vertexBuffer: gl.createBuffer()!,
  positionAttribLoc: gl.getAttribLocation(program, 'aPos')
}

const updateBellTexture = (item: string) => {
  console.log('You selected: ', item)
  let steps: GradientStep[]
  switch (item) {
    case 'black_white':
      steps = BLACK_WHITE
      break
    case 'green_white':
      steps = WHITE_GREEN
      break
    default:
      steps = RAINBOW_7
      break
  }
  const textureData = getGradientTextureBuffer({
    steps
  })

  // 重新生成 texture
  const bell = gl.createTexture()!
  gl.bindTexture(gl.TEXTURE_2D, bell)
  gl.texImage2D(
    gl.TEXTURE_2D,
    0,
    gl.RGBA,
    textureData.width,
    textureData.height,
    0,
    gl.RGBA,
    gl.UNSIGNED_BYTE,
    textureData.data
  )
  // sample info
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE)
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE)
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST)
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST)
  // use texture
  gl.activeTexture(gl.TEXTURE0)
  gl.bindTexture(gl.TEXTURE_2D, bell)
  gl.uniform1i(gl.getUniformLocation(program, 'uBell'), 0)
}

buildUI(app, updateBellTexture)

const init = () => {
  // shader
  const vs = gl.createShader(gl.VERTEX_SHADER)!
  const fs = gl.createShader(gl.FRAGMENT_SHADER)!
  gl.shaderSource(vs, vsSource)
  gl.shaderSource(fs, fsSource)
  gl.compileShader(vs)
  gl.compileShader(fs)
  gl.attachShader(context.program, vs)
  gl.attachShader(context.program, fs)
  gl.linkProgram(context.program)

  gl.useProgram(context.program)

  // vbo
  gl.bindBuffer(gl.ARRAY_BUFFER, context.vertexBuffer)
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(SquareGeometry.position), gl.DYNAMIC_DRAW)
  gl.bindAttribLocation(context.program, context.positionAttribLoc, 'aPos')

  gl.enableVertexAttribArray(context.positionAttribLoc)
  gl.vertexAttribPointer(context.positionAttribLoc, 3, gl.FLOAT, false, 4 * 3, 0) // vec3 position

  // texture
  const initTextureData = getGradientTextureBuffer({
    steps: RAINBOW_7
  })
  const bell = gl.createTexture()!
  gl.bindTexture(gl.TEXTURE_2D, bell)
  gl.texImage2D(
    gl.TEXTURE_2D,
    0,
    gl.RGBA,
    initTextureData.width,
    initTextureData.height,
    0,
    gl.RGBA,
    gl.UNSIGNED_BYTE,
    initTextureData.data
  )
  // sample info
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE)
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE)
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST)
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST)
  // use texture
  gl.activeTexture(gl.TEXTURE0)
  gl.bindTexture(gl.TEXTURE_2D, bell)
  gl.uniform1i(gl.getUniformLocation(program, 'uBell'), 0)

}

const frame = () => {
  // update minmax uniform
  // gl.uniform2f(context.minmaxLoc, -3.5, 9.78) // <- WebGLUniformLocation 每一 Draw 都不一样，不能用缓存
  gl.uniform2f(gl.getUniformLocation(program, 'uMinmax'), -3.5, 9.78)

  // draw
  gl.viewport(0, 0, 500, 500)
  gl.clear(gl.COLOR_BUFFER_BIT)
  gl.drawArrays(gl.TRIANGLES, 0, 6)

  time++
  if (time % 60 === 0)
    framer.innerText = `已经过 ${time / 60} 秒`
  requestAnimationFrame(frame)
}

const main = () => {
  init()

  requestAnimationFrame(frame)
}

main()