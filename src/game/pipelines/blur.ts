// @ts-nocheck
const fragShader = `
#define SHADER_NAME SOFTLIGHT_FS
precision mediump float;

uniform vec2      uResolution;
uniform sampler2D uMainSampler;
varying vec2      outTexCoord;

float normpdf(in float x, in float sigma)
{
    return 0.39894*exp(-0.5*x*x/(sigma*sigma))/sigma;
}

void main( void )
{
    vec3 c = texture2D(uMainSampler, gl_FragCoord.xy / uResolution.xy).rgb;

    // declare stuff
    const int mSize = 50;
    const int kSize = (mSize-1)/2;
    float kernel[mSize];
    vec3 final_colour = vec3(0.0);

    // create the 1-D kernel
    float sigma = 7.0;
    float Z = 0.0;
    for (int j = 0; j <= kSize; ++j)
    {
        kernel[kSize+j] = kernel[kSize-j] = normpdf(float(j), sigma);
    }

    // get the normalization factor (as the gaussian has been clamped)
    for (int j = 0; j < mSize; ++j)
    {
        Z += kernel[j];
    }

    // read out the texels
    for (int i=-kSize; i <= kSize; ++i)
    {
        for (int j=-kSize; j <= kSize; ++j)
        {
            final_colour += kernel[kSize+j]*kernel[kSize+i]*texture2D(uMainSampler, (gl_FragCoord.xy+vec2(float(i),float(j))) / uResolution.xy).rgb;

        }
    }

    gl_FragColor = vec4(final_colour/(Z*Z), 1.0);
}
`;

/**
 * TODO: Blur shader doesn't work.
 */
export class Blur extends Phaser.Renderer.WebGL.Pipelines.PostFXPipeline {
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
