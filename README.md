# SAP-DMEO
SAP-DMEO, use angularjs and angular-route

# 单页应用可能带来的问题
1. js、css冲突

模块css、js与主框架css、js冲突的问题。冲突场景如：引入三方js组件库，自定义模块样式，js写法不规范。

2. js、css需要能按需加载。

传统项目中，各个模块的js、css希望在被使用的时候加载，而非是一开始就加载。

好处：

1. 框架布局抛弃iframe，从而可以避免dialog遮罩层不全、iframe高度需要动态计算的问题。

2. 性能更好，页面加载快。