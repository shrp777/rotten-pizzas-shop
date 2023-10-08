-- Adminer 4.8.1 MySQL 11.0.2-MariaDB-1:11.0.2+maria~ubu2204 dump

SET NAMES utf8;
SET time_zone = '+00:00';
SET foreign_key_checks = 0;
SET sql_mode = 'NO_AUTO_VALUE_ON_ZERO';

SET NAMES utf8mb4;

INSERT INTO `ingredients` (`id`, `name`) VALUES
(1,	'Sauce tomate'),
(2,	'Olives vertes'),
(3,	'Olives noires'),
(4,	'Coeurs d\'artichaut'),
(5,	'Mozzarella'),
(6,	'Basilic'),
(7,	'Ail'),
(8,	'Piment'),
(9,	'Jambon'),
(10,	'Parmesan'),
(11,	'Roquette'),
(12,	'Champignons'),
(13,	'Poivrons'),
(14,	'Saucisson piquant'),
(15,	'Oignon'),
(16,	'Origan'),
(17,	'Anchois'),
(18,	'Gorgonzola'),
(19,	'Jambon de Parme'),
(20,	'Crème'),
(21,	'Aubergines'),
(22,	'Provola');

INSERT INTO `orders` (`id`, `amount`, `user_id`, `status`, `createdAt`, `updatedAt`) VALUES
(1,	23,	2,	'ready',	'2023-10-06 14:47:12',	'2023-10-08 19:16:04'),
(2,	10,	2,	'validated',	'2023-10-07 19:18:20',	'2023-10-08 18:57:05'),
(3,	15.5,	2,	'created',	'2023-10-07 19:27:01',	NULL),
(4,	30,	2,	'created',	'2023-10-07 19:32:41',	NULL);

INSERT INTO `orders_pizzas` (`order_id`, `pizza_id`, `quantity`) VALUES
(1,	1,	1),
(1,	2,	2),
(3,	1,	1),
(3,	2,	1),
(3,	3,	1),
(4,	1,	1),
(4,	2,	1),
(4,	3,	1);

INSERT INTO `pizzas` (`id`, `name`, `price`, `available`) VALUES
(1,	'Margherita',	9,	1),
(2,	'Quattro Stagioni',	12,	1),
(3,	'Marinara',	5,	1),
(4,	'Siciliana',	9,	1),
(5,	'Capricciosa',	12,	1),
(6,	'Quattro Formaggi',	12,	1),
(7,	'Romana',	9,	1),
(8,	'Parma',	12,	1),
(9,	'Diavola',	8,	1),
(10,	'Regina',	10,	1);

INSERT INTO `pizzas_ingredients` (`pizza_id`, `ingredient_id`) VALUES
(1,	1),
(1,	6),
(1,	5),
(2,	1),
(2,	2),
(2,	4),
(2,	5),
(2,	9),
(2,	12),
(4,	21),
(4,	1),
(4,	16),
(4,	5),
(5,	1),
(5,	3),
(5,	4),
(5,	5),
(5,	9),
(5,	12),
(6,	20),
(6,	5),
(6,	10),
(6,	18),
(6,	20),
(6,	22),
(7,	1),
(7,	17),
(7,	5),
(8,	11),
(8,	19),
(8,	10),
(9,	1),
(9,	14),
(9,	5),
(10,	1),
(10,	5),
(10,	3),
(10,	9),
(10,	12);

INSERT INTO `users` (`id`, `role`, `firstname`, `lastname`, `email`, `password`, `loyaltyPoints`) VALUES
(1,	'admin',	'John',	'Doe',	'john@doe.com',	'ab4f63f9ac65152575886860dde480a1',	0),
(2,	'customer',	'Jane',	'Doe',	'jane@doe.com',	'ab4f63f9ac65152575886860dde480a1',	30);

-- 2023-10-08 19:30:24