-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 19-05-2026 a las 16:40:00
-- Versión del servidor: 10.4.32-MariaDB
-- Versión de PHP: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";
SET FOREIGN_KEY_CHECKS = 0;

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `nyu_cafeteria`
--
CREATE DATABASE IF NOT EXISTS `nyu_cafeteria` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;
USE `nyu_cafeteria`;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `user`
--
DROP TABLE IF EXISTS `user`;
CREATE TABLE `user` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `nombre` varchar(255) NOT NULL,
  `apellido` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `tipo` varchar(255) NOT NULL DEFAULT 'Cliente',
  PRIMARY KEY (`id`),
  UNIQUE KEY `IDX_email` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci AUTO_INCREMENT=11;

--
-- Volcado de datos para la tabla `user`
--
INSERT INTO `user` (`id`, `nombre`, `apellido`, `email`, `password`, `tipo`) VALUES
(7, 'Cristian', 'Admin', 'admin@nyu.edu', 'admin', 'Administrador'),
(8, 'Juan', 'Pérez', 'juan@nyu.edu', 'password', 'Cliente'),
(9, 'María', 'García', 'maria@nyu.edu', 'password', 'Cliente'),
(10, 'Carlos', 'López', 'carlos@nyu.edu', 'password', 'Cliente');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `menu`
--
DROP TABLE IF EXISTS `menu`;
CREATE TABLE `menu` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `nombre` varchar(255) NOT NULL,
  `descripcion` varchar(255) NOT NULL,
  `precio` decimal(10,2) NOT NULL,
  `categoria` varchar(255) NOT NULL,
  `disponible` tinyint(4) NOT NULL DEFAULT 1,
  `fechaDisponible` datetime NOT NULL,
  `image` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci AUTO_INCREMENT=8;

--
-- Volcado de datos para la tabla `menu`
--
INSERT INTO `menu` (`id`, `nombre`, `descripcion`, `precio`, `categoria`, `disponible`, `fechaDisponible`, `image`) VALUES
(5, 'Bowl de Quinoa y Pollo Grill', 'Proteína premium, vegetales frescos y aderezo artesanal.', 7500.00, 'Almuerzos', 1, '2026-04-24 00:00:00', 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=300&q=80'),
(6, 'Wrap Vegetariano', 'Hummus, espinaca, tomate y falafel en tortilla de maíz.', 4000.00, 'Opciones Ligeras', 1, '2026-04-24 00:00:00', 'https://images.unsplash.com/photo-1628840042765-356cda07504e?auto=format&fit=crop&w=300&q=80'),
(7, 'Café Latte Vainilla', 'Café de especialidad con leche texturizada y vainilla.', 2500.00, 'Bebidas', 1, '2026-04-24 00:00:00', 'https://images.unsplash.com/photo-1541167760496-1628856ab772?auto=format&fit=crop&w=300&q=80');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `stock`
--
DROP TABLE IF EXISTS `stock`;
CREATE TABLE `stock` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `menuItemId` int(11) NOT NULL,
  `cantidad` int(11) NOT NULL DEFAULT 0,
  `umbralMinimo` int(11) NOT NULL DEFAULT 10,
  `ultimaActualizacion` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `IDX_menuItemId` (`menuItemId`),
  FOREIGN KEY (`menuItemId`) REFERENCES `menu` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci AUTO_INCREMENT=4;

--
-- Volcado de datos para la tabla `stock`
--
INSERT INTO `stock` (`id`, `menuItemId`, `cantidad`, `umbralMinimo`) VALUES
(1, 5, 50, 10),
(2, 6, 1, 5),
(3, 7, 30, 15);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `meal_plan`
--
DROP TABLE IF EXISTS `meal_plan`;
CREATE TABLE `meal_plan` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `nombre` varchar(255) NOT NULL,
  `descripcion` varchar(255) NOT NULL,
  `precio` decimal(10,2) NOT NULL,
  `tipo` varchar(255) NOT NULL,
  `activo` tinyint(4) NOT NULL DEFAULT 1,
  `reqMatricula` tinyint(4) NOT NULL DEFAULT 0,
  `reqResidencia` tinyint(4) NOT NULL DEFAULT 0,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci AUTO_INCREMENT=4;

--
-- Volcado de datos para la tabla `meal_plan`
--
INSERT INTO `meal_plan` (`id`, `nombre`, `descripcion`, `precio`, `tipo`, `activo`, `reqMatricula`, `reqResidencia`) VALUES
(1, 'Plan Flex (15 Comidas)', 'Ahorra en tus comidas y mantén flexibilidad. Ideal para quienes cocinan ocasionalmente.', 300000.00, 'Flex', 1, 1, 0),
(2, 'Plan Residente Estándar (30 Comidas)', 'El plan más popular. Cubre 1 almuerzo al día, de lunes a viernes + algunos fines de semana.', 500000.00, 'Estándar', 1, 1, 0),
(3, 'Plan Premium Full (60 comidas)', 'Cobertura total. Almuerzo y cena todos los días. Máxima comodidad.', 900000.00, 'Premium', 1, 1, 1);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `student_status`
--
DROP TABLE IF EXISTS `student_status`;
CREATE TABLE `student_status` (
  `usuarioId` int(11) NOT NULL,
  `matriculaActiva` tinyint(4) NOT NULL DEFAULT 0,
  `residenciaActiva` tinyint(4) NOT NULL DEFAULT 0,
  `planActivoId` int(11) DEFAULT NULL,
  `ultimaActualizacion` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`usuarioId`),
  FOREIGN KEY (`usuarioId`) REFERENCES `user` (`id`) ON DELETE CASCADE,
  FOREIGN KEY (`planActivoId`) REFERENCES `meal_plan` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `student_status`
--
INSERT INTO `student_status` (`usuarioId`, `matriculaActiva`, `residenciaActiva`, `planActivoId`) VALUES
(8, 0, 1, NULL),
(9, 1, 0, NULL),
(10, 0, 0, NULL);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `promotion`
--
DROP TABLE IF EXISTS `promotion`;
CREATE TABLE `promotion` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `nombre` varchar(255) NOT NULL,
  `descripcion` varchar(255) NOT NULL,
  `descuento` decimal(10,2) NOT NULL,
  `fechaInicio` datetime NOT NULL,
  `fechaFin` datetime NOT NULL,
  `activa` tinyint(4) NOT NULL DEFAULT 1,
  `reqMatricula` tinyint(4) NOT NULL DEFAULT 0,
  `reqResidencia` tinyint(4) NOT NULL DEFAULT 0,
  `tipoAplicacion` varchar(255) NOT NULL DEFAULT 'todo',
  `categoria` varchar(255) DEFAULT NULL,
  `productosIds` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`productosIds`)),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci AUTO_INCREMENT=5;

--
-- Volcado de datos para la tabla `promotion`
--
INSERT INTO `promotion` (`id`, `nombre`, `descripcion`, `descuento`, `fechaInicio`, `fechaFin`, `activa`, `reqMatricula`, `reqResidencia`, `tipoAplicacion`, `categoria`, `productosIds`) VALUES
(1, 'Descuento Universitario', 'Descuento para estudiantes con matrícula activa', 15.00, '2026-03-31 21:00:00', '2026-06-29 20:00:00', 1, 1, 0, 'todo', NULL, NULL),
(2, 'Beneficio Residente', 'Descuento exclusivo para residentes en bebidas', 25.00, '2026-03-31 21:00:00', '2026-12-30 21:00:00', 1, 1, 1, 'categoria', 'Bebidas', NULL),
(3, 'Promo Combo', 'Descuento en hamburguesa y pizza', 20.00, '2026-04-19 20:00:00', '2026-05-19 20:00:00', 1, 1, 0, 'producto', NULL, '[1,4]'),
(4, 'Semana Saludable', 'Descuento en toda la línea saludable', 10.00, '2026-04-24 20:00:00', '2026-05-01 20:00:00', 0, 0, 0, 'categoria', 'Saludable', NULL);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `orders`
--
DROP TABLE IF EXISTS `orders`;
CREATE TABLE `orders` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `usuarioId` int(11) NOT NULL,
  `items` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL CHECK (json_valid(`items`)),
  `total` decimal(10,2) NOT NULL DEFAULT 0.00,
  `estado` varchar(255) NOT NULL DEFAULT 'pendiente',
  `fechaCreacion` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `horarioRetiro` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  FOREIGN KEY (`usuarioId`) REFERENCES `user` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci AUTO_INCREMENT=2;

--
-- Volcado de datos para la tabla `orders`
--
INSERT INTO `orders` (`id`, `usuarioId`, `items`, `total`, `estado`, `fechaCreacion`, `horarioRetiro`) VALUES
(1, 9, '[{"id": 5, "nombre": "Bowl de Quinoa y Pollo Grill", "precio": 7500.00, "cantidad": 1}]', 7500.00, 'completado', '2026-05-19 12:00:00', '2026-05-19 13:00:00');

SET FOREIGN_KEY_CHECKS = 1;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
