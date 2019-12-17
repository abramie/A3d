/*
 @authors : Marine Droit & Jérémy Rousseau
*/

/*
    Sert uniquement à garder trois coordonnées pour definir des points
 */
class Point {
	constructor(x,y,z){
		this.x = x;
		this.y = y;
		this.z = z;
	}
}

// =====================================================
// PLAN 3D, Support géométrique
// =====================================================
class Plane3D {

    constructor(p1,p2,p3,p4,filename_texture, pos="down"){

        //Deux triangles pour former une face (avec 4 points)
        this.vertices = [
            p1.x, p1.y, p1.z,
            p2.x, p2.y, p2.z,
            p3.x, p3.y, p3.z,
            p4.x, p4.y, p4.z
        ];
        
        //Nom du shader
        this.fname='plane';
        this.loaded=-1;
        this.shader=null;
        this.filename_texture = filename_texture;

        //Ici remplacer les coord de texture par le morceau de la texture
        this.texcoords = [];

        //Pour le top il faut retourner la texture pour qu'elle soit bien allignée.
        if(pos == "top"){
            this.texcoords = [
                0.0, 1.0,
                0.0, 0.0,
                1.0, 0.0,
                1.0, 1.0
            ];
        } else if (pos == "front"){
            this.texcoords = [
                1.0, 0.0,
                1.0, 1.0,
                0.0, 1.0,
                0.0, 0.0
            ];
        } else if (pos == "back"){
            this.texcoords = [
                0.0, 0.0,
                1.0, 0.0,
                1.0, 1.0,
                0.0, 1.0
            ];
        } else if (pos == "bottom"){
            this.texcoords = [
                0.0, 0.0,
                1.0, 0.0,
                1.0, 1.0,
                0.0, 1.0
            ];
        } else if (pos == "left"){
            this.texcoords = [
                0.0, 1.0,
                0.0, 0.0,
                1.0, 0.0,
                1.0, 1.0
            ];
        } else if (pos == "right"){
            this.texcoords = [
                1.0, 1.0,
                0.0, 1.0,
                0.0, 0.0,
                1.0, 0.0
            ];
        }

    }

}

// =====================================================
// Une boite 3D, Support géométrique
// =====================================================
class SkyBox{

    /*
        Initialise la boite
        @param size : la taille du cube (de -size à +size )
        @param filename_texture : Le nom de l'image de texture (inclure le chemin, mais sans l'extension )
     */
    constructor(size,filename_texture){
        //Defini les 8 sommets de la boite.
        this.A = new Point(-1*size,1*size,1*size);
        this.B = new Point(1*size, 1*size, 1*size);
        this.C = new Point(1*size,  1*size, -1*size);
        this.D = new Point(-1*size,  1*size, -1*size);

        this.E = new Point(-1*size,-1*size,1*size);
        this.F = new Point(1*size, -1*size, 1*size);
        this.G = new Point(1*size,  -1*size, -1*size);
        this.H = new Point(-1*size,  -1*size,-1*size);

        //Créée les 6 faces
        this.Front = new Plane3D(this.G,this.C,this.D,this.H,filename_texture,"front");
        this.Back = new Plane3D(this.F,this.E,this.A,this.B,filename_texture,"back");
        this.Left = new Plane3D(this.A,this.E,this.H,this.D,filename_texture,"left");
        this.Right = new Plane3D(this.B,this.C,this.G,this.F,filename_texture,"right");
        this.Bottom = new Plane3D(this.E,this.F,this.G,this.H,filename_texture,"bottom");
        this.Top = new Plane3D(this.A,this.D,this.C,this.B,filename_texture,"top");

        this.fname='box';
        this.loaded=-1;
        this.shader=null;


        //Charge l'image pour chaque texture
        this.textures = [];
        
        this.textures.front = this.initTexture(this,filename_texture + "_ft.png" );
        this.textures.back = this.initTexture(this,filename_texture + "_bk.png");

        this.textures.left = this.initTexture(this,filename_texture + "_lf.png");
        this.textures.right = this.initTexture(this,filename_texture + "_rt.png");

        this.textures.bottom = this.initTexture(this,filename_texture + "_dn.png");
        this.textures.top = this.initTexture(this,filename_texture + "_up.png");
    }
    
    initTexture(Obj3D, filename)
    {
        let ind = 0;
        var texture = gl.createTexture();
        texture.image = new Image();
        texture.image.src = filename;

        texture.image.onload = function () {

            gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
            gl.bindTexture(gl.TEXTURE_2D, texture);
            gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, texture.image);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);

        }
        return texture;
        
    }

    /**Dessine les faces **/
    draw(){
        gl.clear(gl.COLOR_BUFFER_BIT);
        if(this.shader) {

                this.setShadersParams();

                setMatrixUniforms(this);

                gl.bindBuffer(gl.ARRAY_BUFFER, this.vBuffer);
                gl.vertexAttribPointer(this.shader.vAttrib, this.vBuffer.itemSize, gl.FLOAT, false, 0, 0);
                gl.bindBuffer(gl.ARRAY_BUFFER, this.tBuffer);
                gl.vertexAttribPointer(this.shader.tAttrib,this.tBuffer.itemSize, gl.FLOAT, false, 0, 0);

                gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER,this.iBuffer);
                gl.drawElements(gl.TRIANGLES, this.iBuffer.numItems,gl.UNSIGNED_SHORT,0 );
        }
    }

    /**Initialise les faces du cube**/
    initAll(){

        this.vertices = this.Front.vertices;
        this.vertices = this.vertices.concat(this.Back.vertices);
        this.vertices = this.vertices.concat(this.Left.vertices);
        this.vertices = this.vertices.concat(this.Right.vertices);
        this.vertices = this.vertices.concat(this.Bottom.vertices);
        this.vertices = this.vertices.concat(this.Top.vertices);

        this.texcoords = this.Front.texcoords;
        this.texcoords = this.texcoords.concat(this.Back.texcoords);
        this.texcoords = this.texcoords.concat(this.Left.texcoords);
        this.texcoords = this.texcoords.concat(this.Right.texcoords);
        this.texcoords = this.texcoords.concat(this.Bottom.texcoords);
        this.texcoords = this.texcoords.concat(this.Top.texcoords);
        
        console.log("loaded" + this.loaded);

        //Indices des sommets
        this.indices = [];
        for(var i = 0; i< 6; i++){
            this.indices = this.indices.concat([i*4,1+i*4,2+i*4,2+i*4,3+i*4,i*4]);
        }

        //On créée les buffers pour les shaders avec les valeurs de vertices et texture
        this.vBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.vBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.vertices), gl.STATIC_DRAW);
        this.vBuffer.itemSize = 3;
        this.vBuffer.numItems = this.vertices.length/3;

        this.tBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.tBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.texcoords), gl.STATIC_DRAW);
        this.tBuffer.itemSize = 2;
        this.tBuffer.numItems = this.texcoords.length/2;

        //On Bind les indices dans le tableau d'element (il est pas necessaire d'avoir une variable correspondante dans le shader )
        this.iBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.iBuffer);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(this.indices), gl.STATIC_DRAW);
        this.iBuffer.itemSize = 1;
        this.iBuffer.numItems = this.indices.length/1;
        
        
        //On lie un sommet à une texture
        var texindex = [
            1, 1, 1, 1,
            2, 2, 2, 2,
            3, 3, 3, 3,
            4, 4, 4, 4,
            5, 5, 5, 5,
            6, 6, 6, 6
        ];
        
        this.texindexBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.texindexBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Uint16Array(texindex), gl.STATIC_DRAW);
        this.texindexBuffer.itemSize = 1;
        this.texindexBuffer.numItems = texindex.length;

        console.log("Plane : init buffers ok.");
        
        loadShaders(this);

        console.log("Plane : shaders loading...");

    }

    setShadersParams()
    {
        //console.log("Plane : setting shader parameters...")

        gl.useProgram(this.shader);

        this.shader.pMatrixUniform = gl.getUniformLocation(this.shader, "uPMatrix");
        this.shader.mvMatrixUniform = gl.getUniformLocation(this.shader, "uMVMatrix");

        this.shader.vAttrib = gl.getAttribLocation(this.shader, "aVertexPosition");
        gl.enableVertexAttribArray(this.shader.vAttrib);
        gl.bindBuffer(gl.ARRAY_BUFFER, this.vBuffer);
        gl.vertexAttribPointer(this.shader.vAttrib, this.vBuffer.itemSize, gl.FLOAT, false, 0, 0);

        this.shader.tAttrib = gl.getAttribLocation(this.shader, "aTexCoords");
        gl.enableVertexAttribArray(this.shader.tAttrib);
        gl.bindBuffer(gl.ARRAY_BUFFER, this.tBuffer);
        gl.vertexAttribPointer(this.shader.tAttrib,this.tBuffer.itemSize, gl.FLOAT, false, 0, 0);

        this.shader.texIndexAttrib = gl.getAttribLocation(this.shader, "aTexIndex");
        gl.enableVertexAttribArray(this.shader.texIndexAttrib);
        gl.bindBuffer(gl.ARRAY_BUFFER, this.texindexBuffer);
        gl.vertexAttribPointer(this.shader.texIndexAttrib, this.texindexBuffer.itemSize, gl.SHORT, false, 0, 0);


        //Si on change l'ordre de ces bouts de code, y a les faces qui se deplacent.
        let frontTexture = gl.getUniformLocation(this.shader, "uFront");
        gl.bindTexture(gl.TEXTURE_2D, this.textures.top);
        gl.uniform1i(frontTexture, 0);
        gl.activeTexture(gl.TEXTURE0);

        let backTexture = gl.getUniformLocation(this.shader, "uBack");
        gl.bindTexture(gl.TEXTURE_2D, this.textures.right);
        gl.uniform1i(backTexture, 1);
        gl.activeTexture(gl.TEXTURE1);

        let leftTexture = gl.getUniformLocation(this.shader, "uLeft");
        gl.bindTexture(gl.TEXTURE_2D, this.textures.left);
        gl.uniform1i(leftTexture, 2);
        gl.activeTexture(gl.TEXTURE2);

        let rightTexture = gl.getUniformLocation(this.shader, "uRight");
        gl.bindTexture(gl.TEXTURE_2D, this.textures.back);
        gl.uniform1i(rightTexture, 3);
        gl.activeTexture(gl.TEXTURE3);

        let bottomTexture = gl.getUniformLocation(this.shader, "uBottom");
        gl.bindTexture(gl.TEXTURE_2D, this.textures.front);
        gl.uniform1i(bottomTexture, 4);
        gl.activeTexture(gl.TEXTURE4);

        let topTexture = gl.getUniformLocation(this.shader, "uTop");
        gl.bindTexture(gl.TEXTURE_2D, this.textures.bottom);
        gl.uniform1i(topTexture, 5);
        gl.activeTexture(gl.TEXTURE5);

    }
}

class MiddleObject {

    constructor(fname, name, filename_texture) {
        this.fname = fname;
        this.name = name;
        this.filename_texture = filename_texture;
        this.loaded=-1;
        this.shader=null;
    }

    initAll(){

        OBJ.Mesh(this.name);
        //Verifier s'il faut mettre le .obj derrière le nom de l'obj

        // console.log("loaded" + this.loaded);
        //
        // //Indices des sommets
        // this.indices = [];
        // for(var i = 0; i< 6; i++){
        //     this.indices = this.indices.concat([i*4,1+i*4,2+i*4,2+i*4,3+i*4,i*4]);
        // }
        //
        // //On créée les buffers pour les shaders avec les valeurs de vertices et texture
        this.vBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.vBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(OBJ.vertices), gl.STATIC_DRAW);
        this.vBuffer.itemSize = 3;
        this.vBuffer.numItems = OBJ.vertices.length/3;
        //
        this.tBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.tBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(OBJ.textures), gl.STATIC_DRAW);
        this.tBuffer.itemSize = 2;
        this.tBuffer.numItems = OBJ.textures.length/2;
        //
        // //On Bind les indices dans le tableau d'element (il est pas necessaire d'avoir une variable correspondante dans le shader )
        this.iBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.iBuffer);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(OBJ.indices), gl.STATIC_DRAW);
        this.iBuffer.itemSize = 1;
        this.iBuffer.numItems = OBJ.indices.length/1;
        //
        //
        // //On lie un sommet à une texture
        // var texindex = [
        //     1, 1, 1, 1,
        //     2, 2, 2, 2,
        //     3, 3, 3, 3,
        //     4, 4, 4, 4,
        //     5, 5, 5, 5,
        //     6, 6, 6, 6
        // ];
        //
        // this.texindexBuffer = gl.createBuffer();
        //gl.bindBuffer(gl.ARRAY_BUFFER, this.texindexBuffer);
        //gl.bufferData(gl.ARRAY_BUFFER, new Uint16Array(texindex), gl.STATIC_DRAW);
        //this.texindexBuffer.itemSize = 1;
        // this.texindexBuffer.numItems = texindex.length;
        //
        // console.log("Plane : init buffers ok.");
        //
        
        this.textures = this.initTexture(this,this.filename_texture );
        loadShaders(this);
        //
        // console.log("Plane : shaders loading...");

    }
    
    
       setShadersParams()
    {
        //console.log("Plane : setting shader parameters...")

        gl.useProgram(this.shader);

        this.shader.pMatrixUniform = gl.getUniformLocation(this.shader, "uPMatrix");
        this.shader.mvMatrixUniform = gl.getUniformLocation(this.shader, "uMVMatrix");

        this.shader.vAttrib = gl.getAttribLocation(this.shader, "aVertexPosition");
        gl.enableVertexAttribArray(this.shader.vAttrib);
        gl.bindBuffer(gl.ARRAY_BUFFER, this.vBuffer);
        gl.vertexAttribPointer(this.shader.vAttrib, this.vBuffer.itemSize, gl.FLOAT, false, 0, 0);

        this.shader.tAttrib = gl.getAttribLocation(this.shader, "aTexCoords");
        gl.enableVertexAttribArray(this.shader.tAttrib);
        gl.bindBuffer(gl.ARRAY_BUFFER, this.tBuffer);
        gl.vertexAttribPointer(this.shader.tAttrib,this.tBuffer.itemSize, gl.FLOAT, false, 0, 0);

       /* this.shader.texIndexAttrib = gl.getAttribLocation(this.shader, "aTexIndex");
        gl.enableVertexAttribArray(this.shader.texIndexAttrib);
        gl.bindBuffer(gl.ARRAY_BUFFER, this.texindexBuffer);
        gl.vertexAttribPointer(this.shader.texIndexAttrib, this.texindexBuffer.itemSize, gl.SHORT, false, 0, 0);
*/

        //Si on change l'ordre de ces bouts de code, y a les faces qui se deplacent.
        let texture = gl.getUniformLocation(this.shader, "uTex");
        gl.bindTexture(gl.TEXTURE_2D, this.textures.top);
        gl.uniform1i(texture, 0);
        gl.activeTexture(gl.TEXTURE0);


    }
    
    draw(){
        gl.clear(gl.COLOR_BUFFER_BIT);
        if(this.shader) {

                this.setShadersParams();

                setMatrixUniforms(this);

                gl.bindBuffer(gl.ARRAY_BUFFER, this.vBuffer);
                gl.vertexAttribPointer(this.shader.vAttrib, this.vBuffer.itemSize, gl.FLOAT, false, 0, 0);
                gl.bindBuffer(gl.ARRAY_BUFFER, this.tBuffer);
                gl.vertexAttribPointer(this.shader.tAttrib,this.tBuffer.itemSize, gl.FLOAT, false, 0, 0);

                gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER,this.iBuffer);
                gl.drawElements(gl.TRIANGLES, this.iBuffer.numItems,gl.UNSIGNED_SHORT,0 );
        }
    }
    
    initTexture(Obj3D, filename)
    {
        let ind = 0;
        var texture = gl.createTexture();
        texture.image = new Image();
        texture.image.src = filename;

        texture.image.onload = function () {

            gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
            gl.bindTexture(gl.TEXTURE_2D, texture);
            gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, texture.image);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);

        }
        return texture;
        
    }
}


