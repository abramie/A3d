precision mediump float;

varying vec2 texCoords;
varying float texIndex;

uniform sampler2D uFront;
uniform sampler2D uBack;
uniform sampler2D uLeft;
uniform sampler2D uRight;
uniform sampler2D uBottom;
uniform sampler2D uTop;


vec3 colorA = vec3(1,0,0);
vec3 colorB = vec3(0,1,0);
vec3 colorC = vec3(0,0,1);
vec3 colorD = vec3(1,1,0);
vec3 colorE = vec3(1,0,1);
vec3 colorF = vec3(0,1,1);

uniform float sizeSkybox;

//On utilise une texture en fonction de l'index de la texture.
void main(void)
{
if(sizeSkybox != 0.0)gl_FragColor = vec4(0.0,1.0,0.0,1.0);
	if(texIndex >= 0.9 && texIndex <= 1.1){
	    gl_FragColor = texture2D(uFront, vec2(texCoords.s, texCoords.t));
	}
	else if(texIndex >= 1.9 && texIndex <= 2.1){
		gl_FragColor = texture2D(uBack, vec2(texCoords.s, texCoords.t));
	}
	else if(texIndex >= 2.9 && texIndex <= 3.1){
		gl_FragColor = texture2D(uLeft, vec2(texCoords.s, texCoords.t));
	}
	else if(texIndex >= 3.9 && texIndex <= 4.1){
		gl_FragColor = texture2D(uRight, vec2(texCoords.s, texCoords.t));
	}
	else if(texIndex >= 4.9 && texIndex <= 5.1){
		gl_FragColor = texture2D(uBottom, vec2(texCoords.s, texCoords.t));
	}
	else if(texIndex >= 5.9 && texIndex <= 6.1){
		gl_FragColor = texture2D(uTop, vec2(texCoords.s, texCoords.t));
	}



}
