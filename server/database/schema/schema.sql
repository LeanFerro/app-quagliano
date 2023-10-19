DROP SCHEMA IF EXISTS quagliano_db; CREATE SCHEMA quagliano_db;
USE quagliano_db;

DROP TABLE IF EXISTS usuarios; CREATE TABLE usuarios (
  id_usuario bigint NOT NULL AUTO_INCREMENT,
  correo varchar(150) NOT NULL UNIQUE, 
  secreto varchar(45) NOT NULL,
  estado varchar(45) NOT NULL DEFAULT 'activo',
  role varchar(45) NOT NULL DEFAULT 'usuario',
  cuit bigint NOT NULL UNIQUE,
  fecha_creacion datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  reset_token varchar(100),
  PRIMARY KEY (id_usuario)
);

DROP TABLE IF EXISTS clientes; CREATE TABLE clientes (
  id_cliente bigint NOT NULL AUTO_INCREMENT,
  cuit bigint NOT NULL,
  nombre varchar(300) NOT NULL,
  grupo varchar(300),
  PRIMARY KEY (id_cliente)
);

DROP TABLE IF EXISTS marcas; CREATE TABLE marcas (
  id_marca bigint NOT NULL AUTO_INCREMENT,
  nombre varchar(300) NOT NULL,
  acta bigint NOT NULL,
  resolucion bigint NOT NULL,
  clase int NOT NULL,
  vencimiento timestamp NOT NULL,
  vencimiento_du timestamp NOT NULL,
  PRIMARY KEY (id_marca)
);

DROP TABLE IF EXISTS marcas_clientes; CREATE TABLE marcas_clientes (
  id_marca_cliente bigint NOT NULL AUTO_INCREMENT,
  id_cliente bigint NOT NULL,
  id_marca bigint NOT NULL,
  PRIMARY KEY (id_marca_cliente)
);

