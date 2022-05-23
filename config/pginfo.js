import dotenv from "dotenv";
dotenv.config();

const pgInfo = {
  nice: {
    siteCode: process.env.checkplus_siteCode,
    sitePW: process.env.checkplus_sitePw,
  },
};

export default pgInfo;
