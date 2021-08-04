// @ts-nocheck
const fragShader = `
#define SHADER_NAME CONTRAST_FS
precision mediump float;

uniform vec2      uResolution;
uniform sampler2D uMainSampler;
varying vec2      outTexCoord;

float remap(float value, float inputMin, float inputMax, float outputMin, float outputMax)
{
    return (value - inputMin) * ((outputMax - outputMin) / (inputMax - inputMin)) + outputMin;
}

void main( void )
{
    vec2 uv = gl_FragCoord.xy / uResolution.xy;
    float normalizedContrast = 0.7;
    float contrast = remap(normalizedContrast, 0.0, 1.0, 0.2, 4.0);
    if(uv.y > 0.95)
    {
        gl_FragColor = uv.x > normalizedContrast ? vec4(0.0, 1.0, 0.8, 1.0) : vec4(0.0, 0.0, 0.0, 1.0);
    }
    else
    {
        vec4 srcColor = texture2D(uMainSampler, outTexCoord);
        vec4 dstColor = vec4((srcColor.rgb - vec3(0.5)) * contrast + vec3(0.5), 1.0);
        gl_FragColor = clamp(dstColor, 0.0, 1.0);
    }
}
`;

/**
 * TODO: Contrast shader doesn't work.
 */
export class Contrast extends Phaser.Renderer.WebGL.Pipelines.PostFXPipeline {
    constructor (game: Phaser.Game) {
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
