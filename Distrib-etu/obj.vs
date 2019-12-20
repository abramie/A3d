attribute vec3 aVertexPosition;
attribute vec3 aVertexNormal;
attribute vec2 aTexCoords;

//attribute float aTexIndex;

uniform mat4 uMVMatrix;
uniform mat4 uPMatrix;

uniform float KS;
uniform float KD;
varying vec2 texCoords;

//varying float texIndex;

void main(void) {
    texCoords = aTexCoords;
    //On transmet l'index de texture du sommet à tous ses fragments ) s
    //texIndex = aTexIndex;

//Test pour verifier que la variable est bien transmise au vertex
    if(KS < 5.0){
      gl_Position = uPMatrix * uMVMatrix * vec4(aVertexPosition, 1.0);
    }else{
      gl_Position = vec4(aVertexPosition, 1.0);
    }
    
    
}
