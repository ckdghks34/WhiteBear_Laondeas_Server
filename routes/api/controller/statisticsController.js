import pool from "./../../../config/dbpool.js";
import path from "path";
import fs from "fs";
import mime from "mime";
import axios from "axios";
import convert from "xml-js";
import xlsx_style from "xlsx-js-style";

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
      console.error(err);

      res.status(500).json({
        message: "통계 가져오기 실패",
      });
    }
  }
}

// Download Statistics
async function downloadStatistics(req, res, next) {
  const __dirname = path.resolve();
  const workbook = xlsx_style.utils.book_new();

  const { campaign_seq } = req.query;

  if (campaign_seq === undefined) {
    res.status(400).json({
      message: "Not exist campaign_seq",
    });
  } else {
    // 캠페인 신청자 쿼리
    const sql = `select u.name as "이름", ifnull(u.phonenumber,"정보없음") as "전화번호", ifnull(u.email,"정보없음") as "이메일", ifnull(u.blog,"정보없음") as "블로그", ifnull(u.instagram,"정보없음") as "Instagram", ifnull(u.nickname,"정보없음") as "닉네임",
    case
      when gender = 'M'
        then '남자'
      when gender = 'F'
        then '여자'
      when gender is null
        then '정보없음'
      end as '성별', 
    ifnull(u.birth,"정보없음") as "연령",
    case 
      when grade = 1
        then 'Beginner'
      when grade = 2
        then 'Junior'
      when grade = 3
        then 'Senior'
      when grade = 4
        then 'Master'
    end  as "체험단원 등급", 
    ifnull(u.address,"정보없음") as "지역"
    from campaign_application as ca join (select us.*, address from user as us join user_address_book as uab on us.user_seq = uab.user_seq where uab.is_default = 1) as u on ca.user_seq = u.user_seq
    where ca.campaign_seq = ?;`;

    // 캠페인 정보 쿼리
    const campaign_sql = `select campaign_seq as '캠페인 번호', title as '캠페인 제목', category as '카테고리', product, channel as '채널', keyword as '키워드', headcount as '모집인원', misson as '미션'
                          from campaign
                          where campaign_seq = ?;`;

    // 캠페인 신청자 남녀 성비 쿼리
    const applicant_gender_sql = `select if(c.gender='M','남자' , if(c.gender='F','여자','정보없음')) as 성별, count(*) as 수, count(*) / (select count(*) from campaign_application where campaign_seq=?) * 100 as 비율
                                  from campaign a , campaign_application b, user c
                                  where a.campaign_seq = b.campaign_seq
                                  and b.user_seq = c.user_seq
                                  and a.campaign_seq=?
                                  group by c.gender;`;
    try {
      const campaign_result = await dbpool.query(campaign_sql, [campaign_seq]);
      const campaign = campaign_result[0][0];

      const applicant_results = await dbpool.query(sql, [campaign_seq]);
      const applicant = applicant_results[0];
      const applicantData = [];

      const applicant_gender_result = await dbpool.query(applicant_gender_sql, [
        campaign_seq,
        campaign_seq,
      ]);
      const applicant_gender = applicant_gender_result[0];

      let wsMaxCol = [{ width: 10 }];

      // 통계 신청자 데이터 파싱
      for (let i = 0; i < applicant.length; i++) {
        let data = { 번호: i + 1, ...applicant_results[0][i] };

        data["연령"] = new Date().getFullYear() - data["연령"];

        try {
          const visitor = await getBlogVistor(data["블로그"]);

          data["블로그 평균 방문자수"] = visitor.average;
          if (data["블로그 평균 방문자수"] === 0) {
            data["블로그 평균 방문자수"] = "정보없음";
          }
        } catch (err) {
          console.error("Blog Analytics Error");
          console.error(err);

          data["블로그 평균 방문자수"] = "정보없음";
        } finally {
          applicantData.push(data);
        }
      }

      // "▣ 캠페인 정보" 추가
      const worksheet = xlsx_style.utils.aoa_to_sheet(
        [
          [
            {
              v: "▣ 캠페인 정보",
              t: "s",
              s: {
                font: {
                  name: "맑은 고딕",
                  sz: 24,
                  bold: true,
                },
              },
            },
          ],
        ],
        {
          origin: "B3",
        }
      );

      // 캠페인 정보 Header style 설정
      let campaign_keys = [];
      for (let i = 0; i < Object.keys(campaign).length; i++) {
        campaign_keys.push({
          v: Object.keys(campaign)[i],
          t: "s",
          s: {
            fill: { fgColor: { rgb: "ffe2ae" } },
            font: { name: "맑은 고딕", sz: 14, color: { rgb: "6D6D6D" }, bold: true },
            border: {
              top: { style: "thin" },
              bottom: { style: "thin" },
              left: { style: "thin" },
              right: { style: "thin" },
            },
          },
        });
      }

      // 캠페인 정보 Header 추가
      xlsx_style.utils.sheet_add_aoa(worksheet, [campaign_keys], { origin: "B4" });

      // 캠페인 정보 데이터 추가
      xlsx_style.utils.sheet_add_json(worksheet, [campaign], {
        header: Object.keys(campaign),
        skipHeader: true,
        origin: "B5",
      });

      // "▣ 캠페인 신청자 목록" 추가
      xlsx_style.utils.sheet_add_aoa(
        worksheet,
        [
          [
            {
              v: "▣ 캠페인 신청자 목록",
              t: "s",
              s: {
                font: {
                  name: "맑은 고딕",
                  sz: 24,
                  bold: true,
                },
              },
            },
          ],
        ],
        {
          origin: "B8",
        }
      );

      // 신청자 목록 Header style 설정
      let applicant_keys = [];

      // 신청자 목록 Header 추가
      applicant_keys.push({
        v: "번호",
        t: "s",
        s: {
          fill: { fgColor: { rgb: "ffe2ae" } },
          font: { name: "맑은 고딕", sz: 14, color: { rgb: "6D6D6D" }, bold: true },
          border: {
            top: { style: "thin" },
            bottom: { style: "thin" },
            left: { style: "thin" },
            right: { style: "thin" },
          },
        },
      });

      wsMaxCol.push({
        // "번호".length == 2
        width: 2 * 2.5 > 10 ? 2 * 2.5 : 10,
      });

      for (let i = 0; i < applicant_results[1].length; i++) {
        applicant_keys.push({
          v: applicant_results[1][i].name,
          t: "s",
          s: {
            fill: { fgColor: { rgb: "ffe2ae" } },
            font: { name: "맑은 고딕", sz: 14, color: { rgb: "6D6D6D" }, bold: true },
            border: {
              top: { style: "thin" },
              bottom: { style: "thin" },
              left: { style: "thin" },
              right: { style: "thin" },
            },
          },
        });

        // 최대 Cell 너비 설정(Key 기준 Initialize)
        wsMaxCol.push({
          width: applicant_results[1][i].name * 2.5 > 10 ? applicant_results[1][i].name * 2.5 : 10,
        });
      }

      // 신청자 목록 Header 추가
      applicant_keys.push({
        v: "블로그 이용 평균 방문자수",
        t: "s",
        s: {
          fill: { fgColor: { rgb: "ffe2ae" } },
          font: { name: "맑은 고딕", sz: 14, color: { rgb: "6D6D6D" }, bold: true },
          border: {
            top: { style: "thin" },
            bottom: { style: "thin" },
            left: { style: "thin" },
            right: { style: "thin" },
          },
        },
      });

      wsMaxCol.push({ width: "블로그 이용 평균 방문자수".length * 2.5 });
      // for (let i = 0; i < Object.keys(applicantData[0]).length; i++) {
      // applicant_keys.push({
      //   v: Object.keys(applicantData[0])[i],
      //   t: "s",
      //   s: {
      //     fill: { fgColor: { rgb: "ffe2ae" } },
      //     font: { name: "맑은 고딕", sz: 14, color: { rgb: "6D6D6D" }, bold: true },
      //     border: {
      //       top: { style: "thin" },
      //       bottom: { style: "thin" },
      //       left: { style: "thin" },
      //       right: { style: "thin" },
      //     },
      //   },
      // });

      // // 최대 Cell 너비 설정(Key 기준 Initialize)
      // wsMaxCol.push({
      //   width:
      //     Object.keys(applicantData[0])[i].length * 2.5 > 10
      //       ? Object.keys(applicantData[0])[i].length * 2.5
      //       : 10,
      // });
      // }

      // 최대 Cell 너비 구하기 (기준 : 신청자목록 데이터)
      for (let i = 0; i < applicantData.length; ++i) {
        let value = Object.values(applicantData[i]);
        for (let k = 0; k < value.length; ++k) {
          if (value[k] !== null) {
            wsMaxCol[k + 1].width =
              value[k].length * 2.5 > wsMaxCol[k + 1].width
                ? value[k].length * 2.5
                : wsMaxCol[k + 1].width;
          }
        }
      }

      // 신청자 목록 헤더 추가
      xlsx_style.utils.sheet_add_aoa(worksheet, [applicant_keys], { origin: "B9" });

      // 신청자 목록 데이터 추가
      if (applicantData.length > 0) {
        xlsx_style.utils.sheet_add_json(worksheet, applicantData, {
          header: Object.keys(applicantData[0]),
          skipHeader: true,
          origin: "B10",
        });
      }
      // "▣ 신청자 남여 비율" 추가
      xlsx_style.utils.sheet_add_aoa(
        worksheet,
        [
          [],
          [],
          [
            {
              v: "▣ 신청자 남여 비율",
              t: "s",
              s: {
                font: {
                  name: "맑은 고딕",
                  sz: 24,
                  bold: true,
                },
              },
            },
          ],
        ],
        {
          origin: { c: 1, r: -1 },
        }
      );

      // 남여 성비 정보 Header style 설정
      let applicant_gender_keys = [];

      for (let i = 0; i < applicant_gender_result[1].length; i++) {
        applicant_gender_keys.push({
          v: applicant_gender_result[1][i].name,
          t: "s",
          s: {
            fill: { fgColor: { rgb: "ffe2ae" } },
            font: { name: "맑은 고딕", sz: 14, color: { rgb: "6D6D6D" }, bold: true },
            border: {
              top: { style: "thin" },
              bottom: { style: "thin" },
              left: { style: "thin" },
              right: { style: "thin" },
            },
          },
        });
      }

      // for (let i = 0; i < Object.keys(applicant_gender[0]).length; i++) {
      //   applicant_gender_keys.push({
      //     v: Object.keys(applicant_gender[0])[i],
      //     t: "s",
      //     s: {
      //       fill: { fgColor: { rgb: "ffe2ae" } },
      //       font: { name: "맑은 고딕", sz: 14, color: { rgb: "6D6D6D" }, bold: true },
      //       border: {
      //         top: { style: "thin" },
      //         bottom: { style: "thin" },
      //         left: { style: "thin" },
      //         right: { style: "thin" },
      //       },
      //     },
      //   });
      // }

      // 남여 성비 정보  Header 추가
      xlsx_style.utils.sheet_add_aoa(worksheet, [applicant_gender_keys], {
        origin: { c: 1, r: -1 },
      });

      // 남여 성비 데이터 추가
      if (applicant_gender.length > 0) {
        xlsx_style.utils.sheet_add_json(worksheet, applicant_gender, {
          header: Object.keys(applicant_gender[0]),
          skipHeader: true,
          origin: { c: 1, r: -1 },
        });
      }
      // Cell 최대 너비 설정
      worksheet["!cols"] = wsMaxCol;

      // 워크시트 excel 추가
      xlsx_style.utils.book_append_sheet(workbook, worksheet, "캠페인 신청자 목록");

      // excel 파일 저장
      const file_path = path.join(
        __dirname,
        "/public",
        "/",
        Date.now().toString() + campaign_seq + "applicant_statistics.xlsx"
      );
      xlsx_style.writeFile(workbook, file_path);

      const file = file_path;
      const filename = path.basename(file);
      const mimetype = mime.getType(file);
      res.setHeader("Content-disposition", "attachment; filename=" + filename);
      res.setHeader("Content-type", mimetype);
      const filestream = fs.createReadStream(file);

      filestream.pipe(res);
      filestream.on("end", (err) => {
        if (err) {
          console.error(err);
        }

        fs.unlink(file, (err) => {
          if (err) console.error(err);
          console.error("file deleted");
        });
      });
    } catch (err) {
      console.error("query error");
      console.error(err);

      return res.status(500).json({
        message: "Internal Server Error",
      });
    }
  }
}

// xlsx test
async function getTest(req, res, next) {
  // const workbook = xlsx.utils.book_new();
  // const length = Object.keys(jsonData[0]).length;
  // const jsondata_keys = { s: { c: 0, r: 2 }, e: { c: length, r: 2 } };

  // console.log(jsonData);
  // let rows = [];
  // for (let i = 0; i < length; i++) {
  //   rows.push({
  //     v: Object.keys(jsonData[0])[i],
  //     t: "s",
  //     s: { fill: { bgColor: { rgb: "E9E9E9" } }, font: { name: "Courier", sz: 24 } },
  //   });
  // }
  // console.log(xlsx.utils.encode_range(jsondata_keys));
  // console.log(rows);
  // const worksheet = xlsx.utils.aoa_to_sheet([rows]);
  // worksheet[xlsx.utils.encode_range(jsondata_keys)].s = {
  //   font: { name: "Courier", sz: 24 },
  //   alignment: { horizontal: "center", vertical: "center" },
  //   fill: { bgColor: { rgb: "E9E9E9" } },
  // };
  // // const worksheet = xlsx.utils.json_to_sheet(jsonData, { origin: 2 });

  // // console.log(xlsx.utils.encode_cell({ c: 1, r: 1 }));
  // xlsx.utils.sheet_add_aoa(worksheet, [[], ["", 1], ["second", 2]], { origin: -1 });

  // xlsx.utils.sheet_add_json(worksheet, jsonData2, { origin: -1 });
  // // console.log(worksheet["!rows"]);
  // // set workseet sheet to "wide"
  // // worksheet["!margins"] = {
  // //   left: 1.0,
  // //   right: 1.0,
  // //   top: 1.0,
  // //   bottom: 1.0,
  // //   header: 0.5,
  // //   footer: 0.5,
  // // };

  // // const worksheet = xlsx.utils.aoa_to_sheet(jsonData);
  // xlsx.utils.book_append_sheet(workbook, worksheet, "sheet1");
  const __dirname = path.resolve();
  const workbook = xlsx_style.utils.book_new();

  const { campaign_seq } = req.query;

  if (campaign_seq === undefined) {
    res.status(400).json({
      message: "Not exist campaign_seq",
    });
  } else {
    const sql = `select u.name as "이름", ifnull(u.phonenumber,"정보없음") as "전화번호", ifnull(u.email,"정보없음") as "이메일", ifnull(u.blog,"정보없음") as "블로그", ifnull(u.instagram,"정보없음") as "Instagram", ifnull(u.nickname,"정보없음") as "닉네임",
    case
      when gender = 'M'
        then '남자'
      when gender = 'F'
        then '여자'
      when gender is null
        then '정보없음'
      end as '성별', 
    ifnull(u.birth,"정보없음") as "연령",
    case 
      when grade = 1
        then 'Beginner'
      when grade = 2
        then 'Junior'
      when grade = 3
        then 'Senior'
      when grade = 4
        then 'Master'
    end  as "체험단원 등급", 
    ifnull(u.address,"정보없음") as "지역"
    from campaign_application as ca join (select us.*, address from user as us join user_address_book as uab on us.user_seq = uab.user_seq where uab.is_default = 1) as u on ca.user_seq = u.user_seq
    where ca.campaign_seq = ?;`;

    const campaign_sql = `select campaign_seq as '캠페인 번호', title as '캠페인 제목', category as '카테고리', product, channel as '채널', keyword as '키워드', headcount as '모집인원', misson as '미션'
                          from campaign
                          where campaign_seq = ?;`;

    const applicant_gender_sql = `select if(c.gender='M','남자' , if(c.gender='F','여자','정보없음')) as 성별, count(*) as 수, count(*) / (select count(*) from campaign_application where campaign_seq=?) * 100 as 비율
                                  from campaign a , campaign_application b, user c
                                  where a.campaign_seq = b.campaign_seq
                                  and b.user_seq = c.user_seq
                                  and a.campaign_seq=?
                                  group by c.gender;`;
    try {
      const campaign_result = await dbpool.query(campaign_sql, [campaign_seq]);
      const campaign = campaign_result[0][0];

      const applicant_results = await dbpool.query(sql, [campaign_seq]);
      const applicant = applicant_results[0];
      const applicantData = [];

      const applicant_gender_result = await dbpool.query(applicant_gender_sql, [
        campaign_seq,
        campaign_seq,
      ]);
      const applicant_gender = applicant_gender_result[0];

      let wsMaxCol = [{ width: 10 }];

      // 통계 신청자 데이터 파싱
      for (let i = 0; i < applicant.length; i++) {
        let data = { 번호: i + 1, ...applicant_results[0][i] };

        data["연령"] = new Date().getFullYear() - data["연령"];

        try {
          const visitor = await getBlogVistor(data["블로그"]);

          data["블로그 평균 방문자수"] = visitor.average;
          if (data["블로그 평균 방문자수"] === 0) {
            data["블로그 평균 방문자수"] = "정보없음";
          }
        } catch (err) {
          console.error("Blog Analytics Error");
          console.error(err);

          data["블로그 평균 방문자수"] = "정보없음";
        } finally {
          applicantData.push(data);
        }
      }

      // "▣ 캠페인 정보" 추가
      const worksheet = xlsx_style.utils.aoa_to_sheet(
        [
          [
            {
              v: "▣ 캠페인 정보",
              t: "s",
              s: {
                font: {
                  name: "맑은 고딕",
                  sz: 24,
                  bold: true,
                },
              },
            },
          ],
        ],
        {
          origin: "B3",
        }
      );

      // 캠페인 정보 Header style 설정
      let campaign_keys = [];
      for (let i = 0; i < Object.keys(campaign).length; i++) {
        campaign_keys.push({
          v: Object.keys(campaign)[i],
          t: "s",
          s: {
            fill: { fgColor: { rgb: "ffe2ae" } },
            font: { name: "맑은 고딕", sz: 14, color: { rgb: "6D6D6D" }, bold: true },
            border: {
              top: { style: "thin" },
              bottom: { style: "thin" },
              left: { style: "thin" },
              right: { style: "thin" },
            },
          },
        });
      }

      // 캠페인 정보 Header 추가
      xlsx_style.utils.sheet_add_aoa(worksheet, [campaign_keys], { origin: "B4" });

      // 캠페인 정보 데이터 추가
      xlsx_style.utils.sheet_add_json(worksheet, [campaign], {
        header: Object.keys(campaign),
        skipHeader: true,
        origin: "B5",
      });

      // "▣ 캠페인 신청자 목록" 추가
      xlsx_style.utils.sheet_add_aoa(
        worksheet,
        [
          [
            {
              v: "▣ 캠페인 신청자 목록",
              t: "s",
              s: {
                font: {
                  name: "맑은 고딕",
                  sz: 24,
                  bold: true,
                },
              },
            },
          ],
        ],
        {
          origin: "B8",
        }
      );

      // 신청자 목록 Header style 설정
      let applicant_keys = [];
      for (let i = 0; i < Object.keys(applicantData[0]).length; i++) {
        applicant_keys.push({
          v: Object.keys(applicantData[0])[i],
          t: "s",
          s: {
            fill: { fgColor: { rgb: "ffe2ae" } },
            font: { name: "맑은 고딕", sz: 14, color: { rgb: "6D6D6D" }, bold: true },
            border: {
              top: { style: "thin" },
              bottom: { style: "thin" },
              left: { style: "thin" },
              right: { style: "thin" },
            },
          },
        });

        // 최대 Cell 너비 설정(Key 기준 Initialize)
        wsMaxCol.push({
          width:
            Object.keys(applicantData[0])[i].length * 2.5 > 10
              ? Object.keys(applicantData[0])[i].length * 2.5
              : 10,
        });
      }

      // 최대 Cell 너비 구하기 (기준 : 신청자목록 데이터)
      for (let i = 0; i < applicantData.length; ++i) {
        let value = Object.values(applicantData[i]);

        for (let k = 0; k < value.length; ++k) {
          wsMaxCol[k + 1].width =
            value[k].length * 2.5 > wsMaxCol[k + 1].width
              ? value[k].length * 2.5
              : wsMaxCol[k + 1].width;
        }
      }

      // 신청자 목록 헤더 추가
      xlsx_style.utils.sheet_add_aoa(worksheet, [applicant_keys], { origin: "B9" });

      // 신청자 목록 데이터 추가
      xlsx_style.utils.sheet_add_json(worksheet, applicantData, {
        header: Object.keys(applicantData[0]),
        skipHeader: true,
        origin: "B10",
      });

      // "▣ 신청자 남여 비율" 추가
      xlsx_style.utils.sheet_add_aoa(
        worksheet,
        [
          [],
          [],
          [
            {
              v: "▣ 신청자 남여 비율",
              t: "s",
              s: {
                font: {
                  name: "맑은 고딕",
                  sz: 24,
                  bold: true,
                },
              },
            },
          ],
        ],
        {
          origin: { c: 1, r: -1 },
        }
      );

      // 남여 성비 정보 Header style 설정
      let applicant_gender_keys = [];
      for (let i = 0; i < Object.keys(applicant_gender[0]).length; i++) {
        applicant_gender_keys.push({
          v: Object.keys(applicant_gender[0])[i],
          t: "s",
          s: {
            fill: { fgColor: { rgb: "ffe2ae" } },
            font: { name: "맑은 고딕", sz: 14, color: { rgb: "6D6D6D" }, bold: true },
            border: {
              top: { style: "thin" },
              bottom: { style: "thin" },
              left: { style: "thin" },
              right: { style: "thin" },
            },
          },
        });
      }

      // 남여 성비 정보  Header 추가
      xlsx_style.utils.sheet_add_aoa(worksheet, [applicant_gender_keys], {
        origin: { c: 1, r: -1 },
      });

      // 남여 성비 데이터 추가
      xlsx_style.utils.sheet_add_json(worksheet, applicant_gender, {
        header: Object.keys(applicant_gender[0]),
        skipHeader: true,
        origin: { c: 1, r: -1 },
      });

      // Cell 최대 너비 설정
      worksheet["!cols"] = wsMaxCol;

      // 워크시트 excel 추가
      xlsx_style.utils.book_append_sheet(workbook, worksheet, "캠페인 신청자 목록");

      // excel 파일 저장
      const file_path = path.join(
        __dirname,
        "/public",
        "/",
        Date.now().toString() + campaign_seq + "applicant_statistics.xlsx"
      );
      xlsx_style.writeFile(workbook, file_path);

      const file = file_path;
      const filename = path.basename(file);
      const mimetype = mime.getType(file);
      res.setHeader("Content-disposition", "attachment; filename=" + filename);
      res.setHeader("Content-type", mimetype);
      const filestream = fs.createReadStream(file);

      filestream.pipe(res);
      filestream.on("end", (err) => {
        if (err) {
          console.error(err);
        }

        fs.unlink(file, (err) => {
          if (err) console.error(err);
          console.error("file deleted");
        });
      });
    } catch (err) {
      console.error("query error");
      console.error(err);

      return res.status(500).json({
        message: "Internal Server Error",
      });
    }
  }
}

async function getBlogVistor(blog) {
  try {
    const blogvistor = await axios
      .get(`https://blog.naver.com/NVisitorgp4Ajax.nhn?blogId=${blog}`)
      .then(function (res) {
        // 반환값이 XML
        // console.log("res.data :");
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
        // console.log(visitor);
        return visitor;
      });

    return blogvistor;
  } catch (err) {
    console.error(blog, " blog Access error, code = ", err.response.status);

    return { average: 0, visitbyday: [] };
  }
}
export { getStatistics, downloadStatistics, getTest };
