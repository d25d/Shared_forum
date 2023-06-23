const loginBtn = document.getElementById('denglu1');
loginBtn.addEventListener('click', (event) => {
  event.preventDefault(); // 阻止表单默认提交行为

  const username = document.querySelector('input[id="zhanghao"]').value;
  const password = document.querySelector('input[id="mima"]').value;

  fetch('http://localhost:3000/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ username, password })
  })
    .then(response => {
      if (response.ok) {
        return response.json();
      } else {
        throw new Error('登录请求失败');
      }
    })
    .then(result => {
      if (result.success) {
        alert('登录成功');
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('username', username);
      } else {
        alert('登录失败: ' + result.message);
      }
    })
    .then(data=>{
      localStorage.setItem('isLoggedIn', 'true');
      localStorage.setItem('username', username);
      alert('登录成功');
      setTimeout(function() {
        window.location.href = 'default.html';
      }, 2000);
    })
    .catch(error => {
      console.error('登录请求失败:', error);
    });
});
function register() {
  window.location.href = '\zhuce.html'; 
}