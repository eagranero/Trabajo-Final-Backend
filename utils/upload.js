
import multer from "multer";

const storage = await multer.diskStorage({
    destination: async  function (req, file, cb) {
      await cb(null, './public/'+ file.fieldname)
    },
    filename: async function (req, file, cb) {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
      await cb(null, file.fieldname + '-' + uniqueSuffix)

    }
  })

  
export const upload = await multer({ storage });

