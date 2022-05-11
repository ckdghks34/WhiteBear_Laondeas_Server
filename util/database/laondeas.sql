-- MySQL dump 10.19  Distrib 10.3.34-MariaDB, for debian-linux-gnu (x86_64)
--
-- Host: localhost    Database: laondius
-- ------------------------------------------------------
-- Server version	10.3.34-MariaDB-0ubuntu0.20.04.1

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;
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
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `accrual_detail` (
  `accrual_seq` int(11) NOT NULL AUTO_INCREMENT,
  `user_seq` int(11) NOT NULL COMMENT 'Auto_Increment',
  `accrual_point` int(11) NOT NULL,
  `accrual_content` varchar(200) DEFAULT NULL,
  `accrual_point_date` date NOT NULL,
  `first_register_id` int(11) DEFAULT NULL,
  `first_register_date` datetime DEFAULT NULL,
  `last_register_id` int(11) DEFAULT NULL,
  `last_register_date` datetime DEFAULT NULL,
  PRIMARY KEY (`accrual_seq`),
  KEY `FK_user_TO_accrual_detail_1` (`user_seq`),
  CONSTRAINT `FK_user_TO_accrual_detail_1` FOREIGN KEY (`user_seq`) REFERENCES `user` (`user_seq`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `accrual_detail`
--

LOCK TABLES `accrual_detail` WRITE;
/*!40000 ALTER TABLE `accrual_detail` DISABLE KEYS */;
INSERT INTO `accrual_detail` VALUES (2,9,10000,NULL,'2022-04-28',10,'2022-04-28 20:10:04',NULL,NULL),(3,26,200,NULL,'2022-05-03',99,'2022-05-03 00:13:13',NULL,NULL),(4,26,300,NULL,'2022-05-03',99,'2022-05-03 00:13:31',NULL,NULL),(5,26,300,NULL,'2022-05-03',99,'2022-05-03 00:19:22',NULL,NULL),(6,26,9900,NULL,'2022-05-03',99,'2022-05-03 00:20:14',NULL,NULL),(7,26,1100,NULL,'2022-05-03',99,'2022-05-03 00:22:38',NULL,NULL),(8,10,100,'출석체크','2022-05-05',10,'2022-05-05 20:46:44',10,'2022-05-05 20:46:44');
/*!40000 ALTER TABLE `accrual_detail` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `advertisement`
--

DROP TABLE IF EXISTS `advertisement`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `advertisement` (
  `advertising_seq` int(11) NOT NULL AUTO_INCREMENT,
  `company_name` varchar(50) NOT NULL,
  `contact` varchar(11) NOT NULL,
  `area` varchar(20) NOT NULL,
  `isagency` tinyint(1) DEFAULT 0,
  `agreement_info` tinyint(1) DEFAULT 0,
  `first_register_date` datetime NOT NULL,
  `last_register_date` datetime NOT NULL,
  PRIMARY KEY (`advertising_seq`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4;
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
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `answer` (
  `answer_seq` int(11) NOT NULL AUTO_INCREMENT,
  `qna_seq` int(11) NOT NULL,
  `author` int(11) NOT NULL COMMENT 'user테이블 pk값 참조',
  `title` text NOT NULL,
  `content` text NOT NULL,
  `first_register_id` int(11) NOT NULL,
  `first_register_date` datetime DEFAULT NULL,
  `last_register_id` int(11) NOT NULL,
  `last_register_date` datetime DEFAULT NULL,
  PRIMARY KEY (`answer_seq`,`qna_seq`),
  KEY `FK_Question_TO_Answer_1` (`qna_seq`),
  CONSTRAINT `FK_Question_TO_Answer_1` FOREIGN KEY (`qna_seq`) REFERENCES `question` (`qna_seq`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4;
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
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `attendance` (
  `attendance_seq` int(11) NOT NULL AUTO_INCREMENT,
  `user_seq` int(11) NOT NULL COMMENT 'Auto_Increment',
  `content` text NOT NULL,
  `first_register_id` int(11) DEFAULT NULL,
  `first_register_date` datetime DEFAULT NULL,
  `last_register_id` int(11) DEFAULT NULL,
  `last_register_date` datetime DEFAULT NULL,
  PRIMARY KEY (`attendance_seq`,`user_seq`),
  KEY `FK_user_TO_attendance_1` (`user_seq`),
  CONSTRAINT `FK_user_TO_attendance_1` FOREIGN KEY (`user_seq`) REFERENCES `user` (`user_seq`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=39 DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `attendance`
--

LOCK TABLES `attendance` WRITE;
/*!40000 ALTER TABLE `attendance` DISABLE KEYS */;
INSERT INTO `attendance` VALUES (1,10,'출석체크 테스트중',10,'2022-05-03 03:20:04',10,'2022-05-03 03:20:04'),(2,10,'출석체크 테스트중',10,'2022-05-03 07:20:14',10,'2022-05-03 07:20:14'),(3,26,'출첵이요~',26,'2022-05-04 18:05:07',26,'2022-05-04 18:05:07'),(4,26,'출첵이요~',26,'2022-05-04 18:11:19',26,'2022-05-04 18:11:19'),(5,26,'출첵이요~',26,'2022-05-04 18:11:21',26,'2022-05-04 18:11:21'),(6,26,'출첵이요~',26,'2022-05-04 18:11:21',26,'2022-05-04 18:11:21'),(7,26,'출첵이요~',26,'2022-05-04 18:11:22',26,'2022-05-04 18:11:22'),(8,26,'출첵이요~',26,'2022-05-04 18:11:23',26,'2022-05-04 18:11:23'),(9,26,'출첵이요~',26,'2022-05-04 18:11:23',26,'2022-05-04 18:11:23'),(10,26,'출첵이요~',26,'2022-05-04 18:11:24',26,'2022-05-04 18:11:24'),(11,26,'출첵이요~',26,'2022-05-04 18:11:24',26,'2022-05-04 18:11:24'),(12,26,'출첵이요~',26,'2022-05-04 18:11:25',26,'2022-05-04 18:11:25'),(13,26,'출첵이요~',26,'2022-05-04 18:11:25',26,'2022-05-04 18:11:25'),(14,26,'출첵이요~',26,'2022-05-04 18:11:26',26,'2022-05-04 18:11:26'),(15,26,'출첵이요~',26,'2022-05-04 18:11:27',26,'2022-05-04 18:11:27'),(16,26,'출첵이요~',26,'2022-05-04 18:11:28',26,'2022-05-04 18:11:28'),(17,26,'출첵이요~',26,'2022-05-04 18:11:28',26,'2022-05-04 18:11:28'),(18,26,'출첵이요~',26,'2022-05-04 18:11:29',26,'2022-05-04 18:11:29'),(19,26,'ㅁㅈㅇㅂㅈㅇ',26,'2022-05-04 18:35:09',26,'2022-05-04 18:35:09'),(20,26,'ㅎㅇㅎㅇ',26,'2022-05-04 18:39:10',26,'2022-05-04 18:39:10'),(21,26,'ㅁㄴㅇㄹㅁㄴㅇㄹㅁㄴㅇㄹㅁㄴㅇㄹㅁㄴㅇㄹㅁㄴㅇㄹㅁㄴㅇㄹㅁㄴㅇㄹㅁㄴㅇㄹㅁㄴㅇㄹㅁㄴㅇㄹㅁㄴㅇㄹㅁㄴㅇㄹㅁㄴㅇㄹㅁㄴㅇㄹㅁㄴㅇㄹㅁㄴㅇㄹㅁㄴㅇㄹ',26,'2022-05-04 19:21:54',26,'2022-05-04 19:21:54'),(22,26,'ㅂㅈㄸ22',26,'2022-05-05 07:30:26',26,'2022-05-05 07:30:26'),(38,10,'출석체크 테스트중',10,'2022-05-05 20:46:44',10,'2022-05-05 20:46:44');
/*!40000 ALTER TABLE `attendance` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `blacklist`
--

DROP TABLE IF EXISTS `blacklist`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `blacklist` (
  `blacklist_seq` int(11) NOT NULL AUTO_INCREMENT,
  `user_seq` int(11) DEFAULT NULL,
  `is_active` tinyint(1) DEFAULT NULL,
  `first_register_id` int(11) DEFAULT NULL,
  `first_register_date` datetime DEFAULT NULL,
  `last_register_id` int(11) DEFAULT NULL,
  `last_register_date` datetime DEFAULT NULL,
  PRIMARY KEY (`blacklist_seq`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
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
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `campaign` (
  `campaign_seq` int(11) NOT NULL AUTO_INCREMENT COMMENT 'Auto Increment',
  `advertiser` int(11) NOT NULL COMMENT '유저테이블 PK 참조',
  `is_premium` tinyint(1) NOT NULL,
  `title` varchar(100) NOT NULL,
  `category` varchar(10) NOT NULL,
  `product` varchar(10) NOT NULL,
  `channel` varchar(10) NOT NULL,
  `area` varchar(10) NOT NULL,
  `address` text DEFAULT NULL,
  `keyword` text NOT NULL,
  `headcount` int(11) NOT NULL,
  `siteURL` text NOT NULL,
  `misson` text NOT NULL,
  `reward` text NOT NULL,
  `original_price` int(11) DEFAULT NULL,
  `discount_price` int(11) DEFAULT NULL,
  `accrual_point` int(11) NOT NULL,
  `campaign_guide` text NOT NULL,
  `recruit_start_date` datetime NOT NULL,
  `recruit_end_date` datetime NOT NULL,
  `reviewer_announcement_date` datetime NOT NULL,
  `review_start_date` datetime DEFAULT NULL,
  `review_end_date` datetime DEFAULT NULL,
  `campaign_end_date` datetime DEFAULT NULL,
  `agreement_portrait` tinyint(1) NOT NULL DEFAULT 0,
  `agreement_provide_info` tinyint(1) NOT NULL DEFAULT 0,
  `campaign_state` tinyint(1) NOT NULL,
  `view_count` int(11) DEFAULT NULL,
  `uuid` text DEFAULT NULL,
  `first_register_id` int(11) DEFAULT NULL,
  `first_register_date` datetime DEFAULT NULL,
  `last_register_id` int(11) DEFAULT NULL,
  `last_register_date` datetime DEFAULT NULL,
  PRIMARY KEY (`campaign_seq`)
) ENGINE=InnoDB AUTO_INCREMENT=62 DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `campaign`
--

LOCK TABLES `campaign` WRITE;
/*!40000 ALTER TABLE `campaign` DISABLE KEYS */;
INSERT INTO `campaign` VALUES (58,0,0,'명륜진사갈비4','방문형','맛집','블로그','부산 사하구',NULL,'명륜,진사,갈비,맛조아,라온디어스,체험단',25,'https://google.com','명륜진사갈비를 맛있게먹고\n블루그에 멋진글하나 써주세요\n아그리고 이것도하세요!','명륜진사갈비 50000원치 무료',50000,0,3000,'명륜진사갈비\n맛있게 드시면됩니다 ^_^','2022-05-06 06:22:00','2022-05-07 06:22:00','2022-05-08 06:22:00','2022-05-09 06:22:00','2022-05-13 06:22:00','2022-05-30 07:53:00',1,1,1,18,NULL,27,'2022-05-05 21:22:42',27,'2022-05-05 22:54:37'),(59,0,0,'테일러짐 길동역점','방문형','문화/생활','유튜브','대구 달서구',NULL,'헬스,기구,맛집',20,'http://tailer.com','사레레 20회 x 5세트\n숄더프레스 12회 x 5세트\n리버스 팩덱플라이 15회 x 5세트\n이두 & 삼두 각각 5세트\n\n하시고 인증샷 남겨주시면 됩니다~~^^','무료 헬스이용권',10000,0,3000,'헬스장에가실때는 옷은 주니까 안가져가도되고\n마스크는 필히 착용하셔야합니다.\n\n1. 나누기\n2. 먹기\n3. 운동하기','2022-05-26 07:58:00','2022-05-28 07:58:00','2022-05-28 19:58:00','2022-05-29 07:58:00','2022-05-31 07:58:00','2022-05-31 07:58:00',1,1,1,13,NULL,27,'2022-05-05 22:59:06',27,'2022-05-05 23:01:34'),(60,0,1,'깐부치킨(호떡치킨)','배송형','맛집','블로그','경상북도 문경시',NULL,'치킨,호떡,맛집,문경맛집',20,'http://www.9922.co.kr/seeathotteok','호떡치킨을 맛있게 드시고\n남은 뼈를 인증해주세요!','치킨1마리 무료',21000,0,10000,'다른치킨보다 맛잇다고하면안됩니다.\n타인에게 많이 노출해주세요\n\n[주의사항]\n1. 치킨이 식지않도록 한다.\n2. 김이 모락모락난다면 캡쳐한다.\n\n기타 문의사항은 : 010-2233-9987에 문의주세요','2022-05-10 22:14:00','2022-05-14 22:15:00','2022-05-15 22:15:00','2022-05-16 22:15:00','2022-05-21 22:15:00','2022-05-09 22:15:00',1,1,1,12,NULL,27,'2022-05-09 13:22:00',27,'2022-05-09 16:41:59'),(61,1,0,'테스트','방문형','뷰티','블로그','서울','서울턱별시 저기 어디가 조용한 마을 11번지','뷰티뷰티,테스트',10,'testtestset.com','테스트 성공하십쇼','뷰티테스트',65000,10000,10000,'화이팅 테스트','2022-04-30 11:00:00','2022-05-07 11:00:00','2022-05-07 11:00:00','2022-05-10 11:00:00','2022-05-20 11:00:00','2022-05-20 11:00:00',1,1,1,0,NULL,10,'2022-05-09 22:32:52',10,'2022-05-09 22:32:52');
/*!40000 ALTER TABLE `campaign` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `campaign_application`
--

DROP TABLE IF EXISTS `campaign_application`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `campaign_application` (
  `user_seq` int(11) NOT NULL COMMENT 'Auto_Increment',
  `campaign_seq` int(11) NOT NULL COMMENT 'Auto Increment',
  `acquaint_content` tinyint(1) NOT NULL DEFAULT 0,
  `select_reward` text NOT NULL,
  `camera_code` varchar(10) NOT NULL COMMENT '코드테이블 값 참조',
  `face_exposure` tinyint(1) NOT NULL,
  `address` text NOT NULL,
  `receiver` varchar(20) NOT NULL,
  `receiver_phonenumber` varchar(11) NOT NULL,
  `joint_blog` tinyint(1) NOT NULL,
  `other_answers` text DEFAULT NULL,
  `status` varchar(10) NOT NULL COMMENT '/home/ubuntu/laondius/laon-web-server/util/database',
  `first_register_id` int(11) NOT NULL,
  `first_register_date` datetime NOT NULL,
  `last_register_id` int(11) NOT NULL,
  `last_register_date` datetime NOT NULL,
  PRIMARY KEY (`user_seq`,`campaign_seq`),
  KEY `FK_campaign_TO_campaign_application_1` (`campaign_seq`),
  CONSTRAINT `FK_campaign_TO_campaign_application_1` FOREIGN KEY (`campaign_seq`) REFERENCES `campaign` (`campaign_seq`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `FK_user_TO_campaign_application_1` FOREIGN KEY (`user_seq`) REFERENCES `user` (`user_seq`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `campaign_application`
--

LOCK TABLES `campaign_application` WRITE;
/*!40000 ALTER TABLE `campaign_application` DISABLE KEYS */;
INSERT INTO `campaign_application` VALUES (26,58,1,'','',1,'d','s','12',0,'','0',26,'2022-05-05 21:33:28',26,'2022-05-05 21:33:28'),(26,59,1,'','',1,'d','s','12',0,'','0',26,'2022-05-05 23:02:29',26,'2022-05-05 23:02:29'),(27,58,1,'','',1,'','','',0,'','0',27,'2022-05-05 21:26:36',27,'2022-05-05 21:26:36'),(30,59,1,'','',1,'서울시 마마동 시시두 202호','테윤씨','01078787878',0,'','0',30,'2022-05-09 15:47:34',30,'2022-05-09 15:47:34'),(30,60,1,'','',1,'대구시 동대구역 2번출구','회사장','01077226633',0,'','0',30,'2022-05-09 16:15:51',30,'2022-05-09 16:15:51');
/*!40000 ALTER TABLE `campaign_application` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `campaign_evaluation`
--

DROP TABLE IF EXISTS `campaign_evaluation`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `campaign_evaluation` (
  `campaign_seq` int(11) NOT NULL COMMENT 'Auto Increment',
  `user_seq` int(11) NOT NULL COMMENT 'Auto_Increment',
  `evaluation` int(11) NOT NULL,
  `content` text NOT NULL,
  `frist_register_id` int(11) NOT NULL,
  `first_register_date` datetime NOT NULL,
  `last_register_id` int(11) NOT NULL,
  `last_register_date` datetime NOT NULL,
  PRIMARY KEY (`campaign_seq`,`user_seq`),
  KEY `FK_user_TO_campaign_evaluation_1` (`user_seq`),
  CONSTRAINT `FK_campaign_TO_campaign_evaluation_1` FOREIGN KEY (`campaign_seq`) REFERENCES `campaign` (`campaign_seq`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `FK_user_TO_campaign_evaluation_1` FOREIGN KEY (`user_seq`) REFERENCES `user` (`user_seq`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
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
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `campaign_file` (
  `file_seq` int(11) NOT NULL AUTO_INCREMENT,
  `campaign_seq` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `path` text NOT NULL,
  `extension` varchar(10) NOT NULL,
  `filekey` text NOT NULL,
  `first_register_id` int(11) DEFAULT NULL,
  `first_register_date` datetime DEFAULT NULL,
  `last_register_id` int(11) DEFAULT NULL,
  `last_register_date` datetime DEFAULT NULL,
  PRIMARY KEY (`file_seq`,`campaign_seq`)
) ENGINE=InnoDB AUTO_INCREMENT=138 DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `campaign_file`
--

LOCK TABLES `campaign_file` WRITE;
/*!40000 ALTER TABLE `campaign_file` DISABLE KEYS */;
INSERT INTO `campaign_file` VALUES (26,3,'1mplei.jpg','https://laondius.s3.ap-northeast-2.amazonaws.com/campaignimage/16512530896211mplei.jpeg','jpeg','',10,'2022-04-30 02:24:50',10,'2022-04-30 02:24:50'),(27,3,'asdasdassamplei.jpg','https://laondius.s3.ap-northeast-2.amazonaws.com/campaignimage/1651253089621asdasdassamplei.jpeg','jpeg','',10,'2022-04-30 02:24:50',10,'2022-04-30 02:24:50'),(28,3,'sample3.jpg','https://laondius.s3.ap-northeast-2.amazonaws.com/campaignimage/1651253089622sample3.jpeg','jpeg','',10,'2022-04-30 02:24:50',10,'2022-04-30 02:24:50'),(29,3,'samplei.jpg','https://laondius.s3.ap-northeast-2.amazonaws.com/campaignimage/1651253089622samplei.jpeg','jpeg','',10,'2022-04-30 02:24:50',10,'2022-04-30 02:24:50'),(30,3,'samplei1.jpg','https://laondius.s3.ap-northeast-2.amazonaws.com/campaignimage/1651253089622samplei1.jpeg','jpeg','',10,'2022-04-30 02:24:50',10,'2022-04-30 02:24:50'),(82,1,'detail_sample.jpg','https://laondius.s3.ap-northeast-2.amazonaws.com/campaignimage/detail_1651528192867sample.jpeg','jpeg','',10,'2022-05-03 06:49:53',10,'2022-05-03 06:49:53'),(83,1,'detail_sample.jpg','https://laondius.s3.ap-northeast-2.amazonaws.com/campaignimage/detail_1651528192870sample.jpeg','jpeg','',10,'2022-05-03 06:49:53',10,'2022-05-03 06:49:53'),(84,1,'detail_sample.jpg','https://laondius.s3.ap-northeast-2.amazonaws.com/campaignimage/detail_1651528192904sample.jpeg','jpeg','',10,'2022-05-03 06:49:53',10,'2022-05-03 06:49:53'),(85,1,'detail_sample.jpg','https://laondius.s3.ap-northeast-2.amazonaws.com/campaignimage/detail_1651528192907sample.jpeg','jpeg','',10,'2022-05-03 06:49:53',10,'2022-05-03 06:49:53'),(86,1,'thumbnail_sample.jpg','https://laondius.s3.ap-northeast-2.amazonaws.com/campaignimage/thumbnail_1651528192910sample.jpeg','jpeg','',10,'2022-05-03 06:49:53',10,'2022-05-03 06:49:53'),(104,16,'detail_sample.jpg','https://laondius.s3.ap-northeast-2.amazonaws.com/campaignimage/detail_1651764779846sample.jpeg','jpeg','campaignimage/detail_1651764779846sample.jpeg',99,'2022-05-02 22:44:04',99,'2022-05-06 00:32:59'),(105,16,'thumbnail_�.png','https://laondius.s3.ap-northeast-2.amazonaws.com/campaignimage/thumbnail_1651764739915%EF%BF%BD.png','png','campaignimage/thumbnail_1651764739915�.png',99,'2022-05-02 22:44:04',99,'2022-05-06 00:32:20'),(106,14,'detail_content.jpeg','https://laondius.s3.ap-northeast-2.amazonaws.com/campaignimage/detail_1651531512663content.gif','gif','campaignimage/detail_1651531512663content.gif',27,'2022-05-02 22:45:12',27,'2022-05-02 22:45:12'),(107,14,'thumbnail_thumb200.jpeg','https://laondius.s3.ap-northeast-2.amazonaws.com/campaignimage/thumbnail_1651531512663thumb200.gif','gif','campaignimage/thumbnail_1651531512663thumb200.gif',27,'2022-05-02 22:45:12',27,'2022-05-02 22:45:12'),(108,19,'detail_quick03.gif','https://laondius.s3.ap-northeast-2.amazonaws.com/campaignimage/detail_1651531565837quick03.gif','gif','campaignimage/detail_1651531565837quick03.gif',27,'2022-05-02 22:46:05',27,'2022-05-02 22:46:05'),(109,19,'thumbnail_greek_pic.jpg','https://laondius.s3.ap-northeast-2.amazonaws.com/campaignimage/thumbnail_1651531565837greek_pic.jpeg','jpeg','campaignimage/thumbnail_1651531565837greek_pic.jpeg',27,'2022-05-02 22:46:05',27,'2022-05-02 22:46:05'),(110,36,'detail_quick04.gif','https://laondius.s3.ap-northeast-2.amazonaws.com/campaignimage/detail_1651533429783quick04.gif','gif','campaignimage/detail_1651533429783quick04.gif',27,'2022-05-02 23:17:09',27,'2022-05-02 23:17:09'),(111,36,'thumbnail_quick05.gif','https://laondius.s3.ap-northeast-2.amazonaws.com/campaignimage/thumbnail_1651533429806quick05.gif','gif','campaignimage/thumbnail_1651533429806quick05.gif',27,'2022-05-02 23:17:09',27,'2022-05-02 23:17:09'),(116,37,'detail_유이7.png','https://laondius.s3.ap-northeast-2.amazonaws.com/campaignimage/detail_1651533928950%E1%84%8B%E1%85%B2%E1%84%8B%E1%85%B57.png','png','campaignimage/detail_1651533928950유이7.png',27,'2022-05-02 23:25:29',27,'2022-05-02 23:25:29'),(117,37,'thumbnail_유이2.png','https://laondius.s3.ap-northeast-2.amazonaws.com/campaignimage/thumbnail_1651533928953%E1%84%8B%E1%85%B2%E1%84%8B%E1%85%B52.png','png','campaignimage/thumbnail_1651533928953유이2.png',27,'2022-05-02 23:25:29',27,'2022-05-02 23:25:29'),(118,38,'detail_유이10.png','https://laondius.s3.ap-northeast-2.amazonaws.com/campaignimage/detail_1651534041554%E1%84%8B%E1%85%B2%E1%84%8B%E1%85%B510.png','png','campaignimage/detail_1651534041554유이10.png',27,'2022-05-02 23:27:21',27,'2022-05-02 23:27:21'),(119,38,'thumbnail_유이3.png','https://laondius.s3.ap-northeast-2.amazonaws.com/campaignimage/thumbnail_1651534041555%E1%84%8B%E1%85%B2%E1%84%8B%E1%85%B53.png','png','campaignimage/thumbnail_1651534041555유이3.png',27,'2022-05-02 23:27:21',27,'2022-05-02 23:27:21'),(120,39,'detail_sub_img.png','https://laondius.s3.ap-northeast-2.amazonaws.com/campaignimage/detail_1651575775230sub_img.png','png','campaignimage/detail_1651575775230sub_img.png',27,'2022-05-03 11:02:55',27,'2022-05-03 11:02:55'),(121,39,'thumbnail_intro_pic.jpg','https://laondius.s3.ap-northeast-2.amazonaws.com/campaignimage/thumbnail_1651575775389intro_pic.jpeg','jpeg','campaignimage/thumbnail_1651575775389intro_pic.jpeg',27,'2022-05-03 11:02:55',27,'2022-05-03 11:02:55'),(122,50,'detail_content.jpeg','https://laondius.s3.ap-northeast-2.amazonaws.com/campaignimage/detail_1651670106938content.jpeg','jpeg','campaignimage/detail_1651670106938content.jpeg',27,'2022-05-04 13:15:07',27,'2022-05-04 13:15:07'),(123,50,'thumbnail_thumb200.jpeg','https://laondius.s3.ap-northeast-2.amazonaws.com/campaignimage/thumbnail_1651670107465thumb200.jpeg','jpeg','campaignimage/thumbnail_1651670107465thumb200.jpeg',27,'2022-05-04 13:15:07',27,'2022-05-04 13:15:07'),(124,52,'detail_thumb200.jpeg','https://laondius.s3.ap-northeast-2.amazonaws.com/campaignimage/detail_1651673280715thumb200.jpeg','jpeg','campaignimage/detail_1651673280715thumb200.jpeg',27,'2022-05-04 14:08:01',27,'2022-05-04 14:08:01'),(125,52,'thumbnail_content.jpeg','https://laondius.s3.ap-northeast-2.amazonaws.com/campaignimage/thumbnail_1651673280740content.jpeg','jpeg','campaignimage/thumbnail_1651673280740content.jpeg',27,'2022-05-04 14:08:01',27,'2022-05-04 14:08:01'),(128,6,'detail_20220427.jpeg','https://laondius.s3.ap-northeast-2.amazonaws.com/campaignimage/detail_165167393840620220427.jpeg','jpeg','campaignimage/detail_165167393840620220427.jpeg',27,'2022-05-04 14:18:59',27,'2022-05-04 14:18:59'),(129,6,'thumbnail_content.jpeg','https://laondius.s3.ap-northeast-2.amazonaws.com/campaignimage/thumbnail_1651673938533content.jpeg','jpeg','campaignimage/thumbnail_1651673938533content.jpeg',27,'2022-05-04 14:18:59',27,'2022-05-04 14:18:59'),(130,57,'detail_content.jpeg','https://laondius.s3.ap-northeast-2.amazonaws.com/campaignimage/detail_1651784587369content.jpeg','jpeg','campaignimage/detail_1651784587369content.jpeg',27,'2022-05-05 21:03:08',27,'2022-05-05 21:03:08'),(131,57,'thumbnail_avater.png','https://laondius.s3.ap-northeast-2.amazonaws.com/campaignimage/thumbnail_1651784587299avater.png','png','campaignimage/thumbnail_1651784587299avater.png',27,'2022-05-05 21:03:08',27,'2022-05-05 21:03:08'),(132,58,'detail_content.jpeg','https://laondius.s3.ap-northeast-2.amazonaws.com/campaignimage/detail_1651790428970content.jpeg','jpeg','campaignimage/detail_1651790428970content.jpeg',27,'2022-05-05 21:22:43',27,'2022-05-05 22:40:29'),(133,58,'thumbnail_thumb200.jpeg','https://laondius.s3.ap-northeast-2.amazonaws.com/campaignimage/thumbnail_1651790409473thumb200.jpeg','jpeg','campaignimage/thumbnail_1651790409473thumb200.jpeg',27,'2022-05-05 21:22:43',27,'2022-05-05 22:40:09'),(134,59,'detail_jim.jpeg','https://laondius.s3.ap-northeast-2.amazonaws.com/campaignimage/detail_1651791546248jim.jpeg','jpeg','campaignimage/detail_1651791546248jim.jpeg',27,'2022-05-05 22:59:06',27,'2022-05-05 22:59:06'),(135,59,'thumbnail_jimthm.jpeg','https://laondius.s3.ap-northeast-2.amazonaws.com/campaignimage/thumbnail_1651791546205jimthm.jpeg','jpeg','campaignimage/thumbnail_1651791546205jimthm.jpeg',27,'2022-05-05 22:59:06',27,'2022-05-05 22:59:06'),(136,60,'detail_content.jpeg','https://laondius.s3.ap-northeast-2.amazonaws.com/campaignimage/detail_1652102521018content.jpeg','jpeg','campaignimage/detail_1652102521018content.jpeg',27,'2022-05-09 13:22:01',27,'2022-05-09 13:22:01'),(137,60,'thumbnail_thumb200.jpeg','https://laondius.s3.ap-northeast-2.amazonaws.com/campaignimage/thumbnail_1652102521007thumb200.jpeg','jpeg','campaignimage/thumbnail_1652102521007thumb200.jpeg',27,'2022-05-09 13:22:01',27,'2022-05-09 13:22:01');
/*!40000 ALTER TABLE `campaign_file` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `campaign_qna`
--

DROP TABLE IF EXISTS `campaign_qna`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `campaign_qna` (
  `question_seq` int(11) NOT NULL AUTO_INCREMENT,
  `campaign_seq` int(11) NOT NULL COMMENT 'Auto Increment',
  `question` text NOT NULL,
  `answer` text NOT NULL,
  `first_register_id` int(11) NOT NULL,
  `first_register_date` datetime NOT NULL,
  `last_register_id` int(11) NOT NULL,
  `last_register_date` datetime NOT NULL,
  PRIMARY KEY (`question_seq`),
  KEY `FK_campaign_TO_campaign_qna_1` (`campaign_seq`),
  CONSTRAINT `FK_campaign_TO_campaign_qna_1` FOREIGN KEY (`campaign_seq`) REFERENCES `campaign` (`campaign_seq`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
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
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `code_table` (
  `code_value` varchar(10) NOT NULL,
  `code_name` varchar(50) NOT NULL,
  `top_level_code` varchar(10) DEFAULT NULL,
  `code_step` int(11) DEFAULT NULL,
  PRIMARY KEY (`code_value`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `code_table`
--

LOCK TABLES `code_table` WRITE;
/*!40000 ALTER TABLE `code_table` DISABLE KEYS */;
INSERT INTO `code_table` VALUES ('CMC','Camera_code','null',0),('CMC0001','휴대폰카메라','CMC',1),('CMC0002','미러리스','CMC',1),('CMC0003','DSLR','CMC',1),('CMC0004','기타','CMC',1),('UAC','User_Area_Code','Null',0),('UAC0001','서울','UAC',1),('UAC0002','경기','UAC',1),('UAC0003','부산','UAC',1),('UAC0004','인천','UAC',1),('UAC0005','대구','UAC',1),('UAC0006','광주','UAC',1),('UAC0007','울산','UAC',1),('UAC0008','경북','UAC',1),('UAC0009','경남','UAC',1),('UAC0010','전북','UAC',1),('UAC0011','전남','UAC',1),('UAC0012','충북','UAC',1),('UAC0013','충남','UAC',1),('UAC0014','세종','UAC',1),('UAC0015','제주','UAC',1),('UCC','User_Channel_Code','Null',0),('UCC0001','전체','UCC',1),('UCC0002','블로그','UCC',1),('UCC0003','인스타그램','UCC',1),('UCC0004','유튜브','UCC',1),('UIC','User_Interest_Code','Null',0),('UIC0001','맛집','UIC',1),('UIC0002','여행/숙박','UIC',1),('UIC0003','뷰티','UIC',1),('UIC0004','생활/문화','UIC',1),('UIC0005','식품','UIC',1),('UIC0006','디지털','UIC',1),('UIC0007','패션','UIC',1),('UIC0008','유아동','UIC',1),('UIC0009','도서','UIC',1),('UIC0010','반려동물','UIC',1);
/*!40000 ALTER TABLE `code_table` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `commonfile`
--

DROP TABLE IF EXISTS `commonfile`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `commonfile` (
  `file_seq` int(11) NOT NULL AUTO_INCREMENT,
  `category` varchar(45) NOT NULL,
  `name` varchar(100) NOT NULL,
  `path` text NOT NULL,
  `extension` varchar(10) NOT NULL,
  `filekey` text NOT NULL,
  `is_active` tinyint(1) DEFAULT NULL,
  PRIMARY KEY (`file_seq`)
) ENGINE=InnoDB AUTO_INCREMENT=19 DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `commonfile`
--

LOCK TABLES `commonfile` WRITE;
/*!40000 ALTER TABLE `commonfile` DISABLE KEYS */;
INSERT INTO `commonfile` VALUES (8,'banner','banner_banner1.png','https://laondius.s3.ap-northeast-2.amazonaws.com/commonfile/banner_1652114198975banner1.png','png','undefined.png',1),(9,'banner','banner_banner2.png','https://laondius.s3.ap-northeast-2.amazonaws.com/commonfile/banner_1652114198976banner2.png','png','undefined.png',1),(11,'premier_widget','premier_widget_premium_widget.png','https://laondius.s3.ap-northeast-2.amazonaws.com/commonfile/premier_widget_1652114875370premium_widget.png','png','undefined.png',0),(12,'premier_widget','premier_widget_premium_widget.png','https://laondius.s3.ap-northeast-2.amazonaws.com/commonfile/premier_widget_1652114911695premium_widget.png','png','undefined.png',0),(13,'widget','widget_widget.png','https://laondius.s3.ap-northeast-2.amazonaws.com/commonfile/widget_1652115445122widget.png','png','undefined.png',0),(14,'widget','widget_widget.png','https://laondius.s3.ap-northeast-2.amazonaws.com/commonfile/widget_1652115448668widget.png','png','undefined.png',0),(15,'premier_widget','premier_widget_premium_widget.png','https://laondius.s3.ap-northeast-2.amazonaws.com/commonfile/premier_widget_1652115448669premium_widget.png','png','undefined.png',0),(16,'widget','widget_widget.png','https://laondius.s3.ap-northeast-2.amazonaws.com/commonfile/widget_1652115594830widget.png','png','undefined.png',0),(17,'premier_widget','premier_widget_premium_widget.png','https://laondius.s3.ap-northeast-2.amazonaws.com/commonfile/premier_widget_1652115594834premium_widget.png','png','undefined.png',1),(18,'widget','widget_widget.png','https://laondius.s3.ap-northeast-2.amazonaws.com/commonfile/widget_1652115610047widget.png','png','undefined.png',1);
/*!40000 ALTER TABLE `commonfile` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `faq`
--

DROP TABLE IF EXISTS `faq`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `faq` (
  `faq_seq` int(11) NOT NULL AUTO_INCREMENT,
  `category` varchar(10) NOT NULL,
  `title` varchar(50) NOT NULL,
  `content` text NOT NULL,
  `first_register_id` int(11) NOT NULL,
  `first_register_date` datetime NOT NULL,
  `last_register_id` int(11) NOT NULL,
  `last_register_date` datetime NOT NULL,
  PRIMARY KEY (`faq_seq`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4;
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
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `interest_campaign` (
  `user_seq` int(11) NOT NULL COMMENT 'Auto_Increment',
  `campaign_seq` int(11) NOT NULL COMMENT 'Auto Increment',
  `first_register_id` int(11) DEFAULT NULL,
  `first_register_date` datetime DEFAULT NULL,
  `last_register_id` int(11) DEFAULT NULL,
  `last_register_date` datetime DEFAULT NULL,
  PRIMARY KEY (`user_seq`,`campaign_seq`),
  KEY `FK_campaign_TO_interest_campaign_1` (`campaign_seq`),
  CONSTRAINT `FK_campaign_TO_interest_campaign_1` FOREIGN KEY (`campaign_seq`) REFERENCES `campaign` (`campaign_seq`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `FK_user_TO_interest_campaign_1` FOREIGN KEY (`user_seq`) REFERENCES `user` (`user_seq`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `interest_campaign`
--

LOCK TABLES `interest_campaign` WRITE;
/*!40000 ALTER TABLE `interest_campaign` DISABLE KEYS */;
INSERT INTO `interest_campaign` VALUES (26,58,26,'2022-05-07 14:41:28',26,'2022-05-07 14:41:28'),(26,59,26,'2022-05-07 14:41:30',26,'2022-05-07 14:41:30'),(30,59,30,'2022-05-09 15:47:52',30,'2022-05-09 15:47:52');
/*!40000 ALTER TABLE `interest_campaign` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `message`
--

DROP TABLE IF EXISTS `message`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `message` (
  `message_seq` int(11) NOT NULL AUTO_INCREMENT COMMENT 'Auto Increment',
  `content` text NOT NULL,
  `is_read` tinyint(1) NOT NULL DEFAULT 0,
  `sender` int(11) NOT NULL,
  `receiver` int(11) NOT NULL,
  `first_register_id` int(11) NOT NULL,
  `first_register_date` datetime NOT NULL,
  `last_register_id` int(11) NOT NULL,
  `last_register_date` datetime NOT NULL,
  PRIMARY KEY (`message_seq`)
) ENGINE=InnoDB AUTO_INCREMENT=30 DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `message`
--

LOCK TABLES `message` WRITE;
/*!40000 ALTER TABLE `message` DISABLE KEYS */;
INSERT INTO `message` VALUES (1,'메세지 테스트',0,10,25,10,'2022-05-03 03:16:02',10,'2022-05-03 03:16:02'),(2,'메세지보낸다',0,3,16,3,'2022-05-02 22:23:13',3,'2022-05-02 22:23:13'),(3,'메세지보낸다',1,99,26,99,'2022-05-02 22:23:32',26,'2022-05-02 23:51:30'),(4,'메세지보낸다',1,99,26,99,'2022-05-02 22:23:32',26,'2022-05-02 23:45:52'),(5,'메세지보낸다',1,99,26,99,'2022-05-02 23:47:15',26,'2022-05-02 23:51:29'),(6,'메세지보낸다',1,99,26,99,'2022-05-02 23:47:16',26,'2022-05-02 23:47:22'),(7,'메세지보낸다',1,99,26,99,'2022-05-02 23:47:16',26,'2022-05-02 23:47:22'),(8,'메세지보낸다',1,99,26,99,'2022-05-02 23:47:17',26,'2022-05-02 23:50:13'),(9,'메세지보낸다',1,99,26,99,'2022-05-02 23:50:31',26,'2022-05-02 23:51:32'),(10,'메세지보낸다',1,99,26,99,'2022-05-04 18:43:24',26,'2022-05-04 18:43:35'),(11,'메세지보낸다',1,99,26,99,'2022-05-04 18:43:25',26,'2022-05-04 18:43:35'),(12,'메세지보낸다',1,99,26,99,'2022-05-04 18:43:25',26,'2022-05-04 18:54:38'),(13,'메세지보낸다',1,99,26,99,'2022-05-04 18:43:25',26,'2022-05-04 18:54:37'),(14,'메세지보낸다',1,99,26,99,'2022-05-04 18:43:26',26,'2022-05-04 18:54:37'),(15,'메세지보낸다',1,99,26,99,'2022-05-04 18:43:27',26,'2022-05-04 18:54:36'),(16,'메세지보낸다',1,99,26,99,'2022-05-04 18:43:28',99,'2022-05-04 18:43:28'),(17,'메세지보낸다',1,99,26,99,'2022-05-04 18:43:28',99,'2022-05-04 18:43:28'),(18,'메세지보낸다',1,99,26,99,'2022-05-04 18:43:29',99,'2022-05-04 18:43:29'),(19,'메세지보낸다',1,99,26,99,'2022-05-04 18:43:29',99,'2022-05-04 18:43:29'),(20,'메세지보낸다',1,99,26,99,'2022-05-04 18:43:30',99,'2022-05-04 18:43:30'),(21,'메세지보낸다메세지보낸다메세지보낸다메세지보낸다메세지보낸다메세지보낸다메세지보낸다메세지보낸다메세지보낸다메세지보낸다',1,99,26,99,'2022-05-04 18:55:10',26,'2022-05-04 18:55:20'),(22,'메세지보낸다메세지보낸다메세지보낸다메세지보낸다메세지보낸다메세지보낸다메세지보낸다메세지보낸다메세지보낸다메세지보낸다메세지보낸다메세지보낸다메세지보낸다메세지보낸다메세지보낸다메세지보낸다메세지보낸다메세지보낸다메세지보낸다메세지보낸다메세지보낸다메세지보낸다메세지보낸다메세지보낸다메세지보낸다메세지보낸다메세지보낸다메세지보낸다메세지보낸다메세지보낸다',1,99,26,99,'2022-05-04 18:57:02',26,'2022-05-04 18:57:08'),(23,'메세지보낸다메세지보낸다메세지보낸다메세지보낸다메세지보낸다메세지보낸다메세지보낸다메세지보낸다메세지보낸다메세지보낸다메세지보낸다메세지보낸다메세지보낸다메세지보낸다메세지보낸다메세지보낸다메세지보낸다메세지보낸다메세지보낸다메세지보낸다메세지보낸다메세지보낸다메세지보낸다메세지보낸다메세지보낸다메세지보낸다메세지보낸다메세지보낸다메세지보낸다메세지보낸다',1,99,26,99,'2022-05-05 20:49:59',99,'2022-05-05 20:49:59'),(24,'메세지보낸다메세지보낸다메세지보낸다메세지보낸다메세지보낸다메세지보낸다메세지보낸다메세지보낸다메세지보낸다메세지보낸다메세지보낸다메세지보낸다메세지보낸다메세지보낸다메세지보낸다메세지보낸다메세지보낸다메세지보낸다메세지보낸다메세지보낸다메세지보낸다메세지보낸다메세지보낸다메세지보낸다메세지보낸다메세지보낸다메세지보낸다메세지보낸다메세지보낸다메세지보낸다',1,99,26,99,'2022-05-05 20:49:59',99,'2022-05-05 20:49:59'),(25,'메세지보낸다메세지보낸다메세지보낸다메세지보낸다메세지보낸다메세지보낸다메세지보낸다메세지보낸다메세지보낸다메세지보낸다메세지보낸다메세지보낸다메세지보낸다메세지보낸다메세지보낸다메세지보낸다메세지보낸다메세지보낸다메세지보낸다메세지보낸다메세지보낸다메세지보낸다메세지보낸다메세지보낸다메세지보낸다메세지보낸다메세지보낸다메세지보낸다메세지보낸다메세지보낸다',1,99,26,99,'2022-05-05 20:52:41',99,'2022-05-05 20:52:41'),(26,'메세지보낸다메세지보낸다메세지보낸다메세지보낸다메세지보낸다메세지보낸다메세지보낸다메세지보낸다메세지보낸다메세지보낸다메세지보낸다메세지보낸다메세지보낸다메세지보낸다메세지보낸다메세지보낸다메세지보낸다메세지보낸다메세지보낸다메세지보낸다메세지보낸다메세지보낸다메세지보낸다메세지보낸다메세지보낸다메세지보낸다메세지보낸다메세지보낸다메세지보낸다메세지보낸다',1,99,26,99,'2022-05-05 20:52:42',99,'2022-05-05 20:52:42'),(27,'메세지보낸다메세지보낸다메세지보낸다메세지보낸다메세지보낸다메세지보낸다메세지보낸다메세지보낸다메세지보낸다메세지보낸다메세지보낸다메세지보낸다메세지보낸다메세지보낸다메세지보낸다메세지보낸다메세지보낸다메세지보낸다메세지보낸다메세지보낸다메세지보낸다메세지보낸다메세지보낸다메세지보낸다메세지보낸다메세지보낸다메세지보낸다메세지보낸다메세지보낸다메세지보낸다',1,99,26,99,'2022-05-05 20:52:42',99,'2022-05-05 20:52:42'),(28,'메세지보낸다메세지보낸다메세지보낸다메세지보낸다메세지보낸다메세지보낸다메세지보낸다메세지보낸다메세지보낸다메세지보낸다메세지보낸다메세지보낸다메세지보낸다메세지보낸다메세지보낸다메세지보낸다메세지보낸다메세지보낸다메세지보낸다메세지보낸다메세지보낸다메세지보낸다메세지보낸다메세지보낸다메세지보낸다메세지보낸다메세지보낸다메세지보낸다메세지보낸다메세지보낸다',1,99,26,99,'2022-05-05 20:52:44',99,'2022-05-05 20:52:44'),(29,'메세지보낸다메세지보낸다메세지보낸다메세지보낸다메세지보낸다메세지보낸다메세지보낸다메세지보낸다메세지보낸다메세지보낸다메세지보낸다메세지보낸다메세지보낸다메세지보낸다메세지보낸다메세지보낸다메세지보낸다메세지보낸다메세지보낸다메세지보낸다메세지보낸다메세지보낸다메세지보낸다메세지보낸다메세지보낸다메세지보낸다메세지보낸다메세지보낸다메세지보낸다메세지보낸다',1,99,26,99,'2022-05-05 20:52:44',99,'2022-05-05 20:52:44');
/*!40000 ALTER TABLE `message` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `notice`
--

DROP TABLE IF EXISTS `notice`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `notice` (
  `notice_seq` int(11) NOT NULL AUTO_INCREMENT,
  `author` int(11) DEFAULT NULL COMMENT 'user테이블 pk값 참조',
  `title` varchar(50) NOT NULL,
  `content` text NOT NULL,
  `view_count` int(11) NOT NULL DEFAULT 0,
  `first_register_id` int(11) NOT NULL,
  `first_register_date` datetime NOT NULL,
  `last_register_id` int(11) NOT NULL,
  `last_register_date` datetime NOT NULL,
  PRIMARY KEY (`notice_seq`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `notice`
--

LOCK TABLES `notice` WRITE;
/*!40000 ALTER TABLE `notice` DISABLE KEYS */;
INSERT INTO `notice` VALUES (1,10,'테스트 공지사항','공지사항 등록 테스트 중입니다.',4,10,'2022-04-26 01:11:11',10,'2022-04-26 01:11:11'),(2,10,'공지사항 수정 테스트','공지사항 수정 테스트 중입니다.',7,10,'2022-04-26 01:11:52',10,'2022-04-26 01:16:51');
/*!40000 ALTER TABLE `notice` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `penalty`
--

DROP TABLE IF EXISTS `penalty`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `penalty` (
  `penalty_seq` int(11) NOT NULL AUTO_INCREMENT,
  `user_seq` int(11) NOT NULL COMMENT 'user테이블 값 참조',
  `content` text NOT NULL,
  `end_date` date NOT NULL,
  `first_register_id` int(11) NOT NULL,
  `first_register_date` datetime NOT NULL,
  `last_register_id` int(11) NOT NULL,
  `last_register_date` datetime NOT NULL,
  PRIMARY KEY (`penalty_seq`)
) ENGINE=InnoDB AUTO_INCREMENT=22 DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `penalty`
--

LOCK TABLES `penalty` WRITE;
/*!40000 ALTER TABLE `penalty` DISABLE KEYS */;
INSERT INTO `penalty` VALUES (1,26,'1회 경고입니다','2022-05-03',99,'2022-05-02 23:59:51',99,'2022-05-02 23:59:51'),(2,26,'2회 경고입니다','2022-05-03',99,'2022-05-02 23:59:54',99,'2022-05-02 23:59:54'),(3,26,'2회 경고입니다','2022-05-08',99,'2022-05-04 16:12:25',99,'2022-05-04 16:12:25'),(4,26,'4회 경고입니다','2022-05-08',99,'2022-05-04 16:15:28',99,'2022-05-04 16:15:28'),(5,26,'4회 경고입니다','2022-05-08',99,'2022-05-04 16:15:30',99,'2022-05-04 16:15:30'),(6,26,'4회 경고입니다','2022-05-08',99,'2022-05-04 16:15:31',99,'2022-05-04 16:15:31'),(7,26,'4회 경고입니다','2022-05-08',99,'2022-05-04 16:15:31',99,'2022-05-04 16:15:31'),(8,26,'4회 경고입니다','2022-05-08',99,'2022-05-04 16:15:32',99,'2022-05-04 16:15:32'),(9,26,'4회 경고입니다','2022-05-08',99,'2022-05-04 16:15:35',99,'2022-05-04 16:15:35'),(10,26,'4회 경고입니다','2022-05-08',99,'2022-05-04 16:15:35',99,'2022-05-04 16:15:35'),(11,26,'4회 경고입니다','2022-05-08',99,'2022-05-04 16:15:36',99,'2022-05-04 16:15:36'),(12,26,'4회 경고입니다','2022-05-08',99,'2022-05-04 16:15:37',99,'2022-05-04 16:15:37'),(13,26,'4회 경고입니다','2022-05-08',99,'2022-05-04 16:15:37',99,'2022-05-04 16:15:37'),(14,26,'4회 경고입니다','2022-05-08',99,'2022-05-04 16:15:38',99,'2022-05-04 16:15:38'),(15,26,'4회 경고입니다','2022-05-08',99,'2022-05-04 16:15:44',99,'2022-05-04 16:15:44'),(16,26,'4회 경고입니다','2022-05-08',99,'2022-05-04 16:15:45',99,'2022-05-04 16:15:45'),(17,26,'4회 경고입니다','2022-05-08',99,'2022-05-04 16:15:45',99,'2022-05-04 16:15:45'),(18,26,'4회 경고입니다','2022-05-08',99,'2022-05-04 16:15:45',99,'2022-05-04 16:15:45'),(19,26,'4회 경고입니다','2022-05-08',99,'2022-05-04 16:15:50',99,'2022-05-04 16:15:50'),(20,26,'4회 경고입니다','2022-05-08',99,'2022-05-04 16:15:51',99,'2022-05-04 16:15:51'),(21,26,'4회 경고입니다','2022-05-08',99,'2022-05-04 16:15:51',99,'2022-05-04 16:15:51');
/*!40000 ALTER TABLE `penalty` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `popup`
--

DROP TABLE IF EXISTS `popup`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `popup` (
  `popup_seq` int(11) NOT NULL AUTO_INCREMENT,
  `imgURL` text DEFAULT NULL,
  `is_active` tinyint(1) DEFAULT NULL,
  `first_register_id` int(11) DEFAULT NULL,
  `first_register_date` datetime DEFAULT NULL,
  `last_register_id` int(11) DEFAULT NULL,
  `last_register_date` datetime DEFAULT NULL,
  PRIMARY KEY (`popup_seq`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
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
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `premium_application` (
  `premium_seq` int(11) NOT NULL AUTO_INCREMENT,
  `user_seq` int(11) NOT NULL COMMENT 'Auto_Increment',
  `agreement_content` tinyint(1) NOT NULL,
  `first_register_id` int(11) NOT NULL,
  `first_register_date` datetime NOT NULL,
  `last_register_id` int(11) NOT NULL,
  `last_register_date` datetime NOT NULL,
  PRIMARY KEY (`premium_seq`,`user_seq`),
  KEY `FK_user_TO_premium_application_1` (`user_seq`),
  CONSTRAINT `FK_user_TO_premium_application_1` FOREIGN KEY (`user_seq`) REFERENCES `user` (`user_seq`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
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
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `question` (
  `qna_seq` int(11) NOT NULL AUTO_INCREMENT,
  `author` int(11) NOT NULL COMMENT 'user테이블 pk값 참조',
  `category` varchar(20) NOT NULL,
  `title` varchar(50) NOT NULL,
  `content` text NOT NULL,
  `first_register_id` int(11) NOT NULL,
  `first_register_date` datetime DEFAULT NULL,
  `last_register_id` int(11) NOT NULL,
  `last_register_date` datetime DEFAULT NULL,
  PRIMARY KEY (`qna_seq`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `question`
--

LOCK TABLES `question` WRITE;
/*!40000 ALTER TABLE `question` DISABLE KEYS */;
INSERT INTO `question` VALUES (1,9,'캠페인신청','캠페인 신청 문의 드립니다.','캠페인 신청문의드립니다. 테스트',9,NULL,9,NULL),(3,9,'캠페인신청','테스트2 캠페인 신청 문의 드립니다.','캠페인 신청문의드립니다. 테스트',9,NULL,9,NULL),(4,9,'테스트','테스트1','캠페인 신청문의드립니다. 테스트',9,NULL,9,NULL),(5,9,'캠페인관련','캠페인 관련 테스트','캠페인 관련 테스트 중입니다.',9,'2022-04-28 21:05:39',9,'2022-04-28 21:05:39'),(6,26,'카테고리','첫번쨈 문의에요','문의내용',26,'2022-05-05 07:15:53',26,'2022-05-05 07:15:53'),(7,26,'카테고리','첫번쨈 문의에요','문의내용',26,'2022-05-05 07:16:30',26,'2022-05-05 07:16:30'),(8,26,'카테고리','첫번쨈 문의에요','문의내용',26,'2022-05-09 16:46:20',26,'2022-05-09 16:46:20');
/*!40000 ALTER TABLE `question` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `reviewer`
--

DROP TABLE IF EXISTS `reviewer`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `reviewer` (
  `user_seq` int(11) NOT NULL COMMENT 'Auto_Increment',
  `campaign_seq` int(11) NOT NULL COMMENT 'Auto Increment',
  `complete_mission` tinyint(1) NOT NULL,
  `first_register_id` int(11) NOT NULL,
  `first_register_date` datetime NOT NULL,
  `last_register_id` int(11) NOT NULL,
  `last_register_date` datetime NOT NULL,
  PRIMARY KEY (`user_seq`,`campaign_seq`),
  KEY `FK_campaign_TO_reviewer_1` (`campaign_seq`),
  CONSTRAINT `FK_campaign_TO_reviewer_1` FOREIGN KEY (`campaign_seq`) REFERENCES `campaign` (`campaign_seq`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `FK_user_TO_reviewer_1` FOREIGN KEY (`user_seq`) REFERENCES `user` (`user_seq`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
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
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `token` (
  `user_seq` int(11) NOT NULL,
  `id` varchar(20) NOT NULL,
  `accesstoken` text NOT NULL,
  `refreshtoken` text NOT NULL,
  PRIMARY KEY (`user_seq`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `token`
--

LOCK TABLES `token` WRITE;
/*!40000 ALTER TABLE `token` DISABLE KEYS */;
INSERT INTO `token` VALUES (9,'test','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6InRlc3QiLCJzZXEiOjksImlhdCI6MTY1MTE0MTkwNCwiZXhwIjoxNjUxMTQ1NTA0fQ.mzegy72UpupeFMHZAoXLX_-id77tMlHxdeNrYXu7zNM','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE2NTExNDE1NjAsImV4cCI6MTY1MjM1MTE2MH0.b83aoYzn45yUtazKxA6litrNVx-o-fJYfsFhXVbbrGM'),(11,'rhdxoals@naver.com','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6InJoZHhvYWxzQG5hdmVyLmNvbSIsInNlcSI6MTEsImlhdCI6MTY1MTQwNzA2NywiZXhwIjoxNjUxNDEwNjY3fQ.-tjo-v3idwT8nUrEisWlBq5_SiKWLsviG_Y5c4rdHXw','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE2NTE0MDcwNjcsImV4cCI6MTY1MjYxNjY2N30.LvInPrLra3xTgKjojzbKytLZKqTLaWZd4vIqM_zSQmQ'),(25,'rhdxoals@gmail.com','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6InJoZHhvYWxzQGdtYWlsLmNvbSIsInNlcSI6MjUsImlhdCI6MTY1MTY5MTE4NSwiZXhwIjoxNjUxNjk0Nzg1fQ.jfVAThgbU0R1Fzwez98XX9JuS3Dk5sXrRyakpNvkhk4','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE2NTE2OTExODUsImV4cCI6MTY1MjkwMDc4NX0.lsuZwWLPVxEnFg5Pe1kC0o1mT6ZanaeYXHeal1Sdxno'),(26,'ma@ma.com','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6Im1hQG1hLmNvbSIsInNlcSI6MjYsImlhdCI6MTY1MjExNDUyNiwiZXhwIjoxNjUyMTE4MTI2fQ.CdmXH_R5PjONg99Y_VtIk5VJpTu_AL0PC81TRY9UOTg','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE2NTIxMTQ1MjYsImV4cCI6MTY1MzMyNDEyNn0.AlcUZSYbprHGOz4RLy9MjbXaw4-70FZvWtx7itAkCWU'),(27,'laon','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6Imxhb24iLCJzZXEiOjI3LCJpYXQiOjE2NTIxMTQ1MDksImV4cCI6MTY1MjExODEwOX0.uFS3eSeTxvD6MPa2_hAX2NmUJxscA6td-N72lAbCsgI','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE2NTIxMTQ1MDksImV4cCI6MTY1MzMyNDEwOX0.ExvDV1TVQo9bBrjD62L44SvJbPLtvfW4d4GUrE_rtEA'),(29,'2227800800','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjIyMjc4MDA4MDAiLCJzZXEiOjI5LCJpYXQiOjE2NTIwOTIyNzIsImV4cCI6MTY1MjA5NTg3Mn0.0qCynHktC5AVJi3mY7DkO-yn265dkFmnMmenMzoQxVE','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE2NTIwOTIyNzIsImV4cCI6MTY1MzMwMTg3Mn0.BYFufqkVYn-xlErBkCwhKtYu2nUS-Vzsdh7ZVaCYGWI'),(30,'2227800800','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjIyMjc4MDA4MDAiLCJzZXEiOjMwLCJpYXQiOjE2NTIxMTMwMjksImV4cCI6MTY1MjExNjYyOX0.ulDgA2aS9soPZ60HtMZyHk65WpRCmAIghGXfTGiGe04','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE2NTIxMTMwMjksImV4cCI6MTY1MzMyMjYyOX0.ksM3xJVVMH4oKQ9ObBjismL9iLVnBs06qWMNHuUaAXs');
/*!40000 ALTER TABLE `token` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user`
--

DROP TABLE IF EXISTS `user`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `user` (
  `user_seq` int(11) NOT NULL AUTO_INCREMENT COMMENT 'Auto_Increment',
  `id` varchar(20) NOT NULL,
  `password` varchar(60) NOT NULL,
  `name` varchar(100) NOT NULL,
  `nickname` varchar(100) NOT NULL,
  `phonenumber` varchar(11) NOT NULL,
  `gender` char(1) DEFAULT NULL,
  `birth` varchar(8) DEFAULT NULL,
  `email` varchar(100) DEFAULT NULL,
  `is_premium` tinyint(1) NOT NULL DEFAULT 0,
  `is_advertiser` tinyint(1) NOT NULL DEFAULT 0,
  `agreement_info` tinyint(1) NOT NULL DEFAULT 0,
  `agreement_email` tinyint(1) NOT NULL DEFAULT 0,
  `agreement_mms` tinyint(1) NOT NULL DEFAULT 0,
  `blog` varchar(50) DEFAULT NULL,
  `instagram` varchar(50) DEFAULT NULL,
  `influencer` varchar(50) DEFAULT NULL,
  `youtube` varchar(50) DEFAULT NULL,
  `point` int(11) DEFAULT 0,
  `accumulated_point` int(11) DEFAULT 0,
  `profile_name` varchar(45) DEFAULT NULL,
  `profile_path` text DEFAULT NULL,
  `profile_ext` varchar(10) DEFAULT NULL,
  `profile_key` text DEFAULT NULL,
  `is_admin` tinyint(1) DEFAULT 0,
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
) ENGINE=InnoDB AUTO_INCREMENT=32 DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user`
--

LOCK TABLES `user` WRITE;
/*!40000 ALTER TABLE `user` DISABLE KEYS */;
INSERT INTO `user` VALUES (9,'test','$2b$10$Y.7/ZNSjzcWQLuKhRzE9O.eYVt9AmGCq4MhUH4kW7AmImdnTCZS32','호호사장','호호사장님','01012312311','M','990911','asdfasdaf@naver.com',0,0,1,1,1,NULL,NULL,NULL,NULL,0,0,NULL,NULL,NULL,NULL,0,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'2022-04-25 12:19:11','2022-05-04 00:13:54'),(10,'admintest','$2b$10$UOxQwhYNpLlADlM4PstfC.wojyElcvwVqIibLPlQ7MznrLTdqKLo6','관리자범사장','관리자범사장','01022232234',NULL,NULL,'laondiusadmin@naver.com',0,0,1,1,1,NULL,NULL,NULL,NULL,100,0,NULL,NULL,NULL,NULL,1,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'2022-04-25 13:22:51','2022-04-25 13:22:51'),(25,'rhdxoals@gmail.com','$2b$10$mrH2aFqoUl.b5Yq6Dy5LqeCIKVgxU0gVvUddDqP7IgoR5FScciXA2','허웅','원주디비농구선수','01099998888','m','1997','rhdxoals@gmail.com',0,0,1,1,1,'huudk123','insllta122','influ1122','https://yotubue.hud.ecom',0,0,NULL,NULL,NULL,NULL,0,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'2022-05-01 12:45:58','2022-05-01 22:46:45'),(26,'ma@ma.com','$2b$10$ZoF86AXAnmV8MQcjwMOJk.QejWtVOAETLPa69Az.F4k7nXiH9lpmi','류준욜','잘생김을 연기','01099998888','m','19951111','ma@ma.com',1,0,1,1,1,'naverJun','InstaJun','InfluJun','https://youtube.Jun.com',9950,0,'avater.png','https://laondius.s3.ap-northeast-2.amazonaws.com/profileimage/1651782627823avater.png','png','profileimage/1651782627823avater.png',0,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'2022-05-02 07:11:55','2022-05-05 20:33:22'),(27,'laon','$2b$10$ldLOMGDB7yRfwBfcl1X9p.RcntX8Y2p.LtEAn0.JYvNOuhSS.vUL2','라온디어스 관리자','라온디어스 관리자','',NULL,NULL,'',0,1,1,1,1,NULL,NULL,NULL,NULL,0,0,NULL,NULL,NULL,NULL,1,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'2022-05-02 10:24:36','2022-05-02 10:24:36'),(30,'2227800800','$2b$10$bpe1oadcLSt5uMvvkg59gujdbhEg9OJOlaJnNXWhdVcv1qemnk8lC','테스트유저1','테유테유','01000000000','f','1977','laondeasmarketing@naver.com',0,0,0,0,0,'s','d','12','sd',0,0,NULL,NULL,NULL,NULL,0,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'2022-05-09 19:31:36','2022-05-09 14:21:39'),(31,'test123','$2b$10$ZFfdfo9oHAe85gUQEgiP8.YdWiwKJbcposFvX4RT8I3.NSs4kiz9e','범사장','범사장','01011232234',NULL,NULL,'laondius@naver.com',0,0,1,1,1,NULL,NULL,NULL,NULL,0,0,NULL,NULL,NULL,NULL,0,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'2022-05-09 19:39:23','2022-05-09 19:39:23');
/*!40000 ALTER TABLE `user` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user_address_book`
--

DROP TABLE IF EXISTS `user_address_book`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `user_address_book` (
  `address_seq` int(11) NOT NULL AUTO_INCREMENT,
  `user_seq` int(11) NOT NULL COMMENT 'Auto_Increment',
  `name` varchar(10) NOT NULL,
  `receiver` varchar(20) NOT NULL,
  `address` text NOT NULL,
  `phonenumber` varchar(11) NOT NULL,
  `is_default` tinyint(1) NOT NULL,
  `first_register_id` int(11) NOT NULL,
  `first_register_date` datetime NOT NULL,
  `last_register_id` int(11) NOT NULL,
  `last_register_date` datetime NOT NULL,
  PRIMARY KEY (`address_seq`,`user_seq`),
  KEY `FK_user_TO_user_address_book_1` (`user_seq`),
  CONSTRAINT `FK_user_TO_user_address_book_1` FOREIGN KEY (`user_seq`) REFERENCES `user` (`user_seq`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=29 DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user_address_book`
--

LOCK TABLES `user_address_book` WRITE;
/*!40000 ALTER TABLE `user_address_book` DISABLE KEYS */;
INSERT INTO `user_address_book` VALUES (10,25,'나의주소2','홍길동','대구광역시 달서구 1010-2 복달이 202호','01099239922',0,25,'2022-05-01 19:03:46',25,'2022-05-01 19:03:46'),(15,25,'우리집','허훈','서울시 관악구 진천동 아리따움 201호','01099238832',0,25,'2022-05-01 22:45:48',25,'2022-05-01 22:45:48'),(16,26,'내집22','마동석','서울시 마로디 아아노이 200오','01099283382',1,26,'2022-05-02 08:51:07',26,'2022-05-04 16:06:14'),(18,25,'나의주소','범길동','대구 광역시 달서구 1010 복달이 205호','01055265234',1,25,'2022-05-03 19:39:40',25,'2022-05-10 00:21:59'),(24,25,'호호봄','범사장','대구광역시 달서구 신당동','01012344321',0,25,'2022-05-06 22:09:08',25,'2022-05-06 22:09:08'),(25,30,'내집','테윤씨','서울시 마마동 시시두 202호','01078787878',1,30,'2022-05-09 13:57:16',30,'2022-05-09 15:25:28'),(26,30,'회사','회사장','대구시 동대구역 2번출구','01077226633',0,30,'2022-05-09 13:57:37',30,'2022-05-09 14:02:22');
/*!40000 ALTER TABLE `user_address_book` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user_area`
--

DROP TABLE IF EXISTS `user_area`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `user_area` (
  `user_area_code` varchar(10) NOT NULL COMMENT '코드테이블 값 참조',
  `user_seq` int(11) NOT NULL COMMENT 'Auto_Increment',
  `first_register_id` int(11) NOT NULL,
  `first_register_date` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `last_register_id` int(11) NOT NULL,
  `last_register_date` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
  PRIMARY KEY (`user_area_code`,`user_seq`),
  KEY `FK_user_TO_user_area_1` (`user_seq`),
  CONSTRAINT `FK_user_TO_user_area_1` FOREIGN KEY (`user_seq`) REFERENCES `user` (`user_seq`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
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
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `user_channel` (
  `channel_code` varchar(10) NOT NULL COMMENT '코드테이블 값 참조',
  `user_seq` int(11) NOT NULL COMMENT 'Auto_Increment',
  `first_register_id` int(11) NOT NULL,
  `first_register_date` datetime NOT NULL,
  `last_register_id` int(11) NOT NULL,
  `last_register_date` datetime NOT NULL,
  PRIMARY KEY (`channel_code`,`user_seq`),
  KEY `FK_user_TO_user_channel_1` (`user_seq`),
  CONSTRAINT `FK_user_TO_user_channel_1` FOREIGN KEY (`user_seq`) REFERENCES `user` (`user_seq`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
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
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `user_file` (
  `user_seq` int(11) NOT NULL,
  `name` varchar(255) DEFAULT NULL,
  `path` text DEFAULT NULL,
  `extension` varchar(10) DEFAULT NULL,
  `first_register_id` int(11) DEFAULT NULL,
  `first_register_date` datetime DEFAULT NULL,
  `last_register_id` int(11) DEFAULT NULL,
  `last_register_date` datetime DEFAULT NULL,
  PRIMARY KEY (`user_seq`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user_file`
--

LOCK TABLES `user_file` WRITE;
/*!40000 ALTER TABLE `user_file` DISABLE KEYS */;
INSERT INTO `user_file` VALUES (9,'map.png','https://laondius.s3.ap-northeast-2.amazonaws.com/profileimage/1651249546719map.png','png',9,'2022-04-30 01:24:34',9,'2022-04-30 01:25:47');
/*!40000 ALTER TABLE `user_file` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user_interest`
--

DROP TABLE IF EXISTS `user_interest`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `user_interest` (
  `user_seq` int(11) NOT NULL AUTO_INCREMENT COMMENT 'Auto_Increment',
  `user_interest_code` varchar(10) NOT NULL,
  `first_register_id` int(11) NOT NULL,
  `first_register_date` datetime NOT NULL,
  `last_register_id` int(11) NOT NULL,
  `last_register_date` datetime NOT NULL,
  PRIMARY KEY (`user_seq`,`user_interest_code`),
  CONSTRAINT `FK_user_TO_user_interest_1` FOREIGN KEY (`user_seq`) REFERENCES `user` (`user_seq`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
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
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `withdrawal_detail` (
  `withdrawal_seq` int(11) NOT NULL AUTO_INCREMENT,
  `user_seq` int(11) NOT NULL COMMENT 'Auto_Increment',
  `withdrawal_amount` int(11) NOT NULL,
  `withdrawal_date` date NOT NULL,
  `first_register_id` int(11) NOT NULL,
  `first_register_date` datetime NOT NULL,
  `last_register_id` int(11) NOT NULL,
  `last_register_date` datetime NOT NULL,
  PRIMARY KEY (`withdrawal_seq`),
  KEY `FK_user_TO_withdrawal_detail_1` (`user_seq`),
  CONSTRAINT `FK_user_TO_withdrawal_detail_1` FOREIGN KEY (`user_seq`) REFERENCES `user` (`user_seq`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `withdrawal_detail`
--

LOCK TABLES `withdrawal_detail` WRITE;
/*!40000 ALTER TABLE `withdrawal_detail` DISABLE KEYS */;
INSERT INTO `withdrawal_detail` VALUES (3,9,10000,'2022-04-28',10,'2022-04-28 20:23:18',10,'2022-04-28 20:23:18'),(4,9,10000,'2022-04-28',10,'2022-04-28 21:01:28',10,'2022-04-28 21:01:28'),(5,26,300,'2022-05-03',99,'2022-05-03 00:16:54',99,'2022-05-03 00:16:54'),(6,26,310,'2022-05-03',99,'2022-05-03 00:21:48',99,'2022-05-03 00:21:48'),(7,26,310,'2022-05-03',99,'2022-05-03 00:23:49',99,'2022-05-03 00:23:49'),(8,26,310,'2022-05-03',99,'2022-05-03 00:23:49',99,'2022-05-03 00:23:49'),(9,26,310,'2022-05-05',99,'2022-05-05 06:45:00',99,'2022-05-05 06:45:00'),(10,26,310,'2022-05-05',99,'2022-05-05 06:47:34',99,'2022-05-05 06:47:34');
/*!40000 ALTER TABLE `withdrawal_detail` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `withdrawal_request`
--

DROP TABLE IF EXISTS `withdrawal_request`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `withdrawal_request` (
  `request_seq` int(11) NOT NULL AUTO_INCREMENT,
  `user_seq` int(11) DEFAULT NULL,
  `withdrawal_point` int(11) DEFAULT NULL,
  `is_pending` tinyint(1) DEFAULT NULL,
  `first_register_id` int(11) DEFAULT NULL,
  `first_register_date` datetime DEFAULT NULL,
  `last_register_id` int(11) DEFAULT NULL,
  `last_register_date` datetime DEFAULT NULL,
  PRIMARY KEY (`request_seq`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `withdrawal_request`
--

LOCK TABLES `withdrawal_request` WRITE;
/*!40000 ALTER TABLE `withdrawal_request` DISABLE KEYS */;
INSERT INTO `withdrawal_request` VALUES (1,9,10000,NULL,9,'2022-04-28 20:17:21',9,'2022-04-28 20:17:21'),(2,9,10000,NULL,9,'2022-04-28 21:01:24',9,'2022-04-28 21:01:24'),(3,26,200,NULL,26,'2022-05-03 00:18:36',26,'2022-05-03 00:18:36'),(4,26,900,NULL,26,'2022-05-03 00:20:51',26,'2022-05-03 00:20:51'),(5,26,900,NULL,26,'2022-05-03 00:21:25',26,'2022-05-03 00:21:25'),(6,26,900,NULL,26,'2022-05-03 00:21:54',26,'2022-05-03 00:21:54'),(7,26,8800,NULL,26,'2022-05-03 00:23:05',26,'2022-05-03 00:23:05');
/*!40000 ALTER TABLE `withdrawal_request` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2022-05-11  5:48:39
