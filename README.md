<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

# Ejecutar en desarrollo

1. Clonar el repositorio
2. Ejecutar el comando:

```
npm install
```

3. Tener Nest CLI Instalado
```
npm - g @nest/cli
```

4. Levantar la base de datos
```
docker-compose up -d
```
5. Clonar el archivo ___.env.template___ y renombrar la copia a ___.env___ 

6. llenar las variables de entorno definidas en el ``` .env ```

8. Ejecutar la app de desarrollo en dev:
```
npm run start:dev
```

7. Reconstruir la base de datos con la semilla
```
localhost:3000/api/v2/seed
```

## Stack usado
* MongoDB
* Nest