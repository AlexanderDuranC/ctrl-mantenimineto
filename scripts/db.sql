CREATE SCHEMA IF NOT EXISTS `sistemasmante` DEFAULT CHARACTER SET utf8;
USE `sistemasmante`;
CREATE TABLE IF NOT EXISTS `sistemasmante`.`mequipos` (
    `id` INT NOT NULL AUTO_INCREMENT,
    `area` VARCHAR(45),
    `responsable` VARCHAR(45),
    `falla_inconveniente` TEXT,
    `serie` VARCHAR(45),
    `marca` VARCHAR(45),
    `referencia` VARCHAR(45),
    `sistema_operativo` VARCHAR(45),
    `id_sistema_operativo` VARCHAR(24),
    `office` VARCHAR(45),
    `id_office` VARCHAR(24),
    `licenciado` VARCHAR(2),
    `procesador` VARCHAR(60),
    `disco_duro` VARCHAR(35),
    `ram` VARCHAR(10),
    `ip` VARCHAR(15),
    `observaciones` TEXT,
    `fecha` DATE,
    PRIMARY KEY (`id`)
) ENGINE = InnoDB;

CREATE TABLE IF NOT EXISTS `sistemasmante`.`melementos` (
    `id` INT NOT NULL AUTO_INCREMENT,
    `area` VARCHAR(45),
    `responsable` VARCHAR(45),
    `fecha` DATE,
    `tipo` VARCHAR(45),
    `observaciones` TEXT,
    `serie` VARCHAR(45),
    `marca` VARCHAR(45),
    `referencia` VARCHAR(45),
    PRIMARY KEY (`id`)
) ENGINE = InnoDB;

CREATE TABLE IF NOT EXISTS `sistemasmante`.`equipos` (
	`id` INT NOT NULL AUTO_INCREMENT,
    `area` VARCHAR(45),
    `responsable` VARCHAR(45),
    `elementos` TEXT,
    `tipo` VARCHAR(45),
    `serie` VARCHAR(45),
    `marca` VARCHAR(45),
    `referencia` VARCHAR(45),
    `sistema_operativo` VARCHAR(45),
    `id_sistema_operativo` VARCHAR(24),
    `office` VARCHAR(45),
    `id_office` VARCHAR(24),
    `licenciado` VARCHAR(2),
    `procesador` VARCHAR(60),
    `disco_duro` VARCHAR(35),
    `ram` VARCHAR(10),
    `ip` VARCHAR(15),
    `observaciones` TEXT,
    `fecha` DATE,
    PRIMARY KEY (`id`)
) ENGINE = InnoDB;