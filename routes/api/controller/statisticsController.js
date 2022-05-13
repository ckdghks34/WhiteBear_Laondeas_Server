import pool from "./../../../config/dbpool.js";
import path from "path";
import fs from "fs";
import mime from "mime";
import axios from "axios";
import convert from "xml-js";

const dbpool = await pool;

// 통계
async function getStatistics(req, res, next) {
  const { campaign_seq } = req.query;
  /**
   * 1. 캠페인별 신청자 목록 가져오기
   * 2. 신청자 정보 가져오기
   * 3. 신청자 목록 정보로 데이터 파싱(남여 수 + 평균 / 지역 분포 수 + 평균)
   * 4. 신청자 블로그 조회수 데이터 파싱(최근 5일 방문자 + 평균)
   * 5. xlsx 파일 작성 및 저장 + 반환
   */
  if (campaign_seq === undefined) {
    res.status(400).json({
      message: "통계 가져오기 실패, 필수 데이터가 없습니다.",
    });
    return;
  } else {
    try {
      const applicant_sql = `select f.*, u.id, u.name, u.nickname, u.phonenumber, u.gender, u.birth, u.email, u.is_premium, u.agreement_info, u.agreement_email, u.agreement_mms, u.blog, u.instagram, u.influencer, u.youtube, u.tops_size, u.bottoms_size, u.shoe_size, u.height, u.skin_type, u.marital_status, u.having_child, u.job, u.companion_animal
  from (select ca.campaign_seq,ca.user_seq, ca.select_reward, ca.address,ca.receiver,ca.receiver_phonenumber, ca.camera_code,joint_blog,ca.status, ca.other_answers
  from campaign_application as ca join campaign as c on ca.campaign_seq = c.campaign_seq
  where ca.campaign_seq = ?) as f join user as u on f.user_seq = u.user_seq`;

      const applicant_results = await dbpool.query(applicant_sql, [campaign_seq]);
      if (applicant_results[0].length === 0) {
        return res.status(200).json({
          message: "신청자가 없어 산출할 통계가 없습니다.",
        });
      }
      let statistics = {};
      statistics["applicant"] = applicant_results[0];

      for (let i = 0; i < applicant_results[0].length; i++) {
        // const blog = applicant_results[0][i].blog;
        const blog = "jungsims";
        await axios
          .get(`https://blog.naver.com/NVisitorgp4Ajax.nhn?blogId=${blog}`)
          .then(function (res, err) {
            // 반환값이 XML
            // console.log(res.data);
            /*
             <?xml version="1.0" encoding="UTF-8"?>
                <!-- copyright(c) 2007 All rights reserved by NHN -->
                <!-- blog visitor count -->
                <visitorcnts>
                      <visitorcnt id="20220508" cnt="105" />
                      <visitorcnt id="20220509" cnt="92" />
                      <visitorcnt id="20220510" cnt="88" />
                      <visitorcnt id="20220511" cnt="118" />
                      <visitorcnt id="20220512" cnt="84" />
                </visitorcnts>
            */
            const xml = res.data;
            const json = JSON.parse(convert.xml2json(xml, { compact: true, spaces: 4 }));

            let visitor = {};
            let visitor_cnt = 0;
            let visitbyday = [];
            for (let i = 0; i < json.visitorcnts.visitorcnt.length; i++) {
              visitor_cnt += parseInt(json.visitorcnts.visitorcnt[i]._attributes.cnt);

              const dateString = json.visitorcnts.visitorcnt[i]._attributes.id;

              const year = +dateString.substring(0, 4);
              const month = +dateString.substring(4, 6);
              const day = +dateString.substring(6, 8);

              const date = new Date(year, month - 1, day).toISOString().split("T")[0];

              visitbyday.push({
                date,
                visitor_numbers: json.visitorcnts.visitorcnt[i]._attributes.cnt,
              });
            }

            visitor["average"] = visitor_cnt / json.visitorcnts.visitorcnt.length;
            visitor["visitbyday"] = visitbyday;

            // console.log(visitor);
            // {
            //   average: 104.2,
            //   visitbyday: [
            //     { date: '2022-05-07', visitor_numbers: '105' },
            //     { date: '2022-05-08', visitor_numbers: '92' },
            //     { date: '2022-05-09', visitor_numbers: '88' },
            //     { date: '2022-05-10', visitor_numbers: '118' },
            //     { date: '2022-05-11', visitor_numbers: '118' }
            //   ]
            // }
            statistics["blog"] = visitor;
          });
      }

      // 남녀 비율
      const gender_sql = `select 
                            t1.code_name as '성별',
                            nvl(t2.cnt,0) as '수',
                            nvl(t2.rate,0) as '비율'
                          from 
                              (select *
                                from code_table
                                where top_level_code = 'GENDER') t1
                            left outer join 
                              (select 
                                if(c.gender is null, 'N',c.gender) as gender,
                                count(*) as cnt,
                                count(*) / (select count(*) from campaign_application where campaign_seq = ?) * 100 as rate
                              from campaign a , campaign_application b, user c
                                where a.campaign_seq = b.campaign_seq
                                and b.user_seq = c.user_seq
                                and a.campaign_seq = ?
                              group by c.gender) t2 on t1.code_value = t2.gender
                          ORDER BY t1.code_step
                        `;

      const gender_result = await dbpool.query(gender_sql, [campaign_seq, campaign_seq]);

      const statisticsByGender = gender_result[0];

      statistics["gender"] = statisticsByGender;

      res.status(200).json({
        message: "통계 가져오기 성공",
        statistics,
      });
    } catch (err) {
      console.log(err);

      res.status(500).json({
        message: "통계 가져오기 실패",
      });
    }
  }
}

export { getStatistics };
