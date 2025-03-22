import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { TextGeometry } from 'three/addons/geometries/TextGeometry.js';
import { FontLoader } from 'three/addons/loaders/FontLoader.js';

//Scene setup
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 10000);
camera.position.z = 50;

let renderer
initRenderer()

//Add controls
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.05;

//Enhanced lighting system
//Soft ambient light for base illumination
const ambientLight = new THREE.AmbientLight(0x333333, 0.5);
scene.add(ambientLight);

//Sun light (point light at the center)
const sunLight = new THREE.PointLight(0xFFFFFF, 2, 1000);
scene.add(sunLight);

//Add directional light for better planet definition
const directionalLight = new THREE.DirectionalLight(0xFFFFFF, 1);
directionalLight.position.set(5, 3, 5);
scene.add(directionalLight);

//Add a subtle hemispheric light for better environmental lighting
const hemisphereLight = new THREE.HemisphereLight(0xffffbb, 0x080820, 0.2);
scene.add(hemisphereLight);

//Stars background
function createStars() {
	const starGeometry = new THREE.BufferGeometry();
	const starMaterial = new THREE.PointsMaterial({
		color: 0xFFFFFF,
		size: 0.1,
		transparent: true
	});

	const starVertices = [];
	for (let i = 0; i < 10000; i++) {
		const x = (Math.random() - 0.5) * 2000;
		const y = (Math.random() - 0.5) * 2000;
		const z = (Math.random() - 0.5) * 2000;
		starVertices.push(x, y, z);
	}

	starGeometry.setAttribute('position', new THREE.Float32BufferAttribute(starVertices, 3));
	const stars = new THREE.Points(starGeometry, starMaterial);
	scene.add(stars);
}

//Galaxy background
function createGalaxy() {
	const galaxyGeometry = new THREE.BufferGeometry();
	const galaxyMaterial = new THREE.PointsMaterial({
		color: 0x8866ff,
		size: 0.2,
		transparent: true,
		opacity: 0.6
	});

	const galaxyVertices = [];
	const galaxyRadius = 800;
	const spiralArms = 3;
	const spiralTightness = 0.8;

	for (let i = 0; i < 20000; i++) {
		//Create a spiral galaxy
		const angle = Math.random() * Math.PI * 2;
		const distance = Math.random() * galaxyRadius;
		const spiralOffset = angle + spiralTightness * distance / galaxyRadius * (2 * Math.PI) * spiralArms;

		const x = Math.cos(spiralOffset) * distance;
		const y = (Math.random() - 0.5) * distance * 0.1;
		const z = Math.sin(spiralOffset) * distance;

		galaxyVertices.push(x, y, z);
	}

	galaxyGeometry.setAttribute('position', new THREE.Float32BufferAttribute(galaxyVertices, 3));
	const galaxy = new THREE.Points(galaxyGeometry, galaxyMaterial);
	scene.add(galaxy);
}

//Asteroid belt
function createAsteroidBelt() {
	const asteroidBeltGeometry = new THREE.BufferGeometry();
	const asteroidBeltMaterial = new THREE.PointsMaterial({
		color: 0xbbbbbb,
		size: 0.2,
		transparent: true
	});

	const asteroidVertices = [];
	const beltRadius = 120;
	const beltWidth = 10;

	for (let i = 0; i < 10000; i++) {
		const angle = Math.random() * Math.PI * 2;
		const distance = beltRadius + (Math.random() - 0.5) * beltWidth;
		const height = (Math.random() - 0.5) * 2;

		const x = Math.cos(angle) * distance;
		const y = height;
		const z = Math.sin(angle) * distance;

		asteroidVertices.push(x, y, z);
	}

	asteroidBeltGeometry.setAttribute('position', new THREE.Float32BufferAttribute(asteroidVertices, 3));
	const asteroidBelt = new THREE.Points(asteroidBeltGeometry, asteroidBeltMaterial);
	scene.add(asteroidBelt);
	return asteroidBelt;
}

//Planet data
const planetData = [
	{
		name: 'Mercury',
		radius: 1,
		distance: 10,
		rotationSpeed: 0.004,
		orbitSpeed: 0.02,
		texture: 'mercury.jpg',
		color: 0xB7B8B9,
		mass: '3.3 × 10^23 kg',
		info: 'Closest planet to the sun with extreme temperature variations.',
		layers: [
			{ name: 'Iron Core', radius: 0.8, color: 0x8C8C8C },
			{ name: 'Silicate Mantle', radius: 1.0, color: 0xB7B8B9 }
		]
	},
	{
		name: 'Venus',
		radius: 1.8,
		distance: 15,
		rotationSpeed: 0.002,
		orbitSpeed: 0.015,
		texture: 'venus.jpg',
		color: 0xE6C8A0,
		mass: '4.87 × 10^24 kg',
		info: 'Often called Earth\'s sister planet, with thick toxic atmosphere.',
		layers: [
			{ name: 'Iron Core', radius: 0.5, color: 0x8B5A2B },
			{ name: 'Mantle', radius: 0.8, color: 0xC39B76 },
			{ name: 'Crust', radius: 1.0, color: 0xE6C8A0 }
		]
	},
	{
		name: 'Earth',
		radius: 2,
		distance: 20,
		rotationSpeed: 0.01,
		orbitSpeed: 0.01,
		texture: 'earth.jpg',
		color: 0x2233ff,
		mass: '5.97 × 10^24 kg',
		info: 'Our home planet, the only known celestial body to harbor life.',
		layers: [
			{ name: 'Inner Core', radius: 0.2, color: 0xFFD700 },
			{ name: 'Outer Core', radius: 0.4, color: 0xFF4500 },
			{ name: 'Lower Mantle', radius: 0.65, color: 0xA52A2A },
			{ name: 'Upper Mantle', radius: 0.9, color: 0xCD853F },
			{ name: 'Crust', radius: 1.0, color: 0x1E90FF }
		]
	},
	{
		name: 'Mars',
		radius: 1.5,
		distance: 25,
		rotationSpeed: 0.008,
		orbitSpeed: 0.008,
		texture: 'mars.jpg',
		color: 0xE27B58,
		mass: '6.42 × 10^23 kg',
		info: 'The Red Planet, with polar ice caps and the tallest mountain in the solar system.',
		layers: [
			{ name: 'Core', radius: 0.5, color: 0x8B4513 },
			{ name: 'Mantle', radius: 0.8, color: 0xA0522D },
			{ name: 'Crust', radius: 1.0, color: 0xE27B58 }
		]
	},
	{
		name: 'Jupiter',
		radius: 5,
		distance: 40,
		rotationSpeed: 0.02,
		orbitSpeed: 0.005,
		texture: 'jupiter.jpg',
		color: 0xF0E5CE,
		mass: '1.9 × 10^27 kg',
		info: 'The largest planet in our solar system, a gas giant with a Great Red Spot.',
		layers: [
			{ name: 'Core', radius: 0.2, color: 0x5E4E4A },
			{ name: 'Metallic Hydrogen', radius: 0.5, color: 0x8B7D7B },
			{ name: 'Molecular Hydrogen', radius: 0.8, color: 0xC9BB9B },
			{ name: 'Cloud Layer', radius: 1.0, color: 0xF0E5CE }
		]
	},
	{
		name: 'Saturn',
		radius: 4.5,
		distance: 70,
		rotationSpeed: 0.018,
		orbitSpeed: 0.003,
		texture: 'saturn.jpg',
		color: 0xF7EFC0,
		mass: '5.68 × 10^26 kg',
		info: 'Famous for its extensive ring system, composed mostly of ice particles.',
		layers: [
			{ name: 'Core', radius: 0.2, color: 0x9C7A55 },
			{ name: 'Metallic Hydrogen', radius: 0.4, color: 0xBEA97B },
			{ name: 'Liquid Hydrogen', radius: 0.8, color: 0xDAC992 },
			{ name: 'Cloud Layer', radius: 1.0, color: 0xF7EFC0 }
		],
		rings: { innerRadius: 5.5, outerRadius: 9, color: 0xFFFFFF }
	},
	{
		name: 'Uranus',
		radius: 3.5,
		distance: 95,
		rotationSpeed: 0.015,
		orbitSpeed: 0.002,
		texture: 'uranus.jpg',
		color: 0x9FE3F5,
		mass: '8.68 × 10^25 kg',
		info: 'Ice giant with a unique sideways rotation, appearing to roll around the Sun.',
		layers: [
			{ name: 'Core', radius: 0.3, color: 0x56749B },
			{ name: 'Ice Mantle', radius: 0.7, color: 0x7BB4E3 },
			{ name: 'Cloud Layer', radius: 1.0, color: 0x9FE3F5 }
		]
	},
	{
		name: 'Neptune',
		radius: 3.4,
		distance: 110,
		rotationSpeed: 0.017,
		orbitSpeed: 0.001,
		texture: 'neptune.jpg',
		color: 0x3E55E2,
		mass: '1.02 × 10^26 kg',
		info: 'The windiest planet with the fastest winds in the solar system (up to 2,100 km/h).',
		layers: [
			{ name: 'Core', radius: 0.3, color: 0x1835B7 },
			{ name: 'Ice Mantle', radius: 0.7, color: 0x2945CC },
			{ name: 'Cloud Layer', radius: 1.0, color: 0x3E55E2 }
		]
	}
];

//Create the sun with enhanced effects
function createSun() {
	const sunGroup = new THREE.Group();
	scene.add(sunGroup);

	//Main sun sphere
	const sunGeometry = new THREE.SphereGeometry(5, 64, 64);

	//Use custom shader material for sun surface
	const sunMaterial = new THREE.MeshBasicMaterial({
		color: 0xffbb00,
		emissive: 0xffff00,
		emissiveIntensity: 0.7
	});

	const sun = new THREE.Mesh(sunGeometry, sunMaterial);
	sunGroup.add(sun);

	//Add multiple glow layers for better effect
	const createGlowLayer = (radius, color, opacity) => {
		const glowGeometry = new THREE.SphereGeometry(radius, 32, 32);
		const glowMaterial = new THREE.MeshBasicMaterial({
			color: color,
			transparent: true,
			opacity: opacity,
			side: THREE.BackSide
		});
		const glow = new THREE.Mesh(glowGeometry, glowMaterial);
		sunGroup.add(glow);
		return glow;
	};

	const innerGlow = createGlowLayer(5.2, 0xffff44, 0.4);
	const middleGlow = createGlowLayer(5.6, 0xffaa11, 0.3);
	const outerGlow = createGlowLayer(6.2, 0xff7700, 0.2);
	const atmosphereGlow = createGlowLayer(7.0, 0xff4400, 0.1);

	//Add corona effect with particles
	const coronaParticles = new THREE.BufferGeometry();
	const coronaMaterial = new THREE.PointsMaterial({
		color: 0xffffaa,
		size: 0.2,
		transparent: true,
		opacity: 0.4
	});

	const particleCount = 2000;
	const coronaPositions = [];

	for (let i = 0; i < particleCount; i++) {
		//Random direction vector
		const theta = Math.random() * Math.PI * 2;
		const phi = Math.random() * Math.PI;

		//Random distance from sun center (5 to 10)
		const radius = 5 + Math.pow(Math.random(), 2) * 10;

		//Calculate position
		const x = radius * Math.sin(phi) * Math.cos(theta);
		const y = radius * Math.sin(phi) * Math.sin(theta);
		const z = radius * Math.cos(phi);

		coronaPositions.push(x, y, z);
	}

	coronaParticles.setAttribute('position', new THREE.Float32BufferAttribute(coronaPositions, 3));
	const corona = new THREE.Points(coronaParticles, coronaMaterial);
	sunGroup.add(corona);

	//Add light flares
	const flareGeometry = new THREE.BufferGeometry();
	const flareMaterial = new THREE.PointsMaterial({
		color: 0xffffff,
		size: 0.4,
		transparent: true,
		opacity: 0.7
	});

	const flareCount = 100;
	const flarePositions = [];

	//Store flare data for animation
	const flareData = [];

	for (let i = 0; i < flareCount; i++) {
		//Random position on sun surface
		const theta = Math.random() * Math.PI * 2;
		const phi = Math.random() * Math.PI;

		const x = 5 * Math.sin(phi) * Math.cos(theta);
		const y = 5 * Math.sin(phi) * Math.sin(theta);
		const z = 5 * Math.cos(phi);

		flarePositions.push(x, y, z);

		//Store initial position and animation data
		flareData.push({
			basePosition: [x, y, z],
			speed: 0.01 + Math.random() * 0.04,
			offset: Math.random() * Math.PI * 2,
			amplitude: 0.2 + Math.random() * 0.3
		});
	}

	flareGeometry.setAttribute('position', new THREE.Float32BufferAttribute(flarePositions, 3));
	const flares = new THREE.Points(flareGeometry, flareMaterial);
	sunGroup.add(flares);

	//Add animation function to sun
	sun.userData.animate = (time) => {
		//Animate flares
		const positions = flares.geometry.attributes.position.array;

		for (let i = 0; i < flareCount; i++) {
			const data = flareData[i];
			const basePos = data.basePosition;

			//Calculate new position with oscillation
			const oscillation = Math.sin(time * data.speed + data.offset) * data.amplitude;
			const dirX = basePos[0] / 5; //Normalize direction vector
			const dirY = basePos[1] / 5;
			const dirZ = basePos[2] / 5;

			//Update position
			positions[i * 3] = basePos[0] + dirX * oscillation;
			positions[i * 3 + 1] = basePos[1] + dirY * oscillation;
			positions[i * 3 + 2] = basePos[2] + dirZ * oscillation;
		}

		flares.geometry.attributes.position.needsUpdate = true;

		//Rotate corona slightly differently than the sun
		corona.rotation.y = time * 0.0005;
		corona.rotation.z = time * 0.0003;

		//Rotate glow layers
		innerGlow.rotation.y = time * 0.0008;
		middleGlow.rotation.y = -time * 0.0005;
		outerGlow.rotation.y = time * 0.0003;
	};

	return sunGroup;
}

//Create planets
function createPlanets() {
	const planets = [];
	const orbitLines = [];

	planetData.forEach(planet => {
		//Create orbit line
		const orbitGeometry = new THREE.BufferGeometry();
		const orbitMaterial = new THREE.LineBasicMaterial({ color: 0x444444, transparent: true, opacity: 0.3 });

		const orbitPoints = [];
		for (let i = 0; i <= 64; i++) {
			const angle = (i / 64) * Math.PI * 2;
			orbitPoints.push(
				Math.cos(angle) * planet.distance,
				0,
				Math.sin(angle) * planet.distance
			);
		}

		orbitGeometry.setAttribute('position', new THREE.Float32BufferAttribute(orbitPoints, 3));
		const orbit = new THREE.Line(orbitGeometry, orbitMaterial);
		scene.add(orbit);
		orbitLines.push(orbit);

		//Create planet
		const planetGroup = new THREE.Group();
		scene.add(planetGroup);

		const planetGeometry = new THREE.SphereGeometry(planet.radius, 32, 32);
		const planetMaterial = new THREE.MeshStandardMaterial({
			color: planet.color,
			metalness: 0.1,
			roughness: 0.7
		});

		const planetMesh = new THREE.Mesh(planetGeometry, planetMaterial);
		planetGroup.add(planetMesh);

		//Add rings for Saturn
		if (planet.name === 'Saturn') {
			const ringGeometry = new THREE.RingGeometry(planet.rings.innerRadius, planet.rings.outerRadius, 64);
			const ringMaterial = new THREE.MeshBasicMaterial({
				color: planet.rings.color,
				transparent: true,
				opacity: 0.7,
				side: THREE.DoubleSide
			});
			const ring = new THREE.Mesh(ringGeometry, ringMaterial);
			ring.rotation.x = Math.PI / 2;
			planetGroup.add(ring);
		}

		//Set initial position
		const angle = Math.random() * Math.PI * 2;
		planetGroup.position.x = Math.cos(angle) * planet.distance;
		planetGroup.position.z = Math.sin(angle) * planet.distance;

		//Store planet
		planets.push({
			group: planetGroup,
			mesh: planetMesh,
			data: planet,
			angle: angle,
			layers: [],
			layerVisible: false
		});
	});

	return { planets, orbitLines };
}

//Enhanced createPlanetLayers function with proper exploded view
function createPlanetLayers(planetObject) {
  //Remove any existing layers
  planetObject.layers.forEach(layer => {
    planetObject.group.remove(layer);
  });
  planetObject.layers = [];

  if (planetObject.layerVisible) {
    //Hide the original planet mesh
    planetObject.mesh.visible = false;

    //Create a group to hold all layer components
    const layersGroup = new THREE.Group();
    planetObject.group.add(layersGroup);
    planetObject.layers.push(layersGroup);

    //Get layer data
    const layersData = planetObject.data.layers;
    
    //Create the intact half of the planet
    const intactGroup = new THREE.Group();
    intactGroup.position.x = planetObject.data.radius * 0.5; //Offset to the right
    layersGroup.add(intactGroup);
    
    //Create the exploded half of the planet
    const explodedGroup = new THREE.Group();
    explodedGroup.position.x = -planetObject.data.radius * 0.5; //Offset to the left
    layersGroup.add(explodedGroup);
    
    //Create each layer of the planet
    for (let i = 0; i < layersData.length; i++) {
      const layer = layersData[i];
      const layerRadius = planetObject.data.radius * layer.radius;
      
      //Calculate explode offset - innermost layers move furthest
      const explodeOffset = (layersData.length - i) * (planetObject.data.radius * 0.25);
      
      //Create the intact half-sphere on the right
      createHalfSphere(
        layerRadius,
        layer.color,
        intactGroup, 
        true, //right half
        0 //no offset
      );
      
      //Create the exploded half-sphere on the left
      createHalfSphere(
        layerRadius,
        layer.color,
        explodedGroup, 
        false, //left half
        explodeOffset //apply offset
      );
      
      //Add label for the exploded view
      addLayerLabel(
        explodedGroup,
        layer.name, 
        layerRadius, 
        explodeOffset, 
        i, 
        layersData.length
      );
    }
    
    //Add 3D text label with planet information nearby
    add3DInfoDisplay(planetObject);
  } else {
    //If layers not visible, show the regular planet
    planetObject.mesh.visible = true;
  }
}

//Helper function to create half sphere for planet layers
function createHalfSphere(radius, color, parent, isRightHalf, offset) {
  //Create full sphere geometry
  const sphereGeometry = new THREE.SphereGeometry(radius, 32, 32);
  const sphereMaterial = new THREE.MeshStandardMaterial({
    color: color,
    metalness: 0.2,
    roughness: 0.7,
    side: THREE.DoubleSide
  });
  
  //Create the full sphere
  const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
  
  //Apply clipping plane to create half-sphere
  const localPlane = new THREE.Plane(new THREE.Vector3(isRightHalf ? -1 : 1, 0, 0), 0);
  sphereMaterial.clippingPlanes = [localPlane];
  
  //Apply offset for exploded view - negative X for left half
  if (!isRightHalf) {
    sphere.position.x = -offset;
  }
  
  parent.add(sphere);
  return sphere;
}

//Helper function to add labels to layers
function addLayerLabel(parent, layerName, layerRadius, offset, index, totalLayers) {
  //Create canvas for the label
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  canvas.width = 256;
  canvas.height = 64;

  //Style the label
  ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  //Add border
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.8)';
  ctx.lineWidth = 2;
  ctx.strokeRect(2, 2, canvas.width - 4, canvas.height - 4);

  //Add text
  ctx.font = 'bold 24px Arial';
  ctx.fillStyle = 'white';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(layerName, canvas.width / 2, canvas.height / 2);

  //Create texture and sprite
  const texture = new THREE.CanvasTexture(canvas);
  const spriteMaterial = new THREE.SpriteMaterial({
    map: texture,
    transparent: true
  });

  const sprite = new THREE.Sprite(spriteMaterial);

  //Position the label
  const labelOffset = layerRadius * 1.5;
  const verticalPosition = (totalLayers - index) * 0.8 - (totalLayers * 0.4);
  
  sprite.position.set(
    -offset - labelOffset,  //X position (further left of layer)
    verticalPosition,  //Y position (stacked vertically)
    0
  );
  sprite.scale.set(4, 1, 1);
  parent.add(sprite);

  //Add connecting line between layer and label
  const lineGeometry = new THREE.BufferGeometry().setFromPoints([
    new THREE.Vector3(-offset, 0, 0),
    new THREE.Vector3(-offset - labelOffset + 1, verticalPosition, 0)
  ]);

  const lineMaterial = new THREE.LineBasicMaterial({
    color: 0xffffff,
    transparent: true,
    opacity: 0.7
  });

  const line = new THREE.Line(lineGeometry, lineMaterial);
  parent.add(line);
}

//Create 3D text information display near the planet
function add3DInfoDisplay(planetObject) {
  const planet = planetObject.data;
  
  //Create a group for the info display
  const infoGroup = new THREE.Group();
  infoGroup.position.set(
    planet.radius * 3,  //Position to the right
    planet.radius * 2,  //Position above
    0
  );
  planetObject.group.add(infoGroup);
  planetObject.layers.push(infoGroup);  //Track for removal
  
  //Load font for 3D text
  const fontLoader = new FontLoader();
  fontLoader.load('https://threejs.org/examples/fonts/helvetiker_bold.typeface.json', function(font) {
    //Create title text
    createTextMesh(font, planet.name, 0, 0, 0, 0xffff00, 0.7);
    
    //Create info texts
    createTextMesh(font, `Mass: ${planet.mass}`, 0, -0.8, 0, 0xffffff, 0.4);
    createTextMesh(font, `Radius: ${(planet.radius * 6371).toLocaleString()} km`, 0, -1.4, 0, 0xffffff, 0.4);
    createTextMesh(font, `Distance: ${(planet.distance * 7.5).toLocaleString()} million km`, 0, -2.0, 0, 0xffffff, 0.4);
    
    //Add a short description text
    const lines = wordWrap(planet.info, 30);
    lines.forEach((line, index) => {
      createTextMesh(font, line, 0, -2.8 - (index * 0.6), 0, 0xcccccc, 0.35);
    });
  });
  
  //Helper to create 3D text mesh
  function createTextMesh(font, text, x, y, z, color, size) {
    const textGeometry = new TextGeometry(text, {
      font: font,
      size: size || 0.5,
      height: 0.05,
      curveSegments: 12,
      bevelEnabled: false
    });
    
    //Center text horizontally
    textGeometry.computeBoundingBox();
    const textWidth = textGeometry.boundingBox.max.x - textGeometry.boundingBox.min.x;
    
    const textMaterial = new THREE.MeshBasicMaterial({ color: color });
    const textMesh = new THREE.Mesh(textGeometry, textMaterial);
    textMesh.position.set(x - textWidth/2, y, z);
    
    infoGroup.add(textMesh);
    return textMesh;
  }
  
  //Add backdrop panel for text
  const panelWidth = planet.radius * 6;
  const panelHeight = planet.radius * 6;
  const panelGeometry = new THREE.PlaneGeometry(panelWidth, panelHeight);
  const panelMaterial = new THREE.MeshBasicMaterial({
    color: 0x000000,
    transparent: true,
    opacity: 0.7,
    side: THREE.DoubleSide
  });
  
  const panel = new THREE.Mesh(panelGeometry, panelMaterial);
  panel.position.z = -0.1;  //Slightly behind text
  
  //Add border
  const borderGeometry = new THREE.EdgesGeometry(panelGeometry);
  const borderMaterial = new THREE.LineBasicMaterial({
    color: 0x4488ff,
    transparent: true,
    opacity: 0.8
  });
  
  const border = new THREE.LineSegments(borderGeometry, borderMaterial);
  panel.add(border);
  
  infoGroup.add(panel);
  
  //Make info display always face the camera
  infoGroup.userData.faceCamera = true;
  
  return infoGroup;
}

//Helper function for word wrapping text
function wordWrap(text, maxCharsPerLine) {
  const words = text.split(' ');
  const lines = [];
  let currentLine = '';
  
  words.forEach(word => {
    if ((currentLine + word).length > maxCharsPerLine) {
      lines.push(currentLine);
      currentLine = word + ' ';
    } else {
      currentLine += word + ' ';
    }
  });
  
  if (currentLine.length > 0) {
    lines.push(currentLine);
  }
  
  return lines;
}

//Make sure to initialize the renderer with stencil capability
function initRenderer() {
	renderer = new THREE.WebGLRenderer({
	  antialias: true,
	  stencil: true,
	  alpha: true
	});
	renderer.setPixelRatio(window.devicePixelRatio);
	renderer.setSize(window.innerWidth, window.innerHeight);
	renderer.shadowMap.enabled = true;
	renderer.localClippingEnabled = true; //Enable clipping planes for the exploded view
	document.body.appendChild(renderer.domElement);
  }
  
  //Modify onMouseClick to improve camera positioning
  function onMouseClick(event) {
	//Calculate mouse position in normalized device coordinates
	mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
	mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
  
	//Update the raycaster
	raycaster.setFromCamera(mouse, camera);
  
	//Calculate objects intersecting the picking ray
	const intersects = raycaster.intersectObjects(
	  planetsAndSystem.planets.map(planet => planet.mesh),
	  true
	);
  
	if (intersects.length > 0) {
	  //Find which planet was clicked
	  const clickedPlanet = planetsAndSystem.planets.find(
		planet => intersects[0].object === planet.mesh || 
				  planet.group.children.includes(intersects[0].object)
	  );
  
	  if (clickedPlanet) {
		//If clicking on the same planet, toggle its layers
		if (selectedPlanet === clickedPlanet) {
		  clickedPlanet.layerVisible = !clickedPlanet.layerVisible;
		  createPlanetLayers(clickedPlanet);
		} else {
		  //Hide previous planet layers if another planet was selected
		  if (selectedPlanet) {
			selectedPlanet.layerVisible = false;
			createPlanetLayers(selectedPlanet);
		  }
  
		  //Set the new selected planet
		  selectedPlanet = clickedPlanet;
  
		  //Calculate camera positioning to view the planet clearly
		  //Position camera to see both intact and exploded views
		  const planetRadius = selectedPlanet.data.radius;
		  cameraOffset = new THREE.Vector3(
			planetRadius * 3,        //Further back to see exploded view
			planetRadius * 2,        //Slightly above
			planetRadius * 5         //To the side for better perspective
		  );
  
		  //Start camera transition
		  startCameraTransition(selectedPlanet);
  
		  //Show planet layers
		  selectedPlanet.layerVisible = true;
		  createPlanetLayers(selectedPlanet);
  
		  //Hide HTML info panel since we're now using 3D text
		  window.hidePlanetInfo();
		}
	  }
	} else {
	  //Reset view when clicking on space
	  if (selectedPlanet) {
		startCameraTransition(null);
  
		//Hide all planet layers
		planetsAndSystem.planets.forEach(planet => {
		  planet.layerVisible = false;
		  createPlanetLayers(planet);
		});
  
		//Clear selected planet
		selectedPlanet = null;
	  }
	}
  }
  
  //Update camera and info displays during animation
  function updateCameraAndInfo() {
	//Update camera following selected planet
	if (selectedPlanet && !cameraIsTransitioning) {
	  //Update camera target to follow the planet
	  controls.target.copy(selectedPlanet.group.position);
	  
	  //Calculate and update camera position to maintain relative position
	  const planetPos = selectedPlanet.group.position.clone();
	  
	  //Get current camera direction (normalized)
	  const cameraDir = new THREE.Vector3();
	  camera.getWorldDirection(cameraDir);
	  cameraDir.y = 0;
	  cameraDir.normalize();
	  
	  //Calculate position based on planet position and offset
	  const newPos = planetPos.clone().add(
		new THREE.Vector3(
		  cameraOffset.x * cameraDir.z,
		  cameraOffset.y,
		  cameraOffset.z * cameraDir.x
		)
	  );
	  
	  camera.position.copy(newPos);
	  
	  //Update any info display that needs to face camera
	  selectedPlanet.layers.forEach(layer => {
		if (layer.userData && layer.userData.faceCamera) {
		  layer.lookAt(camera.position);
		}
	  });
	}
  }
  
  //Update the startCameraTransition function for smoother transitions
  function startCameraTransition(targetPlanet) {
	//Store current camera state as the starting point
	cameraTransitionStart = {
	  position: camera.position.clone(),
	  target: controls.target.clone()
	};
  
	if (targetPlanet) {
	  //Calculate the target position for the camera
	  const targetPosition = targetPlanet.group.position.clone();
	  const planetRadius = targetPlanet.data.radius;
  
	  //Calculate appropriate distance based on planet size
	  const distanceFactor = Math.max(3, Math.min(8, 15 / planetRadius));
	  
	  //Set the end point for the transition - position camera for good view of exploded layers
	  cameraTransitionEnd = {
		position: new THREE.Vector3(
		  targetPosition.x + cameraOffset.x,
		  targetPosition.y + cameraOffset.y,
		  targetPosition.z + cameraOffset.z
		),
		target: targetPosition.clone()
	  };
	} else {
	  //Set the end point as the initial camera position when returning to solar system view
	  cameraTransitionEnd = {
		position: initialCameraPosition.clone(),
		target: initialControlsTarget.clone()
	  };
	}
  
	//Start the transition
	cameraTransitionStartTime = Date.now();
	cameraIsTransitioning = true;
  }
  
  //Enhanced camera transition with smoother easing
  function updateCameraTransition() {
	if (!cameraIsTransitioning) return;
  
	const currentTime = Date.now();
	const elapsed = currentTime - cameraTransitionStartTime;
  
	//Calculate progress (0 to 1)
	let progress = Math.min(elapsed / cameraTransitionDuration, 1);
  
	//Apply easing function (cubic ease-in-out) for smoother transition
	progress = progress < 0.5
	  ? 4 * progress * progress * progress
	  : 1 - Math.pow(-2 * progress + 2, 3) / 2;
  
	//Interpolate camera position and target
	camera.position.lerpVectors(
	  cameraTransitionStart.position,
	  cameraTransitionEnd.position,
	  progress
	);
  
	controls.target.lerpVectors(
	  cameraTransitionStart.target,
	  cameraTransitionEnd.target,
	  progress
	);
  
	controls.update();
  
	//Check if transition is complete
	if (progress >= 1) {
	  cameraIsTransitioning = false;
  
	  //If a planet is selected, ensure it's properly displayed
	  if (selectedPlanet) {
		//Make sure the layers are displayed after completing the transition
		if (!selectedPlanet.layerVisible) {
		  selectedPlanet.layerVisible = true;
		  createPlanetLayers(selectedPlanet);
		}
	  }
	}
  }
  
  //Handle window resize
  function onWindowResize() {
	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();
	renderer.setSize(window.innerWidth, window.innerHeight);
  }
  
  //Raycaster for planet selection
  const raycaster = new THREE.Raycaster();
  const mouse = new THREE.Vector2();
  
  //Track the currently selected planet
  let selectedPlanet = null;
  let cameraTransitionStart = null;
  let cameraTransitionEnd = null;
  let cameraTransitionDuration = 2000; //2 seconds
  let cameraIsTransitioning = false;
  let initialCameraPosition = new THREE.Vector3(0, 30, 50);
  let initialControlsTarget = new THREE.Vector3(0, 0, 0);
  let cameraOffset = new THREE.Vector3();
  let cameraTransitionStartTime = 0;
  let infoPanel = null;
  
  //Initialize the scene
  createStars();
  createGalaxy();
  const sun = createSun();
  const asteroidBelt = createAsteroidBelt();
  const planetsAndSystem = createPlanets();
  
  //Store initial camera position for resets
  initialCameraPosition.copy(camera.position);
  initialControlsTarget.copy(controls.target);
  
  //Add event listeners
  window.addEventListener('click', onMouseClick, false);
  window.addEventListener('resize', onWindowResize, false);
  
  //Animation loop
  function animate() {
	requestAnimationFrame(animate);
  
	//Update camera transitions
	updateCameraTransition();
	
	//Update camera following and info displays
	updateCameraAndInfo();
  
	//Update controls
	controls.update();
  
	//Animate sun
	const time = Date.now() * 0.001;
	sun.rotation.y += 0.001;
  
	//Call custom animation if available
	if (sun.userData && sun.userData.animate) {
	  sun.userData.animate(time);
	}
  
	//Update planet positions
	planetsAndSystem.planets.forEach(planet => {
	  //Update planet angle based on orbit speed
	  planet.angle += planet.data.orbitSpeed;
  
	  //Update position in orbit
	  planet.group.position.x = Math.cos(planet.angle) * planet.data.distance;
	  planet.group.position.z = Math.sin(planet.angle) * planet.data.distance;
  
	  //Rotate planet
	  planet.mesh.rotation.y += planet.data.rotationSpeed;
  
	  //Rotate layers if visible (for a more dynamic appearance)
	  if (planet.layerVisible) {
		planet.layers.forEach(layer => {
		  if (layer.rotation) {
			layer.rotation.y += planet.data.rotationSpeed * 0.5;
		  }
		});
	  }
	});
  
	//Update asteroid belt rotation
	asteroidBelt.rotation.y += 0.0005;
  
	renderer.render(scene, camera);
  }
  
  //Start the animation loop
  animate();