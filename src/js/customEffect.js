const customEffect = {
  uniforms: {
    time: { value: 0.0 },
  },
  vertexShader: `
   varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
     `,
  fragmentShader: `
uniform float time;
    varying vec2 vUv;
    void main() {
      gl_FragColor = vec4(sin(time) + vUv.x, cos(time) + vUv.y, sin(time) + cos(time), 1.0);
    }
  `
}

export default customEffect