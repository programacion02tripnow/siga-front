# CRM TripNow VueJS
Es el cliente en vue.js para el CRM de TripNow

## Configuración del Proyecto

Para poder levantar el proyecto localmente, asegúrate de seguir los siguientes pasos:

### 1. Instalación de dependencias

Ejecuta el siguiente comando para instalar todas las dependencias necesarias:

```bash
npm install
```

### 2. Configuración de variables de entorno
Crea un archivo .env en la raíz del proyecto y configura las siguientes variables de entorno:

```bash
VUE_APP_API_URL=http://localhost:8000
VUE_APP_CLIENT_ID=tu_id_del_cliente
VUE_APP_CLIENT_SECRET=tu_secret del cliente
```
Asegúrate de proporcionar los valores correctos para VUE_APP_API_URL, VUE_APP_CLIENT_ID y VUE_APP_CLIENT_SECRET.

#Levantar el proyecto
### Levantar el proyecto localmente
Para ejecutar el proyecto en el entorno de desarrollo local, utiliza el siguiente comando:
```bash
npm run serve
```

Esto levantará el proyecto y podrás acceder a él en tu navegador en http://localhost:8080 (o en el puerto que se indique en la terminal).

### Compilar y minificar para producción
Si deseas compilar el proyecto para producción, puedes ejecutar el siguiente comando:
```bash
npm run build
```
Esto generará una versión optimizada del proyecto en el directorio dist, listo para ser desplegado en un servidor web.


#Documentación
La documentación del proyecto está generada con Vue Styleguidist.
Asegúrate de revisar la documentación para obtener información detallada sobre los componentes, propiedades y ejemplos interactivos.
