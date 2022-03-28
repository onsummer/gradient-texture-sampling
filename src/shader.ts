/*
  灰度采样大致算法

    首先，灰度要找到颜色，势必使用灰度去采样色带纹理
    其次，灰度从哪里来？① z 值；② 从灰度纹理中采样

    灰度找颜色，设灰度为 z
    texture2D()
*/

export const vs = /* glsl */`precision mediump float;
attribute vec3 aPos;
varying float z;

void main() {
  z = aPos.z;
  gl_Position = vec4(aPos.xy, 0.0, 1.0);
}
`

export const fs = /* glsl */`precision mediump float;
varying float z;
uniform vec2 uMinmax;
uniform sampler2D uBell;

void main() {
  float n = (z - uMinmax.x) / (uMinmax.y - uMinmax.x);
  vec4 c = texture2D(uBell, vec2(n, 0.5));
  gl_FragColor = c;
}
`