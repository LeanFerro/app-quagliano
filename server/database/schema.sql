DROP SCHEMA IF EXISTS app; CREATE SCHEMA app;
USE app;

DROP TABLE IF EXISTS usuarios; CREATE TABLE usuarios (
  id_usuario bigint NOT NULL AUTO_INCREMENT,
  correo varchar(150) NOT NULL, 
  secreto varchar(45) NOT NULL,
  estado varchar(45) NOT NULL DEFAULT 'activo',
  role varchar(45) NOT NULL DEFAULT 'usuario',
  fecha_creacion datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  id_grupo bigint NOT NULL,
  PRIMARY KEY (id_usuario),
  FOREIGN KEY (id_grupo) REFERENCES grupos(id_grupo)
);

DROP TABLE IF EXISTS clientes; CREATE TABLE clientes (
  id_cliente bigint NOT NULL AUTO_INCREMENT,
  cuit bigint NOT NULL,
  nombre varchar(300) NOT NULL,
  aclaracion varchar(300),
  PRIMARY KEY (id_cliente)
);

DROP TABLE IF EXISTS marcas; CREATE TABLE marcas (
  id_marca bigint NOT NULL AUTO_INCREMENT,
  nombre varchar(300) NOT NULL,
  acta bigint NOT NULL,
  resolucion bigint NOT NULL,
  vencimiento timestamp NOT NULL,
  vencimiento_du timestamp NOT NULL,
  PRIMARY KEY (id_marca)
);

DROP TABLE IF EXISTS clientes_marcas; CREATE TABLE clientes_marcas (
  id_cliente_marca bigint NOT NULL AUTO_INCREMENT,
  id_cliente bigint NOT NULL,
  id_marca bigint NOT NULL,
  PRIMARY KEY (id_cliente_marca)
);

CREATE UNIQUE INDEX resolucion_index ON marcas(resolucion);
CREATE UNIQUE INDEX acta_index ON marcas(acta);
CREATE UNIQUE INDEX cuit_index ON grupos(cuit);
CREATE UNIQUE INDEX cuit_index ON clientes(cuit);
