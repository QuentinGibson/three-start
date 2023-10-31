
import * as THREE from 'three';
const onlineEffect = {
  uniforms: {
    time: { value: 0.0 },
    mouse: { value: new THREE.Vector2() },
    resolution: { value: new THREE.Vector2(window.innerWidth, window.innerHeight) }
  },
  vertexShader: `
      precision mediump float;
    
    varying vec2 vUv;
    
    void main() {
      vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
     `,
  fragmentShader: `
#ifdef GL_ES
      precision mediump float;
    #endif

 uniform vec2 resolution;
    uniform vec2 mouse;
    uniform float time;

    varying vec2 vUv;

mat2 rotate2D(float r) {
    return mat2(0.415, tan(0.12*r), -sin(r), cos(r));
    //return mat2(cos(r), 0.09, -sin(r), cos(r));
}

float doit(vec2 uv)
{
    
	
    float t = time*0.66;
	    vec2 n = vec2(0);
    vec2 q = vec2(0);
    vec2 p = uv;
    float d = 0.0;//dot(p,p);
    float S = 18.;
    float a = -0.004;
    mat2 m = rotate2D(5.);

    for (float j = 0.; j < 5.; j++) {
        p *= m;
        n *= m*0.635;
        q = p * S + t * 4. + sin(t * 1. - d * 8.) * .0018 + 3.*j - .95*n; // wtf???
        a += dot(cos(q)/S, vec2(.256));
        n -= sin(q);
        S *= 1.44;
    }	
	return a;
}

float random (in vec2 _st) {
    return fract(sin(dot(_st.xy,
                         vec2(12.9898,78.233)))*
        43758.5453123);
}

// Based on Morgan McGuire @morgan3d
// https://www.shadertoy.com/view/4dS3Wd
float noise (in vec2 _st) {
    vec2 i = floor(_st);
    vec2 f = fract(_st);

    // Four corners in 2D of a tile
    float a = random(i);
    float b = random(i + vec2(1.0, 0.0));
    float c = random(i + vec2(0.0, 1.0));
    float d = random(i + vec2(1.0, 1.0));

    vec2 u = f * f * (3.0 - 2.0 * f);

    return mix(a, b, u.x) +
            (c - a)* u.y * (1.0 - u.x) +
            (d - b) * u.x * u.y;
}

#define NUM_OCTAVES 5

float fbm ( in vec2 _st) {
    float v = 0.0;
    float a = 0.5;
    vec2 shift = vec2(100.0);
    // Rotate to reduce axial bias
    mat2 rot = mat2(cos(0.5), sin(0.5),
                    -sin(0.5), cos(0.50));
    for (int i = 0; i < NUM_OCTAVES; ++i) {
        v += a * noise(_st);
        _st = rot * _st * 2.0 + shift;
        a *= 0.515;
    }
    return v;
}

void main () {
      vec2 st = vUv * resolution.y;
      float a = doit(st * .5) * 12.0;
      a = abs(a);
      st.x *= 0.3;

      vec3 color = vec3(0.0);

      //vec2 st = gl_FragCoord.xy/resolution.xy;
	
    //st = st * abs(sin(time*0.1)*3.0);
    vec2 q = vec2(0.);
    q.x = fbm( st );
    q.y = fbm( st + vec2(1.0));

    vec2 r = vec2(0.);
    r.x = fbm( st + 1.0*q + vec2(1.7,9.2)+ 0.055*time );
    r.y = fbm( st + 1.0*q + vec2(8.3,2.8)+ 0.0126*time);

    float f = fbm(st+r);

    color = mix(vec3(0.666667,0.101961,0.19608),
                vec3(0.666667,0.666667,0.48039),
                clamp((f*f)*4.0,0.0,1.0));

    color = mix(color,
                vec3(0.164706,0,0),
                clamp(length(q),0.0,1.0));

    color = mix(color,
                vec3(1,0.666667,1),
                clamp(length(r.x),0.0,1.0));
	
	color+=a*a*a;

      gl_FragColor = vec4((f * f * f + .6 * f * f + .5 * f) * color * 1.9, 1.);
}
  `,
}

export default onlineEffect