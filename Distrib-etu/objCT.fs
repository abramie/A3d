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
varying vec3 pointInSkybox;


const float pi = 3.1415926;
vec3 srcPos = vec3( 0.0,0.0,0.0);
vec3 obsPos = vec3( 0.0,0.0,0.0);
vec3 srcPower =  vec3(1,1,1);


float intersection(vec3 normalFace, vec3 rayon, vec3 normal)
{
    float t = -( dot(normalFace,pointInSkybox) + sizeSkybox / 2.0) / dot(normalFace, rayon);
    return t;
}

mat2 rotate2d(float angle){
    angle = angle * (pi/180.0);
    return mat2(cos(angle), -sin(angle),
                sin(angle), cos(angle));
}


//On utilise une texture en fonction de l'index de la texture.
void main(void)
{
    vec3 antiPosition = vec3( antiRotatMatrix * vec4(position, 1.0));

    vec3 Normal3DN = normalize(normal);
    vec3 Vi = normalize(srcPos - position); //Vecteur incident.
    vec3 Vo = normalize(obsPos - position);

    vec3 M = -reflect(-Vo,Normal3DN); //ça marche à peut pres, 
   
    vec3 MAntiRotate = vec3 (antiRotatMatrix * vec4 (M, 1.0));

    gl_FragColor = vec4(1.0,0.0,0.0,1.0);
    
    float mini = -1.0;
    float t = 1.0 / 0.0;

    float tprime = intersection(Front,MAntiRotate, Normal3DN);
    if(tprime < t && tprime > 0.0){
        mini = 0.0;
        t = tprime;
    }

    tprime = intersection(Back,MAntiRotate, Normal3DN);
    if(tprime < t && tprime > 0.0){
        mini = 1.0;
        t = tprime;
    }

    tprime = intersection(Left,MAntiRotate, Normal3DN);
    if(tprime < t && tprime > 0.0){
        mini = 2.0;
        t = tprime;
    }

    tprime = intersection(Right,MAntiRotate, Normal3DN);
    if(tprime < t && tprime > 0.0){
        mini = 3.0;
        t = tprime;
    }

    tprime = intersection(Bottom,MAntiRotate, Normal3DN);
    if(tprime < t && tprime > 0.0){
        mini = 4.0;
        t = tprime;
    }

    tprime = intersection(Top,MAntiRotate, Normal3DN);
    if(tprime < t && tprime > 0.0){
        mini = 5.0;
        t = tprime;
    }


    vec3 inter = (position + t * MAntiRotate)/(sizeSkybox*2.0) + vec3( 0.5,0.5,0.5);
    vec2 textCoord;
    
//La couleur afficher depend de l'angle d'où on regarde au lieu de la texture
//ça affiche la couleur du front quand on regarde de face :/
    if(mini == 0.0){
        textCoord = vec2( inter.x , inter.y);
        textCoord = textCoord * rotate2d(180.0);
        gl_FragColor = texture2D(uFront, textCoord);
        //gl_FragColor = vec4(0.7,0.1,0.1,1.0);
    } else if (mini == 1.0){
        textCoord = vec2( -inter.x , inter.y);
        textCoord = textCoord * rotate2d(180.0);
        gl_FragColor = texture2D(uBack, textCoord);
        //gl_FragColor = vec4(0.0706, 0.4784, 0.0706, 1.0);
    } else if (mini == 2.0 ){
        textCoord = vec2( inter.y , inter.z);
        textCoord = textCoord * rotate2d(270.0);
        gl_FragColor = texture2D(uLeft, textCoord);
       //gl_FragColor = vec4(0.0,0.0,0.8,1.0);
    } else if (mini == 3.0) {
        textCoord = vec2( inter.y , -inter.z);
        textCoord = textCoord * rotate2d(270.0);
        gl_FragColor = texture2D(uRight, textCoord);
       // gl_FragColor = vec4(0.3255, 0.0196, 0.3608, 1.0);
    } else if (mini == 4.0){
        textCoord = vec2( inter.z , inter.x);
        gl_FragColor = texture2D(uBottom, textCoord);
       // gl_FragColor = vec4(0.1,0.6,0.1,1.0);
    } else if (mini == 5.0){
        textCoord = vec2( inter.z , -inter.x);
        gl_FragColor = texture2D(uTop, textCoord);
       // gl_FragColor = vec4(0.702, 0.3608, 0.5961, 0.699);
    }else{
        gl_FragColor = vec4(1.0,1.0,1.0,1.0);
    }

 
}