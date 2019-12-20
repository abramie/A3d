precision mediump float;

uniform sampler2D uTex;
varying float KS;
varying float KD;
varying vec3 normal;

vec3 red = vec3(1,0,0);
vec3 blue = vec3(0,0,1);

const float pi = 3.1415926;
void main(void)
{
    if(KD < 5.0 ){
      gl_FragColor = vec4(normal*red,1.0);
    }else{
      gl_FragColor = vec4(blue,1.0);
    }

}
