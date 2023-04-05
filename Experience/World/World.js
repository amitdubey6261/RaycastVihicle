import * as THREE from 'three'
import * as CANNON from 'cannon-es';
import CannonDebugger from "cannon-es-debugger";

import Experience from '../Experience';

export default class World {
    constructor() {
        this.timeStep = 1 / 60;
        this.experience = new Experience();
        this.sizes = this.experience.sizes;
        this.resources = this.experience.resources;
        this.scene = this.experience.scene;
        this.canvas = this.experience.canvas;
        this.createCannonWorld();
        this.intCode();
    }


    createCannonWorld() {
        this.CannonWorld = new CANNON.World({
            gravity: new CANNON.Vec3(0, -10, 0),
        })

        this.CannonDebugger = new CannonDebugger(this.scene, this.CannonWorld, {
            color: 0x00ffaa,
            scale: 1.0
        })
    }

    intCode() {
        this.createGround();
        this.createBox();
        this.GROUP1 = 1;
        this.GROUP2 = 2;
        this.GROUP3 = 4;
        this.groundMaterial = new CANNON.Material('ground');
        this.wheelMaterial = new CANNON.Material('wheel');
        this.createVihicleBody();
        this.createBall();
        this.setEventListeners();
    }

    createGround() {
        this.ground = new CANNON.Body({
            shape: new CANNON.Plane(100, 100),
            collisionFilterGroup: this.GROUP1,
            collisionFilterMask: this.GROUP2,
            material:this.groundMaterial
        })
        this.ground.quaternion.setFromEuler(-Math.PI / 2, 0, 0);
        this.CannonWorld.addBody(this.ground)
    }

    createBall() {
        this.wheel1 = new CANNON.Body({
            mass: 1,
            shape: new CANNON.Sphere(1),
            material: this.wheelMaterial,
            angularDamping: 0.4,
        })
        this.wheel2 = new CANNON.Body({
            mass: 1,
            shape: new CANNON.Sphere(1),
            material: this.wheelMaterial,
            angularDamping: 0.4
        })
        this.wheel3 = new CANNON.Body({
            mass: 1,
            shape: new CANNON.Sphere(1),
            material: this.wheelMaterial,
            angularDamping: 0.4
        })
        this.wheel4 = new CANNON.Body({
            mass: 1,
            shape: new CANNON.Sphere(1),
            material: this.wheelMaterial,
            angularDamping: 0.4
        })

        this.vihicle.addWheel({
            body: this.wheel1,
            position: new CANNON.Vec3(-2, 0, 10 / 2).vadd(new CANNON.Vec3(0,-1,0)),
            axis: new CANNON.Vec3(0, 0, 1),
            direction: new CANNON.Vec3(0, -1, 0)
        })
        this.vihicle.addWheel({
            body: this.wheel2,
            position: new CANNON.Vec3(-2, 0, -10 / 2).vadd(new CANNON.Vec3(0,-1,0)),
            axis: new CANNON.Vec3(0, 0, -1),
            direction: new CANNON.Vec3(0, -1, 0)
        })
        this.vihicle.addWheel({
            body: this.wheel3,
            position: new CANNON.Vec3(2, 0, 10 / 2).vadd(new CANNON.Vec3(0,-1,0)),
            axis: new CANNON.Vec3(0, 0, 1),
            direction: new CANNON.Vec3(0, -1, 0)
        })
        this.vihicle.addWheel({
            body: this.wheel4,
            position: new CANNON.Vec3(2, 0, -10 / 2).vadd(new CANNON.Vec3(0,-1,0)),
            axis: new CANNON.Vec3(0, 0, 1),
            direction: new CANNON.Vec3(0, -1, 0)
        })

        this.vihicle.addToWorld(this.CannonWorld);

        this.CannonWorld.addContactMaterial(new CANNON.ContactMaterial(this.wheelMaterial , this.groundMaterial , {
            friction : 0.3 , 
            restitution : 0 , 
            contactEquationStiffness : 1000 ,
        }))
    }

    createBox() {
        this.carshape = new CANNON.Box(new CANNON.Vec3(4, 0.5, 2)) ;
        this.coma = new CANNON.Vec3(0, -1, 0) ;
        this.carBody = new CANNON.Body({
            position: new CANNON.Vec3(0, 2, 0),
            mass: 1,
        })
        this.carBody.addShape( this.carshape , this.coma);
        this.CannonWorld.addBody(this.carBody);
    }

    createVihicleBody() {
        this.vihicle = new CANNON.RigidVehicle({
            chassisBody: this.carBody,
        })
    }

    setEventListeners() {

        this.maxSteerValue = Math.PI / 8;
        this.maxForce = 100;

        document.addEventListener('keydown', (e) => {
            switch (e.key) {
                case 'w':
                case 'ArrowUp':
                    console.log(e.key)
                    this.vihicle.setWheelForce(this.maxForce, 0);
                    this.vihicle.setWheelForce(-this.maxForce, 1);
                    break;
                case 's':
                case 'ArrowDown':
                    console.log(e.key)
                    this.vihicle.setWheelForce(-this.maxForce / 2, 0);
                    this.vihicle.setWheelForce(this.maxForce / 2, 1);
                    break;
                case 'a':
                case 'ArrowLeft':
                    console.log(e.key)
                    this.vihicle.setSteeringValue(this.maxSteerValue, 0);
                    this.vihicle.setSteeringValue(this.maxSteerValue, 1);
                    break;
                case 'd':
                case 'ArrowRight':
                    console.log(e.key)
                    this.vihicle.setSteeringValue(-this.maxSteerValue, 0);
                    this.vihicle.setSteeringValue(-this.maxSteerValue, 1);
                    break;
            }
        });

        document.addEventListener('keyup', (e) => {
            switch (e.key) {
                case 'w':
                case 'ArrowUp':
                    console.log(e.key , "halla")
                    this.vihicle.setWheelForce(0, 0);
                    this.vihicle.setWheelForce(0, 1);
                    break;

                case 's':
                case 'ArrowDown':
                    console.log(e.key , "halla")
                    this.vihicle.setWheelForce(0, 0);
                    this.vihicle.setWheelForce(0, 1);
                    break;

                case 'a':
                case 'ArrowLeft':
                    console.log(e.key , "halla")
                    this.vihicle.setSteeringValue(0, 0);
                    this.vihicle.setSteeringValue(0, 1);
                    break;

                case 'd':
                case 'ArrowRight':
                    console.log(e.key , "halla")
                    this.vihicle.setSteeringValue(0, 0);
                    this.vihicle.setSteeringValue(0, 1);
                    break;
            }
        })
    }

    update() {
        this.CannonWorld.step(this.timeStep);
        this.CannonDebugger.update();
    }

}
