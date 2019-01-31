// 一维数组处理为JSON格式
export function arrayToJson(treeArr, idName, parentName) {
  let r = []
  let tmpMap = {}
  treeArr.forEach((item, index) => {
    tmpMap[item.code] = item
  })
  treeArr.forEach((item, index) => {
    let key = tmpMap[item.parentCode]
    if (key) {
      if (!key['children']) {
        key['children'] = []
        key['children'].push(item)
      } else {
        key['children'].push(item)
      }
    } else {
      r.push(item)
    }
  })
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