DROP DATABASE partners;

SHOW DATABASES;
CREATE DATABASE partners;

USE partners;

SHOW TABLES;

select * from partner;


create table partner (
        id bigint not null auto_increment,
        bairro varchar(255),
        categoria varchar(255),
        celular varchar(255),
        cep varchar(255),
        complemento varchar(255),
        cpf_cnpj varchar(255) not null,
        email varchar(255) not null,
        logradouro varchar(255),
        municipio varchar(255),
        nome_fantasia varchar(255),
        numero integer not null,
        observacao varchar(255),
        pais varchar(255),
        razao_social varchar(255) not null,
        segmento varchar(255),
        telefone varchar(255),
        tipo enum ('AGENTELOGISTICA','CLIENTE','DESPACHANTE','FORNECEDOR'),
        tipo_persona enum ('FISICA','JURIDICA'),
        uf varchar(255),
        primary key (id)
    )