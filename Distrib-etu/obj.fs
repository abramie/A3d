precision mediump float;

varying vec2 texCoords;
varying float texIndex;

uniform sampler2D uFront;
uniform sampler2D uBack;
uniform sampler2D uLeft;
uniform sampler2D uRight;
uniform sampler2D uBottom;
uniform sampler2D uTop;


vec3 red = vec3(1,0,0);

//On utilise une texture en fonction de l'index de la texture.
void main(void)
{
    gl_FragColor = vec4(red,1.0);

}
