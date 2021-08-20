# treeAndSearch  
```javascript
let option = {
        elem: '#tree',//根标签id或className
        width: '100%',//设置宽度number类型和字符串没有限制，但是number类型默认是px单位
        height: 30,//同上设置input高度
        treeBoxHeight: '100%',//设置树显示区域高度如不设置树会自动撑开高度
        data: '',//数据结构
        inputPlaceholder:'点击选择大纲',
        inputNameAttribute:'syllabusNode',
        setDefaultInputValue:'this is default value',
        showList: true,//设置是否默认展开必须要传
        fuzzSearch: true,//模糊搜索开启
        boxSizing: true,//浮窗固定，横向滚动条取消，根据默认宽度展示所有节点宽度不足时换行
        drag: true,//允许拖动
        crud: true,//开启增删改
        checked:true,//复选框开启/关闭
        defaultChecked:false,
        fixed: true,//树组件固定失去select选择框的特性
        fooFuzzSearchEventListener(value,fulfilled) {
            console.log(value)
            fulfilled()
        },
        checkedListener: function (e) {//复选框触发change事件后的回调
            console.log(e)
        },
        click: function (node, trueNode, close) {//点击事件回调，参数1为基本数据，参数2为真实node节点
            console.log(node, trueNode)
            close()
        },
        dblclick: function (node, trueNode) {
            console.log(node, trueNode)
        },
        dragEvent: function (data, fulfilled, reject) {//drag事件回调，参数1为返回的数据，参数2是修改之后调用的函数，参数3是修改失败调用的函数
            console.log(data)
            fulfilled()
            // reject('404not found')
        },
        add: function (data, node, fulfilled) {
            fulfilled(value, result)//crud新增功能的fulfilled第二个参数为新数据不传会导致节点没有id进而不能增删改
        },
        del: function (data, fulfilled, reject) {
            console.log(data)
            fulfilled()
            // reject('404not found')
        },
        modify: function (data, fulfilled, reject) {
            console.log(data)
            fulfilled()
            // reject('404not found')
        },
    }
    treeAndSearch(option);
    treeAndSearch.reload(data)
```
