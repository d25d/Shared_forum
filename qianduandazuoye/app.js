const express = require('express');
const session = require('express-session');
const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const app = express();
app.use(express.json());
const cors = require("cors");
app.use(cors());

app.use(express.urlencoded({ extended: false }));
app.use(session({
  secret: '123456',
  resave: false,
  saveUninitialized: true,
  cookie: { maxAge : 1000 * 60 * 3,}
}));

app.post('/register', (req, res) => {
  const usersData = JSON.parse(fs.readFileSync('users.json'));
  const { username, password } = req.body;
  if (usersData.hasOwnProperty(username)) {
    // 用户名已存在，返回错误响应
    return res.json({ success: false ,message: '用户名已存在' });
  }
  usersData[username] = password;
  // 将更新后的 usersData 对象转换为 JSON 字符串
  const updatedUsersData = JSON.stringify(usersData, null, 2);
  // 将更新后的用户数据写入 users.json 文件
  fs.writeFileSync('users.json', updatedUsersData);
  
  // 获取前端传递的用户名和用户 ID
  const userId = uuidv4();
  const usersFilePath = 'name_id.json';

  // 创建用户对象
  const user = {
    id: userId,
    username: username
  };
  
  // 读取已有文件内容
  let existingData = [];
  try {
    const fileData = fs.readFileSync(usersFilePath, 'utf8');
    existingData = JSON.parse(fileData);
  } catch (error) {
    // 文件不存在或读取错误时，existingData 为空数组
  }
  
  // 将新用户数据追加到已有数据中
  existingData.push(user);
  
  // 将更新后的数据写入 JSON 文件
  fs.writeFileSync(usersFilePath, JSON.stringify(existingData, null, 2));
  //创建文件夹
  const userFolderPath = path.join(__dirname, 'user_data', userId);
  fs.mkdirSync(userFolderPath);
  res.json({ success: true });
});

app.post('/login', (req, res) => {
  const usersData = fs.readFileSync('users.json');
  const users = JSON.parse(usersData);
  const { username, password } = req.body; // 使用解构赋值简化代码
  console.log('Received login request:', req.body);

  if (users[username] === password) {
    req.session.username = username;
    res.json({ success: true});
  }
  else if (!users.hasOwnProperty(username)) 
  {
    res.json({ success: false, message: '用户名不存在' });
  }
  else {
    res.json({ success: false, message: '密码错误' });
  }
});

app.post('/saveData', (req, res) => {
  const data = req.body.data;
  const data1 = JSON.stringify(data);

  // 将数据写入文件
  fs.writeFile('data.json', JSON.stringify(data), 'utf8', (err) => {
    if (err) {
      console.error('写入数据时出错:', err);
      res.status(500).send('保存数据时出错');
      return;
    }n
  })
  fs.appendFile('comments.txt', `${data1}\n`, (err) => {
      if (err) {
        console.error(err);
        res.status(500).send('保存评论失败');
      } else {
        res.send('评论保存成功');
      }
    console.log('数据已成功保存');
    res.sendStatus(200);
  });
});

app.get('/checkSession', (req, res) => {
  if (req.session.username) {
    // 用户已登录，用户名和标识符一一对应
    res.status(200).json({ isLoggedIn: true });
  } else {
    // 用户未登录或用户名和标识符不匹配
    res.status(401).json({ isLoggedIn: false });}
});

// 读取所有文章
function getAllArticles() {
  try {
    const articlesData = fs.readFileSync('articles.json', 'utf8');
    if (articlesData.trim() === '') {
      // 文件内容为空，返回空数组表示没有文章数据
      return [];
    }
    return JSON.parse(articlesData);
  } catch (error) {
    console.error('Error reading articles data:', error);
    return []; // 发生错误时，返回空数组
  }
}


// 保存所有文章
function saveAllArticles(articles) {
  fs.writeFileSync('articles.json', JSON.stringify(articles, null, 2));
}

// 获取指定文章
function getArticleById(articleId) {
  const articles = getAllArticles();
  return articles.find(article => article.id === articleId);
}

// 创建新文章
function createArticle(title, author, createTime, content) {
  const newArticle = {
    id: uuidv4(),
    title,
    author,
    createTime,
    content,
    likes: 0,
    favorites: 0,
    comments: []
  };

  const articles = getAllArticles();
  articles.push(newArticle);
  saveAllArticles(articles);

  return newArticle;
}

// 点赞文章
function likeArticle(articleId) {
  const articles = getAllArticles();
  const article = articles.find(article => article.id === articleId);
  if (article) {
    article.likes++;
    saveAllArticles(articles);
    return true;
  }
  return false;
}

// 收藏文章
function favoriteArticle(articleId) {
  const articles = getAllArticles();
  const article = articles.find(article => article.id === articleId);
  if (article) {
    article.favorites++;
    saveAllArticles(articles);
    return true;
  }
  return false;
}

// 添加评论
function addComment(articleId, commentText) {
  const articles = getAllArticles();
  const article = articles.find(article => article.id === articleId);
  if (article) {
    const newComment = {
      id: uuidv4(),
      text: commentText
    };
    article.comments.push(newComment);
    saveAllArticles(articles);
    return newComment;
  }
  return null;
}

// 处理创建文章请求
app.post('/articles', (req, res) => {
  const { title, author, createTime, content } = req.body;
  const newArticle = createArticle(title, author, createTime, content);
  res.json(newArticle);
});
// 处理点赞请求
app.post('/articles/:id/like', (req, res) => {
  const { id } = req.params;
  const result = likeArticle(id);
  if (result) {
    res.json({ success: true, message: '点赞成功' });
  } else {
    res.json({ success: false, message: '文章不存在' });
  }
});

// 处理收藏请求
app.post('/articles/:id/favorite', (req, res) => {
  const { id } = req.params;
  const result = favoriteArticle(id);
  if (result) {
    res.json({ success: true, message: '收藏成功' });
  } else {
    res.json({ success: false, message: '文章不存在' });
  }
});

// 处理添加评论请求
app.post('/articles/:id/comments', (req, res) => {
  const { id } = req.params;
  const { text } = req.body;
  const newComment = addComment(id, text);
  if (newComment) {
    res.json(newComment);
  } else {
    res.json({ success: false, message: '文章不存在' });
  }
});
const port = process.env.PORT || 3000; // 使用环境变量PORT指定端口号，如果没有则默认为3000
app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});
