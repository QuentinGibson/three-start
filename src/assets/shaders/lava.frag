uniform float time;
uniform float progress;
uniform sampler2D texture1;
uniform vec4 resolution;
    varying vec2 vUv;
    varying vec3 vColor;

    void main( void ) {
      gl_FragColor = vec4(1.0, 1.0 , 0.0, 1.);
    }