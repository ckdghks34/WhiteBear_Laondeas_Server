-- MySQL dump 10.13  Distrib 8.0.23, for Win64 (x86_64)
--
-- Host: 127.0.0.1    Database: laondius
-- ------------------------------------------------------
-- Server version	8.0.23

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `accrual_detail`
--

DROP TABLE IF EXISTS `accrual_detail`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `accrual_detail` (
  `accrual_seq` int NOT NULL AUTO_INCREMENT,
  `user_seq` int NOT NULL COMMENT 'Auto_Increment',
  `accrual_point` int NOT NULL,
  `accrual_point_date` date NOT NULL,
  `first_register_id` int DEFAULT NULL,
  `first_register_date` datetime DEFAULT NULL,
  `last_register_id` int DEFAULT NULL,
  `last_register_date` datetime DEFAULT NULL,
  PRIMARY KEY (`accrual_seq`),
  KEY `FK_user_TO_accrual_detail_1` (`user_seq`),
  CONSTRAINT `FK_user_TO_accrual_detail_1` FOREIGN KEY (`user_seq`) REFERENCES `user` (`user_seq`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `accrual_detail`
--

LOCK TABLES `accrual_detail` WRITE;
/*!40000 ALTER TABLE `accrual_detail` DISABLE KEYS */;
INSERT INTO `accrual_detail` VALUES (2,9,10000,'2022-04-28',10,'2022-04-28 20:10:04',NULL,NULL);
/*!40000 ALTER TABLE `accrual_detail` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `advertisement`
--

DROP TABLE IF EXISTS `advertisement`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `advertisement` (
  `advertising_seq` int NOT NULL AUTO_INCREMENT,
  `company_name` varchar(50) NOT NULL,
  `contact` varchar(11) NOT NULL,
  `area` varchar(20) NOT NULL,
  `isagency` tinyint(1) DEFAULT '0',
  `agreement_info` tinyint(1) DEFAULT '0',
  `first_register_date` datetime NOT NULL,
  `last_register_date` datetime NOT NULL,
  PRIMARY KEY (`advertising_seq`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `advertisement`
--

LOCK TABLES `advertisement` WRITE;
/*!40000 ALTER TABLE `advertisement` DISABLE KEYS */;
INSERT INTO `advertisement` VALUES (1,'테스트컴퍼니','01074128523','대구',1,1,'2022-04-26 01:54:25','2022-04-26 01:54:25'),(2,'화이트컴퍼니','01072228523','대구',0,1,'2022-04-26 01:55:27','2022-04-26 01:55:27'),(3,'화이트컴퍼니','01070035423','서울',NULL,1,'2022-04-26 01:57:49','2022-04-26 01:57:49'),(4,'화이트컴퍼니','01070035423','서울',NULL,1,'2022-04-26 01:59:09','2022-04-26 01:59:09'),(5,'화이트컴퍼니','01070035423','서울',NULL,1,'2022-04-26 01:59:43','2022-04-26 01:59:43'),(6,'화이트컴퍼니','01070035423','서울',NULL,1,'2022-04-26 01:59:51','2022-04-26 01:59:51'),(7,'베어컴퍼니','01070035423','서울',0,1,'2022-04-26 02:01:26','2022-04-26 02:01:26'),(8,'베어컴퍼니','01070035423','서울',1,1,'2022-04-26 02:01:53','2022-04-26 02:01:53');
/*!40000 ALTER TABLE `advertisement` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `answer`
--

DROP TABLE IF EXISTS `answer`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `answer` (
  `answer_seq` int NOT NULL AUTO_INCREMENT,
  `qna_seq` int NOT NULL,
  `author` int NOT NULL COMMENT 'user테이블 pk값 참조',
  `title` text NOT NULL,
  `content` text NOT NULL,
  `first_register_id` int NOT NULL,
  `first_register_date` datetime DEFAULT NULL,
  `last_register_id` int NOT NULL,
  `last_register_date` datetime DEFAULT NULL,
  PRIMARY KEY (`answer_seq`,`qna_seq`),
  KEY `FK_Question_TO_Answer_1` (`qna_seq`),
  CONSTRAINT `FK_Question_TO_Answer_1` FOREIGN KEY (`qna_seq`) REFERENCES `question` (`qna_seq`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `answer`
--

LOCK TABLES `answer` WRITE;
/*!40000 ALTER TABLE `answer` DISABLE KEYS */;
INSERT INTO `answer` VALUES (1,1,10,'답변드립니다','답변드립니다',10,NULL,10,NULL),(2,4,10,'테스트 답변','테스트 답변',10,NULL,10,NULL),(3,5,10,'답변','문의에 대한 답변입니다.',10,'2022-04-28 21:11:10',10,'2022-04-28 21:11:10');
/*!40000 ALTER TABLE `answer` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `attendance`
--

DROP TABLE IF EXISTS `attendance`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `attendance` (
  `attendance_seq` int NOT NULL AUTO_INCREMENT,
  `user_seq` int NOT NULL COMMENT 'Auto_Increment',
  `content` text NOT NULL,
  `first_register_id` int DEFAULT NULL,
  `first_register_date` datetime DEFAULT NULL,
  `last_register_id` int DEFAULT NULL,
  `last_register_date` datetime DEFAULT NULL,
  PRIMARY KEY (`attendance_seq`,`user_seq`),
  KEY `FK_user_TO_attendance_1` (`user_seq`),
  CONSTRAINT `FK_user_TO_attendance_1` FOREIGN KEY (`user_seq`) REFERENCES `user` (`user_seq`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `attendance`
--

LOCK TABLES `attendance` WRITE;
/*!40000 ALTER TABLE `attendance` DISABLE KEYS */;
/*!40000 ALTER TABLE `attendance` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `blacklist`
--

DROP TABLE IF EXISTS `blacklist`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `blacklist` (
  `blacklist_seq` int NOT NULL AUTO_INCREMENT,
  `user_seq` int DEFAULT NULL,
  `is_active` tinyint(1) DEFAULT NULL,
  `first_register_id` int DEFAULT NULL,
  `first_register_date` datetime DEFAULT NULL,
  `last_register_id` int DEFAULT NULL,
  `last_register_date` datetime DEFAULT NULL,
  PRIMARY KEY (`blacklist_seq`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `blacklist`
--

LOCK TABLES `blacklist` WRITE;
/*!40000 ALTER TABLE `blacklist` DISABLE KEYS */;
/*!40000 ALTER TABLE `blacklist` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `campaign`
--

DROP TABLE IF EXISTS `campaign`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `campaign` (
  `campaign_seq` int NOT NULL AUTO_INCREMENT COMMENT 'Auto Increment',
  `advertiser` int NOT NULL COMMENT '유저테이블 PK 참조',
  `is_premium` tinyint(1) NOT NULL,
  `title` varchar(100) NOT NULL,
  `category` varchar(10) NOT NULL,
  `product` varchar(10) NOT NULL,
  `channel` varchar(10) NOT NULL,
  `area` varchar(10) NOT NULL,
  `keyword` text NOT NULL,
  `headcount` int NOT NULL,
  `siteURL` text NOT NULL,
  `misson` text NOT NULL,
  `reward` text NOT NULL,
  `accrual_point` int NOT NULL,
  `additional_information` text NOT NULL,
  `recruit_start_date` date NOT NULL,
  `recruit_end_date` date NOT NULL,
  `reviewer_announcement_date` date NOT NULL,
  `agreement_portrait` tinyint(1) NOT NULL DEFAULT '0',
  `agreement_provide_info` tinyint(1) NOT NULL DEFAULT '0',
  `campaign_state` tinyint(1) NOT NULL,
  `view_count` int DEFAULT NULL,
  `first_register_id` int DEFAULT NULL,
  `first_register_date` datetime DEFAULT NULL,
  `last_register_id` int DEFAULT NULL,
  `last_register_date` datetime DEFAULT NULL,
  PRIMARY KEY (`campaign_seq`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `campaign`
--

LOCK TABLES `campaign` WRITE;
/*!40000 ALTER TABLE `campaign` DISABLE KEYS */;
/*!40000 ALTER TABLE `campaign` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `campaign_application`
--

DROP TABLE IF EXISTS `campaign_application`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `campaign_application` (
  `user_seq` int NOT NULL COMMENT 'Auto_Increment',
  `campaign_seq` int NOT NULL COMMENT 'Auto Increment',
  `acquaint_content` tinyint(1) NOT NULL DEFAULT '0',
  `select_reward` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `camera_code` varchar(10) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT '코드테이블 값 참조',
  `face_exposure` tinyint(1) NOT NULL,
  `joint_blog` tinyint(1) NOT NULL,
  `status` varchar(10) COLLATE utf8mb4_general_ci NOT NULL COMMENT '/home/ubuntu/laondius/laon-web-server/util/database',
  `first_register_id` int NOT NULL,
  `first_register_date` datetime NOT NULL,
  `last_register_id` int NOT NULL,
  `last_register_date` datetime NOT NULL,
  PRIMARY KEY (`user_seq`,`campaign_seq`),
  KEY `FK_campaign_TO_campaign_application_1` (`campaign_seq`),
  CONSTRAINT `FK_campaign_TO_campaign_application_1` FOREIGN KEY (`campaign_seq`) REFERENCES `campaign` (`campaign_seq`),
  CONSTRAINT `FK_user_TO_campaign_application_1` FOREIGN KEY (`user_seq`) REFERENCES `user` (`user_seq`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `campaign_application`
--

LOCK TABLES `campaign_application` WRITE;
/*!40000 ALTER TABLE `campaign_application` DISABLE KEYS */;
/*!40000 ALTER TABLE `campaign_application` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `campaign_evaluation`
--

DROP TABLE IF EXISTS `campaign_evaluation`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `campaign_evaluation` (
  `campaign_seq` int NOT NULL COMMENT 'Auto Increment',
  `user_seq` int NOT NULL COMMENT 'Auto_Increment',
  `evaluation` int NOT NULL,
  `content` text NOT NULL,
  `frist_register_id` int NOT NULL,
  `first_register_date` datetime NOT NULL,
  `last_register_id` int NOT NULL,
  `last_register_date` datetime NOT NULL,
  PRIMARY KEY (`campaign_seq`,`user_seq`),
  KEY `FK_user_TO_campaign_evaluation_1` (`user_seq`),
  CONSTRAINT `FK_campaign_TO_campaign_evaluation_1` FOREIGN KEY (`campaign_seq`) REFERENCES `campaign` (`campaign_seq`),
  CONSTRAINT `FK_user_TO_campaign_evaluation_1` FOREIGN KEY (`user_seq`) REFERENCES `user` (`user_seq`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `campaign_evaluation`
--

LOCK TABLES `campaign_evaluation` WRITE;
/*!40000 ALTER TABLE `campaign_evaluation` DISABLE KEYS */;
/*!40000 ALTER TABLE `campaign_evaluation` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `campaign_file`
--

DROP TABLE IF EXISTS `campaign_file`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `campaign_file` (
  `file_seq` int NOT NULL AUTO_INCREMENT,
  `campaign_seq` int NOT NULL COMMENT 'Auto Increment',
  `name` varchar(100) NOT NULL,
  `path` varchar(255) NOT NULL,
  `type` varchar(10) NOT NULL,
  `first_register_id` int NOT NULL,
  `first_register_date` datetime NOT NULL,
  `last_register_id` int NOT NULL,
  `last_register_date` datetime NOT NULL,
  PRIMARY KEY (`file_seq`,`campaign_seq`),
  KEY `FK_campaign_TO_campaign_file_1` (`campaign_seq`),
  CONSTRAINT `FK_campaign_TO_campaign_file_1` FOREIGN KEY (`campaign_seq`) REFERENCES `campaign` (`campaign_seq`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `campaign_file`
--

LOCK TABLES `campaign_file` WRITE;
/*!40000 ALTER TABLE `campaign_file` DISABLE KEYS */;
/*!40000 ALTER TABLE `campaign_file` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `campaign_qna`
--

DROP TABLE IF EXISTS `campaign_qna`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `campaign_qna` (
  `question_seq` int NOT NULL AUTO_INCREMENT,
  `campaign_seq` int NOT NULL COMMENT 'Auto Increment',
  `question` text NOT NULL,
  `answer` text NOT NULL,
  `first_register_id` int NOT NULL,
  `first_register_date` datetime NOT NULL,
  `last_register_id` int NOT NULL,
  `last_register_date` datetime NOT NULL,
  PRIMARY KEY (`question_seq`),
  KEY `FK_campaign_TO_campaign_qna_1` (`campaign_seq`),
  CONSTRAINT `FK_campaign_TO_campaign_qna_1` FOREIGN KEY (`campaign_seq`) REFERENCES `campaign` (`campaign_seq`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `campaign_qna`
--

LOCK TABLES `campaign_qna` WRITE;
/*!40000 ALTER TABLE `campaign_qna` DISABLE KEYS */;
/*!40000 ALTER TABLE `campaign_qna` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `code_table`
--

DROP TABLE IF EXISTS `code_table`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `code_table` (
  `code_value` varchar(10) NOT NULL,
  `code_name` varchar(20) NOT NULL,
  `top_level_code` varchar(10) DEFAULT NULL,
  `code_step` int NOT NULL,
  PRIMARY KEY (`code_value`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `code_table`
--

LOCK TABLES `code_table` WRITE;
/*!40000 ALTER TABLE `code_table` DISABLE KEYS */;
/*!40000 ALTER TABLE `code_table` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `faq`
--

DROP TABLE IF EXISTS `faq`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `faq` (
  `faq_seq` int NOT NULL AUTO_INCREMENT,
  `category` varchar(10) NOT NULL,
  `title` varchar(50) NOT NULL,
  `content` text NOT NULL,
  `first_register_id` int NOT NULL,
  `first_register_date` datetime NOT NULL,
  `last_register_id` int NOT NULL,
  `last_register_date` datetime NOT NULL,
  PRIMARY KEY (`faq_seq`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `faq`
--

LOCK TABLES `faq` WRITE;
/*!40000 ALTER TABLE `faq` DISABLE KEYS */;
INSERT INTO `faq` VALUES (1,'테스트','제목테스트수정','제목테스트수정중',10,'2022-04-25 22:24:10',10,'2022-04-25 22:27:09'),(3,'테스트','제목테스트수정','제목테스트수정중',10,'2022-04-26 22:22:54',10,'2022-04-26 22:23:09'),(4,'테스트','제목테스트1','내용테스트1',10,'2022-04-28 00:44:58',10,'2022-04-28 00:44:58'),(5,'테스트','제목테스트1','내용테스트1',10,'2022-04-28 00:45:18',10,'2022-04-28 00:45:18');
/*!40000 ALTER TABLE `faq` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `interest_campaign`
--

DROP TABLE IF EXISTS `interest_campaign`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `interest_campaign` (
  `user_seq` int NOT NULL COMMENT 'Auto_Increment',
  `campaign_seq` int NOT NULL COMMENT 'Auto Increment',
  `first_register_id` int DEFAULT NULL,
  `first_register_date` datetime DEFAULT NULL,
  `last_register_id` int DEFAULT NULL,
  `last_register_date` datetime DEFAULT NULL,
  PRIMARY KEY (`user_seq`,`campaign_seq`),
  KEY `FK_campaign_TO_interest_campaign_1` (`campaign_seq`),
  CONSTRAINT `FK_campaign_TO_interest_campaign_1` FOREIGN KEY (`campaign_seq`) REFERENCES `campaign` (`campaign_seq`),
  CONSTRAINT `FK_user_TO_interest_campaign_1` FOREIGN KEY (`user_seq`) REFERENCES `user` (`user_seq`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `interest_campaign`
--

LOCK TABLES `interest_campaign` WRITE;
/*!40000 ALTER TABLE `interest_campaign` DISABLE KEYS */;
/*!40000 ALTER TABLE `interest_campaign` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `message`
--

DROP TABLE IF EXISTS `message`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `message` (
  `message_seq` int NOT NULL AUTO_INCREMENT COMMENT 'Auto Increment',
  `content` text NOT NULL,
  `is_read` tinyint(1) NOT NULL DEFAULT '0',
  `sender` int NOT NULL,
  `receiver` int NOT NULL,
  `first_register_id` int NOT NULL,
  `first_register_date` datetime NOT NULL,
  `last_register_id` int NOT NULL,
  `last_register_date` datetime NOT NULL,
  PRIMARY KEY (`message_seq`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `message`
--

LOCK TABLES `message` WRITE;
/*!40000 ALTER TABLE `message` DISABLE KEYS */;
/*!40000 ALTER TABLE `message` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `notice`
--

DROP TABLE IF EXISTS `notice`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `notice` (
  `notice_seq` int NOT NULL AUTO_INCREMENT,
  `author` int DEFAULT NULL COMMENT 'user테이블 pk값 참조',
  `title` varchar(50) NOT NULL,
  `content` text NOT NULL,
  `view_count` int NOT NULL DEFAULT '0',
  `first_register_id` int NOT NULL,
  `first_register_date` datetime NOT NULL,
  `last_register_id` int NOT NULL,
  `last_register_date` datetime NOT NULL,
  PRIMARY KEY (`notice_seq`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `notice`
--

LOCK TABLES `notice` WRITE;
/*!40000 ALTER TABLE `notice` DISABLE KEYS */;
INSERT INTO `notice` VALUES (1,10,'테스트 공지사항','공지사항 등록 테스트 중입니다.',0,10,'2022-04-26 01:11:11',10,'2022-04-26 01:11:11'),(2,10,'공지사항 수정 테스트','공지사항 수정 테스트 중입니다.',3,10,'2022-04-26 01:11:52',10,'2022-04-26 01:16:51');
/*!40000 ALTER TABLE `notice` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `penalty`
--

DROP TABLE IF EXISTS `penalty`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `penalty` (
  `penalty_seq` int NOT NULL AUTO_INCREMENT,
  `user_seq` int NOT NULL COMMENT 'user테이블 값 참조',
  `content` text NOT NULL,
  `end_date` date NOT NULL,
  `first_register_id` int NOT NULL,
  `first_register_date` datetime NOT NULL,
  `last_register_id` int NOT NULL,
  `last_register_date` datetime NOT NULL,
  PRIMARY KEY (`penalty_seq`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `penalty`
--

LOCK TABLES `penalty` WRITE;
/*!40000 ALTER TABLE `penalty` DISABLE KEYS */;
/*!40000 ALTER TABLE `penalty` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `popup`
--

DROP TABLE IF EXISTS `popup`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `popup` (
  `popup_seq` int NOT NULL AUTO_INCREMENT,
  `imgURL` text,
  `is_active` tinyint(1) DEFAULT NULL,
  `first_register_id` int DEFAULT NULL,
  `first_register_date` datetime DEFAULT NULL,
  `last_register_id` int DEFAULT NULL,
  `last_register_date` datetime DEFAULT NULL,
  PRIMARY KEY (`popup_seq`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `popup`
--

LOCK TABLES `popup` WRITE;
/*!40000 ALTER TABLE `popup` DISABLE KEYS */;
/*!40000 ALTER TABLE `popup` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `premium_application`
--

DROP TABLE IF EXISTS `premium_application`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `premium_application` (
  `premium_seq` int NOT NULL AUTO_INCREMENT,
  `user_seq` int NOT NULL COMMENT 'Auto_Increment',
  `agreement_content` tinyint(1) NOT NULL,
  `first_register_id` int NOT NULL,
  `first_register_date` datetime NOT NULL,
  `last_register_id` int NOT NULL,
  `last_register_date` datetime NOT NULL,
  PRIMARY KEY (`premium_seq`,`user_seq`),
  KEY `FK_user_TO_premium_application_1` (`user_seq`),
  CONSTRAINT `FK_user_TO_premium_application_1` FOREIGN KEY (`user_seq`) REFERENCES `user` (`user_seq`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `premium_application`
--

LOCK TABLES `premium_application` WRITE;
/*!40000 ALTER TABLE `premium_application` DISABLE KEYS */;
/*!40000 ALTER TABLE `premium_application` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `question`
--

DROP TABLE IF EXISTS `question`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `question` (
  `qna_seq` int NOT NULL AUTO_INCREMENT,
  `author` int NOT NULL COMMENT 'user테이블 pk값 참조',
  `category` varchar(20) NOT NULL,
  `title` varchar(50) NOT NULL,
  `content` text NOT NULL,
  `first_register_id` int NOT NULL,
  `first_register_date` datetime DEFAULT NULL,
  `last_register_id` int NOT NULL,
  `last_register_date` datetime DEFAULT NULL,
  PRIMARY KEY (`qna_seq`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `question`
--

LOCK TABLES `question` WRITE;
/*!40000 ALTER TABLE `question` DISABLE KEYS */;
INSERT INTO `question` VALUES (1,9,'캠페인신청','캠페인 신청 문의 드립니다.','캠페인 신청문의드립니다. 테스트',9,NULL,9,NULL),(3,9,'캠페인신청','테스트2 캠페인 신청 문의 드립니다.','캠페인 신청문의드립니다. 테스트',9,NULL,9,NULL),(4,9,'테스트','테스트1','캠페인 신청문의드립니다. 테스트',9,NULL,9,NULL),(5,9,'캠페인관련','캠페인 관련 테스트','캠페인 관련 테스트 중입니다.',9,'2022-04-28 21:05:39',9,'2022-04-28 21:05:39');
/*!40000 ALTER TABLE `question` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `reviewer`
--

DROP TABLE IF EXISTS `reviewer`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `reviewer` (
  `user_seq` int NOT NULL COMMENT 'Auto_Increment',
  `campaign_seq` int NOT NULL COMMENT 'Auto Increment',
  `complete_mission` tinyint(1) NOT NULL,
  `first_register_id` int NOT NULL,
  `first_register_date` datetime NOT NULL,
  `last_register_id` int NOT NULL,
  `last_register_date` datetime NOT NULL,
  PRIMARY KEY (`user_seq`,`campaign_seq`),
  KEY `FK_campaign_TO_reviewer_1` (`campaign_seq`),
  CONSTRAINT `FK_campaign_TO_reviewer_1` FOREIGN KEY (`campaign_seq`) REFERENCES `campaign` (`campaign_seq`),
  CONSTRAINT `FK_user_TO_reviewer_1` FOREIGN KEY (`user_seq`) REFERENCES `user` (`user_seq`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `reviewer`
--

LOCK TABLES `reviewer` WRITE;
/*!40000 ALTER TABLE `reviewer` DISABLE KEYS */;
/*!40000 ALTER TABLE `reviewer` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `token`
--

DROP TABLE IF EXISTS `token`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `token` (
  `user_seq` int NOT NULL,
  `id` varchar(20) NOT NULL,
  `accesstoken` text NOT NULL,
  `refreshtoken` text NOT NULL,
  PRIMARY KEY (`user_seq`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `token`
--

LOCK TABLES `token` WRITE;
/*!40000 ALTER TABLE `token` DISABLE KEYS */;
INSERT INTO `token` VALUES (9,'test','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6InRlc3QiLCJzZXEiOjksImlhdCI6MTY1MTE0MTkwNCwiZXhwIjoxNjUxMTQ1NTA0fQ.mzegy72UpupeFMHZAoXLX_-id77tMlHxdeNrYXu7zNM','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE2NTExNDE1NjAsImV4cCI6MTY1MjM1MTE2MH0.b83aoYzn45yUtazKxA6litrNVx-o-fJYfsFhXVbbrGM');
/*!40000 ALTER TABLE `token` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user`
--

DROP TABLE IF EXISTS `user`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user` (
  `user_seq` int NOT NULL AUTO_INCREMENT COMMENT 'Auto_Increment',
  `id` varchar(20) NOT NULL,
  `password` varchar(60) NOT NULL,
  `name` varchar(20) NOT NULL,
  `nickname` varchar(10) NOT NULL,
  `phonenumber` varchar(11) NOT NULL,
  `gender` char(1) DEFAULT NULL,
  `birth` varchar(8) DEFAULT NULL,
  `email` varchar(100) DEFAULT NULL,
  `is_premium` tinyint(1) NOT NULL DEFAULT '0',
  `is_advertiser` tinyint(1) NOT NULL DEFAULT '0',
  `agreement_info` tinyint(1) NOT NULL DEFAULT '0',
  `agreement_email` tinyint(1) NOT NULL DEFAULT '0',
  `agreement_mms` tinyint(1) NOT NULL DEFAULT '0',
  `blog` varchar(50) DEFAULT NULL,
  `instagram` varchar(50) DEFAULT NULL,
  `influencer` varchar(50) DEFAULT NULL,
  `youtube` varchar(50) DEFAULT NULL,
  `point` int NOT NULL DEFAULT '0',
  `accumulated_point` int NOT NULL DEFAULT '0',
  `profile_path` varchar(255) DEFAULT NULL,
  `profile_type` varchar(10) DEFAULT NULL,
  `is_admin` tinyint(1) DEFAULT '0',
  `tops_size` varchar(10) DEFAULT NULL,
  `bottoms_size` varchar(10) DEFAULT NULL,
  `shoe_size` varchar(10) DEFAULT NULL,
  `height` varchar(10) DEFAULT NULL,
  `skin_type` varchar(10) DEFAULT NULL,
  `marital_status` tinyint(1) DEFAULT NULL,
  `having_child` tinyint(1) DEFAULT NULL,
  `job` tinyint(1) DEFAULT NULL,
  `companion_animal` varchar(10) DEFAULT NULL,
  `first_register_date` datetime DEFAULT NULL,
  `last_register_date` datetime DEFAULT NULL,
  PRIMARY KEY (`user_seq`),
  UNIQUE KEY `id_UNIQUE` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user`
--

LOCK TABLES `user` WRITE;
/*!40000 ALTER TABLE `user` DISABLE KEYS */;
INSERT INTO `user` VALUES (9,'test','$2b$10$Y.7/ZNSjzcWQLuKhRzE9O.eYVt9AmGCq4MhUH4kW7AmImdnTCZS32','범사장','범사장','01011232234',NULL,NULL,'laondius@naver.com',0,0,1,1,1,NULL,NULL,NULL,NULL,0,0,NULL,NULL,0,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'2022-04-25 12:19:11','2022-04-25 12:19:11'),(10,'admintest','$2b$10$UOxQwhYNpLlADlM4PstfC.wojyElcvwVqIibLPlQ7MznrLTdqKLo6','관리자범사장','관리자범사장','01022232234',NULL,NULL,'laondiusadmin@naver.com',0,0,1,1,1,NULL,NULL,NULL,NULL,0,0,NULL,NULL,1,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'2022-04-25 13:22:51','2022-04-25 13:22:51');
/*!40000 ALTER TABLE `user` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user_address_book`
--

DROP TABLE IF EXISTS `user_address_book`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user_address_book` (
  `address_seq` int NOT NULL AUTO_INCREMENT,
  `user_seq` int NOT NULL COMMENT 'Auto_Increment',
  `name` varchar(10) NOT NULL,
  `receiver` varchar(20) NOT NULL,
  `address` text NOT NULL,
  `phonenumber` varchar(11) NOT NULL,
  `is_default` tinyint(1) NOT NULL,
  `first_register_id` int NOT NULL,
  `first_register_date` datetime NOT NULL,
  `last_register_id` int NOT NULL,
  `last_register_date` datetime NOT NULL,
  PRIMARY KEY (`address_seq`,`user_seq`),
  KEY `FK_user_TO_user_address_book_1` (`user_seq`),
  CONSTRAINT `FK_user_TO_user_address_book_1` FOREIGN KEY (`user_seq`) REFERENCES `user` (`user_seq`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user_address_book`
--

LOCK TABLES `user_address_book` WRITE;
/*!40000 ALTER TABLE `user_address_book` DISABLE KEYS */;
/*!40000 ALTER TABLE `user_address_book` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user_area`
--

DROP TABLE IF EXISTS `user_area`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user_area` (
  `user_area_code` varchar(10) NOT NULL COMMENT '코드테이블 값 참조',
  `user_seq` int NOT NULL COMMENT 'Auto_Increment',
  `first_register_id` int NOT NULL,
  `first_register_date` timestamp NOT NULL,
  `last_register_id` int NOT NULL,
  `last_register_date` timestamp NOT NULL,
  PRIMARY KEY (`user_area_code`,`user_seq`),
  KEY `FK_user_TO_user_area_1` (`user_seq`),
  CONSTRAINT `FK_user_TO_user_area_1` FOREIGN KEY (`user_seq`) REFERENCES `user` (`user_seq`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user_area`
--

LOCK TABLES `user_area` WRITE;
/*!40000 ALTER TABLE `user_area` DISABLE KEYS */;
/*!40000 ALTER TABLE `user_area` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user_channel`
--

DROP TABLE IF EXISTS `user_channel`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user_channel` (
  `channel_code` varchar(10) NOT NULL COMMENT '코드테이블 값 참조',
  `user_seq` int NOT NULL COMMENT 'Auto_Increment',
  `first_register_id` int NOT NULL,
  `first_register_date` datetime NOT NULL,
  `last_register_id` int NOT NULL,
  `last_register_date` datetime NOT NULL,
  PRIMARY KEY (`channel_code`,`user_seq`),
  KEY `FK_user_TO_user_channel_1` (`user_seq`),
  CONSTRAINT `FK_user_TO_user_channel_1` FOREIGN KEY (`user_seq`) REFERENCES `user` (`user_seq`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user_channel`
--

LOCK TABLES `user_channel` WRITE;
/*!40000 ALTER TABLE `user_channel` DISABLE KEYS */;
/*!40000 ALTER TABLE `user_channel` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user_file`
--

DROP TABLE IF EXISTS `user_file`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user_file` (
  `file_seq` int NOT NULL AUTO_INCREMENT,
  `user_seq` int NOT NULL,
  `name` varchar(255) DEFAULT NULL,
  `path` text,
  `extension` varchar(10) DEFAULT NULL,
  `representative` tinyint(1) DEFAULT NULL,
  `first_register_id` int DEFAULT NULL,
  `first_register_date` datetime DEFAULT NULL,
  `last_register_id` int DEFAULT NULL,
  `last_register_date` datetime DEFAULT NULL,
  PRIMARY KEY (`file_seq`,`user_seq`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user_file`
--

LOCK TABLES `user_file` WRITE;
/*!40000 ALTER TABLE `user_file` DISABLE KEYS */;
/*!40000 ALTER TABLE `user_file` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user_interest`
--

DROP TABLE IF EXISTS `user_interest`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user_interest` (
  `user_seq` int NOT NULL AUTO_INCREMENT COMMENT 'Auto_Increment',
  `user_interest_code` varchar(10) NOT NULL,
  `first_register_id` int NOT NULL,
  `first_register_date` datetime NOT NULL,
  `last_register_id` int NOT NULL,
  `last_register_date` datetime NOT NULL,
  PRIMARY KEY (`user_seq`,`user_interest_code`),
  CONSTRAINT `FK_user_TO_user_interest_1` FOREIGN KEY (`user_seq`) REFERENCES `user` (`user_seq`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user_interest`
--

LOCK TABLES `user_interest` WRITE;
/*!40000 ALTER TABLE `user_interest` DISABLE KEYS */;
/*!40000 ALTER TABLE `user_interest` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `withdrawal_detail`
--

DROP TABLE IF EXISTS `withdrawal_detail`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `withdrawal_detail` (
  `withdrawal_seq` int NOT NULL AUTO_INCREMENT,
  `user_seq` int NOT NULL COMMENT 'Auto_Increment',
  `withdrawal_amount` int NOT NULL,
  `withdrawal_date` date NOT NULL,
  `first_register_id` int NOT NULL,
  `first_register_date` datetime NOT NULL,
  `last_register_id` int NOT NULL,
  `last_register_date` datetime NOT NULL,
  PRIMARY KEY (`withdrawal_seq`),
  KEY `FK_user_TO_withdrawal_detail_1` (`user_seq`),
  CONSTRAINT `FK_user_TO_withdrawal_detail_1` FOREIGN KEY (`user_seq`) REFERENCES `user` (`user_seq`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `withdrawal_detail`
--

LOCK TABLES `withdrawal_detail` WRITE;
/*!40000 ALTER TABLE `withdrawal_detail` DISABLE KEYS */;
INSERT INTO `withdrawal_detail` VALUES (3,9,10000,'2022-04-28',10,'2022-04-28 20:23:18',10,'2022-04-28 20:23:18'),(4,9,10000,'2022-04-28',10,'2022-04-28 21:01:28',10,'2022-04-28 21:01:28');
/*!40000 ALTER TABLE `withdrawal_detail` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `withdrawal_request`
--

DROP TABLE IF EXISTS `withdrawal_request`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `withdrawal_request` (
  `request_seq` int NOT NULL AUTO_INCREMENT,
  `user_seq` int DEFAULT NULL,
  `withdrawal_point` int DEFAULT NULL,
  `first_register_id` int DEFAULT NULL,
  `first_register_date` datetime DEFAULT NULL,
  `last_register_id` int DEFAULT NULL,
  `last_register_date` datetime DEFAULT NULL,
  PRIMARY KEY (`request_seq`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `withdrawal_request`
--

LOCK TABLES `withdrawal_request` WRITE;
/*!40000 ALTER TABLE `withdrawal_request` DISABLE KEYS */;
INSERT INTO `withdrawal_request` VALUES (1,9,10000,9,'2022-04-28 20:17:21',9,'2022-04-28 20:17:21'),(2,9,10000,9,'2022-04-28 21:01:24',9,'2022-04-28 21:01:24');
/*!40000 ALTER TABLE `withdrawal_request` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping events for database 'laondius'
--

--
-- Dumping routines for database 'laondius'
--
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2022-04-30  0:04:18
