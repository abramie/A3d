precision mediump float;

uniform sampler2D uFront;
uniform sampler2D uBack;
uniform sampler2D uLeft;
uniform sampler2D uRight;
uniform sampler2D uBottom;
uniform sampler2D uTop;

uniform float sizeSkybox;

const vec3 Front = vec3(0.0,0.0,-0.5);
const vec3 Back = vec3(0.0,0.0,0.5);
const vec3 Left = vec3(-0.5,0.0,0.0);
const vec3 Right = vec3(0.5,0.0,0.0);
const vec3 Bottom = vec3(0.0,-0.5,0.0);
const vec3 Top = vec3(0.0,0.5,0.0);

varying vec2 texCoords;
varying vec3 normal;
varying vec3 position;
varying mat4 antiRotatMatrix;


const float pi = 3.1415926;
vec3 srcPos = vec3( 0.0,0.0,0.0);
vec3 obsPos = vec3( 0.0,0.0,0.0);
vec3 srcPower =  vec3(1,1,1);

float intersection(vec3 normalFace, vec3 rayon, vec3 normal)
{
    float t = -( dot(normalFace,obsPos) + sizeSkybox) / dot(normal, rayon);
    return t;
}

//On utilise une texture en fonction de l'index de la texture.
void main(void)
{


    vec3 Normal3DN = normalize(normal);
    vec3 Vi = normalize(srcPos - position); //Vecteur incidant.
    vec3 Vo = normalize(obsPos - position);

    vec3 M = reflect(-Vo,Normal3DN);
    vec3 MAntiRotate = vec3 (antiRotatMatrix * vec4 (M, 1.0));
    //gl_FragColor = texture2D(uFront, vec2(texCoords.s, texCoords.t));


    float mini = 0.0;
    float t = intersection(Front,M, Normal3DN);

    float tprime = intersection(Back,M, Normal3DN);
    if(tprime < t){
        mini = 1.0;
        t = tprime;
    }
    tprime = intersection(Left,M, Normal3DN);
    if(tprime < t){
        mini = 2.0;
        t = tprime;
    }

    tprime = intersection(Right,M, Normal3DN);
    if(tprime < t){
        mini = 3.0;
        t = tprime;
    }

    tprime = intersection(Bottom,M, Normal3DN);
    if(tprime < t){
        mini = 4.0;
        t = tprime;
    }
    tprime = intersection(Top,M, Normal3DN);
    if(tprime < t){
        mini = 5.0;
        t = tprime;
    }

    // t <- Le minimum
    //mini <- la face qui correspond.

    vec3 inter = (Vo + t * M);
    vec2 textCoord;
    //sampler2D texture uFront;

    if(mini == 0.0){
        textCoord = vec2( inter.x/sizeSkybox , inter.y/sizeSkybox);
        gl_FragColor = texture2D(uFront, textCoord);
    } else if (mini == 1.0){
        textCoord = vec2( inter.x/sizeSkybox , inter.y/sizeSkybox);
        gl_FragColor = texture2D(uBack, textCoord);
    } else if (mini == 2.0 ){
        textCoord = vec2( inter.y/sizeSkybox , inter.z/sizeSkybox);
        gl_FragColor = texture2D(uLeft, textCoord);
    } else if (mini == 3.0) {
        textCoord = vec2( inter.y/sizeSkybox , inter.z/sizeSkybox);
        gl_FragColor = texture2D(uRight, textCoord);
    } else if (mini == 4.0){
        textCoord = vec2( inter.x/sizeSkybox , inter.y/sizeSkybox);
        gl_FragColor = texture2D(uBottom, textCoord);
    } else if (mini == 5.0){
        textCoord = vec2( inter.x/sizeSkybox , inter.y/sizeSkybox);
        gl_FragColor = texture2D(uTop, textCoord);
    }
}