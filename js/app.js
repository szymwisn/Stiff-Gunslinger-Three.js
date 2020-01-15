let renderer, scene, camera, group;
let mouseX = 0;
let mouseY = 0;

let skull, leftColt, rightColt, leftEye, rightEye;
let smokeParticles = [];

function init() {
    renderer = new THREE.WebGLRenderer({
        alpha: true
    });

    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);

    document.body.appendChild(renderer.domElement);

    camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 1000);
    camera.position.set(0, 0, 45);
    camera.updateProjectionMatrix();

    scene = new THREE.Scene();

    const light = new THREE.SpotLight(0x6042f5, 0.5);
    light.position.set(-51, -20, 51);
    scene.add(light);

    group = new THREE.Group();
    group.position.x = 2;

    const pointLight = new THREE.PointLight(0x124589, 1);
    pointLight.position.set(-2, -20, 20.);
    scene.add(pointLight);

    const pointLight2 = new THREE.PointLight(0xD01D44, 0.5);
    pointLight2.position.set(20, 10, 15);
    scene.add(pointLight2);

    const objLoader = new THREE.OBJLoader();

    objLoader.load('/models/skull.obj', skull => {
        skull.position.y = 1;
        skull.scale.y = skull.scale.z = skull.scale.x = 8.0;
        group.add(skull);
    });

    objLoader.load('/models/colt.obj', colt => {
        colt.position.set(8, -10, 5);
        colt.rotation.set(0, Math.PI, 0);
        colt.scale.y = colt.scale.z = colt.scale.x = 1.8;
        rightColt = colt;
        group.add(colt);
    });

    objLoader.load('/models/colt.obj', colt => {
        colt.position.set(-12, 10, -15);
        colt.rotation.set(3 * Math.PI / 2, Math.PI, 0.5);
        colt.scale.y = colt.scale.z = colt.scale.x = 1.8;
        leftColt = colt;
        group.add(colt);
    });

    const textureLoader = new THREE.TextureLoader();

    const eyeTexture = textureLoader.load('models/eye-texture2.jpg');
    eyeTexture.offset.x = 0.25;

    const eyeGeometry = new THREE.SphereGeometry(1.3, 32, 32);

    const eyeMaterial = new THREE.MeshStandardMaterial({
        map: eyeTexture
    });

    eyeMaterial.shininess = 100;

    leftEye = new THREE.Mesh(eyeGeometry, eyeMaterial);
    leftEye.position.set(-2.3, 1.90, 4.5);
    group.add(leftEye);

    rightEye = new THREE.Mesh(eyeGeometry, eyeMaterial);
    rightEye.position.set(2.3, 1.9, 4.5);
    group.add(rightEye);

    scene.add(group);

    const smokeTexture = textureLoader.load('https://s3-us-west-2.amazonaws.com/s.cdpn.io/95637/Smoke-Element.png');

    const smokeMaterial = new THREE.MeshLambertMaterial({
        color: 0x44D061,
        map: smokeTexture,
        transparent: true
    });

    const smokeGeometry = new THREE.PlaneGeometry(200, 200);

    for (let i = 0; i < 70; i++) {
        let particle = new THREE.Mesh(smokeGeometry, smokeMaterial);
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
        group.rotation.y = mouseX * .1;
        group.rotation.x = mouseY * -.1;
    }

    if (rightEye && leftEye) {
        leftEye.rotation.y = rightEye.rotation.y = mouseX * .45;
        leftEye.rotation.x = rightEye.rotation.x = mouseY * -.45;
    }

    if (rightColt && leftColt) {
        leftColt.rotation.x = mouseY * .2;
        rightColt.rotation.x = mouseY * .2;
        rightColt.rotation.z = mouseX * .2;
    }

    for (let particle = 0; particle < smokeParticles.length; particle++) {
        smokeParticles[particle].rotation.z += 0.001;
    }

    render();
};

init();
animate();