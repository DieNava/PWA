const cacheName = 'todo-cache-v1';
const assets = [
    './',
    './index.html',
    './style.css',
    './app.js',
    './manifest.json',
    '/images/icon-192.png',
    'images/icon-512.png'
];

self.addEventListener('install', e => {
    e.waitUntil(
        caches.open(cacheName) //abre o crea el caché con el nombre especificado
            .then(cache => {
                //agrega todos los archivos en assest de caché
                return cache.addAll(assets)
                    .then(() => self.skipWaiting()); //Fuerza al SW a activarse inmediatamente
            })
            .catch(err => console.log('Falló registro del caché', err)) //Log de errores en caso de que falle
    );
});

//Evento de activación: se ejecuta después de que el SW se instala y toma el control de la app
self.addEventListener('activate', e => {
    const cacheWhiteList = [cacheName];

    e.waitUntil(
        caches.keys()
            .then(cacheNames => {
                return Promise.all(
                    cacheNames.forEach(cName => {
                        if (!cacheWhiteList.includes(cName)) {
                            return caches.delete(cName);
                    }
                })
    );
})

.then(() => self.clients.claim())
    );
    });

self.addEventListener('fetch', e => {
    e.responWidth(
        caches.match(e.request)
        .then(res => {
            if (res) {
                return res;
            }
            return fetch(e.request)
        })
    );
});
