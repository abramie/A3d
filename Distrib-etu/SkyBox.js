// =====================================================
// Une boite 3D, Support geometrique
// =====================================================
class SkyBox{

    /*
        Initialise la boite
        @param size : la taille du cube (de -size à +size )
        @param filename_texture : Le nom de l'image de texture (inclure le chemin, mais sans l'extension )
     */
    constructor(size,filename_texture){
        //Defini les 8 sommets de la boite.
        this.A = new Point(-0.5*size,0.5*size,0.5*size);
        this.B = new Point(0.5*size, 0.5*size, 0.5*size);
        this.C = new Point(0.5*size,  0.5*size, -0.5*size);
        this.D = new Point(-0.5*size,  0.5*size, -0.5*size);

        this.E = new Point(-0.5*size,-0.5*size,0.5*size);
        this.F = new Point(0.5*size, -0.5*size, 0.5*size);
        this.G = new Point(0.5*size,  -0.5*size, -0.5*size);
        this.H = new Point(-0.5*size,  -0.5*size,-0.5*size);

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
    /*
        Initialise les faces du cube
    */
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


        loadShaders(this);

    }

    /*
        Initialisation des textures (Chargement d'une image)
     */
    initTexture(Obj3D, filename)
    {
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

    /*
        Initialisation des shader box pour pourvoir dessiner la skybox
    */
    setShadersParams()
    {
        gl.useProgram(this.shader);

        //on defini les matrices.
        this.shader.pMatrixUniform = gl.getUniformLocation(this.shader, "uPMatrix");
        this.shader.tMatrixUniform = gl.getUniformLocation(this.shader, "transMatrix");
        this.shader.rMatrixUniform = gl.getUniformLocation(this.shader, "rotatMatrix");

        this.shader.vAttrib = gl.getAttribLocation(this.shader, "aVertexPosition");
        gl.enableVertexAttribArray(this.shader.vAttrib);

        this.shader.tAttrib = gl.getAttribLocation(this.shader, "aTexCoords");
        gl.enableVertexAttribArray(this.shader.tAttrib);

        this.shader.texIndexAttrib = gl.getAttribLocation(this.shader, "aTexIndex");
        gl.enableVertexAttribArray(this.shader.texIndexAttrib);


        //Si on change l'ordre de ces bouts de code, les faces qui se deplacent.
        this.shader.frontTexture = gl.getUniformLocation(this.shader, "uFront");


        this.shader.backTexture = gl.getUniformLocation(this.shader, "uBack");


        this.shader.leftTexture = gl.getUniformLocation(this.shader, "uLeft");


        this.shader.rightTexture = gl.getUniformLocation(this.shader, "uRight");


        this.shader.bottomTexture = gl.getUniformLocation(this.shader, "uBottom");


        this.shader.topTexture = gl.getUniformLocation(this.shader, "uTop");


    }

    /*
        Dessine les faces
    */
    draw(){

        if(this.shader) {

            gl.useProgram(this.shader);
            setMatrixUniforms(this);

            gl.bindBuffer(gl.ARRAY_BUFFER, this.vBuffer);
            gl.vertexAttribPointer(this.shader.vAttrib, this.vBuffer.itemSize, gl.FLOAT, false, 0, 0);
            gl.bindBuffer(gl.ARRAY_BUFFER, this.tBuffer);
            gl.vertexAttribPointer(this.shader.tAttrib,this.tBuffer.itemSize, gl.FLOAT, false, 0, 0);

            gl.bindBuffer(gl.ARRAY_BUFFER, this.texindexBuffer);
            gl.vertexAttribPointer(this.shader.texIndexAttrib, this.texindexBuffer.itemSize, gl.SHORT, false, 0, 0);

            gl.bindTexture(gl.TEXTURE_2D, this.textures.top);
            gl.uniform1i(this.shader.frontTexture, 0);
            gl.activeTexture(gl.TEXTURE0);

            gl.bindTexture(gl.TEXTURE_2D, this.textures.right);
            gl.uniform1i(this.shader.backTexture, 1);
            gl.activeTexture(gl.TEXTURE1);

            gl.bindTexture(gl.TEXTURE_2D, this.textures.left);
            gl.uniform1i(this.shader.leftTexture, 2);
            gl.activeTexture(gl.TEXTURE2);

            gl.bindTexture(gl.TEXTURE_2D, this.textures.back);
            gl.uniform1i(this.shader.rightTexture, 3);
            gl.activeTexture(gl.TEXTURE3);

            gl.bindTexture(gl.TEXTURE_2D, this.textures.front);
            gl.uniform1i(this.shader.bottomTexture, 4);
            gl.activeTexture(gl.TEXTURE4);

            gl.bindTexture(gl.TEXTURE_2D, this.textures.bottom);
            gl.uniform1i(this.shader.topTexture, 5);
            gl.activeTexture(gl.TEXTURE5);


            gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER,this.iBuffer);
            gl.drawElements(gl.TRIANGLES, this.iBuffer.numItems,gl.UNSIGNED_SHORT,0 );
        }
    }

}
