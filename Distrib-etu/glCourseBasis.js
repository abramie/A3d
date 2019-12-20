/*
 @authors : Marine Droit & Jérémy Rousseau
*/

// =====================================================
var gl;
// =====================================================
var mvMatrix = mat4.create();
var pMatrix = mat4.create();
var objMatrix = mat4.create();
// =====================================================
var shaderProgram = null;

//La classe skybox est créée dans geometry.js
var skybox;
var middleobject;
var value_ks = 0;
var value_kd = 0;
// =====================================================
// FONCTIONS GENERALES, INITIALISATIONS
// =====================================================


// =====================================================
function webGLStart() {
    var canvas = document.getElementById("WebGL-test");
    var mySelect = document.getElementById('texture-select');
    
    
    //Recuperation des valeurs des ranges pour kd et ks, met � jour la variable
    //global correspondante
    var balise_kd = document.getElementById('kd');
    var balise_value_kd = document.getElementById('value_kd');
    balise_value_kd.textContent = balise_kd.value;
    balise_kd.onchange = function(e){
      console.log(balise_kd.value);
      balise_value_kd.textContent = balise_kd.value;
      value_kd = balise_kd.value;
    };
    
    var balise_ks = document.getElementById('ks');
    var balise_value_ks = document.getElementById('value_ks');
    balise_value_ks.textContent = balise_ks.value;
    balise_ks.onchange = function(e){
      console.log(balise_ks.value);
      balise_value_ks.textContent = balise_ks.value;
      value_ks = balise_ks.value;
    };
    
    //Selecteur de texture
    mySelect.onchange = function (e) {
        var selectedOption = this[this.selectedIndex];
        var selectedText = selectedOption.value;
        if(selectedText != "")
            skybox = new SkyBox(1000,  selectedText);
    }
    mat4.identity(objMatrix);
    canvas.onmousedown = handleMouseDown;
    document.onmouseup = handleMouseUp;
    document.onmousemove = handleMouseMove;
    initGL(canvas);

    skybox = new SkyBox(1000,  "test/test");
    middleobject = new MiddleObject("obj", "sword.obj", null);
    tick();
}

// =====================================================
function initGL(canvas)
{
    try {
        gl = canvas.getContext("experimental-webgl");
        gl.viewportWidth = canvas.width;
        gl.viewportHeight = canvas.height;
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
    mat4.perspective(110, gl.viewportWidth / gl.viewportHeight, 0.1, 2000.0, pMatrix);
    mat4.identity(mvMatrix);
    mat4.translate(mvMatrix, [0.0, 0.0, -5.0]);
    mat4.multiply(mvMatrix, objMatrix);
    gl.uniformMatrix4fv(Obj3D.shader.pMatrixUniform, false, pMatrix);
    gl.uniformMatrix4fv(Obj3D.shader.mvMatrixUniform, false, mvMatrix);
}

// =====================================================


function shadersOk(object)
{
	if(object.loaded == 4) return true;
   
    
   	if(object.loaded < 0) {
		object.loaded = 0;
		object.initAll();
		// if(object.shader)
		// 	object.setShadersParams();
	}

	return false;
}

// =====================================================

function drawScene() {
	gl.clear(gl.COLOR_BUFFER_BIT);
    if(shadersOk(skybox)) {
           skybox.draw();
    }

    if(shadersOk(middleobject)) {
      middleobject.draw();
    }else{
      console.log ("loaded : " + middleobject.loaded);
    }
}







