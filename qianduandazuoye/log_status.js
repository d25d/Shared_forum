  window.addEventListener('load', () => {
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    const username = localStorage.getItem('username');
  
    if (isLoggedIn === 'true') {
      // 用户已登录，显示登录状态和用户名
      console.log('用户已登录');
      console.log('用户名: ' + username);
      const nameElement = document.getElementById('name');
      nameElement.textContent = username;
    } else {
      // 用户未登录，执行其他操作或显示登录表单
      console.log('用户未登录');
      // 显示登录表单或执行其他操作
    }
  });