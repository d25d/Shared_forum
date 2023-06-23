function createArticle(title, author, content) {
    const createTime = new Date().toISOString(); // 获取当前时间
    fetch('http://localhost:3000/articles', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        title,
        author,
        createTime,
        content
      })
    })
      .then(response => response.json())
      .then(article => {
        console.log('新文章已创建:', article);
        // 在页面上显示新创建的文章
        // ...
      })
      .catch(error => {
        console.error('创建文章时出错:', error);
      });
  }

  // 提交表单时触发的事件处理函数
  function handleSubmit(event) {
    event.preventDefault(); // 阻止表单的默认提交行为

    // 从表单中获取输入的值
    const title = document.getElementById('titlee').value;
    author='Anonymous';
    const selectedValue = document.getElementById('category-select').value;
    const username = localStorage.getItem('username');
    if (selectedValue === 'all') {
      author = username;
    } else if (selectedValue === 'document') {
       author = 'Anonymous'; // 匿名
    } else {
      author = ''; // 其他情况
    }
    const content = document.getElementById('content').value;

    // 调用创建文章函数
    createArticle(title, author, content);
  }

  // 监听表单的提交事件
  const form = document.getElementById('editor-form');
  form.addEventListener('submit', handleSubmit);
  