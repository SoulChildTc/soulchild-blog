function clickEffect() {
    let balls = [];
    let longPressed = false;
    let longPress;
    let multiplier = 0;
    let width, height;
    let origin;
    let normal;
    let ctx;
    const colours = ["#F73859", "#14FFEC", "#00E0FF", "#FF99FE", "#FAF15D"];
    const canvas = document.createElement("canvas");
    document.body.appendChild(canvas);
    canvas.setAttribute("style", "width: 100%; height: 100%; top: 0; left: 0; z-index: 99999; position: fixed; pointer-events: none;");
    const pointer = document.createElement("span");
    pointer.classList.add("pointer");
    document.body.appendChild(pointer);
   
    if (canvas.getContext && window.addEventListener) {
      ctx = canvas.getContext("2d");
      updateSize();
      window.addEventListener('resize', updateSize, false);
      loop();
      window.addEventListener("mousedown", function(e) {
        pushBalls(randBetween(20, 30), e.clientX, e.clientY);
        document.body.classList.add("is-pressed");
        longPress = setTimeout(function(){
          document.body.classList.add("is-longpress");
          longPressed = true;
        }, 500);
      }, false);
      window.addEventListener("mouseup", function(e) {
        clearInterval(longPress);
        if (longPressed == true) {
          document.body.classList.remove("is-longpress");
          pushBalls(randBetween(80 + Math.ceil(multiplier), 150 + Math.ceil(multiplier)), e.clientX, e.clientY);
          longPressed = false;
        }
        document.body.classList.remove("is-pressed");
      }, false);
      window.addEventListener("mousemove", function(e) {
        let x = e.clientX;
        let y = e.clientY;
        pointer.style.top = y + "px";
        pointer.style.left = x + "px";
      }, false);
    } else {
      console.log("canvas or addEventListener is unsupported!");
    }
   
   
    function updateSize() {
      canvas.width = window.innerWidth * 2;
      canvas.height = window.innerHeight * 2;
      canvas.style.width = window.innerWidth + 'px';
      canvas.style.height = window.innerHeight + 'px';
      ctx.scale(2, 2);
      width = (canvas.width = window.innerWidth);
      height = (canvas.height = window.innerHeight);
      origin = {
        x: width / 2,
        y: height / 2
      };
      normal = {
        x: width / 2,
        y: height / 2
      };
    }
    class Ball {
      constructor(x = origin.x, y = origin.y) {
        this.x = x;
        this.y = y;
        this.angle = Math.PI * 2 * Math.random();
        if (longPressed == true) {
          this.multiplier = randBetween(20 + multiplier, 25 + multiplier);
        } else {
          this.multiplier = randBetween(10, 18);
        }
        this.vx = (this.multiplier + Math.random() * 0.5) * Math.cos(this.angle);
        this.vy = (this.multiplier + Math.random() * 0.5) * Math.sin(this.angle);
        this.r = randBetween(8, 15) + 3 * Math.random();
        this.color1 = colours[Math.floor(Math.random() * colours.length)];
        this.color2 = colours[Math.floor(Math.random() * colours.length)];
        this.rotation = Math.random() * Math.PI * 2;
      }
      update() {
        this.x += this.vx - normal.x;
        this.y += this.vy - normal.y;
        normal.x = -2 / window.innerWidth * Math.sin(this.angle);
        normal.y = -2 / window.innerHeight * Math.cos(this.angle);
        this.r -= 0.25;
        this.vx *= 0.92;
        this.vy *= 0.92;
        this.rotation += 0.1;
      }
    }
   
    function pushBalls(count = 1, x = origin.x, y = origin.y) {
      for (let i = 0; i < count; i++) {
        balls.push(new Ball(x, y));
      }
    }
   
    function randBetween(min, max) {
      return Math.floor(Math.random() * max) + min;
    }
   
    function loop() {
      ctx.fillStyle = "rgba(255, 255, 255, 0)";
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (let i = 0; i < balls.length; i++) {
        let b = balls[i];
        if (b.r < 0) continue;
        
        // 创建径向渐变
        let gradient = ctx.createRadialGradient(b.x, b.y, 0, b.x, b.y, b.r);
        gradient.addColorStop(0, b.color1);
        gradient.addColorStop(1, b.color2);
        
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(b.x, b.y, b.r, 0, Math.PI * 2, false);
        ctx.fill();
        b.update();
      }
      if (longPressed == true) {
        multiplier += 0.3;
      } else if (!longPressed && multiplier >= 0) {
        multiplier -= 0.4;
      }
      removeBall();
      requestAnimationFrame(loop);
    }
   
    function removeBall() {
      for (let i = 0; i < balls.length; i++) {
        let b = balls[i];
        if (b.x + b.r < 0 || b.x - b.r > width || b.y + b.r < 0 || b.y - b.r > height || b.r < 0) {
          balls.splice(i, 1);
        }
      }
    }
}

function backgroundParticle() {
    // 创建canvas元素
    const canvas = document.createElement('canvas');
    canvas.id = 'canvas-effect';
    canvas.style.position = 'fixed';
    canvas.style.top = '0';
    canvas.style.left = '0';
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    canvas.style.pointerEvents = 'none';
    canvas.style.zIndex = '0';
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    document.body.insertBefore(canvas, document.body.firstChild);

    // 获取canvas上下文
    const ctx = canvas.getContext('2d');

    // 粒子集合
    const particles = [];
    const particleCount = 100;

    // 初始化粒子
    for (let i = 0; i < particleCount; i++) {
        particles.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            radius: Math.random() * 3 + 1,
            color: `rgba(255, 255, 255, ${Math.random() * 0.5 + 0.1})`,
            speedX: Math.random() * 0.5 - 0.25,
            speedY: Math.random() * 0.5 - 0.25
        });
    }

    // 绘制粒子
    function drawParticles() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // 绘制粒子
        particles.forEach(particle => {
            ctx.beginPath();
            ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
            ctx.fillStyle = particle.color;
            ctx.fill();
            
            // 更新粒子位置
            particle.x += particle.speedX;
            particle.y += particle.speedY;
            
            // 边界检测
            if (particle.x < 0 || particle.x > canvas.width) {
                particle.speedX = -particle.speedX;
            }
            if (particle.y < 0 || particle.y > canvas.height) {
                particle.speedY = -particle.speedY;
            }
        });
        
        // 绘制粒子之间的连线
        particles.forEach((particle, i) => {
            for (let j = i + 1; j < particles.length; j++) {
                const dx = particle.x - particles[j].x;
                const dy = particle.y - particles[j].y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < 100) {
                    ctx.beginPath();
                    ctx.strokeStyle = `rgba(255, 255, 255, ${0.1 * (1 - distance / 100)})`;
                    ctx.lineWidth = 1;
                    ctx.moveTo(particle.x, particle.y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.stroke();
                }
            }
        });
        
        requestAnimationFrame(drawParticles);
    }

    // 窗口大小改变时调整canvas大小
    window.addEventListener('resize', function() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    });

    // 开始动画
    drawParticles();
}

document.addEventListener('DOMContentLoaded', function () {
    backgroundParticle();
    clickEffect();
}); 