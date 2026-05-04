CREATE DATABASE IF NOT EXISTS db_market_tree;

USE db_market_tree;

CREATE TABLE IF NOT EXISTS categoria_no (
  id             INT   NOT NULL AUTO_INCREMENT,
  nome           VARCHAR(120)  NOT NULL,
  descricao      VARCHAR(250)  NOT NULL DEFAULT '',
  icone          VARCHAR(50)   NOT NULL DEFAULT '',
  id_pai         INT ,
  ativo          TINYINT(1)    NOT NULL DEFAULT 1,

  PRIMARY KEY (id),
  INDEX idx_pai      (id_pai),
  INDEX idx_ativo    (ativo),

  CONSTRAINT fk_pai FOREIGN KEY (id_pai)
    REFERENCES categoria_no(id)
    ON DELETE RESTRICT ON UPDATE CASCADE
);