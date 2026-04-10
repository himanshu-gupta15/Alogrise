import mongoose from "mongoose";
import { Schema } from "mongoose";

const submissionSchema=new Schema({
    userId:{
        type:Schema.Types.ObjectId,
        ref:'user',
        required:true,

    },
    problemId:{
        type:Schema.Types.ObjectId,
        ref:'problem',
        required:true,
    },
    code:{
        type:String,
        required:true,
    },
    language:{
        type:String,
        required:true,
        enum:['javascript','c++','java'],

    },
    status:{
        type:String,
        enum:['pending','accepted','wrong','error'],
        default:'pending'
    },
    runtime:{
        type:Number,
        default:0
    },
    memory:{
        type:Number,
        default:0
    },
    errorMessage:{
        type:String,
        default:''
    },
    testCasesPassed:{
        type:Number,
        default:0
    },
    testCasesTotal:{
        type:Number,
        default:0
    }
},{
    timestamps:true
});

submissionSchema.index({userId:1,problemId:1});
const Submission=mongoose.model('submission',submissionSchema)
export default Submission