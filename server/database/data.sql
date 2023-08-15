USE app;

INSERT INTO clientes
(cuit,
nombre,
aclaracion)
VALUES(30693307061,
'Juan',
'INDALO MEDIA'),
(30693307069,
'Manuel',
'INDALO MEDIA TV'),
(20693307069,
'Zoe',
null),
(10693307069,
'John',
'acme'),
(40693307069,
'Ramiro',
'cowboy');

INSERT INTO clientes_marcas (id_cliente, id_marca)
VALUES (1,1),(1,2),(1,3),(2,4),(2,10),(2,5),(3,6),(4,5),(4,8),(4,9),(5,6),(5,7);

INSERT INTO marcas(nombre,
acta,
resolucion,
vencimiento,
vencimiento_du)
VALUES
('GRANIX', #1
45001001,
54632,
current_timestamp(),
current_timestamp()),
('MASTIL', #1
45001002,
54631,
current_timestamp(),
current_timestamp()),
('EL PALENQUE', #1
25001001,
34632,
current_timestamp(),
current_timestamp()),
('DIBITO', #2
45031001,
36532,
current_timestamp(),
current_timestamp()),
('COCA COLA',
65001701,
34732,
current_timestamp(),
current_timestamp()),
('PEPSI',
75001701,
6732,
current_timestamp(),
current_timestamp()),
('ACME',
35001701,
4732,
current_timestamp(),
current_timestamp()),
('COWBOY',
75071701,
6892,
current_timestamp(),
current_timestamp()),
('COWBOY 2',
75677801,
63422,
current_timestamp(),
current_timestamp());

