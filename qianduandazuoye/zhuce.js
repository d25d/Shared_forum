const loginBtn = document.getElementById('zhuce');
loginBtn.addEventListener('click', (event) => {
  event.preventDefault(); // 阻止表单默认提交行为
  const username = document.querySelector('input[id="zhanghao"]').value;
  const password = document.querySelector('input[id="mima"]').value;
  const confirmPassword = document.querySelector('input[id="queren"]').value;
  if (username === '') {
    alert('请输入用户名');
    return;
  }
  if (password === '') {
    alert('请输入密码');
    return;
  }
  if (password !== confirmPassword) {
    alert('密码不匹配，请重新输入密码');
    return;
  }  fetch('http://localhost:3000/register', {
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
        throw new Error('注册请求失败');
      }
    })
    .then(result => {
      if (result.success) {
        alert('注册成功');
      } else {
        alert('注册失败: ' + result.message);
      }
    })
    .catch(error => {
      console.error('注册请求失败:', error);
    });
});
function back(){
  window.location.href = '\denglu.html'; 

}