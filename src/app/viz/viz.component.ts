import { Component, OnInit, AfterViewInit } from "@angular/core";
import {
  Scene,
  Color,
  PerspectiveCamera,
  BoxBufferGeometry,
  MeshBasicMaterial,
  Mesh,
  WebGLRenderer
} from "three";

@Component({
  selector: "app-viz",
  templateUrl: "./viz.component.html",
  styleUrls: ["./viz.component.css"]
})
export class VizComponent implements OnInit, AfterViewInit {
  constructor() {}

  private container;
  private camera;
  private renderer;
  private scene;
  private mesh;

  init() {
    this.container = document.getElementById("scene");
    this.scene = new Scene();
    this.scene.background = new Color("skyblue");

    const fov = 35;
    const aspect = this.container.clientWidth / this.container.clientHeight;
    const near = 0.1;
    const far = 100;

    this.camera = new PerspectiveCamera(fov, aspect, near, far);
    this.camera.position.set(0, 0, 10);

    const geometry = new BoxBufferGeometry(2, 2, 2);
    const material = new MeshBasicMaterial({ color: 0x800080 });
    this.mesh = new Mesh(geometry, material);

    this.scene.add(this.mesh);

    this.renderer = new WebGLRenderer();
    this.renderer.setSize(
      this.container.clientWidth,
      this.container.clientHeight
    );
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.container.appendChild(this.renderer.domElement);
  }

  animate() {
    requestAnimationFrame(this.animate.bind(this)); // must bind(this) to deal with context issue and recursive calls
    this.renderer.render(this.scene, this.camera);
  }

  ngOnInit() {}

  ngAfterViewInit() {
    this.init();
    this.animate();
  }
}
