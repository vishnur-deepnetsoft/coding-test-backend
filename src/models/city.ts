import mongoose from 'mongoose'


const citySchema = new mongoose.Schema({

    id: { type: Number },

    name: { type: String },

    ascii: { type: String },

    alt_name: { type: String },

    lat: { type: Number},

    long: { type: Number },

    feat_class: { type: String },

    feat_code: { type: String },

    country: { type: String },

    cc2: { type: String },

    admin1: { type: String },

    admin2: { type: String },

    admin3: { type: String },

    admin4: { type: String },

    population: { type: Number },

    elevation: { type: String },

    dem: { type: Number },

    tz: { type: String },

    modified_at: { type: String },

    location: {
        type: {
            type: String, enum: ["Point"]
        },
        coordinates: [Number]
    },

})
citySchema.index({ location: '2dsphere' });

const City = mongoose.model('City', citySchema)
// export { City }
export default City;