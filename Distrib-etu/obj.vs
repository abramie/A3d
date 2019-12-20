attribute vec3 aVertexPosition;
attribute vec3 aVertexNormal;

uniform mat4 transMatrix;
uniform mat4 rotatMatrix;


uniform mat4 uPMatrix;

uniform vec3 uKS;
uniform vec3 uKD;
uniform float uN;

varying vec3 KS;
varying vec3 KD;
varying float N;

varying vec3 normal;
varying vec3 position;

void main(void) {
    KS = uKS;
    KD = uKD;
    N = uN;
    normal = vec3( rotatMatrix * vec4(aVertexNormal, 1.0)) ;  //On multiplie la normal par la rotation, mais pas la translatation.
 
    position = vec3( transMatrix * rotatMatrix   * vec4(aVertexPosition, 1.0));

    gl_Position = uPMatrix * transMatrix *rotatMatrix *  vec4(aVertexPosition, 1.0);
    
}
