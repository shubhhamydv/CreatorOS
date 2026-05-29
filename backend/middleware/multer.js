import multer from "multer"
import path from "path"
import fs from "fs"
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const publicDir = path.resolve(__dirname, '../public')
fs.mkdirSync(publicDir, { recursive: true })

let storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, publicDir)
    },
    filename: (req, file, cb) => {
        const safeName = `${Date.now()}-${file.originalname.replace(/\s+/g, '_')}`
        cb(null, safeName)
    }
})

const upload = multer({ storage })

export default upload