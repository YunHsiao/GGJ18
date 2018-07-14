// Copyright (c) 2017-2018 Xiamen Yaji Software Co., Ltd.

attribute vec3 a_position;
attribute vec2 a_uv0;

uniform mat4 model;
uniform mat4 viewProj;

uniform vec2 mainTiling;
uniform vec2 mainOffset;
varying vec2 uv0;

void main () {
  vec4 pos = vec4(a_position, 1);

  pos = viewProj * model * pos;

  uv0 = a_uv0 * mainTiling + mainOffset;

  gl_Position = pos;
}