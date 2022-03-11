import mongoose from "mongoose";

// jest.spyOn(mongoose,"connect").mockReturnValue(Promise.resolve(mongoose));

class Mongoose{
    connect= jest.fn().mockImplementation(()=>true)
}
export default new Mongoose;
// export default {
//     ...mongoose,
//     connect: jest.fn().mockImplementation(()=>true)
// };