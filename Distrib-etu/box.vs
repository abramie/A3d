attribute vec3 aVertexPosition;
attribute vec2 aTexCoords;

attribute float aTexIndex;

uniform mat4 transMatrix;
uniform mat4 rotatMatrix;
uniform mat4 uPMatrix;

varying vec2 texCoords;

varying float texIndex;

void main(void) {
    texCoords = aTexCoords;
    //On transmet l'index de texture du sommet à tous ses fragments ) s
    texIndex = aTexIndex;
    gl_Position = uPMatrix * transMatrix*rotatMatrix * vec4(aVertexPosition, 1.0);
    
}
