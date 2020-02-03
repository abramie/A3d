attribute vec3 aVertexPosition;
attribute vec3 aVertexNormal;


uniform mat4 transMatrix;
uniform mat4 rotatMatrix;
uniform mat4 uantiRotatMatrix;
uniform mat4 uPMatrix;

varying vec2 texCoords;
varying mat4 antiRotatMatrix;



varying vec3 normal;
varying vec3 position;

void main(void) {
    antiRotatMatrix = uantiRotatMatrix;
    //On transmet l'index de texture du sommet à tous ses fragments ) s

    normal = vec3( rotatMatrix * vec4(aVertexNormal, 1.0));
    gl_Position = uPMatrix * transMatrix*rotatMatrix * vec4(aVertexPosition, 1.0);
}