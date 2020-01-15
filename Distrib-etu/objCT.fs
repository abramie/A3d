precision mediump float;

uniform sampler2D uFront;
uniform sampler2D uBack;
uniform sampler2D uLeft;
uniform sampler2D uRight;
uniform sampler2D uBottom;
uniform sampler2D uTop;

varying vec2 texCoords;
varying vec3 normal;
varying vec3 position;
varying mat4 antiRotatMatrix;


const float pi = 3.1415926;
vec3 srcPos = vec3( 0.0,0.0,0.0);
vec3 obsPos = vec3( 0.0,0.0,0.0);
vec3 srcPower =  vec3(1,1,1);

//On utilise une texture en fonction de l'index de la texture.
void main(void)
{
    vec3 Normal3DN = normalize(normal);
    vec3 Vi = normalize(srcPos - position); //Vecteur incidant.
    vec3 Vo = normalize(obsPos - position);

    vec3 M = reflect(-Vi,Normal3DN);
    vec3 NormalAntiRotate = vec3 (antiRotatMatrix * vec4 (Normal3DN, 1.0));
    gl_FragColor = texture2D(uFront, vec2(texCoords.s, texCoords.t));
}
