// HW3 - Lights camera ACtion
// @author : ndehaven
// This File corresponds to sending all the points vertices over to the shader 
// including the light vectors and the normals that link together

// Variables of the program 
var canvas;
var gl;
var program;
var rotatelight = false;
var lightangle = 0;
var zMod = 0;
var shine = null;
var visible = null;



// Object variables to be passed 
var cylinder = null;
var wineglass = null;

// Views, lights and projections
var viewer = {
    eye: vec3(0.0, 0.0, 3.0),
    at: vec3(0.0, 0.0, 0.0),  
    up: vec3(0.0, 1.0, 0.0),

    radius: 3.0,
    theta: 0,
    phi: 0
};
var projection = {
    fov: 150,
    windowRatio: 1,
    near: 0.1,
    far: 10
};
var light = {
    position: vec4(0.0, 0.0, 0.0, 0.0),
    ambient: vec4(0.0, 0.0, 0.0, 1.0),
    diffuse: vec4(1.0, 1.0, 1.0, 1.0),
    specular: vec4(1.0, 1.0, 1.0, 1.0)
};
// Color Initializations 
var silver = {
    ambient: vec4(1.0, 1.0, 1.0, 1.0),
    diffuse: vec4(0.5754, 0.5754, 0.5754, 1.0),
    specular: vec4(1.0, 1.0, 1.0, 1.0),
    shininess: 10.0
};

var gold = {
    ambient: vec4(1.0, 0.0, 0.0, 1.0),
    diffuse: vec4(1, 0.8, 0.0, 1.0),
    specular: vec4(0.8, 0.35, 0.35, 1.0),
    shininess: 10.0
};

var purple = { 
    ambient: vec4(1.0, 0.0, 0.0, 1.0),
    diffuse: vec4(0.7, 0.0, 0.85, 0.0),
    specular: vec4(0.8, 0.0, 0.0, 1.0),
    shininess: 70.0
};

// Buffer, Matrix and light property variables 
var modelViewMatrix, projectionMatrix;
var modelViewMatrixLoc, projectionMatrixLoc;
var vPosBuff, vNormalBuff;
var vPosition, vNormal;
var buffer;
var ambientProductLoc;
var diffuseProductLoc;
var specularProductLoc;
var lightPositionLoc;
var shininessLoc;
var textureLocation; 
var textured; // boolean 
var applyTexture;

texture = new Image(); 
texture.onload = function(){ 
    var textureLoc = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, textureLoc);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, texture);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
};
texture.src = 'pineWood.jpg.js';

 
window.onload = function init() {
    canvas = document.getElementById( "gl-canvas" );
    gl = WebGLUtils.setupWebGL( canvas );
    if (!gl) { 
        alert( "WebGL isn't available" ); 
    }
    gl.viewport( 0, 0, canvas.width, canvas.height );
    gl.clearColor( 0.5, 0.5, 0.5, 1.0 ); 
    gl.enable(gl.DEPTH_TEST);

    program = initShaders( gl, "vertex-shader", "fragment-shader" ); // Shaders 
    projection.windowRatio = (canvas.width / canvas.height); // Setting window of projecton 
    cylinder = create();
    wineglass = create(); 

    // Setting colors to correspond with the light properties 
    // Silver 
    silver.ambientProduct = mult(silver.ambient, light.ambient);
    silver.diffuseProduct = mult(silver.diffuse, light.diffuse);
    silver.specularProduct = mult(silver.specular, light.specular);
    // gold 
    gold.ambientProduct = mult(gold.ambient, light.ambient);
    gold.diffuseProduct = mult(gold.diffuse, light.diffuse);
    gold.specularProduct = mult(gold.specular, light.specular);
    //purple 
    purple.ambientProduct = mult(purple.ambient, light.ambient);
    purple.diffuseProduct = mult(purple.diffuse, light.diffuse);
    purple.specularProduct = mult(purple.specular, light.specular);

    
    // Prepping the GPU on the HTML side + Bindings 
    gl.useProgram(program);
    vPosBuff = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, vPosBuff );
    vPosition = gl.getAttribLocation( program, "vPosition" );
    gl.vertexAttribPointer( vPosition, 4, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vPosition );
    vNormalBuff = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, vNormalBuff );
    vNormal = gl.getAttribLocation( program, "vNormal" );
    gl.vertexAttribPointer( vNormal, 4, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vNormal );
    buffer = gl.createBuffer();
    gl.useProgram(program);
    lightPositionLoc = gl.getUniformLocation( program, "lightPosition");
    ambientProductLoc = gl.getUniformLocation( program, "ambientProduct");
    diffuseProductLoc = gl.getUniformLocation( program, "diffuseProduct");
    specularProductLoc = gl.getUniformLocation( program, "specularProduct");
    shine = document.getElementById("shininess"); // collect shine variables
    shininessLoc = gl.getUniformLocation( program, "shininess");
    textureLocation = gl.getUniformLocation(program, "textured");
    applyTexture = 1.0; // apply texture 
    gl.uniform1f(textureLocation, applyTexture);


    // Object call to create 
    createObject(cylinder);
    sendVertices(purple); // Start the color off with a dark purple 
    // Allow for user interactions by bringing in the mouse controls file 
    mouseControls();
    // Set eyepoints and viewpoints on user interaction
    viewer.eye = vec3(0.0, 0.0, 3 * zMod);
    viewer.radius = 3 * zMod;
    modelViewMatrix = lookAt(vec3(viewer.eye), viewer.at, viewer.up);
    projectionMatrix = perspective(projection.fov, projection.windowRatio, projection.near, projection.far);
    modelViewMatrixLoc = gl.getUniformLocation( program, "modelViewMatrix" );
    projectionMatrixLoc = gl.getUniformLocation( program, "projectionMatrix" );
    document.getElementById('fov').onchange = function(e) {
        projection.fov = e.target.value;
        projectionMatrix = perspective(projection.fov, projection.windowRatio, projection.near, projection.far);
    }
    document.getElementById('cylinder').onclick = function() {
        createObject(cylinder);
    }
    document.getElementById('wineglass').onclick = function() {
        createObject(wineglass);
    }
    document.getElementById('silver').onclick = function() {
        sendVertices(silver);
    }
    document.getElementById('gold').onclick = function() {
        sendVertices(gold);
    }
    document.getElementById('rotatelight').onclick = function() {
        if (rotatelight) {
            rotatelight = false;
            light.position = vec4(0.0, 0.0, 0.0, 0.0);
            lightangle = 0;
        } else {
            rotatelight = true;
            lightangle = 0;
        }
    }  
    render();
}

var render = function() {

    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    gl.useProgram(program);
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
    gl.uniformMatrix4fv(projectionMatrixLoc, false, flatten(projectionMatrix));
    gl.uniform4fv(lightPositionLoc, flatten(light.position));
    gl.uniform1f(shininessLoc, shine.value);
    gl.uniform1f(textureLocation, texture);
    gl.bindBuffer(gl.ARRAY_BUFFER, vPosBuff);
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, buffer);
    gl.vertexAttribPointer(vPosition, 4, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vPosition);
    giveLight();
    
    gl.drawElements(gl.TRIANGLES, visible.numTris * 3, gl.UNSIGNED_SHORT, 0 );
    requestAnimFrame(render); 
}

// enables the light, called in render after vertices are amde on the object .
function giveLight() { 
    var u = rotateY(lightangle);
    var v = vec4(0, 0, 3, 1);

    if (rotatelight) {
        var result = [];
        for (var i = 0; i < u.length; i++) {
            var sum = 0;
            for (var j = 0; j < u[i].length; j++) {
                sum += u[i][j] * v[j];
            }
            result.push(sum);
        }
        light.position = result;
        lightangle += 0.5;
    }
}

function getTexture(){
    
}

function setTexture(texture) { 

}

// Object creating fucntion that 
// locks the vertices and values to the shaders on the html file 
function createObject(object) {
    // Setting objects of the surface object 
    gl.useProgram(program);
    gl.bindBuffer( gl.ARRAY_BUFFER, vPosBuff );
    gl.vertexAttribPointer( vPosition, 4, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vPosition );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(object.vertices), gl.STATIC_DRAW );
    gl.bindBuffer( gl.ARRAY_BUFFER, vNormalBuff );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(object.normals), gl.STATIC_DRAW );
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(flatten(object.indices)), gl.STATIC_DRAW);
    zMod = object.zmod;
    visible = object;
}
// Depending on the build of the shininess properties they will be sent over 
// To the html file as well on each render for correct shininess 
function sendVertices(build) {
    // Setting values of the shininess for each render 
    shine.value = build.shininess;
    gl.useProgram(program);
    gl.uniform4fv(ambientProductLoc, flatten(build.ambientProduct));
    gl.uniform4fv(diffuseProductLoc, flatten(build.diffuseProduct));
    gl.uniform4fv(specularProductLoc, flatten(build.specularProduct));
}

// Mouse variables 
var mouse =
{
    prevX: 0,
    prevY: 0,
    leftDown: false,
    rightDown: false,
	scale: 0.01,
};

// Copied functions from mouseControl.js file for better interaction 
function mouseControls() {

    canvas.onmouseup = function(event)
    {
        
        if (event.button == 0){mouse.leftDown = false;}
        else if(event.button == 2){mouse.rightDown = false;}
    };
    canvas.onmousedown = function(event)
    {
        if(event.button == 0 && !mouse.leftDown){
            mouse.leftDown = true;
            mouse.prevX = event.clientX;
            mouse.prevY = event.clientY;
        }
        else if (event.button == 2 && !mouse.rightDown){
            mouse.rightDown = true;
            mouse.prevX = event.clientX;
            mouse.prevY = event.clientY;
        }
    };
	 canvas.onmouseleave = function ()
    {
        mouse.leftDown = false;
        mouse.rightDown = false;
    };

	canvas.onmousemove = function (event)
    {
		if (mouse.leftDown || mouse.rightDown) {
			var currentX = event.clientX;
			var currentY = event.clientY;
			var deltaX = event.clientX - mouse.prevX;
			var deltaY = event.clientY - mouse.prevY;
			if (mouse.leftDown)
			{
				if (viewer.up[1] > 0)
				{
					viewer.theta -= mouse.scale * deltaX;
					viewer.phi -= mouse.scale * deltaY;
				}
				else
				{
					viewer.theta += mouse.scale * deltaX;
					viewer.phi -= mouse.scale * deltaY;
				}
				
				// Wrap the angles
				var twoPi = 6.28318530718;
				if (viewer.theta > twoPi)
				{
					viewer.theta -= twoPi;
				}
				else if (viewer.theta < 0)
				{
					viewer.theta += twoPi;
				}
				if (viewer.phi > twoPi)
				{
					viewer.phi -= twoPi;
				}
				else if (viewer.phi < 0)
				{
					viewer.phi += twoPi;
				}
			} 
			else if(mouse.rightDown)
			{         
				viewer.radius -= mouse.scale * deltaX;
				viewer.radius = Math.max(0.1, viewer.radius);
			}
			var threePiOver2 = 4.71238898;
			var piOver2 = 1.57079632679;		
			var pi = 3.14159265359;
			var r = viewer.radius * Math.sin(viewer.phi + piOver2);
			viewer.eye = vec3(r * Math.cos(viewer.theta + piOver2), viewer.radius * Math.cos(viewer.phi + piOver2), r * Math.sin(viewer.theta + piOver2));
			
			for(k=0; k<3; k++)
				viewer.eye[k] = viewer.eye[k] + viewer.at[k];
			if (viewer.phi < piOver2 || viewer.phi > threePiOver2) {
				viewer.up = vec3(0.0, 1.0, 0.0);
			}
			else {
				viewer.up = vec3(0.0, -1.0, 0.0);
			}
			
            modelViewMatrix = lookAt(vec3(viewer.eye), viewer.at, viewer.up);
			mouse.prevX = currentX;
			mouse.prevY = currentY;
        }

    };
}
