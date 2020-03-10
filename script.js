var scene, camera, renderer, clock, deltaTime, totalTime;

var arToolkitSource, arToolkitContext;

var markerRoot1;
var objects;

var mesh1;

var mouse;

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
    renderer.setSize(640, 480);

    renderer.domElement.style.position = 'absolute'
    renderer.domElement.style.top = '0px'
    renderer.domElement.style.left = '0px'
    document.body.appendChild(renderer.domElement);

    // renderer.domElement.addEventListener('click', raycast, false);

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
    scene.add(markerRoot1);
    let markerControls1 = new THREEx.ArMarkerControls(arToolkitContext, markerRoot1, {
        type: 'pattern', patternUrl: "pattern-marker.patt",
    })


    let material1 = new THREE.MeshNormalMaterial({
        transparent: true,
        opacity: true,
        side: THREE.DoubleSide
    });
    const radius = 6;
    const height = 8;
    const segments = 16;
    const geometry = new THREE.ConeBufferGeometry(radius, height, segments);
    mesh1 = new THREE.Mesh(geometry, material1);
    mesh1.scale.set(0.04, 0.04, 0.04);
    mesh1.position.y = 1.7;
    mesh1.rotation.x = Math.PI;
    mesh1.name = "0";
    mesh1.visible = false;


    mesh2 = new THREE.Mesh(geometry, material1);
    mesh2.scale.set(0.04, 0.04, 0.04);
    mesh2.position.y = 1.7;
    mesh2.position.x = 1.2;
    mesh2.position.z = 1.2;
    mesh2.rotation.x = Math.PI;
    mesh2.name = "1";
    mesh2.visible = false;

    objects = new THREE.Object3D();
    objects.add(mesh1);
    objects.add(mesh2);

    markerRoot1.add(objects);
    var manager = new THREE.LoadingManager();

    var loader = new THREE.GLTFLoader(manager);


    //var dracoLoader = new THREE.DRACOLoader();
    //dracoLoader.setDecoderPath( '/js/threejs/libs/draco/' );
    //loader.setDRACOLoader( dracoLoader );
    var filename = "7.glb";

    loader.load(filename, function (s) {

        var object = s.scene;
        console.log("model loaded");

        //traverse gltf scene content

        var model = object.getObjectByName('Cube');

        console.log("--> traversing gltf scene");
        var index = 0;
        object.traverse(function (child) {

            console.log(index + " - " + child.name);
            index++;

        });
        object.scale.set(8, 8, 8);
        console.log("render once");
        markerRoot1.add(object);
        scene.add(markerRoot1);
        //  renderer.render( scene, camera );

    });

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
    update();
    render();

}

$(function () {
    $("#accordion").accordion({
        collapsible: true,
        active: false,
        activate: function () {
            var active = jQuery("#accordion").accordion('option', 'active');
            removeObject();
            if (active === false) {
                return
            } else {
                active = String(active);

                objects.traverse(function (obj) {

                    if (active === obj.name) {

                        addObject(obj);
                    } else {

                    }


                });

            }
        }
    });
});


function addObject(object) {
   // object.material.opacity = 0.5 + 0.5*Math.sin(new Date().getTime() * .0025);

    object.visible = true;

}

function removeObject() {

    objects.traverse(function (obj) {
        if (obj instanceof THREE.Mesh) {
            obj.visible = false;
        }
        ;
    });

}