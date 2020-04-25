var scene, camera, renderer, clock, deltaTime, totalTime;

var arToolkitSource, arToolkitContext;

var markerRoot1;
var objects;
var model;
var mesh1;
var neuesmesh;

var mouse;

raycaster = new THREE.Raycaster();
mouse = new THREE.Vector2();

initialize();


function initialize() {

    scene = new THREE.Scene();

    var hemiLight = new THREE.HemisphereLight(0xffffff, 0x444444);
    hemiLight.position.set(0, 300, 0);
    scene.add(hemiLight);

    var dirLight = new THREE.DirectionalLight(0xffffff);
    dirLight.position.set(75, 300, -75);
    scene.add(dirLight);


    camera = new THREE.Camera();

    camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 1000);

    scene.add(camera);

    renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true,
        logarithmicDepthBuffer: true,

    });
    renderer.setClearColor(new THREE.Color('lightgrey'), 0)
    renderer.setSize(window.innerWidth, window.innerHeight);

    renderer.domElement.style.position = 'absolute'
    renderer.domElement.style.top = '0px'
    renderer.domElement.style.left = '0px'
    renderer.gammaOutput = true;
    renderer.gammaFactor = 2;
    //renderer.physicallyCorrectLights=true;

    document.body.appendChild(renderer.domElement);

    ////////////////////////////////////////////////////////////
    // setup arToolkitSource
    ////////////////////////////////////////////////////////////

    arToolkitSource = new THREEx.ArToolkitSource({
        sourceType: 'webcam',
        // resolution of at which we initialize the source image
        sourceWidth: 640,
        sourceHeight: 480,
        // resolution displayed for the source
        displayWidth: window.innerWidth,
        displayHeight: window.innerHeight,
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
        type: 'pattern', patternUrl: "pattern-marker.patt", smooth: 'true',
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


    var filename = "assets/lidice_model.glb";

    loader.load(filename, function (s) {

        model = s.scene;
        console.log("model loaded");
        
            //traverse gltf scene content

            //var model = object.getObjectByName('Cube');
            //    var control = new TransformControls(camera, renderer.domElement);

            console.log("--> traversing gltf scene");
        var index = 0;
        model.traverse(function (child) {
            markerRoot1.add.child;

            // control.attach(child);


            console.log(index + " - " + child.name);
            index++;
            if (child.name == "#1" || child.name == "#2" || child.name == "#3" || child.name == "#4" ||
                child.name == "#5" || child.name == "#6" || child.name == "#7" || child.name == "#8") {

                child.visible = false;
            }
        });
        model.scale.set(7, 7, 7);
        console.log("render once");

        markerRoot1.add(model);
        scene.add(markerRoot1);

        animate();


        //  renderer.render( scene, camera );

    });
}

function update() {
    // update artoolkit on every frame
    if (arToolkitSource.ready !== false)
        arToolkitContext.update(arToolkitSource.domElement);


}


function render() {
    requestAnimationFrame(render);


}


function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
    /*        model.traverse(function (child) {
                if (child.name == "0#" || child.name == "1#" || child.name == "2#" || child.name == "3#" ||
                child.name == "4#" || child.name == "5#" || child.name == "6#" || child.name == "7#") {
                    if (child.visible) {
                        child.rotation.y += 1;
                        obj.rotateOnAxis(new THREE.Vector3(0,0,1), 90*Math.PI/180);
                    }
                }
            });*/
    update();
    render();

}


$(function () {
    var icons = {
        header: "ui-icon-circle-arrow-e",
        activeHeader: "ui-icon-circle-arrow-s"
    };
    $("#accordion").accordion({
        collapsible: true,
        active: false,
        icons: icons,
        heightStyle: "content",
        activate: function () {
            var active = jQuery("#accordion").accordion('option', 'active');
            removeObject();
            if (active === false) {
                return
            } else {
                active = active + 1;
                active = String("#" + active);
                model.traverse(function (obj) {
                    if (active === obj.name) {
                        obj.visible = true;
                    } else {
                    }
                });
            }
        }
    });
});

function removeObject() {

    model.traverse(function (child) {
        if (child.name == "#1" || child.name == "#2" || child.name == "#3" || child.name == "#4" ||
            child.name == "#5" || child.name == "#6" || child.name == "#7" || child.name == "#8") {
            child.visible = false;
        };
    });

}