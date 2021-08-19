import React, { useState, useEffect, useRef } from "react";
import { useHistory, useLocation, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import * as three from "three";
import * as dat from "dat.gui";

import './Terrain.css';
import heightImage from "../../assets/test2.png";
import mountainImage from "../../assets/mtn.png";

export default function Terrain({}){
    const mountRef = useRef(null);

    useEffect(() => {
        const loader = new three.TextureLoader();
        const height = loader.load(heightImage);
        const mountain = loader.load(mountainImage);

        const gui = new dat.GUI();

        const scene = new three.Scene();

        const camera = new three.PerspectiveCamera(
            75,
            window.innerWidth / window.innerHeight,
            0.1,
            100
        );

        camera.position.z = 5;

        const renderer = new three.WebGLRenderer();

        renderer.setSize(window.innerWidth, window.innerHeight);

        mountRef.current.appendChild( renderer.domElement );

        // Objects
        const geometry = new three.PlaneBufferGeometry(3, 3, 256, 256);

        // Materials
        const material = new three.MeshStandardMaterial({
            color: 'white',
            map: mountain,
            displacementMap: height,
            displacementScale: 2,
        });

        // Meshes
        const plane = new three.Mesh(geometry, material);
        plane.rotation.x = 5.5;

        gui.add(plane.rotation, 'x', 0, 10, .1);
        gui.add(plane.rotation, 'y', 0, 10, .1);
        gui.add(plane.rotation, 'z', 0, 10, .1);
        gui.add(camera.position, 'z', 0, 10, .1);

        scene.add(plane);

        // Lights

        const pointLight = new three.PointLight(0xffffff, 1);
        pointLight.position.set(2, 3, 4);
        scene.add(pointLight);

        const animate = () => {
            requestAnimationFrame( animate );
            plane.rotation.z += 0.001;
            renderer.render( scene, camera );
        };

        const onWindowResize = () => {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize( window.innerWidth, window.innerHeight );
          }

        window.addEventListener("resize", onWindowResize, false);

        animate();

        return () => mountRef.current.removeChild( renderer.domElement );
    }, [])

    return (
        <div
            className="map"
            ref={mountRef}
        />
    )
}
