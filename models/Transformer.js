import mongoose from "mongoose";

const transformersSchema = new mongoose.Schema(
    {
        name: {type: String, required: true},
        faction: {type: String, required: true},
        description: {type: String, required: true},
    },{
        toJSON: {
            virtuals: true,
            transform: (doc, ret) => {
                ret._links = {
                    self: {
                        href: `${process.env.BASE_URL}:${process.env.EXPRESS_PORT}/notes/${ret._id}`
                    },
                    collection: {
                        href: `${process.env.BASE_URL}:${process.env.EXPRESS_PORT}/notes`
                    }
                }
                delete ret._id
                delete ret.__v
            }
        }
    });

const Transformer = mongoose.model('Transformers', transformersSchema);

export default Transformer;