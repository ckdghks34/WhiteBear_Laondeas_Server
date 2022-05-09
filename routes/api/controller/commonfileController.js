import pool from "./../../../config/dbpool.js";

const dbpool = await pool;

// 배너 등록
async function createBanner(req, res, next) {
  const banner_img = req.files;

  try {
    const sql = `insert into commonfile (category, name, path, extension, filekey, is_active) values ("banner", ?, ?, ?, ?, ?)`;

    for (let i = 0; i < banner_img.length; i++) {
      const filename = "banner_" + banner_img[i].originalname;
      const filepath = banner_img[i].location;
      const ext = banner_img[i].mimetype.split("/")[1];
      const filekey = banner_img[i].filename + "." + ext;

      await dbpool.execute(sql, [filename, filepath, ext, filekey, 1]);
    }

    res.status(200).json({
      message: "배너 등록 성공",
    });
  } catch (err) {
    console.log(err);

    res.status(500).json({
      message: "배너 등록 실패",
    });
  }
}

// 배너 활성화
async function activateBanner(req, res, next) {
  const { file_seq } = req.body;

  if (file_seq === undefined) {
    res.status(401).json({
      message: "배너 활성화 실패, 필수 항목이 없습니다.",
    });
  } else {
    try {
      const sql = `update commonfile set is_active = 1 where file_seq = ?`;

      await dbpool.execute(sql, [file_seq]);

      res.status(200).json({
        message: "배너 활성화 성공",
      });
    } catch (err) {
      console.log(err);

      res.status(500).json({
        message: "배너 활성화 실패",
      });
    }
  }
}

// 배너 비활성화
async function deactivateBanner(req, res, next) {
  const { file_seq } = req.body;

  if (file_seq === undefined) {
    res.status(401).json({
      message: "배너 비활성화 실패, 필수 항목이 없습니다.",
    });
  } else {
    try {
      const sql = `update commonfile set is_active = 0 where file_seq = ?`;

      await dbpool.execute(sql, [file_seq]);

      res.status(200).json({
        message: "배너 비활성화 성공",
      });
    } catch (err) {
      console.log(err);

      res.status(500).json({
        message: "배너 비활성화 실패",
      });
    }
  }
}

// 배너 가져오기
async function getBanner(req, res, next) {
  try {
    const sql = `select * from commonfile where category = "banner" and is_active = 1`;

    const results = await dbpool.query(sql);

    res.status(200).json({
      message: "배너 가져오기 성공",
      data: results[0],
    });
  } catch (err) {
    console.log(err);

    res.status(500).json({
      message: "배너 가져오기 실패",
    });
  }
}

// 위젯 등록
async function createWidget(req, res, next) {
  const { premier_widget_img, widget_img } = req.files;

  try {
    const widget_sql = `insert into commonfile (category, name, path, extension, filekey, is_active) values ("widget", ?, ?, ?, ?, ?)`;
    const premier_sql = `insert into commonfile (category, name, path, extension, filekey, is_active) values ("premier_widget", ?, ?, ?, ?, ?)`;

    if (widget_img !== undefined) {
      const default_sql = `update commonfile set is_active = 0 where category = "widget"`;

      await dbpool.beginTransaction();

      await dbpool.execute(default_sql);

      for (let i = 0; i < widget_img.length; i++) {
        const filename = "widget_" + widget_img[i].originalname;
        const filepath = widget_img[i].location;
        const ext = widget_img[i].mimetype.split("/")[1];
        const filekey = widget_img[i].filename + "." + ext;

        await dbpool.execute(widget_sql, [filename, filepath, ext, filekey, 1]);
      }

      await dbpool.commit();
    }
    if (premier_widget_img !== undefined) {
      const default_sql = `update commonfile set is_active = 0 where category = "premier_widget"`;

      await dbpool.beginTransaction();

      await dbpool.execute(default_sql);

      for (let i = 0; i < premier_widget_img.length; i++) {
        const filename = "premier_widget_" + premier_widget_img[i].originalname;
        const filepath = premier_widget_img[i].location;
        const ext = premier_widget_img[i].mimetype.split("/")[1];
        const filekey = premier_widget_img[i].filename + "." + ext;

        await dbpool.execute(premier_sql, [filename, filepath, ext, filekey, 1]);
      }

      await dbpool.commit();
    }

    res.status(200).json({
      message: "위젯 등록 성공",
    });
  } catch (err) {
    await dbpool.rollback();
    console.log(err);

    res.status(500).json({
      message: "위젯 등록 실패",
    });
  }
}

// 위젯 삭제
async function deleteWidget(req, res, next) {
  const { file_seq } = req.body;

  if (file_seq === undefined) {
    res.status(401).json({
      message: "위젯 삭제 실패, 필수 항목이 없습니다.",
    });
  } else {
    try {
      const sql = `delete from commonfile where file_seq = ?`;

      await dbpool.execute(sql, [file_seq]);

      res.status(200).json({
        message: "위젯 삭제 성공",
      });
    } catch (err) {
      console.log(err);

      res.status(500).json({
        message: "위젯 삭제 실패",
      });
    }
  }
}

// 위젯 가져오기
async function getWidget(req, res, next) {
  try {
    const sql = `select * from commonfile where (category = "widget" or category = "premier_widget") and is_active = 1`;

    const results = await dbpool.query(sql);

    res.status(200).json({
      message: "위젯 가져오기 성공",
      data: results[0],
    });
  } catch (err) {
    console.log(err);

    res.status(500).json({
      message: "위젯 가져오기 실패",
    });
  }
}

export {
  createBanner,
  activateBanner,
  deactivateBanner,
  getBanner,
  createWidget,
  deleteWidget,
  getWidget,
};
