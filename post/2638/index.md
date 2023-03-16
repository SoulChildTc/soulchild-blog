# tekton-配置认证凭证

<!--more-->
参考文档:
https://tekton.dev/docs/pipelines/auth

## 使用背景:

在dind或者dood模式下,我们会运行一个docker client用于从Dockerfile构建镜像,如果dockerfile中的基础镜像需要登陆，并且构建完的镜像需要push到另一个仓库，那么这时候就需要两个仓库凭证。另外如果我们要运行的容器本身也需要去仓库拉一个镜像,那么这时候就需要三个凭证了。如果我们还需要用到git clone代码呢，又得加一个ssh

## annotation
annotation必须以`tekton.dev/git`或`tekton.dev/docker`开头，值就是仓库的主机名，需要携带http/https。

对于ssh类型的只需要填写host名称，无需携带协议名，如果ssh类型的端口不是默认值，可以写成`host:port`这种形式

## 密码相同的情况
不管是git还是docker，如果密码相同配置起来比较简单。

```yaml
apiVersion: v1
kind: Secret
metadata:
  name: ci-auth
  annotations:
    tekton.dev/git-0: https://github.com
    tekton.dev/git-1: https://gitlab.com
    tekton.dev/docker-0: https://gcr.io
type: kubernetes.io/basic-auth
stringData:
  username: aaa
  password: aaa
```
> annotations部分需要注意。作用主要是用于区分我们定义的用户名密码可以用于哪个仓库地址，由于annotation的key不能相同，所有使用git-0，git-1来表示多个仓库地址。最终的含义: 用户名aaa密码aaa的这个账户可以登陆github、gitlab、gcr。

tekton最终不是用的Secret，而是用的ServiceAccount,所以我们需要创建一个ServiceAccount来引用这个Secret，如下
```yaml
apiVersion: v1
kind: ServiceAccount
metadata:
  name: ci-auth
secrets:
- name: ci-auth
imagePullSecrets:
- name: xxx 
```
> 这个Secret中我们多写了imagePullSecrets，这个在拉取容器本身是使用。和pod中的imagePullSecret一样



## 不同密码的情况:

```yaml
# 用于登陆https://gcr.io、https://docker.io的镜像仓库凭证
apiVersion: v1
kind: Secret
metadata:
  name: test0
  annotations:
    tekton.dev/docker-0: https://gcr.io
    tekton.dev/docker-1: https://docker.io
type: kubernetes.io/basic-auth
stringData:
  username: test0
  password: test0
---  
# 用于登陆https://my.io的镜像仓库凭证
apiVersion: v1
kind: Secret
metadata:
  name: test1
  annotations:
    tekton.dev/docker-0: https://my.io
type: kubernetes.io/basic-auth
stringData:
  username: test1
  password: test1
---  
# 用于登陆mygit.com的git仓库凭证
apiVersion: v1
kind: Secret
metadata:
  name: test2
  annotations:
    tekton.dev/git: mygit.com
type: kubernetes.io/basic-auth
stringData:
  username: test2
  password: test2
---  
# 用于登陆mygit2.com的git仓库凭证(ssh-key)
apiVersion: v1
kind: Secret
metadata:
  name: test3
  annotations:
    tekton.dev/git: mygit.com
type: kubernetes.io/ssh-auth
data:
  ssh-privatekey: base64后的ssh-key
  known_hosts: <base64-encoded-known-hosts> 可选
---
apiVersion: v1
kind: ServiceAccount
metadata:
  name: test
secrets:
- name: test0
- name: test1
- name: test2
- name: test3
imagePullSecrets:
- name: xxx
```

## 背后做了什么？
### 基于basic-auth类型的git
可以看到是写了两个文件到家目录
```bash
=== ~/.gitconfig ===
[credential]
    helper = store
[credential "https://url1.com"]
    username = "user1"
[credential "https://url2.com"]
    username = "user2"
...
=== ~/.git-credentials ===
https://user1:pass1@url1.com
https://user2:pass2@url2.com
...
```

### 基于ssh类型的git
https://tekton.dev/docs/pipelines/auth/#ssh-auth-for-git
```yaml
=== ~/.ssh/id_key1 ===
{contents of key1}
=== ~/.ssh/id_key2 ===
{contents of key2}
...
=== ~/.ssh/config ===
Host url1.com
    HostName url1.com
    IdentityFile ~/.ssh/id_key1
Host url2.com
    HostName url2.com
    IdentityFile ~/.ssh/id_key2
...
=== ~/.ssh/known_hosts ===
{contents of known_hosts1}
{contents of known_hosts2}
...
```

### 基于basic-auth的docker
```bash
=== ~/.docker/config.json ===
{
  "auths": {
    "https://url1.com": {
      "auth": "$(echo -n user1:pass1 | base64)",
      "email": "not@val.id",
    },
    "https://url2.com": {
      "auth": "$(echo -n user2:pass2 | base64)",
      "email": "not@val.id",
    },
    ...
  }
}

```



---

> 作者: [SoulChild](https://www.soulchild.cn)  
> URL: https://www.soulchild.cn/post/2638/  

