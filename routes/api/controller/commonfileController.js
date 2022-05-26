import pool from "./../../../config/dbpool.js";
import { s3, Bucket } from "./../../../util/s3.js";

const dbpool = await pool;

// 배너 등록
async function createBanner(req, res, next) {
  const banner_img = req.file;

  if (banner_img === undefined) {
    res.status(500).json({
      message: "배너 등록 실패, 파일이 업로드 되지않았습니다.",
    });
  }
  try {
    const file_sql = `select * from commonfile where category = "banner"`;
    const file_delete_sql = `delete from commonfile where file_seq = ?`;
    const sql = `insert into commonfile (category, name, path, extension, filekey, is_active) values ("banner", ?, ?, ?, ?, ?)`;

    const file_results = await dbpool.query(file_sql);
    const files = file_results[0];

    for (let i = 0; i < files.length; i++) {
      const filekey = files[i].filekey;

      let params = {
        Bucket: Bucket,
        Key: filekey,
      };

      s3.deleteObject(params, async function (err, data) {
        if (err) console.log(err, err.stack);

        try {
          await dbpool.execute(file_delete_sql, [files[i].file_seq]);
        } catch (err) {
          console.log(err);
        }
      });
    }

    const filename = "banner_" + banner_img.originalname;
    const filepath = banner_img.location;
    const ext = banner_img.mimetype.split("/")[1];
    const filekey = banner_img.key;

    await dbpool.execute(sql, [filename, filepath, ext, filekey, 1]);

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
    res.status(400).json({
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
    res.status(400).json({
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
  if (req.files === undefined) {
    res.status(500).json({
      message: "위젯 등록 실패, 파일이 업로드 되지않았습니다.",
    });
  }

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
        const filekey = widget_img[i].key;

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
        const filekey = premier_widget_img[i].key;

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
    res.status(400).json({
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

// 팝업 등록
async function createPopup(req, res, next) {
  const { name } = req.body;
  const popup_img = req.file;

  const filename = popup_img.originalname;
  const ext = popup_img.mimetype.split("/")[1];
  const key = popup_img.key;
  const filepath = popup_img.location;

  if (name === undefined || popup_img === undefined) {
    res.status(400).json({
      message: "팝업 등록 실패, 필수 항목이 없습니다.",
    });
  } else {
    try {
      const files_sql = `select * from popup`;
      const files_delete_sql = `delete from popup where popup_seq = ?`;
      const sql = `insert into popup (name, filename, path, extension, filekey, is_active) values (?, ?, ?, ?, ?, ?)`;

      const files_results = await dbpool.query(files_sql);
      const files = files_results[0];

      for (let i = 0; i < files.length; i++) {
        const filekey = files[i].filekey;

        const params = {
          Bucket: Bucket,
          Key: filekey,
        };

        s3.deleteObject(params, async function (err, data) {
          if (err) console.log(err, err.stack);

          try {
            await dbpool.execute(files_delete_sql, [files[i].popup_seq]);
          } catch (err) {
            console.log(err);
          }
        });
      }

      await dbpool.execute(sql, [name, filename, filepath, ext, key, 1]);

      res.status(200).json({
        message: "팝업 등록 성공",
      });
    } catch (err) {
      console.log(err);

      res.status(500).json({
        message: "팝업 등록 실패",
      });
    }
  }
}

// 팝업 삭제
async function deletePopup(req, res, next) {
  const { popup_seq } = req.body;

  if (popup_seq === undefined) {
    res.status(400).json({
      message: "팝업 삭제 실패, 필수 항목이 없습니다.",
    });
  } else {
    try {
      const popup_sql = `select * from popup where popup_seq = ?`;
      const sql = `delete from popup where popup_seq = ?`;

      const results = await dbpool.query(popup_sql, [popup_seq]);
      const filekey = results[0][0].filekey;

      const params = {
        Bucket: Bucket,
        Key: filekey,
      };

      s3.deleteObject(params, async function (err, data) {
        if (err) {
          console.log(err, err.stack);

          return res.status(500).json({
            message: "팝업 삭제 실패",
          });
        }

        await dbpool.execute(sql, [popup_seq]);

        res.status(200).json({
          message: "팝업 삭제 성공",
        });
      });
    } catch (err) {
      console.log(err);

      res.status(500).json({
        message: "팝업 삭제 실패",
      });
    }
  }
}

// 팝업 활성화
async function activatePopup(req, res, next) {
  const { popup_seq } = req.body;

  if (popup_seq === undefined) {
    res.status(400).json({
      message: "팝업 활성화 실패, 필수 항목이 없습니다.",
    });
  } else {
    try {
      const sql = `update popup set is_active = 1 where popup_seq = ?`;

      await dbpool.execute(sql, [popup_seq]);

      res.status(200).json({
        message: "팝업 활성화 성공",
      });
    } catch (err) {
      console.log(err);

      res.status(500).json({
        message: "팝업 활성화 실패",
      });
    }
  }
}

// 팝업 비활성화
async function deactivatePopup(req, res, next) {
  const { popup_seq } = req.body;

  if (popup_seq === undefined) {
    res.status(400).json({
      message: "팝업 비활성화 실패, 필수 항목이 없습니다.",
    });
  } else {
    try {
      const sql = `update popup set is_active = 0 where popup_seq = ?`;

      await dbpool.execute(sql, [popup_seq]);

      res.status(200).json({
        message: "팝업 비활성화 성공",
      });
    } catch (err) {
      console.log(err);

      res.status(500).json({
        message: "팝업 비활성화 실패",
      });
    }
  }
}

// 특정 팝업 가져오기
async function getPopup(req, res, next) {
  const { popup_seq } = req.query;

  if (popup_seq === undefined) {
    res.status(400).json({
      message: "특정 팝업 가져오기 실패, 필수 항목이 없습니다.",
    });
  } else {
    try {
      const sql = `select * from popup where popup_seq = ?`;

      const results = await dbpool.query(sql, [popup_seq]);

      if (results[0][0] === undefined) {
        return res.status(500).json({
          message: "해당 팝업이 없습니다.",
        });
      } else {
        res.status(200).json({
          message: "특정 팝업 가져오기 성공",
          data: results[0],
        });
      }
    } catch (err) {
      console.log(err);

      res.status(500).json({
        message: "특정 팝업 가져오기 실패",
      });
    }
  }
}

// 활성화 팝업 가져오기
async function getActivatePopup(req, res, next) {
  try {
    const sql = `select * from popup where is_active = 1`;

    const results = await dbpool.query(sql);

    if (results[0].length === 0) {
      res.status(500).json({
        message: "활성화된 팝업이 없습니다.",
      });
    } else {
      res.status(200).json({
        message: "활성화 팝업 가져오기 성공",
        data: results[0],
      });
    }
  } catch (err) {
    console.log(err);

    res.status(500).json({
      message: "활성화 팝업 가져오기 실패",
    });
  }
}

// 전체 팝업 가져오기
async function getAllPopup(req, res, next) {
  try {
    const sql = `select * from popup`;

    const results = await dbpool.query(sql);

    if (results[0].length === 0) {
      res.status(500).json({
        message: "등록된 팝업이 없습니다.",
      });
    } else {
      res.status(200).json({
        message: "전체 팝업 가져오기 성공",
        data: results[0],
      });
    }
  } catch (err) {
    console.log(err);

    res.status(500).json({
      message: "전체 팝업 가져오기 실패",
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
  createPopup,
  deletePopup,
  activatePopup,
  deactivatePopup,
  getPopup,
  getActivatePopup,
  getAllPopup,
};
