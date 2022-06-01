
export const vsSource = `
  attribute vec2 a_position;
  attribute vec2 a_texCoord;

  uniform vec2 u_resolution;

  varying vec2 v_texCoord;

  void main()
  {
    // convert the rectangle from pixel to 0.0 to 1.0
    vec2 zeroToOne = a_position / u_resolution;

    // convert from 0->1 to 0->2
    vec2 zeroToTwo = zeroToOne * 2.0;

    // convert from 0->2 to -1->+1 (clipspace)
    vec2 clipSpace = zeroToTwo - 1.0;

    gl_Position = vec4(clipSpace * vec2(1, -1), 0, 1);

    // pass the texCoord to the fragment shader
    // The GPU will interpolate this value between points.
    v_texCoord = a_texCoord;
  }
`;

export const fsSource = `
  precision mediump float;

  uniform sampler2D u_image;
  uniform vec2 u_textureSize;
  uniform float u_kernel[9];
  uniform float u_kernelWeight;

  // the texCoords passed in from the vertex shader
  varying vec2 v_texCoord;

  void main() {
    vec2 onePixel = vec2(1.0, 1.0) / u_textureSize;
    vec4 colorSum =
      texture2D(u_image, v_texCoord + onePixel * vec2(-1, -1)) * u_kernel[0] +
      texture2D(u_image, v_texCoord + onePixel * vec2( 0, -1)) * u_kernel[1] +
      texture2D(u_image, v_texCoord + onePixel * vec2( 1, -1)) * u_kernel[2] +
      texture2D(u_image, v_texCoord + onePixel * vec2(-1,  0)) * u_kernel[3] +
      texture2D(u_image, v_texCoord + onePixel * vec2( 0,  0)) * u_kernel[4] +
      texture2D(u_image, v_texCoord + onePixel * vec2( 1,  0)) * u_kernel[5] +
      texture2D(u_image, v_texCoord + onePixel * vec2(-1,  1)) * u_kernel[6] +
      texture2D(u_image, v_texCoord + onePixel * vec2( 0,  1)) * u_kernel[7] +
      texture2D(u_image, v_texCoord + onePixel * vec2( 1,  1)) * u_kernel[8] ;
 
    gl_FragColor = vec4((colorSum / u_kernelWeight).rgb, 1);
 }
`;