"use client";

import { useEffect } from "react";
import * as THREE from "three";
import { Color } from "three";
import ThreeGlobe from "three-globe";
import { TrackballControls } from "three/addons/controls/TrackballControls.js";

import countries from "@/lib/data/globe.json";

export default function Page() {
  useEffect(() => {
    window.THREE = THREE;

    const arcsData = [
      {
        order: 1,
        startLat: 34.0522, // Los Angeles, USA
        startLng: -118.2437,
        endLat: 33.5731, // Casablanca
        endLng: -7.5898,
        arcAlt: 0.1,
        color: "#DF2032",
      },
      {
        order: 2,
        startLat: 48.8566, // Paris, France
        startLng: 2.3522,
        endLat: 31.6295, // Marrakech
        endLng: -7.9811,
        arcAlt: 0.2,
        color: "#DF2032",
      },
      {
        order: 3,
        startLat: -15.432563, // Luanda, Angola
        startLng: 28.315853,
        endLat: 26.8384, // Laayoune (Sahara)
        endLng: -13.2164,
        arcAlt: 0.5,
        color: "#DF2032",
      },
      {
        order: 4,
        startLat: 35.6895, // Tokyo, Japan
        startLng: 139.6917,
        endLat: 35.7595, // Tangier
        endLng: -5.834,
        arcAlt: 0.2,
        color: "#DF2032",
      },
      {
        order: 5,
        startLat: -34.6037, // Buenos Aires, Argentina
        startLng: -58.3816,
        endLat: 29.9908, // Dakhla (Sahara)
        endLng: -14.3628,
        arcAlt: 0.3,
        color: "#DF2032",
      },
      {
        order: 6,
        startLat: 55.7558, // Moscow, Russia
        startLng: 37.6173,
        endLat: 34.0209, // Agadir
        endLng: -9.5981,
        arcAlt: 0.3,
        color: "#DF2032",
      },
      {
        order: 7,
        startLat: -33.4489, // Santiago, Chile
        startLng: -70.6693,
        endLat: 31.5144, // Essaouira
        endLng: -9.7694,
        arcAlt: 0.3,
        color: "#DF2032",
      },
      {
        order: 8,
        startLat: 41.9028, // Rome, Italy
        startLng: 12.4964,
        endLat: 34.6821, // Oujda
        endLng: -1.9075,
        arcAlt: 0.3,
        color: "#DF2032",
      },
      {
        order: 9,
        startLat: 1.3521, // Singapore
        startLng: 103.8198,
        endLat: 32.2957, // El Jadida
        endLng: -8.5014,
        arcAlt: 0.5,
        color: "#DF2032",
      },
      {
        order: 10,
        startLat: 35.6762, // Seoul, South Korea
        startLng: 139.6503,
        endLat: 34.2457, // Meknes
        endLng: -5.9359,
        arcAlt: 0.3,
        color: "#DF2032",
      },
      {
        order: 11,
        startLat: -23.5505, // São Paulo, Brazil
        startLng: -46.6333,
        endLat: 32.8854, // Kenitra
        endLng: -6.9075,
        arcAlt: 0.5,
        color: "#DF2032",
      },
      {
        order: 12,
        startLat: 39.9042, // Beijing, China
        startLng: 116.4074,
        endLat: 35.1735, // Nador
        endLng: -2.9335,
        arcAlt: 0.1,
        color: "#DF2032",
      },
      {
        order: 13,
        startLat: 55.9533, // Edinburgh, UK
        startLng: -3.1883,
        endLat: 34.2645, // Ifrane
        endLng: -5.3554,
        arcAlt: 0.7,
        color: "#DF2032",
      },
      {
        order: 14,
        startLat: 52.52, // Berlin, Germany
        startLng: 13.405,
        endLat: 32.3794, // Beni Mellal
        endLng: -6.3588,
        arcAlt: 0.2,
        color: "#DF2032",
      },
      {
        order: 15,
        startLat: -34.9285, // Adelaide, Australia
        startLng: 138.6007,
        endLat: 35.0735, // Al Hoceima
        endLng: -3.934,
        arcAlt: 0.2,
        color: "#DF2032",
      },
      {
        order: 16,
        startLat: 48.2082, // Vienna, Austria
        startLng: 16.3738,
        endLat: 34.2137, // Chefchaouen
        endLng: -5.2417,
        arcAlt: 0.2,
        color: "#DF2032",
      },
      {
        order: 17,
        startLat: 37.7749, // San Francisco, USA
        startLng: -122.4194,
        endLat: 32.6829, // Sidi Ifni
        endLng: -9.1644,
        arcAlt: 0.1,
        color: "#DF2032",
      },
      {
        order: 18,
        startLat: 39.7392, // Denver, USA
        startLng: -104.9903,
        endLat: 34.9899, // Guercif
        endLng: -3.3575,
        arcAlt: 0.4,
        color: "#DF2032",
      },
      {
        order: 19,
        startLat: 55.7558, // Moscow, Russia
        startLng: 37.6173,
        endLat: 32.1835, // Zagora
        endLng: -5.3534,
        arcAlt: 0.4,
        color: "#DF2032",
      },
      {
        order: 20,
        startLat: -22.9068, // Rio de Janeiro, Brazil
        startLng: -43.1729,
        endLat: 34.2232, // Azrou
        endLng: -5.2195,
        arcAlt: 0.2,
        color: "#DF2032",
      },
    ];

    const Globe = new ThreeGlobe();

    const globeMaterial = Globe.globeMaterial() as unknown as {
      color: Color;
      emissive: Color;
      emissiveIntensity: number;
      shininess: number;
    };
    globeMaterial.color = new Color("#062056");
    globeMaterial.emissive = new Color("#062056");
    globeMaterial.emissiveIntensity = 0.1;
    globeMaterial.shininess = 0.9;

    Globe.hexPolygonsData(countries.features)
      .hexPolygonResolution(3)
      .hexPolygonMargin(0.7)
      .showAtmosphere(true)
      .atmosphereColor("#FFFFFF")
      .atmosphereAltitude(0.1)
      .hexPolygonColor((e) => {
        return "rgba(255,255,255,0.7)";
      });

    Globe.arcsData(arcsData)
      .arcStartLat((d) => (d as { startLat: number }).startLat * 1)
      .arcStartLng((d) => (d as { startLng: number }).startLng * 1)
      .arcEndLat((d) => (d as { endLat: number }).endLat * 1)
      .arcEndLng((d) => (d as { endLng: number }).endLng * 1)
      .arcColor((e: any) => (e as { color: string }).color)
      .arcAltitude((e) => {
        return (e as { arcAlt: number }).arcAlt * 1;
      })
      .arcStroke((e) => {
        return [0.32, 0.28, 0.3][Math.round(Math.random() * 2)];
      })
      .arcAltitude((e) => {
        return (e as { arcAlt: number }).arcAlt * 1;
      })
      .arcStroke((e) => {
        return [0.32, 0.28, 0.3][Math.round(Math.random() * 2)];
      })
      .arcDashLength(0.9)
      .arcDashInitialGap((e) => (e as { order: number }).order * 1)
      .arcDashGap(15)
      .arcDashAnimateTime(1000);

    // Setup renderer
    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.getElementById("globeViz").appendChild(renderer.domElement);

    // Setup scene
    const scene = new THREE.Scene();
    scene.add(Globe);
    scene.add(new THREE.AmbientLight(0xcccccc, Math.PI));
    scene.add(new THREE.DirectionalLight(0xffffff, 0.6 * Math.PI));

    // Setup camera
    const camera = new THREE.PerspectiveCamera();
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    camera.position.z = 500;

    // Add camera controls
    const tbControls = new TrackballControls(camera, renderer.domElement);
    tbControls.minDistance = 101;
    tbControls.rotateSpeed = 5;
    tbControls.zoomSpeed = 0.8;

    // Kick-off renderer
    (function animate() {
      // IIFE
      // Frame cycle
      tbControls.update();
      renderer.render(scene, camera);
      requestAnimationFrame(animate);
    })();
  }, []);
  return <div id="globeViz"></div>;
}
