// Copyright (c) 2017-2018 Xiamen Yaji Software Co., Ltd.

varying vec2 uv0;

uniform vec4 color;
uniform vec2 border;

void main () {

  vec4 o = vec4(0);

  vec2 uv = uv0 - floor(uv0);
  if (any(lessThan(vec4(uv, 1.0 - border), vec4(border, uv))))
    o = vec4(1);

  #if USE_COLOR
    o *= color;
  #endif

  gl_FragColor = o;
}
