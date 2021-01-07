// 1、搭建网站服务器，实现客户端与服务器的通信
// 2、连接数据库，创建用户集合，向集合中插入文档
// 3、当用户访问/list时，将所有用户信息查询出来
    //   1）实现路由功能
    // 2）呈现用户列表页面
    // 3）从数据库中查询用于信息 将用户信息展示在列表中
// 4、将用户信息和表格html进行拼接并将拼接结果响应回客户端
// 5、当用户访问/add时，呈现表单页面，并实现添加用户信息功能
// 6、当用户访问/modify时，呈现修改页面，并实现修改用户信息功能
    // 1)增加页面路由 呈现页面
        //  1-在点击修改按钮的时候 将用户ID传递到当前页面
         // 2-从数据库中查询当前用户信息 将用户信息展示到页面中
        // 2）实现用户修改功能
        //  1、指定表单的提交地址以及请求方式
        // 2、接受客户端传递过来的修改信息  找到用户，将用户信息修改为最新
// 7、当用户访问/delete时，实现用户删除功能
// 问题：1、代码都在一个页面，大量有很多字符串拼接；2、修改困难
// 解决问题：1、根目录下创建文件夹model-放置数据库相关的操作
            // 2、在model里新建index.js-放置数据库连接代码
            // 3、在model里创建user.js-放置用户集合规则-因为多处都使用到了，所以要把User开放出去
                // 4、重新回app.js把mode里的文件引入回来
// 字符串拼接可以用模板引擎来解决

const http = require('http');
const url = require('url');
const querystring = require('querystring');// 里面有的方法可以把数组转换成对象
require('./model/index.js');
const User = require('./model/user');


const app = http.createServer();
//为服务器对象添加请求事件
app.on('request',async (req,res) => {
    // 请求方式
    const method = req.method;
    // 请求地址-每个请求都会走这个语句，里面有个query对象，保存了地址栏里的id属性
    const {pathname, query} = url.parse(req.url, true);
    if (method == 'GET') {
        // 呈现用户列表页面
        if (pathname == '/list') {
            // 查询用户信息
            let users = await User.find();
            // 把页面存到变量里，然后在把变量响应给客户端
            // html字符串
            let list =  `
                            <!DOCTYPE html>
                <html lang="en">

                <head>
                    <meta charset="UTF-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <title>用户列表</title>
                    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.0-beta1/dist/css/bootstrap.min.css" rel="stylesheet"
                        integrity="sha384-giJF6kkoqNQ00vy+HMDP7azOuL0xtbfIcaT9wjKHr8RbDVddVHyTfAAsrekwKmP1" crossorigin="anonymous">
                </head>

                <body>
                    <div class="container">
                        <h6>
                            <a href="/add" class="btn btn-primary">添加用户</a>
                        </h6>
                        <table class="table table-striped table-bordered">
                            <tr>
                                <td>用户名</td>
                                <td>年龄</td>
                                <td>爱好</td>
                                <td>邮箱</td>
                                <td>操作</td>
                            </tr>
                            `;
                // 对数据进行循环操作
                    users.forEach(item => {
                        list += `
                        <tr>
                        <td>${item.name}</td>
                        <td>${item.age}</td>
                        <td>                                  
                        `;

                        item.hobbies.forEach(item => {
                            list += `<span> ${item} </span>`
                        });

                        list += `</td>
                        <td>${item.email}</td>
                        <td>
                            <a href="/remove?id=${item._id}" class="btn btn-danger btn-xs">删除</a>
                            <a href="/modify?id=${item._id}" class="btn btn-success btn-xs">修改</a>
                        </td>
                    </tr>
                        `;
                });

                list += `
                </table>
                </div>
            </body>
            </html>              
                `;
            res.end(list);         
        } else if (pathname == '/add') {
            // 呈现用户列表页面
            let add = `
            <!DOCTYPE html>
            <html lang="en">           
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>用户列表</title>
                <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.0-beta1/dist/css/bootstrap.min.css" rel="stylesheet"
                    integrity="sha384-giJF6kkoqNQ00vy+HMDP7azOuL0xtbfIcaT9wjKHr8RbDVddVHyTfAAsrekwKmP1" crossorigin="anonymous">
            </head>
            
            <body>
                <div class="container">
                    <h3>添加用户</h3>
                    <form action="/add" method="post">
                        <div class="form-group">
                            <label for="">用户名</label>
                            <input name="name" type="text" class="form-control" placeholder="请填写用户名">
                        </div>
                        <div class="form-group">
                            <label for="">密码</label>
                            <input name="password" type="text" class="form-control" placeholder="请输入密码">
                        </div>
                        <div class="form-group">
                            <label for="">年龄</label>
                            <input name="age" type="text" class="form-control" placeholder="请填写年龄">
                        </div>
                        <div class="form-group">
                            <label for="">邮箱</label>
                            <input name="email" type="text" class="form-control" placeholder="请填写邮箱">
                        </div>
                        <div class="form-group">
                            <label for="">请选择爱好</label><br>
                            <div>
                                <label for="" class="checkbox-inline">
                                <input type="checkbox" name="hobbies" value="足球">足球
                                </label>
                                <label for="" class="checkbox-inline">
                                    <input type="checkbox" name="hobbies" value="篮球">篮球
                                </label>
                                <label for="" class="checkbox-inline">
                                    <input type="checkbox" name="hobbies" value="橄榄球">橄榄球
                                </label>
                                <label for="" class="checkbox-inline">
                                    <input type="checkbox" name="hobbies" value="敲代码">敲代码
                                </label>
                                <label for="" class="checkbox-inline">
                                    <input type="checkbox" name="hobbies" value="抽烟">抽烟
                                </label>
                                <label for="" class="checkbox-inline">
                                    <input type="checkbox" name="hobbies" value="烫头">烫头
                                </label>
                            </div>              
                        </div>
                        <button type="submit" class="btn btn-primary">添加用户</button>
                    </form>
                </div>
            </body>
            
            </html>    
            `;
            res.end(add);
        }else if (pathname == '/modify') {
           let user = await User.findOne({_id: query.id});
           let hobbies = ['足球', '篮球' ,'橄榄球','敲代码' ,'抽烟','喝酒','烫头'];
            // 呈现用户修改列表页面
            let modify = `
            <!DOCTYPE html>
            <html lang="en">           
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>用户列表</title>
                <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.0-beta1/dist/css/bootstrap.min.css" rel="stylesheet"
                    integrity="sha384-giJF6kkoqNQ00vy+HMDP7azOuL0xtbfIcaT9wjKHr8RbDVddVHyTfAAsrekwKmP1" crossorigin="anonymous">
            </head>
            
            <body>
                <div class="container">
                    <h3>修改用户</h3>
                    <form action="/modify?id=${user._id}" method="post">
                        <div class="form-group">
                            <label for="">用户名</label>
                            <input value="${user.name}" name="name" type="text" class="form-control" placeholder="请填写用户名">
                        </div>
                        <div class="form-group">
                            <label for="">密码</label>
                            <input value="${user.password}" name="password" type="text" class="form-control" placeholder="请输入密码">
                        </div>
                        <div class="form-group">
                            <label for="">年龄</label>
                            <input value="${user.age}" name="age" type="text" class="form-control" placeholder="请填写年龄">
                        </div>
                        <div class="form-group">
                            <label for="">邮箱</label>
                            <input value="${user.email}" name="email" type="text" class="form-control" placeholder="请填写邮箱">
                        </div>
                        <div class="form-group">
                            <label for="">请选择爱好</label><br>
                            <div>    
                                
                            
            `;
            hobbies.forEach(item => {
                //判断当前循环项在不在用户的爱好数据组
                let isHobby = user.hobbies.includes(item);
                if(isHobby) {
                    modify += `
                            <label for="" class="checkbox-inline">
                                    <input type="checkbox" name="hobbies" value="${item}" checked>${item}
                            </label>
                    `
                }else {
                    modify += `
                    <label for="" class="checkbox-inline">
                            <input type="checkbox" name="hobbies" value="${item}">${item}
                    </label>
            `

                }
            })
            modify += `
            </div>              
                        </div>
                        <button type="submit" class="btn btn-primary">修改用户</button>
                    </form>
                </div>
            </body>          
            </html>    
            `
            res.end(modify);
        }else if(pathname == '/remove'){
            // a标签的请求方式是get方式
            //第一步在页面里a的href添加链接及请求参数-id，第二步，到路由里删除用户然后重定向回列表页
            // res.end(query.id);
           await User.findOneAndDelete({_id: query.id});
           res.writeHead(301,{
               Location: 'list'
           });
           res.end();
        }
        
    } else if(method == 'POST'){
        // 添加用户功能
        if (pathname == '/add') {
        //    1、接收用户提交的信息；
        let formData = '';
        // 接受post参数
        req.on('data',param => {
            formData += param;

        })
        // post参数接收完毕
        req.on('end',async () => {
            // 把数组转换成对象
            let user = querystring.parse(formData);
            // 将用户提交的信息添加到数据库中
            // user正好是个对象，所以可以直接这样传递
            await User.create(user);
            // 301代表重定向--其实就是跳转到其他页面的意思
            // location跳转地址
            res.writeHead(301,{
                Location: '/list'
            });
            // 一定要记得调用end方法
            res.end();

        })
        // 2、将用户田炯的信息添加到数据库中
        } else if(pathname == '/modify'){
        // 1、接收用户提交的信息；接收客户端请求数据
        let formData = '';
        // 接受post参数
        req.on('data',param => {
            formData += param;

        })
        // post参数接收完毕
        req.on('end',async () => {
            // 把数组转换成对象
            let user = querystring.parse(formData);
            // 将用户提交的信息添加到数据库中
            // user正好是个对象，所以可以直接这样传递
            await User.updateOne({_id: query.id},user);
            // 301代表重定向--其实就是跳转到其他页面的意思
            // location跳转地址
            res.writeHead(301,{
                Location: '/list'
            });
            // 一定要记得调用end方法
            res.end();

        })
    }
}
    // res.end('ok');
})

//监听端口
app.listen(3000);