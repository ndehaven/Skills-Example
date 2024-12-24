// @author : ndehaven 
// Geometry File that corresponds normals, vertices 
// and indices of the objects 



function create() {
    var indices = [];
    var vertices = [];
    var normals = [];
    var texCoords = [];
    var triSegments = 0;
    var curve;

    for (var t = 1; t >= -1.01; t -= 0.02) {
        var zmod = 0;
        
        var curve = 0.005 * Math.pow(-t*Math.PI, 2) + Math.sin(1*Math.PI*t) / 2.5 + 0.45;
        

        zmod = Math.max(zmod, curve);
        const objBase = vec4(curve, t, 0, 1);
        for (var theta = 0; theta < 360; theta += 3.6) {
            const rotationS = rotateY(theta)
            var result = [];
            for ( var i = 0; i < rotationS.length; i++ ) {
                var sum = 0;
                for ( var j = 0; j < rotationS[i].length; j++ ) {
                    sum += rotationS[i][j] * objBase[j];
                }
                result.push(sum);
            }
            
            var slope = -Math.PI / 16 * (Math.cos(Math.PI * t) + 1 * Math.cos(2*Math.PI*t)) ;
            
            const norm = normalize(vec4(Math.cos(radians(theta)), -slope, Math.sin(radians(theta)), 0), true);
            vertices.push(result);
            normals.push(norm);
            const s = theta / 360; // Assuming texture repeats every full rotation
            const tCoord = vec2(s, t * 0.5 + 0.5); // Normalize t to range [0, 1] and adjust to center
            texCoords.push(tCoord);
        }
    }

    //Top Surface 
    for (var theta = 0; theta < 360; theta += 3.6) {
        const x = Math.cos(radians(theta)) / 2;
        const y = 1.01; // Top surface height
        const z = Math.sin(radians(theta));
        vertices.push([x, y, z, 1]); // Vertex position
        normals.push(vec4(0, 1, 0, 0)); // Normal pointing upwards
        const s = theta / 360;
        const tCoord = vec2(s, 1); // Texture coordinates for top surface
        texCoords.push(tCoord);
    }
    for (var i = 0; i < 100; i++) {
        indices.push(vertices.length - 1); // Center point index
        indices.push((i + 1) % 100 + 200); // Next point index
        indices.push(i + 200); // Current point index
        triSegments++;
    }
    
    // Bottom Surface 
    for (var theta = 0; theta < 360; theta += 3.6) {
        const x = Math.cos(radians(theta)) ; // Set each point as we go around 
        const y = -1.01; // Bottom surface height
        const z = Math.sin(radians(theta)) ;
        vertices.push([x, y, z, 1]); // Push to vertices 
        normals.push(vec4(0, -1, 0, 0)); // Push to normal
        const s = theta / 360;
        const tCoord = vec2(s, 0); // Texture coordinates for bottom surface
        texCoords.push(tCoord);
    }
    

    // Generate indices for the bottom circular surface
    for (var i = 0; i < 100; i++) {
        indices.push(i); // Current point index
        indices.push((i + 1) % 100); // Next point index
        indices.push((i % 100) + 100); // Corresponding point on the top circular surface
        triSegments++;
        indices.push((i + 1) % 100); // Next point index
        indices.push(((i + 1) % 100) + 100); // Corresponding point on the top circular surface
        indices.push((i % 100) + 100); // Corresponding point on the top circular surface
        triSegments++;
    }

    const subDexes = [0,1,2,1,2,3];
    for (var i = 0; i < 100; i++) {
        for (var j = 0; j < 100; j++) {
            // Create indices for the middle surface
            var objRectangles = [
                (100 * i) + j, (100 * i) + (j + 1) % 100,
                (100 * (i + 1)) + j, (100 * (i + 1)) + (j + 1) % 100
            ];
            for (var k = 0; k < subDexes.length; k++) {
                indices.push(objRectangles[subDexes[k]])
            }
            const s = j / 99; // Map j to range [0, 1] along the horizontal direction
            const t = i / 99; // Map i to range [0, 1] along the vertical direction

            const tCoord = vec2(s, t); // Texture coordinates
            texCoords.push(tCoord);
            triSegments += 2;
        }
    }

    //  Return values 
    return {
        zmod, 
        vertices,
        indices,
        normals,
        texCoords,
        numTris: triSegments
    }
}

