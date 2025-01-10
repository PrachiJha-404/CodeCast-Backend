const mongoose = require("moongose");

const fileSchema = mongoose.Schema(
    {
        extension: {
            type: String,
            required: true,
        },
        filename: {
            type:String,
            required: true,
        },
        contents: {
            type:String,
            required:true,
        }
    },
    {timestamps:true});

export const File = mongoose.model("File" , fileSchema);