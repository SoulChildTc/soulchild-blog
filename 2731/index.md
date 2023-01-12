# ant design组件响应式换行

<!--more-->
两种
```bash
return(
<>
      {/* 珊格-Flex填充 */}
      <Divider orientation="left">Raw flex style</Divider>
      <Row gutter={[16,16]}>
        <Col flex="1 1 400px">
          <ProCard>1</ProCard>
        </Col>
        <Col flex="1 1 400px">
          <ProCard>2</ProCard>
        </Col>
        <Col flex="1 1 400px">
          <ProCard>3</ProCard>
        </Col>
      </Row>


      {/*
        gutter设置珊格之间的水平和垂直间距
        colSpan设置在不同窗口大小下的显示大小。一行占满是24。
        窗口大小从小到大分别是xs, sm, md, lg, xl
      */}
      <ProCard style={{ marginTop: 8 }} gutter={[16, 16]} wrap>
        <ProCard colSpan={{sm: 24, md: 8}} bordered headerBordered title="bt1" extra="extra" tooltip="这是提示">
          Col
        </ProCard>
        <ProCard colSpan={{sm: 24, md: 8}} bordered headerBordered title="bt2" extra="extra" tooltip="这是提示">
          Col
        </ProCard>
        <ProCard colSpan={{sm: 24, md: 8}} bordered headerBordered title="bt3" extra="extra" tooltip="这是提示">
          Col
        </ProCard>

      </ProCard>
    </>
);
```


---

> 作者: [SoulChild](https://www.soulchild.cn)  
> URL: https://www.soulchild.cn/2731/  

