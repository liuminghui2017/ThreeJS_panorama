var camera, scene, renderer;

var texture_placeholder,
	isUserInteracting = false,
	autoAnimate = false,
	onMouseDownMouseX = 0, onMouseDownMouseY = 0,
	lon = 90, onMouseDownLon = 0,
	lat = 0, onMouseDownLat = 0,
	phi = 0, theta = 0,
	target = new THREE.Vector3();

init()
animate()

function init() {
	var container = document.getElementById('container');
	// 初始化相机
	camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 1100);
	// 初始化场景
	scene = new THREE.Scene();
	// 创建贴图占位
	texture_placeholder = document.createElement('canvas');
	texture_placeholder.width = 128;
	texture_placeholder.height = 128;

	var context = texture_placeholder.getContext('2d');
	context.fillStyle = 'rgb( 200, 200, 200 )';
	context.fillRect(0, 0, texture_placeholder.width, texture_placeholder.height);

	// 下载贴图
	var material = loadTexture('./timg.jpg')
	// 创建几何体
	var geometry = new THREE.SphereGeometry(500, 60, 40);
	geometry.scale(- 1, 1, 1);
	// 贴图
	var mesh = new THREE.Mesh(geometry, material)
	// 添加到场景
	scene.add(mesh)
	// 初始化渲染器
	renderer = new THREE.WebGLRenderer();
	renderer.setPixelRatio(window.devicePixelRatio);
	renderer.setSize(window.innerWidth, window.innerHeight);
	container.appendChild(renderer.domElement);

	// 监听触摸事件
	document.addEventListener('touchstart', onDocumentTouchStart, false);
	document.addEventListener('touchmove', onDocumentTouchMove, false);
	document.addEventListener('touchend', onDocumentTouchEnd, false);
	window.addEventListener( 'resize', onWindowResize, false );
}

// 下载贴图
function loadTexture(path) {

	var texture = new THREE.Texture(texture_placeholder);
	var material = new THREE.MeshBasicMaterial({ map: texture, overdraw: 0.5 });

	var image = new Image();
	image.onload = function () {

		texture.image = this;
		texture.needsUpdate = true;

	};
	image.src = path;

	return material;

}

// 监听窗口大小调整事件
function onWindowResize() {
	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();
	renderer.setSize( window.innerWidth, window.innerHeight );
}

// 监听触摸开始事件
function onDocumentTouchStart(event) {
	isUserInteracting = true;
	if (event.touches.length == 1) {
		event.preventDefault();
		onPointerDownPointerX = event.touches[0].pageX;
		onPointerDownPointerY = event.touches[0].pageY;

		onPointerDownLon = lon;
		onPointerDownLat = lat;
	}
}

// 监听触摸滑动事件
function onDocumentTouchMove(event) {
	if (event.touches.length == 1) {
		event.preventDefault();
		lon = (onPointerDownPointerX - event.touches[0].pageX) * 0.1 + onPointerDownLon;
		lat = (event.touches[0].pageY - onPointerDownPointerY) * 0.1 + onPointerDownLat;
	}
}

// 监听触摸滑动事件
function onDocumentTouchEnd(event) {
	isUserInteracting = false;
}

// 绘制循环
function animate() {
	requestAnimationFrame(animate);
	update();
}

// 刷新函数
function update() {
	if ( isUserInteracting === false && autoAnimate === true ) {
		lon += 0.1;
	}
	lat = Math.max(- 85, Math.min(85, lat));
	phi = THREE.Math.degToRad(90 - lat);
	theta = THREE.Math.degToRad(lon);

	target.x = 500 * Math.sin(phi) * Math.cos(theta);
	target.y = 500 * Math.cos(phi);
	target.z = 500 * Math.sin(phi) * Math.sin(theta);

	camera.lookAt(target);

	renderer.render(scene, camera);
}