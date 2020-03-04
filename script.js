var scene, camera, renderer, clock, deltaTime, totalTime;

var arToolkitSource, arToolkitContext;

var markerRoot1, markerRoot2;

var mesh1;

var mouse;
var objects = [];

raycaster = new THREE.Raycaster();
mouse = new THREE.Vector2();

initialize();

animate();

function initialize() {

    scene = new THREE.Scene();

    let ambientLight = new THREE.AmbientLight(0xcccccc, 0.5);
    scene.add(ambientLight);

    camera = new THREE.Camera();

    camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);

    scene.add(camera);

    renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true
    });
    renderer.setClearColor(new THREE.Color('lightgrey'), 0)
    renderer.setSize( 640, 480 );

    renderer.domElement.style.position = 'absolute'
    renderer.domElement.style.top = '0px'
    renderer.domElement.style.left = '0px'
    document.body.appendChild(renderer.domElement);

    renderer.domElement.addEventListener('click', raycast, false);

    ////////////////////////////////////////////////////////////
    // setup arToolkitSource
    ////////////////////////////////////////////////////////////

    arToolkitSource = new THREEx.ArToolkitSource({
        sourceType: 'webcam',
        // resolution of at which we initialize the source image
        sourceWidth: 640,
        sourceHeight: 480,
        // resolution displayed for the source
        displayWidth: 640,
        displayHeight: 480,
    });

    function onResize(el) {

        //camera.aspect = window.innerWidth / window.innerHeight;

        //renderer.setSize( window.innerWidth, window.innerHeight );

        arToolkitSource.onResizeElement()
        arToolkitSource.copyElementSizeTo(renderer.domElement)
        if (arToolkitContext.arController !== null) {
            arToolkitSource.copyElementSizeTo(arToolkitContext.arController.canvas)
        }
        //camera.updateProjectionMatrix();
    }

    arToolkitSource.init(function onReady() {
        onResize()
    });

    // handle resize event
    window.addEventListener('resize', onResize);

    ////////////////////////////////////////////////////////////
    // setup arToolkitContext
    ////////////////////////////////////////////////////////////

    // create atToolkitContext
    arToolkitContext = new THREEx.ArToolkitContext({
        cameraParametersUrl: 'camera_para.dat',
        detectionMode: 'mono',

    });

    // copy projection matrix to camera when initialization complete
    arToolkitContext.init(function onCompleted() {
        camera.projectionMatrix.copy(arToolkitContext.getProjectionMatrix());
    });

    ////////////////////////////////////////////////////////////
    // setup markerRoots
    ////////////////////////////////////////////////////////////

    // build markerControls
    markerRoot1 = new THREE.Group();
    let markerControls1 = new THREEx.ArMarkerControls(arToolkitContext, markerRoot1, {
        type: 'pattern', patternUrl: "pattern-marker.patt",
    })

    let geometry1	= new THREE.CubeGeometry(1,1,1);
    let material1	= new THREE.MeshNormalMaterial({
        transparent: true,
        opacity: 0.5,
        side: THREE.DoubleSide
    });

    mesh1 = new THREE.Mesh( geometry1, material1 );
    mesh1.position.y = 0.5;

    markerRoot1.add( mesh1 );
    scene.add(markerRoot1);


}

function raycast(e) {

    var rect = renderer.domElement.getBoundingClientRect();
    mouse.x = ((e.clientX - rect.left) / (rect.width - rect.left)) * 2 - 1;
    mouse.y = -((e.clientY - rect.top) / (rect.bottom - rect.top)) * 2 + 1;
    // Step 1: Detect light helper
    //1. sets the mouse position with a coordinate system where the center
    //   of the screen is the origin

    //2. set the picking ray from the camera position and mouse coordinates
    raycaster.setFromCamera(mouse, camera);

    //3. compute intersections (note the 2nd parameter)
    var intersects = raycaster.intersectObject(mesh1);
    var COLORS = [
        'pink',
        //'blue',
        'yellow',
        'red',
        'peachpuff',
        '#2EAFAC',
        '#BAE'];
    for (var i = 0; i < intersects.length; i++) {
        console.log(intersects[i]);
        var randomIndex = Math.floor(Math.random() * COLORS.length);
        var newColor = COLORS[randomIndex];
        intersects[i].object.material.color.setHex(newColor);

    }
}


function update() {
// update artoolkit on every frame
    if (arToolkitSource.ready !== false)
        arToolkitContext.update(arToolkitSource.domElement);

}


function render() {
    renderer.render(scene, camera);
}


function animate() {
    requestAnimationFrame(animate);
    //deltaTime = clock.getDelta();
    //totalTime += deltaTime;
    update();
    render();

}
