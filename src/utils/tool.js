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
  })
  console.log(r)
  return r
}

/**
 * 格式化时间 格式(YYYY-MM-DD hh:mm:ss)
 */
export function formatDate(val) {
  const time = new Date(val);
  const YYYY = time.getFullYear();
  const MM = time.getMonth() > 9 ? time.getMonth() + 1 : `0${time.getMonth() + 1}`;
  const DD = time.getDate() > 10 ? time.getDate() : `0${time.getDate()}`;

  const hh = time.getHours() > 10 ? time.getHours() : `0${time.getHours()}`;
  const mm = time.getMinutes() > 10 ? time.getMinutes() : `0${time.getMinutes()}`;
  const ss = time.getSeconds() > 10 ? time.getSeconds() : `0${time.getSeconds()}`;
  return `${YYYY}-${MM}-${DD} ${hh}:${mm}:${ss}`;
}