# ajax_queue


## 实际场景：
 ajax 层的请求依赖一些共用数据，但是不想在业务层去控制这个依赖的逻辑。
 想集中到 ajax封装层的事件队列中处理！业务层只需要 提供依赖参数的字段既可！
 
 
## 实现
callback & promise then & mixins 模式！