
// 创建用户集合规则
const mongoose = require('mongoose');


const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        require: true,
        minlength:2,
        maxlength:20
    },
    age: {
        type: Number,
        min: 18,
        max: 80
    },
    password: String,
    email: String,
    hobbies: [ String ]
    
});

//创建集合 返回集合构造函数
const User = mongoose.model('User',UserSchema)

// User.create({name: '胡一八',age: 20, password: '123456',email: '123@qq.com',hobbies: ['唱歌','足球']}).then(result => console.log(result));
//创建服务器

module.exports = User;