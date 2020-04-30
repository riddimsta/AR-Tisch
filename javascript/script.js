var scene, camera, renderer, clock, deltaTime, totalTime;
var arToolkitSource, arToolkitContext;
var markerRoot1;
var objects;
var model;

initialize();

function initialize() {

    scene = new THREE.Scene();

    var hemiLight = new THREE.HemisphereLight(0xffffff, 0x444444);
    hemiLight.position.set(0, 300, 0);
    scene.add(hemiLight);

    var dirLight = new THREE.DirectionalLight(0xffffff);
    dirLight.position.set(75, 300, -75);
    scene.add(dirLight);

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
        type: 'pattern', patternUrl: "pattern-marker1.patt", smooth: 'true',
    })

    var manager = new THREE.LoadingManager();

    var loader = new THREE.GLTFLoader(manager);

    var filename = "assets/images/lidice_model_test_neu.glb";

    loader.load(filename, function (s) {

        model = s.scene;
        console.log("model loaded");
        console.log("--> traversing gltf scene");
        var index = 0;
        model.traverse(function (child) {
            markerRoot1.add.child;
            console.log(index + " - " + child.name);
            index++;

            if (child.name == "##1" || child.name == "##2" || child.name == "##3" || child.name == "##4" ||
                child.name == "##5" || child.name == "##6" || child.name == "##7" || child.name == "##8") {
                child.visible = false;

/*                var newMaterial = new THREE.MeshBasicMaterial({color: 0x00ffff, side: THREE.DoubleSide});
                if (child.isMesh) {
                    console.log("guuuuuuuuuuuuut");
                    child.material = newMaterial;

                }*/
            }
        });
        //model.rotateY(3.14);
        model.scale.set(7, 7, 7);
        console.log("render once");

        markerRoot1.add(model);
        scene.add(markerRoot1);

        animate();

    });
}

function update() {
    // update artoolkit on every frame
    if (arToolkitSource.ready !== false)
        arToolkitContext.update(arToolkitSource.domElement);

    model.traverse(function (child) {
        if (child.name == "##1" || child.name == "##2" || child.name == "##3" || child.name == "##4" ||
            child.name == "##5" || child.name == "##6" || child.name == "##7" || child.name == "##8") {
            if (child.visible) {
                // child.rotation.y += 0.1;
                /*                while (child.position.y < 0.05) {
                                    child.position.y += 0.0001;
                                    //obj.rotateOnAxis(new THREE.Vector3(0,0,1), 90*Math.PI/180);
                                }*/
            }
        }
    });
}


function render() {
    requestAnimationFrame(render);
}


function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);

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
            console.log(active);
            if (active === false) {
                return
            } else {
                active = active + 1;
                active = String("##" + active);
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
        if (child.name == "##1" || child.name == "##2" || child.name == "##3" || child.name == "##4" ||
            child.name == "##5" || child.name == "##6" || child.name == "##7" || child.name == "##8") {
            child.visible = false;
        }
        ;
    });
}