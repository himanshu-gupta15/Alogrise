import mongoose from "mongoose";

import { Schema } from "mongoose";

const problemSchema=new Schema({
    title:{
        type:String ,
        required:true 
    },
    description:{
        type:String,
        required:true 
    },
    difficulty:{
        type:String,
        enum:['easy','medium','hard'],
        required:true,
    },
    tags:[
        {
            type:String,
            trim:true,
            lowercase:true,
        }
    ],
    companies:[
        {
            type:String,
            trim:true,
        }
    ],
    visibleTestCases:[
        {
            input:{
                type:String,
                required:true,

            },
            output:{
                type:String,
                required:true
            },
            // Shown under each example; optional for older problems
            explanation:{
                type:String,
                default:''
            }
        }
    ],
    hiddenTestCases:[
        {
            input:{
                type:String,
                required:true,
            },
            output:{
                type:String,
                required:true,
            }
        }
    ],
    startCode:[
        {
            language:{
                type:String,
                required:true
            },
            initialCode:{
                type:String,
                required:true
            }
        }
    ], referenceSolution:[
            {
                language:{
                    type:String,
                    required:true,
                },
                completeCode:{
                    type:String,
                    required:true
                }
            }
        ],
    
        problemCreator:{
            type: Schema.Types.ObjectId,
            ref:'user',
            required:true
        }
        ,
        status: {
            type: String,
            enum: ['pending', 'approved', 'rejected'],
            default: 'pending'
        }
    })
    
    
    const Problem = mongoose.model('problem',problemSchema);
    
   export default Problem;
    