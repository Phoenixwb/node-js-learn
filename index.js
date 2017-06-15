'use strict';

module.exports = function () {
    const Koa = require('koa');
    const Router = require('koa-router');
    const bodyParser = require('koa-bodyparser');

    const app = new Koa();
    const router = new Router();

    app.use(async (ctx, next) => {
        console.log(`LOG:${ctx.request.method} ${ctx.request.url}`); // 打印URL
        await next();
    })

    app.use(async (ctx, next) => {
        const start = new Date().getTime(); // 当前时间
        await next(); // 调用下一个middleware
        const ms = new Date().getTime() - start; // 耗费时间
        console.log(`Time: ${ms}ms`); // 打印耗费时间
    });

    app.use(async (ctx, next) => {
        if (await checkUserPermission(ctx)) {// 检查权限
            await next();
        } else {
            ctx.response.status = 403;
        }
        function checkUserPermission(ctx) {
            console.log('permisson');
            return true;
        }
    });

    app.use(bodyParser({
        enableTypes: [
            'json',
            'form',
            'text'
        ]
    }));

    app.use(async (ctx, next) => {
        if (ctx.request.type === 'text/plain') {
            ctx.request.body = JSON.parse(ctx.request.body);
        }
        console.log(`Worker ${process.pid} request`);
        await next();
    });

    // function GET(){
    //     return async (ctx, next) =>{
    //         await next();
    //     }
    // }
    router.post('/signin', async (ctx, next) => {
        var
            name = ctx.request.body.name || '',
            password = ctx.request.body.password || '';
        console.log(`signin with name: ${name}, password: ${password}`);
        if (name === 'koa' && password === '12345') {
            ctx.response.body = `<h1>Welcome, ${name}!</h1>`;
        } else {
            ctx.response.body = `<h1>Login failed!</h1>
        <p><a href="/">Try again</a></p>`;
        }
    });
    var sleep = function (time) {
        return new Promise(function (resolve, reject) {
            setTimeout(function () {
                resolve();
            }, time);
        })
    };

    router.get('/', async (ctx, next) => {
        await sleep(500)
        ctx.response.body = `<h1> default </h1>`
        await next();
    });

    app.use(router.routes());

    const port = 11111;
    app.listen(port);
    console.log('app started at port: ' + port);
};