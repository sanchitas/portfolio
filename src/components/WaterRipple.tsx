'use client';

import { useEffect, useRef, useCallback } from 'react';

// ─── Shaders ───────────────────────────────────────────────

// Simulation: ping-pong heightfield on GPU
const SIM_VS = `#version 300 es
in vec2 a_pos;
out vec2 v_uv;
void main() {
  v_uv = a_pos * 0.5 + 0.5;
  gl_Position = vec4(a_pos, 0.0, 1.0);
}`;

const SIM_FS = `#version 300 es
precision highp float;
in vec2 v_uv;
uniform sampler2D u_prev;
uniform vec2 u_texel;
uniform float u_damping;
out vec4 fragColor;

void main() {
  float prev = texture(u_prev, v_uv).r;
  float l = texture(u_prev, v_uv + vec2(-u_texel.x, 0.0)).r;
  float r = texture(u_prev, v_uv + vec2( u_texel.x, 0.0)).r;
  float t = texture(u_prev, v_uv + vec2(0.0,  u_texel.y)).r;
  float b = texture(u_prev, v_uv + vec2(0.0, -u_texel.y)).r;

  // The second channel stores velocity
  float vel = texture(u_prev, v_uv).g;

  // Wave equation: acceleration = laplacian of height
  float avg = (l + r + t + b) * 0.25;
  vel += (avg - prev) * 2.0;
  vel *= u_damping;

  float h = prev + vel;
  fragColor = vec4(h, vel, 0.0, 1.0);
}`;

// Splash: add energy at a point
const SPLASH_FS = `#version 300 es
precision highp float;
in vec2 v_uv;
uniform sampler2D u_prev;
uniform vec2 u_center;
uniform float u_radius;
uniform float u_strength;
out vec4 fragColor;

void main() {
  vec4 prev = texture(u_prev, v_uv);
  float dist = length(v_uv - u_center);
  float drop = exp(-dist * dist / (u_radius * u_radius)) * u_strength;
  fragColor = vec4(prev.r + drop, prev.g, prev.zw);
}`;

// Render: distort background with refraction + lighting
const RENDER_VS = `#version 300 es
in vec2 a_pos;
out vec2 v_uv;
void main() {
  v_uv = a_pos * 0.5 + 0.5;
  gl_Position = vec4(a_pos, 0.0, 1.0);
}`;

const RENDER_FS = `#version 300 es
precision highp float;
in vec2 v_uv;
uniform sampler2D u_water;
uniform sampler2D u_bg;
uniform vec2 u_texel;
uniform vec3 u_lightDir;
out vec4 fragColor;

void main() {
  // Sample heightfield neighbors for normal
  float h  = texture(u_water, v_uv).r;
  float hL = texture(u_water, v_uv + vec2(-u_texel.x, 0.0)).r;
  float hR = texture(u_water, v_uv + vec2( u_texel.x, 0.0)).r;
  float hT = texture(u_water, v_uv + vec2(0.0,  u_texel.y)).r;
  float hB = texture(u_water, v_uv + vec2(0.0, -u_texel.y)).r;

  // Normal from height gradient
  float dx = (hR - hL) * 8.0;
  float dy = (hT - hB) * 8.0;
  vec3 normal = normalize(vec3(-dx, -dy, 1.0));

  // Refraction offset — distort the background UV
  vec2 refractUV = v_uv + normal.xy * 0.03;
  refractUV = clamp(refractUV, 0.0, 1.0);

  vec4 bg = texture(u_bg, refractUV);

  // Specular highlight (Blinn-Phong)
  vec3 viewDir = vec3(0.0, 0.0, 1.0);
  vec3 halfVec = normalize(u_lightDir + viewDir);
  float specular = pow(max(dot(normal, halfVec), 0.0), 120.0);

  // Broad specular
  float specBroad = pow(max(dot(normal, halfVec), 0.0), 12.0);

  // Caustic brightening at convergence points
  float caustic = max(0.0, (dx * dx + dy * dy) * 80.0);
  caustic = min(caustic, 0.4);

  // Combine
  vec3 color = bg.rgb;
  color += specBroad * 0.06;
  color += specular * 0.35;
  color += caustic * vec3(0.5, 0.7, 0.8) * 0.15;

  // Subtle shadow in troughs
  float shadow = smoothstep(-0.02, 0.0, h) * 0.15 + 0.85;
  color *= shadow;

  fragColor = vec4(color, bg.a);
}`;

// ─── WebGL helpers ─────────────────────────────────────────

function compileShader(gl: WebGL2RenderingContext, src: string, type: number): WebGLShader {
  const s = gl.createShader(type)!;
  gl.shaderSource(s, src);
  gl.compileShader(s);
  if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) {
    const info = gl.getShaderInfoLog(s);
    gl.deleteShader(s);
    throw new Error(`Shader compile error: ${info}`);
  }
  return s;
}

function createProgram(gl: WebGL2RenderingContext, vs: string, fs: string): WebGLProgram {
  const p = gl.createProgram()!;
  gl.attachShader(p, compileShader(gl, vs, gl.VERTEX_SHADER));
  gl.attachShader(p, compileShader(gl, fs, gl.FRAGMENT_SHADER));
  gl.linkProgram(p);
  if (!gl.getProgramParameter(p, gl.LINK_STATUS)) {
    throw new Error(`Program link error: ${gl.getProgramInfoLog(p)}`);
  }
  return p;
}

function createFBO(gl: WebGL2RenderingContext, w: number, h: number) {
  const tex = gl.createTexture()!;
  gl.bindTexture(gl.TEXTURE_2D, tex);
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA16F, w, h, 0, gl.RGBA, gl.FLOAT, null);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);

  const fbo = gl.createFramebuffer()!;
  gl.bindFramebuffer(gl.FRAMEBUFFER, fbo);
  gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, tex, 0);
  gl.bindFramebuffer(gl.FRAMEBUFFER, null);

  return { tex, fbo };
}

// ─── Component ─────────────────────────────────────────────

interface WaterRippleProps {
  /** Background image URL to distort. Falls back to a subtle gradient. */
  backgroundImage?: string;
  /** Background color when no image is provided */
  backgroundColor?: string;
  /** CSS class for the container */
  className?: string;
  /** Damping factor (0-1). Higher = ripples last longer. Default 0.97 */
  damping?: number;
  /** Ripple radius on hover (0-1 in UV space). Default 0.02 */
  hoverRadius?: number;
  /** Ripple strength on hover. Default 0.01 */
  hoverStrength?: number;
  /** Ripple radius on click. Default 0.04 */
  clickRadius?: number;
  /** Ripple strength on click. Default 0.04 */
  clickStrength?: number;
  /** Simulation resolution divisor. 1 = full res, 2 = half, etc. Default 1 */
  resolution?: number;
}

export default function WaterRipple({
  backgroundImage,
  backgroundColor = '#ffffff',
  className = '',
  damping = 0.97,
  hoverRadius = 0.02,
  hoverStrength = 0.01,
  clickRadius = 0.04,
  clickStrength = 0.04,
  resolution = 1,
}: WaterRippleProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const glRef = useRef<WebGL2RenderingContext | null>(null);
  const frameRef = useRef(0);
  const pendingSplashes = useRef<Array<{ x: number; y: number; r: number; s: number }>>([]);

  const addSplash = useCallback((x: number, y: number, radius: number, strength: number) => {
    pendingSplashes.current.push({ x, y, r: radius, s: strength });
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl = canvas.getContext('webgl2', {
      alpha: true,
      premultipliedAlpha: false,
      antialias: false,
    });
    if (!gl) {
      console.warn('WebGL2 not available');
      return;
    }
    glRef.current = gl;

    // Check for float texture support
    const ext = gl.getExtension('EXT_color_buffer_float');
    if (!ext) {
      console.warn('EXT_color_buffer_float not available');
      return;
    }

    // Full-screen quad
    const quadBuf = gl.createBuffer()!;
    gl.bindBuffer(gl.ARRAY_BUFFER, quadBuf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1,-1, 1,-1, -1,1, 1,1]), gl.STATIC_DRAW);

    // Programs
    const simProg = createProgram(gl, SIM_VS, SIM_FS);
    const splashProg = createProgram(gl, SIM_VS, SPLASH_FS);
    const renderProg = createProgram(gl, RENDER_VS, RENDER_FS);

    // Sim uniforms
    const simLocs = {
      a_pos: gl.getAttribLocation(simProg, 'a_pos'),
      u_prev: gl.getUniformLocation(simProg, 'u_prev'),
      u_texel: gl.getUniformLocation(simProg, 'u_texel'),
      u_damping: gl.getUniformLocation(simProg, 'u_damping'),
    };

    // Splash uniforms
    const splashLocs = {
      a_pos: gl.getAttribLocation(splashProg, 'a_pos'),
      u_prev: gl.getUniformLocation(splashProg, 'u_prev'),
      u_center: gl.getUniformLocation(splashProg, 'u_center'),
      u_radius: gl.getUniformLocation(splashProg, 'u_radius'),
      u_strength: gl.getUniformLocation(splashProg, 'u_strength'),
    };

    // Render uniforms
    const renderLocs = {
      a_pos: gl.getAttribLocation(renderProg, 'a_pos'),
      u_water: gl.getUniformLocation(renderProg, 'u_water'),
      u_bg: gl.getUniformLocation(renderProg, 'u_bg'),
      u_texel: gl.getUniformLocation(renderProg, 'u_texel'),
      u_lightDir: gl.getUniformLocation(renderProg, 'u_lightDir'),
    };

    // Setup
    let W = 0, H = 0;
    let simW = 0, simH = 0;
    let fboA: ReturnType<typeof createFBO>;
    let fboB: ReturnType<typeof createFBO>;
    let bgTex: WebGLTexture;

    function initSize() {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      W = canvas!.clientWidth;
      H = canvas!.clientHeight;
      canvas!.width = W * dpr;
      canvas!.height = H * dpr;
      gl!.viewport(0, 0, canvas!.width, canvas!.height);

      // Sim at potentially lower res
      simW = Math.ceil(canvas!.width / resolution);
      simH = Math.ceil(canvas!.height / resolution);
      fboA = createFBO(gl!, simW, simH);
      fboB = createFBO(gl!, simW, simH);
    }

    function initBgTexture() {
      bgTex = gl!.createTexture()!;
      gl!.bindTexture(gl!.TEXTURE_2D, bgTex);

      if (backgroundImage) {
        // Load image
        const img = new Image();
        img.crossOrigin = 'anonymous';
        img.onload = () => {
          gl!.bindTexture(gl!.TEXTURE_2D, bgTex);
          gl!.texImage2D(gl!.TEXTURE_2D, 0, gl!.RGBA, gl!.RGBA, gl!.UNSIGNED_BYTE, img);
          gl!.texParameteri(gl!.TEXTURE_2D, gl!.TEXTURE_MIN_FILTER, gl!.LINEAR);
          gl!.texParameteri(gl!.TEXTURE_2D, gl!.TEXTURE_MAG_FILTER, gl!.LINEAR);
          gl!.texParameteri(gl!.TEXTURE_2D, gl!.TEXTURE_WRAP_S, gl!.CLAMP_TO_EDGE);
          gl!.texParameteri(gl!.TEXTURE_2D, gl!.TEXTURE_WRAP_T, gl!.CLAMP_TO_EDGE);
        };
        img.src = backgroundImage;
      }

      // Start with a solid/gradient fallback (1x1 pixel)
      const pixel = new Uint8Array([255, 255, 255, 255]);
      gl!.texImage2D(gl!.TEXTURE_2D, 0, gl!.RGBA, 1, 1, 0, gl!.RGBA, gl!.UNSIGNED_BYTE, pixel);
      gl!.texParameteri(gl!.TEXTURE_2D, gl!.TEXTURE_MIN_FILTER, gl!.LINEAR);
      gl!.texParameteri(gl!.TEXTURE_2D, gl!.TEXTURE_MAG_FILTER, gl!.LINEAR);
      gl!.texParameteri(gl!.TEXTURE_2D, gl!.TEXTURE_WRAP_S, gl!.CLAMP_TO_EDGE);
      gl!.texParameteri(gl!.TEXTURE_2D, gl!.TEXTURE_WRAP_T, gl!.CLAMP_TO_EDGE);
    }

    initSize();
    initBgTexture();

    const onResize = () => { initSize(); };
    window.addEventListener('resize', onResize);

    function drawQuad(prog: WebGLProgram, posLoc: number) {
      gl!.bindBuffer(gl!.ARRAY_BUFFER, quadBuf);
      gl!.enableVertexAttribArray(posLoc);
      gl!.vertexAttribPointer(posLoc, 2, gl!.FLOAT, false, 0, 0);
      gl!.drawArrays(gl!.TRIANGLE_STRIP, 0, 4);
    }

    // Light direction (normalized) — from upper-right
    const lDir = [0.4, -0.5, 0.76];
    const lLen = Math.sqrt(lDir[0]**2 + lDir[1]**2 + lDir[2]**2);
    lDir[0] /= lLen; lDir[1] /= lLen; lDir[2] /= lLen;

    let swap = false;

    function loop() {
      const src = swap ? fboA : fboB;
      const dst = swap ? fboB : fboA;

      // --- Process pending splashes ---
      while (pendingSplashes.current.length > 0) {
        const sp = pendingSplashes.current.shift()!;
        gl!.useProgram(splashProg);
        gl!.bindFramebuffer(gl!.FRAMEBUFFER, dst.fbo);
        gl!.viewport(0, 0, simW, simH);
        gl!.activeTexture(gl!.TEXTURE0);
        gl!.bindTexture(gl!.TEXTURE_2D, src.tex);
        gl!.uniform1i(splashLocs.u_prev, 0);
        gl!.uniform2f(splashLocs.u_center, sp.x, sp.y);
        gl!.uniform1f(splashLocs.u_radius, sp.r);
        gl!.uniform1f(splashLocs.u_strength, sp.s);
        drawQuad(splashProg, splashLocs.a_pos);

        // Copy result back to src for next splash
        gl!.bindFramebuffer(gl!.FRAMEBUFFER, src.fbo);
        gl!.viewport(0, 0, simW, simH);
        gl!.useProgram(splashProg);
        gl!.activeTexture(gl!.TEXTURE0);
        gl!.bindTexture(gl!.TEXTURE_2D, dst.tex);
        gl!.uniform1i(splashLocs.u_prev, 0);
        gl!.uniform2f(splashLocs.u_center, -10.0, -10.0); // offscreen = no splash, just copy
        gl!.uniform1f(splashLocs.u_radius, 0.001);
        gl!.uniform1f(splashLocs.u_strength, 0.0);
        drawQuad(splashProg, splashLocs.a_pos);
      }

      // --- Simulate ---
      gl!.useProgram(simProg);
      gl!.bindFramebuffer(gl!.FRAMEBUFFER, dst.fbo);
      gl!.viewport(0, 0, simW, simH);
      gl!.activeTexture(gl!.TEXTURE0);
      gl!.bindTexture(gl!.TEXTURE_2D, src.tex);
      gl!.uniform1i(simLocs.u_prev, 0);
      gl!.uniform2f(simLocs.u_texel, 1.0 / simW, 1.0 / simH);
      gl!.uniform1f(simLocs.u_damping, damping);
      drawQuad(simProg, simLocs.a_pos);

      // --- Render ---
      gl!.useProgram(renderProg);
      gl!.bindFramebuffer(gl!.FRAMEBUFFER, null);
      gl!.viewport(0, 0, canvas!.width, canvas!.height);

      gl!.activeTexture(gl!.TEXTURE0);
      gl!.bindTexture(gl!.TEXTURE_2D, dst.tex);
      gl!.uniform1i(renderLocs.u_water, 0);

      gl!.activeTexture(gl!.TEXTURE1);
      gl!.bindTexture(gl!.TEXTURE_2D, bgTex);
      gl!.uniform1i(renderLocs.u_bg, 1);

      gl!.uniform2f(renderLocs.u_texel, 1.0 / simW, 1.0 / simH);
      gl!.uniform3f(renderLocs.u_lightDir, lDir[0], lDir[1], lDir[2]);
      drawQuad(renderProg, renderLocs.a_pos);

      swap = !swap;
      frameRef.current = requestAnimationFrame(loop);
    }

    frameRef.current = requestAnimationFrame(loop);

    // --- Interaction ---
    let lastMoveTime = 0;
    const onMouseMove = (e: MouseEvent) => {
      const now = performance.now();
      if (now - lastMoveTime < 16) return; // throttle to ~60fps
      lastMoveTime = now;
      const rect = canvas!.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width;
      const y = 1.0 - (e.clientY - rect.top) / rect.height; // flip Y for GL
      addSplash(x, y, hoverRadius, hoverStrength);
    };

    const onMouseDown = (e: MouseEvent) => {
      const rect = canvas!.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width;
      const y = 1.0 - (e.clientY - rect.top) / rect.height;
      addSplash(x, y, clickRadius, clickStrength);
    };

    const onTouchMove = (e: TouchEvent) => {
      const rect = canvas!.getBoundingClientRect();
      for (const touch of Array.from(e.touches)) {
        const x = (touch.clientX - rect.left) / rect.width;
        const y = 1.0 - (touch.clientY - rect.top) / rect.height;
        addSplash(x, y, hoverRadius, hoverStrength * 1.5);
      }
    };

    const onTouchStart = (e: TouchEvent) => {
      const rect = canvas!.getBoundingClientRect();
      for (const touch of Array.from(e.touches)) {
        const x = (touch.clientX - rect.left) / rect.width;
        const y = 1.0 - (touch.clientY - rect.top) / rect.height;
        addSplash(x, y, clickRadius, clickStrength);
      }
    };

    canvas.addEventListener('mousemove', onMouseMove);
    canvas.addEventListener('mousedown', onMouseDown);
    canvas.addEventListener('touchmove', onTouchMove, { passive: true });
    canvas.addEventListener('touchstart', onTouchStart, { passive: true });

    return () => {
      cancelAnimationFrame(frameRef.current);
      window.removeEventListener('resize', onResize);
      canvas.removeEventListener('mousemove', onMouseMove);
      canvas.removeEventListener('mousedown', onMouseDown);
      canvas.removeEventListener('touchmove', onTouchMove);
      canvas.removeEventListener('touchstart', onTouchStart);
    };
  }, [backgroundImage, damping, hoverRadius, hoverStrength, clickRadius, clickStrength, resolution, addSplash]);

  return (
    <canvas
      ref={canvasRef}
      className={`fixed inset-0 w-full h-full ${className}`}
      style={{
        zIndex: 0,
        backgroundColor,
        pointerEvents: 'auto',
      }}
      aria-hidden="true"
    />
  );
}
