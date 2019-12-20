attribute vec3 aVertexPosition;
attribute vec3 aVertexNormal;

uniform mat4 uMVMatrix;
uniform mat4 uPMatrix;

uniform float uKS;
uniform float uKD;

varying float KS;
varying float KD;
varying vec3 normal;

void main(void) {
    KS = uKS;
    KD = uKD;  
    normal = aVertexNormal; 
    if(uKS <5.0 ){  
      gl_Position = uPMatrix * uMVMatrix * vec4(aVertexPosition, 1.0);
    }
    else{
      gl_Position =  vec4(aVertexPosition, 1.0);
    }
    
}
