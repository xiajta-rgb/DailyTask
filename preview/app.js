// DailyTask · 移动端逻辑 1:1 还原
(() => {
  const $  = (s, r=document) => r.querySelector(s);
  const $$ = (s, r=document) => Array.from(r.querySelectorAll(s));

  // 工具栏(电脑端)切页
  $$('.bar-tab').forEach(t => t.addEventListener('click', () => {
    $$('.bar-tab').forEach(x => x.classList.remove('active'));
    t.classList.add('active');
    showPage(t.dataset.page);
  }));

  function showPage(name) {
    $$('.page').forEach(p => p.classList.remove('active'));
    const p = $('#page-' + name);
    if (p) p.classList.add('active');
  }

  // 实时时间 (toolbar 标题 + 状态栏)
  const weekMap = ['星期日','星期一','星期二','星期三','星期四','星期五','星期六'];
  const pad = n => String(n).padStart(2, '0');
  function tickClock() {
    const d = new Date();
    const t = `${pad(d.getHours())}:${pad(d.getMinutes())}`;
    const st = $('#sysTime'); if (st) st.textContent = t;
    const tb = $('#tbTitle'); if (tb) tb.textContent = weekMap[d.getDay()];
    const ts = $('#tbSubtitle'); if (ts) ts.textContent = `${d.getFullYear()}年${pad(d.getMonth()+1)}月${pad(d.getDate())}日 ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
    const mc = $('#maskClock'); if (mc) mc.textContent = `${pad(d.getHours())}:${pad(d.getMinutes())}`;
  }
  tickClock();
  setInterval(tickClock, 1000);

  // 倒计时条 repeatTimeView
  let left = 60;
  setInterval(() => {
    if (taskStarted) {
      left = (left + 1) % 1440;
      const h = Math.floor(left / 60), m = left % 60;
      $('#repeatBar').textContent = `${h}小时${m}分钟后刷新每日任务`;
    } else {
      $('#repeatBar').textContent = '--分钟后刷新每日任务';
    }
  }, 1000);

  // Snackbar
  const snack = $('#snack');
  let snackT;
  function toast(msg) {
    clearTimeout(snackT);
    snack.textContent = msg;
    snack.classList.add('show');
    snackT = setTimeout(() => snack.classList.remove('show'), 1800);
  }

  // 启动/停止 任务
  let taskStarted = false;
  const execBtn = $('#execTaskBtn');
  const execLbl = $('#execTaskLabel');
  const tips = $('#tipsText');
  const workflow = $('#workflow');
  execBtn.addEventListener('click', () => {
    if (taskStarted) {
      taskStarted = false;
      execLbl.textContent = '启动';
      execBtn.querySelector('.btn-ico').className = 'btn-ico start';
      tips.textContent = '当前未启动任何任务';
      tips.classList.add('empty');
      $('#floatView').classList.remove('show');
      workflow.style.display = 'block';
      $$('.flow-step').forEach(s => s.classList.remove('active','done'));
      toast('任务已停止');
    } else {
      taskStarted = true;
      execLbl.textContent = '停止';
      execBtn.querySelector('.btn-ico').className = 'btn-ico stop';
      tips.textContent = '距离下次打卡还有 30 秒';
      tips.classList.remove('empty');
      $('#floatView').classList.add('show');
      workflow.style.display = 'none';
      toast('任务已启动');
      // 模拟倒计时 30s
      let n = 30;
      const f = $('#floatView .t');
      const t = setInterval(() => {
        n--;
        if (f) f.textContent = n + 's';
        if (n <= 0) {
          clearInterval(t);
          if (f) f.textContent = '0s';
          // 触发灭屏 + 唤起流程
          showMask();
          setTimeout(hideMask, 2500);
        }
        if (!taskStarted) clearInterval(t);
      }, 1000);
    }
  });

  // 工作流步骤点击高亮 + 循环展示流程动画
  const flowSteps = $$('.flow-step');
  function highlightStep(i) {
    flowSteps.forEach(s => {
      const idx = +s.dataset.step;
      s.classList.remove('active','done');
      if (idx < i) s.classList.add('done');
      if (idx === i) s.classList.add('active');
    });
  }
  flowSteps.forEach(s => s.addEventListener('click', () => highlightStep(+s.dataset.step)));

  // 启动前演示一次流程动画,让用户更直观
  let demoIdx = 0, demoTimer;
  function startDemo() {
    clearInterval(demoTimer);
    demoIdx = 0;
    demoTimer = setInterval(() => {
      demoIdx = (demoIdx % flowSteps.length) + 1;
      highlightStep(demoIdx);
    }, 1200);
  }
  startDemo();

  // 任务卡片点击
  $$('.task-card').forEach(card => {
    card.addEventListener('click', () => {
      $$('.task-card').forEach(c => c.classList.remove('active'));
      card.classList.add('active');
    });
  });

  // Switch
  $$('.switch').forEach(sw => sw.addEventListener('click', e => {
    e.stopPropagation();
    sw.classList.toggle('on');
    if (sw.dataset.switch === 'randomTime') {
      $('#minuteRangeBlock').style.display = sw.classList.contains('on') ? 'block' : 'none';
    }
  }));

  // 行为分发
  document.addEventListener('click', e => {
    const t = e.target.closest('[data-action]');
    if (!t) return;
    const act = t.dataset.action;
    switch (act) {
      case 'back': historyBack(); break;
      case 'addTask': openAddSheet(); break;
      case 'importTask': toast('请选择文件'); closeSheet(); break;
      case 'closeSheet': closeSheet(); break;
      case 'gotoSettings': openNotice(); break;
      case 'closeNotice': closeNotice(); break;
      case 'targetApp': toast('选择打卡应用'); break;
      case 'msgChannel': showPage('messageChannel'); break;
      case 'resultSource': toast('选择结果来源'); break;
      case 'taskConfig': showPage('taskConfig'); break;
      case 'openTest': toast('唤起测试'); break;
      case 'captureTest': toast('截屏测试'); break;
      case 'faq': toast('常见问题'); break;
      case 'pickResetTime': openTimeSheet('resetTimeVal'); break;
      case 'pickRange': toast('设置随机分钟范围'); break;
      case 'exportConfig': toast('配置已导出'); break;
      case 'showFlow': openFlow(); break;
      case 'closeFlow': closeFlow(); break;
    }
  });

  // 返回:记录页面栈
  const stack = ['main'];
  function showPage(name) {
    $$('.page').forEach(p => p.classList.remove('active'));
    const p = $('#page-' + name);
    if (p) p.classList.add('active');
    stack.push(name);
  }
  function historyBack() {
    if (stack.length > 1) {
      stack.pop();
      const prev = stack[stack.length - 1];
      $$('.page').forEach(p => p.classList.remove('active'));
      const p = $('#page-' + prev);
      if (p) p.classList.add('active');
    }
  }

  // 弹窗控制
  function openNotice() { $('#noticeDialog').classList.add('show'); }
  function closeNotice() {
    $('#noticeDialog').classList.remove('show');
    showPage('settings');
  }
  function openAddSheet() { $('#addSheet').classList.add('show'); }
  function closeSheet() { $('#addSheet').classList.remove('show'); }
  function openFlow() {
    $('#flowDialog').classList.add('show');
    clearInterval(demoTimer);
  }
  function closeFlow() {
    $('#flowDialog').classList.remove('show');
    if (!taskStarted) startDemo();
  }
  $('#flowDialog').addEventListener('click', e => {
    if (e.target.id === 'flowDialog') closeFlow();
  });

  // 灭屏
  function showMask() { $('#maskView').classList.add('show'); }
  function hideMask() { $('#maskView').classList.remove('show'); }

  // 时间选择(TimeWheelLayout)
  let pickTarget = null;
  let wh = 5, wm = 0;
  function buildWheel(el, max, sel) {
    el.innerHTML = '';
    for (let i = 0; i < max; i++) {
      const d = document.createElement('div');
      d.className = 'it' + (i === sel ? ' sel' : '');
      d.textContent = pad(i);
      d.addEventListener('click', () => {
        sel = i;
        Array.from(el.children).forEach((c, idx) => c.classList.toggle('sel', idx === sel));
      });
      el.appendChild(d);
    }
    el.style.transform = `translateY(${-(sel) * 36 + 80}px)`;
    return i => { sel = i; el.style.transform = `translateY(${-(sel) * 36 + 80}px)`; Array.from(el.children).forEach((c, idx) => c.classList.toggle('sel', idx === sel)); };
  }
  const setH = buildWheel($('#wh'), 24, 5);
  const setM = buildWheel($('#wm'), 60, 0);
  function openTimeSheet(targetId) {
    pickTarget = targetId;
    $('#timeSheet').classList.add('show');
  }
  function closeTimeSheet() { $('#timeSheet').classList.remove('show'); }
  $('#timeSheet').addEventListener('click', e => {
    if (e.target.id === 'timeSheet') closeTimeSheet();
  });
  document.addEventListener('click', e => {
    if (e.target.closest('[data-action="closeTimeSheet"]')) closeTimeSheet();
    if (e.target.closest('[data-action="confirmTime"]') && pickTarget) {
      $('#' + pickTarget).textContent = `${pad(wh)}:${pad(wm)}`;
      closeTimeSheet();
    }
  });

  // 输入回车:聚焦
  $$('.ipt').forEach(i => i.addEventListener('focus', () => i.select()));
})();
