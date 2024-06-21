-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Jun 21, 2024 at 04:13 PM
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
-- Table structure for table `folders`
--

CREATE TABLE `folders` (
  `folder_id` int(11) NOT NULL,
  `user_id` int(11) DEFAULT NULL,
  `folder_name` varchar(100) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `notes`
--

CREATE TABLE `notes` (
  `id` int(11) NOT NULL,
  `title` varchar(255) NOT NULL,
  `content` text NOT NULL,
  `last_edited` datetime NOT NULL,
  `user_id` int(11) DEFAULT NULL,
  `folder_id` int(11) DEFAULT NULL,
  `tags` varchar(255) DEFAULT NULL,
  `is_deleted` tinyint(1) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `notes`
--

INSERT INTO `notes` (`id`, `title`, `content`, `last_edited`, `user_id`, `folder_id`, `tags`, `is_deleted`) VALUES
(7, 'hello', 'Hello', '2024-06-20 22:47:44', 61, NULL, NULL, 0),
(8, 'dfsf', 'dbfkasbfkas', '2024-06-20 23:00:31', 62, NULL, NULL, 0),
(9, 'afafa', 'afsfa', '2024-06-21 19:16:06', 66, NULL, NULL, 0);

-- --------------------------------------------------------

--
-- Table structure for table `notes_test`
--

CREATE TABLE `notes_test` (
  `id` int(11) NOT NULL,
  `title` varchar(255) NOT NULL,
  `content` text NOT NULL,
  `last_edited` datetime NOT NULL,
  `user_id` int(11) DEFAULT NULL,
  `tags` varchar(255) DEFAULT NULL,
  `folder` varchar(255) DEFAULT NULL,
  `is_deleted` tinyint(1) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `notes_test`
--

INSERT INTO `notes_test` (`id`, `title`, `content`, `last_edited`, `user_id`, `tags`, `folder`, `is_deleted`) VALUES
(97, 'Starboy', 'I\'m tryna put you on a worst mood ah', '2024-06-18 22:38:52', 49, NULL, NULL, 0),
(98, 'John Wick', 'Hi! I\'m John Wick.&nbsp;<div>I\'m gonna kill your entire bloodline</div><div>Ha-ha! kidding</div><div>Or...Am I?</div><div>Maybe</div><div><br></div>', '2024-06-18 23:41:59', 48, NULL, NULL, 0),
(102, 'Kill List', '1. Viggo<div>2. Zeros</div><div>3. Me...?</div>', '2024-06-18 23:48:50', 48, NULL, NULL, 0),
(112, 'My First Note', '<h2><font color=\"#b71a1a\">THEY NOT LIKE US!!!</font></h2>', '2024-06-19 09:58:54', 50, NULL, NULL, 0),
(113, 'Guilty as Sin?', '<div>Drowning in the Blue Nile</div><div>He sent me \'Downtown Lights\'</div><div>I hadn\'t heard it in a while</div><div>My boredom\'s bone deep</div><div>This cage was once just fine</div><div>Am I allowed to cry?</div><div>I dream of cracking locks</div><div>Throwing my life to the wolves</div><div>Or the ocean rocks</div><div>Crashing into him tonight</div><div>He\'s a paradox</div><div>I\'m seeing visions, am I bad?</div><div>Or mad? Or wise?<span style=\"color: var(--text);\">Drowning in the Blue Nile</span></div><div>He sent me \'Downtown Lights\'</div><div>I hadn\'t heard it in a while</div><div>My boredom\'s bone deep</div><div>This cage was once just fine</div><div>Am I allowed to cry?</div><div>I dream of cracking locks</div><div>Throwing my life to the wolves</div><div>Or the ocean rocks</div><div>Crashing into him tonight</div><div>He\'s a paradox</div><div>I\'m seeing visions, am I bad?</div><div>Or mad? Or wise?</div><div>What if he\'s written \'mine\' on my upper thigh</div><div>Only in my mind?</div><div>One slip and falling back into the hedge maze</div><div>Oh what a way to die</div><div>I keep recalling things we never did</div><div>Messy top lip kiss</div><div>How I long for our trysts</div><div>Without ever touching his skin</div><div>How can I be guilty as sin?</div><div>What if he\'s written \'mine\' on my upper thigh</div><div>Only in my mind?</div><div>One slip and falling back into the hedge maze</div><div>Oh what a way to die</div><div>I keep recalling things we never did</div><div>Messy top lip kiss</div><div>How I long for our trysts</div><div>Without ever touching his skin</div><div>How can I be guilty as sin?</div>', '2024-06-19 16:38:16', 47, NULL, NULL, 0),
(504, 'State of Grace', '<font color=\"#d21e1e\"><b>I\'m walking fast through the traffic lights...</b></font>', '2024-06-20 12:39:46', 47, NULL, NULL, 0),
(505, 'Well', 'we\'re fucked up', '2024-06-19 23:15:54', 47, NULL, NULL, 0),
(506, 'Not Like Us', 'Mustard on the beat, hoe!<div><br></div>', '2024-06-20 12:39:25', 47, NULL, NULL, 0),
(507, 'App Dev', 'papasa ba kami dito', '2024-06-20 13:13:36', 47, NULL, NULL, 0),
(508, 'Sample Note', 'This is a note content', '2024-06-20 13:45:52', 47, NULL, NULL, 0),
(509, 'NOTE', 'This is a test', '2024-06-20 13:51:19', 47, NULL, NULL, 0),
(510, 'So High School', 'i feel so highschool...', '2024-06-20 13:53:51', 47, 'music', NULL, 0);

-- --------------------------------------------------------

--
-- Table structure for table `tasks`
--

CREATE TABLE `tasks` (
  `task_id` int(11) NOT NULL,
  `user_id` int(11) DEFAULT NULL,
  `task_description` text NOT NULL,
  `is_completed` tinyint(1) DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `trash`
--

CREATE TABLE `trash` (
  `trash_id` int(11) NOT NULL,
  `user_id` int(11) DEFAULT NULL,
  `item_type` enum('note','folder','task') NOT NULL,
  `item_id` int(11) NOT NULL,
  `deleted_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `user_id` int(11) NOT NULL,
  `firstname` varchar(50) NOT NULL,
  `lastname` varchar(50) NOT NULL,
  `email` varchar(100) NOT NULL,
  `password` varchar(255) NOT NULL,
  `is_verified` tinyint(1) DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`user_id`, `firstname`, `lastname`, `email`, `password`, `is_verified`, `created_at`) VALUES
(47, 'Emmanuel', 'Martinez', 'emmanuellmartinez013@gmail.com', '$2y$10$rQc7hBfNmd2Y6f4vKxDbyuoazX1zDWwXwwuFyb7rdqcgOlbzp/cU2', 0, '2024-06-15 01:54:45'),
(48, 'John', 'Wick', 'emminemx@gmail.com', '$2y$10$ZQ5tLu31XrwoxPA2CPp5TutTSE.S6yrnKgObW/qL8s0Ejgie3hIYO', 0, '2024-06-18 10:18:18'),
(50, 'Kendrick', 'Lamar', 'scribenote.app@gmail.com', '$2y$10$qRv.CexFoc2x7H7okzNYU.rYucsypcwo51LOzvPQUtWha0POOdWRC', 0, '2024-06-19 01:57:36');

-- --------------------------------------------------------

--
-- Table structure for table `verification_codes`
--

CREATE TABLE `verification_codes` (
  `code_id` int(11) NOT NULL,
  `user_id` int(11) DEFAULT NULL,
  `verification_code` varchar(6) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `expiration_time` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `verification_codes`
--

INSERT INTO `verification_codes` (`code_id`, `user_id`, `verification_code`, `created_at`, `expiration_time`) VALUES
(2, 47, '835363', '2024-06-15 01:54:50', NULL),
(3, 48, '631104', '2024-06-18 10:18:24', NULL),
(5, 50, '130074', '2024-06-19 01:57:42', NULL);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `folders`
--
ALTER TABLE `folders`
  ADD PRIMARY KEY (`folder_id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `notes`
--
ALTER TABLE `notes`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `notes_test`
--
ALTER TABLE `notes_test`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `tasks`
--
ALTER TABLE `tasks`
  ADD PRIMARY KEY (`task_id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `trash`
--
ALTER TABLE `trash`
  ADD PRIMARY KEY (`trash_id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`user_id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- Indexes for table `verification_codes`
--
ALTER TABLE `verification_codes`
  ADD PRIMARY KEY (`code_id`),
  ADD KEY `user_id` (`user_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `folders`
--
ALTER TABLE `folders`
  MODIFY `folder_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `notes`
--
ALTER TABLE `notes`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT for table `notes_test`
--
ALTER TABLE `notes_test`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=511;

--
-- AUTO_INCREMENT for table `tasks`
--
ALTER TABLE `tasks`
  MODIFY `task_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `trash`
--
ALTER TABLE `trash`
  MODIFY `trash_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `user_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=69;

--
-- AUTO_INCREMENT for table `verification_codes`
--
ALTER TABLE `verification_codes`
  MODIFY `code_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=23;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `folders`
--
ALTER TABLE `folders`
  ADD CONSTRAINT `folders_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE;

--
-- Constraints for table `tasks`
--
ALTER TABLE `tasks`
  ADD CONSTRAINT `tasks_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE;

--
-- Constraints for table `trash`
--
ALTER TABLE `trash`
  ADD CONSTRAINT `trash_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE;

--
-- Constraints for table `verification_codes`
--
ALTER TABLE `verification_codes`
  ADD CONSTRAINT `verification_codes_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
