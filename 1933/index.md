# k8s部署prometheus+alertmanager+grafana

<!--more-->
## 一、prometheus
### 1.创建pv、pvc
```yaml
apiVersion: v1
kind: PersistentVolume
metadata:
  name: prometheus
spec:
  capacity:
    storage: 10Gi
  accessModes:
  - ReadWriteOnce
  persistentVolumeReclaimPolicy: Retain
  nfs:
    server: 10.0.0.10
    path: /nfsdata/
---
apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  name: prometheus
  namespace: kube-ops
spec:
  accessModes:
  - ReadWriteOnce
  resources:
    requests:
      storage: 10Gi
```

### 2.配置rbac
```yaml
apiVersion: v1
kind: ServiceAccount
metadata:
  name: prometheus
  namespace: kube-ops

---
apiVersion: rbac.authorization.k8s.io/v1
kind: ClusterRole
metadata:
  name: prometheus
rules:
- apiGroups:
  - ""
  resources:
  - nodes
  - services
  - endpoints
  - pods
  - nodes/proxy
  verbs:
  - get
  - list
  - watch
- apiGroups:
  - ""
  resources:
  - configmaps
  - nodes/metrics
  verbs:
  - get
- nonResourceURLs:
  - /metrics
  verbs:
  - get

---
apiVersion: rbac.authorization.k8s.io/v1
kind: ClusterRoleBinding
metadata:
  name: prometheus
roleRef:
  apiGroup: ""
  kind: ClusterRole
  name: prometheus
subjects:
  - kind: ServiceAccount
    name: prometheus
    namespace: kube-ops
```

### 3.创建service
```yaml
apiVersion: v1
kind: Service
metadata:
  name: prometheus
  namespace: kube-ops
  annotations:
    prometheus.io/scrape: "true"
    prometheus.io/port: "9090"
spec:
  selector:
    app: prometheus
  type: NodePort
  ports:
    - name: http
      port: 9090
      targetPort: http
      nodePort: 30002
```

### 4.创建configmap
```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: prometheus-conf
  namespace: kube-ops
data:
  rules.yml: |
    groups:
    - name: 系统硬件告警
      rules:
      - alert: NodeFilesystemUsage
        expr: (node_filesystem_size_bytes{mountpoint="/rootfs"} -  node_filesystem_free_bytes{mountpoint="/rootfs"} ) / node_filesystem_size_bytes{mountpoint="/rootfs"} * 100 > 80
        for: 10s
        labels:
          filesystem: node
        annotations:
          summary: "{{ $labels.instance }}:磁盘使用量"
          description: "{{ $labels.instance }}: rootfs使用{{ $value }},大于总容量的80%"
      - alert: NodeMemoryUsage
        expr: (node_memory_MemTotal_bytes - (node_memory_MemFree_bytes + node_memory_Buffers_bytes + node_memory_Cached_bytes)) / node_memory_MemTotal_bytes * 100 > 90
        for: 10s
        labels:
          team: node
        annotations: 
          summary: "{{ $labels.instance }}: node节点内存使用过高"
          description: "{{ $labels.instance }}: 内存使用大于90%，当前已用{{ $value }}%"
  prometheus.yml: |
    global:
      scrape_interval:     15s
      evaluation_interval: 15s
    alerting:
      alertmanagers:
      - static_configs:
        - targets: ["alertmanager:9093"]
    rule_files:
    - "/etc/prometheus/rules.yml"
      # - "second.rules"

    scrape_configs:
      - job_name: prometheus
        static_configs:
        - targets: ['localhost:9090']
      - job_name: node_exporter
        kubernetes_sd_configs:
        - role: node
        relabel_configs:
        - source_labels: [__address__]
          regex: "(.*):10250"
          target_label: __address__
          replacement: "${1}:9100"
        - action: labelmap
          regex: "__meta_kubernetes_node_label_(.*)"
      - job_name: 'kubernetes-kubelet'
        scheme: https
        tls_config:
          ca_file: /var/run/secrets/kubernetes.io/serviceaccount/ca.crt
          insecure_skip_verify: true
        bearer_token_file: /var/run/secrets/kubernetes.io/serviceaccount/token
        kubernetes_sd_configs:
        - role: node
        relabel_configs:
        - action: labelmap
          regex: __meta_kubernetes_node_label_(.+)
      - job_name: 'kubernetes-cadvisor'
        kubernetes_sd_configs:
        - role: node
        scheme: https
        tls_config:
          ca_file: /var/run/secrets/kubernetes.io/serviceaccount/ca.crt
          insecure_skip_verify: true
        bearer_token_file: /var/run/secrets/kubernetes.io/serviceaccount/token
        relabel_configs:
        - action: labelmap
          regex: __meta_kubernetes_node_label_(.+)
        - action: replace
          source_labels: [__meta_kubernetes_node_name]
          regex: (.*)
          target_label: __metrics_path__
          replacement: /api/v1/nodes/${1}/proxy/metrics/cadvisor
        - action: replace
          source_labels: [__address__]
          target_label: __address__
          replacement: kubernetes.default.svc:443
      - job_name: 'kubernetes-api-services'
        scheme: https
        tls_config:
          ca_file: /var/run/secrets/kubernetes.io/serviceaccount/ca.crt
        bearer_token_file: /var/run/secrets/kubernetes.io/serviceaccount/token
        kubernetes_sd_configs:
        - role: endpoints
        relabel_configs:
        - action: replace
          source_labels: [__address__]
          target_label: __address__
          replacement: kubernetes.default:443
        - action: keep
          source_labels: [__meta_kubernetes_namespace,__meta_kubernetes_endpoint_port_name,__meta_kubernetes_service_name]
          regex: default;https;kubernetes
        - action: labelmap
          regex: __meta_kubernetes_(.+)
      - job_name: 'kubernetes-service-endpoints'
        kubernetes_sd_configs:
        - role: endpoints
        relabel_configs:
        - source_labels: [__meta_kubernetes_service_annotation_prometheus_io_scrape]
          action: keep
          regex: true
        # 将label标签中的端口替换为annotations中指定的端口
        - action: replace
          source_labels: [__address__,__meta_kubernetes_service_annotation_prometheus_io_port]
          target_label: __address__
          regex: (.*?):(\d+);(\d+)
          replacement: ${1}:${3}
        # 动态获取scheme，确保http和https都可以进行采集
        - action: replace
          source_labels: [__meta_kubernetes_service_annotation_prometheus_io_scheme]
          target_label: __scheme__
          regex: (https?)
        - source_labels: [__meta_kubernetes_service_annotation_prometheus_io_path]
          action: replace
          target_label: __metrics_path__
          regex: (.+)
        - source_labels: [__address__, __meta_kubernetes_service_annotation_prometheus_io_port]
          action: replace
          target_label: __address__
          regex: ([^:]+)(?::\d+)?;(\d+)
          replacement: $1:$2
        - action: labelmap
          regex: __meta_kubernetes_service_label_(.+)
        - source_labels: [__meta_kubernetes_namespace]
          action: replace
          target_label: kubernetes_namespace
        - source_labels: [__meta_kubernetes_service_name]
          action: replace
          target_label: kubernetes_name
```


### 5.部署node_exporter
```yaml
apiVersion: extensions/v1beta1
kind: DaemonSet
metadata:
  name: node-exporter
  namespace: kube-ops
  labels:
    name: node-exporter
spec:
  template:
    metadata:
      labels:
        name: node-exporter
    spec:
      hostPID: true
      hostIPC: true
      hostNetwork: true
      containers:
      - name: node-exporter
        image: prom/node-exporter:v0.16.0
        ports:
        - containerPort: 9100
        resources:
          requests:
            cpu: 0.15
        securityContext:
          privileged: true
        args:
        - --path.procfs
        - /host/proc
        - --path.sysfs
        - /host/sys
        - --collector.filesystem.ignored-mount-points
        - '"^/(sys|proc|dev|host|etc)($|/)"'
        volumeMounts:
        - name: dev
          mountPath: /host/dev
        - name: proc
          mountPath: /host/proc
        - name: sys
          mountPath: /host/sys
        - name: rootfs
          mountPath: /rootfs
      tolerations:
      - key: "node-role.kubernetes.io/master"
        operator: "Exists"
        effect: "NoSchedule"
      volumes:
        - name: proc
          hostPath:
            path: /proc
        - name: dev
          hostPath:
            path: /dev
        - name: sys
          hostPath:
            path: /sys
        - name: rootfs
          hostPath:
            path: /
```




### 6.部署prometheus deployment
```yaml
apiVersion: extensions/v1beta1
kind: Deployment
metadata:
  name: prometheus
  namespace: kube-ops
  labels:
    app: prometheus
spec:
  selector:
    matchLabels:
      app: prometheus
  template:
    metadata:
      labels:
        app: prometheus
    spec:
      serviceAccountName: prometheus
      containers:
      - name: prometheus
        image: prom/prometheus:v2.15.2
        command:
        - "/bin/prometheus"
        args:
        - "--config.file=/etc/prometheus/prometheus.yml"
        - "--storage.tsdb.path=/prometheus"
        - "--storage.tsdb.retention=7d"
        - "--web.enable-admin-api"
        - "--web.enable-lifecycle"
        ports:
        - name: http
          containerPort: 9090
          protocol: TCP
        volumeMounts:
        - name: config
          mountPath: "/etc/prometheus"
        - name: data
          subPath: prometheus
          mountPath: "/prometheus"
        resources:
          requests:
            cpu: 0.05
            memory: 512Mi
          limits:
            cpu: 1
            memory: 2Gi
      volumes:
      - name: config
        configMap:
          name: prometheus-conf
      - name: data
        persistentVolumeClaim:
          claimName: prometheus
```

## 二、alertmanager
1.configmap
```
apiVersion: v1
kind: ConfigMap
metadata:
  name: alert-config
  namespace: kube-ops
data:
  wechat.tmpl: |-
    {{ define "__alert_list" }}{{ range . -}}
    告警名称: {{ index .Annotations "summary" }}
    告警级别: {{ .Labels.severity }}
    告警主机: {{ .Labels.instance }}
    告警信息: {{ index .Annotations "description" }}
    维护团队: {{ .Labels.team | toUpper }}
    告警时间: {{ .StartsAt.Format "2006-01-02 15:04:05" }}
    ------------------------------
    {{ end -}}{{ end }}
    
    {{ define "__resolved_list" }}{{ range . -}}
    告警名称: {{ index .Annotations "summary" }}
    告警级别: {{ .Labels.severity }}
    告警主机: {{ .Labels.instance }}
    告警信息: {{ index .Annotations "description" }}
    维护团队: {{ .Labels.team | toUpper }}
    告警时间: {{ .StartsAt.Format "2006-01-02 15:04:05" }}
    恢复时间: {{ .EndsAt.Format "2006-01-02 15:04:05" }}
    ------------------------------
    {{ end -}}{{ end }}
    
    {{ define "wechat.tmpl" }}
    {{- if gt (len .Alerts.Firing) 0 -}}
    ====侦测到{{ .Alerts.Firing | len  }}个故障====
    {{ template "__alert_list" .Alerts.Firing }}
    {{ end -}}
    {{- if gt (len .Alerts.Resolved) 0 -}}
    ====恢复{{ .Alerts.Resolved | len  }}个故障====
    {{ template "__resolved_list" .Alerts.Resolved }}
    {{- end -}}
    {{ end }}
  config.yml: |-
    templates:
    - '/etc/alertmanager/*.tmpl'
    global:
      # 在没有报警的情况下声明为已解决的时间
      resolve_timeout: 5m
      # 配置邮件发送信息
      smtp_smarthost: 'smtp.qq.com:465'
      smtp_from: '742899387@qq.com'
      smtp_auth_username: '742899387@qq.com'
      smtp_auth_password: '123123123'
      smtp_require_tls: false
    # 所有报警信息进入后的根路由，用来设置报警的分发策略
    route:
      # 这里的标签列表是接收到报警信息后的重新分组标签，例如，接收到的报警信息里面有许多具有 cluster=A 和 alertname=LatncyHigh 这样的标签的报警信息将会批量被聚合到一个分组里面
      group_by: ['alertname', 'cluster']
      # 当一个新的报警分组被创建后，需要等待至少group_wait时间来初始化通知，这种方式可以确保您能有足够的时间为同一分组来获取多个警报，然后一起触发这个报警信息。
      group_wait: 10s

      # 当第一个报警发送后，等待'group_interval'时间来发送新的一组报警信息。
      group_interval: 1m

      # 每30分钟发送一次报警,直至恢复为止
      repeat_interval: 30m

      # 默认的receiver：如果一个报警没有被一个route匹配，则发送给默认的接收器
      receiver: default

      # 上面所有的属性都由所有子路由继承，并且可以在每个子路由上进行覆盖。
      routes:
        # 告警规则中标签含有filesystem=node的报警会通过webhook接收器发送
      - receiver: dingtalk
        match:
          severity: critical
        
     # - receiver: email
     #   group_wait: 10s
     #   match:
     #     team: node
    receivers:
    - name: 'default'
      email_configs:
      - to: '742899387@qq.com'
        send_resolved: true
    - name: 'dingtalk'
      webhook_configs:
      - url: 'http://prometheus-webhook-dingtalk.kube-ops.svc.cluster.local:8060/dingtalk/webhook_mention_users/send'
        send_resolved: true
   # - name: 'wechat'
   #   wechat_configs:
   #   - send_resolved: true
   #     api_secret: ''
   #     corp_id: ''
   #     agent_id: ''
   #     to_party: ''
   #     message: '{{ template "wechat.tmpl" . }}'
```

```
kind: Deployment
apiVersion: extensions/v1beta1
metadata:
  name: alertmanager
  namespace: kube-ops
  labels:
    app: alertmanager
spec:
  template:
    metadata:
      name: alertmanager
      labels:
        app: alertmanager
    spec:
      containers:
      - name: alertmanager
        image: prom/alertmanager:v0.21.0
        args:
        - "--config.file=/etc/alertmanager/config.yml"
        - "--storage.path=/alertmanager/data"
        #- "--log.level=debug"
        ports:
        - name: http
          containerPort: 9093
        volumeMounts:
        - name: conf
          mountPath: /etc/alertmanager/
        resources:
          requests:
            cpu: 100m
            memory: 256Mi
          limits:
            cpu: 100m
            memory: 256Mi
      volumes:
      - name: conf
        configMap:
          name: alert-config
---
kind: Service
apiVersion: v1
metadata:
  name: alertmanager
  namespace: kube-ops
spec:
  type: ClusterIP
  ports:
  - name: alertmanager
    port: 9093
    targetPort: http
  selector:
    app: alertmanager
---
apiVersion: networking.k8s.io/v1beta1
kind: Ingress
metadata:
  name: alertmanager
  namespace: kube-ops
  annotations:
    kubernetes.io/ingress.class: "nginx"
    #nginx.ingress.kubernetes.io/auth-type: basic
    #nginx.ingress.kubernetes.io/auth-secret: alertmanager-basic-auth
spec:
  rules:
  - host: alert.soulchild.cn
    http:
      paths:
      - path: /
        backend:
          serviceName: alertmanager
          servicePort: http
```


## 三、grafana
### 1.创建pv、pvc
```yaml
---
apiVersion: v1
kind: PersistentVolume
metadata:
  name: grafana
spec:
  nfs:
    path: /nfsdata/
    server: 10.0.0.10
  capacity:
    storage: 1Gi
  accessModes: [ReadWriteOnce]
  persistentVolumeReclaimPolicy: Retain
---
apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  name: grafana
  namespace: kube-ops
spec:
  accessModes: [ReadWriteOnce]
  resources:
    requests:
      storage: 1Gi
```

### 2.创建configmap
```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: grafana-conf
  namespace: kube-ops
data:
  grafana.ini: |
    [server]
    protocol = http  # 访问协议，默认http
    http_port = 3000  # 监听的端口，默认是3000
    root_url = http://1.3.4.1:30003 # 这是一个web上访问grafana的全路径url，默认是%(protocol)s://%(domain)s:%(http_port)s/
    router_logging = false  # 是否记录web请求日志，默认是false
    enable_gzip = true
    [smtp]
    enabled = true
    host = smtp.exmail.qq.com:587
    user = 742899387@qq.com
    password = aaa
    skip_verify = true
    from_address = 742899387@qq.com
    from_name = Grafana
    [alerting]
    enable = true
    execute_alerts = true
```

### 3.创建deployment
```yaml
apiVersion: extensions/v1beta1
kind: Deployment
metadata:
  name: grafana
  namespace: kube-ops
  labels:
    app: grafana
spec:
  revisionHistoryLimit: 5
  template:
    metadata:
      labels:
        app: grafana
    spec:
      containers:
      - name: grafana
        image: grafana/grafana:6.7.1
        imagePullPolicy: IfNotPresent
        securityContext:
            runAsUser: 472
            runAsGroup: 472
        ports:
        - name: web
          containerPort: 3000
          protocol: TCP
        resources:
          requests:
            cpu: 100m
            memory: 512Mi
          limits:
            cpu: 100m
            memory: 512Mi
        readinessProbe:
          initialDelaySeconds: 5
          periodSeconds: 30
          successThreshold: 1
          failureThreshold: 5
          timeoutSeconds: 10
          httpGet:
            path: /api/health
            port: 3000
            scheme: HTTP
        livenessProbe:
          failureThreshold: 5
          successThreshold: 1
          timeoutSeconds: 10
          periodSeconds: 30
          httpGet:
            path: /api/health
            port: 3000
            scheme: HTTP
        volumeMounts:
        - name: config
          mountPath: /etc/grafana
        - name: data
          mountPath: /var/lib/grafana/
          subPath: grafana
      initContainers:
        - name: change-dir
          image: busybox
          command: ["chown","-R","472.472","/var/lib/grafana"]
          volumeMounts:
            - mountPath: /var/lib/grafana/
              subPath: grafana
              name: data
      volumes:
      - name: config
        configMap:
          name: grafana-conf
      - name: data
        persistentVolumeClaim:
          claimName: grafana
```

### 4.创建service
```yaml
apiVersion: v1
kind: Service
metadata:
  name: grafana
  namespace: kube-ops
spec:
  type: NodePort
  selector:
    app: grafana
  ports:
    - port: 3000
      targetPort: web
      nodePort: 30003
```



---

> 作者: [SoulChild](https://www.soulchild.cn)  
> URL: https://www.soulchild.cn/1933/  

