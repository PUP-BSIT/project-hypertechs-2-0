-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: May 31, 2024 at 08:46 PM
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
-- Database: `scribe_db`
--

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `username` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `username`, `email`, `password`) VALUES
(1, 'mm', 'm@gmail.com', '$2y$10$shroFFZlgfhHcXYN3DIHde22sUnObSbBX1AeitMxJ0vHwM3BadoCu'),
(2, 'allison', 'mary@gmail.com', 'mjd'),
(3, 'allison', 'maryj@gmail.com', '$2y$10$QIOaI/nawgC5JDXOib7Qru3Cck7HsohK6NjWKrqmlexjocNclVgcW'),
(4, 'mj', 'mj@gmail.com', '$2y$10$Q.PR.MZctICU8D2.NeWU5OhvH.frcoQFTR1w1EOVvFkDj3h6PlyCS'),
(6, 'allison', 'mjd@gmail.com', '$2y$10$EUcS9cAjD9uvHfeeY1X2gOjZepKINgGy9/xVw4uq3TncIoraroZDC'),
(7, 'allison', 'maryjoydanay2@gmail.com', '$2y$10$fyMDO74xfNgQnlSpCEaoquWjTPss2VrmWf/0vOQ3n4mQ6G.ldPzru'),
(8, 'allison', 'maryjoydanay212345@gmail.com', '$2y$10$9LUYPJ8VKNPuCzzD4/crzu6mSXmXSslPyBgE/8UwwLf8T23PGqWDu'),
(10, 'alli', 'nsga@gmail.com', '$2y$10$7ZSLY3UrnagUnWjvssuSJebs4.LOJXSoms4JStxeDpppcL2qqQRpa'),
(11, 'allison', 'maryjoydanay223456789@gmail.com', '$2y$10$ixvMyMef01Ffv8I96s0KfuUPe0K.o4/SbbsH/GmQ4zrDat4MBA1Pm'),
(12, 'allison', 'mbcde@gmail.com', '$2y$10$s3fJxOln3IlKBzOe3ZPjFeeEm7Q6xPXGTYEAcYxQawbNSLNetaCLC'),
(13, 'allison123', 'maryjoydanayoooo@gmail.com', '$2y$10$GcgCBcBizaeBjMti3yM5cOiKJ02I2v8ShswjMSzb61PWnniIPKhMW'),
(14, 'allison', 'maryjoydanayppp@gmail.com', '$2y$10$3ilw.nm.E.MCnOiN1qqrHOw6NUSW87TFtD9DAxi2VZZDnxqulYwCa'),
(15, 'Johndoe', 'fortest@gmail.com', '$2y$10$b7HAdPndWlvTup2H3Jc9/e.mX5YhdXmrChjyG262E/2xcsaObpzPm'),
(16, 'MJ', 'maryjoydanay1999@gmail.com', '$2y$10$BoohIW2fyW1ofmeyQBXDdOC2PXbd7MY1OuE5PKn8.VsGwcagGVfBm'),
(17, 'allison', 'maryjoy12345@gmail.com', '$2y$10$tvOZ7hGUIw9/6IF2JjZmr.cxJtrypu2iolHokyzXGXpCpHZsm5r1G'),
(18, 'fabulous', 'maryjoydanay1112@gmail.com', '$2y$10$eJxuxNI7IfmhWe3XVnnjIOtn.wEaStSOdNYs4qJHW7VPg4pJiWnES'),
(19, 'alli', 'mmmm@gmail.com', '$2y$10$gTNTZIJqcU5Da1AyEXEHfOH0Bx8lO32zGqNIWiY7waSkWQNGan/Me'),
(20, 'Savvy', 'savy@gmail.com', '$2y$10$jKodQO2oVdN7DDYiN3HzB.ECenvOj4yCzGKglr2IGGDE9Mwo9GzkW'),
(21, 'techie', 'mjmd@gmail.com', '$2y$10$pfmGyA67QWf06jq2MTetOOPljgTWVv9g0vKwcabupnKSZQvggjqQK'),
(22, 'allisonL_art', 'tinik@gmail.com', '$2y$10$5POa50WWBmylC/6.EdnNB.AmxkMrCO3q3M.27AhuCYvihCZ7p2KXm'),
(23, 'allisonL_art', 'emjey@gmail.com', '$2y$10$ju75bf8u25MEv3w5pwWmju0tKo0XHZYwCB5DQxigPcSYPz7toHwwi'),
(24, 'fish', 'fishbone@gmail.com', '$2y$10$qmgdzsCF6fc2UpgkV7gSk.RC.bjGq2qiQ4hArW1VtzuDuhk1DDtYe'),
(25, 'supersakit', 'tinikisda@gmail.com', '$2y$10$LRcXIjtcE2.zDOvx5xO48uQVmRnI9nKL6BazawU5eRI203CiiDbgi'),
(26, 'supersakit', 'email@gmail.com', '$2y$10$31zkIQK7q7S55AqqjB1i8OcySFJJ3qUva0fAfP51nQ42i91So2oNG');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=29;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
