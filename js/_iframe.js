// https://www.json.cn/json/jshx.html
// 勾选 K保护、调试保护、禁用控制台输出、保护间隔

window.onload = function () {
    function d() {
      var t = document.createElement("div"),
        e = document.createElement("div"),
        a = document.createElement("iframe"),
        o = document.body,
        r =
          '<svg viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg" data-v-ea893728=""><path fill="currentColor" d="M273.536 736H800a64 64 0 0 0 64-64V256a64 64 0 0 0-64-64H224a64 64 0 0 0-64 64v570.88L273.536 736zM296 800 147.968 918.4A32 32 0 0 1 96 893.44V256a128 128 0 0 1 128-128h576a128 128 0 0 1 128 128v416a128 128 0 0 1-128 128H296z"></path><path fill="currentColor" d="M512 499.2a51.2 51.2 0 1 1 0-102.4 51.2 51.2 0 0 1 0 102.4zm192 0a51.2 51.2 0 1 1 0-102.4 51.2 51.2 0 0 1 0 102.4zm-384 0a51.2 51.2 0 1 1 0-102.4 51.2 51.2 0 0 1 0 102.4z"></path></svg>',
        i =
          '<svg viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg" data-v-ea893728=""><path fill="currentColor" d="M764.288 214.592 512 466.88 259.712 214.592a31.936 31.936 0 0 0-45.12 45.12L466.752 512 214.528 764.224a31.936 31.936 0 1 0 45.12 45.184L512 557.184l252.288 252.288a31.936 31.936 0 0 0 45.12-45.12L557.12 512.064l252.288-252.352a31.936 31.936 0 1 0-45.12-45.184z"></path></svg>';
      (t.id = "tip_chato_www"),
        t.setAttribute(
          "style",
          `box-sizing:border-box;position:fixed;right:22px;bottom:120px;z-index:99999;width:44px;height:44px;padding:10px;border-radius:100%;background-color:${
            window.tip_chato_bg || "4C83F3"
          };color:${window.tip_chato_color};cursor:pointer;`
        ),
        (t.innerHTML = r),
        (e.id = "inframe_container"),
        (a.id = "iframe_chato"),
        (a.src = window.chato_iframe_src),
        e.setAttribute(
          "style",
          `display:none;position:fixed;right:22px;bottom:12px;z-index:999999;width:408px;height:594px;border:1px solid#DCDFE6;`
        ),
        a.setAttribute("style", `width:100%;height:100%;border:none;`),
        (e.innerHTML = `<div id="close_chato"style="position: absolute;right: 0;top: 0;height: 30px;width: 30px;text-align:right;color:#888;cursor:pointer;">${i}</div>`),
        e.appendChild(a),
        o.appendChild(t),
        o.appendChild(e),
        (document.getElementById("tip_chato_www").onclick = function (n) {
          if (window.innerWidth < 460) {
            e.style.width="90%"
            e.style.height="62%"
            e.style.left="50%"
            e.style.transform="translate(-50%, 0%)"
          } else {
            e.style.width="408px"
            e.style.height="594px"
            e.style.alignContent="center"
            e.style.removeProperty("left")
            e.style.removeProperty("transform")
          }
          document.getElementById("inframe_container").style.display = "block";
        }),
        (document.getElementById("close_chato").onclick = function (n) {
          document.getElementById("inframe_container").style.display = "none";
        });
    }
    function s(t = {}) {
      t = Object.assign(
        {},
        { url: "", method: "get", headers: {}, other: {}, data: {} },
        t
      );
      const a = { headers: t.headers, method: t.method, ...t.other };
      if (t.method.toLowerCase() == "get") {
        const o = Object.values(t.data),
          r = Object.keys(t.data),
          i = [];
        for (let c = 0; c < o.length; c++) i.push(`${r[c]}=${o[c]}`);
        const n = i.join("&");
        t.url += `?${n}`;
      } else
        t.method.toLowerCase() == "post" && (a.body = JSON.stringify(t.data));
      return new Promise(async (o, r) => {
        const n = await (await fetch(t.url, a)).json();
        o(n);
      });
    }
    async function l() {
      const t = {
          url: window.chato_script_checkDomain,
          data: { site: window.location.origin }
        },
        e = await s(t);
      console.log(e), e.data && d();
    }
    l();
  };
  