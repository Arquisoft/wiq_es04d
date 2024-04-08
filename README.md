# WIQ ¿A qué estás esperando?

[![Desplegar en lanzamiento](https://github.com/Arquisoft/wiq_es04d/actions/workflows/release.yml/badge.svg)](https://github.com/Arquisoft/wiq_es04d/actions/workflows/release.yml)
[![Estado de la Puerta de Calidad](https://sonarcloud.io/api/project_badges/measure?project=Arquisoft_wiq_es04d&metric=alert_status)](https://sonarcloud.io/summary/new_code?id=Arquisoft_wiq_es04d)
[![Cobertura](https://sonarcloud.io/api/project_badges/measure?project=Arquisoft_wiq_es04d&metric=coverage)](https://sonarcloud.io/summary/new_code?id=Arquisoft_wiq_es04d)

Enlace: (http://20.77.40.187:3000/)

Equipo de Desarrollo
- Zohaib Aktar Kausar -> <a href="https://github.com/Verzidee"><img src="https://img.shields.io/badge/perfil-Verzidee-black"></a> 
- Yago Navajas González -> <a href="https://github.com/yagonavajas"><img src="https://img.shields.io/badge/perfil-yagonavajas-purple"></a> 
- Santiago Lopez Laso -> <a href="https://github.com/Santiago21112001"><img src="https://img.shields.io/badge/perfil-Santiago21112001-green"></a>

Estos son los componentes que componen la aplicación web.

- **Servicio de Gateway**. Servicio Express expuesto al público que actúa como un proxy hacia los servicios subyacentes.
- **Servicio de Usuarios**. Servicio Express encargado de registrar nuevos usuarios en el sistema.
- **Servicio de Autenticación**. Servicio Express que se ocupa de verificar la identidad de los usuarios.
- **Servicio de Historial**. Servicio Express que gestiona los registros de juegos jugados por los usuarios.
- **Servicio de Preguntas**. Servicio Express que se encarga de la generación de preguntas y de realizar consultas a la API de Wikidata.
- **Aplicación Web**. Aplicación web desarrollada en React que interactúa con el Servicio Gateway para ofrecer funcionalidades de inicio de sesión, registro de nuevos usuarios, la posibilidad de jugar y la opción de revisar las estadísticas de juegos anteriores.

La arquitectura de la aplicación está compuesta por microservicios. Cada servicio utiliza una base de datos diferente.

## Guía rápida para empezar

### Usando docker

La forma más rápida de lanzar este proyecto de ejemplo es usando docker. Solo clona el proyecto:

```sh
git clone https://github.com/Arquisoft/wiq_es04d.git
```

y lánzalo con docker compose:

```sh
docker compose --profile dev up --build
```

y detenlo con:

```sh
docker compose --profile dev down
```

### Iniciando componente por componente

Primero, inicia la base de datos. Instala y ejecuta Mongo o ejecútalo usando docker:

```docker run -d -p 27017:27017 --name=my-mongo mongo:latest```

También puedes usar servicios como Mongo Atlas para ejecutar una base de datos Mongo en la nube.

Ahora, lanza los servicios de autenticación, usuario y puerta de enlace. Solo ve a cada directorio y ejecuta `npm install` seguido de `npm start`.

Por último, ve al directorio de la aplicación web y lanza este componente con `npm install` seguido de `npm start`.

Después de que todos los componentes se hayan lanzado, la aplicación debería estar disponible en localhost en el puerto 3000.

## Despliegue

Para el despliegue, tenemos varias opciones.

La primera y más flexible es desplegar en una máquina virtual usando SSH. Esto funcionará con cualquier servicio en la nube (o con nuestro propio servidor).

Otras opciones incluyen usar los servicios de contenedores que la mayoría de los servicios en la nube proporcionan. Esto significa, desplegar nuestros contenedores de Docker directamente.

Vamos a usar el primer enfoque, creando una máquina virtual en un servicio en la nube y después de instalar docker y docker-compose, desplegar nuestros contenedores allí usando GitHub Actions y SSH.

### Requisitos de la máquina para el despliegue

La máquina para el despliegue se puede crear en servicios como Microsoft Azure o Amazon AWS. En general, estos son los ajustes que debe tener:

- Máquina Linux con Ubuntu > 20.

04.
- Docker y docker-compose instalados.
- Puertos abiertos para las aplicaciones instaladas (en este caso, puertos 3000 para la aplicación web y 8000 para el servicio de puerta de enlace).

Una vez que hayas creado la máquina virtual, puedes instalar **docker** y **docker-compose** usando las siguientes instrucciones:

```ssh
sudo apt update
sudo apt install apt-transport-https ca-certificates curl software-properties-common
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo apt-key add -
sudo add-apt-repository "deb [arch=amd64] https://download.docker.com/linux/ubuntu focal stable"
sudo apt update
sudo apt install docker-ce
sudo usermod -aG docker ${USER}
sudo curl -L "https://github.com/docker/compose/releases/download/1.28.5/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose
```

### Entrega continua (GitHub Actions)

Una vez que tenemos nuestra máquina lista, podríamos desplegar manualmente la aplicación, llevando nuestro archivo docker-compose y ejecutándolo en la máquina remota.

En este repositorio, este proceso se hace automáticamente usando **GitHub Actions**. La idea es desencadenar una serie de acciones cuando se cumple alguna condición en el repositorio.

Como puedes ver, las pruebas unitarias de cada módulo y las pruebas e2e se ejecutan antes de subir las imágenes de docker y desplegarlas. Usando este enfoque evitamos desplegar versiones que no pasan las pruebas.

La acción de despliegue es la siguiente:

```yml
deploy:
    name: Desplegar a través de SSH
    runs-on: ubuntu-latest
    needs: [docker-push-userservice,docker-push-authservice,docker-push-gatewayservice,docker-push-webapp]
    steps:
    - name: Desplegar a través de SSH
      uses: fifsky/ssh-action@master
      with:
        host: ${{ secrets.DEPLOY_HOST }}
        user: ${{ secrets.DEPLOY_USER }}
        key: ${{ secrets.DEPLOY_KEY }}
        command: |
          wget https://raw.githubusercontent.com/arquisoft/wiq_es04d/master/docker-compose.yml -O docker-compose.yml
          wget https://raw.githubusercontent.com/arquisoft/wiq_es04d/master/.env -O .env
          docker compose --profile prod down
          docker compose --profile prod up -d --pull always
```

Esta acción utiliza tres secretos que deben configurarse en el repositorio:
- DEPLOY_HOST: IP de la máquina remota.
- DEPLOY_USER: usuario con permiso para ejecutar los comandos en la máquina remota.
- DEPLOY_KEY: clave para autenticar al usuario en la máquina remota.

Nota que esta acción inicia sesión en la máquina remota, descarga el archivo docker-compose del repositorio y lo lanza.
Obviamente, previamente se han ejecutado acciones que han subido las imágenes de docker al repositorio de GitHub Packages.

Este es un repositorio para el [curso de Arquitectura de Software](http://arquisoft.github.io/) en la [edición 2023/2024](https://arquisoft.github.io/course2324.html).
