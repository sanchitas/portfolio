"use client";

import { useRef, useEffect } from "react";

const VERT = `attribute vec2 a_pos;void main(){gl_Position=vec4(a_pos,0,1);}`;

const FRAG = `
precision mediump float;
uniform float u_time;
uniform vec2 u_res;

void main(){
  vec2 uv = gl_FragCoord.xy / u_res;
  float a = u_res.x / u_res.y;
  vec2 p = uv * vec2(a, 1.0) * 6.0;
  float t = u_time * 0.35;

  // Domain warping for organic movement
  vec2 q = p;
  q.x += sin(p.y * 1.4 + t * 0.7) * 0.6;
  q.y += cos(p.x * 1.3 + t * 0.5) * 0.5;

  // Wave interference → caustic pattern
  float c1 = sin(q.x * 2.1 + sin(q.y * 1.7 + t * 0.3) * 1.5);
  float c2 = sin(q.y * 2.3 + sin(q.x * 1.9 + t * 0.4) * 1.3);
  float c3 = sin((q.x + q.y) * 1.5 + t * 0.2);
  float c = (c1 + c2 + c3) / 3.0;
  c = c * 0.5 + 0.5;
  c = pow(c, 1.8);

  // Emerald palette
  vec3 deep  = vec3(0.008, 0.11, 0.08);
  vec3 mid   = vec3(0.015, 0.24, 0.17);
  vec3 hi    = vec3(0.06,  0.44, 0.29);

  vec3 col = mix(deep, mid, 0.4 + c * 0.6);
  col += hi * c * c * 0.6;

  // Subtle vignette
  float vig = 1.0 - length(uv - 0.5) * 0.25;
  col *= vig;

  gl_FragColor = vec4(col, 1.0);
}`;

export default function CausticCanvas() {
  const ref = useRef<HTMLCanvasElement>(null);
  const raf = useRef(0);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;

    const gl = canvas.getContext("webgl", { antialias: false, alpha: false });
    if (!gl) {
      canvas.style.background = "#042e20";
      return;
    }

    const compile = (type: number, src: string) => {
      const s = gl.createShader(type)!;
      gl.shaderSource(s, src);
      gl.compileShader(s);
      return s;
    };

    const prog = gl.createProgram()!;
    gl.attachShader(prog, compile(gl.VERTEX_SHADER, VERT));
    gl.attachShader(prog, compile(gl.FRAGMENT_SHADER, FRAG));
    gl.linkProgram(prog);
    gl.useProgram(prog);

    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]),
      gl.STATIC_DRAW
    );
    const aPos = gl.getAttribLocation(prog, "a_pos");
    gl.enableVertexAttribArray(aPos);
    gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);

    const uTime = gl.getUniformLocation(prog, "u_time");
    const uRes = gl.getUniformLocation(prog, "u_res");

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio, 2);
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      gl.viewport(0, 0, canvas.width, canvas.height);
    };
    resize();
    window.addEventListener("resize", resize);

    const t0 = performance.now();
    const loop = () => {
      gl.uniform1f(uTime, (performance.now() - t0) / 1000);
      gl.uniform2f(uRes, canvas.width, canvas.height);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
      raf.current = requestAnimationFrame(loop);
    };
    loop();

    return () => {
      cancelAnimationFrame(raf.current);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={ref}
      style={{
        position: "fixed",
        inset: 0,
        width: "100%",
        height: "100%",
        zIndex: 0,
      }}
    />
  );
}
