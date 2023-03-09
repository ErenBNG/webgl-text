import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import gsap from 'gsap'
import * as lil from 'lil-gui'
import {FontLoader} from 'three/examples/jsm/loaders/FontLoader.js'
import { TextGeometry } from "three/examples/jsm/geometries/TextGeometry.js";
const image = new Image()
const textureLoader = new THREE.TextureLoader()
const colorTexture = textureLoader.load(    
    '/textures/minecraft.png',
    () => 
    {
        console.log('load')
    },
    () => 
    {
        console.log('progress')
    },
    () => 
    {
        console.log('error at line ')
    }
    )
image.onload = () =>{
    textures.needsUpdate = true
}
const matcapTexture = textureLoader.load('/textures/matcaps/3.png')
//Fonts
const fontLoader = new FontLoader()
fontLoader.load(
    '/textures/fonts/helvetiker_regular.typeface.json',
    (font) => 
    {
        const textGeometry = new TextGeometry(
            'Three.JS',
            {
                font,
                size: 0.5,
                height: 0.2,
                curveSegments: 5,
                bevelEnabled: true,
                bevelThickness: 0.03,
                bevelSize: 0.02,
                bevelOffset: 0,
                bevelSegments: 5
            }
        )
        textGeometry.computeBoundingBox()
        textGeometry.center()

        const textMaterial = new THREE.MeshMatcapMaterial({ matcap: matcapTexture})
        const text = new THREE.Mesh(textGeometry, textMaterial)
        scene.add(text)
        const donutGeometry = new THREE.TorusGeometry(0.3, 0.2, 20, 45)
        const donutMaterial = new THREE.MeshMatcapMaterial({ matcap: matcapTexture })
        
        for(let i = 0; i < 300; i++)
        {
        const donut = new THREE.Mesh(donutGeometry, donutMaterial)

        donut.position.x = (Math.random() - 0.5) * 10
        donut.position.y = (Math.random() - 0.5) * 10
        donut.position.z = (Math.random() - 0.5) * 10

        donut.rotation.x = Math.random() * Math.PI
        donut.rotation.y = Math.random() * Math.PI

        const scale = Math.random()
        donut.scale.set(scale, scale, scale)
        scene.add(donut)
        }
    }
)

const loadingManager = new THREE.LoadingManager()

loadingManager.onStart = () =>
{
    console.log('loading started')
}
loadingManager.onLoad = () =>
{
    console.log('loading finished')
}
loadingManager.onProgress = () =>
{
    console.log('loading progressing')
}
loadingManager.onError = () =>
{
    console.log('loading error')
}

const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

const texturePaths = [
    '/textures/door/environmentMaps/1/px.jpg',
    '/textures/door/environmentMaps/1/nx.jpg',
    '/textures/door/environmentMaps/1/py.jpg',
    '/textures/door/environmentMaps/1/ny.jpg',
    '/textures/door/environmentMaps/1/pz.jpg',
    '/textures/door/environmentMaps/1/nz.jpg'

]
const textures = new THREE.CubeTextureLoader().load(texturePaths)


const material = new THREE.MeshStandardMaterial()
material.metalness = 0.7
material.roughness = 0.2
material.side = THREE.DoubleSide
material.envMap = textures

const sphere = new THREE.Mesh(
    new THREE.SphereGeometry(0.5, 16, 16),
    material
)

sphere.position.x =  -1.5

const plane = new THREE.Mesh(
    new THREE.PlaneGeometry(1, 1),
    material
)

const torus = new THREE.Mesh(
    new THREE.TorusGeometry(0.3, 0.2, 16, 32),
    material
)

torus.position.x = 1.5


const ambientLight = new THREE.AmbientLight(0xffffff, 0.5)
scene.add(ambientLight)

const pointLight = new THREE.PointLight(0xffffff, 0.5)
pointLight.position.x = 2
pointLight.position.y = 2
pointLight.position.z = 2
scene.add(pointLight)


/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () =>
{
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.z = 3
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * Animate
 */
const clock = new THREE.Clock()

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()

    sphere.rotation.x = 0.1 * elapsedTime
    plane.rotation.x = 0.1 * elapsedTime
    torus.rotation.x = 0.1 * elapsedTime

    sphere.rotation.y = 0.1 * elapsedTime
    plane.rotation.y = 0.1 * elapsedTime
    torus.rotation.y = 0.1 * elapsedTime

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()

colorTexture.magFilter = THREE.NearestFilter