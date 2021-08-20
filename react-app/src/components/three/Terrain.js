import React, { useState, useEffect, useRef } from "react";
import { useHistory, useLocation, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import * as three from "three";
import tilebelt from "@mapbox/tilebelt";
import * as dat from "dat.gui";

import './Terrain.css';
import heightImage from "../../assets/test2.png";
import mountainImage from "../../assets/mtn.png";

export default function Terrain({}){
    const mountRef = useRef(null);
    const dispatch = useDispatch();
    const [tile, setTile] = useState(null);

    const getTile = async () => {
        const t = tilebelt.pointToTile(-78.28751, 38.57103, 13)
        const res = await fetch(
            `https://api.mapbox.com/v4/mapbox.terrain-rgb/${t[2]}/${t[0]}/${t[1]}.pngraw?access_token=${process.env.REACT_APP_MAPBOX_TOKEN}`
        );
        if (res.ok) {
            const data = await res.arrayBuffer();
            setTile(data);
        }
        else {
            console.log(`error`, res)
        }
    }

    useEffect(() => {
        getTile();
    }, []);


    useEffect(() => {
        if (!tile) return;
        const loader = new three.TextureLoader();
        const height = loader.load(heightImage);
        const mountain = loader.load(mountainImage);
        const tileImage = loader.load(tile);

        const gui = new dat.GUI();

        const scene = new three.Scene();

        const camera = new three.PerspectiveCamera(
            75,
            window.innerWidth / window.innerHeight,
            0.1,
            100
        );

        camera.position.z = 3;

        const renderer = new three.WebGLRenderer();
        renderer.setPixelRatio( window.devicePixelRatio );
        renderer.setSize(window.innerWidth, window.innerHeight);

        mountRef.current.appendChild( renderer.domElement );

        // Objects
        const geometry = new three.PlaneBufferGeometry(3, 3, 256, 256);

        // Materials
        const material = new three.MeshStandardMaterial({
            color: 'white',
            // map: mountain,
            displacementMap: tile,
            displacementScale: 2,
            wireframe: true,
        });


        // Meshes
        const plane = new three.Mesh(geometry, material);
        plane.rotation.x = 5.5;

        let obj = plane;
        gui.add(obj['rotation'], 'x', 0, 10, .1);
        gui.add(obj['rotation'], 'y', 0, 10, .1);
        gui.add(obj['rotation'], 'z', 0, 10, .1);
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
    }, [tile])

    return (
        <div
            className="map"
            ref={mountRef}
        />
    )
}
