<script>
	import { onMount } from 'svelte';
	import causticMaskA from '$lib/assets/caustic_1_mask.png';
	import causticMaskB from '$lib/assets/caustic_2_mask.png';
	import { setRippleTransitionRunner } from '$lib/utils/rippleTransition.js';

	let canvas;
	let visible = $state(false);
	let fallbackRipples = $state([]);
	let nextFallbackId = 0;

	const duration = 540;
	const resolveAt = 230;

	let gl;
	let program;
	let positionBuffer;
	let causticTextureA;
	let causticTextureB;
	let animationFrame;
	let activeRipple;
	let resizeObserver;
	let loadedTextureCount = 0;

	const vertexShaderSource = `
		attribute vec2 a_position;
		void main() {
			gl_Position = vec4(a_position, 0.0, 1.0);
		}
	`;

	const fragmentShaderSource = `
		precision mediump float;

		uniform vec2 u_resolution;
		uniform vec2 u_center;
		uniform float u_time;
		uniform float u_progress;
		uniform sampler2D u_caustic_a;
		uniform sampler2D u_caustic_b;
		uniform float u_textures_ready;

		const float PI = 3.141592653589793;
		const float BLOT_AMPLITUDE = 0.1;
		const float BLOT_PERIOD = 5.0;
		const float BLOT_BASE_ROTATION = 0.0;
		const float BLOT_ADD_ROTATION = 0.4;

		float calc_angle(vec2 diff) {
			float angle = atan(-diff.y, diff.x);
			if (angle < 0.0) angle += 2.0 * PI;
			return angle;
		}

		float ease_out_cubic(float value) {
			float t = clamp(value, 0.0, 1.0);
			return 1.0 - pow(1.0 - t, 3.0);
		}

		float hash21(vec2 p) {
			p = fract(p * vec2(123.34, 456.21));
			p += dot(p, p + 45.32);
			return fract(p.x * p.y);
		}

		float value_noise(vec2 p) {
			vec2 i = floor(p);
			vec2 f = fract(p);
			vec2 u = f * f * (3.0 - 2.0 * f);

			float a = hash21(i);
			float b = hash21(i + vec2(1.0, 0.0));
			float c = hash21(i + vec2(0.0, 1.0));
			float d = hash21(i + vec2(1.0, 1.0));

			return mix(mix(a, b, u.x), mix(c, d, u.x), u.y);
		}

		float fbm(vec2 p) {
			float total = 0.0;
			float amp = 0.5;

			for (int i = 0; i < 4; i++) {
				total += value_noise(p) * amp;
				p *= 2.03;
				amp *= 0.5;
			}

			return total;
		}

		float bubble_field(vec2 uv, float edge_mask, float time) {
			vec2 grid = uv * vec2(72.0, 44.0);
			vec2 cell = floor(grid);
			vec2 local = fract(grid) - 0.5;
			float seed = hash21(cell);
			float radius = mix(0.045, 0.12, hash21(cell + 7.0));
			float drift = sin(time * 4.0 + seed * 6.28318) * 0.08;
			float bubble = 1.0 - smoothstep(radius, radius + 0.022, length(local + vec2(0.0, drift)));

			return bubble * step(0.925, seed) * edge_mask;
		}

		void main() {
			vec2 uv = gl_FragCoord.xy / u_resolution;
			vec2 screen_uv = vec2(uv.x, 1.0 - uv.y);
			float aspect_ratio = u_resolution.x / u_resolution.y;

			vec2 ar_uv = vec2(aspect_ratio * uv.x, uv.y);
			vec2 ar_center = vec2(aspect_ratio * u_center.x, u_center.y);
			vec2 mask = ar_uv - ar_center;

			float d1 = distance(ar_center, vec2(0.0, 0.0));
			float d2 = distance(ar_center, vec2(0.0, 1.0 + BLOT_AMPLITUDE));
			float d3 = distance(ar_center, vec2(aspect_ratio * (1.0 + BLOT_AMPLITUDE), 0.0));
			float d4 = distance(ar_center, vec2(aspect_ratio * (1.0 + BLOT_AMPLITUDE), 1.0 + BLOT_AMPLITUDE));
			float radius = max(max(d1, d2), max(d3, d4));

			float progress = clamp(u_progress, 0.0, 1.0);
			float cover_progress = ease_out_cubic(progress / 0.34);
			float angle = calc_angle(mask);
			float dist = length(mask);

			float offset = BLOT_AMPLITUDE * sin(
				PI * BLOT_BASE_ROTATION + BLOT_PERIOD * (angle - cover_progress * BLOT_ADD_ROTATION * PI)
			);

			float angular_noise = (fbm(vec2(angle * 1.35, cover_progress * 3.0 + u_time * 0.22)) - 0.5) * 0.08;
			float ripple_distort = sin(screen_uv.y * 100.0 + u_time * 1.0) * 0.004;
			float edge_value = dist + (offset + angular_noise + ripple_distort) * cover_progress - cover_progress * radius * 1.035;
			float blot = 1.0 - smoothstep(-0.01, 0.018, edge_value);
			float edge = 1.0 - smoothstep(0.0, 0.06, abs(edge_value));
			float white_crest = 1.0 - smoothstep(0.0, 0.022, abs(edge_value - 0.006));

			float quantized_time = floor(u_time * 8.0) / 8.0;
			vec2 warped_uv = screen_uv;
			warped_uv.x += sin(warped_uv.y * 100.0 + u_time) * 0.004;

			float tex_a = texture2D(u_caustic_a, warped_uv + vec2(0.0, quantized_time * 0.04)).r;
			float tex_b = texture2D(u_caustic_b, warped_uv * 1.18 + vec2(0.5, 0.5 + quantized_time * 0.045)).r;
			float proc_a = fbm(warped_uv * vec2(9.0, 13.0) + vec2(0.0, quantized_time * 0.35));
			float proc_b = fbm(warped_uv * vec2(15.0, 8.0) + vec2(3.0, 1.0 - quantized_time * 0.27));
			float pattern_1 = mix(proc_a, tex_b, u_textures_ready);
			float pattern_2 = mix(proc_b, tex_a, u_textures_ready);
			float pattern_mask = mix(fbm(screen_uv * vec2(2.2, 1.7)), max(tex_a, tex_b), u_textures_ready);
			float caustic = step(0.46, pattern_mask - abs(pattern_1 - pattern_2));

			float normalized_dist = dist / max(radius, 0.001);
			float ring_wave = sin((normalized_dist - cover_progress) * 70.0 - u_time * 13.0 + sin(angle * 7.0) * 0.7);
			float ring_band = smoothstep(0.66, 1.0, ring_wave * 0.5 + 0.5);
			float ring_window = 1.0 - smoothstep(0.035, 0.28, abs(normalized_dist - cover_progress));
			float inner_ripples = ring_band * ring_window * blot * smoothstep(0.05, 0.35, cover_progress);

			float bubbles = bubble_field(screen_uv + vec2(0.0, -u_time * 0.08), edge + inner_ripples * 0.45, u_time);
			float hold = 1.0 - smoothstep(0.58, 1.0, progress);
			float alpha = clamp(blot * 0.96 + edge * 0.48 + white_crest * 0.5, 0.0, 1.0) * hold;

			vec3 material_back = vec3(0.0677954, 0.0494165, 0.127932);
			vec3 material_main = vec3(0.484705, 0.563804, 0.901795);
			vec3 closeup = vec3(material_main.r * 0.25, material_main.g * 0.5, material_main.b);
			vec3 deep_blue = vec3(0.0, 0.14, 0.76);
			vec3 cyan = vec3(0.06, 0.82, 1.0);
			vec3 foam = vec3(0.88, 1.0, 1.0);

			vec3 water = mix(material_back, deep_blue, 0.72);
			water = mix(water, cyan, 0.34 + screen_uv.y * 0.2);
			water = mix(water, closeup, 0.24);
			water += caustic * vec3(0.18, 0.58, 0.92) * (0.24 + edge * 0.18);
			water += inner_ripples * vec3(0.08, 0.45, 0.85) * 0.22;
			water = mix(water, foam, clamp(white_crest * 0.98 + edge * 0.24 + bubbles * 0.78, 0.0, 1.0));

			gl_FragColor = vec4(water, alpha);
		}
	`;

	function compileShader(type, source) {
		const shader = gl.createShader(type);
		gl.shaderSource(shader, source);
		gl.compileShader(shader);

		if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
			console.warn(gl.getShaderInfoLog(shader));
			gl.deleteShader(shader);
			return null;
		}

		return shader;
	}

	function createProgram() {
		const vertexShader = compileShader(gl.VERTEX_SHADER, vertexShaderSource);
		const fragmentShader = compileShader(gl.FRAGMENT_SHADER, fragmentShaderSource);

		if (!vertexShader || !fragmentShader) return null;

		const nextProgram = gl.createProgram();
		gl.attachShader(nextProgram, vertexShader);
		gl.attachShader(nextProgram, fragmentShader);
		gl.linkProgram(nextProgram);

		if (!gl.getProgramParameter(nextProgram, gl.LINK_STATUS)) {
			console.warn(gl.getProgramInfoLog(nextProgram));
			return null;
		}

		return nextProgram;
	}

	function isPowerOfTwo(value) {
		return (value & (value - 1)) === 0;
	}

	function createTexturePlaceholder(color) {
		const texture = gl.createTexture();
		gl.bindTexture(gl.TEXTURE_2D, texture);
		gl.texImage2D(
			gl.TEXTURE_2D,
			0,
			gl.RGBA,
			1,
			1,
			0,
			gl.RGBA,
			gl.UNSIGNED_BYTE,
			new Uint8Array(color)
		);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);

		return texture;
	}

	function loadTexture(url, color) {
		const texture = createTexturePlaceholder(color);
		const image = new Image();

		image.onload = () => {
			gl.bindTexture(gl.TEXTURE_2D, texture);
			gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
			gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);

			if (isPowerOfTwo(image.width) && isPowerOfTwo(image.height)) {
				gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
				gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);
				gl.generateMipmap(gl.TEXTURE_2D);
			} else {
				gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
				gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
				gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
			}

			loadedTextureCount += 1;
		};

		image.src = url;
		return texture;
	}

	function resizeCanvas() {
		const dpr = Math.min(window.devicePixelRatio || 1, 2);
		const width = Math.floor(window.innerWidth * dpr);
		const height = Math.floor(window.innerHeight * dpr);

		if (canvas.width !== width || canvas.height !== height) {
			canvas.width = width;
			canvas.height = height;
		}

		gl?.viewport(0, 0, canvas.width, canvas.height);
	}

	function initWebGl() {
		gl = canvas.getContext('webgl', {
			alpha: true,
			antialias: true,
			premultipliedAlpha: false
		});

		if (!gl) return false;

		program = createProgram();
		if (!program) return false;

		positionBuffer = gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
		gl.bufferData(
			gl.ARRAY_BUFFER,
			new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]),
			gl.STATIC_DRAW
		);

		gl.enable(gl.BLEND);
		gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
		causticTextureA = loadTexture(causticMaskA, [190, 230, 255, 255]);
		causticTextureB = loadTexture(causticMaskB, [255, 255, 255, 255]);
		resizeCanvas();
		return true;
	}

	function normalizeSource(source) {
		if (source?.clientX !== undefined) {
			return {
				x: source.clientX / window.innerWidth,
				y: 1 - source.clientY / window.innerHeight
			};
		}

		if (source?.x !== undefined && source?.y !== undefined) {
			return {
				x: source.x / window.innerWidth,
				y: 1 - source.y / window.innerHeight
			};
		}

		return { x: 0.5, y: 0.5 };
	}

	function draw(now) {
		if (!activeRipple || !gl || !program) return;

		const elapsed = now - activeRipple.startedAt;
		const progress = Math.min(1, elapsed / duration);

		visible = true;
		resizeCanvas();
		gl.clearColor(0, 0, 0, 0);
		gl.clear(gl.COLOR_BUFFER_BIT);
		gl.useProgram(program);

		const positionLocation = gl.getAttribLocation(program, 'a_position');
		gl.enableVertexAttribArray(positionLocation);
		gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
		gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);

		gl.uniform2f(gl.getUniformLocation(program, 'u_resolution'), canvas.width, canvas.height);
		gl.uniform2f(gl.getUniformLocation(program, 'u_center'), activeRipple.center.x, activeRipple.center.y);
		gl.uniform1f(gl.getUniformLocation(program, 'u_time'), now * 0.001);
		gl.uniform1f(gl.getUniformLocation(program, 'u_progress'), progress);

		gl.activeTexture(gl.TEXTURE0);
		gl.bindTexture(gl.TEXTURE_2D, causticTextureA);
		gl.uniform1i(gl.getUniformLocation(program, 'u_caustic_a'), 0);
		gl.activeTexture(gl.TEXTURE1);
		gl.bindTexture(gl.TEXTURE_2D, causticTextureB);
		gl.uniform1i(gl.getUniformLocation(program, 'u_caustic_b'), 1);
		gl.uniform1f(gl.getUniformLocation(program, 'u_textures_ready'), loadedTextureCount >= 2 ? 1 : 0);

		gl.drawArrays(gl.TRIANGLES, 0, 6);

		if (progress < 1) {
			animationFrame = window.requestAnimationFrame(draw);
			return;
		}

		gl.clear(gl.COLOR_BUFFER_BIT);
		activeRipple = undefined;
		visible = false;
	}

	function playFallback(source) {
		const id = nextFallbackId++;
		const x = source?.clientX ?? source?.x ?? window.innerWidth * 0.5;
		const y = source?.clientY ?? source?.y ?? window.innerHeight * 0.5;

		fallbackRipples = [...fallbackRipples, { id, x, y }];
		window.setTimeout(() => {
			fallbackRipples = fallbackRipples.filter((item) => item.id !== id);
		}, duration);

		return new Promise((resolve) => window.setTimeout(resolve, resolveAt));
	}

	function play(source) {
		if (!gl || !program) return playFallback(source);

		if (animationFrame) window.cancelAnimationFrame(animationFrame);

		activeRipple = {
			center: normalizeSource(source),
			startedAt: performance.now()
		};

		visible = true;
		animationFrame = window.requestAnimationFrame(draw);

		return new Promise((resolve) => window.setTimeout(resolve, resolveAt));
	}

	onMount(() => {
		const unregister = setRippleTransitionRunner(play);
		initWebGl();

		resizeObserver = new ResizeObserver(resizeCanvas);
		resizeObserver.observe(document.documentElement);
		window.addEventListener('resize', resizeCanvas);

		return () => {
			unregister();
			window.removeEventListener('resize', resizeCanvas);
			resizeObserver?.disconnect();
			if (animationFrame) window.cancelAnimationFrame(animationFrame);
			if (gl && causticTextureA) gl.deleteTexture(causticTextureA);
			if (gl && causticTextureB) gl.deleteTexture(causticTextureB);
		};
	});
</script>

<canvas bind:this={canvas} class:visible class="ripple-shader-overlay"></canvas>

{#each fallbackRipples as ripple (ripple.id)}
	<div
		class="ripple-fallback"
		style={`--ripple-x: ${ripple.x}px; --ripple-y: ${ripple.y}px;`}
	></div>
{/each}

<style>
	.ripple-shader-overlay {
		position: fixed;
		inset: 0;
		z-index: 210;
		width: 100vw;
		height: 100vh;
		opacity: 0;
		pointer-events: none;
		transition: opacity 0.08s ease;
	}

	.ripple-shader-overlay.visible {
		opacity: 1;
	}

	.ripple-fallback {
		position: fixed;
		left: var(--ripple-x);
		top: var(--ripple-y);
		z-index: 210;
		width: 36vmax;
		aspect-ratio: 1;
		border-radius: 999px;
		pointer-events: none;
		transform: translate(-50%, -50%) scale(0);
		border: 3px solid rgba(180, 252, 255, 0.9);
		background: radial-gradient(circle, rgba(160, 245, 255, 0.22), rgba(20, 217, 255, 0.18) 45%, transparent 70%);
		animation: ripple-fallback-spread 0.72s ease-out forwards;
	}

	@keyframes ripple-fallback-spread {
		0% { opacity: 0; transform: translate(-50%, -50%) scale(0.08); }
		18% { opacity: 1; }
		100% { opacity: 0; transform: translate(-50%, -50%) scale(2.8); }
	}
</style>
