"use strict";
/* exported SerpetineGeometry */
class SerpetineGeometry {
  constructor(gl) {
    this.gl = gl;

    this.newVertices = [];
    this.newColors = [];
    this.newIndices = [];
    this.length = 1.4;
    this.width = 0.3;
    this.numVertices = 100;
    this.frequency = 15;
    this.amplitude = 0.1;

    for (let i = 0; i <= (this.numVertices - 4); i++ ){
      let quadwidth = this.length / ((this.numVertices - 2) / 2);
      let x = i * quadwidth;
      if (i === 0){
        this.newVertices.push(x, (Math.sin(x * this.frequency)) * this.amplitude, 0.5,
                              x, Math.sin(x * this.frequency) * this.amplitude + this.width,0.5,
                              quadwidth, (Math.sin(quadwidth * this.frequency)) * this.amplitude, 0.5,
                              quadwidth, Math.sin(quadwidth * this.frequency) * this.amplitude + this.width, 0.5);
        this.newColors.push(0.4,0.5,1.0,
                            0.4,0.5,1.0,
                            0.4,0.5,1.0,
                            0.4,0.5,1.0);
        this.newIndices.push(0, 1, 3, 3, 2, 0);
      }
      else {
        this.newIndices.push(2*i,2*i+1,2*i+2);
        this.newIndices.push(2*i+1, 2*i+2, 2*i+3);
        this.newVertices.push(x, (Math.sin(x * this.frequency)) * this.amplitude, 0.5,
                              x, Math.sin(x * this.frequency) * this.amplitude + this.width, 0.5);
        this.newColors.push(0.4,0.5,1.0,0.4,0.5,1.0);
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
