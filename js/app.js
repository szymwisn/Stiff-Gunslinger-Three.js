let renderer, scene, camera, group, controls;
let mouseX = 0;
let mouseY = 0;

let skull, leftEye, rightEye;
let pointLights = [];
let smokeParticles = [];

init();
animate();

function init() {
    renderer = new THREE.WebGLRenderer({
        alpha: true
    });

    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);

    document.body.appendChild(renderer.domElement);

    camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 1000);
    camera.position.set(0, 0, 90);
    camera.updateProjectionMatrix();

    scene = new THREE.Scene();

    let light = new THREE.SpotLight(0x9042f5, .5);
    light.angle = 0.50;
    light.decay = 1;
    light.position.set(-50.56, -21.69, 50.41);
    scene.add(light);

    group = new THREE.Group();
    group.position.x = 2;

    let pointLight = new THREE.PointLight(0x6042f5, 3.1);
    pointLight.decay = 1;
    pointLight.position.set(-2.37, -18.15, 20.48);
    scene.add(pointLight);

    let sphere = new THREE.SphereGeometry(0.1, 16, 8);
    for (var i = 0; i <= 8; i++) {
        light = new THREE.PointLight(16726440, .8, 10);
        light.add(new THREE.Mesh(sphere, new THREE.MeshBasicMaterial({
            color: 16726440
        })));

        scene.add(light);
        pointLights.push(light);
    }

    const objLoader = new THREE.OBJLoader();

    objLoader.load('/models/skull.obj', skull => {
        skull.scale.y = skull.scale.z = skull.scale.x = 8.0;
        skull.rotation.y = 1.5;
        group.add(skull);
    });

    const textureLoader = new THREE.TextureLoader();

    let texture = textureLoader.load('models/eye-texture.jpg');

    let geometry = new THREE.SphereGeometry(1.3, 32, 32);
    let material = new THREE.MeshBasicMaterial({
        map: texture
    });

    leftEye = new THREE.Mesh(geometry, material);
    leftEye.position.set(-2.3, 0.90, 5.5);
    leftEye.rotation.set(20, 0, 0);

    rightEye = new THREE.Mesh(geometry, material);
    rightEye.position.set(2.3, 0.9, 5.5);

    group.add(leftEye);
    group.add(rightEye);

    scene.add(group);

    geometry = new THREE.CubeGeometry(100, 100, 100);

    material = new THREE.MeshLambertMaterial({
        color: 0xaa6666,
        wireframe: false
    });

    mesh = new THREE.Mesh(geometry, material);

    let smokeTexture = textureLoader.load('https://s3-us-west-2.amazonaws.com/s.cdpn.io/95637/Smoke-Element.png');

    let smokeMaterial = new THREE.MeshLambertMaterial({
        color: 0x44D061,
        map: smokeTexture,
        transparent: true
    });

    let smokeGeo = new THREE.PlaneGeometry(300, 300);

    for (let i = 0; i < 70; i++) {
        let particle = new THREE.Mesh(smokeGeo, smokeMaterial);
        particle.position.set(Math.random() * 500 - 250, Math.random() * 500 - 250, -50);
        particle.rotation.z = Math.random() * 360;
        scene.add(particle);
        smokeParticles.push(particle);
    }

    window.addEventListener('resize', onWindowResize, false);

    document.addEventListener('mousemove', onMouseMove, false);
};

function onMouseMove(event) {
    event.preventDefault();

    cursorX = event.clientX;
    mouseX = (event.clientX / window.innerWidth) * 2 - 1;
    mouseY = -(event.clientY / window.innerHeight) * 2 + 1;
};

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

function render() {
    renderer.render(scene, camera);
};

function animate() {

    requestAnimationFrame(animate);

    if (group) {
        group.rotation.y = mouseX * .2;
        group.rotation.x = mouseY * -.2;
    }

    if (rightEye && leftEye) {
        leftEye.rotation.y = rightEye.rotation.y = mouseX * .55;
        leftEye.rotation.x = rightEye.rotation.x = mouseY * -.55;
    }

    for (let particle = 0; particle < smokeParticles.length; particle++) {
        smokeParticles[particle].rotation.z += 0.001;
    }

    render();
};