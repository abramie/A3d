/*
 @authors : Marine Droit & Jérémy Rousseau
*/

// =====================================================
var gl;
// =====================================================
var mvMatrix = mat4.create();
var rotationMatrix = mat4.create();
var antiRotationMatrix = mat4.create();
var translateMatrix = mat4.create();
var pMatrix = mat4.create();
var objMatrix = mat4.create();
// =====================================================
var shaderProgram = null;

//Les objets a afficher
var skybox;
var middleobject;

// parametres Phong
var value_ks = 0.5;
var value_kd = 0.8;
var value_n = 20;
var value_couleur_materiau;
var value_couleur_speculaire;
////////


var sizeSkyBox = 2000;
var textures;
var shader_actif = "miroir";
var name_object = "teapot.obj"


// =====================================================
// IHM et controles 
// =====================================================

var mySelect;

/**
 * Cache ou revele les parametres en fonction du shader choisi
 */
function update_IHM(){
  switch(shader_actif){
    case "miroir":
        document.getElementById("phong_param").style.visibility="hidden";
        break;

    case "phong":
        document.getElementById("phong_param").style.visibility="visible"
        break;
  }
}

/**
 * Rappel le constructeur de MiddleObject et redefini le shader actif
 */
function update_objet(){
  var shader;
  switch(shader_actif){
    case "miroir":
        shader = "objCT";
        break;

    case "phong":
        shader = "objPhong";
        break;
  }
    middleobject = new MiddleObject(shader, name_object);
}

/**
 * Fonction de redimensionnement du canvas
 * @param {gl.canvas } canvas 
 * @author https://webglfundamentals.org/webgl/lessons/webgl-resizing-the-canvas.html
 */
function resize(canvas) {
  // Lookup the size the browser is displaying the canvas.
  var displayWidth  = canvas.clientWidth;
  var displayHeight = canvas.clientHeight;
 
  // Check if the canvas is not the same size.
  if (canvas.width  != displayWidth ||
      canvas.height != displayHeight) {
 
    // Make the canvas the same size
    canvas.width  = displayWidth;
    canvas.height = displayHeight;
  }
}

function initialisation_IHM(){
  //Identification du shader actif 
    var shad_radio = document.getElementsByName("choix_shader");
    for (var i = 0; i < shad_radio.length; i++) {
      shad_radio[i].addEventListener('change', function() {
          shader_actif = this.value;
          console.log(shader_actif)
          update_IHM();
          update_objet();
      });
    }
    document.getElementById(shader_actif).checked = true;
    
    
    //Recuperation des valeurs des ranges pour kd et ks, met � jour la variable
    //global correspondante
    try{
      var balise_kd = document.getElementById('kd');
      var balise_value_kd = document.getElementById('value_kd');
      value_kd = parseFloat(balise_kd.value);
      
      balise_value_kd.textContent = value_kd;
      balise_kd.onchange = function(e){
        balise_value_kd.textContent = balise_kd.value;
        value_kd = parseFloat(balise_kd.value);
        if(value_ks + value_kd > 1){
          value_ks = 1 - value_kd;
          balise_ks.value = value_ks;
          balise_value_ks.textContent = balise_ks.value;
        }
      };
      
    }
    catch(error){
      console.log("erreur balise kd");
    }
    
    try{
      var balise_ks = document.getElementById('ks');
      value_ks = parseFloat(balise_ks.value);
      var balise_value_ks = document.getElementById('value_ks');
      balise_value_ks.textContent = balise_ks.value;
      balise_ks.onchange = function(e){
        balise_value_ks.textContent = balise_ks.value;
        value_ks = parseFloat(balise_ks.value);
        if(value_ks + value_kd > 1){
          value_kd = 1 - value_ks;
          balise_kd.value = value_kd;
          balise_value_kd.textContent = balise_kd.value;
        }
      };
    }
    catch(error){
      console.log("erreur balise ks");
    }
   
    
    try{
      var balise_n = document.getElementById('n');
      value_n = balise_n.value;
      var balise_value_n = document.getElementById('value_n');
      balise_value_n.textContent = balise_n.value;
      balise_n.onchange = function(e){
        balise_value_n.textContent = balise_n.value;
        value_n = balise_n.value;
      };
    }
    catch(error){
      console.log("erreur balise N");
    }
   
    
    //Color pickers
    try{
      var balise_couleur_materiau = document.getElementById('couleur_materiau');
      value_couleur_materiau = hexToRgb(balise_couleur_materiau.value);
      
      balise_couleur_materiau.onchange = function(e){
        value_couleur_materiau = hexToRgb(balise_couleur_materiau.value);
      };
    }catch(error){
      console.log("Erreur balise couleur materiau")
    }
   
    try{
      var balise_couleur_lumiere = document.getElementById('couleur_lumiere');
      value_couleur_lumiere = hexToRgb(balise_couleur_lumiere.value);
      
      balise_couleur_lumiere.onchange = function(e){
        value_couleur_lumiere = hexToRgb(balise_couleur_lumiere.value);
      };
    }catch(error){
      console.log("Erreur balise couleur lumiere")
    }
  

    
    //Selecteur de texture
    mySelect = document.getElementById('texture-select');
    
    mySelect.onchange = function (e) {
        var selectedOption = mySelect[mySelect.selectedIndex];
        var selectedText = selectedOption.value;
        if(selectedText != "")
            skybox = new SkyBox(sizeSkyBox,  selectedText);
    }

     //Selecteur de texture
     mySelectOBJ = document.getElementById('objet-select');
    
     mySelectOBJ.onchange = function (e) {
         var selectedOption = mySelectOBJ[mySelectOBJ.selectedIndex];
         var selectedText = selectedOption.value;
         if(selectedText != "")
            name_object = selectedText;
            update_objet();
     }

    
}

// =====================================================
// FONCTIONS GENERALES, INITIALISATIONS
// =====================================================


// =====================================================
function webGLStart() {
    var canvas = document.getElementById("WebGL-test");

    
    mat4.identity(objMatrix);
    canvas.onmousedown = handleMouseDown;
    document.onmouseup = handleMouseUp;
    document.onmousemove = handleMouseMove;
    initGL(canvas);
    
    //Initialisation des objets
    initialisation_IHM();

    skybox = new SkyBox(sizeSkyBox,  mySelect[mySelect.selectedIndex].value);
    update_objet();
    update_IHM();
    tick();
}

// =====================================================
function initGL(canvas)
{
    try {
        gl = canvas.getContext("experimental-webgl");
        gl.viewportWidth = canvas.clientWidth;
        gl.viewportHeight = canvas.clientHeight;
        gl.viewport(0, 0, canvas.width, canvas.height);

        gl.clearColor(0.7, 0.7, 0.7, 1.0);
        gl.enable(gl.DEPTH_TEST);
        gl.enable(gl.CULL_FACE);
        gl.cullFace(gl.BACK);
    } catch (e) {}
    if (!gl) {
            console.log("Could not initialise WebGL");
    }
}

// =====================================================
function loadShaders(Obj3D) {
	loadShaderText(Obj3D,'.vs');
	loadShaderText(Obj3D,'.fs');
}

// =====================================================
function loadShaderText(Obj3D,ext) {   // lecture asynchrone...
	var xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = function() {
		if (xhttp.readyState == 4 && xhttp.status == 200) {
                
				if(ext=='.vs') { Obj3D.vsTxt = xhttp.responseText; Obj3D.loaded ++; }
				if(ext=='.fs') { Obj3D.fsTxt = xhttp.responseText; Obj3D.loaded ++; }
				if(Obj3D.loaded==2) {
					Obj3D.loaded ++;
					compileShaders(Obj3D);
          Obj3D.setShadersParams();
					console.log("Shader ok : "+Obj3D.fname+".");
					Obj3D.loaded ++;
				}
                
		}
	}
	Obj3D.loaded = 0;
	xhttp.open("GET", Obj3D.fname+ext, true);
	xhttp.send();
}

// =====================================================
function compileShaders(Obj3D)
{
	console.log("compiling vshader "+Obj3D.fname);

	Obj3D.vshader = gl.createShader(gl.VERTEX_SHADER);
	gl.shaderSource(Obj3D.vshader, Obj3D.vsTxt);
	gl.compileShader(Obj3D.vshader);
	if (!gl.getShaderParameter(Obj3D.vshader, gl.COMPILE_STATUS)) {
		console.log("Vertex Shader FAILED... "+Obj3D.fname+".vs");
		console.log(Obj3D.vsTxt);
		console.log(gl.getShaderInfoLog(Obj3D.vshader));
		return null;
	}

	console.log("compiling fshader "+Obj3D.fname);

	Obj3D.fshader = gl.createShader(gl.FRAGMENT_SHADER);
	gl.shaderSource(Obj3D.fshader, Obj3D.fsTxt);
	gl.compileShader(Obj3D.fshader);
	if (!gl.getShaderParameter(Obj3D.fshader, gl.COMPILE_STATUS)) {
		console.log("Fragment Shader FAILED... "+Obj3D.fname+".fs");
		return null;
	}

	console.log("linking ("+Obj3D.fname+") shader");

	Obj3D.shader = gl.createProgram();

	gl.attachShader(Obj3D.shader, Obj3D.vshader);
	gl.attachShader(Obj3D.shader, Obj3D.fshader);

	gl.linkProgram(Obj3D.shader);
	if (!gl.getProgramParameter(Obj3D.shader, gl.LINK_STATUS)) {
		console.log("Could not initialise shaders");
	}
    shaderProgram = Obj3D.shader;
	console.log("Compilation performed for ("+Obj3D.fname+") shader");

}


// =====================================================
function setMatrixUniforms(Obj3D) {
    mat4.perspective(60, gl.viewportWidth / gl.viewportHeight, 0.1, 3000.0, pMatrix);
    mat4.identity(translateMatrix);
    mat4.translate(translateMatrix, [0.0, 0.0, -10.0]);
    
    mat4.identity(rotationMatrix);
    mat4.multiply(rotationMatrix, objMatrix);

    //Matrix d'anti rotation pour retourner dans le bon referentiel
    mat4.identity(antiRotationMatrix);
    antiRotationMatrix = mat4.inverse(rotationMatrix, antiRotationMatrix);

    gl.uniformMatrix4fv(Obj3D.shader.pMatrixUniform, false, pMatrix);
    gl.uniformMatrix4fv(Obj3D.shader.tMatrixUniform, false, translateMatrix);
    gl.uniformMatrix4fv(Obj3D.shader.rMatrixUniform, false, rotationMatrix);
    gl.uniformMatrix4fv(Obj3D.shader.arMatrixUniform, false, antiRotationMatrix);
}

// =====================================================


function shadersOk(object)
{
	if(object.loaded == 4) return true;
   	if(object.loaded < 0) {
      object.loaded = 0;
      object.initAll();
    }

	return false;
}

// =====================================================

function drawScene() {
    //Redifini la taille du canvas en fonction de la fenetre
    resize(gl.canvas);
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

    gl.clear(gl.COLOR_BUFFER_BIT);
    if(shadersOk(skybox)) {
      skybox.draw();
    }

    if(shadersOk(middleobject)) {
      middleobject.draw();
    }
}


/**
 * Fonction pour convertir une couleur Hexa en RGB
 * webGL fonctionne avec du RGB mais le selecteur de couleur renvoie de l'hexa
 */
function hexToRgb(hex) {
  var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16)/255,
    g: parseInt(result[2], 16)/255,
    b: parseInt(result[3], 16)/255
  } : null;
}




