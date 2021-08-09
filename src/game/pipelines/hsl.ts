// @ts-nocheck
const fragShader = `\
#ifdef GL_FRAGMENT_PRECISION_HIGH
#define highmedp highp
#else
#define highmedp mediump
#endif
precision highmedp float;
// Scene buffer
uniform sampler2D uMainSampler;
varying vec2 outTexCoord;
// Effect parameters
uniform float hueRotate;
uniform float satAdjust;
uniform float lumAdjust;

vec3 RGBToHSL(vec3 color) {
    vec3 hsl = vec3(0.0, 0.0, 0.0);

    float fmin = min(min(color.r, color.g), color.b);
    float fmax = max(max(color.r, color.g), color.b);
    float delta = fmax - fmin;
    hsl.z = (fmax + fmin) / 2.0;
    if (delta == 0.0) {
          hsl.x = 0.0;
          hsl.y = 0.0;
      } else {
          if (hsl.z < 0.5) {
              hsl.y = delta / (fmax + fmin);
      } else {
        hsl.y = delta / (2.0 - fmax - fmin);
      }

          float dR = (((fmax - color.r) / 6.0) + (delta / 2.0)) / delta;
          float dG = (((fmax - color.g) / 6.0) + (delta / 2.0)) / delta;
          float dB = (((fmax - color.b) / 6.0) + (delta / 2.0)) / delta;
          if (color.r == fmax) {
              hsl.x = dB - dG;
      } else if (color.g == fmax) {
              hsl.x = (1.0 / 3.0) + dR - dB;
          } else if (color.b == fmax) {
        hsl.x = (2.0 / 3.0) + dG - dR;
      }
          if (hsl.x < 0.0) {
              hsl.x += 1.0;
      } else if (hsl.x > 1.0) {
        hsl.x -= 1.0;
      }
      }
      return hsl;
  }

  float HUEToRGB(float f1, float f2, float hue) {
    if (hue < 0.0) {
      hue += 1.0;
    } else if (hue > 1.0) {
      hue -= 1.0;
    }

    float ret;

      if ((6.0 * hue) < 1.0) {
          ret = f1 + (f2 - f1) * 6.0 * hue;
    } else if ((2.0 * hue) < 1.0) {
          ret = f2;
      } else if ((3.0 * hue) < 2.0) {
          ret = f1 + (f2 - f1) * ((2.0 / 3.0) - hue) * 6.0;
    } else {
        ret = f1;
    }

    return ret;
  }

  vec3 HSLToRGB(vec3 hsl) {
	vec3 rgb = vec3(hsl.z);

	if (hsl.y != 0.0) {
		float f2;

		if (hsl.z < 0.5) {
		  f2 = hsl.z * (1.0 + hsl.y);
    } else {
      f2 = (hsl.z + hsl.y) - (hsl.y * hsl.z);
    }

		float f1 = 2.0 * hsl.z - f2;

		rgb.r = HUEToRGB(f1, f2, hsl.x + (1.0 / 3.0));
		rgb.g = HUEToRGB(f1, f2, hsl.x);
		rgb.b = HUEToRGB(f1, f2, hsl.x - (1.0 / 3.0));
  }

  return rgb;
}

void main(void) {
	vec4 front = texture2D(uMainSampler, outTexCoord);
	vec3 hsl = RGBToHSL(front.rgb);
	hsl.x -= hueRotate;
	hsl.y *= satAdjust;
	hsl.z += (lumAdjust - 0.5) * front.a;
	vec3 rgb = HSLToRGB(hsl);
	gl_FragColor = vec4(rgb, front.a);
}
`;

export class HSL extends Phaser.Renderer.WebGL.Pipelines.PostFXPipeline {
    constructor(game) {
        super({
            game: game,
            renderTarget: true,
            fragShader
        });

        this.hueRotate = 0;
        this.satAdjust = 1;
        this.lumAdjust = 0.5;
    }

    onPreRender() {
        this.set1f('hueRotate', (this.hueRotate) % 1);
        this.set1f('satAdjust', this.satAdjust);
        this.set1f('lumAdjust', this.lumAdjust);
    }

    // hueRotate
    setHueRotate(value) {
        this.hueRotate = value; // 0: rotate 0 degrees, 0.5: rotate 180 degrees, 1: rotate 360 degrees
        return this;
    }

    // satAdjust
    setSatAdjust(value) {
        this.satAdjust = value;  // 0: gray, 1: original color, > 1:
        return this;
    }

    // lumAdjust
    setLumAdjust(value) {
        this.lumAdjust = value;  // 0: dark, 0.5: original color, 1: white
        return this;
    }
}
