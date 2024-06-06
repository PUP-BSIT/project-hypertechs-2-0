-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Jun 06, 2024 at 04:06 PM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.0.30

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `test_scribe_db`
--

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `user_id` int(11) NOT NULL,
  `lastname` varchar(60) NOT NULL,
  `firstname` varchar(60) NOT NULL,
  `email` varchar(60) NOT NULL,
  `password` varchar(60) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`user_id`, `lastname`, `firstname`, `email`, `password`) VALUES
(1, 'Dela Cruz', 'Juan', 'example@gmail.com', '$2y$10$2PbtPPCqB8DA4Xk62//S1eTrX.Ao4VHES1xwqEk/ccST7G6gkBuya'),
(2, 'Dela Cruz', 'Juanita', 'juanita@gmail.com', '$2y$10$/UwnagTBcdZSkNhvcCwZLeXgyrcMe7oVGTqZlIhvoSrfmwphmy.iW'),
(3, 'Name', 'Test', 'test@gmail.com', '$2y$10$3M2nZDsXiLATkDlvvVEeE.D2KNHJ1MQrV4ZASALu7eT1Nw5iytf7m'),
(4, 'Dela Cruz', 'Juan', 'example@gmail.com', '$2y$10$VJq55CdUGrSqisr9ngPa0efRTpO..kPrBsvsY0OqQO.e83s/Xc4wS'),
(5, 'Dela Cruz', 'Juan', 'example@gmail.com', '$2y$10$BgtZONiZPudskkZjI37BGOyPQAuFbZCB8eRx1Hnead7pQeL0w5Fs6'),
(6, 'Dela Cruz', 'Juan', 'example@gmail.com', '$2y$10$q0u2KgKVBKwXHMadT7zVM.8xigdbRhSw/AqfONntfuODCDyU2RH9G'),
(7, 'Dela Cruz', 'Juan', 'example@gmail.com', '$2y$10$43.nbOIcvzw6cmSIPTUkY.bLMFRa/ZI0LpgkeOlTw1twNPGZ..yZu');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`user_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `user_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
