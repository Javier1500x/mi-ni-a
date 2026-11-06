'use strict';

const loadTexture = async (texture, url) => {
    const result = await fetch(url);
    const blob = await result.blob();
    const data = await createImageBitmap(blob);
    texture({data,
        wrapS: 'repeat',
        wrapT: 'repeat'
    });
};

module.exports = (regl, data, useReflexion) => {
    const wallTexture = regl.texture();
    const floorTexture = regl.texture();
    loadTexture(wallTexture, "res/wall.jpg");
    loadTexture(floorTexture, "res/floor.jpg");
    return regl({
        frag: `
        precision mediump float;
        varying vec3 v_pos, v_relativepos, v_normal;
        uniform sampler2D wallTexture;
        uniform sampler2D floorTexture;

        void main() {
            float lightMap = texture2D(wallTexture, vec2(v_pos.x + v_pos.z, 7.0-v_pos.y)/8.0).r;
            float dist = length(v_relativepos);
            vec3 color;

            if (v_normal.y < -0.5) {
                color = vec3(0.10, 0.07, 0.075);
                vec2 cell = abs(fract(v_pos.xz / 8.0) - 0.5) * 8.0;
                color += vec3(0.30, 0.23, 0.15) * smoothstep(1.8, 0.2, length(cell));
            } else if (v_normal.y > 0.5) {
                float tile = texture2D(floorTexture, v_pos.xz / 8.0).r;
                color = vec3(0.55, 0.47, 0.38) * (0.72 + 0.55 * tile);
            } else {
                float warm = 0.5 + 0.5 * sin((v_pos.x + v_pos.z) * 0.012);
                vec3 tint = mix(vec3(1.0, 0.96, 0.91), vec3(1.0, 0.88, 0.86), warm * 0.4);
                color = tint * (0.46 + 0.66 * lightMap);
                color *= mix(0.84, 1.04, smoothstep(0.0, 4.5, v_pos.y));
                if (v_pos.y < 0.30) {
                    color = vec3(0.17, 0.065, 0.085) * (0.75 + 0.4 * lightMap);
                } else if (v_pos.y < 0.34) {
                    color = vec3(0.73, 0.57, 0.28);
                }
                if (v_pos.y > 6.78) {
                    color = vec3(0.73, 0.57, 0.28);
                }
            }

            float alpha = .98+smoothstep(150.,0.,dist)-v_normal.y; // reflexion
            gl_FragColor = vec4(color, ${useReflexion ? "alpha" : "1.0"});
        }`,

        vert: `
        precision highp float;
        uniform mat4 proj, view;
        attribute vec3 position, normal;
        varying vec3 v_pos, v_relativepos, v_normal;
        uniform float yScale;
        void main() {
            vec3 pos = position;
            v_pos = pos;
            v_relativepos = (view * vec4(pos, 1)).xyz;
            pos.y *= yScale;
            v_normal = normal;
            gl_Position = proj * view * vec4(pos, 1);
        }`,

        attributes: {
            position: data.position,
            normal: data.normal
        },

        blend: useReflexion ? {
            enable: true,
            func: {
                src: 'src alpha',
                dst: 'one minus src alpha'
            },
        } : {},

        uniforms: {
            wallTexture,
            floorTexture
        },

        elements: new Uint32Array(data.elements)
    });
};