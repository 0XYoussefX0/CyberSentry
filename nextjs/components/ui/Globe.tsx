"use client";

import { MutableRefObject, useEffect, useRef, useState } from "react";
import { OrbitControls, TrackballControls } from "@react-three/drei";
import {
  Canvas,
  extend,
  Object3DNode,
  useFrame,
  useThree,
} from "@react-three/fiber";
import { MotionValue } from "framer-motion";
import { Color, Controls, PerspectiveCamera, Scene, Vector3 } from "three";
import ThreeGlobe from "three-globe";

// import { OrbitControls, TrackballControls } from "three-stdlib";

import countries from "@/lib/data/globe.json";

declare module "@react-three/fiber" {
  interface ThreeElements {
    threeGlobe: Object3DNode<ThreeGlobe, typeof ThreeGlobe>;
  }
}

extend({ ThreeGlobe });

const RING_PROPAGATION_SPEED = 3;
const aspect = 1.2;

let numbersOfRings = [0];

const arcsData = [
  {
    order: 1,
    startLat: 34.0522, // Los Angeles, USA
    startLng: -118.2437,
    endLat: 33.5731, // Casablanca
    endLng: -7.5898,
    arcAlt: 0.3, // Adjusted based on moderate distance
    color: "#DF2032",
  },
  {
    order: 2,
    startLat: 48.8566, // Paris, France
    startLng: 2.3522,
    endLat: 31.6295, // Marrakech
    endLng: -7.9811,
    arcAlt: 0.2, // Shorter distance
    color: "#DF2032",
  },
  {
    order: 3,
    startLat: -33.9249, // Cape Town, South Africa
    startLng: 18.4241,
    endLat: 30.931, // Taroudant
    endLng: -8.859,
    arcAlt: 0.5, // Longer distance
    color: "#DF2032",
  },
  {
    order: 4,
    startLat: -23.5505, // São Paulo, Brazil
    startLng: -46.6333,
    endLat: 26.8384, // Laayoune (Sahara)
    endLng: -13.2164,
    arcAlt: 0.45, // Fairly long distance
    color: "#DF2032",
  },
  {
    order: 5,
    startLat: 35.6895, // Tokyo, Japan
    startLng: 139.6917,
    endLat: 32.8872, // Safi
    endLng: -9.2297,
    arcAlt: 0.5, // Maximum distance
    color: "#DF2032",
  },
  {
    order: 6,
    startLat: 37.7749, // San Francisco, USA
    startLng: -122.4194,
    endLat: 32.8854, // Kenitra
    endLng: -6.9075,
    arcAlt: 0.3, // Moderate distance
    color: "#DF2032",
  },
  {
    order: 7,
    startLat: 41.9028, // Rome, Italy
    startLng: 12.4964,
    endLat: 35.7595, // Tangier
    endLng: -5.834,
    arcAlt: 0.25, // Shorter distance
    color: "#DF2032",
  },
  {
    order: 8,
    startLat: 1.3521, // Singapore
    startLng: 103.8198,
    endLat: 29.9908, // Dakhla (Sahara)
    endLng: -14.3628,
    arcAlt: 0.5, // Longest distance
    color: "#DF2032",
  },
  {
    order: 9,
    startLat: 55.9533, // Edinburgh, UK
    startLng: -3.1883,
    endLat: 32.3794, // Beni Mellal
    endLng: -6.3588,
    arcAlt: 0.4, // Medium-long distance
    color: "#DF2032",
  },
  {
    order: 10,
    startLat: -34.6037, // Buenos Aires, Argentina
    startLng: -58.3816,
    endLat: 34.0209, // Agadir
    endLng: -9.5981,
    arcAlt: 0.45, // Long distance
    color: "#DF2032",
  },
  {
    order: 11,
    startLat: 39.9042, // Beijing, China
    startLng: 116.4074,
    endLat: 35.1735, // Nador
    endLng: -2.9335,
    arcAlt: 0.5, // Maximum distance
    color: "#DF2032",
  },
  {
    order: 12,
    startLat: 48.2082, // Vienna, Austria
    startLng: 16.3738,
    endLat: 34.2645, // Ifrane
    endLng: -5.3554,
    arcAlt: 0.3, // Moderate distance
    color: "#DF2032",
  },
  {
    order: 13,
    startLat: -15.432563, // Luanda, Angola
    startLng: 28.315853,
    endLat: 31.7043, // Ouarzazate
    endLng: -6.5708,
    arcAlt: 0.4, // Long distance
    color: "#DF2032",
  },
  {
    order: 14,
    startLat: -22.9068, // Rio de Janeiro, Brazil
    startLng: -43.1729,
    endLat: 35.0735, // Al Hoceima
    endLng: -3.934,
    arcAlt: 0.45, // Fairly long distance
    color: "#DF2032",
  },
  {
    order: 15,
    startLat: 52.52, // Berlin, Germany
    startLng: 13.405,
    endLat: 32.1835, // Zagora
    endLng: -5.3534,
    arcAlt: 0.4, // Medium distance
    color: "#DF2032",
  },
  {
    order: 16,
    startLat: 55.7558, // Moscow, Russia
    startLng: 37.6173,
    endLat: 35.2446, // Tetouan
    endLng: -5.2644,
    arcAlt: 0.5, // Very long distance
    color: "#DF2032",
  },
  {
    order: 17,
    startLat: 35.6762, // Seoul, South Korea
    startLng: 139.6503,
    endLat: 31.9314, // Oujda
    endLng: -1.9075,
    arcAlt: 0.5, // Maximum distance
    color: "#DF2032",
  },
  {
    order: 18,
    startLat: 51.1657, // Berlin, Germany
    startLng: 10.4515,
    endLat: 34.6821, // Oujda
    endLng: -1.9075,
    arcAlt: 0.3, // Moderate distance
    color: "#DF2032",
  },
  {
    order: 19,
    startLat: 13.7563, // Bangkok, Thailand
    startLng: 100.5018,
    endLat: 34.2137, // Chefchaouen
    endLng: -5.2417,
    arcAlt: 0.5, // Very long distance
    color: "#DF2032",
  },
  {
    order: 20,
    startLat: 55.9533, // Edinburgh, UK
    startLng: -3.1883,
    endLat: 32.6829, // Sidi Ifni
    endLng: -9.1644,
    arcAlt: 0.4, // Medium distance
    color: "#DF2032",
  },
  {
    order: 21,
    startLat: 19.4326, // Mexico City, Mexico
    startLng: -99.1332,
    endLat: 32.2957, // El Jadida
    endLng: -8.5014,
    arcAlt: 0.4, // Long distance
    color: "#DF2032",
  },
  {
    order: 22,
    startLat: -35.282, // Canberra, Australia
    startLng: 149.1287,
    endLat: 35.1735, // Nador
    endLng: -2.9335,
    arcAlt: 0.5, // Very long distance
    color: "#DF2032",
  },
  {
    order: 23,
    startLat: 39.7392, // Denver, USA
    startLng: -104.9903,
    endLat: 34.9899, // Guercif
    endLng: -3.3575,
    arcAlt: 0.4, // Long distance
    color: "#DF2032",
  },
  {
    order: 24,
    startLat: -33.8688, // Sydney, Australia
    startLng: 151.2093,
    endLat: 34.2232, // Azrou
    endLng: -5.2195,
    arcAlt: 0.5, // Maximum distance
    color: "#DF2032",
  },
  {
    order: 25,
    startLat: 51.5074, // London, UK
    startLng: -0.1278,
    endLat: 34.68, // Fez
    endLng: -4.967,
    arcAlt: 0.35, // Medium distance
    color: "#DF2032",
  },
];

const globeConfig = {
  pointSize: 4,
  globeColor: "#3c3c3c",
  showAtmosphere: true,
  atmosphereColor: "#DF2032",
  atmosphereAltitude: 0.2,
  emissive: "#062056",
  emissiveIntensity: 0.1,
  shininess: 0.9,
  polygonColor: "rgba(255,255,255,1)",
  ambientLight: "#38bdf8",
  directionalLeftLight: "#ffffff",
  directionalTopLight: "#ffffff",
  pointLight: "#ffffff",
  arcTime: 1000,
  arcLength: 0.9,
  rings: 1,
  maxRings: 3,
  initialPosition: { lat: 22.3193, lng: 114.1694 },
};

export function Globe({
  globeRef,
}: {
  globeRef: MutableRefObject<ThreeGlobe | null>;
}) {
  const [globeData, setGlobeData] = useState<
    | {
        size: number;
        order: number;
        color: (t: number) => string;
        lat: number;
        lng: number;
      }[]
    | null
  >(null);

  // const globeRef = useRef<ThreeGlobe | null>(null);

  useEffect(() => {
    if (globeRef.current) {
      _buildData();
      _buildMaterial();
    }
  }, [globeRef.current]);

  const _buildMaterial = () => {
    if (!globeRef.current) return;

    const globeMaterial = globeRef.current.globeMaterial() as unknown as {
      color: Color;
      emissive: Color;
      emissiveIntensity: number;
      shininess: number;
    };
    globeMaterial.color = new Color(globeConfig.globeColor);
    globeMaterial.emissive = new Color(globeConfig.emissive);
    globeMaterial.emissiveIntensity = globeConfig.emissiveIntensity || 0.1;
    globeMaterial.shininess = globeConfig.shininess || 0.9;
  };

  const _buildData = () => {
    const arcs = arcsData;
    let points = [];
    for (let i = 0; i < arcs.length; i++) {
      const arc = arcs[i];
      const rgb = hexToRgb(arc.color) as { r: number; g: number; b: number };
      points.push({
        size: globeConfig.pointSize,
        order: arc.order,
        color: (t: number) => `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${1 - t})`,
        lat: arc.endLat,
        lng: arc.endLng,
      });
    }

    // remove duplicates for same lat and lng
    const filteredPoints = points.filter(
      (v, i, a) =>
        a.findIndex((v2) =>
          ["lat", "lng"].every(
            (k) => v2[k as "lat" | "lng"] === v[k as "lat" | "lng"],
          ),
        ) === i,
    );

    setGlobeData(filteredPoints);
  };

  useEffect(() => {
    if (globeRef.current && globeData) {
      globeRef.current
        .hexPolygonsData(countries.features)
        .hexPolygonResolution(3)
        .hexPolygonMargin(0.7)
        .showAtmosphere(globeConfig.showAtmosphere)
        .atmosphereColor(globeConfig.atmosphereColor)
        .atmosphereAltitude(globeConfig.atmosphereAltitude)
        .hexPolygonColor((e) => {
          return globeConfig.polygonColor;
        });
      startAnimation();
    }
  }, [globeData]);

  const startAnimation = () => {
    if (!globeRef.current || !globeData) return;

    // the arcsData array should be kept in the same scope the arcsData method is called in, when you use the data prop you start experiencing weird bugs for somereason
    const arcsData = [
      {
        order: 1,
        startLat: 34.0522, // Los Angeles, USA
        startLng: -118.2437,
        endLat: 33.5731, // Casablanca
        endLng: -7.5898,
        arcAlt: 0.3, // Adjusted based on moderate distance
        color: "#DF2032",
      },
      {
        order: 2,
        startLat: 48.8566, // Paris, France
        startLng: 2.3522,
        endLat: 31.6295, // Marrakech
        endLng: -7.9811,
        arcAlt: 0.2, // Shorter distance
        color: "#DF2032",
      },
      {
        order: 3,
        startLat: -33.9249, // Cape Town, South Africa
        startLng: 18.4241,
        endLat: 30.931, // Taroudant
        endLng: -8.859,
        arcAlt: 0.5, // Longer distance
        color: "#DF2032",
      },
      {
        order: 4,
        startLat: -23.5505, // São Paulo, Brazil
        startLng: -46.6333,
        endLat: 26.8384, // Laayoune (Sahara)
        endLng: -13.2164,
        arcAlt: 0.45, // Fairly long distance
        color: "#DF2032",
      },
      {
        order: 5,
        startLat: 35.6895, // Tokyo, Japan
        startLng: 139.6917,
        endLat: 32.8872, // Safi
        endLng: -9.2297,
        arcAlt: 0.5, // Maximum distance
        color: "#DF2032",
      },
      {
        order: 6,
        startLat: 37.7749, // San Francisco, USA
        startLng: -122.4194,
        endLat: 32.8854, // Kenitra
        endLng: -6.9075,
        arcAlt: 0.3, // Moderate distance
        color: "#DF2032",
      },
      {
        order: 7,
        startLat: 41.9028, // Rome, Italy
        startLng: 12.4964,
        endLat: 35.7595, // Tangier
        endLng: -5.834,
        arcAlt: 0.25, // Shorter distance
        color: "#DF2032",
      },
      {
        order: 8,
        startLat: 1.3521, // Singapore
        startLng: 103.8198,
        endLat: 29.9908, // Dakhla (Sahara)
        endLng: -14.3628,
        arcAlt: 0.5, // Longest distance
        color: "#DF2032",
      },
      {
        order: 9,
        startLat: 55.9533, // Edinburgh, UK
        startLng: -3.1883,
        endLat: 32.3794, // Beni Mellal
        endLng: -6.3588,
        arcAlt: 0.4, // Medium-long distance
        color: "#DF2032",
      },
      {
        order: 10,
        startLat: -34.6037, // Buenos Aires, Argentina
        startLng: -58.3816,
        endLat: 34.0209, // Agadir
        endLng: -9.5981,
        arcAlt: 0.45, // Long distance
        color: "#DF2032",
      },
      {
        order: 11,
        startLat: 39.9042, // Beijing, China
        startLng: 116.4074,
        endLat: 35.1735, // Nador
        endLng: -2.9335,
        arcAlt: 0.5, // Maximum distance
        color: "#DF2032",
      },
      {
        order: 12,
        startLat: 48.2082, // Vienna, Austria
        startLng: 16.3738,
        endLat: 34.2645, // Ifrane
        endLng: -5.3554,
        arcAlt: 0.3, // Moderate distance
        color: "#DF2032",
      },
      {
        order: 13,
        startLat: -15.432563, // Luanda, Angola
        startLng: 28.315853,
        endLat: 31.7043, // Ouarzazate
        endLng: -6.5708,
        arcAlt: 0.4, // Long distance
        color: "#DF2032",
      },
      {
        order: 14,
        startLat: -22.9068, // Rio de Janeiro, Brazil
        startLng: -43.1729,
        endLat: 35.0735, // Al Hoceima
        endLng: -3.934,
        arcAlt: 0.45, // Fairly long distance
        color: "#DF2032",
      },
      {
        order: 15,
        startLat: 52.52, // Berlin, Germany
        startLng: 13.405,
        endLat: 32.1835, // Zagora
        endLng: -5.3534,
        arcAlt: 0.4, // Medium distance
        color: "#DF2032",
      },
      {
        order: 16,
        startLat: 55.7558, // Moscow, Russia
        startLng: 37.6173,
        endLat: 35.2446, // Tetouan
        endLng: -5.2644,
        arcAlt: 0.5, // Very long distance
        color: "#DF2032",
      },
      {
        order: 17,
        startLat: 35.6762, // Seoul, South Korea
        startLng: 139.6503,
        endLat: 31.9314, // Oujda
        endLng: -1.9075,
        arcAlt: 0.5, // Maximum distance
        color: "#DF2032",
      },
      {
        order: 18,
        startLat: 51.1657, // Berlin, Germany
        startLng: 10.4515,
        endLat: 34.6821, // Oujda
        endLng: -1.9075,
        arcAlt: 0.3, // Moderate distance
        color: "#DF2032",
      },
      {
        order: 19,
        startLat: 13.7563, // Bangkok, Thailand
        startLng: 100.5018,
        endLat: 34.2137, // Chefchaouen
        endLng: -5.2417,
        arcAlt: 0.5, // Very long distance
        color: "#DF2032",
      },
      {
        order: 20,
        startLat: 55.9533, // Edinburgh, UK
        startLng: -3.1883,
        endLat: 32.6829, // Sidi Ifni
        endLng: -9.1644,
        arcAlt: 0.4, // Medium distance
        color: "#DF2032",
      },
      {
        order: 21,
        startLat: 19.4326, // Mexico City, Mexico
        startLng: -99.1332,
        endLat: 32.2957, // El Jadida
        endLng: -8.5014,
        arcAlt: 0.4, // Long distance
        color: "#DF2032",
      },
      {
        order: 22,
        startLat: -35.282, // Canberra, Australia
        startLng: 149.1287,
        endLat: 35.1735, // Nador
        endLng: -2.9335,
        arcAlt: 0.5, // Very long distance
        color: "#DF2032",
      },
      {
        order: 23,
        startLat: 39.7392, // Denver, USA
        startLng: -104.9903,
        endLat: 34.9899, // Guercif
        endLng: -3.3575,
        arcAlt: 0.4, // Long distance
        color: "#DF2032",
      },
      {
        order: 24,
        startLat: -33.8688, // Sydney, Australia
        startLng: 151.2093,
        endLat: 34.2232, // Azrou
        endLng: -5.2195,
        arcAlt: 0.5, // Maximum distance
        color: "#DF2032",
      },
      {
        order: 25,
        startLat: 51.5074, // London, UK
        startLng: -0.1278,
        endLat: 34.68, // Fez
        endLng: -4.967,
        arcAlt: 0.35, // Medium distance
        color: "#DF2032",
      },
    ];

    globeRef.current
      .arcsData(arcsData)
      .arcStartLat((d) => (d as { startLat: number }).startLat * 1)
      .arcStartLng((d) => (d as { startLng: number }).startLng * 1)
      .arcEndLat((d) => (d as { endLat: number }).endLat * 1)
      .arcEndLng((d) => (d as { endLng: number }).endLng * 1)
      .arcColor((e: any) => (e as { color: string }).color)
      .arcAltitude((e) => {
        return (e as { arcAlt: number }).arcAlt * 1;
      })
      .arcStroke((e) => {
        return 0.6;
      })
      .arcDashLength(globeConfig.arcLength)
      .arcDashInitialGap((e) => (e as { order: number }).order * 1)
      .arcDashGap(15)
      .arcDashAnimateTime((e) => globeConfig.arcTime);

    globeRef.current
      .pointsData(arcsData)
      .pointColor((e) => (e as { color: string }).color)
      .pointsMerge(true)
      .pointAltitude(0.0)
      .pointRadius(2);

    globeRef.current
      .ringsData([])
      .ringColor((e: any) => (t: any) => e.color(t))
      .ringMaxRadius(globeConfig.maxRings)
      .ringPropagationSpeed(RING_PROPAGATION_SPEED)
      .ringRepeatPeriod(
        (globeConfig.arcTime * globeConfig.arcLength) / globeConfig.rings,
      );
  };

  useEffect(() => {
    if (!globeRef.current || !globeData) return;

    const interval = setInterval(() => {
      if (!globeRef.current || !globeData) return;
      numbersOfRings = genRandomNumbers(
        0,
        arcsData.length,
        Math.floor((arcsData.length * 4) / 5),
      );

      globeRef.current.ringsData(
        globeData.filter((d, i) => numbersOfRings.includes(i)),
      );
    }, 2000);

    return () => {
      clearInterval(interval);
    };
  }, [globeRef.current, globeData]);

  return (
    <>
      <threeGlobe ref={globeRef} />
    </>
  );
}

export function WebGLRendererConfig() {
  const { gl, size } = useThree();

  useEffect(() => {
    gl.setPixelRatio(window.devicePixelRatio);
    gl.setSize(size.width, size.height);
    gl.setClearColor(0xffaaff, 0);
  }, []);

  return null;
}

export function World({
  containerRef,
  positionZ,
  rotation,
}: {
  containerRef: MutableRefObject<HTMLElement | null>;
  positionZ: MotionValue<number>;
  rotation: MotionValue<number>;
}) {
  const sceneRef = useRef(new Scene());
  const cameraRef = useRef(new PerspectiveCamera(50, aspect, 180, 10000));
  const globeRef = useRef<ThreeGlobe | null>(null);

  useEffect(() => {
    const cursorStateChange = (cursorState: "grab" | "grabbing") => {
      return () => {
        if (!containerRef.current) return;
        containerRef.current.style.cursor = cursorState;
      };
    };

    const dragStartCb = cursorStateChange("grabbing");
    const dragEndCb = cursorStateChange("grab");

    if (containerRef.current) {
      containerRef.current.style.cursor = "grab";
      containerRef.current.addEventListener("dragstart", dragStartCb);
      containerRef.current.addEventListener("dragend", dragEndCb);
    }

    return () => {
      if (!containerRef.current) return;
      containerRef.current.removeEventListener("dragstart", dragStartCb);
      containerRef.current.removeEventListener("dragend", dragEndCb);
    };
  }, []);

  return (
    <>
      <Canvas scene={sceneRef.current} camera={cameraRef.current}>
        <WebGLRendererConfig />
        <ambientLight color={globeConfig.ambientLight} intensity={0.6} />
        <directionalLight
          color={globeConfig.directionalLeftLight}
          position={new Vector3(-400, 100, 400)}
        />
        <directionalLight
          color={globeConfig.directionalTopLight}
          position={new Vector3(-200, 500, 200)}
        />
        <pointLight
          color={globeConfig.pointLight}
          position={new Vector3(-200, 500, 200)}
          intensity={0.8}
        />
        <Globe globeRef={globeRef} />
        <SyncedControls
          globeRef={globeRef}
          rotation={rotation}
          positionZ={positionZ}
        />
      </Canvas>
    </>
  );
}

const SyncedControls = ({
  positionZ,
  rotation,
  globeRef,
}: {
  globeRef: MutableRefObject<ThreeGlobe | null>;
  positionZ: MotionValue<number>;
  rotation: MotionValue<number>;
}) => {
  const trackballControlsRef = useRef<any>();
  const orbitControlsRef = useRef<any>();

  const { camera } = useThree();

  const stopAnimation = useRef(false);

  useFrame(() => {
    if (
      !trackballControlsRef.current ||
      !globeRef.current ||
      !orbitControlsRef.current
    )
      return;

    const posZ = positionZ.get();
    const rotateDeg = rotation.get();

    orbitControlsRef.current.enabled = posZ > 300 ? false : true;

    console.log(orbitControlsRef.current.enabled);

    if (posZ >= 300 && !stopAnimation.current) {
      const angle = (rotateDeg * Math.PI) / 180;

      camera.position.x = posZ * Math.sin(angle);
      camera.position.z = posZ * Math.cos(angle);

      camera.lookAt(globeRef.current.position);

      let target = orbitControlsRef.current.target;
      orbitControlsRef.current.update();
      trackballControlsRef.current.target.set(target.x, target.y, target.z);
      trackballControlsRef.current.update();
    }

    stopAnimation.current = posZ === 300 ? true : false;
  });

  return (
    <>
      <OrbitControls
        ref={orbitControlsRef}
        enableZoom={false}
        minDistance={300}
        maxDistance={12000}
        minPolarAngle={Math.PI / 3.5}
        maxPolarAngle={Math.PI - Math.PI / 3}
        rotateSpeed={0.8}
        dampingFactor={0.1}
        enableRotate={true}
        enablePan={false}
        enableDamping={true}
      />
      <TrackballControls
        ref={trackballControlsRef}
        minDistance={300}
        maxDistance={12000}
        zoomSpeed={0.8}
        noPan={true}
        noRotate={true}
        noZoom={true}
        enabled={false}
      />
    </>
  );
};
//   cameraRef,
//   containerRef,
//   positionZ,
//   rotation,
//   globeRef,
// }: {
//   cameraRef: MutableRefObject<PerspectiveCamera>;
//   containerRef: MutableRefObject<HTMLElement | null>;
//   globeRef: MutableRefObject<ThreeGlobe | null>;
//   positionZ: MotionValue<number>;
//   rotation: MotionValue<number>;
// }) => {
//   if (!containerRef.current) return;

//   const camera = cameraRef.current;
//   const container = containerRef.current;

//   const trackballControls = useRef(new TrackballControls(camera, container));

//   const orbitControls = useRef(new OrbitControls(camera, container));

//   useEffect(() => {
//     trackballControls.current.minDistance = 300;
//     trackballControls.current.maxDistance = 12000;
//     trackballControls.current.zoomSpeed = 0.8;
//     trackballControls.current.noPan = true;
//     trackballControls.current.noRotate = true;
//     trackballControls.current.noZoom = true;
//     trackballControls.current.enabled = false;

//     orbitControls.current.enableZoom = false;
//     orbitControls.current.minDistance = 300;
//     orbitControls.current.maxDistance = 12000;
//     orbitControls.current.minPolarAngle = Math.PI / 3.5;
//     orbitControls.current.maxPolarAngle = Math.PI - Math.PI / 3;
//     orbitControls.current.rotateSpeed = 0.8;
//     orbitControls.current.dampingFactor = 0.1;
//     orbitControls.current.enableRotate = false;
//     orbitControls.current.enablePan = false;
//     orbitControls.current.enableDamping = false;
//     orbitControls.current.enabled = false;

//     console.log("OrbitControls :", orbitControls.current);
//     console.log("TrackballControls:", trackballControls.current);

//     const cursorStateChange = (cursorState: "grab" | "grabbing") => {
//       return () => {
//         if (!containerRef.current) return;
//         containerRef.current.style.cursor = cursorState;
//       };
//     };

//     const dragStartCb = cursorStateChange("grabbing");
//     const dragEndCb = cursorStateChange("grab");

//     let animationFrameId: number | undefined;

//     function animate() {
//       if (!globeRef.current) {
//         return;
//       }

//       const posZ = positionZ.get();
//       const rotateDeg = rotation.get();

//       if (posZ !== 300) {
//         orbitControls.current.enableRotate = false;
//         orbitControls.current.enablePan = false;
//         orbitControls.current.enableDamping = false;

//         const angle = (rotateDeg * Math.PI) / 180;

//         camera.position.x = posZ * Math.sin(angle);
//         camera.position.z = posZ * Math.cos(angle);

//         camera.lookAt(globeRef.current.position);
//       } else {
//         orbitControls.current.enableRotate = true;
//         orbitControls.current.enablePan = false;
//         orbitControls.current.enableDamping = true;
//       }

//       let target = trackballControls.current.target;
//       // trackballControls.current.update();
//       // orbitControls.current.target.set(target.x, target.y, target.z);
//       // orbitControls.current.update();

//       animationFrameId = requestAnimationFrame(animate);
//     }

//     animationFrameId = requestAnimationFrame(animate);

//     if (containerRef.current) {
//       containerRef.current.style.cursor = "grab";
//       containerRef.current.addEventListener("dragstart", dragStartCb);
//       containerRef.current.addEventListener("dragend", dragEndCb);
//     }

//     return () => {
//       if (!animationFrameId) return;
//       cancelAnimationFrame(animationFrameId);
//       if (!containerRef.current) return;
//       containerRef.current.removeEventListener("dragstart", dragStartCb);
//       containerRef.current.removeEventListener("dragend", dragEndCb);
//     };
//   }, []);

//   return null;
// };

export function hexToRgb(hex: string) {
  var shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
  hex = hex.replace(shorthandRegex, function (m, r, g, b) {
    return r + r + g + g + b + b;
  });

  var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : null;
}

export function genRandomNumbers(min: number, max: number, count: number) {
  const arr = [];
  while (arr.length < count) {
    const r = Math.floor(Math.random() * (max - min)) + min;
    if (arr.indexOf(r) === -1) arr.push(r);
  }

  return arr;
}
