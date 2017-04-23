'use strict';
 
//测试类型描述，这里表示测试unitTestApp的controllers
describe('unitTestApp controllers', function() {
 
  //测试类型描述，这里表示测试unitTestCtrl这个controller
  describe('unitMainController', function(){
      
    //beforeEach 表示在运行所有测试前的准备工作。
    //这里生成unitTestApp 的module
    beforeEach(module('scotchApp'));
    
    //定义在测试中会用到的object,以便在整个测试环境中使用
    var scope,ctrl;

        //inject利用angular的依赖注入，将需要的模块,服务插入作用域
    beforeEach(inject(function ($controller, $rootScope) {
        //模拟生成scope, $rootScope是angular中的顶级scope，angular中每个controller中的     
        //scope都是rootScope new出来的
        scope = $rootScope.$new();
        //模拟生成controller 并把先前生成的scope传入以方便测试
        ctrl = $controller('mainController', {$scope: scope});
    }));
        
    //测试从这里开始
    // it 里'should create name william wood in unitTestCtrl' 说明测试的项目
    it('should create message in unit mainController', 
       inject(function() {
        //测试期望 scope.name 的值为 william wood  
        expect(scope.message).toEqual('Everyone come and see how good I look!');
    }));
 
    //测试GetUser函数，详细将在下面介绍 
    // it('GetUser should fetch users', inject(function($injector){
    //        ....        
    // }));
  });
});