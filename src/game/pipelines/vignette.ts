// @ts-nocheck
const fragShader = `
#define SHADER_NAME VIGNETTE_FS
precision mediump float;

uniform vec2      uResolution;
uniform sampler2D uMainSampler;
varying vec2      outTexCoord;

void main( void )
{
    vec2 uv = gl_FragCoord.xy / uResolution.xy;          // Current pixel.
    vec4 color = texture2D(uMainSampler, outTexCoord);   // Color of pixel.
    uv *=  1.0 - uv.yx;                                  // Vignette stuff.
    float vig = uv.x*uv.y * 15.0;                        // Vignette intensity.
    vig = pow(vig, 0.25);                                // More vignette stuff.
    color *= vec4(vig);                                  // Combine vignette color with pixel color.
    gl_FragColor = color;                                // Assign new color to pixel.
}
`;

export class Vignette extends Phaser.Renderer.WebGL.Pipelines.PostFXPipeline
{
    constructor(game: Phaser.Game) {
        super({
            game,
            renderTarget: true,
            fragShader,
            uniforms: [
                'uMainSampler',
                'uResolution',
            ],
        });
    }

    onBoot(): void {
        this.set2f('uResolution', this.renderer.width, this.renderer.height);
    }
}
