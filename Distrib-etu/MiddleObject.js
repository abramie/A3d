/*
 * Objet charge depuis un OBJ
 */
class MiddleObject {

    constructor(fname, name_object) {
        this.fname = fname;
        this.name = name_object;
        this.loaded = -1;
        this.shader = null;
    }

    /*
        Initialisation de l'obj : de ses coordonnees, indices normales et coordonnees de texture.
     */
    initAll(){
        var xhttp = new XMLHttpRequest();
        var that = this;
        xhttp.onreadystatechange = function() {
            if (xhttp.readyState == 4 && xhttp.status == 200) {
                var objStr = xhttp.responseText;
                let tmpMesh = new OBJ.Mesh(objStr);
                OBJ.initMeshBuffers(gl,tmpMesh);
                let txt=""+tmpMesh.vertices.length/3+" vertices ; "+
                    tmpMesh.indices.length+" indices ; "+
                    tmpMesh.vertexNormals.length/3+" normals ; "+
                    tmpMesh.textures.length/2+" texCoords";
                console.log("Stats : "+txt);
                that.mesh=tmpMesh;
                loadShaders(that);
            }
        }
        xhttp.open("GET", this.name, true);
        xhttp.send();

    }

    /*
        Initialisation des shader obj pour pouvoir dessiner l'obj.
     */
    setShadersParams()
    {
        gl.useProgram(this.shader);

        this.shader.vAttrib = gl.getAttribLocation(this.shader, "aVertexPosition");
        gl.enableVertexAttribArray(this.shader.vAttrib);


        this.shader.nAttrib = gl.getAttribLocation(this.shader, "aVertexNormal");
        gl.enableVertexAttribArray(this.shader.nAttrib);

        //OBJ.initMeshBuffers(gl,this.mesh);
        this.shader.pMatrixUniform = gl.getUniformLocation(this.shader, "uPMatrix");
        this.shader.tMatrixUniform = gl.getUniformLocation(this.shader, "transMatrix");
        this.shader.rMatrixUniform = gl.getUniformLocation(this.shader, "rotatMatrix");


        //Transfert des ks et kd
        this.shader.gl_ks = gl.getUniformLocation(this.shader, "uKS");


        this.shader.gl_kd = gl.getUniformLocation(this.shader, "uKD");

        this.shader.gl_n = gl.getUniformLocation(this.shader, "uN");
        gl.uniform1f(this.shader.gl_n, value_n);



    }

    /*
        Dessine l'obj
     */
    draw(){
        if(this.shader) {
            gl.useProgram(this.shader);

            setMatrixUniforms(this);


            gl.bindBuffer(gl.ARRAY_BUFFER, this.mesh.vertexBuffer);
            gl.vertexAttribPointer(this.shader.vAttrib, this.mesh.vertexBuffer.itemSize, gl.FLOAT, false, 0, 0);

            gl.bindBuffer(gl.ARRAY_BUFFER, this.mesh.normalBuffer);
            gl.vertexAttribPointer(this.shader.nAttrib, this.mesh.normalBuffer.itemSize, gl.FLOAT, false, 0, 0);

            //Envoie la couleur de la tache de speculaire (base sur la couleur de la lumiere et sur KS )
            gl.uniform3fv(this.shader.gl_ks, [value_couleur_lumiere['r']*value_ks,value_couleur_lumiere['g']*value_ks,value_couleur_lumiere['b']*value_ks]);

            //Envoie la couleur de l'objet (base sur la couleur du materiau, de la lumiere et KD)
            gl.uniform3fv(this.shader.gl_kd, [value_couleur_lumiere['r']*value_couleur_materiau['r']*value_kd,
                value_couleur_lumiere['g']*value_couleur_materiau['g']*value_kd,value_couleur_lumiere['b']*value_couleur_materiau['b']*value_kd]);
            gl.uniform1f(this.shader.gl_n, value_n);

            gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER,this.mesh.indexBuffer);
            gl.drawElements(gl.TRIANGLES, this.mesh.indexBuffer.numItems,gl.UNSIGNED_SHORT,0);


        }
    }
}