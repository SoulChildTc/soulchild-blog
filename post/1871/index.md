# yaml模板

<!--more-->

```yaml
apiVersion: v1
kind: Service
metadata:
  labels:
    app: gateway
  name: gateway
  namespace: {nameSpace}
spec:
  ports:
  - name: gateway
    port: 80
    protocol: TCP
    targetPort: http
  selector:
    app: gateway
  type: ClusterIP
---
apiVersion: apps/v1
kind: Deployment
metadata:
  name: gateway
  namespace: {nameSpace}
spec:
  replicas: {replicas}
  selector:
    matchLabels:
      app: gateway
  template:
    metadata:
      labels:
        app: gateway
    spec:
      imagePullSecrets:
      - name: registry-secret
      containers:
      - name: gateway
        resources:
         requests:
           cpu: {request_cpu}
           memory: {request_memory}
         limits:
           cpu: {limit_cpu}
           memory: {limit_memory}
        image: {imageName}
        ports:
        - containerPort: 80
          name: http
        env:
        - name: JAVA_OPTS
          value: "-XX:+UnlockExperimentalVMOptions -XX:+UseCGroupMemoryLimitForHeap -XX:MinRAMPercentage=70.0 -XX:MaxRAMPercentage=80.0 -XX:+HeapDumpOnOutOfMemoryError"
        command: ["/bin/sh"]
        args: ["-c","java $JAVA_OPTS -Dspring.profiles.active={deployEnv} -Djava.security.egd=file:/dev/./urandom -jar /gateway.jar"]
        readinessProbe:
          httpGet:
            path: /actuator/info
            port: http
            scheme: HTTP
          initialDelaySeconds: 30
          periodSeconds: 30
          failureThreshold: 5
          successThreshold: 1
          timeoutSeconds: 30
        livenessProbe:
          httpGet:
            path: /actuator/info
            port: http
            scheme: HTTP
          initialDelaySeconds: 60
          periodSeconds: 30
          failureThreshold: 3
          successThreshold: 1
          timeoutSeconds: 30
---
apiVersion: networking.k8s.io/v1beta1
kind: Ingress
metadata:
  name: gateway
  namespace: {nameSpace}
  annotations:
    kubernetes.io/ingress.class: "nginx"
    nginx.ingress.kubernetes.io/use-regex: "true"
spec:
  rules:
  - host: {domainName}
    http:
      paths:
      - backend:
          serviceName: gateway
          servicePort: gateway
```


---

> 作者: [SoulChild](https://www.soulchild.cn)  
> URL: https://www.soulchild.cn/post/1871/  

