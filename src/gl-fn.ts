export const createTexture = (
  gl: WebGLRenderingContext | WebGL2RenderingContext,
  w: number,
  h: number,
  data: Uint8Array
) => {
  const t = gl.createTexture()
  gl.bindTexture(gl.TEXTURE_2D, t)
  
  // 上载数据
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, w, h, 0, gl.RGBA, gl.UNSIGNED_BYTE, data)
  
  // 采样参数
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR)
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR)
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE)
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE)
  
  gl.bindTexture(gl.TEXTURE_2D, null)

  return t
}