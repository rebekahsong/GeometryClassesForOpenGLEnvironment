"use strict";
/* exported HeartGeometry */
class HeartGeometry {
  constructor(gl) {
    this.gl = gl;

    this.newVertices = [0.0,0.0,0.0];
    this.newColors = [1.0,1.0,1.0];
    this.newIndices = [];

    this.numVertices = 100;

    for (let i = 0; i <= this.numVertices; i++ ){
      const theta = i / this.numVertices * 2 * Math.PI;
      const x = (16 * Math.pow(Math.sin(theta),3)) *0.01;
      const y = (13 * Math.cos(theta) - 5 * Math.cos(theta * 2) - 2 *
                Math.cos(3 * theta) - Math.cos(4*theta))*0.01;
      this.newVertices.push(x,y,0.5);
      this.newColors.push(0.8,0.3,0.6);
      this.newIndices.push(0,i,i+1);
      if (this.numVertices === i){
        this.newIndices.push(0,i,1);
      }
    }

    // allocate and fill vertex buffer in device memory (OpenGL name: array buffer)
    this.vertexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER,
      new Float32Array(this.newVertices),
      gl.STATIC_DRAW);

    // adding a color vertex buffer
    this.colorBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, this.colorBuffer);
    gl.bufferData(gl.ARRAY_BUFFER,
      new Float32Array(this.newColors),
      gl.STATIC_DRAW);

    // allocate and fill index buffer in device memory (OpenGL name: element array buffer)
    //2 triangles
    this.indexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER,
      new Uint16Array(this.newIndices),
      gl.STATIC_DRAW);

    // create and bind input layout with input buffer bindings (OpenGL name: vertex array)
    this.inputLayout = gl.createVertexArray();
    gl.bindVertexArray(this.inputLayout);

    gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
    gl.enableVertexAttribArray(0);
    gl.vertexAttribPointer(0,
      3, gl.FLOAT, //< three pieces of float
      false, //< do not normalize (make unit length)
      0, //< tightly packed
      0 //< data starts at array start
    );

    //create and bind input layer with color buffer
    gl.bindBuffer(gl.ARRAY_BUFFER, this.colorBuffer);
    gl.enableVertexAttribArray(1);
    gl.vertexAttribPointer(1,
      3, gl.FLOAT, //< three pieces of float
      false, //< do not normalize (make unit length)
      0, //< tightly packed
      0 //< data starts at array start
    );

    gl.bindVertexArray(null);
  }

  draw() {
    const gl = this.gl;
    gl.bindVertexArray(this.inputLayout);
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
    gl.drawElements(gl.TRIANGLES, this.newIndices.length, gl.UNSIGNED_SHORT, 0);
  }
}
