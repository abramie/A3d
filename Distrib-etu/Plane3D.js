// =====================================================
// PLAN 3D, Support geometrique
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

        //Pour le top il faut retourner la texture pour qu'elle soit bien alignée.
        if(pos == "top"){
            this.texcoords = [
                0.001, 0.001,
                0.999, 0.001,
                0.999, 0.999,
                0.001, 0.999
            ];
        } else if (pos == "front"){
            this.texcoords = [
                0.999, 0.001,
                0.999, 0.999,
                0.001, 0.999,
                0.001, 0.001
            ];
        } else if (pos == "back"){
            this.texcoords = [
                0.001, 0.001,
                0.999, 0.001,
                0.999, 0.999,
                0.001, 0.999
            ];
        } else if (pos == "bottom"){
            this.texcoords = [
                0.001, 0.999,
                0.001, 0.001,
                0.999, 0.001,
                0.999, 0.999

            ];
        } else if (pos == "left"){
            this.texcoords = [
                0.001, 0.999,
                0.001, 0.001,
                0.999, 0.001,
                0.999, 0.999
            ];
        } else if (pos == "right"){
            this.texcoords = [
                0.999, 0.999,
                0.001, 0.999,
                0.001, 0.001,
                0.999, 0.001
            ];
        }

    }

}