precision mediump float;

varying vec2 texCoords;
//varying float texIndex;

uniform sampler2D uTex;


vec3 red = vec3(1,0,0);

//On utilise une texture en fonction de l'index de la texture.
void main(void)
{
    gl_FragColor = vec4(red,1.0);

}
