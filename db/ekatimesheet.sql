-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Feb 09, 2024 at 02:41 PM
-- Server version: 10.4.27-MariaDB
-- PHP Version: 7.4.33

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `ekatimesheet`
--

-- --------------------------------------------------------

--
-- Table structure for table `activity`
--

CREATE TABLE `activity` (
  `id` int(11) NOT NULL,
  `name` varchar(500) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `activity`
--

INSERT INTO `activity` (`id`, `name`) VALUES
(1, 'Casual Leave'),
(2, 'Comp Off'),
(3, 'Earned Leave'),
(4, 'Loss of Pay'),
(5, 'Project Work'),
(6, 'Public Holiday'),
(7, 'Sick Leave'),
(8, 'activity');

-- --------------------------------------------------------

--
-- Table structure for table `customer`
--

CREATE TABLE `customer` (
  `id` int(11) NOT NULL,
  `customer_id` int(11) NOT NULL,
  `name` varchar(500) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `customer`
--

INSERT INTO `customer` (`id`, `customer_id`, `name`) VALUES
(1, 1, 'Dassault'),
(2, 2, 'Digital Marketing'),
(3, 3, 'Ekaggata Internal Delivery'),
(4, 4, 'Mate4Tech'),
(5, 5, 'Milkvilla'),
(6, 6, 'Joolkart'),
(7, 7, 'MGD'),
(8, 8, 'new'),
(9, 9, 'new cust'),
(10, 10, 'Priya'),
(11, 11, 'newly');

-- --------------------------------------------------------

--
-- Table structure for table `project`
--

CREATE TABLE `project` (
  `id` int(11) NOT NULL,
  `customer_id` int(11) NOT NULL,
  `name` varchar(500) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `project`
--

INSERT INTO `project` (`id`, `customer_id`, `name`) VALUES
(1, 1, 'Dassault Project'),
(2, 2, 'Digital Marketing Project'),
(3, 3, 'Ekaggata Internal Project - IND'),
(4, 4, 'Mate4Tech - IND'),
(5, 5, 'Milkvilla - IND'),
(6, 6, 'Joolkart - IND'),
(7, 7, 'MGD Project'),
(8, 8, 'New Project'),
(9, 9, 'New Cust Project'),
(10, 10, 'Priya-Project'),
(11, 11, 'Newly-Added-Project');

-- --------------------------------------------------------

--
-- Table structure for table `role`
--

CREATE TABLE `role` (
  `id` int(11) NOT NULL,
  `name` varchar(300) NOT NULL,
  `user_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `role`
--

INSERT INTO `role` (`id`, `name`, `user_id`) VALUES
(1, 'Team Lead', 1),
(2, 'Administrator', 2),
(3, 'Team Member', 3);

-- --------------------------------------------------------

--
-- Table structure for table `tags`
--

CREATE TABLE `tags` (
  `id` int(11) NOT NULL,
  `name` varchar(300) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `tags`
--

INSERT INTO `tags` (`id`, `name`) VALUES
(1, 'Work'),
(2, 'Public Holiday'),
(3, 'Optional Holiday'),
(4, 'Comp Off'),
(5, 'Sick Leave'),
(6, 'Casual Leave');

-- --------------------------------------------------------

--
-- Table structure for table `timesheet`
--

CREATE TABLE `timesheet` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `fromdate` date NOT NULL,
  `fromtime` varchar(300) NOT NULL,
  `duration` time NOT NULL,
  `endtime` varchar(300) NOT NULL,
  `customer` varchar(500) NOT NULL,
  `projects` varchar(500) NOT NULL,
  `activity` varchar(500) NOT NULL,
  `description` varchar(500) NOT NULL,
  `tag` varchar(300) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `timesheet`
--

INSERT INTO `timesheet` (`id`, `user_id`, `fromdate`, `fromtime`, `duration`, `endtime`, `customer`, `projects`, `activity`, `description`, `tag`, `created_at`, `updated_at`) VALUES
(1, 1, '2024-01-03', '05:00 PM', '04:00:00', '09:00 PM', 'Ekaggata Internal Delivery', '[\"Ekaggata Internal Project - IND\"]', 'Comp Off', 'd', 'Work', '2024-01-03 09:34:56', '2024-01-03 09:34:56'),
(2, 0, '2024-01-09', '02:30 PM', '01:30:00', '04:00 PM', 'Dassault', '[\"Dassault\"]', 'Casual Leave', 'des', 'Work', '2024-01-09 09:29:49', '2024-01-09 09:29:49'),
(3, 0, '2024-01-09', '03:00 PM', '02:30:00', '05:30 PM', 'Digital Marketing Project', '[\"Digital Marketing Project\"]', 'Casual Leave', 'd', 'Public Holiday', '2024-01-09 10:05:20', '2024-01-09 10:05:20'),
(4, 1, '2024-01-09', '03:00 PM', '03:00:00', '06:00 PM', 'Dassault', '[\"Dassault\"]', 'Loss of Pay', 'desc', 'Public Holiday', '2024-01-09 10:13:48', '2024-01-09 10:13:48'),
(5, 1, '2024-01-09', '03:00 PM', '06:00:00', '09:00 PM', 'Milkvilla', '[\"Milkvilla - IND\"]', 'Casual Leave', 'Description', 'Work', '2024-01-09 10:14:54', '2024-01-09 10:14:54'),
(6, 0, '2024-01-09', '04:00 PM', '02:00:00', '06:00 PM', 'Digital Marketing Project', '[\"Digital Marketing Project\"]', 'Project Work', 'd', 'Public Holiday', '2024-01-09 11:01:37', '2024-01-09 11:01:37'),
(7, 0, '2024-01-09', '04:00 PM', '02:00:00', '06:00 PM', 'Digital Marketing Project', '[\"Digital Marketing Project\"]', 'Casual Leave', 'b', 'Public Holiday', '2024-01-09 11:02:53', '2024-01-09 11:02:53'),
(8, 0, '2024-01-09', '04:00 PM', '02:00:00', '06:00 PM', 'Digital Marketing Project', '[\"Digital Marketing Project\"]', 'Loss of Pay', 'jhb', 'Public Holiday', '2024-01-09 11:03:32', '2024-01-09 11:03:32'),
(9, 2, '2024-01-09', '04:00 PM', '04:00:00', '08:00 PM', 'Dassault', '[\"Dassault\"]', 'Public Holiday', 'des', 'Work', '2024-01-09 11:19:07', '2024-01-09 11:19:07'),
(10, 3, '2024-01-16', '13:00', '06:00:00', '19:00', 'Priya', 'Priya-Project', 'Public Holiday', 'Description Test One', 'Public Holiday', '2024-02-08 07:14:15', '2024-02-08 07:14:15'),
(11, 3, '2024-01-02', '08:00', '11:00:00', '19:00', 'Joolkart', 'Joolkart - IND', 'Casual Leave', 'Description Test Two', 'Casual Leave', '2024-02-08 07:04:46', '2024-02-08 07:04:46'),
(12, 3, '2024-01-10', '06:00', '05:00:00', '11:00', 'MGD', 'MGD Project', 'Project Work', 'New Description', 'Work', '2024-02-08 07:04:11', '2024-02-08 07:04:11'),
(13, 3, '2024-01-23', '06:00', '05:00:00', '11:00', 'Digital Marketing', 'Digital Marketing Project', 'Project Work', 'New Description', 'Work', '2024-02-08 07:04:37', '2024-02-08 07:04:37'),
(14, 3, '2024-01-05', '06:00', '05:00:00', '11:00', 'Dassault', 'Dassault Project', 'Project Work', 'New Description', 'Work', '2024-02-08 07:04:00', '2024-02-08 07:04:00'),
(15, 3, '2024-02-08', '16:30', '07:00:00', '23:30', 'Digital Marketing', 'Digital Marketing Project', 'Sick Leave', 'Description Test One', 'Sick Leave', '2024-02-08 07:04:58', '2024-02-08 07:04:58'),
(16, 1, '2024-02-21', '01:00 PM', '02:00:00', '03:00 PM', 'Dassault', '[\"Dassault\"]', 'Comp Off', 'd', 'Public Holiday', '2024-01-19 05:49:33', '2024-01-19 05:49:33'),
(17, 2, '2024-01-27', '12:00 PM', '04:00:00', '04:00 PM', 'Digital Marketing Project', '[\"Digital Marketing Project\"]', 'Project Work', 'Work', 'Work', '2024-01-27 06:39:50', '2024-01-27 06:39:50'),
(18, 3, '2024-02-07', '16:00', '04:00:00', '20:00', 'Mate4Tech', 'Mate4Tech - IND', 'Project Work', 'desc', 'Work', '2024-02-08 07:09:04', '2024-02-08 07:09:04'),
(19, 3, '2024-02-09', '19:00', '01:00:00', '20:00', 'MGD', 'MGD Project', 'Project Work', 'Description Testing', 'Work', '2024-02-08 07:09:13', '2024-02-08 07:09:13'),
(20, 3, '2024-02-28', '10:00', '01:30:00', '11:30', 'Ekaggata Internal Delivery', 'Ekaggata Internal Project - IND', 'Project Work', 'Description Test', 'Work', '2024-02-08 07:09:26', '2024-02-08 07:09:26'),
(21, 3, '2024-02-14', '11:00', '00:30:00', '11:30', 'Dassault', 'Dassault Project', 'Casual Leave', 'Description Text', 'Casual Leave', '2024-02-08 07:09:40', '2024-02-08 07:09:40'),
(22, 3, '2024-01-21', '13:00', '09:00:00', '22:00', 'Digital Marketing', 'Digital Marketing Project', 'Project Work', 'Description', 'Work', '2024-02-08 07:10:05', '2024-02-08 07:10:05'),
(23, 3, '2023-12-18', '14:00', '04:00:00', '18:00', 'MGD', 'MGD Project', 'Public Holiday', 'NA', 'Public Holiday', '2024-02-08 07:10:10', '2024-02-08 07:10:10'),
(24, 3, '2023-11-01', '11:00', '00:30:00', '11:30', 'Dassault', 'Dassault Project', 'Project Work', 'Not Applicable', 'Work', '2024-02-08 07:10:15', '2024-02-08 07:10:15'),
(25, 3, '2024-03-06', '12:00', '01:00:00', '13:00', 'Mate4Tech', 'Mate4Tech - IND', 'Loss of Pay', 'Description', 'Optional Holiday', '2024-02-08 07:10:21', '2024-02-08 07:10:21'),
(26, 3, '2024-03-18', '13:00', '10:00:00', '23:00', 'Joolkart', 'Joolkart - IND', 'Earned Leave', 'NA', 'Optional Holiday', '2024-02-08 07:10:27', '2024-02-08 07:10:27'),
(27, 3, '2024-02-26', '12:00', '01:00:00', '13:00', 'Dassault', 'Dassault Project', 'Public Holiday', 'description', 'Public Holiday', '2024-02-08 07:10:34', '2024-02-08 07:10:34'),
(28, 3, '2023-06-19', '13:30', '04:00:00', '17:30', 'Priya', 'Priya-Project', 'Sick Leave', 'Leave', 'Sick Leave', '2024-02-08 07:14:28', '2024-02-08 07:14:28'),
(29, 3, '2024-02-13', '13:00', '03:00:00', '16:00', 'Joolkart', 'Joolkart - IND', 'Project Work', 'description of the joolkart project work status', 'Work', '2024-02-08 07:10:56', '2024-02-08 07:10:56'),
(30, 3, '2023-02-10', '16:00', '07:00:00', '23:00', 'Digital Marketing', 'Digital Marketing Project', 'Project Work', 'Description', 'Work', '2024-02-08 07:11:02', '2024-02-08 07:11:02'),
(31, 3, '2024-02-19', '05:00 PM', '06:00:00', '11:00 PM', 'Milkvilla', 'Milkvilla - IND', 'Project Work', 'Description', 'Work', '2024-02-08 06:54:44', '2024-02-08 06:54:44'),
(32, 3, '2024-02-25', '12:00 PM', '08:00:00', '08:00 PM', 'Priya', 'Priya-Project', 'Casual Leave', 'Description', 'Casual Leave', '2024-02-08 07:15:00', '2024-02-08 07:15:00'),
(33, 3, '2024-02-08', '12:00 PM', '02:00:00', '02:00 PM', 'Priya', 'Priya-Project', 'Project Work', 'Description', 'Work', '2024-02-08 07:18:26', '2024-02-08 07:18:26'),
(34, 3, '2024-02-20', '01:00 PM', '06:00:00', '07:00 PM', 'Priya', 'Priya-Project', 'Project Work', 'Description', 'Work', '2024-02-08 07:19:14', '2024-02-08 07:19:14');

-- --------------------------------------------------------

--
-- Table structure for table `user`
--

CREATE TABLE `user` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `name` varchar(300) NOT NULL,
  `email` varchar(300) NOT NULL,
  `password` varchar(500) NOT NULL,
  `title` varchar(300) NOT NULL,
  `language` varchar(300) NOT NULL,
  `timezone` varchar(500) NOT NULL,
  `staff_number` int(11) NOT NULL,
  `supervisor` varchar(300) NOT NULL,
  `team` varchar(500) NOT NULL,
  `role` varchar(300) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `user`
--

INSERT INTO `user` (`id`, `user_id`, `name`, `email`, `password`, `title`, `language`, `timezone`, `staff_number`, `supervisor`, `team`, `role`, `created_at`, `updated_at`) VALUES
(1, 1, 'Admin', 'admin@admin.com', '$2b$10$I0bA.8P7yy27TRWD0GWNKOxmJ4h4u4YlAicdpLmfZtHOeB/H2Qv06', '', '', '', 0, '', '', '', '2024-01-10 03:56:29', '2024-01-10 03:56:29'),
(2, 2, 'Pooja', 'pooja@gmail.com', '$2b$10$jV50v0sgyfSwr14D1IdUkOxflgmuotDf2zOhOTdzdJS5PqVE.i2CC', '', '', '', 0, '', '', '', '2024-01-03 09:38:14', '2024-01-03 09:38:14'),
(3, 3, 'Neha', 'neha@gmail.com', '$2b$10$mtB.sxIz6yZW6jPHo6fJ7e8E3jodjhLyuiHbu00p9iJmL640x18cC', '', '', '', 0, '', '', '', '2024-01-03 09:39:45', '2024-01-03 09:39:45'),
(4, 4, 'Sachin', 'sachin@gmail.com', '$2b$10$k21rkbcnViPA2VD1G7Cs3uTcQZOsyR1eX97MXrl0CReqUleaIVt6O', '', '', '', 0, '', '', '', '2024-01-03 11:17:12', '2024-01-03 11:17:12'),
(5, 5, 'Sneha', 'sneha@gmail.com', '$2b$10$WbKZjPwyZYleuM8fB4IkGutHJ/BkwLYl0J8HqvybrM2SsbcNoAfxe', '', '', '', 0, '', '', '', '2024-01-03 11:18:23', '2024-01-03 11:18:23'),
(6, 6, 'Madhav', 'madhav@gmail.com', '$2b$10$sMX/6GeL97FlJmrV/uGns.SaQ4y6ZJ85iQ2gLS4BfNUGHedlOjuQK', '', '', '', 0, '', '', '', '2024-01-03 11:35:08', '2024-01-03 11:35:08'),
(7, 7, 'fbcb', 'sfd@gmail', '$2b$10$fMZFxV0wHHEC5A/UJqc0Bew9pp0XdbBPcVALLtF3IKTkqpJM/itHi', '', '', '', 0, '', '', '', '2024-01-03 11:35:58', '2024-01-03 11:35:58'),
(8, 8, 'test', 'test@gmail', '$2b$10$3uimZUAh5k/wWOj8Fvsfeu9iY5bt9JCBlldG1E0JQTFOMMLXoX/7a', '', '', '', 0, '', '', '', '2024-01-03 11:54:31', '2024-01-03 11:54:31'),
(9, 9, 'new test', 'newtest@gmail.com', '$2b$10$5EEua8MRmk1twnSSfJPbE.afMFO.H33iIMUMdUIlHdsb6jse/1RrG', '', '', '', 0, '', '', '', '2024-01-03 11:59:02', '2024-01-03 11:59:02'),
(10, 10, 'Prachi', 'prachi@gmail.com', '$2b$10$dNqusHyKtWjSjipOHj3A2O.ZVc4GOY6tb6qGoUXZF3dbe.MmK7RQy', '', '', '', 0, '', '', '', '2024-01-03 12:01:19', '2024-01-03 12:01:19'),
(11, 11, 'test  one', 'testone@gmail.com', '$2b$10$KhwSpug06lp49SU3XeWPBehenhnp4GUXpT9fLPYgK3dchmbXaZd8C', '', '', '', 0, '', '', '', '2024-01-03 12:11:04', '2024-01-03 12:11:04'),
(12, 12, 'test two', 'testtwo@gmail.com', '$2b$10$EhpP7gqK4nkR0md46IcaoOZUXVcUrkSHV0wFAqDAYnlxaPCKVDETa', '', '', '', 0, '', '', '', '2024-01-03 12:12:18', '2024-01-03 12:12:18'),
(13, 13, 'test three', 'testthree@gmail.com', '$2b$10$XVk7cJUoqAM6Gvdm0BkFweeASgbD9Hulh3PVdcEXHO4U2BJ2XuURa', '', '', '', 0, '', '', '', '2024-01-03 12:17:20', '2024-01-03 12:17:20'),
(14, 14, 'abcd', 'abcd@gmail.com', '$2b$10$3X9zJ1F3lRbpQS4FYrvwYOn./F6yxUCXJHOUUXNvc9flyR9hi5cGS', '', '', '', 0, '', '', '', '2024-01-03 12:19:50', '2024-01-03 12:19:50'),
(15, 15, 'pqrs', 'pqrs@gmail.com', '$2b$10$kKDu3J47z7KsdatakbcEa.lyGN0zx8p3ISHevpMEzL0nNhLqLg8hS', '', '', '', 0, '', '', '', '2024-01-03 12:27:26', '2024-01-03 12:27:26'),
(16, 16, 'xyz', 'xyz@gmail.com', '$2b$10$1fytRxjVIPkjgxuo7ZzgH.OVmLl4E/dGLevw.mMqJN3nz9uT9YspK', '', '', '', 0, '', '', '', '2024-01-03 14:45:44', '2024-01-03 14:45:44'),
(17, 17, 'sample user name', 'sun@gmail.com', '$2b$10$j6ZD/aMPayGDaUCMBtl44ef46R.4ohbaVaIuS8WmhzhRYbWp0wVnq', '', '', '', 0, '', '', '', '2024-01-04 04:55:37', '2024-01-04 04:55:37'),
(18, 18, 'new sample user', 'nsu@gmail.com', '$2b$10$6gmzuE/1ol6QukDln8cCDePpgyJN3a4v7SCEFlYltD2VVyhs89oKK', '', '', '', 0, '', '', '', '2024-01-04 04:57:20', '2024-01-04 04:57:20'),
(19, 19, 'Pooja Dhamanekar', 'pooja.dhamanekar@ekaggata.com', '$2b$10$1Zyd5yKahWyDfIY.az/6w.ju70xJQ6Dw1x8YweQVq9fxiLFgMLMga', 'Pooja-Developer', 'English', 'Asia/Kolkata', 200195, 'admin', 'Ekaggata Internal Delivery', 'Team Lead', '2024-01-04 09:24:43', '2024-01-04 09:24:43'),
(20, 20, 'poojad tests', 'poojadtests@gmail.com', '$2b$10$oiWcl5Hbi/iyZEOFQ5zWGujtoUXzJHWP0w337m9wWA8shX4z68D.O', 'Pooja-Devs-One', 'Spanish', 'America/Chicago', 200196, 'Neha', 'MGD', 'Team Member', '2024-01-12 06:39:42', '2024-01-12 06:39:42'),
(21, 21, 'prasad test', 'prasadtest@gmail.com', '$2b$10$PlY60VfKL5vnvDdZQOQG1eXYciDR4vRSAod6NnbZiZMwNvPJb8/Rq', '', 'English', 'Asia/Kolkata', 0, '', '', '', '2024-01-04 10:20:15', '2024-01-04 10:20:15');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `activity`
--
ALTER TABLE `activity`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `customer`
--
ALTER TABLE `customer`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `project`
--
ALTER TABLE `project`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `role`
--
ALTER TABLE `role`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `tags`
--
ALTER TABLE `tags`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `timesheet`
--
ALTER TABLE `timesheet`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `user`
--
ALTER TABLE `user`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `activity`
--
ALTER TABLE `activity`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT for table `customer`
--
ALTER TABLE `customer`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- AUTO_INCREMENT for table `project`
--
ALTER TABLE `project`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- AUTO_INCREMENT for table `role`
--
ALTER TABLE `role`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `tags`
--
ALTER TABLE `tags`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `timesheet`
--
ALTER TABLE `timesheet`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=35;

--
-- AUTO_INCREMENT for table `user`
--
ALTER TABLE `user`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=22;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
