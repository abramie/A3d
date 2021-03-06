precision mediump float;

uniform sampler2D uTex;
varying vec3 KS;
varying vec3 KD;
varying float N;

varying vec3 normal;
varying vec3 position;

vec3 red = vec3(1,0,0);
vec3 blue = vec3(0,0,1);

const float pi = 3.1415926;
vec3 srcPos = vec3( 0.0,0.0,0.0);
vec3 obsPos = vec3( 0.0,0.0,0.0);
vec3 srcPower =  vec3(1,1,1);

void main(void)
{
  vec3 Normal3DN = normalize(normal);
  vec3 Vi = normalize(srcPos - position);
  vec3 Vo = normalize(obsPos - position);

  vec3 M = reflect(-Vi,Normal3DN);
  float cosAlphaPowN = pow(dot(Vo,M), N) ;

  float cosTeta = max(dot(Normal3DN,Vi),0.0);
  
  gl_FragColor = vec4(srcPower * (KD/pi+ (KS* ((N+2.0)/(2.0*pi)) * cosAlphaPowN )) * cosTeta, 1.0);
}
