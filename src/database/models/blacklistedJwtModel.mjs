import mongoose from "../config.mjs";

const blacklistedJwtSchema = mongoose.Schema(
    {
        token: {
            type: String,
            required: true
        }
    },
    { timestamps: true }
);

const BlacklistedJwt = mongoose.model("blacklisted_jwt", blacklistedJwtSchema);
export default BlacklistedJwt;