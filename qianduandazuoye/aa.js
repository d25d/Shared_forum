const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');

const app = express();
app.use(bodyParser.urlencoded({ extended: false }));

// 注册路由-------------------------------------------------------------------------------------------------------------------------------
app.post('/register', (req, res) => {
    const username = req.body.username;
    const password = req.body.password;
    const confirmPassword = req.body['确认'];
    // 检查输入是否为空
    if (!username || !password || !confirmPassword) {
      res.send(`
        <script>
          alert('请填写所有字段');
        
        </style>
      `);
      return;
    }
    // 检查密码和确认密码是否一致
    if (password !== confirmPassword) {
      res.send(`
        <script>
        alert('密码不一致');
        </style>
      `);
      return;
    }
    // 检查用户是否已存在
    if (fs.existsSync(`users/${username}`)) {
      res.send(`
        <script>
        alert('用户已存在');
        </style>
      `);
      return;
    }
    // 创建用户文件夹并保存密码
    fs.mkdirSync(`users/${username}`);
    fs.writeFileSync(`users/${username}/password.txt`, password);
    // 提示注册成功，并返回上一页
    res.send(`
      <script>
      alert('注册成功');
      window.location.href = 'denglu.html';
      </style>
    `);
  });

  // 登录路由------------------------------------------------------------------------------------------------------------------------------------
app.post('/login', (req, res) => {
    const username = req.body.username;
    const password = req.body.password;
  
    // 检查用户名和密码是否正确
    if (fs.existsSync(`users/${username}`)) {
      const storedPassword = fs.readFileSync(`users/${username}/password.txt`, 'utf8');
      if (password === storedPassword) {
        // 登录成功，跳转到用户信息页面或其他需要登录后访问的页面
        res.send(`
          <script>
            alert('登录成功');
            window.location.href = 'default.html';
          </script>
        `);
        return;
      }
    }
  
    // 登录失败，提示用户名或密码错误，并返回登录页面
    res.send(`
      <script>
        alert('用户名或密码错误');
        window.location.href = 'denglu.html';
      </script>
    `);
  });

//上传文件------------------------------------------------------------------------------------------------------------------------------------
const multer = require('multer');
const path = require('path');
app.use(bodyParser.urlencoded({ extended: false }));

const upload = multer({ dest: 'articles' });
app.use(upload.single('image'));

// 提交表单数据路由
app.post('/submit', (req, res) => {
  const category = req.body.category;
  const title = req.body.title;
  const content = req.body.content;
  const image = req.file;

  // 创建存储文章的目录（如果不存在）
  const articlesDir = path.join(__dirname, 'articles');
  
  // 生成唯一的文件名
  const timestamp = Date.now();
  const filename = `${timestamp}_${image.originalname}`;

  // 将上传的文件移动到目标文件夹
  const targetPath = path.join(articlesDir, filename);
  fs.renameSync(image.path, targetPath);

  // 响应前端请求
  res.status(200).send('Article submitted successfully');
});


// 启动服务器
app.listen(3000, () => {
  console.log('服务器已启动');
});