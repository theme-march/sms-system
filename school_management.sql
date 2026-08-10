-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Aug 10, 2026 at 01:11 PM
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
-- Database: `school_management`
--

-- --------------------------------------------------------

--
-- Table structure for table `academic_sessions`
--

CREATE TABLE `academic_sessions` (
  `id` varchar(191) NOT NULL,
  `school_id` varchar(191) NOT NULL,
  `academic_year_id` varchar(191) NOT NULL,
  `name` varchar(191) NOT NULL,
  `start_date` datetime(3) NOT NULL,
  `end_date` datetime(3) NOT NULL,
  `status` enum('ACTIVE','INACTIVE','SUSPENDED','PENDING') NOT NULL DEFAULT 'ACTIVE',
  `created_at` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updated_at` datetime(3) NOT NULL,
  `deleted_at` datetime(3) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `academic_sessions`
--

INSERT INTO `academic_sessions` (`id`, `school_id`, `academic_year_id`, `name`, `start_date`, `end_date`, `status`, `created_at`, `updated_at`, `deleted_at`) VALUES
('893e6506-31d7-46e1-ad52-35021548fe76', '7b2b510e-dab0-4f0f-9aae-f1d27c9de59c', 'demo-academic-year-current', 'First Term / Semester', '2026-01-01 00:00:00.000', '2026-04-30 00:00:00.000', 'ACTIVE', '2026-08-06 06:04:26.792', '2026-08-06 06:04:26.792', NULL),
('9d9eb558-ed98-44ac-9cf4-7f152e79041a', '7b2b510e-dab0-4f0f-9aae-f1d27c9de59c', 'demo-academic-year-current', 'First Term / Semester', '2026-01-01 00:00:00.000', '2026-04-30 00:00:00.000', 'ACTIVE', '2026-08-06 06:04:49.888', '2026-08-06 06:04:49.888', NULL),
('d803797e-fb94-4be8-954a-b35e14490828', '7b2b510e-dab0-4f0f-9aae-f1d27c9de59c', 'demo-academic-year-current', 'First Term / Semester', '2026-01-01 00:00:00.000', '2026-04-30 00:00:00.000', 'INACTIVE', '2026-08-06 06:04:42.478', '2026-08-06 06:04:42.478', NULL),
('demo-session-current', '7b2b510e-dab0-4f0f-9aae-f1d27c9de59c', 'demo-academic-year-current', '2026 Regular Session', '2026-01-01 03:00:00.000', '2026-12-31 03:00:00.000', 'ACTIVE', '2026-08-02 08:11:07.541', '2026-08-02 08:57:55.465', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `academic_years`
--

CREATE TABLE `academic_years` (
  `id` varchar(191) NOT NULL,
  `school_id` varchar(191) NOT NULL,
  `name` varchar(191) NOT NULL,
  `start_date` datetime(3) NOT NULL,
  `end_date` datetime(3) NOT NULL,
  `is_current` tinyint(1) NOT NULL DEFAULT 0,
  `status` enum('ACTIVE','INACTIVE','SUSPENDED','PENDING') NOT NULL DEFAULT 'ACTIVE',
  `created_at` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updated_at` datetime(3) NOT NULL,
  `deleted_at` datetime(3) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `academic_years`
--

INSERT INTO `academic_years` (`id`, `school_id`, `name`, `start_date`, `end_date`, `is_current`, `status`, `created_at`, `updated_at`, `deleted_at`) VALUES
('demo-academic-year-current', '7b2b510e-dab0-4f0f-9aae-f1d27c9de59c', '2026', '2026-01-01 03:00:00.000', '2026-12-31 03:00:00.000', 1, 'ACTIVE', '2026-08-02 08:11:07.531', '2026-08-02 08:57:55.460', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `activity_logs`
--

CREATE TABLE `activity_logs` (
  `id` varchar(191) NOT NULL,
  `user_id` varchar(191) NOT NULL,
  `action` varchar(191) NOT NULL,
  `metadata` text DEFAULT NULL,
  `created_at` datetime(3) NOT NULL DEFAULT current_timestamp(3)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `admission_applications`
--

CREATE TABLE `admission_applications` (
  `id` varchar(191) NOT NULL,
  `school_id` varchar(191) NOT NULL,
  `campaign_id` varchar(191) DEFAULT NULL,
  `application_number` varchar(191) NOT NULL,
  `tracking_code` varchar(191) NOT NULL,
  `class_id` varchar(191) NOT NULL,
  `group_id` varchar(191) DEFAULT NULL,
  `student_name_en` varchar(191) NOT NULL,
  `student_name_bn` varchar(191) DEFAULT NULL,
  `gender` enum('MALE','FEMALE','OTHER') NOT NULL DEFAULT 'MALE',
  `date_of_birth` datetime(3) NOT NULL,
  `blood_group` varchar(191) DEFAULT NULL,
  `birth_registration_number` varchar(191) DEFAULT NULL,
  `phone` varchar(191) DEFAULT NULL,
  `email` varchar(191) DEFAULT NULL,
  `present_address` text DEFAULT NULL,
  `permanent_address` text DEFAULT NULL,
  `previous_school` varchar(191) DEFAULT NULL,
  `status` varchar(191) NOT NULL DEFAULT 'submitted',
  `payment_status` enum('PENDING','PAID','PARTIAL','OVERDUE','CANCELLED') NOT NULL DEFAULT 'PENDING',
  `rejection_reason` text DEFAULT NULL,
  `correction_notes` text DEFAULT NULL,
  `created_at` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updated_at` datetime(3) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `admission_applications`
--

INSERT INTO `admission_applications` (`id`, `school_id`, `campaign_id`, `application_number`, `tracking_code`, `class_id`, `group_id`, `student_name_en`, `student_name_bn`, `gender`, `date_of_birth`, `blood_group`, `birth_registration_number`, `phone`, `email`, `present_address`, `permanent_address`, `previous_school`, `status`, `payment_status`, `rejection_reason`, `correction_notes`, `created_at`, `updated_at`) VALUES
('demo-admission-1', '7b2b510e-dab0-4f0f-9aae-f1d27c9de59c', 'demo-admission-campaign', 'DEMO-APP-2026-1', 'DEMO-TRK-2026-1', 'demo-class-6', NULL, 'Zarif Rahman', NULL, 'MALE', '2015-01-15 03:00:00.000', 'B+', NULL, '01310000001', 'applicant1@example.com', 'Dhaka, Bangladesh', 'Bangladesh', 'Model Primary School', 'submitted', 'PAID', NULL, NULL, '2026-08-02 08:11:12.388', '2026-08-02 08:57:59.045'),
('demo-admission-2', '7b2b510e-dab0-4f0f-9aae-f1d27c9de59c', 'demo-admission-campaign', 'DEMO-APP-2026-2', 'DEMO-TRK-2026-2', 'demo-class-7', NULL, 'Afsana Noor', NULL, 'FEMALE', '2015-02-15 03:00:00.000', 'B+', NULL, '01310000002', 'applicant2@example.com', 'Dhaka, Bangladesh', 'Bangladesh', 'Model Primary School', 'under_review', 'PAID', NULL, NULL, '2026-08-02 08:11:12.405', '2026-08-02 08:57:59.051'),
('demo-admission-3', '7b2b510e-dab0-4f0f-9aae-f1d27c9de59c', 'demo-admission-campaign', 'DEMO-APP-2026-3', 'DEMO-TRK-2026-3', 'demo-class-6', NULL, 'Rayhan Islam', NULL, 'MALE', '2015-03-15 03:00:00.000', 'B+', NULL, '01310000003', 'applicant3@example.com', 'Dhaka, Bangladesh', 'Bangladesh', 'Model Primary School', 'waiting_list', 'PAID', NULL, NULL, '2026-08-02 08:11:12.410', '2026-08-02 08:57:59.054'),
('demo-admission-4', '7b2b510e-dab0-4f0f-9aae-f1d27c9de59c', 'demo-admission-campaign', 'DEMO-APP-2026-4', 'DEMO-TRK-2026-4', 'demo-class-7', NULL, 'Ishrat Jahan', NULL, 'FEMALE', '2015-04-15 03:00:00.000', 'B+', NULL, '01310000004', 'applicant4@example.com', 'Dhaka, Bangladesh', 'Bangladesh', 'Model Primary School', 'approved', 'PENDING', NULL, NULL, '2026-08-02 08:11:12.421', '2026-08-02 08:57:59.057'),
('demo-admission-5', '7b2b510e-dab0-4f0f-9aae-f1d27c9de59c', 'demo-admission-campaign', 'DEMO-APP-2026-5', 'DEMO-TRK-2026-5', 'demo-class-6', NULL, 'Abir Hasan', NULL, 'MALE', '2015-05-15 03:00:00.000', 'B+', NULL, '01310000005', 'applicant5@example.com', 'Dhaka, Bangladesh', 'Bangladesh', 'Model Primary School', 'enrolled', 'PAID', NULL, NULL, '2026-08-02 08:11:12.425', '2026-08-10 10:37:48.408');

-- --------------------------------------------------------

--
-- Table structure for table `admission_application_guardians`
--

CREATE TABLE `admission_application_guardians` (
  `id` varchar(191) NOT NULL,
  `application_id` varchar(191) NOT NULL,
  `name` varchar(191) NOT NULL,
  `relationship` varchar(191) NOT NULL,
  `phone` varchar(191) NOT NULL,
  `alternate_phone` varchar(191) DEFAULT NULL,
  `email` varchar(191) DEFAULT NULL,
  `occupation` varchar(191) DEFAULT NULL,
  `national_id` varchar(191) DEFAULT NULL,
  `address` text DEFAULT NULL,
  `is_primary` tinyint(1) NOT NULL DEFAULT 1,
  `is_financial_contact` tinyint(1) NOT NULL DEFAULT 1,
  `is_emergency_contact` tinyint(1) NOT NULL DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `admission_campaigns`
--

CREATE TABLE `admission_campaigns` (
  `id` varchar(191) NOT NULL,
  `school_id` varchar(191) NOT NULL,
  `academic_year_id` varchar(191) NOT NULL,
  `title` varchar(191) NOT NULL,
  `code` varchar(191) NOT NULL,
  `start_date` datetime(3) NOT NULL,
  `end_date` datetime(3) NOT NULL,
  `capacity` int(11) NOT NULL DEFAULT 100,
  `status` varchar(191) NOT NULL DEFAULT 'ACTIVE',
  `description` text DEFAULT NULL,
  `created_at` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updated_at` datetime(3) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `admission_campaigns`
--

INSERT INTO `admission_campaigns` (`id`, `school_id`, `academic_year_id`, `title`, `code`, `start_date`, `end_date`, `capacity`, `status`, `description`, `created_at`, `updated_at`) VALUES
('demo-admission-campaign', '7b2b510e-dab0-4f0f-9aae-f1d27c9de59c', 'demo-academic-year-current', '2027 Admission Programme', 'ADM-2027', '2026-08-02 08:57:54.944', '2026-10-01 08:57:54.944', 150, 'ACTIVE', 'Online admission for the next academic session.', '2026-08-02 08:11:12.372', '2026-08-02 08:57:59.039');

-- --------------------------------------------------------

--
-- Table structure for table `admission_documents`
--

CREATE TABLE `admission_documents` (
  `id` varchar(191) NOT NULL,
  `application_id` varchar(191) NOT NULL,
  `document_type` varchar(191) NOT NULL,
  `title` varchar(191) NOT NULL,
  `file_url` varchar(191) NOT NULL,
  `status` varchar(191) NOT NULL DEFAULT 'PENDING'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `admission_interviews`
--

CREATE TABLE `admission_interviews` (
  `id` varchar(191) NOT NULL,
  `application_id` varchar(191) NOT NULL,
  `interview_date` datetime(3) DEFAULT NULL,
  `interviewer_name` varchar(191) DEFAULT NULL,
  `status` varchar(191) NOT NULL DEFAULT 'SCHEDULED',
  `comments` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `admission_reviews`
--

CREATE TABLE `admission_reviews` (
  `id` varchar(191) NOT NULL,
  `application_id` varchar(191) NOT NULL,
  `reviewer_id` varchar(191) DEFAULT NULL,
  `decision` varchar(191) NOT NULL,
  `comments` text DEFAULT NULL,
  `created_at` datetime(3) NOT NULL DEFAULT current_timestamp(3)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `admission_tests`
--

CREATE TABLE `admission_tests` (
  `id` varchar(191) NOT NULL,
  `application_id` varchar(191) NOT NULL,
  `test_date` datetime(3) DEFAULT NULL,
  `venue` varchar(191) DEFAULT NULL,
  `total_marks` decimal(5,2) NOT NULL DEFAULT 100.00,
  `marks_obtained` decimal(5,2) DEFAULT NULL,
  `passed` tinyint(1) DEFAULT NULL,
  `comments` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `admit_cards`
--

CREATE TABLE `admit_cards` (
  `id` varchar(191) NOT NULL,
  `school_id` varchar(191) NOT NULL,
  `exam_id` varchar(191) NOT NULL,
  `student_id` varchar(191) NOT NULL,
  `roll_number` varchar(191) NOT NULL,
  `admit_card_number` varchar(191) NOT NULL,
  `fee_cleared` tinyint(1) NOT NULL DEFAULT 1,
  `verification_code` varchar(191) NOT NULL,
  `generated_at` datetime(3) NOT NULL DEFAULT current_timestamp(3)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `attendances`
--

CREATE TABLE `attendances` (
  `id` varchar(191) NOT NULL,
  `student_id` varchar(191) NOT NULL,
  `date` date NOT NULL,
  `status` enum('PRESENT','ABSENT','LATE','EXCUSED','HALF_DAY') NOT NULL DEFAULT 'PRESENT',
  `remarks` varchar(191) DEFAULT NULL,
  `created_at` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updated_at` datetime(3) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `attendances`
--

INSERT INTO `attendances` (`id`, `student_id`, `date`, `status`, `remarks`, `created_at`, `updated_at`) VALUES
('02522166-533f-46ea-84af-406c1193addf', 'demo-student-3', '2026-08-02', 'PRESENT', NULL, '2026-08-02 09:21:59.260', '2026-08-02 09:21:59.260'),
('18111f65-4c4f-49ea-8e96-0b027a84026d', 'demo-student-1', '2026-08-09', 'PRESENT', NULL, '2026-08-09 06:14:35.098', '2026-08-09 06:14:35.098'),
('32f9c01a-ec86-4836-9b44-73611fc22ec2', 'demo-student-1', '2026-08-02', 'ABSENT', NULL, '2026-08-02 09:21:59.254', '2026-08-02 09:21:59.254'),
('441ca80a-efe2-4b21-a5b9-c027632b03b9', 'demo-student-3', '2026-08-10', 'PRESENT', NULL, '2026-08-10 06:33:57.026', '2026-08-10 06:33:57.026'),
('5d4517ea-487b-43f5-9d8f-18cea57107ea', 'demo-student-3', '2026-08-06', 'PRESENT', NULL, '2026-08-06 05:52:48.332', '2026-08-06 05:52:48.332'),
('8f7b33fc-9c51-4eb8-a52e-60abb18e3d8c', 'demo-student-1', '2026-08-10', 'PRESENT', NULL, '2026-08-10 06:33:57.009', '2026-08-10 06:33:57.009'),
('b8e5faec-c7f6-4fc5-a9a3-8ce63c9b08d1', 'demo-student-3', '2026-08-09', 'PRESENT', NULL, '2026-08-09 06:14:35.115', '2026-08-09 06:14:35.115'),
('demo-daily-attendance-0-1', 'demo-student-1', '2026-08-01', 'ABSENT', NULL, '2026-08-02 08:57:57.040', '2026-08-02 08:57:57.040'),
('demo-daily-attendance-0-10', 'demo-student-10', '2026-08-01', 'LATE', NULL, '2026-08-02 08:57:57.133', '2026-08-02 08:57:57.133'),
('demo-daily-attendance-0-11', 'demo-student-11', '2026-08-01', 'PRESENT', NULL, '2026-08-02 08:57:57.143', '2026-08-02 08:57:57.143'),
('demo-daily-attendance-0-12', 'demo-student-12', '2026-08-01', 'PRESENT', NULL, '2026-08-02 08:57:57.149', '2026-08-02 08:57:57.149'),
('demo-daily-attendance-0-13', 'demo-student-13', '2026-08-01', 'PRESENT', NULL, '2026-08-02 08:57:57.157', '2026-08-02 08:57:57.157'),
('demo-daily-attendance-0-14', 'demo-student-14', '2026-08-01', 'ABSENT', NULL, '2026-08-02 08:57:57.164', '2026-08-02 08:57:57.164'),
('demo-daily-attendance-0-15', 'demo-student-15', '2026-08-01', 'PRESENT', NULL, '2026-08-02 08:57:57.174', '2026-08-02 08:57:57.174'),
('demo-daily-attendance-0-16', 'demo-student-16', '2026-08-01', 'PRESENT', NULL, '2026-08-02 08:57:57.182', '2026-08-02 08:57:57.182'),
('demo-daily-attendance-0-17', 'demo-student-17', '2026-08-01', 'PRESENT', NULL, '2026-08-02 08:57:57.190', '2026-08-02 08:57:57.190'),
('demo-daily-attendance-0-18', 'demo-student-18', '2026-08-01', 'PRESENT', NULL, '2026-08-02 08:57:57.196', '2026-08-02 08:57:57.196'),
('demo-daily-attendance-0-19', 'demo-student-19', '2026-08-01', 'LATE', NULL, '2026-08-02 08:57:57.205', '2026-08-02 08:57:57.205'),
('demo-daily-attendance-0-2', 'demo-student-2', '2026-08-01', 'PRESENT', NULL, '2026-08-02 08:57:57.047', '2026-08-02 08:57:57.047'),
('demo-daily-attendance-0-20', 'demo-student-20', '2026-08-01', 'PRESENT', NULL, '2026-08-02 08:57:57.216', '2026-08-02 08:57:57.216'),
('demo-daily-attendance-0-3', 'demo-student-3', '2026-08-01', 'PRESENT', NULL, '2026-08-02 08:57:57.054', '2026-08-02 08:57:57.054'),
('demo-daily-attendance-0-4', 'demo-student-4', '2026-08-01', 'PRESENT', NULL, '2026-08-02 08:57:57.090', '2026-08-02 08:57:57.090'),
('demo-daily-attendance-0-5', 'demo-student-5', '2026-08-01', 'PRESENT', NULL, '2026-08-02 08:57:57.097', '2026-08-02 08:57:57.097'),
('demo-daily-attendance-0-6', 'demo-student-6', '2026-08-01', 'PRESENT', NULL, '2026-08-02 08:57:57.104', '2026-08-02 08:57:57.104'),
('demo-daily-attendance-0-7', 'demo-student-7', '2026-08-01', 'PRESENT', NULL, '2026-08-02 08:57:57.112', '2026-08-02 08:57:57.112'),
('demo-daily-attendance-0-8', 'demo-student-8', '2026-08-01', 'PRESENT', NULL, '2026-08-02 08:57:57.119', '2026-08-02 08:57:57.119'),
('demo-daily-attendance-0-9', 'demo-student-9', '2026-08-01', 'PRESENT', NULL, '2026-08-02 08:57:57.126', '2026-08-02 08:57:57.126'),
('demo-daily-attendance-1-1', 'demo-student-1', '2026-07-31', 'PRESENT', NULL, '2026-08-02 08:57:57.224', '2026-08-02 08:57:57.224'),
('demo-daily-attendance-1-10', 'demo-student-10', '2026-07-31', 'PRESENT', NULL, '2026-08-02 08:57:57.285', '2026-08-02 08:57:57.285'),
('demo-daily-attendance-1-11', 'demo-student-11', '2026-07-31', 'PRESENT', NULL, '2026-08-02 08:57:57.291', '2026-08-02 08:57:57.291'),
('demo-daily-attendance-1-12', 'demo-student-12', '2026-07-31', 'PRESENT', NULL, '2026-08-02 08:57:57.296', '2026-08-02 08:57:57.296'),
('demo-daily-attendance-1-13', 'demo-student-13', '2026-07-31', 'ABSENT', NULL, '2026-08-02 08:57:57.302', '2026-08-02 08:57:57.302'),
('demo-daily-attendance-1-14', 'demo-student-14', '2026-07-31', 'PRESENT', NULL, '2026-08-02 08:57:57.309', '2026-08-02 08:57:57.309'),
('demo-daily-attendance-1-15', 'demo-student-15', '2026-07-31', 'PRESENT', NULL, '2026-08-02 08:57:57.315', '2026-08-02 08:57:57.315'),
('demo-daily-attendance-1-16', 'demo-student-16', '2026-07-31', 'PRESENT', NULL, '2026-08-02 08:57:57.321', '2026-08-02 08:57:57.321'),
('demo-daily-attendance-1-17', 'demo-student-17', '2026-07-31', 'PRESENT', NULL, '2026-08-02 08:57:57.327', '2026-08-02 08:57:57.327'),
('demo-daily-attendance-1-18', 'demo-student-18', '2026-07-31', 'LATE', NULL, '2026-08-02 08:57:57.333', '2026-08-02 08:57:57.333'),
('demo-daily-attendance-1-19', 'demo-student-19', '2026-07-31', 'PRESENT', NULL, '2026-08-02 08:57:57.339', '2026-08-02 08:57:57.339'),
('demo-daily-attendance-1-2', 'demo-student-2', '2026-07-31', 'PRESENT', NULL, '2026-08-02 08:57:57.232', '2026-08-02 08:57:57.232'),
('demo-daily-attendance-1-20', 'demo-student-20', '2026-07-31', 'PRESENT', NULL, '2026-08-02 08:57:57.346', '2026-08-02 08:57:57.346'),
('demo-daily-attendance-1-3', 'demo-student-3', '2026-07-31', 'PRESENT', NULL, '2026-08-02 08:57:57.242', '2026-08-02 08:57:57.242'),
('demo-daily-attendance-1-4', 'demo-student-4', '2026-07-31', 'PRESENT', NULL, '2026-08-02 08:57:57.247', '2026-08-02 08:57:57.247'),
('demo-daily-attendance-1-5', 'demo-student-5', '2026-07-31', 'PRESENT', NULL, '2026-08-02 08:57:57.254', '2026-08-02 08:57:57.254'),
('demo-daily-attendance-1-6', 'demo-student-6', '2026-07-31', 'PRESENT', NULL, '2026-08-02 08:57:57.260', '2026-08-02 08:57:57.260'),
('demo-daily-attendance-1-7', 'demo-student-7', '2026-07-31', 'PRESENT', NULL, '2026-08-02 08:57:57.266', '2026-08-02 08:57:57.266'),
('demo-daily-attendance-1-8', 'demo-student-8', '2026-07-31', 'PRESENT', NULL, '2026-08-02 08:57:57.273', '2026-08-02 08:57:57.273'),
('demo-daily-attendance-1-9', 'demo-student-9', '2026-07-31', 'LATE', NULL, '2026-08-02 08:57:57.279', '2026-08-02 08:57:57.279'),
('demo-daily-attendance-2-1', 'demo-student-1', '2026-07-30', 'PRESENT', NULL, '2026-08-02 08:57:57.353', '2026-08-02 08:57:57.353'),
('demo-daily-attendance-2-10', 'demo-student-10', '2026-07-30', 'PRESENT', NULL, '2026-08-02 08:57:57.415', '2026-08-02 08:57:57.415'),
('demo-daily-attendance-2-11', 'demo-student-11', '2026-07-30', 'PRESENT', NULL, '2026-08-02 08:57:57.420', '2026-08-02 08:57:57.420'),
('demo-daily-attendance-2-12', 'demo-student-12', '2026-07-30', 'ABSENT', NULL, '2026-08-02 08:57:57.426', '2026-08-02 08:57:57.426'),
('demo-daily-attendance-2-13', 'demo-student-13', '2026-07-30', 'PRESENT', NULL, '2026-08-02 08:57:57.431', '2026-08-02 08:57:57.431'),
('demo-daily-attendance-2-14', 'demo-student-14', '2026-07-30', 'PRESENT', NULL, '2026-08-02 08:57:57.436', '2026-08-02 08:57:57.436'),
('demo-daily-attendance-2-15', 'demo-student-15', '2026-07-30', 'PRESENT', NULL, '2026-08-02 08:57:57.441', '2026-08-02 08:57:57.441'),
('demo-daily-attendance-2-16', 'demo-student-16', '2026-07-30', 'PRESENT', NULL, '2026-08-02 08:57:57.445', '2026-08-02 08:57:57.445'),
('demo-daily-attendance-2-17', 'demo-student-17', '2026-07-30', 'LATE', NULL, '2026-08-02 08:57:57.450', '2026-08-02 08:57:57.450'),
('demo-daily-attendance-2-18', 'demo-student-18', '2026-07-30', 'PRESENT', NULL, '2026-08-02 08:57:57.454', '2026-08-02 08:57:57.454'),
('demo-daily-attendance-2-19', 'demo-student-19', '2026-07-30', 'PRESENT', NULL, '2026-08-02 08:57:57.459', '2026-08-02 08:57:57.459'),
('demo-daily-attendance-2-2', 'demo-student-2', '2026-07-30', 'PRESENT', NULL, '2026-08-02 08:57:57.362', '2026-08-02 08:57:57.362'),
('demo-daily-attendance-2-20', 'demo-student-20', '2026-07-30', 'PRESENT', NULL, '2026-08-02 08:57:57.463', '2026-08-02 08:57:57.463'),
('demo-daily-attendance-2-3', 'demo-student-3', '2026-07-30', 'PRESENT', NULL, '2026-08-02 08:57:57.369', '2026-08-02 08:57:57.369'),
('demo-daily-attendance-2-4', 'demo-student-4', '2026-07-30', 'PRESENT', NULL, '2026-08-02 08:57:57.377', '2026-08-02 08:57:57.377'),
('demo-daily-attendance-2-5', 'demo-student-5', '2026-07-30', 'PRESENT', NULL, '2026-08-02 08:57:57.384', '2026-08-02 08:57:57.384'),
('demo-daily-attendance-2-6', 'demo-student-6', '2026-07-30', 'PRESENT', NULL, '2026-08-02 08:57:57.391', '2026-08-02 08:57:57.391'),
('demo-daily-attendance-2-7', 'demo-student-7', '2026-07-30', 'PRESENT', NULL, '2026-08-02 08:57:57.398', '2026-08-02 08:57:57.398'),
('demo-daily-attendance-2-8', 'demo-student-8', '2026-07-30', 'LATE', NULL, '2026-08-02 08:57:57.404', '2026-08-02 08:57:57.404'),
('demo-daily-attendance-2-9', 'demo-student-9', '2026-07-30', 'PRESENT', NULL, '2026-08-02 08:57:57.409', '2026-08-02 08:57:57.409'),
('demo-daily-attendance-3-1', 'demo-student-1', '2026-07-29', 'PRESENT', NULL, '2026-08-02 08:57:57.468', '2026-08-02 08:57:57.468'),
('demo-daily-attendance-3-10', 'demo-student-10', '2026-07-29', 'PRESENT', NULL, '2026-08-02 08:57:57.508', '2026-08-02 08:57:57.508'),
('demo-daily-attendance-3-11', 'demo-student-11', '2026-07-29', 'ABSENT', NULL, '2026-08-02 08:57:57.513', '2026-08-02 08:57:57.513'),
('demo-daily-attendance-3-12', 'demo-student-12', '2026-07-29', 'PRESENT', NULL, '2026-08-02 08:57:57.517', '2026-08-02 08:57:57.517'),
('demo-daily-attendance-3-13', 'demo-student-13', '2026-07-29', 'PRESENT', NULL, '2026-08-02 08:57:57.521', '2026-08-02 08:57:57.521'),
('demo-daily-attendance-3-14', 'demo-student-14', '2026-07-29', 'PRESENT', NULL, '2026-08-02 08:57:57.526', '2026-08-02 08:57:57.526'),
('demo-daily-attendance-3-15', 'demo-student-15', '2026-07-29', 'PRESENT', NULL, '2026-08-02 08:57:57.530', '2026-08-02 08:57:57.530'),
('demo-daily-attendance-3-16', 'demo-student-16', '2026-07-29', 'LATE', NULL, '2026-08-02 08:57:57.534', '2026-08-02 08:57:57.534'),
('demo-daily-attendance-3-17', 'demo-student-17', '2026-07-29', 'PRESENT', NULL, '2026-08-02 08:57:57.539', '2026-08-02 08:57:57.539'),
('demo-daily-attendance-3-18', 'demo-student-18', '2026-07-29', 'PRESENT', NULL, '2026-08-02 08:57:57.543', '2026-08-02 08:57:57.543'),
('demo-daily-attendance-3-19', 'demo-student-19', '2026-07-29', 'PRESENT', NULL, '2026-08-02 08:57:57.548', '2026-08-02 08:57:57.548'),
('demo-daily-attendance-3-2', 'demo-student-2', '2026-07-29', 'PRESENT', NULL, '2026-08-02 08:57:57.472', '2026-08-02 08:57:57.472'),
('demo-daily-attendance-3-20', 'demo-student-20', '2026-07-29', 'PRESENT', NULL, '2026-08-02 08:57:57.552', '2026-08-02 08:57:57.552'),
('demo-daily-attendance-3-3', 'demo-student-3', '2026-07-29', 'PRESENT', NULL, '2026-08-02 08:57:57.477', '2026-08-02 08:57:57.477'),
('demo-daily-attendance-3-4', 'demo-student-4', '2026-07-29', 'PRESENT', NULL, '2026-08-02 08:57:57.481', '2026-08-02 08:57:57.481'),
('demo-daily-attendance-3-5', 'demo-student-5', '2026-07-29', 'PRESENT', NULL, '2026-08-02 08:57:57.486', '2026-08-02 08:57:57.486'),
('demo-daily-attendance-3-6', 'demo-student-6', '2026-07-29', 'PRESENT', NULL, '2026-08-02 08:57:57.491', '2026-08-02 08:57:57.491'),
('demo-daily-attendance-3-7', 'demo-student-7', '2026-07-29', 'LATE', NULL, '2026-08-02 08:57:57.495', '2026-08-02 08:57:57.495'),
('demo-daily-attendance-3-8', 'demo-student-8', '2026-07-29', 'PRESENT', NULL, '2026-08-02 08:57:57.499', '2026-08-02 08:57:57.499'),
('demo-daily-attendance-3-9', 'demo-student-9', '2026-07-29', 'PRESENT', NULL, '2026-08-02 08:57:57.504', '2026-08-02 08:57:57.504'),
('demo-daily-attendance-4-1', 'demo-student-1', '2026-07-28', 'PRESENT', NULL, '2026-08-02 08:57:57.556', '2026-08-02 08:57:57.556'),
('demo-daily-attendance-4-10', 'demo-student-10', '2026-07-28', 'ABSENT', NULL, '2026-08-02 08:57:57.598', '2026-08-02 08:57:57.598'),
('demo-daily-attendance-4-11', 'demo-student-11', '2026-07-28', 'PRESENT', NULL, '2026-08-02 08:57:57.602', '2026-08-02 08:57:57.602'),
('demo-daily-attendance-4-12', 'demo-student-12', '2026-07-28', 'PRESENT', NULL, '2026-08-02 08:57:57.607', '2026-08-02 08:57:57.607'),
('demo-daily-attendance-4-13', 'demo-student-13', '2026-07-28', 'PRESENT', NULL, '2026-08-02 08:57:57.611', '2026-08-02 08:57:57.611'),
('demo-daily-attendance-4-14', 'demo-student-14', '2026-07-28', 'PRESENT', NULL, '2026-08-02 08:57:57.616', '2026-08-02 08:57:57.616'),
('demo-daily-attendance-4-15', 'demo-student-15', '2026-07-28', 'LATE', NULL, '2026-08-02 08:57:57.620', '2026-08-02 08:57:57.620'),
('demo-daily-attendance-4-16', 'demo-student-16', '2026-07-28', 'PRESENT', NULL, '2026-08-02 08:57:57.625', '2026-08-02 08:57:57.625'),
('demo-daily-attendance-4-17', 'demo-student-17', '2026-07-28', 'PRESENT', NULL, '2026-08-02 08:57:57.629', '2026-08-02 08:57:57.629'),
('demo-daily-attendance-4-18', 'demo-student-18', '2026-07-28', 'PRESENT', NULL, '2026-08-02 08:57:57.634', '2026-08-02 08:57:57.634'),
('demo-daily-attendance-4-19', 'demo-student-19', '2026-07-28', 'PRESENT', NULL, '2026-08-02 08:57:57.638', '2026-08-02 08:57:57.638'),
('demo-daily-attendance-4-2', 'demo-student-2', '2026-07-28', 'PRESENT', NULL, '2026-08-02 08:57:57.561', '2026-08-02 08:57:57.561'),
('demo-daily-attendance-4-20', 'demo-student-20', '2026-07-28', 'PRESENT', NULL, '2026-08-02 08:57:57.643', '2026-08-02 08:57:57.643'),
('demo-daily-attendance-4-3', 'demo-student-3', '2026-07-28', 'PRESENT', NULL, '2026-08-02 08:57:57.565', '2026-08-02 08:57:57.565'),
('demo-daily-attendance-4-4', 'demo-student-4', '2026-07-28', 'PRESENT', NULL, '2026-08-02 08:57:57.570', '2026-08-02 08:57:57.570'),
('demo-daily-attendance-4-5', 'demo-student-5', '2026-07-28', 'PRESENT', NULL, '2026-08-02 08:57:57.574', '2026-08-02 08:57:57.574'),
('demo-daily-attendance-4-6', 'demo-student-6', '2026-07-28', 'LATE', NULL, '2026-08-02 08:57:57.579', '2026-08-02 08:57:57.579'),
('demo-daily-attendance-4-7', 'demo-student-7', '2026-07-28', 'PRESENT', NULL, '2026-08-02 08:57:57.584', '2026-08-02 08:57:57.584'),
('demo-daily-attendance-4-8', 'demo-student-8', '2026-07-28', 'PRESENT', NULL, '2026-08-02 08:57:57.589', '2026-08-02 08:57:57.589'),
('demo-daily-attendance-4-9', 'demo-student-9', '2026-07-28', 'PRESENT', NULL, '2026-08-02 08:57:57.593', '2026-08-02 08:57:57.593'),
('demo-daily-attendance-5-1', 'demo-student-1', '2026-07-27', 'PRESENT', NULL, '2026-08-02 08:57:57.647', '2026-08-02 08:57:57.647'),
('demo-daily-attendance-5-10', 'demo-student-10', '2026-07-27', 'PRESENT', NULL, '2026-08-02 08:57:57.688', '2026-08-02 08:57:57.688'),
('demo-daily-attendance-5-11', 'demo-student-11', '2026-07-27', 'PRESENT', NULL, '2026-08-02 08:57:57.693', '2026-08-02 08:57:57.693'),
('demo-daily-attendance-5-12', 'demo-student-12', '2026-07-27', 'PRESENT', NULL, '2026-08-02 08:57:57.697', '2026-08-02 08:57:57.697'),
('demo-daily-attendance-5-13', 'demo-student-13', '2026-07-27', 'PRESENT', NULL, '2026-08-02 08:57:57.702', '2026-08-02 08:57:57.702'),
('demo-daily-attendance-5-14', 'demo-student-14', '2026-07-27', 'LATE', NULL, '2026-08-02 08:57:57.707', '2026-08-02 08:57:57.707'),
('demo-daily-attendance-5-15', 'demo-student-15', '2026-07-27', 'PRESENT', NULL, '2026-08-02 08:57:57.712', '2026-08-02 08:57:57.712'),
('demo-daily-attendance-5-16', 'demo-student-16', '2026-07-27', 'PRESENT', NULL, '2026-08-02 08:57:57.717', '2026-08-02 08:57:57.717'),
('demo-daily-attendance-5-17', 'demo-student-17', '2026-07-27', 'PRESENT', NULL, '2026-08-02 08:57:57.721', '2026-08-02 08:57:57.721'),
('demo-daily-attendance-5-18', 'demo-student-18', '2026-07-27', 'PRESENT', NULL, '2026-08-02 08:57:57.726', '2026-08-02 08:57:57.726'),
('demo-daily-attendance-5-19', 'demo-student-19', '2026-07-27', 'PRESENT', NULL, '2026-08-02 08:57:57.731', '2026-08-02 08:57:57.731'),
('demo-daily-attendance-5-2', 'demo-student-2', '2026-07-27', 'PRESENT', NULL, '2026-08-02 08:57:57.652', '2026-08-02 08:57:57.652'),
('demo-daily-attendance-5-20', 'demo-student-20', '2026-07-27', 'PRESENT', NULL, '2026-08-02 08:57:57.736', '2026-08-02 08:57:57.736'),
('demo-daily-attendance-5-3', 'demo-student-3', '2026-07-27', 'PRESENT', NULL, '2026-08-02 08:57:57.656', '2026-08-02 08:57:57.656'),
('demo-daily-attendance-5-4', 'demo-student-4', '2026-07-27', 'PRESENT', NULL, '2026-08-02 08:57:57.661', '2026-08-02 08:57:57.661'),
('demo-daily-attendance-5-5', 'demo-student-5', '2026-07-27', 'LATE', NULL, '2026-08-02 08:57:57.665', '2026-08-02 08:57:57.665'),
('demo-daily-attendance-5-6', 'demo-student-6', '2026-07-27', 'PRESENT', NULL, '2026-08-02 08:57:57.669', '2026-08-02 08:57:57.669'),
('demo-daily-attendance-5-7', 'demo-student-7', '2026-07-27', 'PRESENT', NULL, '2026-08-02 08:57:57.674', '2026-08-02 08:57:57.674'),
('demo-daily-attendance-5-8', 'demo-student-8', '2026-07-27', 'PRESENT', NULL, '2026-08-02 08:57:57.678', '2026-08-02 08:57:57.678'),
('demo-daily-attendance-5-9', 'demo-student-9', '2026-07-27', 'ABSENT', NULL, '2026-08-02 08:57:57.683', '2026-08-02 08:57:57.683'),
('demo-daily-attendance-6-1', 'demo-student-1', '2026-07-26', 'PRESENT', NULL, '2026-08-02 08:57:57.740', '2026-08-02 08:57:57.740'),
('demo-daily-attendance-6-10', 'demo-student-10', '2026-07-26', 'PRESENT', NULL, '2026-08-02 08:57:57.788', '2026-08-02 08:57:57.788'),
('demo-daily-attendance-6-11', 'demo-student-11', '2026-07-26', 'PRESENT', NULL, '2026-08-02 08:57:57.793', '2026-08-02 08:57:57.793'),
('demo-daily-attendance-6-12', 'demo-student-12', '2026-07-26', 'PRESENT', NULL, '2026-08-02 08:57:57.798', '2026-08-02 08:57:57.798'),
('demo-daily-attendance-6-13', 'demo-student-13', '2026-07-26', 'LATE', NULL, '2026-08-02 08:57:57.803', '2026-08-02 08:57:57.803'),
('demo-daily-attendance-6-14', 'demo-student-14', '2026-07-26', 'PRESENT', NULL, '2026-08-02 08:57:57.808', '2026-08-02 08:57:57.808'),
('demo-daily-attendance-6-15', 'demo-student-15', '2026-07-26', 'PRESENT', NULL, '2026-08-02 08:57:57.813', '2026-08-02 08:57:57.813'),
('demo-daily-attendance-6-16', 'demo-student-16', '2026-07-26', 'PRESENT', NULL, '2026-08-02 08:57:57.818', '2026-08-02 08:57:57.818'),
('demo-daily-attendance-6-17', 'demo-student-17', '2026-07-26', 'PRESENT', NULL, '2026-08-02 08:57:57.822', '2026-08-02 08:57:57.822'),
('demo-daily-attendance-6-18', 'demo-student-18', '2026-07-26', 'PRESENT', NULL, '2026-08-02 08:57:57.827', '2026-08-02 08:57:57.827'),
('demo-daily-attendance-6-19', 'demo-student-19', '2026-07-26', 'PRESENT', NULL, '2026-08-02 08:57:57.832', '2026-08-02 08:57:57.832'),
('demo-daily-attendance-6-2', 'demo-student-2', '2026-07-26', 'PRESENT', NULL, '2026-08-02 08:57:57.745', '2026-08-02 08:57:57.745'),
('demo-daily-attendance-6-20', 'demo-student-20', '2026-07-26', 'PRESENT', NULL, '2026-08-02 08:57:57.837', '2026-08-02 08:57:57.837'),
('demo-daily-attendance-6-3', 'demo-student-3', '2026-07-26', 'PRESENT', NULL, '2026-08-02 08:57:57.750', '2026-08-02 08:57:57.750'),
('demo-daily-attendance-6-4', 'demo-student-4', '2026-07-26', 'LATE', NULL, '2026-08-02 08:57:57.755', '2026-08-02 08:57:57.755'),
('demo-daily-attendance-6-5', 'demo-student-5', '2026-07-26', 'PRESENT', NULL, '2026-08-02 08:57:57.760', '2026-08-02 08:57:57.760'),
('demo-daily-attendance-6-6', 'demo-student-6', '2026-07-26', 'PRESENT', NULL, '2026-08-02 08:57:57.765', '2026-08-02 08:57:57.765'),
('demo-daily-attendance-6-7', 'demo-student-7', '2026-07-26', 'PRESENT', NULL, '2026-08-02 08:57:57.771', '2026-08-02 08:57:57.771'),
('demo-daily-attendance-6-8', 'demo-student-8', '2026-07-26', 'ABSENT', NULL, '2026-08-02 08:57:57.777', '2026-08-02 08:57:57.777'),
('demo-daily-attendance-6-9', 'demo-student-9', '2026-07-26', 'PRESENT', NULL, '2026-08-02 08:57:57.783', '2026-08-02 08:57:57.783'),
('demo-daily-attendance-7-1', 'demo-student-1', '2026-07-25', 'PRESENT', NULL, '2026-08-02 08:57:57.842', '2026-08-02 08:57:57.842'),
('demo-daily-attendance-7-10', 'demo-student-10', '2026-07-25', 'PRESENT', NULL, '2026-08-02 08:57:57.887', '2026-08-02 08:57:57.887'),
('demo-daily-attendance-7-11', 'demo-student-11', '2026-07-25', 'PRESENT', NULL, '2026-08-02 08:57:57.892', '2026-08-02 08:57:57.892'),
('demo-daily-attendance-7-12', 'demo-student-12', '2026-07-25', 'LATE', NULL, '2026-08-02 08:57:57.897', '2026-08-02 08:57:57.897'),
('demo-daily-attendance-7-13', 'demo-student-13', '2026-07-25', 'PRESENT', NULL, '2026-08-02 08:57:57.901', '2026-08-02 08:57:57.901'),
('demo-daily-attendance-7-14', 'demo-student-14', '2026-07-25', 'PRESENT', NULL, '2026-08-02 08:57:57.906', '2026-08-02 08:57:57.906'),
('demo-daily-attendance-7-15', 'demo-student-15', '2026-07-25', 'PRESENT', NULL, '2026-08-02 08:57:57.911', '2026-08-02 08:57:57.911'),
('demo-daily-attendance-7-16', 'demo-student-16', '2026-07-25', 'PRESENT', NULL, '2026-08-02 08:57:57.915', '2026-08-02 08:57:57.915'),
('demo-daily-attendance-7-17', 'demo-student-17', '2026-07-25', 'PRESENT', NULL, '2026-08-02 08:57:57.919', '2026-08-02 08:57:57.919'),
('demo-daily-attendance-7-18', 'demo-student-18', '2026-07-25', 'PRESENT', NULL, '2026-08-02 08:57:57.924', '2026-08-02 08:57:57.924'),
('demo-daily-attendance-7-19', 'demo-student-19', '2026-07-25', 'PRESENT', NULL, '2026-08-02 08:57:57.929', '2026-08-02 08:57:57.929'),
('demo-daily-attendance-7-2', 'demo-student-2', '2026-07-25', 'PRESENT', NULL, '2026-08-02 08:57:57.848', '2026-08-02 08:57:57.848'),
('demo-daily-attendance-7-20', 'demo-student-20', '2026-07-25', 'ABSENT', NULL, '2026-08-02 08:57:57.933', '2026-08-02 08:57:57.933'),
('demo-daily-attendance-7-3', 'demo-student-3', '2026-07-25', 'LATE', NULL, '2026-08-02 08:57:57.853', '2026-08-02 08:57:57.853'),
('demo-daily-attendance-7-4', 'demo-student-4', '2026-07-25', 'PRESENT', NULL, '2026-08-02 08:57:57.857', '2026-08-02 08:57:57.857'),
('demo-daily-attendance-7-5', 'demo-student-5', '2026-07-25', 'PRESENT', NULL, '2026-08-02 08:57:57.863', '2026-08-02 08:57:57.863'),
('demo-daily-attendance-7-6', 'demo-student-6', '2026-07-25', 'PRESENT', NULL, '2026-08-02 08:57:57.867', '2026-08-02 08:57:57.867'),
('demo-daily-attendance-7-7', 'demo-student-7', '2026-07-25', 'ABSENT', NULL, '2026-08-02 08:57:57.872', '2026-08-02 08:57:57.872'),
('demo-daily-attendance-7-8', 'demo-student-8', '2026-07-25', 'PRESENT', NULL, '2026-08-02 08:57:57.878', '2026-08-02 08:57:57.878'),
('demo-daily-attendance-7-9', 'demo-student-9', '2026-07-25', 'PRESENT', NULL, '2026-08-02 08:57:57.882', '2026-08-02 08:57:57.882'),
('demo-daily-attendance-8-1', 'demo-student-1', '2026-07-24', 'PRESENT', NULL, '2026-08-02 08:57:57.937', '2026-08-02 08:57:57.937'),
('demo-daily-attendance-8-10', 'demo-student-10', '2026-07-24', 'PRESENT', NULL, '2026-08-02 08:57:57.978', '2026-08-02 08:57:57.978'),
('demo-daily-attendance-8-11', 'demo-student-11', '2026-07-24', 'LATE', NULL, '2026-08-02 08:57:57.983', '2026-08-02 08:57:57.983'),
('demo-daily-attendance-8-12', 'demo-student-12', '2026-07-24', 'PRESENT', NULL, '2026-08-02 08:57:57.987', '2026-08-02 08:57:57.987'),
('demo-daily-attendance-8-13', 'demo-student-13', '2026-07-24', 'PRESENT', NULL, '2026-08-02 08:57:57.992', '2026-08-02 08:57:57.992'),
('demo-daily-attendance-8-14', 'demo-student-14', '2026-07-24', 'PRESENT', NULL, '2026-08-02 08:57:57.996', '2026-08-02 08:57:57.996'),
('demo-daily-attendance-8-15', 'demo-student-15', '2026-07-24', 'PRESENT', NULL, '2026-08-02 08:57:58.000', '2026-08-02 08:57:58.000'),
('demo-daily-attendance-8-16', 'demo-student-16', '2026-07-24', 'PRESENT', NULL, '2026-08-02 08:57:58.005', '2026-08-02 08:57:58.005'),
('demo-daily-attendance-8-17', 'demo-student-17', '2026-07-24', 'PRESENT', NULL, '2026-08-02 08:57:58.010', '2026-08-02 08:57:58.010'),
('demo-daily-attendance-8-18', 'demo-student-18', '2026-07-24', 'PRESENT', NULL, '2026-08-02 08:57:58.015', '2026-08-02 08:57:58.015'),
('demo-daily-attendance-8-19', 'demo-student-19', '2026-07-24', 'ABSENT', NULL, '2026-08-02 08:57:58.020', '2026-08-02 08:57:58.020'),
('demo-daily-attendance-8-2', 'demo-student-2', '2026-07-24', 'LATE', NULL, '2026-08-02 08:57:57.942', '2026-08-02 08:57:57.942'),
('demo-daily-attendance-8-20', 'demo-student-20', '2026-07-24', 'LATE', NULL, '2026-08-02 08:57:58.027', '2026-08-02 08:57:58.027'),
('demo-daily-attendance-8-3', 'demo-student-3', '2026-07-24', 'PRESENT', NULL, '2026-08-02 08:57:57.947', '2026-08-02 08:57:57.947'),
('demo-daily-attendance-8-4', 'demo-student-4', '2026-07-24', 'PRESENT', NULL, '2026-08-02 08:57:57.951', '2026-08-02 08:57:57.951'),
('demo-daily-attendance-8-5', 'demo-student-5', '2026-07-24', 'PRESENT', NULL, '2026-08-02 08:57:57.955', '2026-08-02 08:57:57.955'),
('demo-daily-attendance-8-6', 'demo-student-6', '2026-07-24', 'ABSENT', NULL, '2026-08-02 08:57:57.960', '2026-08-02 08:57:57.960'),
('demo-daily-attendance-8-7', 'demo-student-7', '2026-07-24', 'PRESENT', NULL, '2026-08-02 08:57:57.965', '2026-08-02 08:57:57.965'),
('demo-daily-attendance-8-8', 'demo-student-8', '2026-07-24', 'PRESENT', NULL, '2026-08-02 08:57:57.969', '2026-08-02 08:57:57.969'),
('demo-daily-attendance-8-9', 'demo-student-9', '2026-07-24', 'PRESENT', NULL, '2026-08-02 08:57:57.974', '2026-08-02 08:57:57.974'),
('demo-daily-attendance-9-1', 'demo-student-1', '2026-07-23', 'LATE', NULL, '2026-08-02 08:57:58.034', '2026-08-02 08:57:58.034'),
('demo-daily-attendance-9-10', 'demo-student-10', '2026-07-23', 'LATE', NULL, '2026-08-02 08:57:58.096', '2026-08-02 08:57:58.096'),
('demo-daily-attendance-9-11', 'demo-student-11', '2026-07-23', 'PRESENT', NULL, '2026-08-02 08:57:58.121', '2026-08-02 08:57:58.121'),
('demo-daily-attendance-9-12', 'demo-student-12', '2026-07-23', 'PRESENT', NULL, '2026-08-02 08:57:58.133', '2026-08-02 08:57:58.133'),
('demo-daily-attendance-9-13', 'demo-student-13', '2026-07-23', 'PRESENT', NULL, '2026-08-02 08:57:58.143', '2026-08-02 08:57:58.143'),
('demo-daily-attendance-9-14', 'demo-student-14', '2026-07-23', 'PRESENT', NULL, '2026-08-02 08:57:58.172', '2026-08-02 08:57:58.172'),
('demo-daily-attendance-9-15', 'demo-student-15', '2026-07-23', 'PRESENT', NULL, '2026-08-02 08:57:58.184', '2026-08-02 08:57:58.184'),
('demo-daily-attendance-9-16', 'demo-student-16', '2026-07-23', 'PRESENT', NULL, '2026-08-02 08:57:58.194', '2026-08-02 08:57:58.194'),
('demo-daily-attendance-9-17', 'demo-student-17', '2026-07-23', 'PRESENT', NULL, '2026-08-02 08:57:58.205', '2026-08-02 08:57:58.205'),
('demo-daily-attendance-9-18', 'demo-student-18', '2026-07-23', 'ABSENT', NULL, '2026-08-02 08:57:58.214', '2026-08-02 08:57:58.214'),
('demo-daily-attendance-9-19', 'demo-student-19', '2026-07-23', 'LATE', NULL, '2026-08-02 08:57:58.221', '2026-08-02 08:57:58.221'),
('demo-daily-attendance-9-2', 'demo-student-2', '2026-07-23', 'PRESENT', NULL, '2026-08-02 08:57:58.041', '2026-08-02 08:57:58.041'),
('demo-daily-attendance-9-20', 'demo-student-20', '2026-07-23', 'PRESENT', NULL, '2026-08-02 08:57:58.229', '2026-08-02 08:57:58.229'),
('demo-daily-attendance-9-3', 'demo-student-3', '2026-07-23', 'PRESENT', NULL, '2026-08-02 08:57:58.047', '2026-08-02 08:57:58.047'),
('demo-daily-attendance-9-4', 'demo-student-4', '2026-07-23', 'PRESENT', NULL, '2026-08-02 08:57:58.053', '2026-08-02 08:57:58.053'),
('demo-daily-attendance-9-5', 'demo-student-5', '2026-07-23', 'ABSENT', NULL, '2026-08-02 08:57:58.060', '2026-08-02 08:57:58.060'),
('demo-daily-attendance-9-6', 'demo-student-6', '2026-07-23', 'PRESENT', NULL, '2026-08-02 08:57:58.066', '2026-08-02 08:57:58.066'),
('demo-daily-attendance-9-7', 'demo-student-7', '2026-07-23', 'PRESENT', NULL, '2026-08-02 08:57:58.072', '2026-08-02 08:57:58.072'),
('demo-daily-attendance-9-8', 'demo-student-8', '2026-07-23', 'PRESENT', NULL, '2026-08-02 08:57:58.079', '2026-08-02 08:57:58.079'),
('demo-daily-attendance-9-9', 'demo-student-9', '2026-07-23', 'PRESENT', NULL, '2026-08-02 08:57:58.086', '2026-08-02 08:57:58.086'),
('fa23530d-2127-4271-93c0-ffff52e23296', 'demo-student-1', '2026-08-06', 'ABSENT', NULL, '2026-08-06 05:52:48.324', '2026-08-06 05:52:48.324');

-- --------------------------------------------------------

--
-- Table structure for table `attendance_corrections`
--

CREATE TABLE `attendance_corrections` (
  `id` varchar(191) NOT NULL,
  `school_id` varchar(191) NOT NULL,
  `attendance_type` varchar(191) NOT NULL,
  `target_id` varchar(191) NOT NULL,
  `date` datetime(3) NOT NULL,
  `current_status` varchar(191) NOT NULL,
  `requested_status` varchar(191) NOT NULL,
  `reason` text NOT NULL,
  `requested_by_id` varchar(191) NOT NULL,
  `status` varchar(191) NOT NULL DEFAULT 'PENDING',
  `approved_by_id` varchar(191) DEFAULT NULL,
  `approved_at` datetime(3) DEFAULT NULL,
  `created_at` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updated_at` datetime(3) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `attendance_notifications`
--

CREATE TABLE `attendance_notifications` (
  `id` varchar(191) NOT NULL,
  `school_id` varchar(191) NOT NULL,
  `student_id` varchar(191) NOT NULL,
  `guardian_id` varchar(191) DEFAULT NULL,
  `attendance_date` datetime(3) NOT NULL,
  `channel` varchar(191) NOT NULL DEFAULT 'PORTAL',
  `delivery_status` varchar(191) NOT NULL DEFAULT 'DELIVERED',
  `message` text NOT NULL,
  `created_at` datetime(3) NOT NULL DEFAULT current_timestamp(3)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `attendance_sessions`
--

CREATE TABLE `attendance_sessions` (
  `id` varchar(191) NOT NULL,
  `school_id` varchar(191) NOT NULL,
  `academic_year_id` varchar(191) NOT NULL,
  `class_id` varchar(191) NOT NULL,
  `section_id` varchar(191) NOT NULL,
  `subject_id` varchar(191) DEFAULT NULL,
  `period_id` varchar(191) DEFAULT NULL,
  `date` datetime(3) NOT NULL,
  `session_type` varchar(191) NOT NULL DEFAULT 'DAILY',
  `taken_by_id` varchar(191) NOT NULL,
  `status` varchar(191) NOT NULL DEFAULT 'SUBMITTED',
  `created_at` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updated_at` datetime(3) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `attendance_sessions`
--

INSERT INTO `attendance_sessions` (`id`, `school_id`, `academic_year_id`, `class_id`, `section_id`, `subject_id`, `period_id`, `date`, `session_type`, `taken_by_id`, `status`, `created_at`, `updated_at`) VALUES
('07348811-1580-4b07-9b20-8170962932c9', '7b2b510e-dab0-4f0f-9aae-f1d27c9de59c', 'demo-academic-year-current', 'demo-class-6', 'demo-section-6-1', NULL, NULL, '2026-08-05 18:00:00.000', 'DAILY', 'fc9940e7-a1ca-4996-877e-15b70ff8da36', 'SUBMITTED', '2026-08-06 05:52:48.312', '2026-08-06 05:52:48.312'),
('2579c18e-eae4-4d94-b7d3-8234c64777b1', '7b2b510e-dab0-4f0f-9aae-f1d27c9de59c', 'demo-academic-year-current', 'demo-class-6', 'demo-section-6-1', NULL, NULL, '2026-08-08 18:00:00.000', 'DAILY', 'fc9940e7-a1ca-4996-877e-15b70ff8da36', 'SUBMITTED', '2026-08-09 06:14:35.064', '2026-08-09 06:14:35.064'),
('58fac658-7819-4b30-9fc5-216357058f70', '7b2b510e-dab0-4f0f-9aae-f1d27c9de59c', 'demo-academic-year-current', 'demo-class-9', 'demo-section-9-1', 'demo-subject-ban', NULL, '2026-08-01 18:00:00.000', 'SUBJECT_WISE', 'fc9940e7-a1ca-4996-877e-15b70ff8da36', 'SUBMITTED', '2026-08-02 09:36:36.153', '2026-08-02 09:36:36.153'),
('b52db913-d2cd-49f5-bb31-09681871a0a5', '7b2b510e-dab0-4f0f-9aae-f1d27c9de59c', 'demo-academic-year-current', 'demo-class-6', 'demo-section-6-1', NULL, NULL, '2026-08-09 18:00:00.000', 'DAILY', 'a7e07343-b155-4218-9a29-f5bccb3a7eef', 'SUBMITTED', '2026-08-10 06:33:56.985', '2026-08-10 06:33:56.985'),
('bd0da709-ac33-4e7e-9f7a-b40bdf21ff77', '7b2b510e-dab0-4f0f-9aae-f1d27c9de59c', 'demo-academic-year-current', 'demo-class-6', 'demo-section-6-1', NULL, NULL, '2026-08-01 18:00:00.000', 'DAILY', '52897111-6585-4527-9211-1a20b7c2ff8f', 'SUBMITTED', '2026-08-02 09:21:59.245', '2026-08-02 09:21:59.245');

-- --------------------------------------------------------

--
-- Table structure for table `audit_logs`
--

CREATE TABLE `audit_logs` (
  `id` varchar(191) NOT NULL,
  `school_id` varchar(191) DEFAULT NULL,
  `user_id` varchar(191) DEFAULT NULL,
  `action` varchar(191) NOT NULL,
  `module` varchar(191) NOT NULL,
  `record_id` varchar(191) DEFAULT NULL,
  `details` text DEFAULT NULL,
  `ip_address` varchar(191) DEFAULT NULL,
  `created_at` datetime(3) NOT NULL DEFAULT current_timestamp(3)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `audit_logs`
--

INSERT INTO `audit_logs` (`id`, `school_id`, `user_id`, `action`, `module`, `record_id`, `details`, `ip_address`, `created_at`) VALUES
('0204b831-b217-4e20-85f8-77edf8c05431', '7b2b510e-dab0-4f0f-9aae-f1d27c9de59c', NULL, 'APPROVE_ADMISSION', 'ONLINE_ADMISSION', 'demo-admission-5', 'Approved admission for Abir Hasan (DEMO-APP-2026-5). Generated Student Code: STU-DEMO-APP-2026-5, Roll: #4', NULL, '2026-08-10 10:37:48.418'),
('0588bada-159f-4498-acba-c3889543699a', '7b2b510e-dab0-4f0f-9aae-f1d27c9de59c', '52897111-6585-4527-9211-1a20b7c2ff8f', 'DELETE', 'Exam Routine', '6f5e52a1-fafb-4a6f-a6ed-f42ade810168', 'Deleted exam schedule', NULL, '2026-08-02 09:59:14.227'),
('05dd4cae-e618-4787-b2ce-b3c2c305c7a4', '7b2b510e-dab0-4f0f-9aae-f1d27c9de59c', '52897111-6585-4527-9211-1a20b7c2ff8f', 'UPDATE', 'Marks Verification', 'demo-exam-upcoming', 'Verified and locked marks for subject demo-subject-ban', NULL, '2026-08-09 07:01:01.870'),
('066fec9c-b5b5-4cf5-8b68-80a0bbac1a1c', '7b2b510e-dab0-4f0f-9aae-f1d27c9de59c', '52897111-6585-4527-9211-1a20b7c2ff8f', 'UPDATE', 'Examinations', 'demo-exam-upcoming', 'Updated Half-Yearly Examination 2026', NULL, '2026-08-02 10:10:12.363'),
('08f02f7f-24ab-4573-9a33-ecdcd814c9fa', '7b2b510e-dab0-4f0f-9aae-f1d27c9de59c', 'e149fca0-f4f0-4018-bb35-89b9febd366a', 'CREATE', 'Payroll', '11bd5344-dee5-42d6-be3f-bf5fad4b3c78', 'Generated payroll 10/2026', NULL, '2026-08-10 10:56:40.130'),
('0923282c-4d1c-4951-877c-8ace49830d4e', '7b2b510e-dab0-4f0f-9aae-f1d27c9de59c', '52897111-6585-4527-9211-1a20b7c2ff8f', 'UPDATE', 'WEBSITE', 'fe11fc91-512a-4fe7-8687-558676c094b6', 'Public website content updated', NULL, '2026-08-03 09:03:14.389'),
('09e1c8a7-f4f3-473e-b075-18519f3b751c', NULL, NULL, 'CREATE', 'AcademicSessions', '893e6506-31d7-46e1-ad52-35021548fe76', 'Created session First Term / Semester', NULL, '2026-08-06 06:04:26.819'),
('0e2d388f-5ce3-4b8a-b18b-ccd30d93eff5', '7b2b510e-dab0-4f0f-9aae-f1d27c9de59c', '52897111-6585-4527-9211-1a20b7c2ff8f', 'UPDATE', 'WEBSITE', 'fe11fc91-512a-4fe7-8687-558676c094b6', 'Public website content updated', NULL, '2026-08-10 05:54:59.944'),
('0e33a88a-e2ec-47dd-92f6-f2ab7257c258', '7b2b510e-dab0-4f0f-9aae-f1d27c9de59c', '52897111-6585-4527-9211-1a20b7c2ff8f', 'UPDATE', 'WEBSITE', 'fe11fc91-512a-4fe7-8687-558676c094b6', 'Public website content updated', NULL, '2026-08-03 10:22:17.132'),
('0e4d5e2b-130a-4cba-ae18-c19ce8bcfb57', '7b2b510e-dab0-4f0f-9aae-f1d27c9de59c', 'e149fca0-f4f0-4018-bb35-89b9febd366a', 'CREATE', 'Payroll', '4c48cc94-fa29-443a-8efe-a3c03e49d30c', 'Generated payroll 11/2026', NULL, '2026-08-10 10:57:54.984'),
('0e4eba3e-c220-45f2-9a1e-9c2324c8737b', '7b2b510e-dab0-4f0f-9aae-f1d27c9de59c', '5d7880f3-2268-4ae9-a460-598270a02b81', 'CREATE', 'Staff Accounts', '5d7880f3-2268-4ae9-a460-598270a02b81', 'Created Teacher portal account and linked T-003', NULL, '2026-08-09 11:48:45.738'),
('165ebf50-afb2-46b3-9f63-eb1309906dba', '7b2b510e-dab0-4f0f-9aae-f1d27c9de59c', 'a7e07343-b155-4218-9a29-f5bccb3a7eef', 'UPDATE', 'Marks Entry', 'demo-exam-upcoming', 'Saved 2 marks for subject demo-subject-ban', NULL, '2026-08-09 06:55:41.471'),
('1a3cd286-8a34-4069-9411-450d68ed60c5', '7b2b510e-dab0-4f0f-9aae-f1d27c9de59c', '52897111-6585-4527-9211-1a20b7c2ff8f', 'UPDATE', 'Roles & Permissions', '8718c924-8bd7-49ca-8ef8-7022d668b826', '{\"role\":\"Teacher\",\"permissionCodes\":[\"marks.enter\",\"students.view\",\"attendance.manage\",\"attendance.view\",\"routines.view\",\"admissions.view\",\"exams.view\",\"homework.view\",\"homework.manage\",\"portal.teacher.view\"]}', NULL, '2026-08-09 06:45:22.348'),
('1a8df19f-3944-4319-a45b-6ab87a18eaf5', NULL, NULL, 'CREATE', 'AcademicSessions', 'd803797e-fb94-4be8-954a-b35e14490828', 'Created session First Term / Semester', NULL, '2026-08-06 06:04:42.506'),
('1ae7a60c-8e87-405c-9793-9fc455a75376', '7b2b510e-dab0-4f0f-9aae-f1d27c9de59c', 'fc9940e7-a1ca-4996-877e-15b70ff8da36', 'TOGGLE_STATUS', 'Result Publication', 'demo-exam-upcoming', 'Published results', NULL, '2026-08-09 05:53:26.104'),
('1b22080c-b3fd-46c6-86b7-eb917db2cb07', '7b2b510e-dab0-4f0f-9aae-f1d27c9de59c', '52897111-6585-4527-9211-1a20b7c2ff8f', 'CREATE', 'Users', '45ca485a-cb01-4f4d-be0d-0c3d281a6e29', 'Created Website Management account webmangement@school.test', NULL, '2026-08-10 08:23:44.566'),
('1d2f9910-09b8-4900-a917-8088339d0ae8', '7b2b510e-dab0-4f0f-9aae-f1d27c9de59c', '52897111-6585-4527-9211-1a20b7c2ff8f', 'UPDATE', 'WEBSITE', 'fe11fc91-512a-4fe7-8687-558676c094b6', 'Public website content updated', NULL, '2026-08-03 09:18:41.526'),
('1e22d511-37e8-4a14-aa24-8c0f07f380f5', '7b2b510e-dab0-4f0f-9aae-f1d27c9de59c', '3abadec3-facd-4bf2-a9e3-0011b00e884a', 'CREATE', 'Staff Accounts', '3abadec3-facd-4bf2-a9e3-0011b00e884a', 'Created Employee portal account and linked E-003', NULL, '2026-08-09 11:48:47.720'),
('20a40f67-0354-4897-b7df-f634895b470b', '7b2b510e-dab0-4f0f-9aae-f1d27c9de59c', '52897111-6585-4527-9211-1a20b7c2ff8f', 'UPDATE', 'Exam Routine', 'demo-exam-routine-6-1', 'Updated exam schedule', NULL, '2026-08-10 09:59:43.054'),
('21ebeccb-c6cb-490c-b3da-5793b6e6ba73', '7b2b510e-dab0-4f0f-9aae-f1d27c9de59c', '52897111-6585-4527-9211-1a20b7c2ff8f', 'UPDATE', 'WEBSITE', 'fe11fc91-512a-4fe7-8687-558676c094b6', 'Public website content updated', NULL, '2026-08-03 09:05:56.256'),
('22fec712-79e6-4404-b79c-92e5418e17c5', NULL, NULL, 'EXPORT', 'Reports', NULL, 'Exported student as csv (0 rows)', NULL, '2026-07-23 11:44:19.484'),
('23283321-5287-4fa6-916c-53da455ea9d3', '7b2b510e-dab0-4f0f-9aae-f1d27c9de59c', '52897111-6585-4527-9211-1a20b7c2ff8f', 'UPDATE', 'Roles & Permissions', '8718c924-8bd7-49ca-8ef8-7022d668b826', '{\"role\":\"Teacher\",\"permissionCodes\":[\"academic.view\",\"admissions.view\",\"attendance.view\",\"audit.view\",\"dashboard.view\",\"employees.view\",\"exams.view\",\"fees.view\",\"guardians.view\",\"homework.view\",\"departments.view\",\"designations.view\",\"imports.view\",\"leave.view\",\"payroll.view\",\"portal.employee.view\",\"portal.guardian.view\",\"portal.student.view\",\"portal.teacher.view\",\"reports.view\",\"roles.view\",\"routines.view\",\"students.view\",\"teacher-assignments.view\",\"teachers.view\",\"users.view\"]}', NULL, '2026-08-10 09:23:33.651'),
('25151959-9848-4291-8f45-2b7918b5af37', '7b2b510e-dab0-4f0f-9aae-f1d27c9de59c', '52897111-6585-4527-9211-1a20b7c2ff8f', 'UPDATE', 'Attendance', 'bd0da709-ac33-4e7e-9f7a-b40bdf21ff77', 'Submitted Class 6 - Padma attendance for 2 students on 2026-08-02', NULL, '2026-08-02 09:21:59.263'),
('255535b7-195c-4deb-b78f-384aba1b350d', '7b2b510e-dab0-4f0f-9aae-f1d27c9de59c', '52897111-6585-4527-9211-1a20b7c2ff8f', 'UPDATE', 'Roles & Permissions', '9ce2211c-729c-4dda-bed6-8fb76b417bad', '{\"role\":\"Student\",\"permissionCodes\":[]}', NULL, '2026-08-10 08:00:36.962'),
('25d67a27-d452-4147-b19e-3162fcbe5105', '7b2b510e-dab0-4f0f-9aae-f1d27c9de59c', 'fc9940e7-a1ca-4996-877e-15b70ff8da36', 'UPDATE', 'Attendance', '58fac658-7819-4b30-9fc5-216357058f70', 'Submitted Class 9 - Padma - Science - Bangla attendance for 2 students on 2026-08-02', NULL, '2026-08-02 09:36:36.169'),
('25fc07c4-0c12-46da-a13f-0bf99faa9baa', '7b2b510e-dab0-4f0f-9aae-f1d27c9de59c', '52897111-6585-4527-9211-1a20b7c2ff8f', 'UPDATE', 'Roles & Permissions', '4181ae83-e64c-4643-9eb8-91674a83d259', '{\"role\":\"Website Management\",\"permissionCodes\":[\"school.settings.manage\"]}', NULL, '2026-08-10 08:20:52.102'),
('262b699e-6e6f-41e8-98bb-4585dc5e8dfb', '7b2b510e-dab0-4f0f-9aae-f1d27c9de59c', '52897111-6585-4527-9211-1a20b7c2ff8f', 'UPDATE', 'WEBSITE', 'fe11fc91-512a-4fe7-8687-558676c094b6', 'Public website content updated', NULL, '2026-08-03 10:10:37.225'),
('29e399e3-fa58-459e-a1a0-d5a8bfa71463', '7b2b510e-dab0-4f0f-9aae-f1d27c9de59c', '52897111-6585-4527-9211-1a20b7c2ff8f', 'UPDATE', 'WEBSITE', 'fe11fc91-512a-4fe7-8687-558676c094b6', 'Public website content updated', NULL, '2026-08-10 05:47:41.409'),
('2fe0f1d6-3893-4535-9821-e66ab31fc99f', '7b2b510e-dab0-4f0f-9aae-f1d27c9de59c', '52897111-6585-4527-9211-1a20b7c2ff8f', 'UPDATE', 'Roles & Permissions', 'f017bebf-942a-4d49-b333-ee32d542fc48', '{\"role\":\"Accountant\",\"permissionCodes\":[\"payroll.generate\",\"payroll.approve\",\"students.view\",\"payments.collect\",\"fees.view\",\"reports.export\",\"payroll.view\",\"dashboard.view\",\"reports.view\",\"imports.view\",\"imports.manage\",\"audit.view\",\"fees.manage\",\"payments.reverse\"]}', NULL, '2026-08-10 10:54:36.780'),
('3139c460-da2c-432e-a49b-8c030bb20f37', '7b2b510e-dab0-4f0f-9aae-f1d27c9de59c', '52897111-6585-4527-9211-1a20b7c2ff8f', 'UPDATE', 'Users', '6ac6ded0-5140-4431-a494-acf3bf498491', 'Updated Teacher account codex.user.crud@school.test', NULL, '2026-08-02 09:07:45.417'),
('38a8e270-4823-4792-b7c1-2fe5e42c10a9', '7b2b510e-dab0-4f0f-9aae-f1d27c9de59c', '52897111-6585-4527-9211-1a20b7c2ff8f', 'UPDATE', 'Roles & Permissions', '8718c924-8bd7-49ca-8ef8-7022d668b826', '{\"role\":\"Teacher\",\"permissionCodes\":[\"marks.enter\",\"students.view\",\"attendance.manage\",\"routines.view\",\"academic.view\",\"exams.view\",\"homework.view\",\"portal.teacher.view\",\"attendance.view\",\"admissions.view\",\"homework.manage\"]}', NULL, '2026-08-09 06:23:04.348'),
('393935e3-a200-4eb2-bbbf-ea6686933999', '7b2b510e-dab0-4f0f-9aae-f1d27c9de59c', '52897111-6585-4527-9211-1a20b7c2ff8f', 'UPDATE', 'Roles & Permissions', '8718c924-8bd7-49ca-8ef8-7022d668b826', '{\"role\":\"Teacher\",\"permissionCodes\":[\"students.view\",\"fees.view\",\"attendance.view\",\"payroll.view\",\"routines.view\",\"admissions.view\",\"roles.view\",\"academic.view\",\"teachers.view\",\"exams.view\",\"dashboard.view\",\"users.view\",\"reports.view\",\"audit.view\",\"imports.view\",\"guardians.view\",\"employees.view\",\"departments.view\",\"designations.view\",\"teacher-assignments.view\",\"homework.view\",\"leave.view\",\"portal.teacher.view\",\"portal.student.view\",\"portal.guardian.view\",\"portal.employee.view\",\"homework.manage\",\"marks.enter\",\"marks.verify\",\"results.calculate\",\"results.publish\",\"exams.manage\",\"attendance.manage\"]}', NULL, '2026-08-10 09:38:29.560'),
('3ab9c400-fd0e-4333-afc4-11e72c8cfeac', '7b2b510e-dab0-4f0f-9aae-f1d27c9de59c', '52897111-6585-4527-9211-1a20b7c2ff8f', 'CREATE', 'Payroll', NULL, 'Assigned salary structure to staff member', NULL, '2026-08-09 11:50:32.577'),
('3ac35622-8a18-4887-ae9a-e031868e450c', '7b2b510e-dab0-4f0f-9aae-f1d27c9de59c', '52897111-6585-4527-9211-1a20b7c2ff8f', 'UPDATE', 'Roles & Permissions', '4181ae83-e64c-4643-9eb8-91674a83d259', '{\"role\":\"Website Management\",\"permissionCodes\":[\"dashboard.view\",\"imports.view\",\"roles.view\",\"users.view\",\"backup.manage\",\"imports.manage\",\"legacy.migrate\",\"roles.manage\",\"school.settings.manage\",\"users.manage\",\"website.about.manage\",\"website.academics.manage\",\"website.achievements.manage\",\"website.admission.manage\",\"website.banners.manage\",\"website.contact.manage\",\"website.custom-pages.manage\",\"website.downloads.manage\",\"website.events.manage\",\"website.facilities.manage\",\"website.gallery.manage\",\"website.home.manage\",\"website.overview.manage\",\"website.programs.manage\",\"website.teachers.manage\"]}', NULL, '2026-08-10 09:28:16.300'),
('3aff7975-9041-4b3a-a477-6c478b3bb472', '7b2b510e-dab0-4f0f-9aae-f1d27c9de59c', '52897111-6585-4527-9211-1a20b7c2ff8f', 'CREATE', 'Fees', '4a4ea331-a988-4e54-9916-6ea6fa06e02e', 'Created fee structure LAB FEE', NULL, '2026-08-09 11:11:39.183'),
('3b95f4d9-aabe-43a4-87eb-44e5e512a92c', '7b2b510e-dab0-4f0f-9aae-f1d27c9de59c', 'cc488987-826b-421e-bcb2-00f1cde1a477', 'CREATE', 'Staff Accounts', 'cc488987-826b-421e-bcb2-00f1cde1a477', 'Created Teacher portal account and linked T-004', NULL, '2026-08-09 11:48:46.212'),
('3cc75c1b-0c5f-4fdf-a6d1-a615c0c44f86', '7b2b510e-dab0-4f0f-9aae-f1d27c9de59c', '52897111-6585-4527-9211-1a20b7c2ff8f', 'CREATE', 'Payroll', '32e32257-081c-4f04-a8d5-b8d676e8c2d4', 'Recorded salary payment 50000', NULL, '2026-08-10 11:04:48.937'),
('3fbea224-7302-4e60-876a-8af94c7a5110', '7b2b510e-dab0-4f0f-9aae-f1d27c9de59c', '52897111-6585-4527-9211-1a20b7c2ff8f', 'UPDATE', 'Roles & Permissions', 'f017bebf-942a-4d49-b333-ee32d542fc48', '{\"role\":\"Accountant\",\"permissionCodes\":[\"students.view\",\"payments.collect\",\"fees.view\",\"payroll.view\",\"dashboard.view\",\"reports.view\",\"imports.view\",\"imports.manage\",\"payroll.approve\",\"reports.export\"]}', NULL, '2026-08-10 10:41:29.301'),
('40f5f7e3-c3b2-4fbd-ab4b-646f3d37fe53', '7b2b510e-dab0-4f0f-9aae-f1d27c9de59c', '52897111-6585-4527-9211-1a20b7c2ff8f', 'UPDATE', 'WEBSITE', 'fe11fc91-512a-4fe7-8687-558676c094b6', 'Public website content updated', NULL, '2026-08-10 05:47:57.496'),
('43d183df-b6c2-4d17-9f08-14beea33e7ff', '7b2b510e-dab0-4f0f-9aae-f1d27c9de59c', '52897111-6585-4527-9211-1a20b7c2ff8f', 'TOGGLE_STATUS', 'Result Publication', 'demo-exam-upcoming', 'Unpublished results', NULL, '2026-08-09 08:03:35.684'),
('4505e0aa-32f3-4cba-9e93-a8b3157db81d', NULL, NULL, 'EXPORT', 'Reports', NULL, 'Exported student as pdf (50 rows)', NULL, '2026-08-02 05:36:17.980'),
('485529af-71b3-41aa-8c8c-ff38596a8313', '7b2b510e-dab0-4f0f-9aae-f1d27c9de59c', '52897111-6585-4527-9211-1a20b7c2ff8f', 'UPDATE', 'WEBSITE', 'fe11fc91-512a-4fe7-8687-558676c094b6', 'Public website content updated', NULL, '2026-08-10 05:26:46.933'),
('48b2c9c4-867c-42bb-a89f-b646c42d3a0a', '7b2b510e-dab0-4f0f-9aae-f1d27c9de59c', 'a7e07343-b155-4218-9a29-f5bccb3a7eef', 'UPDATE', 'Attendance', 'b52db913-d2cd-49f5-bb31-09681871a0a5', 'Submitted Class 6 - Padma attendance for 2 students on 2026-08-10', NULL, '2026-08-10 06:33:57.033'),
('48e3f34d-a06f-479c-914e-d6963f268bd7', '7b2b510e-dab0-4f0f-9aae-f1d27c9de59c', '52897111-6585-4527-9211-1a20b7c2ff8f', 'CREATE', 'Payroll', '0fff752a-bbe9-49b6-af9b-948af15cf9cf', 'Generated payroll 9/2026', NULL, '2026-08-10 10:56:17.420'),
('499dbf40-6612-40b5-99b8-d82843745e14', '7b2b510e-dab0-4f0f-9aae-f1d27c9de59c', '52897111-6585-4527-9211-1a20b7c2ff8f', 'UPDATE', 'WEBSITE', 'fe11fc91-512a-4fe7-8687-558676c094b6', 'Public website content updated', NULL, '2026-08-10 05:48:36.318'),
('4af4e82f-51ff-45de-bbfa-d925512ddbd2', '7b2b510e-dab0-4f0f-9aae-f1d27c9de59c', '52897111-6585-4527-9211-1a20b7c2ff8f', 'UPDATE', 'WEBSITE', 'fe11fc91-512a-4fe7-8687-558676c094b6', 'Public website content updated', NULL, '2026-08-03 08:46:50.191'),
('4c25d3ae-b941-40bc-b14e-793c52749a42', NULL, NULL, 'EXPORT', 'Reports', NULL, 'Exported student as pdf (50 rows)', NULL, '2026-08-02 05:38:58.666'),
('4cb06c21-475a-4052-a562-371245f886c7', '7b2b510e-dab0-4f0f-9aae-f1d27c9de59c', '52897111-6585-4527-9211-1a20b7c2ff8f', 'UPDATE', 'Marks Verification', 'demo-exam-upcoming', 'Verified and locked marks for subject demo-subject-ban', NULL, '2026-08-09 07:24:14.442'),
('4cdd15e7-bcee-45d3-b52f-ff8eb66d0618', NULL, NULL, 'CREATE', 'AcademicSessions', '9d9eb558-ed98-44ac-9cf4-7f152e79041a', 'Created session First Term / Semester', NULL, '2026-08-06 06:04:49.929'),
('4d935f0c-51b4-445a-9f03-8964994ab9c1', '7b2b510e-dab0-4f0f-9aae-f1d27c9de59c', 'a7e07343-b155-4218-9a29-f5bccb3a7eef', 'UPDATE', 'Marks Entry', 'demo-exam-upcoming', 'Saved 2 marks for subject demo-subject-ban', NULL, '2026-08-09 06:53:22.838'),
('4e4afea0-6df8-4a0e-b19a-648e31657629', '7b2b510e-dab0-4f0f-9aae-f1d27c9de59c', '52897111-6585-4527-9211-1a20b7c2ff8f', 'UPDATE', 'Roles & Permissions', 'f017bebf-942a-4d49-b333-ee32d542fc48', '{\"role\":\"Accountant\",\"permissionCodes\":[\"students.view\",\"payments.collect\",\"fees.view\",\"payroll.view\",\"dashboard.view\",\"reports.view\",\"imports.view\",\"imports.manage\",\"payroll.approve\",\"reports.export\",\"payments.reverse\",\"payroll.generate\",\"audit.view\",\"fees.manage\"]}', NULL, '2026-08-10 10:43:39.688'),
('4e695c76-4309-48b6-b48d-b22f9dccbc80', '7b2b510e-dab0-4f0f-9aae-f1d27c9de59c', '52897111-6585-4527-9211-1a20b7c2ff8f', 'UPDATE', 'Roles & Permissions', '1e1370cd-b59d-4fe4-b03d-40aa9aac48b8', '{\"role\":\"Academic Admin\",\"permissionCodes\":[\"marks.enter\",\"exams.manage\",\"academic.manage\",\"students.manage\",\"students.view\",\"attendance.manage\",\"reports.export\",\"attendance.view\",\"results.calculate\",\"routines.view\",\"admissions.view\",\"academic.view\",\"routines.manage\",\"results.publish\",\"teachers.view\",\"exams.view\",\"marks.verify\",\"dashboard.view\",\"reports.view\",\"imports.view\",\"guardians.view\",\"teacher-assignments.view\",\"homework.view\",\"homework.manage\",\"admissions.manage\",\"website.about.manage\",\"website.academics.manage\",\"website.achievements.manage\",\"website.admission.manage\",\"website.banners.manage\",\"website.contact.manage\",\"website.custom-pages.manage\",\"website.downloads.manage\",\"website.events.manage\",\"website.facilities.manage\",\"website.gallery.manage\",\"website.home.manage\",\"website.overview.manage\",\"website.programs.manage\",\"website.teachers.manage\"]}', NULL, '2026-08-10 08:28:17.086'),
('4f1aaeec-ba0a-4bcc-bf25-47a58c9cd955', '7b2b510e-dab0-4f0f-9aae-f1d27c9de59c', '52897111-6585-4527-9211-1a20b7c2ff8f', 'UPDATE', 'Roles & Permissions', '4181ae83-e64c-4643-9eb8-91674a83d259', '{\"role\":\"Website Management\",\"permissionCodes\":[\"academic.view\",\"admissions.view\",\"attendance.view\",\"audit.view\",\"dashboard.view\",\"employees.view\",\"exams.view\",\"fees.view\",\"guardians.view\",\"homework.view\",\"departments.view\",\"designations.view\",\"imports.view\",\"leave.view\",\"payroll.view\",\"portal.employee.view\",\"portal.guardian.view\",\"portal.student.view\",\"portal.teacher.view\",\"reports.view\",\"roles.view\",\"routines.view\",\"students.view\",\"teacher-assignments.view\",\"teachers.view\",\"users.view\"]}', NULL, '2026-08-10 09:24:03.275'),
('4f9fd32f-bc80-43c9-b08a-9d3632d42223', '7b2b510e-dab0-4f0f-9aae-f1d27c9de59c', '52897111-6585-4527-9211-1a20b7c2ff8f', 'DELETE', 'Class Routines', '93988481-2f72-4f86-b7c0-b8fc6ed2ca7f', 'Deleted FRIDAY 08:00 routine slot', NULL, '2026-08-02 09:45:44.786'),
('525364f6-4970-40bd-86d7-2e0d6b922169', '7b2b510e-dab0-4f0f-9aae-f1d27c9de59c', '52897111-6585-4527-9211-1a20b7c2ff8f', 'UPDATE', 'Roles & Permissions', '8718c924-8bd7-49ca-8ef8-7022d668b826', '{\"role\":\"Teacher\",\"permissionCodes\":[\"students.view\",\"fees.view\",\"attendance.view\",\"payroll.view\",\"routines.view\",\"admissions.view\",\"roles.view\",\"academic.view\",\"teachers.view\",\"exams.view\",\"dashboard.view\",\"users.view\",\"reports.view\",\"audit.view\",\"imports.view\",\"guardians.view\",\"employees.view\",\"departments.view\",\"designations.view\",\"teacher-assignments.view\",\"homework.view\",\"leave.view\",\"portal.teacher.view\",\"portal.student.view\",\"portal.guardian.view\",\"portal.employee.view\",\"homework.manage\",\"marks.enter\",\"attendance.manage\",\"routines.manage\"]}', NULL, '2026-08-10 09:59:02.521'),
('5277fe5d-da89-4aad-87f9-7e5ba4ddee4e', '7b2b510e-dab0-4f0f-9aae-f1d27c9de59c', '5b68561e-7f16-4126-8979-4d0fc815d1a4', 'UPDATE', 'Marks Entry', 'demo-exam-upcoming', 'Saved 2 marks for subject demo-subject-bgs', NULL, '2026-08-06 06:12:20.470'),
('53ae5f9e-a170-4406-9eb2-0a70662b563e', '7b2b510e-dab0-4f0f-9aae-f1d27c9de59c', '52897111-6585-4527-9211-1a20b7c2ff8f', 'UPDATE', 'WEBSITE', 'fe11fc91-512a-4fe7-8687-558676c094b6', 'Public website content updated', NULL, '2026-08-03 08:39:01.948'),
('54d12ba9-3d53-4895-92ee-6a483e420759', '7b2b510e-dab0-4f0f-9aae-f1d27c9de59c', '52897111-6585-4527-9211-1a20b7c2ff8f', 'UPDATE', 'WEBSITE', 'fe11fc91-512a-4fe7-8687-558676c094b6', 'Public website content updated', NULL, '2026-08-03 07:30:19.070'),
('5b439721-77b6-4c7b-9733-0d41a508184e', '7b2b510e-dab0-4f0f-9aae-f1d27c9de59c', 'a7e07343-b155-4218-9a29-f5bccb3a7eef', 'UPDATE', 'Marks Entry', 'demo-exam-upcoming', 'Saved 2 marks for subject demo-subject-ban', NULL, '2026-08-09 07:00:43.833'),
('5d3389e6-fa13-4e24-98dd-99f77e4427dd', '7b2b510e-dab0-4f0f-9aae-f1d27c9de59c', '52897111-6585-4527-9211-1a20b7c2ff8f', 'UPDATE', 'Roles & Permissions', 'f017bebf-942a-4d49-b333-ee32d542fc48', '{\"role\":\"Accountant\",\"permissionCodes\":[\"payroll.generate\",\"students.view\",\"fees.view\",\"reports.export\",\"payroll.view\",\"dashboard.view\",\"reports.view\",\"imports.view\",\"imports.manage\",\"payroll.approve\",\"payments.collect\"]}', NULL, '2026-08-10 10:54:02.848'),
('5d52e62c-44a4-4c27-b48a-22eab7073625', '7b2b510e-dab0-4f0f-9aae-f1d27c9de59c', '52897111-6585-4527-9211-1a20b7c2ff8f', 'UPDATE', 'Marks Verification', 'demo-exam-upcoming', 'Unlocked subject demo-subject-ban: sdfs sdfsf', NULL, '2026-08-09 07:22:26.923'),
('5d7bce03-c02b-44f2-814e-ce338cbcd0a2', '7b2b510e-dab0-4f0f-9aae-f1d27c9de59c', '52897111-6585-4527-9211-1a20b7c2ff8f', 'UPDATE', 'WEBSITE', 'fe11fc91-512a-4fe7-8687-558676c094b6', 'Public website content updated', NULL, '2026-08-03 08:46:46.873'),
('616a1f82-ac42-4ce2-a039-9463f924fe97', '7b2b510e-dab0-4f0f-9aae-f1d27c9de59c', '52897111-6585-4527-9211-1a20b7c2ff8f', 'UPDATE', 'WEBSITE', 'fe11fc91-512a-4fe7-8687-558676c094b6', 'Public website content updated', NULL, '2026-08-03 10:10:26.778'),
('63bc96f8-e703-4b26-8b17-eba347f49a82', '7b2b510e-dab0-4f0f-9aae-f1d27c9de59c', '52897111-6585-4527-9211-1a20b7c2ff8f', 'UPDATE', 'Result Processing', 'demo-exam-upcoming', 'Calculated 2 student results', NULL, '2026-08-09 07:27:29.950'),
('664c308b-bbcd-471f-9ecf-72e63cb61553', '7b2b510e-dab0-4f0f-9aae-f1d27c9de59c', '52897111-6585-4527-9211-1a20b7c2ff8f', 'UPDATE', 'Class Routines', '93988481-2f72-4f86-b7c0-b8fc6ed2ca7f', 'Updated FRIDAY 08:00-08:45 routine slot', NULL, '2026-08-02 09:45:44.727'),
('67706066-086b-45cd-b739-80cbf64768c6', '7b2b510e-dab0-4f0f-9aae-f1d27c9de59c', '52897111-6585-4527-9211-1a20b7c2ff8f', 'UPDATE', 'WEBSITE', 'fe11fc91-512a-4fe7-8687-558676c094b6', 'Public website content updated', NULL, '2026-08-03 09:04:25.862'),
('67bcd456-f0ce-43ec-b98f-41c454e879d4', '7b2b510e-dab0-4f0f-9aae-f1d27c9de59c', 'fc9940e7-a1ca-4996-877e-15b70ff8da36', 'UPDATE', 'Attendance', '07348811-1580-4b07-9b20-8170962932c9', 'Submitted Class 6 - Padma attendance for 2 students on 2026-08-06', NULL, '2026-08-06 05:52:48.337'),
('68399eef-aa42-4774-8524-3ba7df478a22', '7b2b510e-dab0-4f0f-9aae-f1d27c9de59c', '52897111-6585-4527-9211-1a20b7c2ff8f', 'UPDATE', 'WEBSITE', 'fe11fc91-512a-4fe7-8687-558676c094b6', 'Public website content updated', NULL, '2026-08-03 07:28:26.643'),
('69fc608b-aef9-4f03-908d-85bc55cefef7', '7b2b510e-dab0-4f0f-9aae-f1d27c9de59c', '52897111-6585-4527-9211-1a20b7c2ff8f', 'UPDATE', 'Roles & Permissions', 'f017bebf-942a-4d49-b333-ee32d542fc48', '{\"role\":\"Accountant\",\"permissionCodes\":[\"payroll.generate\",\"payroll.approve\",\"students.view\",\"payments.collect\",\"fees.view\",\"reports.export\",\"payroll.view\",\"dashboard.view\",\"reports.view\",\"imports.view\",\"imports.manage\",\"fees.manage\",\"payments.reverse\"]}', NULL, '2026-08-10 10:54:53.429'),
('6e206af8-f6f7-48ad-bd42-f2fee55ef68c', '7b2b510e-dab0-4f0f-9aae-f1d27c9de59c', '52897111-6585-4527-9211-1a20b7c2ff8f', 'UPDATE', 'Roles & Permissions', '9ce2211c-729c-4dda-bed6-8fb76b417bad', '{\"role\":\"Student\",\"permissionCodes\":[\"teachers.view\",\"students.manage\",\"students.view\"]}', NULL, '2026-08-10 08:03:02.360'),
('71f00da5-ddd6-482a-a025-75e2fc7713cb', '7b2b510e-dab0-4f0f-9aae-f1d27c9de59c', '52897111-6585-4527-9211-1a20b7c2ff8f', 'CREATE', 'Class Routines', '93988481-2f72-4f86-b7c0-b8fc6ed2ca7f', 'Created FRIDAY 08:00-08:45 routine slot', NULL, '2026-08-02 09:45:44.632'),
('735eeca2-f60b-4ae5-aa78-26f1cbf27dfb', '7b2b510e-dab0-4f0f-9aae-f1d27c9de59c', 'e149fca0-f4f0-4018-bb35-89b9febd366a', 'CREATE', 'Payroll', '67f37e65-b154-420b-bab5-e97911bd34bd', 'Recorded salary payment 50000', NULL, '2026-08-10 10:58:39.472'),
('746cf213-fb85-457b-a8d8-f6b81c77eda9', '7b2b510e-dab0-4f0f-9aae-f1d27c9de59c', '52897111-6585-4527-9211-1a20b7c2ff8f', 'CREATE', 'Payroll', '0b76bc0e-3427-479a-8387-2a2a14569f32', 'Generated payroll 12/2026', NULL, '2026-08-10 11:03:41.637'),
('76f3e806-5a4c-42a8-a077-ff54fb39e317', '7b2b510e-dab0-4f0f-9aae-f1d27c9de59c', '52897111-6585-4527-9211-1a20b7c2ff8f', 'UPDATE', 'Marks Verification', 'demo-exam-upcoming', 'Unlocked subject demo-subject-ban: Teacher requested marks correction.', NULL, '2026-08-09 06:52:26.202'),
('77598896-1598-4fdc-9888-16e8b96da7ec', '7b2b510e-dab0-4f0f-9aae-f1d27c9de59c', '59b0cf90-8aeb-4dc7-b362-8b31bd6477ca', 'CREATE', 'Staff Accounts', '59b0cf90-8aeb-4dc7-b362-8b31bd6477ca', 'Created Employee portal account and linked E-002', NULL, '2026-08-09 11:48:47.345'),
('77d839d1-dbde-41f6-affc-b13528b8458e', '7b2b510e-dab0-4f0f-9aae-f1d27c9de59c', 'a7e07343-b155-4218-9a29-f5bccb3a7eef', 'UPDATE', 'Exam Routine', 'demo-exam-routine-6-1', 'Updated exam schedule', NULL, '2026-08-10 10:05:24.939'),
('79676c61-cd19-41a2-aab2-acfe9e0917a8', '7b2b510e-dab0-4f0f-9aae-f1d27c9de59c', '52897111-6585-4527-9211-1a20b7c2ff8f', 'UPDATE', 'Payroll', '0fff752a-bbe9-49b6-af9b-948af15cf9cf', 'Approved payroll period', NULL, '2026-08-10 10:56:20.285'),
('7ae824ef-80bb-4d28-bd19-02d33b43ff3c', '7b2b510e-dab0-4f0f-9aae-f1d27c9de59c', '52897111-6585-4527-9211-1a20b7c2ff8f', 'UPDATE', 'Roles & Permissions', '5ac077bc-2057-4588-a302-9a93c84f6b6b', '{\"role\":\"School Admin\",\"permissionCodes\":[\"users.manage\",\"marks.enter\",\"teachers.manage\",\"exams.manage\",\"payroll.generate\",\"payroll.approve\",\"academic.manage\",\"students.manage\",\"roles.manage\",\"payments.reverse\",\"fees.manage\",\"students.view\",\"payments.collect\",\"attendance.manage\",\"fees.view\",\"reports.export\",\"marks.lock\",\"backup.manage\",\"attendance.view\",\"payroll.view\",\"results.calculate\",\"routines.view\",\"roles.view\",\"academic.view\",\"school.settings.manage\",\"routines.manage\",\"results.publish\",\"teachers.view\",\"exams.view\",\"marks.verify\",\"dashboard.view\",\"users.view\",\"reports.view\",\"audit.view\",\"imports.view\",\"imports.manage\",\"guardians.view\",\"guardians.manage\",\"employees.view\",\"employees.manage\",\"departments.view\",\"departments.manage\",\"designations.view\",\"designations.manage\",\"teacher-assignments.view\",\"teacher-assignments.manage\",\"homework.view\",\"homework.manage\",\"leave.view\",\"leave.manage\",\"portal.teacher.view\",\"portal.student.view\",\"portal.guardian.view\",\"portal.employee.view\",\"admissions.manage\"]}', NULL, '2026-08-02 08:57:24.157'),
('7cf778d8-a963-408d-851b-4fcd8b491ab9', '7b2b510e-dab0-4f0f-9aae-f1d27c9de59c', 'e149fca0-f4f0-4018-bb35-89b9febd366a', 'UPDATE', 'Payroll', '4c48cc94-fa29-443a-8efe-a3c03e49d30c', 'Approved payroll period', NULL, '2026-08-10 10:58:08.392'),
('7fc96b51-36fe-4817-ab98-38e666e70059', '7b2b510e-dab0-4f0f-9aae-f1d27c9de59c', '52897111-6585-4527-9211-1a20b7c2ff8f', 'UPDATE', 'WEBSITE', 'fe11fc91-512a-4fe7-8687-558676c094b6', 'Public website content updated', NULL, '2026-08-03 07:40:52.395'),
('806b334e-507c-4282-8259-88c166307c00', '7b2b510e-dab0-4f0f-9aae-f1d27c9de59c', '52897111-6585-4527-9211-1a20b7c2ff8f', 'CREATE', 'Payroll', NULL, 'Assigned salary structure to staff member', NULL, '2026-08-09 11:44:07.063'),
('80d6e2cf-e52d-4d6c-978a-a807c9dbb289', '7b2b510e-dab0-4f0f-9aae-f1d27c9de59c', '52897111-6585-4527-9211-1a20b7c2ff8f', 'UPDATE', 'Marks Entry', 'demo-exam-upcoming', 'Saved 2 marks for subject demo-subject-ban', NULL, '2026-08-06 05:40:02.378'),
('80ed6bce-7247-4fe8-a958-1081b7497511', '7b2b510e-dab0-4f0f-9aae-f1d27c9de59c', '52897111-6585-4527-9211-1a20b7c2ff8f', 'UPDATE', 'Marks Verification', 'demo-exam-upcoming', 'Verified and locked marks for subject demo-subject-ban', NULL, '2026-08-09 06:54:48.297'),
('81314716-9aea-407c-943c-964501ccb8ad', '7b2b510e-dab0-4f0f-9aae-f1d27c9de59c', NULL, 'DELETE', 'Subjects', '71a87dc5-e709-4df6-b8bd-1d301fe4cd47', 'Deleted subject 71a87dc5-e709-4df6-b8bd-1d301fe4cd47', NULL, '2026-08-02 08:47:58.547'),
('82f968f9-bd7b-4647-8c63-6d6ac15a68de', '7b2b510e-dab0-4f0f-9aae-f1d27c9de59c', '52897111-6585-4527-9211-1a20b7c2ff8f', 'UPDATE', 'WEBSITE', 'fe11fc91-512a-4fe7-8687-558676c094b6', 'Public website content updated', NULL, '2026-08-03 09:19:00.476'),
('8310770b-ed8b-47ef-8369-19e2cbe1e7af', NULL, NULL, 'EXPORT', 'Reports', NULL, 'Exported student as pdf (50 rows)', NULL, '2026-08-02 05:33:59.012'),
('866644e7-a43b-48ba-9b81-664b6a952f44', '7b2b510e-dab0-4f0f-9aae-f1d27c9de59c', '52897111-6585-4527-9211-1a20b7c2ff8f', 'UPDATE', 'Result Processing', 'demo-exam-upcoming', 'Calculated 2 student results', NULL, '2026-08-02 10:12:08.775'),
('89b643d3-de35-4b77-8b76-1a224ca3b7b1', '7b2b510e-dab0-4f0f-9aae-f1d27c9de59c', '52897111-6585-4527-9211-1a20b7c2ff8f', 'CREATE', 'Fees', '4a4ea331-a988-4e54-9916-6ea6fa06e02e', 'Generated 20 LAB invoices for targeted class/group/section; skipped 0', NULL, '2026-08-09 11:28:36.977'),
('89dd90d6-6022-45c8-95d7-0c05f6ef44e2', '7b2b510e-dab0-4f0f-9aae-f1d27c9de59c', '52897111-6585-4527-9211-1a20b7c2ff8f', 'UPDATE', 'Roles & Permissions', 'f017bebf-942a-4d49-b333-ee32d542fc48', '{\"role\":\"Accountant\",\"permissionCodes\":[\"students.view\",\"payments.collect\",\"fees.view\",\"payroll.view\",\"dashboard.view\",\"reports.view\",\"imports.view\",\"imports.manage\",\"payroll.approve\",\"reports.export\",\"payments.reverse\",\"payroll.generate\",\"audit.view\"]}', NULL, '2026-08-10 10:43:09.358'),
('8a0f11ec-c6d7-4441-b844-4c73550bf1af', '7b2b510e-dab0-4f0f-9aae-f1d27c9de59c', '52897111-6585-4527-9211-1a20b7c2ff8f', 'UPDATE', 'WEBSITE', 'fe11fc91-512a-4fe7-8687-558676c094b6', 'Public website content updated', NULL, '2026-08-09 05:34:22.471'),
('8a38e975-96ce-43cb-8692-3c7053df71f5', '7b2b510e-dab0-4f0f-9aae-f1d27c9de59c', '52897111-6585-4527-9211-1a20b7c2ff8f', 'DELETE', 'Users', '6ac6ded0-5140-4431-a494-acf3bf498491', 'Deleted user account codex.user.crud@school.test', NULL, '2026-08-02 09:07:46.123'),
('8bb2a7e7-430a-4d30-be2a-0e5040418ac3', '7b2b510e-dab0-4f0f-9aae-f1d27c9de59c', '52897111-6585-4527-9211-1a20b7c2ff8f', 'DELETE', 'Examinations', '3bad1c38-9c73-48f2-95da-fd9908a080ee', 'Deleted Temporary API Verification Exam', NULL, '2026-08-02 09:59:14.282'),
('8c21940e-cb58-41a6-a522-b7fe8905743f', '7b2b510e-dab0-4f0f-9aae-f1d27c9de59c', 'fc9940e7-a1ca-4996-877e-15b70ff8da36', 'TOGGLE_STATUS', 'Result Publication', 'demo-exam-upcoming', 'Published results', NULL, '2026-08-09 06:11:27.765'),
('8d8626ce-23a0-42c3-b400-6a4f486b38a7', '7b2b510e-dab0-4f0f-9aae-f1d27c9de59c', '52897111-6585-4527-9211-1a20b7c2ff8f', 'CREATE', 'Examinations', '3bad1c38-9c73-48f2-95da-fd9908a080ee', 'Created Temporary API Verification Exam with 6 subjects', NULL, '2026-08-02 09:59:14.025'),
('8dfede33-33fc-4bcc-b835-05563b4da991', '7b2b510e-dab0-4f0f-9aae-f1d27c9de59c', '52897111-6585-4527-9211-1a20b7c2ff8f', 'UPDATE', 'Payroll', '7838cd43-c5c4-4c80-987e-3116404b6265', 'Approved payroll period', NULL, '2026-08-09 11:08:45.716'),
('8e53546d-e476-453f-abf7-591bd2456d85', '7b2b510e-dab0-4f0f-9aae-f1d27c9de59c', '52897111-6585-4527-9211-1a20b7c2ff8f', 'UPDATE', 'Payroll', '0b76bc0e-3427-479a-8387-2a2a14569f32', 'Approved payroll period', NULL, '2026-08-10 11:03:44.001'),
('8f8e7daa-38a5-4e40-8ce6-7a03a8ad2a42', '7b2b510e-dab0-4f0f-9aae-f1d27c9de59c', '5b68561e-7f16-4126-8979-4d0fc815d1a4', 'UPDATE', 'Marks Entry', 'demo-exam-upcoming', 'Saved 2 marks for subject demo-subject-eng', NULL, '2026-08-06 06:10:54.194'),
('92353398-3619-4768-b668-fc0bd6d25945', '7b2b510e-dab0-4f0f-9aae-f1d27c9de59c', '43c63044-7b46-49fa-aa9d-97fee183a689', 'CREATE', 'Staff Accounts', '43c63044-7b46-49fa-aa9d-97fee183a689', 'Created Teacher portal account and linked T-006', NULL, '2026-08-09 11:48:47.005'),
('926241dc-74f3-4d5c-b76c-73c488912fd9', '7b2b510e-dab0-4f0f-9aae-f1d27c9de59c', '52897111-6585-4527-9211-1a20b7c2ff8f', 'UPDATE', 'WEBSITE', 'fe11fc91-512a-4fe7-8687-558676c094b6', 'Public website content updated', NULL, '2026-08-03 07:30:18.007'),
('93c4b2d8-fe19-4860-ae4b-ad8252cf9c44', NULL, NULL, 'UPDATE', 'Roles & Permissions', 'e52062de-5306-4aa3-a78f-368adbd05b84', '{\"role\":\"Employee\",\"permissionCodes\":[\"leave.view\",\"portal.employee.view\"]}', NULL, '2026-08-02 06:03:57.208'),
('94f260a5-6d9f-49e8-9e10-fd54cd81ed37', '7b2b510e-dab0-4f0f-9aae-f1d27c9de59c', '52897111-6585-4527-9211-1a20b7c2ff8f', 'UPDATE', 'Roles & Permissions', 'f017bebf-942a-4d49-b333-ee32d542fc48', '{\"role\":\"Accountant\",\"permissionCodes\":[\"payroll.generate\",\"payroll.approve\",\"payments.reverse\",\"fees.manage\",\"students.view\",\"fees.view\",\"reports.export\",\"payroll.view\",\"dashboard.view\",\"reports.view\",\"audit.view\",\"imports.view\",\"imports.manage\"]}', NULL, '2026-08-10 10:45:49.982'),
('953e05e9-aff4-4b53-92eb-c65e0e2cc3b9', '7b2b510e-dab0-4f0f-9aae-f1d27c9de59c', '52897111-6585-4527-9211-1a20b7c2ff8f', 'UPDATE', 'Examinations', 'demo-exam-upcoming', 'Updated Half-Yearly Examination 2026', NULL, '2026-08-09 05:51:40.984'),
('95975d44-4e60-4228-8514-ac2b32f39d93', '7b2b510e-dab0-4f0f-9aae-f1d27c9de59c', '52897111-6585-4527-9211-1a20b7c2ff8f', 'CREATE', 'Exam Routine', '6f5e52a1-fafb-4a6f-a6ed-f42ade810168', 'Created exam schedule', NULL, '2026-08-02 09:59:14.180'),
('983bef6e-e3c1-471b-b20c-fb23f9c6b787', '7b2b510e-dab0-4f0f-9aae-f1d27c9de59c', '52897111-6585-4527-9211-1a20b7c2ff8f', 'UPDATE', 'Marks Verification', 'demo-exam-upcoming', 'Verified and locked marks for subject demo-subject-ban', NULL, '2026-08-06 05:40:13.792'),
('986b6e59-d2b4-45e4-897a-1cc3ba26708c', '7b2b510e-dab0-4f0f-9aae-f1d27c9de59c', '52897111-6585-4527-9211-1a20b7c2ff8f', 'UPDATE', 'Examinations', 'demo-exam-upcoming', 'Updated Half-Yearly Examination 2026', NULL, '2026-08-02 10:09:56.571'),
('992c30dd-0205-4b63-9a69-2b13a0375825', '7b2b510e-dab0-4f0f-9aae-f1d27c9de59c', '52897111-6585-4527-9211-1a20b7c2ff8f', 'UPDATE', 'Roles & Permissions', 'f017bebf-942a-4d49-b333-ee32d542fc48', '{\"role\":\"Accountant\",\"permissionCodes\":[\"payroll.generate\",\"students.view\",\"fees.view\",\"reports.export\",\"payroll.view\",\"dashboard.view\",\"reports.view\",\"imports.view\",\"imports.manage\",\"payroll.approve\"]}', NULL, '2026-08-10 10:53:37.957'),
('99d7d6a2-e024-4b4c-b114-6aedf68fdee7', '7b2b510e-dab0-4f0f-9aae-f1d27c9de59c', '52897111-6585-4527-9211-1a20b7c2ff8f', 'UPDATE', 'WEBSITE', 'fe11fc91-512a-4fe7-8687-558676c094b6', 'Public website content updated', NULL, '2026-08-03 07:29:52.050'),
('a1a588b8-b680-465c-aa9c-4fa0e2346bc1', '7b2b510e-dab0-4f0f-9aae-f1d27c9de59c', '52897111-6585-4527-9211-1a20b7c2ff8f', 'CREATE', 'Payroll', NULL, 'Assigned salary structure to staff member', NULL, '2026-08-10 11:02:53.302'),
('a63e32b3-af85-4066-8c23-9844af8d7f95', '7b2b510e-dab0-4f0f-9aae-f1d27c9de59c', '52897111-6585-4527-9211-1a20b7c2ff8f', 'UPDATE', 'WEBSITE', 'fe11fc91-512a-4fe7-8687-558676c094b6', 'Public website content updated', NULL, '2026-08-03 10:23:11.103'),
('a770f325-8763-48f7-ad77-0db251017aae', '7b2b510e-dab0-4f0f-9aae-f1d27c9de59c', '52897111-6585-4527-9211-1a20b7c2ff8f', 'UPDATE', 'WEBSITE', 'fe11fc91-512a-4fe7-8687-558676c094b6', 'Public website content updated', NULL, '2026-08-10 05:49:29.411'),
('a82a737e-8d96-4798-852d-a990db4124c3', '7b2b510e-dab0-4f0f-9aae-f1d27c9de59c', NULL, 'CREATE', 'Subjects', '71a87dc5-e709-4df6-b8bd-1d301fe4cd47', 'Created subject Temporary Verification', NULL, '2026-08-02 08:47:58.148'),
('aa6de5bc-1040-4bc0-8cb2-65ada61911e4', '7b2b510e-dab0-4f0f-9aae-f1d27c9de59c', '52897111-6585-4527-9211-1a20b7c2ff8f', 'UPDATE', 'Examinations', 'demo-exam-completed', 'Updated First Term Examination 2026', NULL, '2026-08-06 05:41:16.240'),
('aeb0db98-8a13-4569-a89d-f54d0a839cd2', '7b2b510e-dab0-4f0f-9aae-f1d27c9de59c', '52897111-6585-4527-9211-1a20b7c2ff8f', 'UPDATE', 'Examinations', 'demo-exam-upcoming', 'Updated Half-Yearly Examination 2026', NULL, '2026-08-09 09:02:24.953'),
('af75cb9e-e669-452f-8d0f-2ab167d85235', '7b2b510e-dab0-4f0f-9aae-f1d27c9de59c', '52897111-6585-4527-9211-1a20b7c2ff8f', 'UPDATE', 'WEBSITE', 'fe11fc91-512a-4fe7-8687-558676c094b6', 'Public website content updated', NULL, '2026-08-03 09:06:32.678'),
('b03e4cc8-c1e4-4430-b940-f0b4f4fd116c', '7b2b510e-dab0-4f0f-9aae-f1d27c9de59c', '52897111-6585-4527-9211-1a20b7c2ff8f', 'UPDATE', 'Roles & Permissions', '4181ae83-e64c-4643-9eb8-91674a83d259', '{\"role\":\"Website Management\",\"permissionCodes\":[\"website.about.manage\",\"website.academics.manage\",\"website.achievements.manage\",\"website.admission.manage\",\"website.banners.manage\",\"website.contact.manage\",\"website.custom-pages.manage\",\"website.downloads.manage\",\"website.events.manage\",\"website.facilities.manage\",\"website.gallery.manage\",\"website.home.manage\",\"website.overview.manage\",\"website.programs.manage\",\"website.teachers.manage\"]}', NULL, '2026-08-10 09:28:34.854'),
('b3ff56de-4655-4a22-9890-22c5c4380d11', '7b2b510e-dab0-4f0f-9aae-f1d27c9de59c', '52897111-6585-4527-9211-1a20b7c2ff8f', 'UPDATE', 'WEBSITE', 'fe11fc91-512a-4fe7-8687-558676c094b6', 'Public website content updated', NULL, '2026-08-03 08:45:53.331'),
('b418750b-fdbd-4b45-b5f6-b38f7d99f939', '7b2b510e-dab0-4f0f-9aae-f1d27c9de59c', '1af30a7a-4758-4a4d-a001-a76ca72ea6c5', 'CREATE', 'Payroll', '6e366ad3-3921-45a1-a540-cd244ac7ff0f', 'Recorded salary payment 55800', NULL, '2026-08-06 06:02:45.288'),
('b5744410-1483-4bc6-b6ff-28934dade872', '7b2b510e-dab0-4f0f-9aae-f1d27c9de59c', '52897111-6585-4527-9211-1a20b7c2ff8f', 'UPDATE', 'Roles & Permissions', '8718c924-8bd7-49ca-8ef8-7022d668b826', '{\"role\":\"Teacher\",\"permissionCodes\":[\"students.view\",\"fees.view\",\"attendance.view\",\"payroll.view\",\"routines.view\",\"admissions.view\",\"roles.view\",\"academic.view\",\"teachers.view\",\"exams.view\",\"dashboard.view\",\"users.view\",\"reports.view\",\"audit.view\",\"imports.view\",\"guardians.view\",\"employees.view\",\"departments.view\",\"designations.view\",\"teacher-assignments.view\",\"homework.view\",\"leave.view\",\"portal.teacher.view\",\"portal.student.view\",\"portal.guardian.view\",\"portal.employee.view\",\"homework.manage\",\"marks.enter\",\"attendance.manage\"]}', NULL, '2026-08-10 09:58:29.647'),
('b6b62881-cf9b-41b4-86fe-25c836268081', '7b2b510e-dab0-4f0f-9aae-f1d27c9de59c', '52897111-6585-4527-9211-1a20b7c2ff8f', 'CREATE', 'Fees', 'demo-fee-structure-monthly', 'Generated 4 TUITION invoices for targeted class/group/section; skipped 0', NULL, '2026-08-09 11:08:02.759'),
('bbda086a-fbc4-4309-b493-bd57cdfb543e', '7b2b510e-dab0-4f0f-9aae-f1d27c9de59c', '52897111-6585-4527-9211-1a20b7c2ff8f', 'UPDATE', 'WEBSITE', 'fe11fc91-512a-4fe7-8687-558676c094b6', 'Public website content updated', NULL, '2026-08-03 08:38:10.811'),
('bd2ead65-a0a2-423a-bbe3-be5774066949', '7b2b510e-dab0-4f0f-9aae-f1d27c9de59c', '52897111-6585-4527-9211-1a20b7c2ff8f', 'CREATE', 'Users', '6ac6ded0-5140-4431-a494-acf3bf498491', 'Created Employee account codex.user.crud@school.test', NULL, '2026-08-02 09:07:41.298'),
('bd9ad27b-1caf-4f29-8a40-25e8b6bd5188', '7b2b510e-dab0-4f0f-9aae-f1d27c9de59c', 'fc9940e7-a1ca-4996-877e-15b70ff8da36', 'TOGGLE_STATUS', 'Result Publication', 'demo-exam-upcoming', 'Unpublished results', NULL, '2026-08-09 06:11:25.697'),
('bed90e2e-d0da-4d53-b927-f4a40b16cf99', NULL, '52897111-6585-4527-9211-1a20b7c2ff8f', 'UPDATE', 'Roles & Permissions', '1e1370cd-b59d-4fe4-b03d-40aa9aac48b8', '{\"role\":\"Academic Admin\",\"permissionCodes\":[\"marks.enter\",\"exams.manage\",\"academic.manage\",\"students.manage\",\"students.view\",\"attendance.manage\",\"reports.export\",\"attendance.view\",\"results.calculate\",\"routines.view\",\"admissions.view\",\"academic.view\",\"routines.manage\",\"results.publish\",\"teachers.view\",\"exams.view\",\"marks.verify\",\"dashboard.view\",\"reports.view\",\"imports.view\",\"guardians.view\",\"teacher-assignments.view\",\"homework.view\",\"homework.manage\",\"admissions.manage\"]}', NULL, '2026-08-02 08:50:20.762'),
('bf1eac6f-55bf-433c-a62d-aa1839518072', '7b2b510e-dab0-4f0f-9aae-f1d27c9de59c', '52897111-6585-4527-9211-1a20b7c2ff8f', 'UPDATE', 'WEBSITE', 'fe11fc91-512a-4fe7-8687-558676c094b6', 'Public website content updated', NULL, '2026-08-03 07:30:13.197'),
('bfa9ca7f-fa72-4151-a1d3-4a63f6c15573', NULL, NULL, 'EXPORT', 'Reports', NULL, 'Exported student as pdf (50 rows)', NULL, '2026-08-02 05:38:31.785'),
('c0d84475-5eb0-4a64-b309-e1d934077194', '7b2b510e-dab0-4f0f-9aae-f1d27c9de59c', '52897111-6585-4527-9211-1a20b7c2ff8f', 'UPDATE', 'Roles & Permissions', '9ce2211c-729c-4dda-bed6-8fb76b417bad', '{\"role\":\"Student\",\"permissionCodes\":[\"portal.student.view\"]}', NULL, '2026-08-10 08:06:00.540'),
('c1f38dca-7524-44a6-b8d0-53ea8558cf6e', '7b2b510e-dab0-4f0f-9aae-f1d27c9de59c', 'a7e07343-b155-4218-9a29-f5bccb3a7eef', 'UPDATE', 'Marks Entry', 'demo-exam-upcoming', 'Saved 2 marks for subject demo-subject-ban', NULL, '2026-08-09 07:00:46.708'),
('c38760b3-7062-4059-b200-ecad5e1e7ac3', '7b2b510e-dab0-4f0f-9aae-f1d27c9de59c', 'a7e07343-b155-4218-9a29-f5bccb3a7eef', 'UPDATE', 'Marks Entry', 'demo-exam-upcoming', 'Saved 2 marks for subject demo-subject-ban', NULL, '2026-08-09 06:55:51.675'),
('c59e81f2-eebc-47f0-b239-20bb96aa71ac', '7b2b510e-dab0-4f0f-9aae-f1d27c9de59c', '52897111-6585-4527-9211-1a20b7c2ff8f', 'UPDATE', 'Roles & Permissions', '8718c924-8bd7-49ca-8ef8-7022d668b826', '{\"role\":\"Teacher\",\"permissionCodes\":[\"students.view\",\"fees.view\",\"attendance.view\",\"payroll.view\",\"routines.view\",\"admissions.view\",\"roles.view\",\"academic.view\",\"teachers.view\",\"exams.view\",\"dashboard.view\",\"users.view\",\"reports.view\",\"audit.view\",\"imports.view\",\"guardians.view\",\"employees.view\",\"departments.view\",\"designations.view\",\"teacher-assignments.view\",\"homework.view\",\"leave.view\",\"portal.teacher.view\",\"portal.student.view\",\"portal.guardian.view\",\"portal.employee.view\",\"homework.manage\"]}', NULL, '2026-08-10 09:36:59.661'),
('cc497430-eb01-48aa-8d5e-47f007733151', '7b2b510e-dab0-4f0f-9aae-f1d27c9de59c', '52897111-6585-4527-9211-1a20b7c2ff8f', 'UPDATE', 'WEBSITE', 'fe11fc91-512a-4fe7-8687-558676c094b6', 'Public website content updated', NULL, '2026-08-10 05:26:35.821'),
('cff5b544-80e4-435b-8143-ac259ebda8a3', '7b2b510e-dab0-4f0f-9aae-f1d27c9de59c', '52897111-6585-4527-9211-1a20b7c2ff8f', 'CREATE', 'Roles & Permissions', '4181ae83-e64c-4643-9eb8-91674a83d259', '{\"role\":\"Website Management\",\"permissionCodes\":[\"marks.enter\",\"exams.manage\",\"academic.manage\",\"students.manage\",\"students.view\",\"attendance.manage\",\"reports.export\",\"attendance.view\",\"results.calculate\",\"routines.view\",\"admissions.view\",\"academic.view\",\"routines.manage\",\"results.publish\",\"teachers.view\",\"exams.view\",\"marks.verify\",\"dashboard.view\",\"reports.view\",\"imports.view\",\"guardians.view\",\"teacher-assignments.view\",\"homework.view\",\"homework.manage\",\"admissions.manage\"]}', NULL, '2026-08-10 08:08:57.456'),
('d85a291f-a18f-432f-87a8-23408e3e44d8', '7b2b510e-dab0-4f0f-9aae-f1d27c9de59c', '52897111-6585-4527-9211-1a20b7c2ff8f', 'UPDATE', 'WEBSITE', 'fe11fc91-512a-4fe7-8687-558676c094b6', 'Public website content updated', NULL, '2026-08-03 07:27:31.223'),
('d90210ed-fe07-4a76-a1a1-17f7bd02132a', '7b2b510e-dab0-4f0f-9aae-f1d27c9de59c', '52897111-6585-4527-9211-1a20b7c2ff8f', 'TOGGLE_STATUS', 'Result Publication', 'demo-exam-upcoming', 'Published results', NULL, '2026-08-02 10:12:15.088'),
('da2d0ccc-2ced-4d7c-8fa0-6d34c7317898', '7b2b510e-dab0-4f0f-9aae-f1d27c9de59c', '52897111-6585-4527-9211-1a20b7c2ff8f', 'CREATE', 'Examinations', 'c6dec4c5-b8ce-4db6-9c02-1517f2466016', 'Created Temporary Update Verification with 6 subjects', NULL, '2026-08-02 10:06:21.304'),
('db6b7fe9-8cd3-49a0-82bd-846975590475', '7b2b510e-dab0-4f0f-9aae-f1d27c9de59c', '52897111-6585-4527-9211-1a20b7c2ff8f', 'UPDATE', 'Examinations', 'demo-exam-completed', 'Updated First Term Examination 2026', NULL, '2026-08-09 05:47:12.462'),
('db8c777c-3178-4488-b827-0ba9f516b181', '7b2b510e-dab0-4f0f-9aae-f1d27c9de59c', 'e149fca0-f4f0-4018-bb35-89b9febd366a', 'CREATE', 'Fees', '2e7a2f87-98ac-451d-b91f-0257e4c4a1b1', 'Created invoice INV-2026-95900195', NULL, '2026-08-06 05:58:20.207'),
('ddf4522d-2d7f-4167-bc93-9233bd0357f3', '7b2b510e-dab0-4f0f-9aae-f1d27c9de59c', '52897111-6585-4527-9211-1a20b7c2ff8f', 'UPDATE', 'Marks Entry', 'demo-exam-upcoming', 'Saved 2 marks for subject demo-subject-ban', NULL, '2026-08-09 07:22:51.980'),
('demo-audit-1', '7b2b510e-dab0-4f0f-9aae-f1d27c9de59c', '52897111-6585-4527-9211-1a20b7c2ff8f', 'LOGIN', 'Authentication', NULL, 'Super Admin signed in', '127.0.0.1', '2026-08-02 08:57:54.944'),
('demo-audit-2', '7b2b510e-dab0-4f0f-9aae-f1d27c9de59c', '52897111-6585-4527-9211-1a20b7c2ff8f', 'CREATE', 'Students', NULL, 'Admitted 4 new students', '127.0.0.1', '2026-08-01 08:57:54.944'),
('demo-audit-3', '7b2b510e-dab0-4f0f-9aae-f1d27c9de59c', '52897111-6585-4527-9211-1a20b7c2ff8f', 'UPDATE', 'Attendance', NULL, 'Submitted today attendance', '127.0.0.1', '2026-07-31 08:57:54.944'),
('demo-audit-4', '7b2b510e-dab0-4f0f-9aae-f1d27c9de59c', '52897111-6585-4527-9211-1a20b7c2ff8f', 'CREATE', 'Fees', NULL, 'Generated monthly tuition invoices', '127.0.0.1', '2026-07-30 08:57:54.944'),
('demo-audit-5', '7b2b510e-dab0-4f0f-9aae-f1d27c9de59c', '52897111-6585-4527-9211-1a20b7c2ff8f', 'EXPORT', 'Reports', NULL, 'Exported student attendance report', '127.0.0.1', '2026-07-29 08:57:54.944'),
('dfcbef33-f184-47c6-a6dd-8d14a574e855', '7b2b510e-dab0-4f0f-9aae-f1d27c9de59c', 'e149fca0-f4f0-4018-bb35-89b9febd366a', 'UPDATE', 'Fees', 'demo-fee-structure-monthly', 'Updated fee structure Monthly Tuition Fee. Existing invoices were not changed.', NULL, '2026-08-10 10:39:11.964'),
('e08cec88-29fb-457c-880c-e853eebfb3db', '7b2b510e-dab0-4f0f-9aae-f1d27c9de59c', '0b605377-3db9-49e0-a4f9-aff969a7e7e9', 'CREATE', 'Staff Accounts', '0b605377-3db9-49e0-a4f9-aff969a7e7e9', 'Created Teacher portal account and linked T-005', NULL, '2026-08-09 11:48:46.669'),
('e0d36cac-1728-4543-894c-80385aa3410a', '7b2b510e-dab0-4f0f-9aae-f1d27c9de59c', 'e149fca0-f4f0-4018-bb35-89b9febd366a', 'UPDATE', 'Payroll', '11bd5344-dee5-42d6-be3f-bf5fad4b3c78', 'Approved payroll period', NULL, '2026-08-10 10:56:42.334'),
('e17157fb-b62c-466b-8fde-5c2e10ae55fd', '7b2b510e-dab0-4f0f-9aae-f1d27c9de59c', 'e149fca0-f4f0-4018-bb35-89b9febd366a', 'CREATE', 'Fees', 'c7b2d8fb-b320-43dd-8041-4951803e69e1', 'Recorded REC-2026-95909887 for INV-2026-95900195', NULL, '2026-08-06 05:58:29.910'),
('e1ec2da5-1081-4c54-aae3-8e341aa524d9', '7b2b510e-dab0-4f0f-9aae-f1d27c9de59c', '52897111-6585-4527-9211-1a20b7c2ff8f', 'UPDATE', 'Roles & Permissions', '8718c924-8bd7-49ca-8ef8-7022d668b826', '{\"role\":\"Teacher\",\"permissionCodes\":[\"marks.enter\",\"students.view\",\"attendance.manage\",\"fees.view\",\"attendance.view\",\"payroll.view\",\"routines.view\",\"admissions.view\",\"roles.view\",\"academic.view\",\"teachers.view\",\"exams.view\",\"dashboard.view\",\"users.view\",\"reports.view\",\"audit.view\",\"imports.view\",\"guardians.view\",\"employees.view\",\"departments.view\",\"designations.view\",\"teacher-assignments.view\",\"homework.view\",\"homework.manage\",\"leave.view\",\"portal.teacher.view\",\"portal.student.view\",\"portal.guardian.view\",\"portal.employee.view\"]}', NULL, '2026-08-10 10:05:46.020'),
('e3f4e6c6-6c23-4e07-9209-e92b511404bf', '7b2b510e-dab0-4f0f-9aae-f1d27c9de59c', '52897111-6585-4527-9211-1a20b7c2ff8f', 'CREATE', 'Payroll', '75e79342-242f-4d24-9db0-3ff5ab6cdd46', 'Created salary structure Teacher Salary For junior', NULL, '2026-08-09 11:40:32.545'),
('e81006de-761a-42a3-a6d7-1a2c0a2e1532', '7b2b510e-dab0-4f0f-9aae-f1d27c9de59c', 'e149fca0-f4f0-4018-bb35-89b9febd366a', 'CREATE', 'Fees', 'aec2da4c-6f36-4f46-935f-18a4f854dca5', 'Recorded REC-2026-58826765 for INV-2026-4916959-18', NULL, '2026-08-10 10:47:06.775'),
('e81ac859-f12c-4a0c-9967-df09a2eff197', '7b2b510e-dab0-4f0f-9aae-f1d27c9de59c', '52897111-6585-4527-9211-1a20b7c2ff8f', 'UPDATE', 'Roles & Permissions', '9ce2211c-729c-4dda-bed6-8fb76b417bad', '{\"role\":\"Student\",\"permissionCodes\":[\"teachers.view\",\"portal.student.view\",\"reports.view\",\"leave.view\",\"homework.view\",\"attendance.view\"]}', NULL, '2026-08-10 08:04:59.470'),
('e974da52-9684-41f5-ad72-bae823b5b66b', '7b2b510e-dab0-4f0f-9aae-f1d27c9de59c', '52897111-6585-4527-9211-1a20b7c2ff8f', 'UPDATE', 'WEBSITE', 'fe11fc91-512a-4fe7-8687-558676c094b6', 'Public website content updated', NULL, '2026-08-03 07:29:28.957'),
('eafcd086-c66c-463b-834a-8be4c9747964', '7b2b510e-dab0-4f0f-9aae-f1d27c9de59c', '52897111-6585-4527-9211-1a20b7c2ff8f', 'UPDATE', 'Examinations', 'c6dec4c5-b8ce-4db6-9c02-1517f2466016', 'Updated Temporary Updated Verification', NULL, '2026-08-02 10:06:21.372'),
('ec61006b-f732-4fe1-8403-e69e87772651', '7b2b510e-dab0-4f0f-9aae-f1d27c9de59c', '52897111-6585-4527-9211-1a20b7c2ff8f', 'DELETE', 'Examinations', 'c6dec4c5-b8ce-4db6-9c02-1517f2466016', 'Deleted Temporary Updated Verification', NULL, '2026-08-02 10:06:21.440'),
('ef97dbcc-5397-4c37-aa17-c0bbe7acddb1', '7b2b510e-dab0-4f0f-9aae-f1d27c9de59c', '52897111-6585-4527-9211-1a20b7c2ff8f', 'UPDATE', 'Result Processing', 'demo-exam-upcoming', 'Calculated 2 student results', NULL, '2026-08-09 08:03:30.130'),
('f08ab530-6246-4a95-b16e-c97b012494d5', '7b2b510e-dab0-4f0f-9aae-f1d27c9de59c', '52897111-6585-4527-9211-1a20b7c2ff8f', 'UPDATE', 'Marks Entry', 'demo-exam-upcoming', 'Saved 2 marks for subject demo-subject-ban', NULL, '2026-08-09 06:56:13.056'),
('f2261db7-d387-4fcb-982a-b750d1c8e006', '7b2b510e-dab0-4f0f-9aae-f1d27c9de59c', '52897111-6585-4527-9211-1a20b7c2ff8f', 'UPDATE', 'Result Processing', 'demo-exam-upcoming', 'Calculated 2 student results', NULL, '2026-08-02 10:12:12.657'),
('f4b62c0c-6e6f-4a88-849d-7a6ad878dcae', NULL, NULL, 'EXPORT', 'Reports', NULL, 'Exported student as xlsx (50 rows)', NULL, '2026-08-02 05:34:46.041'),
('f68e834b-aeb4-46bd-b23c-7bf01ea81926', '7b2b510e-dab0-4f0f-9aae-f1d27c9de59c', 'e149fca0-f4f0-4018-bb35-89b9febd366a', 'CREATE', 'Fees', 'cadef7d5-71be-4d5e-b6de-6a2039769096', 'Recorded REC-2026-58704466 for INV-2026-4916968-19', NULL, '2026-08-10 10:45:04.497');
INSERT INTO `audit_logs` (`id`, `school_id`, `user_id`, `action`, `module`, `record_id`, `details`, `ip_address`, `created_at`) VALUES
('f7f54212-5acf-46b2-a4f8-3c0de2bd083c', '7b2b510e-dab0-4f0f-9aae-f1d27c9de59c', '52897111-6585-4527-9211-1a20b7c2ff8f', 'TOGGLE_STATUS', 'Result Publication', 'demo-exam-upcoming', 'Unpublished results', NULL, '2026-08-02 10:12:17.372'),
('f9b41ab4-8c00-4df6-a3b3-a4e729ae5dc2', '7b2b510e-dab0-4f0f-9aae-f1d27c9de59c', '52897111-6585-4527-9211-1a20b7c2ff8f', 'CREATE', 'Payroll', '7838cd43-c5c4-4c80-987e-3116404b6265', 'Generated payroll 8/2026', NULL, '2026-08-09 11:05:23.476'),
('fd0cbf14-33a9-4e42-ab12-484a98c6ab28', '7b2b510e-dab0-4f0f-9aae-f1d27c9de59c', NULL, 'UPDATE', 'Departments', '888b84ca-9412-46d0-9803-481865e9d5f9', 'Updated department 888b84ca-9412-46d0-9803-481865e9d5f9', NULL, '2026-08-02 08:54:45.881'),
('ff385f6e-8c7e-4c09-9b3c-977e3fb164a0', '7b2b510e-dab0-4f0f-9aae-f1d27c9de59c', 'fc9940e7-a1ca-4996-877e-15b70ff8da36', 'UPDATE', 'Attendance', '2579c18e-eae4-4d94-b7d3-8234c64777b1', 'Submitted Class 6 - Padma attendance for 2 students on 2026-08-09', NULL, '2026-08-09 06:14:35.119');

-- --------------------------------------------------------

--
-- Table structure for table `billing_periods`
--

CREATE TABLE `billing_periods` (
  `id` varchar(191) NOT NULL,
  `school_id` varchar(191) NOT NULL,
  `academic_year_id` varchar(191) NOT NULL,
  `year` int(11) NOT NULL,
  `month` int(11) NOT NULL,
  `start_date` datetime(3) NOT NULL,
  `due_date` datetime(3) NOT NULL,
  `status` varchar(191) NOT NULL DEFAULT 'OPEN',
  `created_at` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updated_at` datetime(3) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `branding_settings`
--

CREATE TABLE `branding_settings` (
  `id` varchar(191) NOT NULL,
  `school_id` varchar(191) NOT NULL,
  `logo_url` varchar(191) DEFAULT NULL,
  `favicon_url` varchar(191) DEFAULT NULL,
  `primary_color` varchar(191) NOT NULL DEFAULT '#0d9488',
  `accent_color` varchar(191) NOT NULL DEFAULT '#0f766e',
  `created_at` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updated_at` datetime(3) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `branding_settings`
--

INSERT INTO `branding_settings` (`id`, `school_id`, `logo_url`, `favicon_url`, `primary_color`, `accent_color`, `created_at`, `updated_at`) VALUES
('8fa8b968-db7d-4cfd-af26-f541b1acc07a', '7b2b510e-dab0-4f0f-9aae-f1d27c9de59c', NULL, NULL, '#0f766e', '#14b8a6', '2026-08-02 08:11:07.080', '2026-08-02 08:57:55.297');

-- --------------------------------------------------------

--
-- Table structure for table `certificates`
--

CREATE TABLE `certificates` (
  `id` varchar(191) NOT NULL,
  `school_id` varchar(191) NOT NULL,
  `certificate_type_id` varchar(191) NOT NULL,
  `student_id` varchar(191) NOT NULL,
  `certificate_number` varchar(191) NOT NULL,
  `verification_code` varchar(191) NOT NULL,
  `issue_date` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `issued_by_id` varchar(191) DEFAULT NULL,
  `reason` varchar(191) DEFAULT NULL,
  `status` varchar(191) NOT NULL DEFAULT 'ISSUED'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `certificate_types`
--

CREATE TABLE `certificate_types` (
  `id` varchar(191) NOT NULL,
  `school_id` varchar(191) NOT NULL,
  `code` varchar(191) NOT NULL,
  `title` varchar(191) NOT NULL,
  `description` varchar(191) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `classes`
--

CREATE TABLE `classes` (
  `id` varchar(191) NOT NULL,
  `school_id` varchar(191) NOT NULL,
  `name` varchar(191) NOT NULL,
  `code` varchar(191) NOT NULL,
  `numeric_level` int(11) NOT NULL DEFAULT 0,
  `display_order` int(11) NOT NULL DEFAULT 0,
  `status` enum('ACTIVE','INACTIVE','SUSPENDED','PENDING') NOT NULL DEFAULT 'ACTIVE',
  `created_at` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updated_at` datetime(3) NOT NULL,
  `deleted_at` datetime(3) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `classes`
--

INSERT INTO `classes` (`id`, `school_id`, `name`, `code`, `numeric_level`, `display_order`, `status`, `created_at`, `updated_at`, `deleted_at`) VALUES
('demo-class-10', '7b2b510e-dab0-4f0f-9aae-f1d27c9de59c', 'Class 10', 'C10', 10, 10, 'ACTIVE', '2026-08-02 08:11:07.865', '2026-08-02 08:57:55.565', NULL),
('demo-class-6', '7b2b510e-dab0-4f0f-9aae-f1d27c9de59c', 'Class 6', 'C6', 6, 6, 'ACTIVE', '2026-08-02 08:11:07.547', '2026-08-02 08:57:55.472', NULL),
('demo-class-7', '7b2b510e-dab0-4f0f-9aae-f1d27c9de59c', 'Class 7', 'C7', 7, 7, 'ACTIVE', '2026-08-02 08:11:07.614', '2026-08-02 08:57:55.498', NULL),
('demo-class-8', '7b2b510e-dab0-4f0f-9aae-f1d27c9de59c', 'Class 8', 'C8', 8, 8, 'ACTIVE', '2026-08-02 08:11:07.663', '2026-08-02 08:57:55.520', NULL),
('demo-class-9', '7b2b510e-dab0-4f0f-9aae-f1d27c9de59c', 'Class 9', 'C9', 9, 9, 'ACTIVE', '2026-08-02 08:11:07.831', '2026-08-02 08:57:55.544', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `class_groups`
--

CREATE TABLE `class_groups` (
  `id` varchar(191) NOT NULL,
  `school_id` varchar(191) NOT NULL,
  `academic_year_id` varchar(191) NOT NULL,
  `class_id` varchar(191) NOT NULL,
  `group_id` varchar(191) NOT NULL,
  `status` enum('ACTIVE','INACTIVE','SUSPENDED','PENDING') NOT NULL DEFAULT 'ACTIVE',
  `created_at` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updated_at` datetime(3) NOT NULL,
  `deleted_at` datetime(3) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `class_groups`
--

INSERT INTO `class_groups` (`id`, `school_id`, `academic_year_id`, `class_id`, `group_id`, `status`, `created_at`, `updated_at`, `deleted_at`) VALUES
('demo-class-group-10-humanities', '7b2b510e-dab0-4f0f-9aae-f1d27c9de59c', 'demo-academic-year-current', 'demo-class-10', 'demo-group-humanities', 'ACTIVE', '2026-08-02 08:11:07.997', '2026-08-02 08:57:55.610', NULL),
('demo-class-group-10-science', '7b2b510e-dab0-4f0f-9aae-f1d27c9de59c', 'demo-academic-year-current', 'demo-class-10', 'demo-group-science', 'ACTIVE', '2026-08-02 08:11:07.949', '2026-08-02 08:57:55.606', NULL),
('demo-class-group-9-humanities', '7b2b510e-dab0-4f0f-9aae-f1d27c9de59c', 'demo-academic-year-current', 'demo-class-9', 'demo-group-humanities', 'ACTIVE', '2026-08-02 08:11:07.939', '2026-08-02 08:57:55.601', NULL),
('demo-class-group-9-science', '7b2b510e-dab0-4f0f-9aae-f1d27c9de59c', 'demo-academic-year-current', 'demo-class-9', 'demo-group-science', 'ACTIVE', '2026-08-02 08:11:07.921', '2026-08-02 08:57:55.596', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `class_routines`
--

CREATE TABLE `class_routines` (
  `id` varchar(191) NOT NULL,
  `school_id` varchar(191) NOT NULL,
  `academic_year_id` varchar(191) NOT NULL,
  `session_id` varchar(191) DEFAULT NULL,
  `class_id` varchar(191) NOT NULL,
  `section_id` varchar(191) NOT NULL,
  `group_id` varchar(191) DEFAULT NULL,
  `subject_id` varchar(191) NOT NULL,
  `teacher_id` varchar(191) NOT NULL,
  `room_id` varchar(191) DEFAULT NULL,
  `weekday` varchar(191) NOT NULL,
  `period_id` varchar(191) NOT NULL,
  `start_time` varchar(191) NOT NULL,
  `end_time` varchar(191) NOT NULL,
  `effective_from` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `effective_to` datetime(3) DEFAULT NULL,
  `version_number` int(11) NOT NULL DEFAULT 1,
  `status` varchar(191) NOT NULL DEFAULT 'PUBLISHED',
  `created_at` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updated_at` datetime(3) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `class_routines`
--

INSERT INTO `class_routines` (`id`, `school_id`, `academic_year_id`, `session_id`, `class_id`, `section_id`, `group_id`, `subject_id`, `teacher_id`, `room_id`, `weekday`, `period_id`, `start_time`, `end_time`, `effective_from`, `effective_to`, `version_number`, `status`, `created_at`, `updated_at`) VALUES
('demo-class-routine-0-0', '7b2b510e-dab0-4f0f-9aae-f1d27c9de59c', 'demo-academic-year-current', 'demo-session-current', 'demo-class-6', 'demo-section-6-1', NULL, 'demo-subject-ban', 'demo-teacher-1', 'demo-room-201', 'SUNDAY', 'demo-period-1', '08:00', '08:45', '2026-01-01 03:00:00.000', NULL, 1, 'PUBLISHED', '2026-08-02 08:11:11.269', '2026-08-02 08:57:58.272'),
('demo-class-routine-0-1', '7b2b510e-dab0-4f0f-9aae-f1d27c9de59c', 'demo-academic-year-current', 'demo-session-current', 'demo-class-7', 'demo-section-7-1', NULL, 'demo-subject-eng', 'demo-teacher-2', 'demo-room-lab', 'SUNDAY', 'demo-period-2', '08:45', '09:30', '2026-01-01 03:00:00.000', NULL, 1, 'PUBLISHED', '2026-08-02 08:11:11.277', '2026-08-02 08:57:58.279'),
('demo-class-routine-0-2', '7b2b510e-dab0-4f0f-9aae-f1d27c9de59c', 'demo-academic-year-current', 'demo-session-current', 'demo-class-8', 'demo-section-8-1', NULL, 'demo-subject-mat', 'demo-teacher-3', 'demo-room-201', 'SUNDAY', 'demo-period-3', '09:45', '10:30', '2026-01-01 03:00:00.000', NULL, 1, 'PUBLISHED', '2026-08-02 08:11:11.284', '2026-08-02 08:57:58.285'),
('demo-class-routine-0-3', '7b2b510e-dab0-4f0f-9aae-f1d27c9de59c', 'demo-academic-year-current', 'demo-session-current', 'demo-class-9', 'demo-section-9-1', NULL, 'demo-subject-sci', 'demo-teacher-4', 'demo-room-lab', 'SUNDAY', 'demo-period-4', '10:30', '11:15', '2026-01-01 03:00:00.000', NULL, 1, 'PUBLISHED', '2026-08-02 08:11:11.288', '2026-08-02 08:57:58.291'),
('demo-class-routine-1-0', '7b2b510e-dab0-4f0f-9aae-f1d27c9de59c', 'demo-academic-year-current', 'demo-session-current', 'demo-class-7', 'demo-section-7-1', NULL, 'demo-subject-ban', 'demo-teacher-1', 'demo-room-201', 'MONDAY', 'demo-period-1', '08:00', '08:45', '2026-01-01 03:00:00.000', NULL, 1, 'PUBLISHED', '2026-08-02 08:11:11.294', '2026-08-02 08:57:58.296'),
('demo-class-routine-1-1', '7b2b510e-dab0-4f0f-9aae-f1d27c9de59c', 'demo-academic-year-current', 'demo-session-current', 'demo-class-8', 'demo-section-8-1', NULL, 'demo-subject-eng', 'demo-teacher-2', 'demo-room-lab', 'MONDAY', 'demo-period-2', '08:45', '09:30', '2026-01-01 03:00:00.000', NULL, 1, 'PUBLISHED', '2026-08-02 08:11:11.299', '2026-08-02 08:57:58.302'),
('demo-class-routine-1-2', '7b2b510e-dab0-4f0f-9aae-f1d27c9de59c', 'demo-academic-year-current', 'demo-session-current', 'demo-class-9', 'demo-section-9-1', NULL, 'demo-subject-mat', 'demo-teacher-3', 'demo-room-201', 'MONDAY', 'demo-period-3', '09:45', '10:30', '2026-01-01 03:00:00.000', NULL, 1, 'PUBLISHED', '2026-08-02 08:11:11.304', '2026-08-02 08:57:58.308'),
('demo-class-routine-1-3', '7b2b510e-dab0-4f0f-9aae-f1d27c9de59c', 'demo-academic-year-current', 'demo-session-current', 'demo-class-10', 'demo-section-10-1', NULL, 'demo-subject-sci', 'demo-teacher-4', 'demo-room-lab', 'MONDAY', 'demo-period-4', '10:30', '11:15', '2026-01-01 03:00:00.000', NULL, 1, 'PUBLISHED', '2026-08-02 08:11:11.309', '2026-08-02 08:57:58.313'),
('demo-class-routine-2-0', '7b2b510e-dab0-4f0f-9aae-f1d27c9de59c', 'demo-academic-year-current', 'demo-session-current', 'demo-class-8', 'demo-section-8-1', NULL, 'demo-subject-ban', 'demo-teacher-1', 'demo-room-201', 'TUESDAY', 'demo-period-1', '08:00', '08:45', '2026-01-01 03:00:00.000', NULL, 1, 'PUBLISHED', '2026-08-02 08:11:11.315', '2026-08-02 08:57:58.319'),
('demo-class-routine-2-1', '7b2b510e-dab0-4f0f-9aae-f1d27c9de59c', 'demo-academic-year-current', 'demo-session-current', 'demo-class-9', 'demo-section-9-1', NULL, 'demo-subject-eng', 'demo-teacher-2', 'demo-room-lab', 'TUESDAY', 'demo-period-2', '08:45', '09:30', '2026-01-01 03:00:00.000', NULL, 1, 'PUBLISHED', '2026-08-02 08:11:11.320', '2026-08-02 08:57:58.326'),
('demo-class-routine-2-2', '7b2b510e-dab0-4f0f-9aae-f1d27c9de59c', 'demo-academic-year-current', 'demo-session-current', 'demo-class-10', 'demo-section-10-1', NULL, 'demo-subject-mat', 'demo-teacher-3', 'demo-room-201', 'TUESDAY', 'demo-period-3', '09:45', '10:30', '2026-01-01 03:00:00.000', NULL, 1, 'PUBLISHED', '2026-08-02 08:11:11.325', '2026-08-02 08:57:58.331'),
('demo-class-routine-2-3', '7b2b510e-dab0-4f0f-9aae-f1d27c9de59c', 'demo-academic-year-current', 'demo-session-current', 'demo-class-6', 'demo-section-6-1', NULL, 'demo-subject-sci', 'demo-teacher-4', 'demo-room-lab', 'TUESDAY', 'demo-period-4', '10:30', '11:15', '2026-01-01 03:00:00.000', NULL, 1, 'PUBLISHED', '2026-08-02 08:11:11.332', '2026-08-02 08:57:58.337'),
('demo-class-routine-3-0', '7b2b510e-dab0-4f0f-9aae-f1d27c9de59c', 'demo-academic-year-current', 'demo-session-current', 'demo-class-9', 'demo-section-9-1', NULL, 'demo-subject-ban', 'demo-teacher-1', 'demo-room-201', 'WEDNESDAY', 'demo-period-1', '08:00', '08:45', '2026-01-01 03:00:00.000', NULL, 1, 'PUBLISHED', '2026-08-02 08:11:11.337', '2026-08-02 08:57:58.343'),
('demo-class-routine-3-1', '7b2b510e-dab0-4f0f-9aae-f1d27c9de59c', 'demo-academic-year-current', 'demo-session-current', 'demo-class-10', 'demo-section-10-1', NULL, 'demo-subject-eng', 'demo-teacher-2', 'demo-room-lab', 'WEDNESDAY', 'demo-period-2', '08:45', '09:30', '2026-01-01 03:00:00.000', NULL, 1, 'PUBLISHED', '2026-08-02 08:11:11.342', '2026-08-02 08:57:58.349'),
('demo-class-routine-3-2', '7b2b510e-dab0-4f0f-9aae-f1d27c9de59c', 'demo-academic-year-current', 'demo-session-current', 'demo-class-6', 'demo-section-6-1', NULL, 'demo-subject-mat', 'demo-teacher-3', 'demo-room-201', 'WEDNESDAY', 'demo-period-3', '09:45', '10:30', '2026-01-01 03:00:00.000', NULL, 1, 'PUBLISHED', '2026-08-02 08:11:11.348', '2026-08-02 08:57:58.354'),
('demo-class-routine-3-3', '7b2b510e-dab0-4f0f-9aae-f1d27c9de59c', 'demo-academic-year-current', 'demo-session-current', 'demo-class-7', 'demo-section-7-1', NULL, 'demo-subject-sci', 'demo-teacher-4', 'demo-room-lab', 'WEDNESDAY', 'demo-period-4', '10:30', '11:15', '2026-01-01 03:00:00.000', NULL, 1, 'PUBLISHED', '2026-08-02 08:11:11.353', '2026-08-02 08:57:58.361'),
('demo-class-routine-4-0', '7b2b510e-dab0-4f0f-9aae-f1d27c9de59c', 'demo-academic-year-current', 'demo-session-current', 'demo-class-10', 'demo-section-10-1', NULL, 'demo-subject-ban', 'demo-teacher-1', 'demo-room-201', 'THURSDAY', 'demo-period-1', '08:00', '08:45', '2026-01-01 03:00:00.000', NULL, 1, 'PUBLISHED', '2026-08-02 08:11:11.358', '2026-08-02 08:57:58.366'),
('demo-class-routine-4-1', '7b2b510e-dab0-4f0f-9aae-f1d27c9de59c', 'demo-academic-year-current', 'demo-session-current', 'demo-class-6', 'demo-section-6-1', NULL, 'demo-subject-eng', 'demo-teacher-2', 'demo-room-lab', 'THURSDAY', 'demo-period-2', '08:45', '09:30', '2026-01-01 03:00:00.000', NULL, 1, 'PUBLISHED', '2026-08-02 08:11:11.363', '2026-08-02 08:57:58.371'),
('demo-class-routine-4-2', '7b2b510e-dab0-4f0f-9aae-f1d27c9de59c', 'demo-academic-year-current', 'demo-session-current', 'demo-class-7', 'demo-section-7-1', NULL, 'demo-subject-mat', 'demo-teacher-3', 'demo-room-201', 'THURSDAY', 'demo-period-3', '09:45', '10:30', '2026-01-01 03:00:00.000', NULL, 1, 'PUBLISHED', '2026-08-02 08:11:11.368', '2026-08-02 08:57:58.376'),
('demo-class-routine-4-3', '7b2b510e-dab0-4f0f-9aae-f1d27c9de59c', 'demo-academic-year-current', 'demo-session-current', 'demo-class-8', 'demo-section-8-1', NULL, 'demo-subject-sci', 'demo-teacher-4', 'demo-room-lab', 'THURSDAY', 'demo-period-4', '10:30', '11:15', '2026-01-01 03:00:00.000', NULL, 1, 'PUBLISHED', '2026-08-02 08:11:11.373', '2026-08-02 08:57:58.382');

-- --------------------------------------------------------

--
-- Table structure for table `class_sections`
--

CREATE TABLE `class_sections` (
  `id` varchar(191) NOT NULL,
  `school_id` varchar(191) NOT NULL,
  `academic_year_id` varchar(191) NOT NULL,
  `class_id` varchar(191) NOT NULL,
  `section_id` varchar(191) NOT NULL,
  `capacity` int(11) NOT NULL DEFAULT 40,
  `status` enum('ACTIVE','INACTIVE','SUSPENDED','PENDING') NOT NULL DEFAULT 'ACTIVE',
  `created_at` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updated_at` datetime(3) NOT NULL,
  `deleted_at` datetime(3) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `class_sections`
--

INSERT INTO `class_sections` (`id`, `school_id`, `academic_year_id`, `class_id`, `section_id`, `capacity`, `status`, `created_at`, `updated_at`, `deleted_at`) VALUES
('demo-class-section-10-1', '7b2b510e-dab0-4f0f-9aae-f1d27c9de59c', 'demo-academic-year-current', 'demo-class-10', 'demo-section-10-1', 35, 'ACTIVE', '2026-08-02 08:11:07.887', '2026-08-02 08:57:55.573', NULL),
('demo-class-section-10-2', '7b2b510e-dab0-4f0f-9aae-f1d27c9de59c', 'demo-academic-year-current', 'demo-class-10', 'demo-section-10-2', 35, 'ACTIVE', '2026-08-02 08:11:07.897', '2026-08-02 08:57:55.583', NULL),
('demo-class-section-6-1', '7b2b510e-dab0-4f0f-9aae-f1d27c9de59c', 'demo-academic-year-current', 'demo-class-6', 'demo-section-6-1', 35, 'ACTIVE', '2026-08-02 08:11:07.565', '2026-08-02 08:57:55.484', NULL),
('demo-class-section-6-2', '7b2b510e-dab0-4f0f-9aae-f1d27c9de59c', 'demo-academic-year-current', 'demo-class-6', 'demo-section-6-2', 35, 'ACTIVE', '2026-08-02 08:11:07.599', '2026-08-02 08:57:55.494', NULL),
('demo-class-section-7-1', '7b2b510e-dab0-4f0f-9aae-f1d27c9de59c', 'demo-academic-year-current', 'demo-class-7', 'demo-section-7-1', 35, 'ACTIVE', '2026-08-02 08:11:07.636', '2026-08-02 08:57:55.507', NULL),
('demo-class-section-7-2', '7b2b510e-dab0-4f0f-9aae-f1d27c9de59c', 'demo-academic-year-current', 'demo-class-7', 'demo-section-7-2', 35, 'ACTIVE', '2026-08-02 08:11:07.649', '2026-08-02 08:57:55.516', NULL),
('demo-class-section-8-1', '7b2b510e-dab0-4f0f-9aae-f1d27c9de59c', 'demo-academic-year-current', 'demo-class-8', 'demo-section-8-1', 35, 'ACTIVE', '2026-08-02 08:11:07.770', '2026-08-02 08:57:55.531', NULL),
('demo-class-section-8-2', '7b2b510e-dab0-4f0f-9aae-f1d27c9de59c', 'demo-academic-year-current', 'demo-class-8', 'demo-section-8-2', 35, 'ACTIVE', '2026-08-02 08:11:07.818', '2026-08-02 08:57:55.540', NULL),
('demo-class-section-9-1', '7b2b510e-dab0-4f0f-9aae-f1d27c9de59c', 'demo-academic-year-current', 'demo-class-9', 'demo-section-9-1', 35, 'ACTIVE', '2026-08-02 08:11:07.843', '2026-08-02 08:57:55.552', NULL),
('demo-class-section-9-2', '7b2b510e-dab0-4f0f-9aae-f1d27c9de59c', 'demo-academic-year-current', 'demo-class-9', 'demo-section-9-2', 35, 'ACTIVE', '2026-08-02 08:11:07.860', '2026-08-02 08:57:55.561', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `class_subjects`
--

CREATE TABLE `class_subjects` (
  `id` varchar(191) NOT NULL,
  `school_id` varchar(191) NOT NULL,
  `academic_year_id` varchar(191) DEFAULT NULL,
  `class_id` varchar(191) NOT NULL,
  `group_id` varchar(191) DEFAULT NULL,
  `subject_id` varchar(191) NOT NULL,
  `subject_type` varchar(191) NOT NULL DEFAULT 'compulsory',
  `full_marks` int(11) NOT NULL DEFAULT 100,
  `pass_marks` int(11) NOT NULL DEFAULT 33,
  `status` enum('ACTIVE','INACTIVE','SUSPENDED','PENDING') NOT NULL DEFAULT 'ACTIVE',
  `teacher_id` varchar(191) DEFAULT NULL,
  `created_at` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updated_at` datetime(3) NOT NULL,
  `deleted_at` datetime(3) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `class_subjects`
--

INSERT INTO `class_subjects` (`id`, `school_id`, `academic_year_id`, `class_id`, `group_id`, `subject_id`, `subject_type`, `full_marks`, `pass_marks`, `status`, `teacher_id`, `created_at`, `updated_at`, `deleted_at`) VALUES
('demo-class-subject-10-1', '7b2b510e-dab0-4f0f-9aae-f1d27c9de59c', 'demo-academic-year-current', 'demo-class-10', NULL, 'demo-subject-ban', 'compulsory', 100, 33, 'ACTIVE', 'demo-teacher-1', '2026-08-02 08:11:08.851', '2026-08-02 08:57:56.304', NULL),
('demo-class-subject-10-2', '7b2b510e-dab0-4f0f-9aae-f1d27c9de59c', 'demo-academic-year-current', 'demo-class-10', NULL, 'demo-subject-eng', 'compulsory', 100, 33, 'ACTIVE', 'demo-teacher-2', '2026-08-02 08:11:08.872', '2026-08-02 08:57:56.318', NULL),
('demo-class-subject-10-3', '7b2b510e-dab0-4f0f-9aae-f1d27c9de59c', 'demo-academic-year-current', 'demo-class-10', NULL, 'demo-subject-mat', 'compulsory', 100, 33, 'ACTIVE', 'demo-teacher-3', '2026-08-02 08:11:08.901', '2026-08-02 08:57:56.334', NULL),
('demo-class-subject-10-4', '7b2b510e-dab0-4f0f-9aae-f1d27c9de59c', 'demo-academic-year-current', 'demo-class-10', NULL, 'demo-subject-sci', 'compulsory', 100, 33, 'ACTIVE', 'demo-teacher-4', '2026-08-02 08:11:08.945', '2026-08-02 08:57:56.351', NULL),
('demo-class-subject-10-5', '7b2b510e-dab0-4f0f-9aae-f1d27c9de59c', 'demo-academic-year-current', 'demo-class-10', NULL, 'demo-subject-bgs', 'compulsory', 100, 33, 'ACTIVE', 'demo-teacher-5', '2026-08-02 08:11:08.995', '2026-08-02 08:57:56.368', NULL),
('demo-class-subject-10-6', '7b2b510e-dab0-4f0f-9aae-f1d27c9de59c', 'demo-academic-year-current', 'demo-class-10', NULL, 'demo-subject-ict', 'compulsory', 100, 33, 'ACTIVE', 'demo-teacher-6', '2026-08-02 08:11:09.038', '2026-08-02 08:57:56.390', NULL),
('demo-class-subject-6-1', '7b2b510e-dab0-4f0f-9aae-f1d27c9de59c', 'demo-academic-year-current', 'demo-class-6', NULL, 'demo-subject-ban', 'compulsory', 100, 33, 'ACTIVE', 'demo-teacher-1', '2026-08-02 08:11:08.479', '2026-08-02 08:57:55.758', NULL),
('demo-class-subject-6-2', '7b2b510e-dab0-4f0f-9aae-f1d27c9de59c', 'demo-academic-year-current', 'demo-class-6', NULL, 'demo-subject-eng', 'compulsory', 100, 33, 'ACTIVE', 'demo-teacher-2', '2026-08-02 08:11:08.503', '2026-08-02 08:57:55.773', NULL),
('demo-class-subject-6-3', '7b2b510e-dab0-4f0f-9aae-f1d27c9de59c', 'demo-academic-year-current', 'demo-class-6', NULL, 'demo-subject-mat', 'compulsory', 100, 33, 'ACTIVE', 'demo-teacher-3', '2026-08-02 08:11:08.517', '2026-08-02 08:57:55.783', NULL),
('demo-class-subject-6-4', '7b2b510e-dab0-4f0f-9aae-f1d27c9de59c', 'demo-academic-year-current', 'demo-class-6', NULL, 'demo-subject-sci', 'compulsory', 100, 33, 'ACTIVE', 'demo-teacher-4', '2026-08-02 08:11:08.527', '2026-08-02 08:57:55.794', NULL),
('demo-class-subject-6-5', '7b2b510e-dab0-4f0f-9aae-f1d27c9de59c', 'demo-academic-year-current', 'demo-class-6', NULL, 'demo-subject-bgs', 'compulsory', 100, 33, 'ACTIVE', 'demo-teacher-5', '2026-08-02 08:11:08.537', '2026-08-02 08:57:55.802', NULL),
('demo-class-subject-6-6', '7b2b510e-dab0-4f0f-9aae-f1d27c9de59c', 'demo-academic-year-current', 'demo-class-6', NULL, 'demo-subject-ict', 'compulsory', 100, 33, 'ACTIVE', 'demo-teacher-6', '2026-08-02 08:11:08.550', '2026-08-02 08:57:55.813', NULL),
('demo-class-subject-7-1', '7b2b510e-dab0-4f0f-9aae-f1d27c9de59c', 'demo-academic-year-current', 'demo-class-7', NULL, 'demo-subject-ban', 'compulsory', 100, 33, 'ACTIVE', 'demo-teacher-1', '2026-08-02 08:11:08.570', '2026-08-02 08:57:55.823', NULL),
('demo-class-subject-7-2', '7b2b510e-dab0-4f0f-9aae-f1d27c9de59c', 'demo-academic-year-current', 'demo-class-7', NULL, 'demo-subject-eng', 'compulsory', 100, 33, 'ACTIVE', 'demo-teacher-2', '2026-08-02 08:11:08.584', '2026-08-02 08:57:55.832', NULL),
('demo-class-subject-7-3', '7b2b510e-dab0-4f0f-9aae-f1d27c9de59c', 'demo-academic-year-current', 'demo-class-7', NULL, 'demo-subject-mat', 'compulsory', 100, 33, 'ACTIVE', 'demo-teacher-3', '2026-08-02 08:11:08.608', '2026-08-02 08:57:55.843', NULL),
('demo-class-subject-7-4', '7b2b510e-dab0-4f0f-9aae-f1d27c9de59c', 'demo-academic-year-current', 'demo-class-7', NULL, 'demo-subject-sci', 'compulsory', 100, 33, 'ACTIVE', 'demo-teacher-4', '2026-08-02 08:11:08.627', '2026-08-02 08:57:55.853', NULL),
('demo-class-subject-7-5', '7b2b510e-dab0-4f0f-9aae-f1d27c9de59c', 'demo-academic-year-current', 'demo-class-7', NULL, 'demo-subject-bgs', 'compulsory', 100, 33, 'ACTIVE', 'demo-teacher-5', '2026-08-02 08:11:08.636', '2026-08-02 08:57:55.865', NULL),
('demo-class-subject-7-6', '7b2b510e-dab0-4f0f-9aae-f1d27c9de59c', 'demo-academic-year-current', 'demo-class-7', NULL, 'demo-subject-ict', 'compulsory', 100, 33, 'ACTIVE', 'demo-teacher-6', '2026-08-02 08:11:08.648', '2026-08-02 08:57:55.873', NULL),
('demo-class-subject-8-1', '7b2b510e-dab0-4f0f-9aae-f1d27c9de59c', 'demo-academic-year-current', 'demo-class-8', NULL, 'demo-subject-ban', 'compulsory', 100, 33, 'ACTIVE', 'demo-teacher-1', '2026-08-02 08:11:08.661', '2026-08-02 08:57:55.880', NULL),
('demo-class-subject-8-2', '7b2b510e-dab0-4f0f-9aae-f1d27c9de59c', 'demo-academic-year-current', 'demo-class-8', NULL, 'demo-subject-eng', 'compulsory', 100, 33, 'ACTIVE', 'demo-teacher-2', '2026-08-02 08:11:08.702', '2026-08-02 08:57:55.894', NULL),
('demo-class-subject-8-3', '7b2b510e-dab0-4f0f-9aae-f1d27c9de59c', 'demo-academic-year-current', 'demo-class-8', NULL, 'demo-subject-mat', 'compulsory', 100, 33, 'ACTIVE', 'demo-teacher-3', '2026-08-02 08:11:08.722', '2026-08-02 08:57:55.909', NULL),
('demo-class-subject-8-4', '7b2b510e-dab0-4f0f-9aae-f1d27c9de59c', 'demo-academic-year-current', 'demo-class-8', NULL, 'demo-subject-sci', 'compulsory', 100, 33, 'ACTIVE', 'demo-teacher-4', '2026-08-02 08:11:08.739', '2026-08-02 08:57:55.940', NULL),
('demo-class-subject-8-5', '7b2b510e-dab0-4f0f-9aae-f1d27c9de59c', 'demo-academic-year-current', 'demo-class-8', NULL, 'demo-subject-bgs', 'compulsory', 100, 33, 'ACTIVE', 'demo-teacher-5', '2026-08-02 08:11:08.755', '2026-08-02 08:57:55.977', NULL),
('demo-class-subject-8-6', '7b2b510e-dab0-4f0f-9aae-f1d27c9de59c', 'demo-academic-year-current', 'demo-class-8', NULL, 'demo-subject-ict', 'compulsory', 100, 33, 'ACTIVE', 'demo-teacher-6', '2026-08-02 08:11:08.767', '2026-08-02 08:57:56.057', NULL),
('demo-class-subject-9-1', '7b2b510e-dab0-4f0f-9aae-f1d27c9de59c', 'demo-academic-year-current', 'demo-class-9', NULL, 'demo-subject-ban', 'compulsory', 100, 33, 'ACTIVE', 'demo-teacher-1', '2026-08-02 08:11:08.778', '2026-08-02 08:57:56.076', NULL),
('demo-class-subject-9-2', '7b2b510e-dab0-4f0f-9aae-f1d27c9de59c', 'demo-academic-year-current', 'demo-class-9', NULL, 'demo-subject-eng', 'compulsory', 100, 33, 'ACTIVE', 'demo-teacher-2', '2026-08-02 08:11:08.789', '2026-08-02 08:57:56.121', NULL),
('demo-class-subject-9-3', '7b2b510e-dab0-4f0f-9aae-f1d27c9de59c', 'demo-academic-year-current', 'demo-class-9', NULL, 'demo-subject-mat', 'compulsory', 100, 33, 'ACTIVE', 'demo-teacher-3', '2026-08-02 08:11:08.804', '2026-08-02 08:57:56.158', NULL),
('demo-class-subject-9-4', '7b2b510e-dab0-4f0f-9aae-f1d27c9de59c', 'demo-academic-year-current', 'demo-class-9', NULL, 'demo-subject-sci', 'compulsory', 100, 33, 'ACTIVE', 'demo-teacher-4', '2026-08-02 08:11:08.818', '2026-08-02 08:57:56.218', NULL),
('demo-class-subject-9-5', '7b2b510e-dab0-4f0f-9aae-f1d27c9de59c', 'demo-academic-year-current', 'demo-class-9', NULL, 'demo-subject-bgs', 'compulsory', 100, 33, 'ACTIVE', 'demo-teacher-5', '2026-08-02 08:11:08.832', '2026-08-02 08:57:56.260', NULL),
('demo-class-subject-9-6', '7b2b510e-dab0-4f0f-9aae-f1d27c9de59c', 'demo-academic-year-current', 'demo-class-9', NULL, 'demo-subject-ict', 'compulsory', 100, 33, 'ACTIVE', 'demo-teacher-6', '2026-08-02 08:11:08.842', '2026-08-02 08:57:56.285', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `departments`
--

CREATE TABLE `departments` (
  `id` varchar(191) NOT NULL,
  `school_id` varchar(191) NOT NULL,
  `name_en` varchar(191) NOT NULL,
  `name_bn` varchar(191) DEFAULT NULL,
  `code` varchar(191) NOT NULL,
  `status` enum('ACTIVE','INACTIVE','SUSPENDED','PENDING') NOT NULL DEFAULT 'ACTIVE',
  `created_at` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updated_at` datetime(3) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `departments`
--

INSERT INTO `departments` (`id`, `school_id`, `name_en`, `name_bn`, `code`, `status`, `created_at`, `updated_at`) VALUES
('396bf273-52c9-4704-8926-d99efea16b56', '7b2b510e-dab0-4f0f-9aae-f1d27c9de59c', 'Administration', 'প্রশাসন', 'ADM', 'ACTIVE', '2026-08-02 08:11:08.381', '2026-08-02 08:57:55.672'),
('888b84ca-9412-46d0-9803-481865e9d5f9', '7b2b510e-dab0-4f0f-9aae-f1d27c9de59c', 'Academic Department', 'একাডেমিক বিভাগ', 'ACA', 'ACTIVE', '2026-08-02 08:11:08.373', '2026-08-02 08:57:55.666');

-- --------------------------------------------------------

--
-- Table structure for table `designations`
--

CREATE TABLE `designations` (
  `id` varchar(191) NOT NULL,
  `school_id` varchar(191) NOT NULL,
  `name_en` varchar(191) NOT NULL,
  `name_bn` varchar(191) DEFAULT NULL,
  `code` varchar(191) NOT NULL,
  `status` enum('ACTIVE','INACTIVE','SUSPENDED','PENDING') NOT NULL DEFAULT 'ACTIVE',
  `created_at` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updated_at` datetime(3) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `designations`
--

INSERT INTO `designations` (`id`, `school_id`, `name_en`, `name_bn`, `code`, `status`, `created_at`, `updated_at`) VALUES
('518fc270-8e46-4e89-b516-772072afe6a0', '7b2b510e-dab0-4f0f-9aae-f1d27c9de59c', 'Senior Teacher', 'সিনিয়র শিক্ষক', 'SNT', 'ACTIVE', '2026-08-02 08:11:08.394', '2026-08-02 08:57:55.676'),
('a058ec21-a394-49e6-953d-34ca81776421', '7b2b510e-dab0-4f0f-9aae-f1d27c9de59c', 'Administrative Officer', 'প্রশাসনিক কর্মকর্তা', 'OFF', 'ACTIVE', '2026-08-02 08:11:08.400', '2026-08-02 08:57:55.682');

-- --------------------------------------------------------

--
-- Table structure for table `document_templates`
--

CREATE TABLE `document_templates` (
  `id` varchar(191) NOT NULL,
  `school_id` varchar(191) NOT NULL,
  `type` varchar(191) NOT NULL,
  `title` varchar(191) NOT NULL,
  `template_body` text NOT NULL,
  `header_bangla` varchar(191) DEFAULT NULL,
  `header_english` varchar(191) DEFAULT NULL,
  `logo_url` varchar(191) DEFAULT NULL,
  `is_default` tinyint(1) NOT NULL DEFAULT 1,
  `created_at` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updated_at` datetime(3) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `document_verifications`
--

CREATE TABLE `document_verifications` (
  `id` varchar(191) NOT NULL,
  `school_id` varchar(191) NOT NULL,
  `verification_code` varchar(191) NOT NULL,
  `document_type` varchar(191) NOT NULL,
  `target_id` varchar(191) NOT NULL,
  `status` varchar(191) NOT NULL DEFAULT 'VERIFIED',
  `verified_at` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `verifier_ip` varchar(191) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `employees`
--

CREATE TABLE `employees` (
  `id` varchar(191) NOT NULL,
  `school_id` varchar(191) NOT NULL,
  `user_id` varchar(191) DEFAULT NULL,
  `employee_code` varchar(191) NOT NULL,
  `name_en` varchar(191) NOT NULL,
  `name_bn` varchar(191) DEFAULT NULL,
  `phone` varchar(191) NOT NULL,
  `email` varchar(191) DEFAULT NULL,
  `department_id` varchar(191) DEFAULT NULL,
  `designation_id` varchar(191) DEFAULT NULL,
  `joining_date` datetime(3) NOT NULL,
  `employment_type` varchar(191) NOT NULL DEFAULT 'FULL_TIME',
  `status` enum('ACTIVE','INACTIVE','SUSPENDED','PENDING') NOT NULL DEFAULT 'ACTIVE',
  `created_at` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updated_at` datetime(3) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `employees`
--

INSERT INTO `employees` (`id`, `school_id`, `user_id`, `employee_code`, `name_en`, `name_bn`, `phone`, `email`, `department_id`, `designation_id`, `joining_date`, `employment_type`, `status`, `created_at`, `updated_at`) VALUES
('demo-employee-1', '7b2b510e-dab0-4f0f-9aae-f1d27c9de59c', 'b540ef8e-f019-44d9-9a69-3a7cd33423ac', 'E-001', 'Rashed Karim', NULL, '01930000001', 'demo.employee@school.test', '396bf273-52c9-4704-8926-d99efea16b56', 'a058ec21-a394-49e6-953d-34ca81776421', '2020-02-01 03:00:00.000', 'FULL_TIME', 'ACTIVE', '2026-08-02 08:11:08.456', '2026-08-02 08:57:55.742'),
('demo-employee-2', '7b2b510e-dab0-4f0f-9aae-f1d27c9de59c', '59b0cf90-8aeb-4dc7-b362-8b31bd6477ca', 'E-002', 'Maliha Sultana', NULL, '01930000002', 'e-002@shaplamodel.edu.bd', '396bf273-52c9-4704-8926-d99efea16b56', 'a058ec21-a394-49e6-953d-34ca81776421', '2020-02-01 03:00:00.000', 'FULL_TIME', 'ACTIVE', '2026-08-02 08:11:08.467', '2026-08-09 11:48:47.343'),
('demo-employee-3', '7b2b510e-dab0-4f0f-9aae-f1d27c9de59c', '3abadec3-facd-4bf2-a9e3-0011b00e884a', 'E-003', 'Abdul Mannan', NULL, '01930000003', 'e-003@shaplamodel.edu.bd', '396bf273-52c9-4704-8926-d99efea16b56', 'a058ec21-a394-49e6-953d-34ca81776421', '2020-02-01 03:00:00.000', 'FULL_TIME', 'ACTIVE', '2026-08-02 08:11:08.473', '2026-08-09 11:48:47.718');

-- --------------------------------------------------------

--
-- Table structure for table `employee_attendances`
--

CREATE TABLE `employee_attendances` (
  `id` varchar(191) NOT NULL,
  `school_id` varchar(191) NOT NULL,
  `employee_id` varchar(191) NOT NULL,
  `date` datetime(3) NOT NULL,
  `status` varchar(191) NOT NULL,
  `in_time` varchar(191) DEFAULT NULL,
  `out_time` varchar(191) DEFAULT NULL,
  `remarks` varchar(191) DEFAULT NULL,
  `created_at` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updated_at` datetime(3) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `employee_attendances`
--

INSERT INTO `employee_attendances` (`id`, `school_id`, `employee_id`, `date`, `status`, `in_time`, `out_time`, `remarks`, `created_at`, `updated_at`) VALUES
('demo-employee-att-1', '7b2b510e-dab0-4f0f-9aae-f1d27c9de59c', 'demo-employee-1', '2026-08-01 18:00:00.000', 'present', '08:00', '16:00', NULL, '2026-08-02 08:11:11.249', '2026-08-02 08:57:58.256'),
('demo-employee-att-2', '7b2b510e-dab0-4f0f-9aae-f1d27c9de59c', 'demo-employee-2', '2026-08-01 18:00:00.000', 'present', '08:00', '16:00', NULL, '2026-08-02 08:11:11.254', '2026-08-02 08:57:58.261'),
('demo-employee-att-3', '7b2b510e-dab0-4f0f-9aae-f1d27c9de59c', 'demo-employee-3', '2026-08-01 18:00:00.000', 'present', '08:00', '16:00', NULL, '2026-08-02 08:11:11.256', '2026-08-02 08:57:58.264');

-- --------------------------------------------------------

--
-- Table structure for table `employee_documents`
--

CREATE TABLE `employee_documents` (
  `id` varchar(191) NOT NULL,
  `teacher_id` varchar(191) DEFAULT NULL,
  `employee_id` varchar(191) DEFAULT NULL,
  `document_type` varchar(191) NOT NULL,
  `title` varchar(191) NOT NULL,
  `file_url` varchar(191) NOT NULL,
  `file_size` int(11) DEFAULT NULL,
  `uploaded_at` datetime(3) NOT NULL DEFAULT current_timestamp(3)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `employee_salary_assignments`
--

CREATE TABLE `employee_salary_assignments` (
  `id` varchar(191) NOT NULL,
  `school_id` varchar(191) NOT NULL,
  `user_id` varchar(191) NOT NULL,
  `salary_structure_id` varchar(191) NOT NULL,
  `effective_date` datetime(3) NOT NULL,
  `is_active` tinyint(1) NOT NULL DEFAULT 1,
  `created_at` datetime(3) NOT NULL DEFAULT current_timestamp(3)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `employee_salary_assignments`
--

INSERT INTO `employee_salary_assignments` (`id`, `school_id`, `user_id`, `salary_structure_id`, `effective_date`, `is_active`, `created_at`) VALUES
('c46f5c52-1502-4f38-9a42-b37dc19210ee', '7b2b510e-dab0-4f0f-9aae-f1d27c9de59c', '5d7880f3-2268-4ae9-a460-598270a02b81', '75e79342-242f-4d24-9db0-3ff5ab6cdd46', '2026-08-09 12:00:00.000', 1, '2026-08-09 11:50:32.568'),
('dce46a5c-bd08-4743-a167-aaf278c29535', '7b2b510e-dab0-4f0f-9aae-f1d27c9de59c', 'a7e07343-b155-4218-9a29-f5bccb3a7eef', '75e79342-242f-4d24-9db0-3ff5ab6cdd46', '2026-08-09 12:00:00.000', 1, '2026-08-09 11:44:07.052'),
('f68755b7-ccba-46c2-b0dd-a1f6a160dc40', '7b2b510e-dab0-4f0f-9aae-f1d27c9de59c', '5b68561e-7f16-4126-8979-4d0fc815d1a4', '75e79342-242f-4d24-9db0-3ff5ab6cdd46', '2026-08-10 12:00:00.000', 1, '2026-08-10 11:02:53.297');

-- --------------------------------------------------------

--
-- Table structure for table `employment_histories`
--

CREATE TABLE `employment_histories` (
  `id` varchar(191) NOT NULL,
  `teacher_id` varchar(191) DEFAULT NULL,
  `employee_id` varchar(191) DEFAULT NULL,
  `company_name` varchar(191) NOT NULL,
  `designation` varchar(191) NOT NULL,
  `start_date` datetime(3) NOT NULL,
  `end_date` datetime(3) DEFAULT NULL,
  `responsibilities` text DEFAULT NULL,
  `created_at` datetime(3) NOT NULL DEFAULT current_timestamp(3)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `exams`
--

CREATE TABLE `exams` (
  `id` varchar(191) NOT NULL,
  `school_id` varchar(191) NOT NULL,
  `name` varchar(191) NOT NULL,
  `term` varchar(191) NOT NULL,
  `year` int(11) NOT NULL DEFAULT 2026,
  `start_date` datetime(3) NOT NULL,
  `end_date` datetime(3) NOT NULL,
  `is_published` tinyint(1) NOT NULL DEFAULT 0,
  `created_at` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updated_at` datetime(3) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `exams`
--

INSERT INTO `exams` (`id`, `school_id`, `name`, `term`, `year`, `start_date`, `end_date`, `is_published`, `created_at`, `updated_at`) VALUES
('demo-exam-completed', '7b2b510e-dab0-4f0f-9aae-f1d27c9de59c', 'First Term Examination 2026', 'First Term', 2026, '2026-06-16 00:00:00.000', '2026-06-23 00:00:00.000', 1, '2026-08-02 08:11:11.404', '2026-08-09 05:47:12.436'),
('demo-exam-upcoming', '7b2b510e-dab0-4f0f-9aae-f1d27c9de59c', 'Half-Yearly Examination 2026', 'Half-Yearly', 2026, '2026-08-16 00:00:00.000', '2026-08-24 00:00:00.000', 1, '2026-08-02 08:11:11.409', '2026-08-09 09:02:24.734');

-- --------------------------------------------------------

--
-- Table structure for table `exam_classes`
--

CREATE TABLE `exam_classes` (
  `id` varchar(191) NOT NULL,
  `exam_id` varchar(191) NOT NULL,
  `class_id` varchar(191) NOT NULL,
  `section_id` varchar(191) DEFAULT NULL,
  `created_at` datetime(3) NOT NULL DEFAULT current_timestamp(3)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `exam_classes`
--

INSERT INTO `exam_classes` (`id`, `exam_id`, `class_id`, `section_id`, `created_at`) VALUES
('0d4bbc41-9414-4a04-86eb-6336be441e05', 'demo-exam-upcoming', 'demo-class-6', 'demo-section-6-1', '2026-08-09 09:02:24.890'),
('606ef7e8-c4bf-4037-8ebc-74343ec01434', 'demo-exam-completed', 'demo-class-6', 'demo-section-6-1', '2026-08-02 10:00:18.640'),
('bdb40a72-420d-4e2f-9167-3b1e01331f32', 'demo-exam-upcoming', 'demo-class-8', 'demo-section-8-1', '2026-08-09 06:53:22.817'),
('c81eccf7-0d7b-4368-b93b-d3885a0488f0', 'demo-exam-upcoming', 'demo-class-8', NULL, '2026-08-09 09:02:24.890');

-- --------------------------------------------------------

--
-- Table structure for table `exam_fee_assignments`
--

CREATE TABLE `exam_fee_assignments` (
  `id` varchar(191) NOT NULL,
  `exam_fee_structure_id` varchar(191) NOT NULL,
  `student_id` varchar(191) NOT NULL,
  `amount` decimal(12,2) NOT NULL,
  `waiver_amount` decimal(12,2) NOT NULL DEFAULT 0.00,
  `netAmount` decimal(12,2) NOT NULL,
  `status` varchar(191) NOT NULL DEFAULT 'PENDING',
  `created_at` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updated_at` datetime(3) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `exam_fee_structures`
--

CREATE TABLE `exam_fee_structures` (
  `id` varchar(191) NOT NULL,
  `school_id` varchar(191) NOT NULL,
  `academic_year_id` varchar(191) NOT NULL,
  `exam_id` varchar(191) NOT NULL,
  `class_id` varchar(191) NOT NULL,
  `section_id` varchar(191) DEFAULT NULL,
  `fee_type_id` varchar(191) NOT NULL,
  `amount` decimal(12,2) NOT NULL,
  `due_date` datetime(3) NOT NULL,
  `late_fee` decimal(12,2) NOT NULL DEFAULT 0.00,
  `status` varchar(191) NOT NULL DEFAULT 'ACTIVE',
  `created_at` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updated_at` datetime(3) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `exam_mark_distributions`
--

CREATE TABLE `exam_mark_distributions` (
  `id` varchar(191) NOT NULL,
  `exam_subject_id` varchar(191) NOT NULL,
  `component` varchar(191) NOT NULL,
  `full_marks` decimal(5,2) NOT NULL,
  `pass_marks` decimal(5,2) NOT NULL,
  `created_at` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updated_at` datetime(3) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `exam_routines`
--

CREATE TABLE `exam_routines` (
  `id` varchar(191) NOT NULL,
  `school_id` varchar(191) NOT NULL,
  `academic_year_id` varchar(191) NOT NULL,
  `exam_id` varchar(191) NOT NULL,
  `class_id` varchar(191) NOT NULL,
  `section_id` varchar(191) DEFAULT NULL,
  `subject_id` varchar(191) NOT NULL,
  `exam_date` datetime(3) NOT NULL,
  `start_time` varchar(191) NOT NULL,
  `end_time` varchar(191) NOT NULL,
  `duration_minutes` int(11) NOT NULL,
  `room_id` varchar(191) DEFAULT NULL,
  `total_marks` decimal(5,2) NOT NULL DEFAULT 100.00,
  `pass_marks` decimal(5,2) NOT NULL DEFAULT 33.00,
  `instructions` text DEFAULT NULL,
  `status` varchar(191) NOT NULL DEFAULT 'DRAFT',
  `created_at` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updated_at` datetime(3) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `exam_routines`
--

INSERT INTO `exam_routines` (`id`, `school_id`, `academic_year_id`, `exam_id`, `class_id`, `section_id`, `subject_id`, `exam_date`, `start_time`, `end_time`, `duration_minutes`, `room_id`, `total_marks`, `pass_marks`, `instructions`, `status`, `created_at`, `updated_at`) VALUES
('demo-exam-routine-10-1', '7b2b510e-dab0-4f0f-9aae-f1d27c9de59c', 'demo-academic-year-current', 'demo-exam-upcoming', 'demo-class-10', 'demo-section-10-1', 'demo-subject-ban', '2026-08-16 08:57:54.944', '10:00', '13:00', 180, 'demo-room-201', 100.00, 33.00, 'Bring admit card and arrive 30 minutes early.', 'PUBLISHED', '2026-08-02 08:11:11.815', '2026-08-02 08:57:58.662'),
('demo-exam-routine-10-2', '7b2b510e-dab0-4f0f-9aae-f1d27c9de59c', 'demo-academic-year-current', 'demo-exam-upcoming', 'demo-class-10', 'demo-section-10-1', 'demo-subject-eng', '2026-08-17 08:57:54.944', '10:00', '13:00', 180, 'demo-room-201', 100.00, 33.00, 'Bring admit card and arrive 30 minutes early.', 'PUBLISHED', '2026-08-02 08:11:11.821', '2026-08-02 08:57:58.665'),
('demo-exam-routine-10-3', '7b2b510e-dab0-4f0f-9aae-f1d27c9de59c', 'demo-academic-year-current', 'demo-exam-upcoming', 'demo-class-10', 'demo-section-10-1', 'demo-subject-mat', '2026-08-18 08:57:54.944', '10:00', '13:00', 180, 'demo-room-201', 100.00, 33.00, 'Bring admit card and arrive 30 minutes early.', 'PUBLISHED', '2026-08-02 08:11:11.824', '2026-08-02 08:57:58.670'),
('demo-exam-routine-6-1', '7b2b510e-dab0-4f0f-9aae-f1d27c9de59c', 'demo-academic-year-current', 'demo-exam-upcoming', 'demo-class-6', 'demo-section-6-1', 'demo-subject-ban', '2026-08-16 00:00:00.000', '10:00', '13:00', 180, 'demo-room-201', 100.00, 33.00, 'Bring admit card and arrive 30 minutes early.sdf', 'DRAFT', '2026-08-02 08:11:11.683', '2026-08-10 10:05:24.893'),
('demo-exam-routine-6-2', '7b2b510e-dab0-4f0f-9aae-f1d27c9de59c', 'demo-academic-year-current', 'demo-exam-upcoming', 'demo-class-6', 'demo-section-6-1', 'demo-subject-eng', '2026-08-17 08:57:54.944', '10:00', '13:00', 180, 'demo-room-201', 100.00, 33.00, 'Bring admit card and arrive 30 minutes early.', 'PUBLISHED', '2026-08-02 08:11:11.709', '2026-08-02 08:57:58.619'),
('demo-exam-routine-6-3', '7b2b510e-dab0-4f0f-9aae-f1d27c9de59c', 'demo-academic-year-current', 'demo-exam-upcoming', 'demo-class-6', 'demo-section-6-1', 'demo-subject-mat', '2026-08-18 08:57:54.944', '10:00', '13:00', 180, 'demo-room-201', 100.00, 33.00, 'Bring admit card and arrive 30 minutes early.', 'PUBLISHED', '2026-08-02 08:11:11.741', '2026-08-02 08:57:58.624'),
('demo-exam-routine-7-1', '7b2b510e-dab0-4f0f-9aae-f1d27c9de59c', 'demo-academic-year-current', 'demo-exam-upcoming', 'demo-class-7', 'demo-section-7-1', 'demo-subject-ban', '2026-08-16 08:57:54.944', '10:00', '13:00', 180, 'demo-room-201', 100.00, 33.00, 'Bring admit card and arrive 30 minutes early.', 'PUBLISHED', '2026-08-02 08:11:11.751', '2026-08-02 08:57:58.629'),
('demo-exam-routine-7-2', '7b2b510e-dab0-4f0f-9aae-f1d27c9de59c', 'demo-academic-year-current', 'demo-exam-upcoming', 'demo-class-7', 'demo-section-7-1', 'demo-subject-eng', '2026-08-17 08:57:54.944', '10:00', '13:00', 180, 'demo-room-201', 100.00, 33.00, 'Bring admit card and arrive 30 minutes early.', 'PUBLISHED', '2026-08-02 08:11:11.758', '2026-08-02 08:57:58.633'),
('demo-exam-routine-7-3', '7b2b510e-dab0-4f0f-9aae-f1d27c9de59c', 'demo-academic-year-current', 'demo-exam-upcoming', 'demo-class-7', 'demo-section-7-1', 'demo-subject-mat', '2026-08-18 08:57:54.944', '10:00', '13:00', 180, 'demo-room-201', 100.00, 33.00, 'Bring admit card and arrive 30 minutes early.', 'PUBLISHED', '2026-08-02 08:11:11.764', '2026-08-02 08:57:58.637'),
('demo-exam-routine-8-1', '7b2b510e-dab0-4f0f-9aae-f1d27c9de59c', 'demo-academic-year-current', 'demo-exam-upcoming', 'demo-class-8', 'demo-section-8-1', 'demo-subject-ban', '2026-08-16 08:57:54.944', '10:00', '13:00', 180, 'demo-room-201', 100.00, 33.00, 'Bring admit card and arrive 30 minutes early.', 'PUBLISHED', '2026-08-02 08:11:11.768', '2026-08-02 08:57:58.641'),
('demo-exam-routine-8-2', '7b2b510e-dab0-4f0f-9aae-f1d27c9de59c', 'demo-academic-year-current', 'demo-exam-upcoming', 'demo-class-8', 'demo-section-8-1', 'demo-subject-eng', '2026-08-17 08:57:54.944', '10:00', '13:00', 180, 'demo-room-201', 100.00, 33.00, 'Bring admit card and arrive 30 minutes early.', 'PUBLISHED', '2026-08-02 08:11:11.771', '2026-08-02 08:57:58.645'),
('demo-exam-routine-8-3', '7b2b510e-dab0-4f0f-9aae-f1d27c9de59c', 'demo-academic-year-current', 'demo-exam-upcoming', 'demo-class-8', 'demo-section-8-1', 'demo-subject-mat', '2026-08-18 08:57:54.944', '10:00', '13:00', 180, 'demo-room-201', 100.00, 33.00, 'Bring admit card and arrive 30 minutes early.', 'PUBLISHED', '2026-08-02 08:11:11.775', '2026-08-02 08:57:58.648'),
('demo-exam-routine-9-1', '7b2b510e-dab0-4f0f-9aae-f1d27c9de59c', 'demo-academic-year-current', 'demo-exam-upcoming', 'demo-class-9', 'demo-section-9-1', 'demo-subject-ban', '2026-08-16 08:57:54.944', '10:00', '13:00', 180, 'demo-room-201', 100.00, 33.00, 'Bring admit card and arrive 30 minutes early.', 'PUBLISHED', '2026-08-02 08:11:11.781', '2026-08-02 08:57:58.652'),
('demo-exam-routine-9-2', '7b2b510e-dab0-4f0f-9aae-f1d27c9de59c', 'demo-academic-year-current', 'demo-exam-upcoming', 'demo-class-9', 'demo-section-9-1', 'demo-subject-eng', '2026-08-17 08:57:54.944', '10:00', '13:00', 180, 'demo-room-201', 100.00, 33.00, 'Bring admit card and arrive 30 minutes early.', 'PUBLISHED', '2026-08-02 08:11:11.786', '2026-08-02 08:57:58.656'),
('demo-exam-routine-9-3', '7b2b510e-dab0-4f0f-9aae-f1d27c9de59c', 'demo-academic-year-current', 'demo-exam-upcoming', 'demo-class-9', 'demo-section-9-1', 'demo-subject-mat', '2026-08-18 08:57:54.944', '10:00', '13:00', 180, 'demo-room-201', 100.00, 33.00, 'Bring admit card and arrive 30 minutes early.', 'PUBLISHED', '2026-08-02 08:11:11.808', '2026-08-02 08:57:58.660');

-- --------------------------------------------------------

--
-- Table structure for table `exam_subjects`
--

CREATE TABLE `exam_subjects` (
  `id` varchar(191) NOT NULL,
  `exam_id` varchar(191) NOT NULL,
  `class_id` varchar(191) NOT NULL,
  `subject_id` varchar(191) NOT NULL,
  `full_marks` decimal(5,2) NOT NULL DEFAULT 100.00,
  `pass_marks` decimal(5,2) NOT NULL DEFAULT 33.00,
  `is_optional` tinyint(1) NOT NULL DEFAULT 0,
  `created_at` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updated_at` datetime(3) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `exam_subjects`
--

INSERT INTO `exam_subjects` (`id`, `exam_id`, `class_id`, `subject_id`, `full_marks`, `pass_marks`, `is_optional`, `created_at`, `updated_at`) VALUES
('120c97a0-54d2-4059-9076-20987c3ce32e', 'demo-exam-upcoming', 'demo-class-6', 'demo-subject-ban', 100.00, 33.00, 0, '2026-08-02 10:12:08.362', '2026-08-02 10:12:08.362'),
('197d6b35-e37d-4664-ac9e-2059ef749fa9', 'demo-exam-upcoming', 'demo-class-6', 'demo-subject-mat', 100.00, 33.00, 0, '2026-08-09 09:02:24.920', '2026-08-09 09:02:24.920'),
('1a4b46f9-bb3b-4bf0-b69b-90b46e8bed3e', 'demo-exam-upcoming', 'demo-class-6', 'demo-subject-sci', 100.00, 33.00, 0, '2026-08-02 10:12:08.362', '2026-08-02 10:12:08.362'),
('22091dba-8398-4404-b5e6-11c647823b01', 'demo-exam-upcoming', 'demo-class-8', 'demo-subject-ban', 100.00, 33.00, 0, '2026-08-09 06:53:22.807', '2026-08-09 06:53:22.807'),
('268abc51-f845-4ae8-9cc7-22be34aa0bc4', 'demo-exam-completed', 'demo-class-6', 'demo-subject-ban', 100.00, 33.00, 0, '2026-08-02 10:00:18.634', '2026-08-02 10:00:18.634'),
('2d7f7a06-e895-4d0f-8c15-556c0f98a6f9', 'demo-exam-upcoming', 'demo-class-6', 'demo-subject-bgs', 100.00, 33.00, 0, '2026-08-09 09:02:24.920', '2026-08-09 09:02:24.920'),
('4803b8b0-7d9a-475f-ac09-93f66262a6b6', 'demo-exam-upcoming', 'demo-class-6', 'demo-subject-eng', 100.00, 33.00, 0, '2026-08-09 09:02:24.920', '2026-08-09 09:02:24.920'),
('5ded2424-757b-4a7a-a571-c00afdb7b73b', 'demo-exam-upcoming', 'demo-class-6', 'demo-subject-ict', 100.00, 33.00, 0, '2026-08-09 09:02:24.920', '2026-08-09 09:02:24.920'),
('6436721a-df66-4408-98a1-82e67f95f807', 'demo-exam-upcoming', 'demo-class-6', 'demo-subject-bgs', 100.00, 33.00, 0, '2026-08-02 10:12:08.362', '2026-08-02 10:12:08.362'),
('8ef03659-c89f-428d-ab01-d031814f335e', 'demo-exam-upcoming', 'demo-class-6', 'demo-subject-ban', 100.00, 33.00, 0, '2026-08-09 09:02:24.920', '2026-08-09 09:02:24.920'),
('a8c87ebc-97db-413e-9279-4b6fa5ce6a73', 'demo-exam-upcoming', 'demo-class-6', 'demo-subject-sci', 100.00, 33.00, 0, '2026-08-09 09:02:24.920', '2026-08-09 09:02:24.920'),
('c0b6488a-bc8c-48da-bed8-3a147c318bf7', 'demo-exam-upcoming', 'demo-class-6', 'demo-subject-mat', 100.00, 33.00, 0, '2026-08-02 10:12:08.362', '2026-08-02 10:12:08.362'),
('db0a54b5-b7a6-4ac1-bf8b-a052515167d4', 'demo-exam-upcoming', 'demo-class-6', 'demo-subject-eng', 100.00, 33.00, 0, '2026-08-02 10:12:08.362', '2026-08-02 10:12:08.362'),
('e87c4680-bc39-4d36-811d-b4f5e1dc227a', 'demo-exam-upcoming', 'demo-class-6', 'demo-subject-ict', 100.00, 33.00, 0, '2026-08-02 10:12:08.362', '2026-08-02 10:12:08.362');

-- --------------------------------------------------------

--
-- Table structure for table `exam_types`
--

CREATE TABLE `exam_types` (
  `id` varchar(191) NOT NULL,
  `school_id` varchar(191) NOT NULL,
  `name` varchar(191) NOT NULL,
  `code` varchar(191) NOT NULL,
  `weightage` decimal(5,2) DEFAULT NULL,
  `description` varchar(191) DEFAULT NULL,
  `created_at` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updated_at` datetime(3) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `export_histories`
--

CREATE TABLE `export_histories` (
  `id` varchar(191) NOT NULL,
  `school_id` varchar(191) NOT NULL,
  `user_id` varchar(191) NOT NULL,
  `report_type` varchar(191) NOT NULL,
  `format` varchar(191) NOT NULL,
  `filters` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`filters`)),
  `status` varchar(191) NOT NULL DEFAULT 'COMPLETED',
  `row_count` int(11) NOT NULL DEFAULT 0,
  `file_name` varchar(191) DEFAULT NULL,
  `created_at` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `completed_at` datetime(3) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `export_histories`
--

INSERT INTO `export_histories` (`id`, `school_id`, `user_id`, `report_type`, `format`, `filters`, `status`, `row_count`, `file_name`, `created_at`, `completed_at`) VALUES
('677f61fa-0cd0-4525-bf95-ab51f58518d0', '320f145e-973e-4da1-b2ec-15134f8ab928', 'd2e15602-e683-4793-a332-b32ab9c1f1ad', 'student', 'pdf', '{\"page\":\"1\",\"pageSize\":\"25\",\"sortOrder\":\"asc\",\"academicYearId\":\"48cfaae1-66ea-42e0-85fd-fa15d8b5191d\",\"sessionId\":\"756762a1-5e55-49e8-ac6d-b8b137c38364\"}', 'COMPLETED', 50, 'student-2026-08-02T05-38-31-774Z.html', '2026-08-02 05:38:31.775', '2026-08-02 05:38:31.774'),
('6c629362-4816-47ba-a15c-0d26737fdf76', '320f145e-973e-4da1-b2ec-15134f8ab928', 'd2e15602-e683-4793-a332-b32ab9c1f1ad', 'student', 'xlsx', '{\"page\":\"1\",\"pageSize\":\"25\",\"sortOrder\":\"asc\",\"academicYearId\":\"48cfaae1-66ea-42e0-85fd-fa15d8b5191d\",\"sessionId\":\"756762a1-5e55-49e8-ac6d-b8b137c38364\"}', 'COMPLETED', 50, 'student-2026-08-02T05-34-46-022Z.xlsx', '2026-08-02 05:34:46.028', '2026-08-02 05:34:46.022'),
('85c89128-531b-4040-b424-527556ef2bcc', '320f145e-973e-4da1-b2ec-15134f8ab928', '0af68831-ee20-4b45-a7af-5e499747d897', 'student', 'pdf', '{\"sessionId\":\"756762a1-5e55-49e8-ac6d-b8b137c38364\",\"academicYearId\":\"48cfaae1-66ea-42e0-85fd-fa15d8b5191d\"}', 'COMPLETED', 50, 'student-2026-08-02T05-36-17-973Z.html', '2026-08-02 05:36:17.975', '2026-08-02 05:36:17.973'),
('94e493dd-f944-4966-aebd-485349478055', '320f145e-973e-4da1-b2ec-15134f8ab928', 'd2e15602-e683-4793-a332-b32ab9c1f1ad', 'student', 'pdf', '{\"page\":\"1\",\"pageSize\":\"25\",\"sortOrder\":\"asc\",\"academicYearId\":\"48cfaae1-66ea-42e0-85fd-fa15d8b5191d\",\"sessionId\":\"756762a1-5e55-49e8-ac6d-b8b137c38364\"}', 'COMPLETED', 50, 'student-2026-08-02T05-33-58-991Z.html', '2026-08-02 05:33:58.998', '2026-08-02 05:33:58.991'),
('e8ce3bf5-95ce-4d6d-9038-e1fcd096d0de', '320f145e-973e-4da1-b2ec-15134f8ab928', 'd2e15602-e683-4793-a332-b32ab9c1f1ad', 'student', 'pdf', '{\"page\":\"1\",\"pageSize\":\"25\",\"sortOrder\":\"asc\",\"academicYearId\":\"48cfaae1-66ea-42e0-85fd-fa15d8b5191d\",\"sessionId\":\"756762a1-5e55-49e8-ac6d-b8b137c38364\"}', 'COMPLETED', 50, 'student-2026-08-02T05-38-58-648Z.html', '2026-08-02 05:38:58.651', '2026-08-02 05:38:58.648'),
('fa7b3bb6-a62b-44d3-8fc5-cb335b111bf0', 'ee7b1767-4f85-4f38-b355-8202b9657d2a', 'd2e15602-e683-4793-a332-b32ab9c1f1ad', 'student', 'csv', '{\"page\":\"1\",\"pageSize\":\"25\"}', 'COMPLETED', 0, 'student-2026-07-23T11-44-19-466Z.csv', '2026-07-23 11:44:19.468', '2026-07-23 11:44:19.466');

-- --------------------------------------------------------

--
-- Table structure for table `failed_login_attempts`
--

CREATE TABLE `failed_login_attempts` (
  `id` varchar(191) NOT NULL,
  `email` varchar(191) NOT NULL,
  `ip_address` varchar(191) DEFAULT NULL,
  `user_id` varchar(191) DEFAULT NULL,
  `attempt_at` datetime(3) NOT NULL DEFAULT current_timestamp(3)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `failed_login_attempts`
--

INSERT INTO `failed_login_attempts` (`id`, `email`, `ip_address`, `user_id`, `attempt_at`) VALUES
('0e1f2a5d-4957-48f2-83a9-90db14816240', 'demo.admin@school.test', '127.0.0.1', NULL, '2026-08-02 08:58:00.957'),
('124ca708-0989-4ba2-9711-f6610d501502', 'demo.student1@school.test', '127.0.0.1', '83eaf298-cac4-4c7c-9704-631549951d39', '2026-08-06 05:42:01.451'),
('1b6e29fb-4da6-4359-9063-77ee004f9769', 'demo.admin@school.test', '127.0.0.1', NULL, '2026-08-09 05:52:40.906'),
('32716110-87e2-4472-ae08-c1b078e4658a', 'codex.user.crud@school.test', '127.0.0.1', NULL, '2026-08-02 09:07:46.874'),
('4f73e25d-1e34-44ae-ad90-1859e9e04922', 'demo.admin@school.test', '127.0.0.1', NULL, '2026-08-02 08:58:01.676'),
('54871e43-4195-4f69-87ef-158ad9f58f8f', 'demo.admin@school.test', '127.0.0.1', NULL, '2026-08-09 05:52:54.142'),
('5e3c854e-0699-4984-9be7-3acf09b68ab8', 'faculty3@shaplamodel.edu.bd', '127.0.0.1', NULL, '2026-08-06 06:22:46.154'),
('666268f0-2543-47db-b417-bd0ebeb97522', 'teacher@school.test', '127.0.0.1', NULL, '2026-08-02 06:39:54.480'),
('6ec8f661-7d6e-43d4-bb49-1c9bd1ef8193', 'student@school.test', '127.0.0.1', NULL, '2026-08-02 08:02:14.248'),
('75a232fb-984f-4e59-a052-07fe6c5db094', 'academic.admin@school.test', '127.0.0.1', NULL, '2026-08-02 09:44:12.660'),
('7acea6ed-ad8c-4a49-8b1f-6c5aed0e672c', 'invalid@example.invalid', '127.0.0.1', NULL, '2026-07-23 10:46:35.465'),
('7e833eea-3db2-45e9-9687-419b5db49789', 'demo.student1@school.test', '127.0.0.1', '83eaf298-cac4-4c7c-9704-631549951d39', '2026-08-10 06:39:57.039'),
('8fb2ca9a-a2eb-4d45-b4f3-8b74fa8aa27d', 'faculty3@shaplamodel.edu.bd', '127.0.0.1', NULL, '2026-08-06 06:22:34.341'),
('ae819660-dd75-4e8b-8504-5b4749f74cfb', 'demo.admin@school.test', '127.0.0.1', NULL, '2026-08-02 08:56:42.827'),
('bc32e791-2235-419e-8838-f78eb25a2eea', 'student@school.test', '127.0.0.1', NULL, '2026-08-02 08:01:59.151'),
('c9747b41-a1e9-442c-a5a9-74f61425ee66', 'admin@school.test', '127.0.0.1', '52897111-6585-4527-9211-1a20b7c2ff8f', '2026-08-03 05:26:45.576'),
('dc623557-4ec4-4271-9806-7224fb3a0368', 'admin@school.test', '127.0.0.1', '52897111-6585-4527-9211-1a20b7c2ff8f', '2026-08-02 09:00:56.801'),
('e26779e4-37e8-4df3-9334-5a361a638537', 'demo.admin@school.test', '127.0.0.1', NULL, '2026-08-06 05:43:25.986'),
('e50214cb-f014-447d-9900-b8da27301db3', 'demo.teacher1@school.test', '127.0.0.1', 'a7e07343-b155-4218-9a29-f5bccb3a7eef', '2026-08-10 09:32:37.123'),
('f7c89ac3-dfa6-425a-8689-62b715342546', 'demo.admin@school.test', '127.0.0.1', NULL, '2026-08-02 08:58:11.533'),
('fc115d61-6da5-4b67-bdef-a56bae66dc83', 'demo.admin@school.test', '127.0.0.1', NULL, '2026-08-02 08:57:55.730');

-- --------------------------------------------------------

--
-- Table structure for table `fee_invoices`
--

CREATE TABLE `fee_invoices` (
  `id` varchar(191) NOT NULL,
  `school_id` varchar(191) NOT NULL,
  `student_id` varchar(191) NOT NULL,
  `fee_structure_id` varchar(191) NOT NULL,
  `invoice_number` varchar(191) NOT NULL,
  `amount` decimal(12,2) NOT NULL,
  `discount` decimal(12,2) NOT NULL DEFAULT 0.00,
  `paid_amount` decimal(12,2) NOT NULL DEFAULT 0.00,
  `due_date` datetime(3) NOT NULL,
  `status` enum('PENDING','PAID','PARTIAL','OVERDUE','CANCELLED') NOT NULL DEFAULT 'PENDING',
  `created_at` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updated_at` datetime(3) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `fee_invoices`
--

INSERT INTO `fee_invoices` (`id`, `school_id`, `student_id`, `fee_structure_id`, `invoice_number`, `amount`, `discount`, `paid_amount`, `due_date`, `status`, `created_at`, `updated_at`) VALUES
('006e4488-2d8e-40e0-9ae9-e151fb19096b', '7b2b510e-dab0-4f0f-9aae-f1d27c9de59c', 'demo-student-4', '4a4ea331-a988-4e54-9916-6ea6fa06e02e', 'INV-2026-4916891-14', 150.00, 0.00, 0.00, '2026-08-14 12:00:00.000', 'PENDING', '2026-08-09 11:28:36.894', '2026-08-09 11:28:36.894'),
('03f2f861-3264-4e87-a36c-ea416c4346b1', '7b2b510e-dab0-4f0f-9aae-f1d27c9de59c', 'demo-student-2', 'demo-fee-structure-monthly', 'INV-2026-3682741-2', 1500.00, 0.00, 0.00, '2026-08-09 12:00:00.000', 'PENDING', '2026-08-09 11:08:02.743', '2026-08-09 11:08:02.743'),
('058b2010-3794-4366-9314-8a2a7bf149dc', '7b2b510e-dab0-4f0f-9aae-f1d27c9de59c', 'demo-student-12', '4a4ea331-a988-4e54-9916-6ea6fa06e02e', 'INV-2026-4916799-3', 150.00, 0.00, 0.00, '2026-08-14 12:00:00.000', 'PENDING', '2026-08-09 11:28:36.801', '2026-08-09 11:28:36.801'),
('099f80d9-4821-4e72-97ce-e2583c817e40', '7b2b510e-dab0-4f0f-9aae-f1d27c9de59c', 'demo-student-1', 'demo-fee-structure-monthly', 'INV-2026-3682698-0', 1500.00, 0.00, 0.00, '2026-08-09 12:00:00.000', 'PENDING', '2026-08-09 11:08:02.700', '2026-08-09 11:08:02.700'),
('0f0451f7-a227-4e9b-81bc-249891bd0a1d', '7b2b510e-dab0-4f0f-9aae-f1d27c9de59c', 'demo-student-11', '4a4ea331-a988-4e54-9916-6ea6fa06e02e', 'INV-2026-4916788-2', 150.00, 0.00, 0.00, '2026-08-14 12:00:00.000', 'PENDING', '2026-08-09 11:28:36.790', '2026-08-09 11:28:36.790'),
('29164143-fd2f-49f1-b732-4e8e55bd7d06', '7b2b510e-dab0-4f0f-9aae-f1d27c9de59c', 'demo-student-5', '4a4ea331-a988-4e54-9916-6ea6fa06e02e', 'INV-2026-4916900-15', 150.00, 0.00, 0.00, '2026-08-14 12:00:00.000', 'PENDING', '2026-08-09 11:28:36.905', '2026-08-09 11:28:36.905'),
('2e7a2f87-98ac-451d-b91f-0257e4c4a1b1', '7b2b510e-dab0-4f0f-9aae-f1d27c9de59c', 'demo-student-9', 'demo-fee-structure-monthly', 'INV-2026-95900195', 1800.00, 100.00, 1700.00, '2026-08-06 12:00:00.000', 'PAID', '2026-08-06 05:58:20.197', '2026-08-06 05:58:29.899'),
('341175ea-3f1d-42dd-83e4-76ad2c595b11', '7b2b510e-dab0-4f0f-9aae-f1d27c9de59c', 'demo-student-14', '4a4ea331-a988-4e54-9916-6ea6fa06e02e', 'INV-2026-4916817-5', 150.00, 0.00, 0.00, '2026-08-14 12:00:00.000', 'PENDING', '2026-08-09 11:28:36.819', '2026-08-09 11:28:36.819'),
('34d3e764-8a5f-4ba0-90b4-15e619617034', '7b2b510e-dab0-4f0f-9aae-f1d27c9de59c', 'demo-student-17', '4a4ea331-a988-4e54-9916-6ea6fa06e02e', 'INV-2026-4916840-8', 150.00, 0.00, 0.00, '2026-08-14 12:00:00.000', 'PENDING', '2026-08-09 11:28:36.842', '2026-08-09 11:28:36.842'),
('3f487873-7e3c-4987-bdde-14acc64bf861', '7b2b510e-dab0-4f0f-9aae-f1d27c9de59c', 'demo-student-15', '4a4ea331-a988-4e54-9916-6ea6fa06e02e', 'INV-2026-4916823-6', 150.00, 0.00, 0.00, '2026-08-14 12:00:00.000', 'PENDING', '2026-08-09 11:28:36.826', '2026-08-09 11:28:36.826'),
('568e5d6f-3279-479b-a432-2083d1732946', '7b2b510e-dab0-4f0f-9aae-f1d27c9de59c', 'demo-student-10', '4a4ea331-a988-4e54-9916-6ea6fa06e02e', 'INV-2026-4916776-1', 150.00, 0.00, 0.00, '2026-08-14 12:00:00.000', 'PENDING', '2026-08-09 11:28:36.778', '2026-08-09 11:28:36.778'),
('640a0890-07e2-4639-90d2-8bc13d0e99df', '7b2b510e-dab0-4f0f-9aae-f1d27c9de59c', 'demo-student-18', '4a4ea331-a988-4e54-9916-6ea6fa06e02e', 'INV-2026-4916848-9', 150.00, 0.00, 0.00, '2026-08-14 12:00:00.000', 'PENDING', '2026-08-09 11:28:36.850', '2026-08-09 11:28:36.850'),
('71efdff9-bcdb-437f-93e6-b773c216c4d4', '7b2b510e-dab0-4f0f-9aae-f1d27c9de59c', 'demo-student-16', '4a4ea331-a988-4e54-9916-6ea6fa06e02e', 'INV-2026-4916831-7', 150.00, 0.00, 0.00, '2026-08-14 12:00:00.000', 'PENDING', '2026-08-09 11:28:36.835', '2026-08-09 11:28:36.835'),
('a27bbc26-799e-432a-9da6-9c0deeb1ca74', '7b2b510e-dab0-4f0f-9aae-f1d27c9de59c', 'demo-student-20', '4a4ea331-a988-4e54-9916-6ea6fa06e02e', 'INV-2026-4916874-12', 150.00, 0.00, 0.00, '2026-08-14 12:00:00.000', 'PENDING', '2026-08-09 11:28:36.876', '2026-08-09 11:28:36.876'),
('a77318fd-8658-452f-89fd-efea5a8ec911', '7b2b510e-dab0-4f0f-9aae-f1d27c9de59c', 'demo-student-2', '4a4ea331-a988-4e54-9916-6ea6fa06e02e', 'INV-2026-4916868-11', 150.00, 0.00, 0.00, '2026-08-14 12:00:00.000', 'PENDING', '2026-08-09 11:28:36.871', '2026-08-09 11:28:36.871'),
('ad8ea3e6-7541-4a07-985b-34c0a8ceae52', '7b2b510e-dab0-4f0f-9aae-f1d27c9de59c', 'demo-student-6', '4a4ea331-a988-4e54-9916-6ea6fa06e02e', 'INV-2026-4916908-16', 150.00, 0.00, 0.00, '2026-08-14 12:00:00.000', 'PENDING', '2026-08-09 11:28:36.910', '2026-08-09 11:28:36.910'),
('af8871f7-24fc-4720-93df-05ac5daf4746', '7b2b510e-dab0-4f0f-9aae-f1d27c9de59c', 'demo-student-8', '4a4ea331-a988-4e54-9916-6ea6fa06e02e', 'INV-2026-4916959-18', 150.00, 0.00, 150.00, '2026-08-14 12:00:00.000', 'PAID', '2026-08-09 11:28:36.961', '2026-08-10 10:47:06.770'),
('b9e3003e-3581-4121-b496-8f6adaa676ee', '7b2b510e-dab0-4f0f-9aae-f1d27c9de59c', 'demo-student-3', 'demo-fee-structure-monthly', 'INV-2026-3682733-1', 1500.00, 0.00, 0.00, '2026-08-09 12:00:00.000', 'PENDING', '2026-08-09 11:08:02.735', '2026-08-09 11:08:02.735'),
('bfa593e7-c82e-45dc-9800-764492bd170e', '7b2b510e-dab0-4f0f-9aae-f1d27c9de59c', 'demo-student-19', '4a4ea331-a988-4e54-9916-6ea6fa06e02e', 'INV-2026-4916855-10', 150.00, 0.00, 0.00, '2026-08-14 12:00:00.000', 'PENDING', '2026-08-09 11:28:36.858', '2026-08-09 11:28:36.858'),
('c09bce97-9c11-47fe-928a-866b9eca3a42', '7b2b510e-dab0-4f0f-9aae-f1d27c9de59c', 'e324ef61-2e01-44bb-8e0b-3d5690d33452', '4a4ea331-a988-4e54-9916-6ea6fa06e02e', 'INV-ADM-50021', 150.00, 0.00, 150.00, '2026-08-10 10:37:48.390', 'PAID', '2026-08-10 10:37:48.396', '2026-08-10 10:37:48.396'),
('cc2e95f2-16a8-4799-a684-f771897354e8', '7b2b510e-dab0-4f0f-9aae-f1d27c9de59c', 'demo-student-3', '4a4ea331-a988-4e54-9916-6ea6fa06e02e', 'INV-2026-4916884-13', 150.00, 0.00, 0.00, '2026-08-14 12:00:00.000', 'PENDING', '2026-08-09 11:28:36.887', '2026-08-09 11:28:36.887'),
('d62b5227-0d73-400f-b0c4-7418428187ef', '7b2b510e-dab0-4f0f-9aae-f1d27c9de59c', 'demo-student-1', '4a4ea331-a988-4e54-9916-6ea6fa06e02e', 'INV-2026-4916767-0', 150.00, 0.00, 0.00, '2026-08-14 12:00:00.000', 'PENDING', '2026-08-09 11:28:36.769', '2026-08-09 11:28:36.769'),
('demo-fee-invoice-1', '7b2b510e-dab0-4f0f-9aae-f1d27c9de59c', 'demo-student-1', 'demo-fee-structure-monthly', 'DEMO-FEE-2026-8-001', 1800.00, 0.00, 1800.00, '2026-08-10 03:00:00.000', 'PAID', '2026-08-02 08:11:11.841', '2026-08-02 08:57:58.703'),
('demo-fee-invoice-10', '7b2b510e-dab0-4f0f-9aae-f1d27c9de59c', 'demo-student-10', 'demo-fee-structure-monthly', 'DEMO-FEE-2026-8-010', 1800.00, 0.00, 1000.00, '2026-08-10 03:00:00.000', 'PARTIAL', '2026-08-02 08:11:12.155', '2026-08-02 08:57:58.862'),
('demo-fee-invoice-11', '7b2b510e-dab0-4f0f-9aae-f1d27c9de59c', 'demo-student-11', 'demo-fee-structure-monthly', 'DEMO-FEE-2026-8-011', 1800.00, 0.00, 0.00, '2026-08-10 03:00:00.000', 'PENDING', '2026-08-02 08:11:12.169', '2026-08-02 08:57:58.875'),
('demo-fee-invoice-12', '7b2b510e-dab0-4f0f-9aae-f1d27c9de59c', 'demo-student-12', 'demo-fee-structure-monthly', 'DEMO-FEE-2026-8-012', 1800.00, 0.00, 0.00, '2026-08-10 03:00:00.000', 'PENDING', '2026-08-02 08:11:12.179', '2026-08-02 08:57:58.886'),
('demo-fee-invoice-13', '7b2b510e-dab0-4f0f-9aae-f1d27c9de59c', 'demo-student-13', 'demo-fee-structure-monthly', 'DEMO-FEE-2026-8-013', 1800.00, 0.00, 1800.00, '2026-08-10 03:00:00.000', 'PAID', '2026-08-02 08:11:12.188', '2026-08-02 08:57:58.897'),
('demo-fee-invoice-14', '7b2b510e-dab0-4f0f-9aae-f1d27c9de59c', 'demo-student-14', 'demo-fee-structure-monthly', 'DEMO-FEE-2026-8-014', 1800.00, 0.00, 1000.00, '2026-08-10 03:00:00.000', 'PARTIAL', '2026-08-02 08:11:12.201', '2026-08-02 08:57:58.912'),
('demo-fee-invoice-15', '7b2b510e-dab0-4f0f-9aae-f1d27c9de59c', 'demo-student-15', 'demo-fee-structure-monthly', 'DEMO-FEE-2026-8-015', 1800.00, 0.00, 0.00, '2026-08-10 03:00:00.000', 'PENDING', '2026-08-02 08:11:12.219', '2026-08-02 08:57:58.930'),
('demo-fee-invoice-16', '7b2b510e-dab0-4f0f-9aae-f1d27c9de59c', 'demo-student-16', 'demo-fee-structure-monthly', 'DEMO-FEE-2026-8-016', 1800.00, 0.00, 0.00, '2026-08-10 03:00:00.000', 'PENDING', '2026-08-02 08:11:12.231', '2026-08-02 08:57:58.943'),
('demo-fee-invoice-17', '7b2b510e-dab0-4f0f-9aae-f1d27c9de59c', 'demo-student-17', 'demo-fee-structure-monthly', 'DEMO-FEE-2026-8-017', 1800.00, 0.00, 1800.00, '2026-08-10 03:00:00.000', 'PAID', '2026-08-02 08:11:12.242', '2026-08-02 08:57:58.955'),
('demo-fee-invoice-18', '7b2b510e-dab0-4f0f-9aae-f1d27c9de59c', 'demo-student-18', 'demo-fee-structure-monthly', 'DEMO-FEE-2026-8-018', 1800.00, 0.00, 1000.00, '2026-08-10 03:00:00.000', 'PARTIAL', '2026-08-02 08:11:12.257', '2026-08-02 08:57:58.967'),
('demo-fee-invoice-19', '7b2b510e-dab0-4f0f-9aae-f1d27c9de59c', 'demo-student-19', 'demo-fee-structure-monthly', 'DEMO-FEE-2026-8-019', 1800.00, 0.00, 0.00, '2026-08-10 03:00:00.000', 'PENDING', '2026-08-02 08:11:12.272', '2026-08-02 08:57:58.980'),
('demo-fee-invoice-2', '7b2b510e-dab0-4f0f-9aae-f1d27c9de59c', 'demo-student-2', 'demo-fee-structure-monthly', 'DEMO-FEE-2026-8-002', 1800.00, 0.00, 1000.00, '2026-08-10 03:00:00.000', 'PARTIAL', '2026-08-02 08:11:11.990', '2026-08-02 08:57:58.768'),
('demo-fee-invoice-20', '7b2b510e-dab0-4f0f-9aae-f1d27c9de59c', 'demo-student-20', 'demo-fee-structure-monthly', 'DEMO-FEE-2026-8-020', 1800.00, 0.00, 0.00, '2026-08-10 03:00:00.000', 'PENDING', '2026-08-02 08:11:12.286', '2026-08-02 08:57:58.990'),
('demo-fee-invoice-3', '7b2b510e-dab0-4f0f-9aae-f1d27c9de59c', 'demo-student-3', 'demo-fee-structure-monthly', 'DEMO-FEE-2026-8-003', 1800.00, 0.00, 0.00, '2026-08-10 03:00:00.000', 'PENDING', '2026-08-02 08:11:12.022', '2026-08-02 08:57:58.782'),
('demo-fee-invoice-4', '7b2b510e-dab0-4f0f-9aae-f1d27c9de59c', 'demo-student-4', 'demo-fee-structure-monthly', 'DEMO-FEE-2026-8-004', 1800.00, 0.00, 0.00, '2026-08-10 03:00:00.000', 'PENDING', '2026-08-02 08:11:12.041', '2026-08-02 08:57:58.792'),
('demo-fee-invoice-5', '7b2b510e-dab0-4f0f-9aae-f1d27c9de59c', 'demo-student-5', 'demo-fee-structure-monthly', 'DEMO-FEE-2026-8-005', 1800.00, 0.00, 1800.00, '2026-08-10 03:00:00.000', 'PAID', '2026-08-02 08:11:12.057', '2026-08-02 08:57:58.802'),
('demo-fee-invoice-6', '7b2b510e-dab0-4f0f-9aae-f1d27c9de59c', 'demo-student-6', 'demo-fee-structure-monthly', 'DEMO-FEE-2026-8-006', 1800.00, 0.00, 1000.00, '2026-08-10 03:00:00.000', 'PARTIAL', '2026-08-02 08:11:12.075', '2026-08-02 08:57:58.816'),
('demo-fee-invoice-7', '7b2b510e-dab0-4f0f-9aae-f1d27c9de59c', 'demo-student-7', 'demo-fee-structure-monthly', 'DEMO-FEE-2026-8-007', 1800.00, 0.00, 0.00, '2026-08-10 03:00:00.000', 'PENDING', '2026-08-02 08:11:12.092', '2026-08-02 08:57:58.828'),
('demo-fee-invoice-8', '7b2b510e-dab0-4f0f-9aae-f1d27c9de59c', 'demo-student-8', 'demo-fee-structure-monthly', 'DEMO-FEE-2026-8-008', 1800.00, 0.00, 0.00, '2026-08-10 03:00:00.000', 'PENDING', '2026-08-02 08:11:12.119', '2026-08-02 08:57:58.838'),
('demo-fee-invoice-9', '7b2b510e-dab0-4f0f-9aae-f1d27c9de59c', 'demo-student-9', 'demo-fee-structure-monthly', 'DEMO-FEE-2026-8-009', 1800.00, 0.00, 1800.00, '2026-08-10 03:00:00.000', 'PAID', '2026-08-02 08:11:12.136', '2026-08-02 08:57:58.849'),
('ea18b7d8-465a-4b1f-9f3b-99a9d6920761', '7b2b510e-dab0-4f0f-9aae-f1d27c9de59c', 'demo-student-13', '4a4ea331-a988-4e54-9916-6ea6fa06e02e', 'INV-2026-4916811-4', 150.00, 0.00, 0.00, '2026-08-14 12:00:00.000', 'PENDING', '2026-08-09 11:28:36.814', '2026-08-09 11:28:36.814'),
('fb2716aa-b010-49f9-b8a2-a6d41cb314eb', '7b2b510e-dab0-4f0f-9aae-f1d27c9de59c', 'demo-student-7', '4a4ea331-a988-4e54-9916-6ea6fa06e02e', 'INV-2026-4916917-17', 150.00, 0.00, 0.00, '2026-08-14 12:00:00.000', 'PENDING', '2026-08-09 11:28:36.920', '2026-08-09 11:28:36.920'),
('ffcba580-31ca-444f-92c3-450122dd0c28', '7b2b510e-dab0-4f0f-9aae-f1d27c9de59c', 'demo-student-4', 'demo-fee-structure-monthly', 'INV-2026-3682750-3', 1500.00, 0.00, 0.00, '2026-08-09 12:00:00.000', 'PENDING', '2026-08-09 11:08:02.752', '2026-08-09 11:08:02.752'),
('ffe0b6c9-ac41-4fa7-a553-c6ac4bb71c19', '7b2b510e-dab0-4f0f-9aae-f1d27c9de59c', 'demo-student-9', '4a4ea331-a988-4e54-9916-6ea6fa06e02e', 'INV-2026-4916968-19', 150.00, 0.00, 150.00, '2026-08-14 12:00:00.000', 'PAID', '2026-08-09 11:28:36.971', '2026-08-10 10:45:04.488');

-- --------------------------------------------------------

--
-- Table structure for table `fee_structures`
--

CREATE TABLE `fee_structures` (
  `id` varchar(191) NOT NULL,
  `school_id` varchar(191) NOT NULL,
  `name` varchar(191) NOT NULL,
  `amount` decimal(12,2) NOT NULL,
  `frequency` varchar(191) NOT NULL DEFAULT 'MONTHLY',
  `description` varchar(191) DEFAULT NULL,
  `created_at` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updated_at` datetime(3) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `fee_structures`
--

INSERT INTO `fee_structures` (`id`, `school_id`, `name`, `amount`, `frequency`, `description`, `created_at`, `updated_at`) VALUES
('4a4ea331-a988-4e54-9916-6ea6fa06e02e', '7b2b510e-dab0-4f0f-9aae-f1d27c9de59c', 'LAB FEE', 150.00, 'MONTHLY', 'LAB FEE FOR MONTHLY', '2026-08-09 11:11:39.161', '2026-08-09 11:11:39.161'),
('demo-fee-structure-monthly', '7b2b510e-dab0-4f0f-9aae-f1d27c9de59c', 'Monthly Tuition Fee', 1800.00, 'MONTHLY', 'Monthly academic tuition', '2026-08-02 08:11:11.826', '2026-08-10 10:39:11.933');

-- --------------------------------------------------------

--
-- Table structure for table `fee_structure_items`
--

CREATE TABLE `fee_structure_items` (
  `id` varchar(191) NOT NULL,
  `fee_structure_id` varchar(191) NOT NULL,
  `fee_type_id` varchar(191) NOT NULL,
  `amount` decimal(12,2) NOT NULL,
  `is_optional` tinyint(1) NOT NULL DEFAULT 0,
  `created_at` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updated_at` datetime(3) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `fee_structure_items`
--

INSERT INTO `fee_structure_items` (`id`, `fee_structure_id`, `fee_type_id`, `amount`, `is_optional`, `created_at`, `updated_at`) VALUES
('4914b089-d22d-40fd-8ac0-72a2fce8adc2', 'demo-fee-structure-monthly', '3af36d4d-9273-4081-896f-3043b664a317', 1800.00, 0, '2026-08-10 10:39:11.951', '2026-08-10 10:39:11.951'),
('e991db97-0fe1-4989-a947-0077522a0126', '4a4ea331-a988-4e54-9916-6ea6fa06e02e', 'a8372505-e091-400a-842c-31b48b477438', 150.00, 0, '2026-08-09 11:28:36.750', '2026-08-09 11:28:36.750');

-- --------------------------------------------------------

--
-- Table structure for table `fee_types`
--

CREATE TABLE `fee_types` (
  `id` varchar(191) NOT NULL,
  `school_id` varchar(191) NOT NULL,
  `name` varchar(191) NOT NULL,
  `code` varchar(191) NOT NULL,
  `category` varchar(191) NOT NULL,
  `description` varchar(191) DEFAULT NULL,
  `is_recurring` tinyint(1) NOT NULL DEFAULT 1,
  `created_at` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updated_at` datetime(3) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `fee_types`
--

INSERT INTO `fee_types` (`id`, `school_id`, `name`, `code`, `category`, `description`, `is_recurring`, `created_at`, `updated_at`) VALUES
('3af36d4d-9273-4081-896f-3043b664a317', '7b2b510e-dab0-4f0f-9aae-f1d27c9de59c', 'TUITION Fee', 'TUITION', 'TUITION', 'Monthly academic tuition', 1, '2026-08-02 08:11:11.834', '2026-08-10 10:39:11.942'),
('a8372505-e091-400a-842c-31b48b477438', '7b2b510e-dab0-4f0f-9aae-f1d27c9de59c', 'LAB Fee', 'LAB', 'LAB', 'LAB FEE FOR MONTHLY', 0, '2026-08-09 11:11:39.166', '2026-08-09 11:28:36.658'),
('db02f6ac-4039-4179-b7d1-c1ca91a3e05f', '7b2b510e-dab0-4f0f-9aae-f1d27c9de59c', 'Examination Fee', 'EXAM', 'EXAM', NULL, 0, '2026-08-02 08:11:11.838', '2026-08-02 08:57:58.697');

-- --------------------------------------------------------

--
-- Table structure for table `fee_waivers`
--

CREATE TABLE `fee_waivers` (
  `id` varchar(191) NOT NULL,
  `school_id` varchar(191) NOT NULL,
  `student_id` varchar(191) NOT NULL,
  `fee_type_id` varchar(191) DEFAULT NULL,
  `waiver_type` varchar(191) NOT NULL,
  `waiver_value` decimal(12,2) NOT NULL,
  `reason` varchar(191) NOT NULL,
  `approved_by` varchar(191) DEFAULT NULL,
  `status` varchar(191) NOT NULL DEFAULT 'ACTIVE',
  `created_at` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updated_at` datetime(3) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `financial_accounts`
--

CREATE TABLE `financial_accounts` (
  `id` varchar(191) NOT NULL,
  `school_id` varchar(191) NOT NULL,
  `account_name` varchar(191) NOT NULL,
  `account_type` varchar(191) NOT NULL,
  `account_number` varchar(191) DEFAULT NULL,
  `balance` decimal(12,2) NOT NULL DEFAULT 0.00,
  `created_at` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updated_at` datetime(3) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `financial_accounts`
--

INSERT INTO `financial_accounts` (`id`, `school_id`, `account_name`, `account_type`, `account_number`, `balance`, `created_at`, `updated_at`) VALUES
('demo-account-cash', '7b2b510e-dab0-4f0f-9aae-f1d27c9de59c', 'School Cash Account', 'CASH', 'CASH-001', 185000.00, '2026-08-02 08:11:12.337', '2026-08-02 08:57:59.025');

-- --------------------------------------------------------

--
-- Table structure for table `financial_transactions`
--

CREATE TABLE `financial_transactions` (
  `id` varchar(191) NOT NULL,
  `school_id` varchar(191) NOT NULL,
  `transaction_number` varchar(191) NOT NULL,
  `account_id` varchar(191) NOT NULL,
  `transaction_type` varchar(191) NOT NULL,
  `category` varchar(191) NOT NULL,
  `amount` decimal(12,2) NOT NULL,
  `reference_id` varchar(191) DEFAULT NULL,
  `description` varchar(191) NOT NULL,
  `transaction_date` datetime(3) NOT NULL,
  `created_at` datetime(3) NOT NULL DEFAULT current_timestamp(3)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `financial_transactions`
--

INSERT INTO `financial_transactions` (`id`, `school_id`, `transaction_number`, `account_id`, `transaction_type`, `category`, `amount`, `reference_id`, `description`, `transaction_date`, `created_at`) VALUES
('demo-finance-expense-1', '7b2b510e-dab0-4f0f-9aae-f1d27c9de59c', 'DEMO-EXPENSE-2026-8-1', 'demo-account-cash', 'DEBIT', 'EXPENSE', 8500.00, NULL, 'Electricity and internet bill', '2026-08-12 18:00:00.000', '2026-08-02 08:11:12.357'),
('demo-finance-income-1', '7b2b510e-dab0-4f0f-9aae-f1d27c9de59c', 'DEMO-INCOME-2026-8-1', 'demo-account-cash', 'CREDIT', 'FEE_COLLECTION', 28600.00, NULL, 'Monthly tuition and examination fee collection', '2026-08-08 18:00:00.000', '2026-08-02 08:11:12.343');

-- --------------------------------------------------------

--
-- Table structure for table `fines`
--

CREATE TABLE `fines` (
  `id` varchar(191) NOT NULL,
  `school_id` varchar(191) NOT NULL,
  `invoice_id` varchar(191) NOT NULL,
  `student_id` varchar(191) NOT NULL,
  `reason` varchar(191) NOT NULL,
  `fine_amount` decimal(12,2) NOT NULL,
  `waived_amount` decimal(12,2) NOT NULL DEFAULT 0.00,
  `net_fine` decimal(12,2) NOT NULL,
  `status` varchar(191) NOT NULL DEFAULT 'PENDING',
  `created_at` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updated_at` datetime(3) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `generated_documents`
--

CREATE TABLE `generated_documents` (
  `id` varchar(191) NOT NULL,
  `school_id` varchar(191) NOT NULL,
  `document_type` varchar(191) NOT NULL,
  `target_type` varchar(191) NOT NULL,
  `target_id` varchar(191) NOT NULL,
  `verification_code` varchar(191) NOT NULL,
  `qr_code_data` varchar(191) NOT NULL,
  `issue_date` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `issued_by_id` varchar(191) DEFAULT NULL,
  `status` varchar(191) NOT NULL DEFAULT 'VALID',
  `created_at` datetime(3) NOT NULL DEFAULT current_timestamp(3)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `grade_scales`
--

CREATE TABLE `grade_scales` (
  `id` varchar(191) NOT NULL,
  `school_id` varchar(191) NOT NULL,
  `name` varchar(191) NOT NULL,
  `is_default` tinyint(1) NOT NULL DEFAULT 1,
  `created_at` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updated_at` datetime(3) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `grading_rules`
--

CREATE TABLE `grading_rules` (
  `id` varchar(191) NOT NULL,
  `grade_scale_id` varchar(191) NOT NULL,
  `letter_grade` varchar(191) NOT NULL,
  `grade_point` decimal(4,2) NOT NULL,
  `mark_min` decimal(5,2) NOT NULL,
  `mark_max` decimal(5,2) NOT NULL,
  `remarks` varchar(191) DEFAULT NULL,
  `created_at` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updated_at` datetime(3) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `groups`
--

CREATE TABLE `groups` (
  `id` varchar(191) NOT NULL,
  `school_id` varchar(191) NOT NULL,
  `name` varchar(191) NOT NULL,
  `description` text DEFAULT NULL,
  `status` enum('ACTIVE','INACTIVE','SUSPENDED','PENDING') NOT NULL DEFAULT 'ACTIVE',
  `created_at` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updated_at` datetime(3) NOT NULL,
  `deleted_at` datetime(3) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `groups`
--

INSERT INTO `groups` (`id`, `school_id`, `name`, `description`, `status`, `created_at`, `updated_at`, `deleted_at`) VALUES
('demo-group-humanities', '7b2b510e-dab0-4f0f-9aae-f1d27c9de59c', 'Humanities', 'Humanities group for secondary students', 'ACTIVE', '2026-08-02 08:11:07.909', '2026-08-02 08:57:55.592', NULL),
('demo-group-science', '7b2b510e-dab0-4f0f-9aae-f1d27c9de59c', 'Science', 'Science group for secondary students', 'ACTIVE', '2026-08-02 08:11:07.901', '2026-08-02 08:57:55.588', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `guardians`
--

CREATE TABLE `guardians` (
  `id` varchar(191) NOT NULL,
  `school_id` varchar(191) NOT NULL,
  `user_id` varchar(191) DEFAULT NULL,
  `name` varchar(191) NOT NULL,
  `relationship` varchar(191) NOT NULL DEFAULT 'PARENT',
  `phone` varchar(191) NOT NULL,
  `alternate_phone` varchar(191) DEFAULT NULL,
  `email` varchar(191) DEFAULT NULL,
  `occupation` varchar(191) DEFAULT NULL,
  `national_id` varchar(191) DEFAULT NULL,
  `address` text DEFAULT NULL,
  `portal_access_enabled` tinyint(1) NOT NULL DEFAULT 1,
  `status` enum('ACTIVE','INACTIVE','SUSPENDED','PENDING') NOT NULL DEFAULT 'ACTIVE',
  `created_at` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updated_at` datetime(3) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `guardians`
--

INSERT INTO `guardians` (`id`, `school_id`, `user_id`, `name`, `relationship`, `phone`, `alternate_phone`, `email`, `occupation`, `national_id`, `address`, `portal_access_enabled`, `status`, `created_at`, `updated_at`) VALUES
('demo-guardian-1', '7b2b510e-dab0-4f0f-9aae-f1d27c9de59c', '877c8545-cbaa-4195-912d-7af38caf349d', 'Shafiq Chowdhury', 'FATHER', '01550000001', NULL, 'demo.guardian1@school.test', 'Business', NULL, 'Dhaka, Bangladesh', 1, 'ACTIVE', '2026-08-02 08:11:09.083', '2026-08-02 08:57:56.470'),
('demo-guardian-10', '7b2b510e-dab0-4f0f-9aae-f1d27c9de59c', NULL, 'Guardian of Tanjila Haque', 'MOTHER', '01550000010', NULL, NULL, 'Business', NULL, 'Dhaka, Bangladesh', 1, 'ACTIVE', '2026-08-02 08:11:09.317', '2026-08-02 08:57:56.748'),
('demo-guardian-11', '7b2b510e-dab0-4f0f-9aae-f1d27c9de59c', NULL, 'Guardian of Mahin Ahmed', 'FATHER', '01550000011', NULL, NULL, 'Service', NULL, 'Dhaka, Bangladesh', 1, 'ACTIVE', '2026-08-02 08:11:09.339', '2026-08-02 08:57:56.792'),
('demo-guardian-12', '7b2b510e-dab0-4f0f-9aae-f1d27c9de59c', NULL, 'Guardian of Raisa Khan', 'MOTHER', '01550000012', NULL, NULL, 'Service', NULL, 'Dhaka, Bangladesh', 1, 'ACTIVE', '2026-08-02 08:11:09.356', '2026-08-02 08:57:56.832'),
('demo-guardian-13', '7b2b510e-dab0-4f0f-9aae-f1d27c9de59c', NULL, 'Guardian of Fahim Rahman', 'FATHER', '01550000013', NULL, NULL, 'Business', NULL, 'Dhaka, Bangladesh', 1, 'ACTIVE', '2026-08-02 08:11:09.372', '2026-08-02 08:57:56.856'),
('demo-guardian-14', '7b2b510e-dab0-4f0f-9aae-f1d27c9de59c', NULL, 'Guardian of Orpa Sultana', 'MOTHER', '01550000014', NULL, NULL, 'Service', NULL, 'Dhaka, Bangladesh', 1, 'ACTIVE', '2026-08-02 08:11:09.391', '2026-08-02 08:57:56.881'),
('demo-guardian-15', '7b2b510e-dab0-4f0f-9aae-f1d27c9de59c', NULL, 'Guardian of Tahsin Alam', 'FATHER', '01550000015', NULL, NULL, 'Service', NULL, 'Dhaka, Bangladesh', 1, 'ACTIVE', '2026-08-02 08:11:09.414', '2026-08-02 08:57:56.909'),
('demo-guardian-16', '7b2b510e-dab0-4f0f-9aae-f1d27c9de59c', NULL, 'Guardian of Lamisa Islam', 'MOTHER', '01550000016', NULL, NULL, 'Business', NULL, 'Dhaka, Bangladesh', 1, 'ACTIVE', '2026-08-02 08:11:09.498', '2026-08-02 08:57:56.940'),
('demo-guardian-17', '7b2b510e-dab0-4f0f-9aae-f1d27c9de59c', NULL, 'Guardian of Arafat Hossain', 'FATHER', '01550000017', NULL, NULL, 'Service', NULL, 'Dhaka, Bangladesh', 1, 'ACTIVE', '2026-08-02 08:11:09.530', '2026-08-02 08:57:56.963'),
('demo-guardian-18', '7b2b510e-dab0-4f0f-9aae-f1d27c9de59c', NULL, 'Guardian of Mehjabin Chowdhury', 'MOTHER', '01550000018', NULL, NULL, 'Service', NULL, 'Dhaka, Bangladesh', 1, 'ACTIVE', '2026-08-02 08:11:09.554', '2026-08-02 08:57:56.982'),
('demo-guardian-19', '7b2b510e-dab0-4f0f-9aae-f1d27c9de59c', NULL, 'Guardian of Siam Ahmed', 'FATHER', '01550000019', NULL, NULL, 'Business', NULL, 'Dhaka, Bangladesh', 1, 'ACTIVE', '2026-08-02 08:11:09.580', '2026-08-02 08:57:57.000'),
('demo-guardian-2', '7b2b510e-dab0-4f0f-9aae-f1d27c9de59c', '973dc483-2137-4bf2-a775-d25c00d613bb', 'Farzana Ahmed', 'MOTHER', '01550000002', NULL, 'demo.guardian2@school.test', 'Service', NULL, 'Dhaka, Bangladesh', 1, 'ACTIVE', '2026-08-02 08:11:09.122', '2026-08-02 08:57:56.499'),
('demo-guardian-20', '7b2b510e-dab0-4f0f-9aae-f1d27c9de59c', NULL, 'Guardian of Nusaiba Jahan', 'MOTHER', '01550000020', NULL, NULL, 'Service', NULL, 'Dhaka, Bangladesh', 1, 'ACTIVE', '2026-08-02 08:11:09.602', '2026-08-02 08:57:57.019'),
('demo-guardian-3', '7b2b510e-dab0-4f0f-9aae-f1d27c9de59c', NULL, 'Guardian of Rafi Islam', 'FATHER', '01550000003', NULL, NULL, 'Service', NULL, 'Dhaka, Bangladesh', 1, 'ACTIVE', '2026-08-02 08:11:09.149', '2026-08-02 08:57:56.526'),
('demo-guardian-4', '7b2b510e-dab0-4f0f-9aae-f1d27c9de59c', NULL, 'Guardian of Mim Akter', 'MOTHER', '01550000004', NULL, NULL, 'Business', NULL, 'Dhaka, Bangladesh', 1, 'ACTIVE', '2026-08-02 08:11:09.168', '2026-08-02 08:57:56.563'),
('demo-guardian-5', '7b2b510e-dab0-4f0f-9aae-f1d27c9de59c', NULL, 'Guardian of Samiul Hasan', 'FATHER', '01550000005', NULL, NULL, 'Service', NULL, 'Dhaka, Bangladesh', 1, 'ACTIVE', '2026-08-02 08:11:09.196', '2026-08-02 08:57:56.599'),
('demo-guardian-6', '7b2b510e-dab0-4f0f-9aae-f1d27c9de59c', NULL, 'Guardian of Anika Rahman', 'MOTHER', '01550000006', NULL, NULL, 'Service', NULL, 'Dhaka, Bangladesh', 1, 'ACTIVE', '2026-08-02 08:11:09.219', '2026-08-02 08:57:56.629'),
('demo-guardian-7', '7b2b510e-dab0-4f0f-9aae-f1d27c9de59c', NULL, 'Guardian of Zayan Karim', 'FATHER', '01550000007', NULL, NULL, 'Business', NULL, 'Dhaka, Bangladesh', 1, 'ACTIVE', '2026-08-02 08:11:09.249', '2026-08-02 08:57:56.657'),
('demo-guardian-8', '7b2b510e-dab0-4f0f-9aae-f1d27c9de59c', NULL, 'Guardian of Nafisa Noor', 'MOTHER', '01550000008', NULL, NULL, 'Service', NULL, 'Dhaka, Bangladesh', 1, 'ACTIVE', '2026-08-02 08:11:09.271', '2026-08-02 08:57:56.688'),
('demo-guardian-9', '7b2b510e-dab0-4f0f-9aae-f1d27c9de59c', NULL, 'Guardian of Adnan Kabir', 'FATHER', '01550000009', NULL, NULL, 'Service', NULL, 'Dhaka, Bangladesh', 1, 'ACTIVE', '2026-08-02 08:11:09.300', '2026-08-02 08:57:56.725');

-- --------------------------------------------------------

--
-- Table structure for table `holidays`
--

CREATE TABLE `holidays` (
  `id` varchar(191) NOT NULL,
  `school_id` varchar(191) NOT NULL,
  `academic_year_id` varchar(191) DEFAULT NULL,
  `name` varchar(191) NOT NULL,
  `start_date` datetime(3) NOT NULL,
  `end_date` datetime(3) NOT NULL,
  `description` text DEFAULT NULL,
  `status` enum('ACTIVE','INACTIVE','SUSPENDED','PENDING') NOT NULL DEFAULT 'ACTIVE',
  `created_at` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updated_at` datetime(3) NOT NULL,
  `deleted_at` datetime(3) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `homeworks`
--

CREATE TABLE `homeworks` (
  `id` varchar(191) NOT NULL,
  `class_id` varchar(191) NOT NULL,
  `section_id` varchar(191) NOT NULL,
  `subject_id` varchar(191) NOT NULL,
  `teacher_id` varchar(191) NOT NULL,
  `title` varchar(191) NOT NULL,
  `description` text NOT NULL,
  `due_date` datetime(3) NOT NULL,
  `created_at` datetime(3) NOT NULL DEFAULT current_timestamp(3)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `homeworks`
--

INSERT INTO `homeworks` (`id`, `class_id`, `section_id`, `subject_id`, `teacher_id`, `title`, `description`, `due_date`, `created_at`) VALUES
('demo-homework-1', 'demo-class-6', 'demo-section-6-1', 'demo-subject-ban', 'demo-teacher-1', 'Creative writing practice', 'Complete the assigned work neatly and submit it during the next class.', '2026-08-04 08:57:54.944', '2026-08-02 08:11:11.377'),
('demo-homework-2', 'demo-class-7', 'demo-section-7-1', 'demo-subject-eng', 'demo-teacher-2', 'Algebra worksheet', 'Complete the assigned work neatly and submit it during the next class.', '2026-08-05 08:57:54.944', '2026-08-02 08:11:11.384'),
('demo-homework-3', 'demo-class-8', 'demo-section-8-1', 'demo-subject-mat', 'demo-teacher-3', 'Science observation journal', 'Complete the assigned work neatly and submit it during the next class.', '2026-08-06 08:57:54.944', '2026-08-02 08:11:11.387'),
('demo-homework-4', 'demo-class-9', 'demo-section-9-1', 'demo-subject-sci', 'demo-teacher-4', 'Reading comprehension', 'Complete the assigned work neatly and submit it during the next class.', '2026-08-07 08:57:54.944', '2026-08-02 08:11:11.392'),
('demo-homework-5', 'demo-class-10', 'demo-section-10-1', 'demo-subject-bgs', 'demo-teacher-5', 'Creative writing practice', 'Complete the assigned work neatly and submit it during the next class.', '2026-08-08 08:57:54.944', '2026-08-02 08:11:11.395'),
('demo-homework-6', 'demo-class-6', 'demo-section-6-1', 'demo-subject-ict', 'demo-teacher-6', 'Algebra worksheet', 'Complete the assigned work neatly and submit it during the next class.', '2026-08-09 08:57:54.944', '2026-08-02 08:11:11.397'),
('demo-homework-7', 'demo-class-7', 'demo-section-7-1', 'demo-subject-ban', 'demo-teacher-1', 'Science observation journal', 'Complete the assigned work neatly and submit it during the next class.', '2026-08-10 08:57:54.944', '2026-08-02 08:11:11.399'),
('demo-homework-8', 'demo-class-8', 'demo-section-8-1', 'demo-subject-eng', 'demo-teacher-2', 'Reading comprehension', 'Complete the assigned work neatly and submit it during the next class.', '2026-08-11 08:57:54.944', '2026-08-02 08:11:11.402');

-- --------------------------------------------------------

--
-- Table structure for table `import_histories`
--

CREATE TABLE `import_histories` (
  `id` varchar(191) NOT NULL,
  `school_id` varchar(191) NOT NULL,
  `user_id` varchar(191) NOT NULL,
  `import_type` varchar(191) NOT NULL,
  `file_name` varchar(191) NOT NULL,
  `file_size` int(11) NOT NULL,
  `mime_type` varchar(191) NOT NULL,
  `status` varchar(191) NOT NULL DEFAULT 'VALIDATED',
  `total_rows` int(11) NOT NULL DEFAULT 0,
  `valid_rows` int(11) NOT NULL DEFAULT 0,
  `invalid_rows` int(11) NOT NULL DEFAULT 0,
  `processed_rows` int(11) NOT NULL DEFAULT 0,
  `success_rows` int(11) NOT NULL DEFAULT 0,
  `failed_rows` int(11) NOT NULL DEFAULT 0,
  `column_mapping` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`column_mapping`)),
  `payload` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`payload`)),
  `success_report` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`success_report`)),
  `error_report` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`error_report`)),
  `created_at` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `completed_at` datetime(3) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `invoice_items`
--

CREATE TABLE `invoice_items` (
  `id` varchar(191) NOT NULL,
  `invoice_id` varchar(191) NOT NULL,
  `fee_type_id` varchar(191) NOT NULL,
  `description` varchar(191) NOT NULL,
  `amount` decimal(12,2) NOT NULL,
  `discount` decimal(12,2) NOT NULL DEFAULT 0.00,
  `net_amount` decimal(12,2) NOT NULL,
  `paid_amount` decimal(12,2) NOT NULL DEFAULT 0.00,
  `created_at` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updated_at` datetime(3) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `invoice_items`
--

INSERT INTO `invoice_items` (`id`, `invoice_id`, `fee_type_id`, `description`, `amount`, `discount`, `net_amount`, `paid_amount`, `created_at`, `updated_at`) VALUES
('demo-invoice-item-1', 'demo-student-invoice-1', '3af36d4d-9273-4081-896f-3043b664a317', 'August tuition', 1800.00, 0.00, 1800.00, 1800.00, '2026-08-02 08:11:11.973', '2026-08-02 08:57:58.751'),
('demo-invoice-item-10', 'demo-student-invoice-10', '3af36d4d-9273-4081-896f-3043b664a317', 'August tuition', 1800.00, 0.00, 1800.00, 1000.00, '2026-08-02 08:11:12.166', '2026-08-02 08:57:58.871'),
('demo-invoice-item-11', 'demo-student-invoice-11', '3af36d4d-9273-4081-896f-3043b664a317', 'August tuition', 1800.00, 0.00, 1800.00, 0.00, '2026-08-02 08:11:12.175', '2026-08-02 08:57:58.883'),
('demo-invoice-item-12', 'demo-student-invoice-12', '3af36d4d-9273-4081-896f-3043b664a317', 'August tuition', 1800.00, 0.00, 1800.00, 0.00, '2026-08-02 08:11:12.186', '2026-08-02 08:57:58.894'),
('demo-invoice-item-13', 'demo-student-invoice-13', '3af36d4d-9273-4081-896f-3043b664a317', 'August tuition', 1800.00, 0.00, 1800.00, 1800.00, '2026-08-02 08:11:12.199', '2026-08-02 08:57:58.907'),
('demo-invoice-item-14', 'demo-student-invoice-14', '3af36d4d-9273-4081-896f-3043b664a317', 'August tuition', 1800.00, 0.00, 1800.00, 1000.00, '2026-08-02 08:11:12.216', '2026-08-02 08:57:58.926'),
('demo-invoice-item-15', 'demo-student-invoice-15', '3af36d4d-9273-4081-896f-3043b664a317', 'August tuition', 1800.00, 0.00, 1800.00, 0.00, '2026-08-02 08:11:12.226', '2026-08-02 08:57:58.938'),
('demo-invoice-item-16', 'demo-student-invoice-16', '3af36d4d-9273-4081-896f-3043b664a317', 'August tuition', 1800.00, 0.00, 1800.00, 0.00, '2026-08-02 08:11:12.239', '2026-08-02 08:57:58.951'),
('demo-invoice-item-17', 'demo-student-invoice-17', '3af36d4d-9273-4081-896f-3043b664a317', 'August tuition', 1800.00, 0.00, 1800.00, 1800.00, '2026-08-02 08:11:12.255', '2026-08-02 08:57:58.965'),
('demo-invoice-item-18', 'demo-student-invoice-18', '3af36d4d-9273-4081-896f-3043b664a317', 'August tuition', 1800.00, 0.00, 1800.00, 1000.00, '2026-08-02 08:11:12.270', '2026-08-02 08:57:58.977'),
('demo-invoice-item-19', 'demo-student-invoice-19', '3af36d4d-9273-4081-896f-3043b664a317', 'August tuition', 1800.00, 0.00, 1800.00, 0.00, '2026-08-02 08:11:12.283', '2026-08-02 08:57:58.987'),
('demo-invoice-item-2', 'demo-student-invoice-2', '3af36d4d-9273-4081-896f-3043b664a317', 'August tuition', 1800.00, 0.00, 1800.00, 1000.00, '2026-08-02 08:11:12.019', '2026-08-02 08:57:58.779'),
('demo-invoice-item-20', 'demo-student-invoice-20', '3af36d4d-9273-4081-896f-3043b664a317', 'August tuition', 1800.00, 0.00, 1800.00, 0.00, '2026-08-02 08:11:12.302', '2026-08-02 08:57:58.997'),
('demo-invoice-item-3', 'demo-student-invoice-3', '3af36d4d-9273-4081-896f-3043b664a317', 'August tuition', 1800.00, 0.00, 1800.00, 0.00, '2026-08-02 08:11:12.037', '2026-08-02 08:57:58.789'),
('demo-invoice-item-4', 'demo-student-invoice-4', '3af36d4d-9273-4081-896f-3043b664a317', 'August tuition', 1800.00, 300.00, 1500.00, 0.00, '2026-08-02 08:11:12.054', '2026-08-02 08:57:58.799'),
('demo-invoice-item-5', 'demo-student-invoice-5', '3af36d4d-9273-4081-896f-3043b664a317', 'August tuition', 1800.00, 0.00, 1800.00, 1800.00, '2026-08-02 08:11:12.072', '2026-08-02 08:57:58.813'),
('demo-invoice-item-6', 'demo-student-invoice-6', '3af36d4d-9273-4081-896f-3043b664a317', 'August tuition', 1800.00, 0.00, 1800.00, 1000.00, '2026-08-02 08:11:12.089', '2026-08-02 08:57:58.824'),
('demo-invoice-item-7', 'demo-student-invoice-7', '3af36d4d-9273-4081-896f-3043b664a317', 'August tuition', 1800.00, 0.00, 1800.00, 0.00, '2026-08-02 08:11:12.109', '2026-08-02 08:57:58.835'),
('demo-invoice-item-8', 'demo-student-invoice-8', '3af36d4d-9273-4081-896f-3043b664a317', 'August tuition', 1800.00, 0.00, 1800.00, 0.00, '2026-08-02 08:11:12.132', '2026-08-02 08:57:58.846'),
('demo-invoice-item-9', 'demo-student-invoice-9', '3af36d4d-9273-4081-896f-3043b664a317', 'August tuition', 1800.00, 0.00, 1800.00, 1800.00, '2026-08-02 08:11:12.152', '2026-08-02 08:57:58.858');

-- --------------------------------------------------------

--
-- Table structure for table `leave_applications`
--

CREATE TABLE `leave_applications` (
  `id` varchar(191) NOT NULL,
  `school_id` varchar(191) NOT NULL,
  `user_id` varchar(191) NOT NULL,
  `leave_type_id` varchar(191) NOT NULL,
  `start_date` datetime(3) NOT NULL,
  `end_date` datetime(3) NOT NULL,
  `total_days` int(11) NOT NULL,
  `reason` text NOT NULL,
  `attachment_url` varchar(191) DEFAULT NULL,
  `status` varchar(191) NOT NULL DEFAULT 'PENDING',
  `applied_at` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updated_at` datetime(3) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `leave_applications`
--

INSERT INTO `leave_applications` (`id`, `school_id`, `user_id`, `leave_type_id`, `start_date`, `end_date`, `total_days`, `reason`, `attachment_url`, `status`, `applied_at`, `updated_at`) VALUES
('demo-leave-approved-1', '7b2b510e-dab0-4f0f-9aae-f1d27c9de59c', 'b540ef8e-f019-44d9-9a69-3a7cd33423ac', 'cedc5c3a-5323-453f-8d32-9f74c6ef6692', '2026-07-21 08:57:54.944', '2026-07-21 08:57:54.944', 1, 'Medical appointment', NULL, 'APPROVED', '2026-07-18 08:57:54.944', '2026-08-02 08:57:59.076'),
('demo-leave-pending-1', '7b2b510e-dab0-4f0f-9aae-f1d27c9de59c', 'a7e07343-b155-4218-9a29-f5bccb3a7eef', 'cedc5c3a-5323-453f-8d32-9f74c6ef6692', '2026-08-05 08:57:54.944', '2026-08-06 08:57:54.944', 2, 'Family programme outside Dhaka', NULL, 'PENDING', '2026-08-01 08:57:54.944', '2026-08-02 08:57:59.071');

-- --------------------------------------------------------

--
-- Table structure for table `leave_approvals`
--

CREATE TABLE `leave_approvals` (
  `id` varchar(191) NOT NULL,
  `leave_application_id` varchar(191) NOT NULL,
  `approved_by_id` varchar(191) NOT NULL,
  `status` varchar(191) NOT NULL,
  `remarks` text DEFAULT NULL,
  `action_date` datetime(3) NOT NULL DEFAULT current_timestamp(3)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `leave_types`
--

CREATE TABLE `leave_types` (
  `id` varchar(191) NOT NULL,
  `school_id` varchar(191) NOT NULL,
  `name` varchar(191) NOT NULL,
  `code` varchar(191) NOT NULL,
  `description` varchar(191) DEFAULT NULL,
  `days_allowed` int(11) NOT NULL,
  `is_carry_forward` tinyint(1) NOT NULL DEFAULT 0,
  `is_paid` tinyint(1) NOT NULL DEFAULT 1,
  `is_active` tinyint(1) NOT NULL DEFAULT 1,
  `created_at` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updated_at` datetime(3) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `leave_types`
--

INSERT INTO `leave_types` (`id`, `school_id`, `name`, `code`, `description`, `days_allowed`, `is_carry_forward`, `is_paid`, `is_active`, `created_at`, `updated_at`) VALUES
('cedc5c3a-5323-453f-8d32-9f74c6ef6692', '7b2b510e-dab0-4f0f-9aae-f1d27c9de59c', 'Casual Leave', 'CASUAL', 'Casual leave for staff', 10, 0, 1, 1, '2026-08-02 08:11:12.435', '2026-08-02 08:57:59.067');

-- --------------------------------------------------------

--
-- Table structure for table `legacy_installments`
--

CREATE TABLE `legacy_installments` (
  `id` varchar(191) NOT NULL,
  `legacy_import_id` varchar(191) NOT NULL,
  `school_id` varchar(191) NOT NULL,
  `student_id` varchar(191) DEFAULT NULL,
  `legacy_student_ref` varchar(191) NOT NULL,
  `academic_year_label` varchar(191) DEFAULT NULL,
  `installment_name` varchar(191) NOT NULL,
  `amount` decimal(12,2) NOT NULL,
  `due_date` datetime(3) DEFAULT NULL,
  `status` varchar(191) NOT NULL DEFAULT 'UNPAID',
  `source_row` int(11) NOT NULL,
  `migration_status` varchar(191) NOT NULL DEFAULT 'ISOLATED',
  `migrated_invoice_id` varchar(191) DEFAULT NULL,
  `authorized_by_id` varchar(191) DEFAULT NULL,
  `migrated_at` datetime(3) DEFAULT NULL,
  `created_at` datetime(3) NOT NULL DEFAULT current_timestamp(3)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `legacy_installment_imports`
--

CREATE TABLE `legacy_installment_imports` (
  `id` varchar(191) NOT NULL,
  `import_history_id` varchar(191) NOT NULL,
  `school_id` varchar(191) NOT NULL,
  `imported_by_id` varchar(191) NOT NULL,
  `source_name` varchar(191) NOT NULL,
  `status` varchar(191) NOT NULL DEFAULT 'ISOLATED',
  `record_count` int(11) NOT NULL DEFAULT 0,
  `created_at` datetime(3) NOT NULL DEFAULT current_timestamp(3)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `legacy_installment_payments`
--

CREATE TABLE `legacy_installment_payments` (
  `id` varchar(191) NOT NULL,
  `legacy_installment_id` varchar(191) NOT NULL,
  `amount` decimal(12,2) NOT NULL,
  `payment_date` datetime(3) NOT NULL,
  `payment_method` varchar(191) NOT NULL,
  `reference` varchar(191) DEFAULT NULL,
  `source_row` int(11) DEFAULT NULL,
  `created_at` datetime(3) NOT NULL DEFAULT current_timestamp(3)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `login_histories`
--

CREATE TABLE `login_histories` (
  `id` varchar(191) NOT NULL,
  `user_id` varchar(191) NOT NULL,
  `ip_address` varchar(191) DEFAULT NULL,
  `user_agent` varchar(191) DEFAULT NULL,
  `status` varchar(191) NOT NULL,
  `login_at` datetime(3) NOT NULL DEFAULT current_timestamp(3)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `login_histories`
--

INSERT INTO `login_histories` (`id`, `user_id`, `ip_address`, `user_agent`, `status`, `login_at`) VALUES
('0273fead-88f5-4866-a73e-7d5b71d1d611', '52897111-6585-4527-9211-1a20b7c2ff8f', '127.0.0.1', 'Mozilla/5.0 (Windows NT; Windows NT 10.0; en-US) WindowsPowerShell/5.1.19041.6456', 'SUCCESS', '2026-08-02 09:19:34.681'),
('04213af7-d85a-4638-b602-70dd79eb2b37', 'fc9940e7-a1ca-4996-877e-15b70ff8da36', '127.0.0.1', 'Mozilla/5.0 (Windows NT; Windows NT 10.0; en-US) WindowsPowerShell/5.1.19041.6456', 'SUCCESS', '2026-08-02 09:36:35.727'),
('057a395c-70b3-411e-be30-520779ca461d', 'a7e07343-b155-4218-9a29-f5bccb3a7eef', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/151.0.0.0 Safari/537.36', 'SUCCESS', '2026-08-09 12:07:28.750'),
('085d1394-61dc-4808-b628-052a2a47049d', '52897111-6585-4527-9211-1a20b7c2ff8f', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/151.0.0.0 Safari/537.36', 'SUCCESS', '2026-08-10 08:00:13.942'),
('09709e3f-aefc-41e1-b12a-6c67456f4c10', 'fc9940e7-a1ca-4996-877e-15b70ff8da36', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/151.0.0.0 Safari/537.36', 'SUCCESS', '2026-08-09 05:53:08.640'),
('0b03b40f-6167-45f9-8c47-ab71b78180d6', '52897111-6585-4527-9211-1a20b7c2ff8f', '127.0.0.1', 'Mozilla/5.0 (Windows NT; Windows NT 10.0; en-US) WindowsPowerShell/5.1.19041.6456', 'SUCCESS', '2026-08-02 09:58:06.314'),
('0ca05d97-3cc4-42c7-84b5-00a910876743', '877c8545-cbaa-4195-912d-7af38caf349d', '127.0.0.1', 'Mozilla/5.0 (Windows NT; Windows NT 10.0; en-US) WindowsPowerShell/5.1.19041.6456', 'SUCCESS', '2026-08-02 08:11:33.675'),
('0cf077ed-fdba-4198-bef5-b8632d4294f3', 'a7e07343-b155-4218-9a29-f5bccb3a7eef', '127.0.0.1', 'Mozilla/5.0 (Windows NT; Windows NT 10.0; en-US) WindowsPowerShell/5.1.19041.6456', 'SUCCESS', '2026-08-09 08:29:44.372'),
('0df10bc0-452b-4050-83ad-46ed73e63897', '52897111-6585-4527-9211-1a20b7c2ff8f', '127.0.0.1', 'Mozilla/5.0 (Windows NT; Windows NT 10.0; en-US) WindowsPowerShell/5.1.19041.6456', 'SUCCESS', '2026-08-02 08:58:14.507'),
('1453cf9e-25cf-421b-98b8-1119117688d6', '5d7880f3-2268-4ae9-a460-598270a02b81', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/151.0.0.0 Safari/537.36', 'SUCCESS', '2026-08-10 09:33:17.341'),
('14c2fa70-adfe-430d-b8f3-07f56afc7f15', '5d7880f3-2268-4ae9-a460-598270a02b81', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/151.0.0.0 Safari/537.36', 'SUCCESS', '2026-08-09 12:06:09.320'),
('15394f99-6ac2-457c-aafa-07bcdfc842b8', 'fc9940e7-a1ca-4996-877e-15b70ff8da36', '127.0.0.1', 'Mozilla/5.0 (Windows NT; Windows NT 10.0; en-US) WindowsPowerShell/5.1.19041.6456', 'SUCCESS', '2026-08-02 08:11:29.656'),
('1aa74b2b-fe5a-4ec8-8aaa-3e585a670b0e', '1af30a7a-4758-4a4d-a001-a76ca72ea6c5', '127.0.0.1', 'Mozilla/5.0 (Windows NT; Windows NT 10.0; en-US) WindowsPowerShell/5.1.19041.6456', 'SUCCESS', '2026-08-02 08:11:31.664'),
('1afdaa01-bd46-43ce-9b12-f9b7ecf7eddc', '52897111-6585-4527-9211-1a20b7c2ff8f', '127.0.0.1', 'Mozilla/5.0 (Windows NT; Windows NT 10.0; en-US) WindowsPowerShell/5.1.19041.6456', 'SUCCESS', '2026-08-02 10:00:18.146'),
('1bf6b44d-2751-4f31-9d4d-50b9fc0431cd', 'a7e07343-b155-4218-9a29-f5bccb3a7eef', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/151.0.0.0 Safari/537.36', 'SUCCESS', '2026-08-09 06:33:38.800'),
('2093a9a4-b95d-48b2-abe1-d72067d8d0d3', 'b540ef8e-f019-44d9-9a69-3a7cd33423ac', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/151.0.0.0 Safari/537.36', 'SUCCESS', '2026-08-06 06:14:21.606'),
('253b1b00-9964-43e1-8013-6b205554fb95', '52897111-6585-4527-9211-1a20b7c2ff8f', '127.0.0.1', 'Mozilla/5.0 (Windows NT; Windows NT 10.0; en-US) WindowsPowerShell/5.1.19041.6456', 'SUCCESS', '2026-08-02 09:21:58.866'),
('28ffe159-1f8e-4a56-9195-4db13ab2e086', '52897111-6585-4527-9211-1a20b7c2ff8f', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/151.0.0.0 Safari/537.36', 'SUCCESS', '2026-08-02 08:35:47.919'),
('2d34fed0-dcc2-4052-adb1-564f2828a0ea', 'a7e07343-b155-4218-9a29-f5bccb3a7eef', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/151.0.0.0 Safari/537.36', 'SUCCESS', '2026-08-10 06:19:11.576'),
('3148c64d-b820-4653-adca-d0a9f59d3439', 'fc9940e7-a1ca-4996-877e-15b70ff8da36', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/151.0.0.0 Safari/537.36', 'SUCCESS', '2026-08-06 05:43:34.234'),
('3362e151-50d9-4823-b7b3-2aca2ad6eb04', '52897111-6585-4527-9211-1a20b7c2ff8f', '127.0.0.1', 'Mozilla/5.0 (Windows NT; Windows NT 10.0; en-US) WindowsPowerShell/5.1.19041.6456', 'SUCCESS', '2026-08-02 09:07:40.732'),
('357b8ea2-0c7e-43b2-999d-eaa280690265', '52897111-6585-4527-9211-1a20b7c2ff8f', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36', 'SUCCESS', '2026-08-02 09:10:03.372'),
('3651edaa-4ee3-45f6-bd1e-6f228030f7fb', '52897111-6585-4527-9211-1a20b7c2ff8f', '127.0.0.1', 'Mozilla/5.0 (Windows NT; Windows NT 10.0; en-US) WindowsPowerShell/5.1.19041.6456', 'SUCCESS', '2026-08-02 09:44:35.802'),
('3739c4a1-03e2-47c1-ba7f-64d7a1f656f4', 'a7e07343-b155-4218-9a29-f5bccb3a7eef', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/151.0.0.0 Safari/537.36', 'SUCCESS', '2026-08-10 06:48:52.411'),
('38e1559d-9742-43cd-95b6-5ef58cd8f748', '52897111-6585-4527-9211-1a20b7c2ff8f', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/151.0.0.0 Safari/537.36', 'SUCCESS', '2026-08-02 08:50:59.370'),
('3e6c6d9f-4f50-4b91-a5bf-835c0a38ab6a', '83eaf298-cac4-4c7c-9704-631549951d39', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/151.0.0.0 Safari/537.36', 'SUCCESS', '2026-08-10 06:40:18.586'),
('40327d93-5460-4c12-b12c-dbd6fc0b91db', '52897111-6585-4527-9211-1a20b7c2ff8f', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/151.0.0.0 Safari/537.36', 'SUCCESS', '2026-08-02 09:01:01.492'),
('403656a4-5d9f-43c6-8044-594f44341348', '5d7880f3-2268-4ae9-a460-598270a02b81', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/151.0.0.0 Safari/537.36', 'SUCCESS', '2026-08-09 11:53:59.409'),
('440e91a7-8c14-4613-a66b-a44846ae41de', 'a7e07343-b155-4218-9a29-f5bccb3a7eef', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/151.0.0.0 Safari/537.36', 'SUCCESS', '2026-08-09 11:59:36.268'),
('4718e16b-da3b-4806-acf8-b04dd5725a81', '877c8545-cbaa-4195-912d-7af38caf349d', '127.0.0.1', 'Mozilla/5.0 (Windows NT; Windows NT 10.0; en-US) WindowsPowerShell/5.1.19041.6456', 'SUCCESS', '2026-08-02 08:13:10.921'),
('4aae11fc-72f7-43d0-bd45-aa4739a11557', '877c8545-cbaa-4195-912d-7af38caf349d', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/151.0.0.0 Safari/537.36', 'SUCCESS', '2026-08-06 06:16:51.499'),
('4ac8b9a2-f5cc-4f48-b2bb-e4e638f16111', '914a688f-fd88-4338-910f-45dbb6294007', '127.0.0.1', 'Mozilla/5.0 (Windows NT; Windows NT 10.0; en-US) WindowsPowerShell/5.1.19041.6456', 'SUCCESS', '2026-08-02 08:11:30.504'),
('4e270721-6627-4067-b98b-ba3b0780b7b6', '52897111-6585-4527-9211-1a20b7c2ff8f', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/151.0.0.0 Safari/537.36', 'SUCCESS', '2026-08-02 09:13:49.453'),
('51101ca1-f2d5-4e46-9c9e-125cb5fa56de', '52897111-6585-4527-9211-1a20b7c2ff8f', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/151.0.0.0 Safari/537.36', 'SUCCESS', '2026-08-09 06:21:44.797'),
('5214027a-bd26-4153-b78b-8231a7ce122c', '83eaf298-cac4-4c7c-9704-631549951d39', '127.0.0.1', 'Mozilla/5.0 (Windows NT; Windows NT 10.0; en-US) WindowsPowerShell/5.1.19041.6456', 'SUCCESS', '2026-08-02 08:13:10.139'),
('53ea6c0a-7d32-4607-81c6-542646a70c42', '52897111-6585-4527-9211-1a20b7c2ff8f', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/151.0.0.0 Safari/537.36', 'SUCCESS', '2026-08-06 05:36:50.308'),
('56a564ef-9322-45a4-8f8e-ea7f9198eca0', 'a7e07343-b155-4218-9a29-f5bccb3a7eef', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/151.0.0.0 Safari/537.36', 'SUCCESS', '2026-08-10 07:37:25.221'),
('56bfa3a5-bbd8-4ed8-9e34-e13e8216d18c', '52897111-6585-4527-9211-1a20b7c2ff8f', '127.0.0.1', 'Mozilla/5.0 (Windows NT; Windows NT 10.0; en-US) WindowsPowerShell/5.1.19041.6456', 'SUCCESS', '2026-08-02 08:43:12.374'),
('573e5314-58f5-43d7-b81b-853ca64a97ea', 'a7e07343-b155-4218-9a29-f5bccb3a7eef', '127.0.0.1', 'Mozilla/5.0 (Windows NT; Windows NT 10.0; en-US) WindowsPowerShell/5.1.19041.6456', 'SUCCESS', '2026-08-02 08:11:32.202'),
('5a95f473-6797-42dd-8353-d4dfe99efadc', 'e149fca0-f4f0-4018-bb35-89b9febd366a', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/151.0.0.0 Safari/537.36', 'SUCCESS', '2026-08-06 05:58:01.195'),
('5bfaaa68-ea4c-4cc8-8a98-a4629b528433', '1af30a7a-4758-4a4d-a001-a76ca72ea6c5', '127.0.0.1', 'Mozilla/5.0 (Windows NT; Windows NT 10.0; en-US) WindowsPowerShell/5.1.19041.6456', 'SUCCESS', '2026-08-02 08:13:12.628'),
('61258912-9516-40dc-a3f3-8c53536fc3c9', '52897111-6585-4527-9211-1a20b7c2ff8f', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/151.0.0.0 Safari/537.36', 'SUCCESS', '2026-08-09 05:13:51.444'),
('63f951cf-e133-4491-992d-89c79936fe77', '52897111-6585-4527-9211-1a20b7c2ff8f', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/151.0.0.0 Safari/537.36', 'SUCCESS', '2026-08-10 09:33:47.666'),
('65026a53-77ea-4dfa-92b1-9e0be9e5671d', '52897111-6585-4527-9211-1a20b7c2ff8f', '127.0.0.1', 'Mozilla/5.0 (Windows NT; Windows NT 10.0; en-US) WindowsPowerShell/5.1.19041.6456', 'SUCCESS', '2026-08-02 09:58:19.819'),
('657ff2b8-676a-4695-bff0-bc7748634505', 'a7e07343-b155-4218-9a29-f5bccb3a7eef', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/151.0.0.0 Safari/537.36', 'SUCCESS', '2026-08-06 06:03:45.683'),
('65c48db0-198e-4161-a339-deb93bff5bc6', '914a688f-fd88-4338-910f-45dbb6294007', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/151.0.0.0 Safari/537.36', 'SUCCESS', '2026-08-06 05:56:26.514'),
('662dd82a-5842-4d15-92a7-eb5ec3f6bff4', 'a7e07343-b155-4218-9a29-f5bccb3a7eef', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/151.0.0.0 Safari/537.36', 'SUCCESS', '2026-08-10 10:59:32.872'),
('69d9093b-07ea-490f-a9a2-122e777c8007', '52897111-6585-4527-9211-1a20b7c2ff8f', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/151.0.0.0 Safari/537.36', 'SUCCESS', '2026-08-02 08:56:20.610'),
('6b2e8833-d750-46c3-894f-8e71659ad156', 'a7e07343-b155-4218-9a29-f5bccb3a7eef', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/151.0.0.0 Safari/537.36', 'SUCCESS', '2026-08-09 06:16:45.373'),
('6c7343f1-621d-4d37-a839-6732fb6dc237', '5b68561e-7f16-4126-8979-4d0fc815d1a4', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/151.0.0.0 Safari/537.36', 'SUCCESS', '2026-08-06 06:22:53.814'),
('70aed5ad-c429-4dd6-9dcf-6a3677ac9be7', '52897111-6585-4527-9211-1a20b7c2ff8f', '127.0.0.1', 'Mozilla/5.0 (Windows NT; Windows NT 10.0; en-US) WindowsPowerShell/5.1.19041.6456', 'SUCCESS', '2026-08-02 09:19:15.750'),
('726a9a77-a237-49cb-81ca-702b71bce94b', 'fc9940e7-a1ca-4996-877e-15b70ff8da36', '127.0.0.1', 'Mozilla/5.0 (Windows NT; Windows NT 10.0; en-US) WindowsPowerShell/5.1.19041.6456', 'SUCCESS', '2026-08-02 09:28:59.786'),
('82d1497c-22ba-433a-9a0a-a54a7d02ab30', '83eaf298-cac4-4c7c-9704-631549951d39', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/151.0.0.0 Safari/537.36', 'SUCCESS', '2026-08-10 07:59:55.442'),
('84fab818-1f01-4999-b8a0-ee22b0097130', '52897111-6585-4527-9211-1a20b7c2ff8f', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/151.0.0.0 Safari/537.36', 'SUCCESS', '2026-08-03 05:27:14.419'),
('93a06265-ae85-4873-8535-a966d0f7ced8', '83eaf298-cac4-4c7c-9704-631549951d39', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/151.0.0.0 Safari/537.36', 'SUCCESS', '2026-08-02 09:12:15.608'),
('9442e541-640c-4772-b978-fca481513d21', '52897111-6585-4527-9211-1a20b7c2ff8f', '127.0.0.1', 'Mozilla/5.0 (Windows NT; Windows NT 10.0; en-US) WindowsPowerShell/5.1.19041.6456', 'SUCCESS', '2026-08-02 09:20:06.490'),
('984f3fc8-3b67-43cf-938e-4931413acd8e', '52897111-6585-4527-9211-1a20b7c2ff8f', '127.0.0.1', 'Mozilla/5.0 (Windows NT; Windows NT 10.0; en-US) WindowsPowerShell/5.1.19041.6456', 'SUCCESS', '2026-08-02 09:21:05.178'),
('9d68a8ef-fe22-460c-a6e4-f4973a5ac358', '52897111-6585-4527-9211-1a20b7c2ff8f', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/151.0.0.0 Safari/537.36', 'SUCCESS', '2026-08-10 05:17:17.402'),
('a0f18ea2-579b-4bd3-81bc-a465544ba8d7', '5b68561e-7f16-4126-8979-4d0fc815d1a4', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/151.0.0.0 Safari/537.36', 'SUCCESS', '2026-08-06 06:08:34.758'),
('a26c3abd-7ad8-4504-947a-b008729c2f6c', '83eaf298-cac4-4c7c-9704-631549951d39', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/151.0.0.0 Safari/537.36', 'SUCCESS', '2026-08-09 08:41:53.211'),
('af1d0d10-e349-4150-99ef-36420b48d820', 'fc9940e7-a1ca-4996-877e-15b70ff8da36', '127.0.0.1', 'Mozilla/5.0 (Windows NT; Windows NT 10.0; en-US) WindowsPowerShell/5.1.19041.6456', 'SUCCESS', '2026-08-02 09:29:11.363'),
('b2d1f6ef-df56-4863-8c86-25ca3aa51da5', 'b540ef8e-f019-44d9-9a69-3a7cd33423ac', '127.0.0.1', 'Mozilla/5.0 (Windows NT; Windows NT 10.0; en-US) WindowsPowerShell/5.1.19041.6456', 'SUCCESS', '2026-08-02 08:11:32.759'),
('b4a83e21-b1b7-4b58-9ec9-5556f4f028b4', '52897111-6585-4527-9211-1a20b7c2ff8f', '127.0.0.1', 'Mozilla/5.0 (Windows NT; Windows NT 10.0; en-US) WindowsPowerShell/5.1.19041.6456', 'SUCCESS', '2026-08-02 09:45:44.397'),
('b53f5ff2-a527-4927-a2b3-ca9ac8d46c44', '52897111-6585-4527-9211-1a20b7c2ff8f', '127.0.0.1', 'Mozilla/5.0 (Windows NT; Windows NT 10.0; en-US) WindowsPowerShell/5.1.19041.6456', 'SUCCESS', '2026-08-02 08:57:09.693'),
('b66049cd-9843-4890-8b12-188fbf127d9c', '914a688f-fd88-4338-910f-45dbb6294007', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/151.0.0.0 Safari/537.36', 'SUCCESS', '2026-08-09 05:52:17.453'),
('bc076bdf-cd48-4ac0-8934-5501f6f71b49', '1af30a7a-4758-4a4d-a001-a76ca72ea6c5', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/151.0.0.0 Safari/537.36', 'SUCCESS', '2026-08-06 06:01:58.884'),
('bea393f3-e06f-4462-a1b0-c510b941ee59', '5d7880f3-2268-4ae9-a460-598270a02b81', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/151.0.0.0 Safari/537.36', 'SUCCESS', '2026-08-09 12:03:26.773'),
('c429a591-7c14-41f5-bdb9-264004a01b6a', '914a688f-fd88-4338-910f-45dbb6294007', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/151.0.0.0 Safari/537.36', 'SUCCESS', '2026-08-10 10:36:36.646'),
('c5dad28b-c4bb-41b2-ac9e-60a9a69c8521', '52897111-6585-4527-9211-1a20b7c2ff8f', '127.0.0.1', 'Mozilla/5.0 (Windows NT; Windows NT 10.0; en-US) WindowsPowerShell/5.1.19041.6456', 'SUCCESS', '2026-08-02 09:56:50.505'),
('c8c025d2-4199-47fa-970c-7e9f6550cfba', '83eaf298-cac4-4c7c-9704-631549951d39', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/151.0.0.0 Safari/537.36', 'SUCCESS', '2026-08-06 06:15:16.845'),
('cb695848-85b7-48f2-8643-fbfcfa01ace3', '45ca485a-cb01-4f4d-be0d-0c3d281a6e29', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/151.0.0.0 Safari/537.36', 'SUCCESS', '2026-08-10 08:24:05.079'),
('cbde4d3c-a97d-4052-8962-d22db38466c4', '52897111-6585-4527-9211-1a20b7c2ff8f', '127.0.0.1', 'Mozilla/5.0 (Windows NT; Windows NT 10.0; en-US) WindowsPowerShell/5.1.19041.6456', 'SUCCESS', '2026-08-02 09:58:50.324'),
('cde6cca6-1abe-4f6e-b541-17ee174a4811', 'a7e07343-b155-4218-9a29-f5bccb3a7eef', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/151.0.0.0 Safari/537.36', 'SUCCESS', '2026-08-10 09:32:44.120'),
('cf6516b9-1f1f-4346-8a4e-9a29c2bd5685', '5b68561e-7f16-4126-8979-4d0fc815d1a4', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/151.0.0.0 Safari/537.36', 'SUCCESS', '2026-08-10 11:01:09.952'),
('d395798e-b91b-4215-b116-ceb76077433f', 'a7e07343-b155-4218-9a29-f5bccb3a7eef', '127.0.0.1', 'Mozilla/5.0 (Windows NT; Windows NT 10.0; en-US) WindowsPowerShell/5.1.19041.6456', 'SUCCESS', '2026-08-02 08:13:08.907'),
('d516d985-7485-4c04-a39b-ad1277081750', '52897111-6585-4527-9211-1a20b7c2ff8f', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/151.0.0.0 Safari/537.36', 'SUCCESS', '2026-08-02 08:48:31.343'),
('d53dc276-8dcc-442c-b058-0e84eb553874', '52897111-6585-4527-9211-1a20b7c2ff8f', '127.0.0.1', 'Mozilla/5.0 (Windows NT; Windows NT 10.0; en-US) WindowsPowerShell/5.1.19041.6456', 'SUCCESS', '2026-08-02 10:06:21.073'),
('d98cdd91-b41b-4c34-bac2-f3cae44f5c6b', 'e149fca0-f4f0-4018-bb35-89b9febd366a', '127.0.0.1', 'Mozilla/5.0 (Windows NT; Windows NT 10.0; en-US) WindowsPowerShell/5.1.19041.6456', 'SUCCESS', '2026-08-02 08:11:31.101'),
('dd566ae4-8c9d-43a8-beb2-201035780237', '877c8545-cbaa-4195-912d-7af38caf349d', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/151.0.0.0 Safari/537.36', 'SUCCESS', '2026-08-10 06:49:41.096'),
('df3a9dd4-f341-4fd3-856a-35b83631df90', 'a7e07343-b155-4218-9a29-f5bccb3a7eef', '127.0.0.1', 'Mozilla/5.0 (Windows NT; Windows NT 10.0; en-US) WindowsPowerShell/5.1.19041.6456', 'SUCCESS', '2026-08-09 06:46:57.314'),
('e1805584-3c23-473e-8aaa-23d7304bc400', '83eaf298-cac4-4c7c-9704-631549951d39', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/151.0.0.0 Safari/537.36', 'SUCCESS', '2026-08-09 08:35:39.240'),
('e23f38b3-9ccd-43e9-8252-898dce28d961', '83eaf298-cac4-4c7c-9704-631549951d39', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/151.0.0.0 Safari/537.36', 'SUCCESS', '2026-08-09 10:45:45.189'),
('e60aaf11-dad3-4c7f-8859-eea15a2a77c8', '83eaf298-cac4-4c7c-9704-631549951d39', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/151.0.0.0 Safari/537.36', 'SUCCESS', '2026-08-06 05:42:08.279'),
('e7021e39-2153-477a-9584-6534aa9de1db', '45ca485a-cb01-4f4d-be0d-0c3d281a6e29', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/151.0.0.0 Safari/537.36', 'SUCCESS', '2026-08-10 09:25:47.152'),
('e9cb487f-cd74-44f0-9b7b-f55ab5c82c56', '52897111-6585-4527-9211-1a20b7c2ff8f', '127.0.0.1', 'Mozilla/5.0 (Windows NT; Windows NT 10.0; en-US) WindowsPowerShell/5.1.19041.6456', 'SUCCESS', '2026-08-02 09:45:18.353'),
('ef85a254-cc4b-436f-9f51-e95656e0c6f3', '52897111-6585-4527-9211-1a20b7c2ff8f', '127.0.0.1', 'Mozilla/5.0 (Windows NT; Windows NT 10.0; en-US) WindowsPowerShell/5.1.19041.6456', 'SUCCESS', '2026-08-02 09:59:13.764'),
('efe3d98c-12db-4b4a-af48-fdd1f1fd0905', '45ca485a-cb01-4f4d-be0d-0c3d281a6e29', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/151.0.0.0 Safari/537.36', 'SUCCESS', '2026-08-10 09:31:32.529'),
('f13cd871-2c1c-4887-8fba-b0278f1754f6', '83eaf298-cac4-4c7c-9704-631549951d39', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/151.0.0.0 Safari/537.36', 'SUCCESS', '2026-08-06 06:14:54.227'),
('f1fbca3c-2e47-4f00-acfc-0179555b09a0', 'e149fca0-f4f0-4018-bb35-89b9febd366a', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/151.0.0.0 Safari/537.36', 'SUCCESS', '2026-08-10 10:38:38.653'),
('f216f3ac-3e35-4c52-9842-8840f166163b', 'fc9940e7-a1ca-4996-877e-15b70ff8da36', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/151.0.0.0 Safari/537.36', 'SUCCESS', '2026-08-10 10:27:19.170'),
('f4cb4bde-1a6c-4ca3-8ba0-d717575a95a6', '52897111-6585-4527-9211-1a20b7c2ff8f', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/151.0.0.0 Safari/537.36', 'SUCCESS', '2026-08-02 08:58:32.292'),
('f6526396-c8e9-4eb3-9c7c-8dfffa4ddad9', '52897111-6585-4527-9211-1a20b7c2ff8f', '127.0.0.1', 'Mozilla/5.0 (Windows NT; Windows NT 10.0; en-US) WindowsPowerShell/5.1.19041.6456', 'SUCCESS', '2026-08-02 09:28:57.883'),
('f70cd200-c8cd-4c2a-9f3f-c67aec1cb063', '52897111-6585-4527-9211-1a20b7c2ff8f', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/151.0.0.0 Safari/537.36', 'SUCCESS', '2026-08-06 06:17:10.697'),
('f8cd330e-ad9b-4fd7-a192-053c6ad63314', '52897111-6585-4527-9211-1a20b7c2ff8f', '127.0.0.1', 'Mozilla/5.0 (Windows NT; Windows NT 10.0; en-US) WindowsPowerShell/5.1.19041.6456', 'SUCCESS', '2026-08-02 08:56:41.488'),
('fab5629f-d173-46a8-8653-b6f6fd6e1da2', 'e149fca0-f4f0-4018-bb35-89b9febd366a', '127.0.0.1', 'Mozilla/5.0 (Windows NT; Windows NT 10.0; en-US) WindowsPowerShell/5.1.19041.6456', 'SUCCESS', '2026-08-02 08:13:11.512'),
('fda87321-2605-4f8d-a972-bbdab50083de', '83eaf298-cac4-4c7c-9704-631549951d39', '127.0.0.1', 'Mozilla/5.0 (Windows NT; Windows NT 10.0; en-US) WindowsPowerShell/5.1.19041.6456', 'SUCCESS', '2026-08-02 08:11:33.110'),
('fe0c076d-432e-4a43-8b20-ffc071157f51', 'a7e07343-b155-4218-9a29-f5bccb3a7eef', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/151.0.0.0 Safari/537.36', 'SUCCESS', '2026-08-10 09:31:42.875');

-- --------------------------------------------------------

--
-- Table structure for table `marks`
--

CREATE TABLE `marks` (
  `id` varchar(191) NOT NULL,
  `exam_id` varchar(191) NOT NULL,
  `student_id` varchar(191) NOT NULL,
  `subject_id` varchar(191) NOT NULL,
  `marks_obtained` decimal(5,2) NOT NULL,
  `max_marks` decimal(5,2) NOT NULL DEFAULT 100.00,
  `grade` varchar(191) DEFAULT NULL,
  `comments` varchar(191) DEFAULT NULL,
  `is_locked` tinyint(1) NOT NULL DEFAULT 0,
  `created_at` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updated_at` datetime(3) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `marks`
--

INSERT INTO `marks` (`id`, `exam_id`, `student_id`, `subject_id`, `marks_obtained`, `max_marks`, `grade`, `comments`, `is_locked`, `created_at`, `updated_at`) VALUES
('007e446f-f427-4bb3-b89a-f3c91668864e', 'demo-exam-completed', 'demo-student-13', 'demo-subject-mat', 79.00, 100.00, 'A', NULL, 1, '2026-08-02 08:11:11.530', '2026-08-02 08:57:58.538'),
('020b2002-1691-4e67-8849-d28cb24ddb04', 'demo-exam-completed', 'demo-student-4', 'demo-subject-mat', 55.00, 100.00, 'B', NULL, 1, '2026-08-02 08:11:11.451', '2026-08-02 08:57:58.451'),
('025c5ad2-c1d4-4baf-9686-f415d091d0b6', 'demo-exam-completed', 'demo-student-15', 'demo-subject-ban', 75.00, 100.00, 'A', NULL, 1, '2026-08-02 08:11:11.558', '2026-08-02 08:57:58.552'),
('08489276-5734-407d-bee8-e91875bc20c5', 'demo-exam-completed', 'demo-student-11', 'demo-subject-eng', 56.00, 100.00, 'B', NULL, 1, '2026-08-02 08:11:11.508', '2026-08-02 08:57:58.514'),
('0c7a2123-7945-4c8e-a8ed-aca8845eff7c', 'demo-exam-completed', 'demo-student-19', 'demo-subject-ban', 64.00, 100.00, 'A-', NULL, 1, '2026-08-02 08:11:11.637', '2026-08-02 08:57:58.590'),
('0f243622-b50d-4ec6-9f33-3d038b5eafd6', 'demo-exam-completed', 'demo-student-10', 'demo-subject-eng', 88.00, 100.00, 'A+', NULL, 1, '2026-08-02 08:11:11.500', '2026-08-02 08:57:58.505'),
('10362887-634e-4718-a4e6-185729dccece', 'demo-exam-completed', 'demo-student-18', 'demo-subject-mat', 75.00, 100.00, 'A', NULL, 1, '2026-08-02 08:11:11.626', '2026-08-02 08:57:58.587'),
('149c639f-5980-4c67-adaf-0ebd2c98fad4', 'demo-exam-upcoming', 'demo-student-1', 'demo-subject-eng', 50.00, 100.00, 'B', NULL, 0, '2026-08-06 06:10:54.187', '2026-08-06 06:10:54.187'),
('1aab6ebe-9bb8-42a6-8edb-b8c600e40db2', 'demo-exam-completed', 'demo-student-2', 'demo-subject-mat', 80.00, 100.00, 'A+', NULL, 1, '2026-08-02 08:11:11.435', '2026-08-02 08:57:58.433'),
('1cd0963f-e4a1-4437-862a-06c1a0e2eafe', 'demo-exam-upcoming', 'demo-student-1', 'demo-subject-ban', 50.00, 100.00, 'B', NULL, 1, '2026-08-06 05:40:02.365', '2026-08-09 07:01:01.860'),
('212c8dd2-8c61-4df6-8b25-5bf947548db6', 'demo-exam-completed', 'demo-student-5', 'demo-subject-ban', 83.00, 100.00, 'A+', NULL, 1, '2026-08-02 08:11:11.454', '2026-08-02 08:57:58.454'),
('23acc212-3d4d-4788-94f0-e02a01dd0baa', 'demo-exam-completed', 'demo-student-15', 'demo-subject-mat', 93.00, 100.00, 'A+', NULL, 1, '2026-08-02 08:11:11.569', '2026-08-02 08:57:58.559'),
('2affcbb7-cf3e-4d30-a769-80dc1f8a8932', 'demo-exam-completed', 'demo-student-9', 'demo-subject-mat', 90.00, 100.00, 'A+', NULL, 1, '2026-08-02 08:11:11.492', '2026-08-02 08:57:58.498'),
('306e4cbe-50c0-482b-bb2a-abc6badbf7be', 'demo-exam-completed', 'demo-student-6', 'demo-subject-mat', 69.00, 100.00, 'A-', NULL, 1, '2026-08-02 08:11:11.469', '2026-08-02 08:57:58.470'),
('349397e9-bd97-4b2a-abf1-17d5a1b03200', 'demo-exam-completed', 'demo-student-8', 'demo-subject-eng', 74.00, 100.00, 'A', NULL, 1, '2026-08-02 08:11:11.482', '2026-08-02 08:57:58.486'),
('371ba935-a8b5-4f4b-a37d-a57e30caf1d5', 'demo-exam-completed', 'demo-student-8', 'demo-subject-mat', 83.00, 100.00, 'A+', NULL, 1, '2026-08-02 08:11:11.485', '2026-08-02 08:57:58.489'),
('3f005965-e7cc-41c6-94d5-dad097b175a9', 'demo-exam-completed', 'demo-student-1', 'demo-subject-ban', 55.00, 100.00, 'B', NULL, 1, '2026-08-02 08:11:11.414', '2026-08-02 08:57:58.415'),
('466593af-9e2b-4a8e-b9ca-a3995ab695b6', 'demo-exam-completed', 'demo-student-16', 'demo-subject-mat', 61.00, 100.00, 'A-', NULL, 1, '2026-08-02 08:11:11.584', '2026-08-02 08:57:58.568'),
('4a29b95e-f889-4e72-a4ab-195a20e605d5', 'demo-exam-completed', 'demo-student-18', 'demo-subject-eng', 66.00, 100.00, 'A-', NULL, 1, '2026-08-02 08:11:11.621', '2026-08-02 08:57:58.583'),
('51d9dfbe-c395-49d9-8de7-9b72615b4ab4', 'demo-exam-completed', 'demo-student-14', 'demo-subject-eng', 77.00, 100.00, 'A', NULL, 1, '2026-08-02 08:11:11.548', '2026-08-02 08:57:58.545'),
('546ea8b4-a5d3-4ebb-9b04-c3c7029644b1', 'demo-exam-completed', 'demo-student-3', 'demo-subject-eng', 78.00, 100.00, 'A', NULL, 1, '2026-08-02 08:11:11.440', '2026-08-02 08:57:58.439'),
('5628fbc0-71e0-480d-b91e-d573b5eb074b', 'demo-exam-completed', 'demo-student-18', 'demo-subject-ban', 57.00, 100.00, 'B', NULL, 1, '2026-08-02 08:11:11.608', '2026-08-02 08:57:58.580'),
('58b434ab-7125-4b06-ac46-f7597d426196', 'demo-exam-completed', 'demo-student-17', 'demo-subject-eng', 59.00, 100.00, 'B', NULL, 1, '2026-08-02 08:11:11.602', '2026-08-02 08:57:58.574'),
('6305918a-150a-40b6-a947-4bee3e054f37', 'demo-exam-completed', 'demo-student-11', 'demo-subject-mat', 65.00, 100.00, 'A-', NULL, 1, '2026-08-02 08:11:11.511', '2026-08-02 08:57:58.517'),
('6915e722-b5b4-436c-ab3b-06c388a9fdd1', 'demo-exam-completed', 'demo-student-12', 'demo-subject-eng', 63.00, 100.00, 'A-', NULL, 1, '2026-08-02 08:11:11.517', '2026-08-02 08:57:58.524'),
('6aa1343f-1ae6-47f9-b513-8315a645e801', 'demo-exam-completed', 'demo-student-20', 'demo-subject-eng', 80.00, 100.00, 'A+', NULL, 1, '2026-08-02 08:11:11.668', '2026-08-02 08:57:58.605'),
('71af1482-d6ab-4ebd-a2e8-f1851d3b4e30', 'demo-exam-completed', 'demo-student-17', 'demo-subject-mat', 68.00, 100.00, 'A-', NULL, 1, '2026-08-02 08:11:11.605', '2026-08-02 08:57:58.577'),
('75f90318-7721-468e-aeed-bf7526f5f03c', 'demo-exam-completed', 'demo-student-13', 'demo-subject-eng', 70.00, 100.00, 'A', NULL, 1, '2026-08-02 08:11:11.526', '2026-08-02 08:57:58.534'),
('795ea3a7-e229-4666-a14e-971de9211809', 'demo-exam-completed', 'demo-student-10', 'demo-subject-mat', 58.00, 100.00, 'B', NULL, 1, '2026-08-02 08:11:11.503', '2026-08-02 08:57:58.509'),
('7a93ffbe-81fb-43f7-b10c-afbb314cf31f', 'demo-exam-completed', 'demo-student-4', 'demo-subject-ban', 76.00, 100.00, 'A', NULL, 1, '2026-08-02 08:11:11.446', '2026-08-02 08:57:58.445'),
('7f71c6ea-b0ee-493b-bbe7-d8d132fc3937', 'demo-exam-completed', 'demo-student-13', 'demo-subject-ban', 61.00, 100.00, 'A-', NULL, 1, '2026-08-02 08:11:11.523', '2026-08-02 08:57:58.531'),
('82000854-0dba-4e65-a198-05b1fd8b2692', 'demo-exam-completed', 'demo-student-15', 'demo-subject-eng', 84.00, 100.00, 'A+', NULL, 1, '2026-08-02 08:11:11.564', '2026-08-02 08:57:58.555'),
('82aae04c-cc17-4a42-be40-6e6e75f2cb95', 'demo-exam-completed', 'demo-student-12', 'demo-subject-ban', 93.00, 100.00, 'A+', NULL, 1, '2026-08-02 08:11:11.514', '2026-08-02 08:57:58.521'),
('8671f3b4-6d94-408b-a8e0-5f0eaf20ea4b', 'demo-exam-completed', 'demo-student-7', 'demo-subject-eng', 67.00, 100.00, 'A-', NULL, 1, '2026-08-02 08:11:11.474', '2026-08-02 08:57:58.477'),
('86b68b0f-9833-47a2-953a-5a1b50458b49', 'demo-exam-completed', 'demo-student-1', 'demo-subject-mat', 73.00, 100.00, 'A', NULL, 1, '2026-08-02 08:11:11.425', '2026-08-02 08:57:58.423'),
('87d5c5c1-f5b8-47d3-93d1-23ddb1d34c8a', 'demo-exam-upcoming', 'demo-student-3', 'demo-subject-bgs', 0.00, 100.00, 'F', NULL, 0, '2026-08-06 06:12:20.461', '2026-08-06 06:12:20.461'),
('8d806262-dead-4325-9c64-49935a576ef6', 'demo-exam-completed', 'demo-student-5', 'demo-subject-mat', 62.00, 100.00, 'A-', NULL, 1, '2026-08-02 08:11:11.459', '2026-08-02 08:57:58.461'),
('95023025-9ee5-4002-b5ae-4ed0dd83eef9', 'demo-exam-completed', 'demo-student-16', 'demo-subject-ban', 82.00, 100.00, 'A+', NULL, 1, '2026-08-02 08:11:11.573', '2026-08-02 08:57:58.562'),
('967170af-ef74-419f-8506-7c4449ece410', 'demo-exam-completed', 'demo-student-8', 'demo-subject-ban', 65.00, 100.00, 'A-', NULL, 1, '2026-08-02 08:11:11.480', '2026-08-02 08:57:58.484'),
('98c36713-d78d-4350-a9ac-7335e071c4e1', 'demo-exam-completed', 'demo-student-6', 'demo-subject-ban', 90.00, 100.00, 'A+', NULL, 1, '2026-08-02 08:11:11.463', '2026-08-02 08:57:58.464'),
('9ad192e8-d78c-4d79-a46e-501cff8d57f7', 'demo-exam-completed', 'demo-student-2', 'demo-subject-ban', 62.00, 100.00, 'A-', NULL, 1, '2026-08-02 08:11:11.430', '2026-08-02 08:57:58.427'),
('9cb62841-cdd8-4f3a-a94f-650a889b99c5', 'demo-exam-completed', 'demo-student-11', 'demo-subject-ban', 86.00, 100.00, 'A+', NULL, 1, '2026-08-02 08:11:11.505', '2026-08-02 08:57:58.511'),
('ab897552-2de5-4e91-8d8a-c906bc5479c1', 'demo-exam-completed', 'demo-student-14', 'demo-subject-ban', 68.00, 100.00, 'A-', NULL, 1, '2026-08-02 08:11:11.541', '2026-08-02 08:57:58.541'),
('ac98e607-15bd-499c-a009-384dbc374c63', 'demo-exam-completed', 'demo-student-3', 'demo-subject-ban', 69.00, 100.00, 'A-', NULL, 1, '2026-08-02 08:11:11.438', '2026-08-02 08:57:58.436'),
('adc74209-b684-4eae-bafe-423c50a2b3b6', 'demo-exam-completed', 'demo-student-19', 'demo-subject-eng', 73.00, 100.00, 'A', NULL, 1, '2026-08-02 08:11:11.646', '2026-08-02 08:57:58.594'),
('b097f7ee-5d13-45ec-8417-49df6f03e5e2', 'demo-exam-completed', 'demo-student-10', 'demo-subject-ban', 79.00, 100.00, 'A', NULL, 1, '2026-08-02 08:11:11.497', '2026-08-02 08:57:58.502'),
('b0c1038e-0489-4340-b609-d83583a59ba9', 'demo-exam-completed', 'demo-student-19', 'demo-subject-mat', 82.00, 100.00, 'A+', NULL, 1, '2026-08-02 08:11:11.651', '2026-08-02 08:57:58.597'),
('b88eae17-9733-4bd9-8ff2-0362d937e286', 'demo-exam-completed', 'demo-student-6', 'demo-subject-eng', 60.00, 100.00, 'A-', NULL, 1, '2026-08-02 08:11:11.465', '2026-08-02 08:57:58.467'),
('bf330d51-6d1b-42d5-9324-4e3a9d252168', 'demo-exam-completed', 'demo-student-4', 'demo-subject-eng', 85.00, 100.00, 'A+', NULL, 1, '2026-08-02 08:11:11.449', '2026-08-02 08:57:58.448'),
('bfed3e15-1f7f-4249-abd0-49beec4d043d', 'demo-exam-completed', 'demo-student-5', 'demo-subject-eng', 92.00, 100.00, 'A+', NULL, 1, '2026-08-02 08:11:11.457', '2026-08-02 08:57:58.457'),
('c050c75e-c0e6-455a-8603-0eaadee45855', 'demo-exam-completed', 'demo-student-3', 'demo-subject-mat', 87.00, 100.00, 'A+', NULL, 1, '2026-08-02 08:11:11.442', '2026-08-02 08:57:58.442'),
('c84f0401-e04e-4dd7-9828-d0344914f9f6', 'demo-exam-upcoming', 'demo-student-3', 'demo-subject-eng', 0.00, 100.00, 'F', NULL, 0, '2026-08-06 06:10:54.187', '2026-08-06 06:10:54.187'),
('d026c5e4-13d1-4d53-9584-73c8df2062d5', 'demo-exam-completed', 'demo-student-20', 'demo-subject-mat', 89.00, 100.00, 'A+', NULL, 1, '2026-08-02 08:11:11.671', '2026-08-02 08:57:58.610'),
('d3904e99-cdb7-4f4a-9c6f-0ce29337b0d5', 'demo-exam-upcoming', 'demo-student-3', 'demo-subject-ban', 50.00, 100.00, 'B', NULL, 1, '2026-08-06 05:40:02.365', '2026-08-09 07:01:01.860'),
('d5e30731-a9dd-4722-a457-806b4c928aab', 'demo-exam-completed', 'demo-student-7', 'demo-subject-mat', 76.00, 100.00, 'A', NULL, 1, '2026-08-02 08:11:11.476', '2026-08-02 08:57:58.480'),
('d926e8fe-7677-469c-a495-9eb55c04440f', 'demo-exam-completed', 'demo-student-16', 'demo-subject-eng', 91.00, 100.00, 'A+', NULL, 1, '2026-08-02 08:11:11.579', '2026-08-02 08:57:58.565'),
('da145cca-2721-42f4-9aa0-0dfe85ecdf24', 'demo-exam-upcoming', 'demo-student-9', 'demo-subject-ban', 50.00, 100.00, 'B', NULL, 1, '2026-08-09 06:53:22.829', '2026-08-09 07:24:14.429'),
('dfb35540-b60a-4703-a8b8-f38256180c56', 'demo-exam-completed', 'demo-student-2', 'demo-subject-eng', 71.00, 100.00, 'A', NULL, 1, '2026-08-02 08:11:11.433', '2026-08-02 08:57:58.430'),
('e0bbbacb-2054-4f57-96c5-d0094910efd2', 'demo-exam-completed', 'demo-student-7', 'demo-subject-ban', 58.00, 100.00, 'B', NULL, 1, '2026-08-02 08:11:11.471', '2026-08-02 08:57:58.474'),
('e411ffaf-b200-47ba-b950-9ad189bc5855', 'demo-exam-upcoming', 'demo-student-11', 'demo-subject-ban', 50.00, 100.00, 'B', NULL, 1, '2026-08-09 06:53:22.829', '2026-08-09 07:24:14.429'),
('e47039cb-8964-4183-b1f2-347ac7dd32b6', 'demo-exam-completed', 'demo-student-14', 'demo-subject-mat', 86.00, 100.00, 'A+', NULL, 1, '2026-08-02 08:11:11.553', '2026-08-02 08:57:58.548'),
('e6a769e8-0097-41b2-bf15-6260c7f35db4', 'demo-exam-upcoming', 'demo-student-1', 'demo-subject-bgs', 50.00, 100.00, 'B', NULL, 0, '2026-08-06 06:12:20.461', '2026-08-06 06:12:20.461'),
('e93ed3d9-72b8-4e13-b5be-028a25ec1f70', 'demo-exam-completed', 'demo-student-1', 'demo-subject-eng', 64.00, 100.00, 'A-', NULL, 1, '2026-08-02 08:11:11.423', '2026-08-02 08:57:58.420'),
('ec1073b5-3ef7-4790-aeb2-4a922e208e16', 'demo-exam-completed', 'demo-student-9', 'demo-subject-eng', 81.00, 100.00, 'A+', NULL, 1, '2026-08-02 08:11:11.490', '2026-08-02 08:57:58.495'),
('f1c19387-63da-4f41-aff6-7ac078369180', 'demo-exam-completed', 'demo-student-9', 'demo-subject-ban', 72.00, 100.00, 'A', NULL, 1, '2026-08-02 08:11:11.487', '2026-08-02 08:57:58.493'),
('fcd6ef3f-3de3-4a8f-a6b8-5a9255a53138', 'demo-exam-completed', 'demo-student-12', 'demo-subject-mat', 72.00, 100.00, 'A', NULL, 1, '2026-08-02 08:11:11.519', '2026-08-02 08:57:58.528'),
('fd7ec13c-0343-4406-bac4-735b11cb9e56', 'demo-exam-completed', 'demo-student-20', 'demo-subject-ban', 71.00, 100.00, 'A', NULL, 1, '2026-08-02 08:11:11.657', '2026-08-02 08:57:58.600'),
('fe94b166-d3e5-448e-96d0-4d1470daad3d', 'demo-exam-completed', 'demo-student-17', 'demo-subject-ban', 89.00, 100.00, 'A+', NULL, 1, '2026-08-02 08:11:11.597', '2026-08-02 08:57:58.571');

-- --------------------------------------------------------

--
-- Table structure for table `marks_verifications`
--

CREATE TABLE `marks_verifications` (
  `id` varchar(191) NOT NULL,
  `school_id` varchar(191) NOT NULL,
  `exam_id` varchar(191) NOT NULL,
  `class_id` varchar(191) NOT NULL,
  `subject_id` varchar(191) NOT NULL,
  `status` varchar(191) NOT NULL DEFAULT 'VERIFIED',
  `verified_by_id` varchar(191) NOT NULL,
  `verified_at` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `remarks` varchar(191) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `marks_verifications`
--

INSERT INTO `marks_verifications` (`id`, `school_id`, `exam_id`, `class_id`, `subject_id`, `status`, `verified_by_id`, `verified_at`, `remarks`) VALUES
('bdf3cabd-1f37-48ad-a410-973d6c905725', '7b2b510e-dab0-4f0f-9aae-f1d27c9de59c', 'demo-exam-upcoming', 'demo-class-8', 'demo-subject-ban', 'VERIFIED', '52897111-6585-4527-9211-1a20b7c2ff8f', '2026-08-09 07:24:14.436', NULL),
('ea01abd8-8792-4d3d-ad7b-d81cf542ca26', '7b2b510e-dab0-4f0f-9aae-f1d27c9de59c', 'demo-exam-upcoming', 'demo-class-6', 'demo-subject-ban', 'VERIFIED', '52897111-6585-4527-9211-1a20b7c2ff8f', '2026-08-09 07:01:01.864', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `monthly_fee_schedules`
--

CREATE TABLE `monthly_fee_schedules` (
  `id` varchar(191) NOT NULL,
  `school_id` varchar(191) NOT NULL,
  `academic_year_id` varchar(191) NOT NULL,
  `class_id` varchar(191) NOT NULL,
  `section_id` varchar(191) DEFAULT NULL,
  `student_id` varchar(191) DEFAULT NULL,
  `fee_type_id` varchar(191) NOT NULL,
  `monthly_amount` decimal(12,2) NOT NULL,
  `billing_day` int(11) NOT NULL DEFAULT 1,
  `due_day` int(11) NOT NULL DEFAULT 10,
  `late_fee_type` varchar(191) NOT NULL DEFAULT 'FIXED',
  `late_fee_amount` decimal(12,2) NOT NULL DEFAULT 0.00,
  `effective_from` datetime(3) NOT NULL,
  `effective_to` datetime(3) DEFAULT NULL,
  `status` varchar(191) NOT NULL DEFAULT 'ACTIVE',
  `created_at` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updated_at` datetime(3) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `notifications`
--

CREATE TABLE `notifications` (
  `id` varchar(191) NOT NULL,
  `school_id` varchar(191) DEFAULT NULL,
  `user_id` varchar(191) DEFAULT NULL,
  `title` varchar(191) NOT NULL,
  `message` text NOT NULL,
  `type` varchar(191) NOT NULL DEFAULT 'INFO',
  `is_read` tinyint(1) NOT NULL DEFAULT 0,
  `created_at` datetime(3) NOT NULL DEFAULT current_timestamp(3)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `notifications`
--

INSERT INTO `notifications` (`id`, `school_id`, `user_id`, `title`, `message`, `type`, `is_read`, `created_at`) VALUES
('7cfdc1dd-fc2e-41bd-8d87-c1abb59e5f2e', '7b2b510e-dab0-4f0f-9aae-f1d27c9de59c', 'a232013e-253c-47e6-93f9-34291e859d68', 'Welcome to the School!', 'Congratulations Abir Hasan! Your admission application (DEMO-APP-2026-5) has been approved. Student ID: STU-DEMO-APP-2026-5, Roll: #4.', 'ADMISSION', 0, '2026-08-10 10:37:48.425');

-- --------------------------------------------------------

--
-- Table structure for table `password_reset_tokens`
--

CREATE TABLE `password_reset_tokens` (
  `id` varchar(191) NOT NULL,
  `user_id` varchar(191) NOT NULL,
  `token` varchar(191) NOT NULL,
  `expires_at` datetime(3) NOT NULL,
  `used` tinyint(1) NOT NULL DEFAULT 0,
  `created_at` datetime(3) NOT NULL DEFAULT current_timestamp(3)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `payments`
--

CREATE TABLE `payments` (
  `id` varchar(191) NOT NULL,
  `invoice_id` varchar(191) NOT NULL,
  `receipt_number` varchar(191) NOT NULL,
  `amount` decimal(12,2) NOT NULL,
  `payment_method` enum('CASH','BANK_TRANSFER','BKASH','NAGAD','CHEQUE','CARD') NOT NULL DEFAULT 'CASH',
  `transaction_id` varchar(191) DEFAULT NULL,
  `paid_at` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `notes` varchar(191) DEFAULT NULL,
  `created_at` datetime(3) NOT NULL DEFAULT current_timestamp(3)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `payments`
--

INSERT INTO `payments` (`id`, `invoice_id`, `receipt_number`, `amount`, `payment_method`, `transaction_id`, `paid_at`, `notes`, `created_at`) VALUES
('aec2da4c-6f36-4f46-935f-18a4f854dca5', 'af8871f7-24fc-4720-93df-05ac5daf4746', 'REC-2026-58826765', 150.00, 'CASH', '345324324', '2026-08-10 10:47:06.767', NULL, '2026-08-10 10:47:06.767'),
('c7b2d8fb-b320-43dd-8041-4951803e69e1', '2e7a2f87-98ac-451d-b91f-0257e4c4a1b1', 'REC-2026-95909887', 1700.00, 'CASH', '2001', '2026-08-06 05:58:29.893', NULL, '2026-08-06 05:58:29.893'),
('cadef7d5-71be-4d5e-b6de-6a2039769096', 'ffe0b6c9-ac41-4fa7-a553-c6ac4bb71c19', 'REC-2026-58704466', 150.00, 'CASH', '15007jhjhyh', '2026-08-10 10:45:04.477', NULL, '2026-08-10 10:45:04.477'),
('demo-payment-1', 'demo-fee-invoice-1', 'DEMO-REC-2026-8-001', 1800.00, 'CASH', 'DEMO-TXN-1', '2026-08-01 18:00:00.000', 'Demo tuition collection', '2026-08-02 08:11:11.851'),
('demo-payment-10', 'demo-fee-invoice-10', 'DEMO-REC-2026-8-010', 1000.00, 'BKASH', 'DEMO-TXN-10', '2026-08-10 18:00:00.000', 'Demo tuition collection', '2026-08-02 08:11:12.158'),
('demo-payment-13', 'demo-fee-invoice-13', 'DEMO-REC-2026-8-013', 1800.00, 'CASH', 'DEMO-TXN-13', '2026-08-13 18:00:00.000', 'Demo tuition collection', '2026-08-02 08:11:12.191'),
('demo-payment-14', 'demo-fee-invoice-14', 'DEMO-REC-2026-8-014', 1000.00, 'BKASH', 'DEMO-TXN-14', '2026-08-14 18:00:00.000', 'Demo tuition collection', '2026-08-02 08:11:12.204'),
('demo-payment-17', 'demo-fee-invoice-17', 'DEMO-REC-2026-8-017', 1800.00, 'CASH', 'DEMO-TXN-17', '2026-08-17 18:00:00.000', 'Demo tuition collection', '2026-08-02 08:11:12.249'),
('demo-payment-18', 'demo-fee-invoice-18', 'DEMO-REC-2026-8-018', 1000.00, 'BKASH', 'DEMO-TXN-18', '2026-08-18 18:00:00.000', 'Demo tuition collection', '2026-08-02 08:11:12.260'),
('demo-payment-2', 'demo-fee-invoice-2', 'DEMO-REC-2026-8-002', 1000.00, 'BKASH', 'DEMO-TXN-2', '2026-08-02 18:00:00.000', 'Demo tuition collection', '2026-08-02 08:11:12.001'),
('demo-payment-5', 'demo-fee-invoice-5', 'DEMO-REC-2026-8-005', 1800.00, 'CASH', 'DEMO-TXN-5', '2026-08-05 18:00:00.000', 'Demo tuition collection', '2026-08-02 08:11:12.062'),
('demo-payment-6', 'demo-fee-invoice-6', 'DEMO-REC-2026-8-006', 1000.00, 'BKASH', 'DEMO-TXN-6', '2026-08-06 18:00:00.000', 'Demo tuition collection', '2026-08-02 08:11:12.083'),
('demo-payment-9', 'demo-fee-invoice-9', 'DEMO-REC-2026-8-009', 1800.00, 'CASH', 'DEMO-TXN-9', '2026-08-09 18:00:00.000', 'Demo tuition collection', '2026-08-02 08:11:12.140');

-- --------------------------------------------------------

--
-- Table structure for table `payment_allocations`
--

CREATE TABLE `payment_allocations` (
  `id` varchar(191) NOT NULL,
  `payment_id` varchar(191) NOT NULL,
  `invoice_item_id` varchar(191) NOT NULL,
  `amount` decimal(12,2) NOT NULL,
  `created_at` datetime(3) NOT NULL DEFAULT current_timestamp(3)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `payment_reversals`
--

CREATE TABLE `payment_reversals` (
  `id` varchar(191) NOT NULL,
  `school_id` varchar(191) NOT NULL,
  `payment_id` varchar(191) NOT NULL,
  `reversal_number` varchar(191) NOT NULL,
  `reversed_by_id` varchar(191) NOT NULL,
  `reason` varchar(191) NOT NULL,
  `reversal_date` datetime(3) NOT NULL,
  `created_at` datetime(3) NOT NULL DEFAULT current_timestamp(3)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `payrolls`
--

CREATE TABLE `payrolls` (
  `id` varchar(191) NOT NULL,
  `payroll_period_id` varchar(191) NOT NULL,
  `school_id` varchar(191) NOT NULL,
  `user_id` varchar(191) NOT NULL,
  `basic_salary` decimal(10,2) NOT NULL DEFAULT 0.00,
  `total_allowances` decimal(10,2) NOT NULL DEFAULT 0.00,
  `total_deductions` decimal(10,2) NOT NULL DEFAULT 0.00,
  `overtime` decimal(10,2) NOT NULL DEFAULT 0.00,
  `bonus` decimal(10,2) NOT NULL DEFAULT 0.00,
  `tax` decimal(10,2) NOT NULL DEFAULT 0.00,
  `loan_deduction` decimal(10,2) NOT NULL DEFAULT 0.00,
  `absence_deduction` decimal(10,2) NOT NULL DEFAULT 0.00,
  `gross_salary` decimal(10,2) NOT NULL DEFAULT 0.00,
  `net_salary` decimal(10,2) NOT NULL DEFAULT 0.00,
  `paid_amount` decimal(10,2) NOT NULL DEFAULT 0.00,
  `status` varchar(191) NOT NULL DEFAULT 'DRAFT',
  `created_at` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updated_at` datetime(3) NOT NULL,
  `teacherId` varchar(191) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `payrolls`
--

INSERT INTO `payrolls` (`id`, `payroll_period_id`, `school_id`, `user_id`, `basic_salary`, `total_allowances`, `total_deductions`, `overtime`, `bonus`, `tax`, `loan_deduction`, `absence_deduction`, `gross_salary`, `net_salary`, `paid_amount`, `status`, `created_at`, `updated_at`, `teacherId`) VALUES
('1650945d-cf68-435d-92c9-c3bc18b69f59', '4c48cc94-fa29-443a-8efe-a3c03e49d30c', '7b2b510e-dab0-4f0f-9aae-f1d27c9de59c', '5d7880f3-2268-4ae9-a460-598270a02b81', 50000.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 50000.00, 50000.00, 0.00, 'APPROVED', '2026-08-10 10:57:54.873', '2026-08-10 10:58:08.381', NULL),
('32e32257-081c-4f04-a8d5-b8d676e8c2d4', '0b76bc0e-3427-479a-8387-2a2a14569f32', '7b2b510e-dab0-4f0f-9aae-f1d27c9de59c', '5b68561e-7f16-4126-8979-4d0fc815d1a4', 50000.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 50000.00, 50000.00, 50000.00, 'PAID', '2026-08-10 11:03:41.631', '2026-08-10 11:04:48.925', NULL),
('36c56ecb-930e-4c85-a166-cc9b2f2a564d', '0b76bc0e-3427-479a-8387-2a2a14569f32', '7b2b510e-dab0-4f0f-9aae-f1d27c9de59c', '5d7880f3-2268-4ae9-a460-598270a02b81', 50000.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 50000.00, 50000.00, 0.00, 'APPROVED', '2026-08-10 11:03:41.614', '2026-08-10 11:03:43.994', NULL),
('658709a9-0d75-4197-8a28-0a7698d03e05', '0fff752a-bbe9-49b6-af9b-948af15cf9cf', '7b2b510e-dab0-4f0f-9aae-f1d27c9de59c', '5d7880f3-2268-4ae9-a460-598270a02b81', 50000.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 50000.00, 50000.00, 0.00, 'APPROVED', '2026-08-10 10:56:17.403', '2026-08-10 10:56:20.274', NULL),
('67f37e65-b154-420b-bab5-e97911bd34bd', '4c48cc94-fa29-443a-8efe-a3c03e49d30c', '7b2b510e-dab0-4f0f-9aae-f1d27c9de59c', 'a7e07343-b155-4218-9a29-f5bccb3a7eef', 50000.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 50000.00, 50000.00, 50000.00, 'PAID', '2026-08-10 10:57:54.883', '2026-08-10 10:58:39.460', NULL),
('6e366ad3-3921-45a1-a540-cd244ac7ff0f', '7838cd43-c5c4-4c80-987e-3116404b6265', '7b2b510e-dab0-4f0f-9aae-f1d27c9de59c', 'b540ef8e-f019-44d9-9a69-3a7cd33423ac', 48000.00, 9000.00, 1200.00, 0.00, 0.00, 0.00, 0.00, 0.00, 57000.00, 55800.00, 55800.00, 'APPROVED', '2026-08-02 08:11:12.491', '2026-08-09 11:08:45.696', NULL),
('75c6216e-3ac5-4848-b5ca-53b9bdbb4f08', '11bd5344-dee5-42d6-be3f-bf5fad4b3c78', '7b2b510e-dab0-4f0f-9aae-f1d27c9de59c', 'a7e07343-b155-4218-9a29-f5bccb3a7eef', 50000.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 50000.00, 50000.00, 0.00, 'APPROVED', '2026-08-10 10:56:40.122', '2026-08-10 10:56:42.327', NULL),
('a62a5ef9-78e0-4328-9e3a-6c4070a0fe82', '0b76bc0e-3427-479a-8387-2a2a14569f32', '7b2b510e-dab0-4f0f-9aae-f1d27c9de59c', 'a7e07343-b155-4218-9a29-f5bccb3a7eef', 50000.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 50000.00, 50000.00, 0.00, 'APPROVED', '2026-08-10 11:03:41.623', '2026-08-10 11:03:43.994', NULL),
('bf3ecfc1-d139-4919-88b2-ab1c00d75295', '0fff752a-bbe9-49b6-af9b-948af15cf9cf', '7b2b510e-dab0-4f0f-9aae-f1d27c9de59c', 'a7e07343-b155-4218-9a29-f5bccb3a7eef', 50000.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 50000.00, 50000.00, 0.00, 'APPROVED', '2026-08-10 10:56:17.414', '2026-08-10 10:56:20.274', NULL),
('bf9bc559-0e41-45ac-85f8-d560885abacf', '7838cd43-c5c4-4c80-987e-3116404b6265', '7b2b510e-dab0-4f0f-9aae-f1d27c9de59c', 'a7e07343-b155-4218-9a29-f5bccb3a7eef', 42000.00, 8000.00, 1200.00, 0.00, 0.00, 0.00, 0.00, 0.00, 50000.00, 48800.00, 48800.00, 'APPROVED', '2026-08-02 08:11:12.468', '2026-08-09 11:08:45.696', 'demo-teacher-1'),
('c6b3fcf0-7e53-4c02-a29e-e9d997df4d52', '11bd5344-dee5-42d6-be3f-bf5fad4b3c78', '7b2b510e-dab0-4f0f-9aae-f1d27c9de59c', '5d7880f3-2268-4ae9-a460-598270a02b81', 50000.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 50000.00, 50000.00, 0.00, 'APPROVED', '2026-08-10 10:56:40.113', '2026-08-10 10:56:42.327', NULL),
('ed912cc8-d41a-40d4-aa6d-b6a3525fd70f', '7838cd43-c5c4-4c80-987e-3116404b6265', '7b2b510e-dab0-4f0f-9aae-f1d27c9de59c', '5b68561e-7f16-4126-8979-4d0fc815d1a4', 45000.00, 8500.00, 1200.00, 0.00, 0.00, 0.00, 0.00, 0.00, 53500.00, 52300.00, 0.00, 'APPROVED', '2026-08-02 08:11:12.486', '2026-08-09 11:08:45.696', 'demo-teacher-2');

-- --------------------------------------------------------

--
-- Table structure for table `payroll_adjustments`
--

CREATE TABLE `payroll_adjustments` (
  `id` varchar(191) NOT NULL,
  `payroll_id` varchar(191) NOT NULL,
  `type` varchar(191) NOT NULL,
  `amount` decimal(10,2) NOT NULL,
  `reason` varchar(191) NOT NULL,
  `created_at` datetime(3) NOT NULL DEFAULT current_timestamp(3)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `payroll_items`
--

CREATE TABLE `payroll_items` (
  `id` varchar(191) NOT NULL,
  `payroll_id` varchar(191) NOT NULL,
  `component_name` varchar(191) NOT NULL,
  `component_type` varchar(191) NOT NULL,
  `amount` decimal(10,2) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `payroll_items`
--

INSERT INTO `payroll_items` (`id`, `payroll_id`, `component_name`, `component_type`, `amount`) VALUES
('3a885e71-26e6-433c-9006-be04b357bffc', 'a62a5ef9-78e0-4328-9e3a-6c4070a0fe82', 'Basic Salary', 'EARNING', 50000.00),
('615120ab-cff8-4732-87bf-48d4007224f7', 'bf3ecfc1-d139-4919-88b2-ab1c00d75295', 'Basic Salary', 'EARNING', 50000.00),
('631d1e6b-e832-4183-b4dd-a8dcc5ddcbd3', '75c6216e-3ac5-4848-b5ca-53b9bdbb4f08', 'Basic Salary', 'EARNING', 50000.00),
('8268b3eb-ed09-4303-99b8-5a5e7b2319bd', '1650945d-cf68-435d-92c9-c3bc18b69f59', 'Basic Salary', 'EARNING', 50000.00),
('a18c5ff9-af9f-405e-a730-c339cbb23f55', '658709a9-0d75-4197-8a28-0a7698d03e05', 'Basic Salary', 'EARNING', 50000.00),
('aba125b0-2fe3-4934-918c-edb803fad852', 'c6b3fcf0-7e53-4c02-a29e-e9d997df4d52', 'Basic Salary', 'EARNING', 50000.00),
('b2ccf618-1ead-4f6d-9887-4c32b5ccf9b1', '32e32257-081c-4f04-a8d5-b8d676e8c2d4', 'Basic Salary', 'EARNING', 50000.00),
('b2d61d1b-b16a-411a-85d2-ad6a20286ed0', '36c56ecb-930e-4c85-a166-cc9b2f2a564d', 'Basic Salary', 'EARNING', 50000.00),
('b94a834b-b58c-43bd-8d3d-9a744617b997', '67f37e65-b154-420b-bab5-e97911bd34bd', 'Basic Salary', 'EARNING', 50000.00);

-- --------------------------------------------------------

--
-- Table structure for table `payroll_periods`
--

CREATE TABLE `payroll_periods` (
  `id` varchar(191) NOT NULL,
  `school_id` varchar(191) NOT NULL,
  `payroll_year` int(11) NOT NULL,
  `payroll_month` int(11) NOT NULL,
  `start_date` datetime(3) NOT NULL,
  `end_date` datetime(3) NOT NULL,
  `working_days` int(11) NOT NULL,
  `payment_date` datetime(3) DEFAULT NULL,
  `status` varchar(191) NOT NULL DEFAULT 'DRAFT',
  `created_at` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updated_at` datetime(3) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `payroll_periods`
--

INSERT INTO `payroll_periods` (`id`, `school_id`, `payroll_year`, `payroll_month`, `start_date`, `end_date`, `working_days`, `payment_date`, `status`, `created_at`, `updated_at`) VALUES
('0b76bc0e-3427-479a-8387-2a2a14569f32', '7b2b510e-dab0-4f0f-9aae-f1d27c9de59c', 2026, 12, '2026-12-01 12:00:00.000', '2026-12-31 12:00:00.000', 26, NULL, 'APPROVED', '2026-08-10 11:03:41.597', '2026-08-10 11:03:43.996'),
('0fff752a-bbe9-49b6-af9b-948af15cf9cf', '7b2b510e-dab0-4f0f-9aae-f1d27c9de59c', 2026, 9, '2026-09-01 12:00:00.000', '2026-09-30 12:00:00.000', 26, NULL, 'APPROVED', '2026-08-10 10:56:17.387', '2026-08-10 10:56:20.278'),
('11bd5344-dee5-42d6-be3f-bf5fad4b3c78', '7b2b510e-dab0-4f0f-9aae-f1d27c9de59c', 2026, 10, '2026-10-01 12:00:00.000', '2026-10-31 12:00:00.000', 26, NULL, 'APPROVED', '2026-08-10 10:56:40.103', '2026-08-10 10:56:42.329'),
('4c48cc94-fa29-443a-8efe-a3c03e49d30c', '7b2b510e-dab0-4f0f-9aae-f1d27c9de59c', 2026, 11, '2026-11-01 12:00:00.000', '2026-11-30 12:00:00.000', 26, NULL, 'APPROVED', '2026-08-10 10:57:54.827', '2026-08-10 10:58:08.383'),
('7838cd43-c5c4-4c80-987e-3116404b6265', '7b2b510e-dab0-4f0f-9aae-f1d27c9de59c', 2026, 8, '2026-08-01 12:00:00.000', '2026-08-31 12:00:00.000', 26, NULL, 'APPROVED', '2026-08-02 08:11:12.456', '2026-08-09 11:08:45.704');

-- --------------------------------------------------------

--
-- Table structure for table `payslips`
--

CREATE TABLE `payslips` (
  `id` varchar(191) NOT NULL,
  `payroll_id` varchar(191) NOT NULL,
  `payslip_number` varchar(191) NOT NULL,
  `generated_at` datetime(3) NOT NULL DEFAULT current_timestamp(3)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `payslips`
--

INSERT INTO `payslips` (`id`, `payroll_id`, `payslip_number`, `generated_at`) VALUES
('7c753151-1885-4546-94e3-c62769dcf084', '6e366ad3-3921-45a1-a540-cd244ac7ff0f', 'PS-1785996165236-6e36', '2026-08-06 06:02:45.238'),
('c3b040ff-4d2d-4b7c-bd0e-ad037c2d4b2a', '32e32257-081c-4f04-a8d5-b8d676e8c2d4', 'PS-1786359888921-32e3', '2026-08-10 11:04:48.928'),
('de7a7707-f01d-4558-b183-05659a2c8a17', '67f37e65-b154-420b-bab5-e97911bd34bd', 'PS-1786359519456-67f3', '2026-08-10 10:58:39.465');

-- --------------------------------------------------------

--
-- Table structure for table `periods`
--

CREATE TABLE `periods` (
  `id` varchar(191) NOT NULL,
  `school_id` varchar(191) NOT NULL,
  `name` varchar(191) NOT NULL,
  `start_time` varchar(191) NOT NULL,
  `end_time` varchar(191) NOT NULL,
  `display_order` int(11) NOT NULL DEFAULT 0,
  `is_break` tinyint(1) NOT NULL DEFAULT 0,
  `status` enum('ACTIVE','INACTIVE','SUSPENDED','PENDING') NOT NULL DEFAULT 'ACTIVE',
  `created_at` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updated_at` datetime(3) NOT NULL,
  `deleted_at` datetime(3) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `periods`
--

INSERT INTO `periods` (`id`, `school_id`, `name`, `start_time`, `end_time`, `display_order`, `is_break`, `status`, `created_at`, `updated_at`, `deleted_at`) VALUES
('demo-period-1', '7b2b510e-dab0-4f0f-9aae-f1d27c9de59c', '1st Period', '08:00', '08:45', 1, 0, 'ACTIVE', '2026-08-02 08:11:08.343', '2026-08-02 08:57:55.649', NULL),
('demo-period-2', '7b2b510e-dab0-4f0f-9aae-f1d27c9de59c', '2nd Period', '08:45', '09:30', 2, 0, 'ACTIVE', '2026-08-02 08:11:08.356', '2026-08-02 08:57:55.654', NULL),
('demo-period-3', '7b2b510e-dab0-4f0f-9aae-f1d27c9de59c', '3rd Period', '09:45', '10:30', 3, 0, 'ACTIVE', '2026-08-02 08:11:08.364', '2026-08-02 08:57:55.658', NULL),
('demo-period-4', '7b2b510e-dab0-4f0f-9aae-f1d27c9de59c', '4th Period', '10:30', '11:15', 4, 0, 'ACTIVE', '2026-08-02 08:11:08.368', '2026-08-02 08:57:55.662', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `permissions`
--

CREATE TABLE `permissions` (
  `id` varchar(191) NOT NULL,
  `code` varchar(191) NOT NULL,
  `name` varchar(191) NOT NULL,
  `module` varchar(191) NOT NULL,
  `description` varchar(191) DEFAULT NULL,
  `created_at` datetime(3) NOT NULL DEFAULT current_timestamp(3)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `permissions`
--

INSERT INTO `permissions` (`id`, `code`, `name`, `module`, `description`, `created_at`) VALUES
('02ca36e9-5174-425e-85c4-7e8d2a1474c6', 'users.manage', 'Manage Users', 'Users', NULL, '2026-07-22 10:01:21.321'),
('0b80ebe5-f071-4ce5-92d3-70b27cbc1c92', 'marks.enter', 'Enter Marks', 'Marks', NULL, '2026-07-22 10:01:21.378'),
('1537989d-15fd-46eb-a768-13c916c674cb', 'teachers.manage', 'Manage Teachers', 'Teachers', NULL, '2026-07-22 10:01:21.359'),
('1dfecfbe-8cbf-4750-ae6d-589aff673c28', 'exams.manage', 'Manage Exams', 'Exams', NULL, '2026-07-22 10:01:21.375'),
('215aa547-335c-4012-9405-b4a72e182491', 'payroll.generate', 'Generate Payroll', 'Payroll', NULL, '2026-07-22 10:01:21.406'),
('25fe42ea-7834-45a5-87e8-d0fe547bc485', 'payroll.approve', 'Approve Payroll', 'Payroll', NULL, '2026-07-22 10:01:21.408'),
('276b9798-3576-4eeb-b2db-3727e8ad5838', 'academic.manage', 'Manage Academic Records', 'Academics', NULL, '2026-07-22 10:01:21.342'),
('381aba67-f49b-4901-a027-d1a8fe7d6c54', 'students.manage', 'Manage Students', 'Students', NULL, '2026-07-22 10:01:21.348'),
('39d3fdeb-da0e-4f39-8945-37ba241cee7e', 'roles.manage', 'Manage Roles', 'Roles', NULL, '2026-07-22 10:01:21.327'),
('3a139dd4-6cf9-4dd6-aa95-900cb958083a', 'payments.reverse', 'Reverse Payments', 'Payments', NULL, '2026-07-22 10:01:21.401'),
('3bcad8d4-3a88-40cd-bc2e-956aab886503', 'fees.manage', 'Manage Fees', 'Fees', NULL, '2026-07-22 10:01:21.395'),
('448b2a09-bbfe-43cf-bca4-a72ddedf3c1b', 'students.view', 'View Students', 'Students', NULL, '2026-07-22 10:01:21.345'),
('45478f1b-76b9-40cc-90e9-a5b03a9d036f', 'payments.collect', 'Collect Payments', 'Payments', NULL, '2026-07-22 10:01:21.398'),
('4773f3c3-80dc-4dc6-90c4-8bde459241b9', 'attendance.manage', 'Manage Attendance', 'Attendance', NULL, '2026-07-22 10:01:21.370'),
('4bb9a273-8c49-4bec-b021-83fb1af72675', 'fees.view', 'View Fees', 'Fees', NULL, '2026-07-22 10:01:21.392'),
('4c296bac-2de0-493c-9ef8-747480106b1f', 'reports.export', 'Export Reports', 'Reports', NULL, '2026-07-22 10:01:21.414'),
('4d82828b-1035-4e39-8ea2-d344d50a50eb', 'marks.lock', 'Lock Marks', 'Marks', NULL, '2026-07-22 10:01:21.383'),
('583532a4-453e-4c83-b084-3ee3d0cc04fe', 'backup.manage', 'Manage Backups', 'Backup', NULL, '2026-07-22 10:01:21.419'),
('5e51c1d5-8ea5-4fc9-b3d1-ea4ee59f4c1b', 'attendance.view', 'View Attendance', 'Attendance', NULL, '2026-07-22 10:01:21.367'),
('68e905d7-04c4-45a0-9cca-023bdd350358', 'payroll.view', 'View Payroll', 'Payroll', NULL, '2026-07-22 10:01:21.403'),
('78cbd57a-a423-4308-bbd0-7810192a99e3', 'results.calculate', 'Calculate Results', 'Results', NULL, '2026-07-22 10:01:21.386'),
('819c2306-c580-4531-becc-5f536462ccbc', 'routines.view', 'View Routines', 'Routines', NULL, '2026-07-22 10:01:21.362'),
('8ff136e7-703b-433c-8d7e-83bed5e39fc9', 'admissions.view', 'View Admissions', 'Admissions', NULL, '2026-07-22 10:01:21.351'),
('90ea956a-e7ae-4cc2-8c33-4e0a4865208a', 'roles.view', 'View Roles', 'Roles', NULL, '2026-07-22 10:01:21.324'),
('98607e47-dae2-450b-8d45-87d1016b45fc', 'academic.view', 'View Academic Records', 'Academics', NULL, '2026-07-22 10:01:21.337'),
('ad591a26-ea40-43ed-a6a6-38398bc35706', 'school.settings.manage', 'Manage School Settings', 'Settings', NULL, '2026-07-22 10:01:21.331'),
('b52689af-76aa-4e29-9c82-679abfa7c6a8', 'routines.manage', 'Manage Routines', 'Routines', NULL, '2026-07-22 10:01:21.365'),
('bef71310-211c-4c9b-ac51-0f344fd17200', 'results.publish', 'Publish Results', 'Results', NULL, '2026-07-22 10:01:21.389'),
('c1fc5d73-7938-4693-bdf8-0b5103c84463', 'teachers.view', 'View Teachers', 'Teachers', NULL, '2026-07-22 10:01:21.357'),
('c617a76f-9493-11f1-9814-e0d55e1980d1', 'website.overview.manage', 'Manage Website Overview & Global Settings', 'Website Settings', 'Update global website theme, navigation and footer.', '2026-08-10 14:16:22.000'),
('c617c238-9493-11f1-9814-e0d55e1980d1', 'website.custom-pages.manage', 'Manage Website Custom Pages', 'Website Settings', 'Create, edit and delete public custom pages.', '2026-08-10 14:16:22.000'),
('c617c363-9493-11f1-9814-e0d55e1980d1', 'website.banners.manage', 'Manage Website Banner Slider', 'Website Settings', 'Update homepage banners, images and links.', '2026-08-10 14:16:22.000'),
('c617c3ef-9493-11f1-9814-e0d55e1980d1', 'website.home.manage', 'Manage Website Home Page', 'Website Settings', 'Update homepage content, notices and featured sections.', '2026-08-10 14:16:22.000'),
('c617c472-9493-11f1-9814-e0d55e1980d1', 'website.about.manage', 'Manage Website About Page', 'Website Settings', 'Update school introduction and about sections.', '2026-08-10 14:16:22.000'),
('c617c4f4-9493-11f1-9814-e0d55e1980d1', 'website.academics.manage', 'Manage Website Academics Page', 'Website Settings', 'Update public academic activities and curriculum content.', '2026-08-10 14:16:22.000'),
('c617c581-9493-11f1-9814-e0d55e1980d1', 'website.programs.manage', 'Manage Website Programs Page', 'Website Settings', 'Update programs, clubs and co-curricular content.', '2026-08-10 14:16:22.000'),
('c617c61e-9493-11f1-9814-e0d55e1980d1', 'website.gallery.manage', 'Manage Website Gallery Page', 'Website Settings', 'Update public gallery images and content.', '2026-08-10 14:16:22.000'),
('c617c6ec-9493-11f1-9814-e0d55e1980d1', 'website.events.manage', 'Manage Website Events Page', 'Website Settings', 'Update events, calendar and public notices.', '2026-08-10 14:16:22.000'),
('c617c78c-9493-11f1-9814-e0d55e1980d1', 'website.admission.manage', 'Manage Website Admission Page', 'Website Settings', 'Update public admission information and requirements.', '2026-08-10 14:16:22.000'),
('c617c81c-9493-11f1-9814-e0d55e1980d1', 'website.teachers.manage', 'Manage Website Teachers Page', 'Website Settings', 'Select and update teachers shown on the public website.', '2026-08-10 14:16:22.000'),
('c617c8ac-9493-11f1-9814-e0d55e1980d1', 'website.facilities.manage', 'Manage Website Facilities Page', 'Website Settings', 'Update campus facilities and services.', '2026-08-10 14:16:22.000'),
('c617c938-9493-11f1-9814-e0d55e1980d1', 'website.achievements.manage', 'Manage Website Achievements Page', 'Website Settings', 'Update public awards, results and achievements.', '2026-08-10 14:16:22.000'),
('c617c9c0-9493-11f1-9814-e0d55e1980d1', 'website.downloads.manage', 'Manage Website Downloads Page', 'Website Settings', 'Upload and manage forms, syllabus and publications.', '2026-08-10 14:16:22.000'),
('c617ca28-9493-11f1-9814-e0d55e1980d1', 'website.contact.manage', 'Manage Website Contact Page', 'Website Settings', 'Update public contact and office information.', '2026-08-10 14:16:22.000'),
('d3f921b8-57e1-4a52-893c-604c64087b81', 'exams.view', 'View Exams', 'Exams', NULL, '2026-07-22 10:01:21.373'),
('d49cfe03-8671-4426-bb6c-63567ffb33d2', 'marks.verify', 'Verify Marks', 'Marks', NULL, '2026-07-22 10:01:21.381'),
('d8c31fac-a306-4a98-9539-ba3e784a646c', 'dashboard.view', 'View Dashboard', 'Dashboard', NULL, '2026-07-22 10:01:21.314'),
('df663955-5778-4032-b718-9045ed14e981', 'users.view', 'View Users', 'Users', NULL, '2026-07-22 10:01:21.318'),
('df8f70b8-dc68-43ca-ae3e-4d724749bd12', 'reports.view', 'View Reports', 'Reports', NULL, '2026-07-22 10:01:21.411'),
('e13d27dd-2cba-411e-8132-e24a2a18a223', 'audit.view', 'View Audit Logs', 'Audit', NULL, '2026-07-22 10:01:21.416'),
('e84ee5bc-868a-11f1-bcd6-e0d55e1980d1', 'imports.view', 'View Import History', 'Imports', 'View bulk import and export history.', '2026-07-23 17:37:40.048'),
('e84f22e3-868a-11f1-bcd6-e0d55e1980d1', 'imports.manage', 'Manage Bulk Imports', 'Imports', 'Preview, validate, and confirm bulk imports.', '2026-07-23 17:37:40.048'),
('e84f23ee-868a-11f1-bcd6-e0d55e1980d1', 'legacy.migrate', 'Migrate Legacy Installments', 'Imports', 'Explicitly migrate isolated legacy installments into current billing.', '2026-07-23 17:37:40.048'),
('f5a0654b-8e36-11f1-8c8a-e0d55e1980d1', 'guardians.view', 'View Guardians', 'Guardians', NULL, '2026-08-02 11:56:52.549'),
('f5a0cced-8e36-11f1-8c8a-e0d55e1980d1', 'guardians.manage', 'Manage Guardians', 'Guardians', NULL, '2026-08-02 11:56:52.549'),
('f5a0cd9a-8e36-11f1-8c8a-e0d55e1980d1', 'employees.view', 'View Employees', 'Employees', NULL, '2026-08-02 11:56:52.549'),
('f5a0cdda-8e36-11f1-8c8a-e0d55e1980d1', 'employees.manage', 'Manage Employees', 'Employees', NULL, '2026-08-02 11:56:52.549'),
('f5a0ce11-8e36-11f1-8c8a-e0d55e1980d1', 'departments.view', 'View Departments', 'HR', NULL, '2026-08-02 11:56:52.549'),
('f5a0ce48-8e36-11f1-8c8a-e0d55e1980d1', 'departments.manage', 'Manage Departments', 'HR', NULL, '2026-08-02 11:56:52.549'),
('f5a0ceaa-8e36-11f1-8c8a-e0d55e1980d1', 'designations.view', 'View Designations', 'HR', NULL, '2026-08-02 11:56:52.549'),
('f5a0cee0-8e36-11f1-8c8a-e0d55e1980d1', 'designations.manage', 'Manage Designations', 'HR', NULL, '2026-08-02 11:56:52.549'),
('f5a0cf14-8e36-11f1-8c8a-e0d55e1980d1', 'teacher-assignments.view', 'View Teacher Assignments', 'Teachers', NULL, '2026-08-02 11:56:52.549'),
('f5a0cf4d-8e36-11f1-8c8a-e0d55e1980d1', 'teacher-assignments.manage', 'Manage Teacher Assignments', 'Teachers', NULL, '2026-08-02 11:56:52.549'),
('f5a0cf7f-8e36-11f1-8c8a-e0d55e1980d1', 'homework.view', 'View Homework', 'Homework', NULL, '2026-08-02 11:56:52.549'),
('f5a0cfaf-8e36-11f1-8c8a-e0d55e1980d1', 'homework.manage', 'Manage Homework', 'Homework', NULL, '2026-08-02 11:56:52.549'),
('f5a0cfe5-8e36-11f1-8c8a-e0d55e1980d1', 'leave.view', 'View Leave', 'Leave', NULL, '2026-08-02 11:56:52.549'),
('f5a0d018-8e36-11f1-8c8a-e0d55e1980d1', 'leave.manage', 'Manage Leave', 'Leave', NULL, '2026-08-02 11:56:52.549'),
('f5a0d067-8e36-11f1-8c8a-e0d55e1980d1', 'portal.teacher.view', 'Access Teacher Portal', 'Portals', NULL, '2026-08-02 11:56:52.549'),
('f5a0d0a0-8e36-11f1-8c8a-e0d55e1980d1', 'portal.student.view', 'Access Student Portal', 'Portals', NULL, '2026-08-02 11:56:52.549'),
('f5a0d0d6-8e36-11f1-8c8a-e0d55e1980d1', 'portal.guardian.view', 'Access Guardian Portal', 'Portals', NULL, '2026-08-02 11:56:52.549'),
('f5a0d10d-8e36-11f1-8c8a-e0d55e1980d1', 'portal.employee.view', 'Access Employee Self Service', 'Portals', NULL, '2026-08-02 11:56:52.549'),
('ff398c91-94cf-4269-aa25-e3e110ec9ceb', 'admissions.manage', 'Manage Admissions', 'Admissions', NULL, '2026-07-22 10:01:21.354');

-- --------------------------------------------------------

--
-- Table structure for table `receipts`
--

CREATE TABLE `receipts` (
  `id` varchar(191) NOT NULL,
  `school_id` varchar(191) NOT NULL,
  `receipt_number` varchar(191) NOT NULL,
  `payment_id` varchar(191) NOT NULL,
  `student_id` varchar(191) NOT NULL,
  `total_paid` decimal(12,2) NOT NULL,
  `generated_at` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `remarks` varchar(191) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `refunds`
--

CREATE TABLE `refunds` (
  `id` varchar(191) NOT NULL,
  `school_id` varchar(191) NOT NULL,
  `student_id` varchar(191) NOT NULL,
  `payment_id` varchar(191) NOT NULL,
  `refund_number` varchar(191) NOT NULL,
  `amount` decimal(12,2) NOT NULL,
  `reason` varchar(191) NOT NULL,
  `approved_by` varchar(191) DEFAULT NULL,
  `refund_date` datetime(3) NOT NULL,
  `created_at` datetime(3) NOT NULL DEFAULT current_timestamp(3)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `report_cards`
--

CREATE TABLE `report_cards` (
  `id` varchar(191) NOT NULL,
  `school_id` varchar(191) NOT NULL,
  `exam_id` varchar(191) NOT NULL,
  `student_id` varchar(191) NOT NULL,
  `report_card_number` varchar(191) NOT NULL,
  `verification_code` varchar(191) NOT NULL,
  `generated_at` datetime(3) NOT NULL DEFAULT current_timestamp(3)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `result_publications`
--

CREATE TABLE `result_publications` (
  `id` varchar(191) NOT NULL,
  `school_id` varchar(191) NOT NULL,
  `exam_id` varchar(191) NOT NULL,
  `class_id` varchar(191) DEFAULT NULL,
  `status` varchar(191) NOT NULL DEFAULT 'PUBLISHED',
  `published_by_id` varchar(191) NOT NULL,
  `published_at` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `unpublish_reason` varchar(191) DEFAULT NULL,
  `unpublished_by_id` varchar(191) DEFAULT NULL,
  `unpublished_at` datetime(3) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `result_publications`
--

INSERT INTO `result_publications` (`id`, `school_id`, `exam_id`, `class_id`, `status`, `published_by_id`, `published_at`, `unpublish_reason`, `unpublished_by_id`, `unpublished_at`) VALUES
('1e4c7af3-6097-4bd6-ac45-9b9b22219010', '7b2b510e-dab0-4f0f-9aae-f1d27c9de59c', 'demo-exam-upcoming', 'demo-class-6', 'UNPUBLISHED', '52897111-6585-4527-9211-1a20b7c2ff8f', '2026-08-02 10:12:15.080', 'Correction in progress', '52897111-6585-4527-9211-1a20b7c2ff8f', '2026-08-02 10:12:17.363'),
('419dd52e-e5c9-4d66-84de-3ce06f620915', '7b2b510e-dab0-4f0f-9aae-f1d27c9de59c', 'demo-exam-upcoming', NULL, 'PUBLISHED', 'fc9940e7-a1ca-4996-877e-15b70ff8da36', '2026-08-09 06:11:27.750', NULL, NULL, NULL),
('7595de9b-7b09-4c07-b85e-75202670f01c', '7b2b510e-dab0-4f0f-9aae-f1d27c9de59c', 'demo-exam-upcoming', 'demo-class-8', 'UNPUBLISHED', '52897111-6585-4527-9211-1a20b7c2ff8f', '2026-08-09 08:03:35.671', 'Correction in progress', '52897111-6585-4527-9211-1a20b7c2ff8f', '2026-08-09 08:03:35.669');

-- --------------------------------------------------------

--
-- Table structure for table `result_subjects`
--

CREATE TABLE `result_subjects` (
  `id` varchar(191) NOT NULL,
  `result_id` varchar(191) NOT NULL,
  `subject_id` varchar(191) NOT NULL,
  `fullMarks` decimal(5,2) NOT NULL,
  `passMarks` decimal(5,2) NOT NULL,
  `obtainedMarks` decimal(5,2) NOT NULL,
  `letter_grade` varchar(191) NOT NULL,
  `gradePoint` decimal(4,2) NOT NULL,
  `is_optional` tinyint(1) NOT NULL DEFAULT 0,
  `is_passed` tinyint(1) NOT NULL DEFAULT 1,
  `is_absent` tinyint(1) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `result_subjects`
--

INSERT INTO `result_subjects` (`id`, `result_id`, `subject_id`, `fullMarks`, `passMarks`, `obtainedMarks`, `letter_grade`, `gradePoint`, `is_optional`, `is_passed`, `is_absent`) VALUES
('06fa7db3-0bc8-42f8-8549-989eab0bf897', '458c2f5a-f91b-4cf5-ad98-191164accfa6', 'demo-subject-sci', 100.00, 33.00, 0.00, 'F', 0.00, 0, 0, 1),
('080edac5-2539-43e6-89bf-fba27acf42de', 'f0d2f76d-f026-4c6e-87fc-1a0ff1f16565', 'demo-subject-eng', 100.00, 33.00, 0.00, 'F', 0.00, 0, 0, 1),
('10446ca1-27dc-4778-81ad-907fd81948b0', 'f0d2f76d-f026-4c6e-87fc-1a0ff1f16565', 'demo-subject-bgs', 100.00, 33.00, 0.00, 'F', 0.00, 0, 0, 1),
('2af69d86-1609-45f1-b9c4-514628001092', 'f0d2f76d-f026-4c6e-87fc-1a0ff1f16565', 'demo-subject-sci', 100.00, 33.00, 0.00, 'F', 0.00, 0, 0, 1),
('2b8975e4-ac92-477f-a79d-19416548ea8f', 'f0d2f76d-f026-4c6e-87fc-1a0ff1f16565', 'demo-subject-ict', 100.00, 33.00, 0.00, 'F', 0.00, 0, 0, 1),
('2e87626b-cc16-4d83-ba7e-75d1dc47acb8', 'f0d2f76d-f026-4c6e-87fc-1a0ff1f16565', 'demo-subject-mat', 100.00, 33.00, 0.00, 'F', 0.00, 0, 0, 1),
('3468909d-6f6a-405b-814e-186184677d69', '162af601-2a55-419f-b03d-b8254e3e0442', 'demo-subject-ban', 100.00, 33.00, 50.00, 'B', 3.00, 0, 1, 0),
('3fca145d-853c-4711-8ff7-2e5ec9f8e542', '61f5cb7c-b499-4073-9695-90dc2ed03f57', 'demo-subject-ban', 100.00, 33.00, 50.00, 'B', 3.00, 0, 1, 0),
('72d290fe-549a-495a-a863-f78ff5e2211f', '458c2f5a-f91b-4cf5-ad98-191164accfa6', 'demo-subject-mat', 100.00, 33.00, 0.00, 'F', 0.00, 0, 0, 1),
('8f0b268c-58ea-41bb-9e14-827df4b7fa48', 'f0d2f76d-f026-4c6e-87fc-1a0ff1f16565', 'demo-subject-ban', 100.00, 33.00, 0.00, 'F', 0.00, 0, 0, 1),
('bcdd4583-39d9-4d1e-9f2a-b2fbd9649091', '458c2f5a-f91b-4cf5-ad98-191164accfa6', 'demo-subject-eng', 100.00, 33.00, 0.00, 'F', 0.00, 0, 0, 1),
('cc7b6c74-7a57-4d43-b7da-4d29ea863ab9', '458c2f5a-f91b-4cf5-ad98-191164accfa6', 'demo-subject-ict', 100.00, 33.00, 0.00, 'F', 0.00, 0, 0, 1),
('cd8419c6-fc6c-4d57-82b7-9d5dff77d8df', '458c2f5a-f91b-4cf5-ad98-191164accfa6', 'demo-subject-ban', 100.00, 33.00, 0.00, 'F', 0.00, 0, 0, 1),
('d269c9f8-82eb-4f6a-b765-f0f68a010dcc', '458c2f5a-f91b-4cf5-ad98-191164accfa6', 'demo-subject-bgs', 100.00, 33.00, 0.00, 'F', 0.00, 0, 0, 1);

-- --------------------------------------------------------

--
-- Table structure for table `roles`
--

CREATE TABLE `roles` (
  `id` varchar(191) NOT NULL,
  `name` varchar(191) NOT NULL,
  `display_name` varchar(191) NOT NULL,
  `description` varchar(191) DEFAULT NULL,
  `is_system` tinyint(1) NOT NULL DEFAULT 0,
  `created_at` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updated_at` datetime(3) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `roles`
--

INSERT INTO `roles` (`id`, `name`, `display_name`, `description`, `is_system`, `created_at`, `updated_at`) VALUES
('1e1370cd-b59d-4fe4-b03d-40aa9aac48b8', 'Academic Admin', 'Academic Administrator', NULL, 1, '2026-07-22 10:01:21.428', '2026-08-10 06:34:28.465'),
('27a3620d-879e-409c-8fc8-3be3b2cc13bf', 'Super Admin', 'Super Administrator', NULL, 1, '2026-07-22 10:01:21.421', '2026-08-10 06:34:28.457'),
('3906db5a-acaf-4320-af95-841ba136b82a', 'Admission Officer', 'Admission Officer', NULL, 1, '2026-07-22 10:01:21.430', '2026-08-10 06:34:28.468'),
('4181ae83-e64c-4643-9eb8-91674a83d259', 'Website Management', 'Website Management', 'Website Management with content update', 0, '2026-08-10 08:08:57.433', '2026-08-10 08:08:57.433'),
('5ac077bc-2057-4588-a302-9a93c84f6b6b', 'School Admin', 'School Administrator', NULL, 1, '2026-07-22 10:01:21.425', '2026-08-10 06:34:28.462'),
('8718c924-8bd7-49ca-8ef8-7022d668b826', 'Teacher', 'Teacher', NULL, 1, '2026-07-22 10:01:21.437', '2026-08-10 06:34:28.478'),
('9ce2211c-729c-4dda-bed6-8fb76b417bad', 'Student', 'Student', NULL, 1, '2026-07-22 10:01:21.441', '2026-08-10 06:34:28.486'),
('e52062de-5306-4aa3-a78f-368adbd05b84', 'Employee', 'Employee', NULL, 1, '2026-07-22 10:01:21.439', '2026-08-10 06:34:28.482'),
('f017bebf-942a-4d49-b333-ee32d542fc48', 'Accountant', 'Accountant', NULL, 1, '2026-07-22 10:01:21.432', '2026-08-10 06:34:28.471'),
('f2e9ecb5-c773-42f1-887c-30a07b6afe12', 'Parent/Guardian', 'Parent/Guardian', NULL, 1, '2026-07-22 10:01:21.443', '2026-08-10 06:34:28.490'),
('f636973a-29d1-45ba-b7d8-516a346d77dc', 'HR Manager', 'HR Manager', NULL, 1, '2026-07-22 10:01:21.434', '2026-08-10 06:34:28.475');

-- --------------------------------------------------------

--
-- Table structure for table `role_permissions`
--

CREATE TABLE `role_permissions` (
  `role_id` varchar(191) NOT NULL,
  `permission_id` varchar(191) NOT NULL,
  `created_at` datetime(3) NOT NULL DEFAULT current_timestamp(3)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `role_permissions`
--

INSERT INTO `role_permissions` (`role_id`, `permission_id`, `created_at`) VALUES
('1e1370cd-b59d-4fe4-b03d-40aa9aac48b8', '0b80ebe5-f071-4ce5-92d3-70b27cbc1c92', '2026-08-10 08:28:17.070'),
('1e1370cd-b59d-4fe4-b03d-40aa9aac48b8', '1dfecfbe-8cbf-4750-ae6d-589aff673c28', '2026-08-10 08:28:17.070'),
('1e1370cd-b59d-4fe4-b03d-40aa9aac48b8', '276b9798-3576-4eeb-b2db-3727e8ad5838', '2026-08-10 08:28:17.070'),
('1e1370cd-b59d-4fe4-b03d-40aa9aac48b8', '381aba67-f49b-4901-a027-d1a8fe7d6c54', '2026-08-10 08:28:17.070'),
('1e1370cd-b59d-4fe4-b03d-40aa9aac48b8', '448b2a09-bbfe-43cf-bca4-a72ddedf3c1b', '2026-08-10 08:28:17.070'),
('1e1370cd-b59d-4fe4-b03d-40aa9aac48b8', '4773f3c3-80dc-4dc6-90c4-8bde459241b9', '2026-08-10 08:28:17.070'),
('1e1370cd-b59d-4fe4-b03d-40aa9aac48b8', '4c296bac-2de0-493c-9ef8-747480106b1f', '2026-08-10 08:28:17.070'),
('1e1370cd-b59d-4fe4-b03d-40aa9aac48b8', '5e51c1d5-8ea5-4fc9-b3d1-ea4ee59f4c1b', '2026-08-10 08:28:17.070'),
('1e1370cd-b59d-4fe4-b03d-40aa9aac48b8', '78cbd57a-a423-4308-bbd0-7810192a99e3', '2026-08-10 08:28:17.070'),
('1e1370cd-b59d-4fe4-b03d-40aa9aac48b8', '819c2306-c580-4531-becc-5f536462ccbc', '2026-08-10 08:28:17.070'),
('1e1370cd-b59d-4fe4-b03d-40aa9aac48b8', '8ff136e7-703b-433c-8d7e-83bed5e39fc9', '2026-08-10 08:28:17.070'),
('1e1370cd-b59d-4fe4-b03d-40aa9aac48b8', '98607e47-dae2-450b-8d45-87d1016b45fc', '2026-08-10 08:28:17.070'),
('1e1370cd-b59d-4fe4-b03d-40aa9aac48b8', 'b52689af-76aa-4e29-9c82-679abfa7c6a8', '2026-08-10 08:28:17.070'),
('1e1370cd-b59d-4fe4-b03d-40aa9aac48b8', 'bef71310-211c-4c9b-ac51-0f344fd17200', '2026-08-10 08:28:17.070'),
('1e1370cd-b59d-4fe4-b03d-40aa9aac48b8', 'c1fc5d73-7938-4693-bdf8-0b5103c84463', '2026-08-10 08:28:17.070'),
('1e1370cd-b59d-4fe4-b03d-40aa9aac48b8', 'c617a76f-9493-11f1-9814-e0d55e1980d1', '2026-08-10 08:28:17.070'),
('1e1370cd-b59d-4fe4-b03d-40aa9aac48b8', 'c617c238-9493-11f1-9814-e0d55e1980d1', '2026-08-10 08:28:17.070'),
('1e1370cd-b59d-4fe4-b03d-40aa9aac48b8', 'c617c363-9493-11f1-9814-e0d55e1980d1', '2026-08-10 08:28:17.070'),
('1e1370cd-b59d-4fe4-b03d-40aa9aac48b8', 'c617c3ef-9493-11f1-9814-e0d55e1980d1', '2026-08-10 08:28:17.070'),
('1e1370cd-b59d-4fe4-b03d-40aa9aac48b8', 'c617c472-9493-11f1-9814-e0d55e1980d1', '2026-08-10 08:28:17.070'),
('1e1370cd-b59d-4fe4-b03d-40aa9aac48b8', 'c617c4f4-9493-11f1-9814-e0d55e1980d1', '2026-08-10 08:28:17.070'),
('1e1370cd-b59d-4fe4-b03d-40aa9aac48b8', 'c617c581-9493-11f1-9814-e0d55e1980d1', '2026-08-10 08:28:17.070'),
('1e1370cd-b59d-4fe4-b03d-40aa9aac48b8', 'c617c61e-9493-11f1-9814-e0d55e1980d1', '2026-08-10 08:28:17.070'),
('1e1370cd-b59d-4fe4-b03d-40aa9aac48b8', 'c617c6ec-9493-11f1-9814-e0d55e1980d1', '2026-08-10 08:28:17.070'),
('1e1370cd-b59d-4fe4-b03d-40aa9aac48b8', 'c617c78c-9493-11f1-9814-e0d55e1980d1', '2026-08-10 08:28:17.070'),
('1e1370cd-b59d-4fe4-b03d-40aa9aac48b8', 'c617c81c-9493-11f1-9814-e0d55e1980d1', '2026-08-10 08:28:17.070'),
('1e1370cd-b59d-4fe4-b03d-40aa9aac48b8', 'c617c8ac-9493-11f1-9814-e0d55e1980d1', '2026-08-10 08:28:17.070'),
('1e1370cd-b59d-4fe4-b03d-40aa9aac48b8', 'c617c938-9493-11f1-9814-e0d55e1980d1', '2026-08-10 08:28:17.070'),
('1e1370cd-b59d-4fe4-b03d-40aa9aac48b8', 'c617c9c0-9493-11f1-9814-e0d55e1980d1', '2026-08-10 08:28:17.070'),
('1e1370cd-b59d-4fe4-b03d-40aa9aac48b8', 'c617ca28-9493-11f1-9814-e0d55e1980d1', '2026-08-10 08:28:17.070'),
('1e1370cd-b59d-4fe4-b03d-40aa9aac48b8', 'd3f921b8-57e1-4a52-893c-604c64087b81', '2026-08-10 08:28:17.070'),
('1e1370cd-b59d-4fe4-b03d-40aa9aac48b8', 'd49cfe03-8671-4426-bb6c-63567ffb33d2', '2026-08-10 08:28:17.070'),
('1e1370cd-b59d-4fe4-b03d-40aa9aac48b8', 'd8c31fac-a306-4a98-9539-ba3e784a646c', '2026-08-10 08:28:17.070'),
('1e1370cd-b59d-4fe4-b03d-40aa9aac48b8', 'df8f70b8-dc68-43ca-ae3e-4d724749bd12', '2026-08-10 08:28:17.070'),
('1e1370cd-b59d-4fe4-b03d-40aa9aac48b8', 'e84ee5bc-868a-11f1-bcd6-e0d55e1980d1', '2026-08-10 08:28:17.070'),
('1e1370cd-b59d-4fe4-b03d-40aa9aac48b8', 'f5a0654b-8e36-11f1-8c8a-e0d55e1980d1', '2026-08-10 08:28:17.070'),
('1e1370cd-b59d-4fe4-b03d-40aa9aac48b8', 'f5a0cf14-8e36-11f1-8c8a-e0d55e1980d1', '2026-08-10 08:28:17.070'),
('1e1370cd-b59d-4fe4-b03d-40aa9aac48b8', 'f5a0cf7f-8e36-11f1-8c8a-e0d55e1980d1', '2026-08-10 08:28:17.070'),
('1e1370cd-b59d-4fe4-b03d-40aa9aac48b8', 'f5a0cfaf-8e36-11f1-8c8a-e0d55e1980d1', '2026-08-10 08:28:17.070'),
('1e1370cd-b59d-4fe4-b03d-40aa9aac48b8', 'ff398c91-94cf-4269-aa25-e3e110ec9ceb', '2026-08-10 08:28:17.070'),
('27a3620d-879e-409c-8fc8-3be3b2cc13bf', '02ca36e9-5174-425e-85c4-7e8d2a1474c6', '2026-07-22 10:01:21.454'),
('27a3620d-879e-409c-8fc8-3be3b2cc13bf', '0b80ebe5-f071-4ce5-92d3-70b27cbc1c92', '2026-07-22 10:01:21.503'),
('27a3620d-879e-409c-8fc8-3be3b2cc13bf', '1537989d-15fd-46eb-a768-13c916c674cb', '2026-07-22 10:01:21.485'),
('27a3620d-879e-409c-8fc8-3be3b2cc13bf', '1dfecfbe-8cbf-4750-ae6d-589aff673c28', '2026-07-22 10:01:21.501'),
('27a3620d-879e-409c-8fc8-3be3b2cc13bf', '215aa547-335c-4012-9405-b4a72e182491', '2026-07-22 10:01:21.528'),
('27a3620d-879e-409c-8fc8-3be3b2cc13bf', '25fe42ea-7834-45a5-87e8-d0fe547bc485', '2026-07-22 10:01:21.531'),
('27a3620d-879e-409c-8fc8-3be3b2cc13bf', '276b9798-3576-4eeb-b2db-3727e8ad5838', '2026-07-22 10:01:21.466'),
('27a3620d-879e-409c-8fc8-3be3b2cc13bf', '381aba67-f49b-4901-a027-d1a8fe7d6c54', '2026-07-22 10:01:21.472'),
('27a3620d-879e-409c-8fc8-3be3b2cc13bf', '39d3fdeb-da0e-4f39-8945-37ba241cee7e', '2026-07-22 10:01:21.458'),
('27a3620d-879e-409c-8fc8-3be3b2cc13bf', '3a139dd4-6cf9-4dd6-aa95-900cb958083a', '2026-07-22 10:01:21.524'),
('27a3620d-879e-409c-8fc8-3be3b2cc13bf', '3bcad8d4-3a88-40cd-bc2e-956aab886503', '2026-07-22 10:01:21.519'),
('27a3620d-879e-409c-8fc8-3be3b2cc13bf', '448b2a09-bbfe-43cf-bca4-a72ddedf3c1b', '2026-07-22 10:01:21.469'),
('27a3620d-879e-409c-8fc8-3be3b2cc13bf', '45478f1b-76b9-40cc-90e9-a5b03a9d036f', '2026-07-22 10:01:21.521'),
('27a3620d-879e-409c-8fc8-3be3b2cc13bf', '4773f3c3-80dc-4dc6-90c4-8bde459241b9', '2026-07-22 10:01:21.496'),
('27a3620d-879e-409c-8fc8-3be3b2cc13bf', '4bb9a273-8c49-4bec-b021-83fb1af72675', '2026-07-22 10:01:21.517'),
('27a3620d-879e-409c-8fc8-3be3b2cc13bf', '4c296bac-2de0-493c-9ef8-747480106b1f', '2026-07-22 10:01:21.537'),
('27a3620d-879e-409c-8fc8-3be3b2cc13bf', '4d82828b-1035-4e39-8ea2-d344d50a50eb', '2026-07-22 10:01:21.509'),
('27a3620d-879e-409c-8fc8-3be3b2cc13bf', '583532a4-453e-4c83-b084-3ee3d0cc04fe', '2026-07-22 10:01:21.542'),
('27a3620d-879e-409c-8fc8-3be3b2cc13bf', '5e51c1d5-8ea5-4fc9-b3d1-ea4ee59f4c1b', '2026-07-22 10:01:21.493'),
('27a3620d-879e-409c-8fc8-3be3b2cc13bf', '68e905d7-04c4-45a0-9cca-023bdd350358', '2026-07-22 10:01:21.526'),
('27a3620d-879e-409c-8fc8-3be3b2cc13bf', '78cbd57a-a423-4308-bbd0-7810192a99e3', '2026-07-22 10:01:21.511'),
('27a3620d-879e-409c-8fc8-3be3b2cc13bf', '819c2306-c580-4531-becc-5f536462ccbc', '2026-07-22 10:01:21.488'),
('27a3620d-879e-409c-8fc8-3be3b2cc13bf', '8ff136e7-703b-433c-8d7e-83bed5e39fc9', '2026-07-22 10:01:21.475'),
('27a3620d-879e-409c-8fc8-3be3b2cc13bf', '90ea956a-e7ae-4cc2-8c33-4e0a4865208a', '2026-07-22 10:01:21.456'),
('27a3620d-879e-409c-8fc8-3be3b2cc13bf', '98607e47-dae2-450b-8d45-87d1016b45fc', '2026-07-22 10:01:21.464'),
('27a3620d-879e-409c-8fc8-3be3b2cc13bf', 'ad591a26-ea40-43ed-a6a6-38398bc35706', '2026-07-22 10:01:21.461'),
('27a3620d-879e-409c-8fc8-3be3b2cc13bf', 'b52689af-76aa-4e29-9c82-679abfa7c6a8', '2026-07-22 10:01:21.490'),
('27a3620d-879e-409c-8fc8-3be3b2cc13bf', 'bef71310-211c-4c9b-ac51-0f344fd17200', '2026-07-22 10:01:21.514'),
('27a3620d-879e-409c-8fc8-3be3b2cc13bf', 'c1fc5d73-7938-4693-bdf8-0b5103c84463', '2026-07-22 10:01:21.482'),
('27a3620d-879e-409c-8fc8-3be3b2cc13bf', 'c617a76f-9493-11f1-9814-e0d55e1980d1', '2026-08-10 14:16:22.000'),
('27a3620d-879e-409c-8fc8-3be3b2cc13bf', 'c617c238-9493-11f1-9814-e0d55e1980d1', '2026-08-10 14:16:22.000'),
('27a3620d-879e-409c-8fc8-3be3b2cc13bf', 'c617c363-9493-11f1-9814-e0d55e1980d1', '2026-08-10 14:16:22.000'),
('27a3620d-879e-409c-8fc8-3be3b2cc13bf', 'c617c3ef-9493-11f1-9814-e0d55e1980d1', '2026-08-10 14:16:22.000'),
('27a3620d-879e-409c-8fc8-3be3b2cc13bf', 'c617c472-9493-11f1-9814-e0d55e1980d1', '2026-08-10 14:16:22.000'),
('27a3620d-879e-409c-8fc8-3be3b2cc13bf', 'c617c4f4-9493-11f1-9814-e0d55e1980d1', '2026-08-10 14:16:22.000'),
('27a3620d-879e-409c-8fc8-3be3b2cc13bf', 'c617c581-9493-11f1-9814-e0d55e1980d1', '2026-08-10 14:16:22.000'),
('27a3620d-879e-409c-8fc8-3be3b2cc13bf', 'c617c61e-9493-11f1-9814-e0d55e1980d1', '2026-08-10 14:16:22.000'),
('27a3620d-879e-409c-8fc8-3be3b2cc13bf', 'c617c6ec-9493-11f1-9814-e0d55e1980d1', '2026-08-10 14:16:22.000'),
('27a3620d-879e-409c-8fc8-3be3b2cc13bf', 'c617c78c-9493-11f1-9814-e0d55e1980d1', '2026-08-10 14:16:22.000'),
('27a3620d-879e-409c-8fc8-3be3b2cc13bf', 'c617c81c-9493-11f1-9814-e0d55e1980d1', '2026-08-10 14:16:22.000'),
('27a3620d-879e-409c-8fc8-3be3b2cc13bf', 'c617c8ac-9493-11f1-9814-e0d55e1980d1', '2026-08-10 14:16:22.000'),
('27a3620d-879e-409c-8fc8-3be3b2cc13bf', 'c617c938-9493-11f1-9814-e0d55e1980d1', '2026-08-10 14:16:22.000'),
('27a3620d-879e-409c-8fc8-3be3b2cc13bf', 'c617c9c0-9493-11f1-9814-e0d55e1980d1', '2026-08-10 14:16:22.000'),
('27a3620d-879e-409c-8fc8-3be3b2cc13bf', 'c617ca28-9493-11f1-9814-e0d55e1980d1', '2026-08-10 14:16:22.000'),
('27a3620d-879e-409c-8fc8-3be3b2cc13bf', 'd3f921b8-57e1-4a52-893c-604c64087b81', '2026-07-22 10:01:21.499'),
('27a3620d-879e-409c-8fc8-3be3b2cc13bf', 'd49cfe03-8671-4426-bb6c-63567ffb33d2', '2026-07-22 10:01:21.506'),
('27a3620d-879e-409c-8fc8-3be3b2cc13bf', 'd8c31fac-a306-4a98-9539-ba3e784a646c', '2026-07-22 10:01:21.446'),
('27a3620d-879e-409c-8fc8-3be3b2cc13bf', 'df663955-5778-4032-b718-9045ed14e981', '2026-07-22 10:01:21.450'),
('27a3620d-879e-409c-8fc8-3be3b2cc13bf', 'df8f70b8-dc68-43ca-ae3e-4d724749bd12', '2026-07-22 10:01:21.534'),
('27a3620d-879e-409c-8fc8-3be3b2cc13bf', 'e13d27dd-2cba-411e-8132-e24a2a18a223', '2026-07-22 10:01:21.539'),
('27a3620d-879e-409c-8fc8-3be3b2cc13bf', 'e84ee5bc-868a-11f1-bcd6-e0d55e1980d1', '2026-07-23 17:37:40.056'),
('27a3620d-879e-409c-8fc8-3be3b2cc13bf', 'e84f22e3-868a-11f1-bcd6-e0d55e1980d1', '2026-07-23 17:37:40.056'),
('27a3620d-879e-409c-8fc8-3be3b2cc13bf', 'e84f23ee-868a-11f1-bcd6-e0d55e1980d1', '2026-07-23 17:37:40.056'),
('27a3620d-879e-409c-8fc8-3be3b2cc13bf', 'f5a0654b-8e36-11f1-8c8a-e0d55e1980d1', '2026-08-02 11:56:52.554'),
('27a3620d-879e-409c-8fc8-3be3b2cc13bf', 'f5a0cced-8e36-11f1-8c8a-e0d55e1980d1', '2026-08-02 11:56:52.554'),
('27a3620d-879e-409c-8fc8-3be3b2cc13bf', 'f5a0cd9a-8e36-11f1-8c8a-e0d55e1980d1', '2026-08-02 11:56:52.554'),
('27a3620d-879e-409c-8fc8-3be3b2cc13bf', 'f5a0cdda-8e36-11f1-8c8a-e0d55e1980d1', '2026-08-02 11:56:52.554'),
('27a3620d-879e-409c-8fc8-3be3b2cc13bf', 'f5a0ce11-8e36-11f1-8c8a-e0d55e1980d1', '2026-08-02 11:56:52.554'),
('27a3620d-879e-409c-8fc8-3be3b2cc13bf', 'f5a0ce48-8e36-11f1-8c8a-e0d55e1980d1', '2026-08-02 11:56:52.554'),
('27a3620d-879e-409c-8fc8-3be3b2cc13bf', 'f5a0ceaa-8e36-11f1-8c8a-e0d55e1980d1', '2026-08-02 11:56:52.554'),
('27a3620d-879e-409c-8fc8-3be3b2cc13bf', 'f5a0cee0-8e36-11f1-8c8a-e0d55e1980d1', '2026-08-02 11:56:52.554'),
('27a3620d-879e-409c-8fc8-3be3b2cc13bf', 'f5a0cf14-8e36-11f1-8c8a-e0d55e1980d1', '2026-08-02 11:56:52.554'),
('27a3620d-879e-409c-8fc8-3be3b2cc13bf', 'f5a0cf4d-8e36-11f1-8c8a-e0d55e1980d1', '2026-08-02 11:56:52.554'),
('27a3620d-879e-409c-8fc8-3be3b2cc13bf', 'f5a0cf7f-8e36-11f1-8c8a-e0d55e1980d1', '2026-08-02 11:56:52.554'),
('27a3620d-879e-409c-8fc8-3be3b2cc13bf', 'f5a0cfaf-8e36-11f1-8c8a-e0d55e1980d1', '2026-08-02 11:56:52.554'),
('27a3620d-879e-409c-8fc8-3be3b2cc13bf', 'f5a0cfe5-8e36-11f1-8c8a-e0d55e1980d1', '2026-08-02 11:56:52.554'),
('27a3620d-879e-409c-8fc8-3be3b2cc13bf', 'f5a0d018-8e36-11f1-8c8a-e0d55e1980d1', '2026-08-02 11:56:52.554'),
('27a3620d-879e-409c-8fc8-3be3b2cc13bf', 'f5a0d067-8e36-11f1-8c8a-e0d55e1980d1', '2026-08-02 11:56:52.554'),
('27a3620d-879e-409c-8fc8-3be3b2cc13bf', 'f5a0d0a0-8e36-11f1-8c8a-e0d55e1980d1', '2026-08-02 11:56:52.554'),
('27a3620d-879e-409c-8fc8-3be3b2cc13bf', 'f5a0d0d6-8e36-11f1-8c8a-e0d55e1980d1', '2026-08-02 11:56:52.554'),
('27a3620d-879e-409c-8fc8-3be3b2cc13bf', 'f5a0d10d-8e36-11f1-8c8a-e0d55e1980d1', '2026-08-02 11:56:52.554'),
('27a3620d-879e-409c-8fc8-3be3b2cc13bf', 'ff398c91-94cf-4269-aa25-e3e110ec9ceb', '2026-07-22 10:01:21.479'),
('3906db5a-acaf-4320-af95-841ba136b82a', '381aba67-f49b-4901-a027-d1a8fe7d6c54', '2026-07-23 12:01:54.119'),
('3906db5a-acaf-4320-af95-841ba136b82a', '448b2a09-bbfe-43cf-bca4-a72ddedf3c1b', '2026-07-23 12:01:54.090'),
('3906db5a-acaf-4320-af95-841ba136b82a', '4c296bac-2de0-493c-9ef8-747480106b1f', '2026-07-23 12:01:54.168'),
('3906db5a-acaf-4320-af95-841ba136b82a', '8ff136e7-703b-433c-8d7e-83bed5e39fc9', '2026-07-23 12:01:54.133'),
('3906db5a-acaf-4320-af95-841ba136b82a', 'd8c31fac-a306-4a98-9539-ba3e784a646c', '2026-07-23 12:01:54.059'),
('3906db5a-acaf-4320-af95-841ba136b82a', 'df8f70b8-dc68-43ca-ae3e-4d724749bd12', '2026-07-23 12:01:54.161'),
('3906db5a-acaf-4320-af95-841ba136b82a', 'e84ee5bc-868a-11f1-bcd6-e0d55e1980d1', '2026-07-23 12:01:54.185'),
('3906db5a-acaf-4320-af95-841ba136b82a', 'e84f22e3-868a-11f1-bcd6-e0d55e1980d1', '2026-07-23 12:01:54.208'),
('3906db5a-acaf-4320-af95-841ba136b82a', 'f5a0654b-8e36-11f1-8c8a-e0d55e1980d1', '2026-08-02 11:56:52.554'),
('3906db5a-acaf-4320-af95-841ba136b82a', 'f5a0cced-8e36-11f1-8c8a-e0d55e1980d1', '2026-08-02 11:56:52.554'),
('3906db5a-acaf-4320-af95-841ba136b82a', 'ff398c91-94cf-4269-aa25-e3e110ec9ceb', '2026-07-23 12:01:54.149'),
('4181ae83-e64c-4643-9eb8-91674a83d259', 'c617a76f-9493-11f1-9814-e0d55e1980d1', '2026-08-10 09:28:34.847'),
('4181ae83-e64c-4643-9eb8-91674a83d259', 'c617c238-9493-11f1-9814-e0d55e1980d1', '2026-08-10 09:28:34.847'),
('4181ae83-e64c-4643-9eb8-91674a83d259', 'c617c363-9493-11f1-9814-e0d55e1980d1', '2026-08-10 09:28:34.847'),
('4181ae83-e64c-4643-9eb8-91674a83d259', 'c617c3ef-9493-11f1-9814-e0d55e1980d1', '2026-08-10 09:28:34.847'),
('4181ae83-e64c-4643-9eb8-91674a83d259', 'c617c472-9493-11f1-9814-e0d55e1980d1', '2026-08-10 09:28:34.847'),
('4181ae83-e64c-4643-9eb8-91674a83d259', 'c617c4f4-9493-11f1-9814-e0d55e1980d1', '2026-08-10 09:28:34.847'),
('4181ae83-e64c-4643-9eb8-91674a83d259', 'c617c581-9493-11f1-9814-e0d55e1980d1', '2026-08-10 09:28:34.847'),
('4181ae83-e64c-4643-9eb8-91674a83d259', 'c617c61e-9493-11f1-9814-e0d55e1980d1', '2026-08-10 09:28:34.847'),
('4181ae83-e64c-4643-9eb8-91674a83d259', 'c617c6ec-9493-11f1-9814-e0d55e1980d1', '2026-08-10 09:28:34.847'),
('4181ae83-e64c-4643-9eb8-91674a83d259', 'c617c78c-9493-11f1-9814-e0d55e1980d1', '2026-08-10 09:28:34.847'),
('4181ae83-e64c-4643-9eb8-91674a83d259', 'c617c81c-9493-11f1-9814-e0d55e1980d1', '2026-08-10 09:28:34.847'),
('4181ae83-e64c-4643-9eb8-91674a83d259', 'c617c8ac-9493-11f1-9814-e0d55e1980d1', '2026-08-10 09:28:34.847'),
('4181ae83-e64c-4643-9eb8-91674a83d259', 'c617c938-9493-11f1-9814-e0d55e1980d1', '2026-08-10 09:28:34.847'),
('4181ae83-e64c-4643-9eb8-91674a83d259', 'c617c9c0-9493-11f1-9814-e0d55e1980d1', '2026-08-10 09:28:34.847'),
('4181ae83-e64c-4643-9eb8-91674a83d259', 'c617ca28-9493-11f1-9814-e0d55e1980d1', '2026-08-10 09:28:34.847'),
('5ac077bc-2057-4588-a302-9a93c84f6b6b', '02ca36e9-5174-425e-85c4-7e8d2a1474c6', '2026-08-02 08:57:24.142'),
('5ac077bc-2057-4588-a302-9a93c84f6b6b', '0b80ebe5-f071-4ce5-92d3-70b27cbc1c92', '2026-08-02 08:57:24.142'),
('5ac077bc-2057-4588-a302-9a93c84f6b6b', '1537989d-15fd-46eb-a768-13c916c674cb', '2026-08-02 08:57:24.142'),
('5ac077bc-2057-4588-a302-9a93c84f6b6b', '1dfecfbe-8cbf-4750-ae6d-589aff673c28', '2026-08-02 08:57:24.142'),
('5ac077bc-2057-4588-a302-9a93c84f6b6b', '215aa547-335c-4012-9405-b4a72e182491', '2026-08-02 08:57:24.142'),
('5ac077bc-2057-4588-a302-9a93c84f6b6b', '25fe42ea-7834-45a5-87e8-d0fe547bc485', '2026-08-02 08:57:24.142'),
('5ac077bc-2057-4588-a302-9a93c84f6b6b', '276b9798-3576-4eeb-b2db-3727e8ad5838', '2026-08-02 08:57:24.142'),
('5ac077bc-2057-4588-a302-9a93c84f6b6b', '381aba67-f49b-4901-a027-d1a8fe7d6c54', '2026-08-02 08:57:24.142'),
('5ac077bc-2057-4588-a302-9a93c84f6b6b', '39d3fdeb-da0e-4f39-8945-37ba241cee7e', '2026-08-02 08:57:24.142'),
('5ac077bc-2057-4588-a302-9a93c84f6b6b', '3a139dd4-6cf9-4dd6-aa95-900cb958083a', '2026-08-02 08:57:24.142'),
('5ac077bc-2057-4588-a302-9a93c84f6b6b', '3bcad8d4-3a88-40cd-bc2e-956aab886503', '2026-08-02 08:57:24.142'),
('5ac077bc-2057-4588-a302-9a93c84f6b6b', '448b2a09-bbfe-43cf-bca4-a72ddedf3c1b', '2026-08-02 08:57:24.142'),
('5ac077bc-2057-4588-a302-9a93c84f6b6b', '45478f1b-76b9-40cc-90e9-a5b03a9d036f', '2026-08-02 08:57:24.142'),
('5ac077bc-2057-4588-a302-9a93c84f6b6b', '4773f3c3-80dc-4dc6-90c4-8bde459241b9', '2026-08-02 08:57:24.142'),
('5ac077bc-2057-4588-a302-9a93c84f6b6b', '4bb9a273-8c49-4bec-b021-83fb1af72675', '2026-08-02 08:57:24.142'),
('5ac077bc-2057-4588-a302-9a93c84f6b6b', '4c296bac-2de0-493c-9ef8-747480106b1f', '2026-08-02 08:57:24.142'),
('5ac077bc-2057-4588-a302-9a93c84f6b6b', '4d82828b-1035-4e39-8ea2-d344d50a50eb', '2026-08-02 08:57:24.142'),
('5ac077bc-2057-4588-a302-9a93c84f6b6b', '583532a4-453e-4c83-b084-3ee3d0cc04fe', '2026-08-02 08:57:24.142'),
('5ac077bc-2057-4588-a302-9a93c84f6b6b', '5e51c1d5-8ea5-4fc9-b3d1-ea4ee59f4c1b', '2026-08-02 08:57:24.142'),
('5ac077bc-2057-4588-a302-9a93c84f6b6b', '68e905d7-04c4-45a0-9cca-023bdd350358', '2026-08-02 08:57:24.142'),
('5ac077bc-2057-4588-a302-9a93c84f6b6b', '78cbd57a-a423-4308-bbd0-7810192a99e3', '2026-08-02 08:57:24.142'),
('5ac077bc-2057-4588-a302-9a93c84f6b6b', '819c2306-c580-4531-becc-5f536462ccbc', '2026-08-02 08:57:24.142'),
('5ac077bc-2057-4588-a302-9a93c84f6b6b', '90ea956a-e7ae-4cc2-8c33-4e0a4865208a', '2026-08-02 08:57:24.142'),
('5ac077bc-2057-4588-a302-9a93c84f6b6b', '98607e47-dae2-450b-8d45-87d1016b45fc', '2026-08-02 08:57:24.142'),
('5ac077bc-2057-4588-a302-9a93c84f6b6b', 'ad591a26-ea40-43ed-a6a6-38398bc35706', '2026-08-02 08:57:24.142'),
('5ac077bc-2057-4588-a302-9a93c84f6b6b', 'b52689af-76aa-4e29-9c82-679abfa7c6a8', '2026-08-02 08:57:24.142'),
('5ac077bc-2057-4588-a302-9a93c84f6b6b', 'bef71310-211c-4c9b-ac51-0f344fd17200', '2026-08-02 08:57:24.142'),
('5ac077bc-2057-4588-a302-9a93c84f6b6b', 'c1fc5d73-7938-4693-bdf8-0b5103c84463', '2026-08-02 08:57:24.142'),
('5ac077bc-2057-4588-a302-9a93c84f6b6b', 'c617a76f-9493-11f1-9814-e0d55e1980d1', '2026-08-10 14:16:22.000'),
('5ac077bc-2057-4588-a302-9a93c84f6b6b', 'c617c238-9493-11f1-9814-e0d55e1980d1', '2026-08-10 14:16:22.000'),
('5ac077bc-2057-4588-a302-9a93c84f6b6b', 'c617c363-9493-11f1-9814-e0d55e1980d1', '2026-08-10 14:16:22.000'),
('5ac077bc-2057-4588-a302-9a93c84f6b6b', 'c617c3ef-9493-11f1-9814-e0d55e1980d1', '2026-08-10 14:16:22.000'),
('5ac077bc-2057-4588-a302-9a93c84f6b6b', 'c617c472-9493-11f1-9814-e0d55e1980d1', '2026-08-10 14:16:22.000'),
('5ac077bc-2057-4588-a302-9a93c84f6b6b', 'c617c4f4-9493-11f1-9814-e0d55e1980d1', '2026-08-10 14:16:22.000'),
('5ac077bc-2057-4588-a302-9a93c84f6b6b', 'c617c581-9493-11f1-9814-e0d55e1980d1', '2026-08-10 14:16:22.000'),
('5ac077bc-2057-4588-a302-9a93c84f6b6b', 'c617c61e-9493-11f1-9814-e0d55e1980d1', '2026-08-10 14:16:22.000'),
('5ac077bc-2057-4588-a302-9a93c84f6b6b', 'c617c6ec-9493-11f1-9814-e0d55e1980d1', '2026-08-10 14:16:22.000'),
('5ac077bc-2057-4588-a302-9a93c84f6b6b', 'c617c78c-9493-11f1-9814-e0d55e1980d1', '2026-08-10 14:16:22.000'),
('5ac077bc-2057-4588-a302-9a93c84f6b6b', 'c617c81c-9493-11f1-9814-e0d55e1980d1', '2026-08-10 14:16:22.000'),
('5ac077bc-2057-4588-a302-9a93c84f6b6b', 'c617c8ac-9493-11f1-9814-e0d55e1980d1', '2026-08-10 14:16:22.000'),
('5ac077bc-2057-4588-a302-9a93c84f6b6b', 'c617c938-9493-11f1-9814-e0d55e1980d1', '2026-08-10 14:16:22.000'),
('5ac077bc-2057-4588-a302-9a93c84f6b6b', 'c617c9c0-9493-11f1-9814-e0d55e1980d1', '2026-08-10 14:16:22.000'),
('5ac077bc-2057-4588-a302-9a93c84f6b6b', 'c617ca28-9493-11f1-9814-e0d55e1980d1', '2026-08-10 14:16:22.000'),
('5ac077bc-2057-4588-a302-9a93c84f6b6b', 'd3f921b8-57e1-4a52-893c-604c64087b81', '2026-08-02 08:57:24.142'),
('5ac077bc-2057-4588-a302-9a93c84f6b6b', 'd49cfe03-8671-4426-bb6c-63567ffb33d2', '2026-08-02 08:57:24.142'),
('5ac077bc-2057-4588-a302-9a93c84f6b6b', 'd8c31fac-a306-4a98-9539-ba3e784a646c', '2026-08-02 08:57:24.142'),
('5ac077bc-2057-4588-a302-9a93c84f6b6b', 'df663955-5778-4032-b718-9045ed14e981', '2026-08-02 08:57:24.142'),
('5ac077bc-2057-4588-a302-9a93c84f6b6b', 'df8f70b8-dc68-43ca-ae3e-4d724749bd12', '2026-08-02 08:57:24.142'),
('5ac077bc-2057-4588-a302-9a93c84f6b6b', 'e13d27dd-2cba-411e-8132-e24a2a18a223', '2026-08-02 08:57:24.142'),
('5ac077bc-2057-4588-a302-9a93c84f6b6b', 'e84ee5bc-868a-11f1-bcd6-e0d55e1980d1', '2026-08-02 08:57:24.142'),
('5ac077bc-2057-4588-a302-9a93c84f6b6b', 'e84f22e3-868a-11f1-bcd6-e0d55e1980d1', '2026-08-02 08:57:24.142'),
('5ac077bc-2057-4588-a302-9a93c84f6b6b', 'f5a0654b-8e36-11f1-8c8a-e0d55e1980d1', '2026-08-02 08:57:24.142'),
('5ac077bc-2057-4588-a302-9a93c84f6b6b', 'f5a0cced-8e36-11f1-8c8a-e0d55e1980d1', '2026-08-02 08:57:24.142'),
('5ac077bc-2057-4588-a302-9a93c84f6b6b', 'f5a0cd9a-8e36-11f1-8c8a-e0d55e1980d1', '2026-08-02 08:57:24.142'),
('5ac077bc-2057-4588-a302-9a93c84f6b6b', 'f5a0cdda-8e36-11f1-8c8a-e0d55e1980d1', '2026-08-02 08:57:24.142'),
('5ac077bc-2057-4588-a302-9a93c84f6b6b', 'f5a0ce11-8e36-11f1-8c8a-e0d55e1980d1', '2026-08-02 08:57:24.142'),
('5ac077bc-2057-4588-a302-9a93c84f6b6b', 'f5a0ce48-8e36-11f1-8c8a-e0d55e1980d1', '2026-08-02 08:57:24.142'),
('5ac077bc-2057-4588-a302-9a93c84f6b6b', 'f5a0ceaa-8e36-11f1-8c8a-e0d55e1980d1', '2026-08-02 08:57:24.142'),
('5ac077bc-2057-4588-a302-9a93c84f6b6b', 'f5a0cee0-8e36-11f1-8c8a-e0d55e1980d1', '2026-08-02 08:57:24.142'),
('5ac077bc-2057-4588-a302-9a93c84f6b6b', 'f5a0cf14-8e36-11f1-8c8a-e0d55e1980d1', '2026-08-02 08:57:24.142'),
('5ac077bc-2057-4588-a302-9a93c84f6b6b', 'f5a0cf4d-8e36-11f1-8c8a-e0d55e1980d1', '2026-08-02 08:57:24.142'),
('5ac077bc-2057-4588-a302-9a93c84f6b6b', 'f5a0cf7f-8e36-11f1-8c8a-e0d55e1980d1', '2026-08-02 08:57:24.142'),
('5ac077bc-2057-4588-a302-9a93c84f6b6b', 'f5a0cfaf-8e36-11f1-8c8a-e0d55e1980d1', '2026-08-02 08:57:24.142'),
('5ac077bc-2057-4588-a302-9a93c84f6b6b', 'f5a0cfe5-8e36-11f1-8c8a-e0d55e1980d1', '2026-08-02 08:57:24.142'),
('5ac077bc-2057-4588-a302-9a93c84f6b6b', 'f5a0d018-8e36-11f1-8c8a-e0d55e1980d1', '2026-08-02 08:57:24.142'),
('5ac077bc-2057-4588-a302-9a93c84f6b6b', 'f5a0d067-8e36-11f1-8c8a-e0d55e1980d1', '2026-08-02 08:57:24.142'),
('5ac077bc-2057-4588-a302-9a93c84f6b6b', 'f5a0d0a0-8e36-11f1-8c8a-e0d55e1980d1', '2026-08-02 08:57:24.142'),
('5ac077bc-2057-4588-a302-9a93c84f6b6b', 'f5a0d0d6-8e36-11f1-8c8a-e0d55e1980d1', '2026-08-02 08:57:24.142'),
('5ac077bc-2057-4588-a302-9a93c84f6b6b', 'f5a0d10d-8e36-11f1-8c8a-e0d55e1980d1', '2026-08-02 08:57:24.142'),
('5ac077bc-2057-4588-a302-9a93c84f6b6b', 'ff398c91-94cf-4269-aa25-e3e110ec9ceb', '2026-08-02 08:57:24.142'),
('8718c924-8bd7-49ca-8ef8-7022d668b826', '0b80ebe5-f071-4ce5-92d3-70b27cbc1c92', '2026-08-10 10:05:45.894'),
('8718c924-8bd7-49ca-8ef8-7022d668b826', '448b2a09-bbfe-43cf-bca4-a72ddedf3c1b', '2026-08-10 10:05:45.894'),
('8718c924-8bd7-49ca-8ef8-7022d668b826', '4773f3c3-80dc-4dc6-90c4-8bde459241b9', '2026-08-10 10:05:45.894'),
('8718c924-8bd7-49ca-8ef8-7022d668b826', '4bb9a273-8c49-4bec-b021-83fb1af72675', '2026-08-10 10:05:45.894'),
('8718c924-8bd7-49ca-8ef8-7022d668b826', '5e51c1d5-8ea5-4fc9-b3d1-ea4ee59f4c1b', '2026-08-10 10:05:45.894'),
('8718c924-8bd7-49ca-8ef8-7022d668b826', '68e905d7-04c4-45a0-9cca-023bdd350358', '2026-08-10 10:05:45.894'),
('8718c924-8bd7-49ca-8ef8-7022d668b826', '819c2306-c580-4531-becc-5f536462ccbc', '2026-08-10 10:05:45.894'),
('8718c924-8bd7-49ca-8ef8-7022d668b826', '8ff136e7-703b-433c-8d7e-83bed5e39fc9', '2026-08-10 10:05:45.894'),
('8718c924-8bd7-49ca-8ef8-7022d668b826', '90ea956a-e7ae-4cc2-8c33-4e0a4865208a', '2026-08-10 10:05:45.894'),
('8718c924-8bd7-49ca-8ef8-7022d668b826', '98607e47-dae2-450b-8d45-87d1016b45fc', '2026-08-10 10:05:45.894'),
('8718c924-8bd7-49ca-8ef8-7022d668b826', 'c1fc5d73-7938-4693-bdf8-0b5103c84463', '2026-08-10 10:05:45.894'),
('8718c924-8bd7-49ca-8ef8-7022d668b826', 'd3f921b8-57e1-4a52-893c-604c64087b81', '2026-08-10 10:05:45.894'),
('8718c924-8bd7-49ca-8ef8-7022d668b826', 'd8c31fac-a306-4a98-9539-ba3e784a646c', '2026-08-10 10:05:45.894'),
('8718c924-8bd7-49ca-8ef8-7022d668b826', 'df663955-5778-4032-b718-9045ed14e981', '2026-08-10 10:05:45.894'),
('8718c924-8bd7-49ca-8ef8-7022d668b826', 'df8f70b8-dc68-43ca-ae3e-4d724749bd12', '2026-08-10 10:05:45.894'),
('8718c924-8bd7-49ca-8ef8-7022d668b826', 'e13d27dd-2cba-411e-8132-e24a2a18a223', '2026-08-10 10:05:45.894'),
('8718c924-8bd7-49ca-8ef8-7022d668b826', 'e84ee5bc-868a-11f1-bcd6-e0d55e1980d1', '2026-08-10 10:05:45.894'),
('8718c924-8bd7-49ca-8ef8-7022d668b826', 'f5a0654b-8e36-11f1-8c8a-e0d55e1980d1', '2026-08-10 10:05:45.894'),
('8718c924-8bd7-49ca-8ef8-7022d668b826', 'f5a0cd9a-8e36-11f1-8c8a-e0d55e1980d1', '2026-08-10 10:05:45.894'),
('8718c924-8bd7-49ca-8ef8-7022d668b826', 'f5a0ce11-8e36-11f1-8c8a-e0d55e1980d1', '2026-08-10 10:05:45.894'),
('8718c924-8bd7-49ca-8ef8-7022d668b826', 'f5a0ceaa-8e36-11f1-8c8a-e0d55e1980d1', '2026-08-10 10:05:45.894'),
('8718c924-8bd7-49ca-8ef8-7022d668b826', 'f5a0cf14-8e36-11f1-8c8a-e0d55e1980d1', '2026-08-10 10:05:45.894'),
('8718c924-8bd7-49ca-8ef8-7022d668b826', 'f5a0cf7f-8e36-11f1-8c8a-e0d55e1980d1', '2026-08-10 10:05:45.894'),
('8718c924-8bd7-49ca-8ef8-7022d668b826', 'f5a0cfaf-8e36-11f1-8c8a-e0d55e1980d1', '2026-08-10 10:05:45.894'),
('8718c924-8bd7-49ca-8ef8-7022d668b826', 'f5a0cfe5-8e36-11f1-8c8a-e0d55e1980d1', '2026-08-10 10:05:45.894'),
('8718c924-8bd7-49ca-8ef8-7022d668b826', 'f5a0d067-8e36-11f1-8c8a-e0d55e1980d1', '2026-08-10 10:05:45.894'),
('8718c924-8bd7-49ca-8ef8-7022d668b826', 'f5a0d0a0-8e36-11f1-8c8a-e0d55e1980d1', '2026-08-10 10:05:45.894'),
('8718c924-8bd7-49ca-8ef8-7022d668b826', 'f5a0d0d6-8e36-11f1-8c8a-e0d55e1980d1', '2026-08-10 10:05:45.894'),
('8718c924-8bd7-49ca-8ef8-7022d668b826', 'f5a0d10d-8e36-11f1-8c8a-e0d55e1980d1', '2026-08-10 10:05:45.894'),
('9ce2211c-729c-4dda-bed6-8fb76b417bad', 'f5a0d0a0-8e36-11f1-8c8a-e0d55e1980d1', '2026-08-10 08:06:00.536'),
('e52062de-5306-4aa3-a78f-368adbd05b84', 'f5a0cfe5-8e36-11f1-8c8a-e0d55e1980d1', '2026-08-02 06:03:57.151'),
('e52062de-5306-4aa3-a78f-368adbd05b84', 'f5a0d10d-8e36-11f1-8c8a-e0d55e1980d1', '2026-08-02 06:03:57.151'),
('f017bebf-942a-4d49-b333-ee32d542fc48', '215aa547-335c-4012-9405-b4a72e182491', '2026-08-10 10:54:53.421'),
('f017bebf-942a-4d49-b333-ee32d542fc48', '25fe42ea-7834-45a5-87e8-d0fe547bc485', '2026-08-10 10:54:53.421'),
('f017bebf-942a-4d49-b333-ee32d542fc48', '3a139dd4-6cf9-4dd6-aa95-900cb958083a', '2026-08-10 10:54:53.421'),
('f017bebf-942a-4d49-b333-ee32d542fc48', '3bcad8d4-3a88-40cd-bc2e-956aab886503', '2026-08-10 10:54:53.421'),
('f017bebf-942a-4d49-b333-ee32d542fc48', '448b2a09-bbfe-43cf-bca4-a72ddedf3c1b', '2026-08-10 10:54:53.421'),
('f017bebf-942a-4d49-b333-ee32d542fc48', '45478f1b-76b9-40cc-90e9-a5b03a9d036f', '2026-08-10 10:54:53.421'),
('f017bebf-942a-4d49-b333-ee32d542fc48', '4bb9a273-8c49-4bec-b021-83fb1af72675', '2026-08-10 10:54:53.421'),
('f017bebf-942a-4d49-b333-ee32d542fc48', '4c296bac-2de0-493c-9ef8-747480106b1f', '2026-08-10 10:54:53.421'),
('f017bebf-942a-4d49-b333-ee32d542fc48', '68e905d7-04c4-45a0-9cca-023bdd350358', '2026-08-10 10:54:53.421'),
('f017bebf-942a-4d49-b333-ee32d542fc48', 'd8c31fac-a306-4a98-9539-ba3e784a646c', '2026-08-10 10:54:53.421'),
('f017bebf-942a-4d49-b333-ee32d542fc48', 'df8f70b8-dc68-43ca-ae3e-4d724749bd12', '2026-08-10 10:54:53.421'),
('f017bebf-942a-4d49-b333-ee32d542fc48', 'e84ee5bc-868a-11f1-bcd6-e0d55e1980d1', '2026-08-10 10:54:53.421'),
('f017bebf-942a-4d49-b333-ee32d542fc48', 'e84f22e3-868a-11f1-bcd6-e0d55e1980d1', '2026-08-10 10:54:53.421'),
('f2e9ecb5-c773-42f1-887c-30a07b6afe12', 'f5a0d0d6-8e36-11f1-8c8a-e0d55e1980d1', '2026-08-02 11:56:52.554'),
('f636973a-29d1-45ba-b7d8-516a346d77dc', '1537989d-15fd-46eb-a768-13c916c674cb', '2026-07-23 12:01:54.497'),
('f636973a-29d1-45ba-b7d8-516a346d77dc', '215aa547-335c-4012-9405-b4a72e182491', '2026-07-23 12:01:54.505'),
('f636973a-29d1-45ba-b7d8-516a346d77dc', '25fe42ea-7834-45a5-87e8-d0fe547bc485', '2026-07-23 12:01:54.510'),
('f636973a-29d1-45ba-b7d8-516a346d77dc', '4c296bac-2de0-493c-9ef8-747480106b1f', '2026-07-23 12:01:54.517'),
('f636973a-29d1-45ba-b7d8-516a346d77dc', '68e905d7-04c4-45a0-9cca-023bdd350358', '2026-07-23 12:01:54.501'),
('f636973a-29d1-45ba-b7d8-516a346d77dc', 'c1fc5d73-7938-4693-bdf8-0b5103c84463', '2026-07-23 12:01:54.494'),
('f636973a-29d1-45ba-b7d8-516a346d77dc', 'd8c31fac-a306-4a98-9539-ba3e784a646c', '2026-07-23 12:01:54.481'),
('f636973a-29d1-45ba-b7d8-516a346d77dc', 'df8f70b8-dc68-43ca-ae3e-4d724749bd12', '2026-07-23 12:01:54.514'),
('f636973a-29d1-45ba-b7d8-516a346d77dc', 'e84ee5bc-868a-11f1-bcd6-e0d55e1980d1', '2026-07-23 12:01:54.528'),
('f636973a-29d1-45ba-b7d8-516a346d77dc', 'e84f22e3-868a-11f1-bcd6-e0d55e1980d1', '2026-07-23 12:01:54.532'),
('f636973a-29d1-45ba-b7d8-516a346d77dc', 'f5a0cd9a-8e36-11f1-8c8a-e0d55e1980d1', '2026-08-02 11:56:52.554'),
('f636973a-29d1-45ba-b7d8-516a346d77dc', 'f5a0cdda-8e36-11f1-8c8a-e0d55e1980d1', '2026-08-02 11:56:52.554'),
('f636973a-29d1-45ba-b7d8-516a346d77dc', 'f5a0ce11-8e36-11f1-8c8a-e0d55e1980d1', '2026-08-02 11:56:52.554'),
('f636973a-29d1-45ba-b7d8-516a346d77dc', 'f5a0ce48-8e36-11f1-8c8a-e0d55e1980d1', '2026-08-02 11:56:52.554'),
('f636973a-29d1-45ba-b7d8-516a346d77dc', 'f5a0ceaa-8e36-11f1-8c8a-e0d55e1980d1', '2026-08-02 11:56:52.554'),
('f636973a-29d1-45ba-b7d8-516a346d77dc', 'f5a0cee0-8e36-11f1-8c8a-e0d55e1980d1', '2026-08-02 11:56:52.554'),
('f636973a-29d1-45ba-b7d8-516a346d77dc', 'f5a0cfe5-8e36-11f1-8c8a-e0d55e1980d1', '2026-08-02 11:56:52.554'),
('f636973a-29d1-45ba-b7d8-516a346d77dc', 'f5a0d018-8e36-11f1-8c8a-e0d55e1980d1', '2026-08-02 11:56:52.554');

-- --------------------------------------------------------

--
-- Table structure for table `rooms`
--

CREATE TABLE `rooms` (
  `id` varchar(191) NOT NULL,
  `school_id` varchar(191) NOT NULL,
  `name` varchar(191) NOT NULL,
  `code` varchar(191) NOT NULL,
  `capacity` int(11) NOT NULL DEFAULT 40,
  `location` varchar(191) DEFAULT NULL,
  `status` enum('ACTIVE','INACTIVE','SUSPENDED','PENDING') NOT NULL DEFAULT 'ACTIVE',
  `created_at` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updated_at` datetime(3) NOT NULL,
  `deleted_at` datetime(3) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `rooms`
--

INSERT INTO `rooms` (`id`, `school_id`, `name`, `code`, `capacity`, `location`, `status`, `created_at`, `updated_at`, `deleted_at`) VALUES
('demo-room-201', '7b2b510e-dab0-4f0f-9aae-f1d27c9de59c', 'Room 201', 'R201', 40, 'Second Floor', 'ACTIVE', '2026-08-02 08:11:08.298', '2026-08-02 08:57:55.640', NULL),
('demo-room-lab', '7b2b510e-dab0-4f0f-9aae-f1d27c9de59c', 'Science Lab', 'LAB1', 32, 'Third Floor', 'ACTIVE', '2026-08-02 08:11:08.334', '2026-08-02 08:57:55.646', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `routines`
--

CREATE TABLE `routines` (
  `id` varchar(191) NOT NULL,
  `class_id` varchar(191) NOT NULL,
  `section_id` varchar(191) NOT NULL,
  `subject_id` varchar(191) NOT NULL,
  `teacher_id` varchar(191) NOT NULL,
  `day_of_week` varchar(191) NOT NULL,
  `start_time` varchar(191) NOT NULL,
  `end_time` varchar(191) NOT NULL,
  `room_no` varchar(191) DEFAULT NULL,
  `created_at` datetime(3) NOT NULL DEFAULT current_timestamp(3)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `routines`
--

INSERT INTO `routines` (`id`, `class_id`, `section_id`, `subject_id`, `teacher_id`, `day_of_week`, `start_time`, `end_time`, `room_no`, `created_at`) VALUES
('demo-routine-0-0', 'demo-class-6', 'demo-section-6-1', 'demo-subject-ban', 'demo-teacher-1', 'SUNDAY', '08:00', '08:45', 'Room 201', '2026-08-02 08:11:11.261'),
('demo-routine-0-1', 'demo-class-7', 'demo-section-7-1', 'demo-subject-eng', 'demo-teacher-2', 'SUNDAY', '08:45', '09:30', 'Science Lab', '2026-08-02 08:11:11.274'),
('demo-routine-0-2', 'demo-class-8', 'demo-section-8-1', 'demo-subject-mat', 'demo-teacher-3', 'SUNDAY', '09:45', '10:30', 'Room 201', '2026-08-02 08:11:11.280'),
('demo-routine-0-3', 'demo-class-9', 'demo-section-9-1', 'demo-subject-sci', 'demo-teacher-4', 'SUNDAY', '10:30', '11:15', 'Science Lab', '2026-08-02 08:11:11.286'),
('demo-routine-1-0', 'demo-class-7', 'demo-section-7-1', 'demo-subject-ban', 'demo-teacher-1', 'MONDAY', '08:00', '08:45', 'Room 201', '2026-08-02 08:11:11.291'),
('demo-routine-1-1', 'demo-class-8', 'demo-section-8-1', 'demo-subject-eng', 'demo-teacher-2', 'MONDAY', '08:45', '09:30', 'Science Lab', '2026-08-02 08:11:11.297'),
('demo-routine-1-2', 'demo-class-9', 'demo-section-9-1', 'demo-subject-mat', 'demo-teacher-3', 'MONDAY', '09:45', '10:30', 'Room 201', '2026-08-02 08:11:11.302'),
('demo-routine-1-3', 'demo-class-10', 'demo-section-10-1', 'demo-subject-sci', 'demo-teacher-4', 'MONDAY', '10:30', '11:15', 'Science Lab', '2026-08-02 08:11:11.307'),
('demo-routine-2-0', 'demo-class-8', 'demo-section-8-1', 'demo-subject-ban', 'demo-teacher-1', 'TUESDAY', '08:00', '08:45', 'Room 201', '2026-08-02 08:11:11.313'),
('demo-routine-2-1', 'demo-class-9', 'demo-section-9-1', 'demo-subject-eng', 'demo-teacher-2', 'TUESDAY', '08:45', '09:30', 'Science Lab', '2026-08-02 08:11:11.318'),
('demo-routine-2-2', 'demo-class-10', 'demo-section-10-1', 'demo-subject-mat', 'demo-teacher-3', 'TUESDAY', '09:45', '10:30', 'Room 201', '2026-08-02 08:11:11.323'),
('demo-routine-2-3', 'demo-class-6', 'demo-section-6-1', 'demo-subject-sci', 'demo-teacher-4', 'TUESDAY', '10:30', '11:15', 'Science Lab', '2026-08-02 08:11:11.329'),
('demo-routine-3-0', 'demo-class-9', 'demo-section-9-1', 'demo-subject-ban', 'demo-teacher-1', 'WEDNESDAY', '08:00', '08:45', 'Room 201', '2026-08-02 08:11:11.334'),
('demo-routine-3-1', 'demo-class-10', 'demo-section-10-1', 'demo-subject-eng', 'demo-teacher-2', 'WEDNESDAY', '08:45', '09:30', 'Science Lab', '2026-08-02 08:11:11.339'),
('demo-routine-3-2', 'demo-class-6', 'demo-section-6-1', 'demo-subject-mat', 'demo-teacher-3', 'WEDNESDAY', '09:45', '10:30', 'Room 201', '2026-08-02 08:11:11.345'),
('demo-routine-3-3', 'demo-class-7', 'demo-section-7-1', 'demo-subject-sci', 'demo-teacher-4', 'WEDNESDAY', '10:30', '11:15', 'Science Lab', '2026-08-02 08:11:11.350'),
('demo-routine-4-0', 'demo-class-10', 'demo-section-10-1', 'demo-subject-ban', 'demo-teacher-1', 'THURSDAY', '08:00', '08:45', 'Room 201', '2026-08-02 08:11:11.355'),
('demo-routine-4-1', 'demo-class-6', 'demo-section-6-1', 'demo-subject-eng', 'demo-teacher-2', 'THURSDAY', '08:45', '09:30', 'Science Lab', '2026-08-02 08:11:11.361'),
('demo-routine-4-2', 'demo-class-7', 'demo-section-7-1', 'demo-subject-mat', 'demo-teacher-3', 'THURSDAY', '09:45', '10:30', 'Room 201', '2026-08-02 08:11:11.366'),
('demo-routine-4-3', 'demo-class-8', 'demo-section-8-1', 'demo-subject-sci', 'demo-teacher-4', 'THURSDAY', '10:30', '11:15', 'Science Lab', '2026-08-02 08:11:11.371');

-- --------------------------------------------------------

--
-- Table structure for table `routine_versions`
--

CREATE TABLE `routine_versions` (
  `id` varchar(191) NOT NULL,
  `school_id` varchar(191) NOT NULL,
  `academic_year_id` varchar(191) NOT NULL,
  `class_id` varchar(191) NOT NULL,
  `section_id` varchar(191) NOT NULL,
  `version_number` int(11) NOT NULL,
  `change_summary` varchar(191) DEFAULT NULL,
  `routine_snapshot` text NOT NULL,
  `created_by` varchar(191) DEFAULT NULL,
  `created_at` datetime(3) NOT NULL DEFAULT current_timestamp(3)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `salary_components`
--

CREATE TABLE `salary_components` (
  `id` varchar(191) NOT NULL,
  `salary_structure_id` varchar(191) NOT NULL,
  `name` varchar(191) NOT NULL,
  `type` varchar(191) NOT NULL,
  `component_type` varchar(191) NOT NULL,
  `amount_type` varchar(191) NOT NULL,
  `amount` decimal(10,2) NOT NULL,
  `percentage_base` varchar(191) DEFAULT NULL,
  `is_taxable` tinyint(1) NOT NULL DEFAULT 1,
  `is_active` tinyint(1) NOT NULL DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `salary_components`
--

INSERT INTO `salary_components` (`id`, `salary_structure_id`, `name`, `type`, `component_type`, `amount_type`, `amount`, `percentage_base`, `is_taxable`, `is_active`) VALUES
('44e40ec6-290b-42f9-bff4-bd25e81da117', '75e79342-242f-4d24-9db0-3ff5ab6cdd46', 'Basic Salary', 'EARNING', 'Basic Salary', 'FIXED', 50000.00, NULL, 1, 1);

-- --------------------------------------------------------

--
-- Table structure for table `salary_payments`
--

CREATE TABLE `salary_payments` (
  `id` varchar(191) NOT NULL,
  `payroll_id` varchar(191) NOT NULL,
  `amount` decimal(10,2) NOT NULL,
  `payment_method` varchar(191) NOT NULL,
  `transaction_ref` varchar(191) DEFAULT NULL,
  `payment_date` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `processed_by_id` varchar(191) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `salary_payments`
--

INSERT INTO `salary_payments` (`id`, `payroll_id`, `amount`, `payment_method`, `transaction_ref`, `payment_date`, `processed_by_id`) VALUES
('7b22e472-5667-465e-adb5-8eaabbe83bca', '67f37e65-b154-420b-bab5-e97911bd34bd', 50000.00, 'BANK', '89798798', '2026-08-10 10:58:39.456', 'e149fca0-f4f0-4018-bb35-89b9febd366a'),
('af70faa6-a675-4011-82c9-2df5daea9df5', '6e366ad3-3921-45a1-a540-cd244ac7ff0f', 55800.00, 'BANK', '152000', '2026-08-06 06:02:45.228', '1af30a7a-4758-4a4d-a001-a76ca72ea6c5'),
('b1f72c96-593f-4041-b86a-01bb9c5a4662', '32e32257-081c-4f04-a8d5-b8d676e8c2d4', 50000.00, 'BANK', '979jbkhui', '2026-08-10 11:04:48.908', '52897111-6585-4527-9211-1a20b7c2ff8f'),
('demo-salary-payment-1', 'bf9bc559-0e41-45ac-85f8-d560885abacf', 48800.00, 'BANK', 'DEMO-SAL-2026-8-1', '2026-08-25 18:00:00.000', '1af30a7a-4758-4a4d-a001-a76ca72ea6c5');

-- --------------------------------------------------------

--
-- Table structure for table `salary_structures`
--

CREATE TABLE `salary_structures` (
  `id` varchar(191) NOT NULL,
  `school_id` varchar(191) NOT NULL,
  `name` varchar(191) NOT NULL,
  `code` varchar(191) NOT NULL,
  `description` varchar(191) DEFAULT NULL,
  `is_active` tinyint(1) NOT NULL DEFAULT 1,
  `created_at` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updated_at` datetime(3) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `salary_structures`
--

INSERT INTO `salary_structures` (`id`, `school_id`, `name`, `code`, `description`, `is_active`, `created_at`, `updated_at`) VALUES
('75e79342-242f-4d24-9db0-3ff5ab6cdd46', '7b2b510e-dab0-4f0f-9aae-f1d27c9de59c', 'Teacher Salary For junior', '11025', NULL, 1, '2026-08-09 11:40:32.493', '2026-08-09 11:40:32.493');

-- --------------------------------------------------------

--
-- Table structure for table `scholarships`
--

CREATE TABLE `scholarships` (
  `id` varchar(191) NOT NULL,
  `school_id` varchar(191) NOT NULL,
  `student_id` varchar(191) NOT NULL,
  `title` varchar(191) NOT NULL,
  `scholarship_type` varchar(191) NOT NULL,
  `percentage_or_amount` decimal(12,2) NOT NULL,
  `is_percentage` tinyint(1) NOT NULL DEFAULT 1,
  `effective_from` datetime(3) NOT NULL,
  `effective_to` datetime(3) DEFAULT NULL,
  `status` varchar(191) NOT NULL DEFAULT 'ACTIVE',
  `created_at` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updated_at` datetime(3) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `scholarships`
--

INSERT INTO `scholarships` (`id`, `school_id`, `student_id`, `title`, `scholarship_type`, `percentage_or_amount`, `is_percentage`, `effective_from`, `effective_to`, `status`, `created_at`, `updated_at`) VALUES
('demo-scholarship-1', '7b2b510e-dab0-4f0f-9aae-f1d27c9de59c', 'demo-student-4', 'Merit Scholarship', 'MERIT', 300.00, 0, '2026-07-31 18:00:00.000', '2026-08-31 17:59:59.000', 'ACTIVE', '2026-08-02 08:11:12.359', '2026-08-02 08:57:59.035');

-- --------------------------------------------------------

--
-- Table structure for table `schools`
--

CREATE TABLE `schools` (
  `id` varchar(191) NOT NULL,
  `code` varchar(191) NOT NULL,
  `name` varchar(191) NOT NULL,
  `eiin` varchar(191) DEFAULT NULL,
  `principalName` varchar(191) DEFAULT NULL,
  `address` text DEFAULT NULL,
  `phone` varchar(191) DEFAULT NULL,
  `email` varchar(191) DEFAULT NULL,
  `website` varchar(191) DEFAULT NULL,
  `status` enum('ACTIVE','INACTIVE','SUSPENDED','PENDING') NOT NULL DEFAULT 'ACTIVE',
  `created_at` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updated_at` datetime(3) NOT NULL,
  `deleted_at` datetime(3) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `schools`
--

INSERT INTO `schools` (`id`, `code`, `name`, `eiin`, `principalName`, `address`, `phone`, `email`, `website`, `status`, `created_at`, `updated_at`, `deleted_at`) VALUES
('7b2b510e-dab0-4f0f-9aae-f1d27c9de59c', 'DEMO-SCHOOL', 'Shapla Model School & College', '108245', 'Dr. Farhana Rahman', 'Dhanmondi, Dhaka 1209', '+880 2-55001234', 'office@shaplamodel.edu.bd', 'https://shaplamodel.edu.bd', 'ACTIVE', '2026-08-02 08:11:06.934', '2026-08-10 06:34:28.335', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `school_settings`
--

CREATE TABLE `school_settings` (
  `id` varchar(191) NOT NULL,
  `school_id` varchar(191) NOT NULL,
  `currency` varchar(191) NOT NULL DEFAULT 'BDT',
  `timezone` varchar(191) NOT NULL DEFAULT 'Asia/Dhaka',
  `date_format` varchar(191) NOT NULL DEFAULT 'DD/MM/YYYY',
  `default_language` varchar(191) NOT NULL DEFAULT 'bn',
  `academic_year` varchar(191) NOT NULL DEFAULT '2026',
  `created_at` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updated_at` datetime(3) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `school_settings`
--

INSERT INTO `school_settings` (`id`, `school_id`, `currency`, `timezone`, `date_format`, `default_language`, `academic_year`, `created_at`, `updated_at`) VALUES
('406b9c5e-e725-4f02-b860-be906ffc50e3', '7b2b510e-dab0-4f0f-9aae-f1d27c9de59c', 'BDT', 'Asia/Dhaka', 'DD/MM/YYYY', 'bn', '2026', '2026-08-02 08:11:06.997', '2026-08-02 08:57:55.291');

-- --------------------------------------------------------

--
-- Table structure for table `sections`
--

CREATE TABLE `sections` (
  `id` varchar(191) NOT NULL,
  `school_id` varchar(191) DEFAULT NULL,
  `class_id` varchar(191) DEFAULT NULL,
  `name` varchar(191) NOT NULL,
  `code` varchar(191) NOT NULL DEFAULT 'SEC',
  `display_order` int(11) NOT NULL DEFAULT 0,
  `capacity` int(11) NOT NULL DEFAULT 40,
  `status` enum('ACTIVE','INACTIVE','SUSPENDED','PENDING') NOT NULL DEFAULT 'ACTIVE',
  `created_at` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updated_at` datetime(3) NOT NULL,
  `deleted_at` datetime(3) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `sections`
--

INSERT INTO `sections` (`id`, `school_id`, `class_id`, `name`, `code`, `display_order`, `capacity`, `status`, `created_at`, `updated_at`, `deleted_at`) VALUES
('demo-section-10-1', '7b2b510e-dab0-4f0f-9aae-f1d27c9de59c', 'demo-class-10', 'Padma', '10P', 1, 35, 'ACTIVE', '2026-08-02 08:11:07.877', '2026-08-02 08:57:55.569', NULL),
('demo-section-10-2', '7b2b510e-dab0-4f0f-9aae-f1d27c9de59c', 'demo-class-10', 'Meghna', '10M', 2, 35, 'ACTIVE', '2026-08-02 08:11:07.893', '2026-08-02 08:57:55.577', NULL),
('demo-section-6-1', '7b2b510e-dab0-4f0f-9aae-f1d27c9de59c', 'demo-class-6', 'Padma', '6P', 1, 35, 'ACTIVE', '2026-08-02 08:11:07.556', '2026-08-02 08:57:55.478', NULL),
('demo-section-6-2', '7b2b510e-dab0-4f0f-9aae-f1d27c9de59c', 'demo-class-6', 'Meghna', '6M', 2, 35, 'ACTIVE', '2026-08-02 08:11:07.584', '2026-08-02 08:57:55.489', NULL),
('demo-section-7-1', '7b2b510e-dab0-4f0f-9aae-f1d27c9de59c', 'demo-class-7', 'Padma', '7P', 1, 35, 'ACTIVE', '2026-08-02 08:11:07.630', '2026-08-02 08:57:55.502', NULL),
('demo-section-7-2', '7b2b510e-dab0-4f0f-9aae-f1d27c9de59c', 'demo-class-7', 'Meghna', '7M', 2, 35, 'ACTIVE', '2026-08-02 08:11:07.643', '2026-08-02 08:57:55.511', NULL),
('demo-section-8-1', '7b2b510e-dab0-4f0f-9aae-f1d27c9de59c', 'demo-class-8', 'Padma', '8P', 1, 35, 'ACTIVE', '2026-08-02 08:11:07.732', '2026-08-02 08:57:55.527', NULL),
('demo-section-8-2', '7b2b510e-dab0-4f0f-9aae-f1d27c9de59c', 'demo-class-8', 'Meghna', '8M', 2, 35, 'ACTIVE', '2026-08-02 08:11:07.806', '2026-08-02 08:57:55.535', NULL),
('demo-section-9-1', '7b2b510e-dab0-4f0f-9aae-f1d27c9de59c', 'demo-class-9', 'Padma', '9P', 1, 35, 'ACTIVE', '2026-08-02 08:11:07.836', '2026-08-02 08:57:55.549', NULL),
('demo-section-9-2', '7b2b510e-dab0-4f0f-9aae-f1d27c9de59c', 'demo-class-9', 'Meghna', '9M', 2, 35, 'ACTIVE', '2026-08-02 08:11:07.853', '2026-08-02 08:57:55.557', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `students`
--

CREATE TABLE `students` (
  `id` varchar(191) NOT NULL,
  `school_id` varchar(191) NOT NULL,
  `user_id` varchar(191) DEFAULT NULL,
  `admission_number` varchar(191) NOT NULL,
  `student_code` varchar(191) NOT NULL,
  `name_en` varchar(191) NOT NULL,
  `name_bn` varchar(191) DEFAULT NULL,
  `gender` enum('MALE','FEMALE','OTHER') NOT NULL DEFAULT 'MALE',
  `date_of_birth` datetime(3) NOT NULL,
  `blood_group` varchar(191) DEFAULT NULL,
  `birth_registration_number` varchar(191) DEFAULT NULL,
  `phone` varchar(191) DEFAULT NULL,
  `email` varchar(191) DEFAULT NULL,
  `present_address` text DEFAULT NULL,
  `permanent_address` text DEFAULT NULL,
  `profile_photo` varchar(191) DEFAULT NULL,
  `previous_school` varchar(191) DEFAULT NULL,
  `admission_date` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `status` enum('ACTIVE','INACTIVE','SUSPENDED','PENDING') NOT NULL DEFAULT 'ACTIVE',
  `class_id` varchar(191) DEFAULT NULL,
  `section_id` varchar(191) DEFAULT NULL,
  `roll_number` int(11) DEFAULT NULL,
  `father_name` varchar(191) DEFAULT NULL,
  `mother_name` varchar(191) DEFAULT NULL,
  `emergency_phone` varchar(191) DEFAULT NULL,
  `created_at` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updated_at` datetime(3) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `students`
--

INSERT INTO `students` (`id`, `school_id`, `user_id`, `admission_number`, `student_code`, `name_en`, `name_bn`, `gender`, `date_of_birth`, `blood_group`, `birth_registration_number`, `phone`, `email`, `present_address`, `permanent_address`, `profile_photo`, `previous_school`, `admission_date`, `status`, `class_id`, `section_id`, `roll_number`, `father_name`, `mother_name`, `emergency_phone`, `created_at`, `updated_at`) VALUES
('demo-student-1', '7b2b510e-dab0-4f0f-9aae-f1d27c9de59c', '83eaf298-cac4-4c7c-9704-631549951d39', 'ADM-2026-0001', 'SMS-6-001', 'Ayan Chowdhury', NULL, 'MALE', '2015-01-10 03:00:00.000', 'A+', 'BRN20260000001', '01640000001', 'demo.student1@school.test', 'Dhanmondi, Dhaka', 'Dhaka, Bangladesh', NULL, NULL, '2026-07-31 18:00:00.000', 'ACTIVE', 'demo-class-6', 'demo-section-6-1', 1, 'Mr. Chowdhury', 'Mrs. Chowdhury', '01550000001', '2026-08-02 08:11:09.056', '2026-08-02 08:57:56.455'),
('demo-student-10', '7b2b510e-dab0-4f0f-9aae-f1d27c9de59c', NULL, 'ADM-2026-0010', 'SMS-8-010', 'Tanjila Haque', NULL, 'FEMALE', '2013-10-10 03:00:00.000', 'B+', 'BRN20260000010', '01640000010', NULL, 'Dhanmondi, Dhaka', 'Dhaka, Bangladesh', NULL, NULL, '2026-08-09 18:00:00.000', 'ACTIVE', 'demo-class-8', 'demo-section-8-2', 2, 'Mr. Haque', 'Mrs. Haque', '01550000010', '2026-08-02 08:11:09.306', '2026-08-02 08:57:56.737'),
('demo-student-11', '7b2b510e-dab0-4f0f-9aae-f1d27c9de59c', NULL, 'ADM-2026-0011', 'SMS-8-011', 'Mahin Ahmed', NULL, 'MALE', '2013-11-10 03:00:00.000', 'O+', 'BRN20260000011', '01640000011', NULL, 'Dhanmondi, Dhaka', 'Dhaka, Bangladesh', NULL, 'Local Primary School', '2026-08-10 18:00:00.000', 'ACTIVE', 'demo-class-8', 'demo-section-8-1', 3, 'Mr. Ahmed', 'Mrs. Ahmed', '01550000011', '2026-08-02 08:11:09.325', '2026-08-02 08:57:56.767'),
('demo-student-12', '7b2b510e-dab0-4f0f-9aae-f1d27c9de59c', NULL, 'ADM-2026-0012', 'SMS-8-012', 'Raisa Khan', NULL, 'FEMALE', '2013-12-10 03:00:00.000', 'AB+', 'BRN20260000012', '01640000012', NULL, 'Dhanmondi, Dhaka', 'Dhaka, Bangladesh', NULL, 'Local Primary School', '2026-08-11 18:00:00.000', 'ACTIVE', 'demo-class-8', 'demo-section-8-2', 4, 'Mr. Khan', 'Mrs. Khan', '01550000012', '2026-08-02 08:11:09.347', '2026-08-02 08:57:56.810'),
('demo-student-13', '7b2b510e-dab0-4f0f-9aae-f1d27c9de59c', NULL, 'ADM-2026-0013', 'SMS-9-013', 'Fahim Rahman', NULL, 'MALE', '2012-01-10 03:00:00.000', 'A+', 'BRN20260000013', '01640000013', NULL, 'Dhanmondi, Dhaka', 'Dhaka, Bangladesh', NULL, NULL, '2026-08-12 18:00:00.000', 'ACTIVE', 'demo-class-9', 'demo-section-9-1', 1, 'Mr. Rahman', 'Mrs. Rahman', '01550000013', '2026-08-02 08:11:09.363', '2026-08-02 08:57:56.844'),
('demo-student-14', '7b2b510e-dab0-4f0f-9aae-f1d27c9de59c', NULL, 'ADM-2026-0014', 'SMS-9-014', 'Orpa Sultana', NULL, 'FEMALE', '2012-02-10 03:00:00.000', 'B+', 'BRN20260000014', '01640000014', NULL, 'Dhanmondi, Dhaka', 'Dhaka, Bangladesh', NULL, 'Local Primary School', '2026-08-13 18:00:00.000', 'ACTIVE', 'demo-class-9', 'demo-section-9-2', 2, 'Mr. Sultana', 'Mrs. Sultana', '01550000014', '2026-08-02 08:11:09.381', '2026-08-02 08:57:56.869'),
('demo-student-15', '7b2b510e-dab0-4f0f-9aae-f1d27c9de59c', NULL, 'ADM-2026-0015', 'SMS-9-015', 'Tahsin Alam', NULL, 'MALE', '2012-03-10 03:00:00.000', 'O+', 'BRN20260000015', '01640000015', NULL, 'Dhanmondi, Dhaka', 'Dhaka, Bangladesh', NULL, 'Local Primary School', '2026-08-14 18:00:00.000', 'ACTIVE', 'demo-class-9', 'demo-section-9-1', 3, 'Mr. Alam', 'Mrs. Alam', '01550000015', '2026-08-02 08:11:09.400', '2026-08-02 08:57:56.894'),
('demo-student-16', '7b2b510e-dab0-4f0f-9aae-f1d27c9de59c', NULL, 'ADM-2026-0016', 'SMS-9-016', 'Lamisa Islam', NULL, 'FEMALE', '2012-04-10 03:00:00.000', 'AB+', 'BRN20260000016', '01640000016', NULL, 'Dhanmondi, Dhaka', 'Dhaka, Bangladesh', NULL, NULL, '2026-08-15 18:00:00.000', 'ACTIVE', 'demo-class-9', 'demo-section-9-2', 4, 'Mr. Islam', 'Mrs. Islam', '01550000016', '2026-08-02 08:11:09.439', '2026-08-02 08:57:56.928'),
('demo-student-17', '7b2b510e-dab0-4f0f-9aae-f1d27c9de59c', NULL, 'ADM-2026-0017', 'SMS-10-017', 'Arafat Hossain', NULL, 'MALE', '2011-05-10 03:00:00.000', 'A+', 'BRN20260000017', '01640000017', NULL, 'Dhanmondi, Dhaka', 'Dhaka, Bangladesh', NULL, 'Local Primary School', '2026-08-16 18:00:00.000', 'ACTIVE', 'demo-class-10', 'demo-section-10-1', 1, 'Mr. Hossain', 'Mrs. Hossain', '01550000017', '2026-08-02 08:11:09.515', '2026-08-02 08:57:56.951'),
('demo-student-18', '7b2b510e-dab0-4f0f-9aae-f1d27c9de59c', NULL, 'ADM-2026-0018', 'SMS-10-018', 'Mehjabin Chowdhury', NULL, 'FEMALE', '2011-06-10 03:00:00.000', 'B+', 'BRN20260000018', '01640000018', NULL, 'Dhanmondi, Dhaka', 'Dhaka, Bangladesh', NULL, 'Local Primary School', '2026-08-17 18:00:00.000', 'ACTIVE', 'demo-class-10', 'demo-section-10-2', 2, 'Mr. Chowdhury', 'Mrs. Chowdhury', '01550000018', '2026-08-02 08:11:09.542', '2026-08-02 08:57:56.971'),
('demo-student-19', '7b2b510e-dab0-4f0f-9aae-f1d27c9de59c', NULL, 'ADM-2026-0019', 'SMS-10-019', 'Siam Ahmed', NULL, 'MALE', '2011-07-10 03:00:00.000', 'O+', 'BRN20260000019', '01640000019', NULL, 'Dhanmondi, Dhaka', 'Dhaka, Bangladesh', NULL, NULL, '2026-08-18 18:00:00.000', 'ACTIVE', 'demo-class-10', 'demo-section-10-1', 3, 'Mr. Ahmed', 'Mrs. Ahmed', '01550000019', '2026-08-02 08:11:09.566', '2026-08-02 08:57:56.990'),
('demo-student-2', '7b2b510e-dab0-4f0f-9aae-f1d27c9de59c', 'd6ec69fd-ae38-4471-a65d-7992b6f1c0df', 'ADM-2026-0002', 'SMS-6-002', 'Nabila Ahmed', NULL, 'FEMALE', '2015-02-10 03:00:00.000', 'B+', 'BRN20260000002', '01640000002', 'demo.student2@school.test', 'Dhanmondi, Dhaka', 'Dhaka, Bangladesh', NULL, 'Local Primary School', '2026-08-01 18:00:00.000', 'ACTIVE', 'demo-class-6', 'demo-section-6-2', 2, 'Mr. Ahmed', 'Mrs. Ahmed', '01550000002', '2026-08-02 08:11:09.101', '2026-08-02 08:57:56.489'),
('demo-student-20', '7b2b510e-dab0-4f0f-9aae-f1d27c9de59c', NULL, 'ADM-2026-0020', 'SMS-10-020', 'Nusaiba Jahan', NULL, 'FEMALE', '2011-08-10 03:00:00.000', 'AB+', 'BRN20260000020', '01640000020', NULL, 'Dhanmondi, Dhaka', 'Dhaka, Bangladesh', NULL, 'Local Primary School', '2026-08-19 18:00:00.000', 'ACTIVE', 'demo-class-10', 'demo-section-10-2', 4, 'Mr. Jahan', 'Mrs. Jahan', '01550000020', '2026-08-02 08:11:09.591', '2026-08-02 08:57:57.009'),
('demo-student-3', '7b2b510e-dab0-4f0f-9aae-f1d27c9de59c', NULL, 'ADM-2026-0003', 'SMS-6-003', 'Rafi Islam', NULL, 'MALE', '2015-03-10 03:00:00.000', 'O+', 'BRN20260000003', '01640000003', NULL, 'Dhanmondi, Dhaka', 'Dhaka, Bangladesh', NULL, 'Local Primary School', '2026-08-02 18:00:00.000', 'ACTIVE', 'demo-class-6', 'demo-section-6-1', 3, 'Mr. Islam', 'Mrs. Islam', '01550000003', '2026-08-02 08:11:09.136', '2026-08-02 08:57:56.509'),
('demo-student-4', '7b2b510e-dab0-4f0f-9aae-f1d27c9de59c', NULL, 'ADM-2026-0004', 'SMS-6-004', 'Mim Akter', NULL, 'FEMALE', '2015-04-10 03:00:00.000', 'AB+', 'BRN20260000004', '01640000004', NULL, 'Dhanmondi, Dhaka', 'Dhaka, Bangladesh', NULL, NULL, '2026-08-03 18:00:00.000', 'ACTIVE', 'demo-class-6', 'demo-section-6-2', 4, 'Mr. Akter', 'Mrs. Akter', '01550000004', '2026-08-02 08:11:09.157', '2026-08-02 08:57:56.545'),
('demo-student-5', '7b2b510e-dab0-4f0f-9aae-f1d27c9de59c', NULL, 'ADM-2026-0005', 'SMS-7-005', 'Samiul Hasan', NULL, 'MALE', '2014-05-10 03:00:00.000', 'A+', 'BRN20260000005', '01640000005', NULL, 'Dhanmondi, Dhaka', 'Dhaka, Bangladesh', NULL, 'Local Primary School', '2026-08-04 18:00:00.000', 'ACTIVE', 'demo-class-7', 'demo-section-7-1', 1, 'Mr. Hasan', 'Mrs. Hasan', '01550000005', '2026-08-02 08:11:09.180', '2026-08-02 08:57:56.583'),
('demo-student-6', '7b2b510e-dab0-4f0f-9aae-f1d27c9de59c', NULL, 'ADM-2026-0006', 'SMS-7-006', 'Anika Rahman', NULL, 'FEMALE', '2014-06-10 03:00:00.000', 'B+', 'BRN20260000006', '01640000006', NULL, 'Dhanmondi, Dhaka', 'Dhaka, Bangladesh', NULL, 'Local Primary School', '2026-08-05 18:00:00.000', 'ACTIVE', 'demo-class-7', 'demo-section-7-2', 2, 'Mr. Rahman', 'Mrs. Rahman', '01550000006', '2026-08-02 08:11:09.206', '2026-08-02 08:57:56.616'),
('demo-student-7', '7b2b510e-dab0-4f0f-9aae-f1d27c9de59c', NULL, 'ADM-2026-0007', 'SMS-7-007', 'Zayan Karim', NULL, 'MALE', '2014-07-10 03:00:00.000', 'O+', 'BRN20260000007', '01640000007', NULL, 'Dhanmondi, Dhaka', 'Dhaka, Bangladesh', NULL, NULL, '2026-08-06 18:00:00.000', 'ACTIVE', 'demo-class-7', 'demo-section-7-1', 3, 'Mr. Karim', 'Mrs. Karim', '01550000007', '2026-08-02 08:11:09.235', '2026-08-02 08:57:56.640'),
('demo-student-8', '7b2b510e-dab0-4f0f-9aae-f1d27c9de59c', NULL, 'ADM-2026-0008', 'SMS-7-008', 'Nafisa Noor', NULL, 'FEMALE', '2014-08-10 03:00:00.000', 'AB+', 'BRN20260000008', '01640000008', NULL, 'Dhanmondi, Dhaka', 'Dhaka, Bangladesh', NULL, 'Local Primary School', '2026-08-07 18:00:00.000', 'ACTIVE', 'demo-class-7', 'demo-section-7-2', 4, 'Mr. Noor', 'Mrs. Noor', '01550000008', '2026-08-02 08:11:09.259', '2026-08-02 08:57:56.668'),
('demo-student-9', '7b2b510e-dab0-4f0f-9aae-f1d27c9de59c', NULL, 'ADM-2026-0009', 'SMS-8-009', 'Adnan Kabir', NULL, 'MALE', '2013-09-10 03:00:00.000', 'A+', 'BRN20260000009', '01640000009', NULL, 'Dhanmondi, Dhaka', 'Dhaka, Bangladesh', NULL, 'Local Primary School', '2026-08-08 18:00:00.000', 'ACTIVE', 'demo-class-8', 'demo-section-8-1', 1, 'Mr. Kabir', 'Mrs. Kabir', '01550000009', '2026-08-02 08:11:09.289', '2026-08-02 08:57:56.716'),
('e324ef61-2e01-44bb-8e0b-3d5690d33452', '7b2b510e-dab0-4f0f-9aae-f1d27c9de59c', 'a232013e-253c-47e6-93f9-34291e859d68', 'ADM-DEMO-APP-2026-5', 'STU-DEMO-APP-2026-5', 'Abir Hasan', NULL, 'MALE', '2015-05-15 03:00:00.000', 'B+', NULL, '01310000005', 'applicant5@example.com', 'Dhaka, Bangladesh', 'Bangladesh', NULL, 'Model Primary School', '2026-08-10 10:37:48.371', 'ACTIVE', 'demo-class-6', 'demo-section-6-1', 4, NULL, NULL, '01310000005', '2026-08-10 10:37:48.376', '2026-08-10 10:37:48.376');

-- --------------------------------------------------------

--
-- Table structure for table `student_attendance_records`
--

CREATE TABLE `student_attendance_records` (
  `id` varchar(191) NOT NULL,
  `session_id` varchar(191) DEFAULT NULL,
  `school_id` varchar(191) NOT NULL,
  `student_id` varchar(191) NOT NULL,
  `class_id` varchar(191) DEFAULT NULL,
  `section_id` varchar(191) DEFAULT NULL,
  `subject_id` varchar(191) DEFAULT NULL,
  `date` datetime(3) NOT NULL,
  `status` varchar(191) NOT NULL,
  `remarks` varchar(191) DEFAULT NULL,
  `created_at` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updated_at` datetime(3) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `student_attendance_records`
--

INSERT INTO `student_attendance_records` (`id`, `session_id`, `school_id`, `student_id`, `class_id`, `section_id`, `subject_id`, `date`, `status`, `remarks`, `created_at`, `updated_at`) VALUES
('0ed4a362-f888-4d16-86f7-5792d038dc2f', 'b52db913-d2cd-49f5-bb31-09681871a0a5', '7b2b510e-dab0-4f0f-9aae-f1d27c9de59c', 'demo-student-3', 'demo-class-6', 'demo-section-6-1', NULL, '2026-08-09 18:00:00.000', 'present', NULL, '2026-08-10 06:33:57.016', '2026-08-10 06:33:57.016'),
('5e2dfcef-4672-456c-9171-6f0f60c12420', '2579c18e-eae4-4d94-b7d3-8234c64777b1', '7b2b510e-dab0-4f0f-9aae-f1d27c9de59c', 'demo-student-1', 'demo-class-6', 'demo-section-6-1', NULL, '2026-08-08 18:00:00.000', 'present', NULL, '2026-08-09 06:14:35.085', '2026-08-09 06:14:35.085'),
('6530f099-4034-4079-ae6c-30d57d169f34', '2579c18e-eae4-4d94-b7d3-8234c64777b1', '7b2b510e-dab0-4f0f-9aae-f1d27c9de59c', 'demo-student-3', 'demo-class-6', 'demo-section-6-1', NULL, '2026-08-08 18:00:00.000', 'present', NULL, '2026-08-09 06:14:35.107', '2026-08-09 06:14:35.107'),
('9b7e125e-d83b-4bbf-9d25-87f7336ca5c9', 'b52db913-d2cd-49f5-bb31-09681871a0a5', '7b2b510e-dab0-4f0f-9aae-f1d27c9de59c', 'demo-student-1', 'demo-class-6', 'demo-section-6-1', NULL, '2026-08-09 18:00:00.000', 'present', NULL, '2026-08-10 06:33:57.001', '2026-08-10 06:33:57.001'),
('c263d290-fb4f-458f-b8b0-7da3f4232077', '07348811-1580-4b07-9b20-8170962932c9', '7b2b510e-dab0-4f0f-9aae-f1d27c9de59c', 'demo-student-3', 'demo-class-6', 'demo-section-6-1', NULL, '2026-08-05 18:00:00.000', 'present', NULL, '2026-08-06 05:52:48.329', '2026-08-06 05:52:48.329'),
('ce4245b1-5a37-4d8c-88e5-7cd2f43dddac', '07348811-1580-4b07-9b20-8170962932c9', '7b2b510e-dab0-4f0f-9aae-f1d27c9de59c', 'demo-student-1', 'demo-class-6', 'demo-section-6-1', NULL, '2026-08-05 18:00:00.000', 'absent', NULL, '2026-08-06 05:52:48.318', '2026-08-06 05:52:48.318'),
('de2c3307-60e3-4372-a7bc-ae04729e9563', '58fac658-7819-4b30-9fc5-216357058f70', '7b2b510e-dab0-4f0f-9aae-f1d27c9de59c', 'demo-student-13', 'demo-class-9', 'demo-section-9-1', 'demo-subject-ban', '2026-08-01 18:00:00.000', 'present', NULL, '2026-08-02 09:36:36.159', '2026-08-02 09:36:36.159'),
('demo-attendance-0-1', 'bd0da709-ac33-4e7e-9f7a-b40bdf21ff77', '7b2b510e-dab0-4f0f-9aae-f1d27c9de59c', 'demo-student-1', 'demo-class-6', 'demo-section-6-1', NULL, '2026-08-01 18:00:00.000', 'absent', NULL, '2026-08-02 08:11:09.618', '2026-08-02 09:21:59.251'),
('demo-attendance-0-10', NULL, '7b2b510e-dab0-4f0f-9aae-f1d27c9de59c', 'demo-student-10', 'demo-class-8', 'demo-section-8-2', NULL, '2026-08-01 18:00:00.000', 'late', 'Arrived after assembly', '2026-08-02 08:11:09.854', '2026-08-02 08:57:57.130'),
('demo-attendance-0-11', NULL, '7b2b510e-dab0-4f0f-9aae-f1d27c9de59c', 'demo-student-11', 'demo-class-8', 'demo-section-8-1', NULL, '2026-08-01 18:00:00.000', 'present', NULL, '2026-08-02 08:11:09.869', '2026-08-02 08:57:57.137'),
('demo-attendance-0-12', NULL, '7b2b510e-dab0-4f0f-9aae-f1d27c9de59c', 'demo-student-12', 'demo-class-8', 'demo-section-8-2', NULL, '2026-08-01 18:00:00.000', 'present', NULL, '2026-08-02 08:11:09.884', '2026-08-02 08:57:57.146'),
('demo-attendance-0-13', NULL, '7b2b510e-dab0-4f0f-9aae-f1d27c9de59c', 'demo-student-13', 'demo-class-9', 'demo-section-9-1', NULL, '2026-08-01 18:00:00.000', 'present', NULL, '2026-08-02 08:11:09.904', '2026-08-02 08:57:57.153'),
('demo-attendance-0-14', NULL, '7b2b510e-dab0-4f0f-9aae-f1d27c9de59c', 'demo-student-14', 'demo-class-9', 'demo-section-9-2', NULL, '2026-08-01 18:00:00.000', 'absent', NULL, '2026-08-02 08:11:09.966', '2026-08-02 08:57:57.160'),
('demo-attendance-0-15', NULL, '7b2b510e-dab0-4f0f-9aae-f1d27c9de59c', 'demo-student-15', 'demo-class-9', 'demo-section-9-1', NULL, '2026-08-01 18:00:00.000', 'present', NULL, '2026-08-02 08:11:09.981', '2026-08-02 08:57:57.168'),
('demo-attendance-0-16', NULL, '7b2b510e-dab0-4f0f-9aae-f1d27c9de59c', 'demo-student-16', 'demo-class-9', 'demo-section-9-2', NULL, '2026-08-01 18:00:00.000', 'present', NULL, '2026-08-02 08:11:10.020', '2026-08-02 08:57:57.177'),
('demo-attendance-0-17', NULL, '7b2b510e-dab0-4f0f-9aae-f1d27c9de59c', 'demo-student-17', 'demo-class-10', 'demo-section-10-1', NULL, '2026-08-01 18:00:00.000', 'present', NULL, '2026-08-02 08:11:10.047', '2026-08-02 08:57:57.186'),
('demo-attendance-0-18', NULL, '7b2b510e-dab0-4f0f-9aae-f1d27c9de59c', 'demo-student-18', 'demo-class-10', 'demo-section-10-2', NULL, '2026-08-01 18:00:00.000', 'present', NULL, '2026-08-02 08:11:10.069', '2026-08-02 08:57:57.193'),
('demo-attendance-0-19', NULL, '7b2b510e-dab0-4f0f-9aae-f1d27c9de59c', 'demo-student-19', 'demo-class-10', 'demo-section-10-1', NULL, '2026-08-01 18:00:00.000', 'late', 'Arrived after assembly', '2026-08-02 08:11:10.099', '2026-08-02 08:57:57.200'),
('demo-attendance-0-2', NULL, '7b2b510e-dab0-4f0f-9aae-f1d27c9de59c', 'demo-student-2', 'demo-class-6', 'demo-section-6-2', NULL, '2026-08-01 18:00:00.000', 'present', NULL, '2026-08-02 08:11:09.656', '2026-08-02 08:57:57.044'),
('demo-attendance-0-20', NULL, '7b2b510e-dab0-4f0f-9aae-f1d27c9de59c', 'demo-student-20', 'demo-class-10', 'demo-section-10-2', NULL, '2026-08-01 18:00:00.000', 'present', NULL, '2026-08-02 08:11:10.113', '2026-08-02 08:57:57.212'),
('demo-attendance-0-3', 'bd0da709-ac33-4e7e-9f7a-b40bdf21ff77', '7b2b510e-dab0-4f0f-9aae-f1d27c9de59c', 'demo-student-3', 'demo-class-6', 'demo-section-6-1', NULL, '2026-08-01 18:00:00.000', 'present', NULL, '2026-08-02 08:11:09.719', '2026-08-02 09:21:59.257'),
('demo-attendance-0-4', NULL, '7b2b510e-dab0-4f0f-9aae-f1d27c9de59c', 'demo-student-4', 'demo-class-6', 'demo-section-6-2', NULL, '2026-08-01 18:00:00.000', 'present', NULL, '2026-08-02 08:11:09.764', '2026-08-02 08:57:57.085'),
('demo-attendance-0-5', NULL, '7b2b510e-dab0-4f0f-9aae-f1d27c9de59c', 'demo-student-5', 'demo-class-7', 'demo-section-7-1', NULL, '2026-08-01 18:00:00.000', 'present', NULL, '2026-08-02 08:11:09.781', '2026-08-02 08:57:57.093'),
('demo-attendance-0-6', NULL, '7b2b510e-dab0-4f0f-9aae-f1d27c9de59c', 'demo-student-6', 'demo-class-7', 'demo-section-7-2', NULL, '2026-08-01 18:00:00.000', 'present', NULL, '2026-08-02 08:11:09.790', '2026-08-02 08:57:57.101'),
('demo-attendance-0-7', NULL, '7b2b510e-dab0-4f0f-9aae-f1d27c9de59c', 'demo-student-7', 'demo-class-7', 'demo-section-7-1', NULL, '2026-08-01 18:00:00.000', 'present', NULL, '2026-08-02 08:11:09.805', '2026-08-02 08:57:57.108'),
('demo-attendance-0-8', NULL, '7b2b510e-dab0-4f0f-9aae-f1d27c9de59c', 'demo-student-8', 'demo-class-7', 'demo-section-7-2', NULL, '2026-08-01 18:00:00.000', 'present', NULL, '2026-08-02 08:11:09.823', '2026-08-02 08:57:57.115'),
('demo-attendance-0-9', NULL, '7b2b510e-dab0-4f0f-9aae-f1d27c9de59c', 'demo-student-9', 'demo-class-8', 'demo-section-8-1', NULL, '2026-08-01 18:00:00.000', 'present', NULL, '2026-08-02 08:11:09.834', '2026-08-02 08:57:57.122'),
('demo-attendance-1-1', NULL, '7b2b510e-dab0-4f0f-9aae-f1d27c9de59c', 'demo-student-1', 'demo-class-6', 'demo-section-6-1', NULL, '2026-07-31 18:00:00.000', 'present', NULL, '2026-08-02 08:11:10.128', '2026-08-02 08:57:57.220'),
('demo-attendance-1-10', NULL, '7b2b510e-dab0-4f0f-9aae-f1d27c9de59c', 'demo-student-10', 'demo-class-8', 'demo-section-8-2', NULL, '2026-07-31 18:00:00.000', 'present', NULL, '2026-08-02 08:11:10.223', '2026-08-02 08:57:57.282'),
('demo-attendance-1-11', NULL, '7b2b510e-dab0-4f0f-9aae-f1d27c9de59c', 'demo-student-11', 'demo-class-8', 'demo-section-8-1', NULL, '2026-07-31 18:00:00.000', 'present', NULL, '2026-08-02 08:11:10.234', '2026-08-02 08:57:57.288'),
('demo-attendance-1-12', NULL, '7b2b510e-dab0-4f0f-9aae-f1d27c9de59c', 'demo-student-12', 'demo-class-8', 'demo-section-8-2', NULL, '2026-07-31 18:00:00.000', 'present', NULL, '2026-08-02 08:11:10.239', '2026-08-02 08:57:57.294'),
('demo-attendance-1-13', NULL, '7b2b510e-dab0-4f0f-9aae-f1d27c9de59c', 'demo-student-13', 'demo-class-9', 'demo-section-9-1', NULL, '2026-07-31 18:00:00.000', 'absent', NULL, '2026-08-02 08:11:10.248', '2026-08-02 08:57:57.299'),
('demo-attendance-1-14', NULL, '7b2b510e-dab0-4f0f-9aae-f1d27c9de59c', 'demo-student-14', 'demo-class-9', 'demo-section-9-2', NULL, '2026-07-31 18:00:00.000', 'present', NULL, '2026-08-02 08:11:10.254', '2026-08-02 08:57:57.305'),
('demo-attendance-1-15', NULL, '7b2b510e-dab0-4f0f-9aae-f1d27c9de59c', 'demo-student-15', 'demo-class-9', 'demo-section-9-1', NULL, '2026-07-31 18:00:00.000', 'present', NULL, '2026-08-02 08:11:10.258', '2026-08-02 08:57:57.312'),
('demo-attendance-1-16', NULL, '7b2b510e-dab0-4f0f-9aae-f1d27c9de59c', 'demo-student-16', 'demo-class-9', 'demo-section-9-2', NULL, '2026-07-31 18:00:00.000', 'present', NULL, '2026-08-02 08:11:10.266', '2026-08-02 08:57:57.318'),
('demo-attendance-1-17', NULL, '7b2b510e-dab0-4f0f-9aae-f1d27c9de59c', 'demo-student-17', 'demo-class-10', 'demo-section-10-1', NULL, '2026-07-31 18:00:00.000', 'present', NULL, '2026-08-02 08:11:10.271', '2026-08-02 08:57:57.324'),
('demo-attendance-1-18', NULL, '7b2b510e-dab0-4f0f-9aae-f1d27c9de59c', 'demo-student-18', 'demo-class-10', 'demo-section-10-2', NULL, '2026-07-31 18:00:00.000', 'late', 'Arrived after assembly', '2026-08-02 08:11:10.275', '2026-08-02 08:57:57.330'),
('demo-attendance-1-19', NULL, '7b2b510e-dab0-4f0f-9aae-f1d27c9de59c', 'demo-student-19', 'demo-class-10', 'demo-section-10-1', NULL, '2026-07-31 18:00:00.000', 'present', NULL, '2026-08-02 08:11:10.283', '2026-08-02 08:57:57.336'),
('demo-attendance-1-2', NULL, '7b2b510e-dab0-4f0f-9aae-f1d27c9de59c', 'demo-student-2', 'demo-class-6', 'demo-section-6-2', NULL, '2026-07-31 18:00:00.000', 'present', NULL, '2026-08-02 08:11:10.147', '2026-08-02 08:57:57.228'),
('demo-attendance-1-20', NULL, '7b2b510e-dab0-4f0f-9aae-f1d27c9de59c', 'demo-student-20', 'demo-class-10', 'demo-section-10-2', NULL, '2026-07-31 18:00:00.000', 'present', NULL, '2026-08-02 08:11:10.290', '2026-08-02 08:57:57.342'),
('demo-attendance-1-3', NULL, '7b2b510e-dab0-4f0f-9aae-f1d27c9de59c', 'demo-student-3', 'demo-class-6', 'demo-section-6-1', NULL, '2026-07-31 18:00:00.000', 'present', NULL, '2026-08-02 08:11:10.165', '2026-08-02 08:57:57.237'),
('demo-attendance-1-4', NULL, '7b2b510e-dab0-4f0f-9aae-f1d27c9de59c', 'demo-student-4', 'demo-class-6', 'demo-section-6-2', NULL, '2026-07-31 18:00:00.000', 'present', NULL, '2026-08-02 08:11:10.182', '2026-08-02 08:57:57.245'),
('demo-attendance-1-5', NULL, '7b2b510e-dab0-4f0f-9aae-f1d27c9de59c', 'demo-student-5', 'demo-class-7', 'demo-section-7-1', NULL, '2026-07-31 18:00:00.000', 'present', NULL, '2026-08-02 08:11:10.190', '2026-08-02 08:57:57.250'),
('demo-attendance-1-6', NULL, '7b2b510e-dab0-4f0f-9aae-f1d27c9de59c', 'demo-student-6', 'demo-class-7', 'demo-section-7-2', NULL, '2026-07-31 18:00:00.000', 'present', NULL, '2026-08-02 08:11:10.200', '2026-08-02 08:57:57.257'),
('demo-attendance-1-7', NULL, '7b2b510e-dab0-4f0f-9aae-f1d27c9de59c', 'demo-student-7', 'demo-class-7', 'demo-section-7-1', NULL, '2026-07-31 18:00:00.000', 'present', NULL, '2026-08-02 08:11:10.205', '2026-08-02 08:57:57.263'),
('demo-attendance-1-8', NULL, '7b2b510e-dab0-4f0f-9aae-f1d27c9de59c', 'demo-student-8', 'demo-class-7', 'demo-section-7-2', NULL, '2026-07-31 18:00:00.000', 'present', NULL, '2026-08-02 08:11:10.211', '2026-08-02 08:57:57.269'),
('demo-attendance-1-9', NULL, '7b2b510e-dab0-4f0f-9aae-f1d27c9de59c', 'demo-student-9', 'demo-class-8', 'demo-section-8-1', NULL, '2026-07-31 18:00:00.000', 'late', 'Arrived after assembly', '2026-08-02 08:11:10.218', '2026-08-02 08:57:57.276'),
('demo-attendance-2-1', NULL, '7b2b510e-dab0-4f0f-9aae-f1d27c9de59c', 'demo-student-1', 'demo-class-6', 'demo-section-6-1', NULL, '2026-07-30 18:00:00.000', 'present', NULL, '2026-08-02 08:11:10.304', '2026-08-02 08:57:57.349'),
('demo-attendance-2-10', NULL, '7b2b510e-dab0-4f0f-9aae-f1d27c9de59c', 'demo-student-10', 'demo-class-8', 'demo-section-8-2', NULL, '2026-07-30 18:00:00.000', 'present', NULL, '2026-08-02 08:11:10.368', '2026-08-02 08:57:57.412'),
('demo-attendance-2-11', NULL, '7b2b510e-dab0-4f0f-9aae-f1d27c9de59c', 'demo-student-11', 'demo-class-8', 'demo-section-8-1', NULL, '2026-07-30 18:00:00.000', 'present', NULL, '2026-08-02 08:11:10.372', '2026-08-02 08:57:57.417'),
('demo-attendance-2-12', NULL, '7b2b510e-dab0-4f0f-9aae-f1d27c9de59c', 'demo-student-12', 'demo-class-8', 'demo-section-8-2', NULL, '2026-07-30 18:00:00.000', 'absent', NULL, '2026-08-02 08:11:10.380', '2026-08-02 08:57:57.423'),
('demo-attendance-2-13', NULL, '7b2b510e-dab0-4f0f-9aae-f1d27c9de59c', 'demo-student-13', 'demo-class-9', 'demo-section-9-1', NULL, '2026-07-30 18:00:00.000', 'present', NULL, '2026-08-02 08:11:10.384', '2026-08-02 08:57:57.429'),
('demo-attendance-2-14', NULL, '7b2b510e-dab0-4f0f-9aae-f1d27c9de59c', 'demo-student-14', 'demo-class-9', 'demo-section-9-2', NULL, '2026-07-30 18:00:00.000', 'present', NULL, '2026-08-02 08:11:10.388', '2026-08-02 08:57:57.433'),
('demo-attendance-2-15', NULL, '7b2b510e-dab0-4f0f-9aae-f1d27c9de59c', 'demo-student-15', 'demo-class-9', 'demo-section-9-1', NULL, '2026-07-30 18:00:00.000', 'present', NULL, '2026-08-02 08:11:10.395', '2026-08-02 08:57:57.439'),
('demo-attendance-2-16', NULL, '7b2b510e-dab0-4f0f-9aae-f1d27c9de59c', 'demo-student-16', 'demo-class-9', 'demo-section-9-2', NULL, '2026-07-30 18:00:00.000', 'present', NULL, '2026-08-02 08:11:10.400', '2026-08-02 08:57:57.443'),
('demo-attendance-2-17', NULL, '7b2b510e-dab0-4f0f-9aae-f1d27c9de59c', 'demo-student-17', 'demo-class-10', 'demo-section-10-1', NULL, '2026-07-30 18:00:00.000', 'late', 'Arrived after assembly', '2026-08-02 08:11:10.405', '2026-08-02 08:57:57.448'),
('demo-attendance-2-18', NULL, '7b2b510e-dab0-4f0f-9aae-f1d27c9de59c', 'demo-student-18', 'demo-class-10', 'demo-section-10-2', NULL, '2026-07-30 18:00:00.000', 'present', NULL, '2026-08-02 08:11:10.411', '2026-08-02 08:57:57.452'),
('demo-attendance-2-19', NULL, '7b2b510e-dab0-4f0f-9aae-f1d27c9de59c', 'demo-student-19', 'demo-class-10', 'demo-section-10-1', NULL, '2026-07-30 18:00:00.000', 'present', NULL, '2026-08-02 08:11:10.417', '2026-08-02 08:57:57.456'),
('demo-attendance-2-2', NULL, '7b2b510e-dab0-4f0f-9aae-f1d27c9de59c', 'demo-student-2', 'demo-class-6', 'demo-section-6-2', NULL, '2026-07-30 18:00:00.000', 'present', NULL, '2026-08-02 08:11:10.314', '2026-08-02 08:57:57.358'),
('demo-attendance-2-20', NULL, '7b2b510e-dab0-4f0f-9aae-f1d27c9de59c', 'demo-student-20', 'demo-class-10', 'demo-section-10-2', NULL, '2026-07-30 18:00:00.000', 'present', NULL, '2026-08-02 08:11:10.424', '2026-08-02 08:57:57.461'),
('demo-attendance-2-3', NULL, '7b2b510e-dab0-4f0f-9aae-f1d27c9de59c', 'demo-student-3', 'demo-class-6', 'demo-section-6-1', NULL, '2026-07-30 18:00:00.000', 'present', NULL, '2026-08-02 08:11:10.322', '2026-08-02 08:57:57.366'),
('demo-attendance-2-4', NULL, '7b2b510e-dab0-4f0f-9aae-f1d27c9de59c', 'demo-student-4', 'demo-class-6', 'demo-section-6-2', NULL, '2026-07-30 18:00:00.000', 'present', NULL, '2026-08-02 08:11:10.332', '2026-08-02 08:57:57.372'),
('demo-attendance-2-5', NULL, '7b2b510e-dab0-4f0f-9aae-f1d27c9de59c', 'demo-student-5', 'demo-class-7', 'demo-section-7-1', NULL, '2026-07-30 18:00:00.000', 'present', NULL, '2026-08-02 08:11:10.337', '2026-08-02 08:57:57.381'),
('demo-attendance-2-6', NULL, '7b2b510e-dab0-4f0f-9aae-f1d27c9de59c', 'demo-student-6', 'demo-class-7', 'demo-section-7-2', NULL, '2026-07-30 18:00:00.000', 'present', NULL, '2026-08-02 08:11:10.341', '2026-08-02 08:57:57.388'),
('demo-attendance-2-7', NULL, '7b2b510e-dab0-4f0f-9aae-f1d27c9de59c', 'demo-student-7', 'demo-class-7', 'demo-section-7-1', NULL, '2026-07-30 18:00:00.000', 'present', NULL, '2026-08-02 08:11:10.349', '2026-08-02 08:57:57.395'),
('demo-attendance-2-8', NULL, '7b2b510e-dab0-4f0f-9aae-f1d27c9de59c', 'demo-student-8', 'demo-class-7', 'demo-section-7-2', NULL, '2026-07-30 18:00:00.000', 'late', 'Arrived after assembly', '2026-08-02 08:11:10.354', '2026-08-02 08:57:57.401'),
('demo-attendance-2-9', NULL, '7b2b510e-dab0-4f0f-9aae-f1d27c9de59c', 'demo-student-9', 'demo-class-8', 'demo-section-8-1', NULL, '2026-07-30 18:00:00.000', 'present', NULL, '2026-08-02 08:11:10.361', '2026-08-02 08:57:57.407'),
('demo-attendance-3-1', NULL, '7b2b510e-dab0-4f0f-9aae-f1d27c9de59c', 'demo-student-1', 'demo-class-6', 'demo-section-6-1', NULL, '2026-07-29 18:00:00.000', 'present', NULL, '2026-08-02 08:11:10.450', '2026-08-02 08:57:57.465'),
('demo-attendance-3-10', NULL, '7b2b510e-dab0-4f0f-9aae-f1d27c9de59c', 'demo-student-10', 'demo-class-8', 'demo-section-8-2', NULL, '2026-07-29 18:00:00.000', 'present', NULL, '2026-08-02 08:11:10.539', '2026-08-02 08:57:57.506'),
('demo-attendance-3-11', NULL, '7b2b510e-dab0-4f0f-9aae-f1d27c9de59c', 'demo-student-11', 'demo-class-8', 'demo-section-8-1', NULL, '2026-07-29 18:00:00.000', 'absent', NULL, '2026-08-02 08:11:10.546', '2026-08-02 08:57:57.510'),
('demo-attendance-3-12', NULL, '7b2b510e-dab0-4f0f-9aae-f1d27c9de59c', 'demo-student-12', 'demo-class-8', 'demo-section-8-2', NULL, '2026-07-29 18:00:00.000', 'present', NULL, '2026-08-02 08:11:10.552', '2026-08-02 08:57:57.515'),
('demo-attendance-3-13', NULL, '7b2b510e-dab0-4f0f-9aae-f1d27c9de59c', 'demo-student-13', 'demo-class-9', 'demo-section-9-1', NULL, '2026-07-29 18:00:00.000', 'present', NULL, '2026-08-02 08:11:10.558', '2026-08-02 08:57:57.519'),
('demo-attendance-3-14', NULL, '7b2b510e-dab0-4f0f-9aae-f1d27c9de59c', 'demo-student-14', 'demo-class-9', 'demo-section-9-2', NULL, '2026-07-29 18:00:00.000', 'present', NULL, '2026-08-02 08:11:10.565', '2026-08-02 08:57:57.523'),
('demo-attendance-3-15', NULL, '7b2b510e-dab0-4f0f-9aae-f1d27c9de59c', 'demo-student-15', 'demo-class-9', 'demo-section-9-1', NULL, '2026-07-29 18:00:00.000', 'present', NULL, '2026-08-02 08:11:10.569', '2026-08-02 08:57:57.528'),
('demo-attendance-3-16', NULL, '7b2b510e-dab0-4f0f-9aae-f1d27c9de59c', 'demo-student-16', 'demo-class-9', 'demo-section-9-2', NULL, '2026-07-29 18:00:00.000', 'late', 'Arrived after assembly', '2026-08-02 08:11:10.573', '2026-08-02 08:57:57.532'),
('demo-attendance-3-17', NULL, '7b2b510e-dab0-4f0f-9aae-f1d27c9de59c', 'demo-student-17', 'demo-class-10', 'demo-section-10-1', NULL, '2026-07-29 18:00:00.000', 'present', NULL, '2026-08-02 08:11:10.579', '2026-08-02 08:57:57.536'),
('demo-attendance-3-18', NULL, '7b2b510e-dab0-4f0f-9aae-f1d27c9de59c', 'demo-student-18', 'demo-class-10', 'demo-section-10-2', NULL, '2026-07-29 18:00:00.000', 'present', NULL, '2026-08-02 08:11:10.583', '2026-08-02 08:57:57.541'),
('demo-attendance-3-19', NULL, '7b2b510e-dab0-4f0f-9aae-f1d27c9de59c', 'demo-student-19', 'demo-class-10', 'demo-section-10-1', NULL, '2026-07-29 18:00:00.000', 'present', NULL, '2026-08-02 08:11:10.588', '2026-08-02 08:57:57.545'),
('demo-attendance-3-2', NULL, '7b2b510e-dab0-4f0f-9aae-f1d27c9de59c', 'demo-student-2', 'demo-class-6', 'demo-section-6-2', NULL, '2026-07-29 18:00:00.000', 'present', NULL, '2026-08-02 08:11:10.485', '2026-08-02 08:57:57.470'),
('demo-attendance-3-20', NULL, '7b2b510e-dab0-4f0f-9aae-f1d27c9de59c', 'demo-student-20', 'demo-class-10', 'demo-section-10-2', NULL, '2026-07-29 18:00:00.000', 'present', NULL, '2026-08-02 08:11:10.592', '2026-08-02 08:57:57.550'),
('demo-attendance-3-3', NULL, '7b2b510e-dab0-4f0f-9aae-f1d27c9de59c', 'demo-student-3', 'demo-class-6', 'demo-section-6-1', NULL, '2026-07-29 18:00:00.000', 'present', NULL, '2026-08-02 08:11:10.495', '2026-08-02 08:57:57.475'),
('demo-attendance-3-4', NULL, '7b2b510e-dab0-4f0f-9aae-f1d27c9de59c', 'demo-student-4', 'demo-class-6', 'demo-section-6-2', NULL, '2026-07-29 18:00:00.000', 'present', NULL, '2026-08-02 08:11:10.502', '2026-08-02 08:57:57.479'),
('demo-attendance-3-5', NULL, '7b2b510e-dab0-4f0f-9aae-f1d27c9de59c', 'demo-student-5', 'demo-class-7', 'demo-section-7-1', NULL, '2026-07-29 18:00:00.000', 'present', NULL, '2026-08-02 08:11:10.508', '2026-08-02 08:57:57.483'),
('demo-attendance-3-6', NULL, '7b2b510e-dab0-4f0f-9aae-f1d27c9de59c', 'demo-student-6', 'demo-class-7', 'demo-section-7-2', NULL, '2026-07-29 18:00:00.000', 'present', NULL, '2026-08-02 08:11:10.516', '2026-08-02 08:57:57.488'),
('demo-attendance-3-7', NULL, '7b2b510e-dab0-4f0f-9aae-f1d27c9de59c', 'demo-student-7', 'demo-class-7', 'demo-section-7-1', NULL, '2026-07-29 18:00:00.000', 'late', 'Arrived after assembly', '2026-08-02 08:11:10.521', '2026-08-02 08:57:57.493'),
('demo-attendance-3-8', NULL, '7b2b510e-dab0-4f0f-9aae-f1d27c9de59c', 'demo-student-8', 'demo-class-7', 'demo-section-7-2', NULL, '2026-07-29 18:00:00.000', 'present', NULL, '2026-08-02 08:11:10.528', '2026-08-02 08:57:57.497'),
('demo-attendance-3-9', NULL, '7b2b510e-dab0-4f0f-9aae-f1d27c9de59c', 'demo-student-9', 'demo-class-8', 'demo-section-8-1', NULL, '2026-07-29 18:00:00.000', 'present', NULL, '2026-08-02 08:11:10.534', '2026-08-02 08:57:57.502'),
('demo-attendance-4-1', NULL, '7b2b510e-dab0-4f0f-9aae-f1d27c9de59c', 'demo-student-1', 'demo-class-6', 'demo-section-6-1', NULL, '2026-07-28 18:00:00.000', 'present', NULL, '2026-08-02 08:11:10.598', '2026-08-02 08:57:57.554'),
('demo-attendance-4-10', NULL, '7b2b510e-dab0-4f0f-9aae-f1d27c9de59c', 'demo-student-10', 'demo-class-8', 'demo-section-8-2', NULL, '2026-07-28 18:00:00.000', 'absent', NULL, '2026-08-02 08:11:10.641', '2026-08-02 08:57:57.596'),
('demo-attendance-4-11', NULL, '7b2b510e-dab0-4f0f-9aae-f1d27c9de59c', 'demo-student-11', 'demo-class-8', 'demo-section-8-1', NULL, '2026-07-28 18:00:00.000', 'present', NULL, '2026-08-02 08:11:10.647', '2026-08-02 08:57:57.600'),
('demo-attendance-4-12', NULL, '7b2b510e-dab0-4f0f-9aae-f1d27c9de59c', 'demo-student-12', 'demo-class-8', 'demo-section-8-2', NULL, '2026-07-28 18:00:00.000', 'present', NULL, '2026-08-02 08:11:10.652', '2026-08-02 08:57:57.604'),
('demo-attendance-4-13', NULL, '7b2b510e-dab0-4f0f-9aae-f1d27c9de59c', 'demo-student-13', 'demo-class-9', 'demo-section-9-1', NULL, '2026-07-28 18:00:00.000', 'present', NULL, '2026-08-02 08:11:10.656', '2026-08-02 08:57:57.609'),
('demo-attendance-4-14', NULL, '7b2b510e-dab0-4f0f-9aae-f1d27c9de59c', 'demo-student-14', 'demo-class-9', 'demo-section-9-2', NULL, '2026-07-28 18:00:00.000', 'present', NULL, '2026-08-02 08:11:10.662', '2026-08-02 08:57:57.613'),
('demo-attendance-4-15', NULL, '7b2b510e-dab0-4f0f-9aae-f1d27c9de59c', 'demo-student-15', 'demo-class-9', 'demo-section-9-1', NULL, '2026-07-28 18:00:00.000', 'late', 'Arrived after assembly', '2026-08-02 08:11:10.667', '2026-08-02 08:57:57.618'),
('demo-attendance-4-16', NULL, '7b2b510e-dab0-4f0f-9aae-f1d27c9de59c', 'demo-student-16', 'demo-class-9', 'demo-section-9-2', NULL, '2026-07-28 18:00:00.000', 'present', NULL, '2026-08-02 08:11:10.671', '2026-08-02 08:57:57.622'),
('demo-attendance-4-17', NULL, '7b2b510e-dab0-4f0f-9aae-f1d27c9de59c', 'demo-student-17', 'demo-class-10', 'demo-section-10-1', NULL, '2026-07-28 18:00:00.000', 'present', NULL, '2026-08-02 08:11:10.675', '2026-08-02 08:57:57.627'),
('demo-attendance-4-18', NULL, '7b2b510e-dab0-4f0f-9aae-f1d27c9de59c', 'demo-student-18', 'demo-class-10', 'demo-section-10-2', NULL, '2026-07-28 18:00:00.000', 'present', NULL, '2026-08-02 08:11:10.682', '2026-08-02 08:57:57.632'),
('demo-attendance-4-19', NULL, '7b2b510e-dab0-4f0f-9aae-f1d27c9de59c', 'demo-student-19', 'demo-class-10', 'demo-section-10-1', NULL, '2026-07-28 18:00:00.000', 'present', NULL, '2026-08-02 08:11:10.686', '2026-08-02 08:57:57.636'),
('demo-attendance-4-2', NULL, '7b2b510e-dab0-4f0f-9aae-f1d27c9de59c', 'demo-student-2', 'demo-class-6', 'demo-section-6-2', NULL, '2026-07-28 18:00:00.000', 'present', NULL, '2026-08-02 08:11:10.603', '2026-08-02 08:57:57.559'),
('demo-attendance-4-20', NULL, '7b2b510e-dab0-4f0f-9aae-f1d27c9de59c', 'demo-student-20', 'demo-class-10', 'demo-section-10-2', NULL, '2026-07-28 18:00:00.000', 'present', NULL, '2026-08-02 08:11:10.693', '2026-08-02 08:57:57.640'),
('demo-attendance-4-3', NULL, '7b2b510e-dab0-4f0f-9aae-f1d27c9de59c', 'demo-student-3', 'demo-class-6', 'demo-section-6-1', NULL, '2026-07-28 18:00:00.000', 'present', NULL, '2026-08-02 08:11:10.607', '2026-08-02 08:57:57.563'),
('demo-attendance-4-4', NULL, '7b2b510e-dab0-4f0f-9aae-f1d27c9de59c', 'demo-student-4', 'demo-class-6', 'demo-section-6-2', NULL, '2026-07-28 18:00:00.000', 'present', NULL, '2026-08-02 08:11:10.613', '2026-08-02 08:57:57.567'),
('demo-attendance-4-5', NULL, '7b2b510e-dab0-4f0f-9aae-f1d27c9de59c', 'demo-student-5', 'demo-class-7', 'demo-section-7-1', NULL, '2026-07-28 18:00:00.000', 'present', NULL, '2026-08-02 08:11:10.617', '2026-08-02 08:57:57.572'),
('demo-attendance-4-6', NULL, '7b2b510e-dab0-4f0f-9aae-f1d27c9de59c', 'demo-student-6', 'demo-class-7', 'demo-section-7-2', NULL, '2026-07-28 18:00:00.000', 'late', 'Arrived after assembly', '2026-08-02 08:11:10.622', '2026-08-02 08:57:57.576'),
('demo-attendance-4-7', NULL, '7b2b510e-dab0-4f0f-9aae-f1d27c9de59c', 'demo-student-7', 'demo-class-7', 'demo-section-7-1', NULL, '2026-07-28 18:00:00.000', 'present', NULL, '2026-08-02 08:11:10.627', '2026-08-02 08:57:57.581'),
('demo-attendance-4-8', NULL, '7b2b510e-dab0-4f0f-9aae-f1d27c9de59c', 'demo-student-8', 'demo-class-7', 'demo-section-7-2', NULL, '2026-07-28 18:00:00.000', 'present', NULL, '2026-08-02 08:11:10.632', '2026-08-02 08:57:57.586'),
('demo-attendance-4-9', NULL, '7b2b510e-dab0-4f0f-9aae-f1d27c9de59c', 'demo-student-9', 'demo-class-8', 'demo-section-8-1', NULL, '2026-07-28 18:00:00.000', 'present', NULL, '2026-08-02 08:11:10.636', '2026-08-02 08:57:57.591'),
('demo-attendance-5-1', NULL, '7b2b510e-dab0-4f0f-9aae-f1d27c9de59c', 'demo-student-1', 'demo-class-6', 'demo-section-6-1', NULL, '2026-07-27 18:00:00.000', 'present', NULL, '2026-08-02 08:11:10.698', '2026-08-02 08:57:57.645'),
('demo-attendance-5-10', NULL, '7b2b510e-dab0-4f0f-9aae-f1d27c9de59c', 'demo-student-10', 'demo-class-8', 'demo-section-8-2', NULL, '2026-07-27 18:00:00.000', 'present', NULL, '2026-08-02 08:11:10.742', '2026-08-02 08:57:57.685'),
('demo-attendance-5-11', NULL, '7b2b510e-dab0-4f0f-9aae-f1d27c9de59c', 'demo-student-11', 'demo-class-8', 'demo-section-8-1', NULL, '2026-07-27 18:00:00.000', 'present', NULL, '2026-08-02 08:11:10.748', '2026-08-02 08:57:57.690'),
('demo-attendance-5-12', NULL, '7b2b510e-dab0-4f0f-9aae-f1d27c9de59c', 'demo-student-12', 'demo-class-8', 'demo-section-8-2', NULL, '2026-07-27 18:00:00.000', 'present', NULL, '2026-08-02 08:11:10.752', '2026-08-02 08:57:57.695'),
('demo-attendance-5-13', NULL, '7b2b510e-dab0-4f0f-9aae-f1d27c9de59c', 'demo-student-13', 'demo-class-9', 'demo-section-9-1', NULL, '2026-07-27 18:00:00.000', 'present', NULL, '2026-08-02 08:11:10.769', '2026-08-02 08:57:57.700'),
('demo-attendance-5-14', NULL, '7b2b510e-dab0-4f0f-9aae-f1d27c9de59c', 'demo-student-14', 'demo-class-9', 'demo-section-9-2', NULL, '2026-07-27 18:00:00.000', 'late', 'Arrived after assembly', '2026-08-02 08:11:10.777', '2026-08-02 08:57:57.705'),
('demo-attendance-5-15', NULL, '7b2b510e-dab0-4f0f-9aae-f1d27c9de59c', 'demo-student-15', 'demo-class-9', 'demo-section-9-1', NULL, '2026-07-27 18:00:00.000', 'present', NULL, '2026-08-02 08:11:10.783', '2026-08-02 08:57:57.710'),
('demo-attendance-5-16', NULL, '7b2b510e-dab0-4f0f-9aae-f1d27c9de59c', 'demo-student-16', 'demo-class-9', 'demo-section-9-2', NULL, '2026-07-27 18:00:00.000', 'present', NULL, '2026-08-02 08:11:10.788', '2026-08-02 08:57:57.714'),
('demo-attendance-5-17', NULL, '7b2b510e-dab0-4f0f-9aae-f1d27c9de59c', 'demo-student-17', 'demo-class-10', 'demo-section-10-1', NULL, '2026-07-27 18:00:00.000', 'present', NULL, '2026-08-02 08:11:10.795', '2026-08-02 08:57:57.719'),
('demo-attendance-5-18', NULL, '7b2b510e-dab0-4f0f-9aae-f1d27c9de59c', 'demo-student-18', 'demo-class-10', 'demo-section-10-2', NULL, '2026-07-27 18:00:00.000', 'present', NULL, '2026-08-02 08:11:10.800', '2026-08-02 08:57:57.724'),
('demo-attendance-5-19', NULL, '7b2b510e-dab0-4f0f-9aae-f1d27c9de59c', 'demo-student-19', 'demo-class-10', 'demo-section-10-1', NULL, '2026-07-27 18:00:00.000', 'present', NULL, '2026-08-02 08:11:10.805', '2026-08-02 08:57:57.728'),
('demo-attendance-5-2', NULL, '7b2b510e-dab0-4f0f-9aae-f1d27c9de59c', 'demo-student-2', 'demo-class-6', 'demo-section-6-2', NULL, '2026-07-27 18:00:00.000', 'present', NULL, '2026-08-02 08:11:10.702', '2026-08-02 08:57:57.649'),
('demo-attendance-5-20', NULL, '7b2b510e-dab0-4f0f-9aae-f1d27c9de59c', 'demo-student-20', 'demo-class-10', 'demo-section-10-2', NULL, '2026-07-27 18:00:00.000', 'present', NULL, '2026-08-02 08:11:10.812', '2026-08-02 08:57:57.733'),
('demo-attendance-5-3', NULL, '7b2b510e-dab0-4f0f-9aae-f1d27c9de59c', 'demo-student-3', 'demo-class-6', 'demo-section-6-1', NULL, '2026-07-27 18:00:00.000', 'present', NULL, '2026-08-02 08:11:10.707', '2026-08-02 08:57:57.654'),
('demo-attendance-5-4', NULL, '7b2b510e-dab0-4f0f-9aae-f1d27c9de59c', 'demo-student-4', 'demo-class-6', 'demo-section-6-2', NULL, '2026-07-27 18:00:00.000', 'present', NULL, '2026-08-02 08:11:10.713', '2026-08-02 08:57:57.658'),
('demo-attendance-5-5', NULL, '7b2b510e-dab0-4f0f-9aae-f1d27c9de59c', 'demo-student-5', 'demo-class-7', 'demo-section-7-1', NULL, '2026-07-27 18:00:00.000', 'late', 'Arrived after assembly', '2026-08-02 08:11:10.717', '2026-08-02 08:57:57.663'),
('demo-attendance-5-6', NULL, '7b2b510e-dab0-4f0f-9aae-f1d27c9de59c', 'demo-student-6', 'demo-class-7', 'demo-section-7-2', NULL, '2026-07-27 18:00:00.000', 'present', NULL, '2026-08-02 08:11:10.721', '2026-08-02 08:57:57.667'),
('demo-attendance-5-7', NULL, '7b2b510e-dab0-4f0f-9aae-f1d27c9de59c', 'demo-student-7', 'demo-class-7', 'demo-section-7-1', NULL, '2026-07-27 18:00:00.000', 'present', NULL, '2026-08-02 08:11:10.727', '2026-08-02 08:57:57.672'),
('demo-attendance-5-8', NULL, '7b2b510e-dab0-4f0f-9aae-f1d27c9de59c', 'demo-student-8', 'demo-class-7', 'demo-section-7-2', NULL, '2026-07-27 18:00:00.000', 'present', NULL, '2026-08-02 08:11:10.733', '2026-08-02 08:57:57.676'),
('demo-attendance-5-9', NULL, '7b2b510e-dab0-4f0f-9aae-f1d27c9de59c', 'demo-student-9', 'demo-class-8', 'demo-section-8-1', NULL, '2026-07-27 18:00:00.000', 'absent', NULL, '2026-08-02 08:11:10.737', '2026-08-02 08:57:57.681'),
('demo-attendance-6-1', NULL, '7b2b510e-dab0-4f0f-9aae-f1d27c9de59c', 'demo-student-1', 'demo-class-6', 'demo-section-6-1', NULL, '2026-07-26 18:00:00.000', 'present', NULL, '2026-08-02 08:11:10.817', '2026-08-02 08:57:57.738'),
('demo-attendance-6-10', NULL, '7b2b510e-dab0-4f0f-9aae-f1d27c9de59c', 'demo-student-10', 'demo-class-8', 'demo-section-8-2', NULL, '2026-07-26 18:00:00.000', 'present', NULL, '2026-08-02 08:11:10.871', '2026-08-02 08:57:57.785'),
('demo-attendance-6-11', NULL, '7b2b510e-dab0-4f0f-9aae-f1d27c9de59c', 'demo-student-11', 'demo-class-8', 'demo-section-8-1', NULL, '2026-07-26 18:00:00.000', 'present', NULL, '2026-08-02 08:11:10.875', '2026-08-02 08:57:57.791'),
('demo-attendance-6-12', NULL, '7b2b510e-dab0-4f0f-9aae-f1d27c9de59c', 'demo-student-12', 'demo-class-8', 'demo-section-8-2', NULL, '2026-07-26 18:00:00.000', 'present', NULL, '2026-08-02 08:11:10.881', '2026-08-02 08:57:57.796'),
('demo-attendance-6-13', NULL, '7b2b510e-dab0-4f0f-9aae-f1d27c9de59c', 'demo-student-13', 'demo-class-9', 'demo-section-9-1', NULL, '2026-07-26 18:00:00.000', 'late', 'Arrived after assembly', '2026-08-02 08:11:10.885', '2026-08-02 08:57:57.801'),
('demo-attendance-6-14', NULL, '7b2b510e-dab0-4f0f-9aae-f1d27c9de59c', 'demo-student-14', 'demo-class-9', 'demo-section-9-2', NULL, '2026-07-26 18:00:00.000', 'present', NULL, '2026-08-02 08:11:10.890', '2026-08-02 08:57:57.806'),
('demo-attendance-6-15', NULL, '7b2b510e-dab0-4f0f-9aae-f1d27c9de59c', 'demo-student-15', 'demo-class-9', 'demo-section-9-1', NULL, '2026-07-26 18:00:00.000', 'present', NULL, '2026-08-02 08:11:10.896', '2026-08-02 08:57:57.811'),
('demo-attendance-6-16', NULL, '7b2b510e-dab0-4f0f-9aae-f1d27c9de59c', 'demo-student-16', 'demo-class-9', 'demo-section-9-2', NULL, '2026-07-26 18:00:00.000', 'present', NULL, '2026-08-02 08:11:10.900', '2026-08-02 08:57:57.815'),
('demo-attendance-6-17', NULL, '7b2b510e-dab0-4f0f-9aae-f1d27c9de59c', 'demo-student-17', 'demo-class-10', 'demo-section-10-1', NULL, '2026-07-26 18:00:00.000', 'present', NULL, '2026-08-02 08:11:10.905', '2026-08-02 08:57:57.820'),
('demo-attendance-6-18', NULL, '7b2b510e-dab0-4f0f-9aae-f1d27c9de59c', 'demo-student-18', 'demo-class-10', 'demo-section-10-2', NULL, '2026-07-26 18:00:00.000', 'present', NULL, '2026-08-02 08:11:10.909', '2026-08-02 08:57:57.825'),
('demo-attendance-6-19', NULL, '7b2b510e-dab0-4f0f-9aae-f1d27c9de59c', 'demo-student-19', 'demo-class-10', 'demo-section-10-1', NULL, '2026-07-26 18:00:00.000', 'present', NULL, '2026-08-02 08:11:10.916', '2026-08-02 08:57:57.829'),
('demo-attendance-6-2', NULL, '7b2b510e-dab0-4f0f-9aae-f1d27c9de59c', 'demo-student-2', 'demo-class-6', 'demo-section-6-2', NULL, '2026-07-26 18:00:00.000', 'present', NULL, '2026-08-02 08:11:10.823', '2026-08-02 08:57:57.743'),
('demo-attendance-6-20', NULL, '7b2b510e-dab0-4f0f-9aae-f1d27c9de59c', 'demo-student-20', 'demo-class-10', 'demo-section-10-2', NULL, '2026-07-26 18:00:00.000', 'present', NULL, '2026-08-02 08:11:10.921', '2026-08-02 08:57:57.834'),
('demo-attendance-6-3', NULL, '7b2b510e-dab0-4f0f-9aae-f1d27c9de59c', 'demo-student-3', 'demo-class-6', 'demo-section-6-1', NULL, '2026-07-26 18:00:00.000', 'present', NULL, '2026-08-02 08:11:10.830', '2026-08-02 08:57:57.748'),
('demo-attendance-6-4', NULL, '7b2b510e-dab0-4f0f-9aae-f1d27c9de59c', 'demo-student-4', 'demo-class-6', 'demo-section-6-2', NULL, '2026-07-26 18:00:00.000', 'late', 'Arrived after assembly', '2026-08-02 08:11:10.835', '2026-08-02 08:57:57.753'),
('demo-attendance-6-5', NULL, '7b2b510e-dab0-4f0f-9aae-f1d27c9de59c', 'demo-student-5', 'demo-class-7', 'demo-section-7-1', NULL, '2026-07-26 18:00:00.000', 'present', NULL, '2026-08-02 08:11:10.840', '2026-08-02 08:57:57.758'),
('demo-attendance-6-6', NULL, '7b2b510e-dab0-4f0f-9aae-f1d27c9de59c', 'demo-student-6', 'demo-class-7', 'demo-section-7-2', NULL, '2026-07-26 18:00:00.000', 'present', NULL, '2026-08-02 08:11:10.849', '2026-08-02 08:57:57.763'),
('demo-attendance-6-7', NULL, '7b2b510e-dab0-4f0f-9aae-f1d27c9de59c', 'demo-student-7', 'demo-class-7', 'demo-section-7-1', NULL, '2026-07-26 18:00:00.000', 'present', NULL, '2026-08-02 08:11:10.854', '2026-08-02 08:57:57.767'),
('demo-attendance-6-8', NULL, '7b2b510e-dab0-4f0f-9aae-f1d27c9de59c', 'demo-student-8', 'demo-class-7', 'demo-section-7-2', NULL, '2026-07-26 18:00:00.000', 'absent', NULL, '2026-08-02 08:11:10.861', '2026-08-02 08:57:57.774'),
('demo-attendance-6-9', NULL, '7b2b510e-dab0-4f0f-9aae-f1d27c9de59c', 'demo-student-9', 'demo-class-8', 'demo-section-8-1', NULL, '2026-07-26 18:00:00.000', 'present', NULL, '2026-08-02 08:11:10.866', '2026-08-02 08:57:57.780'),
('demo-attendance-7-1', NULL, '7b2b510e-dab0-4f0f-9aae-f1d27c9de59c', 'demo-student-1', 'demo-class-6', 'demo-section-6-1', NULL, '2026-07-25 18:00:00.000', 'present', NULL, '2026-08-02 08:11:10.926', '2026-08-02 08:57:57.839'),
('demo-attendance-7-10', NULL, '7b2b510e-dab0-4f0f-9aae-f1d27c9de59c', 'demo-student-10', 'demo-class-8', 'demo-section-8-2', NULL, '2026-07-25 18:00:00.000', 'present', NULL, '2026-08-02 08:11:10.973', '2026-08-02 08:57:57.885'),
('demo-attendance-7-11', NULL, '7b2b510e-dab0-4f0f-9aae-f1d27c9de59c', 'demo-student-11', 'demo-class-8', 'demo-section-8-1', NULL, '2026-07-25 18:00:00.000', 'present', NULL, '2026-08-02 08:11:10.979', '2026-08-02 08:57:57.889'),
('demo-attendance-7-12', NULL, '7b2b510e-dab0-4f0f-9aae-f1d27c9de59c', 'demo-student-12', 'demo-class-8', 'demo-section-8-2', NULL, '2026-07-25 18:00:00.000', 'late', 'Arrived after assembly', '2026-08-02 08:11:10.984', '2026-08-02 08:57:57.894'),
('demo-attendance-7-13', NULL, '7b2b510e-dab0-4f0f-9aae-f1d27c9de59c', 'demo-student-13', 'demo-class-9', 'demo-section-9-1', NULL, '2026-07-25 18:00:00.000', 'present', NULL, '2026-08-02 08:11:10.988', '2026-08-02 08:57:57.899'),
('demo-attendance-7-14', NULL, '7b2b510e-dab0-4f0f-9aae-f1d27c9de59c', 'demo-student-14', 'demo-class-9', 'demo-section-9-2', NULL, '2026-07-25 18:00:00.000', 'present', NULL, '2026-08-02 08:11:10.995', '2026-08-02 08:57:57.903'),
('demo-attendance-7-15', NULL, '7b2b510e-dab0-4f0f-9aae-f1d27c9de59c', 'demo-student-15', 'demo-class-9', 'demo-section-9-1', NULL, '2026-07-25 18:00:00.000', 'present', NULL, '2026-08-02 08:11:11.001', '2026-08-02 08:57:57.908'),
('demo-attendance-7-16', NULL, '7b2b510e-dab0-4f0f-9aae-f1d27c9de59c', 'demo-student-16', 'demo-class-9', 'demo-section-9-2', NULL, '2026-07-25 18:00:00.000', 'present', NULL, '2026-08-02 08:11:11.006', '2026-08-02 08:57:57.913'),
('demo-attendance-7-17', NULL, '7b2b510e-dab0-4f0f-9aae-f1d27c9de59c', 'demo-student-17', 'demo-class-10', 'demo-section-10-1', NULL, '2026-07-25 18:00:00.000', 'present', NULL, '2026-08-02 08:11:11.013', '2026-08-02 08:57:57.917'),
('demo-attendance-7-18', NULL, '7b2b510e-dab0-4f0f-9aae-f1d27c9de59c', 'demo-student-18', 'demo-class-10', 'demo-section-10-2', NULL, '2026-07-25 18:00:00.000', 'present', NULL, '2026-08-02 08:11:11.017', '2026-08-02 08:57:57.922'),
('demo-attendance-7-19', NULL, '7b2b510e-dab0-4f0f-9aae-f1d27c9de59c', 'demo-student-19', 'demo-class-10', 'demo-section-10-1', NULL, '2026-07-25 18:00:00.000', 'present', NULL, '2026-08-02 08:11:11.022', '2026-08-02 08:57:57.926'),
('demo-attendance-7-2', NULL, '7b2b510e-dab0-4f0f-9aae-f1d27c9de59c', 'demo-student-2', 'demo-class-6', 'demo-section-6-2', NULL, '2026-07-25 18:00:00.000', 'present', NULL, '2026-08-02 08:11:10.932', '2026-08-02 08:57:57.845'),
('demo-attendance-7-20', NULL, '7b2b510e-dab0-4f0f-9aae-f1d27c9de59c', 'demo-student-20', 'demo-class-10', 'demo-section-10-2', NULL, '2026-07-25 18:00:00.000', 'absent', NULL, '2026-08-02 08:11:11.028', '2026-08-02 08:57:57.931'),
('demo-attendance-7-3', NULL, '7b2b510e-dab0-4f0f-9aae-f1d27c9de59c', 'demo-student-3', 'demo-class-6', 'demo-section-6-1', NULL, '2026-07-25 18:00:00.000', 'late', 'Arrived after assembly', '2026-08-02 08:11:10.937', '2026-08-02 08:57:57.850'),
('demo-attendance-7-4', NULL, '7b2b510e-dab0-4f0f-9aae-f1d27c9de59c', 'demo-student-4', 'demo-class-6', 'demo-section-6-2', NULL, '2026-07-25 18:00:00.000', 'present', NULL, '2026-08-02 08:11:10.942', '2026-08-02 08:57:57.855'),
('demo-attendance-7-5', NULL, '7b2b510e-dab0-4f0f-9aae-f1d27c9de59c', 'demo-student-5', 'demo-class-7', 'demo-section-7-1', NULL, '2026-07-25 18:00:00.000', 'present', NULL, '2026-08-02 08:11:10.948', '2026-08-02 08:57:57.860'),
('demo-attendance-7-6', NULL, '7b2b510e-dab0-4f0f-9aae-f1d27c9de59c', 'demo-student-6', 'demo-class-7', 'demo-section-7-2', NULL, '2026-07-25 18:00:00.000', 'present', NULL, '2026-08-02 08:11:10.952', '2026-08-02 08:57:57.865'),
('demo-attendance-7-7', NULL, '7b2b510e-dab0-4f0f-9aae-f1d27c9de59c', 'demo-student-7', 'demo-class-7', 'demo-section-7-1', NULL, '2026-07-25 18:00:00.000', 'absent', NULL, '2026-08-02 08:11:10.957', '2026-08-02 08:57:57.870'),
('demo-attendance-7-8', NULL, '7b2b510e-dab0-4f0f-9aae-f1d27c9de59c', 'demo-student-8', 'demo-class-7', 'demo-section-7-2', NULL, '2026-07-25 18:00:00.000', 'present', NULL, '2026-08-02 08:11:10.963', '2026-08-02 08:57:57.875'),
('demo-attendance-7-9', NULL, '7b2b510e-dab0-4f0f-9aae-f1d27c9de59c', 'demo-student-9', 'demo-class-8', 'demo-section-8-1', NULL, '2026-07-25 18:00:00.000', 'present', NULL, '2026-08-02 08:11:10.967', '2026-08-02 08:57:57.880'),
('demo-attendance-8-1', NULL, '7b2b510e-dab0-4f0f-9aae-f1d27c9de59c', 'demo-student-1', 'demo-class-6', 'demo-section-6-1', NULL, '2026-07-24 18:00:00.000', 'present', NULL, '2026-08-02 08:11:11.033', '2026-08-02 08:57:57.935'),
('demo-attendance-8-10', NULL, '7b2b510e-dab0-4f0f-9aae-f1d27c9de59c', 'demo-student-10', 'demo-class-8', 'demo-section-8-2', NULL, '2026-07-24 18:00:00.000', 'present', NULL, '2026-08-02 08:11:11.076', '2026-08-02 08:57:57.976'),
('demo-attendance-8-11', NULL, '7b2b510e-dab0-4f0f-9aae-f1d27c9de59c', 'demo-student-11', 'demo-class-8', 'demo-section-8-1', NULL, '2026-07-24 18:00:00.000', 'late', 'Arrived after assembly', '2026-08-02 08:11:11.081', '2026-08-02 08:57:57.980'),
('demo-attendance-8-12', NULL, '7b2b510e-dab0-4f0f-9aae-f1d27c9de59c', 'demo-student-12', 'demo-class-8', 'demo-section-8-2', NULL, '2026-07-24 18:00:00.000', 'present', NULL, '2026-08-02 08:11:11.085', '2026-08-02 08:57:57.985'),
('demo-attendance-8-13', NULL, '7b2b510e-dab0-4f0f-9aae-f1d27c9de59c', 'demo-student-13', 'demo-class-9', 'demo-section-9-1', NULL, '2026-07-24 18:00:00.000', 'present', NULL, '2026-08-02 08:11:11.089', '2026-08-02 08:57:57.989'),
('demo-attendance-8-14', NULL, '7b2b510e-dab0-4f0f-9aae-f1d27c9de59c', 'demo-student-14', 'demo-class-9', 'demo-section-9-2', NULL, '2026-07-24 18:00:00.000', 'present', NULL, '2026-08-02 08:11:11.095', '2026-08-02 08:57:57.994'),
('demo-attendance-8-15', NULL, '7b2b510e-dab0-4f0f-9aae-f1d27c9de59c', 'demo-student-15', 'demo-class-9', 'demo-section-9-1', NULL, '2026-07-24 18:00:00.000', 'present', NULL, '2026-08-02 08:11:11.099', '2026-08-02 08:57:57.998'),
('demo-attendance-8-16', NULL, '7b2b510e-dab0-4f0f-9aae-f1d27c9de59c', 'demo-student-16', 'demo-class-9', 'demo-section-9-2', NULL, '2026-07-24 18:00:00.000', 'present', NULL, '2026-08-02 08:11:11.103', '2026-08-02 08:57:58.003'),
('demo-attendance-8-17', NULL, '7b2b510e-dab0-4f0f-9aae-f1d27c9de59c', 'demo-student-17', 'demo-class-10', 'demo-section-10-1', NULL, '2026-07-24 18:00:00.000', 'present', NULL, '2026-08-02 08:11:11.108', '2026-08-02 08:57:58.008'),
('demo-attendance-8-18', NULL, '7b2b510e-dab0-4f0f-9aae-f1d27c9de59c', 'demo-student-18', 'demo-class-10', 'demo-section-10-2', NULL, '2026-07-24 18:00:00.000', 'present', NULL, '2026-08-02 08:11:11.114', '2026-08-02 08:57:58.013'),
('demo-attendance-8-19', NULL, '7b2b510e-dab0-4f0f-9aae-f1d27c9de59c', 'demo-student-19', 'demo-class-10', 'demo-section-10-1', NULL, '2026-07-24 18:00:00.000', 'absent', NULL, '2026-08-02 08:11:11.118', '2026-08-02 08:57:58.017'),
('demo-attendance-8-2', NULL, '7b2b510e-dab0-4f0f-9aae-f1d27c9de59c', 'demo-student-2', 'demo-class-6', 'demo-section-6-2', NULL, '2026-07-24 18:00:00.000', 'late', 'Arrived after assembly', '2026-08-02 08:11:11.038', '2026-08-02 08:57:57.940'),
('demo-attendance-8-20', NULL, '7b2b510e-dab0-4f0f-9aae-f1d27c9de59c', 'demo-student-20', 'demo-class-10', 'demo-section-10-2', NULL, '2026-07-24 18:00:00.000', 'late', 'Arrived after assembly', '2026-08-02 08:11:11.124', '2026-08-02 08:57:58.024'),
('demo-attendance-8-3', NULL, '7b2b510e-dab0-4f0f-9aae-f1d27c9de59c', 'demo-student-3', 'demo-class-6', 'demo-section-6-1', NULL, '2026-07-24 18:00:00.000', 'present', NULL, '2026-08-02 08:11:11.043', '2026-08-02 08:57:57.944'),
('demo-attendance-8-4', NULL, '7b2b510e-dab0-4f0f-9aae-f1d27c9de59c', 'demo-student-4', 'demo-class-6', 'demo-section-6-2', NULL, '2026-07-24 18:00:00.000', 'present', NULL, '2026-08-02 08:11:11.048', '2026-08-02 08:57:57.949'),
('demo-attendance-8-5', NULL, '7b2b510e-dab0-4f0f-9aae-f1d27c9de59c', 'demo-student-5', 'demo-class-7', 'demo-section-7-1', NULL, '2026-07-24 18:00:00.000', 'present', NULL, '2026-08-02 08:11:11.052', '2026-08-02 08:57:57.953'),
('demo-attendance-8-6', NULL, '7b2b510e-dab0-4f0f-9aae-f1d27c9de59c', 'demo-student-6', 'demo-class-7', 'demo-section-7-2', NULL, '2026-07-24 18:00:00.000', 'absent', NULL, '2026-08-02 08:11:11.056', '2026-08-02 08:57:57.958'),
('demo-attendance-8-7', NULL, '7b2b510e-dab0-4f0f-9aae-f1d27c9de59c', 'demo-student-7', 'demo-class-7', 'demo-section-7-1', NULL, '2026-07-24 18:00:00.000', 'present', NULL, '2026-08-02 08:11:11.062', '2026-08-02 08:57:57.962'),
('demo-attendance-8-8', NULL, '7b2b510e-dab0-4f0f-9aae-f1d27c9de59c', 'demo-student-8', 'demo-class-7', 'demo-section-7-2', NULL, '2026-07-24 18:00:00.000', 'present', NULL, '2026-08-02 08:11:11.067', '2026-08-02 08:57:57.967'),
('demo-attendance-8-9', NULL, '7b2b510e-dab0-4f0f-9aae-f1d27c9de59c', 'demo-student-9', 'demo-class-8', 'demo-section-8-1', NULL, '2026-07-24 18:00:00.000', 'present', NULL, '2026-08-02 08:11:11.071', '2026-08-02 08:57:57.971'),
('demo-attendance-9-1', NULL, '7b2b510e-dab0-4f0f-9aae-f1d27c9de59c', 'demo-student-1', 'demo-class-6', 'demo-section-6-1', NULL, '2026-07-23 18:00:00.000', 'late', 'Arrived after assembly', '2026-08-02 08:11:11.131', '2026-08-02 08:57:58.030'),
('demo-attendance-9-10', NULL, '7b2b510e-dab0-4f0f-9aae-f1d27c9de59c', 'demo-student-10', 'demo-class-8', 'demo-section-8-2', NULL, '2026-07-23 18:00:00.000', 'late', 'Arrived after assembly', '2026-08-02 08:11:11.176', '2026-08-02 08:57:58.091'),
('demo-attendance-9-11', NULL, '7b2b510e-dab0-4f0f-9aae-f1d27c9de59c', 'demo-student-11', 'demo-class-8', 'demo-section-8-1', NULL, '2026-07-23 18:00:00.000', 'present', NULL, '2026-08-02 08:11:11.181', '2026-08-02 08:57:58.116'),
('demo-attendance-9-12', NULL, '7b2b510e-dab0-4f0f-9aae-f1d27c9de59c', 'demo-student-12', 'demo-class-8', 'demo-section-8-2', NULL, '2026-07-23 18:00:00.000', 'present', NULL, '2026-08-02 08:11:11.185', '2026-08-02 08:57:58.130'),
('demo-attendance-9-13', NULL, '7b2b510e-dab0-4f0f-9aae-f1d27c9de59c', 'demo-student-13', 'demo-class-9', 'demo-section-9-1', NULL, '2026-07-23 18:00:00.000', 'present', NULL, '2026-08-02 08:11:11.190', '2026-08-02 08:57:58.136'),
('demo-attendance-9-14', NULL, '7b2b510e-dab0-4f0f-9aae-f1d27c9de59c', 'demo-student-14', 'demo-class-9', 'demo-section-9-2', NULL, '2026-07-23 18:00:00.000', 'present', NULL, '2026-08-02 08:11:11.196', '2026-08-02 08:57:58.155'),
('demo-attendance-9-15', NULL, '7b2b510e-dab0-4f0f-9aae-f1d27c9de59c', 'demo-student-15', 'demo-class-9', 'demo-section-9-1', NULL, '2026-07-23 18:00:00.000', 'present', NULL, '2026-08-02 08:11:11.201', '2026-08-02 08:57:58.178'),
('demo-attendance-9-16', NULL, '7b2b510e-dab0-4f0f-9aae-f1d27c9de59c', 'demo-student-16', 'demo-class-9', 'demo-section-9-2', NULL, '2026-07-23 18:00:00.000', 'present', NULL, '2026-08-02 08:11:11.205', '2026-08-02 08:57:58.189'),
('demo-attendance-9-17', NULL, '7b2b510e-dab0-4f0f-9aae-f1d27c9de59c', 'demo-student-17', 'demo-class-10', 'demo-section-10-1', NULL, '2026-07-23 18:00:00.000', 'present', NULL, '2026-08-02 08:11:11.211', '2026-08-02 08:57:58.198'),
('demo-attendance-9-18', NULL, '7b2b510e-dab0-4f0f-9aae-f1d27c9de59c', 'demo-student-18', 'demo-class-10', 'demo-section-10-2', NULL, '2026-07-23 18:00:00.000', 'absent', NULL, '2026-08-02 08:11:11.215', '2026-08-02 08:57:58.210'),
('demo-attendance-9-19', NULL, '7b2b510e-dab0-4f0f-9aae-f1d27c9de59c', 'demo-student-19', 'demo-class-10', 'demo-section-10-1', NULL, '2026-07-23 18:00:00.000', 'late', 'Arrived after assembly', '2026-08-02 08:11:11.220', '2026-08-02 08:57:58.218'),
('demo-attendance-9-2', NULL, '7b2b510e-dab0-4f0f-9aae-f1d27c9de59c', 'demo-student-2', 'demo-class-6', 'demo-section-6-2', NULL, '2026-07-23 18:00:00.000', 'present', NULL, '2026-08-02 08:11:11.138', '2026-08-02 08:57:58.037'),
('demo-attendance-9-20', NULL, '7b2b510e-dab0-4f0f-9aae-f1d27c9de59c', 'demo-student-20', 'demo-class-10', 'demo-section-10-2', NULL, '2026-07-23 18:00:00.000', 'present', NULL, '2026-08-02 08:11:11.224', '2026-08-02 08:57:58.225'),
('demo-attendance-9-3', NULL, '7b2b510e-dab0-4f0f-9aae-f1d27c9de59c', 'demo-student-3', 'demo-class-6', 'demo-section-6-1', NULL, '2026-07-23 18:00:00.000', 'present', NULL, '2026-08-02 08:11:11.144', '2026-08-02 08:57:58.044'),
('demo-attendance-9-4', NULL, '7b2b510e-dab0-4f0f-9aae-f1d27c9de59c', 'demo-student-4', 'demo-class-6', 'demo-section-6-2', NULL, '2026-07-23 18:00:00.000', 'present', NULL, '2026-08-02 08:11:11.148', '2026-08-02 08:57:58.050'),
('demo-attendance-9-5', NULL, '7b2b510e-dab0-4f0f-9aae-f1d27c9de59c', 'demo-student-5', 'demo-class-7', 'demo-section-7-1', NULL, '2026-07-23 18:00:00.000', 'absent', NULL, '2026-08-02 08:11:11.153', '2026-08-02 08:57:58.057'),
('demo-attendance-9-6', NULL, '7b2b510e-dab0-4f0f-9aae-f1d27c9de59c', 'demo-student-6', 'demo-class-7', 'demo-section-7-2', NULL, '2026-07-23 18:00:00.000', 'present', NULL, '2026-08-02 08:11:11.157', '2026-08-02 08:57:58.063'),
('demo-attendance-9-7', NULL, '7b2b510e-dab0-4f0f-9aae-f1d27c9de59c', 'demo-student-7', 'demo-class-7', 'demo-section-7-1', NULL, '2026-07-23 18:00:00.000', 'present', NULL, '2026-08-02 08:11:11.162', '2026-08-02 08:57:58.069'),
('demo-attendance-9-8', NULL, '7b2b510e-dab0-4f0f-9aae-f1d27c9de59c', 'demo-student-8', 'demo-class-7', 'demo-section-7-2', NULL, '2026-07-23 18:00:00.000', 'present', NULL, '2026-08-02 08:11:11.167', '2026-08-02 08:57:58.076'),
('demo-attendance-9-9', NULL, '7b2b510e-dab0-4f0f-9aae-f1d27c9de59c', 'demo-student-9', 'demo-class-8', 'demo-section-8-1', NULL, '2026-07-23 18:00:00.000', 'present', NULL, '2026-08-02 08:11:11.171', '2026-08-02 08:57:58.083'),
('f008b167-fa34-42ce-9b92-022e043adbeb', '58fac658-7819-4b30-9fc5-216357058f70', '7b2b510e-dab0-4f0f-9aae-f1d27c9de59c', 'demo-student-15', 'demo-class-9', 'demo-section-9-1', 'demo-subject-ban', '2026-08-01 18:00:00.000', 'present', NULL, '2026-08-02 09:36:36.166', '2026-08-02 09:36:36.166');

-- --------------------------------------------------------

--
-- Table structure for table `student_documents`
--

CREATE TABLE `student_documents` (
  `id` varchar(191) NOT NULL,
  `student_id` varchar(191) NOT NULL,
  `document_type` varchar(191) NOT NULL,
  `title` varchar(191) NOT NULL,
  `file_url` varchar(191) NOT NULL,
  `file_size` int(11) DEFAULT NULL,
  `uploaded_at` datetime(3) NOT NULL DEFAULT current_timestamp(3)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `student_enrollments`
--

CREATE TABLE `student_enrollments` (
  `id` varchar(191) NOT NULL,
  `school_id` varchar(191) NOT NULL,
  `student_id` varchar(191) NOT NULL,
  `academic_year_id` varchar(191) NOT NULL,
  `session_id` varchar(191) DEFAULT NULL,
  `class_id` varchar(191) NOT NULL,
  `section_id` varchar(191) NOT NULL,
  `group_id` varchar(191) DEFAULT NULL,
  `roll_number` int(11) NOT NULL,
  `registration_number` varchar(191) DEFAULT NULL,
  `enrollment_type` varchar(191) NOT NULL DEFAULT 'REGULAR',
  `enrollment_status` varchar(191) NOT NULL DEFAULT 'ACTIVE',
  `start_date` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `end_date` datetime(3) DEFAULT NULL,
  `created_at` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updated_at` datetime(3) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `student_enrollments`
--

INSERT INTO `student_enrollments` (`id`, `school_id`, `student_id`, `academic_year_id`, `session_id`, `class_id`, `section_id`, `group_id`, `roll_number`, `registration_number`, `enrollment_type`, `enrollment_status`, `start_date`, `end_date`, `created_at`, `updated_at`) VALUES
('def54a38-4374-4579-83a7-0f7cda285270', '7b2b510e-dab0-4f0f-9aae-f1d27c9de59c', 'e324ef61-2e01-44bb-8e0b-3d5690d33452', 'demo-academic-year-current', NULL, 'demo-class-6', 'demo-section-6-1', NULL, 4, NULL, 'REGULAR', 'ACTIVE', '2026-08-10 10:37:48.376', NULL, '2026-08-10 10:37:48.381', '2026-08-10 10:37:48.381'),
('demo-enrollment-1', '7b2b510e-dab0-4f0f-9aae-f1d27c9de59c', 'demo-student-1', 'demo-academic-year-current', 'demo-session-current', 'demo-class-6', 'demo-section-6-1', NULL, 1, 'REG-2026-0001', 'REGULAR', 'ACTIVE', '2026-01-05 03:00:00.000', NULL, '2026-08-02 08:11:09.069', '2026-08-02 08:57:56.464'),
('demo-enrollment-10', '7b2b510e-dab0-4f0f-9aae-f1d27c9de59c', 'demo-student-10', 'demo-academic-year-current', 'demo-session-current', 'demo-class-8', 'demo-section-8-2', NULL, 2, 'REG-2026-0010', 'REGULAR', 'ACTIVE', '2026-01-05 03:00:00.000', NULL, '2026-08-02 08:11:09.313', '2026-08-02 08:57:56.743'),
('demo-enrollment-11', '7b2b510e-dab0-4f0f-9aae-f1d27c9de59c', 'demo-student-11', 'demo-academic-year-current', 'demo-session-current', 'demo-class-8', 'demo-section-8-1', NULL, 3, 'REG-2026-0011', 'REGULAR', 'ACTIVE', '2026-01-05 03:00:00.000', NULL, '2026-08-02 08:11:09.332', '2026-08-02 08:57:56.783'),
('demo-enrollment-12', '7b2b510e-dab0-4f0f-9aae-f1d27c9de59c', 'demo-student-12', 'demo-academic-year-current', 'demo-session-current', 'demo-class-8', 'demo-section-8-2', NULL, 4, 'REG-2026-0012', 'REGULAR', 'ACTIVE', '2026-01-05 03:00:00.000', NULL, '2026-08-02 08:11:09.352', '2026-08-02 08:57:56.823'),
('demo-enrollment-13', '7b2b510e-dab0-4f0f-9aae-f1d27c9de59c', 'demo-student-13', 'demo-academic-year-current', 'demo-session-current', 'demo-class-9', 'demo-section-9-1', 'demo-group-science', 1, 'REG-2026-0013', 'REGULAR', 'ACTIVE', '2026-01-05 03:00:00.000', NULL, '2026-08-02 08:11:09.368', '2026-08-02 08:57:56.851'),
('demo-enrollment-14', '7b2b510e-dab0-4f0f-9aae-f1d27c9de59c', 'demo-student-14', 'demo-academic-year-current', 'demo-session-current', 'demo-class-9', 'demo-section-9-2', 'demo-group-science', 2, 'REG-2026-0014', 'REGULAR', 'ACTIVE', '2026-01-05 03:00:00.000', NULL, '2026-08-02 08:11:09.387', '2026-08-02 08:57:56.876'),
('demo-enrollment-15', '7b2b510e-dab0-4f0f-9aae-f1d27c9de59c', 'demo-student-15', 'demo-academic-year-current', 'demo-session-current', 'demo-class-9', 'demo-section-9-1', 'demo-group-science', 3, 'REG-2026-0015', 'REGULAR', 'ACTIVE', '2026-01-05 03:00:00.000', NULL, '2026-08-02 08:11:09.407', '2026-08-02 08:57:56.902'),
('demo-enrollment-16', '7b2b510e-dab0-4f0f-9aae-f1d27c9de59c', 'demo-student-16', 'demo-academic-year-current', 'demo-session-current', 'demo-class-9', 'demo-section-9-2', 'demo-group-science', 4, 'REG-2026-0016', 'REGULAR', 'ACTIVE', '2026-01-05 03:00:00.000', NULL, '2026-08-02 08:11:09.454', '2026-08-02 08:57:56.934'),
('demo-enrollment-17', '7b2b510e-dab0-4f0f-9aae-f1d27c9de59c', 'demo-student-17', 'demo-academic-year-current', 'demo-session-current', 'demo-class-10', 'demo-section-10-1', 'demo-group-science', 1, 'REG-2026-0017', 'REGULAR', 'ACTIVE', '2026-01-05 03:00:00.000', NULL, '2026-08-02 08:11:09.521', '2026-08-02 08:57:56.958'),
('demo-enrollment-18', '7b2b510e-dab0-4f0f-9aae-f1d27c9de59c', 'demo-student-18', 'demo-academic-year-current', 'demo-session-current', 'demo-class-10', 'demo-section-10-2', 'demo-group-science', 2, 'REG-2026-0018', 'REGULAR', 'ACTIVE', '2026-01-05 03:00:00.000', NULL, '2026-08-02 08:11:09.548', '2026-08-02 08:57:56.978'),
('demo-enrollment-19', '7b2b510e-dab0-4f0f-9aae-f1d27c9de59c', 'demo-student-19', 'demo-academic-year-current', 'demo-session-current', 'demo-class-10', 'demo-section-10-1', 'demo-group-science', 3, 'REG-2026-0019', 'REGULAR', 'ACTIVE', '2026-01-05 03:00:00.000', NULL, '2026-08-02 08:11:09.572', '2026-08-02 08:57:56.996'),
('demo-enrollment-2', '7b2b510e-dab0-4f0f-9aae-f1d27c9de59c', 'demo-student-2', 'demo-academic-year-current', 'demo-session-current', 'demo-class-6', 'demo-section-6-2', NULL, 2, 'REG-2026-0002', 'REGULAR', 'ACTIVE', '2026-01-05 03:00:00.000', NULL, '2026-08-02 08:11:09.114', '2026-08-02 08:57:56.495'),
('demo-enrollment-20', '7b2b510e-dab0-4f0f-9aae-f1d27c9de59c', 'demo-student-20', 'demo-academic-year-current', 'demo-session-current', 'demo-class-10', 'demo-section-10-2', 'demo-group-science', 4, 'REG-2026-0020', 'REGULAR', 'ACTIVE', '2026-01-05 03:00:00.000', NULL, '2026-08-02 08:11:09.598', '2026-08-02 08:57:57.014'),
('demo-enrollment-3', '7b2b510e-dab0-4f0f-9aae-f1d27c9de59c', 'demo-student-3', 'demo-academic-year-current', 'demo-session-current', 'demo-class-6', 'demo-section-6-1', NULL, 3, 'REG-2026-0003', 'REGULAR', 'ACTIVE', '2026-01-05 03:00:00.000', NULL, '2026-08-02 08:11:09.144', '2026-08-02 08:57:56.517'),
('demo-enrollment-4', '7b2b510e-dab0-4f0f-9aae-f1d27c9de59c', 'demo-student-4', 'demo-academic-year-current', 'demo-session-current', 'demo-class-6', 'demo-section-6-2', NULL, 4, 'REG-2026-0004', 'REGULAR', 'ACTIVE', '2026-01-05 03:00:00.000', NULL, '2026-08-02 08:11:09.164', '2026-08-02 08:57:56.556'),
('demo-enrollment-5', '7b2b510e-dab0-4f0f-9aae-f1d27c9de59c', 'demo-student-5', 'demo-academic-year-current', 'demo-session-current', 'demo-class-7', 'demo-section-7-1', NULL, 1, 'REG-2026-0005', 'REGULAR', 'ACTIVE', '2026-01-05 03:00:00.000', NULL, '2026-08-02 08:11:09.187', '2026-08-02 08:57:56.592'),
('demo-enrollment-6', '7b2b510e-dab0-4f0f-9aae-f1d27c9de59c', 'demo-student-6', 'demo-academic-year-current', 'demo-session-current', 'demo-class-7', 'demo-section-7-2', NULL, 2, 'REG-2026-0006', 'REGULAR', 'ACTIVE', '2026-01-05 03:00:00.000', NULL, '2026-08-02 08:11:09.214', '2026-08-02 08:57:56.623'),
('demo-enrollment-7', '7b2b510e-dab0-4f0f-9aae-f1d27c9de59c', 'demo-student-7', 'demo-academic-year-current', 'demo-session-current', 'demo-class-7', 'demo-section-7-1', NULL, 3, 'REG-2026-0007', 'REGULAR', 'ACTIVE', '2026-01-05 03:00:00.000', NULL, '2026-08-02 08:11:09.241', '2026-08-02 08:57:56.646'),
('demo-enrollment-8', '7b2b510e-dab0-4f0f-9aae-f1d27c9de59c', 'demo-student-8', 'demo-academic-year-current', 'demo-session-current', 'demo-class-7', 'demo-section-7-2', NULL, 4, 'REG-2026-0008', 'REGULAR', 'ACTIVE', '2026-01-05 03:00:00.000', NULL, '2026-08-02 08:11:09.267', '2026-08-02 08:57:56.678'),
('demo-enrollment-9', '7b2b510e-dab0-4f0f-9aae-f1d27c9de59c', 'demo-student-9', 'demo-academic-year-current', 'demo-session-current', 'demo-class-8', 'demo-section-8-1', NULL, 1, 'REG-2026-0009', 'REGULAR', 'ACTIVE', '2026-01-05 03:00:00.000', NULL, '2026-08-02 08:11:09.295', '2026-08-02 08:57:56.721');

-- --------------------------------------------------------

--
-- Table structure for table `student_fee_assignments`
--

CREATE TABLE `student_fee_assignments` (
  `id` varchar(191) NOT NULL,
  `school_id` varchar(191) NOT NULL,
  `student_id` varchar(191) NOT NULL,
  `fee_type_id` varchar(191) NOT NULL,
  `custom_amount` decimal(12,2) DEFAULT NULL,
  `effective_from` datetime(3) NOT NULL,
  `effective_to` datetime(3) DEFAULT NULL,
  `status` varchar(191) NOT NULL DEFAULT 'ACTIVE',
  `created_at` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updated_at` datetime(3) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `student_guardians`
--

CREATE TABLE `student_guardians` (
  `id` varchar(191) NOT NULL,
  `student_id` varchar(191) NOT NULL,
  `guardian_id` varchar(191) NOT NULL,
  `is_primary` tinyint(1) NOT NULL DEFAULT 1,
  `is_financial_contact` tinyint(1) NOT NULL DEFAULT 1,
  `is_emergency_contact` tinyint(1) NOT NULL DEFAULT 1,
  `relationship` varchar(191) NOT NULL DEFAULT 'PARENT',
  `status` enum('ACTIVE','INACTIVE','SUSPENDED','PENDING') NOT NULL DEFAULT 'ACTIVE',
  `created_at` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updated_at` datetime(3) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `student_guardians`
--

INSERT INTO `student_guardians` (`id`, `student_id`, `guardian_id`, `is_primary`, `is_financial_contact`, `is_emergency_contact`, `relationship`, `status`, `created_at`, `updated_at`) VALUES
('02fad296-bb42-47f7-ade5-b9864d20bf73', 'demo-student-5', 'demo-guardian-5', 1, 1, 1, 'FATHER', 'ACTIVE', '2026-08-02 08:11:09.201', '2026-08-02 08:57:56.606'),
('03dbf4cd-0835-4666-a797-0a18b0c71c20', 'demo-student-18', 'demo-guardian-18', 1, 1, 1, 'MOTHER', 'ACTIVE', '2026-08-02 08:11:09.563', '2026-08-02 08:57:56.986'),
('06b0d5a5-e6ab-463d-901d-535c43e71cf4', 'demo-student-2', 'demo-guardian-2', 1, 1, 1, 'MOTHER', 'ACTIVE', '2026-08-02 08:11:09.131', '2026-08-02 08:57:56.505'),
('336e6a1e-c72b-4c44-b299-bc3aabb33534', 'demo-student-8', 'demo-guardian-8', 1, 1, 1, 'MOTHER', 'ACTIVE', '2026-08-02 08:11:09.285', '2026-08-02 08:57:56.710'),
('35f86687-881d-4466-b8a1-7d047b79a644', 'demo-student-9', 'demo-guardian-9', 1, 1, 1, 'FATHER', 'ACTIVE', '2026-08-02 08:11:09.303', '2026-08-02 08:57:56.731'),
('367e7d45-d1f0-4bc2-8477-61455ccacb37', 'demo-student-1', 'demo-guardian-1', 1, 1, 1, 'FATHER', 'ACTIVE', '2026-08-02 08:11:09.091', '2026-08-02 08:57:56.480'),
('5e73dbbc-ae25-41af-85f2-6a5c0140565a', 'demo-student-7', 'demo-guardian-7', 1, 1, 1, 'FATHER', 'ACTIVE', '2026-08-02 08:11:09.254', '2026-08-02 08:57:56.663'),
('62474ab3-4d69-464e-a56f-6626f9889054', 'demo-student-15', 'demo-guardian-15', 1, 1, 1, 'FATHER', 'ACTIVE', '2026-08-02 08:11:09.428', '2026-08-02 08:57:56.921'),
('66450e33-b237-4167-8203-7ef3a15e89dd', 'demo-student-16', 'demo-guardian-16', 1, 1, 1, 'MOTHER', 'ACTIVE', '2026-08-02 08:11:09.505', '2026-08-02 08:57:56.945'),
('6bdb8bd4-2f16-4c13-aa8c-4e443b6b55c5', 'demo-student-13', 'demo-guardian-13', 1, 1, 1, 'FATHER', 'ACTIVE', '2026-08-02 08:11:09.377', '2026-08-02 08:57:56.862'),
('6c057043-538d-43fe-a131-a2403e5f7e22', 'demo-student-19', 'demo-guardian-19', 1, 1, 1, 'FATHER', 'ACTIVE', '2026-08-02 08:11:09.584', '2026-08-02 08:57:57.004'),
('7ceb8db0-5a38-46f5-9c94-8e841d47dac0', 'demo-student-6', 'demo-guardian-6', 1, 1, 1, 'MOTHER', 'ACTIVE', '2026-08-02 08:11:09.224', '2026-08-02 08:57:56.634'),
('a44e759c-5f1c-4a5f-a6bc-1b49420591f3', 'demo-student-4', 'demo-guardian-4', 1, 1, 1, 'MOTHER', 'ACTIVE', '2026-08-02 08:11:09.174', '2026-08-02 08:57:56.574'),
('a9981047-a8f6-45b4-b20b-4b444b7e426d', 'demo-student-11', 'demo-guardian-11', 1, 1, 1, 'FATHER', 'ACTIVE', '2026-08-02 08:11:09.344', '2026-08-02 08:57:56.801'),
('b9a2678b-8af4-454f-a2c4-3916c192ea58', 'demo-student-17', 'demo-guardian-17', 1, 1, 1, 'FATHER', 'ACTIVE', '2026-08-02 08:11:09.538', '2026-08-02 08:57:56.967'),
('d276b4bf-0335-4e7c-a598-d16561b9548c', 'demo-student-10', 'demo-guardian-10', 1, 1, 1, 'MOTHER', 'ACTIVE', '2026-08-02 08:11:09.321', '2026-08-02 08:57:56.760'),
('de704836-fcf7-4709-a154-5ae7f3f9595c', 'demo-student-12', 'demo-guardian-12', 1, 1, 1, 'MOTHER', 'ACTIVE', '2026-08-02 08:11:09.360', '2026-08-02 08:57:56.838'),
('ead3e864-e753-4be2-b64c-7d20321213a3', 'demo-student-20', 'demo-guardian-20', 1, 1, 1, 'MOTHER', 'ACTIVE', '2026-08-02 08:11:09.611', '2026-08-02 08:57:57.024'),
('f0fee913-f14a-402f-935c-393b0c24e4ec', 'demo-student-14', 'demo-guardian-14', 1, 1, 1, 'MOTHER', 'ACTIVE', '2026-08-02 08:11:09.396', '2026-08-02 08:57:56.886'),
('f51963c4-408f-4ca3-a829-9082dabf344d', 'demo-student-3', 'demo-guardian-3', 1, 1, 1, 'FATHER', 'ACTIVE', '2026-08-02 08:11:09.153', '2026-08-02 08:57:56.535');

-- --------------------------------------------------------

--
-- Table structure for table `student_invoices`
--

CREATE TABLE `student_invoices` (
  `id` varchar(191) NOT NULL,
  `school_id` varchar(191) NOT NULL,
  `student_id` varchar(191) NOT NULL,
  `enrollment_id` varchar(191) DEFAULT NULL,
  `academic_year_id` varchar(191) NOT NULL,
  `invoice_number` varchar(191) NOT NULL,
  `billing_year` int(11) NOT NULL,
  `billing_month` int(11) NOT NULL,
  `fee_type_id` varchar(191) DEFAULT NULL,
  `issue_date` datetime(3) NOT NULL,
  `due_date` datetime(3) NOT NULL,
  `subtotal` decimal(12,2) NOT NULL,
  `discount_amount` decimal(12,2) NOT NULL DEFAULT 0.00,
  `scholarship_amount` decimal(12,2) NOT NULL DEFAULT 0.00,
  `waiver_amount` decimal(12,2) NOT NULL DEFAULT 0.00,
  `fine_amount` decimal(12,2) NOT NULL DEFAULT 0.00,
  `previous_due` decimal(12,2) NOT NULL DEFAULT 0.00,
  `totalAmount` decimal(12,2) NOT NULL,
  `paid_amount` decimal(12,2) NOT NULL DEFAULT 0.00,
  `dueAmount` decimal(12,2) NOT NULL,
  `payment_status` varchar(191) NOT NULL DEFAULT 'unpaid',
  `created_at` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updated_at` datetime(3) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `student_invoices`
--

INSERT INTO `student_invoices` (`id`, `school_id`, `student_id`, `enrollment_id`, `academic_year_id`, `invoice_number`, `billing_year`, `billing_month`, `fee_type_id`, `issue_date`, `due_date`, `subtotal`, `discount_amount`, `scholarship_amount`, `waiver_amount`, `fine_amount`, `previous_due`, `totalAmount`, `paid_amount`, `dueAmount`, `payment_status`, `created_at`, `updated_at`) VALUES
('demo-exam-invoice-1', '7b2b510e-dab0-4f0f-9aae-f1d27c9de59c', 'demo-student-1', 'demo-enrollment-1', 'demo-academic-year-current', 'DEMO-EXAM-INV-2026-1', 2026, 8, 'db02f6ac-4039-4179-b7d1-c1ca91a3e05f', '2026-07-31 18:00:00.000', '2026-08-09 08:57:54.944', 800.00, 0.00, 0.00, 0.00, 0.00, 0.00, 800.00, 800.00, 0.00, 'paid', '2026-08-02 08:11:12.305', '2026-08-02 08:57:59.000'),
('demo-exam-invoice-2', '7b2b510e-dab0-4f0f-9aae-f1d27c9de59c', 'demo-student-2', 'demo-enrollment-2', 'demo-academic-year-current', 'DEMO-EXAM-INV-2026-2', 2026, 8, 'db02f6ac-4039-4179-b7d1-c1ca91a3e05f', '2026-07-31 18:00:00.000', '2026-08-09 08:57:54.944', 800.00, 0.00, 0.00, 0.00, 0.00, 0.00, 800.00, 800.00, 0.00, 'paid', '2026-08-02 08:11:12.309', '2026-08-02 08:57:59.005'),
('demo-exam-invoice-3', '7b2b510e-dab0-4f0f-9aae-f1d27c9de59c', 'demo-student-3', 'demo-enrollment-3', 'demo-academic-year-current', 'DEMO-EXAM-INV-2026-3', 2026, 8, 'db02f6ac-4039-4179-b7d1-c1ca91a3e05f', '2026-07-31 18:00:00.000', '2026-08-09 08:57:54.944', 800.00, 0.00, 0.00, 0.00, 0.00, 0.00, 800.00, 800.00, 0.00, 'paid', '2026-08-02 08:11:12.318', '2026-08-02 08:57:59.010'),
('demo-exam-invoice-4', '7b2b510e-dab0-4f0f-9aae-f1d27c9de59c', 'demo-student-4', 'demo-enrollment-4', 'demo-academic-year-current', 'DEMO-EXAM-INV-2026-4', 2026, 8, 'db02f6ac-4039-4179-b7d1-c1ca91a3e05f', '2026-07-31 18:00:00.000', '2026-08-09 08:57:54.944', 800.00, 0.00, 0.00, 0.00, 0.00, 0.00, 800.00, 800.00, 0.00, 'paid', '2026-08-02 08:11:12.322', '2026-08-02 08:57:59.014'),
('demo-exam-invoice-5', '7b2b510e-dab0-4f0f-9aae-f1d27c9de59c', 'demo-student-5', 'demo-enrollment-5', 'demo-academic-year-current', 'DEMO-EXAM-INV-2026-5', 2026, 8, 'db02f6ac-4039-4179-b7d1-c1ca91a3e05f', '2026-07-31 18:00:00.000', '2026-08-09 08:57:54.944', 800.00, 0.00, 0.00, 0.00, 0.00, 0.00, 800.00, 0.00, 800.00, 'unpaid', '2026-08-02 08:11:12.325', '2026-08-02 08:57:59.017'),
('demo-exam-invoice-6', '7b2b510e-dab0-4f0f-9aae-f1d27c9de59c', 'demo-student-6', 'demo-enrollment-6', 'demo-academic-year-current', 'DEMO-EXAM-INV-2026-6', 2026, 8, 'db02f6ac-4039-4179-b7d1-c1ca91a3e05f', '2026-07-31 18:00:00.000', '2026-08-09 08:57:54.944', 800.00, 0.00, 0.00, 0.00, 0.00, 0.00, 800.00, 0.00, 800.00, 'unpaid', '2026-08-02 08:11:12.332', '2026-08-02 08:57:59.021'),
('demo-student-invoice-1', '7b2b510e-dab0-4f0f-9aae-f1d27c9de59c', 'demo-student-1', 'demo-enrollment-1', 'demo-academic-year-current', 'DEMO-INV-2026-8-001', 2026, 8, '3af36d4d-9273-4081-896f-3043b664a317', '2026-07-31 18:00:00.000', '2026-08-10 03:00:00.000', 1800.00, 0.00, 0.00, 0.00, 0.00, 0.00, 1800.00, 1800.00, 0.00, 'paid', '2026-08-02 08:11:11.857', '2026-08-02 08:57:58.715'),
('demo-student-invoice-10', '7b2b510e-dab0-4f0f-9aae-f1d27c9de59c', 'demo-student-10', 'demo-enrollment-10', 'demo-academic-year-current', 'DEMO-INV-2026-8-010', 2026, 8, '3af36d4d-9273-4081-896f-3043b664a317', '2026-07-31 18:00:00.000', '2026-08-10 03:00:00.000', 1800.00, 0.00, 0.00, 0.00, 0.00, 0.00, 1800.00, 1000.00, 800.00, 'partially_paid', '2026-08-02 08:11:12.163', '2026-08-02 08:57:58.868'),
('demo-student-invoice-11', '7b2b510e-dab0-4f0f-9aae-f1d27c9de59c', 'demo-student-11', 'demo-enrollment-11', 'demo-academic-year-current', 'DEMO-INV-2026-8-011', 2026, 8, '3af36d4d-9273-4081-896f-3043b664a317', '2026-07-31 18:00:00.000', '2026-08-10 03:00:00.000', 1800.00, 0.00, 0.00, 0.00, 0.00, 0.00, 1800.00, 0.00, 1800.00, 'unpaid', '2026-08-02 08:11:12.172', '2026-08-02 08:57:58.879'),
('demo-student-invoice-12', '7b2b510e-dab0-4f0f-9aae-f1d27c9de59c', 'demo-student-12', 'demo-enrollment-12', 'demo-academic-year-current', 'DEMO-INV-2026-8-012', 2026, 8, '3af36d4d-9273-4081-896f-3043b664a317', '2026-07-31 18:00:00.000', '2026-08-10 03:00:00.000', 1800.00, 0.00, 0.00, 0.00, 0.00, 0.00, 1800.00, 0.00, 1800.00, 'unpaid', '2026-08-02 08:11:12.183', '2026-08-02 08:57:58.889'),
('demo-student-invoice-13', '7b2b510e-dab0-4f0f-9aae-f1d27c9de59c', 'demo-student-13', 'demo-enrollment-13', 'demo-academic-year-current', 'DEMO-INV-2026-8-013', 2026, 8, '3af36d4d-9273-4081-896f-3043b664a317', '2026-07-31 18:00:00.000', '2026-08-10 03:00:00.000', 1800.00, 0.00, 0.00, 0.00, 0.00, 0.00, 1800.00, 1800.00, 0.00, 'paid', '2026-08-02 08:11:12.193', '2026-08-02 08:57:58.903'),
('demo-student-invoice-14', '7b2b510e-dab0-4f0f-9aae-f1d27c9de59c', 'demo-student-14', 'demo-enrollment-14', 'demo-academic-year-current', 'DEMO-INV-2026-8-014', 2026, 8, '3af36d4d-9273-4081-896f-3043b664a317', '2026-07-31 18:00:00.000', '2026-08-10 03:00:00.000', 1800.00, 0.00, 0.00, 0.00, 0.00, 0.00, 1800.00, 1000.00, 800.00, 'partially_paid', '2026-08-02 08:11:12.206', '2026-08-02 08:57:58.920'),
('demo-student-invoice-15', '7b2b510e-dab0-4f0f-9aae-f1d27c9de59c', 'demo-student-15', 'demo-enrollment-15', 'demo-academic-year-current', 'DEMO-INV-2026-8-015', 2026, 8, '3af36d4d-9273-4081-896f-3043b664a317', '2026-07-31 18:00:00.000', '2026-08-10 03:00:00.000', 1800.00, 0.00, 0.00, 0.00, 0.00, 0.00, 1800.00, 0.00, 1800.00, 'unpaid', '2026-08-02 08:11:12.223', '2026-08-02 08:57:58.934'),
('demo-student-invoice-16', '7b2b510e-dab0-4f0f-9aae-f1d27c9de59c', 'demo-student-16', 'demo-enrollment-16', 'demo-academic-year-current', 'DEMO-INV-2026-8-016', 2026, 8, '3af36d4d-9273-4081-896f-3043b664a317', '2026-07-31 18:00:00.000', '2026-08-10 03:00:00.000', 1800.00, 0.00, 0.00, 0.00, 0.00, 0.00, 1800.00, 0.00, 1800.00, 'unpaid', '2026-08-02 08:11:12.235', '2026-08-02 08:57:58.947'),
('demo-student-invoice-17', '7b2b510e-dab0-4f0f-9aae-f1d27c9de59c', 'demo-student-17', 'demo-enrollment-17', 'demo-academic-year-current', 'DEMO-INV-2026-8-017', 2026, 8, '3af36d4d-9273-4081-896f-3043b664a317', '2026-07-31 18:00:00.000', '2026-08-10 03:00:00.000', 1800.00, 0.00, 0.00, 0.00, 0.00, 0.00, 1800.00, 1800.00, 0.00, 'paid', '2026-08-02 08:11:12.252', '2026-08-02 08:57:58.961'),
('demo-student-invoice-18', '7b2b510e-dab0-4f0f-9aae-f1d27c9de59c', 'demo-student-18', 'demo-enrollment-18', 'demo-academic-year-current', 'DEMO-INV-2026-8-018', 2026, 8, '3af36d4d-9273-4081-896f-3043b664a317', '2026-07-31 18:00:00.000', '2026-08-10 03:00:00.000', 1800.00, 0.00, 0.00, 0.00, 0.00, 0.00, 1800.00, 1000.00, 800.00, 'partially_paid', '2026-08-02 08:11:12.266', '2026-08-02 08:57:58.973'),
('demo-student-invoice-19', '7b2b510e-dab0-4f0f-9aae-f1d27c9de59c', 'demo-student-19', 'demo-enrollment-19', 'demo-academic-year-current', 'DEMO-INV-2026-8-019', 2026, 8, '3af36d4d-9273-4081-896f-3043b664a317', '2026-07-31 18:00:00.000', '2026-08-10 03:00:00.000', 1800.00, 0.00, 0.00, 0.00, 0.00, 0.00, 1800.00, 0.00, 1800.00, 'unpaid', '2026-08-02 08:11:12.275', '2026-08-02 08:57:58.984'),
('demo-student-invoice-2', '7b2b510e-dab0-4f0f-9aae-f1d27c9de59c', 'demo-student-2', 'demo-enrollment-2', 'demo-academic-year-current', 'DEMO-INV-2026-8-002', 2026, 8, '3af36d4d-9273-4081-896f-3043b664a317', '2026-07-31 18:00:00.000', '2026-08-10 03:00:00.000', 1800.00, 0.00, 0.00, 0.00, 0.00, 0.00, 1800.00, 1000.00, 800.00, 'partially_paid', '2026-08-02 08:11:12.009', '2026-08-02 08:57:58.774'),
('demo-student-invoice-20', '7b2b510e-dab0-4f0f-9aae-f1d27c9de59c', 'demo-student-20', 'demo-enrollment-20', 'demo-academic-year-current', 'DEMO-INV-2026-8-020', 2026, 8, '3af36d4d-9273-4081-896f-3043b664a317', '2026-07-31 18:00:00.000', '2026-08-10 03:00:00.000', 1800.00, 0.00, 0.00, 0.00, 0.00, 0.00, 1800.00, 0.00, 1800.00, 'unpaid', '2026-08-02 08:11:12.290', '2026-08-02 08:57:58.994'),
('demo-student-invoice-3', '7b2b510e-dab0-4f0f-9aae-f1d27c9de59c', 'demo-student-3', 'demo-enrollment-3', 'demo-academic-year-current', 'DEMO-INV-2026-8-003', 2026, 8, '3af36d4d-9273-4081-896f-3043b664a317', '2026-07-31 18:00:00.000', '2026-08-10 03:00:00.000', 1800.00, 0.00, 0.00, 0.00, 0.00, 0.00, 1800.00, 0.00, 1800.00, 'unpaid', '2026-08-02 08:11:12.026', '2026-08-02 08:57:58.785'),
('demo-student-invoice-4', '7b2b510e-dab0-4f0f-9aae-f1d27c9de59c', 'demo-student-4', 'demo-enrollment-4', 'demo-academic-year-current', 'DEMO-INV-2026-8-004', 2026, 8, '3af36d4d-9273-4081-896f-3043b664a317', '2026-07-31 18:00:00.000', '2026-08-10 03:00:00.000', 1800.00, 0.00, 300.00, 0.00, 0.00, 0.00, 1500.00, 0.00, 1500.00, 'unpaid', '2026-08-02 08:11:12.049', '2026-08-02 08:57:58.796'),
('demo-student-invoice-5', '7b2b510e-dab0-4f0f-9aae-f1d27c9de59c', 'demo-student-5', 'demo-enrollment-5', 'demo-academic-year-current', 'DEMO-INV-2026-8-005', 2026, 8, '3af36d4d-9273-4081-896f-3043b664a317', '2026-07-31 18:00:00.000', '2026-08-10 03:00:00.000', 1800.00, 0.00, 0.00, 0.00, 0.00, 0.00, 1800.00, 1800.00, 0.00, 'paid', '2026-08-02 08:11:12.068', '2026-08-02 08:57:58.809'),
('demo-student-invoice-6', '7b2b510e-dab0-4f0f-9aae-f1d27c9de59c', 'demo-student-6', 'demo-enrollment-6', 'demo-academic-year-current', 'DEMO-INV-2026-8-006', 2026, 8, '3af36d4d-9273-4081-896f-3043b664a317', '2026-07-31 18:00:00.000', '2026-08-10 03:00:00.000', 1800.00, 0.00, 0.00, 0.00, 0.00, 0.00, 1800.00, 1000.00, 800.00, 'partially_paid', '2026-08-02 08:11:12.086', '2026-08-02 08:57:58.821'),
('demo-student-invoice-7', '7b2b510e-dab0-4f0f-9aae-f1d27c9de59c', 'demo-student-7', 'demo-enrollment-7', 'demo-academic-year-current', 'DEMO-INV-2026-8-007', 2026, 8, '3af36d4d-9273-4081-896f-3043b664a317', '2026-07-31 18:00:00.000', '2026-08-10 03:00:00.000', 1800.00, 0.00, 0.00, 0.00, 0.00, 0.00, 1800.00, 0.00, 1800.00, 'unpaid', '2026-08-02 08:11:12.102', '2026-08-02 08:57:58.831'),
('demo-student-invoice-8', '7b2b510e-dab0-4f0f-9aae-f1d27c9de59c', 'demo-student-8', 'demo-enrollment-8', 'demo-academic-year-current', 'DEMO-INV-2026-8-008', 2026, 8, '3af36d4d-9273-4081-896f-3043b664a317', '2026-07-31 18:00:00.000', '2026-08-10 03:00:00.000', 1800.00, 0.00, 0.00, 0.00, 0.00, 0.00, 1800.00, 0.00, 1800.00, 'unpaid', '2026-08-02 08:11:12.125', '2026-08-02 08:57:58.841'),
('demo-student-invoice-9', '7b2b510e-dab0-4f0f-9aae-f1d27c9de59c', 'demo-student-9', 'demo-enrollment-9', 'demo-academic-year-current', 'DEMO-INV-2026-8-009', 2026, 8, '3af36d4d-9273-4081-896f-3043b664a317', '2026-07-31 18:00:00.000', '2026-08-10 03:00:00.000', 1800.00, 0.00, 0.00, 0.00, 0.00, 0.00, 1800.00, 1800.00, 0.00, 'paid', '2026-08-02 08:11:12.143', '2026-08-02 08:57:58.854');

-- --------------------------------------------------------

--
-- Table structure for table `student_marks`
--

CREATE TABLE `student_marks` (
  `id` varchar(191) NOT NULL,
  `school_id` varchar(191) NOT NULL,
  `exam_id` varchar(191) NOT NULL,
  `student_id` varchar(191) NOT NULL,
  `class_id` varchar(191) NOT NULL,
  `section_id` varchar(191) NOT NULL,
  `subject_id` varchar(191) NOT NULL,
  `written` decimal(5,2) DEFAULT NULL,
  `mcq` decimal(5,2) DEFAULT NULL,
  `practical` decimal(5,2) DEFAULT NULL,
  `assignment` decimal(5,2) DEFAULT NULL,
  `attendance` decimal(5,2) DEFAULT NULL,
  `class_test` decimal(5,2) DEFAULT NULL,
  `other` decimal(5,2) DEFAULT NULL,
  `grace_marks` decimal(5,2) NOT NULL DEFAULT 0.00,
  `total_marks` decimal(5,2) NOT NULL DEFAULT 0.00,
  `is_absent` tinyint(1) NOT NULL DEFAULT 0,
  `is_passed` tinyint(1) NOT NULL DEFAULT 1,
  `letter_grade` varchar(191) DEFAULT NULL,
  `grade_point` decimal(4,2) DEFAULT NULL,
  `is_locked` tinyint(1) NOT NULL DEFAULT 0,
  `locked_at` datetime(3) DEFAULT NULL,
  `locked_by_id` varchar(191) DEFAULT NULL,
  `unlock_reason` varchar(191) DEFAULT NULL,
  `entered_by_id` varchar(191) NOT NULL,
  `remarks` varchar(191) DEFAULT NULL,
  `created_at` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updated_at` datetime(3) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `student_medical_information`
--

CREATE TABLE `student_medical_information` (
  `id` varchar(191) NOT NULL,
  `student_id` varchar(191) NOT NULL,
  `height` varchar(191) DEFAULT NULL,
  `weight` varchar(191) DEFAULT NULL,
  `blood_group` varchar(191) DEFAULT NULL,
  `allergies` text DEFAULT NULL,
  `medical_conditions` text DEFAULT NULL,
  `medications` text DEFAULT NULL,
  `emergency_notes` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `student_previous_education`
--

CREATE TABLE `student_previous_education` (
  `id` varchar(191) NOT NULL,
  `student_id` varchar(191) NOT NULL,
  `institute_name` varchar(191) NOT NULL,
  `board` varchar(191) DEFAULT NULL,
  `passed_year` int(11) DEFAULT NULL,
  `gpa_marks` varchar(191) DEFAULT NULL,
  `roll_number` varchar(191) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `student_results`
--

CREATE TABLE `student_results` (
  `id` varchar(191) NOT NULL,
  `school_id` varchar(191) NOT NULL,
  `academic_year_id` varchar(191) NOT NULL,
  `exam_id` varchar(191) NOT NULL,
  `student_id` varchar(191) NOT NULL,
  `class_id` varchar(191) NOT NULL,
  `section_id` varchar(191) NOT NULL,
  `total_marks` decimal(7,2) NOT NULL DEFAULT 0.00,
  `average` decimal(5,2) NOT NULL DEFAULT 0.00,
  `percentage` decimal(5,2) NOT NULL DEFAULT 0.00,
  `gpa` decimal(4,2) NOT NULL DEFAULT 0.00,
  `letter_grade` varchar(191) NOT NULL DEFAULT 'F',
  `failed_subject_count` int(11) NOT NULL DEFAULT 0,
  `class_position` int(11) DEFAULT NULL,
  `optional_class_position` int(11) DEFAULT NULL,
  `is_passed` tinyint(1) NOT NULL DEFAULT 1,
  `remarks` varchar(191) DEFAULT NULL,
  `calculated_at` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `created_at` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updated_at` datetime(3) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `student_results`
--

INSERT INTO `student_results` (`id`, `school_id`, `academic_year_id`, `exam_id`, `student_id`, `class_id`, `section_id`, `total_marks`, `average`, `percentage`, `gpa`, `letter_grade`, `failed_subject_count`, `class_position`, `optional_class_position`, `is_passed`, `remarks`, `calculated_at`, `created_at`, `updated_at`) VALUES
('162af601-2a55-419f-b03d-b8254e3e0442', '7b2b510e-dab0-4f0f-9aae-f1d27c9de59c', 'demo-academic-year-current', 'demo-exam-upcoming', 'demo-student-9', 'demo-class-8', 'demo-section-8-1', 50.00, 50.00, 50.00, 3.00, 'B', 0, 2, NULL, 1, 'Promoted', '2026-08-09 08:03:30.123', '2026-08-09 07:27:29.941', '2026-08-09 08:03:30.124'),
('458c2f5a-f91b-4cf5-ad98-191164accfa6', '7b2b510e-dab0-4f0f-9aae-f1d27c9de59c', 'demo-academic-year-current', 'demo-exam-upcoming', 'demo-student-3', 'demo-class-6', 'demo-section-6-1', 0.00, 0.00, 0.00, 0.00, 'F', 6, 2, NULL, 0, 'Needs improvement', '2026-08-02 10:12:12.634', '2026-08-02 10:12:08.700', '2026-08-02 10:12:12.639'),
('61f5cb7c-b499-4073-9695-90dc2ed03f57', '7b2b510e-dab0-4f0f-9aae-f1d27c9de59c', 'demo-academic-year-current', 'demo-exam-upcoming', 'demo-student-11', 'demo-class-8', 'demo-section-8-1', 50.00, 50.00, 50.00, 3.00, 'B', 0, 1, NULL, 1, 'Promoted', '2026-08-09 08:03:30.114', '2026-08-09 07:27:29.930', '2026-08-09 08:03:30.115'),
('f0d2f76d-f026-4c6e-87fc-1a0ff1f16565', '7b2b510e-dab0-4f0f-9aae-f1d27c9de59c', 'demo-academic-year-current', 'demo-exam-upcoming', 'demo-student-1', 'demo-class-6', 'demo-section-6-1', 0.00, 0.00, 0.00, 0.00, 'F', 6, 1, NULL, 0, 'Needs improvement', '2026-08-02 10:12:12.594', '2026-08-02 10:12:08.553', '2026-08-02 10:12:12.600');

-- --------------------------------------------------------

--
-- Table structure for table `student_status_histories`
--

CREATE TABLE `student_status_histories` (
  `id` varchar(191) NOT NULL,
  `student_id` varchar(191) NOT NULL,
  `previous_status` varchar(191) NOT NULL,
  `new_status` varchar(191) NOT NULL,
  `change_reason` text DEFAULT NULL,
  `changed_by` varchar(191) DEFAULT NULL,
  `created_at` datetime(3) NOT NULL DEFAULT current_timestamp(3)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `subjects`
--

CREATE TABLE `subjects` (
  `id` varchar(191) NOT NULL,
  `school_id` varchar(191) NOT NULL,
  `name_en` varchar(191) NOT NULL,
  `name_bn` varchar(191) DEFAULT NULL,
  `code` varchar(191) NOT NULL,
  `subject_type` varchar(191) NOT NULL DEFAULT 'compulsory',
  `description` text DEFAULT NULL,
  `status` enum('ACTIVE','INACTIVE','SUSPENDED','PENDING') NOT NULL DEFAULT 'ACTIVE',
  `created_at` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updated_at` datetime(3) NOT NULL,
  `deleted_at` datetime(3) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `subjects`
--

INSERT INTO `subjects` (`id`, `school_id`, `name_en`, `name_bn`, `code`, `subject_type`, `description`, `status`, `created_at`, `updated_at`, `deleted_at`) VALUES
('71a87dc5-e709-4df6-b8bd-1d301fe4cd47', '7b2b510e-dab0-4f0f-9aae-f1d27c9de59c', 'Temporary Verification', NULL, 'TMPVERIFY', 'practical', NULL, 'INACTIVE', '2026-08-02 08:47:58.143', '2026-08-02 08:47:58.520', '2026-08-02 08:47:58.516'),
('b36f3e56-89f3-4d1f-88b6-0a72c648bccb', '7b2b510e-dab0-4f0f-9aae-f1d27c9de59c', 'Verification Subject', '????? ????', 'VERIFY123', 'optional', NULL, 'INACTIVE', '2026-08-02 08:46:11.798', '2026-08-02 08:46:16.477', '2026-08-02 08:46:16.463'),
('demo-subject-ban', '7b2b510e-dab0-4f0f-9aae-f1d27c9de59c', 'Bangla', 'বাংলা', 'BAN', 'compulsory', 'Bangla curriculum', 'ACTIVE', '2026-08-02 08:11:08.150', '2026-08-02 08:57:55.614', NULL),
('demo-subject-bgs', '7b2b510e-dab0-4f0f-9aae-f1d27c9de59c', 'Bangladesh & Global Studies', 'বাংলাদেশ ও বিশ্বপরিচয়', 'BGS', 'compulsory', 'Bangladesh & Global Studies curriculum', 'ACTIVE', '2026-08-02 08:11:08.261', '2026-08-02 08:57:55.632', NULL),
('demo-subject-eng', '7b2b510e-dab0-4f0f-9aae-f1d27c9de59c', 'English', 'ইংরেজি', 'ENG', 'compulsory', 'English curriculum', 'ACTIVE', '2026-08-02 08:11:08.209', '2026-08-02 08:57:55.618', NULL),
('demo-subject-ict', '7b2b510e-dab0-4f0f-9aae-f1d27c9de59c', 'ICT', 'তথ্য ও যোগাযোগ প্রযুক্তি', 'ICT', 'compulsory', 'ICT curriculum', 'ACTIVE', '2026-08-02 08:11:08.278', '2026-08-02 08:57:55.636', NULL),
('demo-subject-mat', '7b2b510e-dab0-4f0f-9aae-f1d27c9de59c', 'Mathematics', 'গণিত', 'MAT', 'compulsory', 'Mathematics curriculum', 'ACTIVE', '2026-08-02 08:11:08.218', '2026-08-02 08:57:55.623', NULL),
('demo-subject-sci', '7b2b510e-dab0-4f0f-9aae-f1d27c9de59c', 'General Science', 'সাধারণ বিজ্ঞান', 'SCI', 'compulsory', 'General Science curriculum', 'ACTIVE', '2026-08-02 08:11:08.229', '2026-08-02 08:57:55.628', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `teachers`
--

CREATE TABLE `teachers` (
  `id` varchar(191) NOT NULL,
  `school_id` varchar(191) NOT NULL,
  `user_id` varchar(191) DEFAULT NULL,
  `employee_code` varchar(191) NOT NULL,
  `name_en` varchar(191) NOT NULL,
  `name_bn` varchar(191) DEFAULT NULL,
  `phone` varchar(191) NOT NULL,
  `email` varchar(191) DEFAULT NULL,
  `gender` enum('MALE','FEMALE','OTHER') NOT NULL DEFAULT 'MALE',
  `date_of_birth` datetime(3) DEFAULT NULL,
  `joining_date` datetime(3) NOT NULL,
  `qualification` varchar(191) DEFAULT NULL,
  `specialization` varchar(191) DEFAULT NULL,
  `profile_photo` varchar(191) DEFAULT NULL,
  `department_id` varchar(191) DEFAULT NULL,
  `designation_id` varchar(191) DEFAULT NULL,
  `employment_status` varchar(191) NOT NULL DEFAULT 'PERMANENT',
  `status` enum('ACTIVE','INACTIVE','SUSPENDED','PENDING') NOT NULL DEFAULT 'ACTIVE',
  `salary` decimal(12,2) NOT NULL DEFAULT 0.00,
  `created_at` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updated_at` datetime(3) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `teachers`
--

INSERT INTO `teachers` (`id`, `school_id`, `user_id`, `employee_code`, `name_en`, `name_bn`, `phone`, `email`, `gender`, `date_of_birth`, `joining_date`, `qualification`, `specialization`, `profile_photo`, `department_id`, `designation_id`, `employment_status`, `status`, `salary`, `created_at`, `updated_at`) VALUES
('demo-teacher-1', '7b2b510e-dab0-4f0f-9aae-f1d27c9de59c', 'a7e07343-b155-4218-9a29-f5bccb3a7eef', 'T-001', 'Arif Hossain', NULL, '01820000001', 'demo.teacher1@school.test', 'MALE', '1984-04-10 03:00:00.000', '2016-01-05 03:00:00.000', 'M.Sc., B.Ed.', 'Bangla', NULL, '888b84ca-9412-46d0-9803-481865e9d5f9', '518fc270-8e46-4e89-b516-772072afe6a0', 'PERMANENT', 'ACTIVE', 42000.00, '2026-08-02 08:11:08.404', '2026-08-02 08:57:55.686'),
('demo-teacher-2', '7b2b510e-dab0-4f0f-9aae-f1d27c9de59c', '5b68561e-7f16-4126-8979-4d0fc815d1a4', 'T-002', 'Samira Khan', NULL, '01820000002', 'demo.teacher2@school.test', 'FEMALE', '1985-04-10 03:00:00.000', '2017-01-05 03:00:00.000', 'M.A., B.Ed.', 'English', NULL, '888b84ca-9412-46d0-9803-481865e9d5f9', '518fc270-8e46-4e89-b516-772072afe6a0', 'PERMANENT', 'ACTIVE', 44500.00, '2026-08-02 08:11:08.416', '2026-08-02 08:57:55.693'),
('demo-teacher-3', '7b2b510e-dab0-4f0f-9aae-f1d27c9de59c', '5d7880f3-2268-4ae9-a460-598270a02b81', 'T-003', 'Mahbub Alam', NULL, '01820000003', 'faculty3@shaplamodel.edu.bd', 'MALE', '1986-04-10 03:00:00.000', '2018-01-05 03:00:00.000', 'M.Sc., B.Ed.', 'Mathematics', NULL, '888b84ca-9412-46d0-9803-481865e9d5f9', '518fc270-8e46-4e89-b516-772072afe6a0', 'PERMANENT', 'ACTIVE', 47000.00, '2026-08-02 08:11:08.428', '2026-08-09 11:48:45.726'),
('demo-teacher-4', '7b2b510e-dab0-4f0f-9aae-f1d27c9de59c', 'cc488987-826b-421e-bcb2-00f1cde1a477', 'T-004', 'Tahmina Sultana', NULL, '01820000004', 'faculty4@shaplamodel.edu.bd', 'FEMALE', '1987-04-10 03:00:00.000', '2019-01-05 03:00:00.000', 'M.A., B.Ed.', 'General Science', NULL, '888b84ca-9412-46d0-9803-481865e9d5f9', '518fc270-8e46-4e89-b516-772072afe6a0', 'PERMANENT', 'ACTIVE', 49500.00, '2026-08-02 08:11:08.434', '2026-08-09 11:48:46.207'),
('demo-teacher-5', '7b2b510e-dab0-4f0f-9aae-f1d27c9de59c', '0b605377-3db9-49e0-a4f9-aff969a7e7e9', 'T-005', 'Imran Kabir', NULL, '01820000005', 'faculty5@shaplamodel.edu.bd', 'MALE', '1988-04-10 03:00:00.000', '2020-01-05 03:00:00.000', 'M.Sc., B.Ed.', 'Bangladesh & Global Studies', NULL, '888b84ca-9412-46d0-9803-481865e9d5f9', '518fc270-8e46-4e89-b516-772072afe6a0', 'PERMANENT', 'ACTIVE', 52000.00, '2026-08-02 08:11:08.445', '2026-08-09 11:48:46.665'),
('demo-teacher-6', '7b2b510e-dab0-4f0f-9aae-f1d27c9de59c', '43c63044-7b46-49fa-aa9d-97fee183a689', 'T-006', 'Sharmeen Akter', NULL, '01820000006', 'faculty6@shaplamodel.edu.bd', 'FEMALE', '1989-04-10 03:00:00.000', '2021-01-05 03:00:00.000', 'M.A., B.Ed.', 'ICT', NULL, '888b84ca-9412-46d0-9803-481865e9d5f9', '518fc270-8e46-4e89-b516-772072afe6a0', 'PERMANENT', 'ACTIVE', 54500.00, '2026-08-02 08:11:08.450', '2026-08-09 11:48:47.002');

-- --------------------------------------------------------

--
-- Table structure for table `teacher_assignments`
--

CREATE TABLE `teacher_assignments` (
  `id` varchar(191) NOT NULL,
  `school_id` varchar(191) NOT NULL,
  `academic_year_id` varchar(191) NOT NULL,
  `session_id` varchar(191) DEFAULT NULL,
  `teacher_id` varchar(191) NOT NULL,
  `class_id` varchar(191) NOT NULL,
  `section_id` varchar(191) NOT NULL,
  `group_id` varchar(191) DEFAULT NULL,
  `subject_id` varchar(191) NOT NULL,
  `is_class_teacher` tinyint(1) NOT NULL DEFAULT 0,
  `status` enum('ACTIVE','INACTIVE','SUSPENDED','PENDING') NOT NULL DEFAULT 'ACTIVE',
  `created_at` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updated_at` datetime(3) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `teacher_assignments`
--

INSERT INTO `teacher_assignments` (`id`, `school_id`, `academic_year_id`, `session_id`, `teacher_id`, `class_id`, `section_id`, `group_id`, `subject_id`, `is_class_teacher`, `status`, `created_at`, `updated_at`) VALUES
('1440e776-20e6-4ed6-a597-6bc3a9afe5c8', '7b2b510e-dab0-4f0f-9aae-f1d27c9de59c', 'demo-academic-year-current', 'demo-session-current', 'demo-teacher-4', 'demo-class-7', 'demo-section-7-1', NULL, 'demo-subject-sci', 0, 'ACTIVE', '2026-08-02 08:11:08.632', '2026-08-02 08:57:55.860'),
('18ebacab-405a-4376-a851-fad1fde06b0b', '7b2b510e-dab0-4f0f-9aae-f1d27c9de59c', 'demo-academic-year-current', 'demo-session-current', 'demo-teacher-1', 'demo-class-10', 'demo-section-10-1', NULL, 'demo-subject-ban', 1, 'ACTIVE', '2026-08-02 08:11:08.865', '2026-08-02 08:57:56.310'),
('1eb92545-9118-4131-890d-5f5c570cb589', '7b2b510e-dab0-4f0f-9aae-f1d27c9de59c', 'demo-academic-year-current', 'demo-session-current', 'demo-teacher-3', 'demo-class-8', 'demo-section-8-1', NULL, 'demo-subject-mat', 0, 'ACTIVE', '2026-08-02 08:11:08.733', '2026-08-02 08:57:55.914'),
('2a293a79-9287-461a-a85e-bed1ca59a695', '7b2b510e-dab0-4f0f-9aae-f1d27c9de59c', 'demo-academic-year-current', 'demo-session-current', 'demo-teacher-2', 'demo-class-6', 'demo-section-6-1', NULL, 'demo-subject-eng', 0, 'ACTIVE', '2026-08-02 08:11:08.512', '2026-08-02 08:57:55.779'),
('44b8b331-8105-4b7b-ae72-fb098c81a3eb', '7b2b510e-dab0-4f0f-9aae-f1d27c9de59c', 'demo-academic-year-current', 'demo-session-current', 'demo-teacher-4', 'demo-class-9', 'demo-section-9-1', NULL, 'demo-subject-sci', 0, 'ACTIVE', '2026-08-02 08:11:08.827', '2026-08-02 08:57:56.236'),
('45e1fbf5-2acb-494c-b8f4-010bda9405b1', '7b2b510e-dab0-4f0f-9aae-f1d27c9de59c', 'demo-academic-year-current', 'demo-session-current', 'demo-teacher-3', 'demo-class-9', 'demo-section-9-1', NULL, 'demo-subject-mat', 0, 'ACTIVE', '2026-08-02 08:11:08.810', '2026-08-02 08:57:56.209'),
('472ea367-d6a5-4ed8-84af-bced43cfb45d', '7b2b510e-dab0-4f0f-9aae-f1d27c9de59c', 'demo-academic-year-current', 'demo-session-current', 'demo-teacher-6', 'demo-class-8', 'demo-section-8-1', NULL, 'demo-subject-ict', 0, 'ACTIVE', '2026-08-02 08:11:08.771', '2026-08-02 08:57:56.070'),
('47ecba5f-6816-43cb-a2bb-d1fe4639e706', '7b2b510e-dab0-4f0f-9aae-f1d27c9de59c', 'demo-academic-year-current', 'demo-session-current', 'demo-teacher-3', 'demo-class-6', 'demo-section-6-1', NULL, 'demo-subject-mat', 0, 'ACTIVE', '2026-08-02 08:11:08.522', '2026-08-02 08:57:55.787'),
('4b159ea6-ef43-4f8e-8c6a-6409226d1897', '7b2b510e-dab0-4f0f-9aae-f1d27c9de59c', 'demo-academic-year-current', 'demo-session-current', 'demo-teacher-1', 'demo-class-7', 'demo-section-7-1', NULL, 'demo-subject-ban', 1, 'ACTIVE', '2026-08-02 08:11:08.578', '2026-08-02 08:57:55.827'),
('6013776a-b0a1-4f1f-9d32-1be74e65871c', '7b2b510e-dab0-4f0f-9aae-f1d27c9de59c', 'demo-academic-year-current', 'demo-session-current', 'demo-teacher-2', 'demo-class-7', 'demo-section-7-1', NULL, 'demo-subject-eng', 0, 'ACTIVE', '2026-08-02 08:11:08.589', '2026-08-02 08:57:55.836'),
('6318df66-3db0-4df8-afdc-d96622c733a8', '7b2b510e-dab0-4f0f-9aae-f1d27c9de59c', 'demo-academic-year-current', 'demo-session-current', 'demo-teacher-4', 'demo-class-6', 'demo-section-6-1', NULL, 'demo-subject-sci', 0, 'ACTIVE', '2026-08-02 08:11:08.531', '2026-08-02 08:57:55.798'),
('6c845473-7b9f-4d40-a25b-38331665d8d3', '7b2b510e-dab0-4f0f-9aae-f1d27c9de59c', 'demo-academic-year-current', 'demo-session-current', 'demo-teacher-1', 'demo-class-9', 'demo-section-9-1', NULL, 'demo-subject-ban', 1, 'ACTIVE', '2026-08-02 08:11:08.783', '2026-08-02 08:57:56.116'),
('79f5792f-906f-416e-bef6-20bf5cb4a3b3', '7b2b510e-dab0-4f0f-9aae-f1d27c9de59c', 'demo-academic-year-current', 'demo-session-current', 'demo-teacher-4', 'demo-class-10', 'demo-section-10-1', NULL, 'demo-subject-sci', 0, 'ACTIVE', '2026-08-02 08:11:08.963', '2026-08-02 08:57:56.359'),
('7b3a2749-64f4-4f1d-8f53-1c67dfd69a8f', '7b2b510e-dab0-4f0f-9aae-f1d27c9de59c', 'demo-academic-year-current', 'demo-session-current', 'demo-teacher-3', 'demo-class-7', 'demo-section-7-1', NULL, 'demo-subject-mat', 0, 'ACTIVE', '2026-08-02 08:11:08.615', '2026-08-02 08:57:55.847'),
('988f8a14-5da5-48f2-9f30-9b0fcec6f044', '7b2b510e-dab0-4f0f-9aae-f1d27c9de59c', 'demo-academic-year-current', 'demo-session-current', 'demo-teacher-6', 'demo-class-7', 'demo-section-7-1', NULL, 'demo-subject-ict', 0, 'ACTIVE', '2026-08-02 08:11:08.653', '2026-08-02 08:57:55.876'),
('a239cb79-3382-4370-aeed-975cbbbfab6c', '7b2b510e-dab0-4f0f-9aae-f1d27c9de59c', 'demo-academic-year-current', 'demo-session-current', 'demo-teacher-5', 'demo-class-7', 'demo-section-7-1', NULL, 'demo-subject-bgs', 0, 'ACTIVE', '2026-08-02 08:11:08.640', '2026-08-02 08:57:55.868'),
('b43d769a-4b39-4370-88d3-1a935d971331', '7b2b510e-dab0-4f0f-9aae-f1d27c9de59c', 'demo-academic-year-current', 'demo-session-current', 'demo-teacher-1', 'demo-class-8', 'demo-section-8-1', NULL, 'demo-subject-ban', 1, 'ACTIVE', '2026-08-02 08:11:08.681', '2026-08-02 08:57:55.884'),
('bf171992-7ed5-431d-8653-ff5ebeadf789', '7b2b510e-dab0-4f0f-9aae-f1d27c9de59c', 'demo-academic-year-current', 'demo-session-current', 'demo-teacher-2', 'demo-class-10', 'demo-section-10-1', NULL, 'demo-subject-eng', 0, 'ACTIVE', '2026-08-02 08:11:08.888', '2026-08-02 08:57:56.327'),
('c1c9fe51-1622-4649-ba14-607d8b31702d', '7b2b510e-dab0-4f0f-9aae-f1d27c9de59c', 'demo-academic-year-current', 'demo-session-current', 'demo-teacher-5', 'demo-class-9', 'demo-section-9-1', NULL, 'demo-subject-bgs', 0, 'ACTIVE', '2026-08-02 08:11:08.837', '2026-08-02 08:57:56.273'),
('c2c4cb41-94d5-48fa-acf2-b29b392bc1cf', '7b2b510e-dab0-4f0f-9aae-f1d27c9de59c', 'demo-academic-year-current', 'demo-session-current', 'demo-teacher-5', 'demo-class-8', 'demo-section-8-1', NULL, 'demo-subject-bgs', 0, 'ACTIVE', '2026-08-02 08:11:08.762', '2026-08-02 08:57:56.002'),
('d0f1bfe3-4e3a-454e-a4e0-08a0ab7daa01', '7b2b510e-dab0-4f0f-9aae-f1d27c9de59c', 'demo-academic-year-current', 'demo-session-current', 'demo-teacher-5', 'demo-class-6', 'demo-section-6-1', NULL, 'demo-subject-bgs', 0, 'ACTIVE', '2026-08-02 08:11:08.546', '2026-08-02 08:57:55.809'),
('d657ea3e-dc76-4424-899b-155848cf64fe', '7b2b510e-dab0-4f0f-9aae-f1d27c9de59c', 'demo-academic-year-current', 'demo-session-current', 'demo-teacher-6', 'demo-class-10', 'demo-section-10-1', NULL, 'demo-subject-ict', 0, 'ACTIVE', '2026-08-02 08:11:09.046', '2026-08-02 08:57:56.439'),
('d8180b04-a535-4979-910b-3d9c64161fe1', '7b2b510e-dab0-4f0f-9aae-f1d27c9de59c', 'demo-academic-year-current', 'demo-session-current', 'demo-teacher-6', 'demo-class-9', 'demo-section-9-1', NULL, 'demo-subject-ict', 0, 'ACTIVE', '2026-08-02 08:11:08.846', '2026-08-02 08:57:56.293'),
('db80f670-12f1-4648-8a5e-af3f8ae11dac', '7b2b510e-dab0-4f0f-9aae-f1d27c9de59c', 'demo-academic-year-current', 'demo-session-current', 'demo-teacher-1', 'demo-class-6', 'demo-section-6-1', NULL, 'demo-subject-ban', 1, 'ACTIVE', '2026-08-02 08:11:08.491', '2026-08-02 08:57:55.764'),
('de27058c-4c7b-463d-8873-0baf2f91fc37', '7b2b510e-dab0-4f0f-9aae-f1d27c9de59c', 'demo-academic-year-current', 'demo-session-current', 'demo-teacher-2', 'demo-class-9', 'demo-section-9-1', NULL, 'demo-subject-eng', 0, 'ACTIVE', '2026-08-02 08:11:08.797', '2026-08-02 08:57:56.134'),
('def46d09-daac-4669-902a-763ba8bac416', '7b2b510e-dab0-4f0f-9aae-f1d27c9de59c', 'demo-academic-year-current', 'demo-session-current', 'demo-teacher-5', 'demo-class-10', 'demo-section-10-1', NULL, 'demo-subject-bgs', 0, 'ACTIVE', '2026-08-02 08:11:09.031', '2026-08-02 08:57:56.377'),
('f7a24100-3ff8-45c1-81f8-22d339208044', '7b2b510e-dab0-4f0f-9aae-f1d27c9de59c', 'demo-academic-year-current', 'demo-session-current', 'demo-teacher-2', 'demo-class-8', 'demo-section-8-1', NULL, 'demo-subject-eng', 0, 'ACTIVE', '2026-08-02 08:11:08.712', '2026-08-02 08:57:55.899'),
('fa85383b-5f93-4e25-9349-4adc3362d125', '7b2b510e-dab0-4f0f-9aae-f1d27c9de59c', 'demo-academic-year-current', 'demo-session-current', 'demo-teacher-3', 'demo-class-10', 'demo-section-10-1', NULL, 'demo-subject-mat', 0, 'ACTIVE', '2026-08-02 08:11:08.916', '2026-08-02 08:57:56.344'),
('fa969921-1419-45a0-8709-e44bf1e8d1cf', '7b2b510e-dab0-4f0f-9aae-f1d27c9de59c', 'demo-academic-year-current', 'demo-session-current', 'demo-teacher-4', 'demo-class-8', 'demo-section-8-1', NULL, 'demo-subject-sci', 0, 'ACTIVE', '2026-08-02 08:11:08.746', '2026-08-02 08:57:55.972'),
('fd57d6ec-b23d-45e6-800e-b7c8d8385cc2', '7b2b510e-dab0-4f0f-9aae-f1d27c9de59c', 'demo-academic-year-current', 'demo-session-current', 'demo-teacher-6', 'demo-class-6', 'demo-section-6-1', NULL, 'demo-subject-ict', 0, 'ACTIVE', '2026-08-02 08:11:08.562', '2026-08-02 08:57:55.817');

-- --------------------------------------------------------

--
-- Table structure for table `teacher_attendances`
--

CREATE TABLE `teacher_attendances` (
  `id` varchar(191) NOT NULL,
  `school_id` varchar(191) NOT NULL,
  `teacher_id` varchar(191) NOT NULL,
  `date` datetime(3) NOT NULL,
  `status` varchar(191) NOT NULL,
  `in_time` varchar(191) DEFAULT NULL,
  `out_time` varchar(191) DEFAULT NULL,
  `remarks` varchar(191) DEFAULT NULL,
  `created_at` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updated_at` datetime(3) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `teacher_attendances`
--

INSERT INTO `teacher_attendances` (`id`, `school_id`, `teacher_id`, `date`, `status`, `in_time`, `out_time`, `remarks`, `created_at`, `updated_at`) VALUES
('demo-teacher-att-1', '7b2b510e-dab0-4f0f-9aae-f1d27c9de59c', 'demo-teacher-1', '2026-08-01 18:00:00.000', 'present', '07:50', '15:30', NULL, '2026-08-02 08:11:11.229', '2026-08-02 08:57:58.232'),
('demo-teacher-att-2', '7b2b510e-dab0-4f0f-9aae-f1d27c9de59c', 'demo-teacher-2', '2026-08-01 18:00:00.000', 'present', '07:50', '15:30', NULL, '2026-08-02 08:11:11.234', '2026-08-02 08:57:58.237'),
('demo-teacher-att-3', '7b2b510e-dab0-4f0f-9aae-f1d27c9de59c', 'demo-teacher-3', '2026-08-01 18:00:00.000', 'present', '07:50', '15:30', NULL, '2026-08-02 08:11:11.237', '2026-08-02 08:57:58.241'),
('demo-teacher-att-4', '7b2b510e-dab0-4f0f-9aae-f1d27c9de59c', 'demo-teacher-4', '2026-08-01 18:00:00.000', 'present', '07:50', '15:30', NULL, '2026-08-02 08:11:11.242', '2026-08-02 08:57:58.245'),
('demo-teacher-att-5', '7b2b510e-dab0-4f0f-9aae-f1d27c9de59c', 'demo-teacher-5', '2026-08-01 18:00:00.000', 'late', '08:18', '15:30', NULL, '2026-08-02 08:11:11.245', '2026-08-02 08:57:58.248'),
('demo-teacher-att-6', '7b2b510e-dab0-4f0f-9aae-f1d27c9de59c', 'demo-teacher-6', '2026-08-01 18:00:00.000', 'present', '07:50', '15:30', NULL, '2026-08-02 08:11:11.247', '2026-08-02 08:57:58.252');

-- --------------------------------------------------------

--
-- Table structure for table `transcripts`
--

CREATE TABLE `transcripts` (
  `id` varchar(191) NOT NULL,
  `school_id` varchar(191) NOT NULL,
  `student_id` varchar(191) NOT NULL,
  `transcript_number` varchar(191) NOT NULL,
  `verification_code` varchar(191) NOT NULL,
  `cumulative_gpa` decimal(4,2) NOT NULL,
  `generated_at` datetime(3) NOT NULL DEFAULT current_timestamp(3)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` varchar(191) NOT NULL,
  `school_id` varchar(191) DEFAULT NULL,
  `name` varchar(191) NOT NULL,
  `email` varchar(191) NOT NULL,
  `password_hash` varchar(191) NOT NULL,
  `phone` varchar(191) DEFAULT NULL,
  `status` enum('ACTIVE','INACTIVE','SUSPENDED','PENDING') NOT NULL DEFAULT 'ACTIVE',
  `avatar_url` varchar(191) DEFAULT NULL,
  `language` varchar(191) NOT NULL DEFAULT 'en',
  `created_at` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updated_at` datetime(3) NOT NULL,
  `deleted_at` datetime(3) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `school_id`, `name`, `email`, `password_hash`, `phone`, `status`, `avatar_url`, `language`, `created_at`, `updated_at`, `deleted_at`) VALUES
('0b605377-3db9-49e0-a4f9-aff969a7e7e9', '7b2b510e-dab0-4f0f-9aae-f1d27c9de59c', 'Imran Kabir', 'faculty5@shaplamodel.edu.bd', '$2b$12$y17mHYMNfPPlCk7h/HWHK.C6ETCX6.y9jXTxxCaqxfc9j4Z/PP17u', '01820000005', 'ACTIVE', NULL, 'en', '2026-08-09 11:48:46.663', '2026-08-09 11:48:46.663', NULL),
('1af30a7a-4758-4a4d-a001-a76ca72ea6c5', '7b2b510e-dab0-4f0f-9aae-f1d27c9de59c', 'Tasnim Akter', 'demo.hr@school.test', '$2b$10$79/cbXeSA4nDiFnIx0s5ZO7xmEC8QVlKlh3YkirsR2qiYv55KKKsa', '01710000005', 'ACTIVE', NULL, 'en', '2026-08-02 08:11:07.380', '2026-08-02 08:57:55.384', NULL),
('3abadec3-facd-4bf2-a9e3-0011b00e884a', '7b2b510e-dab0-4f0f-9aae-f1d27c9de59c', 'Abdul Mannan', 'e-003@shaplamodel.edu.bd', '$2b$12$Bw1MMl1P0LusIZgy0OuKVuRURsH7RIHC/q6An1B8WzbaH4NhiuZuO', '01930000003', 'ACTIVE', NULL, 'en', '2026-08-09 11:48:47.716', '2026-08-09 11:48:47.716', NULL),
('43c63044-7b46-49fa-aa9d-97fee183a689', '7b2b510e-dab0-4f0f-9aae-f1d27c9de59c', 'Sharmeen Akter', 'faculty6@shaplamodel.edu.bd', '$2b$12$InVWvr4yZzlQNItI1mpkSuW58j1D/tQZvSJ/vHg2esmDz6t9HFjtC', '01820000006', 'ACTIVE', NULL, 'en', '2026-08-09 11:48:47.000', '2026-08-09 11:48:47.000', NULL),
('45ca485a-cb01-4f4d-be0d-0c3d281a6e29', '7b2b510e-dab0-4f0f-9aae-f1d27c9de59c', 'web mangement', 'webmangement@school.test', '$2b$12$4WhNGExbQjvlXmnSiStTXuvbwecAw7I9E57V3pLPsuau07EdPtJz6', NULL, 'ACTIVE', NULL, 'en', '2026-08-10 08:23:44.554', '2026-08-10 08:23:44.554', NULL),
('52897111-6585-4527-9211-1a20b7c2ff8f', '7b2b510e-dab0-4f0f-9aae-f1d27c9de59c', 'Super Admin', 'admin@school.test', '$2b$10$5AX0QB0/6sPTDyo1wEggo.5d/SGq4YZ5g2.nW52n2m9./v1eCRaXW', '+8801700000000', 'ACTIVE', NULL, 'en', '2026-08-02 08:26:51.460', '2026-08-10 06:34:28.604', NULL),
('59b0cf90-8aeb-4dc7-b362-8b31bd6477ca', '7b2b510e-dab0-4f0f-9aae-f1d27c9de59c', 'Maliha Sultana', 'e-002@shaplamodel.edu.bd', '$2b$12$C34ln/B3mWr5pr9Bg2X6he.VXbJvnNiE/PIpmYGrbZ3mykKrtX1te', '01930000002', 'ACTIVE', NULL, 'en', '2026-08-09 11:48:47.340', '2026-08-09 11:48:47.340', NULL),
('5b68561e-7f16-4126-8979-4d0fc815d1a4', '7b2b510e-dab0-4f0f-9aae-f1d27c9de59c', 'Samira Khan', 'demo.teacher2@school.test', '$2b$10$79/cbXeSA4nDiFnIx0s5ZO7xmEC8QVlKlh3YkirsR2qiYv55KKKsa', '01710000007', 'ACTIVE', NULL, 'en', '2026-08-02 08:11:07.399', '2026-08-02 08:57:55.403', NULL),
('5d7880f3-2268-4ae9-a460-598270a02b81', '7b2b510e-dab0-4f0f-9aae-f1d27c9de59c', 'Mahbub Alam', 'faculty3@shaplamodel.edu.bd', '$2b$12$R2rCzknnCq.wkVQeuzTWKORhsunomd75yYuGXARtdogq/Tkn5CkFG', '01820000003', 'ACTIVE', NULL, 'en', '2026-08-09 11:48:45.716', '2026-08-09 11:48:45.716', NULL),
('83eaf298-cac4-4c7c-9704-631549951d39', '7b2b510e-dab0-4f0f-9aae-f1d27c9de59c', 'Ayan Chowdhury', 'demo.student1@school.test', '$2b$10$79/cbXeSA4nDiFnIx0s5ZO7xmEC8QVlKlh3YkirsR2qiYv55KKKsa', '01710000009', 'ACTIVE', NULL, 'en', '2026-08-02 08:11:07.428', '2026-08-02 08:57:55.418', NULL),
('877c8545-cbaa-4195-912d-7af38caf349d', '7b2b510e-dab0-4f0f-9aae-f1d27c9de59c', 'Shafiq Chowdhury', 'demo.guardian1@school.test', '$2b$10$79/cbXeSA4nDiFnIx0s5ZO7xmEC8QVlKlh3YkirsR2qiYv55KKKsa', '01710000011', 'ACTIVE', NULL, 'en', '2026-08-02 08:11:07.499', '2026-08-02 08:57:55.442', NULL),
('914a688f-fd88-4338-910f-45dbb6294007', '7b2b510e-dab0-4f0f-9aae-f1d27c9de59c', 'Sadia Islam', 'demo.admission@school.test', '$2b$10$79/cbXeSA4nDiFnIx0s5ZO7xmEC8QVlKlh3YkirsR2qiYv55KKKsa', '01710000003', 'ACTIVE', NULL, 'en', '2026-08-02 08:11:07.346', '2026-08-02 08:57:55.368', NULL),
('973dc483-2137-4bf2-a775-d25c00d613bb', '7b2b510e-dab0-4f0f-9aae-f1d27c9de59c', 'Farzana Ahmed', 'demo.guardian2@school.test', '$2b$10$79/cbXeSA4nDiFnIx0s5ZO7xmEC8QVlKlh3YkirsR2qiYv55KKKsa', '01710000012', 'ACTIVE', NULL, 'en', '2026-08-02 08:11:07.507', '2026-08-02 08:57:55.449', NULL),
('a232013e-253c-47e6-93f9-34291e859d68', '7b2b510e-dab0-4f0f-9aae-f1d27c9de59c', 'Abir Hasan', 'applicant5@example.com', '$2b$10$Z93yotLoRrB19LwGMi1I1e8c4tv1RlEeNCVTTk/oz1xY7KSye/.lS', '01310000005', 'ACTIVE', NULL, 'en', '2026-08-10 10:37:48.369', '2026-08-10 10:37:48.369', NULL),
('a7e07343-b155-4218-9a29-f5bccb3a7eef', '7b2b510e-dab0-4f0f-9aae-f1d27c9de59c', 'Arif Hossain', 'demo.teacher1@school.test', '$2b$10$79/cbXeSA4nDiFnIx0s5ZO7xmEC8QVlKlh3YkirsR2qiYv55KKKsa', '01710000006', 'ACTIVE', NULL, 'en', '2026-08-02 08:11:07.389', '2026-08-02 08:57:55.395', NULL),
('b540ef8e-f019-44d9-9a69-3a7cd33423ac', '7b2b510e-dab0-4f0f-9aae-f1d27c9de59c', 'Rashed Karim', 'demo.employee@school.test', '$2b$10$79/cbXeSA4nDiFnIx0s5ZO7xmEC8QVlKlh3YkirsR2qiYv55KKKsa', '01710000008', 'ACTIVE', NULL, 'en', '2026-08-02 08:11:07.416', '2026-08-02 08:57:55.411', NULL),
('cc488987-826b-421e-bcb2-00f1cde1a477', '7b2b510e-dab0-4f0f-9aae-f1d27c9de59c', 'Tahmina Sultana', 'faculty4@shaplamodel.edu.bd', '$2b$12$sBk9/bwmX.tS4GadRgu7TuAnTgDcc2QoU/HvZgKmrx28QX/WZ.yom', '01820000004', 'ACTIVE', NULL, 'en', '2026-08-09 11:48:46.205', '2026-08-09 11:48:46.205', NULL),
('d6ec69fd-ae38-4471-a65d-7992b6f1c0df', '7b2b510e-dab0-4f0f-9aae-f1d27c9de59c', 'Nabila Ahmed', 'demo.student2@school.test', '$2b$10$79/cbXeSA4nDiFnIx0s5ZO7xmEC8QVlKlh3YkirsR2qiYv55KKKsa', '01710000010', 'ACTIVE', NULL, 'en', '2026-08-02 08:11:07.460', '2026-08-02 08:57:55.426', NULL),
('e149fca0-f4f0-4018-bb35-89b9febd366a', '7b2b510e-dab0-4f0f-9aae-f1d27c9de59c', 'Mahmud Hasan', 'demo.accountant@school.test', '$2b$10$79/cbXeSA4nDiFnIx0s5ZO7xmEC8QVlKlh3YkirsR2qiYv55KKKsa', '01710000004', 'ACTIVE', NULL, 'en', '2026-08-02 08:11:07.363', '2026-08-02 08:57:55.376', NULL),
('fc9940e7-a1ca-4996-877e-15b70ff8da36', '7b2b510e-dab0-4f0f-9aae-f1d27c9de59c', 'Nusrat Jahan', 'demo.academic@school.test', '$2b$10$79/cbXeSA4nDiFnIx0s5ZO7xmEC8QVlKlh3YkirsR2qiYv55KKKsa', '01710000002', 'ACTIVE', NULL, 'en', '2026-08-02 08:11:07.263', '2026-08-02 08:57:55.351', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `user_roles`
--

CREATE TABLE `user_roles` (
  `user_id` varchar(191) NOT NULL,
  `role_id` varchar(191) NOT NULL,
  `created_at` datetime(3) NOT NULL DEFAULT current_timestamp(3)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `user_roles`
--

INSERT INTO `user_roles` (`user_id`, `role_id`, `created_at`) VALUES
('0b605377-3db9-49e0-a4f9-aff969a7e7e9', '8718c924-8bd7-49ca-8ef8-7022d668b826', '2026-08-09 11:48:46.663'),
('1af30a7a-4758-4a4d-a001-a76ca72ea6c5', 'f636973a-29d1-45ba-b7d8-516a346d77dc', '2026-08-02 08:11:07.385'),
('3abadec3-facd-4bf2-a9e3-0011b00e884a', 'e52062de-5306-4aa3-a78f-368adbd05b84', '2026-08-09 11:48:47.716'),
('43c63044-7b46-49fa-aa9d-97fee183a689', '8718c924-8bd7-49ca-8ef8-7022d668b826', '2026-08-09 11:48:47.000'),
('45ca485a-cb01-4f4d-be0d-0c3d281a6e29', '4181ae83-e64c-4643-9eb8-91674a83d259', '2026-08-10 08:23:44.554'),
('52897111-6585-4527-9211-1a20b7c2ff8f', '27a3620d-879e-409c-8fc8-3be3b2cc13bf', '2026-08-02 08:26:51.467'),
('59b0cf90-8aeb-4dc7-b362-8b31bd6477ca', 'e52062de-5306-4aa3-a78f-368adbd05b84', '2026-08-09 11:48:47.340'),
('5b68561e-7f16-4126-8979-4d0fc815d1a4', '8718c924-8bd7-49ca-8ef8-7022d668b826', '2026-08-02 08:11:07.408'),
('5d7880f3-2268-4ae9-a460-598270a02b81', '8718c924-8bd7-49ca-8ef8-7022d668b826', '2026-08-09 11:48:45.716'),
('83eaf298-cac4-4c7c-9704-631549951d39', '9ce2211c-729c-4dda-bed6-8fb76b417bad', '2026-08-02 08:11:07.453'),
('877c8545-cbaa-4195-912d-7af38caf349d', 'f2e9ecb5-c773-42f1-887c-30a07b6afe12', '2026-08-02 08:11:07.503'),
('914a688f-fd88-4338-910f-45dbb6294007', '3906db5a-acaf-4320-af95-841ba136b82a', '2026-08-02 08:11:07.352'),
('973dc483-2137-4bf2-a775-d25c00d613bb', 'f2e9ecb5-c773-42f1-887c-30a07b6afe12', '2026-08-02 08:11:07.524'),
('a7e07343-b155-4218-9a29-f5bccb3a7eef', '8718c924-8bd7-49ca-8ef8-7022d668b826', '2026-08-02 08:11:07.393'),
('b540ef8e-f019-44d9-9a69-3a7cd33423ac', 'e52062de-5306-4aa3-a78f-368adbd05b84', '2026-08-02 08:11:07.423'),
('cc488987-826b-421e-bcb2-00f1cde1a477', '8718c924-8bd7-49ca-8ef8-7022d668b826', '2026-08-09 11:48:46.205'),
('d6ec69fd-ae38-4471-a65d-7992b6f1c0df', '9ce2211c-729c-4dda-bed6-8fb76b417bad', '2026-08-02 08:11:07.476'),
('e149fca0-f4f0-4018-bb35-89b9febd366a', 'f017bebf-942a-4d49-b333-ee32d542fc48', '2026-08-02 08:11:07.375'),
('fc9940e7-a1ca-4996-877e-15b70ff8da36', '1e1370cd-b59d-4fe4-b03d-40aa9aac48b8', '2026-08-02 08:11:07.281');

-- --------------------------------------------------------

--
-- Table structure for table `user_sessions`
--

CREATE TABLE `user_sessions` (
  `id` varchar(191) NOT NULL,
  `user_id` varchar(191) NOT NULL,
  `token` varchar(191) NOT NULL,
  `ip_address` varchar(191) DEFAULT NULL,
  `user_agent` varchar(191) DEFAULT NULL,
  `expires_at` datetime(3) NOT NULL,
  `created_at` datetime(3) NOT NULL DEFAULT current_timestamp(3)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `user_sessions`
--

INSERT INTO `user_sessions` (`id`, `user_id`, `token`, `ip_address`, `user_agent`, `expires_at`, `created_at`) VALUES
('05168db5-3cf9-4daf-b25b-4c2110e79a2c', 'e149fca0-f4f0-4018-bb35-89b9febd366a', '881fedd0-463c-4af1-a848-6136c65bb918', '127.0.0.1', 'Mozilla/5.0 (Windows NT; Windows NT 10.0; en-US) WindowsPowerShell/5.1.19041.6456', '2026-08-09 08:13:11.491', '2026-08-02 08:13:11.492'),
('284a3473-09c8-40f1-840c-7c5980c5459d', '5b68561e-7f16-4126-8979-4d0fc815d1a4', '588d5a66-89d9-4ae2-b971-0eb9efbbb3a6', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/151.0.0.0 Safari/537.36', '2026-08-17 11:01:09.937', '2026-08-10 11:01:09.943'),
('28e2ce62-af6b-437c-98c3-b18f2e790b70', '52897111-6585-4527-9211-1a20b7c2ff8f', '5271bdda-164a-4e4a-835b-280464e761c6', '127.0.0.1', 'Mozilla/5.0 (Windows NT; Windows NT 10.0; en-US) WindowsPowerShell/5.1.19041.6456', '2026-08-09 10:00:18.128', '2026-08-02 10:00:18.130'),
('2ee1bb78-2afe-4ac2-b205-4d0419fe5d8b', '52897111-6585-4527-9211-1a20b7c2ff8f', 'c6db083c-7492-4473-b429-198754369282', '127.0.0.1', 'Mozilla/5.0 (Windows NT; Windows NT 10.0; en-US) WindowsPowerShell/5.1.19041.6456', '2026-08-09 09:21:05.169', '2026-08-02 09:21:05.170'),
('35993014-6dc7-43d3-adb3-15a27ffc7e30', '52897111-6585-4527-9211-1a20b7c2ff8f', '0a564d10-72f3-42c2-bb3a-8924de2fe6f3', '127.0.0.1', 'Mozilla/5.0 (Windows NT; Windows NT 10.0; en-US) WindowsPowerShell/5.1.19041.6456', '2026-08-09 09:07:40.715', '2026-08-02 09:07:40.716'),
('35db2d8f-9a2a-4ef8-8739-aed21169ca74', 'fc9940e7-a1ca-4996-877e-15b70ff8da36', '0d2568ba-cb82-4b7c-8fa3-1d45517f75bf', '127.0.0.1', 'Mozilla/5.0 (Windows NT; Windows NT 10.0; en-US) WindowsPowerShell/5.1.19041.6456', '2026-08-09 08:11:29.648', '2026-08-02 08:11:29.650'),
('370f5333-f804-488d-bc05-05bc5ff1f8da', '52897111-6585-4527-9211-1a20b7c2ff8f', 'b46c48b8-204a-4dc8-9c59-a0360123d903', '127.0.0.1', 'Mozilla/5.0 (Windows NT; Windows NT 10.0; en-US) WindowsPowerShell/5.1.19041.6456', '2026-08-09 09:19:15.732', '2026-08-02 09:19:15.733'),
('3a8128f9-4978-4cb8-af42-08a07d16f7db', 'a7e07343-b155-4218-9a29-f5bccb3a7eef', 'db90d2bf-80db-496a-9157-adc846bedf7e', '127.0.0.1', 'Mozilla/5.0 (Windows NT; Windows NT 10.0; en-US) WindowsPowerShell/5.1.19041.6456', '2026-08-09 08:11:32.180', '2026-08-02 08:11:32.183'),
('48846b2e-60eb-4afd-a490-50dc2fd5a0d4', '52897111-6585-4527-9211-1a20b7c2ff8f', 'cd95a5fe-4bad-4974-b8ee-f4249137de60', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/151.0.0.0 Safari/537.36', '2026-08-10 05:27:14.211', '2026-08-03 05:27:14.213'),
('4ca371f4-f57f-48ee-8293-85ed261ae8e5', 'a7e07343-b155-4218-9a29-f5bccb3a7eef', '0e1cebf5-860f-4446-86ee-1bd176f52519', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/151.0.0.0 Safari/537.36', '2026-08-16 06:33:38.778', '2026-08-09 06:33:38.779'),
('503af1c8-f132-4cb3-a022-604885bdd8a1', '52897111-6585-4527-9211-1a20b7c2ff8f', '1913a309-5e8e-4ad8-8530-e7aba419159b', '127.0.0.1', 'Mozilla/5.0 (Windows NT; Windows NT 10.0; en-US) WindowsPowerShell/5.1.19041.6456', '2026-08-09 09:58:50.301', '2026-08-02 09:58:50.303'),
('5d47f47a-daeb-43c0-9de5-ef4dfc74ee47', '52897111-6585-4527-9211-1a20b7c2ff8f', 'b73c5785-4d23-4f28-9718-4777c98bc101', '127.0.0.1', 'Mozilla/5.0 (Windows NT; Windows NT 10.0; en-US) WindowsPowerShell/5.1.19041.6456', '2026-08-09 08:43:12.357', '2026-08-02 08:43:12.365'),
('5d7a5745-0e66-49c7-800f-03e0c3808486', '52897111-6585-4527-9211-1a20b7c2ff8f', '48cbcef2-0ae5-4c17-8a80-f13e05dba07a', '127.0.0.1', 'Mozilla/5.0 (Windows NT; Windows NT 10.0; en-US) WindowsPowerShell/5.1.19041.6456', '2026-08-09 08:56:41.476', '2026-08-02 08:56:41.480'),
('5f5a4f29-56b4-4717-a90b-78e99dd0d8e3', '83eaf298-cac4-4c7c-9704-631549951d39', 'fba4549f-541f-4f2b-810a-238f3fa09cb5', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/151.0.0.0 Safari/537.36', '2026-08-16 08:41:53.185', '2026-08-09 08:41:53.187'),
('60b3631b-f5e1-4d19-af99-6732b355c54f', '52897111-6585-4527-9211-1a20b7c2ff8f', '717b6610-fa13-4d0d-9ff7-df0ae685673f', '127.0.0.1', 'Mozilla/5.0 (Windows NT; Windows NT 10.0; en-US) WindowsPowerShell/5.1.19041.6456', '2026-08-09 10:06:21.042', '2026-08-02 10:06:21.058'),
('627fef8e-203d-40db-b65d-6bd857017e1a', 'b540ef8e-f019-44d9-9a69-3a7cd33423ac', '8fdb0ac0-9e21-414a-99d5-03f2183501e9', '127.0.0.1', 'Mozilla/5.0 (Windows NT; Windows NT 10.0; en-US) WindowsPowerShell/5.1.19041.6456', '2026-08-09 08:11:32.753', '2026-08-02 08:11:32.755'),
('6568017b-2b36-4c12-8b85-981f43f901f7', 'a7e07343-b155-4218-9a29-f5bccb3a7eef', '4ad867b2-3007-4d7d-98eb-64aecb632420', '127.0.0.1', 'Mozilla/5.0 (Windows NT; Windows NT 10.0; en-US) WindowsPowerShell/5.1.19041.6456', '2026-08-16 08:29:44.325', '2026-08-09 08:29:44.339'),
('6c837c6b-16eb-4aaa-85fe-4f4e4d0059e6', '52897111-6585-4527-9211-1a20b7c2ff8f', '516e0eb5-e56c-4317-b1b6-41fec96b73c8', '127.0.0.1', 'Mozilla/5.0 (Windows NT; Windows NT 10.0; en-US) WindowsPowerShell/5.1.19041.6456', '2026-08-09 08:57:09.674', '2026-08-02 08:57:09.678'),
('747c844c-f05c-4056-a6b9-96c78c065be0', '52897111-6585-4527-9211-1a20b7c2ff8f', '2c9f23ec-2a55-47eb-a679-b5fb9275e195', '127.0.0.1', 'Mozilla/5.0 (Windows NT; Windows NT 10.0; en-US) WindowsPowerShell/5.1.19041.6456', '2026-08-09 09:58:06.302', '2026-08-02 09:58:06.303'),
('76340fbc-c866-4c4f-830d-2cefe63b1559', 'fc9940e7-a1ca-4996-877e-15b70ff8da36', '93c9e7b7-ea19-457a-a87e-0e7a385b7c08', '127.0.0.1', 'Mozilla/5.0 (Windows NT; Windows NT 10.0; en-US) WindowsPowerShell/5.1.19041.6456', '2026-08-09 09:36:35.702', '2026-08-02 09:36:35.714'),
('7b7daff9-1223-4576-bdab-a4b37b620cc7', 'a7e07343-b155-4218-9a29-f5bccb3a7eef', '0357bfcf-539a-41ba-b85c-d321d79d27c7', '127.0.0.1', 'Mozilla/5.0 (Windows NT; Windows NT 10.0; en-US) WindowsPowerShell/5.1.19041.6456', '2026-08-16 06:46:57.289', '2026-08-09 06:46:57.290'),
('7bf76879-d465-435e-9a5f-952b15756d20', '83eaf298-cac4-4c7c-9704-631549951d39', '98440852-49aa-46ec-a268-832a0235c794', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/151.0.0.0 Safari/537.36', '2026-08-16 10:45:45.065', '2026-08-09 10:45:45.068'),
('7d6d1d5c-ce06-4ad5-b8ca-50c717f1eed4', '877c8545-cbaa-4195-912d-7af38caf349d', 'a1d72ac0-2497-4695-bea9-5c057044f19a', '127.0.0.1', 'Mozilla/5.0 (Windows NT; Windows NT 10.0; en-US) WindowsPowerShell/5.1.19041.6456', '2026-08-09 08:13:10.891', '2026-08-02 08:13:10.893'),
('7f633d60-30c3-42d5-bf1c-f8a14d976562', '877c8545-cbaa-4195-912d-7af38caf349d', 'd269af20-8d33-4a9e-96e7-a9fadd9e50b1', '127.0.0.1', 'Mozilla/5.0 (Windows NT; Windows NT 10.0; en-US) WindowsPowerShell/5.1.19041.6456', '2026-08-09 08:11:33.658', '2026-08-02 08:11:33.660'),
('8272492c-64ac-4e24-ad0f-b0919f920a69', 'a7e07343-b155-4218-9a29-f5bccb3a7eef', 'cf3a606a-0032-4486-9877-fa4ac63ee742', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/151.0.0.0 Safari/537.36', '2026-08-16 12:07:28.730', '2026-08-09 12:07:28.732'),
('83a626dd-c641-4d60-a8ad-31f0be6d1825', '52897111-6585-4527-9211-1a20b7c2ff8f', '34cbfbd6-d43a-47e2-a4d5-f4bd4c91e455', '127.0.0.1', 'Mozilla/5.0 (Windows NT; Windows NT 10.0; en-US) WindowsPowerShell/5.1.19041.6456', '2026-08-09 09:45:18.347', '2026-08-02 09:45:18.349'),
('860213a1-2dfd-4333-bd66-19e861c02a74', 'fc9940e7-a1ca-4996-877e-15b70ff8da36', 'faa8a809-26ee-40e2-ab97-e92a668474c9', '127.0.0.1', 'Mozilla/5.0 (Windows NT; Windows NT 10.0; en-US) WindowsPowerShell/5.1.19041.6456', '2026-08-09 09:29:11.334', '2026-08-02 09:29:11.344'),
('87f44e40-a2d3-40c8-9c76-a5545f2dc1d7', '52897111-6585-4527-9211-1a20b7c2ff8f', '7e63ffe5-9683-480d-924d-e993efd2f66c', '127.0.0.1', 'Mozilla/5.0 (Windows NT; Windows NT 10.0; en-US) WindowsPowerShell/5.1.19041.6456', '2026-08-09 09:58:19.804', '2026-08-02 09:58:19.806'),
('8a92fd59-db3f-432c-81cb-bf5c9541f57d', '83eaf298-cac4-4c7c-9704-631549951d39', '6a453e54-b257-42c1-bf08-fd054cc5db5f', '127.0.0.1', 'Mozilla/5.0 (Windows NT; Windows NT 10.0; en-US) WindowsPowerShell/5.1.19041.6456', '2026-08-09 08:11:33.089', '2026-08-02 08:11:33.091'),
('8dc27f74-aaa7-4e3c-9fdd-ccad77cd161c', '52897111-6585-4527-9211-1a20b7c2ff8f', '81b5999a-3f20-457a-878d-e47ec7bd8fc5', '127.0.0.1', 'Mozilla/5.0 (Windows NT; Windows NT 10.0; en-US) WindowsPowerShell/5.1.19041.6456', '2026-08-09 09:45:44.386', '2026-08-02 09:45:44.388'),
('8de2e673-2b64-47b9-99eb-199dda027992', '52897111-6585-4527-9211-1a20b7c2ff8f', 'ea5c937b-652b-4aff-8e38-30f5b188b271', '127.0.0.1', 'Mozilla/5.0 (Windows NT; Windows NT 10.0; en-US) WindowsPowerShell/5.1.19041.6456', '2026-08-09 08:58:14.492', '2026-08-02 08:58:14.495'),
('a1c7daa8-5a44-44c9-bc1f-002af475da33', '914a688f-fd88-4338-910f-45dbb6294007', 'eb7fad59-493b-4adf-a5cf-644c6c37eca2', '127.0.0.1', 'Mozilla/5.0 (Windows NT; Windows NT 10.0; en-US) WindowsPowerShell/5.1.19041.6456', '2026-08-09 08:11:30.492', '2026-08-02 08:11:30.493'),
('a361e373-04e7-4d9d-8877-e2714fa4fcd6', '52897111-6585-4527-9211-1a20b7c2ff8f', 'b8148103-3284-4a0a-94a2-6f047a769195', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/151.0.0.0 Safari/537.36', '2026-08-17 09:33:47.657', '2026-08-10 09:33:47.658'),
('a4788f9d-10e8-4286-bb33-55aafe81c9d6', '52897111-6585-4527-9211-1a20b7c2ff8f', '4969ffdc-4e7c-40c9-9404-3d404416be7e', '127.0.0.1', 'Mozilla/5.0 (Windows NT; Windows NT 10.0; en-US) WindowsPowerShell/5.1.19041.6456', '2026-08-09 09:59:13.751', '2026-08-02 09:59:13.754'),
('ab2da47d-3b21-4ea7-91c0-ac63d2928a1e', '52897111-6585-4527-9211-1a20b7c2ff8f', '8e44f98f-593b-4f5f-8414-76c28114eb83', '127.0.0.1', 'Mozilla/5.0 (Windows NT; Windows NT 10.0; en-US) WindowsPowerShell/5.1.19041.6456', '2026-08-09 09:19:34.675', '2026-08-02 09:19:34.676'),
('adeaeb36-63f4-4f12-adb0-c98b103760e5', '52897111-6585-4527-9211-1a20b7c2ff8f', 'a5c7bc14-5434-46a5-933d-a2675a0be043', '127.0.0.1', 'Mozilla/5.0 (Windows NT; Windows NT 10.0; en-US) WindowsPowerShell/5.1.19041.6456', '2026-08-09 09:56:50.487', '2026-08-02 09:56:50.498'),
('ae184e94-0526-4596-9c3f-a8f092275641', '52897111-6585-4527-9211-1a20b7c2ff8f', 'f326a1d9-5930-47a3-8205-18fcacfddaa6', '127.0.0.1', 'Mozilla/5.0 (Windows NT; Windows NT 10.0; en-US) WindowsPowerShell/5.1.19041.6456', '2026-08-09 09:20:06.474', '2026-08-02 09:20:06.476'),
('aef6b3a9-cb49-4c3c-bdbb-934e95eddbb3', '52897111-6585-4527-9211-1a20b7c2ff8f', '86efac66-fc65-4bb7-876d-c9571257a71b', '127.0.0.1', 'Mozilla/5.0 (Windows NT; Windows NT 10.0; en-US) WindowsPowerShell/5.1.19041.6456', '2026-08-09 09:44:35.777', '2026-08-02 09:44:35.791'),
('b6d5118c-0ca0-4769-91f6-1a62234ce87a', '45ca485a-cb01-4f4d-be0d-0c3d281a6e29', '36f0789d-f4f6-45e7-8235-2d804895b510', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/151.0.0.0 Safari/537.36', '2026-08-17 08:24:05.064', '2026-08-10 08:24:05.066'),
('b8029024-8e75-4250-a079-80edf9a1ab7e', '52897111-6585-4527-9211-1a20b7c2ff8f', '64fc5b22-8d68-4fcd-95f8-84ad0c588549', '127.0.0.1', 'Mozilla/5.0 (Windows NT; Windows NT 10.0; en-US) WindowsPowerShell/5.1.19041.6456', '2026-08-09 09:28:57.842', '2026-08-02 09:28:57.852'),
('ba6f4caf-abc1-473c-abca-ff9b16b32b09', '52897111-6585-4527-9211-1a20b7c2ff8f', 'ffe1b67a-08ff-41eb-b60c-530c419ac3b0', '127.0.0.1', 'Mozilla/5.0 (Windows NT; Windows NT 10.0; en-US) WindowsPowerShell/5.1.19041.6456', '2026-08-09 09:21:58.826', '2026-08-02 09:21:58.839'),
('bad3d1e5-559a-4bf0-9905-1b594889ed08', '1af30a7a-4758-4a4d-a001-a76ca72ea6c5', 'b8b358c5-8c54-4cd3-82df-5af26844931f', '127.0.0.1', 'Mozilla/5.0 (Windows NT; Windows NT 10.0; en-US) WindowsPowerShell/5.1.19041.6456', '2026-08-09 08:11:31.644', '2026-08-02 08:11:31.645'),
('dc14839b-cc55-47c4-be72-21c7c99150fa', '1af30a7a-4758-4a4d-a001-a76ca72ea6c5', 'a6534b14-4161-424b-95b8-0284528652a8', '127.0.0.1', 'Mozilla/5.0 (Windows NT; Windows NT 10.0; en-US) WindowsPowerShell/5.1.19041.6456', '2026-08-09 08:13:12.591', '2026-08-02 08:13:12.593'),
('e9cb6bb0-154e-4b93-b838-ffcaf970b8c4', '52897111-6585-4527-9211-1a20b7c2ff8f', '7caf22ff-d7d5-458a-8261-368bf9ce425f', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/151.0.0.0 Safari/537.36', '2026-08-09 09:13:49.444', '2026-08-02 09:13:49.446'),
('ea696dc6-501d-4725-969e-3aca7031df81', 'fc9940e7-a1ca-4996-877e-15b70ff8da36', '6fb6ef86-dc96-4f98-93ce-cb5127c5d0ff', '127.0.0.1', 'Mozilla/5.0 (Windows NT; Windows NT 10.0; en-US) WindowsPowerShell/5.1.19041.6456', '2026-08-09 09:28:59.756', '2026-08-02 09:28:59.767'),
('f36dc47f-25b5-445c-94bf-4c35c5d09185', '83eaf298-cac4-4c7c-9704-631549951d39', '9316223d-80e1-4141-8e6f-b5351cdefd25', '127.0.0.1', 'Mozilla/5.0 (Windows NT; Windows NT 10.0; en-US) WindowsPowerShell/5.1.19041.6456', '2026-08-09 08:13:10.113', '2026-08-02 08:13:10.117'),
('f96ec187-6c3a-4fa7-8a89-2b2c8f61866a', 'a7e07343-b155-4218-9a29-f5bccb3a7eef', 'dff62a78-2ff4-4abf-a6c7-8b45fc53acc1', '127.0.0.1', 'Mozilla/5.0 (Windows NT; Windows NT 10.0; en-US) WindowsPowerShell/5.1.19041.6456', '2026-08-09 08:13:08.874', '2026-08-02 08:13:08.876'),
('fc09659a-6949-4e52-a00c-960752cdd683', 'e149fca0-f4f0-4018-bb35-89b9febd366a', '18746ea2-5d67-482e-b848-ad77d0c05246', '127.0.0.1', 'Mozilla/5.0 (Windows NT; Windows NT 10.0; en-US) WindowsPowerShell/5.1.19041.6456', '2026-08-09 08:11:31.089', '2026-08-02 08:11:31.090');

-- --------------------------------------------------------

--
-- Table structure for table `website_settings`
--

CREATE TABLE `website_settings` (
  `id` varchar(191) NOT NULL,
  `school_id` varchar(191) NOT NULL,
  `content` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL CHECK (json_valid(`content`)),
  `created_at` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updated_at` datetime(3) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `website_settings`
--

INSERT INTO `website_settings` (`id`, `school_id`, `content`, `created_at`, `updated_at`) VALUES
('fe11fc91-512a-4fe7-8687-558676c094b6', '7b2b510e-dab0-4f0f-9aae-f1d27c9de59c', '{\"tagline\":\"জ্ঞান, শৃঙ্খলা ও মানবিকতায় আগামীর পথচলা\",\"bannerImage\":\"/school-hero-v2.png\",\"banners\":[{\"title\":\"আপনার বিদ্যালয়ের নাম\",\"subtitle\":\"জ্ঞান, শৃঙ্খলা ও মানবিকতায় আগামীর পথচলা\",\"image\":\"/school-hero-v2.png\"},{\"title\":\"মানসম্মত আধুনিক শিক্ষা\",\"subtitle\":\"মেধা, মনন ও সৃজনশীলতায় প্রতিটি শিক্ষার্থীর বিকাশ\",\"image\":\"/school-hero-science.webp\",\"buttonText\":\"আমাদের সম্পর্কে\",\"buttonHref\":\"/about\"}],\"menu\":[{\"label\":\"হোম\",\"href\":\"/\",\"color\":\"#ff8a00\"},{\"label\":\"আমাদের সম্পর্কে\",\"href\":\"/about\",\"color\":\"#e91e63\",\"children\":[{\"label\":\"বিদ্যালয় পরিচিতি\",\"href\":\"/about\"},{\"label\":\"শিক্ষকমণ্ডলী\",\"href\":\"/our-teachers\"},{\"label\":\"সুযোগ-সুবিধা\",\"href\":\"/facilities\"},{\"label\":\"আমাদের অর্জন\",\"href\":\"/achievements\"}]},{\"label\":\"একাডেমিক\",\"href\":\"/academic-activities\",\"color\":\"#8e24aa\",\"children\":[{\"label\":\"একাডেমিক কার্যক্রম\",\"href\":\"/academic-activities\"},{\"label\":\"প্রোগ্রাম ও ক্লাব\",\"href\":\"/programs\"},{\"label\":\"ডাউনলোডস\",\"href\":\"/downloads\"}]},{\"label\":\"ভর্তি\",\"href\":\"/admission-information\",\"color\":\"#b45309\",\"children\":[{\"label\":\"ভর্তি তথ্য\",\"href\":\"/admission-information\"},{\"label\":\"অনলাইন আবেদন\",\"href\":\"/admission/apply\"},{\"label\":\"আবেদন ট্র্যাক করুন\",\"href\":\"/admission/track\"}]},{\"label\":\"গ্যালারি\",\"href\":\"/gallery\",\"color\":\"#00838f\"},{\"label\":\"ইভেন্টস\",\"href\":\"/events\",\"color\":\"#6a1b9a\"},{\"label\":\"যোগাযোগ\",\"href\":\"/contact\",\"color\":\"#d84315\"}],\"pages\":[{\"slug\":\"about\",\"title\":\"আমাদের সম্পর্কে\",\"content\":\"আমাদের বিদ্যালয় মানসম্মত শিক্ষা, নৈতিকতা ও সৃজনশীলতার সমন্বয়ে শিক্ষার্থীদের আলোকিত মানুষ হিসেবে গড়ে তুলতে কাজ করে।\",\"sections\":[{\"heading\":\"ইতিহাস ও ঐতিহ্য\",\"content\":\"প্রতিষ্ঠালগ্ন থেকে বিদ্যালয়টি এলাকার শিক্ষাবিস্তারে গুরুত্বপূর্ণ ভূমিকা পালন করে আসছে।\"},{\"heading\":\"লক্ষ্য ও উদ্দেশ্য\",\"content\":\"জ্ঞান, দক্ষতা, মূল্যবোধ ও মানবিকতায় সমৃদ্ধ দায়িত্বশীল নাগরিক তৈরি করা।\"},{\"heading\":\"পরিচালনা পর্ষদ\",\"content\":\"অভিজ্ঞ শিক্ষাবিদ ও সমাজের প্রতিনিধিদের সমন্বয়ে বিদ্যালয়ের কার্যক্রম পরিচালিত হয়।\"}],\"image\":\"\"},{\"slug\":\"academic-activities\",\"title\":\"একাডেমিক কার্যক্রম\",\"content\":\"যোগ্য ও অভিজ্ঞ শিক্ষকমণ্ডলীর তত্ত্বাবধানে জাতীয় শিক্ষাক্রম অনুসারে নিয়মিত পাঠদান, মূল্যায়ন ও বিশেষ সহায়তা কার্যক্রম পরিচালিত হয়।\",\"sections\":[{\"heading\":\"শিক্ষাক্রম\",\"content\":\"জাতীয় শিক্ষাক্রম অনুসারে শ্রেণিভিত্তিক পরিকল্পিত পাঠদান।\"},{\"heading\":\"মূল্যায়ন পদ্ধতি\",\"content\":\"ধারাবাহিক মূল্যায়ন, শ্রেণি পরীক্ষা এবং সামষ্টিক পরীক্ষার সমন্বিত ব্যবস্থা।\"},{\"heading\":\"ক্লাস রুটিন\",\"content\":\"শিক্ষার্থীবান্ধব ও ভারসাম্যপূর্ণ দৈনিক পাঠসূচি।\"}]},{\"slug\":\"programs\",\"title\":\"প্রোগ্রাম ও সহশিক্ষা কার্যক্রম\",\"content\":\"বিজ্ঞান মেলা, বিতর্ক, খেলাধুলা, সাংস্কৃতিক অনুষ্ঠান, স্কাউটিং ও বিভিন্ন ক্লাব কার্যক্রম নিয়মিত আয়োজন করা হয়।\",\"sections\":[{\"heading\":\"বিজ্ঞান ও আইসিটি ক্লাব\",\"content\":\"উদ্ভাবন, প্রোগ্রামিং ও বিজ্ঞানভিত্তিক প্রকল্পে শিক্ষার্থীদের অংশগ্রহণ।\"},{\"heading\":\"ক্রীড়া ও সংস্কৃতি\",\"content\":\"বার্ষিক ক্রীড়া, সংগীত, আবৃত্তি ও সাংস্কৃতিক প্রতিযোগিতা।\"},{\"heading\":\"স্কাউট ও সামাজিক কার্যক্রম\",\"content\":\"নেতৃত্ব, শৃঙ্খলা ও সমাজসেবার বাস্তব অভিজ্ঞতা।\"}]},{\"slug\":\"gallery\",\"title\":\"ফটো গ্যালারি\",\"content\":\"বিদ্যালয়ের স্মরণীয় কার্যক্রম ও আয়োজনের নির্বাচিত ছবি।\",\"sections\":[]},{\"slug\":\"notices\",\"title\":\"সকল নোটিশ\",\"content\":\"বিদ্যালয়ের সর্বশেষ ঘোষণা, পরীক্ষার সময়সূচি, ভর্তি তথ্য এবং গুরুত্বপূর্ণ সকল নোটিশ এখানে পাওয়া যাবে।\",\"sections\":[]},{\"slug\":\"events\",\"title\":\"ইভেন্টস ও নোটিশ\",\"content\":\"বিদ্যালয়ের আসন্ন অনুষ্ঠান, পরীক্ষা এবং গুরুত্বপূর্ণ ঘোষণাসমূহ এখানে প্রকাশ করা হয়।\",\"sections\":[]},{\"slug\":\"admission-information\",\"title\":\"ভর্তি তথ্য\",\"content\":\"নতুন শিক্ষাবর্ষে বিভিন্ন শ্রেণিতে ভর্তি কার্যক্রম, যোগ্যতা, প্রয়োজনীয় কাগজপত্র ও সময়সূচি এখানে পাওয়া যাবে।\",\"sections\":[{\"heading\":\"ভর্তির যোগ্যতা\",\"content\":\"শ্রেণিভেদে বয়স, পূর্ববর্তী ফলাফল এবং আসনসংখ্যা অনুযায়ী ভর্তি নেওয়া হয়।\"},{\"heading\":\"প্রয়োজনীয় কাগজপত্র\",\"content\":\"জন্মনিবন্ধন, ছবি, পূর্ববর্তী বিদ্যালয়ের ছাড়পত্র ও ফলাফলের কপি।\"},{\"heading\":\"আবেদন প্রক্রিয়া\",\"content\":\"অনলাইনে আবেদন সম্পন্ন করে নির্ধারিত সময়ে প্রয়োজনীয় কাগজপত্র জমা দিতে হবে।\"}]},{\"slug\":\"our-teachers\",\"title\":\"শিক্ষকমণ্ডলী\",\"content\":\"যোগ্য, অভিজ্ঞ ও নিবেদিত শিক্ষকমণ্ডলী শিক্ষার্থীদের একাডেমিক ও নৈতিক বিকাশে কাজ করছেন।\",\"sections\":[]},{\"slug\":\"facilities\",\"title\":\"সুযোগ-সুবিধা\",\"content\":\"নিরাপদ ও শিক্ষার্থীবান্ধব ক্যাম্পাসে আধুনিক শিক্ষার প্রয়োজনীয় সুযোগ-সুবিধা রয়েছে।\",\"sections\":[{\"heading\":\"বিজ্ঞানাগার ও কম্পিউটার ল্যাব\",\"content\":\"ব্যবহারিক বিজ্ঞান শিক্ষা ও ডিজিটাল দক্ষতা অর্জনের আধুনিক ব্যবস্থা।\"},{\"heading\":\"লাইব্রেরি\",\"content\":\"পাঠ্যবই, রেফারেন্স ও সাহিত্যসমৃদ্ধ শান্ত পাঠপরিবেশ।\"},{\"heading\":\"খেলার মাঠ ও নিরাপত্তা\",\"content\":\"নিয়মিত খেলাধুলা, বিশুদ্ধ পানি, সিসিটিভি ও নিরাপদ ক্যাম্পাস।\"}]},{\"slug\":\"achievements\",\"title\":\"আমাদের অর্জন\",\"content\":\"একাডেমিক ফলাফল, ক্রীড়া, সংস্কৃতি ও বিভিন্ন প্রতিযোগিতায় বিদ্যালয়ের সাফল্য।\",\"sections\":[{\"heading\":\"একাডেমিক সাফল্য\",\"content\":\"পাবলিক পরীক্ষা ও বৃত্তিতে ধারাবাহিক ভালো ফলাফল।\"},{\"heading\":\"সহশিক্ষা অর্জন\",\"content\":\"বিতর্ক, বিজ্ঞান মেলা, ক্রীড়া ও সাংস্কৃতিক প্রতিযোগিতায় পুরস্কার।\"}]},{\"slug\":\"downloads\",\"title\":\"ডাউনলোডস\",\"content\":\"ফরম, রুটিন, সিলেবাস ও বিদ্যালয়ের প্রয়োজনীয় প্রকাশনা এখান থেকে সংগ্রহ করুন।\",\"sections\":[]},{\"slug\":\"contact\",\"title\":\"যোগাযোগ\",\"content\":\"বিদ্যালয় অফিসে রবি থেকে বৃহস্পতিবার সকাল ৯টা থেকে বিকেল ৪টার মধ্যে যোগাযোগ করুন।\",\"sections\":[]}],\"notices\":[{\"title\":\"নতুন শিক্ষাবর্ষে ভর্তি কার্যক্রম চলছে\",\"date\":\"০৩ আগস্ট ২০২৬\",\"featured\":true},{\"title\":\"অভিভাবক সমাবেশ ও ফলাফল প্রকাশ সংক্রান্ত নোটিশ\",\"date\":\"২৮ জুলাই ২০২৬\",\"featured\":true},{\"title\":\"আগামী সপ্তাহের শ্রেণি কার্যক্রম ও পরীক্ষার সময়সূচি\",\"date\":\"২৫ জুলাই ২০২৬\",\"featured\":true},{\"title\":\"পরীক্ষার সময়সূচি\",\"date\":\"২৫ জুলাই ২০২৬\",\"href\":\"\",\"featured\":true}],\"aboutTitle\":\"আমাদের বিদ্যালয় সম্পর্কে\",\"aboutText\":\"সুশিক্ষা, নৈতিকতা ও আধুনিক জ্ঞানচর্চার মাধ্যমে শিক্ষার্থীদের আলোকিত মানুষ হিসেবে গড়ে তোলাই আমাদের লক্ষ্য। অভিজ্ঞ শিক্ষক, নিরাপদ পরিবেশ এবং সহশিক্ষা কার্যক্রমের সমন্বয়ে এখানে প্রতিটি শিক্ষার্থী বিকশিত হওয়ার সুযোগ পায়।\",\"principalName\":\"প্রধান শিক্ষক\",\"principalMessage\":\"প্রিয় শিক্ষার্থী ও অভিভাবকবৃন্দ, আমাদের বিদ্যালয়ের ওয়েবসাইটে আপনাদের স্বাগতম। আমরা প্রতিটি শিক্ষার্থীর মেধা, মনন ও মানবিকতার পূর্ণ বিকাশে প্রতিশ্রুতিবদ্ধ।\",\"principalImage\":\"\",\"academics\":[{\"title\":\"প্রাথমিক শাখা\",\"text\":\"শিশুবান্ধব পরিবেশে আনন্দময় ও ভিত্তিমূলক শিক্ষা।\"},{\"title\":\"মাধ্যমিক শাখা\",\"text\":\"বিজ্ঞান, মানবিক ও ব্যবসায় শিক্ষায় মানসম্মত পাঠদান।\"},{\"title\":\"সহশিক্ষা কার্যক্রম\",\"text\":\"ক্রীড়া, বিতর্ক, সংস্কৃতি ও বিজ্ঞানচর্চার নিয়মিত আয়োজন।\"}],\"gallery\":[],\"teachers\":[],\"publicTeacherIds\":[\"demo-teacher-1\",\"demo-teacher-2\",\"demo-teacher-3\",\"demo-teacher-4\",\"demo-teacher-5\",\"demo-teacher-6\"],\"homeTeacherIds\":[\"demo-teacher-3\",\"demo-teacher-1\",\"demo-teacher-2\"],\"meetingDates\":[{\"date\":\"2026-08-03\",\"label\":\"মাসিক শিক্ষক সভা\",\"type\":\"MEETING\"},{\"date\":\"\",\"label\":\"\",\"type\":\"EVENT\"}],\"calendarWeeklyOffDays\":[5,6],\"emergencyContacts\":[{\"label\":\"সরকারি তথ্য ও সেবা\",\"number\":\"৩৩৩\"},{\"label\":\"জরুরি সেবা\",\"number\":\"৯৯৯\"},{\"label\":\"ফায়ার সার্ভিস হটলাইন\",\"number\":\"১০২\"}],\"campaignLinks\":[{\"label\":\"বাংলা অভিযান\",\"href\":\"#\"},{\"label\":\"ইংরেজি অভিযান\",\"href\":\"#\"}],\"downloads\":[{\"title\":\"sdffgfdg\",\"category\":\"PUBLICATION\",\"fileUrl\":\"/uploads/website/july_2026_elements_statement-06c10c9f.pdf\",\"classId\":\"demo-class-6\",\"sectionId\":\"demo-section-6-1\",\"publishedAt\":\"2026-08-03\"},{\"title\":\"july_2026_elements_statement\",\"category\":\"PUBLICATION\",\"fileUrl\":\"/uploads/website/july_2026_elements_statement-c45ed95c.pdf\",\"classId\":\"demo-class-6\",\"sectionId\":\"\",\"publishedAt\":\"2026-08-10\"}],\"admissionText\":\"ভর্তি সংক্রান্ত বিস্তারিত জানতে বিদ্যালয় অফিসে যোগাযোগ করুন অথবা অনলাইনে আবেদন করুন।\",\"contactAddress\":\"Dhanmondi, Dhaka 1209\",\"contactPhone\":\"+880 2-55001234\",\"contactEmail\":\"office@shaplamodel.edu.bd\",\"contactText\":\"বিদ্যালয় অফিস • রবি–বৃহস্পতি, সকাল ৯টা–বিকেল ৪টা\",\"footerText\":\"সর্বস্বত্ব সংরক্ষিত\",\"theme\":{\"primary\":\"#281fa3\",\"secondary\":\"#796d5a\",\"background\":\"#f4f1e9\",\"border\":\"#ded8cc\"}}', '2026-08-03 06:33:20.179', '2026-08-10 05:54:59.936');

-- --------------------------------------------------------

--
-- Table structure for table `_prisma_migrations`
--

CREATE TABLE `_prisma_migrations` (
  `id` varchar(36) NOT NULL,
  `checksum` varchar(64) NOT NULL,
  `finished_at` datetime(3) DEFAULT NULL,
  `migration_name` varchar(255) NOT NULL,
  `logs` text DEFAULT NULL,
  `rolled_back_at` datetime(3) DEFAULT NULL,
  `started_at` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `applied_steps_count` int(10) UNSIGNED NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `_prisma_migrations`
--

INSERT INTO `_prisma_migrations` (`id`, `checksum`, `finished_at`, `migration_name`, `logs`, `rolled_back_at`, `started_at`, `applied_steps_count`) VALUES
('0505fc42-9109-41fd-8116-cf091a011b12', '92aa623dc375ba68574f68b7db507857c8ac0aebd71b3409f0491214ad11f507', '2026-07-23 10:42:55.676', '20260722100115_init', '', NULL, '2026-07-23 10:42:55.676', 0),
('106ce794-c8d8-41fc-97cb-7962dae02558', 'f86e35e44d728a4f22f6e9c31fa20a974a3b5d878a782746bfa97a6bee567ee5', '2026-08-09 12:08:29.612', '20260809170000_teacher_employee_self_service', NULL, NULL, '2026-08-09 12:08:29.598', 1),
('18d29776-b3a1-4b17-89d9-b26b6e90e2fd', 'f56c64a354dee484578837b41b7fca2e12b3d805afb3cfa0e84b496647af4fe7', '2026-07-23 11:19:46.680', '20260723190000_analytics_reports_import_export', NULL, NULL, '2026-07-23 11:19:45.898', 1),
('1f4084f4-209c-4528-aea8-aef3680b16ca', '28acf3acb6db0f7c1a7c92bab1ed9ca6ce94506aa978f45e2cef93568461e1b4', '2026-07-23 11:37:40.063', '20260723193000_import_export_permissions', NULL, NULL, '2026-07-23 11:37:40.030', 1),
('3cd1a018-e379-40c6-8ced-799a8793f9eb', '3805d86c3721ca2a25be9db341c5ba1c50ba1ad17b2f7637c9b0852d59620f12', '2026-07-23 12:21:05.105', '20260723203000_teacher_dashboard_permission', NULL, NULL, '2026-07-23 12:21:05.081', 1),
('480cf0a8-a1b5-4549-a094-c9243c39e72a', 'cef59bb0b21688a6eda149cdef759d0898f9ce7edec6ba63b405f1e2b8c7af2d', '2026-07-23 12:06:00.781', '20260723200000_staff_dashboard_permissions', NULL, NULL, '2026-07-23 12:06:00.757', 1),
('70569f30-142b-4fc7-8c6d-ce699f314bf8', '67ca24e23dc3824aa03dcac93c02764ed155de622c9d32aef5559d2f5befa88b', '2026-08-10 08:26:54.977', '20260810193000_scope_website_management_role', NULL, NULL, '2026-08-10 08:26:54.955', 1),
('793b336b-a4ea-4134-9561-20469de4a877', '92aa623dc375ba68574f68b7db507857c8ac0aebd71b3409f0491214ad11f507', NULL, '20260722100115_init', 'A migration failed to apply. New migrations cannot be applied before the error is recovered from. Read more about how to resolve migration issues in a production database: https://pris.ly/d/migrate-resolve\n\nMigration name: 20260722100115_init\n\nDatabase error code: 1005\n\nDatabase error:\nCan\'t create table `school_management`.`teacher_assignments` (errno: 150 \"Foreign key constraint is incorrectly formed\")\n\nPlease check the query number 170 from the migration file.\n\n   0: sql_schema_connector::apply_migration::apply_script\n           with migration_name=\"20260722100115_init\"\n             at schema-engine\\connectors\\sql-schema-connector\\src\\apply_migration.rs:106\n   1: schema_core::commands::apply_migrations::Applying migration\n           with migration_name=\"20260722100115_init\"\n             at schema-engine\\core\\src\\commands\\apply_migrations.rs:91\n   2: schema_core::state::ApplyMigrations\n             at schema-engine\\core\\src\\state.rs:226', '2026-07-23 10:42:55.657', '2026-07-22 10:01:16.004', 0),
('98620c60-6536-41e1-916e-9110a292839d', '4b562c17b0ed48ab38e623447c3a4fdc2b84bc49994ee92eaeaa24e5d9df8e81', '2026-08-02 05:56:52.575', '20260802090000_granular_rbac_permissions', NULL, NULL, '2026-08-02 05:56:52.542', 1),
('aad22157-cbc0-48f1-a7ea-56bdacf2bbaf', '723c6155f41303e56b9732d2288fc908ed94dc9a9c35e556a88b862de254c6f1', '2026-08-10 08:47:14.996', '20260810200000_rename_website_permission_module', NULL, NULL, '2026-08-10 08:47:14.986', 1),
('bbdae269-3b4b-4186-945f-68a582a72f34', '947f14d2cd085dbc319a2cf60b07ad0a754e460d5968ac9beaafeaea353fb4b8', '2026-08-03 05:29:46.277', '20260803120000_website_settings', NULL, NULL, '2026-08-03 05:29:46.206', 1),
('fa5fe11c-d1ef-4e5f-b36f-ae74f3d4e6df', '20fafc0b9339c028b3698b60857c268007a29265e433b52877bb901f45ea140d', '2026-08-10 08:16:22.988', '20260810190000_website_management_permissions', NULL, NULL, '2026-08-10 08:16:22.968', 1);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `academic_sessions`
--
ALTER TABLE `academic_sessions`
  ADD PRIMARY KEY (`id`),
  ADD KEY `academic_sessions_school_id_fkey` (`school_id`),
  ADD KEY `academic_sessions_academic_year_id_fkey` (`academic_year_id`);

--
-- Indexes for table `academic_years`
--
ALTER TABLE `academic_years`
  ADD PRIMARY KEY (`id`),
  ADD KEY `academic_years_school_id_fkey` (`school_id`);

--
-- Indexes for table `activity_logs`
--
ALTER TABLE `activity_logs`
  ADD PRIMARY KEY (`id`),
  ADD KEY `activity_logs_user_id_fkey` (`user_id`);

--
-- Indexes for table `admission_applications`
--
ALTER TABLE `admission_applications`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `admission_applications_application_number_key` (`application_number`),
  ADD UNIQUE KEY `admission_applications_tracking_code_key` (`tracking_code`),
  ADD KEY `admission_applications_campaign_id_fkey` (`campaign_id`),
  ADD KEY `admission_applications_class_id_fkey` (`class_id`),
  ADD KEY `admission_applications_group_id_fkey` (`group_id`),
  ADD KEY `admission_applications_school_id_status_created_at_idx` (`school_id`,`status`,`created_at`),
  ADD KEY `admission_applications_school_id_class_id_created_at_idx` (`school_id`,`class_id`,`created_at`);

--
-- Indexes for table `admission_application_guardians`
--
ALTER TABLE `admission_application_guardians`
  ADD PRIMARY KEY (`id`),
  ADD KEY `admission_application_guardians_application_id_fkey` (`application_id`);

--
-- Indexes for table `admission_campaigns`
--
ALTER TABLE `admission_campaigns`
  ADD PRIMARY KEY (`id`),
  ADD KEY `admission_campaigns_school_id_fkey` (`school_id`),
  ADD KEY `admission_campaigns_academic_year_id_fkey` (`academic_year_id`);

--
-- Indexes for table `admission_documents`
--
ALTER TABLE `admission_documents`
  ADD PRIMARY KEY (`id`),
  ADD KEY `admission_documents_application_id_fkey` (`application_id`);

--
-- Indexes for table `admission_interviews`
--
ALTER TABLE `admission_interviews`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `admission_interviews_application_id_key` (`application_id`);

--
-- Indexes for table `admission_reviews`
--
ALTER TABLE `admission_reviews`
  ADD PRIMARY KEY (`id`),
  ADD KEY `admission_reviews_application_id_fkey` (`application_id`);

--
-- Indexes for table `admission_tests`
--
ALTER TABLE `admission_tests`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `admission_tests_application_id_key` (`application_id`);

--
-- Indexes for table `admit_cards`
--
ALTER TABLE `admit_cards`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `admit_cards_admit_card_number_key` (`admit_card_number`),
  ADD UNIQUE KEY `admit_cards_verification_code_key` (`verification_code`),
  ADD UNIQUE KEY `admit_cards_exam_id_student_id_key` (`exam_id`,`student_id`);

--
-- Indexes for table `attendances`
--
ALTER TABLE `attendances`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `attendances_student_id_date_key` (`student_id`,`date`);

--
-- Indexes for table `attendance_corrections`
--
ALTER TABLE `attendance_corrections`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `attendance_notifications`
--
ALTER TABLE `attendance_notifications`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `attendance_sessions`
--
ALTER TABLE `attendance_sessions`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `audit_logs`
--
ALTER TABLE `audit_logs`
  ADD PRIMARY KEY (`id`),
  ADD KEY `audit_logs_school_id_created_at_idx` (`school_id`,`created_at`),
  ADD KEY `audit_logs_user_id_created_at_idx` (`user_id`,`created_at`),
  ADD KEY `audit_logs_module_action_created_at_idx` (`module`,`action`,`created_at`);

--
-- Indexes for table `billing_periods`
--
ALTER TABLE `billing_periods`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `billing_periods_school_id_academic_year_id_year_month_key` (`school_id`,`academic_year_id`,`year`,`month`);

--
-- Indexes for table `branding_settings`
--
ALTER TABLE `branding_settings`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `branding_settings_school_id_key` (`school_id`);

--
-- Indexes for table `certificates`
--
ALTER TABLE `certificates`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `certificates_certificate_number_key` (`certificate_number`),
  ADD UNIQUE KEY `certificates_verification_code_key` (`verification_code`);

--
-- Indexes for table `certificate_types`
--
ALTER TABLE `certificate_types`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `certificate_types_school_id_code_key` (`school_id`,`code`);

--
-- Indexes for table `classes`
--
ALTER TABLE `classes`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `classes_school_id_code_key` (`school_id`,`code`);

--
-- Indexes for table `class_groups`
--
ALTER TABLE `class_groups`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `class_groups_academic_year_id_class_id_group_id_key` (`academic_year_id`,`class_id`,`group_id`),
  ADD KEY `class_groups_school_id_fkey` (`school_id`),
  ADD KEY `class_groups_class_id_fkey` (`class_id`),
  ADD KEY `class_groups_group_id_fkey` (`group_id`);

--
-- Indexes for table `class_routines`
--
ALTER TABLE `class_routines`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `class_sections`
--
ALTER TABLE `class_sections`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `class_sections_academic_year_id_class_id_section_id_key` (`academic_year_id`,`class_id`,`section_id`),
  ADD KEY `class_sections_school_id_fkey` (`school_id`),
  ADD KEY `class_sections_class_id_fkey` (`class_id`),
  ADD KEY `class_sections_section_id_fkey` (`section_id`);

--
-- Indexes for table `class_subjects`
--
ALTER TABLE `class_subjects`
  ADD PRIMARY KEY (`id`),
  ADD KEY `class_subjects_school_id_fkey` (`school_id`),
  ADD KEY `class_subjects_academic_year_id_fkey` (`academic_year_id`),
  ADD KEY `class_subjects_class_id_fkey` (`class_id`),
  ADD KEY `class_subjects_group_id_fkey` (`group_id`),
  ADD KEY `class_subjects_subject_id_fkey` (`subject_id`),
  ADD KEY `class_subjects_teacher_id_fkey` (`teacher_id`);

--
-- Indexes for table `departments`
--
ALTER TABLE `departments`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `departments_school_id_code_key` (`school_id`,`code`);

--
-- Indexes for table `designations`
--
ALTER TABLE `designations`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `designations_school_id_code_key` (`school_id`,`code`);

--
-- Indexes for table `document_templates`
--
ALTER TABLE `document_templates`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `document_verifications`
--
ALTER TABLE `document_verifications`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `employees`
--
ALTER TABLE `employees`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `employees_school_id_employee_code_key` (`school_id`,`employee_code`),
  ADD UNIQUE KEY `employees_user_id_key` (`user_id`),
  ADD KEY `employees_department_id_fkey` (`department_id`),
  ADD KEY `employees_designation_id_fkey` (`designation_id`);

--
-- Indexes for table `employee_attendances`
--
ALTER TABLE `employee_attendances`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `employee_documents`
--
ALTER TABLE `employee_documents`
  ADD PRIMARY KEY (`id`),
  ADD KEY `employee_documents_teacher_id_fkey` (`teacher_id`),
  ADD KEY `employee_documents_employee_id_fkey` (`employee_id`);

--
-- Indexes for table `employee_salary_assignments`
--
ALTER TABLE `employee_salary_assignments`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `employment_histories`
--
ALTER TABLE `employment_histories`
  ADD PRIMARY KEY (`id`),
  ADD KEY `employment_histories_teacher_id_fkey` (`teacher_id`),
  ADD KEY `employment_histories_employee_id_fkey` (`employee_id`);

--
-- Indexes for table `exams`
--
ALTER TABLE `exams`
  ADD PRIMARY KEY (`id`),
  ADD KEY `exams_school_id_fkey` (`school_id`);

--
-- Indexes for table `exam_classes`
--
ALTER TABLE `exam_classes`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `exam_fee_assignments`
--
ALTER TABLE `exam_fee_assignments`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `exam_fee_structures`
--
ALTER TABLE `exam_fee_structures`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `exam_mark_distributions`
--
ALTER TABLE `exam_mark_distributions`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `exam_routines`
--
ALTER TABLE `exam_routines`
  ADD PRIMARY KEY (`id`),
  ADD KEY `exam_routines_school_id_academic_year_id_exam_date_idx` (`school_id`,`academic_year_id`,`exam_date`),
  ADD KEY `exam_routines_class_id_section_id_subject_id_idx` (`class_id`,`section_id`,`subject_id`);

--
-- Indexes for table `exam_subjects`
--
ALTER TABLE `exam_subjects`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `exam_types`
--
ALTER TABLE `exam_types`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `exam_types_school_id_code_key` (`school_id`,`code`);

--
-- Indexes for table `export_histories`
--
ALTER TABLE `export_histories`
  ADD PRIMARY KEY (`id`),
  ADD KEY `export_histories_school_id_report_type_created_at_idx` (`school_id`,`report_type`,`created_at`),
  ADD KEY `export_histories_user_id_created_at_idx` (`user_id`,`created_at`);

--
-- Indexes for table `failed_login_attempts`
--
ALTER TABLE `failed_login_attempts`
  ADD PRIMARY KEY (`id`),
  ADD KEY `failed_login_attempts_user_id_fkey` (`user_id`);

--
-- Indexes for table `fee_invoices`
--
ALTER TABLE `fee_invoices`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `fee_invoices_invoice_number_key` (`invoice_number`),
  ADD KEY `fee_invoices_school_id_fkey` (`school_id`),
  ADD KEY `fee_invoices_student_id_fkey` (`student_id`),
  ADD KEY `fee_invoices_fee_structure_id_fkey` (`fee_structure_id`);

--
-- Indexes for table `fee_structures`
--
ALTER TABLE `fee_structures`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fee_structures_school_id_fkey` (`school_id`);

--
-- Indexes for table `fee_structure_items`
--
ALTER TABLE `fee_structure_items`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fee_structure_items_fee_structure_id_fkey` (`fee_structure_id`);

--
-- Indexes for table `fee_types`
--
ALTER TABLE `fee_types`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `fee_types_school_id_code_key` (`school_id`,`code`);

--
-- Indexes for table `fee_waivers`
--
ALTER TABLE `fee_waivers`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `financial_accounts`
--
ALTER TABLE `financial_accounts`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `financial_transactions`
--
ALTER TABLE `financial_transactions`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `financial_transactions_transaction_number_key` (`transaction_number`),
  ADD KEY `financial_transactions_school_id_transaction_date_transactio_idx` (`school_id`,`transaction_date`,`transaction_type`),
  ADD KEY `financial_transactions_school_id_category_transaction_date_idx` (`school_id`,`category`,`transaction_date`);

--
-- Indexes for table `fines`
--
ALTER TABLE `fines`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `generated_documents`
--
ALTER TABLE `generated_documents`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `generated_documents_verification_code_key` (`verification_code`);

--
-- Indexes for table `grade_scales`
--
ALTER TABLE `grade_scales`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `grading_rules`
--
ALTER TABLE `grading_rules`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `groups`
--
ALTER TABLE `groups`
  ADD PRIMARY KEY (`id`),
  ADD KEY `groups_school_id_fkey` (`school_id`);

--
-- Indexes for table `guardians`
--
ALTER TABLE `guardians`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `guardians_user_id_key` (`user_id`),
  ADD KEY `guardians_school_id_fkey` (`school_id`);

--
-- Indexes for table `holidays`
--
ALTER TABLE `holidays`
  ADD PRIMARY KEY (`id`),
  ADD KEY `holidays_school_id_fkey` (`school_id`),
  ADD KEY `holidays_academic_year_id_fkey` (`academic_year_id`);

--
-- Indexes for table `homeworks`
--
ALTER TABLE `homeworks`
  ADD PRIMARY KEY (`id`),
  ADD KEY `homeworks_class_id_fkey` (`class_id`),
  ADD KEY `homeworks_section_id_fkey` (`section_id`),
  ADD KEY `homeworks_subject_id_fkey` (`subject_id`),
  ADD KEY `homeworks_teacher_id_fkey` (`teacher_id`);

--
-- Indexes for table `import_histories`
--
ALTER TABLE `import_histories`
  ADD PRIMARY KEY (`id`),
  ADD KEY `import_histories_school_id_import_type_created_at_idx` (`school_id`,`import_type`,`created_at`),
  ADD KEY `import_histories_user_id_created_at_idx` (`user_id`,`created_at`);

--
-- Indexes for table `invoice_items`
--
ALTER TABLE `invoice_items`
  ADD PRIMARY KEY (`id`),
  ADD KEY `invoice_items_invoice_id_fkey` (`invoice_id`);

--
-- Indexes for table `leave_applications`
--
ALTER TABLE `leave_applications`
  ADD PRIMARY KEY (`id`),
  ADD KEY `leave_applications_school_id_status_applied_at_idx` (`school_id`,`status`,`applied_at`),
  ADD KEY `leave_applications_user_id_start_date_end_date_idx` (`user_id`,`start_date`,`end_date`);

--
-- Indexes for table `leave_approvals`
--
ALTER TABLE `leave_approvals`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `leave_types`
--
ALTER TABLE `leave_types`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `leave_types_school_id_code_key` (`school_id`,`code`);

--
-- Indexes for table `legacy_installments`
--
ALTER TABLE `legacy_installments`
  ADD PRIMARY KEY (`id`),
  ADD KEY `legacy_installments_school_id_legacy_student_ref_idx` (`school_id`,`legacy_student_ref`),
  ADD KEY `legacy_installments_school_id_migration_status_idx` (`school_id`,`migration_status`),
  ADD KEY `legacy_installments_student_id_idx` (`student_id`),
  ADD KEY `legacy_installments_legacy_import_id_fkey` (`legacy_import_id`);

--
-- Indexes for table `legacy_installment_imports`
--
ALTER TABLE `legacy_installment_imports`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `legacy_installment_imports_import_history_id_key` (`import_history_id`),
  ADD KEY `legacy_installment_imports_school_id_created_at_idx` (`school_id`,`created_at`);

--
-- Indexes for table `legacy_installment_payments`
--
ALTER TABLE `legacy_installment_payments`
  ADD PRIMARY KEY (`id`),
  ADD KEY `legacy_installment_payments_legacy_installment_id_payment_da_idx` (`legacy_installment_id`,`payment_date`);

--
-- Indexes for table `login_histories`
--
ALTER TABLE `login_histories`
  ADD PRIMARY KEY (`id`),
  ADD KEY `login_histories_user_id_fkey` (`user_id`);

--
-- Indexes for table `marks`
--
ALTER TABLE `marks`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `marks_exam_id_student_id_subject_id_key` (`exam_id`,`student_id`,`subject_id`),
  ADD KEY `marks_student_id_fkey` (`student_id`),
  ADD KEY `marks_subject_id_fkey` (`subject_id`);

--
-- Indexes for table `marks_verifications`
--
ALTER TABLE `marks_verifications`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `monthly_fee_schedules`
--
ALTER TABLE `monthly_fee_schedules`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `notifications`
--
ALTER TABLE `notifications`
  ADD PRIMARY KEY (`id`),
  ADD KEY `notifications_school_id_fkey` (`school_id`),
  ADD KEY `notifications_user_id_fkey` (`user_id`);

--
-- Indexes for table `password_reset_tokens`
--
ALTER TABLE `password_reset_tokens`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `password_reset_tokens_token_key` (`token`),
  ADD KEY `password_reset_tokens_user_id_fkey` (`user_id`);

--
-- Indexes for table `payments`
--
ALTER TABLE `payments`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `payments_receipt_number_key` (`receipt_number`),
  ADD KEY `payments_invoice_id_fkey` (`invoice_id`);

--
-- Indexes for table `payment_allocations`
--
ALTER TABLE `payment_allocations`
  ADD PRIMARY KEY (`id`),
  ADD KEY `payment_allocations_payment_id_fkey` (`payment_id`);

--
-- Indexes for table `payment_reversals`
--
ALTER TABLE `payment_reversals`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `payment_reversals_reversal_number_key` (`reversal_number`);

--
-- Indexes for table `payrolls`
--
ALTER TABLE `payrolls`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `payrolls_payroll_period_id_user_id_key` (`payroll_period_id`,`user_id`),
  ADD KEY `payrolls_teacherId_fkey` (`teacherId`),
  ADD KEY `payrolls_school_id_status_created_at_idx` (`school_id`,`status`,`created_at`),
  ADD KEY `payrolls_user_id_created_at_idx` (`user_id`,`created_at`);

--
-- Indexes for table `payroll_adjustments`
--
ALTER TABLE `payroll_adjustments`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `payroll_items`
--
ALTER TABLE `payroll_items`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `payroll_periods`
--
ALTER TABLE `payroll_periods`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `payroll_periods_school_id_payroll_year_payroll_month_key` (`school_id`,`payroll_year`,`payroll_month`);

--
-- Indexes for table `payslips`
--
ALTER TABLE `payslips`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `payslips_payroll_id_key` (`payroll_id`),
  ADD UNIQUE KEY `payslips_payslip_number_key` (`payslip_number`);

--
-- Indexes for table `periods`
--
ALTER TABLE `periods`
  ADD PRIMARY KEY (`id`),
  ADD KEY `periods_school_id_fkey` (`school_id`);

--
-- Indexes for table `permissions`
--
ALTER TABLE `permissions`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `permissions_code_key` (`code`);

--
-- Indexes for table `receipts`
--
ALTER TABLE `receipts`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `receipts_receipt_number_key` (`receipt_number`);

--
-- Indexes for table `refunds`
--
ALTER TABLE `refunds`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `refunds_refund_number_key` (`refund_number`);

--
-- Indexes for table `report_cards`
--
ALTER TABLE `report_cards`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `report_cards_report_card_number_key` (`report_card_number`),
  ADD UNIQUE KEY `report_cards_verification_code_key` (`verification_code`),
  ADD UNIQUE KEY `report_cards_exam_id_student_id_key` (`exam_id`,`student_id`);

--
-- Indexes for table `result_publications`
--
ALTER TABLE `result_publications`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `result_subjects`
--
ALTER TABLE `result_subjects`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `roles`
--
ALTER TABLE `roles`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `roles_name_key` (`name`);

--
-- Indexes for table `role_permissions`
--
ALTER TABLE `role_permissions`
  ADD PRIMARY KEY (`role_id`,`permission_id`),
  ADD KEY `role_permissions_permission_id_fkey` (`permission_id`);

--
-- Indexes for table `rooms`
--
ALTER TABLE `rooms`
  ADD PRIMARY KEY (`id`),
  ADD KEY `rooms_school_id_fkey` (`school_id`);

--
-- Indexes for table `routines`
--
ALTER TABLE `routines`
  ADD PRIMARY KEY (`id`),
  ADD KEY `routines_class_id_fkey` (`class_id`),
  ADD KEY `routines_section_id_fkey` (`section_id`),
  ADD KEY `routines_subject_id_fkey` (`subject_id`),
  ADD KEY `routines_teacher_id_fkey` (`teacher_id`);

--
-- Indexes for table `routine_versions`
--
ALTER TABLE `routine_versions`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `salary_components`
--
ALTER TABLE `salary_components`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `salary_payments`
--
ALTER TABLE `salary_payments`
  ADD PRIMARY KEY (`id`),
  ADD KEY `salary_payments_payroll_id_payment_date_idx` (`payroll_id`,`payment_date`);

--
-- Indexes for table `salary_structures`
--
ALTER TABLE `salary_structures`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `salary_structures_school_id_code_key` (`school_id`,`code`);

--
-- Indexes for table `scholarships`
--
ALTER TABLE `scholarships`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `schools`
--
ALTER TABLE `schools`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `schools_code_key` (`code`);

--
-- Indexes for table `school_settings`
--
ALTER TABLE `school_settings`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `school_settings_school_id_key` (`school_id`);

--
-- Indexes for table `sections`
--
ALTER TABLE `sections`
  ADD PRIMARY KEY (`id`),
  ADD KEY `sections_school_id_fkey` (`school_id`),
  ADD KEY `sections_class_id_fkey` (`class_id`);

--
-- Indexes for table `students`
--
ALTER TABLE `students`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `students_school_id_admission_number_key` (`school_id`,`admission_number`),
  ADD UNIQUE KEY `students_school_id_student_code_key` (`school_id`,`student_code`),
  ADD UNIQUE KEY `students_user_id_key` (`user_id`),
  ADD KEY `students_class_id_fkey` (`class_id`),
  ADD KEY `students_section_id_fkey` (`section_id`);

--
-- Indexes for table `student_attendance_records`
--
ALTER TABLE `student_attendance_records`
  ADD PRIMARY KEY (`id`),
  ADD KEY `student_attendance_records_school_id_date_status_idx` (`school_id`,`date`,`status`),
  ADD KEY `student_attendance_records_student_id_date_idx` (`student_id`,`date`),
  ADD KEY `student_attendance_records_class_id_section_id_date_idx` (`class_id`,`section_id`,`date`);

--
-- Indexes for table `student_documents`
--
ALTER TABLE `student_documents`
  ADD PRIMARY KEY (`id`),
  ADD KEY `student_documents_student_id_fkey` (`student_id`);

--
-- Indexes for table `student_enrollments`
--
ALTER TABLE `student_enrollments`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `student_enrollments_academic_year_id_class_id_section_id_rol_key` (`academic_year_id`,`class_id`,`section_id`,`roll_number`),
  ADD KEY `student_enrollments_school_id_fkey` (`school_id`),
  ADD KEY `student_enrollments_student_id_fkey` (`student_id`),
  ADD KEY `student_enrollments_session_id_fkey` (`session_id`),
  ADD KEY `student_enrollments_class_id_fkey` (`class_id`),
  ADD KEY `student_enrollments_section_id_fkey` (`section_id`),
  ADD KEY `student_enrollments_group_id_fkey` (`group_id`);

--
-- Indexes for table `student_fee_assignments`
--
ALTER TABLE `student_fee_assignments`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `student_guardians`
--
ALTER TABLE `student_guardians`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `student_guardians_student_id_guardian_id_key` (`student_id`,`guardian_id`),
  ADD KEY `student_guardians_guardian_id_fkey` (`guardian_id`);

--
-- Indexes for table `student_invoices`
--
ALTER TABLE `student_invoices`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `student_invoices_invoice_number_key` (`invoice_number`),
  ADD UNIQUE KEY `student_invoices_school_id_student_id_enrollment_id_fee_type_key` (`school_id`,`student_id`,`enrollment_id`,`fee_type_id`,`billing_year`,`billing_month`),
  ADD KEY `student_invoices_school_id_billing_year_billing_month_paymen_idx` (`school_id`,`billing_year`,`billing_month`,`payment_status`),
  ADD KEY `student_invoices_student_id_due_date_idx` (`student_id`,`due_date`),
  ADD KEY `student_invoices_academic_year_id_fee_type_id_idx` (`academic_year_id`,`fee_type_id`);

--
-- Indexes for table `student_marks`
--
ALTER TABLE `student_marks`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `student_marks_exam_id_student_id_subject_id_key` (`exam_id`,`student_id`,`subject_id`);

--
-- Indexes for table `student_medical_information`
--
ALTER TABLE `student_medical_information`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `student_medical_information_student_id_key` (`student_id`);

--
-- Indexes for table `student_previous_education`
--
ALTER TABLE `student_previous_education`
  ADD PRIMARY KEY (`id`),
  ADD KEY `student_previous_education_student_id_fkey` (`student_id`);

--
-- Indexes for table `student_results`
--
ALTER TABLE `student_results`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `student_results_exam_id_student_id_key` (`exam_id`,`student_id`);

--
-- Indexes for table `student_status_histories`
--
ALTER TABLE `student_status_histories`
  ADD PRIMARY KEY (`id`),
  ADD KEY `student_status_histories_student_id_fkey` (`student_id`);

--
-- Indexes for table `subjects`
--
ALTER TABLE `subjects`
  ADD PRIMARY KEY (`id`),
  ADD KEY `subjects_school_id_fkey` (`school_id`);

--
-- Indexes for table `teachers`
--
ALTER TABLE `teachers`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `teachers_school_id_employee_code_key` (`school_id`,`employee_code`),
  ADD UNIQUE KEY `teachers_user_id_key` (`user_id`),
  ADD KEY `teachers_department_id_fkey` (`department_id`),
  ADD KEY `teachers_designation_id_fkey` (`designation_id`);

--
-- Indexes for table `teacher_assignments`
--
ALTER TABLE `teacher_assignments`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `teacher_assignments_school_id_academic_year_id_class_id_sect_key` (`school_id`,`academic_year_id`,`class_id`,`section_id`,`subject_id`,`teacher_id`) USING HASH,
  ADD KEY `teacher_assignments_school_id_idx` (`school_id`),
  ADD KEY `teacher_assignments_academic_year_id_idx` (`academic_year_id`),
  ADD KEY `teacher_assignments_session_id_idx` (`session_id`),
  ADD KEY `teacher_assignments_teacher_id_idx` (`teacher_id`),
  ADD KEY `teacher_assignments_class_id_idx` (`class_id`),
  ADD KEY `teacher_assignments_section_id_idx` (`section_id`),
  ADD KEY `teacher_assignments_group_id_idx` (`group_id`),
  ADD KEY `teacher_assignments_subject_id_idx` (`subject_id`);

--
-- Indexes for table `teacher_attendances`
--
ALTER TABLE `teacher_attendances`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `transcripts`
--
ALTER TABLE `transcripts`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `transcripts_transcript_number_key` (`transcript_number`),
  ADD UNIQUE KEY `transcripts_verification_code_key` (`verification_code`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `users_email_key` (`email`),
  ADD KEY `users_school_id_fkey` (`school_id`);

--
-- Indexes for table `user_roles`
--
ALTER TABLE `user_roles`
  ADD PRIMARY KEY (`user_id`,`role_id`),
  ADD KEY `user_roles_role_id_fkey` (`role_id`);

--
-- Indexes for table `user_sessions`
--
ALTER TABLE `user_sessions`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `user_sessions_token_key` (`token`),
  ADD KEY `user_sessions_user_id_fkey` (`user_id`);

--
-- Indexes for table `website_settings`
--
ALTER TABLE `website_settings`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `website_settings_school_id_key` (`school_id`);

--
-- Indexes for table `_prisma_migrations`
--
ALTER TABLE `_prisma_migrations`
  ADD PRIMARY KEY (`id`);

--
-- Constraints for dumped tables
--

--
-- Constraints for table `academic_sessions`
--
ALTER TABLE `academic_sessions`
  ADD CONSTRAINT `academic_sessions_academic_year_id_fkey` FOREIGN KEY (`academic_year_id`) REFERENCES `academic_years` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `academic_sessions_school_id_fkey` FOREIGN KEY (`school_id`) REFERENCES `schools` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `academic_years`
--
ALTER TABLE `academic_years`
  ADD CONSTRAINT `academic_years_school_id_fkey` FOREIGN KEY (`school_id`) REFERENCES `schools` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `activity_logs`
--
ALTER TABLE `activity_logs`
  ADD CONSTRAINT `activity_logs_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `admission_applications`
--
ALTER TABLE `admission_applications`
  ADD CONSTRAINT `admission_applications_campaign_id_fkey` FOREIGN KEY (`campaign_id`) REFERENCES `admission_campaigns` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `admission_applications_class_id_fkey` FOREIGN KEY (`class_id`) REFERENCES `classes` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `admission_applications_group_id_fkey` FOREIGN KEY (`group_id`) REFERENCES `groups` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `admission_applications_school_id_fkey` FOREIGN KEY (`school_id`) REFERENCES `schools` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `admission_application_guardians`
--
ALTER TABLE `admission_application_guardians`
  ADD CONSTRAINT `admission_application_guardians_application_id_fkey` FOREIGN KEY (`application_id`) REFERENCES `admission_applications` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `admission_campaigns`
--
ALTER TABLE `admission_campaigns`
  ADD CONSTRAINT `admission_campaigns_academic_year_id_fkey` FOREIGN KEY (`academic_year_id`) REFERENCES `academic_years` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `admission_campaigns_school_id_fkey` FOREIGN KEY (`school_id`) REFERENCES `schools` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `admission_documents`
--
ALTER TABLE `admission_documents`
  ADD CONSTRAINT `admission_documents_application_id_fkey` FOREIGN KEY (`application_id`) REFERENCES `admission_applications` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `admission_interviews`
--
ALTER TABLE `admission_interviews`
  ADD CONSTRAINT `admission_interviews_application_id_fkey` FOREIGN KEY (`application_id`) REFERENCES `admission_applications` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `admission_reviews`
--
ALTER TABLE `admission_reviews`
  ADD CONSTRAINT `admission_reviews_application_id_fkey` FOREIGN KEY (`application_id`) REFERENCES `admission_applications` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `admission_tests`
--
ALTER TABLE `admission_tests`
  ADD CONSTRAINT `admission_tests_application_id_fkey` FOREIGN KEY (`application_id`) REFERENCES `admission_applications` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `attendances`
--
ALTER TABLE `attendances`
  ADD CONSTRAINT `attendances_student_id_fkey` FOREIGN KEY (`student_id`) REFERENCES `students` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `audit_logs`
--
ALTER TABLE `audit_logs`
  ADD CONSTRAINT `audit_logs_school_id_fkey` FOREIGN KEY (`school_id`) REFERENCES `schools` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `audit_logs_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Constraints for table `branding_settings`
--
ALTER TABLE `branding_settings`
  ADD CONSTRAINT `branding_settings_school_id_fkey` FOREIGN KEY (`school_id`) REFERENCES `schools` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `classes`
--
ALTER TABLE `classes`
  ADD CONSTRAINT `classes_school_id_fkey` FOREIGN KEY (`school_id`) REFERENCES `schools` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `class_groups`
--
ALTER TABLE `class_groups`
  ADD CONSTRAINT `class_groups_academic_year_id_fkey` FOREIGN KEY (`academic_year_id`) REFERENCES `academic_years` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `class_groups_class_id_fkey` FOREIGN KEY (`class_id`) REFERENCES `classes` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `class_groups_group_id_fkey` FOREIGN KEY (`group_id`) REFERENCES `groups` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `class_groups_school_id_fkey` FOREIGN KEY (`school_id`) REFERENCES `schools` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `class_sections`
--
ALTER TABLE `class_sections`
  ADD CONSTRAINT `class_sections_academic_year_id_fkey` FOREIGN KEY (`academic_year_id`) REFERENCES `academic_years` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `class_sections_class_id_fkey` FOREIGN KEY (`class_id`) REFERENCES `classes` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `class_sections_school_id_fkey` FOREIGN KEY (`school_id`) REFERENCES `schools` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `class_sections_section_id_fkey` FOREIGN KEY (`section_id`) REFERENCES `sections` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `class_subjects`
--
ALTER TABLE `class_subjects`
  ADD CONSTRAINT `class_subjects_academic_year_id_fkey` FOREIGN KEY (`academic_year_id`) REFERENCES `academic_years` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `class_subjects_class_id_fkey` FOREIGN KEY (`class_id`) REFERENCES `classes` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `class_subjects_group_id_fkey` FOREIGN KEY (`group_id`) REFERENCES `groups` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `class_subjects_school_id_fkey` FOREIGN KEY (`school_id`) REFERENCES `schools` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `class_subjects_subject_id_fkey` FOREIGN KEY (`subject_id`) REFERENCES `subjects` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `class_subjects_teacher_id_fkey` FOREIGN KEY (`teacher_id`) REFERENCES `teachers` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Constraints for table `departments`
--
ALTER TABLE `departments`
  ADD CONSTRAINT `departments_school_id_fkey` FOREIGN KEY (`school_id`) REFERENCES `schools` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `designations`
--
ALTER TABLE `designations`
  ADD CONSTRAINT `designations_school_id_fkey` FOREIGN KEY (`school_id`) REFERENCES `schools` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `employees`
--
ALTER TABLE `employees`
  ADD CONSTRAINT `employees_department_id_fkey` FOREIGN KEY (`department_id`) REFERENCES `departments` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `employees_designation_id_fkey` FOREIGN KEY (`designation_id`) REFERENCES `designations` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `employees_school_id_fkey` FOREIGN KEY (`school_id`) REFERENCES `schools` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `employees_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Constraints for table `employee_documents`
--
ALTER TABLE `employee_documents`
  ADD CONSTRAINT `employee_documents_employee_id_fkey` FOREIGN KEY (`employee_id`) REFERENCES `employees` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `employee_documents_teacher_id_fkey` FOREIGN KEY (`teacher_id`) REFERENCES `teachers` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `employment_histories`
--
ALTER TABLE `employment_histories`
  ADD CONSTRAINT `employment_histories_employee_id_fkey` FOREIGN KEY (`employee_id`) REFERENCES `employees` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `employment_histories_teacher_id_fkey` FOREIGN KEY (`teacher_id`) REFERENCES `teachers` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `exams`
--
ALTER TABLE `exams`
  ADD CONSTRAINT `exams_school_id_fkey` FOREIGN KEY (`school_id`) REFERENCES `schools` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `failed_login_attempts`
--
ALTER TABLE `failed_login_attempts`
  ADD CONSTRAINT `failed_login_attempts_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Constraints for table `fee_invoices`
--
ALTER TABLE `fee_invoices`
  ADD CONSTRAINT `fee_invoices_fee_structure_id_fkey` FOREIGN KEY (`fee_structure_id`) REFERENCES `fee_structures` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `fee_invoices_school_id_fkey` FOREIGN KEY (`school_id`) REFERENCES `schools` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `fee_invoices_student_id_fkey` FOREIGN KEY (`student_id`) REFERENCES `students` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `fee_structures`
--
ALTER TABLE `fee_structures`
  ADD CONSTRAINT `fee_structures_school_id_fkey` FOREIGN KEY (`school_id`) REFERENCES `schools` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `fee_structure_items`
--
ALTER TABLE `fee_structure_items`
  ADD CONSTRAINT `fee_structure_items_fee_structure_id_fkey` FOREIGN KEY (`fee_structure_id`) REFERENCES `fee_structures` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `groups`
--
ALTER TABLE `groups`
  ADD CONSTRAINT `groups_school_id_fkey` FOREIGN KEY (`school_id`) REFERENCES `schools` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `guardians`
--
ALTER TABLE `guardians`
  ADD CONSTRAINT `guardians_school_id_fkey` FOREIGN KEY (`school_id`) REFERENCES `schools` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `guardians_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Constraints for table `holidays`
--
ALTER TABLE `holidays`
  ADD CONSTRAINT `holidays_academic_year_id_fkey` FOREIGN KEY (`academic_year_id`) REFERENCES `academic_years` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `holidays_school_id_fkey` FOREIGN KEY (`school_id`) REFERENCES `schools` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `homeworks`
--
ALTER TABLE `homeworks`
  ADD CONSTRAINT `homeworks_class_id_fkey` FOREIGN KEY (`class_id`) REFERENCES `classes` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `homeworks_section_id_fkey` FOREIGN KEY (`section_id`) REFERENCES `sections` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `homeworks_subject_id_fkey` FOREIGN KEY (`subject_id`) REFERENCES `subjects` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `homeworks_teacher_id_fkey` FOREIGN KEY (`teacher_id`) REFERENCES `teachers` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `invoice_items`
--
ALTER TABLE `invoice_items`
  ADD CONSTRAINT `invoice_items_invoice_id_fkey` FOREIGN KEY (`invoice_id`) REFERENCES `student_invoices` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `legacy_installments`
--
ALTER TABLE `legacy_installments`
  ADD CONSTRAINT `legacy_installments_legacy_import_id_fkey` FOREIGN KEY (`legacy_import_id`) REFERENCES `legacy_installment_imports` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `legacy_installment_payments`
--
ALTER TABLE `legacy_installment_payments`
  ADD CONSTRAINT `legacy_installment_payments_legacy_installment_id_fkey` FOREIGN KEY (`legacy_installment_id`) REFERENCES `legacy_installments` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `login_histories`
--
ALTER TABLE `login_histories`
  ADD CONSTRAINT `login_histories_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `marks`
--
ALTER TABLE `marks`
  ADD CONSTRAINT `marks_exam_id_fkey` FOREIGN KEY (`exam_id`) REFERENCES `exams` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `marks_student_id_fkey` FOREIGN KEY (`student_id`) REFERENCES `students` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `marks_subject_id_fkey` FOREIGN KEY (`subject_id`) REFERENCES `subjects` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `notifications`
--
ALTER TABLE `notifications`
  ADD CONSTRAINT `notifications_school_id_fkey` FOREIGN KEY (`school_id`) REFERENCES `schools` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `notifications_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Constraints for table `password_reset_tokens`
--
ALTER TABLE `password_reset_tokens`
  ADD CONSTRAINT `password_reset_tokens_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `payments`
--
ALTER TABLE `payments`
  ADD CONSTRAINT `payments_invoice_id_fkey` FOREIGN KEY (`invoice_id`) REFERENCES `fee_invoices` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `payment_allocations`
--
ALTER TABLE `payment_allocations`
  ADD CONSTRAINT `payment_allocations_payment_id_fkey` FOREIGN KEY (`payment_id`) REFERENCES `payments` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `payrolls`
--
ALTER TABLE `payrolls`
  ADD CONSTRAINT `payrolls_school_id_fkey` FOREIGN KEY (`school_id`) REFERENCES `schools` (`id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `payrolls_teacherId_fkey` FOREIGN KEY (`teacherId`) REFERENCES `teachers` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Constraints for table `periods`
--
ALTER TABLE `periods`
  ADD CONSTRAINT `periods_school_id_fkey` FOREIGN KEY (`school_id`) REFERENCES `schools` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `role_permissions`
--
ALTER TABLE `role_permissions`
  ADD CONSTRAINT `role_permissions_permission_id_fkey` FOREIGN KEY (`permission_id`) REFERENCES `permissions` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `role_permissions_role_id_fkey` FOREIGN KEY (`role_id`) REFERENCES `roles` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `rooms`
--
ALTER TABLE `rooms`
  ADD CONSTRAINT `rooms_school_id_fkey` FOREIGN KEY (`school_id`) REFERENCES `schools` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `routines`
--
ALTER TABLE `routines`
  ADD CONSTRAINT `routines_class_id_fkey` FOREIGN KEY (`class_id`) REFERENCES `classes` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `routines_section_id_fkey` FOREIGN KEY (`section_id`) REFERENCES `sections` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `routines_subject_id_fkey` FOREIGN KEY (`subject_id`) REFERENCES `subjects` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `routines_teacher_id_fkey` FOREIGN KEY (`teacher_id`) REFERENCES `teachers` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `school_settings`
--
ALTER TABLE `school_settings`
  ADD CONSTRAINT `school_settings_school_id_fkey` FOREIGN KEY (`school_id`) REFERENCES `schools` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `sections`
--
ALTER TABLE `sections`
  ADD CONSTRAINT `sections_class_id_fkey` FOREIGN KEY (`class_id`) REFERENCES `classes` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `sections_school_id_fkey` FOREIGN KEY (`school_id`) REFERENCES `schools` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `students`
--
ALTER TABLE `students`
  ADD CONSTRAINT `students_class_id_fkey` FOREIGN KEY (`class_id`) REFERENCES `classes` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `students_school_id_fkey` FOREIGN KEY (`school_id`) REFERENCES `schools` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `students_section_id_fkey` FOREIGN KEY (`section_id`) REFERENCES `sections` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `students_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Constraints for table `student_documents`
--
ALTER TABLE `student_documents`
  ADD CONSTRAINT `student_documents_student_id_fkey` FOREIGN KEY (`student_id`) REFERENCES `students` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `student_enrollments`
--
ALTER TABLE `student_enrollments`
  ADD CONSTRAINT `student_enrollments_academic_year_id_fkey` FOREIGN KEY (`academic_year_id`) REFERENCES `academic_years` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `student_enrollments_class_id_fkey` FOREIGN KEY (`class_id`) REFERENCES `classes` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `student_enrollments_group_id_fkey` FOREIGN KEY (`group_id`) REFERENCES `groups` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `student_enrollments_school_id_fkey` FOREIGN KEY (`school_id`) REFERENCES `schools` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `student_enrollments_section_id_fkey` FOREIGN KEY (`section_id`) REFERENCES `sections` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `student_enrollments_session_id_fkey` FOREIGN KEY (`session_id`) REFERENCES `academic_sessions` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `student_enrollments_student_id_fkey` FOREIGN KEY (`student_id`) REFERENCES `students` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `student_guardians`
--
ALTER TABLE `student_guardians`
  ADD CONSTRAINT `student_guardians_guardian_id_fkey` FOREIGN KEY (`guardian_id`) REFERENCES `guardians` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `student_guardians_student_id_fkey` FOREIGN KEY (`student_id`) REFERENCES `students` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `student_medical_information`
--
ALTER TABLE `student_medical_information`
  ADD CONSTRAINT `student_medical_information_student_id_fkey` FOREIGN KEY (`student_id`) REFERENCES `students` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `student_previous_education`
--
ALTER TABLE `student_previous_education`
  ADD CONSTRAINT `student_previous_education_student_id_fkey` FOREIGN KEY (`student_id`) REFERENCES `students` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `student_status_histories`
--
ALTER TABLE `student_status_histories`
  ADD CONSTRAINT `student_status_histories_student_id_fkey` FOREIGN KEY (`student_id`) REFERENCES `students` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `subjects`
--
ALTER TABLE `subjects`
  ADD CONSTRAINT `subjects_school_id_fkey` FOREIGN KEY (`school_id`) REFERENCES `schools` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `teachers`
--
ALTER TABLE `teachers`
  ADD CONSTRAINT `teachers_department_id_fkey` FOREIGN KEY (`department_id`) REFERENCES `departments` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `teachers_designation_id_fkey` FOREIGN KEY (`designation_id`) REFERENCES `designations` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `teachers_school_id_fkey` FOREIGN KEY (`school_id`) REFERENCES `schools` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `teachers_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Constraints for table `teacher_assignments`
--
ALTER TABLE `teacher_assignments`
  ADD CONSTRAINT `teacher_assignments_academic_year_id_fkey` FOREIGN KEY (`academic_year_id`) REFERENCES `academic_years` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `teacher_assignments_class_id_fkey` FOREIGN KEY (`class_id`) REFERENCES `classes` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `teacher_assignments_group_id_fkey` FOREIGN KEY (`group_id`) REFERENCES `groups` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `teacher_assignments_school_id_fkey` FOREIGN KEY (`school_id`) REFERENCES `schools` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `teacher_assignments_section_id_fkey` FOREIGN KEY (`section_id`) REFERENCES `sections` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `teacher_assignments_session_id_fkey` FOREIGN KEY (`session_id`) REFERENCES `academic_sessions` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `teacher_assignments_subject_id_fkey` FOREIGN KEY (`subject_id`) REFERENCES `subjects` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `teacher_assignments_teacher_id_fkey` FOREIGN KEY (`teacher_id`) REFERENCES `teachers` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `users`
--
ALTER TABLE `users`
  ADD CONSTRAINT `users_school_id_fkey` FOREIGN KEY (`school_id`) REFERENCES `schools` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `user_roles`
--
ALTER TABLE `user_roles`
  ADD CONSTRAINT `user_roles_role_id_fkey` FOREIGN KEY (`role_id`) REFERENCES `roles` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `user_roles_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `user_sessions`
--
ALTER TABLE `user_sessions`
  ADD CONSTRAINT `user_sessions_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `website_settings`
--
ALTER TABLE `website_settings`
  ADD CONSTRAINT `website_settings_school_id_fkey` FOREIGN KEY (`school_id`) REFERENCES `schools` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
