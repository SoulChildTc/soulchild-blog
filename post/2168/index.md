# alertmanager自定义告警模板(五)

<!--more-->
## 一、告警模板
alertmanager是可以自定义告警模板的。
注意钉钉需要部署prometheus-webhook-dingtalk，这个也是支持模板的，但是模板要写在prometheus-webhook-dingtalk里，而不是alertmanager
项目链接https://github.com/timonwong/prometheus-webhook-dingtalk

通过配置`templates`参数,指定模板位置。详细可以看我上一篇文章



下面是一个模板示例(网上copy的):
vim /etc/alertmanager/template/wechat.tmpl
```
{{- define "wechat.tmpl" }}
{{- range $i, $alert := .Alerts.Firing -}}
[报警项]:{{ index $alert.Labels "alertname" }}
[实例]:{{ index $alert.Labels "instance" }}
[job]:{{ index $alert.Labels "job" }}
[报警内容]:{{ index $alert.Annotations "summary" }}
[开始时间]:{{ $alert.StartsAt.Format "2006-01-02 15:04:05" }}
====================
{{- end }}
{{- end }}
```
> define: 定义模板名称
> range: 循环遍历
> index: 通过key取值

## 二、数据结构介绍
### 1.Data
- `.Receiver`: 接收器的名称
- `.Status `: 如果存在告警,则为firing,否则resolved(恢复)。
- `.Alerts `: 所有告警对象(alert对象)的列表。(另外他还提供了两个函数用于过滤告警和恢复列表`Alerts.Firing`:代表告警列表,`Alerts.Resolved`:代表恢复列表),告警对象的数据结构可以看下面`alert`部分
- `.GroupLabels`: 告警的分组标签(没猜错应该是对应配置文件的group_by)
- `.CommonLabels`: 所有告警共有的标签
- `.CommonAnnotations`: 所有告警共有的注解
- `.ExternalURL`: 告警对应的alertmanager链接地址

### 2.Alert:
看这个之前可以先了解上面的`Alerts`
- `Status`: 当前这一条报警的状态。`firing`(告警)或`resolved`(恢复)
- `Labels`: 当前这一条报警的标签
- `Annotations`: 当前这一条报警的注解
- `StartsAt`: 当前这一条报警的开始时间
- `EndsAt`: 当前这一条报警的结束时间
- `GeneratorURL`: 告警对应的alertmanager链接地址

### 3. kv数据的一些内置方法
kv数据相当于python里的字典，在模板中提供了一些方法可以操作kv数据
`SortedPairs`: 排序
`Remove `: 删除一个key
`Names`: 返回标签集中标签名的名称列表。
`Values`: 返回标签集中标签名的值列表。

### 4.go模板常用内置函数
`title`: 将字符串转换为首字母大写的标题
`toUpper`: 字母转换成大写
`toLower`: 字母转换成小写
`match`: 使用正则匹配字符串
`reReplaceAll`: 使用正则替换字符串
`join`: 连接字符串用法`{{ .CommonLabels.SortedPairs.Values | join "," }}`
`safeHtml`: 将字符串标记为不需要自动转义的HTML 


详细的数据类型介绍:https://prometheus.io/docs/alerting/latest/notifications/


下面不知道是哪个大佬写的,可以参考一下:
```
{{ define "__subject" }}[{{ .Status | toUpper }}{{ if eq .Status "firing" }}:{{ .Alerts.Firing | len }}{{ end }}] {{ .GroupLabels.SortedPairs.Values | join " " }} {{ if gt (len .CommonLabels) (len .GroupLabels) }}({{ with .CommonLabels.Remove .GroupLabels.Names }}{{ .Values | join " " }}{{ end }}){{ end }}{{ end }}
{{ define "__alertmanagerURL" }}{{ .ExternalURL }}/#/alerts?receiver={{ .Receiver }}{{ end }}

{{ define "__text_alert_list" }}{{ range . }}
**Labels**
{{ range .Labels.SortedPairs }}> - {{ .Name }}: {{ .Value | markdown | html }}
{{ end }}
**Annotations**
{{ range .Annotations.SortedPairs }}> - {{ .Name }}: {{ .Value | markdown | html }}
{{ end }}
**Source:** [{{ .GeneratorURL }}]({{ .GeneratorURL }})
{{ end }}{{ end }}

{{ define "default.__text_alert_list" }}{{ range . }}
---
**告警级别:** {{ .Labels.severity | upper }}

**运营团队:** {{ .Labels.team | upper }}

**触发时间:** {{ dateInZone "2006.01.02 15:04:05" (.StartsAt) "Asia/Shanghai" }}

**事件信息:** 
{{ range .Annotations.SortedPairs }}> - {{ .Name }}: {{ .Value | markdown | html }}


{{ end }}

**事件标签:**
{{ range .Labels.SortedPairs }}{{ if and (ne (.Name) "severity") (ne (.Name) "summary") (ne (.Name) "team") }}> - {{ .Name }}: {{ .Value | markdown | html }}
{{ end }}{{ end }}
{{ end }}
{{ end }}
{{ define "default.__text_alertresovle_list" }}{{ range . }}
---
**告警级别:** {{ .Labels.severity | upper }}

**运营团队:** {{ .Labels.team | upper }}

**触发时间:** {{ dateInZone "2006.01.02 15:04:05" (.StartsAt) "Asia/Shanghai" }}

**结束时间:** {{ dateInZone "2006.01.02 15:04:05" (.EndsAt) "Asia/Shanghai" }}

**事件信息:**
{{ range .Annotations.SortedPairs }}> - {{ .Name }}: {{ .Value | markdown | html }}


{{ end }}

**事件标签:**
{{ range .Labels.SortedPairs }}{{ if and (ne (.Name) "severity") (ne (.Name) "summary") (ne (.Name) "team") }}> - {{ .Name }}: {{ .Value | markdown | html }}
{{ end }}{{ end }}
{{ end }}
{{ end }}

{{/* Default */}}
{{ define "default.title" }}{{ template "__subject" . }}{{ end }}
{{ define "default.content" }}#### \[{{ .Status | toUpper }}{{ if eq .Status "firing" }}:{{ .Alerts.Firing | len }}{{ end }}\] **[{{ index .GroupLabels "alertname" }}]({{ template "__alertmanagerURL" . }})**
{{ if gt (len .Alerts.Firing) 0 -}}

![警报 图标](https://ss0.bdstatic.com/70cFuHSh_Q1YnxGkpoWK1HF6hhy/it/u=3626076420,1196179712&fm=15&gp=0.jpg)

**====侦测到故障====**
{{ template "default.__text_alert_list" .Alerts.Firing }}


{{- end }}

{{ if gt (len .Alerts.Resolved) 0 -}}
{{ template "default.__text_alertresovle_list" .Alerts.Resolved }}


{{- end }}
{{- end }}

{{/* Legacy */}}
{{ define "legacy.title" }}{{ template "__subject" . }}{{ end }}
{{ define "legacy.content" }}#### \[{{ .Status | toUpper }}{{ if eq .Status "firing" }}:{{ .Alerts.Firing | len }}{{ end }}\] **[{{ index .GroupLabels "alertname" }}]({{ template "__alertmanagerURL" . }})**
{{ template "__text_alert_list" .Alerts.Firing }}
{{- end }}

{{/* Following names for compatibility */}}
{{ define "ding.link.title" }}{{ template "default.title" . }}{{ end }}
{{ define "ding.link.content" }}{{ template "default.content" . }}{{ end }}
```

---

下面是我写的一个小例子:
```
{{ define "__subject" }}
[{{ .Status | toUpper }}{{ if eq .Status "firing" }}:{{ .Alerts.Firing | len }}{{ end }}]
{{ end }}

{{ define "__alert_list" }}{{ range . }}
---
**告警名称**: {{ index .Annotations "summary" }}

**告警级别**: {{ .Labels.severity }}

**告警主机**: {{ .Labels.instance }}

**告警信息**: {{ index .Annotations "description" }}

**维护团队**: {{ .Labels.team | upper }}

**告警时间**: {{ .StartsAt.Format "2006-01-02 15:04:05" }}

{{ end }}{{ end }}

{{ define "__resolved_list" }}{{ range . }}
---
**告警名称**: {{ index .Annotations "summary" }}

**告警级别**: {{ .Labels.severity }}

**告警主机**: {{ .Labels.instance }}

**告警信息**: {{ index .Annotations "description" }}

**维护团队**: {{ .Labels.team | upper }}

**告警时间**: {{ .StartsAt.Format "2006-01-02 15:04:05" }}

**恢复时间**: {{ .EndsAt.Format "2006-01-02 15:04:05" }}

{{ end }}{{ end }}


{{ define "default.title" }}
{{ template "__subject" . }}
{{ end }}

{{ define "default.content" }}
![警报 图标](https://ss0.bdstatic.com/70cFuHSh_Q1YnxGkpoWK1HF6hhy/it/u=3626076420,1196179712&fm=15&gp=0.jpg)

{{ if gt (len .Alerts.Firing) 0 }}

**====侦测到{{ .Alerts.Firing | len  }}个故障====**
{{ template "__alert_list" .Alerts.Firing }}
---
{{ end }}

{{ if gt (len .Alerts.Resolved) 0 }}
**====恢复{{ .Alerts.Resolved | len  }}个故障====**
{{ template "__resolved_list" .Alerts.Resolved }}
{{ end }}
{{ end }}


{{ define "ding.link.title" }}{{ template "default.title" . }}{{ end }}
{{ define "ding.link.content" }}{{ template "default.content" . }}{{ end }}
{{ template "default.title" . }}
{{ template "default.content" . }}
```







---

> 作者: [SoulChild](https://www.soulchild.cn)  
> URL: https://www.soulchild.cn/post/2168/  

