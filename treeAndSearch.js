let allowDrag
let beforeNode
let afterNode
let beforeNodeParent
let afterNodeParent
let dragIng
let ghostStorage
let random
let crud
let intShowList
let root
let radius
let init
let checkedArr=[]
let testData = [{"id":"1","name":"无数据","title":"无数据",children:[{"id":"2","name":"无数据","title":"无数据",children:[{"id":"3","name":"无数据","title":"无数据",children:[]}]}]}]
let publicNodeTreeRoot
let isBlur=true
let treeBox
function treeAndSearch(int){
    if(int&&int.data&&int.data instanceof Array){}else {int.data=testData}
    init = int
    // 创建需要用到的元素
    let input=document.createElement('input')
    let treeNodeRoot=document.createElement('ul')
    let floatBox=document.createElement('div')
    // 定义全局变量
    treeBox=treeNodeRoot
    publicNodeTreeRoot=floatBox
    crud=int.crud
    random=Math.random()
    intShowList=int.showList
    if(int.radius) radius=int.radius
    //如果用户设置了drag参数，则将alloDrag全局参数设置为true
    if(int.drag) allowDrag=true
    // 查找根标签
    let nodeRoot=document.querySelector(int.elem)
    root=nodeRoot
    // 创建ghost缓存框
    let ghostBox=document.createElement('div')
    ghostBox.style=`position:absolute;left:-25000px;`
    nodeRoot.appendChild(ghostBox)
    ghostStorage=ghostBox
    // 设置创建的元素样式
    input.setAttribute('style',`width:${int.width?(typeof int.width=='string'?int.width:int.width+'px'):'100%'};
    height:${int.width?(typeof int.height=='string'?int.height:int.height+'px'):'100%'};outline:none;box-shadow: none;text-indent:10px`)
    if(init.setDefaultInputValue){input.value=init.setDefaultInputValue}
    if(init.inputPlaceholder) input.setAttribute('placeholder',init.inputPlaceholder)
    if(init.inputNameAttribute) input.setAttribute('name',init.inputNameAttribute)
    treeNodeRoot.setAttribute('style',`display:${init.fixed?'block':'none'||init.fuzzSearch?'none':'block'};width:${int.width?(typeof int.width=='string'?int.width:int.width+'px'):'100%'};
    overflow-y:scroll;height:${int.width?(typeof int.treeBoxHeight=='string'?int.treeBoxHeight:int.treeBoxHeight+'px'):'100%'};background:#fff;position:relative;z-index:2000;`)
    treeNodeRoot.classList.add('treeBoxStyle')
    let setTreeNodeRootStyle=document.createElement('style')
    setTreeNodeRootStyle.innerHTML=`.treeBoxStyle::-webkit-scrollbar{width:5px;background:transparent;height:5px;}.treeBoxStyle::-webkit-scrollbar-track{display:none;}
    .treeBoxStyle::-webkit-scrollbar-thumb{width:5px;height:20px;background:#19a9a9;}.addIconHover:hover{color:#999999;}.delIconHover:hover{color:#999999;}.modifyIconHover:hover{color:#999999}
    .nodes::after{content: "";position: absolute;top: 15px;left: 1px;width: 18px;height: 0;border-top: 1px dotted #c0c4cc;}
    .floatBox > ul,.floatBox > li{border-left:none!important;padding-left:7px!important;}.floatBox > ul::after{border-top:none;} .floatBox > li::after{border-top:none;}
    .floatBox > ul > i{left:-1px!important;}.floatBox > li > i{left:-1px!important;}.floatBox > ul > [type=checkbox]{left:18px!important;}.floatBox > li > [type=checkbox]{left:18px!important;}`
    floatBox.style='float:left;box-sizing:border-box;padding-left:10px;'
    floatBox.classList.add('floatBox')
    treeNodeRoot.appendChild(floatBox)
    document.head.appendChild(setTreeNodeRootStyle)
    // 修改根节点样式
    nodeRoot.style.userSelect='none'
    // 注入根节点|节点
    if(int.fuzzSearch) nodeRoot.appendChild(input)
    nodeRoot.appendChild(treeNodeRoot)
    // 递归遍历树创建节点
    fooCreateNodeTree(init.data,floatBox,int.showList)
    // 根节点点击事件委托
    nodeRoot.addEventListener('click',function(e){
        if(e.target.showList&&e.target.showList==true){
            e.target.style.height='27px'
            e.target.showList=!e.target.showList
            e.target.children[0].classList.remove('icon-shujiegou-zhankai')
            e.target.children[0].classList.add('icon-shujiegou-shouqi')
        }else if(e.target.showList==false){
            e.target.style.height=''
            e.target.showList=!e.target.showList
            e.target.children[0].classList.remove('icon-shujiegou-shouqi')
            e.target.children[0].classList.add('icon-shujiegou-zhankai')
        }
    })
    //根节点移入移出事件委托
    nodeRoot.addEventListener('mouseover',function (e){
        if(e.target[random]==random) {
            let foundDiv=foundRightNode('tagName',e.target.childNodes,'SPAN')
            foundDiv.style.textDecoration= 'underline'
        }else if(e.target[random+'textContent']==random+'textContent'){
            e.target.style.textDecoration= 'underline'
        }
        if(init.crud){
            if(e.target[random]==random) {
                let foundDiv=foundRightNode('tagName',e.target.children,'SPAN')
                foundDiv.children[0].style.display = 'flex'
            }else if(e.target[random+'textContent']==random+'textContent'){
                let foundDiv=foundRightNode('tagName',e.target.parentNode.children,'SPAN')
                foundDiv.children[0].style.display = 'flex'
            }
        }

    })
    nodeRoot.addEventListener('mouseout',function (e){
        if(e.target[random]==random) {
            let foundDiv=foundRightNode('tagName',e.target.childNodes,'SPAN')
            foundDiv.style.textDecoration= 'none'
        }else if(e.target[random+'textContent']==random+'textContent'){
            e.target.style.textDecoration= 'none'
        }
        if(init.crud){
            if(e.target[random]==random) {
                let foundDiv=foundRightNode('tagName',e.target.children,'SPAN')
                foundDiv.children[0].style.display = 'none'
            }else if(e.target[random+'textContent']==random+'textContent'){
                let foundDiv=foundRightNode('tagName',e.target.parentNode.children,'SPAN')
                foundDiv.children[0].style.display = 'none'
            }
        }
    })
    // 搜索,模糊搜索,节流
    let timeOut
    input.addEventListener('input',function (e){
        function fulfilled(responeData){
            if(timeOut) clearTimeout(timeOut)
            timeOut=setTimeout(()=>{
                if(responeData) init.data=responeData
                fooFuzzSearch(e.target.value,init.data,floatBox,int.showList)
            },300)
        }
        init.fooFuzzSearchEventListener(e.target.value,fulfilled)
    })
    // input焦点事件监听
    input.addEventListener('focus',function (){
        treeNodeRoot.style.display='block'
    })
    if(int.drag){
        // nodeTreeDrag 拖动事件
        floatBox.addEventListener('dragstart',function (e){
            let foundDiv=foundRightNode('tagName',e.target.children,'SPAN')
            foundDiv.style.textDecoration='none'
            if(init.crud)foundDiv.children[0].style.display='none'//将当前目标的增删改盒子元素样式恢复默认
            if(e.target.showList) {
                e.target.children[0].classList.add('icon-shujiegou-zhankai')
                e.target.children[0].classList.add('icon-shujiegou-shouqi')
            }
            e.target.style.height='27px'
            e.target.style.overflow='hidden'
            let dragGhostStyle=document.createElement('div')
            let nodeArrow=document.createElement('i')
            nodeArrow.classList.add('iconfont')
            nodeArrow.innerHTML='&#xe609;'
            nodeArrow.style='padding-right:10px;'
            dragGhostStyle.innerText=e.target.name
            dragGhostStyle.style=`background:#19a9a9;border:1px solid #fff;border-radius:10px 10px;padding:0 15px;width:${e.target.name.length>16?'260px':''};`
            dragGhostStyle.insertBefore(nodeArrow,dragGhostStyle.lastChild)
            ghostStorage.appendChild(dragGhostStyle)
            e.dataTransfer.setDragImage(dragGhostStyle,e.layerX>260?130:e.layerX,e.layerY)
            dragIng=e.target
            beforeNode=e.target
            beforeNodeParent=e.target.parentNode
        },false)
        //拖动时移入移出触发的事件
        floatBox.addEventListener('dragenter',function (e){
            if(e.target[random+'textContent']==random+'textContent') {
                if(e.target.parentNode==beforeNode) return
                e.target.parentNode.style.border = '1px solid #117676'
                if(e.target.parentNode.children.length>4){
                    e.target.parentNode.style.height=''
                    e.target.parentNode.showList=true
                    let foundI = foundRightNode('tagName',e.target.parentNode.children,'I')
                    foundI.classList.remove('icon-shujiegou-shouqi')
                    foundI.classList.add('icon-shujiegou-zhankai')
                }
            }
        })
        floatBox.addEventListener('dragleave',function (e){
            if(e.target[random+'textContent']==random+'textContent') {
                if(e.target.parentNode==beforeNode) return
                e.target.parentNode.style.borderColor = 'transparent'
                e.target.parentNode.style.borderLeft= '1px dotted #c0c4cc'
            }
        })
        // nodeTreeDragend 释放事件
        floatBox.addEventListener('dragend',function (e){
            if(dragIng.showList){//下拉展开时拖动结束修改其样式
                let foundI=foundRightNode('tagName',dragIng.children,'I')
                foundI.classList.remove('icon-shujiegou-shouqi')
                foundI.classList.add('icon-shujiegou-zhankai')
                dragIng.style.overflow='hidden'
                dragIng.style.height=''
            }
            ghostStorage.innerHTML=''
            // dragIng=false
            // afterNode=false
            // beforeNode=false
            // beforeNodeParent=false
            // afterNodeParent=false
        },false)
        //获取目标数据
        floatBox.addEventListener('drop',function (e){
            afterNode=e.target.parentNode
            afterNodeParent=e.target.parentNode
            e.target.parentNode.style.borderColor = 'transparent'
            e.target.parentNode.style.borderLeft='1px dotted #c0c4cc'
            function fulfilled(){
                if(e.target[random+'textContent']&&e.target.parentNode==beforeNode) return
                if(e.target[random+'textContent']&&e.target.parentNode.children.length>4) {
                    e.target.parentNode.appendChild(beforeNode)
                }else if(e.target[random+'textContent']&&e.target.parentNode.children.length==4){
                    let foundI=foundRightNode('tagName',e.target.parentNode.children,'I')
                    foundI.classList.remove('icon-shujiegou-shouqi')
                    foundI.classList.add('icon-shujiegou-zhankai')
                    e.target.parentNode.showList=true
                    e.target.parentNode.style.height=''
                    e.target.parentNode.style.overflow='hidden';
                    e.target.parentNode.appendChild(beforeNode)
                }
                if(beforeNodeParent[random]&&beforeNodeParent.children.length==4) {
                    let foundI=foundRightNode('tagName',beforeNodeParent.children,'I')
                    beforeNodeParent.showList=undefined
                    foundI.classList.add('icon-shujiegou-jitubiao')
                    foundI.classList.remove('icon-shujiegou-zhankai')
                    foundI.classList.remove('icon-shujiegou-shouqi')
                }
                cutDatafoo('drag',init.data,e.target.parentNode.nodeId,beforeNode.nodeId)
            }
            let returnDragData={
                beforeNodeId:beforeNode.nodeId,
                afterNodeId:e.target.parentNode.nodeId,
                beforeNodePid:beforeNode.pid,
                afterNodePid:e.target.parentNode.pid
            }
            function reject(e){
                console.log(e)
            }
            if(e.target[random+'textContent']) {
                if(e.target[random+'textContent']&&e.target.parentNode==beforeNode) return 
                int.dragEvent(returnDragData, fulfilled, reject)
            }
        })
        //允许放置
        floatBox.addEventListener('dragover',function (e){e.preventDefault()})
    }
    // body点击事件监听
    if(int.click)document.body.addEventListener('click',function (e){
        if(e.target==input||e.target==treeNodeRoot||e.target==floatBox||e.target[random]||e.target[random+'crudBox']||e.target[random+'crudInput']||e.target[random+'textContent']||e.target[random+'checked']){
            if(e.target[random+'textContent']){
                let baseData={
                    name:e.target.parentNode.name,
                    id:e.target.parentNode.nodeId,
                    pid:e.target.parentNode.pid,
                    showList:e.target.parentNode.showList,
                    type:e.target.parentNode.nodeTyper,
                    isBloc:e.target.parentNode.isBloc,
                    [random]:random
                }
                int.click(baseData,e.target.parentNode,closeTreeBox)
                input.value=e.target.parentNode.name
            }
            if(e.target[random+'crudBox']==random+'add'){
                function fulfilled(name,newData){
                    cutDatafoo('add',init.data,e.target.parentNode.parentNode.parentNode.nodeId,name)
                    publicNodeTreeRoot.innerHTML=''
                    if(newData)init.data=newData
                    fooCreateNodeTree(newData?newData:init.data,publicNodeTreeRoot,init.showList)
                }
                let baseData={
                    name:e.target.parentNode.parentNode.parentNode.name,
                    id:e.target.parentNode.parentNode.parentNode.nodeId,
                    pid:e.target.parentNode.parentNode.parentNode.pid,
                    showList:e.target.parentNode.parentNode.parentNode.showList,
                    type:e.target.parentNode.parentNode.parentNode.nodeTyper,
                    [random]:random
                }
                init.add(baseData,e.target.parentNode,fulfilled)
            }else if(e.target[random+'crudBox']==random+'del'){
                function fulfilled(){
                    e.target.parentNode.parentNode.parentNode.parentNode.removeChild(e.target.parentNode.parentNode.parentNode)
                    cutDatafoo('del',init.data,e.target.parentNode.parentNode.parentNode.nodeId,name)
                }
                function reject(e){
                    console.log(e)
                }
                let baseData={
                    name:e.target.parentNode.parentNode.parentNode.name,
                    id:e.target.parentNode.parentNode.parentNode.nodeId,
                    pid:e.target.parentNode.parentNode.parentNode.pid,
                    showList:e.target.parentNode.parentNode.parentNode.showList,
                    type:e.target.parentNode.parentNode.parentNode.nodeTyper,
                    [random]:random
                }
                init.del(baseData,fulfilled,reject)
            }else if(e.target[random+'crudBox']==random+'modify'){
                let found=foundRightNode(random+'crudInput',e.target.parentNode.parentNode.parentNode.children,random+'crudInput')
                found.style.display='block'
                found.focus()
            }
        }else {
            if(init.fuzzSearch) {
                if(init.fixed) return
                treeNodeRoot.style.display = 'none'
                if(init.closeCallback) init.closeCallback()
            }
        }
    })
    //body双击事件监听
    if(int.dblclick)document.body.addEventListener('dblclick',function (e){
        if(e.target==input||e.target==treeNodeRoot||e.target==floatBox||e.target[random]||e.target[random+'crudBox']||e.target[random+'crudInput']||e.target[random+'textContent']||e.target[random+'checked']){
            if(e.target[random+'textContent']){
                let baseData={
                    name:e.target.parentNode.name,
                    id:e.target.parentNode.nodeId,
                    pid:e.target.parentNode.pid,
                    showList:e.target.parentNode.showList,
                    type:e.target.parentNode.nodeTyper,
                    [random]:random
                }
                int.dblclick(baseData,e.target.parentNode)
            }
        }else {
            if(init.fuzzSearch) {
                if(init.fixed) return
                treeNodeRoot.style.display = 'none'
            }
        }
    })
}
treeAndSearch.reload=function (data){
    checkedArr=[]
    publicNodeTreeRoot.innerHTML=''
    if(data){
        init.data=data
        fooCreateNodeTree(data,publicNodeTreeRoot,init.showList)
    }else fooCreateNodeTree(init.data,publicNodeTreeRoot,init.showList)
}
function fCrud(node){
    let crudBox=document.createElement('div')
    let add=document.createElement('i')
    add.classList.add("iconfont")
    add.classList.add("addIconHover")
    // add.innerHTML='&#xe654;'
    add.style='pdding-right:10px;'
    add[random+'crudBox']=random+'add'
    let del=document.createElement('i')
    del.classList.add("iconfont")
    del.classList.add("delIconHover")
    // del.innerHTML='&#xe640;'
    del.style='pdding-right:10px;'
    del[random+'crudBox']=random+'del'
    let modify=document.createElement('i')
    modify.classList.add("iconfont")
    modify.classList.add("modifyIconHover")
    // modify.innerHTML='&#xe642;'
    modify.style='pdding-right:10px;'
    modify[random+'crudBox']=random+'modify'
    crudBox.appendChild(add)
    crudBox.appendChild(del)
    crudBox.appendChild(modify)
    crudBox.style='display:none;position:absolute;z-index:2002;top:0px;left:100%;transform:translate(10px,0);'
    crudBox[random+'crudBox']=random+'crudBox'
    crudBox.addEventListener('mouseenter',function (e){
        crudBox.style.display='flex'
    })
    crudBox.addEventListener('mouseleave',function (e){
        crudBox.style.display='none'
    })
    let crudInput=document.createElement('input')
    crudInput.style=`display:none;width:100%;border:none;position:absolute;top:6px;left:0px;padding-left:1px;z-index:2001;`
    crudInput.setAttribute('placeholder','')
    crudInput[random+'crudInput']=random+'crudInput'
    let nodeText
    let beforData
    let afterData
    crudInput.addEventListener('focus',function (e){
        let found=foundRightNode('tagName',e.target.parentNode.childNodes,'SPAN')
        let foundNodeText=foundRightNode('nodeType',found.childNodes,3)
        nodeText = foundNodeText
        beforData = foundNodeText.data
        e.target.value=''
    })
    crudInput.addEventListener('blur',function (e){
        let found=foundRightNode('tagName',e.target.parentNode.childNodes,'SPAN')
        function fulfilled(){
            if(afterData&&afterData.trim()=='') return nodeText.data = beforData
            if(found.textContent!==''&& afterData) {
                nodeText.data = afterData
                e.target.parentNode.name= afterData
                cutDatafoo('modify',init.data,nodeText.parentNode.parentNode.nodeId,afterData)
            }else{
                nodeText.data = beforData
                cutDatafoo('modify',init.data,nodeText.parentNode.parentNode.nodeId,beforData)
            }
        }
        function reject(e){
            console.log(e)
        }
        let baseData={
            name:afterData,
            id:nodeText.parentNode.parentNode.nodeId,
            pid:nodeText.parentNode.parentNode.pid,
            showList:nodeText.parentNode.parentNode.showList,
            type:nodeText.parentNode.parentNode.nodeTyper,
            [random]:random
        }
        if(isBlur==false) {
            isBlur=true
        }else if(afterData&&afterData.trim()!==''){
            init.modify(baseData,fulfilled,reject)
        }
        crudInput.style.display='none'
        document.querySelector('.treeBoxStyle').scrollLeft=0
    })
    crudInput.addEventListener('input',function (e){
        afterData = e.target.value
    })
    crudInput.addEventListener('keyup',function (e){
        if(e.key=='Enter') {
            isBlur=false
            if(afterData&&afterData.trim()==''){
                nodeText.data = beforData
                crudInput.blur()
                return
            }
            function fulfilled(){
                cutDatafoo('modify',init.data,nodeText.parentNode.parentNode.nodeId,afterData)
                nodeText.data = afterData
                e.target.parentNode.name=afterData
            }
            function reject(e){
                console.log(e)
            }
            let baseData={
                name:afterData,
                id:nodeText.parentNode.parentNode.nodeId,
                pid:nodeText.parentNode.parentNode.pid,
                showList:nodeText.parentNode.parentNode.showList,
                type:nodeText.parentNode.parentNode.nodeTyper,
                [random]:random
            }
            init.modify(baseData,fulfilled,reject)
            crudInput.blur()
            document.querySelector('.treeBoxStyle').scrollLeft=0
        }
    })
    let foundSpan=foundRightNode('tagName',node.children,'SPAN')
    node.appendChild(crudInput)
    foundSpan.appendChild(crudBox)
}
// 递归遍历创建node节点
function fooCreateNodeTree(nodeTree,root,showList,callbakcClickEvent){
    for(let i=0;i<nodeTree.length;i++){
        if(nodeTree[i].children!=null && nodeTree[i].children.length!==0){
            let node=document.createElement('ul')
            let isShowIcon=document.createElement('i')
            let textContent=document.createElement('span')
            textContent.setAttribute('style',`display:block;position:relative;margin:0px 56px 0px ${init.checked?29:16}px;font-size:16px;line-height:21px;`)
            textContent[random+'textContent']=random+'textContent'
            if(showList){
                isShowIcon.classList.add('icon-shujiegou-zhankai')
            }else {
                isShowIcon.classList.add('icon-shujiegou-shouqi')
            }
            isShowIcon.classList.add('iconfont')
            isShowIcon.setAttribute('style','pointer-events: none;position: absolute;top: 5px;left: 19px;color:#0371ff;font-size:17px;')
            node.appendChild(isShowIcon)
            node.setAttribute('style',`display:flex;align-items: center;justify-content: left;flex-wrap:wrap;width:100%;position:relative;cursor:pointer;padding:4px 0px 0px 27px;overflow:hidden;height:${showList?'':'27px'};white-space:nowrap;box-sizing:border-box;
            border:1px solid transparent;border-left:1px dotted #c0c4cc;`)
            node.classList.add('nodes')
            textContent.innerHTML+=nodeTree[i].name
            node[random]=random
            node.nodeId=nodeTree[i].id
            node.name=nodeTree[i].name
            node.pid=nodeTree[i].pid
            node.showList=showList
            node.nodeTyper=nodeTree[i].type
            node.checked=nodeTree[i].checked
            node.isBloc=nodeTree[i].isBloc
            let checkedBox=document.createElement('input')
            if(init.checked){
                let baseData={
                    id:node.nodeId,
                    name:node.name,
                    pid:node.pid,
                    showList:node.showList,
                    type:node.nodeTyper,
                    checked:node.checked,
                    isBloc:node.isBloc
                }
                checkedBox.setAttribute('type','checkbox')
                checkedBox.setAttribute('style','position:absolute;top:8px;left:38px')
                checkedBox.setAttribute('checked', '')
                if(init.defaultChecked==false){
                    checkedBox.checked=false
                }else if(init.defaultChecked&&init.defaultChecked==true){
                    checkedBox.checked=true
                    checkedArr.push(baseData)
                }else{
                    if(node.checked){
                        checkedBox.checked=true
                        checkedArr.push(baseData)
                    }
                    if(showList) {
                        checkedBox.checked=true
                        checkedArr.push(baseData)
                    }
                }
                checkedBox[random+'checked']=random+'checked'
                checkedBox.addEventListener('change',function (e){
                    if(e.target.checked){
                        let arr=[...checkedArr]
                        arr.push({
                            id:e.target.parentNode.nodeId,
                            name:e.target.parentNode.name,
                            pid:e.target.parentNode.pid,
                            showList:e.target.parentNode.showList,
                            type:e.target.parentNode.nodeTyper,
                            checked:e.target.parentNode.checked
                        })
                        checkedArr=[...new Set(arr)]
                        modifyCheckedFoo(e.target.parentNode.children,true)
                    }else {
                        for(let i=0;i<checkedArr.length;i++){
                            if(checkedArr[i].id==e.target.parentNode.nodeId) {
                                checkedArr.splice(i, 1)
                                modifyCheckedFoo(e.target.parentNode.children,false)
                            }
                        }
                    }
                    init.checkedListener(checkedArr)
                })
            }else {
                checkedBox.style='display:none;'
            }
            node.appendChild(checkedBox)
            node.appendChild(textContent)
            root.appendChild(node)
            if(crud) fCrud(node)
            if(allowDrag) node.setAttribute('draggable',true)
            fooCreateNodeTree(nodeTree[i].children,node,showList)
        }
        else if(nodeTree[i].type!='org' || init.visibilityOrg){
            let node=document.createElement('li')
            let isShowIcon=document.createElement('i')
            let textContent=document.createElement('span')
            textContent[random+'textContent']=random+'textContent'
            textContent.setAttribute('style',`display:block;position:relative;margin:0px 56px 0px ${init.checked?29:16}px;font-size:16px;line-height:21px;`)
            isShowIcon.classList.add('iconfont')
            isShowIcon.classList.add('icon-shujiegou-jitubiao')
            isShowIcon.setAttribute('style','pointer-events: none;position: absolute;top: 5px;left: 19px;color:#0371ff;font-size:17px;')
            node.setAttribute('style',`display:flex;align-items: center;justify-content: left;flex-wrap:wrap;width:100%;position:relative;cursor:pointer;padding:4px 0px 0px 27px;white-space:nowrap;box-sizing:border-box;
            border:1px solid transparent;border-left:1px dotted #c0c4cc;`)
            node.classList.add('nodes')
            node.appendChild(isShowIcon)
            textContent.innerHTML+=nodeTree[i].name
            node[random]=random
            node.nodeId=nodeTree[i].id
            node.name=nodeTree[i].name
            node.pid=nodeTree[i].pid
            node.nodeTyper=nodeTree[i].type
            node.checked=nodeTree[i].checked
            node.isBloc=nodeTree[i].isBloc
            let checkedBox=document.createElement('input')
            if(init.checked){
                let baseData={
                    id:node.nodeId,
                    name:node.name,
                    pid:node.pid,
                    showList:node.showList,
                    type:node.nodeTyper,
                    checked:node.checked,
                    isBloc:node.isBloc
                }
                checkedBox.setAttribute('type','checkbox')
                checkedBox.setAttribute('style','position:absolute;top:8px;left:38px')
                checkedBox.setAttribute('checked', '')
                if(init.defaultChecked==false){
                    checkedBox.checked=false
                }else if(init.defaultChecked&&init.defaultChecked==true){
                    checkedBox.checked=true
                    checkedArr.push(baseData)
                }else{
                    if(node.checked){
                        checkedBox.checked=true
                        checkedArr.push(baseData)
                    }
                    if(showList) {
                        checkedBox.checked=true
                        checkedArr.push(baseData)
                    }
                }
                checkedBox[random+'checked']=random+'checked'
                checkedBox.addEventListener('change',function (e){
                    if(e.target.checked){
                        let arr=[...checkedArr]
                        arr.push({
                            id:e.target.parentNode.nodeId,
                            name:e.target.parentNode.name,
                            pid:e.target.parentNode.pid,
                            showList:e.target.parentNode.showList,
                            type:e.target.parentNode.nodeTyper,
                            checked:e.target.parentNode.checked
                        })
                        checkedArr=[...new Set(arr)]
                        modifyCheckedFoo(e.target.parentNode.children,true)
                    }else {
                        for(let i=0;i<checkedArr.length;i++){
                            if(checkedArr[i].id==e.target.parentNode.nodeId) {
                                checkedArr.splice(i, 1)
                                modifyCheckedFoo(e.target.parentNode.children,false)
                            }
                        }
                    }
                    init.checkedListener(checkedArr)
                })
            }else {
                checkedBox.style='display:none;'
            }
            node.appendChild(checkedBox)
            node.appendChild(textContent)
            root.appendChild(node)
            if(allowDrag) node.setAttribute('draggable',true)
            if(crud) fCrud(node)
        }
    }
}
let arrO=[]
let arrC=[]
// 模糊搜索函数
function fooFuzzSearch(value,tree,root,showList){
    if(value=='') {
        root.innerHTML=''
        fooCreateNodeTree(tree,root,showList)
        return
    }
    arrO=[]
    arrC=[]
    foo(value,tree)
    let arr=[]
    root.innerHTML=''
    if(arrO.length!==0&&arrC.length!==0){
        for(let ix=0;ix<arrC.length;ix++){
            for(let i=0;i<arrO.length;i++){
                for(let is=0;is<arrO[i].children.length;is++){
                    if(arrC[ix]&&arrO[i].children[is]==arrC[ix]){
                        arrC.splice(ix,1)
                    }
                }
            }
        }
        arr=arrO.concat(arrC)
        fooCreateNodeTree(arr,root,showList)
    }else if(arrC.length!==0){
        fooCreateNodeTree(arrC,root,showList)
    }else if(arrO.length!==0){
        fooCreateNodeTree(arrO,root,showList)
    }
}
// 返回模糊搜索结果
function foo(value,tree){
    for(let i=0;i<tree.length;i++){
        if(tree[i].children!=null && tree[i].children.length!==0){
            foo(value,tree[i].children)
            if(tree[i].name!=null && tree[i].name.indexOf(value)>-1) {
                arrO.push(tree[i])
            }
        }else {
            if(tree[i].name!=null && tree[i].name.indexOf(value)>-1) {
                arrC.push(tree[i])
            }
        }
    }
}
function modifyCheckedFoo(targetNode,boolean){
    if(init.crud==true&&targetNode.length>4){
        for(let i=4;i<targetNode.length;i++){
            let baseData={
                id:targetNode[i].nodeId,
                name:targetNode[i].name,
                pid:targetNode[i].pid,
                showList:targetNode[i].showList,
                type:targetNode[i].nodeTyper,
                checked:targetNode[i].checked
            }
            let foundChecked=foundRightNode(random+'checked',targetNode[i].children,random+'checked')
            if(boolean){
                foundChecked.checked=boolean
                let dontPush=true
                for(let ix=0;ix<checkedArr.length;ix++){
                    if(checkedArr[ix].id==targetNode[i].nodeId) {
                        dontPush=false
                        break
                    }
                }
                if(dontPush)checkedArr.push(baseData)
            }else {
                foundChecked.checked=boolean
                for(let ix=0;ix<checkedArr.length;ix++){
                    if(targetNode[i].nodeId==checkedArr[ix].id) checkedArr.splice(ix, 1)
                }
            }
        if(targetNode[i].children.length>4) modifyCheckedFoo(targetNode[i].children,boolean)
        }
    }else if(init.crud==false&&targetNode.length>3){
        for(let i=3;i<targetNode.length;i++){
            let baseData={
                id:targetNode[i].nodeId,
                name:targetNode[i].name,
                pid:targetNode[i].pid,
                showList:targetNode[i].showList,
                type:targetNode[i].nodeTyper,
                checked:targetNode[i].checked
            }
            let foundChecked=foundRightNode(random+'checked',targetNode[i].children,random+'checked')
            if(boolean){
                foundChecked.checked=boolean
                let dontPush=true
                for(let ix=0;ix<checkedArr.length;ix++){
                    if(checkedArr[ix].id==targetNode[i].nodeId) {
                        dontPush=false
                        break
                    }
                }
                if(dontPush)checkedArr.push(baseData)
            }else {
                foundChecked.checked=boolean
                for(let ix=0;ix<checkedArr.length;ix++){
                    if(targetNode[i].nodeId==checkedArr[ix].id) checkedArr.splice(ix, 1)
                }
            }
            if(targetNode[i].children.length>3) modifyCheckedFoo(targetNode[i].children,boolean)
        }
    }
    let arr=[...checkedArr]
    checkedArr=[...new Set(arr)]
}
function cutDatafoo(func,treeData,id,name){
    if(func=='del'){
        for(let i=0;i<treeData.length;i++){
            if(treeData[i].children.length!==0){
                if(treeData[i].id==id){
                    treeData.splice(i,1)
                    return
                }
                cutDatafoo(func,treeData[i].children,id,name)
            }else {
                if(treeData[i].id==id){
                    treeData.splice(i,1)
                }
            }
        }
    }else if(func=='add'){
        for(let i=0;i<treeData.length;i++){
            if(treeData[i].children.length!==0){
                if(treeData[i].id==id){
                    let obj={
                        "id": "",
                        "name": name,
                        "title": name,
                        "pid": "",
                        "appId": "",
                        "data": {
                            "resourceIcon": "",
                            "isValid": "Y",
                            "url": "",
                            "resourceValue": "upms:position:update",
                            "resourceType": "BUTTON"
                        },
                        "children": []
                    }
                    treeData[i].children.push(obj)
                    return
                }
                cutDatafoo(func,treeData[i].children,id,name)
            }else {
                if(treeData[i].id==id){
                    let obj={
                        "id": "",
                        "name": name,
                        "title": name,
                        "pid": "",
                        "appId": "",
                        "data": {
                        "resourceIcon": "",
                            "isValid": "Y",
                            "url": "",
                            "resourceValue": "upms:position:update",
                            "resourceType": "BUTTON"
                    },
                        "children": []
                    }
                    treeData[i].children.push(obj)
                }
            }
        }
    }else  if(func=='drag'){
    }else if(func=='modify'){
        for(let i=0;i<treeData.length;i++){
            if(treeData[i].children.length!==0){
                if(treeData[i].id==id){
                    treeData[i].name=name
                    return
                }
                cutDatafoo(func,treeData[i].children,id,name)
            }else {
                if(treeData[i].id==id){
                    treeData[i].name=name
                }
            }
        }
    }
}
function closeTreeBox (clear){treeBox.style.display='none'}
//找节点
function foundRightNode(foundType,nodeList,targetName){
    for(let i=0;i<nodeList.length;i++){
        if(nodeList[i][foundType]==targetName) {
            return nodeList[i]
        }
    }
}