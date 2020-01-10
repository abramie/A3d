attribute vec3 aVertexPosition;
attribute vec2 aTexCoords;
attribute vec3 aVertexNormal;

//attribute float aTexIndex;

uniform mat4 transMatrix;
uniform mat4 rotatMatrix;
uniform mat4 antirotatMatrix
uniform mat4 uPMatrix;

varying vec2 texCoords;
//varying mat4 antirotateMatrix;
//
//varying float texIndex;


varying vec3 normal;
varying vec3 position;

void main(void) {
    texCoords = aTexCoords;
//    antirotateMatrix = antirotatMatrix;
    //On transmet l'index de texture du sommet à tous ses fragments ) s
//    texIndex = aTexIndex;

    normal = vec3( rotatMatrix * vec4(aVertexNormal, 1.0)) ;
    gl_Position = uPMatrix * transMatrix*rotatMatrix * vec4(aVertexPosition, 1.0);


}
