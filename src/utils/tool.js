// 一维数组处理为JSON格式
export function arrayToJson(arr) {
  let treeArr = [].concat(arr)
  let r = []
  let tmpMap = {}

  treeArr.forEach((item) => {
    tmpMap[item.code] = item
  })
  treeArr.forEach(item => {
    if (item.parentCode === item.code) {
      let parent = tmpMap[item.parentCode];
      r.push(parent);
    } else {
      let parent = tmpMap[item.parentCode];
  
      // console.log('----------------')
      // console.log(parent)
      if (parent) {
        if (!parent['children']) {
          parent['children'] = []
        }
        parent.children.push(item)
      }
    }
    // if (parent.code !== parent.parentCode) {
    //   if (!parent['children']) {
    //     parent['children'] = [];
    //   }
    //   parent['children'].push(item);
    // } else {
    //   r.push(parent);
    // }
    // const obj = Object.assign({}, item);
    // let key = Object.assign({}, tmpMap[obj.parentCode]);
    // if (key) {
    //   if (!key['children']) {
    //     key['children'] = []
    //     key['children'].push(obj)
    //   } else {
    //     key['children'].push(obj)
    //   }
    // } else {
    //   r.push(obj)
    // }
  })
  console.log(r)
  return r
}

export function filterArray(data, parentCode) {
  var tree = [];
  var temp;
  for (var i = 0; i < data.length; i++) {
    if (data[i].parentCode === parentCode) {
      var obj = data[i];
      temp = filterArray(data, data[i].code);
      if (temp.length > 0) {
        obj.children = temp;
      }
      tree.push(obj);
    }
  }
  return tree;
}