// @ts-nocheck
const fragShader = `
#define SHADER_NAME SOFTLIGHT_FS
precision mediump float;

uniform vec2      uResolution;
uniform sampler2D uMainSampler;
varying vec2      outTexCoord;

vec3 SoftLight(vec3 a, vec3 b)
{
    vec3 r = (1.0 - a) * a * b + a * (1.0 - (1.0 - a) * (1.0 - b));
    return r;
}

void main( void )
{
    vec2 uv = gl_FragCoord.xy / uResolution.xy;          // Current pixel.
    vec4 color = texture2D(uMainSampler, outTexCoord);   // Color of pixel.
    vec3 light = vec3(0.4, 0.8, 1);                    // Color of light.
    // vec3 light = vec3(0, 0, 1);                    // Color of light.
    vec3 mixColor = SoftLight(color.rgb, light);         // Blend colors.
    gl_FragColor = vec4(mixColor, 1.0);                  // Set pixel color.
}
`;

export class SoftLight extends Phaser.Renderer.WebGL.Pipelines.PostFXPipeline {
    constructor(game: Phaser.Game) {
        super({
            game,
            renderTarget: true,
            fragShader,
            uniforms: [
                'uMainSampler',
                'uResolution',
            ]
        });
    }

    onPreRender(): void {
        this.set1f('uResolution', this.renderer.width);
    }
}
