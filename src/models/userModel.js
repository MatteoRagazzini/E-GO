module.exports = function(mongoose) {
    const schema = new mongoose.Schema({
        name:  String, // String is shorthand for {type: String}
        surname: String,
    });
    return mongoose.model('user_model', schema);
};
